import * as fs from "fs";
import * as path from "path";
import { execSync, spawnSync } from "child_process";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

// ── Types ─────────────────────────────────────────────────────────────────────

interface WordTimestamp { word: string; startTime: number; endTime: number; }

interface SlideCue {
  text: string; startTime: number; endTime: number;
  slideType: "title" | "concept" | "point" | "example" | "summary";
  words: WordTimestamp[];
}

interface InputProps extends Record<string, unknown> {
  lessonTitle: string; courseName: string; avatarSrc: string; cues: SlideCue[];
}

interface ManifestEntry {
  courseSlug: string; courseTitle: string; lessonIndex: number;
  lessonTitle: string; lessonType: string;
  avatarId: string; avatarName: string; voiceId: string; videoScript: string;
}

interface WhisperWord  { word: string; start: number; end: number; }
interface WhisperSegment { start: number; end: number; text: string; words?: WhisperWord[]; }
interface WhisperResult  { text: string; segments: WhisperSegment[]; }

// ── Env ───────────────────────────────────────────────────────────────────────

function loadEnv(): void {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim();
    if (k && !(k in process.env)) process.env[k] = v;
  }
}

// ── Tool discovery ────────────────────────────────────────────────────────────

function findPython(): string {
  for (const p of ["C:\\Python314\\python.exe","C:\\Python313\\python.exe","C:\\Python312\\python.exe","python","python3"]) {
    const r = spawnSync(p, ["--version"], { encoding: "utf-8", timeout: 5000 });
    if (r.status === 0) return p;
  }
  throw new Error("Python not found");
}

function findFfmpeg(): string {
  const base = `${process.env.USERPROFILE}\\AppData\\Local\\Microsoft\\WinGet\\Packages`;
  const builds = ["ffmpeg-8.1.1-full_build","ffmpeg-8.0.2-full_build","ffmpeg-7.1.1-full_build"];
  const candidates = [
    "ffmpeg",
    "C:\\ffmpeg\\bin\\ffmpeg.exe",
    ...builds.map((b) => `${base}\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\${b}\\bin\\ffmpeg.exe`),
  ];
  for (const ff of candidates) {
    const r = spawnSync(ff, ["-version"], { encoding: "utf-8", timeout: 5000 });
    if (r.status === 0) return ff;
  }
  throw new Error("ffmpeg not found");
}

// ── Whisper ───────────────────────────────────────────────────────────────────

function extractAudio(ffmpeg: string, videoPath: string, wavPath: string): void {
  if (fs.existsSync(wavPath)) return;
  const r = spawnSync(ffmpeg, ["-i", videoPath, "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", wavPath, "-y"],
    { encoding: "utf-8", timeout: 120_000 });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${r.stderr}`);
}

function runWhisper(python: string, ffmpegBin: string, wavPath: string, outDir: string): WhisperResult {
  const base = path.basename(wavPath, ".wav");
  const jsonOut = path.join(outDir, `${base}.json`);
  if (fs.existsSync(jsonOut)) return JSON.parse(fs.readFileSync(jsonOut, "utf-8")) as WhisperResult;

  const env = { ...process.env, PATH: `${ffmpegBin};${process.env.PATH ?? ""}` };
  const r = spawnSync(python,
    ["-m", "whisper", wavPath, "--output_format", "json", "--word_timestamps", "True", "--model", "base", "--output_dir", outDir],
    { encoding: "utf-8", timeout: 300_000, env });

  if (r.status !== 0) throw new Error(`Whisper failed:\n${r.stderr || r.stdout}`);

  if (!fs.existsSync(jsonOut)) {
    const alt = path.join(path.dirname(wavPath), `${base}.json`);
    if (fs.existsSync(alt)) fs.renameSync(alt, jsonOut);
    else throw new Error(`Whisper output not found at ${jsonOut}`);
  }
  return JSON.parse(fs.readFileSync(jsonOut, "utf-8")) as WhisperResult;
}

// ── Cue parsing ───────────────────────────────────────────────────────────────

const CONTENT_TYPES: SlideCue["slideType"][] = ["concept", "point", "example"];

function parseCues(whisper: WhisperResult): SlideCue[] {
  const allWords: WhisperWord[] = [];
  for (const seg of whisper.segments) {
    for (const w of seg.words ?? []) {
      const cleaned = w.word.trim();
      if (cleaned) allWords.push({ word: cleaned, start: w.start, end: w.end });
    }
  }

  if (allWords.length === 0) {
    return whisper.segments.map((s, i) => ({
      text: s.text.trim(), startTime: s.start, endTime: s.end,
      slideType: i === 0 ? "title" : i >= whisper.segments.length - 2 ? "summary" : CONTENT_TYPES[(i - 1) % 3],
      words: [],
    }));
  }

  const sentences: WhisperWord[][] = [];
  let current: WhisperWord[] = [];
  for (const w of allWords) {
    current.push(w);
    if (/[.!?]$/.test(w.word)) { sentences.push([...current]); current = []; }
  }
  if (current.length > 0) sentences.push(current);

  return sentences.map((s, i) => ({
    text: s.map((w) => w.word).join(" "),
    startTime: s[0].start,
    endTime: s[s.length - 1].end,
    slideType: i === 0 ? "title" : i >= sentences.length - 2 ? "summary" : CONTENT_TYPES[(i - 1) % 3],
    words: s.map((w) => ({ word: w.word, startTime: w.start, endTime: w.end })),
  }));
}

// ── Remotion ──────────────────────────────────────────────────────────────────

async function renderLesson(
  bundleUrl: string,
  entry: ManifestEntry,
  cues: SlideCue[],
  outPath: string
): Promise<void> {
  const inputProps: InputProps = {
    lessonTitle: entry.lessonTitle,
    courseName: entry.courseTitle,
    avatarSrc: `avatars/${entry.courseSlug}/lesson-${entry.lessonIndex}-${entry.avatarName}.mp4`,
    cues,
  };

  const composition = await selectComposition({ serveUrl: bundleUrl, id: "LessonVideo", inputProps });
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  await renderMedia({
    composition, serveUrl: bundleUrl, codec: "h264",
    outputLocation: outPath, inputProps,
    onProgress: ({ progress }) => {
      process.stdout.write(`\r    Render: ${Math.round(progress * 100)}%`);
    },
  });
  process.stdout.write("\n");
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  loadEnv();

  const manifestPath = path.join(process.cwd(), "scripts", "video-manifest-full.json");
  if (!fs.existsSync(manifestPath)) throw new Error("Run npm run build:manifest first");
  const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

  const python  = findPython();
  const ffmpeg  = findFfmpeg();
  const ffmpegBin = path.dirname(ffmpeg);

  // Verify whisper
  const wc = spawnSync(python, ["-c", "import whisper"], { encoding: "utf-8", timeout: 10_000 });
  if (wc.status !== 0) {
    execSync(`"${python}" -m pip install openai-whisper --quiet`, { stdio: "inherit", timeout: 300_000 });
  }

  // Identify which avatar videos are ready
  const readySet = new Set<string>();
  const missingAvatars: string[] = [];
  for (const e of manifest) {
    const p = path.join(process.cwd(), "public", "avatars", e.courseSlug, `lesson-${e.lessonIndex}-${e.avatarName}.mp4`);
    if (fs.existsSync(p)) readySet.add(`${e.courseSlug}::${e.lessonIndex}`);
    else missingAvatars.push(`${e.courseSlug} L${e.lessonIndex}`);
  }
  console.log(`Avatar videos ready: ${readySet.size}/${manifest.length}`);
  if (missingAvatars.length > 0) {
    console.log(`Skipping ${missingAvatars.length} lessons with missing avatars (run generate:all-avatars to get them).`);
  }

  console.log(`\nBundling Remotion...`);
  const bundleUrl = await bundle({
    entryPoint: path.join(process.cwd(), "remotion", "Root.tsx"),
    webpackOverride: (cfg) => cfg,
  });
  console.log("Bundle complete.\n");

  let done = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const entry of manifest) {
    const outPath = path.join(process.cwd(), "public", "videos", entry.courseSlug, `lesson-${entry.lessonIndex}.mp4`);
    const label = `${entry.courseSlug} L${entry.lessonIndex} (${entry.avatarName})`;

    if (!readySet.has(`${entry.courseSlug}::${entry.lessonIndex}`)) {
      console.log(`  [WAIT] ${label} — avatar not yet downloaded`);
      skipped++;
      continue;
    }

    if (fs.existsSync(outPath)) {
      console.log(`  [SKIP] ${label} — already rendered`);
      skipped++;
      continue;
    }

    console.log(`\n[${done + skipped + 1}/${manifest.length}] ${label}: ${entry.lessonTitle}`);

    try {
      const avatarPath = path.join(process.cwd(), "public", "avatars", entry.courseSlug, `lesson-${entry.lessonIndex}-${entry.avatarName}.mp4`);
      const audioDir   = path.join(process.cwd(), "public", "audio", entry.courseSlug);
      fs.mkdirSync(audioDir, { recursive: true });

      const wavPath = path.join(audioDir, `lesson-${entry.lessonIndex}.wav`);
      process.stdout.write("  Extracting audio... ");
      extractAudio(ffmpeg, avatarPath, wavPath);
      console.log("done");

      process.stdout.write("  Running Whisper... ");
      const whisperResult = runWhisper(python, ffmpegBin, wavPath, audioDir);
      const cues = parseCues(whisperResult);
      console.log(`${cues.length} cues`);

      // Save cues
      const cuesPath = path.join(process.cwd(), "public", "avatars", entry.courseSlug, `lesson-${entry.lessonIndex}-cues.json`);
      fs.mkdirSync(path.dirname(cuesPath), { recursive: true });
      fs.writeFileSync(cuesPath, JSON.stringify(cues, null, 2));

      await renderLesson(bundleUrl, entry, cues, outPath);
      const mb = (fs.statSync(outPath).size / 1_048_576).toFixed(1);
      console.log(`  Saved: ${path.relative(process.cwd(), outPath)} (${mb} MB)`);
      done++;
    } catch (err) {
      const msg = `${label}: ${err instanceof Error ? err.message : String(err)}`;
      console.error(`  ERROR: ${msg}`);
      errors.push(msg);
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Rendered: ${done} | Skipped: ${skipped} | Errors: ${errors.length} | Total: ${manifest.length}`);
  if (errors.length > 0) {
    console.log("\nErrors:");
    for (const e of errors) console.log(`  ${e}`);
  }
}

main().catch((err) => {
  console.error("\nFatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});

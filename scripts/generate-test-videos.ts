import * as fs from "fs";
import * as path from "path";
import { execSync, spawnSync } from "child_process";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

// ── Types ─────────────────────────────────────────────────────────────────────

interface WordTimestamp {
  word: string;
  startTime: number;
  endTime: number;
}

interface SlideCue {
  text: string;
  startTime: number;
  endTime: number;
  slideType: "title" | "concept" | "point" | "example" | "summary";
  words: WordTimestamp[];
}

interface InputProps extends Record<string, unknown> {
  lessonTitle: string;
  courseName: string;
  avatarSrc: string;
  cues: SlideCue[];
}

interface ManifestEntry {
  courseSlug: string;
  lessonIndex: number;
  lessonTitle: string;
  avatarId: string;
  avatarName: string;
  videoScript: string;
}

interface WhisperWord {
  word: string;
  start: number;
  end: number;
}

interface WhisperSegment {
  start: number;
  end: number;
  text: string;
  words?: WhisperWord[];
}

interface WhisperResult {
  text: string;
  segments: WhisperSegment[];
}

// ── Env loader ────────────────────────────────────────────────────────────────

function loadEnvLocal(): void {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf-8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (key && !(key in process.env)) process.env[key] = val;
  }
}

// ── Whisper helpers ───────────────────────────────────────────────────────────

function findPython(): string {
  const candidates = [
    "C:\\Python314\\python.exe",
    "C:\\Python313\\python.exe",
    "C:\\Python312\\python.exe",
    "C:\\Python311\\python.exe",
    "python",
    "python3",
  ];
  for (const p of candidates) {
    try {
      const res = spawnSync(p, ["--version"], { encoding: "utf-8", timeout: 5000 });
      if (res.status === 0) {
        console.log(`  Python: ${res.stdout.trim() || res.stderr.trim()} at ${p}`);
        return p;
      }
    } catch {
      // keep looking
    }
  }
  throw new Error("Python not found — please install Python 3.11+");
}

function findFfmpeg(): string {
  const wingetBase = `${process.env.USERPROFILE}\\AppData\\Local\\Microsoft\\WinGet\\Packages`;
  const gyanBuilds = ["ffmpeg-8.1.1-full_build", "ffmpeg-8.0.2-full_build", "ffmpeg-7.1.1-full_build"];
  const candidates = [
    "ffmpeg",
    "C:\\ffmpeg\\bin\\ffmpeg.exe",
    ...gyanBuilds.map(
      (build) =>
        `${wingetBase}\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\${build}\\bin\\ffmpeg.exe`
    ),
  ];
  for (const ff of candidates) {
    try {
      const res = spawnSync(ff, ["-version"], { encoding: "utf-8", timeout: 5000 });
      if (res.status === 0) {
        console.log(`  ffmpeg found: ${ff}`);
        return ff;
      }
    } catch {
      // keep looking
    }
  }
  throw new Error("ffmpeg not found — run: winget install ffmpeg");
}

function extractAudio(ffmpeg: string, videoPath: string, wavPath: string): void {
  if (fs.existsSync(wavPath)) {
    console.log(`  WAV already exists: ${path.basename(wavPath)}`);
    return;
  }
  console.log(`  Extracting audio from ${path.basename(videoPath)}...`);
  const args = ["-i", videoPath, "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", wavPath, "-y"];
  const res = spawnSync(ffmpeg, args, { encoding: "utf-8", timeout: 120_000 });
  if (res.status !== 0) throw new Error(`ffmpeg failed: ${res.stderr}`);
  console.log(`  WAV saved: ${wavPath}`);
}

function runWhisper(python: string, wavPath: string, outDir: string): WhisperResult {
  const baseName = path.basename(wavPath, ".wav");
  const jsonOut = path.join(outDir, `${baseName}.json`);

  if (fs.existsSync(jsonOut)) {
    console.log(`  Whisper JSON already exists: ${path.basename(jsonOut)}`);
    return JSON.parse(fs.readFileSync(jsonOut, "utf-8")) as WhisperResult;
  }

  console.log(`  Running Whisper on ${path.basename(wavPath)} (this may take 30-90s)...`);
  const args = [
    "-m", "whisper",
    wavPath,
    "--output_format", "json",
    "--word_timestamps", "True",
    "--model", "base",
    "--output_dir", outDir,
  ];
  const res = spawnSync(python, args, { encoding: "utf-8", timeout: 300_000 });
  if (res.status !== 0) {
    throw new Error(`Whisper failed:\n${res.stderr || res.stdout}`);
  }

  if (!fs.existsSync(jsonOut)) {
    throw new Error(`Whisper ran but output JSON not found at: ${jsonOut}`);
  }

  return JSON.parse(fs.readFileSync(jsonOut, "utf-8")) as WhisperResult;
}

// ── Cue parsing ───────────────────────────────────────────────────────────────

const CONTENT_TYPES: Array<SlideCue["slideType"]> = ["concept", "point", "example"];

function parseCuesFromWhisper(whisper: WhisperResult): SlideCue[] {
  const allWords: WhisperWord[] = [];
  for (const seg of whisper.segments) {
    if (seg.words && seg.words.length > 0) {
      for (const w of seg.words) {
        const cleaned = w.word.trim();
        if (cleaned) allWords.push({ word: cleaned, start: w.start, end: w.end });
      }
    }
  }

  if (allWords.length === 0) {
    // Fallback: segment-level, no word timestamps
    const sentences: SlideCue[] = whisper.segments.map((seg, i) => {
      const type: SlideCue["slideType"] =
        i === 0 ? "title" : i >= whisper.segments.length - 2 ? "summary" : CONTENT_TYPES[(i - 1) % 3];
      return { text: seg.text.trim(), startTime: seg.start, endTime: seg.end, slideType: type, words: [] };
    });
    return sentences;
  }

  // Group words into sentences by punctuation
  type SentenceAcc = { words: WhisperWord[] };
  const sentences: SentenceAcc[] = [];
  let current: WhisperWord[] = [];

  for (const w of allWords) {
    current.push(w);
    if (/[.!?]$/.test(w.word)) {
      sentences.push({ words: [...current] });
      current = [];
    }
  }
  if (current.length > 0) sentences.push({ words: current });

  return sentences.map((s, i) => {
    const type: SlideCue["slideType"] =
      i === 0 ? "title" : i >= sentences.length - 2 ? "summary" : CONTENT_TYPES[(i - 1) % 3];
    return {
      text: s.words.map((w) => w.word).join(" "),
      startTime: s.words[0].start,
      endTime: s.words[s.words.length - 1].end,
      slideType: type,
      words: s.words.map((w) => ({ word: w.word, startTime: w.start, endTime: w.end })),
    };
  });
}

// ── Remotion render ───────────────────────────────────────────────────────────

async function renderLesson(
  bundled: string,
  entry: ManifestEntry,
  cues: SlideCue[],
  outPath: string
): Promise<void> {
  const inputProps: InputProps = {
    lessonTitle: entry.lessonTitle,
    courseName: entry.courseSlug,
    avatarSrc: `avatars/${entry.courseSlug}/lesson-${entry.lessonIndex}-${entry.avatarName}.mp4`,
    cues,
  };

  console.log(`  Selecting composition LessonVideo...`);
  const composition = await selectComposition({
    serveUrl: bundled,
    id: "LessonVideo",
    inputProps,
  });

  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  console.log(`  Rendering ${entry.lessonTitle} (${composition.durationInFrames} frames at 30fps)...`);
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: outPath,
    inputProps,
    onProgress: ({ progress }) => {
      process.stdout.write(`\r  Progress: ${Math.round(progress * 100)}%`);
    },
  });
  process.stdout.write("\n");

  const mb = (fs.statSync(outPath).size / 1_048_576).toFixed(1);
  console.log(`  Saved: ${path.relative(process.cwd(), outPath)} (${mb} MB)`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  loadEnvLocal();

  const manifest: ManifestEntry[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "scripts", "video-manifest.json"), "utf-8")
  );

  const python = findPython();
  const ffmpeg = findFfmpeg();

  // Install openai-whisper if not already installed
  const whisperCheck = spawnSync(python, ["-c", "import whisper"], { encoding: "utf-8", timeout: 10_000 });
  if (whisperCheck.status !== 0) {
    console.log("Installing openai-whisper...");
    execSync(`"${python}" -m pip install openai-whisper --quiet`, { stdio: "inherit", timeout: 300_000 });
  } else {
    console.log("openai-whisper already installed.");
  }

  // Check all avatar videos exist before starting
  for (const entry of manifest) {
    const avatarPath = path.join(
      process.cwd(), "public", "avatars", entry.courseSlug,
      `lesson-${entry.lessonIndex}-${entry.avatarName}.mp4`
    );
    if (!fs.existsSync(avatarPath)) {
      throw new Error(
        `Avatar video not found: ${avatarPath}\nRun: npm run generate:heygen first`
      );
    }
  }

  console.log("\nBundling Remotion composition...");
  const bundled = await bundle({
    entryPoint: path.join(process.cwd(), "remotion", "Root.tsx"),
    webpackOverride: (cfg) => cfg,
  });
  console.log("Bundle complete.");

  for (const entry of manifest) {
    console.log(`\n=== ${entry.avatarName.toUpperCase()} — ${entry.courseSlug} lesson ${entry.lessonIndex} ===`);

    const avatarPath = path.join(
      process.cwd(), "public", "avatars", entry.courseSlug,
      `lesson-${entry.lessonIndex}-${entry.avatarName}.mp4`
    );
    const audioDir = path.join(process.cwd(), "public", "audio", entry.courseSlug);
    fs.mkdirSync(audioDir, { recursive: true });

    const wavPath = path.join(audioDir, `lesson-${entry.lessonIndex}.wav`);
    extractAudio(ffmpeg, avatarPath, wavPath);

    const whisperResult = runWhisper(python, wavPath, audioDir);
    const cues = parseCuesFromWhisper(whisperResult);
    console.log(`  Parsed ${cues.length} slide cues`);

    // Save cues for inspection
    const cuesPath = path.join(audioDir, `lesson-${entry.lessonIndex}-cues-whisper.json`);
    fs.writeFileSync(cuesPath, JSON.stringify(cues, null, 2));
    console.log(`  Cues saved: ${path.relative(process.cwd(), cuesPath)}`);

    const outPath = path.join(
      process.cwd(), "public", "videos", "test",
      `${entry.courseSlug}-lesson-${entry.lessonIndex}-${entry.avatarName}.mp4`
    );

    if (fs.existsSync(outPath)) {
      console.log(`  Output already exists — skipping render (delete to re-render)`);
    } else {
      await renderLesson(bundled, entry, cues, outPath);
    }

    console.log(`  Done: ${path.relative(process.cwd(), outPath)}`);
  }

  console.log("\nAll test videos complete.");
  console.log("\nSummary:");
  for (const entry of manifest) {
    const outPath = path.join(
      process.cwd(), "public", "videos", "test",
      `${entry.courseSlug}-lesson-${entry.lessonIndex}-${entry.avatarName}.mp4`
    );
    if (fs.existsSync(outPath)) {
      const mb = (fs.statSync(outPath).size / 1_048_576).toFixed(1);
      console.log(`  ${entry.avatarName}: ${path.relative(process.cwd(), outPath)} (${mb} MB)`);
    }
  }
}

main().catch((err) => {
  console.error("\nFatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});

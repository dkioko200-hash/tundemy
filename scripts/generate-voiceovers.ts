import * as fs from "fs";
import * as path from "path";

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

loadEnvLocal();

interface ManifestEntry {
  courseSlug: string;
  lessonIndex: number;
  lessonTitle: string;
  videoScript: string;
  keyPoints: string[];
}

interface AudioMeta {
  [key: string]: { duration: number; path: string; generatedAt: string };
}

const VOICE_ID = "J8pcILkXYAnIuFEemVnW";
const ELEVENLABS_API = "https://api.elevenlabs.io/v1/text-to-speech";
const META_FILE = path.join(process.cwd(), "scripts", "audio-meta.json");

async function getDurationSeconds(filePath: string): Promise<number> {
  const { parseFile } = await import("music-metadata");
  const meta = await parseFile(filePath);
  return meta.format.duration ?? 0;
}

async function loadAudioMeta(): Promise<AudioMeta> {
  if (!fs.existsSync(META_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(META_FILE, "utf-8")); } catch { return {}; }
}

async function processEntry(entry: ManifestEntry, meta: AudioMeta): Promise<void> {
  const outDir = path.join(process.cwd(), "public", "audio", entry.courseSlug);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `lesson-${entry.lessonIndex}.mp3`);
  const key = `${entry.courseSlug}-${entry.lessonIndex}`;

  if (!fs.existsSync(outPath)) {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) throw new Error("Missing ELEVENLABS_API_KEY in .env.local");

    console.log(`Generating audio for ${entry.courseSlug} lesson ${entry.lessonIndex}...`);
    const res = await fetch(`${ELEVENLABS_API}/${VOICE_ID}`, {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({
        text: entry.videoScript,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3 },
      }),
    });
    if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
    fs.writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
    const mb = (fs.statSync(outPath).size / 1_048_576).toFixed(2);
    console.log(`  Saved ${mb} MB → ${path.relative(process.cwd(), outPath)}`);
  } else {
    console.log(`  MP3 already exists — skipping generation for ${key}`);
  }

  const duration = await getDurationSeconds(outPath);
  console.log(`  Duration: ${duration.toFixed(2)}s`);
  meta[key] = { duration, path: path.relative(process.cwd(), outPath).replace(/\\/g, "/"), generatedAt: new Date().toISOString() };
}

async function main(): Promise<void> {
  const manifest: ManifestEntry[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "scripts", "video-manifest.json"), "utf-8")
  );
  const meta = await loadAudioMeta();

  for (const entry of manifest) {
    await processEntry(entry, meta);
  }

  fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2));
  console.log(`\nAudio meta saved → ${path.relative(process.cwd(), META_FILE)}`);
}

main().catch((err) => { console.error("Fatal:", err instanceof Error ? err.message : err); process.exit(1); });

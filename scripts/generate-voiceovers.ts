import * as fs from "fs";
import * as path from "path";

// ── Load .env.local ───────────────────────────────────────────────────────────

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

// ── Types ──────────────────────────────────────────────────────────────────────

interface ManifestEntry {
  courseSlug: string;
  lessonIndex: number;
  lessonTitle: string;
  videoScript: string;
  keyPoints: string[];
}

// ── Main ───────────────────────────────────────────────────────────────────────

const VOICE_ID = "J8pcILkXYAnIuFEemVnW";
const ELEVENLABS_API = "https://api.elevenlabs.io/v1/text-to-speech";

async function generateAudio(entry: ManifestEntry): Promise<void> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("Missing ELEVENLABS_API_KEY in .env.local");

  console.log(`Generating audio for ${entry.courseSlug} lesson ${entry.lessonIndex}...`);

  const response = await fetch(`${ELEVENLABS_API}/${VOICE_ID}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: entry.videoScript,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.3,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs error ${response.status}: ${errText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const outDir = path.join(process.cwd(), "public", "audio", entry.courseSlug);
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, `lesson-${entry.lessonIndex}.mp3`);
  fs.writeFileSync(outPath, Buffer.from(arrayBuffer));

  const sizeMB = (fs.statSync(outPath).size / 1_048_576).toFixed(2);
  console.log(`  Saved ${sizeMB} MB → ${path.relative(process.cwd(), outPath)}`);
}

async function main(): Promise<void> {
  const manifestPath = path.join(process.cwd(), "scripts", "video-manifest.json");
  const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

  for (const entry of manifest) {
    await generateAudio(entry);
  }

  console.log("Audio generation complete.");
}

main().catch((err) => {
  console.error("Fatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});

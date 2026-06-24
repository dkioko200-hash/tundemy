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

export interface SlideCue {
  text: string;
  startTime: number;
  endTime: number;
  slideType: "title" | "concept" | "point" | "summary";
}

interface ElevenLabsAlignment {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

interface ElevenLabsTimestampResponse {
  audio_base64: string;
  alignment: ElevenLabsAlignment;
  normalized_alignment: ElevenLabsAlignment;
}

interface SavedTimestamps {
  alignment: ElevenLabsAlignment;
  normalized_alignment: ElevenLabsAlignment;
}

const VOICE_ID = "J8pcILkXYAnIuFEemVnW";
const ELEVENLABS_API = "https://api.elevenlabs.io/v1/text-to-speech";

function splitSentences(text: string): string[] {
  const parts = text.match(/[^.!?]+[.!?]+/g) ?? [];
  return parts.map((s) => s.trim()).filter(Boolean);
}

function parseCues(scriptText: string, alignment: ElevenLabsAlignment): SlideCue[] {
  const sentences = splitSentences(scriptText);
  const { character_start_times_seconds: charStarts, character_end_times_seconds: charEnds } = alignment;
  const cues: SlideCue[] = [];
  let searchFrom = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const charIdx = scriptText.indexOf(sentence, searchFrom);
    if (charIdx === -1) {
      console.warn(`  Warning: could not locate sentence "${sentence.slice(0, 40)}…"`);
      continue;
    }

    const lastCharIdx = Math.min(charIdx + sentence.length - 1, charEnds.length - 1);
    const startTime = charStarts[Math.min(charIdx, charStarts.length - 1)] ?? 0;
    const endTime = charEnds[lastCharIdx] ?? startTime + 1;

    let slideType: SlideCue["slideType"];
    if (i === 0) {
      slideType = "title";
    } else if (i >= sentences.length - 2) {
      slideType = "summary";
    } else {
      slideType = i % 2 === 1 ? "concept" : "point";
    }

    cues.push({ text: sentence, startTime, endTime, slideType });
    searchFrom = charIdx + sentence.length;
  }

  return cues;
}

async function processEntry(entry: ManifestEntry): Promise<void> {
  const outDir = path.join(process.cwd(), "public", "audio", entry.courseSlug);
  fs.mkdirSync(outDir, { recursive: true });

  const mp3Path = path.join(outDir, `lesson-${entry.lessonIndex}.mp3`);
  const timestampsPath = path.join(outDir, `lesson-${entry.lessonIndex}-timestamps.json`);
  const cuesPath = path.join(outDir, `lesson-${entry.lessonIndex}-cues.json`);

  let saved: SavedTimestamps;

  if (fs.existsSync(mp3Path) && fs.existsSync(timestampsPath)) {
    console.log(`  MP3 + timestamps already exist — skipping ElevenLabs call`);
    saved = JSON.parse(fs.readFileSync(timestampsPath, "utf-8")) as SavedTimestamps;
  } else {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) throw new Error("Missing ELEVENLABS_API_KEY in .env.local");

    console.log(`Calling ElevenLabs /with-timestamps for ${entry.courseSlug} lesson ${entry.lessonIndex}...`);
    const res = await fetch(`${ELEVENLABS_API}/${VOICE_ID}/with-timestamps`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        text: entry.videoScript,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3 },
        output_format: "mp3_44100_128",
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`ElevenLabs ${res.status}: ${errText}`);
    }

    const data = (await res.json()) as ElevenLabsTimestampResponse;

    // Save MP3 from base64
    const audioBuffer = Buffer.from(data.audio_base64, "base64");
    fs.writeFileSync(mp3Path, audioBuffer);
    const mb = (audioBuffer.length / 1_048_576).toFixed(2);
    console.log(`  MP3 saved: ${mb} MB → ${path.relative(process.cwd(), mp3Path)}`);

    // Save timestamps without audio_base64 (too large)
    saved = { alignment: data.alignment, normalized_alignment: data.normalized_alignment };
    fs.writeFileSync(timestampsPath, JSON.stringify(saved, null, 2));
    console.log(`  Timestamps saved → ${path.relative(process.cwd(), timestampsPath)}`);
  }

  // Parse cues and save
  const cues = parseCues(entry.videoScript, saved.alignment);
  fs.writeFileSync(cuesPath, JSON.stringify(cues, null, 2));

  const lastCue = cues[cues.length - 1];
  console.log(`  ${cues.length} slide cues parsed`);
  console.log(`  Audio duration: ~${(lastCue?.endTime ?? 0).toFixed(2)}s`);
  console.log(`  Cues saved → ${path.relative(process.cwd(), cuesPath)}`);
  console.log();
}

async function main(): Promise<void> {
  const manifest: ManifestEntry[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "scripts", "video-manifest.json"), "utf-8")
  );

  for (const entry of manifest) {
    await processEntry(entry);
  }
}

main().catch((err) => {
  console.error("Fatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});

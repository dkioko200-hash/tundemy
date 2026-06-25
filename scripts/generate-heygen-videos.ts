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
  avatarId: string;
  avatarName: string;
  videoScript: string;
}

interface HeyGenGenerateResponse {
  code: number;
  data: { video_id: string };
  error: string | null;
}

interface HeyGenStatusResponse {
  code: number;
  data: {
    video_id: string;
    status: "pending" | "processing" | "completed" | "failed";
    video_url?: string;
    error?: string;
  };
  error: string | null;
}

const HEYGEN_API = "https://api.heygen.com";
const POLL_INTERVAL_MS = 30_000;
const MAX_POLLS = 20; // 10 minutes max

async function generateVideo(entry: ManifestEntry, apiKey: string): Promise<string> {
  console.log(`  Submitting HeyGen job for ${entry.avatarName} (${entry.courseSlug} lesson ${entry.lessonIndex})...`);

  const res = await fetch(`${HEYGEN_API}/v2/video/generate`, {
    method: "POST",
    headers: { "X-Api-Key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      video_inputs: [
        {
          character: { type: "avatar", avatar_id: entry.avatarId, avatar_style: "normal" },
          voice: { type: "text", input_text: entry.videoScript, speed: 0.9 },
          background: { type: "color", value: "#0f1f3d" },
        },
      ],
      dimension: { width: 480, height: 720 },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HeyGen generate ${res.status}: ${errText}`);
  }

  const data = (await res.json()) as HeyGenGenerateResponse;
  if (data.error) throw new Error(`HeyGen error: ${data.error}`);

  const videoId = data.data.video_id;
  console.log(`  Job submitted — video_id: ${videoId}`);
  return videoId;
}

async function pollForCompletion(videoId: string, apiKey: string): Promise<string> {
  for (let i = 0; i < MAX_POLLS; i++) {
    const elapsed = ((i + 1) * POLL_INTERVAL_MS) / 1000;
    console.log(`  Polling status (attempt ${i + 1}/${MAX_POLLS}, ${elapsed.toFixed(0)}s elapsed)...`);

    const res = await fetch(`${HEYGEN_API}/v1/video_status.get?video_id=${videoId}`, {
      headers: { "X-Api-Key": apiKey },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HeyGen status ${res.status}: ${errText}`);
    }

    const data = (await res.json()) as HeyGenStatusResponse;
    const { status, video_url, error } = data.data;

    if (status === "completed" && video_url) {
      console.log(`  Completed! Video URL: ${video_url.slice(0, 60)}...`);
      return video_url;
    }

    if (status === "failed") {
      throw new Error(`HeyGen video failed: ${error ?? "unknown error"}`);
    }

    console.log(`  Status: ${status} — waiting ${POLL_INTERVAL_MS / 1000}s...`);

    if (i < MAX_POLLS - 1) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }
  }

  throw new Error(`HeyGen video timed out after ${(MAX_POLLS * POLL_INTERVAL_MS) / 60_000} minutes`);
}

async function downloadVideo(url: string, outPath: string): Promise<void> {
  console.log(`  Downloading avatar video...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buf = await res.arrayBuffer();
  fs.writeFileSync(outPath, Buffer.from(buf));
  const mb = (fs.statSync(outPath).size / 1_048_576).toFixed(1);
  console.log(`  Saved: ${path.relative(process.cwd(), outPath)} (${mb} MB)`);
}

async function processEntry(entry: ManifestEntry, apiKey: string): Promise<void> {
  const outDir = path.join(process.cwd(), "public", "avatars", entry.courseSlug);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `lesson-${entry.lessonIndex}-${entry.avatarName}.mp4`);

  if (fs.existsSync(outPath)) {
    console.log(`  Already exists — skipping (${path.relative(process.cwd(), outPath)})`);
    return;
  }

  const videoId = await generateVideo(entry, apiKey);
  const videoUrl = await pollForCompletion(videoId, apiKey);
  await downloadVideo(videoUrl, outPath);
}

async function main(): Promise<void> {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) throw new Error("Missing HEYGEN_API_KEY in .env.local");

  const manifest: ManifestEntry[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "scripts", "video-manifest.json"), "utf-8")
  );

  for (const entry of manifest) {
    console.log(`\n=== ${entry.avatarName.toUpperCase()} — ${entry.courseSlug} lesson ${entry.lessonIndex} ===`);
    await processEntry(entry, apiKey);
  }

  console.log("\nAll HeyGen videos processed.");
}

main().catch((err) => {
  console.error("\nFatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});

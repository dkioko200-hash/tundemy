import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
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

async function main(): Promise<void> {
  const manifestPath = path.join(process.cwd(), "scripts", "video-manifest.json");
  const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  const entry = manifest[0];

  const outDir = path.join(process.cwd(), "public", "videos", entry.courseSlug);
  fs.mkdirSync(outDir, { recursive: true });
  const outputLocation = path.join(outDir, "lesson-0-new.mp4");

  console.log("Bundling Remotion composition...");
  const entryPoint = path.join(process.cwd(), "remotion", "Root.tsx");
  const publicPath = path.join(process.cwd(), "public");

  const serveUrl = await bundle({
    entryPoint,
    publicDir: publicPath,
    webpackOverride: (config) => config,
  });

  console.log("Selecting composition LessonVideo...");
  const inputProps = {
    lessonTitle: entry.lessonTitle,
    keyPoints: entry.keyPoints,
    audioSrc: `audio/${entry.courseSlug}/lesson-${entry.lessonIndex}.mp3`,
  };

  const composition = await selectComposition({
    serveUrl,
    id: "LessonVideo",
    inputProps,
  });

  console.log(`Rendering ${composition.durationInFrames} frames at ${composition.fps}fps...`);

  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation,
    inputProps,
    onProgress: ({ progress }) => {
      process.stdout.write(`\r  Encoding: ${(progress * 100).toFixed(1)}%`);
    },
  });

  process.stdout.write("\n");

  const sizeMB = (fs.statSync(outputLocation).size / 1_048_576).toFixed(1);
  console.log(`\nDone! Output: ${path.relative(process.cwd(), outputLocation)} (${sizeMB} MB)`);
}

main().catch((err) => {
  console.error("\nFatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});

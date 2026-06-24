import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
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

interface SlideCue {
  text: string;
  startTime: number;
  endTime: number;
  slideType: "title" | "concept" | "point" | "summary";
}

interface InputProps extends Record<string, unknown> {
  lessonTitle: string;
  audioSrc: string;
  cues: SlideCue[];
}

async function main(): Promise<void> {
  const cuesPath = path.join(process.cwd(), "public", "audio", "ai-foundations", "lesson-0-cues.json");

  if (!fs.existsSync(cuesPath)) {
    throw new Error(`Cues file not found: ${cuesPath}\nRun "npm run generate:audio" first.`);
  }

  const cues: SlideCue[] = JSON.parse(fs.readFileSync(cuesPath, "utf-8"));
  console.log(`Loaded ${cues.length} slide cues from ${path.relative(process.cwd(), cuesPath)}`);

  const inputProps: InputProps = {
    lessonTitle: "Welcome to AI Foundations",
    audioSrc: "audio/ai-foundations/lesson-0.mp3",
    cues,
  };

  const outDir = path.join(process.cwd(), "public", "videos", "ai-foundations");
  fs.mkdirSync(outDir, { recursive: true });
  const outputLocation = path.join(outDir, "lesson-0-janet.mp4");

  console.log("Bundling Remotion composition...");
  const serveUrl = await bundle({
    entryPoint: path.join(process.cwd(), "remotion", "Root.tsx"),
    publicDir: path.join(process.cwd(), "public"),
    webpackOverride: (config) => config,
  });

  console.log("Selecting composition (calculateMetadata detects audio duration)...");
  const composition = await selectComposition({
    serveUrl,
    id: "LessonVideo",
    inputProps,
  });

  const totalSecs = (composition.durationInFrames / composition.fps).toFixed(1);
  console.log(`Rendering ${composition.durationInFrames} frames at ${composition.fps}fps (${totalSecs}s)...`);

  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation,
    inputProps,
    onProgress: ({ progress }) => {
      process.stdout.write(`\r  Encoding: ${(progress * 100).toFixed(1)}%  `);
    },
  });

  process.stdout.write("\n");
  const sizeMB = (fs.statSync(outputLocation).size / 1_048_576).toFixed(1);
  console.log(`\nOutput: ${path.relative(process.cwd(), outputLocation)} (${sizeMB} MB)`);
}

main().catch((err) => {
  console.error("\nFatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});

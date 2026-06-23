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

const inputProps = {
  lessonTitle: "Welcome to AI Foundations",
  subtitle: "From Zero to Dangerous in 7 Lessons",
  hook: "In 2024 a Nairobi marketing agency replaced three content writers with one person who knew how to use AI. That person now earns three times what the writers did. This course is your path to becoming that person.",
  concept: "5 Career-Changing Skills",
  conceptDefinition: "Master AI tools that will transform your professional output and earning potential — no coding required.",
  keyPoints: [
    "Use AI for any professional task better than someone with 3 years experience",
    "Build AI workflows that save you 2 hours every single working day",
    "Write, research and analyse at professional standard using AI tools",
    "Understand exactly what AI can and cannot do",
    "Graduate to the Tundemy talent pool with a verified AI credential",
  ],
  audioSrc: "audio/ai-foundations/lesson-0.mp3",
};

async function main(): Promise<void> {
  const outDir = path.join(process.cwd(), "public", "videos", "ai-foundations");
  fs.mkdirSync(outDir, { recursive: true });
  const outputLocation = path.join(outDir, "lesson-0-janet.mp4");

  console.log("Bundling Remotion composition...");
  const serveUrl = await bundle({
    entryPoint: path.join(process.cwd(), "remotion", "Root.tsx"),
    publicDir: path.join(process.cwd(), "public"),
    webpackOverride: (config) => config,
  });

  console.log("Selecting composition (calculateMetadata will detect audio duration)...");
  const composition = await selectComposition({ serveUrl, id: "LessonVideo", inputProps });

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

main().catch((err) => { console.error("\nFatal:", err instanceof Error ? err.message : err); process.exit(1); });

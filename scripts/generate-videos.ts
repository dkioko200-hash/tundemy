/**
 * Tundemy — HeyGen Video Generator
 * Course 1: Introduction to AI — 8 videos (Amara avatar)
 *
 * Run:  npx tsx scripts/generate-videos.ts
 *
 * Each video's scenes are joined into one continuous script with
 * a natural pause between scenes. One API call per video.
 * Videos are polled every 30 s and downloaded on completion.
 */

import axios, { AxiosError } from "axios";
import * as fs from "fs";
import * as path from "path";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";

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

// ── Config ─────────────────────────────────────────────────────────────────────

const API_KEY   = process.env.HEYGEN_API_KEY        ?? "";
const AVATAR_ID = process.env.HEYGEN_AMARA_AVATAR_ID ?? "";
const VOICE_ID  = process.env.HEYGEN_AMARA_VOICE_ID  ?? "";

if (!API_KEY || !AVATAR_ID || !VOICE_ID) {
  console.error("❌  Missing HeyGen env vars. Check .env.local.");
  process.exit(1);
}

const HEYGEN_BASE  = "https://api.heygen.com";
const OUTPUT_DIR   = path.join(process.cwd(), "public", "videos", "course1");
const POLL_MS      = 30_000;   // 30 s between status checks
const MAX_POLLS    = 120;      // 60 min timeout per video

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ── Types ──────────────────────────────────────────────────────────────────────

interface VideoSpec {
  id:       string;    // e.g. "C1_L0_Introduction"
  filename: string;    // e.g. "C1_L0_Introduction.mp4"
  scenes:   string[];  // one entry per scene, joined with pause on submit
}

interface HeyGenCreateResponse {
  data: { video_id: string };
  error: string | null;
}

interface HeyGenStatusResponse {
  data: {
    status:       "pending" | "processing" | "waiting" | "completed" | "failed";
    download_url: string | null;
    duration:     number | null;
    error:        string | null;
  };
  error: string | null;
}

// ── Video content ─────────────────────────────────────────────────────────────
//   Each string in `scenes[]` is one on-screen scene; they are concatenated
//   into a single continuous voiceover separated by a double-space pause.

const VIDEOS: VideoSpec[] = [
  // ── C1_L0 ─────────────────────────────────────────────────────────────────
  {
    id:       "C1_L0_Introduction",
    filename: "C1_L0_Introduction.mp4",
    scenes: [
      "Hello and welcome to Introduction to AI. My name is Amara and I am so glad you are here. What you are about to learn is not just another skill. It is a career advantage that most people around you do not have yet.",
      "In 2024 a Nairobi marketing agency replaced three content writers with one person who knew how to use AI. That person now earns three times what the writers did. This course is your path to becoming that person.",
      "Over eight lessons you will learn exactly what AI is and how it thinks. You will get hands on with ChatGPT, Claude, and Gemini. You will build your first real AI workflow. And you will finish with a professional portfolio project.",
      "You do not need to code. You do not need a technology background. The only thing you need is the willingness to learn. Everything else I will teach you from the ground up.",
      "Scroll down and answer the first task question. Then click Lesson One. I will see you there. Your skills bear fruit.",
    ],
  },

  // ── C1_L1 ─────────────────────────────────────────────────────────────────
  {
    id:       "C1_L1_What_AI_Actually_Is",
    filename: "C1_L1_What_AI_Actually_Is.mp4",
    scenes: [
      "Have you ever wondered why some colleagues seem to produce twice the work in half the time now? Their secret is simple. They have learned to delegate to AI. Today we talk about what AI actually is, what it can do, and what it cannot do.",
      "Artificial intelligence is not robots. It is software that has learned to recognize patterns. The AI tools you will use — ChatGPT, Claude, and Gemini — are called Large Language Models. They were trained on hundreds of billions of words. When you send a prompt the AI predicts the most useful response based on everything it learned.",
      "AI is not thinking. It is not conscious. It cannot verify whether what it says is true. This is why AI sometimes confidently tells you something completely wrong. We call this hallucination. Your human judgment is still irreplaceable. You are the quality check. The AI is the engine.",
      "ChatGPT is excellent for general tasks. Claude is known for longer, more nuanced responses and careful analysis. Gemini from Google integrates directly with your Google Workspace. All three are tools. None of them is magic.",
      "AI is not a search engine. The more specific your input the more valuable your output. A bad question gets a generic answer. A specific question with context gets a professional result. Head to the reading section and then try the sandbox. See you in Lesson Two.",
    ],
  },

  // ── C1_L2 ─────────────────────────────────────────────────────────────────
  {
    id:       "C1_L2_How_AI_Actually_Thinks",
    filename: "C1_L2_How_AI_Actually_Thinks.mp4",
    scenes: [
      "Have you ever asked an AI a question and gotten an answer that sounded completely confident but was completely wrong? Maybe it invented a statistic or cited a book that does not exist. This is called hallucination and once you understand why it happens you will never be caught off guard by it again.",
      "AI does not read words the way you do. It reads tokens — roughly a word or part of a word. When you send a prompt the AI predicts what the next most likely token should be based on patterns it learned during training. It is not retrieving facts. It is generating the most statistically likely continuation of your text.",
      "If the AI has never seen accurate information about a topic it still has to generate a response. So it generates the most plausible-sounding answer based on related patterns. This is why you should never trust AI output on critical matters without verifying from a primary source.",
      "AI has a knowledge cutoff date. The models were trained on data up to a certain point. Anything that happened after that date the AI does not know about. For current events, always use the internet.",
      "Understanding limitations makes you a better AI user. Use AI for what it is great at — generating options, drafting content, analyzing patterns. Use human judgment for what requires certainty. See you in Lesson Three.",
    ],
  },

  // ── C1_L3 ─────────────────────────────────────────────────────────────────
  {
    id:       "C1_L3_Your_First_AI_Workflow",
    filename: "C1_L3_Your_First_AI_Workflow.mp4",
    scenes: [
      "A task that takes four hours manually takes twenty minutes with the right AI workflow. I have seen this in real businesses. A weekly report that consumed a Friday afternoon now takes a coffee break. Today we build your first workflow.",
      "An AI workflow is a structured sequence of steps where AI does some of the work. You define the input — the information you start with. The AI steps — what you ask AI to do. And the output — what you need at the end. The magic is connecting steps so each one builds on the last.",
      "Imagine you run a small restaurant in Nairobi and every Monday you need to create your weekly specials post for WhatsApp. Without AI this takes forty-five minutes. With an AI workflow you tell the AI your ingredients and target customer, it generates five post options, you pick the best one and adapt it for Instagram. Ten minutes. Same quality.",
      "In the sandbox below you are going to build your first workflow for Mama Pima Pharmacies. Read the scenario, think about the steps, write your workflow. The grader gives you specific feedback. See you in Lesson Four.",
    ],
  },

  // ── C1_L4 ─────────────────────────────────────────────────────────────────
  {
    id:       "C1_L4_AI_for_Communication",
    filename: "C1_L4_AI_for_Communication.mp4",
    scenes: [
      "The average professional spends twenty-eight percent of their working day on email alone. Add reports, proposals, and presentations and communication is easily the biggest consumer of your professional time. Today we change that relationship.",
      "The key to great AI communication is the brief. Think of it like briefing a talented assistant who has never met you and knows nothing about your work. The better your brief the better the output. A weak brief produces generic output. A strong brief produces something you can send immediately.",
      "A weak brief says: write me a follow up email to a client. You get something generic. A strong brief says: I am a business development manager at a Nairobi fintech, yesterday I met Sarah Kimani at Equity Bank about our payment API, she was interested but needs to present to her technical team, write a follow up email under two hundred words. What do you get? Something you can send in five minutes.",
      "In the sandbox you are going to write three professional emails using AI. Each one has a different scenario, tone, and audience. Take your time with the brief. The better your brief the better your score. See you in Lesson Five.",
    ],
  },

  // ── C1_L5 ─────────────────────────────────────────────────────────────────
  {
    id:       "C1_L5_Research_and_Analysis_with_AI",
    filename: "C1_L5_Research_and_Analysis_with_AI.mp4",
    scenes: [
      "How do you analyze five hundred customer reviews in ten minutes? How do you summarize a forty-page report in five? You use AI — and today I am going to show you exactly how.",
      "AI is not a replacement for research. It is a research accelerator. It finds patterns in large amounts of text faster than any human. It summarizes complex documents. It compares multiple sources. What it cannot do is think critically about the quality of its sources. That part is still your job.",
      "A restaurant manager receives fifty Google reviews every month. With AI — paste the reviews into a prompt and ask: what are the three most common complaints, the three most common compliments, and what one change would have the biggest impact on my rating. In two minutes you have actionable insight that used to take a full afternoon.",
      "In the sandbox you are going to analyze fictional customer feedback from a Nairobi business. Your job is to extract the insights that would help the business improve. See you in Lesson Six.",
    ],
  },

  // ── C1_L6 ─────────────────────────────────────────────────────────────────
  {
    id:       "C1_L6_AI_Ethics_and_Professional_Responsibility",
    filename: "C1_L6_AI_Ethics_and_Professional_Responsibility.mp4",
    scenes: [
      "In 2018 Amazon built an AI system to screen job applicants. Four years later they discovered it had been systematically downgrading applications from women. The AI had learned from historical hiring data that already reflected decades of gender bias. The lesson is not that AI is dangerous. It is that AI reflects the humans who build and use it.",
      "AI learns from data. If that data reflects historical inequalities the AI will replicate those inequalities. This has happened in hiring, lending, and criminal justice. As an AI professional your job is to ask the right questions. Who was this model trained on? Who benefits from this output and who might be harmed?",
      "When you put information into an AI tool be aware of where it goes. Do not paste confidential client data into public AI tools. Read the terms of service. Some tools use your conversations to train their models.",
      "The most important principle in responsible AI use is keeping the human in the loop. AI should support human decisions — not replace human judgment on things that matter. In the reading section you will go deeper on all four of these principles. See you in Lesson Seven.",
    ],
  },

  // ── C1_L7 ─────────────────────────────────────────────────────────────────
  {
    id:       "C1_L7_Your_AI_Toolkit_and_Next_Steps",
    filename: "C1_L7_Your_AI_Toolkit_and_Next_Steps.mp4",
    scenes: [
      "Which AI tool should I use? The honest answer is: it depends on the task. The difference between a thirty-thousand-shilling AI professional and a one-hundred-and-fifty-thousand-shilling one is knowing which tool to reach for and when. Today we make you dangerous with all three.",
      "ChatGPT from OpenAI is the most widely recognised AI tool in the world. Excellent for general tasks, creative writing, and coding assistance. If you are just starting out this is a great default choice.",
      "Claude from Anthropic is the tool I trust most for long document analysis and nuanced writing. It handles longer documents better than most alternatives — meaning you can give it a very long document and it will actually understand the whole thing.",
      "Gemini from Google is your best choice when you are already in the Google ecosystem. It integrates directly with Gmail, Google Docs, and Google Sheets. If your work lives in Google Workspace, Gemini is your tool.",
      "Quick framework — general tasks and creative work: use ChatGPT. Long document analysis: use Claude. Google Workspace integration: use Gemini. The real professional move is using all three. Be loyal to results, not brands. One lesson left — your final project. Make it excellent.",
    ],
  },
];

// ── API helpers ────────────────────────────────────────────────────────────────

const heygenHeaders = {
  "X-Api-Key":    API_KEY,
  "Content-Type": "application/json",
};

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function joinScenes(scenes: string[]): string {
  // Double-space between scenes gives TTS a natural breath pause
  return scenes.join("  ");
}

async function submitVideo(spec: VideoSpec): Promise<string> {
  const script = joinScenes(spec.scenes);

  const body = {
    video_inputs: [
      {
        character: {
          type: "avatar",
          avatar_id: AVATAR_ID,
          avatar_style: "normal",
        },
        voice: {
          type:       "text",
          input_text: script,
          voice_id:   VOICE_ID,
          speed:      1.0,
        },
        background: {
          type:  "color",
          value: "#0f1f3d",
        },
      },
    ],
    dimension: { width: 1920, height: 1080 },
  };

  const { data } = await axios.post<HeyGenCreateResponse>(
    `${HEYGEN_BASE}/v2/video/generate`,
    body,
    { headers: heygenHeaders }
  );

  if (data.error) throw new Error(`HeyGen create error: ${data.error}`);
  return data.data.video_id;
}

async function pollUntilDone(videoId: string): Promise<{ url: string; duration: number }> {
  for (let attempt = 0; attempt < MAX_POLLS; attempt++) {
    const { data } = await axios.get<HeyGenStatusResponse>(
      `${HEYGEN_BASE}/v1/video_status.get`,
      { params: { video_id: videoId }, headers: heygenHeaders }
    );

    if (data.error) throw new Error(`HeyGen status error: ${data.error}`);

    const { status, download_url, duration, error } = data.data;

    if (status === "completed") {
      if (!download_url) throw new Error("Completed but no download_url");
      return { url: download_url, duration: duration ?? 0 };
    }

    if (status === "failed") {
      throw new Error(`Video failed: ${error ?? "unknown reason"}`);
    }

    const waited = ((attempt + 1) * POLL_MS / 1000).toFixed(0);
    console.log(`    ⏳  ${status} — ${waited}s elapsed, checking again in 30s…`);
    await sleep(POLL_MS);
  }

  throw new Error(`Timed out after ${(MAX_POLLS * POLL_MS) / 60_000} minutes`);
}

async function downloadTo(url: string, destPath: string): Promise<void> {
  const response = await axios.get<NodeJS.ReadableStream>(url, {
    responseType: "stream",
  });
  const writer = createWriteStream(destPath);
  await pipeline(response.data, writer);
}

// ── Main ───────────────────────────────────────────────────────────────────────

interface Result {
  id:       string;
  success:  boolean;
  filePath: string;
  duration: number;
  error:    string;
}

async function main(): Promise<void> {
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║   Tundemy — HeyGen Video Generator               ║");
  console.log("║   Course 1: Introduction to AI  (8 videos)       ║");
  console.log("╚══════════════════════════════════════════════════╝\n");

  const results: Result[] = [];
  const startTime = Date.now();

  for (let i = 0; i < VIDEOS.length; i++) {
    const spec = VIDEOS[i];
    const label = `${i + 1} of ${VIDEOS.length}: ${spec.id}`;
    const destPath = path.join(OUTPUT_DIR, spec.filename);

    console.log(`\n── Video ${label}`);
    console.log(`   Scenes: ${spec.scenes.length}  |  Script: ${joinScenes(spec.scenes).length} chars`);

    const result: Result = { id: spec.id, success: false, filePath: "", duration: 0, error: "" };

    try {
      // Step 1 — submit
      console.log("   Submitting to HeyGen…");
      const videoId = await submitVideo(spec);
      console.log(`   ✓ Submitted  video_id: ${videoId}`);

      // Step 2 — poll
      console.log("   Polling for completion…");
      const { url, duration } = await pollUntilDone(videoId);
      result.duration = duration;
      console.log(`   ✓ Complete  duration: ${duration.toFixed(1)}s`);

      // Step 3 — download
      console.log(`   Downloading to ${destPath}…`);
      await downloadTo(url, destPath);
      const sizeMB = (fs.statSync(destPath).size / 1_048_576).toFixed(1);
      console.log(`   ✓ Saved  ${sizeMB} MB`);

      const relPath = path.relative(process.cwd(), destPath).replace(/\\/g, "/");
      result.filePath = relPath;
      result.success  = true;

      console.log(`   ✅  Video ${i + 1} complete: ${relPath}`);
    } catch (err) {
      result.error = err instanceof AxiosError
        ? `HTTP ${err.response?.status ?? "?"}: ${JSON.stringify(err.response?.data)}`
        : String(err instanceof Error ? err.message : err);
      console.error(`   ❌  FAILED: ${result.error}`);
    }

    results.push(result);
  }

  // ── Summary ──────────────────────────────────────────────────────────────────

  const succeeded = results.filter((r) => r.success);
  const failed    = results.filter((r) => !r.success);
  const totalSecs = succeeded.reduce((s, r) => s + r.duration, 0);
  const totalMins = totalSecs / 60;
  const wallMins  = ((Date.now() - startTime) / 60_000).toFixed(1);

  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║   Summary                                        ║");
  console.log("╚══════════════════════════════════════════════════╝");
  console.log(`  Succeeded : ${succeeded.length} / ${VIDEOS.length}`);
  console.log(`  Failed    : ${failed.length} / ${VIDEOS.length}`);
  console.log(`  Wall time : ${wallMins} mins`);

  if (succeeded.length > 0) {
    console.log(`\n  Total video duration  : ~${totalMins.toFixed(1)} mins`);
    // HeyGen pricing varies by plan; rough estimate ~$0.11/min for Starter
    const estimatedUSD = totalMins * 0.11;
    console.log(`  Estimated cost        : ~$${estimatedUSD.toFixed(2)} (≈ $0.11/min)`);
    console.log("\n  Generated files:");
    for (const r of succeeded) {
      console.log(`    ✓ ${r.filePath}  (${r.duration.toFixed(1)}s)`);
    }
  }

  if (failed.length > 0) {
    console.log("\n  Failed videos:");
    for (const r of failed) {
      console.log(`    ✗ ${r.id}  —  ${r.error}`);
    }
  }

  console.log("");
  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("\nFatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});

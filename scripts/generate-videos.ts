/**
 * Tundemy — HeyGen Video Generator
 *
 * Generates one avatar video per lesson for the given track(s) using the
 * lesson's `hook`, `theory.concept`, and `content` fields as the avatar
 * speech script. Presenter (Amara / Jabari) alternates by course.
 *
 * Run:  npx tsx scripts/generate-videos.ts --track 1
 *   (npx ts-node also works if ts-node is installed, but tsx handles this
 *    project's ESM/bundler TS config without extra setup)
 *
 * Videos are submitted via HeyGen v2, polled every 30s via HeyGen v1
 * status, downloaded to public/videos/{slug}/, and the resulting video
 * URLs are written to scripts/video-urls.json keyed by
 * "{courseSlug}_{lessonNumber}".
 */

import axios, { AxiosError } from "axios";
import * as fs from "fs";
import * as path from "path";
import { courseContent, type Lesson } from "../lib/course-content";

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

const API_KEY = process.env.HEYGEN_API_KEY ?? "";

type Presenter = "Amara" | "Jabari";

const PRESENTERS: Record<Presenter, { avatarId: string; voiceId: string }> = {
  Amara: {
    avatarId: process.env.HEYGEN_AMARA_AVATAR_ID ?? "e8b5ad4b76f643da8cc7dad2e81d325b",
    voiceId: process.env.HEYGEN_AMARA_VOICE_ID ?? "1Djk28KqrxZJqPol4iLS",
  },
  Jabari: {
    avatarId: process.env.HEYGEN_JABARI_AVATAR_ID ?? "1298aa10e1ee448c8f6cef46995be696",
    voiceId: process.env.HEYGEN_JABARI_VOICE_ID ?? "24f17f42c557477faa14c21920ad0713",
  },
};

if (!API_KEY) {
  console.error("Missing HEYGEN_API_KEY. Check .env.local.");
  process.exit(1);
}

const HEYGEN_BASE = "https://api.heygen.com";
const POLL_MS = 30_000; // 30s between status checks
const MAX_POLLS = 120; // 60 min timeout per video
const MAX_RETRIES = 3;
const VIDEO_URLS_FILE = path.join(process.cwd(), "scripts", "video-urls.json");

// ── Track / presenter mapping ────────────────────────────────────────────────
// Five tracks of two courses each, alternating presenters within each pair.

const TRACK_COURSES: Record<string, string[]> = {
  "1": ["ai-foundations", "prompt-engineering"],
  "2": ["ai-data-analysis", "whatsapp-ai-integration"],
  "3": ["mpesa-daraja-api", "ai-agriculture"],
  "4": ["ai-evaluation-engineering", "rag-ai-engineering"],
  "5": ["freelancing-with-ai", "selling-to-western-clients"],
};

const COURSE_PRESENTER: Record<string, Presenter> = {
  "ai-foundations": "Amara",
  "prompt-engineering": "Jabari",
  "ai-data-analysis": "Amara",
  "whatsapp-ai-integration": "Jabari",
  "mpesa-daraja-api": "Amara",
  "ai-agriculture": "Jabari",
  "ai-evaluation-engineering": "Amara",
  "rag-ai-engineering": "Jabari",
  "freelancing-with-ai": "Amara",
  "selling-to-western-clients": "Jabari",
};

// ── Curated scripts for ai-foundations (richer than the generic builder) ────
// Keyed by lessonNumber. Falls back to buildVideoScript() for lessons not
// listed here, and for every other course.

const AI_FOUNDATIONS_SCRIPTS: Record<number, string> = {
  0: [
    "Hello and welcome to Introduction to AI. My name is Amara and I am so glad you are here. What you are about to learn is not just another skill. It is a career advantage that most people around you do not have yet.",
    "In 2024 a Nairobi marketing agency replaced three content writers with one person who knew how to use AI. That person now earns three times what the writers did. This course is your path to becoming that person.",
    "Over eight lessons you will learn exactly what AI is and how it thinks. You will get hands on with ChatGPT, Claude, and Gemini. You will build your first real AI workflow. And you will finish with a professional portfolio project.",
    "You do not need to code. You do not need a technology background. The only thing you need is the willingness to learn. Everything else I will teach you from the ground up.",
    "Scroll down and answer the first task question. Then click Lesson One. I will see you there. Your skills bear fruit.",
  ].join("  "),
  1: [
    "Have you ever wondered why some colleagues seem to produce twice the work in half the time now? Their secret is simple. They have learned to delegate to AI. Today we talk about what AI actually is, what it can do, and what it cannot do.",
    "Artificial intelligence is not robots. It is software that has learned to recognize patterns. The AI tools you will use — ChatGPT, Claude, and Gemini — are called Large Language Models. They were trained on hundreds of billions of words. When you send a prompt the AI predicts the most useful response based on everything it learned.",
    "AI is not thinking. It is not conscious. It cannot verify whether what it says is true. This is why AI sometimes confidently tells you something completely wrong. We call this hallucination. Your human judgment is still irreplaceable. You are the quality check. The AI is the engine.",
    "ChatGPT is excellent for general tasks. Claude is known for longer, more nuanced responses and careful analysis. Gemini from Google integrates directly with your Google Workspace. All three are tools. None of them is magic.",
    "AI is not a search engine. The more specific your input the more valuable your output. A bad question gets a generic answer. A specific question with context gets a professional result. Head to the reading section and then try the sandbox. See you in Lesson Two.",
  ].join("  "),
  2: [
    "Have you ever asked an AI a question and gotten an answer that sounded completely confident but was completely wrong? Maybe it invented a statistic or cited a book that does not exist. This is called hallucination and once you understand why it happens you will never be caught off guard by it again.",
    "AI does not read words the way you do. It reads tokens — roughly a word or part of a word. When you send a prompt the AI predicts what the next most likely token should be based on patterns it learned during training. It is not retrieving facts. It is generating the most statistically likely continuation of your text.",
    "If the AI has never seen accurate information about a topic it still has to generate a response. So it generates the most plausible-sounding answer based on related patterns. This is why you should never trust AI output on critical matters without verifying from a primary source.",
    "AI has a knowledge cutoff date. The models were trained on data up to a certain point. Anything that happened after that date the AI does not know about. For current events, always use the internet.",
    "Understanding limitations makes you a better AI user. Use AI for what it is great at — generating options, drafting content, analyzing patterns. Use human judgment for what requires certainty. See you in Lesson Three.",
  ].join("  "),
  3: [
    "A task that takes four hours manually takes twenty minutes with the right AI workflow. I have seen this in real businesses. A weekly report that consumed a Friday afternoon now takes a coffee break. Today we build your first workflow.",
    "An AI workflow is a structured sequence of steps where AI does some of the work. You define the input — the information you start with. The AI steps — what you ask AI to do. And the output — what you need at the end. The magic is connecting steps so each one builds on the last.",
    "Imagine you run a small restaurant in Nairobi and every Monday you need to create your weekly specials post for WhatsApp. Without AI this takes forty-five minutes. With an AI workflow you tell the AI your ingredients and target customer, it generates five post options, you pick the best one and adapt it for Instagram. Ten minutes. Same quality.",
    "In the sandbox below you are going to build your first workflow for Mama Pima Pharmacies. Read the scenario, think about the steps, write your workflow. The grader gives you specific feedback. See you in Lesson Four.",
  ].join("  "),
  4: [
    "The average professional spends twenty-eight percent of their working day on email alone. Add reports, proposals, and presentations and communication is easily the biggest consumer of your professional time. Today we change that relationship.",
    "The key to great AI communication is the brief. Think of it like briefing a talented assistant who has never met you and knows nothing about your work. The better your brief the better the output. A weak brief produces generic output. A strong brief produces something you can send immediately.",
    "A weak brief says: write me a follow up email to a client. You get something generic. A strong brief says: I am a business development manager at a Nairobi fintech, yesterday I met Sarah Kimani at Equity Bank about our payment API, she was interested but needs to present to her technical team, write a follow up email under two hundred words. What do you get? Something you can send in five minutes.",
    "In the sandbox you are going to write three professional emails using AI. Each one has a different scenario, tone, and audience. Take your time with the brief. The better your brief the better your score. See you in Lesson Five.",
  ].join("  "),
  5: [
    "How do you analyze five hundred customer reviews in ten minutes? How do you summarize a forty-page report in five? You use AI — and today I am going to show you exactly how.",
    "AI is not a replacement for research. It is a research accelerator. It finds patterns in large amounts of text faster than any human. It summarizes complex documents. It compares multiple sources. What it cannot do is think critically about the quality of its sources. That part is still your job.",
    "A restaurant manager receives fifty Google reviews every month. With AI — paste the reviews into a prompt and ask: what are the three most common complaints, the three most common compliments, and what one change would have the biggest impact on my rating. In two minutes you have actionable insight that used to take a full afternoon.",
    "In the sandbox you are going to analyze fictional customer feedback from a Nairobi business. Your job is to extract the insights that would help the business improve. See you in Lesson Six.",
  ].join("  "),
  6: [
    "In 2018 Amazon built an AI system to screen job applicants. Four years later they discovered it had been systematically downgrading applications from women. The AI had learned from historical hiring data that already reflected decades of gender bias. The lesson is not that AI is dangerous. It is that AI reflects the humans who build and use it.",
    "AI learns from data. If that data reflects historical inequalities the AI will replicate those inequalities. This has happened in hiring, lending, and criminal justice. As an AI professional your job is to ask the right questions. Who was this model trained on? Who benefits from this output and who might be harmed?",
    "When you put information into an AI tool be aware of where it goes. Do not paste confidential client data into public AI tools. Read the terms of service. Some tools use your conversations to train their models.",
    "The most important principle in responsible AI use is keeping the human in the loop. AI should support human decisions — not replace human judgment on things that matter. In the reading section you will go deeper on all four of these principles. See you in Lesson Seven.",
  ].join("  "),
  7: [
    "Which AI tool should I use? The honest answer is: it depends on the task. The difference between a thirty-thousand-shilling AI professional and a one-hundred-and-fifty-thousand-shilling one is knowing which tool to reach for and when. Today we make you dangerous with all three.",
    "ChatGPT from OpenAI is the most widely recognised AI tool in the world. Excellent for general tasks, creative writing, and coding assistance. If you are just starting out this is a great default choice.",
    "Claude from Anthropic is the tool I trust most for long document analysis and nuanced writing. It handles longer documents better than most alternatives — meaning you can give it a very long document and it will actually understand the whole thing.",
    "Gemini from Google is your best choice when you are already in the Google ecosystem. It integrates directly with Gmail, Google Docs, and Google Sheets. If your work lives in Google Workspace, Gemini is your tool.",
    "Quick framework — general tasks and creative work: use ChatGPT. Long document analysis: use Claude. Google Workspace integration: use Gemini. The real professional move is using all three. Be loyal to results, not brands. One lesson left — your final project. Make it excellent.",
  ].join("  "),
};

// ── Script builder ────────────────────────────────────────────────────────────

function buildVideoScript(slug: string, lesson: Lesson): string {
  if (slug === "ai-foundations" && AI_FOUNDATIONS_SCRIPTS[lesson.lessonNumber]) {
    return AI_FOUNDATIONS_SCRIPTS[lesson.lessonNumber];
  }

  const parts: string[] = [];
  if (lesson.hook) parts.push(lesson.hook);
  if (lesson.theory?.concept) parts.push(lesson.theory.concept);
  if (lesson.content) parts.push(lesson.content);
  return parts.join("  ");
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface VideoJob {
  courseSlug: string;
  courseTitle: string;
  lessonNumber: number;
  lessonTitle: string;
  presenter: Presenter;
  script: string;
}

interface HeyGenCreateResponse {
  data: { video_id: string };
  error: string | null;
}

interface HeyGenStatusResponse {
  data: {
    status: "pending" | "processing" | "waiting" | "completed" | "failed";
    video_url: string | null;
    duration: number | null;
    error: string | null;
  };
  error: string | null;
}

interface VideoUrlEntry {
  videoId: string;
  videoUrl: string;
  duration: number;
  filePath: string;
  presenter: Presenter;
  generatedAt: string;
}

// ── API helpers ────────────────────────────────────────────────────────────────

const heygenHeaders = {
  "X-Api-Key": API_KEY,
  "Content-Type": "application/json",
};

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function submitVideo(job: VideoJob): Promise<string> {
  const { avatarId, voiceId } = PRESENTERS[job.presenter];

  const body = {
    video_inputs: [
      {
        character: {
          type: "avatar",
          avatar_id: avatarId,
          avatar_style: "normal",
        },
        voice: {
          type: "text",
          input_text: job.script,
          voice_id: voiceId,
          speed: 1.0,
        },
        background: {
          type: "color",
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

    const { status, video_url, duration, error } = data.data;

    if (status === "completed") {
      if (!video_url) throw new Error("Completed but no video_url");
      return { url: video_url, duration: duration ?? 0 };
    }

    if (status === "failed") {
      throw new Error(`Video failed: ${error ?? "unknown reason"}`);
    }

    const waited = ((attempt + 1) * POLL_MS / 1000).toFixed(0);
    console.log(`    waiting — status: ${status} (${waited}s elapsed, checking again in 30s)`);
    await sleep(POLL_MS);
  }

  throw new Error(`Timed out after ${(MAX_POLLS * POLL_MS) / 60_000} minutes`);
}

async function downloadTo(url: string, dest: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed: ${response.status} ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(arrayBuffer));
}

// ── Retry wrapper ──────────────────────────────────────────────────────────────

async function generateWithRetries(job: VideoJob, destPath: string): Promise<VideoUrlEntry> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`   Attempt ${attempt}/${MAX_RETRIES} — submitting to HeyGen...`);
      const videoId = await submitVideo(job);
      console.log(`   Submitted. video_id: ${videoId}`);

      console.log("   Polling for completion...");
      const { url, duration } = await pollUntilDone(videoId);
      console.log(`   Complete — duration: ${duration.toFixed(1)}s`);

      try {
        await downloadTo(url, destPath);
        const sizeMB = (fs.statSync(destPath).size / 1_048_576).toFixed(1);
        console.log(`   Saved ${sizeMB} MB to ${destPath}`);
      } catch (downloadErr) {
        console.warn(`   Download failed (URL still recorded): ${downloadErr instanceof Error ? downloadErr.message : downloadErr}`);
      }

      return {
        videoId,
        videoUrl: url,
        duration,
        filePath: path.relative(process.cwd(), destPath).replace(/\\/g, "/"),
        presenter: job.presenter,
        generatedAt: new Date().toISOString(),
      };
    } catch (err) {
      lastError = err;
      const message = err instanceof AxiosError
        ? `HTTP ${err.response?.status ?? "?"}: ${JSON.stringify(err.response?.data)}`
        : String(err instanceof Error ? err.message : err);
      console.error(`   Attempt ${attempt}/${MAX_RETRIES} failed: ${message}`);
      if (attempt < MAX_RETRIES) {
        console.log("   Retrying...");
        await sleep(5_000);
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

// ── Video URL store ────────────────────────────────────────────────────────────

function loadVideoUrls(): Record<string, VideoUrlEntry> {
  if (!fs.existsSync(VIDEO_URLS_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(VIDEO_URLS_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveVideoUrls(data: Record<string, VideoUrlEntry>): void {
  fs.mkdirSync(path.dirname(VIDEO_URLS_FILE), { recursive: true });
  fs.writeFileSync(VIDEO_URLS_FILE, JSON.stringify(data, null, 2));
}

// ── CLI args ───────────────────────────────────────────────────────────────────

function getTrackArg(): string[] {
  const args = process.argv.slice(2);
  const idx = args.indexOf("--track");
  if (idx === -1 || !args[idx + 1]) {
    console.error("Usage: npx tsx scripts/generate-videos.ts --track <1-5>");
    process.exit(1);
  }
  const track = args[idx + 1];
  const slugs = TRACK_COURSES[track];
  if (!slugs) {
    console.error(`Unknown track "${track}". Valid tracks: ${Object.keys(TRACK_COURSES).join(", ")}`);
    process.exit(1);
  }
  return slugs;
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const trackSlugs = getTrackArg();
  const videoUrls = loadVideoUrls();

  const jobs: VideoJob[] = [];
  for (const slug of trackSlugs) {
    const course = courseContent.find((c) => c.slug === slug);
    if (!course) {
      console.warn(`Course "${slug}" not found in course-content.ts — skipping`);
      continue;
    }
    const presenter = COURSE_PRESENTER[slug] ?? "Amara";
    for (const lesson of course.lessons) {
      jobs.push({
        courseSlug: slug,
        courseTitle: course.title,
        lessonNumber: lesson.lessonNumber,
        lessonTitle: lesson.title,
        presenter,
        script: buildVideoScript(slug, lesson),
      });
    }
  }

  console.log("================================================");
  console.log("  Tundemy — HeyGen Video Generator");
  console.log(`  Track courses: ${trackSlugs.join(", ")}`);
  console.log(`  Total lessons: ${jobs.length}`);
  console.log("================================================\n");

  const startTime = Date.now();
  let succeeded = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const key = `${job.courseSlug}_${job.lessonNumber}`;
    console.log(`Generating video ${i + 1} of ${jobs.length}: [${job.courseTitle}] - ${job.lessonTitle}`);

    if (videoUrls[key]?.videoUrl) {
      console.log(`   Already generated — skipping (${key})\n`);
      skipped++;
      continue;
    }

    if (!job.script.trim()) {
      console.warn(`   No script content for ${key} — skipping\n`);
      skipped++;
      continue;
    }

    const outDir = path.join(process.cwd(), "public", "videos", job.courseSlug);
    fs.mkdirSync(outDir, { recursive: true });
    const safeTitle = job.lessonTitle.replace(/[^a-z0-9]+/gi, "_").slice(0, 60);
    const destPath = path.join(outDir, `${job.courseSlug}_L${job.lessonNumber}_${safeTitle}.mp4`);

    console.log(`   Presenter: ${job.presenter}  |  Script: ${job.script.length} chars`);

    try {
      const entry = await generateWithRetries(job, destPath);
      videoUrls[key] = entry;
      saveVideoUrls(videoUrls);
      succeeded++;
      console.log(`   Done: ${key}\n`);
    } catch (err) {
      failed++;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`   FAILED after ${MAX_RETRIES} attempts: ${key} — ${message}\n`);
    }
  }

  const wallMins = ((Date.now() - startTime) / 60_000).toFixed(1);

  console.log("================================================");
  console.log("  Summary");
  console.log("================================================");
  console.log(`  Succeeded : ${succeeded} / ${jobs.length}`);
  console.log(`  Skipped   : ${skipped} / ${jobs.length}`);
  console.log(`  Failed    : ${failed} / ${jobs.length}`);
  console.log(`  Wall time : ${wallMins} mins`);
  console.log(`  URLs file : ${path.relative(process.cwd(), VIDEO_URLS_FILE)}`);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("\nFatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});

import * as fs from "fs";
import * as path from "path";

// ── Env ───────────────────────────────────────────────────────────────────────

function loadEnv(): void {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim();
    if (k && !(k in process.env)) process.env[k] = v;
  }
}

loadEnv();

// ── Types ─────────────────────────────────────────────────────────────────────

interface ManifestEntry {
  courseSlug: string;
  lessonIndex: number;
  lessonTitle: string;
  avatarId: string;
  avatarName: string;
  voiceId: string;
  videoScript: string;
}

interface JobRecord {
  courseSlug: string;
  lessonIndex: number;
  lessonTitle: string;
  avatarName: string;
  videoId: string;
  status: "submitted" | "processing" | "completed" | "failed";
  outputPath?: string;
  error?: string;
  attempts: number;
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
    status: string;
    video_url?: string;
    error?: string;
  };
  error: string | null;
}

// ── Paths ─────────────────────────────────────────────────────────────────────

const JOBS_PATH = path.join(process.cwd(), "scripts", "heygen-jobs.json");
const MANIFEST_PATH = path.join(process.cwd(), "scripts", "video-manifest-full.json");
const HEYGEN_API = "https://api.heygen.com";
const MAX_RETRIES = 3;
const POLL_INTERVAL_MS = 30_000;

// ── Job persistence ───────────────────────────────────────────────────────────

function loadJobs(): JobRecord[] {
  if (!fs.existsSync(JOBS_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(JOBS_PATH, "utf-8")) as JobRecord[];
  } catch {
    return [];
  }
}

function saveJobs(jobs: JobRecord[]): void {
  fs.writeFileSync(JOBS_PATH, JSON.stringify(jobs, null, 2));
}

function jobKey(e: ManifestEntry): string {
  return `${e.courseSlug}::${e.lessonIndex}`;
}

// ── HeyGen API calls ──────────────────────────────────────────────────────────

async function submitJob(entry: ManifestEntry, apiKey: string): Promise<string> {
  const res = await fetch(`${HEYGEN_API}/v2/video/generate`, {
    method: "POST",
    headers: { "X-Api-Key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      video_inputs: [{
        character: { type: "avatar", avatar_id: entry.avatarId, avatar_style: "normal" },
        voice: { type: "text", voice_id: entry.voiceId, input_text: entry.videoScript, speed: 0.9 },
        background: { type: "color", value: "#0f1f3d" },
      }],
      dimension: { width: 480, height: 720 },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as HeyGenGenerateResponse;
  if (data.error) throw new Error(String(data.error));
  return data.data.video_id;
}

async function checkStatus(videoId: string, apiKey: string): Promise<{ status: string; url?: string; error?: string }> {
  const res = await fetch(`${HEYGEN_API}/v1/video_status.get?video_id=${videoId}`, {
    headers: { "X-Api-Key": apiKey },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as HeyGenStatusResponse;
  return {
    status: data.data.status,
    url: data.data.video_url,
    error: data.data.error,
  };
}

async function downloadVideo(url: string, outPath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, Buffer.from(buf));
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) throw new Error("Missing HEYGEN_API_KEY in .env.local");

  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Manifest not found: ${MANIFEST_PATH}\nRun: npm run build:manifest first`);
  }

  const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  const total = manifest.length;
  console.log(`Manifest loaded: ${total} lessons`);

  // Load existing job records
  let jobs: JobRecord[] = loadJobs();
  const jobMap = new Map<string, JobRecord>(jobs.map((j) => [`${j.courseSlug}::${j.lessonIndex}`, j]));

  // ── PHASE 1: Submit all unsubmitted jobs ───────────────────────────────────

  let submitted = 0;
  let skippedAlreadyDone = 0;

  for (const entry of manifest) {
    const key = jobKey(entry);
    const outPath = path.join(process.cwd(), "public", "avatars", entry.courseSlug, `lesson-${entry.lessonIndex}-${entry.avatarName}.mp4`);

    // Skip if file already downloaded
    if (fs.existsSync(outPath)) {
      skippedAlreadyDone++;
      if (!jobMap.has(key)) {
        jobMap.set(key, {
          courseSlug: entry.courseSlug,
          lessonIndex: entry.lessonIndex,
          lessonTitle: entry.lessonTitle,
          avatarName: entry.avatarName,
          videoId: "already-exists",
          status: "completed",
          outputPath: outPath,
          attempts: 0,
        });
      } else {
        jobMap.get(key)!.status = "completed";
        jobMap.get(key)!.outputPath = outPath;
      }
      continue;
    }

    // Skip if already submitted (has a real videoId)
    const existing = jobMap.get(key);
    if (existing && existing.videoId && existing.videoId !== "already-exists" &&
        (existing.status === "submitted" || existing.status === "processing" || existing.status === "completed")) {
      continue;
    }

    // Submit
    let videoId: string | null = null;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        videoId = await submitJob(entry, apiKey);
        break;
      } catch (err) {
        console.error(`  Submit failed (attempt ${attempt}/${MAX_RETRIES}) for ${entry.courseSlug} L${entry.lessonIndex}: ${err}`);
        if (attempt < MAX_RETRIES) await new Promise((r) => setTimeout(r, 5000));
      }
    }

    if (!videoId) {
      jobMap.set(key, {
        courseSlug: entry.courseSlug, lessonIndex: entry.lessonIndex,
        lessonTitle: entry.lessonTitle, avatarName: entry.avatarName,
        videoId: "", status: "failed", error: "Failed to submit after retries", attempts: MAX_RETRIES,
      });
    } else {
      submitted++;
      console.log(`  Submitted ${submitted} of ${total - skippedAlreadyDone}: ${entry.courseSlug} L${entry.lessonIndex} (${entry.avatarName}) → ${videoId}`);
      jobMap.set(key, {
        courseSlug: entry.courseSlug, lessonIndex: entry.lessonIndex,
        lessonTitle: entry.lessonTitle, avatarName: entry.avatarName,
        videoId, status: "submitted", attempts: 0,
      });
    }

    // Save after every submission
    saveJobs(Array.from(jobMap.values()));

    // Small delay between submissions to avoid rate limits
    await new Promise((r) => setTimeout(r, 800));
  }

  console.log(`\nSubmission complete. Submitted: ${submitted}, already done: ${skippedAlreadyDone}`);
  saveJobs(Array.from(jobMap.values()));

  // ── PHASE 2: Poll all pending jobs ────────────────────────────────────────

  let pollRound = 0;
  while (true) {
    const pending = Array.from(jobMap.values()).filter(
      (j) => j.status === "submitted" || j.status === "processing"
    );
    const completed = Array.from(jobMap.values()).filter((j) => j.status === "completed").length;
    const failed    = Array.from(jobMap.values()).filter((j) => j.status === "failed").length;

    if (pending.length === 0) break;

    pollRound++;
    console.log(`\n[Poll round ${pollRound}] Pending: ${pending.length} | Completed: ${completed} | Failed: ${failed}`);

    for (const job of pending) {
      if (!job.videoId || job.videoId === "already-exists") continue;

      try {
        const { status, url, error } = await checkStatus(job.videoId, apiKey);
        job.status = (status === "completed" || status === "failed") ? status as "completed" | "failed" : "processing";

        if (status === "completed" && url) {
          const outPath = path.join(process.cwd(), "public", "avatars", job.courseSlug, `lesson-${job.lessonIndex}-${job.avatarName}.mp4`);
          process.stdout.write(`  Downloading ${job.courseSlug} L${job.lessonIndex}... `);
          await downloadVideo(url, outPath);
          const mb = (fs.statSync(outPath).size / 1_048_576).toFixed(1);
          console.log(`${mb} MB saved`);
          job.outputPath = outPath;
        } else if (status === "failed") {
          const errStr = typeof error === "string" ? error : JSON.stringify(error);
          console.log(`  FAILED: ${job.courseSlug} L${job.lessonIndex} — ${errStr ?? "unknown"}`);
          job.error = errStr;
          job.attempts++;

          // Re-submit if under retry limit
          if (job.attempts < MAX_RETRIES) {
            try {
              const entry = manifest.find((e) => e.courseSlug === job.courseSlug && e.lessonIndex === job.lessonIndex)!;
              job.videoId = await submitJob(entry, apiKey);
              job.status = "submitted";
              console.log(`  Re-submitted: new videoId=${job.videoId}`);
            } catch {
              console.log(`  Re-submit also failed.`);
            }
          }
        } else {
          process.stdout.write(`  ${job.courseSlug} L${job.lessonIndex}: ${status}\n`);
        }
      } catch (err) {
        console.error(`  Poll error for ${job.videoId}: ${err}`);
      }

      // Small delay between status checks to avoid rate limits
      await new Promise((r) => setTimeout(r, 300));
    }

    saveJobs(Array.from(jobMap.values()));

    // Check if anything is still pending
    const stillPending = Array.from(jobMap.values()).filter(
      (j) => j.status === "submitted" || j.status === "processing"
    );
    if (stillPending.length === 0) break;

    console.log(`  Waiting ${POLL_INTERVAL_MS / 1000}s before next poll...`);
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }

  // ── Final summary ─────────────────────────────────────────────────────────

  const allJobs = Array.from(jobMap.values());
  const completedCount = allJobs.filter((j) => j.status === "completed").length;
  const failedCount    = allJobs.filter((j) => j.status === "failed").length;

  console.log(`\n${"=".repeat(60)}`);
  console.log(`DONE. Completed: ${completedCount}/${total} | Failed: ${failedCount}/${total}`);
  if (failedCount > 0) {
    console.log("\nFailed lessons:");
    for (const j of allJobs.filter((jj) => jj.status === "failed")) {
      console.log(`  ${j.courseSlug} L${j.lessonIndex}: ${j.error}`);
    }
  }
  console.log(`\nJob records saved to: ${path.relative(process.cwd(), JOBS_PATH)}`);
}

main().catch((err) => {
  console.error("\nFatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});

import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

export const MAX_SUBMISSION_WORDS = 800;
export const MAX_GRADING_ATTEMPTS_PER_DAY = 3;

export const HAIKU_MODEL = "claude-haiku-4-5-20251001";
export const SONNET_MODEL = "claude-sonnet-4-6";

export type GradingKind = "capstone" | "assessment";

export function truncateToWords(text: string, maxWords: number = MAX_SUBMISSION_WORDS): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return words.slice(0, maxWords).join(" ");
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function hashSubmission(text: string): string {
  return createHash("sha256").update(text.trim()).digest("hex");
}

export function getGradingServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_URL) is not configured. " +
      "Grading and rate-limiting cannot run without it — set it in .env.local."
    );
  }
  return createServiceClient(url, serviceKey);
}

/**
 * Returns true if the user has hit the daily grading attempt cap for this
 * course + kind (max 3 per user per course per 24 hours).
 */
export async function hasExceededDailyLimit(
  userId: string,
  courseSlug: string,
  kind: GradingKind
): Promise<boolean> {
  const supabase = getGradingServiceClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from("grading_attempts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("course_slug", courseSlug)
    .eq("kind", kind)
    .gte("created_at", since);

  if (error) throw error;
  return (count ?? 0) >= MAX_GRADING_ATTEMPTS_PER_DAY;
}

export async function recordGradingAttempt(
  userId: string,
  courseSlug: string,
  kind: GradingKind,
  submissionHash: string
) {
  const supabase = getGradingServiceClient();
  const { error } = await supabase.from("grading_attempts").insert({
    user_id: userId,
    course_slug: courseSlug,
    kind,
    submission_hash: submissionHash,
  });
  if (error) throw error;
}

export async function getCachedGrade(
  userId: string,
  courseSlug: string,
  kind: GradingKind,
  submissionHash: string
): Promise<Record<string, unknown> | null> {
  const supabase = getGradingServiceClient();
  const { data, error } = await supabase
    .from("grading_cache")
    .select("result")
    .eq("user_id", userId)
    .eq("course_slug", courseSlug)
    .eq("kind", kind)
    .eq("submission_hash", submissionHash)
    .maybeSingle();

  if (error) throw error;
  return (data?.result as Record<string, unknown>) ?? null;
}

export async function saveGradeToCache(
  userId: string,
  courseSlug: string,
  kind: GradingKind,
  submissionHash: string,
  result: Record<string, unknown>
) {
  const supabase = getGradingServiceClient();
  const { error } = await supabase.from("grading_cache").upsert(
    {
      user_id: userId,
      course_slug: courseSlug,
      kind,
      submission_hash: submissionHash,
      result,
    },
    { onConflict: "user_id,course_slug,kind,submission_hash" }
  );
  if (error) throw error;
}

/**
 * Calls the Claude API and returns the text content of the response.
 * Throws if ANTHROPIC_API_KEY is not configured.
 */
export async function callClaude(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 1024
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Claude API error (${res.status}): ${detail}`);
  }

  const data = await res.json();
  const text = data?.content?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("Unexpected Claude API response shape");
  }
  return text;
}

/**
 * Extracts the first JSON object found in a string (Claude sometimes wraps
 * JSON in markdown code fences or surrounding text).
 */
export function extractJson(text: string): Record<string, unknown> {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON object found in Claude response");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

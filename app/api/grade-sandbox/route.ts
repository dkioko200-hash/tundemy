import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import {
  callClaude,
  countWords,
  extractJson,
  getCachedGrade,
  hasExceededDailyLimit,
  hashSubmission,
  recordGradingAttempt,
  saveGradeToCache,
  truncateToWords,
  SONNET_MODEL,
} from "@/lib/grading";

export async function POST(req: NextRequest) {
  const { limited, resetAt } = checkRateLimit(`grade-sandbox:${getClientIp(req)}`, 10);
  if (limited) return rateLimitResponse(resetAt);

  try {
    const { courseSlug, lessonNumber, sandboxTask, submission } = await req.json();
    if (!courseSlug || !sandboxTask || typeof submission !== "string" || !submission.trim()) {
      return NextResponse.json({ error: "courseSlug, sandboxTask, and submission are required" }, { status: 400 });
    }
    if (submission.length > 20000) {
      return NextResponse.json({ error: "Submission is too long (max 20,000 characters)." }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const gradingKey = `${courseSlug}-L${lessonNumber ?? 0}`;
    const truncated = truncateToWords(submission, 800);
    const submissionHash = hashSubmission(truncated);

    const cached = await getCachedGrade(user.id, gradingKey, "capstone", submissionHash);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    if (await hasExceededDailyLimit(user.id, gradingKey, "capstone")) {
      return NextResponse.json(
        { error: "You have reached the maximum of 3 grading attempts for this lesson in 24 hours. Please try again later." },
        { status: 429 }
      );
    }

    const systemPrompt = [
      "You are grading a hands-on sandbox exercise for Tundemy, an AI skills platform for African professionals.",
      "",
      "Exercise task:",
      sandboxTask,
      "",
      "Grade the submission on four criteria:",
      "- Depth and Completeness (30 pts): Addresses every part of the task; demonstrates real understanding, not surface-level awareness",
      "- Specificity and Context (30 pts): Uses specific Kenyan/African business names, real KSh amounts, named tools/APIs - not vague generalities like 'a Kenyan company'",
      "- Structure and Clarity (20 pts): Well-organised with numbered steps, bullet points, or clear logical paragraphs",
      "- Actionability (20 pts): Concrete, immediately implementable actions - not abstract descriptions",
      "",
      "Total 0-100. PASSES if total >= 80.",
      "Be strict: reward depth and specificity; penalise vague, generic, or incomplete answers.",
      "",
      "CRITICAL INSTRUCTION: Your feedback must directly reference the student's actual words. Quote or paraphrase their specific phrases. Never say 'add more detail' without naming the exact missing detail. Never say 'be more specific' without giving a concrete example of the specificity required.",
      "",
      "Respond with ONLY this JSON object (no markdown fences, no extra text):",
      "{",
      '  "score": <number 0-100>,',
      '  "passed": <true if score >= 80, false otherwise>,',
      '  "feedback": "<1-2 sentence overall verdict referencing their specific submission>",',
      '  "rubricScores": [',
      '    {"criterion": "Depth and Completeness", "score": <0-30>, "max": 30, "comment": "<one sentence>"},',
      '    {"criterion": "Specificity and Context", "score": <0-30>, "max": 30, "comment": "<one sentence>"},',
      '    {"criterion": "Structure and Clarity", "score": <0-20>, "max": 20, "comment": "<one sentence>"},',
      '    {"criterion": "Actionability", "score": <0-20>, "max": 20, "comment": "<one sentence>"}',
      "  ],",
      '  "didWell": ["<specific strength>", "<second specific strength>"],',
      '  "improvements": [{"area": "<criterion>", "missing": "<what is absent>", "whyMatters": "<why it matters>", "betterExample": "<concrete example>"}],',
      '  "specificFixes": ["<fix 1>", "<fix 2>", "<fix 3 if needed>"]',
      "}",
    ].join("\n");

    const userPrompt = "Submission (" + countWords(truncated) + " words):\n\n" + truncated;

    let result: Record<string, unknown>;
    try {
      const raw = await callClaude(SONNET_MODEL, systemPrompt, userPrompt, 2048);
      result = extractJson(raw);
    } catch (err) {
      console.error("[grade-sandbox] Claude call failed:", err);
      return NextResponse.json({ error: "Grading is temporarily unavailable. Please try again later." }, { status: 503 });
    }

    await recordGradingAttempt(user.id, gradingKey, "capstone", submissionHash);
    await saveGradeToCache(user.id, gradingKey, "capstone", submissionHash, result);

    return NextResponse.json({ ...result, cached: false });
  } catch (err) {
    console.error("[grade-sandbox]", err);
    const errMsg = err instanceof Error ? err.message : String(err);
    const message = errMsg.includes("SUPABASE_SERVICE_ROLE_KEY")
      ? "Grading is misconfigured on the server. Please contact support."
      : "Grading is temporarily unavailable. Please try again later.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

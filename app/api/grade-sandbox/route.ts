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

    const systemPrompt = `You are grading a hands-on sandbox exercise for Tundemy, an AI skills platform for African professionals.

Exercise task:
${sandboxTask}

Grade the submission on four criteria:
- Depth and Completeness (30 pts): Addresses every part of the task; demonstrates real understanding, not surface-level awareness
- Specificity and Context (30 pts): Uses specific Kenyan/African business names, real KSh amounts, named tools/APIs — not vague generalities like "a Kenyan company"
- Structure and Clarity (20 pts): Well-organised with numbered steps, bullet points, or clear logical paragraphs
- Actionability (20 pts): Concrete, immediately implementable actions — not abstract descriptions

Total 0-100. PASSES if total >= 80.
Be strict: reward depth and specificity; penalise vague, generic, or incomplete answers.

CRITICAL INSTRUCTION: Your feedback must directly reference the student's actual words. Quote or paraphrase their specific phrases. Never say "add more detail" without naming the exact missing detail. Never say "be more specific" without giving a concrete example of the specificity required.

Respond with ONLY this JSON object (no markdown fences, no extra text):
{
  "score": <number 0-100>,
  "passed": <true if score >= 80, false otherwise>,
  "feedback": "<1-2 sentence overall verdict referencing their specific submission>",
  "rubricScores": [
    {"criterion": "Depth and Completeness", "score": <0-30>, "max": 30, "comment": "<one sentence quoting or referencing their actual answer>"},
    {"criterion": "Specificity and Context", "score": <0-30>, "max": 30, "comment": "<one sentence naming what specific details were present or missing>"},
    {"criterion": "Structure and Clarity", "score": <0-20>, "max": 20, "comment": "<one sentence>"},
    {"criterion": "Actionability", "score": <0-20>, "max": 20, "comment": "<one sentence>"}
  ],
  "didWell": [
    "<specific strength — quote or paraphrase their actual words, explain why it is good>",
    "<second specific strength>"
  ],
  "improvements": [
    {
      "area": "<criterion name>",
      "missing": "<exactly what is absent or wrong in their answer — be direct>",
      "whyMatters": "<why this gap matters in a real Kenyan business context>",
      "betterExample": "<a concrete example of what a stronger answer looks like — give real names, numbers, or steps>"
    }
  ],
  "specificFixes": [
    "<actionable fix 1 — tell them exactly what to write, not just what category to improve>",
    "<actionable fix 2>",
    "<actionable fix 3 if needed>"
  ]
}`;

    const userPrompt = `Submission (${countWords(truncated)} words):\n\n${truncated}`;

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
    const message =
      err instanceof Error && err.message.includes("SUPABASE_SERVICE_ROLE_KEY")
        ? "Grading is misconfigured on the server (missing service role key). Please contact support."
        : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

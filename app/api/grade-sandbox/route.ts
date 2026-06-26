import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
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
  try {
    const { courseSlug, lessonNumber, sandboxTask, submission } = await req.json();
    if (!courseSlug || !sandboxTask || typeof submission !== "string" || !submission.trim()) {
      return NextResponse.json({ error: "courseSlug, sandboxTask, and submission are required" }, { status: 400 });
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

Grade the submission on these four criteria:
- Depth and Completeness (30 points): Addresses all parts of the task thoroughly; demonstrates genuine understanding
- Specificity and Context (30 points): Uses specific Kenyan/African business examples, real numbers, named tools — not vague generalities
- Structure and Clarity (20 points): Well-organized with clear structure (numbered steps, bullet points, or logical paragraphs)
- Actionability (20 points): Contains concrete, implementable actions — not just abstract descriptions

Total 0-100. PASSES if total >= 70.
Be strict: reward depth and specificity, penalize vague or generic responses.

Respond with ONLY this JSON (no markdown fences, no extra text):
{
  "score": <number 0-100>,
  "passed": <boolean>,
  "feedback": "<2-3 sentences: what was done well and one specific improvement>",
  "rubricScores": [
    {"criterion": "Depth and Completeness", "score": <0-30>, "max": 30, "comment": "<one sentence>"},
    {"criterion": "Specificity and Context", "score": <0-30>, "max": 30, "comment": "<one sentence>"},
    {"criterion": "Structure and Clarity", "score": <0-20>, "max": 20, "comment": "<one sentence>"},
    {"criterion": "Actionability", "score": <0-20>, "max": 20, "comment": "<one sentence>"}
  ]
}`;

    const userPrompt = `Submission (${countWords(truncated)} words):\n\n${truncated}`;

    let result: Record<string, unknown>;
    try {
      const raw = await callClaude(SONNET_MODEL, systemPrompt, userPrompt, 1024);
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

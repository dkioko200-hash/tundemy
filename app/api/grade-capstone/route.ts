import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getCourseContentBySlug } from "@/lib/course-content";
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
    const { courseSlug, submission } = await req.json();
    if (!courseSlug || typeof submission !== "string" || !submission.trim()) {
      return NextResponse.json({ error: "courseSlug and submission are required" }, { status: 400 });
    }

    const course = getCourseContentBySlug(courseSlug);
    const capstone = course?.capstone;
    if (!capstone) {
      return NextResponse.json({ error: "No capstone found for this course" }, { status: 404 });
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

    // (a) truncate to 800 words before sending to the API
    const truncated = truncateToWords(submission);
    const submissionHash = hashSubmission(truncated);

    // (c) return cached result if user resubmits the same capstone
    const cached = await getCachedGrade(user.id, courseSlug, "capstone", submissionHash);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    // (b) max 3 grading attempts per user per course per 24hrs
    if (await hasExceededDailyLimit(user.id, courseSlug, "capstone")) {
      return NextResponse.json(
        { error: "You have reached the maximum of 3 grading attempts for this capstone in 24 hours. Please try again later." },
        { status: 429 }
      );
    }

    const rubric = capstone.rubric;
    const rubricLines = Object.entries(rubric)
      .map(([key, dim]) => `- ${key} (weight ${dim.weight}): ${dim.description}`)
      .join("\n");

    const systemPrompt = `You are grading a capstone project submission for the Tundemy course "${course?.title}". Tundemy is an AI skills platform for African professionals.

Capstone task:
${capstone.task}

Grading rubric (weights sum to 100):
${rubricLines}

Score each rubric dimension from 0-100, then compute a weighted overall score (0-100) using the given weights.
A submission passes if the overall score is at least ${capstone.passingScore}.

CRITICAL INSTRUCTION: Your feedback must directly reference the student's actual words. Quote or paraphrase their specific phrases. Never say "add more detail" without naming the exact missing detail. Give concrete examples of what stronger answers look like with real Kenyan business names, KSh amounts, and specific tool/API names.

Respond with ONLY a JSON object (no markdown fences, no extra text) in exactly this format:
{
  "overallScore": <number 0-100>,
  "passed": <true if overallScore >= ${capstone.passingScore}, false otherwise>,
  "dimensionScores": { "<rubricKey>": <0-100>, ... },
  "feedback": "<1-2 sentence overall verdict referencing their specific submission>",
  "didWell": [
    "<specific strength — quote or paraphrase their actual words, explain why it is good>",
    "<second specific strength>"
  ],
  "improvements": [
    {
      "area": "<rubric dimension name>",
      "missing": "<exactly what is absent or wrong — be direct and reference their actual answer>",
      "whyMatters": "<why this gap matters in a real Kenyan business context>",
      "betterExample": "<concrete example of what a stronger answer looks like — real names, amounts, steps>"
    }
  ],
  "specificFixes": [
    "<actionable fix 1 — tell them exactly what to write, not just what category to improve>",
    "<actionable fix 2>",
    "<actionable fix 3 if needed>"
  ]
}`;

    const userPrompt = `Submission (max ${countWords(truncated)} words):\n\n${truncated}`;

    let result: Record<string, unknown>;
    try {
      const raw = await callClaude(SONNET_MODEL, systemPrompt, userPrompt, 2048);
      result = extractJson(raw);
    } catch (err) {
      console.error("[grade-capstone] Claude call failed:", err);
      return NextResponse.json({ error: "Grading is temporarily unavailable. Please try again later." }, { status: 503 });
    }

    await recordGradingAttempt(user.id, courseSlug, "capstone", submissionHash);
    await saveGradeToCache(user.id, courseSlug, "capstone", submissionHash, result);

    return NextResponse.json({ ...result, cached: false });
  } catch (err) {
    console.error("[grade-capstone]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

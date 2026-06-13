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

    const systemPrompt = `You are grading a capstone submission for the Tundemy course "${course?.title}".

Capstone task:
${capstone.task}

Grading rubric (weights sum to 100):
${rubricLines}

Score each rubric dimension from 0-100, then compute a weighted overall score (0-100) using the given weights.
A submission passes if the overall score is at least ${capstone.passingScore}.

Respond with ONLY a JSON object in exactly this format:
{
  "overallScore": number,
  "passed": boolean,
  "dimensionScores": { "<rubricKey>": number, ... },
  "feedback": "2-4 sentence summary of strengths and what to improve"
}`;

    const userPrompt = `Submission (max ${countWords(truncated)} words):\n\n${truncated}`;

    let result: Record<string, unknown>;
    try {
      const raw = await callClaude(SONNET_MODEL, systemPrompt, userPrompt, 1024);
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

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getAssessmentTrack } from "@/lib/assessment-tracks";
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
  HAIKU_MODEL,
} from "@/lib/grading";

export async function POST(req: NextRequest) {
  try {
    const { track, submission } = await req.json();
    if (!track || typeof submission !== "string" || !submission.trim()) {
      return NextResponse.json({ error: "track and submission are required" }, { status: 400 });
    }

    const trackMeta = getAssessmentTrack(track);
    if (!trackMeta) {
      return NextResponse.json({ error: "Unknown assessment track" }, { status: 404 });
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
    const wordCount = countWords(truncated);
    if (wordCount < trackMeta.minWords) {
      return NextResponse.json(
        { error: `Submission must be at least ${trackMeta.minWords} words (got ${wordCount}).` },
        { status: 400 }
      );
    }

    const submissionHash = hashSubmission(truncated);

    // (c) return cached result if user resubmits the same assessment
    const cached = await getCachedGrade(user.id, track, "assessment", submissionHash);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    // (b) max 3 grading attempts per user per track per 24hrs
    if (await hasExceededDailyLimit(user.id, track, "assessment")) {
      return NextResponse.json(
        { error: "You have reached the maximum of 3 grading attempts for this assessment in 24 hours. Please try again later." },
        { status: 429 }
      );
    }

    const rubric = trackMeta.rubric;
    const rubricLines = Object.entries(rubric)
      .map(([key, dim]) => `- ${key} (weight ${dim.weight}): ${dim.description}`)
      .join("\n");

    const systemPrompt = `You are grading a practical assessment submission for the Tundemy "${trackMeta.label}" certification track.

Assessment task:
${trackMeta.task}

Grading rubric (weights sum to 100):
${rubricLines}

Score each rubric dimension from 0-100, then compute a weighted overall score (0-100) using the given weights.
A submission passes if the overall score is at least ${trackMeta.passingScore}.

Respond with ONLY a JSON object in exactly this format:
{
  "overallScore": number,
  "passed": boolean,
  "dimensionScores": { "<rubricKey>": number, ... },
  "feedback": "2-4 sentence summary of strengths and what to improve"
}`;

    const userPrompt = `Submission (${wordCount} words):\n\n${truncated}`;

    let result: Record<string, unknown>;
    try {
      const raw = await callClaude(HAIKU_MODEL, systemPrompt, userPrompt, 1024);
      result = extractJson(raw);
    } catch (err) {
      console.error("[grade-assessment] Claude call failed:", err);
      return NextResponse.json({ error: "Grading is temporarily unavailable. Please try again later." }, { status: 503 });
    }

    await recordGradingAttempt(user.id, track, "assessment", submissionHash);
    await saveGradeToCache(user.id, track, "assessment", submissionHash, result);

    return NextResponse.json({ ...result, cached: false });
  } catch (err) {
    console.error("[grade-assessment]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = getServiceClient();

    // Get all grading attempts for this user, most recent first
    const { data: attempts, error: attemptsErr } = await admin
      .from("grading_attempts")
      .select("course_slug, submission_hash, kind, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (attemptsErr) {
      console.error("[sandbox/submissions] attempts fetch error:", attemptsErr);
      return NextResponse.json([]);
    }

    if (!attempts || attempts.length === 0) {
      return NextResponse.json([]);
    }

    // Sandbox exercises have course_slug like "ai-foundations-L3" (contains "-L")
    // Capstones have plain slugs like "ai-foundations"
    // Show both but tag them
    const withResults = await Promise.all(
      attempts.map(async (attempt) => {
        const { data: cache } = await admin
          .from("grading_cache")
          .select("result")
          .eq("user_id", user.id)
          .eq("course_slug", attempt.course_slug)
          .eq("kind", attempt.kind)
          .eq("submission_hash", attempt.submission_hash)
          .maybeSingle();

        const result = (cache?.result ?? null) as Record<string, unknown> | null;

        // Parse course slug — sandbox keys are "slug-L{n}", capstones are plain slugs
        const lessonMatch = attempt.course_slug.match(/^(.+)-L(\d+)$/);
        const baseCourseSlug = lessonMatch ? lessonMatch[1] : attempt.course_slug;
        const lessonId = lessonMatch ? parseInt(lessonMatch[2]) : null;
        const isSandbox = !!lessonMatch;

        return {
          id: `${attempt.course_slug}-${attempt.submission_hash.slice(0, 8)}`,
          course_slug: baseCourseSlug,
          lesson_id: lessonId,
          is_sandbox: isSandbox,
          submitted_at: attempt.created_at,
          score: typeof result?.score === "number" ? result.score : undefined,
          passed: typeof result?.passed === "boolean" ? result.passed : undefined,
          feedback: typeof result?.feedback === "string" ? result.feedback : undefined,
          rubric_scores: result?.rubricScores ?? null,
          did_well: Array.isArray(result?.didWell) ? result.didWell : [],
          improvements: Array.isArray(result?.improvements) ? result.improvements : [],
          specific_fixes: Array.isArray(result?.specificFixes) ? result.specificFixes : [],
        };
      })
    );

    return NextResponse.json(withResults);
  } catch (err) {
    console.error("[sandbox/submissions]", err);
    return NextResponse.json([]);
  }
}

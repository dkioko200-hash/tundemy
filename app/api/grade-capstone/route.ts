import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { courseSlug?: string; lessonIndex?: number; submission?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { courseSlug, lessonIndex, submission } = body;
  if (!courseSlug || lessonIndex === undefined || !submission) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check enrollment
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug)
    .single();
  if (!enrollment) return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

  // Check if already passed
  const { data: existing } = await supabase
    .from("lesson_progress")
    .select("passed")
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug)
    .eq("lesson_index", lessonIndex)
    .single();
  if (existing?.passed) {
    return NextResponse.json({ passed: true, cached: true, feedback: "Already passed." });
  }

  // Get course content
  const { getCourseContentBySlug } = await import("@/lib/course-content");
  const content = getCourseContentBySlug(courseSlug);
  if (!content) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  const lesson = content.lessons[lessonIndex];
  if (!lesson || lesson.type !== "project") {
    return NextResponse.json({ error: "Not a capstone lesson" }, { status: 400 });
  }

  // Grade with Claude
  const prompt = `You are grading a capstone project submission for the course "${content.title}".

Lesson: ${lesson.title}
Requirements: ${lesson.gradingCriteria || "Demonstrate understanding of the course concepts."}

Student submission:
${submission}

Grade this submission. Respond with valid JSON only (no markdown):
{
  "passed": true/false,
  "score": 0-100,
  "feedback": "Detailed feedback paragraph",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"]
}

Pass if the submission demonstrates solid understanding and effort (score >= 60).`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  let result: { passed: boolean; score: number; feedback: string; strengths: string[]; improvements: string[] };
  try {
    const text = response.content[0].type === "text" ? response.content[0].text : "";
    result = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Failed to parse grading response" }, { status: 500 });
  }

  try {
    // Save progress
    await supabase.from("lesson_progress").upsert({
      user_id: user.id,
      course_slug: courseSlug,
      lesson_index: lessonIndex,
      passed: result.passed,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,course_slug,lesson_index" });

    if (result.passed) {
      // Upsert capstone work record with full submission data
      await supabase.from("talent_capstone_work").upsert({
        user_id: user.id,
        course_slug: courseSlug,
        submission_text: submission,
        grading_detail: result,
        passed: true,
        score: result.score,
        feedback: result.feedback,
        submitted_at: new Date().toISOString(),
      }, { onConflict: "user_id,course_slug" })
        .then(({ error }: { error: unknown }) => {
          if (error) console.error("[grade-capstone] talent_capstone_work upsert failed:", error);
        });

      // 2. Trigger AI profile regeneration in the background
      const origin = req.nextUrl.origin;
      fetch(`${origin}/api/talent/generate-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.get("cookie") || "",
        },
        body: JSON.stringify({ user_id: user.id, course_slug: courseSlug }),
      }).catch(() => {});
    }
  } catch (err) {
    console.error("[grade-capstone] db error:", err);
  }

  try {
    return NextResponse.json({ ...result, cached: false });
  } catch (err) {
    console.error("[grade-capstone]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

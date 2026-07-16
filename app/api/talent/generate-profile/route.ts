import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { getCourseBySlug } from "@/lib/courses";
import { callClaude, extractJson, SONNET_MODEL } from "@/lib/grading";
import { encrypt } from "@/lib/encryption";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface CapstoneRecord {
  course_slug: string;
  title: string;
  summary: string;
  score: number | null;
}

/**
 * Generates (or regenerates) a Tundemy-AI-written talent profile: headline,
 * bio, skill tags, and a polished one-paragraph summary per passed capstone.
 *
 * Can be called two ways:
 *  1. By the user, from the profile editor — regenerates from whatever
 *     capstones are already on record.
 *  2. Internally by /api/grade-capstone right after a capstone passes —
 *     pass { courseSlug, capstoneResult } so this route can persist that
 *     capstone's record even before it has its own durable table entry.
 */
export async function POST(req: NextRequest) {
  const { limited, resetAt } = checkRateLimit(`gen-profile:${getClientIp(req)}`, 5);
  if (limited) return rateLimitResponse(resetAt);

  try {
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

    const body = await req.json().catch(() => ({}));
    const { courseSlug, capstoneResult } = body as {
      courseSlug?: string;
      capstoneResult?: { overallScore?: number; passed?: boolean; feedback?: string };
    };

    const admin = getServiceClient();

    // If this call came from a fresh capstone pass, ensure a row exists.
    // grade-capstone already upserted the full data (submission_text, grading_detail),
    // so use ignoreDuplicates:true here to avoid overwriting those richer fields.
    if (courseSlug && capstoneResult?.passed) {
      const course = getCourseBySlug(courseSlug);
      await admin.from("talent_capstone_work").upsert(
        {
          user_id: user.id,
          course_slug: courseSlug,
          title: course?.title ? `${course.title} -- Capstone Project` : `${courseSlug} -- Capstone Project`,
          summary: capstoneResult.feedback || `Completed the ${course?.title ?? courseSlug} capstone project.`,
          score: typeof capstoneResult.overallScore === "number" ? Math.round(capstoneResult.overallScore) : null,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,course_slug", ignoreDuplicates: true }
      );
    }

    const { data: capstones, error: capstoneErr } = await admin
      .from("talent_capstone_work")
      .select("course_slug, title, summary, score")
      .eq("user_id", user.id);

    if (capstoneErr) {
      console.error("[generate-profile] capstone fetch error:", capstoneErr);
      return NextResponse.json({ error: "Could not load capstone history" }, { status: 500 });
    }

    if (!capstones || capstones.length === 0) {
      return NextResponse.json(
        { error: "No passed capstones found yet — complete at least one course capstone first." },
        { status: 400 }
      );
    }

    const { data: profileRow } = await admin
      .from("talent_profiles")
      .select("full_name, phone")
      .eq("user_id", user.id)
      .maybeSingle();

    const fullName: string = profileRow?.full_name || user.email?.split("@")[0] || "This professional";

    const courseContext = (capstones as CapstoneRecord[]).map((c) => {
      const course = getCourseBySlug(c.course_slug);
      return {
        course_slug: c.course_slug,
        title: course?.title ?? c.course_slug,
        track: course?.tag ?? "AI Professional",
        level: course?.level ?? "Intermediate",
        capstone_title: c.title,
        score: c.score,
        raw_summary: c.summary,
        skills_taught: course?.what_you_will_learn ?? [],
      };
    });

    const systemPrompt = `You are writing professional portfolio content for ${fullName}, who has completed and passed capstone projects through Tundemy, an AI skills certification platform for African professionals.

Write like a confident professional CV/portfolio writer, not a course description. NEVER use the words "student", "learner", "course", or "studied" to describe what they did. Always describe completed work using verbs like built, developed, designed, implemented, deployed, automated. Be specific — reference real tools, APIs, and Kenyan/African business context (M-Pesa, WhatsApp Business API, Nairobi SMEs, Kenyan agriculture, etc.) drawn from the project details given to you, not generic filler.

Respond with ONLY a JSON object (no markdown fences, no extra text) in exactly this format:
{
  "headline": "<one punchy professional headline, max 80 characters, no quotes>",
  "bio": "<120-180 word third-person-free professional bio written in first person, describing what they have built and what they can do for an employer>",
  "skills": ["<8 to 14 specific, concrete skill tags — e.g. 'WhatsApp Cloud API Integration', 'M-Pesa Daraja STK Push', 'RAG Pipeline Design' — not vague terms like 'AI'>"],
  "capstone_summaries": [
    { "course_slug": "<slug>", "title": "<short professional project title>", "summary": "<2-3 sentence accomplishment-style summary of what they built in this project and the result>" }
  ]
}`;

    const userPrompt = `Completed and passed capstone projects:\n\n${JSON.stringify(courseContext, null, 2)}`;

    let generated: {
      headline?: string;
      bio?: string;
      skills?: string[];
      capstone_summaries?: { course_slug: string; title: string; summary: string }[];
    };
    try {
      const raw = await callClaude(SONNET_MODEL, systemPrompt, userPrompt, 2048);
      generated = extractJson(raw);
    } catch (err) {
      console.error("[generate-profile] Claude call failed:", err);
      return NextResponse.json({ error: "Profile generation is temporarily unavailable. Please try again later." }, { status: 503 });
    }

    const headline = (generated.headline || "").trim().slice(0, 120);
    const bio = (generated.bio || "").trim();
    const skills = Array.isArray(generated.skills) ? generated.skills.filter((s) => typeof s === "string").slice(0, 16) : [];
    const summaries = Array.isArray(generated.capstone_summaries) ? generated.capstone_summaries : [];

    const { error: profileUpdateErr } = await admin.from("talent_profiles").upsert(
      {
        user_id: user.id,
        auto_headline: headline,
        auto_bio: bio,
        skills,
        profile_complete: true,
        last_generated_at: new Date().toISOString(),
        // Encrypt contact fields at rest (phone may already be encrypted if
        // the student saved their profile via /api/talent/save-profile)
        contact_email: user.email ? encrypt(user.email) : null,
        contact_phone: profileRow?.phone ? encrypt(profileRow.phone) : null,
      },
      { onConflict: "user_id" }
    );
    if (profileUpdateErr) {
      console.error("[generate-profile] talent_profiles upsert error:", profileUpdateErr);
      return NextResponse.json({ error: "Could not save generated profile" }, { status: 500 });
    }

    // Persist polished capstone summaries back over the raw ones.
    for (const s of summaries) {
      if (!s.course_slug) continue;
      await admin.from("talent_capstone_work").update({
        title: s.title || undefined,
        summary: s.summary || undefined,
      }).eq("user_id", user.id).eq("course_slug", s.course_slug);
    }

    // Award a badge for each course with a passed capstone, if not already awarded.
    for (const ctx of courseContext) {
      await admin.from("talent_badges").upsert(
        {
          user_id: user.id,
          course_slug: ctx.course_slug,
          badge_name: `${ctx.title} — Verified`,
          icon: "✅",
        },
        { onConflict: "user_id,course_slug" }
      );
    }

    return NextResponse.json({
      ok: true,
      headline,
      bio,
      skills,
      capstone_summaries: summaries,
    });
  } catch (err) {
    console.error("[generate-profile]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

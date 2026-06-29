import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { callClaude, extractJson, SONNET_MODEL } from "@/lib/grading";

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface CandidateRow {
  user_id: string;
  full_name: string;
  headline: string | null;
  auto_headline: string | null;
  bio: string | null;
  auto_bio: string | null;
  skills: string[] | null;
  self_reported_skills: string[] | null;
  years_experience: number | null;
  availability: string | null;
}

export async function POST(req: NextRequest) {
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
    const { jobId } = body as { jobId?: string };
    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const admin = getServiceClient();

    const { data: job, error: jobErr } = await admin
      .from("job_postings")
      .select("id, employer_id, title, description, required_skills, job_type, experience_level, location")
      .eq("id", jobId)
      .single();

    if (jobErr || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    if (job.employer_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: candidates, error: candidateErr } = await admin
      .from("talent_profiles")
      .select("user_id, full_name, headline, auto_headline, bio, auto_bio, skills, self_reported_skills, years_experience, availability")
      .eq("is_visible", true)
      .eq("profile_complete", true)
      .limit(60);

    if (candidateErr) {
      console.error("[match-talent] candidate fetch error:", candidateErr);
      return NextResponse.json({ error: "Could not load candidates" }, { status: 500 });
    }

    if (!candidates || candidates.length === 0) {
      return NextResponse.json({ matches: [] });
    }

    const candidateContext = (candidates as CandidateRow[]).map((c) => ({
      user_id: c.user_id,
      full_name: c.full_name,
      headline: c.headline || c.auto_headline || "",
      bio: c.bio || c.auto_bio || "",
      skills: Array.from(new Set([...(c.skills ?? []), ...(c.self_reported_skills ?? [])])),
      years_experience: c.years_experience ?? 0,
      availability: c.availability ?? "available",
    }));

    const systemPrompt = `You are an AI recruiting assistant for Tundemy, an AI skills certification platform for African professionals. Rank the given candidate pool against a specific job posting and return the best 10 matches, ranked best first.

Job posting:
Title: ${job.title}
Type: ${job.job_type} · Experience level: ${job.experience_level} · Location: ${job.location ?? "Remote"}
Required skills: ${(job.required_skills ?? []).join(", ") || "Not specified"}
Description: ${job.description}

Score each candidate's fit from 0-100 based on skill overlap, relevant project/bio evidence, and experience level alignment. Favor candidates whose availability is "available" over "open_to_offers", and deprioritize "not_available" unless they're an exceptionally strong fit.

Respond with ONLY a JSON object (no markdown fences, no extra text) in exactly this format:
{
  "matches": [
    { "user_id": "<uuid>", "match_score": <0-100>, "match_reason": "<1-2 sentence concrete reason citing specific skills or experience>" }
  ]
}
Return at most 10 matches, only include candidates with match_score >= 40, ranked highest score first.`;

    const userPrompt = `Candidate pool:\n\n${JSON.stringify(candidateContext, null, 2)}`;

    let result: { matches?: { user_id: string; match_score: number; match_reason: string }[] };
    try {
      const raw = await callClaude(SONNET_MODEL, systemPrompt, userPrompt, 2048);
      result = extractJson(raw);
    } catch (err) {
      console.error("[match-talent] Claude call failed:", err);
      return NextResponse.json({ error: "Matching is temporarily unavailable. Please try again later." }, { status: 503 });
    }

    const rawMatches = Array.isArray(result.matches) ? result.matches : [];
    const candidateById = new Map(candidateContext.map((c) => [c.user_id, c]));

    const matches = rawMatches
      .filter((m) => m && candidateById.has(m.user_id))
      .slice(0, 10)
      .map((m) => ({
        user_id: m.user_id,
        full_name: candidateById.get(m.user_id)!.full_name,
        match_score: Math.max(0, Math.min(100, Math.round(m.match_score))),
        match_reason: (m.match_reason || "").trim(),
      }));

    return NextResponse.json({ matches });
  } catch (err) {
    console.error("[match-talent]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

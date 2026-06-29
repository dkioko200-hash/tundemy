import { NextResponse } from "next/server";

// DEV-ONLY: one-off schema verification for the Phase 2 migration, using the
// service-role REST client (no DATABASE_URL needed). Confirms the new
// talent_profiles columns and the 3 new tables exist before building API
// routes against them. Safe to delete after use.
export async function GET() {
  if (process.env.NODE_ENV !== "development" || process.env.NEXT_PUBLIC_APP_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not set" }, { status: 400 });
  }
  const { createClient } = await import("@supabase/supabase-js");
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);

  const checks: Record<string, { ok: boolean; error: string | null }> = {};

  const colCheck = await admin
    .from("talent_profiles")
    .select("auto_bio, auto_headline, phone, availability, self_reported_skills, self_reported_experience, self_reported_projects, profile_complete, last_generated_at")
    .limit(1);
  checks["talent_profiles_new_columns"] = { ok: !colCheck.error, error: colCheck.error?.message ?? null };

  for (const table of ["talent_badges", "talent_capstone_work", "job_postings", "employer_unlocks"]) {
    const r = await admin.from(table).select("*").limit(1);
    checks[table] = { ok: !r.error, error: r.error?.message ?? null };
  }

  const gradingTables: Record<string, unknown> = {};
  for (const table of ["grading_cache", "grading_attempts", "profiles", "enrollments", "talent_profiles"]) {
    const r = await admin.from(table).select("*").limit(1);
    gradingTables[table] = {
      ok: !r.error,
      error: r.error?.message ?? null,
      columns: r.data?.[0] ? Object.keys(r.data[0]) : null,
    };
  }

  return NextResponse.json({ checks, gradingTables });
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { decrypt } from "@/lib/encryption";

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Returns all data Tundemy holds for the authenticated user as a downloadable
 * JSON file.
 *
 * Required by Kenya Data Protection Act 2019, Article 26 (right of access /
 * right to data portability).
 */
export async function GET() {
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

    const uid = user.id;
    const admin = getServiceClient();

    // Collect all user data in parallel
    const [
      profileRes,
      talentProfileRes,
      enrollmentsRes,
      progressRes,
      certificatesRes,
      gradingAttemptsRes,
      gradingCacheRes,
      badgesRes,
      capstoneWorkRes,
    ] = await Promise.allSettled([
      admin.from("profiles").select("*").eq("id", uid).maybeSingle(),
      admin.from("talent_profiles").select("*").eq("user_id", uid).maybeSingle(),
      admin.from("enrollments").select("*").eq("user_id", uid),
      admin.from("progress").select("*").eq("user_id", uid),
      admin.from("certificates").select("*").eq("user_id", uid),
      admin.from("grading_attempts").select("course_slug, kind, attempted_at").eq("user_id", uid),
      admin.from("grading_cache").select("course_slug, kind, score, feedback, created_at").eq("user_id", uid),
      admin.from("talent_badges").select("*").eq("user_id", uid),
      admin.from("talent_capstone_work").select("*").eq("user_id", uid),
    ]);

    // Decrypt sensitive fields in talent_profiles before including in export
    let talentProfile = talentProfileRes.status === "fulfilled" ? talentProfileRes.value.data : null;
    if (talentProfile) {
      talentProfile = {
        ...talentProfile,
        phone: talentProfile.phone ? decrypt(talentProfile.phone) : null,
        contact_email: talentProfile.contact_email ? decrypt(talentProfile.contact_email) : null,
        contact_phone: talentProfile.contact_phone ? decrypt(talentProfile.contact_phone) : null,
      };
    }

    const exportPayload = {
      exported_at: new Date().toISOString(),
      platform: "Tundemy",
      legal_basis: "Kenya Data Protection Act 2019 — Right of Access (Article 26)",
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        email_confirmed_at: user.email_confirmed_at,
      },
      profile: profileRes.status === "fulfilled" ? profileRes.value.data : null,
      talent_profile: talentProfile,
      enrollments: enrollmentsRes.status === "fulfilled" ? enrollmentsRes.value.data : [],
      course_progress: progressRes.status === "fulfilled" ? progressRes.value.data : [],
      certificates: certificatesRes.status === "fulfilled" ? certificatesRes.value.data : [],
      grading_history: {
        attempts: gradingAttemptsRes.status === "fulfilled" ? gradingAttemptsRes.value.data : [],
        // Note: raw Claude prompts are not included — only scores and public feedback
        cached_scores: gradingCacheRes.status === "fulfilled" ? gradingCacheRes.value.data : [],
      },
      badges: badgesRes.status === "fulfilled" ? badgesRes.value.data : [],
      capstone_work: capstoneWorkRes.status === "fulfilled" ? capstoneWorkRes.value.data : [],
    };

    const json = JSON.stringify(exportPayload, null, 2);

    return new NextResponse(json, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="tundemy-my-data.json"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[export-data]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

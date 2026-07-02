import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { encrypt } from "@/lib/encryption";

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Server-side profile save that encrypts contact_phone (phone field) before
 * writing to talent_profiles. Must be called instead of writing directly from
 * the browser so the ENCRYPTION_KEY never reaches the client bundle.
 */
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

    const body = await req.json();
    const {
      full_name,
      headline,
      bio,
      location,
      skills,
      self_reported_skills,
      self_reported_experience,
      self_reported_projects,
      linkedin_url,
      github_url,
      portfolio_url,
      is_visible,
      years_experience,
      phone,
      availability,
    } = body;

    const admin = getServiceClient();
    const { error } = await admin.from("talent_profiles").upsert(
      {
        user_id: user.id,
        full_name,
        headline,
        bio,
        location,
        skills,
        self_reported_skills,
        self_reported_experience,
        self_reported_projects,
        linkedin_url,
        github_url,
        portfolio_url,
        is_visible,
        years_experience,
        // Encrypt phone at rest. decrypt() handles legacy plain-text gracefully
        // so existing rows are readable even if not yet re-encrypted.
        phone: phone ? encrypt(phone) : null,
        availability,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      console.error("[save-profile]", error);
      return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[save-profile]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
 * Returns the authenticated student's own talent profile with encrypted fields
 * decrypted server-side. The ENCRYPTION_KEY never reaches the browser.
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

    const admin = getServiceClient();
    const { data, error } = await admin
      .from("talent_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("[my-profile GET]", error);
      return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
    }

    if (!data) return NextResponse.json({ profile: null });

    // Decrypt encrypted contact fields before returning to the browser
    const decrypted = {
      ...data,
      phone: data.phone ? decrypt(data.phone) : "",
      contact_email: data.contact_email ? decrypt(data.contact_email) : "",
      contact_phone: data.contact_phone ? decrypt(data.contact_phone) : "",
    };

    return NextResponse.json({ profile: decrypted });
  } catch (err) {
    console.error("[my-profile GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

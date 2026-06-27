import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// DEV-ONLY utility route: lets the signed-in user flip their own `profiles.role`.
// Used during local audit/dev to grant one demo account access to both the
// student dashboard (which has no role gate) and the employer dashboard
// (which redirects to /dashboard unless role === "employer").
// Not linked from any UI. Blocked outside development.
export async function GET() {
  if (process.env.NODE_ENV !== "development" || process.env.NEXT_PUBLIC_APP_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  const { data, error } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single();
  return NextResponse.json({ userId: user.id, data, error: error?.message ?? null });
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development" || process.env.NEXT_PUBLIC_APP_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const { role } = await req.json();
    if (!role || typeof role !== "string") {
      return NextResponse.json({ error: "role required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated — log in first" }, { status: 401 });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const { createClient } = await import("@supabase/supabase-js");
    const adminClient = serviceKey
      ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey)
      : supabase;

    const { data: updated, error } = await adminClient
      .from("profiles")
      .update({ role })
      .eq("id", user.id)
      .select();

    if (error) {
      console.error("[dev/set-role] update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // proxy.ts (the route gate) checks user.user_metadata.role, not profiles.role.
    // Update auth user_metadata too so the gate actually sees the new role.
    let metaError: string | null = null;
    if (serviceKey) {
      const { error: mErr } = await adminClient.auth.admin.updateUserById(user.id, {
        user_metadata: { ...user.user_metadata, role },
      });
      metaError = mErr?.message ?? null;
    }

    return NextResponse.json({ ok: true, role, userId: user.id, updated, usedServiceKey: !!serviceKey, metaError });
  } catch (err) {
    console.error("[dev/set-role]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

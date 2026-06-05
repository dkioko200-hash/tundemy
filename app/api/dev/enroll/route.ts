import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getCourseBySlug } from "@/lib/courses";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    const course = getCourseBySlug(slug);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
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

    // Use service-role client when available, otherwise fall back to anon (dev only)
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const { createClient } = await import("@supabase/supabase-js");
    const adminClient = serviceKey
      ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey)
      : supabase;

    const { error } = await adminClient.from("enrollments").upsert(
      {
        user_id: user.id,
        course_slug: slug,
        payment_status: "paid",
        amount_paid: 0,
        payment_ref: `DEV-${Date.now()}`,
        enrolled_at: new Date().toISOString(),
      },
      { onConflict: "user_id,course_slug" }
    );

    if (error) {
      console.error("[dev/enroll] upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[dev/enroll]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

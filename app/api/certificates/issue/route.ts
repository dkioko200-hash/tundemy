import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { courseContent } from "@/lib/course-content";
import { sendCertificateEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { slug } = await req.json();
  const course = courseContent.find((c) => c.slug === slug);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

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

  // Check for a passing capstone result in grading_cache.
  // The progress table is missing the course_slug column in production schema,
  // so we use grading_cache as the canonical completion signal instead.
  const { data: capstoneRows } = await supabase
    .from("grading_cache")
    .select("result")
    .eq("user_id", user.id)
    .eq("course_slug", slug)
    .eq("kind", "capstone")
    .limit(20);

  const passingScore = (course as { capstone?: { passingScore?: number } }).capstone?.passingScore ?? 70;
  const hasPassed = (capstoneRows ?? []).some((row) => {
    const r = row.result as Record<string, unknown> | null;
    return r?.passed === true || (typeof r?.overallScore === "number" && r.overallScore >= passingScore);
  });

  if (!hasPassed) {
    return NextResponse.json({ error: "Course not yet completed" }, { status: 403 });
  }

  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Graduate";
  const certId = `TND-${slug.toUpperCase().replace(/-/g, "").slice(0, 6)}-${user.id.slice(0, 6).toUpperCase()}`;

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: existing } = await adminClient
    .from("certificates")
    .select("cert_id")
    .eq("user_id", user.id)
    .eq("course_slug", slug)
    .maybeSingle();

  if (!existing) {
    await adminClient.from("certificates").insert({
      cert_id: certId,
      user_id: user.id,
      course_slug: slug,
      full_name: fullName,
    });
    if (user.email) {
      await sendCertificateEmail(user.email, course.title, slug, certId);
    }
  }

  return NextResponse.json({ certId });
}

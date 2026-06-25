"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getCourseBySlug } from "@/lib/courses";
import { createClient } from "@/lib/supabase";

// ── Trust badge item ─────────────────────────────────────────────────────────

function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-gray-600">
      <span className="text-[#2d8a4e] flex-shrink-0">{icon}</span>
      {text}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function EnrollPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const course = getCourseBySlug(slug);

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!course) {
      router.replace("/#courses");
      return;
    }

    async function checkAuth() {
      const supabase = createClient();

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user;

        if (!user) {
          router.replace(`/auth/signup?redirect=${encodeURIComponent(`/courses/${slug}/enroll`)}`);
          return;
        }

        // Tester: auto-create paid enrollment and go straight to the course player
        if (user.email === "d.kioko200@gmail.com") {
          try {
            await supabase.from("enrollments").upsert(
              { user_id: user.id, course_slug: slug, payment_status: "paid", enrolled_at: new Date().toISOString() },
              { onConflict: "user_id,course_slug" }
            );
          } catch { /* non-fatal */ }
          router.replace(`/courses/${slug}/learn`);
          return;
        }

        const { data: enrollment } = await supabase
          .from("enrollments")
          .select("id")
          .eq("user_id", user.id)
          .eq("course_slug", slug)
          .maybeSingle();

        if (enrollment) {
          router.replace(`/courses/${slug}/learn`);
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error("[enroll] auth check failed:", err);
        router.replace(`/auth/signup?redirect=${encodeURIComponent(`/courses/${slug}/enroll`)}`);
      }
    }

    checkAuth();
  }, [slug, course, router]);

  const handlePayment = () => {
    setPaying(true);
    router.push(`/courses/${slug}/checkout`);
  };

  if (!course) return null;

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f9fafb" }}
      >
        <div
          className="w-9 h-9 rounded-full border-[3px] animate-spin"
          style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  const levelColor =
    course.level === "Beginner"
      ? "#2d8a4e"
      : course.level === "Intermediate"
      ? "#2563eb"
      : "#bb0000";
  const levelBg =
    course.level === "Beginner"
      ? "rgba(45,138,78,0.1)"
      : course.level === "Intermediate"
      ? "rgba(37,99,235,0.1)"
      : "rgba(187,0,0,0.1)";

  return (
    <>
      <Navbar />


      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Back link */}
          <Link
            href="/#courses"
            className="inline-flex items-center gap-1.5 text-sm font-semibold mb-8 transition-opacity hover:opacity-70"
            style={{ color: "#0f1f3d" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to courses
          </Link>

          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">

            {/* ── LEFT: Course info ── */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                {/* Course icon + title */}
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ backgroundColor: `${course.tag_color}18` }}
                  >
                    {course.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ color: levelColor, backgroundColor: levelBg }}
                      >
                        {course.level}
                      </span>
                      {course.badge_label && (
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: course.badge_bg ?? "#0f1f3d", color: "#fff" }}
                        >
                          {course.badge_label}
                        </span>
                      )}
                    </div>
                    <h1 className="text-xl font-extrabold leading-snug" style={{ color: "#0f1f3d" }}>
                      {course.title}
                    </h1>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {course.description}
                </p>

                {/* What you'll learn */}
                <div>
                  <h2 className="text-sm font-bold mb-3" style={{ color: "#0f1f3d" }}>
                    What you will learn
                  </h2>
                  <ul className="space-y-3">
                    {course.what_you_will_learn.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: "rgba(45,138,78,0.12)", color: "#2d8a4e" }}
                        >
                          ✓
                        </span>
                        <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Trust badges */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-sm font-bold mb-4" style={{ color: "#0f1f3d" }}>
                  What&apos;s included
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <TrustBadge
                    icon={
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="6" />
                        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                      </svg>
                    }
                    text="Verified certificate on completion"
                  />
                  <TrustBadge
                    icon={
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    }
                    text="Lifetime access"
                  />
                  <TrustBadge
                    icon={
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <path d="M8 21h8M12 17v4" />
                      </svg>
                    }
                    text="Hands-on sandbox included"
                  />
                  <TrustBadge
                    icon={
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    }
                    text="Join 2,400+ learners"
                  />
                </div>
              </div>
            </div>

            {/* ── RIGHT: Order summary + payment ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-24">
              <h2 className="text-base font-bold mb-5" style={{ color: "#0f1f3d" }}>
                Order Summary
              </h2>

              {/* Line items */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm text-gray-600 leading-snug">{course.title}</span>
                  <span className="text-sm font-bold flex-shrink-0" style={{ color: "#0f1f3d" }}>
                    KSh {course.price_kes.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-100 my-4" />

              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold" style={{ color: "#0f1f3d" }}>Total</span>
                <span className="text-lg font-extrabold" style={{ color: "#0f1f3d" }}>
                  KSh {course.price_kes.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-6">VAT included</p>

              {/* Pay Now */}
              <div className="space-y-3">
                <button
                  onClick={handlePayment}
                  disabled={paying}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#2d8a4e" }}
                >
                  {paying ? (
                    <>
                      <div
                        className="w-4 h-4 rounded-full border-2 animate-spin"
                        style={{ borderColor: "rgba(255,255,255,0.4)", borderTopColor: "#fff" }}
                      />
                      Redirecting to checkout…
                    </>
                  ) : (
                    <>
                      <span>💳</span>
                      Pay Now — KSh {course.price_kes.toLocaleString()}
                    </>
                  )}
                </button>
              </div>

              {/* Security note */}
              <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                Secure payment. Instant access after payment confirmation.
              </p>

              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-400">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Your payment is encrypted and secure
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

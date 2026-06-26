"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { courseContent } from "@/lib/course-content";
import { courses } from "@/lib/courses";

interface CertRow {
  cert_id: string;
  course_slug: string;
  created_at: string;
}

interface BadgeRow {
  id: string;
  badge_name: string;
  earned_at: string;
}

// Courses completed (all lessons done) but not yet in certificates table
interface CompletedSlug {
  slug: string;
  progressPct: number;
}

function BadgeIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function CertMediumIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M8 10h8M8 14h4" />
      <circle cx="17" cy="18" r="3" />
      <path d="M17 21v3l-1.5-1-1.5 1v-3" />
    </svg>
  );
}

export default function CertificatesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<CertRow[]>([]);
  const [badges, setBadges] = useState<BadgeRow[]>([]);
  const [completedWithoutCert, setCompletedWithoutCert] = useState<CompletedSlug[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login?next=/dashboard/certificates"); return; }

      const [certsRes, badgesRes, enrollRes, progressRes] = await Promise.allSettled([
        supabase.from("certificates").select("cert_id, course_slug, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("user_badges").select("id, badge_name, earned_at").eq("user_id", user.id).order("earned_at", { ascending: false }),
        supabase.from("enrollments").select("course_slug").eq("user_id", user.id).eq("payment_status", "paid"),
        supabase.from("progress").select("course_slug").eq("user_id", user.id).eq("completed", true),
      ]);

      const certRows: CertRow[] = certsRes.status === "fulfilled" ? (certsRes.value.data ?? []) as CertRow[] : [];
      setCertificates(certRows);

      if (badgesRes.status === "fulfilled") setBadges(badgesRes.value.data ?? []);

      // Find courses that are 100% complete but don't have a cert yet (can trigger issue)
      const certSlugs = new Set(certRows.map((c) => c.course_slug));
      if (enrollRes.status === "fulfilled" && progressRes.status === "fulfilled") {
        const progressCount: Record<string, number> = {};
        for (const row of (progressRes.value.data ?? []) as { course_slug: string }[]) {
          progressCount[row.course_slug] = (progressCount[row.course_slug] ?? 0) + 1;
        }
        const slugs = (enrollRes.value.data ?? []).map((e: { course_slug: string }) => e.course_slug);
        const completed: CompletedSlug[] = [];
        for (const slug of slugs) {
          if (certSlugs.has(slug)) continue; // already has cert
          const course = courseContent.find((c) => c.slug === slug);
          if (!course) continue;
          const count = progressCount[slug] ?? 0;
          if (count >= course.lessons_count) {
            completed.push({ slug, progressPct: 100 });
          }
        }
        setCompletedWithoutCert(completed);
      }

      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-[3px] animate-spin" style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const badgeColors = ["#2d8a4e", "#9333ea", "#0ea5e9", "#d97706", "#bb0000", "#6366f1"];
  const totalCerts = certificates.length + completedWithoutCert.length;

  return (
    <div className="p-5 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>Certificates &amp; Badges</h1>
        <p className="text-sm text-gray-500 mt-1">
          {totalCerts} certificate{totalCerts !== 1 ? "s" : ""} · {badges.length} badge{badges.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Certificates from certificates table */}
      <section>
        <h2 className="text-base font-bold mb-4" style={{ color: "#0f1f3d" }}>Certificates of Completion</h2>

        {totalCerts === 0 ? (
          <div className="rounded-2xl border-2 border-dashed p-10 text-center" style={{ borderColor: "#e5e7eb" }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(217,119,6,0.08)" }}>
              <CertMediumIcon />
            </div>
            <p className="font-bold text-sm mb-1" style={{ color: "#0f1f3d" }}>No certificates yet</p>
            <p className="text-xs text-gray-500">Complete a course capstone project to earn your certificate.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Issued certificates (from certificates table) */}
            {certificates.map((cert) => {
              const contentLib = courseContent.find((c) => c.slug === cert.course_slug);
              const courseLib = courses.find((c) => c.slug === cert.course_slug);
              const title = contentLib?.title ?? courseLib?.title ?? cert.course_slug;
              const issuedDate = cert.created_at
                ? new Date(cert.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })
                : "";
              return (
                <div key={cert.cert_id} className="rounded-2xl border bg-white p-5" style={{ borderColor: "#e5e7eb" }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(217,119,6,0.08)" }}>
                      <CertMediumIcon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm" style={{ color: "#0f1f3d" }}>{title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Certificate of Completion</p>
                      {issuedDate && <p className="text-xs text-gray-400">Issued {issuedDate}</p>}
                      <p className="text-xs font-mono text-gray-300 mt-0.5">{cert.cert_id}</p>
                      <Link
                        href={`/dashboard/certificates/${cert.course_slug}`}
                        className="mt-3 inline-block px-4 py-1.5 rounded-xl text-xs font-bold border-2 transition-all hover:bg-amber-50"
                        style={{ borderColor: "#d97706", color: "#d97706" }}>
                        View &amp; Download PDF
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Completed but cert not yet issued — offer to generate */}
            {completedWithoutCert.map(({ slug }) => {
              const contentLib = courseContent.find((c) => c.slug === slug);
              const courseLib = courses.find((c) => c.slug === slug);
              const title = contentLib?.title ?? courseLib?.title ?? slug;
              return (
                <div key={slug} className="rounded-2xl border bg-white p-5" style={{ borderColor: "#e5e7eb" }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(45,138,78,0.08)" }}>
                      <CertMediumIcon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm" style={{ color: "#0f1f3d" }}>{title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Course Completed — Certificate ready</p>
                      <Link
                        href={`/dashboard/certificates/${slug}`}
                        className="mt-3 inline-block px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: "#2d8a4e" }}>
                        Get Certificate
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Badges */}
      <section>
        <h2 className="text-base font-bold mb-4" style={{ color: "#0f1f3d" }}>Skill Badges</h2>
        {badges.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed p-10 text-center" style={{ borderColor: "#e5e7eb" }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(45,138,78,0.08)" }}>
              <BadgeIcon color="#2d8a4e" />
            </div>
            <p className="font-bold text-sm mb-1" style={{ color: "#0f1f3d" }}>No badges yet</p>
            <p className="text-xs text-gray-500">Badges are awarded as you complete courses and milestones.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {badges.map((badge, i) => {
              const color = badgeColors[i % badgeColors.length];
              const date = new Date(badge.earned_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
              return (
                <div key={badge.id} className="rounded-2xl border bg-white p-5 flex flex-col items-center text-center gap-3" style={{ borderColor: "#e5e7eb" }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}12` }}>
                    <BadgeIcon color={color} />
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#0f1f3d" }}>{badge.badge_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Earned {date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

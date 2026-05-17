"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { courseContent } from "@/lib/course-content";

interface Badge {
  id: string;
  badge_name: string;
  course_slug: string;
  earned_at: string;
}

function BadgeIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function CertIcon() {
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
  const [badges, setBadges] = useState<Badge[]>([]);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login?next=/dashboard/certificates"); return; }

      const [badgesRes, enrollRes] = await Promise.allSettled([
        supabase.from("user_badges").select("id, badge_name, course_slug, earned_at").eq("user_id", user.id).order("earned_at", { ascending: false }),
        supabase.from("enrollments").select("course_slug").eq("user_id", user.id),
      ]);

      if (badgesRes.status === "fulfilled") setBadges(badgesRes.value.data ?? []);

      // Check which courses are 100% complete
      if (enrollRes.status === "fulfilled") {
        const slugs = (enrollRes.value.data ?? []).map((e: { course_slug: string }) => e.course_slug);
        const completed: string[] = [];
        for (const slug of slugs) {
          const course = courseContent.find((c) => c.slug === slug);
          if (!course) continue;
          const { count } = await supabase
            .from("progress")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("course_slug", slug)
            .eq("completed", true);
          if ((count ?? 0) >= course.lessons_count) completed.push(slug);
        }
        setCompletedCourses(completed);
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

  return (
    <div className="p-5 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>Certificates &amp; Badges</h1>
        <p className="text-sm text-gray-500 mt-1">{badges.length} badge{badges.length !== 1 ? "s" : ""} earned · {completedCourses.length} certificate{completedCourses.length !== 1 ? "s" : ""} issued</p>
      </div>

      {/* Certificates */}
      <section>
        <h2 className="text-base font-bold mb-4" style={{ color: "#0f1f3d" }}>Certificates of Completion</h2>
        {completedCourses.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed p-10 text-center" style={{ borderColor: "#e5e7eb" }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(217,119,6,0.08)" }}>
              <CertIcon />
            </div>
            <p className="font-bold text-sm mb-1" style={{ color: "#0f1f3d" }}>No certificates yet</p>
            <p className="text-xs text-gray-500">Complete all lessons in a course to earn your certificate.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {completedCourses.map((slug) => {
              const course = courseContent.find((c) => c.slug === slug);
              if (!course) return null;
              return (
                <div key={slug} className="rounded-2xl border bg-white p-5" style={{ borderColor: "#e5e7eb" }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(217,119,6,0.08)" }}>
                      <CertIcon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm" style={{ color: "#0f1f3d" }}>{course.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Certificate of Completion</p>
                      <button className="mt-3 px-4 py-1.5 rounded-xl text-xs font-bold border-2 transition-all hover:bg-gray-50" style={{ borderColor: "#d97706", color: "#d97706" }}>
                        Download PDF
                      </button>
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

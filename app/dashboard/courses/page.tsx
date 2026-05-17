"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { courseContent } from "@/lib/course-content";

interface Enrollment {
  course_slug: string;
  enrolled_at: string;
  progress_pct?: number;
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="w-full rounded-full h-1.5 bg-gray-100">
      <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: "#2d8a4e" }} />
    </div>
  );
}

export default function MyCoursesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login?next=/dashboard/courses"); return; }

      const { data } = await supabase
        .from("enrollments")
        .select("course_slug, enrolled_at")
        .eq("user_id", user.id)
        .order("enrolled_at", { ascending: false });

      const rows = data ?? [];

      // Fetch progress counts per course
      const withProgress = await Promise.all(
        rows.map(async (e) => {
          const course = courseContent.find((c) => c.slug === e.course_slug);
          if (!course) return { ...e, progress_pct: 0 };
          const { count } = await supabase
            .from("progress")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("course_slug", e.course_slug)
            .eq("completed", true);
          const pct = course.lessons_count > 0 ? Math.round(((count ?? 0) / course.lessons_count) * 100) : 0;
          return { ...e, progress_pct: pct };
        })
      );

      setEnrollments(withProgress);
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

  const enrolledSlugs = new Set(enrollments.map((e) => e.course_slug));
  const available = courseContent.filter((c) => !enrolledSlugs.has(c.slug));

  return (
    <div className="p-5 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>My Courses</h1>
        <p className="text-sm text-gray-500 mt-1">{enrollments.length} course{enrollments.length !== 1 ? "s" : ""} enrolled</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed p-12 text-center" style={{ borderColor: "#e5e7eb" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(45,138,78,0.08)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2d8a4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <p className="font-bold text-sm mb-1" style={{ color: "#0f1f3d" }}>No courses yet</p>
          <p className="text-xs text-gray-500 mb-4">Pick a course below to start learning.</p>
          <Link href="/#courses" className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ backgroundColor: "#2d8a4e" }}>
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {enrollments.map((e) => {
            const course = courseContent.find((c) => c.slug === e.course_slug);
            if (!course) return null;
            const pct = e.progress_pct ?? 0;
            const levelColor = course.level === "Beginner" ? "#2d8a4e" : course.level === "Intermediate" ? "#d97706" : "#9333ea";
            return (
              <div key={e.course_slug} className="rounded-2xl border bg-white p-5 flex flex-col gap-4" style={{ borderColor: "#e5e7eb" }}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${levelColor}15`, color: levelColor }}>
                      {course.level}
                    </span>
                    <span className="text-xs font-bold" style={{ color: "#2d8a4e" }}>{pct}%</span>
                  </div>
                  <h3 className="font-bold text-sm mt-2 mb-0.5" style={{ color: "#0f1f3d" }}>{course.title}</h3>
                  <p className="text-xs text-gray-400">{course.lessons_count} lessons</p>
                </div>
                <ProgressBar pct={pct} />
                <Link href={`/courses/${course.slug}/learn`}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-center text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: pct === 100 ? "#0f1f3d" : "#2d8a4e" }}>
                  {pct === 0 ? "Start Course" : pct === 100 ? "Review Course" : "Continue Learning"}
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {available.length > 0 && (
        <div>
          <h2 className="text-base font-bold mb-4" style={{ color: "#0f1f3d" }}>Explore More Courses</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {available.map((c) => {
              const levelColor = c.level === "Beginner" ? "#2d8a4e" : c.level === "Intermediate" ? "#d97706" : "#9333ea";
              return (
                <div key={c.slug} className="rounded-2xl border bg-white p-4 flex items-center gap-4" style={{ borderColor: "#e5e7eb" }}>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold" style={{ color: levelColor }}>{c.level}</span>
                    <p className="text-sm font-semibold truncate mt-0.5" style={{ color: "#0f1f3d" }}>{c.title}</p>
                    <p className="text-xs text-gray-400">{c.lessons_count} lessons · KES {c.price_kes.toLocaleString()}</p>
                  </div>
                  <Link href={`/courses/${c.slug}`}
                    className="flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all hover:bg-gray-50"
                    style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>
                    View
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CourseCard from "./CourseCard";
import PreviewModal from "./PreviewModal";
import { courses, type Course } from "@/lib/courses";
import { createClient } from "@/lib/supabase";

export default function CoursesSection() {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeFilter, setActiveFilter] = useState("All Courses");

  const filteredCourses = courses.filter((c) => {
    if (activeFilter === "All Courses") return true;
    if (activeFilter === "Most Popular") return c.badge_label?.includes("Popular");
    return c.level === activeFilter;
  });

  const handleEnroll = async (slug: string) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/auth/signup?course=${slug}`);
      return;
    }

    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_slug", slug)
      .maybeSingle();

    if (enrollment) {
      router.push(`/courses/${slug}/learn`);
    } else {
      router.push(`/courses/${slug}/enroll`);
    }
  };

  return (
    <>
      <section id="courses" className="pt-0 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-14 space-y-4">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(45,138,78,0.1)", color: "#2d8a4e" }}
            >
              In-Demand AI Courses
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: "#0f1f3d" }}
            >
              Skills global employers{" "}
              <span style={{ color: "#2d8a4e" }}>hire for</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Every course includes video lessons, a hands-on sandbox, graded quizzes, and a
              portfolio project. Built with real business scenarios. Recognised by employers
              worldwide.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {["All Courses", "Beginner", "Intermediate", "Advanced", "Most Popular"].map(
              (filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className="px-4 py-1.5 text-sm font-semibold rounded-full border-2 transition-all duration-200"
                    style={
                      isActive
                        ? { backgroundColor: "#2d8a4e", borderColor: "#2d8a4e", color: "#ffffff" }
                        : { backgroundColor: "#ffffff", borderColor: "#0f1f3d", color: "#0f1f3d" }
                    }
                  >
                    {filter}
                  </button>
                );
              }
            )}
          </div>

          {/* Course grid */}
          <div className="flex flex-wrap justify-center gap-6">
            {filteredCourses.map((course) => (
              <div key={course.slug} className="w-full sm:w-[calc(50%-12px)]">
                <CourseCard
                  slug={course.slug}
                  title={course.title}
                  description={course.description}
                  level={course.level}
                  lessons_count={course.lessons_count}
                  price_kes={course.price_kes}
                  icon={course.icon}
                  tag={course.tag}
                  tag_color={course.tag_color}
                  badge_label={course.badge_label}
                  badge_bg={course.badge_bg}
                  banner_gradient={course.banner_gradient}
                  onPreview={() => setSelectedCourse(course)}
                  onEnroll={handleEnroll}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <PreviewModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onEnroll={handleEnroll}
      />
    </>
  );
}

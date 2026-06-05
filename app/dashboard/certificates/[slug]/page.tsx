"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { courseContent } from "@/lib/course-content";
import { courses } from "@/lib/courses";

interface User {
  id: string;
  full_name: string;
  email: string;
}

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const certRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [completedAt, setCompletedAt] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const course = courseContent.find((c) => c.slug === slug);
  const courseMeta = courses.find((c) => c.slug === slug);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.replace("/auth/login"); return; }

      const fullName = authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Graduate";
      setUser({ id: authUser.id, full_name: fullName, email: authUser.email ?? "" });

      if (!course) { setLoading(false); return; }

      // Check completion
      const { count } = await supabase
        .from("progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", authUser.id)
        .eq("course_slug", slug)
        .eq("completed", true);

      if ((count ?? 0) >= course.lessons_count) {
        setAuthorized(true);
        // Get last completed date
        const { data: lastLesson } = await supabase
          .from("progress")
          .select("updated_at")
          .eq("user_id", authUser.id)
          .eq("course_slug", slug)
          .eq("completed", true)
          .order("updated_at", { ascending: false })
          .limit(1)
          .single();
        if (lastLesson?.updated_at) {
          setCompletedAt(new Date(lastLesson.updated_at).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" }));
        } else {
          setCompletedAt(new Date().toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" }));
        }
      }
      setLoading(false);
    }
    load();
  }, [slug, router, course]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="w-8 h-8 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!course || !courseMeta) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8 text-center" style={{ fontFamily: "Inter, sans-serif" }}>
        <div>
          <p className="text-xl font-bold mb-2" style={{ color: "#0f1f3d" }}>Course not found</p>
          <Link href="/dashboard/certificates" className="text-sm text-green-700 underline">Back to certificates</Link>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8 text-center" style={{ fontFamily: "Inter, sans-serif" }}>
        <div>
          <p className="text-3xl mb-4">🔒</p>
          <p className="text-xl font-bold mb-2" style={{ color: "#0f1f3d" }}>Certificate not yet earned</p>
          <p className="text-sm text-gray-500 mb-4">Complete all lessons in {course.title} to unlock your certificate.</p>
          <Link href={`/courses/${slug}/learn`}
            className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: "#2d8a4e" }}>
            Continue Course
          </Link>
        </div>
      </div>
    );
  }

  const certNumber = `TND-${slug.toUpperCase().replace(/-/g, "").slice(0, 6)}-${user?.id.slice(0, 6).toUpperCase()}`;

  return (
    <div style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#f9fafb", minHeight: "100vh" }}>

      {/* Print-hidden controls */}
      <div className="print:hidden bg-white border-b sticky top-0 z-10" style={{ borderColor: "#e5e7eb" }}>
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/dashboard/certificates"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            Certificates
          </Link>
          <button onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90"
            style={{ backgroundColor: "#2d8a4e" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* Certificate */}
      <div className="print:p-0 max-w-5xl mx-auto px-5 py-10">
        <div
          ref={certRef}
          className="bg-white relative overflow-hidden"
          style={{
            minHeight: "600px",
            border: "3px solid #0f1f3d",
            borderRadius: "16px",
            padding: "60px 64px",
            boxShadow: "0 4px 40px rgba(15,31,61,0.08)",
          }}>

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-24 h-24 opacity-5" style={{ background: "radial-gradient(circle at 0% 0%, #0f1f3d 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-0 w-40 h-40 opacity-5" style={{ background: "radial-gradient(circle at 100% 100%, #2d8a4e 0%, transparent 70%)" }} />

          {/* Top border stripe */}
          <div className="absolute top-0 left-0 right-0 h-2 flex overflow-hidden" style={{ borderRadius: "14px 14px 0 0" }}>
            <div className="flex-1 bg-black" />
            <div className="flex-1" style={{ backgroundColor: "#bb0000" }} />
            <div className="flex-1" style={{ backgroundColor: "#2d8a4e" }} />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center gap-6">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col w-2 h-10 rounded-sm overflow-hidden">
                <div className="flex-1 bg-black" />
                <div className="flex-1" style={{ backgroundColor: "#bb0000" }} />
                <div className="flex-1" style={{ backgroundColor: "#2d8a4e" }} />
              </div>
              <span className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>
                Tund<span style={{ color: "#2d8a4e" }}>emy</span>
              </span>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Certificate of Completion</p>
              <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: "#e5e7eb" }} />
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">This certifies that</p>
              <p className="text-4xl font-extrabold" style={{ color: "#0f1f3d", fontFamily: "Georgia, serif", letterSpacing: "-0.5px" }}>
                {user?.full_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">has successfully completed</p>
              <p className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>{course.title}</p>
              {course.tagline && <p className="text-sm text-gray-500 mt-1 italic">{course.tagline}</p>}
            </div>

            {/* Course details */}
            <div className="flex items-center gap-8 text-center">
              <div>
                <p className="text-2xl font-extrabold" style={{ color: "#2d8a4e" }}>{course.lessons_count}</p>
                <p className="text-xs text-gray-400">Lessons</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <p className="text-2xl font-extrabold" style={{ color: "#2d8a4e" }}>{courseMeta.level}</p>
                <p className="text-xs text-gray-400">Level</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <p className="text-2xl font-extrabold" style={{ color: "#2d8a4e" }}>{courseMeta.duration}</p>
                <p className="text-xs text-gray-400">Duration</p>
              </div>
            </div>

            {/* Badge */}
            <div className="px-5 py-2 rounded-full text-sm font-bold"
              style={{ backgroundColor: "rgba(45,138,78,0.08)", color: "#2d8a4e" }}>
              {courseMeta.tag}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-100" />

            {/* Footer */}
            <div className="flex items-center justify-between w-full flex-wrap gap-4">
              <div className="text-left">
                <p className="text-xs text-gray-400 mb-0.5">Completed</p>
                <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>{completedAt}</p>
              </div>

              {/* Signature area */}
              <div className="text-center">
                <div className="font-bold text-xl mb-0.5" style={{ color: "#0f1f3d", fontFamily: "Georgia, serif" }}>
                  Tundemy
                </div>
                <div className="w-24 h-px bg-gray-300 mx-auto mb-0.5" />
                <p className="text-xs text-gray-400">Director of Learning</p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400 mb-0.5">Certificate ID</p>
                <p className="text-xs font-mono font-bold" style={{ color: "#0f1f3d" }}>{certNumber}</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 mt-2">Verify at tundemy.com/verify · Africa&apos;s AI Skills Platform</p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:p-0 { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}

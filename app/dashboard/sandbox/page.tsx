"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface Submission {
  id: string;
  course_slug: string;
  lesson_id: number;
  prompt: string;
  score?: number;
  submitted_at: string;
}

const SCORE_COLORS: Record<string, { bg: string; text: string }> = {
  high:   { bg: "rgba(45,138,78,0.1)",   text: "#166534" },
  mid:    { bg: "rgba(245,158,11,0.1)",  text: "#92400e" },
  low:    { bg: "rgba(187,0,0,0.08)",    text: "#991b1b" },
};

function scoreStyle(score?: number) {
  if (score === undefined) return SCORE_COLORS.mid;
  if (score >= 80) return SCORE_COLORS.high;
  if (score >= 50) return SCORE_COLORS.mid;
  return SCORE_COLORS.low;
}

function SandboxIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d8a4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export default function SandboxPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login?next=/dashboard/sandbox"); return; }

      const { data } = await supabase
        .from("sandbox_submissions")
        .select("id, course_slug, lesson_id, prompt, score, submitted_at")
        .eq("user_id", user.id)
        .order("submitted_at", { ascending: false });

      setSubmissions(data ?? []);
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

  // Mock data if no real submissions yet
  const displaySubmissions = submissions.length > 0 ? submissions : [
    { id: "1", course_slug: "prompt-engineering", lesson_id: 5, prompt: "You are a senior marketing manager at a Nairobi fintech startup. Write a WhatsApp message to announce our new AI budgeting feature. Keep it under 160 characters.", score: 92, submitted_at: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: "2", course_slug: "intro-to-ai", lesson_id: 3, prompt: "Explain AI hallucinations to a non-technical Kenyan CEO in one paragraph. Use a simple analogy they would relate to.", score: 78, submitted_at: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: "3", course_slug: "ai-for-business", lesson_id: 4, prompt: "List 5 ways a mid-size Nairobi retail business could use AI to cut costs this year.", score: 65, submitted_at: new Date(Date.now() - 8 * 86400000).toISOString() },
  ] as Submission[];

  const avg = displaySubmissions.length > 0
    ? Math.round(displaySubmissions.reduce((s, x) => s + (x.score ?? 70), 0) / displaySubmissions.length)
    : 0;

  return (
    <div className="p-5 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>Sandbox</h1>
        <p className="text-sm text-gray-500 mt-1">Your prompt submissions and AI interaction history</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Submissions", value: displaySubmissions.length },
          { label: "Avg Score", value: `${avg}%` },
          { label: "Best Score", value: displaySubmissions.length > 0 ? `${Math.max(...displaySubmissions.map((s) => s.score ?? 70))}%` : "—" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border bg-white p-4 text-center" style={{ borderColor: "#e5e7eb" }}>
            <p className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Submissions list */}
      <div className="space-y-3">
        <h2 className="text-base font-bold" style={{ color: "#0f1f3d" }}>Recent Submissions</h2>
        {displaySubmissions.map((s) => {
          const style = scoreStyle(s.score);
          const date = new Date(s.submitted_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
          return (
            <div key={s.id} className="rounded-2xl border bg-white p-5" style={{ borderColor: "#e5e7eb" }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <SandboxIcon />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "#0f1f3d" }}>
                      {s.course_slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} — Lesson {s.lesson_id}
                    </p>
                    <p className="text-xs text-gray-400">{date}</p>
                  </div>
                </div>
                {s.score !== undefined && (
                  <span className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: style.bg, color: style.text }}>
                    {s.score}%
                  </span>
                )}
              </div>
              <div className="rounded-xl p-3 font-mono text-xs text-gray-600 leading-relaxed" style={{ backgroundColor: "#f8fafc", border: "1px solid #e5e7eb" }}>
                {s.prompt.length > 200 ? s.prompt.slice(0, 200) + "…" : s.prompt}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"] as const;
const EXPERIENCE_LEVELS = ["Entry Level", "Mid Level", "Senior", "Lead / Principal"] as const;

const JOB_TYPE_DB_MAP: Record<typeof JOB_TYPES[number], string> = {
  "Full-time": "full_time",
  "Part-time": "part_time",
  "Contract": "contract",
  "Internship": "internship",
  "Remote": "remote",
};

const EXPERIENCE_LEVEL_DB_MAP: Record<typeof EXPERIENCE_LEVELS[number], string> = {
  "Entry Level": "entry",
  "Mid Level": "mid",
  "Senior": "senior",
  "Lead / Principal": "lead",
};
const AI_SKILLS = [
  "Prompt Engineering", "ChatGPT", "Claude", "Python", "LangChain",
  "RAG", "Fine-tuning", "AI Strategy", "Machine Learning", "Data Analysis",
  "No-Code AI", "Image Generation", "API Integration",
];

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "Full-time" as typeof JOB_TYPES[number],
    location: "",
    remote: false,
    experience_level: "Mid Level" as typeof EXPERIENCE_LEVELS[number],
    salary_min: "",
    salary_max: "",
    description: "",
    required_skills: [] as string[],
    deadline: "",
  });

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login?next=/employer/post-job"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "employer") { router.replace("/dashboard"); return; }
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  const generateDescription = async () => {
    if (!form.title) return;
    setGenerating(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/employer/generate-job-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          title: form.title,
          skills: form.required_skills,
          jobType: form.type,
          experienceLevel: form.experience_level,
          location: form.remote ? "Remote" : form.location,
        }),
      });
      const data = await res.json();
      if (data.description) {
        setForm((f) => ({ ...f, description: data.description }));
      }
    } catch {
      // Silent fail — user can write manually
    } finally {
      setGenerating(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setForm((f) => ({
      ...f,
      required_skills: f.required_skills.includes(skill)
        ? f.required_skills.filter((s) => s !== skill)
        : [...f.required_skills, skill],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    setSubmitting(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("job_postings").insert({
      employer_id: user.id,
      title: form.title,
      job_type: JOB_TYPE_DB_MAP[form.type],
      location: form.remote ? "Remote" : form.location,
      experience_level: EXPERIENCE_LEVEL_DB_MAP[form.experience_level],
      salary_min: form.salary_min ? parseInt(form.salary_min) : null,
      salary_max: form.salary_max ? parseInt(form.salary_max) : null,
      description: form.description,
      required_skills: form.required_skills,
      deadline: form.deadline || null,
      status: "active",
    });

    setSubmitting(false);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-[3px] animate-spin" style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#f9fafb" }}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "rgba(45,138,78,0.1)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d8a4e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold mb-2" style={{ color: "#0f1f3d" }}>Job Posted!</h1>
          <p className="text-sm text-gray-500 mb-6">Your job listing is now live. Matching candidates will be notified.</p>
          <div className="flex flex-col gap-2">
            <Link href="/employer/dashboard/jobs" className="w-full py-3 rounded-xl text-sm font-bold text-white text-center" style={{ backgroundColor: "#2d8a4e" }}>
              View My Jobs
            </Link>
            <button onClick={() => setSubmitted(false)} className="w-full py-3 rounded-xl text-sm font-bold border-2 text-center" style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>
              Post Another Job
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9fafb", fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <Link href="/employer/dashboard" className="flex items-center gap-2 mb-6">
            <div className="flex flex-row gap-px h-4 overflow-hidden rounded-sm">
              <div className="w-1 bg-black" /><div className="w-1 bg-[#bb0000]" /><div className="w-1 bg-[#2d8a4e]" />
            </div>
            <span className="text-sm font-bold" style={{ color: "#0f1f3d" }}>Tund<span style={{ color: "#2d8a4e" }}>emy</span></span>
          </Link>
          <h1 className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>Post a Job</h1>
          <p className="text-sm text-gray-500 mt-1">Reach Africa's most verified AI talent pool.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Role basics */}
          <div className="rounded-2xl border bg-white p-6 space-y-4" style={{ borderColor: "#e5e7eb" }}>
            <h2 className="text-sm font-bold" style={{ color: "#0f1f3d" }}>Role Details</h2>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-600">Job Title *</label>
              <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. AI Product Manager"
                className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
                style={{ borderColor: "#e5e7eb" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-gray-600">Job Type</label>
                <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as typeof JOB_TYPES[number] }))}
                  className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none bg-white" style={{ borderColor: "#e5e7eb" }}>
                  {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-gray-600">Experience Level</label>
                <select value={form.experience_level} onChange={(e) => setForm((f) => ({ ...f, experience_level: e.target.value as typeof EXPERIENCE_LEVELS[number] }))}
                  className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none bg-white" style={{ borderColor: "#e5e7eb" }}>
                  {EXPERIENCE_LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-600">Location</label>
              <div className="flex items-center gap-3 mb-2">
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={form.remote} onChange={(e) => setForm((f) => ({ ...f, remote: e.target.checked }))} />
                  Remote / Work from anywhere
                </label>
              </div>
              {!form.remote && (
                <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Nairobi, Kenya"
                  className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
                  style={{ borderColor: "#e5e7eb" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")} />
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-gray-600">Salary Min (KES / mo)</label>
                <input type="number" value={form.salary_min} onChange={(e) => setForm((f) => ({ ...f, salary_min: e.target.value }))}
                  placeholder="50000"
                  className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
                  style={{ borderColor: "#e5e7eb" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-gray-600">Salary Max (KES / mo)</label>
                <input type="number" value={form.salary_max} onChange={(e) => setForm((f) => ({ ...f, salary_max: e.target.value }))}
                  placeholder="150000"
                  className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
                  style={{ borderColor: "#e5e7eb" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-600">Application Deadline</label>
              <input type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
                style={{ borderColor: "#e5e7eb" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")} />
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold" style={{ color: "#0f1f3d" }}>Job Description *</h2>
              <button
                type="button"
                onClick={generateDescription}
                disabled={!form.title || generating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all disabled:opacity-40"
                style={{ borderColor: "#2d8a4e", color: "#2d8a4e", backgroundColor: "rgba(45,138,78,0.06)" }}
              >
                {generating ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 animate-spin inline-block" style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }} />
                    Generating…
                  </>
                ) : (
                  <>✨ Generate with AI</>
                )}
              </button>
            </div>
            {!form.title && (
              <p className="text-xs text-amber-600 mb-2">Enter a job title above to enable AI generation.</p>
            )}
            <textarea required value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe the role, responsibilities, what you're building, and what makes this a great opportunity… or click ✨ Generate with AI above."
              rows={8}
              className="w-full px-4 py-3 text-sm border rounded-xl outline-none resize-none"
              style={{ borderColor: "#e5e7eb", lineHeight: "1.65" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")} />
          </div>

          {/* Required skills */}
          <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
            <h2 className="text-sm font-bold mb-1" style={{ color: "#0f1f3d" }}>Required AI Skills</h2>
            <p className="text-xs text-gray-400 mb-4">Select the AI skills you need. We use these to match candidates.</p>
            <div className="flex flex-wrap gap-2">
              {AI_SKILLS.map((skill) => {
                const selected = form.required_skills.includes(skill);
                return (
                  <button type="button" key={skill} onClick={() => toggleSkill(skill)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
                    style={{ borderColor: selected ? "#2d8a4e" : "#e5e7eb", backgroundColor: selected ? "rgba(45,138,78,0.08)" : "#fff", color: selected ? "#166534" : "#6b7280" }}>
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit" disabled={submitting || !form.title || !form.description}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#2d8a4e" }}>
            {submitting ? "Posting…" : "Post Job →"}
          </button>
        </form>
      </div>
    </div>
  );
}

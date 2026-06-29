"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface Job {
  id: string;
  title: string;
  job_type: string;
  location: string | null;
  experience_level: string;
  status: "active" | "closed" | "draft";
  created_at: string;
  applicants_count: number;
}

interface Match {
  user_id: string;
  full_name: string;
  match_score: number;
  match_reason: string;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "rgba(45,138,78,0.1)", text: "#166534", label: "Active" },
  closed: { bg: "rgba(107,114,128,0.1)", text: "#6b7280", label: "Closed" },
  draft:  { bg: "rgba(245,158,11,0.1)", text: "#92400e", label: "Draft" },
};

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: "Full-time", part_time: "Part-time", contract: "Contract", internship: "Internship", remote: "Remote",
};
const EXPERIENCE_LABELS: Record<string, string> = {
  entry: "Entry Level", mid: "Mid Level", senior: "Senior", lead: "Lead / Principal",
};

export default function JobsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [matchingJobId, setMatchingJobId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, Match[]>>({});
  const [matchError, setMatchError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login?next=/employer/dashboard/jobs"); return; }

      const { data } = await supabase
        .from("job_postings")
        .select("id, title, job_type, location, experience_level, status, created_at, applicants_count")
        .eq("employer_id", user.id)
        .order("created_at", { ascending: false });

      setJobs(data ?? []);
      setLoading(false);
    }
    load();
  }, [router]);

  const toggleStatus = async (job: Job) => {
    const newStatus = job.status === "active" ? "closed" : "active";
    const supabase = createClient();
    await supabase.from("job_postings").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", job.id);
    setJobs((prev) => prev.map((j) => j.id === job.id ? { ...j, status: newStatus as Job["status"] } : j));
  };

  const handleFindMatches = async (jobId: string) => {
    setMatchError(null);
    setMatchingJobId(jobId);
    try {
      const res = await fetch("/api/employer/match-talent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not find matches");
      setMatches((prev) => ({ ...prev, [jobId]: data.matches ?? [] }));
    } catch (err) {
      setMatchError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setMatchingJobId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-[3px] animate-spin" style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>My Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">{jobs.length} job{jobs.length !== 1 ? "s" : ""} posted</p>
        </div>
        <Link href="/employer/post-job"
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: "#2d8a4e" }}>
          + Post New Job
        </Link>
      </div>

      {matchError && <p className="text-xs font-semibold" style={{ color: "#bb0000" }}>{matchError}</p>}

      {jobs.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed p-12 text-center" style={{ borderColor: "#e5e7eb" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(45,138,78,0.08)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2d8a4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          </div>
          <p className="font-bold text-sm mb-1" style={{ color: "#0f1f3d" }}>No jobs posted yet</p>
          <p className="text-xs text-gray-500 mb-4">Post your first job to start finding AI talent.</p>
          <Link href="/employer/post-job"
            className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: "#2d8a4e" }}>
            Post a Job
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const style = STATUS_STYLES[job.status] ?? STATUS_STYLES.active;
            const date = new Date(job.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
            const jobMatches = matches[job.id];
            return (
              <div key={job.id} className="rounded-2xl border bg-white p-5" style={{ borderColor: "#e5e7eb" }}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: style.bg, color: style.text }}>
                        {style.label}
                      </span>
                      <span className="text-xs text-gray-400">{date}</span>
                    </div>
                    <h3 className="font-bold text-sm" style={{ color: "#0f1f3d" }}>{job.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {JOB_TYPE_LABELS[job.job_type] ?? job.job_type} · {job.location ?? "Remote"} · {EXPERIENCE_LABELS[job.experience_level] ?? job.experience_level}
                    </p>
                    <p className="text-xs font-semibold mt-1" style={{ color: "#2d8a4e" }}>
                      {job.applicants_count} applicant{job.applicants_count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => handleFindMatches(job.id)} disabled={matchingJobId === job.id}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                      style={{ backgroundColor: "#0f1f3d" }}>
                      {matchingJobId === job.id ? "Finding…" : "✨ Find Matching Talent"}
                    </button>
                    <button onClick={() => toggleStatus(job)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all hover:bg-gray-50"
                      style={{ borderColor: job.status === "active" ? "#bb0000" : "#2d8a4e", color: job.status === "active" ? "#bb0000" : "#2d8a4e" }}>
                      {job.status === "active" ? "Close" : "Reopen"}
                    </button>
                  </div>
                </div>

                {jobMatches && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: "#f3f4f6" }}>
                    {jobMatches.length === 0 ? (
                      <p className="text-xs text-gray-400">No strong matches found yet — check back as more talent completes their profiles.</p>
                    ) : (
                      <div className="space-y-2">
                        {jobMatches.map((m) => (
                          <Link key={m.user_id} href={`/talent/${m.user_id}`}
                            className="flex items-center justify-between gap-3 rounded-xl border p-3 hover:bg-gray-50 transition-colors"
                            style={{ borderColor: "#e5e7eb" }}>
                            <div className="min-w-0">
                              <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>{m.full_name}</p>
                              <p className="text-xs text-gray-500 mt-0.5 leading-snug">{m.match_reason}</p>
                            </div>
                            <span className="text-sm font-extrabold flex-shrink-0" style={{ color: "#2d8a4e" }}>{m.match_score}%</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Suspense } from "react";

interface Application {
  id: string;
  job_id: string;
  job_title?: string;
  applicant_name?: string;
  applicant_email?: string;
  cover_note?: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected";
  applied_at: string;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending:     { bg: "rgba(245,158,11,0.1)",  text: "#92400e",  label: "Pending" },
  reviewed:    { bg: "rgba(99,102,241,0.1)",  text: "#4338ca",  label: "Reviewed" },
  shortlisted: { bg: "rgba(45,138,78,0.1)",   text: "#166534",  label: "Shortlisted" },
  rejected:    { bg: "rgba(187,0,0,0.08)",    text: "#991b1b",  label: "Rejected" },
};

function ApplicationsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterJobId = searchParams.get("job");
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login?next=/employer/dashboard/applications"); return; }

      let query = supabase
        .from("job_applications")
        .select("id, job_id, cover_note, status, applied_at, profiles(full_name, email), job_postings(title)")
        .eq("employer_id", user.id)
        .order("applied_at", { ascending: false });

      if (filterJobId) query = query.eq("job_id", filterJobId);

      const { data } = await query;

      const mapped: Application[] = (data ?? []).map((a: Record<string, unknown>) => ({
        id: a.id as string,
        job_id: a.job_id as string,
        job_title: (a.job_postings as Record<string, unknown>)?.title as string ?? "Unknown Role",
        applicant_name: (a.profiles as Record<string, unknown>)?.full_name as string ?? "Anonymous",
        applicant_email: (a.profiles as Record<string, unknown>)?.email as string ?? "",
        cover_note: a.cover_note as string ?? "",
        status: a.status as Application["status"],
        applied_at: a.applied_at as string,
      }));

      setApplications(mapped);
      setLoading(false);
    }
    load();
  }, [router, filterJobId]);

  const updateStatus = async (id: string, status: Application["status"]) => {
    const supabase = createClient();
    await supabase.from("job_applications").update({ status }).eq("id", id);
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
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
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>Applications</h1>
        <p className="text-sm text-gray-500 mt-1">{applications.length} application{applications.length !== 1 ? "s" : ""}{filterJobId ? " for this job" : " total"}</p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed p-12 text-center" style={{ borderColor: "#e5e7eb" }}>
          <p className="font-bold text-sm mb-1" style={{ color: "#0f1f3d" }}>No applications yet</p>
          <p className="text-xs text-gray-500">Applications will appear here once candidates apply to your jobs.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const style = STATUS_STYLES[app.status] ?? STATUS_STYLES.pending;
            const date = new Date(app.applied_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
            const isExpanded = expandedId === app.id;
            return (
              <div key={app.id} className="rounded-2xl border bg-white p-5" style={{ borderColor: "#e5e7eb" }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: style.bg, color: style.text }}>
                        {style.label}
                      </span>
                      <span className="text-xs text-gray-400">{date}</span>
                    </div>
                    <p className="font-bold text-sm" style={{ color: "#0f1f3d" }}>{app.applicant_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{app.job_title}</p>
                    {app.applicant_email && <p className="text-xs text-gray-400 mt-0.5">{app.applicant_email}</p>}
                  </div>
                  <button onClick={() => setExpandedId(isExpanded ? null : app.id)}
                    className="flex-shrink-0 text-xs font-semibold text-gray-500 hover:text-gray-700">
                    {isExpanded ? "Collapse" : "Expand"}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-4">
                    {app.cover_note && (
                      <div className="rounded-xl p-4" style={{ backgroundColor: "#f8fafc", border: "1px solid #e5e7eb" }}>
                        <p className="text-xs font-bold mb-2" style={{ color: "#0f1f3d" }}>Cover Note</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{app.cover_note}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {(["shortlisted", "reviewed", "rejected"] as const).map((s) => (
                        <button key={s} onClick={() => updateStatus(app.id, s)}
                          disabled={app.status === s}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all hover:opacity-80 disabled:opacity-40"
                          style={{ borderColor: STATUS_STYLES[s].text, color: STATUS_STYLES[s].text }}>
                          Mark as {STATUS_STYLES[s].label}
                        </button>
                      ))}
                    </div>
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

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-24"><div className="w-8 h-8 rounded-full border-[3px] animate-spin" style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }} /></div>}>
      <ApplicationsInner />
    </Suspense>
  );
}

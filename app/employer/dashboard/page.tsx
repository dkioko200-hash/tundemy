"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface JobPost {
  id: string;
  title: string;
  applicants_count: number;
  created_at: string;
  status: "active" | "closed" | "draft";
}

interface UnlockedCandidate {
  candidate_id: string;
  unlocked_at: string;
  full_name: string;
  headline: string | null;
  auto_headline: string | null;
}

interface FeaturedTalent {
  user_id: string;
  full_name: string;
  headline: string | null;
  auto_headline: string | null;
  years_experience: number;
}

interface Stats {
  activeJobs: number;
  totalApplicants: number;
  talentPoolSize: number;
  profilesUnlocked: number;
}

function StarIcon({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}
function CalendarIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
function PlusIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
function BriefcaseIcon({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
}
function PeopleIcon({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
function InboxIcon({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>;
}

function StatCard({ label, value, icon, iconBg, iconColor }: { label: string; value: string | number; icon: React.ReactNode; iconBg: string; iconColor: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: iconBg, color: iconColor }}>{icon}</div>
      <div>
        <p className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function EmployerDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("Your Company");
  const [stats, setStats] = useState<Stats>({ activeJobs: 0, totalApplicants: 0, talentPoolSize: 0, profilesUnlocked: 0 });
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [featuredTalent, setFeaturedTalent] = useState<FeaturedTalent[]>([]);
  const [unlockedCandidates, setUnlockedCandidates] = useState<UnlockedCandidate[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/auth/login"); return; }
      const user = session.user;
      const name: string = user.user_metadata?.company_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Your Company";
      setCompanyName(name);

      const [jobsRes, talentRes, talentCountRes, unlocksRes] = await Promise.all([
        supabase.from("job_postings").select("id, title, applicants_count, created_at, status").eq("employer_id", user.id).order("created_at", { ascending: false }),
        supabase.from("talent_profiles").select("user_id, full_name, headline, auto_headline, years_experience").eq("is_visible", true).eq("profile_complete", true).order("years_experience", { ascending: false }).limit(3),
        supabase.from("talent_profiles").select("user_id", { count: "exact", head: true }).eq("is_visible", true).eq("profile_complete", true),
        supabase.from("employer_unlocks").select("candidate_id, unlocked_at").eq("employer_id", user.id).order("unlocked_at", { ascending: false }).limit(5),
      ]);

      const jobs = jobsRes.data ?? [];
      setJobPosts(jobs as JobPost[]);
      setFeaturedTalent((talentRes.data ?? []) as FeaturedTalent[]);

      let unlockedList: UnlockedCandidate[] = [];
      if (unlocksRes.data && unlocksRes.data.length > 0) {
        const candidateIds = unlocksRes.data.map((u: { candidate_id: string }) => u.candidate_id);
        const { data: profiles } = await supabase
          .from("talent_profiles")
          .select("user_id, full_name, headline, auto_headline")
          .in("user_id", candidateIds);
        const profileMap = new Map((profiles ?? []).map((p) => [p.user_id, p]));
        unlockedList = unlocksRes.data.map((u: { candidate_id: string; unlocked_at: string }) => {
          const p = profileMap.get(u.candidate_id);
          return {
            candidate_id: u.candidate_id,
            unlocked_at: u.unlocked_at,
            full_name: p?.full_name ?? "Unknown candidate",
            headline: p?.headline ?? null,
            auto_headline: p?.auto_headline ?? null,
          };
        });
      }
      setUnlockedCandidates(unlockedList);

      setStats({
        activeJobs: jobs.filter((j) => j.status === "active").length,
        totalApplicants: jobs.reduce((sum, j) => sum + (j.applicants_count ?? 0), 0),
        talentPoolSize: talentCountRes.count ?? 0,
        profilesUnlocked: unlocksRes.data?.length ?? 0,
      });
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="p-5 lg:p-8 flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-[3px] animate-spin" style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }} />
          <p className="text-sm text-gray-500 font-medium">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-8 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "#0f1f3d" }}>Welcome, {companyName.split(" ")[0]} 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Here's your hiring overview.</p>
        </div>
        <Link href="/employer/post-job"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90"
          style={{ backgroundColor: "#2d8a4e" }}>
          <PlusIcon size={14} />
          Post a Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Active Jobs" value={stats.activeJobs} icon={<BriefcaseIcon />} iconBg="rgba(45,138,78,0.1)" iconColor="#2d8a4e" />
        <StatCard label="Total Applicants" value={stats.totalApplicants} icon={<InboxIcon />} iconBg="rgba(15,31,61,0.08)" iconColor="#0f1f3d" />
        <StatCard label="Talent Pool" value={stats.talentPoolSize} icon={<PeopleIcon />} iconBg="rgba(147,51,234,0.1)" iconColor="#9333ea" />
        <StatCard label="Profiles Unlocked" value={stats.profilesUnlocked} icon={<CalendarIcon />} iconBg="rgba(217,119,6,0.1)" iconColor="#d97706" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Recent Job Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: "#0f1f3d" }}>Recent Job Posts</h2>
            <Link href="/employer/dashboard/jobs" className="text-xs font-semibold hover:opacity-70" style={{ color: "#2d8a4e" }}>View all →</Link>
          </div>
          {jobPosts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(15,31,61,0.06)", color: "#0f1f3d" }}><BriefcaseIcon /></div>
              <p className="text-sm font-semibold text-gray-700 mb-1">No jobs posted yet</p>
              <p className="text-xs text-gray-400 mb-4">Post your first job to start finding AI talent.</p>
              <Link href="/employer/post-job" className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: "#2d8a4e" }}>Post a Job</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobPosts.slice(0, 4).map((job) => (
                <Link key={job.id} href="/employer/dashboard/jobs" className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: "#0f1f3d" }}>{job.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{job.applicants_count ?? 0} applicants</p>
                  </div>
                  <span className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: job.status === "active" ? "rgba(45,138,78,0.1)" : "rgba(107,114,128,0.1)", color: job.status === "active" ? "#166534" : "#6b7280" }}>
                    {job.status === "active" ? "Active" : "Closed"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Featured Talent */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: "#0f1f3d" }}>Featured Talent</h2>
            <Link href="/employer/dashboard/talent" className="text-xs font-semibold hover:opacity-70" style={{ color: "#2d8a4e" }}>Browse all →</Link>
          </div>
          {featuredTalent.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <p className="text-sm text-gray-500">No verified candidates yet — check back soon.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {featuredTalent.map((t) => (
                <Link key={t.user_id} href={`/talent/${t.user_id}`} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: "#0f1f3d" }}>
                    {t.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>{t.full_name}</p>
                    <p className="text-xs text-gray-500 truncate">{t.headline || t.auto_headline || "AI Professional"}</p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-xs font-bold" style={{ color: "#2d8a4e" }}>
                      <StarIcon />
                      Verified
                    </div>
                    {t.years_experience > 0 && <p className="text-xs text-gray-400">{t.years_experience}y exp</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Recently Unlocked Candidates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold" style={{ color: "#0f1f3d" }}>Recently Unlocked Candidates</h2>
          <Link href="/employer/dashboard/talent" className="text-xs font-semibold hover:opacity-70" style={{ color: "#2d8a4e" }}>Find more talent →</Link>
        </div>
        {unlockedCandidates.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-sm text-gray-500">No candidates unlocked yet. Browse the talent pool to find and unlock contact details.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {unlockedCandidates.map((c) => (
              <Link key={c.candidate_id} href={`/talent/${c.candidate_id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: "#9333ea" }}>
                  {c.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700 truncate">{c.full_name}</p>
                  <p className="text-xs text-gray-400 truncate">{c.headline || c.auto_headline || ""}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(c.unlocked_at).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

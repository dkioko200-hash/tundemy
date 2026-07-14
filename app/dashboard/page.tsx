"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { courses } from "@/lib/courses";
import { courseContent } from "@/lib/course-content";

// ── Types ─────────────────────────────────────────────────────────────────────

interface EnrolledCourse {
  id: string;
  course_slug: string;
  course_title: string;
  icon: string;
  level: string;
  totalLessons: number;
  completedLessons: number;
  progressPct: number;
  isCompleted: boolean;
}

interface CertRow {
  cert_id: string;
  course_slug: string;
  created_at: string;
}

interface Badge {
  id: string;
  badge_name: string;
  earned_at: string;
}

// Details for every badge type currently issued (see lib/assessment-tracks.ts).
// Unknown badge names fall back to a generic entry so new badges never break the UI.
const BADGE_DETAILS: Record<string, { icon: string; description: string }> = {
  "AI Professional Badge": { icon: "🚀", description: "Earned by passing the AI Professional track assessment — proving you can use AI for real work tasks (prompt systems, professional outputs) at a hire-ready standard." },
  "AI Developer Badge": { icon: "🛠️", description: "Earned by passing the AI Developer track assessment — building production integrations like M-Pesa Daraja payment flows and WhatsApp bots." },
  "African Business Tech Badge": { icon: "🌱", description: "Earned by passing the African Business Tech track assessment — applying AI to agriculture and regional business problems." },
  "Global AI Talent Badge": { icon: "🎯", description: "Earned by passing the Global AI Talent track assessment — RAG pipelines, AI evaluation and data work at international standards." },
  "Income Track Badge": { icon: "💼", description: "Earned by passing the Income Track assessment — freelancing with AI skills and closing international clients." },
};

const FALLBACK_BADGE_DETAIL = { icon: "🏅", description: "Awarded for an achievement on Tundemy." };

interface ActivityItem {
  id: string;
  type: "lesson" | "badge" | "sandbox";
  description: string;
  created_at: string;
}

interface Stats {
  coursesEnrolled: number;
  lessonsCompleted: number;
  badgesEarned: number;
  certificatesEarned: number;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function CheckIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
}
function StarIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}
function BookIcon({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>;
}
function LightningIcon({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
}
function EyeIcon({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
}
function BriefcaseIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
}
function CertIcon({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 10h8M8 14h4" /><circle cx="17" cy="18" r="3" /><path d="M17 21v3l-1.5-1-1.5 1v-3" /></svg>;
}

function CircularProgress({ percentage }: { percentage: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;
  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      <circle cx="45" cy="45" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="7" />
      <circle cx="45" cy="45" r={radius} fill="none" stroke="#2d8a4e" strokeWidth="7" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90 45 45)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      <text x="45" y="50" textAnchor="middle" fill="#0f1f3d" fontSize="15" fontWeight="700" fontFamily="Inter, sans-serif">
        {percentage}%
      </text>
    </svg>
  );
}

function StatCard({ label, value, icon, iconBg, iconColor }: { label: string; value: number; icon: React.ReactNode; iconBg: string; iconColor: string }) {
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Student");
  const [stats, setStats] = useState<Stats>({ coursesEnrolled: 0, lessonsCompleted: 0, badgesEarned: 0, certificatesEarned: 0 });
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [certificates, setCertificates] = useState<CertRow[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(35);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const jobs = [
    { company: "Safaricom", role: "AI Solutions Analyst", salary: "KSh 80k–120k/mo" },
    { company: "Andela", role: "Prompt Engineer", salary: "KSh 100k–150k/mo" },
    { company: "NCBA Bank", role: "Data & AI Specialist", salary: "KSh 90k–130k/mo" },
  ];

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/auth/login"); return; }
      const user = session.user;
      const fullName: string = user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";
      setUserName(fullName);
      if (user.email === "d.kioko200@gmail.com") setIsAdmin(true);

      // Parallel fetches — one progress query covers all courses (avoids N+1)
      const [enrollRes, progressRes, certsRes, badgeRes, activityRes, profileRes] = await Promise.allSettled([
        supabase.from("enrollments").select("id, course_slug, payment_status, enrolled_at").eq("user_id", user.id),
        supabase.from("progress").select("course_slug").eq("user_id", user.id).eq("completed", true),
        supabase.from("certificates").select("cert_id, course_slug, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("user_badges").select("*").eq("user_id", user.id),
        supabase.from("activity_log").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(6),
        supabase.from("profiles").select("completion_percentage, profile_views").eq("id", user.id).single(),
      ]);

      // Build progress count map from a single query result
      const progressCountByCourse: Record<string, number> = {};
      if (progressRes.status === "fulfilled") {
        for (const row of (progressRes.value.data ?? []) as { course_slug: string }[]) {
          progressCountByCourse[row.course_slug] = (progressCountByCourse[row.course_slug] ?? 0) + 1;
        }
      }

      // Certificates
      const certRows: CertRow[] = certsRes.status === "fulfilled" ? (certsRes.value.data ?? []) as CertRow[] : [];
      setCertificates(certRows);
      const certSlugs = new Set(certRows.map((c) => c.course_slug));

      // Enrolled courses
      if (enrollRes.status === "fulfilled" && enrollRes.value.data) {
        const rows = (enrollRes.value.data as { id: string; course_slug: string; payment_status: string }[]).filter(
          (r) => r.payment_status === "paid"
        );
        const mapped: EnrolledCourse[] = rows.map((r) => {
          const courseLib = courses.find((x) => x.slug === r.course_slug);
          const contentLib = courseContent.find((x) => x.slug === r.course_slug);
          const totalLessons = contentLib?.lessons_count ?? 0;
          const completedLessons = progressCountByCourse[r.course_slug] ?? 0;
          const progressPct = totalLessons > 0 ? Math.min(100, Math.round((completedLessons / totalLessons) * 100)) : 0;
          const isCompleted = (completedLessons >= totalLessons && totalLessons > 0) || certSlugs.has(r.course_slug);
          return {
            id: r.id,
            course_slug: r.course_slug,
            course_title: contentLib?.title ?? courseLib?.title ?? r.course_slug,
            icon: courseLib?.icon ?? "📚",
            level: courseLib?.level ?? contentLib?.level ?? "Beginner",
            totalLessons,
            completedLessons,
            progressPct,
            isCompleted,
          };
        });
        setEnrolledCourses(mapped);
        const totalCompleted = mapped.reduce((sum, c) => sum + c.completedLessons, 0);
        setStats((s) => ({ ...s, coursesEnrolled: mapped.length, lessonsCompleted: totalCompleted }));
      }

      if (certsRes.status === "fulfilled") {
        setStats((s) => ({ ...s, certificatesEarned: certRows.length }));
      }

      if (badgeRes.status === "fulfilled" && badgeRes.value.data) {
        setBadges(badgeRes.value.data as Badge[]);
        setStats((s) => ({ ...s, badgesEarned: badgeRes.value.data!.length }));
      }

      if (activityRes.status === "fulfilled" && activityRes.value.data) {
        setActivity(activityRes.value.data as ActivityItem[]);
      }

      if (profileRes.status === "fulfilled" && profileRes.value.data) {
        const p = profileRes.value.data as { completion_percentage?: number; profile_views?: number };
        if (p.completion_percentage) setProfileCompletion(p.completion_percentage);
      }

      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="p-5 lg:p-8 flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-[3px] animate-spin" style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }} />
          <p className="text-sm text-gray-500 font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const firstName = userName.split(" ")[0];
  const inProgressCourses = enrolledCourses.filter((c) => !c.isCompleted && c.progressPct > 0);
  const firstActive = inProgressCourses[0] ?? enrolledCourses[0];

  return (
    <div className="flex min-h-full">
      {/* Main content */}
      <div className="flex-1 min-w-0 p-5 lg:p-8">

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "#0f1f3d" }}>Welcome back, {firstName} 👋</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Keep building. Employers are watching.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Courses Enrolled" value={stats.coursesEnrolled} icon={<BookIcon />} iconBg="rgba(15,31,61,0.08)" iconColor="#0f1f3d" />
          <StatCard label="Lessons Completed" value={stats.lessonsCompleted} icon={<CheckIcon size={20} />} iconBg="rgba(45,138,78,0.1)" iconColor="#2d8a4e" />
          <StatCard label="Badges Earned" value={stats.badgesEarned} icon={<StarIcon size={18} />} iconBg="rgba(234,179,8,0.12)" iconColor="#ca8a04" />
          <StatCard label="Certificates" value={stats.certificatesEarned} icon={<CertIcon />} iconBg="rgba(217,119,6,0.1)" iconColor="#d97706" />
        </div>

        {/* My Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: "#0f1f3d" }}>My Courses</h2>
            <Link href="/dashboard/courses" className="text-xs font-semibold hover:opacity-70" style={{ color: "#2d8a4e" }}>View all →</Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(15,31,61,0.06)", color: "#0f1f3d" }}><BookIcon size={24} /></div>
              <p className="text-sm font-semibold text-gray-700 mb-1">No courses enrolled yet</p>
              <p className="text-xs text-gray-400 mb-5">Start learning today and build skills employers want.</p>
              <Link href="/#courses" className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: "#2d8a4e" }}>Browse Courses</Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {enrolledCourses.slice(0, 4).map((ec) => {
                const levelColor = ec.level === "Beginner" ? "#2d8a4e" : ec.level === "Intermediate" ? "#d97706" : "#9333ea";
                return (
                  <div key={ec.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{ec.icon}</span>
                        <div>
                          <h3 className="text-sm font-bold leading-snug" style={{ color: "#0f1f3d" }}>{ec.course_title}</h3>
                          <span className="text-xs font-semibold mt-0.5 block" style={{ color: levelColor }}>{ec.level}</span>
                        </div>
                      </div>
                      {ec.isCompleted && (
                        <span className="flex-shrink-0 flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full"
                          style={{ backgroundColor: "rgba(45,138,78,0.1)", color: "#2d8a4e" }}>
                          <CheckIcon size={11} /> Completed
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-gray-500">
                          {ec.completedLessons} of {ec.totalLessons} lessons
                        </span>
                        <span className="text-xs font-bold" style={{ color: ec.isCompleted ? "#2d8a4e" : "#0f1f3d" }}>
                          {ec.progressPct}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${ec.progressPct}%`, backgroundColor: ec.isCompleted ? "#2d8a4e" : "#0f1f3d" }} />
                      </div>
                    </div>

                    {/* Action button */}
                    <Link href={`/courses/${ec.course_slug}/learn`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white hover:opacity-90 self-start"
                      style={{ backgroundColor: ec.isCompleted ? "#0f1f3d" : "#2d8a4e" }}>
                      {ec.isCompleted ? "View Course" : ec.progressPct === 0 ? "Start Learning →" : "Continue Learning →"}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Certificates */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: "#0f1f3d" }}>Certificates</h2>
            <Link href="/dashboard/certificates" className="text-xs font-semibold hover:opacity-70" style={{ color: "#2d8a4e" }}>View all →</Link>
          </div>

          {certificates.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "rgba(217,119,6,0.08)", color: "#d97706" }}>
                <CertIcon size={22} />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">No certificates yet</p>
              <p className="text-xs text-gray-400">Complete a course capstone to earn your certificate.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {certificates.map((cert) => {
                const contentLib = courseContent.find((c) => c.slug === cert.course_slug);
                const courseLib = courses.find((c) => c.slug === cert.course_slug);
                const title = contentLib?.title ?? courseLib?.title ?? cert.course_slug;
                const issuedDate = cert.created_at
                  ? new Date(cert.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })
                  : "";
                return (
                  <div key={cert.cert_id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(217,119,6,0.08)", color: "#d97706" }}>
                        <CertIcon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>{title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Certificate of Completion{issuedDate ? ` · ${issuedDate}` : ""}</p>
                        <p className="text-xs font-mono text-gray-400 mt-0.5">{cert.cert_id}</p>
                        <div className="flex gap-2 mt-3">
                          <Link href={`/dashboard/certificates/${cert.course_slug}`}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all hover:bg-amber-50"
                            style={{ borderColor: "#d97706", color: "#d97706" }}>
                            View &amp; Download PDF
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: "#0f1f3d" }}>Recent Activity</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {activity.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-gray-500">No activity yet. <Link href="/#courses" className="font-semibold" style={{ color: "#2d8a4e" }}>Start your first lesson.</Link></p>
              </div>
            ) : (
              activity.map((item) => {
                const iconMap: Record<string, React.ReactNode> = {
                  lesson: <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(45,138,78,0.1)", color: "#2d8a4e" }}><CheckIcon size={14} /></div>,
                  badge: <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(234,179,8,0.12)", color: "#ca8a04" }}><StarIcon size={13} /></div>,
                  sandbox: <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(15,31,61,0.07)", color: "#0f1f3d" }}><LightningIcon /></div>,
                };
                return (
                  <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                    {iconMap[item.type] || iconMap.lesson}
                    <div className="flex-1 min-w-0"><p className="text-sm text-gray-700 truncate">{item.description}</p></div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{new Date(item.created_at).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recommended next step */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: "#0f1f3d" }}>Recommended Next Step</h2>
          <div className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5" style={{ backgroundColor: "#0f1f3d" }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl" style={{ backgroundColor: "rgba(45,138,78,0.25)" }}>
              {firstActive ? firstActive.icon : "🤖"}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                {firstActive ? (firstActive.progressPct > 0 ? "Continue where you left off" : "Start your first lesson") : "Great place to start"}
              </p>
              <h3 className="text-base font-extrabold text-white mb-1">
                {firstActive ? firstActive.course_title : "AI Foundations"}
              </h3>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                {firstActive
                  ? `${firstActive.completedLessons} of ${firstActive.totalLessons} lessons complete`
                  : "7 lessons · Beginner · KSh 1,500 — Built for the Kenyan job market."}
              </p>
            </div>
            <Link
              href={firstActive ? `/courses/${firstActive.course_slug}/learn` : "/#courses"}
              className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90"
              style={{ backgroundColor: "#2d8a4e" }}>
              {firstActive ? "Continue" : "Start Learning"}
            </Link>
          </div>
        </div>

      </div>

      {/* Right sidebar (xl screens only) */}
      <aside className="hidden xl:block w-72 flex-shrink-0 border-l overflow-y-auto" style={{ borderColor: "#e5e7eb", backgroundColor: "#ffffff" }}>
        <div className="p-5 flex flex-col gap-7">

          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: "#0f1f3d" }}>Talent Profile</h3>
            <div className="flex flex-col items-center gap-3">
              <CircularProgress percentage={profileCompletion} />
              <p className="text-xs text-center text-gray-500 leading-relaxed">
                {profileCompletion < 50 ? "Complete your profile to get noticed by employers." : profileCompletion < 80 ? "You're halfway there — keep filling in your profile." : "Great profile! Employers can see your full talent."}
              </p>
              <Link href="/dashboard/profile" className="w-full text-center py-2 rounded-xl text-xs font-bold border-2 hover:opacity-80" style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>Complete Profile</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: "#0f1f3d" }}>Badges Earned</h3>
            {badges.length === 0 ? (
              <div className="rounded-xl p-4 text-center border" style={{ borderColor: "#e5e7eb", backgroundColor: "#fafafa" }}>
                <div className="text-2xl mb-2">🏅</div>
                <p className="text-xs text-gray-500 leading-relaxed">Complete a course to earn your first badge.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <button
                    key={badge.id}
                    type="button"
                    onClick={() => setSelectedBadge(badge)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ borderColor: "rgba(234,179,8,0.3)", backgroundColor: "rgba(234,179,8,0.08)", color: "#ca8a04" }}
                    aria-label="View badge details"
                  >
                    <span>{(BADGE_DETAILS[badge.badge_name] ?? FALLBACK_BADGE_DETAIL).icon}</span>
                    <span className="truncate max-w-[90px]">{badge.badge_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold" style={{ color: "#0f1f3d" }}>Jobs Matching You</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(45,138,78,0.1)", color: "#2d8a4e" }}>New</span>
            </div>
            <div className="flex flex-col gap-3">
              {jobs.map((job, i) => (
                <div key={i} className="rounded-xl border p-3.5 cursor-pointer transition-all hover:shadow-sm" style={{ borderColor: "#e5e7eb" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2d8a4e")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: "rgba(15,31,61,0.07)", color: "#0f1f3d" }}><BriefcaseIcon /></div>
                    <span className="text-xs font-semibold" style={{ color: "#0f1f3d" }}>{job.company}</span>
                  </div>
                  <p className="text-xs font-bold text-gray-800 mb-0.5">{job.role}</p>
                  <p className="text-xs" style={{ color: "#2d8a4e" }}>{job.salary}</p>
                </div>
              ))}
            </div>
          </div>


          {isAdmin && (
            <div>
              <h3 className="text-sm font-bold mb-3" style={{ color: "#0f1f3d" }}>Admin</h3>
              <Link
                href="/dashboard/support"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all hover:opacity-80"
                style={{ borderColor: "#0f1f3d", color: "#0f1f3d", background: "rgba(15,31,61,0.04)" }}
              >
                <span>🎧</span> Support Inbox
              </Link>
            </div>
          )}

        </div>
      </aside>

      {selectedBadge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(15,31,61,0.55)" }}
          onClick={() => setSelectedBadge(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Badge details"
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-3">{(BADGE_DETAILS[selectedBadge.badge_name] ?? FALLBACK_BADGE_DETAIL).icon}</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: "#0f1f3d" }}>{selectedBadge.badge_name}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              {(BADGE_DETAILS[selectedBadge.badge_name] ?? FALLBACK_BADGE_DETAIL).description}
            </p>
            <p className="text-xs font-semibold mb-5" style={{ color: "#ca8a04" }}>
              Earned on {selectedBadge.earned_at ? new Date(selectedBadge.earned_at).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" }) : "—"}
            </p>
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90"
              style={{ backgroundColor: "#0f1f3d" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

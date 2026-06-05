import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface TalentDetail {
  user_id: string;
  full_name: string;
  headline: string;
  bio: string;
  location: string;
  skills: string[];
  years_experience: number;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
}

async function getProfile(id: string): Promise<TalentDetail | null> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data } = await supabase
    .from("talent_profiles")
    .select("user_id, full_name, headline, bio, location, skills, years_experience, linkedin_url, github_url, portfolio_url")
    .eq("user_id", id)
    .eq("is_visible", true)
    .single();

  return data;
}

async function getBadges(userId: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data } = await supabase
    .from("user_badges")
    .select("badge_name, earned_at")
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });

  return data ?? [];
}

export default async function TalentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [profile, badges] = await Promise.all([getProfile(id), getBadges(id)]);

  if (!profile) notFound();

  const initials = profile.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <div style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#f9fafb", minHeight: "100vh" }}>

      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-white border-b" style={{ borderColor: "#e5e7eb" }}>
        <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/talent" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            All Talent
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex flex-col w-1 h-6 rounded-sm overflow-hidden">
              <div className="flex-1 bg-black" />
              <div className="flex-1 bg-[#bb0000]" />
              <div className="flex-1 bg-[#2d8a4e]" />
            </div>
            <span className="text-base font-bold" style={{ color: "#0f1f3d" }}>Tund<span style={{ color: "#2d8a4e" }}>emy</span></span>
          </Link>
          <Link href="/employer/post-job"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white"
            style={{ backgroundColor: "#2d8a4e" }}>
            Post a Job
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-5 py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* Left: main profile */}
          <div className="space-y-6">

            {/* Hero card */}
            <div className="rounded-2xl border bg-white p-7" style={{ borderColor: "#e5e7eb" }}>
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-extrabold text-white flex-shrink-0" style={{ backgroundColor: "#0f1f3d" }}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-extrabold" style={{ color: "#0f1f3d" }}>{profile.full_name}</h1>
                  {profile.headline && <p className="text-sm text-gray-600 mt-0.5">{profile.headline}</p>}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {profile.location && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {profile.location}
                      </span>
                    )}
                    {profile.years_experience > 0 && (
                      <span className="text-xs text-gray-400">{profile.years_experience} years experience</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Links */}
              {(profile.linkedin_url || profile.github_url || profile.portfolio_url) && (
                <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t" style={{ borderColor: "#f3f4f6" }}>
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:bg-blue-50"
                      style={{ borderColor: "#0077b5", color: "#0077b5" }}>
                      LinkedIn
                    </a>
                  )}
                  {profile.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:bg-gray-50"
                      style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>
                      GitHub
                    </a>
                  )}
                  {profile.portfolio_url && (
                    <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:bg-gray-50"
                      style={{ borderColor: "#6b7280", color: "#6b7280" }}>
                      Portfolio
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
                <h2 className="text-sm font-bold mb-3" style={{ color: "#0f1f3d" }}>About</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
                <h2 className="text-sm font-bold mb-4" style={{ color: "#0f1f3d" }}>AI Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span key={skill} className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ backgroundColor: "rgba(45,138,78,0.08)", color: "#166534" }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Badges */}
            {badges.length > 0 && (
              <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
                <h2 className="text-sm font-bold mb-4" style={{ color: "#0f1f3d" }}>Tundemy Badges</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {badges.map((badge, i) => {
                    const colors = ["#2d8a4e", "#9333ea", "#0ea5e9", "#d97706", "#bb0000", "#6366f1"];
                    const color = colors[i % colors.length];
                    const date = new Date(badge.earned_at).toLocaleDateString("en-KE", { month: "short", year: "numeric" });
                    return (
                      <div key={i} className="rounded-xl border p-3 text-center" style={{ borderColor: "#e5e7eb" }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: `${color}12` }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke={color} strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                          </svg>
                        </div>
                        <p className="text-xs font-bold" style={{ color: "#0f1f3d" }}>{badge.badge_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{date}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: contact card */}
          <div className="space-y-4">
            <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
              <p className="text-sm font-bold mb-2" style={{ color: "#0f1f3d" }}>Hire {profile.full_name.split(" ")[0]}</p>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Post a job on Tundemy or reach out directly through their linked profiles above.
              </p>
              <Link
                href={`/contact-request?candidate=${profile.user_id}&name=${encodeURIComponent(profile.full_name)}`}
                className="w-full py-3 rounded-xl text-sm font-bold text-white text-center block transition-all hover:opacity-90"
                style={{ backgroundColor: "#2d8a4e" }}>
                Send Contact Request →
              </Link>
              <Link href="/employer/post-job"
                className="w-full py-3 rounded-xl text-sm font-bold text-center block mt-2 border-2 transition-all hover:bg-gray-50"
                style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>
                Post a Job Instead
              </Link>
              <Link href="/talent"
                className="w-full py-2 rounded-xl text-xs font-semibold text-center block mt-1 text-gray-400 hover:text-gray-600"
                style={{}}>
                Browse All Talent
              </Link>
            </div>

            <div className="rounded-2xl border p-5" style={{ borderColor: "#e5e7eb", backgroundColor: "rgba(45,138,78,0.03)" }}>
              <p className="text-xs font-bold mb-1" style={{ color: "#2d8a4e" }}>Verified via Tundemy</p>
              <p className="text-xs text-gray-500 leading-relaxed">This candidate completed structured AI courses with sandbox projects and quiz assessments — not just a certificate.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

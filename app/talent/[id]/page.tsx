import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import UnlockGate from "./unlock-gate";
import CapstoneCard from "./capstone-card";
import { decrypt } from "@/lib/encryption";

interface VerifiedTrack {
  track: string;
  score: number;
  taken_at: string;
}

interface GradingDetail {
  rubric_scores?: Array<{ criterion: string; score: number; max: number }>;
  did_well?: string[];
  improvements?: Array<{ area: string; missing: string; whyMatters: string; betterExample: string }>;
  specific_fixes?: string[];
}

interface CapstoneWork {
  course_slug: string;
  title: string;
  summary: string;
  score: number | null;
  submission_text?: string | null;
  grading_detail?: GradingDetail | null;
}

interface Badge {
  course_slug: string;
  badge_name: string;
  icon: string | null;
  awarded_at: string;
}

interface TalentDetail {
  user_id: string;
  full_name: string;
  headline: string;
  auto_headline: string;
  bio: string;
  auto_bio: string;
  location: string;
  skills: string[];
  self_reported_skills: string[];
  self_reported_experience: { title: string; company: string; duration: string; description: string }[];
  self_reported_projects: { title: string; description: string; link: string }[];
  years_experience: number;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  contact_email?: string;
  contact_phone?: string;
  phone?: string;
  availability: "available" | "open_to_offers" | "not_available";
  profile_complete: boolean;
}

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
}

async function getProfile(id: string): Promise<TalentDetail | null> {
  const supabase = await getServerSupabase();
  const { data } = await supabase
    .from("talent_profiles")
    .select(
      "user_id, full_name, headline, auto_headline, bio, auto_bio, location, skills, self_reported_skills, self_reported_experience, self_reported_projects, years_experience, linkedin_url, github_url, portfolio_url, contact_email, contact_phone, phone, availability, profile_complete"
    )
    .eq("user_id", id)
    .eq("is_visible", true)
    .single();

  return data;
}

async function getVerifiedTracks(userId: string): Promise<VerifiedTrack[]> {
  const supabase = await getServerSupabase();
  const { data } = await supabase
    .from("assessments")
    .select("track, score, taken_at")
    .eq("user_id", userId)
    .eq("passed", true)
    .order("taken_at", { ascending: false });

  return data ?? [];
}

async function getCapstoneWork(userId: string): Promise<CapstoneWork[]> {
  const supabase = await getServerSupabase();
  const { data } = await supabase
    .from("talent_capstone_work")
    .select("course_slug, title, summary, score, submission_text, grading_detail")
    .eq("user_id", userId);

  return data ?? [];
}

async function getBadges(userId: string): Promise<Badge[]> {
  const supabase = await getServerSupabase();
  const { data } = await supabase
    .from("talent_badges")
    .select("course_slug, badge_name, icon, awarded_at")
    .eq("user_id", userId)
    .order("awarded_at", { ascending: false });

  return data ?? [];
}

export default async function TalentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const [profile, badges, verifiedTracks, capstones] = await Promise.all([
    getProfile(id),
    getBadges(id),
    getVerifiedTracks(id),
    getCapstoneWork(id),
  ]);

  if (!profile) notFound();

  let isEmployer = false;
  let alreadyUnlocked = false;
  let bundleRemaining = 0;

  if (user) {
    isEmployer = user.user_metadata?.role === "employer";
    const admin = getServiceClient();
    const [unlockRes, bundleRes] = await Promise.all([
      admin.from("employer_unlocks").select("candidate_id").eq("employer_id", user.id).eq("candidate_id", id).maybeSingle(),
      admin.from("employer_bundles").select("profiles_remaining, expires_at").eq("employer_id", user.id).maybeSingle(),
    ]);
    alreadyUnlocked = !!unlockRes.data;
    if (bundleRes.data && new Date(bundleRes.data.expires_at).getTime() > Date.now()) {
      bundleRemaining = bundleRes.data.profiles_remaining;
    }
  }

  // Decrypt contact fields server-side. Only pass decrypted values to
  // UnlockGate if the employer actually has a valid unlock — otherwise pass
  // null so the locked UI shows placeholder text, not real data.
  const decryptSafe = (value: string | undefined | null): string | undefined => {
    if (!value) return undefined;
    try { return decrypt(value); } catch { return undefined; }
  };
  const contactEmail   = alreadyUnlocked ? decryptSafe(profile.contact_email)  : undefined;
  const contactPhone   = alreadyUnlocked ? decryptSafe(profile.contact_phone)  : undefined;
  const contactPhoneAlt = alreadyUnlocked ? decryptSafe(profile.phone)         : undefined;

  const initials = profile.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const headline = profile.headline || profile.auto_headline;
  const bio = profile.bio || profile.auto_bio;
  const allSkills = Array.from(new Set([...(profile.skills ?? []), ...(profile.self_reported_skills ?? [])]));

  const availabilityLabel = {
    available: { text: "Available now", color: "#2d8a4e" },
    open_to_offers: { text: "Open to offers", color: "#e3a008" },
    not_available: { text: "Not available", color: "#6b7280" },
  }[profile.availability ?? "available"];

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
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-extrabold" style={{ color: "#0f1f3d" }}>{profile.full_name}</h1>
                    {profile.profile_complete && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: "rgba(45,138,78,0.1)", color: "#2d8a4e" }}>
                        ✓ Tundemy Verified
                      </span>
                    )}
                  </div>
                  {headline && <p className="text-sm text-gray-600 mt-0.5">{headline}</p>}
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
                    {availabilityLabel && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${availabilityLabel.color}14`, color: availabilityLabel.color }}>
                        {availabilityLabel.text}
                      </span>
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
            {bio && (
              <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
                <h2 className="text-sm font-bold mb-3" style={{ color: "#0f1f3d" }}>About</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{bio}</p>
              </div>
            )}

            {/* Skills */}
            {allSkills.length > 0 && (
              <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
                <h2 className="text-sm font-bold mb-4" style={{ color: "#0f1f3d" }}>AI Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((skill) => (
                    <span key={skill} className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ backgroundColor: "rgba(45,138,78,0.08)", color: "#166534" }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Built (AI capstone summaries -- expandable) */}
            {capstones.length > 0 && (
              <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
                <h2 className="text-sm font-bold mb-4" style={{ color: "#0f1f3d" }}>Projects Built</h2>
                <div className="space-y-3">
                  {capstones.map((c) => (
                    <CapstoneCard
                      key={c.course_slug}
                      courseSlug={c.course_slug}
                      title={c.title}
                      summary={c.summary}
                      score={c.score}
                      submissionText={c.submission_text}
                      gradingDetail={c.grading_detail}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Self-reported experience */}
            {profile.self_reported_experience && profile.self_reported_experience.length > 0 && (
              <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
                <h2 className="text-sm font-bold mb-4" style={{ color: "#0f1f3d" }}>Experience</h2>
                <div className="space-y-3">
                  {profile.self_reported_experience.map((exp, i) => (
                    <div key={i} className="rounded-xl border p-4" style={{ borderColor: "#e5e7eb" }}>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>{exp.title}{exp.company ? ` · ${exp.company}` : ""}</p>
                        {exp.duration && <span className="text-xs text-gray-400 flex-shrink-0">{exp.duration}</span>}
                      </div>
                      {exp.description && <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Self-reported projects */}
            {profile.self_reported_projects && profile.self_reported_projects.length > 0 && (
              <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
                <h2 className="text-sm font-bold mb-4" style={{ color: "#0f1f3d" }}>Other Projects</h2>
                <div className="space-y-3">
                  {profile.self_reported_projects.map((proj, i) => (
                    <div key={i} className="rounded-xl border p-4" style={{ borderColor: "#e5e7eb" }}>
                      <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>{proj.title}</p>
                      {proj.description && <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{proj.description}</p>}
                      {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold underline mt-1.5 inline-block" style={{ color: "#2d8a4e" }}>View →</a>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verified Tracks */}
            {verifiedTracks.length > 0 && (
              <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
                <h2 className="text-sm font-bold mb-4" style={{ color: "#0f1f3d" }}>Verified Tracks</h2>
                <div className="space-y-3">
                  {verifiedTracks.map((vt) => (
                    <div key={vt.track} className="rounded-xl border p-4 flex items-center justify-between gap-3" style={{ borderColor: "#e5e7eb" }}>
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: "rgba(45,138,78,0.1)", color: "#2d8a4e" }}>
                          ✓
                        </span>
                        <div>
                          <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>{vt.track}</p>
                          <p className="text-xs text-gray-400">
                            Assessed {new Date(vt.taken_at).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-extrabold flex-shrink-0" style={{ color: "#2d8a4e" }}>{vt.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Badges */}
            {badges.length > 0 && (
              <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
                <h2 className="text-sm font-bold mb-4" style={{ color: "#0f1f3d" }}>Tundemy Badges</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {badges.map((badge) => (
                    <div key={badge.course_slug} className="rounded-xl border p-3 text-center" style={{ borderColor: "#e5e7eb" }}>
                      <p className="text-lg">{badge.icon || "✅"}</p>
                      <p className="text-xs font-bold mt-1" style={{ color: "#0f1f3d" }}>{badge.badge_name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: contact card */}
          <div className="space-y-4">
            <UnlockGate
              candidateId={profile.user_id}
              candidateName={profile.full_name}
              bundleRemaining={bundleRemaining}
              contactEmail={contactEmail}
              contactPhone={contactPhone}
              phone={contactPhoneAlt}
              linkedinUrl={profile.linkedin_url}
              portfolioUrl={profile.portfolio_url}
              initiallyUnlocked={alreadyUnlocked}
              isEmployer={isEmployer}
            />

            <Link href="/employer/post-job"
              className="w-full py-3 rounded-xl text-sm font-bold text-center block transition-all hover:bg-gray-50 border-2"
              style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>
              Post a Job Instead
            </Link>
            <Link href="/talent"
              className="w-full py-2 rounded-xl text-xs font-semibold text-center block text-gray-400 hover:text-gray-600">
              Browse All Talent
            </Link>

            <div className="rounded-2xl border p-5" style={{ borderColor: "#e5e7eb", backgroundColor: "rgba(45,138,78,0.03)" }}>
              <p className="text-xs font-bold mb-1" style={{ color: "#2d8a4e" }}>Verified via Tundemy</p>
              <p className="text-xs text-gray-500 leading-relaxed">This candidate completed structured AI courses with sandbox capstone projects, graded automatically — not just a certificate.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

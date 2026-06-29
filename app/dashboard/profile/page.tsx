"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface ProjectItem {
  title: string;
  description: string;
  link: string;
}

interface Badge {
  course_slug: string;
  badge_name: string;
  icon: string | null;
  awarded_at: string;
}

interface CapstoneWork {
  course_slug: string;
  title: string;
  summary: string;
  score: number | null;
}

interface Profile {
  full_name: string;
  headline: string;
  bio: string;
  auto_headline: string;
  auto_bio: string;
  location: string;
  skills: string[];
  self_reported_skills: string[];
  self_reported_experience: ExperienceItem[];
  self_reported_projects: ProjectItem[];
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  is_visible: boolean;
  years_experience: number;
  phone: string;
  availability: "available" | "open_to_offers" | "not_available";
  profile_complete: boolean;
  last_generated_at: string | null;
}

const SKILLS_LIST = [
  "Prompt Engineering", "AI Workflows", "ChatGPT", "Claude", "Python",
  "Data Analysis", "Machine Learning", "LangChain", "RAG", "Fine-tuning",
  "AI Strategy", "No-Code AI", "Image Generation", "API Integration", "SQL",
];

const AVAILABILITY_OPTIONS: { value: Profile["availability"]; label: string; color: string }[] = [
  { value: "available", label: "Available now", color: "#2d8a4e" },
  { value: "open_to_offers", label: "Open to offers", color: "#e3a008" },
  { value: "not_available", label: "Not available", color: "#6b7280" },
];

const EMPTY_PROFILE: Profile = {
  full_name: "", headline: "", bio: "", auto_headline: "", auto_bio: "", location: "",
  skills: [], self_reported_skills: [], self_reported_experience: [], self_reported_projects: [],
  linkedin_url: "", github_url: "", portfolio_url: "",
  is_visible: true, years_experience: 0, phone: "",
  availability: "available", profile_complete: false, last_generated_at: null,
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [capstones, setCapstones] = useState<CapstoneWork[]>([]);
  const [newSkillTag, setNewSkillTag] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login?next=/dashboard/profile"); return; }

      const [{ data }, { data: badgeRows }, { data: capstoneRows }] = await Promise.all([
        supabase.from("talent_profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("talent_badges").select("course_slug, badge_name, icon, awarded_at").eq("user_id", user.id),
        supabase.from("talent_capstone_work").select("course_slug, title, summary, score").eq("user_id", user.id),
      ]);

      if (data) {
        setProfile({
          full_name: data.full_name ?? "",
          headline: data.headline ?? "",
          bio: data.bio ?? "",
          auto_headline: data.auto_headline ?? "",
          auto_bio: data.auto_bio ?? "",
          location: data.location ?? "",
          skills: data.skills ?? [],
          self_reported_skills: data.self_reported_skills ?? [],
          self_reported_experience: data.self_reported_experience ?? [],
          self_reported_projects: data.self_reported_projects ?? [],
          linkedin_url: data.linkedin_url ?? "",
          github_url: data.github_url ?? "",
          portfolio_url: data.portfolio_url ?? "",
          is_visible: data.is_visible ?? true,
          years_experience: data.years_experience ?? 0,
          phone: data.phone ?? "",
          availability: data.availability ?? "available",
          profile_complete: data.profile_complete ?? false,
          last_generated_at: data.last_generated_at ?? null,
        });
      }
      setBadges(badgeRows ?? []);
      setCapstones(capstoneRows ?? []);
      setLoading(false);
    }
    load();
  }, [router]);

  const toggleSkill = (skill: string) => {
    setProfile((p) => ({
      ...p,
      skills: p.skills.includes(skill) ? p.skills.filter((s) => s !== skill) : [...p.skills, skill],
    }));
  };

  const addSelfReportedSkill = () => {
    const tag = newSkillTag.trim();
    if (!tag || profile.self_reported_skills.includes(tag)) return;
    setProfile((p) => ({ ...p, self_reported_skills: [...p.self_reported_skills, tag] }));
    setNewSkillTag("");
  };

  const removeSelfReportedSkill = (tag: string) => {
    setProfile((p) => ({ ...p, self_reported_skills: p.self_reported_skills.filter((s) => s !== tag) }));
  };

  const addExperience = () => {
    setProfile((p) => ({
      ...p,
      self_reported_experience: [...p.self_reported_experience, { title: "", company: "", duration: "", description: "" }],
    }));
  };
  const updateExperience = (i: number, field: keyof ExperienceItem, value: string) => {
    setProfile((p) => ({
      ...p,
      self_reported_experience: p.self_reported_experience.map((e, idx) => idx === i ? { ...e, [field]: value } : e),
    }));
  };
  const removeExperience = (i: number) => {
    setProfile((p) => ({ ...p, self_reported_experience: p.self_reported_experience.filter((_, idx) => idx !== i) }));
  };

  const addProject = () => {
    setProfile((p) => ({
      ...p,
      self_reported_projects: [...p.self_reported_projects, { title: "", description: "", link: "" }],
    }));
  };
  const updateProject = (i: number, field: keyof ProjectItem, value: string) => {
    setProfile((p) => ({
      ...p,
      self_reported_projects: p.self_reported_projects.map((e, idx) => idx === i ? { ...e, [field]: value } : e),
    }));
  };
  const removeProject = (i: number) => {
    setProfile((p) => ({ ...p, self_reported_projects: p.self_reported_projects.filter((_, idx) => idx !== i) }));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch("/api/talent/generate-profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not generate profile");
      setProfile((p) => ({
        ...p,
        auto_headline: data.headline ?? p.auto_headline,
        auto_bio: data.bio ?? p.auto_bio,
        skills: data.skills ?? p.skills,
        profile_complete: true,
      }));
      // Reload capstone summaries since generate-profile rewrites them
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: capstoneRows } = await supabase.from("talent_capstone_work").select("course_slug, title, summary, score").eq("user_id", user.id);
        setCapstones(capstoneRows ?? []);
      }
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("talent_profiles").upsert(
      {
        user_id: user.id,
        full_name: profile.full_name,
        headline: profile.headline,
        bio: profile.bio,
        location: profile.location,
        skills: profile.skills,
        self_reported_skills: profile.self_reported_skills,
        self_reported_experience: profile.self_reported_experience,
        self_reported_projects: profile.self_reported_projects,
        linkedin_url: profile.linkedin_url,
        github_url: profile.github_url,
        portfolio_url: profile.portfolio_url,
        is_visible: profile.is_visible,
        years_experience: profile.years_experience,
        phone: profile.phone,
        availability: profile.availability,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-[3px] animate-spin" style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const displayHeadline = profile.headline || profile.auto_headline;
  const displayBio = profile.bio || profile.auto_bio;
  const allSkills = Array.from(new Set([...profile.skills, ...profile.self_reported_skills]));

  if (preview) {
    return (
      <div className="p-5 lg:p-8 space-y-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>Preview</h1>
          <button onClick={() => setPreview(false)} className="text-xs font-bold px-4 py-2 rounded-xl border-2" style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>
            ← Back to Editor
          </button>
        </div>
        <div className="rounded-2xl border bg-white p-7" style={{ borderColor: "#e5e7eb" }}>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-extrabold text-white flex-shrink-0" style={{ backgroundColor: "#0f1f3d" }}>
              {(profile.full_name || "?").split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold" style={{ color: "#0f1f3d" }}>{profile.full_name || "Your Name"}</h2>
                {profile.profile_complete && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(45,138,78,0.1)", color: "#2d8a4e" }}>✓ Tundemy Verified</span>
                )}
              </div>
              {displayHeadline && <p className="text-sm text-gray-600 mt-0.5">{displayHeadline}</p>}
              {profile.location && <p className="text-xs text-gray-400 mt-1">{profile.location}</p>}
            </div>
          </div>
          {displayBio && <p className="text-sm text-gray-700 leading-relaxed mt-5 pt-5 border-t" style={{ borderColor: "#f3f4f6" }}>{displayBio}</p>}
        </div>
        {allSkills.length > 0 && (
          <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: "#0f1f3d" }}>Skills</h3>
            <div className="flex flex-wrap gap-2">
              {allSkills.map((s) => <span key={s} className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ backgroundColor: "rgba(45,138,78,0.08)", color: "#166534" }}>{s}</span>)}
            </div>
          </div>
        )}
        {capstones.length > 0 && (
          <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: "#0f1f3d" }}>Projects Built</h3>
            <div className="space-y-3">
              {capstones.map((c) => (
                <div key={c.course_slug} className="rounded-xl border p-4" style={{ borderColor: "#e5e7eb" }}>
                  <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>{c.title}</p>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{c.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-gray-400 text-center">This is what employers see once your profile is visible.</p>
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-8 space-y-8 max-w-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>Talent Profile</h1>
          <p className="text-sm text-gray-500 mt-1">This is your public profile visible to employers on the talent pool.</p>
        </div>
        <button onClick={() => setPreview(true)} className="flex-shrink-0 text-xs font-bold px-4 py-2.5 rounded-xl border-2" style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>
          Preview
        </button>
      </div>

      {/* AI generation */}
      <div className="rounded-2xl border p-5" style={{ borderColor: "rgba(45,138,78,0.3)", backgroundColor: "rgba(45,138,78,0.04)" }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: "#0f1f3d" }}>✨ AI-Generated Profile</p>
            <p className="text-xs text-gray-500 mt-1">
              {capstones.length > 0
                ? `Generate a professional headline, bio, and skills from your ${capstones.length} passed capstone project${capstones.length === 1 ? "" : "s"}.`
                : "Complete and pass a course capstone to unlock AI profile generation."}
            </p>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={generating || capstones.length === 0}
          className="mt-3 px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#2d8a4e" }}>
          {generating ? "Generating…" : profile.profile_complete ? "Regenerate with AI" : "Generate with AI"}
        </button>
        {generateError && <p className="text-xs font-semibold mt-2" style={{ color: "#bb0000" }}>{generateError}</p>}
      </div>

      {/* Visibility toggle */}
      <div className="rounded-2xl border p-4 flex items-center justify-between" style={{ borderColor: "#e5e7eb", backgroundColor: profile.is_visible ? "rgba(45,138,78,0.04)" : "#fff" }}>
        <div>
          <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>
            {profile.is_visible ? "Profile visible to employers" : "Profile hidden"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {profile.is_visible ? "Employers can discover and contact you." : "Your profile won't appear in the talent pool."}
          </p>
        </div>
        <button
          onClick={() => setProfile((p) => ({ ...p, is_visible: !p.is_visible }))}
          className="relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
          style={{ backgroundColor: profile.is_visible ? "#2d8a4e" : "#d1d5db" }}>
          <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" style={{ transform: profile.is_visible ? "translateX(24px)" : "translateX(0)" }} />
        </button>
      </div>

      {/* Availability */}
      <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
        <h2 className="text-sm font-bold mb-3" style={{ color: "#0f1f3d" }}>Availability</h2>
        <div className="flex flex-wrap gap-2">
          {AVAILABILITY_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => setProfile((p) => ({ ...p, availability: opt.value }))}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
              style={{
                borderColor: profile.availability === opt.value ? opt.color : "#e5e7eb",
                backgroundColor: profile.availability === opt.value ? `${opt.color}14` : "#fff",
                color: profile.availability === opt.value ? opt.color : "#6b7280",
              }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Headline & Bio (AI-generated, user-editable override) */}
      <div className="rounded-2xl border bg-white p-6 space-y-4" style={{ borderColor: "#e5e7eb" }}>
        <h2 className="text-sm font-bold" style={{ color: "#0f1f3d" }}>Headline & Bio</h2>
        {profile.auto_headline && !profile.headline && (
          <p className="text-xs font-semibold flex items-center gap-1" style={{ color: "#2d8a4e" }}>✨ Generated by Tundemy AI — edit below to override</p>
        )}
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-600">Professional Headline</label>
          <input
            value={profile.headline}
            onChange={(e) => setProfile((p) => ({ ...p, headline: e.target.value }))}
            placeholder={profile.auto_headline || "AI Specialist & Prompt Engineer"}
            className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-colors"
            style={{ borderColor: "#e5e7eb" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-600">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
            placeholder={profile.auto_bio || "Tell employers about your background, what you've built with AI, and what you're looking for…"}
            rows={5}
            className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none resize-none transition-colors"
            style={{ borderColor: "#e5e7eb", lineHeight: "1.6" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
          />
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
          <h2 className="text-sm font-bold mb-4" style={{ color: "#0f1f3d" }}>Badges Earned</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {badges.map((b) => (
              <div key={b.course_slug} className="rounded-xl border p-3 text-center" style={{ borderColor: "#e5e7eb" }}>
                <p className="text-lg">{b.icon || "✅"}</p>
                <p className="text-xs font-bold mt-1" style={{ color: "#0f1f3d" }}>{b.badge_name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects built (AI capstone summaries, read-only) */}
      {capstones.length > 0 && (
        <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
          <h2 className="text-sm font-bold mb-1" style={{ color: "#0f1f3d" }}>Projects Built</h2>
          <p className="text-xs text-gray-400 mb-4">Generated from your passed capstone projects. Regenerate above to refresh.</p>
          <div className="space-y-3">
            {capstones.map((c) => (
              <div key={c.course_slug} className="rounded-xl border p-4" style={{ borderColor: "#e5e7eb" }}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>{c.title}</p>
                  {c.score != null && <span className="text-xs font-bold flex-shrink-0" style={{ color: "#2d8a4e" }}>{c.score}%</span>}
                </div>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{c.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Basic info */}
      <div className="rounded-2xl border bg-white p-6 space-y-4" style={{ borderColor: "#e5e7eb" }}>
        <h2 className="text-sm font-bold" style={{ color: "#0f1f3d" }}>Basic Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Full Name", key: "full_name", placeholder: "Jane Wanjiku" },
            { label: "Location", key: "location", placeholder: "Nairobi, Kenya" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold mb-1.5 text-gray-600">{label}</label>
              <input
                value={(profile as unknown as Record<string, string>)[key]}
                onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-colors"
                style={{ borderColor: "#e5e7eb" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-600">Years of Experience</label>
          <input
            type="number" min={0} max={50}
            value={profile.years_experience}
            onChange={(e) => setProfile((p) => ({ ...p, years_experience: parseInt(e.target.value) || 0 }))}
            className="w-32 px-4 py-2.5 text-sm border rounded-xl outline-none transition-colors"
            style={{ borderColor: "#e5e7eb" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
          />
        </div>
      </div>

      {/* Contact info */}
      <div className="rounded-2xl border bg-white p-6 space-y-4" style={{ borderColor: "#e5e7eb" }}>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold" style={{ color: "#0f1f3d" }}>Contact Information</h2>
          <span className="group relative text-gray-400 cursor-help" title="Only shared with employers after they unlock your profile">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
          </span>
        </div>
        <p className="text-xs text-gray-400">🔒 Locked — only revealed to employers after they unlock your profile.</p>
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-600">Phone Number</label>
          <input
            value={profile.phone}
            onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
            placeholder="+254 7XX XXX XXX"
            className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-colors"
            style={{ borderColor: "#e5e7eb" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
          />
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
        <h2 className="text-sm font-bold mb-1" style={{ color: "#0f1f3d" }}>AI Skills</h2>
        <p className="text-xs text-gray-400 mb-4">Select all that apply. These appear as tags on your profile.</p>
        <div className="flex flex-wrap gap-2">
          {SKILLS_LIST.map((skill) => {
            const selected = profile.skills.includes(skill);
            return (
              <button key={skill} onClick={() => toggleSkill(skill)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
                style={{ borderColor: selected ? "#2d8a4e" : "#e5e7eb", backgroundColor: selected ? "rgba(45,138,78,0.08)" : "#fff", color: selected ? "#166534" : "#6b7280" }}>
                {skill}
              </button>
            );
          })}
        </div>

        <p className="text-xs font-semibold text-gray-500 mt-5 mb-2">Add your own skill tags</p>
        <div className="flex gap-2">
          <input value={newSkillTag} onChange={(e) => setNewSkillTag(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSelfReportedSkill(); } }}
            placeholder="e.g. Zapier Automation"
            className="flex-1 px-4 py-2.5 text-sm border rounded-xl outline-none"
            style={{ borderColor: "#e5e7eb" }} />
          <button onClick={addSelfReportedSkill} className="px-4 py-2.5 rounded-xl text-xs font-bold border-2" style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>Add</button>
        </div>
        {profile.self_reported_skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {profile.self_reported_skills.map((s) => (
              <span key={s} className="text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5" style={{ backgroundColor: "rgba(15,31,61,0.06)", color: "#0f1f3d" }}>
                {s}
                <button onClick={() => removeSelfReportedSkill(s)} className="hover:opacity-60">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Experience CRUD */}
      <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold" style={{ color: "#0f1f3d" }}>Experience</h2>
          <button onClick={addExperience} className="text-xs font-bold" style={{ color: "#2d8a4e" }}>+ Add</button>
        </div>
        <div className="space-y-4">
          {profile.self_reported_experience.map((exp, i) => (
            <div key={i} className="rounded-xl border p-4 space-y-2 relative" style={{ borderColor: "#e5e7eb" }}>
              <button onClick={() => removeExperience(i)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xs">✕</button>
              <input value={exp.title} onChange={(e) => updateExperience(i, "title", e.target.value)} placeholder="Role title"
                className="w-full px-3 py-2 text-sm border rounded-lg outline-none" style={{ borderColor: "#e5e7eb" }} />
              <div className="grid grid-cols-2 gap-2">
                <input value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} placeholder="Company"
                  className="w-full px-3 py-2 text-sm border rounded-lg outline-none" style={{ borderColor: "#e5e7eb" }} />
                <input value={exp.duration} onChange={(e) => updateExperience(i, "duration", e.target.value)} placeholder="e.g. 2023–Present"
                  className="w-full px-3 py-2 text-sm border rounded-lg outline-none" style={{ borderColor: "#e5e7eb" }} />
              </div>
              <textarea value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} placeholder="What you did" rows={2}
                className="w-full px-3 py-2 text-sm border rounded-lg outline-none resize-none" style={{ borderColor: "#e5e7eb" }} />
            </div>
          ))}
          {profile.self_reported_experience.length === 0 && <p className="text-xs text-gray-400">No experience added yet.</p>}
        </div>
      </div>

      {/* Projects CRUD */}
      <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold" style={{ color: "#0f1f3d" }}>Other Projects</h2>
          <button onClick={addProject} className="text-xs font-bold" style={{ color: "#2d8a4e" }}>+ Add</button>
        </div>
        <div className="space-y-4">
          {profile.self_reported_projects.map((proj, i) => (
            <div key={i} className="rounded-xl border p-4 space-y-2 relative" style={{ borderColor: "#e5e7eb" }}>
              <button onClick={() => removeProject(i)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xs">✕</button>
              <input value={proj.title} onChange={(e) => updateProject(i, "title", e.target.value)} placeholder="Project title"
                className="w-full px-3 py-2 text-sm border rounded-lg outline-none" style={{ borderColor: "#e5e7eb" }} />
              <textarea value={proj.description} onChange={(e) => updateProject(i, "description", e.target.value)} placeholder="What you built" rows={2}
                className="w-full px-3 py-2 text-sm border rounded-lg outline-none resize-none" style={{ borderColor: "#e5e7eb" }} />
              <input value={proj.link} onChange={(e) => updateProject(i, "link", e.target.value)} placeholder="Link (optional)"
                className="w-full px-3 py-2 text-sm border rounded-lg outline-none" style={{ borderColor: "#e5e7eb" }} />
            </div>
          ))}
          {profile.self_reported_projects.length === 0 && <p className="text-xs text-gray-400">No other projects added yet.</p>}
        </div>
      </div>

      {/* Links */}
      <div className="rounded-2xl border bg-white p-6 space-y-4" style={{ borderColor: "#e5e7eb" }}>
        <h2 className="text-sm font-bold" style={{ color: "#0f1f3d" }}>Links</h2>
        {[
          { label: "LinkedIn", key: "linkedin_url", placeholder: "https://linkedin.com/in/yourname" },
          { label: "GitHub", key: "github_url", placeholder: "https://github.com/yourname" },
          { label: "Portfolio / Website", key: "portfolio_url", placeholder: "https://yoursite.com" },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-semibold mb-1.5 text-gray-600">{label}</label>
            <input
              value={(profile as unknown as Record<string, string>)[key]}
              onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
              placeholder={placeholder}
              type="url"
              className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-colors"
              style={{ borderColor: "#e5e7eb" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
            />
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving}
        className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: saved ? "#166534" : "#2d8a4e" }}>
        {saved ? "Saved!" : saving ? "Saving…" : "Save Profile"}
      </button>
    </div>
  );
}

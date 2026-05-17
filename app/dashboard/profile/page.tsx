"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface Profile {
  full_name: string;
  headline: string;
  bio: string;
  location: string;
  skills: string[];
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  is_visible: boolean;
  years_experience: number;
}

const SKILLS_LIST = [
  "Prompt Engineering", "AI Workflows", "ChatGPT", "Claude", "Python",
  "Data Analysis", "Machine Learning", "LangChain", "RAG", "Fine-tuning",
  "AI Strategy", "No-Code AI", "Image Generation", "API Integration", "SQL",
];

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    full_name: "", headline: "", bio: "", location: "",
    skills: [], linkedin_url: "", github_url: "", portfolio_url: "",
    is_visible: true, years_experience: 0,
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login?next=/dashboard/profile"); return; }

      const { data } = await supabase
        .from("talent_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name ?? "",
          headline: data.headline ?? "",
          bio: data.bio ?? "",
          location: data.location ?? "",
          skills: data.skills ?? [],
          linkedin_url: data.linkedin_url ?? "",
          github_url: data.github_url ?? "",
          portfolio_url: data.portfolio_url ?? "",
          is_visible: data.is_visible ?? true,
          years_experience: data.years_experience ?? 0,
        });
      }
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

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("talent_profiles").upsert(
      { user_id: user.id, ...profile, updated_at: new Date().toISOString() },
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

  return (
    <div className="p-5 lg:p-8 space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>Talent Profile</h1>
        <p className="text-sm text-gray-500 mt-1">This is your public profile visible to employers on the talent pool.</p>
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
          <label className="block text-xs font-semibold mb-1.5 text-gray-600">Professional Headline</label>
          <input
            value={profile.headline}
            onChange={(e) => setProfile((p) => ({ ...p, headline: e.target.value }))}
            placeholder="AI Specialist &amp; Prompt Engineer"
            className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-colors"
            style={{ borderColor: "#e5e7eb" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
          />
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
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-600">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
            placeholder="Tell employers about your background, what you've built with AI, and what you're looking for…"
            rows={4}
            className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none resize-none transition-colors"
            style={{ borderColor: "#e5e7eb", lineHeight: "1.6" }}
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

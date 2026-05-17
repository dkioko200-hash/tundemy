"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"] as const;
const INDUSTRIES = [
  "Technology", "Finance / Fintech", "Healthcare", "Education", "E-commerce",
  "Media & Entertainment", "Agriculture", "Government / NGO", "Consulting", "Other",
] as const;

interface CompanyProfile {
  company_name: string;
  company_size: string;
  industry: string;
  website: string;
  description: string;
  hq_location: string;
  contact_email: string;
}

export default function CompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<CompanyProfile>({
    company_name: "", company_size: "11–50", industry: "Technology",
    website: "", description: "", hq_location: "", contact_email: "",
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login?next=/employer/dashboard/company"); return; }

      const { data } = await supabase
        .from("employer_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setProfile({
          company_name: data.company_name ?? "",
          company_size: data.company_size ?? "11–50",
          industry: data.industry ?? "Technology",
          website: data.website ?? "",
          description: data.description ?? "",
          hq_location: data.hq_location ?? "",
          contact_email: data.contact_email ?? "",
        });
      }
      setLoading(false);
    }
    load();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("employer_profiles").upsert(
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
        <h1 className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>Company Profile</h1>
        <p className="text-sm text-gray-500 mt-1">This information appears on your job listings and helps attract the right candidates.</p>
      </div>

      <div className="rounded-2xl border bg-white p-6 space-y-4" style={{ borderColor: "#e5e7eb" }}>
        <h2 className="text-sm font-bold" style={{ color: "#0f1f3d" }}>Company Details</h2>
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-600">Company Name</label>
          <input value={profile.company_name} onChange={(e) => setProfile((p) => ({ ...p, company_name: e.target.value }))}
            placeholder="Acme Corp"
            className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
            style={{ borderColor: "#e5e7eb" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-gray-600">Company Size</label>
            <select value={profile.company_size} onChange={(e) => setProfile((p) => ({ ...p, company_size: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none bg-white" style={{ borderColor: "#e5e7eb" }}>
              {COMPANY_SIZES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-gray-600">Industry</label>
            <select value={profile.industry} onChange={(e) => setProfile((p) => ({ ...p, industry: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none bg-white" style={{ borderColor: "#e5e7eb" }}>
              {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-gray-600">Headquarters</label>
            <input value={profile.hq_location} onChange={(e) => setProfile((p) => ({ ...p, hq_location: e.target.value }))}
              placeholder="Nairobi, Kenya"
              className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
              style={{ borderColor: "#e5e7eb" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-gray-600">Contact Email</label>
            <input type="email" value={profile.contact_email} onChange={(e) => setProfile((p) => ({ ...p, contact_email: e.target.value }))}
              placeholder="hiring@company.com"
              className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
              style={{ borderColor: "#e5e7eb" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-600">Website</label>
          <input type="url" value={profile.website} onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
            placeholder="https://company.com"
            className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none"
            style={{ borderColor: "#e5e7eb" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-600">About the Company</label>
          <textarea value={profile.description} onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))}
            placeholder="Tell candidates about your mission, culture, and what you're building with AI…"
            rows={5}
            className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none resize-none"
            style={{ borderColor: "#e5e7eb", lineHeight: "1.6" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")} />
        </div>
      </div>

      <button onClick={handleSave} disabled={saving || !profile.company_name}
        className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: saved ? "#166534" : "#2d8a4e" }}>
        {saved ? "Saved!" : saving ? "Saving…" : "Save Company Profile"}
      </button>
    </div>
  );
}

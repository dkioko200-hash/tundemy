"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

interface TalentProfile {
  user_id: string;
  full_name: string;
  headline: string;
  location: string;
  skills: string[];
  years_experience: number;
  track?: string;
}

const TRACKS = [
  { label: "All Tracks", value: "" },
  { label: "AI Professional", value: "AI Professional" },
  { label: "AI Developer", value: "AI Developer" },
  { label: "African Business Tech", value: "African Business Tech" },
  { label: "Global AI Talent", value: "Global AI Talent" },
  { label: "Income Track", value: "Income Track" },
];

const TOP_SKILLS = [
  "Prompt Engineering", "WhatsApp API", "M-Pesa API", "RAG", "Python",
  "AI Evaluation", "Data Analysis", "Agritech", "Automation",
];

export default function TalentPage() {
  const [talent, setTalent] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [track, setTrack] = useState("");
  const [skill, setSkill] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const query = supabase
        .from("talent_profiles")
        .select("user_id, full_name, headline, location, skills, years_experience, track")
        .eq("is_visible", true)
        .order("years_experience", { ascending: false })
        .limit(100);
      const { data } = await query;
      setTalent(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return talent.filter((t) => {
      if (track && t.track !== track) return false;
      if (skill && !(t.skills ?? []).some((s) => s.toLowerCase().includes(skill.toLowerCase()))) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !t.full_name.toLowerCase().includes(q) &&
          !(t.headline ?? "").toLowerCase().includes(q) &&
          !(t.location ?? "").toLowerCase().includes(q) &&
          !(t.skills ?? []).some((s) => s.toLowerCase().includes(q))
        ) return false;
      }
      return true;
    });
  }, [talent, track, skill, search]);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#f9fafb", minHeight: "100vh" }}>

      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-white border-b" style={{ borderColor: "#e5e7eb" }}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex flex-col w-1.5 h-8 rounded-sm overflow-hidden">
              <div className="flex-1 bg-black" />
              <div className="flex-1 bg-[#bb0000]" />
              <div className="flex-1 bg-[#2d8a4e]" />
            </div>
            <span className="text-xl font-bold" style={{ color: "#0f1f3d" }}>
              Tund<span style={{ color: "#2d8a4e" }}>emy</span>
            </span>
          </Link>
          <Link href="/employer/dashboard"
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#0f1f3d" }}>
            Employer Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-5 py-14 text-center">
        <span className="inline-block text-xs font-bold px-3.5 py-1.5 rounded-full mb-5"
          style={{ backgroundColor: "rgba(45,138,78,0.1)", color: "#2d8a4e" }}>
          Africa&apos;s AI Talent Pool
        </span>
        <h1 className="text-4xl font-extrabold mb-4 leading-tight" style={{ color: "#0f1f3d" }}>
          Hire AI-Ready Talent<br />from across Africa
        </h1>
        <p className="text-base text-gray-500 max-w-xl mx-auto mb-8">
          Every profile completed real AI courses, built sandbox projects, and passed skill assessments. No LinkedIn guesswork.
        </p>
        {!loading && (
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm font-bold" style={{ color: "#0f1f3d" }}>{talent.length} verified professionals</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-sm text-gray-500">Updated daily</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-5 pb-8">
        <div className="bg-white rounded-2xl border p-5 space-y-4" style={{ borderColor: "#e5e7eb" }}>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              placeholder="Search by name, skill, or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-green-200 transition-all"
              style={{ borderColor: "#e5e7eb", color: "#0f1f3d" }}
            />
          </div>

          {/* Track filter */}
          <div>
            <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Track</p>
            <div className="flex flex-wrap gap-2">
              {TRACKS.map((t) => (
                <button key={t.value} onClick={() => setTrack(t.value)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                  style={{
                    backgroundColor: track === t.value ? "#0f1f3d" : "transparent",
                    color: track === t.value ? "#fff" : "#0f1f3d",
                    borderColor: track === t.value ? "#0f1f3d" : "#e5e7eb",
                  }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Skill filter */}
          <div>
            <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Skill</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSkill("")}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                style={{
                  backgroundColor: skill === "" ? "#2d8a4e" : "transparent",
                  color: skill === "" ? "#fff" : "#166534",
                  borderColor: skill === "" ? "#2d8a4e" : "rgba(45,138,78,0.3)",
                }}>
                All Skills
              </button>
              {TOP_SKILLS.map((s) => (
                <button key={s} onClick={() => setSkill(skill === s ? "" : s)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                  style={{
                    backgroundColor: skill === s ? "#2d8a4e" : "transparent",
                    color: skill === s ? "#fff" : "#166534",
                    borderColor: skill === s ? "#2d8a4e" : "rgba(45,138,78,0.3)",
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Result count */}
          {!loading && (
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-gray-400">
                Showing <span className="font-bold text-gray-700">{filtered.length}</span> of {talent.length} profiles
              </p>
              {(track || skill || search) && (
                <button onClick={() => { setTrack(""); setSkill(""); setSearch(""); }}
                  className="text-xs font-semibold hover:opacity-70 transition-opacity"
                  style={{ color: "#bb0000" }}>
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-5 pb-16">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm mb-2">No talent matching your filters.</p>
            <button onClick={() => { setTrack(""); setSkill(""); setSearch(""); }}
              className="text-xs font-semibold underline" style={{ color: "#2d8a4e" }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <div key={t.user_id} className="rounded-2xl border bg-white p-6 flex flex-col gap-4 hover:shadow-md transition-shadow" style={{ borderColor: "#e5e7eb" }}>
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: "#0f1f3d" }}>
                      {t.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    {t.years_experience > 0 && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "rgba(15,31,61,0.07)", color: "#0f1f3d" }}>
                        {t.years_experience}y exp
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-sm mt-2" style={{ color: "#0f1f3d" }}>{t.full_name}</p>
                  {t.headline && <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{t.headline}</p>}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {t.location && <p className="text-xs text-gray-400">{t.location}</p>}
                    {t.track && (
                      <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(45,138,78,0.08)", color: "#166534" }}>
                        {t.track}
                      </span>
                    )}
                  </div>
                </div>

                {t.skills && t.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {t.skills.slice(0, 4).map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: "rgba(45,138,78,0.08)", color: "#166534" }}>
                        {s}
                      </span>
                    ))}
                    {t.skills.length > 4 && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium text-gray-400"
                        style={{ backgroundColor: "#f3f4f6" }}>
                        +{t.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}

                <Link href={`/talent/${t.user_id}`}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-center border-2 transition-all hover:bg-gray-50"
                  style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>
                  View Full Profile →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA for employers */}
      <div className="border-t" style={{ borderColor: "#e5e7eb", backgroundColor: "#fff" }}>
        <div className="max-w-6xl mx-auto px-5 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-extrabold text-lg" style={{ color: "#0f1f3d" }}>Ready to hire?</p>
            <p className="text-sm text-gray-500 mt-1">Post a job and let matching candidates come to you.</p>
          </div>
          <Link href="/employer/post-job"
            className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 flex-shrink-0"
            style={{ backgroundColor: "#2d8a4e" }}>
            Post a Job →
          </Link>
        </div>
      </div>
    </div>
  );
}

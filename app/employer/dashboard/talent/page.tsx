"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface Talent {
  user_id: string;
  full_name: string;
  headline: string;
  location: string;
  skills: string[];
  years_experience: number;
  linkedin_url?: string;
  portfolio_url?: string;
  contact_email?: string;
  contact_phone?: string;
}

const SINGLE_UNLOCK_PRICE = 5000;
const BUNDLE_PRICE = 30000;

const ALL_SKILLS = [
  "Prompt Engineering", "ChatGPT", "Claude", "Python", "LangChain",
  "RAG", "Fine-tuning", "AI Strategy", "Machine Learning", "Data Analysis",
  "No-Code AI", "API Integration",
];

export default function TalentSearchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [talent, setTalent] = useState<Talent[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [bundleRemaining, setBundleRemaining] = useState(0);
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const [unlockError, setUnlockError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login?next=/employer/dashboard/talent"); return; }

      const [profilesRes, unlocksRes, bundleRes] = await Promise.all([
        supabase
          .from("talent_profiles")
          .select("user_id, full_name, headline, location, skills, years_experience, linkedin_url, portfolio_url, contact_email, contact_phone")
          .eq("is_visible", true)
          .order("years_experience", { ascending: false }),
        supabase.from("employer_unlocks").select("candidate_id").eq("employer_id", user.id),
        supabase.from("employer_bundles").select("profiles_remaining, expires_at").eq("employer_id", user.id).maybeSingle(),
      ]);

      setTalent(profilesRes.data ?? []);
      setUnlocked(new Set((unlocksRes.data ?? []).map((u: { candidate_id: string }) => u.candidate_id)));
      if (bundleRes.data && new Date(bundleRes.data.expires_at).getTime() > Date.now()) {
        setBundleRemaining(bundleRes.data.profiles_remaining);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  const handleUnlockSingle = async (candidateId: string) => {
    setUnlockError(null);
    setUnlockingId(candidateId);
    try {
      if (bundleRemaining > 0) {
        const res = await fetch("/api/employer/unlock-with-bundle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidateId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unlock failed");
        setUnlocked((prev) => new Set(prev).add(candidateId));
        setBundleRemaining((n) => n - 1);
        setUnlockingId(null);
        return;
      }

      const res = await fetch("/api/pesapal/initiate-unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "single", candidateId }),
      });
      const data = await res.json();
      if (!res.ok || !data.redirect_url) throw new Error(data.error ?? "Payment initiation failed");
      window.location.href = data.redirect_url;
    } catch (err) {
      setUnlockError(err instanceof Error ? err.message : "Something went wrong");
      setUnlockingId(null);
    }
  };

  const handleBuyBundle = async () => {
    setUnlockError(null);
    try {
      const res = await fetch("/api/pesapal/initiate-unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "bundle" }),
      });
      const data = await res.json();
      if (!res.ok || !data.redirect_url) throw new Error(data.error ?? "Payment initiation failed");
      window.location.href = data.redirect_url;
    } catch (err) {
      setUnlockError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
  };

  const filtered = talent.filter((t) => {
    const matchesSearch = !search || t.full_name.toLowerCase().includes(search.toLowerCase()) || t.headline?.toLowerCase().includes(search.toLowerCase());
    const matchesSkills = selectedSkills.length === 0 || selectedSkills.every((s) => t.skills?.includes(s));
    return matchesSearch && matchesSkills;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-[3px] animate-spin" style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>Talent Pool</h1>
        <p className="text-sm text-gray-500 mt-1">{talent.length} verified AI professionals available</p>
      </div>

      {/* Bundle CTA */}
      <div className="rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ borderColor: "#e5e7eb", backgroundColor: "rgba(15,31,61,0.03)" }}>
        <div>
          <p className="font-bold text-sm" style={{ color: "#0f1f3d" }}>
            {bundleRemaining > 0 ? `${bundleRemaining} profile unlock${bundleRemaining === 1 ? "" : "s"} remaining` : "Unlock candidate contact details"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            KSh {SINGLE_UNLOCK_PRICE.toLocaleString()} per profile, or KSh {BUNDLE_PRICE.toLocaleString()}/month for 10 unlocks.
          </p>
        </div>
        <button onClick={handleBuyBundle}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-opacity flex-shrink-0"
          style={{ backgroundColor: "#0f1f3d" }}>
          Buy bundle — KSh {BUNDLE_PRICE.toLocaleString()}/mo
        </button>
      </div>
      {unlockError && (
        <p className="text-xs font-semibold" style={{ color: "#bb0000" }}>{unlockError}</p>
      )}

      {/* Search + filter */}
      <div className="space-y-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or headline…"
          className="w-full px-4 py-3 text-sm border rounded-xl outline-none transition-colors"
          style={{ borderColor: "#e5e7eb" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")} />
        <div className="flex flex-wrap gap-2">
          {ALL_SKILLS.map((skill) => {
            const selected = selectedSkills.includes(skill);
            return (
              <button key={skill} onClick={() => toggleSkill(skill)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
                style={{ borderColor: selected ? "#2d8a4e" : "#e5e7eb", backgroundColor: selected ? "rgba(45,138,78,0.08)" : "#fff", color: selected ? "#166534" : "#6b7280" }}>
                {skill}
              </button>
            );
          })}
          {selectedSkills.length > 0 && (
            <button onClick={() => setSelectedSkills([])} className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ color: "#bb0000" }}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed p-10 text-center" style={{ borderColor: "#e5e7eb" }}>
          <p className="font-bold text-sm mb-1" style={{ color: "#0f1f3d" }}>No matches found</p>
          <p className="text-xs text-gray-500">Try adjusting your search or skill filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((t) => (
            <div key={t.user_id} className="rounded-2xl border bg-white p-5 flex flex-col gap-3" style={{ borderColor: "#e5e7eb" }}>
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#0f1f3d" }}>{t.full_name}</p>
                    {t.headline && <p className="text-xs text-gray-500 mt-0.5">{t.headline}</p>}
                  </div>
                  {t.years_experience > 0 && (
                    <span className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(15,31,61,0.07)", color: "#0f1f3d" }}>
                      {t.years_experience}y exp
                    </span>
                  )}
                </div>
                {t.location && <p className="text-xs text-gray-400 mt-1">{t.location}</p>}
              </div>
              {t.skills && t.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {t.skills.slice(0, 5).map((skill) => (
                    <span key={skill} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "rgba(45,138,78,0.08)", color: "#166534" }}>
                      {skill}
                    </span>
                  ))}
                  {t.skills.length > 5 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium text-gray-400" style={{ backgroundColor: "#f3f4f6" }}>
                      +{t.skills.length - 5} more
                    </span>
                  )}
                </div>
              )}
              {unlocked.has(t.user_id) ? (
                <div className="space-y-1 rounded-xl p-3 text-xs" style={{ backgroundColor: "rgba(45,138,78,0.06)" }}>
                  {t.contact_email && <p><span className="font-semibold">Email:</span> {t.contact_email}</p>}
                  {t.contact_phone && <p><span className="font-semibold">Phone:</span> {t.contact_phone}</p>}
                  {t.linkedin_url && <p><span className="font-semibold">LinkedIn:</span> <a href={t.linkedin_url} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#0077b5" }}>{t.linkedin_url}</a></p>}
                  {t.portfolio_url && <p><span className="font-semibold">Portfolio:</span> <a href={t.portfolio_url} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#0f1f3d" }}>{t.portfolio_url}</a></p>}
                </div>
              ) : (
                <div className="relative rounded-xl p-3 text-xs overflow-hidden" style={{ backgroundColor: "#f3f4f6" }}>
                  <div className="space-y-1 blur-sm select-none pointer-events-none">
                    <p><span className="font-semibold">Email:</span> contact@example.com</p>
                    <p><span className="font-semibold">Phone:</span> +254 7XX XXX XXX</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-400">Contact details locked</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <Link href={`/talent/${t.user_id}`}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-center border-2 transition-all hover:bg-gray-50"
                  style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>
                  View Profile
                </Link>
                {unlocked.has(t.user_id) ? null : (
                  <button onClick={() => handleUnlockSingle(t.user_id)}
                    disabled={unlockingId === t.user_id}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-white text-center transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: "#2d8a4e" }}>
                    {unlockingId === t.user_id
                      ? "Processing…"
                      : bundleRemaining > 0
                        ? `Use bundle credit (${bundleRemaining} left)`
                        : `Unlock — KSh ${SINGLE_UNLOCK_PRICE.toLocaleString()}`}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

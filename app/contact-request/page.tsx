"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

function ContactRequestForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const candidateId = searchParams.get("candidate") ?? "";
  const candidateName = searchParams.get("name") ?? "this candidate";

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [form, setForm] = useState({
    message: "",
    role_title: "",
    role_type: "Full-time" as "Full-time" | "Part-time" | "Contract" | "Remote",
    budget_range: "",
  });

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace(`/auth/login?next=/contact-request?candidate=${candidateId}&name=${encodeURIComponent(candidateName)}`);
        return;
      }
      setIsAuthenticated(true);
      const name = user.user_metadata?.company_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "";
      setCompanyName(name);
      setCheckingAuth(false);
    }
    check();
  }, [candidateId, candidateName, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.message.trim() || !form.role_title.trim()) return;
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/auth/login"); return; }

    await supabase.from("contact_requests").insert({
      employer_id: user.id,
      candidate_id: candidateId,
      employer_name: companyName,
      role_title: form.role_title,
      role_type: form.role_type,
      budget_range: form.budget_range,
      message: form.message,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    setLoading(false);
    setSubmitted(true);
  }

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: "#e5e7eb" }}>
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-xl font-extrabold mb-2" style={{ color: "#0f1f3d" }}>Request Sent!</h2>
        <p className="text-sm text-gray-500 mb-6">
          Your contact request has been sent to {candidateName}. They will be notified and can choose to respond.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/talent"
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: "#2d8a4e" }}>
            Browse More Talent
          </Link>
          <Link href="/employer/dashboard"
            className="px-5 py-2.5 rounded-xl text-sm font-bold border-2"
            style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border p-7" style={{ borderColor: "#e5e7eb" }}>
      <h2 className="text-xl font-extrabold mb-1" style={{ color: "#0f1f3d" }}>
        Contact {candidateName}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Send a contact request. The candidate will be notified and can accept or decline.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: "#0f1f3d" }}>Role Title *</label>
          <input
            type="text"
            placeholder="e.g. AI Engineer, Prompt Specialist, WhatsApp Bot Developer"
            value={form.role_title}
            onChange={(e) => setForm({ ...form, role_title: e.target.value })}
            required
            className="w-full px-4 py-2.5 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-green-200"
            style={{ borderColor: "#e5e7eb", color: "#0f1f3d" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "#0f1f3d" }}>Role Type</label>
            <select
              value={form.role_type}
              onChange={(e) => setForm({ ...form, role_type: e.target.value as typeof form.role_type })}
              className="w-full px-4 py-2.5 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-green-200"
              style={{ borderColor: "#e5e7eb", color: "#0f1f3d" }}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Remote</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "#0f1f3d" }}>Budget / Salary Range</label>
            <input
              type="text"
              placeholder="e.g. KSh 80,000–120,000/mo"
              value={form.budget_range}
              onChange={(e) => setForm({ ...form, budget_range: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-green-200"
              style={{ borderColor: "#e5e7eb", color: "#0f1f3d" }}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: "#0f1f3d" }}>Message to Candidate *</label>
          <textarea
            rows={5}
            placeholder="Introduce yourself and your company. Describe the role and why you think this candidate is a good fit. Be specific about what the role involves."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            className="w-full px-4 py-2.5 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-green-200 resize-none"
            style={{ borderColor: "#e5e7eb", color: "#0f1f3d" }}
          />
          <p className="text-xs text-gray-400 mt-1">{form.message.length}/500 characters</p>
        </div>

        <button
          type="submit"
          disabled={loading || !form.message.trim() || !form.role_title.trim()}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-40"
          style={{ backgroundColor: "#2d8a4e" }}>
          {loading ? "Sending…" : "Send Contact Request →"}
        </button>
      </form>
    </div>
  );
}

export default function ContactRequestPage() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <nav className="bg-white border-b sticky top-0 z-10" style={{ borderColor: "#e5e7eb" }}>
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/talent"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            Back to Talent
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex flex-col w-1 h-5 rounded-sm overflow-hidden">
              <div className="flex-1 bg-black" />
              <div className="flex-1 bg-[#bb0000]" />
              <div className="flex-1 bg-[#2d8a4e]" />
            </div>
            <span className="text-base font-bold" style={{ color: "#0f1f3d" }}>Tund<span style={{ color: "#2d8a4e" }}>emy</span></span>
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-10">
        <Suspense fallback={<div className="flex justify-center py-16"><div className="w-8 h-8 rounded-full border-2 border-green-600 border-t-transparent animate-spin" /></div>}>
          <ContactRequestForm />
        </Suspense>
      </div>
    </div>
  );
}

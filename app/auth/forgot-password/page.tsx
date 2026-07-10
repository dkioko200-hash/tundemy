"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong.");
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex flex-row gap-px h-5 overflow-hidden rounded-sm">
                <div className="w-1 bg-black" />
                <div className="w-1 bg-[#bb0000]" />
                <div className="w-1 bg-[#2d8a4e]" />
              </div>
              <span className="text-lg font-bold" style={{ color: "#0f1f3d" }}>
                Tund<span style={{ color: "#2d8a4e" }}>emy</span>
              </span>
            </div>

            {sent ? (
              <>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(45,138,78,0.12)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d8a4e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <h1 className="text-xl font-extrabold mb-2" style={{ color: "#0f1f3d" }}>Check your email</h1>
                <p className="text-sm text-gray-500 mb-6">
                  If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link. Check your inbox and spam folder.
                </p>
                <Link
                  href="/auth/login"
                  className="block text-center text-sm font-semibold py-3 rounded-xl transition-opacity hover:opacity-80"
                  style={{ color: "#2d8a4e" }}
                >
                  ← Back to login
                </Link>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-extrabold mb-1" style={{ color: "#0f1f3d" }}>Forgot password?</h1>
                <p className="text-sm text-gray-500 mb-7">Enter your email and we&apos;ll send you a reset link.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0f1f3d] focus:ring-2 focus:ring-[#0f1f3d]/10 transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: "rgba(187,0,0,0.06)", color: "#bb0000" }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 text-sm font-bold text-white rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
                    style={{ backgroundColor: "#2d8a4e" }}
                  >
                    {loading ? "Sending…" : "Send reset link"}
                  </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                  <Link href="/auth/login" className="font-semibold hover:opacity-70 transition-opacity" style={{ color: "#0f1f3d" }}>
                    ← Back to login
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

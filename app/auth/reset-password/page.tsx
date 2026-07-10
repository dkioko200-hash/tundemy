"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase";

function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let subscriptionCleanup: (() => void) | null = null;

    const init = async () => {
      // 1. Primary: hash flow — Supabase appends #access_token=...&type=recovery
      const hash = window.location.hash.slice(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const type = params.get("type");

      if (accessToken && type === "recovery") {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken ?? "",
        });
        if (sessionError) {
          setError("Invalid or expired reset link. Please request a new one.");
        } else {
          setSessionReady(true);
        }
        return;
      }

      // 2. Fallback: PKCE flow — session already set by /auth/callback
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSessionReady(true);
        return;
      }

      // 3. Fallback: listen for PASSWORD_RECOVERY auth event
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") setSessionReady(true);
      });
      subscriptionCleanup = () => subscription.unsubscribe();

      // Give it 2.5 s then show error if still no session
      setTimeout(() => {
        setSessionReady((prev) => {
          if (!prev) setError("Invalid or expired reset link. Please request a new one.");
          return prev;
        });
      }, 2500);
    };

    init();
    return () => { subscriptionCleanup?.(); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to reset password.");
      setDone(true);
      setTimeout(() => router.push("/auth/login"), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

      {done ? (
        <>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(45,138,78,0.12)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d8a4e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold mb-2" style={{ color: "#0f1f3d" }}>Password updated!</h1>
          <p className="text-sm text-gray-500">Redirecting you to login…</p>
        </>
      ) : error && !sessionReady ? (
        <>
          <h1 className="text-xl font-extrabold mb-2" style={{ color: "#0f1f3d" }}>Invalid link</h1>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <Link
            href="/auth/forgot-password"
            className="block text-center py-3.5 text-sm font-bold text-white rounded-xl hover:opacity-90"
            style={{ backgroundColor: "#2d8a4e" }}
          >
            Request new link
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: "#0f1f3d" }}>Set new password</h1>
          <p className="text-sm text-gray-500 mb-7">Choose a strong password for your account.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0f1f3d] focus:ring-2 focus:ring-[#0f1f3d]/10 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                required
                minLength={8}
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
              disabled={loading || !sessionReady}
              className="w-full py-3.5 text-sm font-bold text-white rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
              style={{ backgroundColor: "#2d8a4e" }}
            >
              {loading ? "Updating…" : !sessionReady ? "Verifying link…" : "Update password"}
            </button>
          </form>
        </>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <Suspense fallback={
              <div className="flex items-center justify-center py-10">
                <div className="w-10 h-10 rounded-full border-[3px] animate-spin" style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }} />
              </div>
            }>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}

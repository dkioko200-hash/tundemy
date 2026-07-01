"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "Invalid email or password.");
      router.push(next);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid email or password.");
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

      <h1 className="text-2xl font-extrabold mb-1" style={{ color: "#0f1f3d" }}>
        Welcome back
      </h1>
      <p className="text-sm text-gray-500 mb-7">Sign in to your Tundemy account.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0f1f3d] focus:ring-2 focus:ring-[#0f1f3d]/10 transition-colors"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-semibold transition-opacity hover:opacity-70"
              style={{ color: "#2d8a4e" }}
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0f1f3d] focus:ring-2 focus:ring-[#0f1f3d]/10 transition-colors"
          />
        </div>

        {error && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{ backgroundColor: "rgba(187,0,0,0.06)", color: "#bb0000" }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 text-sm font-bold text-white rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
          style={{ backgroundColor: "#2d8a4e" }}
        >
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-gray-400">or</span>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href={next !== "/dashboard" ? `/auth/signup?next=${encodeURIComponent(next)}` : "/auth/signup"}
          className="font-semibold transition-opacity hover:opacity-70"
          style={{ color: "#0f1f3d" }}
        >
          Get Started
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}

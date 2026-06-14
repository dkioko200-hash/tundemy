"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase";

type AccountType = "student" | "employer";

const accountTypes = [
  {
    type: "student" as AccountType,
    icon: "🎓",
    label: "I am a Student",
    sub: "I want to learn AI skills",
  },
  {
    type: "employer" as AccountType,
    icon: "💼",
    label: "I am an Employer",
    sub: "I want to hire AI talent",
  },
];

function SignupForm() {
  const searchParams = useSearchParams();
  const courseSlug = searchParams.get("course");
  const redirectParam = searchParams.get("redirect");
  const [accountType, setAccountType] = useState<AccountType>(
    searchParams.get("type") === "employer" ? "employer" : "student"
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const loginHref = redirectParam
    ? `/auth/login?next=${encodeURIComponent(redirectParam)}`
    : courseSlug
    ? `/auth/login?next=/courses/${courseSlug}/enroll`
    : "/auth/login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const next = redirectParam || (courseSlug ? `/courses/${courseSlug}/enroll` : "/dashboard");
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role: accountType },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (signUpError) throw signUpError;
      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="text-5xl mb-4">✉️</div>
        <h2 className="text-xl font-extrabold mb-2" style={{ color: "#0f1f3d" }}>
          Check your email
        </h2>
        <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
          We sent a confirmation link to{" "}
          <span className="font-semibold text-gray-700">{email}</span>. Click the link to
          activate your account.
        </p>
        <Link
          href={loginHref}
          className="inline-block mt-6 text-sm font-semibold transition-opacity hover:opacity-70"
          style={{ color: "#2d8a4e" }}
        >
          ← Back to Login
        </Link>
      </div>
    );
  }

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
        Join Tundemy
      </h1>
      <p className="text-sm text-gray-500 mb-7">Create your account to get started.</p>

      {/* Account type picker */}
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">I am a...</p>
      <div className="grid grid-cols-2 gap-3 mb-7">
        {accountTypes.map(({ type, icon, label, sub }) => {
          const active = accountType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setAccountType(type)}
              className="p-4 rounded-xl border-2 text-left transition-all duration-200"
              style={
                active
                  ? { borderColor: "#2d8a4e", backgroundColor: "rgba(45,138,78,0.06)" }
                  : { borderColor: "#e5e7eb", backgroundColor: "#ffffff" }
              }
            >
              <div className="text-2xl mb-2">{icon}</div>
              <div
                className="text-sm font-bold leading-tight"
                style={{ color: active ? "#2d8a4e" : "#0f1f3d" }}
              >
                {label}
              </div>
              <div className="text-xs text-gray-400 mt-0.5 leading-tight">{sub}</div>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Muthoni"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0f1f3d] focus:ring-2 focus:ring-[#0f1f3d]/10 transition-colors"
          />
        </div>

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
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0f1f3d] focus:ring-2 focus:ring-[#0f1f3d]/10 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
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
          {loading ? "Creating account…" : "Create Account"}
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
        Already have an account?{" "}
        <Link
          href={loginHref}
          className="font-semibold transition-opacity hover:opacity-70"
          style={{ color: "#0f1f3d" }}
        >
          Login
        </Link>
      </p>
    </>
  );
}

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <Suspense fallback={null}>
              <SignupForm />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Tundemy error]", error);
  }, [error]);

  return (
    <div
      style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#f9fafb", minHeight: "100vh" }}
      className="flex flex-col items-center justify-center px-5 text-center"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-12">
        <div className="flex flex-row gap-px h-6 overflow-hidden rounded-sm">
          <div className="w-1.5 bg-black" />
          <div className="w-1.5 bg-[#bb0000]" />
          <div className="w-1.5 bg-[#2d8a4e]" />
        </div>
        <span className="text-xl font-bold" style={{ color: "#0f1f3d" }}>
          Tund<span style={{ color: "#2d8a4e" }}>emy</span>
        </span>
      </Link>

      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: "rgba(187,0,0,0.08)" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bb0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold mb-3" style={{ color: "#0f1f3d" }}>
        Something went wrong
      </h1>
      <p className="text-gray-500 text-base max-w-sm leading-relaxed mb-8">
        An unexpected error occurred. Our team has been notified. Please try again or return to the homepage.
      </p>

      {error.digest && (
        <p className="text-xs text-gray-400 font-mono mb-6">
          Error ID: {error.digest}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: "#2d8a4e" }}
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl text-sm font-bold border-2 transition-all hover:bg-gray-50"
          style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch {
        setUser(null);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const dashboardHref =
    user?.user_metadata?.role === "employer" ? "/employer/dashboard" : "/dashboard";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex flex-row gap-px h-5 overflow-hidden rounded-sm shadow-sm">
              <div className="w-1 bg-black" />
              <div className="w-1 bg-[#bb0000]" />
              <div className="w-1 bg-[#2d8a4e]" />
            </div>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: "#0f1f3d" }}
            >
              Tund<span style={{ color: "#2d8a4e" }}>emy</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/courses"
              className="text-sm font-medium text-gray-600 hover:text-[#0f1f3d] transition-colors"
            >
              Courses
            </Link>
            <Link
              href="#talent"
              className="text-sm font-medium text-gray-600 hover:text-[#0f1f3d] transition-colors"
            >
              Talent Portal
            </Link>
            <Link
              href="/employer/post-job"
              className="text-sm font-medium text-gray-600 hover:text-[#0f1f3d] transition-colors"
            >
              For Employers
            </Link>
          </div>

          {/* CTA Buttons — desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all duration-200"
                  style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "#0f1f3d";
                    (e.currentTarget as HTMLElement).style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#0f1f3d";
                  }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "#2d8a4e" }}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all duration-200"
                  style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "#0f1f3d";
                    (e.currentTarget as HTMLElement).style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#0f1f3d";
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "#2d8a4e" }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link href="/courses" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>
            Courses
          </Link>
          <Link href="#talent" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>
            Talent Portal
          </Link>
          <Link href="/employer/post-job" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>
            For Employers
          </Link>
          <div className="flex flex-col gap-2 pt-2">
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="text-center px-4 py-2 text-sm font-semibold rounded-lg border-2 border-[#0f1f3d] text-[#0f1f3d]"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="text-center px-4 py-2 text-sm font-semibold text-white rounded-lg bg-[#2d8a4e]"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-center px-4 py-2 text-sm font-semibold rounded-lg border-2 border-[#0f1f3d] text-[#0f1f3d]"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-center px-4 py-2 text-sm font-semibold text-white rounded-lg bg-[#2d8a4e]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

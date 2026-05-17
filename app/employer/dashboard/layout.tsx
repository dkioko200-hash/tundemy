"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase";

function HomeIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>; }
function PeopleIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>; }
function BriefcaseIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>; }
function InboxIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>; }
function BuildingIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" /></svg>; }
function LogoutIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>; }
function MenuIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>; }
function CloseIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>; }

const NAV_LINKS = [
  { href: "/employer/dashboard",               icon: <HomeIcon />,      label: "Overview" },
  { href: "/employer/dashboard/talent",        icon: <PeopleIcon />,    label: "Talent Pool" },
  { href: "/employer/dashboard/jobs",          icon: <BriefcaseIcon />, label: "My Jobs" },
  { href: "/employer/dashboard/applications",  icon: <InboxIcon />,     label: "Applications" },
  { href: "/employer/dashboard/company",       icon: <BuildingIcon />,  label: "Company Profile" },
];

function SidebarContent({ pathname, onLinkClick, onLogout }: { pathname: string; onLinkClick?: () => void; onLogout: () => void }) {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "#0f1f3d" }}>
      <div className="flex-shrink-0 px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <Link href="/" onClick={onLinkClick} className="flex items-center gap-2.5">
          <div className="flex flex-row gap-px h-5 overflow-hidden rounded-sm">
            <div className="w-1 bg-black" /><div className="w-1 bg-[#bb0000]" /><div className="w-1 bg-[#2d8a4e]" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Tund<span style={{ color: "#2d8a4e" }}>emy</span></span>
        </Link>
        <p className="text-xs mt-2 font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>Employer Portal</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 flex flex-col gap-1">
        {NAV_LINKS.map((link) => {
          const active = link.href === "/employer/dashboard" ? pathname === "/employer/dashboard" : pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} onClick={onLinkClick}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{ color: active ? "#ffffff" : "rgba(255,255,255,0.6)", backgroundColor: active ? "rgba(45,138,78,0.25)" : "transparent" }}>
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex-shrink-0 px-3 py-4 border-t space-y-1" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <Link href="/employer/post-job" onClick={onLinkClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white mb-2"
          style={{ backgroundColor: "#2d8a4e" }}>
          + Post a Job
        </Link>
        <button onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: "rgba(255,255,255,0.5)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(187,0,0,0.18)"; (e.currentTarget as HTMLElement).style.color = "#ff8080"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
          <LogoutIcon />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function EmployerDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initials, setInitials] = useState("E");

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login?next=/employer/dashboard"); return; }
      const { data: profile } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single();
      if (profile?.role && profile.role !== "employer") { router.replace("/dashboard"); return; }
      const name: string = profile?.full_name || user.email?.split("@")[0] || "E";
      const parts = name.trim().split(" ");
      setInitials(parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase());
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="h-screen overflow-hidden" style={{ backgroundColor: "#f3f4f6", fontFamily: "Inter, sans-serif" }}>

      {/* Mobile overlay sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 z-10 flex flex-col" style={{ width: "240px" }}>
            <div className="absolute top-4 right-4 z-20">
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg" style={{ color: "rgba(255,255,255,0.6)" }}><CloseIcon /></button>
            </div>
            <SidebarContent pathname={pathname} onLinkClick={() => setSidebarOpen(false)} onLogout={handleLogout} />
          </aside>
        </div>
      )}

      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30" style={{ width: "240px" }}>
        <SidebarContent pathname={pathname} onLogout={handleLogout} />
      </aside>

      <div className="h-full flex flex-col lg:ml-[240px]">

        {/* Mobile top bar */}
        <header className="lg:hidden flex-shrink-0 flex items-center justify-between h-14 px-4 bg-white border-b" style={{ borderColor: "#e5e7eb" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-1 rounded-lg hover:bg-gray-100" style={{ color: "#0f1f3d" }}>
              <MenuIcon />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex flex-row gap-px h-4 overflow-hidden rounded-sm">
                <div className="w-1 bg-black" /><div className="w-1 bg-[#bb0000]" /><div className="w-1 bg-[#2d8a4e]" />
              </div>
              <span className="font-bold text-base tracking-tight" style={{ color: "#0f1f3d" }}>Tund<span style={{ color: "#2d8a4e" }}>emy</span></span>
            </Link>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#2d8a4e", color: "#fff" }}>
            {initials}
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

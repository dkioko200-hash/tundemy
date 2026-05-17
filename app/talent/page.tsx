import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface TalentProfile {
  user_id: string;
  full_name: string;
  headline: string;
  location: string;
  skills: string[];
  years_experience: number;
}

async function getTalent(): Promise<TalentProfile[]> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data } = await supabase
    .from("talent_profiles")
    .select("user_id, full_name, headline, location, skills, years_experience")
    .eq("is_visible", true)
    .order("years_experience", { ascending: false })
    .limit(50);

  return data ?? [];
}

export const metadata = {
  title: "Talent Pool — Tundemy",
  description: "Discover Africa's most verified AI professionals. Hire talent trained on production-ready AI skills.",
};

export default async function TalentPage() {
  const talent = await getTalent();

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
            <span className="text-xl font-bold" style={{ color: "#0f1f3d" }}>Tund<span style={{ color: "#2d8a4e" }}>emy</span></span>
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
        <span className="inline-block text-xs font-bold px-3.5 py-1.5 rounded-full mb-5" style={{ backgroundColor: "rgba(45,138,78,0.1)", color: "#2d8a4e" }}>
          Africa's AI Talent Pool
        </span>
        <h1 className="text-4xl font-extrabold mb-4 leading-tight" style={{ color: "#0f1f3d" }}>
          Hire AI-Ready Talent<br />from across Africa
        </h1>
        <p className="text-base text-gray-500 max-w-xl mx-auto mb-8">
          Every profile below completed real AI courses, built sandbox projects, and passed skill assessments. No LinkedIn guesswork.
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-sm font-bold" style={{ color: "#0f1f3d" }}>{talent.length} verified professionals</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="text-sm text-gray-500">Updated daily</span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-5 pb-16">
        {talent.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No talent profiles yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {talent.map((t) => (
              <div key={t.user_id} className="rounded-2xl border bg-white p-6 flex flex-col gap-4" style={{ borderColor: "#e5e7eb" }}>
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: "#0f1f3d" }}>
                      {t.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    {t.years_experience > 0 && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: "rgba(15,31,61,0.07)", color: "#0f1f3d" }}>
                        {t.years_experience}y
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-sm mt-2" style={{ color: "#0f1f3d" }}>{t.full_name}</p>
                  {t.headline && <p className="text-xs text-gray-500 mt-0.5 leading-snug">{t.headline}</p>}
                  {t.location && <p className="text-xs text-gray-400 mt-1">{t.location}</p>}
                </div>

                {t.skills && t.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {t.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "rgba(45,138,78,0.08)", color: "#166534" }}>
                        {skill}
                      </span>
                    ))}
                    {t.skills.length > 4 && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium text-gray-400" style={{ backgroundColor: "#f3f4f6" }}>
                        +{t.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}

                <Link href={`/talent/${t.user_id}`}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-center border-2 transition-all hover:bg-gray-50"
                  style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>
                  View Full Profile
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

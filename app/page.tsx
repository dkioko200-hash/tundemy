import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CoursesSection from "@/components/CoursesSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <CoursesSection />

      {/* Talent Pool section */}
      <section
        id="talent"
        className="py-24"
        style={{ background: "linear-gradient(135deg, #0f1f3d 0%, #1a3260 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Eyebrow */}
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6"
            style={{ backgroundColor: "rgba(45,138,78,0.2)", color: "#2d8a4e" }}
          >
            Talent Pool
          </span>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white mb-5">
            Where employers find{" "}
            <span style={{ color: "#2d8a4e" }}>verified AI talent</span>
          </h2>

          {/* Subtext */}
          <p className="text-white/60 text-lg leading-relaxed mb-10">
            Every graduate on Tundemy has completed hands-on projects, passed
            graded assessments, and earned verified badges. Global and local
            employers post jobs and hire directly from our talent pool.
          </p>

          {/* Stats row */}
          <div className="flex justify-center gap-6 mb-10">
            {[
              { value: "2,400+", label: "Verified graduates" },
              { value: "47", label: "Employers hiring now" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex-1 max-w-[180px] rounded-2xl py-5 px-4"
                style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
              >
                <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                <div className="text-sm text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Employer benefit points */}
          <ul className="text-left max-w-sm mx-auto space-y-3 mb-10">
            {[
              "Filter candidates by course and skill level",
              "View completed projects and sandbox scores",
              "Post a job from KSh 5,000 per listing",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                  style={{ backgroundColor: "rgba(45,138,78,0.2)", color: "#2d8a4e" }}
                >
                  ✓
                </span>
                <span className="text-sm text-white/70 leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>

          {/* Primary CTA */}
          <Link
            href="/auth/signup?type=employer"
            className="w-full sm:w-auto inline-block text-center px-8 py-4 text-sm font-bold text-white rounded-xl transition-all hover:opacity-90 active:scale-95 mb-4"
            style={{ backgroundColor: "#0f1f3d", border: "2px solid rgba(255,255,255,0.15)" }}
          >
            Post a Job — Hire AI Talent
          </Link>

          {/* Secondary link */}
          <div>
            <button
              className="text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: "#2d8a4e" }}
            >
              Browse the talent pool →
            </button>
          </div>

        </div>
      </section>

      {/* About / Why Tundemy */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: "rgba(45,138,78,0.1)", color: "#2d8a4e" }}
          >
            Why Tundemy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: "#0f1f3d" }}>
            Why thousands of professionals{" "}
            <span style={{ color: "#2d8a4e" }}>choose Tundemy</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-14">
            Production-ready skills, real projects, and direct access to employers
            hiring AI talent right now.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🌍",
                title: "Africa-First Curriculum",
                body: "Built around Safaricom Daraja, M-Pesa, real business workflows, and East African market dynamics.",
              },
              {
                icon: "🛠️",
                title: "Project-Based Learning",
                body: "Every course ends with a real deployable project you can add to your portfolio and show employers.",
              },
              {
                icon: "🏅",
                title: "Employer-Recognized Certificates",
                body: "Our certificates are accepted by tech companies, startups, and NGOs across Africa and beyond.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-8 text-left border border-gray-100 hover:border-gray-200 transition-all hover:shadow-md"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#0f1f3d" }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: "#0f1f3d" }}>
            Ready to build your AI skills?
          </h2>
          <p className="text-gray-500 text-lg">
            Join 2,400+ learners already building AI skills on Tundemy. Join Africa&apos;s most verified AI talent pool.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 text-base font-bold text-white rounded-xl transition-all hover:opacity-90 shadow-lg"
              style={{
                backgroundColor: "#2d8a4e",
                boxShadow: "0 4px 24px rgba(45,138,78,0.35)",
              }}
            >
              Get Started
            </button>
            <button
              className="px-8 py-4 text-base font-bold rounded-xl border-2 transition-all hover:bg-[#0f1f3d] hover:text-white"
              style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}
            >
              Browse Courses
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

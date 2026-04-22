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

      {/* Talent Portal teaser section */}
      <section
        id="talent"
        className="py-24"
        style={{
          background: "linear-gradient(135deg, #0f1f3d 0%, #1a3260 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-white">
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ backgroundColor: "rgba(45,138,78,0.2)", color: "#2d8a4e" }}
              >
                Talent Portal
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Employers, find{" "}
                <span style={{ color: "#2d8a4e" }}>AI-ready talent</span>{" "}
                in Kenya
              </h2>
              <p className="text-white/60 text-lg leading-relaxed">
                Browse verified profiles of Skilara graduates. Each candidate comes
                with a skills portfolio, project work, and a certificate you can
                trust. No recruiter fees.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="px-7 py-3.5 text-sm font-bold text-white rounded-xl transition-all hover:opacity-90"
                  style={{ backgroundColor: "#2d8a4e" }}
                >
                  Browse Talent
                </button>
                <button
                  className="px-7 py-3.5 text-sm font-bold rounded-xl border-2 border-white/20 text-white transition-all hover:border-white/40"
                >
                  Post a Job
                </button>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "2,400+", label: "Verified graduates", icon: "🎓" },
                { value: "18", label: "Course certifications", icon: "📜" },
                { value: "94%", label: "Employer satisfaction", icon: "⭐" },
                { value: "Free", label: "Posting for employers", icon: "🆓" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl p-6 space-y-2"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                >
                  <div className="text-2xl">{stat.icon}</div>
                  <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About / Why Skilara */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: "rgba(45,138,78,0.1)", color: "#2d8a4e" }}
          >
            Why Skilara
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: "#0f1f3d" }}>
            AI education built for{" "}
            <span style={{ color: "#2d8a4e" }}>Kenya&apos;s reality</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-14">
            Not generic global content — real Kenyan use cases with M-Pesa, local
            telcos, Swahili context, and the APIs that actually matter here.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🇰🇪",
                title: "Kenya-First Curriculum",
                body: "Built around Safaricom Daraja, MPESA, local businesses, and East African market dynamics.",
              },
              {
                icon: "🛠️",
                title: "Project-Based Learning",
                body: "Every course ends with a real deployable project you can add to your portfolio and show employers.",
              },
              {
                icon: "🏅",
                title: "Employer-Recognized Certificates",
                body: "Our certificates are accepted by tech companies and NGOs across Kenya and the broader East Africa region.",
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
            Join 2,400+ Kenyans already learning on Skilara. Start for free today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 text-base font-bold text-white rounded-xl transition-all hover:opacity-90 shadow-lg"
              style={{
                backgroundColor: "#2d8a4e",
                boxShadow: "0 4px 24px rgba(45,138,78,0.35)",
              }}
            >
              Create Free Account
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

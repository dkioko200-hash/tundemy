import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative flex items-center pt-32 pb-20 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #f8faff 0%, #eef4f0 60%, #f8faff 100%)",
      }}
    >
      {/* Subtle background blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #2d8a4e, transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #0f1f3d, transparent)" }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        {/* Green pill tag */}
        <div className="flex justify-center mb-7">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "#2d8a4e", color: "#ffffff" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
            Africa&apos;s AI Talent Hub
          </div>
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-tight tracking-tight mb-6"
          style={{ color: "#0f1f3d" }}
        >
          Build AI skills that{" "}
          <span className="relative inline-block" style={{ color: "#2d8a4e" }}>
            get you hired
            <span
              className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
              style={{ backgroundColor: "#2d8a4e", opacity: 0.3 }}
            />
          </span>{" "}
          anywhere.
        </h1>

        {/* Subtext */}
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-9">
          Join Africa&apos;s most verified pool of AI professionals. Learn
          production-ready skills, complete real projects, and connect directly
          with global and local employers who are hiring right now.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link
            href="#courses"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: "#2d8a4e",
              boxShadow: "0 4px 20px rgba(45,138,78,0.35)",
            }}
          >
            Browse Courses
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="#talent"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold rounded-xl border-2 transition-all duration-200 hover:bg-[#0f1f3d] hover:text-white"
            style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            View Talent Portal
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {[
            { text: "Hands-on sandboxes" },
            { text: "Global employer network" },
            { text: "Verified certificates" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="font-bold" style={{ color: "#2d8a4e" }}>✓</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

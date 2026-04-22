import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#0f1f3d" }} className="text-white">
      {/* Kenyan flag stripe */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-black" />
        <div className="flex-1 bg-[#bb0000]" />
        <div className="flex-1 bg-[#2d8a4e]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex flex-row gap-px h-5 overflow-hidden rounded-sm">
                <div className="w-1 bg-black" />
                <div className="w-1 bg-[#bb0000]" />
                <div className="w-1 bg-[#2d8a4e]" />
              </div>
              <span className="text-xl font-bold">
                Skil<span style={{ color: "#2d8a4e" }}>ara</span>
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Kenya&apos;s premier AI skills training platform. Learn, build, and
              get hired — all in one place.
            </p>
            <div className="flex gap-3">
              {/* Twitter/X */}
              <a
                href="#"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              >
                <svg className="w-4 h-4 fill-white/70" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="#"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              >
                <svg className="w-4 h-4 fill-white/70" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="#"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              >
                <svg className="w-4 h-4 fill-white/70" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4">Courses</h4>
            <ul className="space-y-2.5">
              {[
                "Prompt Engineering",
                "AI for Data Analysis",
                "WhatsApp AI Integration",
                "AI Automation",
                "M-Pesa Daraja API",
                "Intro to AI",
              ].map((item) => (
                <li key={item}>
                  <Link href="#courses" className="text-sm text-white/60 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                "Talent Portal",
                "For Employers",
                "Certificates",
                "Leaderboard",
                "Blog",
                "Community",
              ].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {["About Us", "Careers", "Partners", "Privacy Policy", "Terms of Service", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs text-white/40 mb-2">Stay updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 text-xs rounded-lg outline-none text-white placeholder-white/30"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
                <button
                  className="px-3 py-2 text-xs font-bold rounded-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#2d8a4e" }}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs text-white/40">
            © 2025 Skilara.ai — Kenya&apos;s AI Skills Platform
          </p>
          <div className="flex items-center gap-1 text-xs text-white/30">
            <span>Proudly</span>
            <div className="flex items-center gap-0.5 mx-1">
              <span className="text-black bg-black rounded-sm px-0.5">🇰🇪</span>
            </div>
            <span>Kenyan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { courses } from "@/lib/courses";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0f1f3d" }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex flex-row gap-px h-5 overflow-hidden rounded-sm">
                <div className="w-1 bg-black" />
                <div className="w-1 bg-[#bb0000]" />
                <div className="w-1 bg-[#2d8a4e]" />
              </div>
              <span className="text-xl font-bold">
                Tund<span style={{ color: "#2d8a4e" }}>emy</span>
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Tundemy — Your skills bear fruit.
            </p>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4">Courses</h4>
            <ul className="space-y-2.5">
              {courses.slice(0, 6).map((course) => (
                <li key={course.slug}>
                  <Link href={`/courses/${course.slug}/enroll`} className="text-sm font-normal text-white/60 hover:text-white transition-colors">
                    {course.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4">For Employers</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Browse Talent", href: "/talent" },
                { label: "Post a Job", href: "/employer/post-job" },
                { label: "Employer Dashboard", href: "/employer/dashboard" },
                { label: "Partner With Us", href: "mailto:hello@tundemy.com" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm font-normal text-white/60 hover:text-white transition-colors">
                    {item.label}
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
                { label: "How It Works", href: "/#about" },
                { label: "Sandbox Preview", href: "/#courses" },
                { label: "Certificates", href: "/dashboard/certificates" },
                { label: "Success Stories", href: "/talent" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm font-normal text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About Tundemy", href: "/#about" },
                { label: "Contact Us", href: "mailto:hello@tundemy.com" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm font-normal text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs text-white/40">
            © 2026 Tundemy — All rights reserved
          </p>
          <div className="flex items-center gap-3">
            {/* LinkedIn */}
            <a
              href="#"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-white/70" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            {/* Twitter/X */}
            <a
              href="#"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              aria-label="Twitter"
            >
              <svg className="w-4 h-4 fill-white/70" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* WhatsApp */}
            <a
              href="#"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              aria-label="WhatsApp"
            >
              <svg className="w-4 h-4 fill-white/70" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Kenyan flag stripe — very bottom */}
      <div className="flex w-full" style={{ height: "5px" }}>
        <div className="flex-1 bg-black" />
        <div className="flex-1 bg-[#bb0000]" />
        <div className="flex-1 bg-[#2d8a4e]" />
      </div>
    </footer>
  );
}

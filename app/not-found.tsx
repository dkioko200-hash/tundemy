import Link from "next/link";

export default function NotFound() {
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

      {/* 404 number */}
      <div
        className="text-8xl sm:text-9xl font-extrabold mb-4 leading-none"
        style={{ color: "#0f1f3d", opacity: 0.06 }}
      >
        404
      </div>

      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 -mt-4"
        style={{ backgroundColor: "rgba(45,138,78,0.1)" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d8a4e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold mb-3" style={{ color: "#0f1f3d" }}>
        Page not found
      </h1>
      <p className="text-gray-500 text-base max-w-sm leading-relaxed mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: "#2d8a4e" }}
        >
          Go to Homepage
        </Link>
        <Link
          href="/#courses"
          className="px-6 py-3 rounded-xl text-sm font-bold border-2 transition-all hover:bg-gray-50"
          style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}
        >
          Browse Courses
        </Link>
      </div>
    </div>
  );
}

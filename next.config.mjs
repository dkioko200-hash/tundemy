import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https: blob:",
  "font-src 'self' data:",
  // Allow video/audio from Vercel Blob Storage (migrated from public/videos)
  "media-src 'self' https://*.public.blob.vercel-storage.com",
  [
    "connect-src 'self'",
    "https://*.supabase.co",
    "wss://*.supabase.co",
    "https://api.anthropic.com",
    "https://api.pesapal.com",
    "https://cybqa.pesapal.com",
    "https://pay.pesapal.com",
    "https://cdn.jsdelivr.net",
    "https://files.pythonhosted.org",
    "https://pypi.org",
    // Vercel Blob Storage — needed for range requests / preflight on video streaming
    "https://*.public.blob.vercel-storage.com",
  ].join(" "),
  "frame-ancestors 'none'",
  "base-uri 'self'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-Content-Type-Options",     value: "nosniff" },
          { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",         value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security",  value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy",    value: CSP },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/login",  destination: "/auth/login",  permanent: true },
      { source: "/signup", destination: "/auth/signup", permanent: true },
    ];
  },
};

export default nextConfig;

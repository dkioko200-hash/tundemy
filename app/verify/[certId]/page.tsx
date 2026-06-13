import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { courseContent } from "@/lib/course-content";

interface CertificateRecord {
  cert_id: string;
  course_slug: string;
  full_name: string;
  issued_at: string;
}

async function getCertificate(certId: string): Promise<CertificateRecord | null> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data } = await supabase
    .from("certificates")
    .select("cert_id, course_slug, full_name, issued_at")
    .eq("cert_id", certId)
    .single();

  return data;
}

export default async function VerifyCertificatePage({ params }: { params: Promise<{ certId: string }> }) {
  const { certId } = await params;
  const certificate = await getCertificate(certId.toUpperCase());
  const course = certificate ? courseContent.find((c) => c.slug === certificate.course_slug) : null;

  return (
    <div style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <nav className="sticky top-0 z-10 bg-white border-b" style={{ borderColor: "#e5e7eb" }}>
        <div className="max-w-2xl mx-auto px-5 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex flex-col w-1 h-6 rounded-sm overflow-hidden">
              <div className="flex-1 bg-black" />
              <div className="flex-1 bg-[#bb0000]" />
              <div className="flex-1 bg-[#2d8a4e]" />
            </div>
            <span className="text-base font-bold" style={{ color: "#0f1f3d" }}>Tund<span style={{ color: "#2d8a4e" }}>emy</span></span>
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-12">
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: "#0f1f3d" }}>Certificate Verification</h1>
        <p className="text-sm text-gray-500 mb-8 font-mono">{certId.toUpperCase()}</p>

        {certificate && course ? (
          <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(45,138,78,0.08)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2d8a4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "#2d8a4e" }}>Valid Certificate</p>
                <p className="text-xs text-gray-400">Issued by Tundemy</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2" style={{ borderColor: "#f3f4f6" }}>
                <span className="text-gray-400">Name</span>
                <span className="font-bold" style={{ color: "#0f1f3d" }}>{certificate.full_name}</span>
              </div>
              <div className="flex justify-between border-b pb-2" style={{ borderColor: "#f3f4f6" }}>
                <span className="text-gray-400">Course</span>
                <span className="font-bold" style={{ color: "#0f1f3d" }}>{course.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Issued</span>
                <span className="font-bold" style={{ color: "#0f1f3d" }}>
                  {new Date(certificate.issued_at).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border bg-white p-6 text-center" style={{ borderColor: "#e5e7eb" }}>
            <p className="font-bold text-sm mb-1" style={{ color: "#bb0000" }}>Certificate not found</p>
            <p className="text-xs text-gray-500">This certificate ID does not match any record in our system.</p>
          </div>
        )}

        <Link href="/" className="mt-6 inline-block text-sm font-bold" style={{ color: "#2d8a4e" }}>
          ← Back to Tundemy
        </Link>
      </div>
    </div>
  );
}

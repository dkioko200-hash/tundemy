"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type VerifyStatus = "verifying" | "paid" | "failed" | "pending";

export default function UnlockConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderTrackingId = searchParams.get("OrderTrackingId");
  const type = searchParams.get("type");

  const [status, setStatus] = useState<VerifyStatus>("verifying");

  useEffect(() => {
    if (!orderTrackingId) {
      setStatus("failed");
      return;
    }

    async function verify() {
      const res = await fetch(`/api/pesapal/verify-unlock?OrderTrackingId=${orderTrackingId}`);
      const data = await res.json();
      const s: VerifyStatus =
        data.status === "paid" ? "paid" : data.status === "failed" ? "failed" : "pending";
      setStatus(s);

      if (s === "paid") {
        setTimeout(() => {
          router.push("/employer/dashboard/talent");
        }, 2000);
      }
    }

    verify();
  }, [orderTrackingId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#f9fafb" }}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-sm w-full text-center">
        {status === "verifying" && (
          <>
            <div className="w-14 h-14 rounded-full border-[3px] animate-spin mx-auto mb-6" style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }} />
            <h1 className="text-lg font-extrabold mb-2" style={{ color: "#0f1f3d" }}>Verifying payment…</h1>
            <p className="text-sm text-gray-500">Please wait while we confirm your payment.</p>
          </>
        )}

        {status === "paid" && (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "rgba(45,138,78,0.12)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2d8a4e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold mb-2" style={{ color: "#0f1f3d" }}>Payment confirmed!</h1>
            <p className="text-sm text-gray-500">
              {type === "bundle" ? "10 profile unlocks have been added to your account." : "This candidate's full profile is now unlocked."}
              {" "}Redirecting…
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "rgba(187,0,0,0.08)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#bb0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold mb-2" style={{ color: "#0f1f3d" }}>Payment failed</h1>
            <p className="text-sm text-gray-500 mb-6">Your payment could not be completed. Please try again.</p>
            <button onClick={() => router.push("/employer/dashboard/talent")} className="w-full py-3 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: "#2d8a4e" }}>
              Back to talent pool
            </button>
          </>
        )}

        {status === "pending" && (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "rgba(227,160,8,0.1)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e3a008" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold mb-2" style={{ color: "#0f1f3d" }}>Payment pending</h1>
            <p className="text-sm text-gray-500 mb-6">Your payment is being processed. Check back in a moment.</p>
            <button onClick={() => router.push("/employer/dashboard/talent")} className="w-full py-3 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: "#0f1f3d" }}>
              Back to talent pool
            </button>
          </>
        )}
      </div>
    </div>
  );
}

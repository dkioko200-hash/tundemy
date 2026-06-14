"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getCourseBySlug } from "@/lib/courses";
import { createClient } from "@/lib/supabase";

type PaymentMethod = "mpesa" | "card" | "paypal";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const course = getCourseBySlug(slug);

  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<PaymentMethod>("mpesa");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [devEnrolling, setDevEnrolling] = useState(false);

  useEffect(() => {
    if (!course) {
      router.replace("/#courses");
      return;
    }

    async function checkAuth() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace(`/auth/signup?redirect=${encodeURIComponent(`/courses/${slug}/checkout`)}`);
        return;
      }

      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_slug", slug)
        .maybeSingle();

      if (enrollment) {
        router.replace(`/courses/${slug}/learn`);
        return;
      }

      setLoading(false);
    }

    checkAuth();
  }, [slug, course, router]);

  const handlePay = async () => {
    setPaying(true);
    setPayError(null);
    try {
      const res = await fetch("/api/pesapal/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, phone: method === "mpesa" ? phone : undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.redirect_url) {
        throw new Error(data.error ?? "Payment initiation failed");
      }
      window.location.href = data.redirect_url;
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Something went wrong");
      setPaying(false);
    }
  };

  const handleDevSkip = async () => {
    setDevEnrolling(true);
    setPayError(null);
    try {
      const res = await fetch("/api/dev/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Dev enroll failed");
      window.location.href = `/courses/${slug}/learn`;
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Dev enroll failed");
      setDevEnrolling(false);
    }
  };

  if (!course) return null;

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f9fafb" }}
      >
        <div
          className="w-9 h-9 rounded-full border-[3px] animate-spin"
          style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  const phoneValid = /^0[17]\d{8}$/.test(phone.replace(/\s/g, ""));
  const cardValid =
    cardNumber.replace(/\s/g, "").length >= 12 && cardExpiry.length === 5 && cardCvv.length >= 3;

  const payDisabled =
    paying || (method === "mpesa" ? !phoneValid : method === "card" ? !cardValid : false);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            href={`/courses/${slug}/enroll`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold mb-8 transition-opacity hover:opacity-70"
            style={{ color: "#0f1f3d" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to order summary
          </Link>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
            {/* ── LEFT: Payment methods ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <h1 className="text-xl font-extrabold mb-1" style={{ color: "#0f1f3d" }}>
                Choose a payment method
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                Secure checkout for {course.title}
              </p>

              {/* Method tabs */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {(
                  [
                    { id: "mpesa" as const, label: "M-Pesa", icon: "📱" },
                    { id: "card" as const, label: "Card", icon: "💳" },
                    { id: "paypal" as const, label: "PayPal", icon: "🅿️" },
                  ]
                ).map((opt) => {
                  const active = method === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setMethod(opt.id)}
                      className="flex flex-col items-center gap-1.5 py-4 rounded-xl border-2 text-sm font-bold transition-all"
                      style={
                        active
                          ? { borderColor: "#2d8a4e", backgroundColor: "rgba(45,138,78,0.06)", color: "#0f1f3d" }
                          : { borderColor: "#e5e7eb", backgroundColor: "#ffffff", color: "#6b7280" }
                      }
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {/* M-Pesa form */}
              {method === "mpesa" && (
                <div className="space-y-4">
                  <div
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ backgroundColor: "rgba(45,138,78,0.06)" }}
                  >
                    <span className="text-2xl">📱</span>
                    <p className="text-sm" style={{ color: "#0f1f3d" }}>
                      You will receive an <span className="font-bold">M-Pesa STK push</span> prompt
                      on your phone to complete this payment.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      M-Pesa phone number
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07XX XXX XXX"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2d8a4e] focus:ring-2 focus:ring-[#2d8a4e]/10 transition-colors"
                    />
                    {phone && !phoneValid && (
                      <p className="text-xs mt-1.5" style={{ color: "#bb0000" }}>
                        Enter a valid Safaricom/Airtel number, e.g. 0712 345 678
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Card form */}
              {method === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Card number
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2d8a4e] focus:ring-2 focus:ring-[#2d8a4e]/10 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Expiry date
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2d8a4e] focus:ring-2 focus:ring-[#2d8a4e]/10 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        CVV
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2d8a4e] focus:ring-2 focus:ring-[#2d8a4e]/10 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Visa, Mastercard and Amex accepted
                  </div>
                </div>
              )}

              {/* PayPal */}
              {method === "paypal" && (
                <div className="space-y-4">
                  <div
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ backgroundColor: "rgba(15,31,61,0.04)" }}
                  >
                    <span className="text-2xl">🅿️</span>
                    <p className="text-sm" style={{ color: "#0f1f3d" }}>
                      You will be redirected to PayPal to complete your purchase securely.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPayError("PayPal checkout is coming soon — please use M-Pesa or Card for now.")}
                    className="w-full py-3.5 rounded-xl text-sm font-extrabold transition-all hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#ffc439", color: "#003087" }}
                  >
                    <span style={{ fontStyle: "italic" }}>Pay</span>
                    <span style={{ fontStyle: "italic", color: "#009cde" }}>Pal</span>
                  </button>
                </div>
              )}

              {payError && (
                <p className="text-xs text-center font-semibold mt-4" style={{ color: "#bb0000" }}>
                  {payError}
                </p>
              )}

              {/* Pay button (M-Pesa / Card) */}
              {method !== "paypal" && (
                <button
                  onClick={handlePay}
                  disabled={payDisabled}
                  className="w-full mt-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#2d8a4e" }}
                >
                  {paying ? (
                    <>
                      <div
                        className="w-4 h-4 rounded-full border-2 animate-spin"
                        style={{ borderColor: "rgba(255,255,255,0.4)", borderTopColor: "#fff" }}
                      />
                      Processing…
                    </>
                  ) : method === "mpesa" ? (
                    <>📱 Pay KSh {course.price_kes.toLocaleString()} with M-Pesa</>
                  ) : (
                    <>💳 Pay KSh {course.price_kes.toLocaleString()} with Card</>
                  )}
                </button>
              )}

              <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Your payment is encrypted and secure
              </div>

              {process.env.NEXT_PUBLIC_APP_ENV === "development" && (
                <div className="text-center mt-5">
                  <button
                    onClick={handleDevSkip}
                    disabled={devEnrolling}
                    className="text-xs font-semibold underline transition-opacity hover:opacity-70 disabled:opacity-50"
                    style={{ color: "#6b7280" }}
                  >
                    {devEnrolling ? "Enrolling…" : "Skip payment (dev mode)"}
                  </button>
                </div>
              )}
            </div>

            {/* ── RIGHT: Order summary ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-24">
              <h2 className="text-base font-bold mb-5" style={{ color: "#0f1f3d" }}>
                Order Summary
              </h2>

              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${course.tag_color}18` }}
                >
                  {course.icon}
                </div>
                <div>
                  <p className="text-sm font-bold leading-snug" style={{ color: "#0f1f3d" }}>
                    {course.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{course.level} · Lifetime access</p>
                </div>
              </div>

              <div className="h-px bg-gray-100 my-4" />

              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold" style={{ color: "#0f1f3d" }}>Total</span>
                <span className="text-lg font-extrabold" style={{ color: "#0f1f3d" }}>
                  KSh {course.price_kes.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-400">VAT included</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

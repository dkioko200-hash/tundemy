"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

export type DarajaVariant = "oauth" | "stkpush";

interface TimelineStep {
  id: string;
  label: string;
  status: "pending" | "running" | "success" | "error";
  timestamp?: string;
  detail?: string;
}

interface GradeResult {
  score: number;
  passed: boolean;
  feedback: string;
  rubricScores?: { criterion: string; score: number; max: number; comment: string }[];
  didWell?: string[];
  improvements?: { area: string; missing: string; whyMatters: string; betterExample: string }[];
  specificFixes?: string[];
}

// ── Utility ────────────────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2, 10); }
function nowTime() {
  return new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

// ── Safaricom Phone Shell ──────────────────────────────────────────────────────

type PhoneState = "idle" | "prompt" | "pin" | "processing" | "success" | "failed";

function SafaricomPhone({
  state,
  amount,
  merchant,
  receiptNumber,
  failureDesc,
}: {
  state: PhoneState;
  amount?: number;
  merchant?: string;
  receiptNumber?: string;
  failureDesc?: string;
}) {
  const [pinDigits, setPinDigits] = useState<string[]>([]);
  const [pinAnimating, setPinAnimating] = useState(false);

  useEffect(() => {
    if (state === "pin") {
      // Simulate PIN typing animation
      setPinDigits([]);
      setPinAnimating(true);
      const counts = [1, 2, 3, 4, 5, 6];
      counts.forEach((c, i) => {
        setTimeout(() => {
          setPinDigits((prev) => [...prev, "•"]);
          if (c === 6) setPinAnimating(false);
        }, i * 220);
      });
    } else {
      setPinDigits([]);
    }
  }, [state]);

  return (
    <div
      className="flex-shrink-0 self-start"
      style={{
        width: "220px",
        background: "#1a1a1a",
        borderRadius: "30px",
        padding: "10px",
        boxShadow: "0 12px 48px rgba(0,0,0,0.45), inset 0 0 0 2px #333",
      }}
    >
      <div
        className="flex flex-col overflow-hidden"
        style={{ borderRadius: "22px", height: "460px", background: "#f5f5f5" }}
      >
        {/* Status bar */}
        <div
          className="flex items-center justify-between px-4 py-1.5 text-white flex-shrink-0"
          style={{ background: "#006633", fontSize: "9px" }}
        >
          <span className="font-semibold">Safaricom</span>
          <span className="opacity-80">●●● 4G 🔋</span>
        </div>

        {/* Screen content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
          {state === "idle" && (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "#006633" }}>
                <span className="text-white text-2xl font-black">M</span>
              </div>
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                M-Pesa prompt will appear<br />when STK Push fires
              </p>
            </div>
          )}

          {state === "prompt" && (
            <div className="w-full space-y-3 animate-fadeIn">
              <div className="text-center mb-2">
                <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: "#006633" }}>
                  <span className="text-white text-lg font-black">M</span>
                </div>
                <p className="text-xs font-bold" style={{ color: "#006633" }}>Lipa Na M-Pesa</p>
              </div>
              <div className="rounded-xl border-2 border-gray-200 bg-white p-3 space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500">Merchant</span>
                  <span className="font-bold text-gray-800">{merchant || "DUKA SMART"}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-bold" style={{ color: "#006633" }}>KSh {(amount ?? 0).toLocaleString("en-KE")}</span>
                </div>
                <div className="border-t border-gray-100 pt-1.5">
                  <p className="text-[9px] text-gray-400">Enter M-Pesa PIN to confirm</p>
                </div>
              </div>
              <div className="flex justify-center gap-1.5 mt-1">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-3 h-3 rounded-full border-2 border-gray-400" />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-1.5 mt-2">
                {["1","2","3","4","5","6","7","8","9","*","0","#"].map((k) => (
                  <div key={k} className="h-7 rounded-lg flex items-center justify-center text-[11px] font-semibold text-gray-700" style={{ background: "#ececec" }}>
                    {k}
                  </div>
                ))}
              </div>
            </div>
          )}

          {state === "pin" && (
            <div className="w-full space-y-3">
              <div className="text-center mb-2">
                <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: "#006633" }}>
                  <span className="text-white text-lg font-black">M</span>
                </div>
                <p className="text-xs font-bold" style={{ color: "#006633" }}>Entering PIN…</p>
              </div>
              <div className="flex justify-center gap-1.5">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full border-2 transition-all duration-200"
                    style={{
                      borderColor: pinDigits[i] ? "#006633" : "#9ca3af",
                      backgroundColor: pinDigits[i] ? "#006633" : "transparent",
                    }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-1.5 mt-2">
                {["1","2","3","4","5","6","7","8","9","*","0","#"].map((k) => (
                  <div key={k} className="h-7 rounded-lg flex items-center justify-center text-[11px] font-semibold text-gray-700" style={{ background: "#ececec" }}>
                    {k}
                  </div>
                ))}
              </div>
            </div>
          )}

          {state === "processing" && (
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center" style={{ background: "#006633" }}>
                <svg className="animate-spin w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700">Processing payment…</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Please wait</p>
              </div>
            </div>
          )}

          {state === "success" && (
            <div className="text-center space-y-2.5">
              <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center" style={{ background: "#006633" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: "#006633" }}>Payment Successful!</p>
                <p className="text-[10px] text-gray-500 mt-0.5">KSh {(amount ?? 0).toLocaleString("en-KE")} to {merchant || "DUKA SMART"}</p>
                {receiptNumber && (
                  <div className="mt-2 bg-green-50 rounded-lg px-2 py-1.5">
                    <p className="text-[9px] text-gray-500">M-Pesa Receipt</p>
                    <p className="text-[11px] font-mono font-bold" style={{ color: "#006633" }}>{receiptNumber}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {state === "failed" && (
            <div className="text-center space-y-2.5">
              <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-red-100">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bb0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-red-700">Payment Failed</p>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed px-2">{failureDesc || "Request cancelled"}</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-4 py-2"
          style={{ background: "#006633", borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <span className="text-white text-[8px] opacity-60">M-PESA</span>
          <span className="text-white text-[8px] opacity-60">SAFARICOM</span>
        </div>
      </div>
    </div>
  );
}

// ── Timeline ───────────────────────────────────────────────────────────────────

function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="space-y-2">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-start gap-3">
          <div className="flex flex-col items-center flex-shrink-0">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold transition-all"
              style={{
                backgroundColor:
                  step.status === "success" ? "#2d8a4e" :
                  step.status === "error" ? "#bb0000" :
                  step.status === "running" ? "#f59e0b" :
                  "#e5e7eb",
                color: step.status === "pending" ? "#9ca3af" : "white",
              }}
            >
              {step.status === "success" ? "✓" :
               step.status === "error" ? "✕" :
               step.status === "running" ? "…" :
               String(i + 1)}
            </div>
            {i < steps.length - 1 && (
              <div className="w-0.5 h-4 mt-1" style={{ backgroundColor: step.status === "success" ? "#2d8a4e" : "#e5e7eb" }} />
            )}
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${step.status === "pending" ? "text-gray-400" : "text-gray-700"}`}>
                {step.label}
              </span>
              {step.timestamp && (
                <span className="text-[9px] text-gray-400 font-mono">{step.timestamp}</span>
              )}
              {step.status === "running" && (
                <span className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin inline-block" />
              )}
            </div>
            {step.detail && (
              <p className="text-[10px] text-gray-500 mt-0.5 font-mono leading-relaxed break-all">{step.detail}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Code Editor ────────────────────────────────────────────────────────────────

function CodeEditor({
  code,
  onChange,
  label,
}: {
  code: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p>
      <div className="relative rounded-xl overflow-hidden border border-[#0f1f3d]/20">
        <div className="bg-[#0f1f3d] px-3 py-1.5 flex items-center gap-2">
          <div className="flex gap-1">
            {["#ff5f57","#ffbd2e","#28ca41"].map((c) => (
              <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <span className="text-gray-400 text-[10px] font-mono">daraja.js</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          rows={14}
          className="w-full bg-[#0d1a2e] text-blue-100 text-[11px] font-mono p-4 resize-none outline-none leading-relaxed"
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );
}

// ── OAuth Form ─────────────────────────────────────────────────────────────────

const OAUTH_DEFAULT = `// Step 1: Generate Base64 credentials
const consumerKey = "YOUR_CONSUMER_KEY";
const consumerSecret = "YOUR_CONSUMER_SECRET";

const credentials = Buffer.from(
  \`\${consumerKey}:\${consumerSecret}\`
).toString("base64");

// Step 2: Call OAuth endpoint
const response = await fetch(
  "https://sandbox.safaricom.co.ke/oauth/v1/generate" +
  "?grant_type=client_credentials",
  {
    method: "GET",
    headers: {
      Authorization: \`Basic \${credentials}\`,
    },
  }
);

const { access_token, expires_in } = await response.json();
// access_token lasts 3600 seconds (1 hour)`;

interface OAuthResult {
  ok: boolean;
  access_token?: string;
  expires_in?: number;
  error?: string;
  fieldErrors?: Record<string, string>;
  hint?: string;
}

function OAuthForm({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [consumerKey, setConsumerKey] = useState("qzKb4TPYK5XnKhWR2MmD9cj7v3jAf4Lw");
  const [consumerSecret, setConsumerSecret] = useState("yY8nE2vKpA9sLmRjXcQ7wZ1uD4bHfT3N");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OAuthResult | null>(null);
  const [steps, setSteps] = useState<TimelineStep[]>([
    { id: "encode", label: "Base64 encode credentials", status: "pending" },
    { id: "request", label: "POST to OAuth endpoint", status: "pending" },
    { id: "token", label: "Receive access_token", status: "pending" },
  ]);

  const setStep = (id: string, update: Partial<TimelineStep>) => {
    setSteps((prev) => prev.map((s) => s.id === id ? { ...s, ...update } : s));
  };

  const handleRun = async () => {
    setLoading(true);
    setResult(null);
    setSteps([
      { id: "encode", label: "Base64 encode credentials", status: "pending" },
      { id: "request", label: "POST to OAuth endpoint", status: "pending" },
      { id: "token", label: "Receive access_token", status: "pending" },
    ]);

    // Step 1
    setStep("encode", { status: "running", timestamp: nowTime() });
    await new Promise((r) => setTimeout(r, 400));
    const encoded = btoa(`${consumerKey}:${consumerSecret}`);
    setStep("encode", {
      status: "success",
      timestamp: nowTime(),
      detail: `Basic ${encoded.slice(0, 24)}…`,
    });

    // Step 2
    setStep("request", { status: "running", timestamp: nowTime() });
    try {
      const res = await fetch("/api/simulate/daraja/oauth?grant_type=client_credentials", {
        headers: { Authorization: `Basic ${encoded}` },
      });
      const data: OAuthResult = await res.json();
      setResult(data);

      if (data.ok) {
        setStep("request", { status: "success", timestamp: nowTime(), detail: "HTTP 200 OK" });
        setStep("token", {
          status: "success",
          timestamp: nowTime(),
          detail: `access_token: ${data.access_token?.slice(0, 20)}… (expires in ${data.expires_in}s)`,
        });
        onSuccess(data.access_token!);
      } else {
        setStep("request", { status: "error", timestamp: nowTime(), detail: data.error });
        setStep("token", { status: "error" });
      }
    } catch {
      setStep("request", { status: "error", detail: "Network error" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-[#0f1f3d]/5 border border-[#0f1f3d]/10 p-4 space-y-3">
        <p className="text-xs font-bold text-gray-600">Sandbox Credentials (pre-filled)</p>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-1">Consumer Key</label>
          <input
            value={consumerKey}
            onChange={(e) => setConsumerKey(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#006633]"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-1">Consumer Secret</label>
          <input
            value={consumerSecret}
            onChange={(e) => setConsumerSecret(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#006633]"
          />
        </div>
      </div>

      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
        <p className="text-[10px] font-bold text-gray-500 mb-3">Execution Timeline</p>
        <Timeline steps={steps} />
      </div>

      <button
        onClick={handleRun}
        disabled={loading || !consumerKey || !consumerSecret}
        className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ backgroundColor: "#006633" }}
      >
        {loading ? (
          <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Running…</>
        ) : "▶ Run getDarajaToken()"}
      </button>

      {result && !result.ok && (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 space-y-2">
          <p className="text-red-700 font-semibold text-sm">❌ {result.error}</p>
          {result.fieldErrors && Object.entries(result.fieldErrors).map(([f, m]) => (
            <p key={f} className="text-red-600 text-xs">
              <span className="font-mono font-bold">{f}</span>: {m}
            </p>
          ))}
          {result.hint && <p className="text-red-500 text-xs mt-1 italic">{result.hint}</p>}
        </div>
      )}

      {result?.ok && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 space-y-2">
          <p className="text-green-700 font-semibold text-sm">✓ OAuth token obtained</p>
          <div className="font-mono text-xs bg-white rounded-lg p-3 border border-green-100 space-y-1">
            <p><span className="text-gray-400">access_token:</span> <span className="text-green-700 break-all">{result.access_token}</span></p>
            <p><span className="text-gray-400">expires_in:</span> <span className="text-green-700">{result.expires_in}s (1 hour)</span></p>
            <p><span className="text-gray-400">token_type:</span> <span className="text-green-700">Bearer</span></p>
          </div>
          <p className="text-green-600 text-xs">Store this token — every Daraja API call needs it in the Authorization header.</p>
        </div>
      )}
    </div>
  );
}

// ── STK Push Form ──────────────────────────────────────────────────────────────

interface StkResult {
  ok: boolean;
  CheckoutRequestID?: string;
  MerchantRequestID?: string;
  ResponseCode?: string;
  ResponseDescription?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

interface CallbackPayload {
  Body: {
    stkCallback: {
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{ Name: string; Value: string | number }>;
      };
    };
  };
}

function StkPushForm({
  oauthToken,
  onPhoneStateChange,
  onAmountChange,
  onReceiptChange,
  onFailureChange,
}: {
  oauthToken: string | null;
  onPhoneStateChange: (s: PhoneState) => void;
  onAmountChange: (n: number) => void;
  onReceiptChange: (r: string) => void;
  onFailureChange: (d: string) => void;
}) {
  const [phone, setPhone] = useState("254712345678");
  const [amount, setAmount] = useState("2500");
  const [orderId, setOrderId] = useState("ORD-20240315-001");
  const [callbackUrl, setCallbackUrl] = useState("https://api.dukasmart.co.ke/mpesa/stk-callback");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StkResult | null>(null);
  const [steps, setSteps] = useState<TimelineStep[]>([
    { id: "build", label: "Build STK Push payload", status: "pending" },
    { id: "initiate", label: "POST stkpush/v1/processrequest", status: "pending" },
    { id: "pending", label: "Store PENDING payment in DB", status: "pending" },
    { id: "callback", label: "Awaiting Safaricom callback (4s)", status: "pending" },
    { id: "result", label: "Process callback + update order", status: "pending" },
  ]);

  const setStep = (id: string, update: Partial<TimelineStep>) => {
    setSteps((prev) => prev.map((s) => s.id === id ? { ...s, ...update } : s));
  };

  const pollCallback = useCallback(async (checkoutId: string, retries = 0): Promise<void> => {
    if (retries > 15) {
      setStep("callback", { status: "error", detail: "Callback timed out after 15s" });
      setStep("result", { status: "error" });
      onPhoneStateChange("failed");
      onFailureChange("Callback timed out — in production use querySTKStatus()");
      return;
    }

    await new Promise((r) => setTimeout(r, 1000));

    try {
      const res = await fetch(`/api/simulate/daraja/callback?checkoutRequestId=${checkoutId}`);
      const data = await res.json();

      if (!data.ready) {
        return pollCallback(checkoutId, retries + 1);
      }

      const cb = data.callback as CallbackPayload;
      const stk = cb.Body.stkCallback;

      setStep("callback", {
        status: "success",
        timestamp: nowTime(),
        detail: `ResultCode: ${stk.ResultCode} — ${stk.ResultDesc}`,
      });

      if (stk.ResultCode === 0) {
        const items = stk.CallbackMetadata?.Item ?? [];
        const get = (name: string) => items.find((i) => i.Name === name)?.Value;
        const receipt = String(get("MpesaReceiptNumber") ?? "");
        onReceiptChange(receipt);
        onPhoneStateChange("success");
        setStep("result", {
          status: "success",
          timestamp: nowTime(),
          detail: `Receipt: ${receipt} — order → PAID`,
        });
      } else {
        onPhoneStateChange("failed");
        onFailureChange(stk.ResultDesc);
        setStep("result", {
          status: "error",
          timestamp: nowTime(),
          detail: `ResultCode ${stk.ResultCode}: ${stk.ResultDesc} — order → FAILED`,
        });
      }
    } catch {
      return pollCallback(checkoutId, retries + 1);
    }
  }, [onPhoneStateChange, onReceiptChange, onFailureChange]);

  const handleSend = async () => {
    if (!oauthToken) return;
    setLoading(true);
    setResult(null);
    setSteps([
      { id: "build", label: "Build STK Push payload", status: "pending" },
      { id: "initiate", label: "POST stkpush/v1/processrequest", status: "pending" },
      { id: "pending", label: "Store PENDING payment in DB", status: "pending" },
      { id: "callback", label: "Awaiting Safaricom callback (~4s)", status: "pending" },
      { id: "result", label: "Process callback + update order", status: "pending" },
    ]);
    onPhoneStateChange("idle");

    const ts = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
    const shortcode = "174379";
    const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const password = btoa(`${shortcode}${passkey}${ts}`);

    setStep("build", {
      status: "success",
      timestamp: nowTime(),
      detail: `Timestamp: ${ts} | Password: ${password.slice(0, 16)}…`,
    });

    onAmountChange(Number(amount));
    onPhoneStateChange("prompt");

    setStep("initiate", { status: "running", timestamp: nowTime() });
    await new Promise((r) => setTimeout(r, 600));

    try {
      const res = await fetch("/api/simulate/daraja/stkpush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oauthToken}`,
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: ts,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.ceil(Number(amount)),
          PartyA: phone,
          PartyB: shortcode,
          PhoneNumber: phone,
          CallBackURL: callbackUrl,
          AccountReference: `ORDER-${orderId}`,
          TransactionDesc: `Payment for ${orderId} - Duka Smart`,
        }),
      });
      const data: StkResult = await res.json();
      setResult(data);

      if (!data.ok) {
        setStep("initiate", { status: "error", detail: data.error });
        setStep("pending", { status: "error" });
        setStep("callback", { status: "error" });
        setStep("result", { status: "error" });
        onPhoneStateChange("idle");
        setLoading(false);
        return;
      }

      setStep("initiate", {
        status: "success",
        timestamp: nowTime(),
        detail: `CheckoutRequestID: ${data.CheckoutRequestID?.slice(0, 30)}…`,
      });
      setStep("pending", {
        status: "success",
        timestamp: nowTime(),
        detail: `Order ${orderId} → status: PENDING`,
      });

      // Simulate PIN entry
      setTimeout(() => onPhoneStateChange("pin"), 1200);
      setTimeout(() => onPhoneStateChange("processing"), 2800);

      setStep("callback", { status: "running", timestamp: nowTime() });
      await pollCallback(data.CheckoutRequestID!);
    } catch {
      setStep("initiate", { status: "error", detail: "Network error" });
      onPhoneStateChange("idle");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {!oauthToken && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-amber-800 text-xs font-semibold">Complete OAuth above first to get your access token.</p>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-1">PhoneNumber (254XXXXXXXXX)</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#006633]"
          />
          <p className="text-[9px] text-gray-400 mt-0.5">Sandbox test number: 254708374149</p>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-1">Amount (integer KSh)</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#006633]"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-1">AccountReference (order ID)</label>
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#006633]"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-1">CallBackURL</label>
          <input
            value={callbackUrl}
            onChange={(e) => setCallbackUrl(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#006633]"
          />
        </div>
      </div>

      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
        <p className="text-[10px] font-bold text-gray-500 mb-3">Transaction Timeline</p>
        <Timeline steps={steps} />
      </div>

      <button
        onClick={handleSend}
        disabled={loading || !oauthToken}
        className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ backgroundColor: "#006633" }}
      >
        {loading ? (
          <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Waiting for callback…</>
        ) : "▶ initiateSTKPush()"}
      </button>

      {result && !result.ok && (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 space-y-2">
          <p className="text-red-700 font-semibold text-sm">❌ {result.error}</p>
          {result.fieldErrors && Object.entries(result.fieldErrors).map(([f, m]) => (
            <p key={f} className="text-red-600 text-xs">
              <span className="font-mono font-bold">{f}</span>: {m}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Grading ────────────────────────────────────────────────────────────────────

function GradeResultDisplay({ result, onRetry, onNext }: {
  result: GradeResult;
  onRetry?: () => void;
  onNext?: () => void;
}) {
  const passed = result.passed ?? result.score >= 80;
  const color = passed ? "#2d8a4e" : "#bb0000";
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5 text-center border-2" style={{ borderColor: color, backgroundColor: `${color}08` }}>
        <div className="text-5xl font-black" style={{ color }}>{result.score}</div>
        <div className="text-gray-400 text-xs mt-1">out of 100</div>
        <div className="mt-2 font-bold text-sm" style={{ color }}>{passed ? "Passed — great work!" : "Score 80+ to continue"}</div>
      </div>
      {result.feedback && <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed">{result.feedback}</p>}
      {result.didWell && result.didWell.length > 0 && (
        <div className="rounded-xl p-4 border border-green-200 bg-green-50 space-y-2">
          <p className="text-xs font-bold text-green-700 uppercase tracking-wide">What you did well</p>
          {result.didWell.map((w, i) => (
            <p key={i} className="text-sm text-green-800 flex items-start gap-2"><span>✓</span><span>{w}</span></p>
          ))}
        </div>
      )}
      {!passed && result.improvements && result.improvements.length > 0 && (
        <div className="space-y-3">
          {result.improvements.map((imp, i) => (
            <div key={i} className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4">
              <p className="text-xs font-bold text-amber-800 mb-1">{imp.area}</p>
              <p className="text-xs text-amber-700"><span className="font-semibold">Missing: </span>{imp.missing}</p>
              <p className="text-xs text-amber-700 mt-1"><span className="font-semibold">Why it matters: </span>{imp.whyMatters}</p>
              <p className="text-xs text-gray-600 mt-1 italic">{imp.betterExample}</p>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-3">
        {passed && onNext && (
          <button onClick={onNext} className="flex-1 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: "#2d8a4e" }}>
            Next Lesson →
          </button>
        )}
        {!passed && onRetry && (
          <button onClick={onRetry} className="flex-1 py-3 rounded-xl text-sm font-bold border-2 hover:bg-gray-50" style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>
            Revise and Resubmit
          </button>
        )}
      </div>
    </div>
  );
}

// ── Context banners ────────────────────────────────────────────────────────────

const CONTEXT: Record<DarajaVariant, { title: string; body: string; bullets: string[] }> = {
  oauth: {
    title: "What you are building: Daraja OAuth token generation",
    body: "Before you can call any Daraja endpoint you need an access token. You get it by Base64-encoding your Consumer Key and Secret, then sending them as a Basic Auth header to the OAuth endpoint. The simulator below mirrors the exact Safaricom API. Errors here are errors you will fix before writing a single line of payment logic.",
    bullets: [
      "The Base64 string encodes consumerKey:consumerSecret — the colon is required",
      "Tokens expire after 3600 seconds — cache them and refresh 60s before expiry",
      "Every downstream Daraja call uses the token as: Authorization: Bearer <token>",
    ],
  },
  stkpush: {
    title: "What you are building: STK Push — initiation to callback",
    body: "STK Push is asynchronous. The initiation response tells you the prompt was sent. The actual payment result arrives 5-30 seconds later in a separate HTTP POST to your CallBackURL. The simulator fires a real callback after 4 seconds — 80% success, 20% failure — so you see the full flow without a real Safaricom account.",
    bullets: [
      "Store CheckoutRequestID immediately — it links the initiation to the callback",
      "Amount must be an integer — use Math.ceil() if you have decimal amounts",
      "If no callback arrives within 60s, call the STK Query endpoint to get the result",
    ],
  },
};

// ── Main export ────────────────────────────────────────────────────────────────

export function DarajaSimulatorSandbox({
  variant,
  sandboxTask,
  lessonNumber,
  courseSlug,
  onComplete,
}: {
  variant: DarajaVariant;
  sandboxTask: string;
  lessonNumber: number;
  courseSlug: string;
  onComplete: () => void;
}) {
  const [code, setCode] = useState(OAUTH_DEFAULT);
  const [oauthToken, setOauthToken] = useState<string | null>(null);
  const [phoneState, setPhoneState] = useState<PhoneState>("idle");
  const [phoneAmount, setPhoneAmount] = useState<number>(0);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [failureDesc, setFailureDesc] = useState("");
  const [simUsed, setSimUsed] = useState(false);

  const [reflection, setReflection] = useState("");
  const [grading, setGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [gradeError, setGradeError] = useState<string | null>(null);

  const wordCount = reflection.trim().split(/\s+/).filter(Boolean).length;
  const minWords = 60;
  const ctx = CONTEXT[variant];

  const handleOAuthSuccess = useCallback((token: string) => {
    setOauthToken(token);
    setSimUsed(true);
  }, []);

  const handlePhoneState = useCallback((s: PhoneState) => {
    setPhoneState(s);
    if (s === "success" || s === "failed") setSimUsed(true);
  }, []);

  const handleGrade = async () => {
    setGrading(true);
    setGradeError(null);
    try {
      const res = await fetch("/api/grade-sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, lessonNumber, sandboxTask, submission: reflection }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Grading failed");
      setGradeResult(data as GradeResult);
    } catch (err) {
      setGradeError(err instanceof Error ? err.message : "Grading failed. Please try again.");
    } finally {
      setGrading(false);
    }
  };

  const handleRetry = () => {
    setGradeResult(null);
    setReflection("");
    setGradeError(null);
  };

  if (gradeResult) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl p-4 border border-[#006633]/20 bg-[#006633]/05">
          <p className="text-xs font-bold text-[#006633] uppercase tracking-wide mb-1">Daraja Simulator</p>
          <p className="text-xs text-gray-500">Lesson {lessonNumber} — {ctx.title}</p>
        </div>
        <GradeResultDisplay
          result={gradeResult}
          onRetry={gradeResult.passed ? undefined : handleRetry}
          onNext={gradeResult.passed ? onComplete : undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Context panel */}
      <div className="rounded-2xl border-2 p-5" style={{ borderColor: "rgba(0,102,51,0.35)" }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">💳</span>
          <h3 className="text-sm font-bold" style={{ color: "#0f1f3d" }}>{ctx.title}</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{ctx.body}</p>
        <ul className="space-y-1">
          {ctx.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
              <span style={{ color: "#006633" }} className="mt-0.5">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main simulator: code + controls on left, phone on right */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: code editor + form */}
        <div className="flex-1 min-w-0 space-y-5">
          <CodeEditor code={code} onChange={setCode} label="Your code (editable)" />

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ background: "#006633" }}>
                {variant === "oauth" ? "🔑" : "💳"}
              </div>
              <p className="text-sm font-bold text-gray-700">
                {variant === "oauth" ? "getDarajaToken() — OAuth 2.0" : "initiateSTKPush() — STK Push"}
              </p>
            </div>

            {variant === "oauth" && (
              <OAuthForm onSuccess={handleOAuthSuccess} />
            )}
            {variant === "stkpush" && (
              <StkPushForm
                oauthToken={oauthToken}
                onPhoneStateChange={handlePhoneState}
                onAmountChange={setPhoneAmount}
                onReceiptChange={setReceiptNumber}
                onFailureChange={setFailureDesc}
              />
            )}
          </div>
        </div>

        {/* Right: Safaricom phone */}
        <div className="flex justify-center lg:justify-start">
          <SafaricomPhone
            state={phoneState}
            amount={phoneAmount}
            merchant="DUKA SMART"
            receiptNumber={receiptNumber}
            failureDesc={failureDesc}
          />
        </div>
      </div>

      {/* Reflection + grading */}
      <div className="rounded-2xl border-2 border-[#0f1f3d]/15 bg-white p-5">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-lg">✍️</span>
          <div>
            <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>
              {simUsed ? "Now write your reflection (graded by Claude)" : "Use the simulator above first, then write your reflection"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {simUsed
                ? "Answer all questions below. Specific, detailed answers score higher."
                : "Run the simulator to unlock grading."}
            </p>
          </div>
        </div>

        <div className="bg-[#0f1f3d] rounded-xl p-4 mb-4">
          <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">Your Task</p>
          <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{sandboxTask}</p>
        </div>

        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Write your detailed answers here. Reference what you saw in the simulator — specific field names, error messages, and API responses score higher."
          rows={10}
          disabled={!simUsed}
          className="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          style={{ ["--tw-ring-color" as string]: "#006633" }}
          onFocus={(e) => { if (simUsed) e.currentTarget.style.borderColor = "#006633"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}
        />

        <div className="flex items-center justify-between mt-2 mb-4">
          <p className={`text-xs font-medium ${wordCount >= minWords ? "text-[#006633]" : "text-gray-400"}`}>
            {wordCount} words {wordCount >= minWords ? "✓" : `(min ${minWords})`}
          </p>
        </div>

        {gradeError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
            <p className="text-red-700 text-sm">{gradeError}</p>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
          <p className="text-amber-800 text-xs">
            Graded by Claude AI on depth, specificity, structure, and actionability. Score 80+ to pass. Max 3 attempts per 24 hours.
          </p>
        </div>

        <button
          onClick={handleGrade}
          disabled={!simUsed || wordCount < minWords || grading}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: "#0f1f3d" }}
        >
          {grading ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Grading with Claude AI…</>
          ) : "Submit Reflection for Grading"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

interface Props {
  candidateId: string;
  candidateName: string;
  bundleRemaining: number;
  contactEmail?: string | null;
  contactPhone?: string | null;
  phone?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  initiallyUnlocked: boolean;
  isEmployer: boolean;
}

const SINGLE_UNLOCK_PRICE = 5000;

export default function UnlockGate({
  candidateId,
  candidateName,
  bundleRemaining,
  contactEmail,
  contactPhone,
  phone,
  linkedinUrl,
  portfolioUrl,
  initiallyUnlocked,
  isEmployer,
}: Props) {
  const [unlocked, setUnlocked] = useState(initiallyUnlocked);
  const [remaining, setRemaining] = useState(bundleRemaining);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUnlock = async () => {
    setError(null);
    setLoading(true);
    try {
      if (remaining > 0) {
        const res = await fetch("/api/employer/unlock-with-bundle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidateId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unlock failed");
        setUnlocked(true);
        setRemaining((n) => n - 1);
        setLoading(false);
        return;
      }
      const res = await fetch("/api/pesapal/initiate-unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "single", candidateId }),
      });
      const data = await res.json();
      if (!res.ok || !data.redirect_url) throw new Error(data.error ?? "Payment initiation failed");
      window.location.href = data.redirect_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  if (unlocked) {
    return (
      <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
        <p className="text-sm font-bold mb-3" style={{ color: "#0f1f3d" }}>Contact {candidateName.split(" ")[0]}</p>
        <div className="space-y-1.5 rounded-xl p-3 text-xs" style={{ backgroundColor: "rgba(45,138,78,0.06)" }}>
          {contactEmail && <p><span className="font-semibold">Email:</span> {contactEmail}</p>}
          {(contactPhone || phone) && <p><span className="font-semibold">Phone:</span> {contactPhone || phone}</p>}
          {linkedinUrl && <p><span className="font-semibold">LinkedIn:</span> <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#0077b5" }}>{linkedinUrl}</a></p>}
          {portfolioUrl && <p><span className="font-semibold">Portfolio:</span> <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#0f1f3d" }}>{portfolioUrl}</a></p>}
          {!contactEmail && !contactPhone && !phone && !linkedinUrl && !portfolioUrl && (
            <p className="text-gray-500">No contact details provided yet.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "#e5e7eb" }}>
      <p className="text-sm font-bold mb-3" style={{ color: "#0f1f3d" }}>Contact {candidateName.split(" ")[0]}</p>
      <div className="relative rounded-xl p-3 text-xs overflow-hidden mb-3" style={{ backgroundColor: "#f3f4f6" }}>
        <div className="space-y-1.5 blur-sm select-none pointer-events-none">
          <p><span className="font-semibold">Email:</span> contact@example.com</p>
          <p><span className="font-semibold">Phone:</span> +254 7XX XXX XXX</p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-400">Contact details locked</span>
        </div>
      </div>
      {isEmployer ? (
        <>
          <button onClick={handleUnlock} disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white text-center transition-all hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#2d8a4e" }}>
            {loading
              ? "Processing…"
              : remaining > 0
                ? `Use bundle credit (${remaining} left)`
                : `Unlock Contact — KSh ${SINGLE_UNLOCK_PRICE.toLocaleString()}`}
          </button>
          {error && <p className="text-xs font-semibold mt-2" style={{ color: "#bb0000" }}>{error}</p>}
        </>
      ) : (
        <a href="/employer/dashboard"
          className="w-full py-3 rounded-xl text-sm font-bold text-white text-center block transition-all hover:opacity-90"
          style={{ backgroundColor: "#0f1f3d" }}>
          Sign in as an employer to unlock
        </a>
      )}
    </div>
  );
}

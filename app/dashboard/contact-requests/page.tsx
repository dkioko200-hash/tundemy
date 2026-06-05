"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface ContactRequest {
  id: string;
  employer_id: string;
  employer_name: string;
  role_title: string;
  role_type: string;
  budget_range: string;
  message: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}

export default function ContactRequestsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [responding, setResponding] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login"); return; }

      const { data } = await supabase
        .from("contact_requests")
        .select("id, employer_id, employer_name, role_title, role_type, budget_range, message, status, created_at")
        .eq("candidate_id", user.id)
        .order("created_at", { ascending: false });

      setRequests(data ?? []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleRespond(id: string, status: "accepted" | "declined") {
    setResponding(id);
    const supabase = createClient();
    await supabase.from("contact_requests").update({ status, responded_at: new Date().toISOString() }).eq("id", id);
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    setResponding(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-[3px] animate-spin" style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const pending = requests.filter((r) => r.status === "pending");
  const responded = requests.filter((r) => r.status !== "pending");

  const statusStyle = (status: string) => {
    if (status === "accepted") return { bg: "rgba(45,138,78,0.1)", color: "#166534", label: "Accepted" };
    if (status === "declined") return { bg: "rgba(187,0,0,0.08)", color: "#991b1b", label: "Declined" };
    return { bg: "rgba(217,119,6,0.1)", color: "#92400e", label: "Pending" };
  };

  return (
    <div className="p-5 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>Contact Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          {pending.length} pending · {responded.length} responded
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed p-12 text-center" style={{ borderColor: "#e5e7eb" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(15,31,61,0.06)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f1f3d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <p className="font-bold text-sm mb-1" style={{ color: "#0f1f3d" }}>No contact requests yet</p>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Make your profile visible in the talent pool and employers will reach out when they have relevant opportunities.
          </p>
        </div>
      ) : (
        <>
          {/* Pending requests */}
          {pending.length > 0 && (
            <section>
              <h2 className="text-sm font-bold mb-3" style={{ color: "#0f1f3d" }}>Awaiting Response ({pending.length})</h2>
              <div className="space-y-4">
                {pending.map((req) => (
                  <RequestCard
                    key={req.id}
                    req={req}
                    onRespond={handleRespond}
                    responding={responding === req.id}
                    statusStyle={statusStyle}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Responded */}
          {responded.length > 0 && (
            <section>
              <h2 className="text-sm font-bold mb-3" style={{ color: "#0f1f3d" }}>Responded ({responded.length})</h2>
              <div className="space-y-4">
                {responded.map((req) => (
                  <RequestCard
                    key={req.id}
                    req={req}
                    onRespond={handleRespond}
                    responding={responding === req.id}
                    statusStyle={statusStyle}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function RequestCard({
  req,
  onRespond,
  responding,
  statusStyle,
}: {
  req: ContactRequest;
  onRespond: (id: string, status: "accepted" | "declined") => void;
  responding: boolean;
  statusStyle: (s: string) => { bg: string; color: string; label: string };
}) {
  const [expanded, setExpanded] = useState(req.status === "pending");
  const s = statusStyle(req.status);
  const date = new Date(req.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="bg-white rounded-2xl border" style={{ borderColor: "#e5e7eb" }}>
      <button className="w-full text-left p-5 flex items-start gap-4" onClick={() => setExpanded((e) => !e)}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: "#0f1f3d" }}>
          {req.employer_name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>{req.role_title}</p>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: s.bg, color: s.color }}>
              {s.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{req.employer_name} · {req.role_type}</p>
          <p className="text-xs text-gray-400 mt-0.5">{date}</p>
        </div>
        <svg className={`flex-shrink-0 transition-transform mt-0.5 ${expanded ? "rotate-180" : ""}`}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t pt-4 space-y-4" style={{ borderColor: "#f3f4f6" }}>
          {req.budget_range && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Compensation:</span>
              <span className="text-xs font-semibold" style={{ color: "#0f1f3d" }}>{req.budget_range}</span>
            </div>
          )}
          <div>
            <p className="text-xs font-bold mb-2" style={{ color: "#0f1f3d" }}>Message from {req.employer_name}</p>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4">{req.message}</p>
          </div>

          {req.status === "pending" && (
            <div className="flex gap-3">
              <button
                onClick={() => onRespond(req.id, "accepted")}
                disabled={responding}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "#2d8a4e" }}>
                {responding ? "…" : "Accept →"}
              </button>
              <button
                onClick={() => onRespond(req.id, "declined")}
                disabled={responding}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold border-2 hover:bg-gray-50 disabled:opacity-50"
                style={{ borderColor: "#e5e7eb", color: "#6b7280" }}>
                Decline
              </button>
            </div>
          )}

          {req.status === "accepted" && (
            <div className="rounded-xl p-3 text-xs font-semibold" style={{ backgroundColor: "rgba(45,138,78,0.08)", color: "#166534" }}>
              ✓ You accepted this request. {req.employer_name} can now see your contact details.
            </div>
          )}

          {req.status === "declined" && (
            <div className="rounded-xl p-3 text-xs font-semibold" style={{ backgroundColor: "rgba(107,114,128,0.08)", color: "#6b7280" }}>
              You declined this request.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

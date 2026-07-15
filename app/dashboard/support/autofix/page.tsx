"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface LogRow { id: string; matched_category: string | null; outcome: string; action_taken: string | null; detail: string | null; mode: string | null; created_at: string; }
interface Esc { id: string; user_email: string | null; issue_summary: string | null; status: string; created_at: string; }

function fmt(iso: string) { return new Date(iso).toLocaleString("en-KE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: false }); }
function oc(o: string) { return o === "fixed" ? "#166534" : o === "would_fix" ? "#3730a3" : o === "failed" ? "#991b1b" : o === "skipped_dedup" ? "#6b7280" : "#92400e"; }

export default function AutoFixReview() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);
  const [mode, setMode] = useState("");
  const [log, setLog] = useState<LogRow[]>([]);
  const [esc, setEsc] = useState<Esc[]>([]);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.replace("/auth/login?next=/dashboard/support/autofix"); return; }
    const res = await fetch("/api/support/autofix", { headers: { authorization: `Bearer ${session.access_token}` } });
    if (res.status === 401) { setOk(false); setLoading(false); return; }
    const d = await res.json();
    setOk(true); setMode(d.mode); setLog(d.log ?? []); setEsc(d.escalated ?? []); setLoading(false);
  }, [router]);
  useEffect(() => { void load(); }, [load]);

  if (loading) return <div style={{ padding: 40, fontFamily: "Inter, sans-serif", color: "#6b7280" }}>Loading…</div>;
  if (!ok) return <div style={{ padding: 40, fontFamily: "Inter, sans-serif", color: "#991b1b" }}>Admin access only.</div>;
  const mc = mode === "live" ? "#166534" : mode === "off" ? "#991b1b" : "#3730a3";

  return (
    <div style={{ padding: "24px 20px", fontFamily: "Inter, sans-serif", maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f1f3d", marginBottom: 6 }}>Tunda Auto-Fix Review</h1>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 13, color: "#374151" }}>Engine mode:</span>
        <span style={{ background: mc, color: "#fff", padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{mode.toUpperCase()}</span>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>{mode === "shadow" ? "diagnosing + logging only, no writes" : mode === "live" ? "applying fixes automatically" : "disabled"}</span>
        <button onClick={() => load()} style={{ marginLeft: "auto", fontSize: 12, padding: "6px 12px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer" }}>Refresh</button>
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f1f3d", marginBottom: 8 }}>Auto-fix attempts ({log.length})</h2>
      <div style={{ overflowX: "auto", marginBottom: 28 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ textAlign: "left", color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
            <th style={{ padding: "6px 8px" }}>When</th><th style={{ padding: "6px 8px" }}>Outcome</th><th style={{ padding: "6px 8px" }}>Category</th><th style={{ padding: "6px 8px" }}>Action</th><th style={{ padding: "6px 8px" }}>Detail</th><th style={{ padding: "6px 8px" }}>Mode</th>
          </tr></thead>
          <tbody>
            {log.length === 0 && <tr><td colSpan={6} style={{ padding: 12, color: "#9ca3af" }}>No attempts logged yet.</td></tr>}
            {log.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "6px 8px", whiteSpace: "nowrap", color: "#6b7280" }}>{fmt(r.created_at)}</td>
                <td style={{ padding: "6px 8px" }}><span style={{ color: oc(r.outcome), fontWeight: 700 }}>{r.outcome}</span></td>
                <td style={{ padding: "6px 8px", color: "#374151" }}>{r.matched_category ?? "—"}</td>
                <td style={{ padding: "6px 8px", color: "#374151" }}>{r.action_taken ?? "—"}</td>
                <td style={{ padding: "6px 8px", color: "#6b7280" }}>{r.detail ?? "—"}</td>
                <td style={{ padding: "6px 8px", color: "#9ca3af" }}>{r.mode ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f1f3d", marginBottom: 8 }}>Awaiting human ({esc.length})</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ textAlign: "left", color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
            <th style={{ padding: "6px 8px" }}>When</th><th style={{ padding: "6px 8px" }}>Email</th><th style={{ padding: "6px 8px" }}>Issue</th><th style={{ padding: "6px 8px" }}>Status</th>
          </tr></thead>
          <tbody>
            {esc.length === 0 && <tr><td colSpan={4} style={{ padding: 12, color: "#9ca3af" }}>Nothing awaiting a human.</td></tr>}
            {esc.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "6px 8px", whiteSpace: "nowrap", color: "#6b7280" }}>{fmt(t.created_at)}</td>
                <td style={{ padding: "6px 8px", color: "#374151" }}>{t.user_email ?? "—"}</td>
                <td style={{ padding: "6px 8px", color: "#374151" }}>{t.issue_summary ?? "—"}</td>
                <td style={{ padding: "6px 8px", color: "#92400e" }}>{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

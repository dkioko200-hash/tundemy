"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface SupportTicket {
  id: string;
  user_id: string | null;
  user_email: string | null;
  conversation: ConversationMessage[];
  issue_summary: string | null;
  status: "open" | "resolved" | "escalated";
  created_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-KE", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
}

function statusColor(status: string) {
  if (status === "escalated") return { bg: "#fef3c7", color: "#92400e" };
  if (status === "open") return { bg: "#dbeafe", color: "#1e40af" };
  return { bg: "#dcfce7", color: "#166534" };
}

// ── Conversation modal ────────────────────────────────────────────────────────

function ConversationModal({
  ticket,
  onClose,
}: {
  ticket: SupportTicket;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff", borderRadius: 16, maxWidth: 560, width: "100%",
          maxHeight: "80vh", display: "flex", flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div style={{
          background: "#0f1f3d", color: "#fff", padding: "16px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Full Conversation</div>
            <div style={{ fontSize: 12, color: "#93c5fd" }}>
              {ticket.user_email ?? "Anonymous"} · {formatDate(ticket.created_at)}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", color: "#fff",
              fontSize: 20, cursor: "pointer", lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {ticket.conversation.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: 14, textAlign: "center" }}>No conversation recorded.</p>
          ) : (
            ticket.conversation.map((msg, i) => {
              const isUser = msg.role === "user";
              return (
                <div key={i} style={{
                  display: "flex",
                  flexDirection: isUser ? "row-reverse" : "row",
                  gap: 8,
                }}>
                  <div style={{
                    background: isUser ? "#0f1f3d" : "#f3f4f6",
                    color: isUser ? "#fff" : "#111827",
                    padding: "8px 12px",
                    borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    fontSize: 13,
                    maxWidth: "80%",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}>
                    <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 2 }}>
                      {isUser ? "Student" : "Tunda"}
                    </div>
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid #e5e7eb", textAlign: "right" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px", background: "#0f1f3d", color: "#fff",
              border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function SupportInboxPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("open,escalated");
  const [viewingTicket, setViewingTicket] = useState<SupportTicket | null>(null);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // ── Auth check ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      const userEmail = data.session?.user?.email ?? "";
      const adminEmail = "d.kioko200@gmail.com";
      if (userEmail !== adminEmail) {
        router.replace("/dashboard");
        return;
      }
      setSession(data.session?.access_token ?? null);
      setIsAdmin(true);
      setAuthChecked(true);
    });
  }, [router]);

  // ── Fetch tickets ───────────────────────────────────────────────────────────

  const fetchTickets = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/support/tickets?status=${statusFilter}`, {
        headers: { Authorization: `Bearer ${session}` },
      });
      if (!res.ok) {
        setError("Failed to load tickets.");
        return;
      }
      const data = await res.json();
      setTickets(data.tickets ?? []);
    } catch {
      setError("Network error loading tickets.");
    } finally {
      setLoading(false);
    }
  }, [session, statusFilter]);

  useEffect(() => {
    if (isAdmin && session) fetchTickets();
  }, [isAdmin, session, fetchTickets]);

  // ── Resolve ticket ──────────────────────────────────────────────────────────

  const resolveTicket = async (id: string) => {
    if (!session) return;
    setResolvingId(id);
    try {
      await fetch("/api/support/tickets", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify({ id, status: "resolved" }),
      });
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "resolved" } : t))
      );
    } catch {
      // ignore
    } finally {
      setResolvingId(null);
    }
  };

  // ── Loading / auth states ───────────────────────────────────────────────────

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 rounded-full border-[3px] animate-spin" style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!isAdmin) return null;

  // ── Render ──────────────────────────────────────────────────────────────────

  const openCount = tickets.filter((t) => t.status === "open" || t.status === "escalated").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div style={{ background: "#0f1f3d", color: "#fff", padding: "20px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>Support Inbox</div>
            <div style={{ fontSize: 13, color: "#93c5fd", marginTop: 2 }}>
              Tunda escalated tickets · {openCount} open
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <a
              href="/dashboard"
              style={{
                padding: "7px 16px", background: "rgba(255,255,255,0.12)",
                color: "#fff", borderRadius: 8, fontSize: 13, textDecoration: "none",
              }}
            >
              ← Dashboard
            </a>
            <button
              onClick={fetchTickets}
              style={{
                padding: "7px 16px", background: "#2d8a4e", color: "#fff",
                border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer",
              }}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 32px 0" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "Open & Escalated", value: "open,escalated" },
            { label: "Open", value: "open" },
            { label: "Escalated", value: "escalated" },
            { label: "Resolved", value: "resolved" },
            { label: "All", value: "open,escalated,resolved" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              style={{
                padding: "6px 14px",
                background: statusFilter === f.value ? "#0f1f3d" : "#fff",
                color: statusFilter === f.value ? "#fff" : "#374151",
                border: "1.5px solid",
                borderColor: statusFilter === f.value ? "#0f1f3d" : "#d1d5db",
                borderRadius: 8, fontSize: 13, cursor: "pointer",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 32px 40px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div className="w-8 h-8 rounded-full border-[3px] animate-spin mx-auto" style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }} />
            <p style={{ marginTop: 12, color: "#6b7280", fontSize: 14 }}>Loading tickets…</p>
          </div>
        )}

        {error && (
          <div style={{ padding: 16, background: "#fee2e2", borderRadius: 10, color: "#991b1b", fontSize: 14 }}>
            {error}
          </div>
        )}

        {!loading && !error && tickets.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>No tickets here</div>
            <p style={{ fontSize: 14, marginTop: 4 }}>All quiet on the support front.</p>
          </div>
        )}

        {!loading && tickets.length > 0 && (
          <div style={{
            background: "#fff", borderRadius: 14,
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  {["Time", "Email", "Issue Summary", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "11px 16px", textAlign: "left",
                        fontSize: 12, fontWeight: 700, color: "#6b7280",
                        letterSpacing: "0.03em", textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, i) => {
                  const sc = statusColor(ticket.status);
                  return (
                    <tr
                      key={ticket.id}
                      style={{
                        borderBottom: i < tickets.length - 1 ? "1px solid #f3f4f6" : "none",
                        background: "#fff",
                      }}
                    >
                      {/* Time */}
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>
                        {formatDate(ticket.created_at)}
                      </td>

                      {/* Email */}
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151", maxWidth: 160 }}>
                        {ticket.user_email ? (
                          <a href={`mailto:${ticket.user_email}`} style={{ color: "#0f1f3d", fontWeight: 600 }}>
                            {ticket.user_email}
                          </a>
                        ) : (
                          <span style={{ color: "#9ca3af", fontStyle: "italic" }}>Anonymous</span>
                        )}
                      </td>

                      {/* Issue summary */}
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151", maxWidth: 260 }}>
                        <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {ticket.issue_summary ?? "—"}
                        </span>
                      </td>

                      {/* Status badge */}
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: 20,
                          fontSize: 12, fontWeight: 600,
                          background: sc.bg, color: sc.color,
                          whiteSpace: "nowrap",
                        }}>
                          {ticket.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => setViewingTicket(ticket)}
                            style={{
                              padding: "5px 12px", fontSize: 12,
                              background: "#f3f4f6", color: "#374151",
                              border: "1px solid #d1d5db",
                              borderRadius: 7, cursor: "pointer",
                            }}
                          >
                            View
                          </button>
                          {ticket.status !== "resolved" && (
                            <button
                              onClick={() => resolveTicket(ticket.id)}
                              disabled={resolvingId === ticket.id}
                              style={{
                                padding: "5px 12px", fontSize: 12,
                                background: "#dcfce7", color: "#166534",
                                border: "1px solid #bbf7d0",
                                borderRadius: 7, cursor: "pointer",
                                opacity: resolvingId === ticket.id ? 0.6 : 1,
                              }}
                            >
                              {resolvingId === ticket.id ? "…" : "Resolve"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Conversation modal */}
      {viewingTicket && (
        <ConversationModal
          ticket={viewingTicket}
          onClose={() => setViewingTicket(null)}
        />
      )}
    </div>
  );
}

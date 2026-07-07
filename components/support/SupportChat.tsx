"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface StoredConversation {
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }>;
  messageCount: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "tundemy_support_chat";
const MAX_MESSAGES = 20;
const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Habari! I'm Tunda, your Tundemy support assistant 👋 I can help you with course access, payments, grading questions, and more. What can I help you with today?",
  timestamp: new Date(),
};

const ESCALATION_KEYWORDS = [
  "support team will contact",
  "email support@tundemy.com",
  "noted your issue",
  "within 4 hours",
  "please also email",
];

function looksLikeEscalation(text: string): boolean {
  const lower = text.toLowerCase();
  return ESCALATION_KEYWORDS.some((k) => lower.includes(k));
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 12 }}>
      {/* Avatar */}
      <div style={{
        width: 28, height: 28, borderRadius: "50%", background: "#0f1f3d",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0,
      }}>T</div>
      <div style={{
        background: "#f3f4f6", borderRadius: "16px 16px 16px 4px",
        padding: "10px 14px", display: "flex", gap: 4, alignItems: "center",
      }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            width: 7, height: 7, borderRadius: "50%", background: "#9ca3af",
            display: "inline-block",
            animation: `tunda-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Escalation email form ─────────────────────────────────────────────────────

function EscalationForm({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubmitting(true);
    try {
      await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, sessionId: genId() }),
      });
      setSubmitted(true);
      onSubmit(email);
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{
        margin: "8px 0 12px 36px", padding: "10px 14px",
        background: "#dcfce7", borderRadius: 10, fontSize: 13, color: "#166534",
      }}>
        ✓ Got it! We'll reach out to <strong>{email}</strong> within 4 hours.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ margin: "8px 0 12px 36px" }}>
      <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
        Leave your email and we&apos;ll follow up within 4 hours:
      </p>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          style={{
            flex: 1, padding: "7px 10px", borderRadius: 8,
            border: "1px solid #d1d5db", fontSize: 13, outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "7px 14px", background: "#2d8a4e", color: "#fff",
            border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "…" : "Send"}
        </button>
      </div>
    </form>
  );
}

// ── Main widget ───────────────────────────────────────────────────────────────

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [lastMessage, setLastMessage] = useState("");
  const [escalatedMessageIds, setEscalatedMessageIds] = useState<Set<string>>(new Set());
  const [submittedEscalationIds, setSubmittedEscalationIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  // ── Load from localStorage ────────────────────────────────────────────────

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredConversation = JSON.parse(stored);
        const restored: Message[] = parsed.messages.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
        setMessages(restored);
        setMessageCount(parsed.messageCount);
        // Detect which messages were escalations
        const escapedIds = new Set<string>();
        restored.forEach((m) => {
          if (m.role === "assistant" && looksLikeEscalation(m.content)) {
            escapedIds.add(m.id);
          }
        });
        setEscalatedMessageIds(escapedIds);
      } else {
        // First visit — no stored conversation
        setMessages([WELCOME_MESSAGE]);
      }
    } catch {
      setMessages([WELCOME_MESSAGE]);
    }
  }, []);

  // ── Persist to localStorage whenever messages change ──────────────────────

  useEffect(() => {
    if (!hasInitialized.current) return;
    if (messages.length === 0) return;
    try {
      const toStore: StoredConversation = {
        messages: messages.map((m) => ({
          ...m,
          timestamp: m.timestamp.toISOString(),
        })),
        messageCount,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch {
      // ignore
    }
  }, [messages, messageCount]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [messages, isLoading, isOpen]);

  // ── Focus input on open ───────────────────────────────────────────────────

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // ── Send message ──────────────────────────────────────────────────────────

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    // Session limit
    if (messageCount >= MAX_MESSAGES) return;

    // Dedup identical consecutive messages
    if (text === lastMessage) return;

    const userMessage: Message = {
      id: genId(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setInput("");
    setLastMessage(text);
    setIsLoading(true);
    setMessageCount((c) => c + 1);
    setMessages((prev) => [...prev, userMessage]);

    // Build history for API (exclude welcome message, only user/assistant turns)
    const history = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: history,
        }),
      });

      const data = await res.json();
      const reply: string =
        data.reply ??
        "Sorry, I couldn't get a response. Please email support@tundemy.com.";

      const assistantMessage: Message = {
        id: genId(),
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.shouldEscalate || looksLikeEscalation(reply)) {
        setEscalatedMessageIds((prev) => new Set([...prev, assistantMessage.id]));
      }
    } catch {
      const errorMessage: Message = {
        id: genId(),
        role: "assistant",
        content:
          "Pole, I ran into a connection issue. Please try again or email support@tundemy.com.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messageCount, lastMessage, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setMessages([WELCOME_MESSAGE]);
    setMessageCount(0);
    setLastMessage("");
    setEscalatedMessageIds(new Set());
    setSubmittedEscalationIds(new Set());
  };

  const isLimitReached = messageCount >= MAX_MESSAGES;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Keyframe animation injected once */}
      <style>{`
        @keyframes tunda-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes tunda-slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes tunda-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* ── Chat panel ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Tunda support chat"
          style={{
            position: "fixed",
            bottom: isMobile ? 0 : 90,
            right: isMobile ? 0 : 24,
            width: isMobile ? "100vw" : 380,
            height: isMobile ? "100dvh" : 520,
            background: "#fff",
            borderRadius: isMobile ? 0 : 16,
            boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            overflow: "hidden",
            animation: "tunda-slide-up 0.2s ease-out",
          }}
        >
          {/* Header */}
          <div style={{
            background: "#0f1f3d",
            color: "#fff",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}>
            {/* Avatar */}
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "#1e3a5f",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 16, color: "#fff",
            }}>T</div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Tunda</span>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#4ade80", display: "inline-block",
                }} />
              </div>
              <div style={{ fontSize: 11, color: "#93c5fd" }}>
                AI Support · usually replies instantly
              </div>
            </div>

            <button
              onClick={clearChat}
              title="Clear chat"
              style={{
                background: "none", border: "none", color: "#93c5fd",
                fontSize: 11, cursor: "pointer", padding: "2px 6px",
                textDecoration: "underline", marginRight: 4,
              }}
            >
              Clear
            </button>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              style={{
                background: "none", border: "none", color: "#fff",
                cursor: "pointer", padding: 4, display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages area */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 14px 8px",
            display: "flex",
            flexDirection: "column",
          }}>
            {messages.map((msg, idx) => {
              const isUser = msg.role === "user";
              const isEscalated = escalatedMessageIds.has(msg.id);
              const alreadySubmitted = submittedEscalationIds.has(msg.id);

              return (
                <div key={msg.id} style={{ marginBottom: 4 }}>
                  <div style={{
                    display: "flex",
                    flexDirection: isUser ? "row-reverse" : "row",
                    alignItems: "flex-end",
                    gap: 8,
                    marginBottom: 2,
                  }}>
                    {/* Avatar (Tunda only) */}
                    {!isUser && (
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: "#0f1f3d", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, flexShrink: 0,
                      }}>T</div>
                    )}

                    <div style={{ maxWidth: "78%" }}>
                      {/* Bubble */}
                      <div style={{
                        background: isUser ? "#0f1f3d" : "#f3f4f6",
                        color: isUser ? "#fff" : "#111827",
                        padding: "9px 13px",
                        borderRadius: isUser
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                        fontSize: 14,
                        lineHeight: 1.5,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}>
                        {msg.content}
                      </div>
                      {/* Timestamp */}
                      <div style={{
                        fontSize: 10, color: "#9ca3af",
                        textAlign: isUser ? "right" : "left",
                        marginTop: 3, padding: "0 2px",
                      }}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>

                  {/* Escalation email form — shown after the escalating assistant message */}
                  {!isUser && isEscalated && idx === messages.length - 1 && !alreadySubmitted && (
                    <EscalationForm
                      onSubmit={(email) => {
                        setSubmittedEscalationIds((prev) => new Set([...prev, msg.id]));
                        // Store email in local state — ticket was already created server-side
                        void email;
                      }}
                    />
                  )}
                </div>
              );
            })}

            {/* Typing indicator */}
            {isLoading && <TypingIndicator />}

            {/* Session limit notice */}
            {isLimitReached && (
              <div style={{
                textAlign: "center", padding: "10px 14px",
                background: "#fef3c7", borderRadius: 10, fontSize: 13,
                color: "#92400e", margin: "8px 0",
              }}>
                You&apos;ve reached the session limit. Email{" "}
                <a href="mailto:support@tundemy.com" style={{ color: "#92400e" }}>
                  support@tundemy.com
                </a>{" "}
                for further help.
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div style={{
            padding: "12px 14px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: 8,
            flexShrink: 0,
            background: "#fff",
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLimitReached ? "Session limit reached" : "Ask me anything about Tundemy…"}
              disabled={isLoading || isLimitReached}
              maxLength={1000}
              style={{
                flex: 1,
                padding: "9px 12px",
                borderRadius: 10,
                border: "1.5px solid #d1d5db",
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.15s",
                background: isLimitReached ? "#f9fafb" : "#fff",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#0f1f3d"; }}
              onBlur={(e) => { e.target.style.borderColor = "#d1d5db"; }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || isLimitReached || !input.trim()}
              aria-label="Send message"
              style={{
                width: 40, height: 40,
                background: "#2d8a4e",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                cursor: isLoading || isLimitReached || !input.trim() ? "not-allowed" : "pointer",
                opacity: isLoading || isLimitReached || !input.trim() ? 0.5 : 1,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "opacity 0.15s",
                flexShrink: 0,
              }}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      {/* ── Floating button ── */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9998,
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        {showTooltip && !isOpen && (
          <div style={{
            position: "absolute",
            bottom: "calc(100% + 10px)",
            right: 0,
            background: "#0f1f3d",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: 8,
            fontSize: 13,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            animation: "tunda-fade-in 0.15s ease",
          }}>
            Chat with Tunda — AI Support
            <div style={{
              position: "absolute",
              top: "100%", right: 16,
              border: "5px solid transparent",
              borderTopColor: "#0f1f3d",
            }} />
          </div>
        )}

        <button
          onClick={() => setIsOpen((o) => !o)}
          aria-label="Open Tunda support chat"
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#0f1f3d",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(15,31,61,0.35)",
            transition: "transform 0.15s, box-shadow 0.15s",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.07)";
            e.currentTarget.style.boxShadow = "0 6px 24px rgba(15,31,61,0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(15,31,61,0.35)";
          }}
        >
          {isOpen ? <CloseIcon /> : <ChatIcon />}
          {/* Green online dot */}
          {!isOpen && (
            <span style={{
              position: "absolute",
              top: 2, right: 2,
              width: 13, height: 13,
              background: "#4ade80",
              borderRadius: "50%",
              border: "2px solid #fff",
            }} />
          )}
        </button>
      </div>
    </>
  );
}

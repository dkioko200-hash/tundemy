"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type WaVariant = "setup" | "types" | "webhook";

type MsgType = "text" | "image" | "buttons" | "list" | "template";

interface PhoneMsg {
  id: string;
  direction: "outbound" | "inbound" | "system";
  type: MsgType | "info";
  text?: string;
  imageUrl?: string;
  caption?: string;
  buttons?: string[];
  listTitle?: string;
  listButtonLabel?: string;
  templateName?: string;
  timestamp: string;
  status?: "sent" | "delivered";
  fromName?: string;
}

interface SimResult {
  ok: boolean;
  messageId?: string;
  simulatedResponse?: Record<string, unknown>;
  error?: string;
  fieldErrors?: Record<string, string>;
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

// ── Utility ───────────────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2, 10); }
function nowTime() {
  return new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
}

// ── Phone sub-components ──────────────────────────────────────────────────────

function Tick({ status }: { status?: "sent" | "delivered" }) {
  return (
    <span className="ml-0.5 text-[9px]" style={{ color: status === "delivered" ? "#53bdeb" : "#9ca3af" }}>
      {status === "delivered" ? "✓✓" : "✓"}
    </span>
  );
}

function WaBubble({ msg }: { msg: PhoneMsg }) {
  if (msg.direction === "system") {
    return (
      <div className="flex justify-center my-1.5">
        <span className="text-[10px] text-gray-500 bg-white/70 rounded-full px-3 py-0.5 shadow-sm">
          {msg.text}
        </span>
      </div>
    );
  }

  const out = msg.direction === "outbound";

  return (
    <div className={`flex ${out ? "justify-end" : "justify-start"} mb-1`}>
      <div
        className={`relative max-w-[80%] px-3 py-1.5 shadow-sm text-[12.5px] ${
          out ? "bg-[#dcf8c6] rounded-[8px_2px_8px_8px]" : "bg-white rounded-[2px_8px_8px_8px]"
        }`}
      >
        {!out && msg.fromName && (
          <p className="text-[10px] font-semibold mb-0.5" style={{ color: "#128C7E" }}>{msg.fromName}</p>
        )}

        {msg.type === "text" && (
          <p className="text-gray-800 leading-snug pr-8 break-words">{msg.text}</p>
        )}

        {msg.type === "image" && (
          <div>
            <div className="w-40 h-24 rounded-lg mb-1 bg-gray-200 flex items-center justify-center overflow-hidden">
              {msg.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={msg.imageUrl} alt="sent" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-xs">📷</span>
              )}
            </div>
            {msg.caption && <p className="text-gray-700 text-xs pr-8">{msg.caption}</p>}
          </div>
        )}

        {msg.type === "buttons" && (
          <div>
            <p className="text-gray-800 leading-snug mb-2 pr-8">{msg.text}</p>
            <div className="border-t border-gray-200 pt-1 space-y-1">
              {msg.buttons?.map((btn, i) => (
                <div key={i} className="text-[#0084ff] text-center text-[11px] py-1 border border-gray-100 rounded-lg bg-white cursor-default">
                  {btn}
                </div>
              ))}
            </div>
          </div>
        )}

        {msg.type === "list" && (
          <div>
            {msg.listTitle && (
              <p className="text-gray-800 font-semibold text-[11px] mb-1">{msg.listTitle}</p>
            )}
            <p className="text-gray-800 leading-snug pr-8">{msg.text}</p>
            <div className="border-t border-gray-200 mt-2 pt-1 flex items-center justify-center gap-1 text-[#0084ff] text-[11px]">
              <span>☰</span>
              <span>{msg.listButtonLabel || "View Options"}</span>
            </div>
          </div>
        )}

        {msg.type === "template" && (
          <div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Template</div>
            <p className="text-gray-800 leading-snug pr-8">{msg.text || `📋 ${msg.templateName}`}</p>
            <div className="border-t border-gray-200 mt-1.5 pt-1 text-[#0084ff] text-center text-[11px]">
              View offer →
            </div>
          </div>
        )}

        {msg.type === "info" && (
          <p className="text-gray-500 italic text-[11px] pr-8">{msg.text}</p>
        )}

        <div className={`flex items-center justify-end gap-0.5 mt-0.5 ${out ? "" : "opacity-0 h-0 overflow-hidden"}`}>
          <span className="text-[9px] text-gray-400">{msg.timestamp}</span>
          {out && <Tick status={msg.status} />}
        </div>
        {!out && (
          <span className="text-[9px] text-gray-400 block text-right mt-0.5">{msg.timestamp}</span>
        )}
      </div>
    </div>
  );
}

function PhoneShell({
  messages,
  sending,
  contact = "Savannah Properties",
}: {
  messages: PhoneMsg[];
  sending?: boolean;
  contact?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, sending]);

  return (
    <div
      className="flex-shrink-0 self-start"
      style={{
        width: "220px",
        background: "#1a1a1a",
        borderRadius: "30px",
        padding: "10px",
        boxShadow: "0 12px 48px rgba(0,0,0,0.4), inset 0 0 0 2px #333",
      }}
    >
      <div
        className="flex flex-col overflow-hidden"
        style={{ borderRadius: "22px", height: "460px", background: "#e4ddd6" }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-1 text-white" style={{ background: "#128C7E", fontSize: "9px" }}>
          <span className="font-semibold">9:41</span>
          <span className="opacity-80">●●● WiFi 🔋</span>
        </div>

        {/* Chat header */}
        <div className="flex items-center gap-2 px-2 py-1.5" style={{ background: "#128C7E" }}>
          <span className="text-white text-xs">←</span>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: "#075E54" }}>
            SP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold truncate leading-none" style={{ fontSize: "11px" }}>{contact}</p>
            <p style={{ color: "#b2dfdb", fontSize: "8px" }}>online</p>
          </div>
          <span className="text-white text-xs opacity-70">⋮</span>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 py-2" style={{ background: "#e4ddd6" }}>
          {messages.length === 0 && (
            <p className="text-center text-gray-400 mt-12" style={{ fontSize: "10px" }}>
              Messages appear here<br />when you send them →
            </p>
          )}
          {messages.map((m) => <WaBubble key={m.id} msg={m} />)}
          {sending && (
            <div className="flex justify-end mb-1">
              <div className="bg-[#dcf8c6] rounded-xl px-3 py-2 opacity-60 flex gap-1 items-center">
                {[0, 150, 300].map((d) => (
                  <div key={d} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-1.5 px-2 py-1.5" style={{ background: "#f0f0f0" }}>
          <div className="flex-1 bg-white rounded-full px-3 py-1 text-gray-400" style={{ fontSize: "9px" }}>Type a message</div>
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#128C7E" }}>
            <span style={{ fontSize: "10px" }}>🎤</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── API Response Viewer ────────────────────────────────────────────────────────

function ApiResponseBox({ result }: { result: SimResult }) {
  const [open, setOpen] = useState(false);
  if (!result) return null;
  if (!result.ok) {
    return (
      <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 mt-3">
        <p className="text-red-700 font-semibold text-sm mb-2">❌ {result.error}</p>
        {result.fieldErrors && Object.entries(result.fieldErrors).map(([field, msg]) => (
          <p key={field} className="text-red-600 text-xs mt-1">
            <span className="font-mono font-bold">{field}</span>: {msg}
          </p>
        ))}
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-3 mt-3">
      <div className="flex items-center justify-between">
        <p className="text-green-700 text-sm font-semibold">✓ Message sent — wamid saved</p>
        <button onClick={() => setOpen(!open)} className="text-green-600 text-xs underline ml-2">
          {open ? "hide" : "show"} API response
        </button>
      </div>
      <p className="text-green-600 text-xs mt-1 font-mono break-all">{result.messageId}</p>
      {open && (
        <pre className="mt-2 text-xs bg-white rounded-lg p-3 overflow-x-auto border border-green-100 leading-relaxed">
          {JSON.stringify(result.simulatedResponse, null, 2)}
        </pre>
      )}
    </div>
  );
}

// ── Form: Lesson 2 — Setup (text only) ────────────────────────────────────────

const WA_BUSINESSES = [
  { name: "Savannah Properties", industry: "Real estate — Nairobi" },
  { name: "Duka Yangu Shop", industry: "Retail — Westlands" },
  { name: "Green Farms Kenya", industry: "Agriculture — Nakuru" },
  { name: "SwiftLogistics KE", industry: "Courier — Mombasa Road" },
];

function SetupForm({
  sessionId,
  onSend,
}: {
  sessionId: string;
  onSend: (msg: PhoneMsg, result: SimResult) => void;
}) {
  const [to, setTo] = useState("254712345678");
  const [body, setBody] = useState("Habari! Welcome to Savannah Properties. We have 3BR apartments in Kilimani from KSh 8.5M. How can we help you today?");
  const [biz, setBiz] = useState(0);
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState<SimResult | null>(null);

  const handleSend = async () => {
    setSending(true);
    try {
      const res = await fetch("/api/whatsapp-simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, messageType: "text", payload: { to, body } }),
      });
      const data: SimResult = await res.json();
      setLastResult(data);
      if (data.ok) {
        onSend({
          id: uid(),
          direction: "outbound",
          type: "text",
          text: body,
          timestamp: nowTime(),
          status: "delivered",
        }, data);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Business context */}
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1">Business scenario</label>
        <select value={biz} onChange={(e) => setBiz(Number(e.target.value))}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f1f3d]">
          {WA_BUSINESSES.map((b, i) => (
            <option key={i} value={i}>{b.name} — {b.industry}</option>
          ))}
        </select>
      </div>

      {/* Code preview */}
      <div className="rounded-xl bg-[#0f1f3d] p-4 text-xs font-mono leading-relaxed text-blue-100">
        <p className="text-gray-400 mb-2">{"// sendText() call structure:"}</p>
        <p><span className="text-yellow-300">messaging_product</span>: <span className="text-green-300">&quot;whatsapp&quot;</span></p>
        <p><span className="text-yellow-300">to</span>: <span className="text-green-300 break-all">&quot;{to}&quot;</span></p>
        <p><span className="text-yellow-300">type</span>: <span className="text-green-300">&quot;text&quot;</span></p>
        <p><span className="text-yellow-300">text.body</span>: <span className="text-green-300 break-all">&quot;{body.slice(0, 40)}{body.length > 40 ? "…" : ""}&quot;</span></p>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1">
          <span className="font-mono text-[10px] text-gray-400">to</span> — Recipient phone number
        </label>
        <input value={to} onChange={(e) => setTo(e.target.value)}
          placeholder="254712345678"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#0f1f3d]" />
        <p className="text-[10px] text-gray-400 mt-0.5">Format: 254XXXXXXXXX (no + or spaces)</p>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1">
          <span className="font-mono text-[10px] text-gray-400">text.body</span> — Message
        </label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f1f3d] resize-none"
          placeholder="Type your message…" />
        <p className="text-[10px] text-gray-400 mt-0.5">{body.length}/4096 chars</p>
      </div>

      <button onClick={handleSend} disabled={sending}
        className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ backgroundColor: "#128C7E" }}>
        {sending ? (
          <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending…</>
        ) : "▶ Send via Meta Cloud API"}
      </button>

      {lastResult && <ApiResponseBox result={lastResult} />}
    </div>
  );
}

// ── Form: Lesson 3 — All message types ────────────────────────────────────────

const TYPE_TABS: { id: MsgType; label: string; emoji: string }[] = [
  { id: "text",     label: "Text",     emoji: "💬" },
  { id: "image",    label: "Image",    emoji: "🖼️" },
  { id: "buttons",  label: "Buttons",  emoji: "🔘" },
  { id: "list",     label: "List",     emoji: "☰"  },
  { id: "template", label: "Template", emoji: "📋" },
];

function TypesForm({
  sessionId,
  onSend,
  sentTypes,
}: {
  sessionId: string;
  onSend: (msg: PhoneMsg, result: SimResult, type: MsgType) => void;
  sentTypes: Set<MsgType>;
}) {
  const [tab, setTab] = useState<MsgType>("text");
  const [to] = useState("254712345678");
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState<SimResult | null>(null);

  // Pre-filled payloads for Savannah Properties
  const [textBody, setTextBody] = useState("Habari! Welcome to Savannah Properties. We have prime apartments in Nairobi. Reply to learn more.");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600");
  const [imageCaption, setImageCaption] = useState("🏡 Featured: 3BR Kilimani Apartment — KSh 8.5M");
  const [btnBody, setBtnBody] = useState("What would you like to do?");
  const [buttons, setButtons] = useState(["View Properties", "Book a Viewing", "Talk to Agent"]);
  const [listHeader, setListHeader] = useState("Our Properties");
  const [listBody, setListBody] = useState("Select a property to learn more:");
  const [listBtn, setListBtn] = useState("Browse Listings");
  const [tmplName, setTmplName] = useState("hello_world");

  const buildPayload = () => {
    if (tab === "text") return { to, body: textBody };
    if (tab === "image") return { to, imageUrl, caption: imageCaption };
    if (tab === "buttons") return { to, bodyText: btnBody, buttons };
    if (tab === "list") return { to, headerText: listHeader, bodyText: listBody, buttonText: listBtn, sections: [{ title: "Nairobi", rows: [{ id: "p1", title: "Kilimani 3BR", description: "KSh 8.5M | 3bed 2bath" }, { id: "p2", title: "Westlands Studio", description: "KSh 3.2M | 1bed 1bath" }] }] };
    if (tab === "template") return { to, templateName: tmplName, langCode: "en_US" };
    return {};
  };

  const buildPhoneMsg = (): PhoneMsg => {
    const ts = nowTime();
    if (tab === "text") return { id: uid(), direction: "outbound", type: "text", text: textBody, timestamp: ts, status: "delivered" };
    if (tab === "image") return { id: uid(), direction: "outbound", type: "image", imageUrl, caption: imageCaption, timestamp: ts, status: "delivered" };
    if (tab === "buttons") return { id: uid(), direction: "outbound", type: "buttons", text: btnBody, buttons: buttons.filter(Boolean), timestamp: ts, status: "delivered" };
    if (tab === "list") return { id: uid(), direction: "outbound", type: "list", text: listBody, listTitle: listHeader, listButtonLabel: listBtn, timestamp: ts, status: "delivered" };
    return { id: uid(), direction: "outbound", type: "template", templateName: tmplName, text: "Hello World! Welcome from Meta — this is your default hello_world template message.", timestamp: ts, status: "delivered" };
  };

  const handleSend = async () => {
    setSending(true);
    setLastResult(null);
    try {
      const res = await fetch("/api/whatsapp-simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, messageType: tab, payload: buildPayload() }),
      });
      const data: SimResult = await res.json();
      setLastResult(data);
      if (data.ok) onSend(buildPhoneMsg(), data, tab);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 flex-wrap">
        {TYPE_TABS.map(({ id, label, emoji }) => (
          <button key={id} onClick={() => { setTab(id); setLastResult(null); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all flex items-center gap-1 ${tab === id ? "border-[#128C7E] bg-[#128C7E] text-white" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
            <span>{emoji}</span>
            <span>{label}</span>
            {sentTypes.has(id) && <span className="text-[9px]">✓</span>}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="text-xs text-gray-500">{sentTypes.size}/5 types sent</div>

      {/* Tab form fields */}
      <div className="space-y-3">
        {tab === "text" && (
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">text.body</label>
            <textarea value={textBody} onChange={(e) => setTextBody(e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#128C7E]" />
          </div>
        )}

        {tab === "image" && (
          <>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">image.link (URL)</label>
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#128C7E]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">image.caption</label>
              <input value={imageCaption} onChange={(e) => setImageCaption(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#128C7E]" />
            </div>
          </>
        )}

        {tab === "buttons" && (
          <>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">interactive.body.text</label>
              <textarea value={btnBody} onChange={(e) => setBtnBody(e.target.value)} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#128C7E]" />
            </div>
            {buttons.map((b, i) => (
              <div key={i}>
                <label className="block text-xs font-bold text-gray-600 mb-1">Button {i + 1} title (max 20 chars)</label>
                <input value={b} maxLength={20} onChange={(e) => { const n = [...buttons]; n[i] = e.target.value; setButtons(n); }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#128C7E]" />
              </div>
            ))}
            <p className="text-[10px] text-gray-400">Meta allows max 3 reply buttons per message</p>
          </>
        )}

        {tab === "list" && (
          <>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">interactive.header.text</label>
              <input value={listHeader} onChange={(e) => setListHeader(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#128C7E]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">interactive.body.text</label>
              <textarea value={listBody} onChange={(e) => setListBody(e.target.value)} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#128C7E]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">action.button (list open label)</label>
              <input value={listBtn} onChange={(e) => setListBtn(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#128C7E]" />
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 border border-gray-100">
              Sections pre-filled: Nairobi (Kilimani 3BR, Westlands Studio)
            </div>
          </>
        )}

        {tab === "template" && (
          <>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">template.name</label>
              <input value={tmplName} onChange={(e) => setTmplName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#128C7E]" />
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
              ⚠️ Template messages require prior approval from Meta. Only approved templates can be sent. &quot;hello_world&quot; is pre-approved for testing.
            </div>
          </>
        )}
      </div>

      <button onClick={handleSend} disabled={sending}
        className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ backgroundColor: "#128C7E" }}>
        {sending ? (
          <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending…</>
        ) : `▶ Send ${tab.charAt(0).toUpperCase() + tab.slice(1)} Message`}
      </button>

      {lastResult && <ApiResponseBox result={lastResult} />}
    </div>
  );
}

// ── Form: Lesson 4 — Webhook ───────────────────────────────────────────────────

const INCOMING_PAYLOAD = {
  object: "whatsapp_business_account",
  entry: [{ id: "BUSINESS_ACCOUNT_ID", changes: [{ value: {
    messaging_product: "whatsapp",
    metadata: { display_phone_number: "254700000001", phone_number_id: "PHONE_NUMBER_ID" },
    contacts: [{ profile: { name: "James Kamau" }, wa_id: "254712345678" }],
    messages: [{ from: "254712345678", id: "wamid.inbound_001", timestamp: "1735000000", type: "text", text: { body: "Habari, je mna apartment Nairobi?" } }]
  }, field: "messages" }] }]
};

const VERIFY_CHALLENGE = {
  "hub.mode": "subscribe",
  "hub.verify_token": "savannah_bot_2024",
  "hub.challenge": "HUB_CHALLENGE_8f3k2m9x",
};

function WebhookForm({
  sessionId,
  onVerifyResult,
}: {
  sessionId: string;
  onVerifyResult: (ok: boolean, result: SimResult) => void;
}) {
  const [token, setToken] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [lastResult, setLastResult] = useState<SimResult | null>(null);
  const [activePanel, setActivePanel] = useState<"incoming" | "verify">("incoming");

  const handleVerify = async () => {
    setVerifying(true);
    setLastResult(null);
    try {
      const res = await fetch("/api/whatsapp-simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, messageType: "webhook-verify", payload: { verifyToken: token } }),
      });
      const data: SimResult = await res.json();
      setLastResult(data);
      onVerifyResult(data.ok, data);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Panel toggle */}
      <div className="flex gap-2">
        {(["incoming", "verify"] as const).map((p) => (
          <button key={p} onClick={() => setActivePanel(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${activePanel === p ? "border-[#0f1f3d] bg-[#0f1f3d] text-white" : "border-gray-200 text-gray-600"}`}>
            {p === "incoming" ? "📥 Incoming Message" : "🔐 Webhook Verify"}
          </button>
        ))}
      </div>

      {activePanel === "incoming" && (
        <div className="space-y-3">
          <p className="text-xs text-gray-600">
            When a customer messages your WhatsApp number, Meta POSTs this payload to your webhook URL. This is what your server receives:
          </p>
          <pre className="text-[10px] bg-[#0f1f3d] text-blue-100 rounded-xl p-4 overflow-x-auto leading-relaxed">
            {JSON.stringify(INCOMING_PAYLOAD, null, 2)}
          </pre>
          <div className="text-xs text-gray-500 space-y-1">
            <p>→ <span className="font-mono text-gray-700">entry[0].changes[0].value.messages[0]</span> = the message object</p>
            <p>→ <span className="font-mono text-gray-700">msg.from</span> = sender&apos;s phone (254712345678)</p>
            <p>→ <span className="font-mono text-gray-700">msg.text.body</span> = message text</p>
          </div>
          <button onClick={() => setActivePanel("verify")}
            className="w-full py-2 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: "#0f1f3d" }}>
            Next: Configure Webhook Verification →
          </button>
        </div>
      )}

      {activePanel === "verify" && (
        <div className="space-y-3">
          <p className="text-xs text-gray-600">
            Before Meta trusts your webhook URL, it sends this GET request. Your server must echo back the <span className="font-mono text-[11px]">hub.challenge</span> value — but only if the <span className="font-mono text-[11px]">hub.verify_token</span> matches.
          </p>
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
            <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase">Meta GET request to your /webhook:</p>
            <pre className="text-[10px] font-mono text-gray-700 leading-relaxed">
              {JSON.stringify(VERIFY_CHALLENGE, null, 2)}
            </pre>
          </div>
          <div className="rounded-xl bg-[#0f1f3d] p-4 text-xs font-mono text-blue-100 leading-relaxed">
            <p className="text-gray-400 mb-2">{"// Your handler:"}</p>
            <p><span className="text-yellow-300">if</span> (token === <span className="text-green-300">VERIFY_TOKEN</span>) {"{"}</p>
            <p className="ml-4">res.status(200).send(challenge);</p>
            <p>{"}"} <span className="text-yellow-300">else</span> {"{"}</p>
            <p className="ml-4">res.sendStatus(403);</p>
            <p>{"}"}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">
              Your VERIFY_TOKEN env variable value:
            </label>
            <input value={token} onChange={(e) => setToken(e.target.value)}
              placeholder="Enter the verify token your handler checks…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#0f1f3d]" />
            <p className="text-[10px] text-gray-400 mt-0.5">Hint: for this simulation the expected token is <span className="font-mono">savannah_bot_2024</span></p>
          </div>
          <button onClick={handleVerify} disabled={verifying || !token.trim()}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#0f1f3d" }}>
            {verifying ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Verifying…</>
            ) : "▶ Verify Webhook"}
          </button>
          {lastResult && <ApiResponseBox result={lastResult} />}
        </div>
      )}
    </div>
  );
}

// ── Grade result display ───────────────────────────────────────────────────────

function SimGradeResult({
  result,
  onRetry,
  onNext,
}: {
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
        <div className="mt-2 font-bold text-sm" style={{ color }}>
          {passed ? "Passed — great work!" : "Score 80+ to continue"}
        </div>
      </div>
      {result.feedback && (
        <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed">{result.feedback}</p>
      )}
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
      {!passed && result.specificFixes && result.specificFixes.length > 0 && (
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-2">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Specific fixes</p>
          <ol className="space-y-1.5">
            {result.specificFixes.map((fix, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0f1f3d] text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">{i + 1}</span>
                <span>{fix}</span>
              </li>
            ))}
          </ol>
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

const CONTEXT: Record<WaVariant, { title: string; body: string; bullets: string[] }> = {
  setup: {
    title: "What you are building: Your first Meta Cloud API call",
    body: "The Meta Cloud API works like this — you POST a JSON payload to Meta's servers, and Meta delivers the message to the recipient's WhatsApp. The simulator below mirrors the exact API structure. Practice it here before setting up your real developer account.",
    bullets: [
      "Every field in the payload has a specific purpose — try leaving one out and see the error",
      "Phone numbers must be in 254XXXXXXXXX format — no + or spaces",
      "The API returns a wamid (message ID) you store to track delivery",
    ],
  },
  types: {
    title: "What you are building: All 5 WhatsApp message types",
    body: "WhatsApp supports text, image, interactive buttons, list menus, and pre-approved templates. Each renders differently in the customer's app and has a different JSON structure. Use the tabs below to send all 5 types and see how each looks on the phone.",
    bullets: [
      "Buttons (max 3): best for simple yes/no decisions",
      "Lists (max 10 items): best for menus and product catalogues",
      "Templates: required for outbound messages to customers who haven't messaged you in 24h",
    ],
  },
  webhook: {
    title: "What you are building: A working webhook server",
    body: "When a customer WhatsApps your business number, Meta doesn't give you the message directly — it sends an HTTP POST to a URL you register (your webhook). Before trusting your server, Meta first sends a verification challenge you must respond to correctly. This simulator shows both: an incoming customer message and the webhook verification flow.",
    bullets: [
      "Webhook verification happens once when you register your URL",
      "Your handler must return HTTP 200 immediately — before processing",
      "Every incoming message type (text, image, audio, buttons) arrives at the same endpoint",
    ],
  },
};

// ── Main export ────────────────────────────────────────────────────────────────

export function WhatsAppSimulatorSandbox({
  variant,
  sandboxTask,
  lessonNumber,
  courseSlug,
  onComplete,
}: {
  variant: WaVariant;
  sandboxTask: string;
  lessonNumber: number;
  courseSlug: string;
  onComplete: () => void;
}) {
  const [sessionId] = useState(() => `wa-sim-${Date.now()}-${uid()}`);
  const [messages, setMessages] = useState<PhoneMsg[]>(() => {
    if (variant === "webhook") {
      return [
        {
          id: uid(),
          direction: "system",
          type: "info",
          text: "Customer sent a message to your bot",
          timestamp: nowTime(),
        },
        {
          id: uid(),
          direction: "inbound",
          type: "text",
          text: "Habari, je mna apartment Nairobi?",
          fromName: "James Kamau",
          timestamp: nowTime(),
        },
      ];
    }
    return [];
  });
  const [phoneContact] = useState(variant === "webhook" ? "James Kamau" : "Savannah Properties");
  const [simSending, setSimSending] = useState(false);
  const [sentTypes, setSentTypes] = useState<Set<MsgType>>(new Set());
  const [webhookVerified, setWebhookVerified] = useState(false);

  // Reflection + grading
  const [reflection, setReflection] = useState("");
  const [grading, setGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [gradeError, setGradeError] = useState<string | null>(null);

  const wordCount = reflection.trim().split(/\s+/).filter(Boolean).length;
  const minWords = 60;

  const ctx = CONTEXT[variant];

  const handleMsgSent = useCallback((msg: PhoneMsg, _result: SimResult) => {
    setSimSending(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, msg]);
      setSimSending(false);
    }, 600);
  }, []);

  const handleTypeSent = useCallback((msg: PhoneMsg, result: SimResult, type: MsgType) => {
    handleMsgSent(msg, result);
    setSentTypes((prev) => new Set(prev).add(type));
  }, [handleMsgSent]);

  const handleWebhookVerified = useCallback((ok: boolean, _result: SimResult) => {
    if (ok) {
      setWebhookVerified(true);
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          direction: "system",
          type: "info",
          text: "✓ Webhook verified — Meta will now deliver messages here",
          timestamp: nowTime(),
        },
        {
          id: uid(),
          direction: "outbound",
          type: "text",
          text: "Asante James! We have 3BR apartments in Kilimani from KSh 8.5M. Tuma jina lako na sisi tutakupigia simu. 🏠",
          timestamp: nowTime(),
          status: "delivered",
        },
      ]);
    }
  }, []);

  const handleGrade = async () => {
    setGrading(true);
    setGradeError(null);
    try {
      const res = await fetch("/api/grade-sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          lessonNumber,
          sandboxTask,
          submission: reflection,
        }),
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

  // Derive whether simulator has been used
  const simUsed = variant === "setup"
    ? messages.some((m) => m.direction === "outbound")
    : variant === "types"
    ? sentTypes.size >= 1
    : webhookVerified;

  if (gradeResult) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl p-4 border border-[#128C7E]/20 bg-[#128C7E]/05">
          <p className="text-xs font-bold text-[#128C7E] uppercase tracking-wide mb-1">WhatsApp Simulator</p>
          <p className="text-xs text-gray-500">Lesson {lessonNumber} — {ctx.title}</p>
        </div>
        <SimGradeResult
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
      <div className="rounded-2xl border-2 border-[#128C7E]/25 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📱</span>
          <h3 className="text-sm font-bold" style={{ color: "#0f1f3d" }}>{ctx.title}</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{ctx.body}</p>
        <ul className="space-y-1">
          {ctx.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
              <span className="text-[#128C7E] mt-0.5">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Simulator: form + phone */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form panel */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: "#128C7E", color: "white" }}>API</div>
            <p className="text-sm font-bold text-gray-700">
              {variant === "setup" && "sendText() — Send a text message"}
              {variant === "types" && "All message types — pick a tab and send"}
              {variant === "webhook" && "Webhook simulator"}
            </p>
          </div>

          {variant === "setup" && (
            <SetupForm sessionId={sessionId} onSend={handleMsgSent} />
          )}
          {variant === "types" && (
            <TypesForm sessionId={sessionId} onSend={handleTypeSent} sentTypes={sentTypes} />
          )}
          {variant === "webhook" && (
            <WebhookForm sessionId={sessionId} onVerifyResult={handleWebhookVerified} />
          )}
        </div>

        {/* Phone */}
        <div className="flex justify-center lg:justify-start">
          <PhoneShell messages={messages} sending={simSending} contact={phoneContact} />
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
                : `${variant === "types" ? "Send at least one message type to unlock grading." : "Complete the simulator above to unlock grading."}`}
            </p>
          </div>
        </div>

        {/* Task questions */}
        <div className="bg-[#0f1f3d] rounded-xl p-4 mb-4">
          <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">Your Task</p>
          <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{sandboxTask}</p>
        </div>

        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Write your detailed answers here. Reference what you saw in the simulator — specific field names, error messages, and API responses score higher than general descriptions."
          rows={10}
          disabled={!simUsed}
          className="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          style={{ ["--tw-ring-color" as string]: "#128C7E" }}
          onFocus={(e) => { if (simUsed) e.currentTarget.style.borderColor = "#128C7E"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}
        />

        <div className="flex items-center justify-between mt-2 mb-4">
          <p className={`text-xs font-medium ${wordCount >= minWords ? "text-[#128C7E]" : "text-gray-400"}`}>
            {wordCount} words {wordCount >= minWords ? "✓" : `(min ${minWords})`}
          </p>
          {variant === "types" && (
            <p className="text-xs text-gray-400">{sentTypes.size}/5 types sent</p>
          )}
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

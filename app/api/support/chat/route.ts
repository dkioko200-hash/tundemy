import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { runAutoFix, getAutoFixMode } from "@/lib/tunda-autofix";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory: ConversationMessage[];
  userContext?: Record<string, unknown>;
}

// ── System prompt ─────────────────────────────────────────────────────────────

const TUNDA_SYSTEM_PROMPT = `You are Tunda, the friendly and knowledgeable customer support assistant for Tundemy — an AI skills training platform for African professionals based in Kenya. You help students and employers resolve issues quickly and professionally.

ABOUT TUNDEMY:
- 10 courses across 5 tracks: AI Professional (AI Foundations, Prompt Engineering), AI Developer (WhatsApp Business AI, M-Pesa Daraja API), African Business Tech (AI for Data Analysis, AI for Agriculture), Global AI Talent (AI Evaluation Engineering, RAG & AI Engineering), Freelance & Agency (Freelancing with AI, Selling to Western Clients)
- Course prices range from KSh 1,500 to KSh 4,500
- Students pay via M-Pesa (through Pesapal) or international card (Stripe)
- Each course has video lessons, reading lessons, quizzes, sandbox exercises, and a final capstone project
- Capstone projects are graded by Claude AI — students need 80% or above to pass and earn a certificate
- Students can retry sandbox exercises up to 3 times per 24 hours
- Certificates are issued automatically when a capstone is passed
- Completed students appear in the talent pool — employers can browse and pay KSh 5,000 to unlock contact details
- Employer accounts access the dashboard at /employer/dashboard
- Student accounts access the dashboard at /dashboard

COMMON ISSUES AND HOW TO RESOLVE THEM:
1. Cannot access a course after payment — ask them to check their dashboard at /dashboard, check if enrollment shows there, if not tell them to email support@tundemy.com with their M-Pesa transaction code and we will manually enroll them within 2 hours
2. Grading returned an error or Internal Server Error — this is a known issue that is being fixed, ask them to try again in 10 minutes, if it persists email support@tundemy.com
3. Forgot password — go to /auth/login and click Forgot Password, a reset email will arrive from no-reply@tundemy.com (check spam folder)
4. Certificate not issued after passing capstone — go to /dashboard/certificates, if it is not there wait 5 minutes and refresh, if still missing email support@tundemy.com with their name and course
5. M-Pesa payment deducted but course not unlocked — this happens when the M-Pesa confirmation arrives slowly, wait 10 minutes and refresh /dashboard, if still not enrolled email support@tundemy.com with the M-Pesa receipt number (starts with a letter like QKL...)
6. Cannot log in — check email and password are correct, try Forgot Password, if using Google sign in make sure to use the same method used at signup
7. WhatsApp or Daraja simulator not loading — refresh the page, if it still does not load try a different browser (Chrome recommended), clear browser cache
8. Python runner says Loading Python Environment for a long time — this is Pyodide downloading (about 15MB), it only happens once, wait up to 2 minutes on first load
9. Want a refund — our policy allows refunds within 48 hours of purchase if less than 20% of the course has been accessed, email support@tundemy.com
10. Employer cannot find matching candidates — the talent pool is new and growing, check back in 2 weeks as more students complete courses and join the pool
11. How to become a verified talent — complete any course and pass the capstone project with 80% or above, your profile will automatically appear in the talent pool within 24 hours
12. Course content question — direct them to the specific lesson in the course player, remind them they can also ask Claude directly at claude.ai for deeper explanations

ESCALATION — when to collect their email and create a support ticket:
- Payment issues where M-Pesa was charged but nothing happened
- Account access completely broken after trying all steps
- Technical errors that persist after 30 minutes
- Anything involving money or certificates that you cannot resolve with the above steps

When escalating, say: "I have noted your issue and our support team will contact you within 4 hours. Please also email support@tundemy.com with your account email and a description of the issue for faster resolution."

TONE:
- Warm, professional, and encouraging — like a knowledgeable friend
- Use simple language — many users are not technical
- Occasionally use light Kenyan English phrasing where natural ('pole for the trouble' for apologies, 'karibu' for welcome) but do not overdo it
- Always end escalations with reassurance
- Never make up information — if you do not know, say so and escalate

IMPORTANT LIMITS:
- Do not discuss competitor platforms
- Do not discuss pricing beyond what is stated above
- Do not make promises about future features
- Do not discuss anything unrelated to Tundemy support
- Maximum response length: 150 words — be concise and clear`;

// ── Escalation detection ───────────────────────────────────────────────────────

const ESCALATION_PHRASES = [
  "support team will contact you",
  "email support@tundemy.com",
  "noted your issue",
  "within 4 hours",
  "please also email",
];

function detectEscalation(text: string): boolean {
  const lower = text.toLowerCase();
  return ESCALATION_PHRASES.some((phrase) => lower.includes(phrase.toLowerCase()));
}

// ── Service client ────────────────────────────────────────────────────────────

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service role not configured");
  return createServiceClient(url, key);
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Rate limit: 30 messages per IP per minute
  const ip = getClientIp(req);
  const { limited, resetAt } = checkRateLimit(`support-chat:${ip}`, 30);
  if (limited) return rateLimitResponse(resetAt);

  let body: ChatRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { message, conversationHistory = [], userContext } = body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  // Truncate message to 1000 chars for safety
  const safeMessage = message.trim().slice(0, 1000);

  // Build messages array with full history
  const messages: ConversationMessage[] = [
    ...conversationHistory.slice(-20), // last 20 turns to stay within context
    { role: "user", content: safeMessage },
  ];

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        reply:
          "I'm having trouble connecting right now. Please email support@tundemy.com and our team will help you within 4 hours.",
        shouldEscalate: false,
      },
      { status: 200 }
    );
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        system: TUNDA_SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Claude API error:", res.status, detail);
      return NextResponse.json(
        {
          reply:
            "Pole, I'm having a technical issue right now. Please try again in a moment or email support@tundemy.com.",
          shouldEscalate: false,
        },
        { status: 200 }
      );
    }

    const data = await res.json();
    const reply: string = data?.content?.[0]?.text ?? "";

    const shouldEscalate = detectEscalation(reply);

    // Save ticket to Supabase if escalating
    if (shouldEscalate) {
      try {
        const supabase = getServiceClient();
        const fullHistory = [
          ...conversationHistory,
          { role: "user", content: safeMessage },
          { role: "assistant", content: reply },
        ];
        const issueSummary = safeMessage.slice(0, 200);

        // Try to get user_id from auth header (optional — anon users also supported)
        let userId: string | null = null;
        const authHeader = req.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
          const token = authHeader.slice(7);
          const { data: userData } = await supabase.auth.getUser(token);
          userId = userData?.user?.id ?? null;
        }

        const { data: ticket } = await supabase
          .from("support_tickets")
          .insert({
            user_id: userId,
            user_email: (userContext?.email as string) ?? null,
            conversation: fullHistory,
            issue_summary: issueSummary,
            status: "escalated",
          })
          .select("id, user_id, user_email, conversation, issue_summary, status")
          .maybeSingle();

        // Tunda auto-fix: attempt a known-safe repair for allowlisted issues.
        // Never allowed to affect the chat reply - guarded by try/catch + timeout;
        // on any error/timeout the ticket simply stays escalated (legacy behaviour).
        if (ticket && getAutoFixMode() !== "off") {
          try {
            await Promise.race([
              runAutoFix(ticket),
              new Promise((_, reject) => setTimeout(() => reject(new Error("autofix timeout")), 12000)),
            ]);
          } catch (afErr) {
            console.error("[tunda-autofix]", afErr);
          }
        }
      } catch (err) {
        // Don't fail the response if ticket save fails
        console.error("Failed to save support ticket:", err);
      }
    }

    return NextResponse.json({ reply, shouldEscalate });
  } catch (err) {
    console.error("Support chat error:", err);
    return NextResponse.json(
      {
        reply:
          "Pole, something went wrong on my end. Please email support@tundemy.com and we'll sort it out within 4 hours.",
        shouldEscalate: false,
      },
      { status: 200 }
    );
  }
}

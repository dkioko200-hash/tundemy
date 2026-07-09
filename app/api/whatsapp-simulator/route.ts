import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

type MsgType = "text" | "image" | "buttons" | "list" | "template" | "webhook-verify";

interface SimRequest {
  sessionId: string;
  messageType: MsgType;
  payload: Record<string, unknown>;
}

// Fake wamid matching Meta's format
function fakeWamid() {
  const part = () => Math.random().toString(36).slice(2, 12);
  return `wamid.HBgL${part()}${part()}`;
}

// Phone number must be 254XXXXXXXXX (no +, no spaces)
function validPhone(n: string): boolean {
  return /^254[17]\d{8}$/.test(n);
}

function validate(type: MsgType, p: Record<string, unknown>) {
  const errs: Record<string, string> = {};

  if (type !== "webhook-verify") {
    const to = String(p.to ?? "").trim();
    if (!to) errs.to = "Recipient number is required";
    else if (!validPhone(to))
      errs.to = `Must be format 254XXXXXXXXX (no + or spaces). You entered: "${to}"`;
  }

  if (type === "text") {
    const body = String(p.body ?? "").trim();
    if (!body) errs.body = "Message body cannot be empty";
    else if (body.length > 4096) errs.body = "Message exceeds 4 096 character limit";
  }

  if (type === "image") {
    const url = String(p.imageUrl ?? "").trim();
    if (!url) errs.imageUrl = "Image URL is required";
    else if (!url.startsWith("http")) errs.imageUrl = 'URL must start with "https://"';
  }

  if (type === "buttons") {
    const text = String(p.bodyText ?? "").trim();
    if (!text) errs.bodyText = "Message body is required";
    const btns = (p.buttons ?? []) as string[];
    if (!Array.isArray(btns) || btns.filter(Boolean).length === 0)
      errs.buttons = "At least one button title is required";
    else if (btns.length > 3) errs.buttons = "Meta API allows max 3 reply buttons";
    else {
      const long = btns.find((b) => b.length > 20);
      if (long) errs.buttons = `"${long}" exceeds 20-character button title limit`;
    }
  }

  if (type === "list") {
    if (!String(p.bodyText ?? "").trim()) errs.bodyText = "Message body is required";
    if (!String(p.buttonText ?? "").trim()) errs.buttonText = "Button label is required";
    const secs = (p.sections ?? []) as unknown[];
    if (!Array.isArray(secs) || secs.length === 0) errs.sections = "At least one section required";
  }

  if (type === "template") {
    if (!String(p.templateName ?? "").trim()) errs.templateName = "Template name is required";
  }

  if (type === "webhook-verify") {
    const tok = String(p.verifyToken ?? "").trim();
    if (!tok) errs.verifyToken = "Verify token is required";
    else if (tok !== "savannah_bot_2024")
      errs.verifyToken = `Token mismatch — Meta sent "savannah_bot_2024" but your handler returned "${tok}". Meta returns HTTP 403 and rejects your webhook URL.`;
  }

  return errs;
}

function buildResponse(type: MsgType, p: Record<string, unknown>) {
  if (type === "webhook-verify") {
    return {
      ok: true,
      messageId: "webhook-verified",
      simulatedResponse: {
        status: 200,
        echo: "HUB_CHALLENGE_8f3k2m9x",
        message: "Webhook verified! Meta will now deliver incoming messages to your endpoint.",
      },
    };
  }
  const mid = fakeWamid();
  return {
    ok: true,
    messageId: mid,
    simulatedResponse: {
      messaging_product: "whatsapp",
      contacts: [{ input: p.to, wa_id: p.to }],
      messages: [{ id: mid }],
    },
  };
}

export async function POST(req: NextRequest) {
  const { limited, resetAt } = checkRateLimit(`whatsapp-sim:${getClientIp(req)}`, 30);
  if (limited) return rateLimitResponse(resetAt);

  try {
    const body: SimRequest = await req.json();
    const { sessionId, messageType, payload } = body;

    if (!sessionId || !messageType || !payload) {
      return NextResponse.json(
        { ok: false, error: "sessionId, messageType, and payload are required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const fieldErrors = validate(messageType, payload);
    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json({
        ok: false,
        error: "Validation failed — check the fields highlighted below",
        fieldErrors,
      });
    }

    const result = buildResponse(messageType, payload);

    // Non-fatal — table may not exist yet
    supabase
      .from("sim_whatsapp_messages")
      .insert({ session_id: sessionId, user_id: user.id, message_type: messageType, payload, response: result })
      .then(() => {});

    return NextResponse.json(result);
  } catch (err) {
    console.error("[whatsapp-simulator]", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}

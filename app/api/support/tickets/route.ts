import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service role not configured");
  return createServiceClient(url, key);
}

async function getAdminUser(req: NextRequest) {
  const supabase = getServiceClient();
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const { data } = await supabase.auth.getUser(token);
  return data?.user ?? null;
}

function isAdmin(email: string | undefined): boolean {
  const adminEmail = process.env.SUPPORT_ADMIN_EMAIL ?? "d.kioko200@gmail.com";
  return email === adminEmail;
}

// ── GET — list tickets (admin only) ──────────────────────────────────────────

export async function GET(req: NextRequest) {
  const user = await getAdminUser(req);
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();
  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? "open,escalated";
  const statuses = status.split(",").map((s) => s.trim());

  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .in("status", statuses)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Tickets fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }

  return NextResponse.json({ tickets: data ?? [] });
}

// ── PATCH — update ticket status (admin only) ─────────────────────────────────

export async function PATCH(req: NextRequest) {
  const user = await getAdminUser(req);
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id: string; status: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id, status } = body;
  if (!id || !["open", "resolved", "escalated"].includes(status)) {
    return NextResponse.json({ error: "Invalid id or status" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { error } = await supabase
    .from("support_tickets")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Ticket update error:", error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// ── POST — save email for escalation follow-up ────────────────────────────────

export async function POST(req: NextRequest) {
  let body: { ticketId?: string; email: string; sessionId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { ticketId, email, sessionId } = body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const supabase = getServiceClient();

  if (ticketId) {
    // Update existing ticket with email
    const { error } = await supabase
      .from("support_tickets")
      .update({ user_email: email })
      .eq("id", ticketId);
    if (error) {
      return NextResponse.json({ error: "Failed to save email" }, { status: 500 });
    }
  } else {
    // Create a minimal ticket with just the email and session reference
    const { error } = await supabase.from("support_tickets").insert({
      user_email: email,
      issue_summary: `Escalation email captured from session ${sessionId ?? "unknown"}`,
      status: "escalated",
      conversation: [],
    });
    if (error) {
      return NextResponse.json({ error: "Failed to save ticket" }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}

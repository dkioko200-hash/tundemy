/**
 * /api/tunda/webhook
 *
 * Receives Supabase Database Webhooks when a new support_ticket is inserted.
 * Immediately runs autofix on that single ticket rather than waiting for the
 * 2-hour cron cycle.
 *
 * Setup in Supabase:
 *   Database → Webhooks → Create webhook
 *   Table: support_tickets  Event: INSERT
 *   URL: https://tundemy.com/api/tunda/webhook
 *   HTTP Headers: x-tunda-secret: <TUNDA_AGENT_SECRET>
 */

import { NextRequest, NextResponse } from "next/server";
import { runAutoFix, type Ticket } from "@/lib/tunda-autofix";

interface SupabaseWebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: Record<string, unknown> | null;
  old_record: Record<string, unknown> | null;
}

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.TUNDA_AGENT_SECRET;
  if (!secret) return true; // dev mode
  return req.headers.get("x-tunda-secret") === secret;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: SupabaseWebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Only act on INSERT events for support_tickets
  if (payload.type !== "INSERT" || payload.table !== "support_tickets" || !payload.record) {
    return NextResponse.json({ skipped: true, reason: "not a support_tickets INSERT" });
  }

  const ticket = payload.record as unknown as Ticket;

  console.log(`[tunda-webhook] new ticket ${ticket.id} — running autofix`);

  try {
    const result = await Promise.race([
      runAutoFix(ticket),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("autofix timeout")), 15_000)
      ),
    ]);
    console.log(`[tunda-webhook] ticket ${ticket.id} result: ${result.outcome}`);
    return NextResponse.json({ success: true, ticketId: ticket.id, outcome: result.outcome });
  } catch (err) {
    console.error(`[tunda-webhook] autofix error for ticket ${ticket.id}:`, err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

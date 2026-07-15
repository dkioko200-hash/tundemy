import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { enrollUserInCourse } from "@/lib/enrollment";
import { Resend } from "resend";

// Tunda auto-fix engine. Free-text tickets only ROUTE a candidate; the write is
// gated behind a deterministic diagnostic that re-confirms the exact recoverable
// state against authoritative sources (Pesapal + our tables). A loose match can
// therefore only ever escalate, never mis-fix. Mode via TUNDA_AUTOFIX_MODE
// (off | shadow | live), default shadow.

export type AutoFixMode = "off" | "shadow" | "live";
export function getAutoFixMode(): AutoFixMode {
  const v = (process.env.TUNDA_AUTOFIX_MODE ?? "shadow").toLowerCase();
  return v === "live" ? "live" : v === "off" ? "off" : "shadow";
}

export const AUTO_FIX_ALLOWLIST = [
  {
    category: "payment_confirmed_missing_enrollment",
    summary: "Pesapal payment CONFIRMED ('Completed') but no paid enrollment row for that course.",
    fix: "Idempotent enrollUserInCourse() upsert — the exact op the Pesapal IPN runs on the happy path.",
  },
] as const;

export interface Ticket {
  id: string;
  user_id: string | null;
  user_email: string | null;
  conversation: { role: string; content: string }[] | null;
  issue_summary: string | null;
  status: string;
}
interface RecoverableOrder { order_tracking_id: string; course_slug: string; amount: number; }
export type VerifyFn = (orderTrackingId: string) => Promise<boolean>;
export interface AutoFixResult {
  outcome: "fixed" | "would_fix" | "escalated" | "skipped_dedup" | "failed";
  category: string | null;
  recoverable?: RecoverableOrder[];
  fixed?: string[];
  detail?: string;
}

const PESAPAL_ENV = process.env.PESAPAL_ENV ?? "sandbox";
const PESAPAL_BASE = PESAPAL_ENV === "production" ? "https://pay.pesapal.com/v3" : "https://cybqa.pesapal.com/pesapalv3";

export async function verifyPesapalCompleted(orderTrackingId: string): Promise<boolean> {
  const tokenRes = await fetch(`${PESAPAL_BASE}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ consumer_key: process.env.PESAPAL_CONSUMER_KEY, consumer_secret: process.env.PESAPAL_CONSUMER_SECRET }),
  });
  const t = await tokenRes.json();
  if (!t.token) throw new Error("Pesapal token error");
  const sRes = await fetch(`${PESAPAL_BASE}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${t.token}` },
  });
  const s = await sRes.json();
  return s.payment_status_description === "Completed";
}

function serviceClient(): SupabaseClient {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

async function notifyResolved(to: string, slugs: string[]) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tundemy.com";
  const html = `<div style="font-family:Inter,Arial,sans-serif;padding:24px;color:#374151"><h2 style="color:#0f1f3d">We found and fixed your issue</h2><p>Pole for the trouble. Your confirmed payment had not granted access${slugs.length ? " for: " + slugs.join(", ") : ""}. We've now unlocked it.</p><p><a href="${appUrl}/dashboard" style="color:#2d8a4e;font-weight:700">Go to your dashboard</a></p><p style="font-size:12px;color:#9ca3af">If this wasn't fully resolved, reply and a human will help.</p></div>`;
  try { await new Resend(key).emails.send({ from: "Tundemy <notifications@tundemy.com>", to, subject: "Resolved: your Tundemy course access", html }); } catch {}
}

const PAYMENT_INTENT = /\b(pay|paid|payment|mpesa|m-?pesa|pesapal|receipt|deducted|charged|enroll|enrolled|unlock|purchas|bought|access)\b/i;
export function classify(ticket: Ticket): string | null {
  const convo = (ticket.conversation ?? []).map((m) => m.content).join(" ");
  return PAYMENT_INTENT.test(`${ticket.issue_summary ?? ""} ${convo}`) ? "payment_confirmed_missing_enrollment" : null;
}

export async function diagnoseMissingEnrollment(supabase: SupabaseClient, userId: string, verify: VerifyFn): Promise<RecoverableOrder[]> {
  const { data: pendings } = await supabase.from("pending_orders").select("order_tracking_id, course_slug, amount").eq("user_id", userId);
  const out: RecoverableOrder[] = [];
  for (const p of (pendings ?? []) as RecoverableOrder[]) {
    const { data: enr } = await supabase.from("enrollments").select("id").eq("user_id", userId).eq("course_slug", p.course_slug).eq("payment_status", "paid").maybeSingle();
    if (enr) continue;
    let paid = false;
    try { paid = await verify(p.order_tracking_id); } catch { paid = false; }
    if (paid) out.push(p);
  }
  return out;
}

async function log(supabase: SupabaseClient, ticket: Ticket, row: { category: string | null; outcome: string; action_taken: string; detail: string; mode: AutoFixMode; diagnosis?: unknown }) {
  await supabase.from("auto_fix_log").insert({
    ticket_id: ticket.id, user_id: ticket.user_id, matched_category: row.category,
    outcome: row.outcome, action_taken: row.action_taken, detail: row.detail, mode: row.mode, diagnosis: row.diagnosis ?? null,
  });
}

export async function runAutoFix(ticket: Ticket, opts?: { mode?: AutoFixMode; verify?: VerifyFn; supabase?: SupabaseClient }): Promise<AutoFixResult> {
  const supabase = opts?.supabase ?? serviceClient();
  const mode = opts?.mode ?? getAutoFixMode();
  const verify = opts?.verify ?? verifyPesapalCompleted;
  if (mode === "off") return { outcome: "escalated", category: null, detail: "autofix off" };

  const { data: prior } = await supabase.from("auto_fix_log").select("id").eq("ticket_id", ticket.id).in("outcome", ["fixed", "would_fix", "escalated"]).limit(1);
  if (prior && prior.length) return { outcome: "skipped_dedup", category: null, detail: "already processed" };

  const category = classify(ticket);
  if (!category || !ticket.user_id) {
    await log(supabase, ticket, { category, outcome: "escalated", action_taken: "none", detail: !ticket.user_id ? "no user_id" : "no allowlisted category", mode });
    return { outcome: "escalated", category, detail: "escalated to human" };
  }

  const recoverable = await diagnoseMissingEnrollment(supabase, ticket.user_id, verify);
  if (recoverable.length === 0) {
    await log(supabase, ticket, { category, outcome: "escalated", action_taken: "none", detail: "no Pesapal-confirmed order lacking enrollment", mode });
    return { outcome: "escalated", category, detail: "diagnostic did not confirm recoverable state" };
  }

  if (mode !== "live") {
    await log(supabase, ticket, { category, outcome: "would_fix", action_taken: `would enroll: ${recoverable.map((r) => r.course_slug).join(", ")}`, detail: "shadow mode - no write", mode, diagnosis: recoverable });
    return { outcome: "would_fix", category, recoverable };
  }

  const fixed: string[] = [];
  try {
    for (const r of recoverable) {
      await enrollUserInCourse(ticket.user_id, r.course_slug, r.amount, r.order_tracking_id);
      await supabase.from("pending_orders").delete().eq("order_tracking_id", r.order_tracking_id);
      fixed.push(r.course_slug);
    }
  } catch (err) {
    await log(supabase, ticket, { category, outcome: "failed", action_taken: `partial: ${fixed.join(", ") || "none"}`, detail: `fix error: ${err instanceof Error ? err.message : String(err)}`, mode, diagnosis: recoverable });
    return { outcome: "failed", category, fixed, detail: "fix failed, escalated" };
  }

  if (ticket.user_email) await notifyResolved(ticket.user_email, fixed);
  await supabase.from("support_tickets").update({ status: "auto_resolved", auto_fix_status: "fixed", auto_fixed_at: new Date().toISOString() }).eq("id", ticket.id);
  await log(supabase, ticket, { category, outcome: "fixed", action_taken: `enrolled: ${fixed.join(", ")}`, detail: "idempotent enrollment upsert applied; user notified", mode, diagnosis: recoverable });
  return { outcome: "fixed", category, fixed };
}

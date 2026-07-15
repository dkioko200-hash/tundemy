import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { runAutoFix, getAutoFixMode, AUTO_FIX_ALLOWLIST, type Ticket, type AutoFixMode } from "@/lib/tunda-autofix";
const TEST_USER_IDS = new Set<string>([
  "2c83f251-035a-46d2-9cd2-42beeff13c9e", // Vincent (test)
  "895887c6-9f8e-4ccd-86ce-2b606c9d3c88", // Dennis (test)
]);
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service role not configured");
  return createServiceClient(url, key);
}
async function getAdmin(req: NextRequest) {
  const supabase = getServiceClient();
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const { data } = await supabase.auth.getUser(authHeader.slice(7));
  const adminEmail = process.env.SUPPORT_ADMIN_EMAIL ?? "d.kioko200@gmail.com";
  return data?.user?.email === adminEmail ? data.user : null;
}
export async function GET(req: NextRequest) {
  const admin = await getAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = getServiceClient();
  const [logRes, escalatedRes] = await Promise.all([
    supabase.from("auto_fix_log").select("*").order("created_at", { ascending: false }).limit(200),
    supabase
      .from("support_tickets")
      .select("id, user_id, user_email, issue_summary, status, created_at, auto_fix_status")
      .in("status", ["escalated", "open"])
      .order("created_at", { ascending: false })
      .limit(200),
  ]);
  return NextResponse.json({
    mode: getAutoFixMode(),
    allowlist: AUTO_FIX_ALLOWLIST,
    log: logRes.data ?? [],
    escalated: escalatedRes.data ?? [],
  });
}
export async function POST(req: NextRequest) {
  const admin = await getAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { ticketId?: string; mode?: AutoFixMode; simulatePaymentStatus?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.ticketId) return NextResponse.json({ error: "ticketId required" }, { status: 400 });
  const supabase = getServiceClient();
  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("id, user_id, user_email, conversation, issue_summary, status")
    .eq("id", body.ticketId)
    .maybeSingle();
  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  let verify;
  if (body.simulatePaymentStatus !== undefined) {
    if (!ticket.user_id || !TEST_USER_IDS.has(ticket.user_id)) {
      return NextResponse.json(
        { error: "Payment simulation is only allowed for designated test users" },
        { status: 403 }
      );
    }
    const sim = body.simulatePaymentStatus === "Completed";
    verify = async () => sim;
  }
  const result = await runAutoFix(ticket as Ticket, { mode: body.mode, verify });
  return NextResponse.json({ result });
}

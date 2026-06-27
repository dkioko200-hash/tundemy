import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Client polls this endpoint after 4s to get the simulated callback payload
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const checkoutRequestId = req.nextUrl.searchParams.get("checkoutRequestId");
    if (!checkoutRequestId) {
      return NextResponse.json({ error: "checkoutRequestId required" }, { status: 400 });
    }

    const { data: rows } = await supabase
      .from("sim_daraja_transactions")
      .select("*")
      .eq("user_id", user.id)
      .eq("event_type", "callback")
      .eq("checkout_request_id", checkoutRequestId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ ready: false });
    }

    const row = rows[0];
    const payload = row.payload as { scheduleAt: number };
    const now = Date.now();

    if (now < payload.scheduleAt) {
      return NextResponse.json({ ready: false, waitMs: payload.scheduleAt - now });
    }

    return NextResponse.json({ ready: true, callback: row.response });
  } catch (err) {
    console.error("[daraja/callback]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

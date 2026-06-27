import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { CheckoutRequestID, BusinessShortCode, Password, Timestamp } = body;

    const errors: Record<string, string> = {};
    if (!CheckoutRequestID) errors.CheckoutRequestID = "CheckoutRequestID is required";
    if (!BusinessShortCode) errors.BusinessShortCode = "BusinessShortCode is required";
    if (!Password) errors.Password = "Password is required (Base64 of ShortCode+Passkey+Timestamp)";
    if (!Timestamp) errors.Timestamp = "Timestamp is required (YYYYMMDDHHmmss format)";
    if (Timestamp && !/^\d{14}$/.test(String(Timestamp))) {
      errors.Timestamp = `Timestamp must be 14 digits in YYYYMMDDHHmmss format. Got: "${Timestamp}"`;
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, error: "Validation failed", fieldErrors: errors }, { status: 400 });
    }

    // Look up from sim_daraja_transactions
    const { data: rows } = await supabase
      .from("sim_daraja_transactions")
      .select("*")
      .eq("user_id", user.id)
      .eq("event_type", "stkpush")
      .contains("response", { CheckoutRequestID })
      .order("created_at", { ascending: false })
      .limit(1);

    const tx = rows?.[0];

    if (!tx) {
      return NextResponse.json({
        ok: true,
        ResponseCode: "0",
        ResponseDescription: "The service request has been accepted successfully",
        MerchantRequestID: "sim-merchant-0001",
        CheckoutRequestID,
        ResultCode: "1032",
        ResultDesc: "Request cancelled by user",
      });
    }

    const payload = tx.payload as Record<string, unknown>;
    const succeeded = payload?.willSucceed === true;

    return NextResponse.json({
      ok: true,
      ResponseCode: "0",
      ResponseDescription: "The service request has been accepted successfully",
      MerchantRequestID: tx.id ?? "sim-merchant-0001",
      CheckoutRequestID,
      ResultCode: succeeded ? "0" : "1032",
      ResultDesc: succeeded ? "The service request is processed successfully." : "Request cancelled by user",
    });
  } catch (err) {
    console.error("[daraja/query]", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}

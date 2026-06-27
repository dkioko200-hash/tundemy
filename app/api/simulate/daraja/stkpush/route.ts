import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const FAILURE_CODES = [
  { code: 1032, desc: "Request cancelled by user" },
  { code: 1037, desc: "DS timeout user cannot be reached" },
  { code: 2001, desc: "Wrong PIN" },
];

function fakeCheckoutId(): string {
  const rand = () => Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ws_CO_${rand()}${rand()}_${Date.now()}`;
}

function fakeMpesaReceipt(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let r = "";
  for (let i = 0; i < 10; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
}

function validPhone(n: string): boolean {
  return /^2547\d{8}$|^2541\d{8}$/.test(n);
}

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
    const {
      BusinessShortCode,
      Password,
      Timestamp,
      TransactionType,
      Amount,
      PartyA,
      PartyB,
      PhoneNumber,
      CallBackURL,
      AccountReference,
      TransactionDesc,
    } = body;

    const errors: Record<string, string> = {};

    if (!BusinessShortCode) errors.BusinessShortCode = "BusinessShortCode is required";
    if (!Password) errors.Password = "Password is required — Base64(ShortCode + Passkey + Timestamp)";
    if (!Timestamp) {
      errors.Timestamp = "Timestamp is required in YYYYMMDDHHmmss format";
    } else if (!/^\d{14}$/.test(String(Timestamp))) {
      errors.Timestamp = `Timestamp must be exactly 14 digits (YYYYMMDDHHmmss). Got: "${Timestamp}"`;
    }
    if (TransactionType !== "CustomerPayBillOnline" && TransactionType !== "CustomerBuyGoodsOnline") {
      errors.TransactionType = `TransactionType must be "CustomerPayBillOnline" or "CustomerBuyGoodsOnline". Got: "${TransactionType}"`;
    }
    if (Amount === undefined || Amount === null || Amount === "") {
      errors.Amount = "Amount is required";
    } else if (!Number.isInteger(Number(Amount)) || Number(Amount) <= 0) {
      errors.Amount = `Amount must be a positive integer. Got: ${Amount} — use Math.ceil() if you have decimals`;
    }
    const phoneStr = String(PhoneNumber ?? "").trim();
    if (!phoneStr) {
      errors.PhoneNumber = "PhoneNumber is required";
    } else if (!validPhone(phoneStr)) {
      errors.PhoneNumber = `PhoneNumber must be 254XXXXXXXXX (12 digits, starts with 2547 or 2541). Got: "${phoneStr}"`;
    }
    if (!CallBackURL) {
      errors.CallBackURL = "CallBackURL is required — must be a publicly accessible HTTPS URL";
    } else if (!String(CallBackURL).startsWith("http")) {
      errors.CallBackURL = `CallBackURL must start with https://. Got: "${CallBackURL}"`;
    }
    if (!AccountReference) errors.AccountReference = "AccountReference is required";
    if (!TransactionDesc) errors.TransactionDesc = "TransactionDesc is required";
    if (!PartyA) errors.PartyA = "PartyA (customer phone) is required";
    if (!PartyB) errors.PartyB = "PartyB (shortcode) is required";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({
        ok: false,
        error: "STK Push validation failed — check fields below",
        fieldErrors: errors,
      }, { status: 400 });
    }

    const checkoutRequestId = fakeCheckoutId();
    const merchantRequestId = `sim-${Math.random().toString(36).slice(2, 10)}`;
    const willSucceed = Math.random() < 0.8;
    const failure = willSucceed ? null : FAILURE_CODES[Math.floor(Math.random() * FAILURE_CODES.length)];

    // Persist transaction record
    supabase
      .from("sim_daraja_transactions")
      .insert({
        user_id: user.id,
        event_type: "stkpush",
        checkout_request_id: checkoutRequestId,
        payload: {
          PhoneNumber: phoneStr,
          Amount: Number(Amount),
          AccountReference,
          TransactionDesc,
          CallBackURL,
          willSucceed,
          failureCode: failure?.code ?? null,
        },
        response: { CheckoutRequestID: checkoutRequestId, MerchantRequestID: merchantRequestId },
      })
      .then(() => {});

    // Fire fake callback after 4 seconds into background (fire-and-forget)
    // We use a setTimeout via an edge-compatible pattern: store callback details and let the client poll
    // Since we can't do true server-side setTimeout in serverless, we record the scheduled callback
    // and the client polls /api/simulate/daraja/query after 4s
    const callbackPayload = willSucceed
      ? {
          Body: {
            stkCallback: {
              MerchantRequestID: merchantRequestId,
              CheckoutRequestID: checkoutRequestId,
              ResultCode: 0,
              ResultDesc: "The service request is processed successfully.",
              CallbackMetadata: {
                Item: [
                  { Name: "Amount", Value: Number(Amount) },
                  { Name: "MpesaReceiptNumber", Value: fakeMpesaReceipt() },
                  { Name: "Balance", Value: "" },
                  { Name: "TransactionDate", Value: Number(new Date().toISOString().replace(/\D/g, "").slice(0, 14)) },
                  { Name: "PhoneNumber", Value: Number(phoneStr) },
                ],
              },
            },
          },
        }
      : {
          Body: {
            stkCallback: {
              MerchantRequestID: merchantRequestId,
              CheckoutRequestID: checkoutRequestId,
              ResultCode: failure!.code,
              ResultDesc: failure!.desc,
            },
          },
        };

    // Store the callback payload to be returned when the client polls
    supabase
      .from("sim_daraja_transactions")
      .insert({
        user_id: user.id,
        event_type: "callback",
        checkout_request_id: checkoutRequestId,
        payload: { willSucceed, scheduleAt: Date.now() + 4000 },
        response: callbackPayload,
      })
      .then(() => {});

    return NextResponse.json({
      ok: true,
      MerchantRequestID: merchantRequestId,
      CheckoutRequestID: checkoutRequestId,
      ResponseCode: "0",
      ResponseDescription: "Success. Request accepted for processing",
      CustomerMessage: "Success. Request accepted for processing",
    });
  } catch (err) {
    console.error("[daraja/stkpush]", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}

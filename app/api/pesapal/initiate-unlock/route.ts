import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { BUNDLE_PRICE_KES, SINGLE_UNLOCK_PRICE_KES, UnlockType } from "@/lib/employer-unlocks";

const PESAPAL_ENV = process.env.PESAPAL_ENV ?? "sandbox";
const PESAPAL_BASE =
  PESAPAL_ENV === "production"
    ? "https://pay.pesapal.com/v3"
    : "https://cybqa.pesapal.com/pesapalv3";

async function getPesapalToken(): Promise<string> {
  const res = await fetch(`${PESAPAL_BASE}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      consumer_key: process.env.PESAPAL_CONSUMER_KEY,
      consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
    }),
  });
  const data = await res.json();
  if (!data.token) throw new Error(`Pesapal token error: ${JSON.stringify(data)}`);
  return data.token as string;
}

async function registerIPN(token: string, ipnUrl: string): Promise<string> {
  const res = await fetch(`${PESAPAL_BASE}/api/URLSetup/RegisterIPN`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url: ipnUrl, ipn_notification_type: "GET" }),
  });
  const data = await res.json();
  return (data.ipn_id ?? data.id) as string;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.PESAPAL_CONSUMER_KEY || !process.env.PESAPAL_CONSUMER_SECRET) {
      return NextResponse.json(
        { error: "Payment not configured. Please add Pesapal credentials to .env.local" },
        { status: 503 }
      );
    }

    const { type, candidateId } = (await req.json()) as { type: UnlockType; candidateId?: string };
    if (type !== "single" && type !== "bundle") {
      return NextResponse.json({ error: "type must be 'single' or 'bundle'" }, { status: 400 });
    }
    if (type === "single" && !candidateId) {
      return NextResponse.json({ error: "candidateId is required for single unlock" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const amount = type === "single" ? SINGLE_UNLOCK_PRICE_KES : BUNDLE_PRICE_KES;
    const description = type === "single" ? "Tundemy talent profile unlock" : "Tundemy employer talent bundle (10 profiles)";

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const token = await getPesapalToken();
    const ipnId = await registerIPN(token, `${appUrl}/api/pesapal/ipn`);

    const orderId = `TND-EMP-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const callbackParams = type === "single" ? `?type=single&candidateId=${candidateId}` : `?type=bundle`;
    const callbackUrl = `${appUrl}/employer/dashboard/talent/unlock-confirm${callbackParams}`;

    const orderPayload = {
      id: orderId,
      currency: "KES",
      amount,
      description,
      callback_url: callbackUrl,
      notification_id: ipnId,
      billing_address: {
        email_address: user.email ?? "",
        first_name: (user.user_metadata?.full_name ?? user.email ?? "").split(" ")[0],
        last_name: (user.user_metadata?.full_name ?? "").split(" ").slice(1).join(" ") || ".",
      },
    };

    const orderRes = await fetch(`${PESAPAL_BASE}/api/Transactions/SubmitOrderRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const orderData = await orderRes.json();
    if (!orderData.redirect_url) {
      return NextResponse.json({ error: "Order submission failed", detail: orderData }, { status: 502 });
    }

    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { error: insertError } = await serviceClient.from("pending_employer_unlock_orders").insert({
      order_tracking_id: orderData.order_tracking_id,
      employer_id: user.id,
      unlock_type: type,
      candidate_id: candidateId ?? null,
      amount,
    });
    if (insertError) throw insertError;

    return NextResponse.json({
      redirect_url: orderData.redirect_url as string,
      order_tracking_id: orderData.order_tracking_id as string,
    });
  } catch (err) {
    console.error("[pesapal/initiate-unlock]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

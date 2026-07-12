import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

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

    const { slug, phone } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { getCourseBySlug } = await import("@/lib/courses");
    const course = getCourseBySlug(slug);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const token = await getPesapalToken();
    const ipnId = await registerIPN(token, `${appUrl}/api/pesapal/ipn`);

    const orderId = `TND-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const callbackUrl = `${appUrl}/courses/${slug}/enroll/confirm`;

    const orderPayload = {
      id: orderId,
      currency: "KES",
      amount: course.price_kes,
      description: course.title,
      callback_url: callbackUrl,
      notification_id: ipnId,
      billing_address: {
        email_address: user.email ?? "",
        phone_number: typeof phone === "string" ? phone.replace(/\s/g, "") : undefined,
        first_name: (user.user_metadata?.full_name ?? user.email ?? "").split(" ")[0],
        last_name: (user.user_metadata?.full_name ?? "").split(" ").slice(1).join(" ") || ".",
      },
    };

    const orderRes = await fetch(
      `${PESAPAL_BASE}/api/Transactions/SubmitOrderRequest`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      }
    );

    const orderData = await orderRes.json();

    if (!orderData.redirect_url) {
      return NextResponse.json(
        { error: "Order submission failed", detail: orderData },
        { status: 502 }
      );
    }

    const orderTrackingId = orderData.order_tracking_id as string;

    // Write to pending_orders so the IPN webhook can enroll the user
    // if the browser redirect back never completes (closed tab, session expired, etc.)
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { error: pendingErr } = await adminClient
      .from("pending_orders")
      .upsert(
        {
          order_tracking_id: orderTrackingId,
          user_id: user.id,
          course_slug: slug,
          amount: course.price_kes,
        },
        { onConflict: "order_tracking_id" }
      );
    if (pendingErr) {
      // Non-fatal -- verify path still works as primary enrollment path
      console.error("[pesapal/initiate] pending_orders upsert failed", pendingErr);
    }

    return NextResponse.json({
      redirect_url: orderData.redirect_url as string,
      order_tracking_id: orderTrackingId,
    });
  } catch (err) {
    console.error("[pesapal/initiate]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

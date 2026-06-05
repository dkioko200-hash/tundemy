import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { enrollUserInCourse } from "@/lib/enrollment";

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderTrackingId = searchParams.get("OrderTrackingId");
    const orderMerchantReference = searchParams.get("OrderMerchantReference");

    if (!orderTrackingId || !orderMerchantReference) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const token = await getPesapalToken();
    const statusRes = await fetch(
      `${PESAPAL_BASE}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      }
    );
    const statusData = await statusRes.json();
    const paymentStatus: string = statusData.payment_status_description ?? "";

    if (paymentStatus === "Completed") {
      // Extract slug from merchant reference: TND-{timestamp}-{random}
      // The slug was passed at order creation — look it up from pending_orders table or
      // derive from the description field if stored. For now look up in Supabase.
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { data: pending } = await supabase
        .from("pending_orders")
        .select("user_id, course_slug, amount")
        .eq("order_tracking_id", orderTrackingId)
        .maybeSingle();

      if (pending) {
        await enrollUserInCourse(
          pending.user_id,
          pending.course_slug,
          pending.amount,
          orderTrackingId
        );
        await supabase
          .from("pending_orders")
          .delete()
          .eq("order_tracking_id", orderTrackingId);
      }
    }

    return NextResponse.json({ orderNotificationType: "IPNCHANGE", orderTrackingId, orderMerchantReference, status: 200 });
  } catch (err) {
    console.error("[pesapal/ipn]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

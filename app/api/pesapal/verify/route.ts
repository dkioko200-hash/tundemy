import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { enrollUserInCourse } from "@/lib/enrollment";
import { getCourseBySlug } from "@/lib/courses";

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
    const slug = searchParams.get("slug");

    if (!orderTrackingId || !slug) {
      return NextResponse.json(
        { error: "OrderTrackingId and slug are required" },
        { status: 400 }
      );
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

    const course = getCourseBySlug(slug);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const token = await getPesapalToken();

    const statusRes = await fetch(
      `${PESAPAL_BASE}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const statusData = await statusRes.json();
    const paymentStatus: string = statusData.payment_status_description ?? "";

    if (paymentStatus === "Completed") {
      await enrollUserInCourse(
        user.id,
        slug,
        course.price_kes,
        orderTrackingId
      );
      return NextResponse.json({ status: "paid" });
    }

    if (paymentStatus === "Failed" || paymentStatus === "Invalid") {
      return NextResponse.json({ status: "failed" });
    }

    return NextResponse.json({ status: "pending" });
  } catch (err) {
    console.error("[pesapal/verify]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

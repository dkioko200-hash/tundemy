import { createClient } from "@supabase/supabase-js";

const getServiceClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export async function enrollUserInCourse(
  userId: string,
  courseSlug: string,
  amountPaid: number,
  paymentRef: string
) {
  const supabase = getServiceClient();
  const { error } = await supabase.from("enrollments").upsert(
    {
      user_id: userId,
      course_slug: courseSlug,
      payment_status: "paid",
      amount_paid: amountPaid,
      payment_ref: paymentRef,
      enrolled_at: new Date().toISOString(),
    },
    { onConflict: "user_id,course_slug" }
  );
  if (error) throw error;
}

export async function getUserEnrollments(userId: string) {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select("course_slug, payment_status, enrolled_at")
    .eq("user_id", userId)
    .eq("payment_status", "paid");
  if (error) throw error;
  return data ?? [];
}

export async function isUserEnrolled(
  userId: string,
  courseSlug: string
): Promise<boolean> {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_slug", courseSlug)
    .eq("payment_status", "paid")
    .maybeSingle();
  return !!data;
}

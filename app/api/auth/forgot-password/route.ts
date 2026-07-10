import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

const MAX_ATTEMPTS_PER_MINUTE = 5;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited, resetAt } = checkRateLimit(`forgot-password:${ip}`, MAX_ATTEMPTS_PER_MINUTE);
  if (limited) return rateLimitResponse(resetAt);

  try {
    const { email } = await req.json().catch(() => ({}));
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Hardcode production URL so the PKCE callback always lands on the right page.
    // Supabase verifies the token then redirects to /auth/callback?code=...&type=recovery
    // which exchanges the code for a session and redirects to /auth/reset-password.
    const redirectTo = "https://tundemy.com/auth/callback?next=/auth/reset-password";

    // Always return success to prevent email enumeration
    await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[auth/forgot-password]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

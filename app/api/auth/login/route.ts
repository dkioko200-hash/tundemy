import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

const MAX_LOGIN_ATTEMPTS_PER_MINUTE = 10;

export async function POST(req: NextRequest) {
  // Basic rate limiting: max 10 login attempts per IP per minute. This is a
  // first line of defense against scripted password-guessing; Supabase Auth
  // also applies its own internal rate limits on top of this.
  const ip = getClientIp(req);
  const { limited, resetAt } = checkRateLimit(`login:${ip}`, MAX_LOGIN_ATTEMPTS_PER_MINUTE);
  if (limited) return rateLimitResponse(resetAt);

  try {
    const { email, password } = await req.json().catch(() => ({}));
    if (!email || !password) {
      return NextResponse.json({ error: "email and password are required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[auth/login]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

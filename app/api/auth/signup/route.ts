import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

const MAX_SIGNUPS_PER_MINUTE = 10;

export async function POST(req: NextRequest) {
  // Basic rate limiting: max 10 signup attempts per IP per minute.
  const ip = getClientIp(req);
  const { limited, resetAt } = checkRateLimit(`signup:${ip}`, MAX_SIGNUPS_PER_MINUTE);
  if (limited) return rateLimitResponse(resetAt);

  try {
    const body = await req.json().catch(() => ({}));
    const { fullName, email, password, role, acceptedTerms, next } = body as {
      fullName?: string;
      email?: string;
      password?: string;
      role?: string;
      acceptedTerms?: boolean;
      next?: string;
    };

    // Server-side enforcement of legal consent — this is the actual gate.
    // The disabled checkbox on the client is a UX nicety, not the control.
    if (acceptedTerms !== true) {
      return NextResponse.json(
        { error: "You must accept the Terms of Service and Privacy Policy to create an account." },
        { status: 400 }
      );
    }

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "fullName, email, and password are required" },
        { status: 400 }
      );
    }
    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }
    const safeRole = role === "employer" ? "employer" : "student";

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

    const origin = req.nextUrl.origin;
    const emailRedirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next || "/dashboard")}`;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: safeRole },
        emailRedirectTo,
      },
    });

    const isDuplicate =
      (signUpError && /already registered|user already/i.test(signUpError.message)) ||
      (data?.user != null && (!data.user.identities || data.user.identities.length === 0));

    if (isDuplicate) {
      return NextResponse.json({ existingUser: true });
    }

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    // Record proof of consent (timestamp) on the profiles row. The profiles
    // row may already exist via a DB trigger on auth.users insert, or may
    // not exist yet — upsert handles both cases without clobbering other
    // columns a trigger may have already set.
    if (data.user) {
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (serviceKey) {
        const admin = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);
        const { error: upsertError } = await admin.from("profiles").upsert(
          {
            id: data.user.id,
            full_name: fullName,
            role: safeRole,
            terms_accepted_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
        if (upsertError) {
          console.error("[auth/signup] terms_accepted_at upsert failed:", upsertError);
          // Don't fail the signup over this — the account was created
          // successfully in Supabase Auth. Log loudly so it can be backfilled.
        }
      } else {
        console.error("[auth/signup] SUPABASE_SERVICE_ROLE_KEY missing — could not record terms_accepted_at");
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[auth/signup]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

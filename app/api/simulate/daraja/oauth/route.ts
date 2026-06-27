import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function isValidBase64(s: string): boolean {
  try {
    const decoded = Buffer.from(s, "base64").toString("utf8");
    return decoded.includes(":");
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const grantType = req.nextUrl.searchParams.get("grant_type");
    const authHeader = req.headers.get("authorization") ?? "";

    const errors: Record<string, string> = {};

    if (grantType !== "client_credentials") {
      errors.grant_type = `grant_type must be "client_credentials". You sent: "${grantType}"`;
    }

    if (!authHeader.startsWith("Basic ")) {
      errors.authorization = 'Authorization header must start with "Basic " followed by Base64(consumerKey:consumerSecret)';
    } else {
      const encoded = authHeader.slice(6).trim();
      if (!encoded) {
        errors.authorization = "No Base64 credentials provided after 'Basic '";
      } else if (!isValidBase64(encoded)) {
        errors.authorization = `Invalid Base64 encoding. Use: Buffer.from('consumerKey:consumerSecret').toString('base64'). You provided: "${encoded.slice(0, 30)}..."`;
      } else {
        const decoded = Buffer.from(encoded, "base64").toString("utf8");
        const parts = decoded.split(":");
        if (parts.length !== 2 || !parts[0] || !parts[1]) {
          errors.authorization = `Decoded value must be "consumerKey:consumerSecret". Got "${decoded.slice(0, 40)}"`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({
        ok: false,
        error: "OAuth authentication failed",
        fieldErrors: errors,
        hint: "Correct format: Authorization: Basic <base64(consumerKey:consumerSecret)>",
      }, { status: 400 });
    }

    const token = `sim_${Buffer.from(`${user.id}:${Date.now()}`).toString("base64").slice(0, 32)}`;
    const expiresIn = 3600;

    supabase
      .from("sim_daraja_transactions")
      .insert({
        user_id: user.id,
        event_type: "oauth",
        payload: { grant_type: grantType, authorized: true },
        response: { access_token: token, expires_in: expiresIn },
      })
      .then(() => {});

    return NextResponse.json({
      ok: true,
      access_token: token,
      expires_in: expiresIn,
      token_type: "Bearer",
    });
  } catch (err) {
    console.error("[daraja/oauth]", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}

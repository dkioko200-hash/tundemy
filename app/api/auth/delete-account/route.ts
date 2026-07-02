import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function sendDeletionEmail(email: string, fullName: string) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return; // best-effort
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "Tundemy <hello@tundemy.com>",
        to: email,
        subject: "Your Tundemy account has been deleted",
        html: `
          <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#111">
            <div style="font-size:22px;font-weight:800;color:#0f1f3d;margin-bottom:4px">
              Tund<span style="color:#2d8a4e">emy</span>
            </div>
            <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb"/>
            <p>Hi ${fullName},</p>
            <p>This email confirms that your Tundemy account and all associated data have been permanently deleted, in accordance with your request.</p>
            <p><strong>What was deleted:</strong></p>
            <ul>
              <li>Your profile and contact information</li>
              <li>Course enrolments and progress records</li>
              <li>Assessment and grading history</li>
              <li>Certificates and badges</li>
              <li>Simulator sessions</li>
            </ul>
            <p>This action is irreversible. If you believe this was a mistake, please contact us at <a href="mailto:hello@tundemy.com" style="color:#2d8a4e">hello@tundemy.com</a> immediately — we may not be able to recover your data once it has been purged.</p>
            <p style="margin-top:32px;font-size:13px;color:#6b7280">
              Tundemy · Nairobi, Kenya<br/>
              This is an automated message — please do not reply.
            </p>
          </div>
        `,
      }),
    });
  } catch (err) {
    console.error("[delete-account] Resend error (non-fatal):", err);
  }
}

/**
 * Permanently deletes the authenticated user's account and all associated data,
 * in the order required to avoid foreign-key violations.
 *
 * Required by Kenya Data Protection Act 2019, Article 26 (right to erasure).
 */
export async function DELETE(req: NextRequest) {
  void req; // not needed but satisfies Next.js signature
  try {
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

    const uid = user.id;
    const userEmail = user.email ?? "";
    const admin = getServiceClient();

    // Fetch name for the confirmation email before we delete the profile
    const { data: profileRow } = await admin
      .from("profiles")
      .select("full_name")
      .eq("id", uid)
      .maybeSingle();
    const fullName: string = profileRow?.full_name || user.email?.split("@")[0] || "there";

    // Send confirmation email BEFORE deleting so the user has proof of erasure
    await sendDeletionEmail(userEmail, fullName);

    // Delete in FK-safe order ─────────────────────────────────────────────────
    const tables: string[] = [
      "grading_cache",
      "grading_attempts",
      "talent_badges",
      "talent_capstone_work",
      "sim_whatsapp_messages",
      "sim_daraja_transactions",
      "progress",
      "enrollments",
      "talent_profiles",
      "profiles",
    ];

    for (const table of tables) {
      const col = table === "profiles" ? "id" : "user_id";
      const { error } = await admin.from(table).delete().eq(col, uid);
      if (error) {
        // Log but don't abort — the auth.users delete is the critical step
        console.error(`[delete-account] error deleting from ${table}:`, error.message);
      }
    }

    // Finally delete the auth record (this also invalidates all sessions)
    const { error: authDeleteErr } = await admin.auth.admin.deleteUser(uid);
    if (authDeleteErr) {
      console.error("[delete-account] auth delete error:", authDeleteErr.message);
      return NextResponse.json({ error: "Failed to delete auth record" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[delete-account]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

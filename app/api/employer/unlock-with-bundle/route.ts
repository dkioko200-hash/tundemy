import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { unlockCandidateForEmployer, useBundleCredit } from "@/lib/employer-unlocks";

export async function POST(req: NextRequest) {
  try {
    const { candidateId } = (await req.json()) as { candidateId?: string };
    if (!candidateId) {
      return NextResponse.json({ error: "candidateId is required" }, { status: 400 });
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

    const used = await useBundleCredit(user.id);
    if (!used) {
      return NextResponse.json({ error: "No bundle credits available" }, { status: 402 });
    }

    await unlockCandidateForEmployer(user.id, candidateId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[employer/unlock-with-bundle]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

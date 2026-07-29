/**
 * /api/tunda/agent
 *
 * Authorisation (either header works):
 *   Vercel cron:   Authorization: Bearer <CRON_SECRET>
 *   Manual / test: x-tunda-secret: <TUNDA_AGENT_SECRET>
 *
 * Usage:
 *   curl -X POST https://tundemy.com/api/tunda/agent \
 *     -H "x-tunda-secret: YOUR_SECRET"
 */

import { NextRequest, NextResponse } from "next/server";
import { runTundaAgent } from "@/lib/tunda-agent";

export const maxDuration = 90; // Vercel Hobby max; upgrade to Pro for longer runs

function isAuthorized(req: NextRequest): boolean {
  // Vercel cron sends Authorization: Bearer CRON_SECRET
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;

  // Manual trigger via x-tunda-secret header
  const agentSecret = process.env.TUNDA_AGENT_SECRET;
  const manualHeader = req.headers.get("x-tunda-secret");
  if (agentSecret && manualHeader === agentSecret) return true;

  // If neither secret is configured, allow (dev mode only)
  if (!cronSecret && !agentSecret) return true;

  return false;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[tunda-agent] run triggered via GET");
    const report = await runTundaAgent();
    return NextResponse.json({ success: true, report }, { status: 200 });
  } catch (err) {
    console.error("[tunda-agent] unhandled error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[tunda-agent] run triggered via POST");
    const report = await runTundaAgent();
    return NextResponse.json({ success: true, report }, { status: 200 });
  } catch (err) {
    console.error("[tunda-agent] unhandled error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

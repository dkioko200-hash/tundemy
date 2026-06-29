import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// DEV-ONLY utility: applies a .sql file from supabase/migrations/ directly
// against the database using DATABASE_URL (added by the developer to
// .env.local — never read or echoed back by this route beyond a redacted
// host string for confirmation). Blocked outside development.
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development" || process.env.NEXT_PUBLIC_APP_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return NextResponse.json({ error: "DATABASE_URL not set in .env.local" }, { status: 400 });
  }

  try {
    const { file } = await req.json();
    if (!file || typeof file !== "string" || file.includes("..")) {
      return NextResponse.json({ error: "file required (filename only, no path traversal)" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "supabase", "migrations", file);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: `Migration file not found: ${file}` }, { status: 404 });
    }
    const sql = fs.readFileSync(filePath, "utf-8");

    const { Client } = await import("pg");
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    await client.connect();

    let host = "unknown";
    try { host = new URL(connectionString.replace("postgresql://", "https://").replace("postgres://", "https://")).hostname; } catch {}

    try {
      await client.query(sql);
      await client.end();
      return NextResponse.json({ ok: true, file, appliedAgainstHost: host });
    } catch (sqlErr) {
      await client.end();
      const message = sqlErr instanceof Error ? sqlErr.message : String(sqlErr);
      return NextResponse.json({ error: message, appliedAgainstHost: host }, { status: 500 });
    }
  } catch (err) {
    console.error("[dev/run-migration]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const SECRET = process.env.UPLOAD_ADMIN_SECRET || "tundemy-upload-2026";
const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY || "sk_V2_hgu_kB9HJ1woeyr_OUNu0KnUrmlN1HoLKTZ3XtbcMcjZc0ol";
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || "";
const BLOB_BASE = "https://llvjlae5fgboyqol.public.blob.vercel-storage.com";
const BLOB_API = "https://blob.vercel-storage.com";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-secret",
};

const SLUGS = [
  "ai-foundations",
  "prompt-engineering",
  "ai-data-analysis",
  "whatsapp-ai-integration",
  "mpesa-daraja-api",
  "ai-agriculture",
  "ai-evaluation-engineering",
  "rag-ai-engineering",
  "freelancing-with-ai",
  "selling-to-western-clients",
];

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function DELETE(req: NextRequest) {
  const auth = req.headers.get("x-admin-secret");
  if (auth !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS });
  }
  const params = new URL(req.url).searchParams;
  const action = params.get("action");
  const slug = params.get("slug");

  const blobHeaders = {
    Authorization: "Bearer " + BLOB_TOKEN,
    "Content-Type": "application/json",
  };

  if (action === "delete-all-lesson0s") {
    const urls = SLUGS.map((s) => BLOB_BASE + "/videos/" + s + "/lesson-0.mp4");
    const r = await fetch(BLOB_API, { method: "DELETE", headers: blobHeaders, body: JSON.stringify({ urls }) });
    const txt = await r.text();
    return NextResponse.json({ ok: r.ok, status: r.status, body: txt, deleted: urls.length }, { headers: CORS });
  }

  if (slug) {
    const url = BLOB_BASE + "/videos/" + slug + "/lesson-0.mp4";
    const r = await fetch(BLOB_API, { method: "DELETE", headers: blobHeaders, body: JSON.stringify({ urls: [url] }) });
    const txt = await r.text();
    return NextResponse.json({ ok: r.ok, status: r.status, body: txt, deleted: url }, { headers: CORS });
  }

  return NextResponse.json({ error: "Missing action or slug" }, { status: 400, headers: CORS });
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("x-admin-secret");
  if (auth !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS });
  }
  let body: { heygen_url?: string; video_id?: string; slug?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: CORS });
  }
  const { slug } = body;
  let { heygen_url } = body;
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400, headers: CORS });
  if (!heygen_url && body.video_id) {
    const videoId = body.video_id;
    const hr = await fetch("https://api.heygen.com/v1/video_status.get?video_id=" + videoId, {
      headers: { "X-Api-Key": HEYGEN_API_KEY },
    });
    const hj = await hr.json();
    if (!hr.ok || !hj?.data?.video_url)
      return NextResponse.json({ error: "HeyGen error: " + JSON.stringify(hj) }, { status: 502, headers: CORS });
    heygen_url = hj.data.video_url;
  }
  if (!heygen_url) return NextResponse.json({ error: "Missing heygen_url or video_id" }, { status: 400, headers: CORS });
  try {
    const vr = await fetch(heygen_url);
    if (!vr.ok) return NextResponse.json({ error: "HeyGen fetch failed: " + vr.status }, { status: 502, headers: CORS });
    const buf = await vr.arrayBuffer();
    const blob = await put("videos/" + slug + "/lesson-0.mp4", buf, { access: "public", contentType: "video/mp4", addRandomSuffix: false });
    return NextResponse.json({ url: blob.url, slug, size: buf.byteLength }, { headers: CORS });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500, headers: CORS });
  }
}

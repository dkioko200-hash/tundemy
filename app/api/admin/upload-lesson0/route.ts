import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const SECRET = process.env.UPLOAD_ADMIN_SECRET || "tundemy-upload-2026";
const HEYGEN_KEY = process.env.HEYGEN_API_KEY || "sk_V2_hgu_kB9HJ1woeyr_OUNu0KnUrmlN1HoLKTZ3XtbcMcjZc0ol";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-secret",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("x-admin-secret");
  if (auth !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
  }

  let body: { heygen_url?: string; video_id?: string; slug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: CORS_HEADERS });
  }

  const { slug } = body;
  let { heygen_url } = body;

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400, headers: CORS_HEADERS });
  }

  if (!heygen_url && body.video_id) {
    const hr = await fetch(
      "https://api.heygen.com/v1/video_status.get?video_id=" + body.video_id,
      { headers: { "X-Api-Key": HEYGEN_KEY } }
    );
    const hj = await hr.json() as { data?: { video_url?: string } };
    if (!hr.ok || !hj?.data?.video_url) {
      return NextResponse.json(
        { error: "HeyGen API error: " + JSON.stringify(hj) },
        { status: 502, headers: CORS_HEADERS }
      );
    }
    heygen_url = hj.data.video_url;
  }

  if (!heygen_url) {
    return NextResponse.json({ error: "Missing heygen_url or video_id" }, { status: 400, headers: CORS_HEADERS });
  }

  try {
    const videoResp = await fetch(heygen_url);
    if (!videoResp.ok) {
      return NextResponse.json(
        { error: "HeyGen fetch failed: " + videoResp.status },
        { status: 502, headers: CORS_HEADERS }
      );
    }

    const videoBuffer = await videoResp.arrayBuffer();

    const blob = await put("videos/" + slug + "/lesson-0.mp4", videoBuffer, {
      access: "public",
      contentType: "video/mp4",
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: blob.url, slug, size: videoBuffer.byteLength }, { headers: CORS_HEADERS });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500, headers: CORS_HEADERS });
  }
}

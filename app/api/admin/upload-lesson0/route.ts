import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const SECRET = process.env.UPLOAD_ADMIN_SECRET || "tundemy-upload-2026";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("x-admin-secret");
  if (auth !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { heygen_url?: string; slug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { heygen_url, slug } = body;
  if (!heygen_url || !slug) {
    return NextResponse.json({ error: "Missing heygen_url or slug" }, { status: 400 });
  }

  try {
    const videoResp = await fetch(heygen_url);
    if (!videoResp.ok) {
      return NextResponse.json(
        { error: `HeyGen fetch failed: ${videoResp.status}` },
        { status: 502 }
      );
    }

    const videoBuffer = await videoResp.arrayBuffer();

    const blob = await put(`videos/${slug}/lesson-0.mp4`, videoBuffer, {
      access: "public",
      contentType: "video/mp4",
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: blob.url, slug, size: videoBuffer.byteLength });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

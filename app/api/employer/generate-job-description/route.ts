import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  // Auth — must be logged-in employer
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.slice(7);
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: userData } = await supabase.auth.getUser(token);
  if (!userData?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { title: string; skills: string[]; jobType: string; experienceLevel: string; location: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, skills = [], jobType, experienceLevel, location } = body;
  if (!title) {
    return NextResponse.json({ error: "Job title is required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 });
  }

  const skillsText = skills.length > 0 ? `Required AI skills: ${skills.join(", ")}.` : "";
  const prompt = `Write a professional job description for the following role at an African/Kenyan company. Return only the job description text — no headers, no markdown, no extra commentary.

Job Title: ${title}
Job Type: ${jobType || "Full-time"}
Experience Level: ${experienceLevel || "Mid Level"}
Location: ${location || "Nairobi, Kenya"}
${skillsText}

The description should:
- Be 200-300 words
- Start with an engaging overview of the role
- Include 4-5 key responsibilities
- Include 4-5 requirements (mix of technical and soft skills)
- End with a brief "Why join us?" paragraph relevant to the African tech ecosystem
- Use inclusive, professional language
- Not include salary information`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Claude API error:", res.status, detail);
      return NextResponse.json({ error: "AI generation failed" }, { status: 502 });
    }

    const data = await res.json();
    const description: string = data?.content?.[0]?.text ?? "";
    return NextResponse.json({ description });
  } catch (err) {
    console.error("Generate job description error:", err);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}

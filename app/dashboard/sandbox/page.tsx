"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface RubricScore {
  criterion: string;
  score: number;
  max: number;
  comment: string;
}

interface Improvement {
  area: string;
  missing: string;
  whyMatters: string;
  betterExample: string;
}

interface Submission {
  id: string;
  course_slug: string;
  lesson_id: number | null;
  is_sandbox: boolean;
  prompt?: string;
  score?: number;
  passed?: boolean;
  submitted_at: string;
  feedback?: string;
  rubric_scores?: RubricScore[] | null;
  did_well?: string[];
  improvements?: Improvement[];
  specific_fixes?: string[];
}

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: "mock-1",
    course_slug: "prompt-engineering",
    lesson_id: 5,
    is_sandbox: true,
    prompt: "You are a senior marketing manager at a Nairobi fintech startup. Write a WhatsApp message to announce our new AI budgeting feature. Keep it under 160 characters.",
    score: 92,
    passed: true,
    submitted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    feedback: "Strong submission -- you correctly structured the role, constraint, and channel specificity with a clear Kenyan fintech context.",
    rubric_scores: [
      { criterion: "Depth and Completeness", score: 28, max: 30, comment: "Role and task fully specified with business context." },
      { criterion: "Specificity and Context", score: 27, max: 30, comment: "Kenyan fintech framing and character limit constraint are precise." },
      { criterion: "Structure and Clarity", score: 19, max: 20, comment: "Well-organised with clear persona, task, and constraint." },
      { criterion: "Actionability", score: 18, max: 20, comment: "Immediately usable with minor formatting suggestion." },
    ],
    did_well: [
      "Specified the role ('senior marketing manager') and company type ('Nairobi fintech') -- this grounds the output in a real business context.",
      "Hard constraint of 160 characters is specific and enforces a channel-appropriate output length for WhatsApp.",
    ],
    improvements: [
      {
        area: "Specificity and Context",
        missing: "The company name is generic ('a Nairobi fintech startup') -- Claude will invent a name, which may not match your brand.",
        whyMatters: "In Kenyan fintech (M-Pesa, Flutterwave, Pesapal), brand name recognition matters enormously for trust.",
        betterExample: "Specify: 'You are the marketing manager at Kopa Pesa, a Nairobi SACCO-focused savings app.'",
      },
    ],
    specific_fixes: [
      "Replace 'a Nairobi fintech startup' with your actual company name and a 1-sentence descriptor.",
      "Add 'Include one emoji' or 'Use no emojis' to control tone explicitly.",
      "Specify the call-to-action: 'End with a link to download the app' or 'Ask them to reply YES to learn more'.",
    ],
  },
  {
    id: "mock-2",
    course_slug: "intro-to-ai",
    lesson_id: 3,
    is_sandbox: true,
    prompt: "Explain AI hallucinations to a non-technical Kenyan CEO in one paragraph. Use a simple analogy they would relate to.",
    score: 78,
    passed: false,
    submitted_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    feedback: "Solid structure but the analogy instruction is vague -- 'a simple analogy they would relate to' leaves Claude to guess at Kenyan cultural context rather than anchoring it.",
    rubric_scores: [
      { criterion: "Depth and Completeness", score: 24, max: 30, comment: "Task and audience are clear but the analogy is underspecified." },
      { criterion: "Specificity and Context", score: 20, max: 30, comment: "No specific Kenyan analogy suggested; Claude may default to Western references." },
      { criterion: "Structure and Clarity", score: 18, max: 20, comment: "Clean one-paragraph constraint with clear audience." },
      { criterion: "Actionability", score: 16, max: 20, comment: "Usable but output quality will vary without a fixed analogy." },
    ],
    did_well: [
      "Audience specification ('non-technical Kenyan CEO') is excellent -- it sets both expertise level and cultural lens.",
      "Length constraint ('one paragraph') is appropriate for an executive briefing context.",
    ],
    improvements: [
      {
        area: "Specificity and Context",
        missing: "The analogy is completely open -- without direction, Claude will likely use a Western analogy rather than a Kenyan one.",
        whyMatters: "A Kenyan CEO will connect better with a matatu route analogy or a mobile money reference than an abstract Western tech example.",
        betterExample: "Add: 'Use an analogy involving M-Pesa, a matatu route, or a jua kali artisan to make it relatable to a Nairobi business leader.'",
      },
    ],
    specific_fixes: [
      "Name the specific analogy: 'Use a matatu conductor who gives the wrong change' or 'Use an M-Pesa agent who reads the account number incorrectly'.",
      "Add the CEO's industry: 'The CEO runs a logistics company in Mombasa' -- this lets Claude tailor the analogy further.",
      "Consider adding: 'After the analogy, add one sentence on how businesses can mitigate hallucinations.'",
    ],
  },
  {
    id: "mock-3",
    course_slug: "ai-for-business",
    lesson_id: 4,
    is_sandbox: true,
    prompt: "List 5 ways a mid-size Nairobi retail business could use AI to cut costs this year.",
    score: 65,
    passed: false,
    submitted_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    feedback: "The task is too open -- 'a mid-size Nairobi retail business' gives Claude almost no constraints, so outputs will be generic and unlikely to pass an 80-point specificity bar.",
    rubric_scores: [
      { criterion: "Depth and Completeness", score: 20, max: 30, comment: "Task is clear but lacks scope constraints." },
      { criterion: "Specificity and Context", score: 15, max: 30, comment: "Business is undefined -- no products, size range, or current pain points given." },
      { criterion: "Structure and Clarity", score: 16, max: 20, comment: "List format requested, which is good structure." },
      { criterion: "Actionability", score: 14, max: 20, comment: "Without specifics, the 5 items will be abstract rather than implementable." },
    ],
    did_well: [
      "Requesting a specific number (5 ways) prevents vague open-ended responses and makes evaluation easier.",
      "Nairobi retail context is a meaningful starting point for localisation.",
    ],
    improvements: [
      {
        area: "Specificity and Context",
        missing: "No product category, team size, or current operational pain point specified -- the output will default to generic suggestions.",
        whyMatters: "A mid-size grocery store in Westlands has completely different AI cost levers than a clothing boutique in Eastleigh.",
        betterExample: "Specify: 'a 12-staff grocery store in Westlands with KSh 2M monthly revenue, currently losing 15% to spoilage and manually reconciling M-Pesa payments.'",
      },
    ],
    specific_fixes: [
      "Add a concrete business description: product category, staff count, and monthly revenue range.",
      "Name the specific cost problem: 'focus on inventory spoilage' or 'focus on payroll and scheduling inefficiency'.",
      "Add output format: 'For each, name the AI tool or API, estimated cost, and one real Kenyan business that has done this.'",
    ],
  },
];

function scoreStyle(score?: number) {
  if (score === undefined) return { bg: "rgba(245,158,11,0.1)", text: "#92400e" };
  if (score >= 80) return { bg: "rgba(45,138,78,0.1)", text: "#166534" };
  if (score >= 50) return { bg: "rgba(245,158,11,0.1)", text: "#92400e" };
  return { bg: "rgba(187,0,0,0.08)", text: "#991b1b" };
}

function SandboxIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d8a4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ExpandedDetail({ s }: { s: Submission }) {
  return (
    <div className="mt-4 space-y-4 border-t pt-4" style={{ borderColor: "#e5e7eb" }}>
      {s.prompt && (
        <div>
          <p className="text-xs font-bold mb-1.5" style={{ color: "#0f1f3d" }}>Your Submission</p>
          <div className="rounded-xl p-3 font-mono text-xs text-gray-600 leading-relaxed" style={{ backgroundColor: "#f8fafc", border: "1px solid #e5e7eb" }}>
            {s.prompt}
          </div>
        </div>
      )}

      {s.feedback && (
        <div className="rounded-xl p-4" style={{ backgroundColor: s.passed ? "rgba(45,138,78,0.06)" : "rgba(245,158,11,0.06)", border: `1px solid ${s.passed ? "rgba(45,138,78,0.2)" : "rgba(245,158,11,0.2)"}` }}>
          <p className="text-xs font-bold mb-1" style={{ color: s.passed ? "#166534" : "#92400e" }}>
            {s.passed ? "Passed" : "Needs Improvement"} · {s.score}%
          </p>
          <p className="text-xs text-gray-700 leading-relaxed">{s.feedback}</p>
        </div>
      )}

      {s.rubric_scores && s.rubric_scores.length > 0 && (
        <div>
          <p className="text-xs font-bold mb-2" style={{ color: "#0f1f3d" }}>Score Breakdown</p>
          <div className="space-y-2">
            {s.rubric_scores.map((r) => (
              <div key={r.criterion}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs text-gray-600">{r.criterion}</span>
                  <span className="text-xs font-bold" style={{ color: r.score / r.max >= 0.8 ? "#2d8a4e" : r.score / r.max >= 0.6 ? "#92400e" : "#bb0000" }}>
                    {r.score}/{r.max}
                  </span>
                </div>
                <div className="w-full rounded-full h-1.5" style={{ backgroundColor: "#e5e7eb" }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${(r.score / r.max) * 100}%`, backgroundColor: r.score / r.max >= 0.8 ? "#2d8a4e" : r.score / r.max >= 0.6 ? "#f59e0b" : "#bb0000" }} />
                </div>
                {r.comment && <p className="text-xs text-gray-400 mt-0.5">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {s.did_well && s.did_well.length > 0 && (
        <div>
          <p className="text-xs font-bold mb-2" style={{ color: "#0f1f3d" }}>What Went Well</p>
          <div className="space-y-2">
            {s.did_well.map((item, i) => (
              <div key={i} className="flex gap-2">
                <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 text-white text-xs font-bold" style={{ backgroundColor: "#2d8a4e" }}>+</span>
                <p className="text-xs text-gray-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {s.improvements && s.improvements.length > 0 && (
        <div>
          <p className="text-xs font-bold mb-2" style={{ color: "#0f1f3d" }}>Areas to Improve</p>
          <div className="space-y-3">
            {s.improvements.map((imp, i) => (
              <div key={i} className="rounded-xl p-3 space-y-1.5" style={{ backgroundColor: "rgba(187,0,0,0.03)", border: "1px solid rgba(187,0,0,0.12)" }}>
                <p className="text-xs font-bold" style={{ color: "#991b1b" }}>{imp.area}</p>
                <p className="text-xs text-gray-700"><span className="font-semibold">What&apos;s missing:</span> {imp.missing}</p>
                <p className="text-xs text-gray-700"><span className="font-semibold">Why it matters:</span> {imp.whyMatters}</p>
                <p className="text-xs text-gray-700"><span className="font-semibold">Better example:</span> {imp.betterExample}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {s.specific_fixes && s.specific_fixes.length > 0 && (
        <div>
          <p className="text-xs font-bold mb-2" style={{ color: "#0f1f3d" }}>Specific Fixes</p>
          <div className="space-y-1.5">
            {s.specific_fixes.map((fix, i) => (
              <div key={i} className="flex gap-2">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <p className="text-xs text-gray-700 leading-relaxed">{fix}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SandboxPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login?next=/dashboard/sandbox"); return; }

      try {
        const res = await fetch("/api/sandbox/submissions");
        if (res.ok) {
          const data = (await res.json()) as Submission[];
          setSubmissions(data.length > 0 ? data : MOCK_SUBMISSIONS);
        } else {
          setSubmissions(MOCK_SUBMISSIONS);
        }
      } catch {
        setSubmissions(MOCK_SUBMISSIONS);
      }

      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-[3px] animate-spin" style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const avg = submissions.length > 0
    ? Math.round(submissions.reduce((s, x) => s + (x.score ?? 70), 0) / submissions.length)
    : 0;

  return (
    <div className="p-5 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>Sandbox</h1>
        <p className="text-sm text-gray-500 mt-1">Your prompt submissions and AI interaction history</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Submissions", value: submissions.length },
          { label: "Avg Score", value: `${avg}%` },
          { label: "Best Score", value: submissions.length > 0 ? `${Math.max(...submissions.map((s) => s.score ?? 70))}%` : "--" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border bg-white p-4 text-center" style={{ borderColor: "#e5e7eb" }}>
            <p className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold" style={{ color: "#0f1f3d" }}>Recent Submissions</h2>
        {submissions.map((s) => {
          const style = scoreStyle(s.score);
          const date = new Date(s.submitted_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
          const isOpen = expandedId === s.id;
          const label = s.lesson_id
            ? `${s.course_slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} -- Lesson ${s.lesson_id}`
            : s.course_slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

          return (
            <div
              key={s.id}
              className="rounded-2xl border bg-white overflow-hidden"
              style={{ borderColor: isOpen ? "#2d8a4e" : "#e5e7eb", transition: "border-color 0.15s ease" }}
            >
              <button
                className="w-full text-left p-5 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(isOpen ? null : s.id)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <SandboxIcon />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "#0f1f3d" }}>{label}</p>
                    <p className="text-xs text-gray-400">{date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {s.score !== undefined && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: style.bg, color: style.text }}>
                      {s.score}%
                    </span>
                  )}
                  <span style={{ color: "#9ca3af" }}>
                    <ChevronIcon open={isOpen} />
                  </span>
                </div>
              </button>

              {s.prompt && !isOpen && (
                <div className="px-5 pb-4">
                  <div className="rounded-xl p-3 font-mono text-xs text-gray-600 leading-relaxed" style={{ backgroundColor: "#f8fafc", border: "1px solid #e5e7eb" }}>
                    {s.prompt.length > 200 ? s.prompt.slice(0, 200) + "..." : s.prompt}
                  </div>
                </div>
              )}

              {isOpen && (
                <div className="px-5 pb-5">
                  <ExpandedDetail s={s} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { getAssessmentTrack } from "@/lib/assessment-tracks";

type AssessmentState = "intro" | "writing" | "grading" | "result";

interface GradeResult {
  overallScore: number;
  passed: boolean;
  dimensionScores: Record<string, number>;
  feedback: string;
  cached?: boolean;
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export default function AssessmentPage() {
  const params = useParams();
  const track = (params?.track as string) ?? "";
  const meta = getAssessmentTrack(track);

  const [state, setState] = useState<AssessmentState>("intro");
  const [submission, setSubmission] = useState("");
  const [secondsLeft, setSecondsLeft] = useState((meta?.durationMinutes ?? 45) * 60);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const wordCount = countWords(submission);
  const minWords = meta?.minWords ?? 200;
  const maxWords = meta?.maxWords ?? 800;
  const canSubmit = wordCount >= minWords && wordCount <= maxWords;

  const handleSubmit = useCallback(async () => {
    if (!meta || submittingRef.current) return;
    submittingRef.current = true;
    setError(null);
    setState("grading");

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("You must be signed in to submit an assessment.");
        setState("writing");
        submittingRef.current = false;
        return;
      }

      const res = await fetch("/api/grade-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track, submission }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Grading failed");

      const graded = data as GradeResult;
      setResult(graded);

      if (graded.passed && graded.overallScore >= meta.passingScore) {
        await supabase.from("assessments").upsert({
          user_id: session.user.id,
          track,
          score: graded.overallScore,
          passed: true,
          feedback: graded,
          taken_at: new Date().toISOString(),
        }, { onConflict: "user_id,track" });

        await supabase.from("user_badges").upsert({
          user_id: session.user.id,
          badge_name: meta.badge,
          earned_at: new Date().toISOString(),
        }, { onConflict: "user_id,badge_name" });

        const fullName = session.user.user_metadata?.full_name ?? session.user.email?.split("@")[0] ?? "Tundemy Graduate";
        await supabase.from("talent_profiles").upsert({
          user_id: session.user.id,
          full_name: fullName,
          track: meta.label,
          is_visible: true,
        }, { onConflict: "user_id" });
      } else {
        await supabase.from("assessments").upsert({
          user_id: session.user.id,
          track,
          score: graded.overallScore,
          passed: false,
          feedback: graded,
          taken_at: new Date().toISOString(),
        }, { onConflict: "user_id,track" });
      }

      setState("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while grading. Please try again.");
      setState("writing");
    } finally {
      submittingRef.current = false;
    }
  }, [meta, track, submission]);

  // 45-minute countdown
  useEffect(() => {
    if (state !== "writing") return;
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [state, secondsLeft, handleSubmit]);

  if (!meta) {
    return (
      <div style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", backgroundColor: "#f9fafb" }} className="flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="font-bold" style={{ color: "#0f1f3d" }}>Assessment not found</p>
          <Link href="/" className="text-sm text-green-700 underline mt-2 block">Back to home</Link>
        </div>
      </div>
    );
  }

  const Nav = () => (
    <nav className="bg-white border-b sticky top-0 z-10" style={{ borderColor: "#e5e7eb" }}>
      <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex flex-col w-1 h-5 rounded-sm overflow-hidden">
            <div className="flex-1 bg-black" />
            <div className="flex-1 bg-[#bb0000]" />
            <div className="flex-1 bg-[#2d8a4e]" />
          </div>
          <span className="text-base font-bold" style={{ color: "#0f1f3d" }}>Tund<span style={{ color: "#2d8a4e" }}>emy</span></span>
        </Link>
        {state === "writing" && (
          <span
            className="text-sm font-bold px-3 py-1 rounded-full"
            style={{
              backgroundColor: secondsLeft <= 300 ? "rgba(187,0,0,0.08)" : "rgba(15,31,61,0.06)",
              color: secondsLeft <= 300 ? "#bb0000" : "#0f1f3d",
            }}
          >
            ⏱ {formatTime(secondsLeft)}
          </span>
        )}
      </div>
    </nav>
  );

  if (state === "intro") {
    return (
      <div style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
        <Nav />
        <div className="max-w-2xl mx-auto px-5 py-12">
          <div className="bg-white rounded-2xl border p-8" style={{ borderColor: "#e5e7eb" }}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: `${meta.color}15`, color: meta.color }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block"
                style={{ backgroundColor: `${meta.color}12`, color: meta.color }}>
                {meta.label}
              </span>
              <h1 className="text-2xl font-extrabold mt-3 mb-2" style={{ color: "#0f1f3d" }}>
                {meta.label} Certification
              </h1>
              <p className="text-sm text-gray-500 mb-8">
                Pass with a score of {meta.passingScore}% or above to earn your {meta.badge} and appear in the verified talent pool.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8 text-center">
              {[
                { label: "Time Limit", value: `${meta.durationMinutes} min` },
                { label: "Word Count", value: `${meta.minWords}-${meta.maxWords}` },
                { label: "Passing Score", value: `${meta.passingScore}%` },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border p-3" style={{ borderColor: "#f3f4f6" }}>
                  <p className="text-lg font-extrabold" style={{ color: "#0f1f3d" }}>{value}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border p-5 mb-8" style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}>
              <p className="text-xs font-bold mb-2" style={{ color: meta.color }}>Practical Task</p>
              <p className="text-sm leading-relaxed" style={{ color: "#0f1f3d" }}>{meta.task}</p>
            </div>

            <button onClick={() => setState("writing")}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: meta.color }}>
              Start Assessment →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === "writing" || state === "grading") {
    return (
      <div style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
        <Nav />
        <div className="max-w-2xl mx-auto px-5 py-10">
          <div className="bg-white rounded-2xl border p-6 sm:p-8" style={{ borderColor: "#e5e7eb" }}>
            <p className="text-xs font-bold mb-2" style={{ color: meta.color }}>Practical Task</p>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "#0f1f3d" }}>{meta.task}</p>

            <textarea
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              disabled={state === "grading"}
              placeholder="Write your response here…"
              rows={16}
              className="w-full p-4 rounded-xl border text-sm leading-relaxed outline-none focus:ring-2 focus:ring-green-200 transition-all resize-y disabled:opacity-60"
              style={{ borderColor: "#e5e7eb", color: "#0f1f3d" }}
            />

            <div className="flex items-center justify-between mt-3">
              <p className="text-xs font-semibold" style={{ color: wordCount > maxWords ? "#bb0000" : wordCount < minWords ? "#9ca3af" : "#2d8a4e" }}>
                {wordCount} / {minWords}-{maxWords} words
              </p>
              {wordCount > maxWords && (
                <p className="text-xs font-semibold" style={{ color: "#bb0000" }}>Over the limit — trim your response</p>
              )}
              {wordCount < minWords && (
                <p className="text-xs text-gray-400">Minimum {minWords} words required</p>
              )}
            </div>

            {error && (
              <p className="text-xs font-semibold mt-3" style={{ color: "#bb0000" }}>{error}</p>
            )}

            <button onClick={handleSubmit}
              disabled={!canSubmit || state === "grading"}
              className="w-full mt-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: !canSubmit || state === "grading" ? "#9ca3af" : meta.color }}>
              {state === "grading" ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(255,255,255,0.4)", borderTopColor: "#fff" }} />
                  Grading your submission…
                </>
              ) : (
                "Submit Assessment"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // result state
  const passed = !!result?.passed && (result?.overallScore ?? 0) >= meta.passingScore;

  return (
    <div style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Nav />
      <div className="max-w-2xl mx-auto px-5 py-12">
        <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: "#e5e7eb" }}>
          <div className="text-5xl mb-4">{passed ? "🏆" : "📚"}</div>
          <h1 className="text-2xl font-extrabold mb-2" style={{ color: "#0f1f3d" }}>
            {passed ? "Assessment Passed!" : "Not Quite Yet"}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {passed
              ? `You scored ${result?.overallScore}% — your ${meta.badge} has been awarded and you're now in the verified talent pool.`
              : `You scored ${result?.overallScore ?? 0}%. You need ${meta.passingScore}% to pass. Review the course material and try again.`}
          </p>

          <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center mx-auto mb-6"
            style={{ borderColor: passed ? "#2d8a4e" : "#e5e7eb" }}>
            <div>
              <p className="text-2xl font-extrabold" style={{ color: passed ? "#2d8a4e" : "#6b7280" }}>{result?.overallScore ?? 0}%</p>
            </div>
          </div>

          {result?.feedback && (
            <div className="rounded-xl border p-4 mb-6 text-left" style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}>
              <p className="text-xs font-bold mb-1" style={{ color: "#0f1f3d" }}>Feedback</p>
              <p className="text-sm text-gray-600 leading-relaxed">{result.feedback}</p>
            </div>
          )}

          {result?.dimensionScores && (
            <div className="grid grid-cols-2 gap-3 mb-6 text-left">
              {Object.entries(result.dimensionScores).map(([key, score]) => (
                <div key={key} className="rounded-xl border p-3" style={{ borderColor: "#f3f4f6" }}>
                  <p className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                  <p className="text-sm font-extrabold" style={{ color: "#0f1f3d" }}>{score}%</p>
                </div>
              ))}
            </div>
          )}

          {passed && (
            <div className="rounded-xl border p-4 mb-6" style={{ borderColor: "rgba(45,138,78,0.2)", backgroundColor: "rgba(45,138,78,0.04)" }}>
              <p className="text-xs font-bold mb-1" style={{ color: "#2d8a4e" }}>✓ Badge Awarded</p>
              <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>{meta.badge}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard"
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white text-center transition-all hover:opacity-90"
              style={{ backgroundColor: "#2d8a4e" }}>
              Go to Dashboard
            </Link>
            {!passed && (
              <button onClick={() => { setState("intro"); setSubmission(""); setSecondsLeft(meta.durationMinutes * 60); setResult(null); }}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-center border-2 transition-all hover:bg-gray-50"
                style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

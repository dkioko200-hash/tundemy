"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { getCourseContentBySlug, type Lesson, type QuizQuestion, type LessonTheory, type CourseCapstone } from "@/lib/course-content";
import { WhatsAppSimulatorSandbox } from "@/components/simulators/WhatsAppSimulator";
import { DarajaSimulatorSandbox } from "@/components/simulators/DarajaSimulator";
import { PythonRunnerSandbox } from "@/components/simulators/PythonRunner";
import { createClient } from "@/lib/supabase";

// ── Icons ─────────────────────────────────────────────────────────────────────

function VideoIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}
function ReadingIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
function QuizIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function SandboxIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
function ProjectIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
    </svg>
  );
}
function IntroIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function CheckIcon({ size = 14, color = "#2d8a4e" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function LockIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ── Quiz randomization ────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function randomizeQuestions(questions: QuizQuestion[], maxCount = 10): QuizQuestion[] {
  const shuffled = shuffleArray(questions);
  const selected = shuffled.slice(0, Math.min(maxCount, shuffled.length));
  return selected.map((q) => {
    const correctOption = q.options[q.correctAnswer];
    const shuffledOpts = shuffleArray([...q.options]);
    const newIdx = shuffledOpts.indexOf(correctOption);
    return {
      ...q,
      options: shuffledOpts as [string, string, string, string],
      correctAnswer: newIdx as 0 | 1 | 2 | 3,
    };
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function lessonTypeColor(type: Lesson["type"]): string {
  switch (type) {
    case "video":   return "#6366f1";
    case "reading": return "#0ea5e9";
    case "quiz":    return "#d97706";
    case "sandbox": return "#2d8a4e";
    case "project": return "#9333ea";
    case "intro":   return "#f59e0b";
  }
}

function lessonTypeLabel(type: Lesson["type"]): string {
  switch (type) {
    case "video":   return "Video Lesson";
    case "reading": return "Reading";
    case "quiz":    return "Quiz";
    case "sandbox": return "Sandbox Exercise";
    case "project": return "Project";
    case "intro":   return "Course Introduction";
  }
}

function LessonIcon({ type, size = 13, color = "currentColor" }: { type: Lesson["type"]; size?: number; color?: string }) {
  switch (type) {
    case "video":   return <VideoIcon size={size} color={color} />;
    case "reading": return <ReadingIcon size={size} color={color} />;
    case "quiz":    return <QuizIcon size={size} color={color} />;
    case "sandbox": return <SandboxIcon size={size} color={color} />;
    case "project": return <ProjectIcon size={size} color={color} />;
    case "intro":   return <IntroIcon size={size} color={color} />;
  }
}

// ── Circular progress ─────────────────────────────────────────────────────────

function CircularProgress({ completed, total }: { completed: number; total: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const pct = total === 0 ? 0 : completed / total;
  const offset = circumference - pct * circumference;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={radius} stroke="#e5e7eb" strokeWidth="8" fill="none" />
        <circle
          cx="44" cy="44" r={radius}
          stroke="#2d8a4e" strokeWidth="8" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 44 44)"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
        <text x="44" y="44" textAnchor="middle" dominantBaseline="central" fill="#0f1f3d" fontSize="16" fontWeight="700">
          {Math.round(pct * 100)}%
        </text>
      </svg>
      <p className="text-xs text-gray-500 text-center">{completed} of {total} lessons complete</p>
    </div>
  );
}

// ── Video player ──────────────────────────────────────────────────────────────

function VideoPlayer({ title, duration_mins, videoUrl, onWatched }: { title: string; duration_mins: number; videoUrl?: string; onWatched?: () => void }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div>
      <div
        className="w-full rounded-2xl overflow-hidden relative"
        style={{ aspectRatio: "16/9" }}
      >
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover"
            onEnded={onWatched}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center cursor-pointer select-none"
            style={{ backgroundColor: "#0f1f3d" }}
            onClick={() => setPlaying((p) => !p)}
          >
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 25% 35%, rgba(255,255,255,0.06) 0%, transparent 55%), radial-gradient(circle at 75% 70%, rgba(45,138,78,0.12) 0%, transparent 50%)" }} />
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95" style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}>
              {playing ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ marginLeft: "2px" }}>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </div>
            <div className="absolute bottom-4 left-5 right-5">
              <p className="text-white/80 text-sm font-medium truncate">{title}</p>
              {playing && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-white/20"><div className="h-1 rounded-full bg-white/60 w-[30%]" /></div>
                  <span className="text-white/50 text-xs">3:18 / {duration_mins}:00</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-2.5 flex items-center gap-1.5">
        <VideoIcon color="#9ca3af" />
        Video lesson · {duration_mins} mins
      </p>
    </div>
  );
}

// ── Reading ───────────────────────────────────────────────────────────────────

function ReadingComponent({ content, readingTopics, duration_mins }: {
  content: string;
  readingTopics?: string[];
  duration_mins: number;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-6 bg-white" style={{ borderColor: "#e5e7eb" }}>
        <div className="flex items-center gap-2 mb-4">
          <ReadingIcon color="#0ea5e9" size={16} />
          <span className="text-xs font-bold text-sky-600">Reading · {duration_mins} mins</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-5">{content}</p>
        {readingTopics && readingTopics.length > 0 && (
          <div>
            <p className="text-xs font-bold mb-3" style={{ color: "#0f1f3d" }}>Topics covered in this reading:</p>
            <ul className="space-y-2">
              {readingTopics.map((topic, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckIcon size={14} />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Quiz ──────────────────────────────────────────────────────────────────────

function QuizComponent({ quizQuestions, onComplete, onFail }: {
  quizQuestions: QuizQuestion[];
  onComplete: () => void;
  onFail: () => void;
}) {
  // Randomize once on mount (key prop in parent forces remount on retry)
  const [activeQuestions] = useState(() => randomizeQuestions(quizQuestions));
  const [answers, setAnswers] = useState<(number | null)[]>(activeQuestions.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const score = answers.filter((a, i) => a === activeQuestions[i]?.correctAnswer).length;
  const pct = activeQuestions.length > 0 ? Math.round((score / activeQuestions.length) * 100) : 0;
  const passed = pct >= 80;

  return (
    <div className="space-y-5">
      {activeQuestions.map((q, qi) => {
        const selected = answers[qi];
        const isCorrect = submitted && selected === q.correctAnswer;
        const isWrong = submitted && selected !== null && selected !== q.correctAnswer;
        return (
          <div key={qi} className="rounded-2xl border p-5" style={{ borderColor: submitted ? isCorrect ? "rgba(45,138,78,0.3)" : isWrong ? "rgba(187,0,0,0.25)" : "#e5e7eb" : "#e5e7eb", backgroundColor: submitted ? isCorrect ? "rgba(45,138,78,0.04)" : isWrong ? "rgba(187,0,0,0.03)" : "#fff" : "#fff" }}>
            <p className="text-sm font-semibold mb-4" style={{ color: "#0f1f3d" }}>{qi + 1}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isSelected = selected === oi;
                const showCorrect = submitted && oi === q.correctAnswer;
                const showWrong = submitted && isSelected && oi !== q.correctAnswer;
                return (
                  <button key={oi} disabled={submitted} onClick={() => { const next = [...answers]; next[qi] = oi; setAnswers(next); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left text-sm transition-all"
                    style={{ borderColor: showCorrect ? "#2d8a4e" : showWrong ? "#bb0000" : isSelected ? "#0f1f3d" : "#e5e7eb", backgroundColor: showCorrect ? "rgba(45,138,78,0.08)" : showWrong ? "rgba(187,0,0,0.06)" : isSelected ? "rgba(15,31,61,0.05)" : "#fff", color: showCorrect ? "#166534" : showWrong ? "#991b1b" : "#374151" }}>
                    <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ borderColor: showCorrect ? "#2d8a4e" : showWrong ? "#bb0000" : isSelected ? "#0f1f3d" : "#d1d5db", backgroundColor: isSelected || showCorrect || showWrong ? showCorrect ? "#2d8a4e" : showWrong ? "#bb0000" : "#0f1f3d" : "transparent", color: isSelected || showCorrect || showWrong ? "#fff" : "#9ca3af" }}>
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {showCorrect && <CheckIcon size={14} />}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {!submitted ? (
        <button disabled={!allAnswered} onClick={() => setSubmitted(true)}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#2d8a4e" }}>
          Submit Quiz
        </button>
      ) : (
        <div className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
          style={{ backgroundColor: passed ? "rgba(45,138,78,0.07)" : "rgba(187,0,0,0.05)", border: `1px solid ${passed ? "rgba(45,138,78,0.25)" : "rgba(187,0,0,0.2)"}` }}>
          <div className="flex-1">
            <p className="font-bold text-sm" style={{ color: passed ? "#166534" : "#991b1b" }}>
              {passed ? "Quiz passed! Well done." : "You need 80% or above to continue. Try again with new questions."}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{score} / {activeQuestions.length} correct · {pct}%{!passed && " (need 80% to pass)"}</p>
          </div>
          {passed ? (
            <button onClick={onComplete} className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ backgroundColor: "#2d8a4e" }}>Continue →</button>
          ) : (
            <button onClick={onFail} className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all hover:bg-gray-50" style={{ borderColor: "#bb0000", color: "#bb0000" }}>New Questions</button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Sandbox ───────────────────────────────────────────────────────────────────

// ── Sandbox + Project ─────────────────────────────────────────────────────────

interface SandboxImprovement {
  area: string;
  missing: string;
  whyMatters: string;
  betterExample: string;
}

interface SandboxGradingResult {
  score: number;
  passed: boolean;
  feedback: string;
  rubricScores: { criterion: string; score: number; max: number; comment: string }[];
  cached?: boolean;
  didWell?: string[];
  improvements?: SandboxImprovement[];
  specificFixes?: string[];
}

interface ParsedTask {
  id: number;
  label: string;
  body: string;
}

function parseTasks(sandboxTask: string): ParsedTask[] {
  // Split text by heading positions; returns null if fewer than 2 headings found
  function splitByHeadings(
    text: string,
    re: RegExp,
    labelFn: (id: number, heading: string) => string
  ): ParsedTask[] | null {
    const positions: { matchStart: number; bodyStart: number; id: number; heading: string }[] = [];
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(text)) !== null) {
      positions.push({
        matchStart: m.index,
        bodyStart: m.index + m[0].length,
        id: parseInt(m[1] ?? "1"),
        heading: (m[2] ?? "").trim(),
      });
    }
    if (positions.length < 2) return null;
    return positions.map((pos, i) => {
      const bodyEnd = i + 1 < positions.length ? positions[i + 1].matchStart : text.length;
      const bodyText = text.slice(pos.bodyStart, bodyEnd).trim();
      const displayBody =
        pos.heading && bodyText ? `${pos.heading}\n\n${bodyText}` : pos.heading || bodyText;
      return { id: pos.id, label: labelFn(pos.id, pos.heading), body: displayBody };
    });
  }

  // 1. TASK N — / TASK N:
  const taskResult = splitByHeadings(
    sandboxTask,
    /(?:^|\n)TASK\s+(\d+)\s*[^\S\n]*[—\-:]+\s*([^\n]*)/gi,
    (id) => `Task ${id}`
  );
  if (taskResult) return taskResult;

  // 2. SECTION N — / SECTION N:
  const sectionResult = splitByHeadings(
    sandboxTask,
    /(?:^|\n)SECTION\s+(\d+)\s*[^\S\n]*[—\-:]+\s*([^\n]*)/gi,
    (id, heading) => {
      const title = heading.replace(/:$/, "").split(":")[0].trim();
      return title ? `Section ${id}: ${title}` : `Section ${id}`;
    }
  );
  if (sectionResult) return sectionResult;

  // 3. DELIVERABLE N — / DELIVERABLE N:
  const delivResult = splitByHeadings(
    sandboxTask,
    /(?:^|\n)DELIVERABLE\s+(\d+)\s*[^\S\n]*[—\-:]+\s*([^\n]*)/gi,
    (id, heading) => {
      const title = heading.replace(/:$/, "").split(":")[0].trim();
      return title ? `Deliverable ${id}: ${title}` : `Deliverable ${id}`;
    }
  );
  if (delivResult) return delivResult;

  // 4. Inline (1) (2) (3) numbering — captures text until next (N) or end
  const parenRe = /\((\d+)\)\s*([\s\S]*?)(?=\s*\(\d+\)|$)/g;
  const parenMatches = [...sandboxTask.matchAll(parenRe)];
  if (parenMatches.length >= 2) {
    const tasks = parenMatches.map((pm) => ({
      id: parseInt(pm[1]),
      label: `Task ${pm[1]}`,
      body: pm[2].trim().replace(/,\s*$/, "").trim(),
    }));
    if (tasks.filter((t) => t.body.length > 10).length >= 2) return tasks;
  }

  // Single task fallback
  return [{ id: 1, label: "Your Response", body: sandboxTask }];
}

function GradingResultDisplay({
  result,
  onRetry,
  onNext,
}: {
  result: SandboxGradingResult;
  onRetry?: () => void;
  onNext?: () => void;
}) {
  const score = result.score;
  const passed = result.passed ?? score >= 80;

  return (
    <div className="space-y-4">

      {/* ── Score hero ─────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 text-center border-2"
        style={
          passed
            ? { backgroundColor: "rgba(45,138,78,0.06)", borderColor: "#2d8a4e" }
            : { backgroundColor: "rgba(187,0,0,0.04)", borderColor: "#e5383b" }
        }
      >
        <div
          className="text-6xl font-black"
          style={{ color: passed ? "#2d8a4e" : "#e5383b" }}
        >
          {score}
        </div>
        <div className="text-gray-400 text-sm mt-1">out of 100</div>
        <div
          className="mt-3 font-bold text-sm"
          style={{ color: passed ? "#2d8a4e" : "#e5383b" }}
        >
          {passed ? "Passed — great work!" : "Score 80+ to continue"}
        </div>
        {result.cached && (
          <div className="text-xs text-gray-400 mt-1">Cached result</div>
        )}
      </div>

      {/* ── Overall verdict ─────────────────────────────────────── */}
      {result.feedback && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Overall</p>
          <p className="text-sm text-gray-700 leading-relaxed">{result.feedback}</p>
        </div>
      )}

      {/* ── What you did well (always show) ─────────────────────── */}
      {result.didWell && result.didWell.length > 0 && (
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: "rgba(45,138,78,0.06)", border: "1px solid rgba(45,138,78,0.2)" }}
        >
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#2d8a4e" }}>
            What You Did Well
          </p>
          <ul className="space-y-2">
            {result.didWell.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 text-xs font-bold flex-shrink-0" style={{ color: "#2d8a4e" }}>✓</span>
                <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── What needs improvement (only on fail) ─────────────── */}
      {!passed && result.improvements && result.improvements.length > 0 && (
        <div className="rounded-xl p-4 border border-orange-200" style={{ backgroundColor: "rgba(251,146,60,0.05)" }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-3 text-orange-600">
            What Needs Improvement
          </p>
          <div className="space-y-4">
            {result.improvements.map((imp, i) => (
              <div key={i} className="border-l-2 border-orange-300 pl-3">
                <p className="text-xs font-bold text-orange-700 mb-1">{imp.area}</p>
                <p className="text-sm text-gray-800 mb-1.5">
                  <span className="font-semibold">What was missing: </span>
                  {imp.missing}
                </p>
                <p className="text-sm text-gray-600 mb-1.5">
                  <span className="font-semibold">Why it matters: </span>
                  {imp.whyMatters}
                </p>
                <div
                  className="rounded-lg p-3 mt-2"
                  style={{ backgroundColor: "rgba(15,31,61,0.04)", border: "1px solid rgba(15,31,61,0.08)" }}
                >
                  <p className="text-xs font-bold text-gray-500 mb-1">A stronger answer looks like:</p>
                  <p className="text-sm text-gray-700 leading-relaxed italic">{imp.betterExample}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Specific fixes (only on fail) ───────────────────────── */}
      {!passed && result.specificFixes && result.specificFixes.length > 0 && (
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: "rgba(15,31,61,0.04)", border: "1px solid rgba(15,31,61,0.1)" }}
        >
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#0f1f3d" }}>
            Fix These Before Resubmitting
          </p>
          <ol className="space-y-2">
            {result.specificFixes.map((fix, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: "#0f1f3d" }}
                >
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700 leading-relaxed">{fix}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ── Rubric breakdown (always show) ──────────────────────── */}
      {result.rubricScores && result.rubricScores.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Score Breakdown</p>
          <div className="space-y-3">
            {result.rubricScores.map((r, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-gray-700">{r.criterion}</span>
                  <span className="text-xs font-bold" style={{ color: "#0f1f3d" }}>
                    {r.score}/{r.max}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(r.score / r.max) * 100}%`,
                      backgroundColor:
                        r.score >= r.max * 0.8 ? "#2d8a4e" : r.score >= r.max * 0.5 ? "#f97316" : "#e5383b",
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Action buttons ───────────────────────────────────────── */}
      <div className="flex gap-3">
        {passed && onNext && (
          <button
            onClick={onNext}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all"
            style={{ backgroundColor: "#2d8a4e" }}
          >
            Next Lesson →
          </button>
        )}
        {!passed && onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 py-3 rounded-xl text-sm font-bold border-2 hover:bg-gray-50 transition-colors"
            style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}
          >
            Revise and Resubmit
          </button>
        )}
      </div>
    </div>
  );
}

// Shared spinner SVG
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// Shared submit logic for both sandbox and project
async function submitForGrading(opts: {
  courseSlug: string;
  lessonNumber: number;
  sandboxTask: string;
  tasks: ParsedTask[];
  answers: string[];
}): Promise<SandboxGradingResult> {
  const combined = opts.tasks
    .map((t, i) => `Task ${t.id}:\n${opts.answers[i]}`)
    .join("\n\n---\n\n");
  const res = await fetch("/api/grade-sandbox", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      courseSlug: opts.courseSlug,
      lessonNumber: opts.lessonNumber,
      sandboxTask: opts.sandboxTask,
      submission: combined,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error || "Grading failed");
  return data as SandboxGradingResult;
}

// Shared per-task cards (used by both SandboxComponent and ProjectComponent)
function TaskCards({
  tasks,
  answers,
  wordCounts,
  isMulti,
  onChange,
  accentColor = "#2d8a4e",
}: {
  tasks: ParsedTask[];
  answers: string[];
  wordCounts: number[];
  isMulti: boolean;
  onChange: (i: number, value: string) => void;
  accentColor?: string;
}) {
  return (
    <>
      {tasks.map((task, i) => (
        <div key={task.id} className="space-y-3">
          {/* Green task label — only shown for multi-task lessons */}
          {isMulti && (
            <p className="text-sm font-semibold" style={{ color: accentColor }}>
              {task.label}
            </p>
          )}
          {/* Navy task description box for each task */}
          <div className="bg-[#0f1f3d] rounded-xl p-5">
            {!isMulti && (
              <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">Your Task</p>
            )}
            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{task.body}</p>
          </div>
          {/* Answer textarea */}
          <textarea
            value={answers[i]}
            onChange={(e) => onChange(i, e.target.value)}
            placeholder="Write your response here. Be specific — generic answers score low."
            rows={isMulti ? 7 : 10}
            className="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ ["--tw-ring-color" as string]: accentColor }}
            onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
          />
          {/* Per-task word count */}
          <p className={`text-xs font-medium ${wordCounts[i] >= 40 ? "" : "text-gray-400"}`}
            style={wordCounts[i] >= 40 ? { color: accentColor } : undefined}>
            {wordCounts[i]} words {wordCounts[i] >= 40 ? "✓" : "(min 40)"}
          </p>
        </div>
      ))}
    </>
  );
}

function SandboxComponent({ sandboxTask, lessonNumber, courseSlug, onComplete }: {
  sandboxTask: string;
  lessonNumber: number;
  courseSlug: string;
  onComplete: () => void;
}) {
  const tasks = parseTasks(sandboxTask);
  const isMulti = tasks.length > 1;
  const [answers, setAnswers] = useState<string[]>(() => tasks.map(() => ""));
  const [result, setResult] = useState<SandboxGradingResult | null>(null);
  const [grading, setGrading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [howOpen, setHowOpen] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  const wordCounts = answers.map((a) => a.trim().split(/\s+/).filter(Boolean).length);
  const totalWords = wordCounts.reduce((s, c) => s + c, 0);
  const allMeetMin = wordCounts.every((wc) => wc >= 40);
  const hasContent = answers.every((a) => a.trim().length > 0);
  const canSubmit = hasContent && allMeetMin && confirmed;

  const handleSubmit = async () => {
    if (grading) return;
    setGrading(true);
    setApiError(null);
    try {
      const data = await submitForGrading({ courseSlug, lessonNumber, sandboxTask, tasks, answers });
      setResult(data);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Grading failed. Please try again.");
    } finally {
      setGrading(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setAnswers(tasks.map(() => ""));
    setApiError(null);
    setConfirmed(false);
    setHowOpen(true);
  };

  const handleChange = (i: number, value: string) => {
    const next = [...answers]; next[i] = value; setAnswers(next);
  };

  if (result) {
    return (
      <GradingResultDisplay
        result={result}
        onRetry={result.passed ? undefined : handleRetry}
        onNext={result.passed ? onComplete : undefined}
      />
    );
  }

  const submitReady = hasContent && allMeetMin;

  return (
    <div className="space-y-4">

      {/* ── PANEL 1: HOW THIS WORKS ───────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #0f1f3d" }}>
        <button
          onClick={() => setHowOpen(!howOpen)}
          className="w-full flex items-center justify-between px-5 py-4 text-left transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#0f1f3d" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">📋</span>
            <div>
              <p className="text-white font-bold text-sm">How This Works</p>
              <p className="text-blue-300 text-xs">
                {tasks.length} task{tasks.length > 1 ? "s" : ""} to complete · read this before you start
              </p>
            </div>
          </div>
          <span
            className="text-white text-lg leading-none transition-transform duration-200"
            style={{ display: "inline-block", transform: howOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▾
          </span>
        </button>

        {howOpen && (
          <div className="p-5 space-y-5 bg-white">

            {/* Steps */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Your tasks</p>
              <div className="space-y-3">
                {tasks.map((task, i) => (
                  <div key={task.id} className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5"
                      style={{ backgroundColor: "#0f1f3d" }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 mb-0.5">
                        {isMulti ? task.label : "Your Task"}
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {task.body.slice(0, 220)}{task.body.length > 220 ? "…" : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What good looks like */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">What a correct submission looks like</p>
              <ul className="space-y-2">
                {[
                  "Specific numbers, names, or examples — not just general statements",
                  "Your reasoning — explain WHY, not just WHAT",
                  isMulti ? "Every task answered separately, in order" : "The full task answered, not just part of it",
                  "Minimum 40 words per task — depth is rewarded, padding is not",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="font-bold flex-shrink-0" style={{ color: "#2d8a4e" }}>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common mistakes */}
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: "rgba(187,0,0,0.03)", border: "1px solid rgba(187,0,0,0.12)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#bb0000" }}>
                3 common mistakes that cause low scores
              </p>
              <div className="space-y-3">
                {[
                  {
                    mistake: "Being too vague",
                    fix: `"AI can help with data" scores low. "AI can group 3,200 records by county and flag spoilage above 5% in under a minute" scores high.`,
                  },
                  {
                    mistake: "Skipping part of a task",
                    fix: `If a task asks for two things (a rate AND a recommendation), both must be answered. Half answers earn half points.`,
                  },
                  {
                    mistake: "Restating the question instead of answering it",
                    fix: `Copying the task text back without answering earns zero. Claude AI grades the substance of your answer, not its length.`,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-xs font-bold flex-shrink-0 mt-0.5" style={{ color: "#bb0000" }}>✕</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{item.mistake}</p>
                      <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{item.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ── PANEL 2: TRY IT ──────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #2d8a4e" }}>
        <div className="px-5 py-4 flex items-center gap-3" style={{ backgroundColor: "#2d8a4e" }}>
          <span className="text-lg">✍️</span>
          <div>
            <p className="text-white font-bold text-sm">Try It — Write Your Answers</p>
            <p className="text-green-100 text-xs">
              {isMulti ? `${tasks.length} tasks below — answer each one in its own box` : "Write your full answer in the box below"}
            </p>
          </div>
        </div>

        <div className="p-5 space-y-7 bg-white">
          {tasks.map((task, i) => (
            <div key={task.id} className="space-y-3">
              {isMulti && (
                <p className="text-sm font-bold" style={{ color: "#2d8a4e" }}>{task.label}</p>
              )}

              {/* Task description */}
              <div className="rounded-xl p-4" style={{ backgroundColor: "#0f1f3d" }}>
                {!isMulti && (
                  <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-2">Your Task</p>
                )}
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{task.body}</p>
              </div>

              {/* Answer textarea */}
              <textarea
                value={answers[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                placeholder={
                  isMulti
                    ? `Answer for ${task.label}. Be specific — quote numbers, name tools, show your reasoning.`
                    : "Write your answer here. Reference specific examples, include numbers where relevant, and explain your reasoning — not just your conclusions."
                }
                rows={isMulti ? 8 : 12}
                className="w-full rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 transition-colors"
                style={{
                  border: `1.5px solid ${wordCounts[i] >= 40 ? "#2d8a4e" : "#e5e7eb"}`,
                  ["--tw-ring-color" as string]: "#2d8a4e",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2d8a4e")}
                onBlur={(e) => (e.currentTarget.style.borderColor = wordCounts[i] >= 40 ? "#2d8a4e" : "#e5e7eb")}
              />

              {/* Per-task word count */}
              <div className="flex items-center justify-between">
                <p
                  className="text-xs font-semibold"
                  style={{ color: wordCounts[i] >= 40 ? "#2d8a4e" : "#9ca3af" }}
                >
                  {wordCounts[i]} / 40 words {wordCounts[i] >= 40 ? "✓" : "minimum"}
                </p>
                {wordCounts[i] > 0 && wordCounts[i] < 40 && (
                  <p className="text-xs text-gray-400">{40 - wordCounts[i]} more needed</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PANEL 3: SUBMIT ──────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden transition-all duration-300"
        style={{ border: `2px solid ${submitReady ? "#0f1f3d" : "#e5e7eb"}` }}
      >
        <div
          className="px-5 py-4 flex items-center gap-3 transition-colors duration-300"
          style={{ backgroundColor: submitReady ? "#0f1f3d" : "#f9fafb" }}
        >
          <span className="text-lg">🚀</span>
          <div>
            <p className={`font-bold text-sm ${submitReady ? "text-white" : "text-gray-400"}`}>
              Submit for Grading — Lesson {lessonNumber}
            </p>
            <p className={`text-xs ${submitReady ? "text-blue-300" : "text-gray-400"}`}>
              Claude AI · Score 80+ to pass · Max 3 attempts per 24h
            </p>
          </div>
        </div>

        <div className="p-5 space-y-4 bg-white">

          {/* Checklist */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Before you submit, confirm:</p>

            {/* Auto-checked items */}
            {[
              {
                label: isMulti ? `All ${tasks.length} tasks answered` : "Task answered",
                met: hasContent,
              },
              {
                label: `Every answer meets 40-word minimum (${totalWords} total words)`,
                met: allMeetMin,
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white transition-all duration-200"
                  style={{ backgroundColor: item.met ? "#2d8a4e" : "#e5e7eb" }}
                >
                  {item.met ? "✓" : ""}
                </div>
                <p className={`text-sm ${item.met ? "font-medium text-gray-800" : "text-gray-400"}`}>
                  {item.label}
                </p>
              </div>
            ))}

            {/* Manual confirmation */}
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="w-5 h-5 cursor-pointer rounded"
                  style={{ accentColor: "#2d8a4e" }}
                />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                I included specific numbers, names, or examples — not just general statements
              </p>
            </label>
          </div>

          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-700 text-sm">{apiError}</p>
            </div>
          )}

          <p className="text-xs text-gray-400 italic leading-relaxed">
            📋 Your submission will be reviewed by an AI grading system (Claude by Anthropic) to provide feedback and a score. By submitting you consent to this processing as described in our{" "}
            <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>.
          </p>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || grading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: "#0f1f3d" }}
          >
            {grading ? (
              <><Spinner />Grading with Claude AI…</>
            ) : isMulti ? `Submit All ${tasks.length} Tasks for Grading` : "Submit for Grading"}
          </button>
        </div>
      </div>

    </div>
  );
}

function ProjectComponent({ content, sandboxTask, onComplete }: {
  content: string;
  sandboxTask?: string;
  onComplete: () => void;
}) {
  const rawTask = sandboxTask || content;
  const tasks = parseTasks(rawTask);
  const isMulti = tasks.length > 1;
  const [answers, setAnswers] = useState<string[]>(() => tasks.map(() => ""));
  const [result, setResult] = useState<SandboxGradingResult | null>(null);
  const [grading, setGrading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const wordCounts = answers.map((a) => a.trim().split(/\s+/).filter(Boolean).length);
  const allMeetMin = wordCounts.every((wc) => wc >= 40);
  const hasContent = answers.every((a) => a.trim().length > 0);

  const handleSubmit = async () => {
    if (grading) return;
    setGrading(true);
    setApiError(null);
    try {
      const data = await submitForGrading({
        courseSlug: "project",
        lessonNumber: 99,
        sandboxTask: rawTask,
        tasks,
        answers,
      });
      setResult(data);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Grading failed. Please try again.");
    } finally {
      setGrading(false);
    }
  };

  const handleRetry = () => { setResult(null); setAnswers(tasks.map(() => "")); setApiError(null); };
  const handleChange = (i: number, value: string) => {
    const next = [...answers]; next[i] = value; setAnswers(next);
  };

  return (
    <div className="space-y-5">
      {/* Project header — always shows content description */}
      <div className="rounded-2xl border p-6" style={{ borderColor: "#e5e7eb", backgroundColor: "#fff" }}>
        <div className="flex items-center gap-2 mb-4">
          <ProjectIcon color="#9333ea" size={16} />
          <span className="text-xs font-bold" style={{ color: "#9333ea" }}>Final Project</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
        {!isMulti && sandboxTask && (
          <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: "rgba(147,51,234,0.05)", border: "1px solid rgba(147,51,234,0.15)" }}>
            <p className="text-xs font-bold mb-2" style={{ color: "#9333ea" }}>Your task:</p>
            <p className="text-sm text-gray-700 leading-relaxed">{sandboxTask}</p>
          </div>
        )}
      </div>

      {result ? (
        <GradingResultDisplay
          result={result}
          onRetry={result.passed ? undefined : handleRetry}
          onNext={result.passed ? onComplete : undefined}
        />
      ) : (
        <div className="space-y-4">
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-700 text-sm">{apiError}</p>
            </div>
          )}
          <TaskCards
            tasks={tasks}
            answers={answers}
            wordCounts={wordCounts}
            isMulti={isMulti}
            onChange={handleChange}
            accentColor="#9333ea"
          />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-amber-800 text-xs">Graded by Claude AI. Score 80+ to pass. Max 3 attempts per 24 hours.</p>
          </div>
          <button
            disabled={!hasContent || !allMeetMin || grading}
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#9333ea" }}
          >
            {grading ? (
              <><Spinner />Grading with Claude AI...</>
            ) : isMulti ? `Submit All ${tasks.length} Deliverables` : "Submit for Grading"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Capstone component ────────────────────────────────────────────────────────

interface CapstoneApiResult {
  overallScore: number;
  passed: boolean;
  dimensionScores: Record<string, number>;
  feedback: string;
  cached?: boolean;
  didWell?: string[];
  improvements?: SandboxImprovement[];
  specificFixes?: string[];
}

function CapstoneComponent({
  courseSlug,
  capstone,
  onComplete,
}: {
  courseSlug: string;
  capstone: CourseCapstone;
  onComplete: () => void;
}) {
  const [submission, setSubmission] = useState("");
  const [normalized, setNormalized] = useState<SandboxGradingResult | null>(null);
  const [grading, setGrading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [certId, setCertId] = useState<string | null>(null);

  const wordCount = submission.trim().split(/\s+/).filter(Boolean).length;
  const minWords = 100;

  const handleSubmit = async () => {
    if (grading) return;
    setGrading(true);
    setApiError(null);
    try {
      const res = await fetch("/api/grade-capstone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, submission }),
      });
      const raw = (await res.json()) as CapstoneApiResult & { error?: string };
      if (!res.ok) throw new Error(raw.error || "Grading failed");

      const norm: SandboxGradingResult = {
        score: raw.overallScore,
        passed: raw.passed,
        feedback: raw.feedback,
        rubricScores: Object.entries(raw.dimensionScores ?? {}).map(([key, val]) => ({
          criterion: key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim(),
          score: val,
          max: 100,
          comment: "",
        })),
        cached: raw.cached,
        didWell: raw.didWell,
        improvements: raw.improvements,
        specificFixes: raw.specificFixes,
      };
      setNormalized(norm);

      if (raw.passed) {
        onComplete();
        try {
          const certRes = await fetch("/api/certificates/issue", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: courseSlug }),
          });
          if (certRes.ok) {
            const certData = (await certRes.json()) as { certId: string };
            setCertId(certData.certId);
          } else {
            // Non-fatal: student already passed — log the failure but don't block the UI
            const errBody = await certRes.json().catch(() => ({})) as Record<string, unknown>;
            console.error("[capstone] Certificate issuance failed", {
              status: certRes.status,
              error: errBody,
              slug: courseSlug,
            });
          }
        } catch (certErr) {
          // Network error — certificate generation is non-fatal on this page
          console.error("[capstone] Certificate fetch error", certErr);
        }
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Grading failed. Please try again.");
    } finally {
      setGrading(false);
    }
  };

  const handleRetry = () => {
    setNormalized(null);
    setSubmission("");
    setApiError(null);
  };

  if (normalized) {
    return (
      <div className="space-y-4">
        {normalized.passed && (
          <div
            className="rounded-2xl p-5 text-center"
            style={{ background: "linear-gradient(135deg, #0f1f3d 0%, #1a3260 100%)", border: "2px solid #2d8a4e" }}
          >
            <div className="text-3xl mb-2">🎓</div>
            <p className="font-bold text-white text-sm mb-1">Course Complete!</p>
            <p className="text-sm text-blue-200 mb-3">
              Your certificate is ready.
              {certId && <> Certificate ID: <span className="font-mono font-bold">{certId}</span></>}
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#2d8a4e" }}
            >
              View Certificate in Dashboard →
            </Link>
          </div>
        )}
        <GradingResultDisplay
          result={normalized}
          onRetry={normalized.passed ? undefined : handleRetry}
          onNext={undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Task card */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#0f1f3d" }}>
        <div className="px-5 pt-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
            </svg>
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Final Capstone Project</span>
          </div>
          <p className="text-xs text-white/50">Score {capstone.passingScore}% or above to earn your certificate</p>
        </div>
        <div className="p-5">
          <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{capstone.task}</p>
        </div>
      </div>

      {/* Submission textarea */}
      <textarea
        value={submission}
        onChange={(e) => setSubmission(e.target.value)}
        placeholder="Write your complete capstone submission here. Be thorough and specific — generic answers score low."
        rows={16}
        className="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none"
        onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
      />

      <div className="flex items-center justify-between">
        <p className={`text-xs font-medium ${wordCount >= minWords ? "text-[#2d8a4e]" : "text-gray-400"}`}>
          {wordCount} words {wordCount >= minWords ? "✓" : `(min ${minWords})`}
        </p>
        <p className="text-xs text-gray-400">Claude AI grading · max 3 attempts / 24 h</p>
      </div>

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-red-700 text-sm">{apiError}</p>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-amber-800 text-xs">
          This is your final capstone project. Graded by Claude AI on specificity, business accuracy, implementation realism, ethics, and professional quality. Score {capstone.passingScore}+ to earn your certificate.
        </p>
      </div>

      <p className="text-xs text-gray-400 italic leading-relaxed">
        📋 Your submission will be reviewed by an AI grading system (Claude by Anthropic) to provide feedback and a score. By submitting you consent to this processing as described in our{" "}
        <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>.
      </p>

      <button
        onClick={handleSubmit}
        disabled={wordCount < minWords || grading}
        className="w-full bg-[#0f1f3d] text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#162d54] transition-colors flex items-center justify-center gap-2"
      >
        {grading ? <><Spinner />Grading your capstone...</> : "Submit Capstone for Grading"}
      </button>
    </div>
  );
}

// ── Intro component ───────────────────────────────────────────────────────────

function IntroComponent({ lesson, courseTitle, onComplete }: {
  lesson: ReturnType<typeof getCourseContentBySlug> extends undefined ? never : NonNullable<ReturnType<typeof getCourseContentBySlug>>["lessons"][number];
  courseTitle: string;
  onComplete: () => void;
}) {
  const [firstTask, setFirstTask] = useState("");
  const [saved, setSaved] = useState(false);

  const saveFirstTask = () => {
    if (!firstTask.trim()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const { introWhoFor, introOutcomes, introStructure, introFirstTask, content } = lesson;

  return (
    <div className="space-y-6">

      {/* Section 1 — Welcome video */}
      <VideoPlayer title={lesson.title} duration_mins={lesson.duration_mins} videoUrl={lesson.videoUrl} />

      {/* Section 2 — About */}
      <div className="rounded-2xl border p-6 bg-white" style={{ borderColor: "#e5e7eb" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#0f1f3d" }}>What This Course Is About</p>
        <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
      </div>

      {/* Section 3 — Who it is for */}
      {introWhoFor && (
        <div className="rounded-2xl border p-6 bg-white" style={{ borderColor: "#e5e7eb" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#0f1f3d" }}>Who This Is For</p>
          <ul className="space-y-3">
            {introWhoFor.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "#0f1f3d" }}>{i + 1}</span>
                <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 4 — Outcomes */}
      {introOutcomes && (
        <div className="rounded-2xl p-6" style={{ backgroundColor: "#0f1f3d" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>What You Will Be Able To Do</p>
          <p className="text-xs text-white/50 mb-4">By the end of this course you will be able to:</p>
          <ul className="space-y-3">
            {introOutcomes.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0"><CheckIcon size={14} color="#2d8a4e" /></span>
                <span className="text-sm text-white leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 5 — How the course works */}
      {introStructure && (
        <div className="rounded-2xl border p-6 bg-white" style={{ borderColor: "#e5e7eb" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "#0f1f3d" }}>How This Course Works</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            {[
              { label: "Lessons", value: String(introStructure.lessonsCount), icon: <ReadingIcon size={16} color="#6366f1" /> },
              { label: "Hours", value: String(introStructure.hours), icon: <VideoIcon size={16} color="#0ea5e9" /> },
              { label: "Sandbox tasks", value: String(introStructure.sandboxCount), icon: <SandboxIcon size={16} color="#2d8a4e" /> },
              { label: "Final project", value: "1", icon: <ProjectIcon size={16} color="#9333ea" /> },
            ].map(({ label, value, icon }) => (
              <div key={label} className="rounded-xl p-4 text-center" style={{ backgroundColor: "#f8fafc", border: "1px solid #e5e7eb" }}>
                <div className="flex justify-center mb-2">{icon}</div>
                <p className="text-xl font-extrabold" style={{ color: "#0f1f3d" }}>{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(45,138,78,0.06)", border: "1px solid rgba(45,138,78,0.2)" }}>
            <p className="text-xs font-bold mb-1" style={{ color: "#2d8a4e" }}>Final project</p>
            <p className="text-sm text-gray-700">{introStructure.finalProject}</p>
          </div>
        </div>
      )}

      {/* Section 6 — First task */}
      {introFirstTask && (
        <div className="rounded-2xl border p-6 bg-white" style={{ borderColor: "#e5e7eb" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#0f1f3d" }}>Your First Task</p>
          <p className="text-sm text-gray-500 mb-4">Before you start — in one sentence, {introFirstTask}</p>
          <textarea
            value={firstTask}
            onChange={(e) => setFirstTask(e.target.value)}
            placeholder="Type your answer here…"
            rows={3}
            className="w-full px-4 py-3 text-sm border rounded-xl outline-none resize-none text-gray-700"
            style={{ borderColor: "#e5e7eb", lineHeight: "1.65" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">Your answer is saved to your profile.</span>
            <button
              onClick={saveFirstTask}
              disabled={!firstTask.trim()}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: saved ? "#2d8a4e" : "#0f1f3d" }}>
              {saved ? "Saved ✓" : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onComplete}
        className="w-full py-4 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
        style={{ backgroundColor: "#2d8a4e" }}>
        Start Course — Lesson 1 →
      </button>

    </div>
  );
}

// ── Theory section ────────────────────────────────────────────────────────────

function TheorySection({ hook, theory }: { hook: string; theory: LessonTheory }) {
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>(
    theory.checkYourUnderstanding.map(() => null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState<boolean[]>(
    theory.checkYourUnderstanding.map(() => false)
  );

  const { concept, badExample, badBreakdown, badOutput, goodExample, goodBreakdown, goodOutput, keyInsight, ruleToRemember, checkYourUnderstanding } = theory;

  return (
    <div className="space-y-6 mt-6">

      {/* 1. Hook box */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: "#0f1f3d" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Why This Matters</p>
        <p className="text-white italic text-sm leading-relaxed">{hook}</p>
      </div>

      {/* 2. Concept */}
      <div className="rounded-2xl border p-6 bg-white" style={{ borderColor: "#e5e7eb" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#0f1f3d" }}>The Concept</p>
        <div className="space-y-3">
          {concept.split("\n\n").map((para, i) => (
            <p key={i} className="text-sm text-gray-700 leading-relaxed">{para}</p>
          ))}
        </div>
      </div>

      {/* 3. Bad vs Good */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Wrong */}
          <div className="rounded-2xl border-2 p-5 flex flex-col gap-4" style={{ borderColor: "#dc2626" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#dc2626" }}>The Wrong Approach</p>
            <pre className="text-xs rounded-xl p-4 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap" style={{ backgroundColor: "#fef2f2", color: "#991b1b" }}>{badExample}</pre>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr style={{ backgroundColor: "#fef2f2" }}>
                  {["Element", "Present", "Problem"].map((h) => (
                    <th key={h} className="text-left p-2 font-semibold border" style={{ borderColor: "#fecaca", color: "#991b1b" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {badBreakdown.map((row, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#fff7f7" }}>
                    <td className="p-2 border font-medium" style={{ borderColor: "#fecaca" }}>{row.element}</td>
                    <td className="p-2 border" style={{ borderColor: "#fecaca", color: "#6b7280" }}>{row.present}</td>
                    <td className="p-2 border" style={{ borderColor: "#fecaca", color: "#dc2626" }}>{row.problem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Right */}
          <div className="rounded-2xl border-2 p-5 flex flex-col gap-4" style={{ borderColor: "#16a34a" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#16a34a" }}>The Right Approach</p>
            <pre className="text-xs rounded-xl p-4 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap" style={{ backgroundColor: "#f0fdf4", color: "#166534" }}>{goodExample}</pre>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr style={{ backgroundColor: "#f0fdf4" }}>
                  {["Element", "Present", "Improvement"].map((h) => (
                    <th key={h} className="text-left p-2 font-semibold border" style={{ borderColor: "#bbf7d0", color: "#166534" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {goodBreakdown.map((row, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f0fdf4" }}>
                    <td className="p-2 border font-medium" style={{ borderColor: "#bbf7d0" }}>{row.element}</td>
                    <td className="p-2 border" style={{ borderColor: "#bbf7d0", color: "#6b7280" }}>{row.present}</td>
                    <td className="p-2 border" style={{ borderColor: "#bbf7d0", color: "#16a34a" }}>{row.improvement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI outputs */}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">What the AI produces with the wrong approach:</p>
            <pre className="text-xs rounded-xl p-4 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap" style={{ backgroundColor: "#f3f4f6", color: "#4b5563" }}>{badOutput}</pre>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">What the AI produces with the right approach:</p>
            <pre className="text-xs rounded-xl p-4 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap" style={{ backgroundColor: "#f0fdf4", color: "#166534" }}>{goodOutput}</pre>
          </div>
        </div>
      </div>

      {/* 4. Key insight */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: "#0f1f3d", borderLeft: "4px solid #2d8a4e" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#2d8a4e" }}>Key Insight</p>
        <p className="text-sm text-white leading-relaxed">{keyInsight}</p>
      </div>

      {/* 5. Rule to remember */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#16a34a" }}>Rule to Remember</p>
        <p className="text-sm font-semibold leading-relaxed" style={{ color: "#166534" }}>{ruleToRemember}</p>
      </div>

      {/* 6. Check your understanding */}
      <div className="space-y-4">
        <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>Check Your Understanding</p>
        {checkYourUnderstanding.map((q, qi) => {
          const selected = quizAnswers[qi];
          const submitted = quizSubmitted[qi];
          const isCorrect = submitted && selected === q.correctAnswer;
          const isWrong = submitted && selected !== null && selected !== q.correctAnswer;
          return (
            <div key={qi} className="rounded-2xl border p-5 space-y-3"
              style={{ borderColor: submitted ? isCorrect ? "rgba(45,138,78,0.3)" : "rgba(187,0,0,0.25)" : "#e5e7eb", backgroundColor: submitted ? isCorrect ? "rgba(45,138,78,0.02)" : "rgba(187,0,0,0.02)" : "#fff" }}>
              <p className="text-sm font-semibold" style={{ color: "#0f1f3d" }}>{qi + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isSel = selected === oi;
                  const showOk = submitted && oi === q.correctAnswer;
                  const showBad = submitted && isSel && oi !== q.correctAnswer;
                  return (
                    <button key={oi} disabled={submitted}
                      onClick={() => { const n = [...quizAnswers]; n[qi] = oi; setQuizAnswers(n); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left text-sm transition-all"
                      style={{ borderColor: showOk ? "#2d8a4e" : showBad ? "#bb0000" : isSel ? "#0f1f3d" : "#e5e7eb", backgroundColor: showOk ? "rgba(45,138,78,0.08)" : showBad ? "rgba(187,0,0,0.06)" : isSel ? "rgba(15,31,61,0.05)" : "#fff", color: showOk ? "#166534" : showBad ? "#991b1b" : "#374151" }}>
                      <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ borderColor: showOk ? "#2d8a4e" : showBad ? "#bb0000" : isSel ? "#0f1f3d" : "#d1d5db", backgroundColor: isSel || showOk || showBad ? showOk ? "#2d8a4e" : showBad ? "#bb0000" : "#0f1f3d" : "transparent", color: isSel || showOk || showBad ? "#fff" : "#9ca3af" }}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {showOk && <CheckIcon size={14} />}
                    </button>
                  );
                })}
              </div>
              {!submitted ? (
                <button disabled={selected === null}
                  onClick={() => { const n = [...quizSubmitted]; n[qi] = true; setQuizSubmitted(n); }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: "#0f1f3d" }}>
                  Check Answer
                </button>
              ) : (
                <div className="rounded-xl px-4 py-3 text-xs leading-relaxed"
                  style={{ backgroundColor: isCorrect ? "rgba(45,138,78,0.08)" : "rgba(187,0,0,0.06)", color: isCorrect ? "#166534" : "#991b1b" }}>
                  <span className="font-bold">{isCorrect ? "Correct! " : "Not quite. "}</span>{q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

// ── Locked lesson ─────────────────────────────────────────────────────────────

function LockedLesson({ courseSlug }: { courseSlug: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(15,31,61,0.07)" }}>
        <LockIcon size={28} />
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: "#0f1f3d" }}>This lesson is locked</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">Enroll in this course to unlock all lessons and start learning.</p>
      <Link href={`/courses/${courseSlug}/enroll`}
        className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
        style={{ backgroundColor: "#2d8a4e" }}>
        Enroll Now
      </Link>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

interface SidebarProps {
  courseTitle: string;
  courseSlug: string;
  lessons: Lesson[];
  currentIndex: number;
  completedCount: number;
  completedSet: Set<number>;
  isTester: boolean;
  onSelect: (i: number) => void;
  onClose?: () => void;
}

function Sidebar({ courseTitle, courseSlug, lessons, currentIndex, completedCount, completedSet, isTester, onSelect, onClose }: SidebarProps) {
  const pct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ backgroundColor: "#0f1f3d" }}>
      <div className="flex-shrink-0 px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between mb-3">
          <Link href="/#courses" className="flex items-center gap-2">
            <div className="flex flex-row gap-px h-4 overflow-hidden rounded-sm">
              <div className="w-1 bg-black" /><div className="w-1 bg-[#bb0000]" /><div className="w-1 bg-[#2d8a4e]" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">Tund<span style={{ color: "#2d8a4e" }}>emy</span></span>
          </Link>
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-lg" style={{ color: "rgba(255,255,255,0.5)" }} aria-label="Close" title="Close">
              <CloseIcon />
            </button>
          )}
        </div>
        <p className="text-xs font-semibold leading-snug mb-0.5" style={{ color: "rgba(255,255,255,0.8)" }}>{courseTitle}</p>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{completedCount} of {lessons.length} complete</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {lessons.map((lesson, i) => {
          const completed = completedSet.has(i);
          const active = i === currentIndex;
          const accessible = isTester || i === 0 || completedSet.has(i - 1);
          const color = lessonTypeColor(lesson.type);
          return (
            <button key={lesson.lessonNumber} onClick={() => onSelect(i)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150"
              style={{ backgroundColor: active ? "rgba(45,138,78,0.2)" : "transparent", borderLeft: active ? "3px solid #2d8a4e" : "3px solid transparent", opacity: accessible ? 1 : 0.55 }}>
              <span className="text-xs font-bold w-5 text-center flex-shrink-0" style={{ color: active ? "#f59e0b" : "rgba(255,255,255,0.3)", ...(lesson.lessonNumber !== 0 && { color: active ? "#2d8a4e" : "rgba(255,255,255,0.3)" }) }}>
                {lesson.lessonNumber === 0 ? "★" : lesson.lessonNumber}
              </span>
              <span className="flex-shrink-0" style={{ color: active ? color : completed ? "rgba(45,138,78,0.8)" : accessible ? color : "rgba(255,255,255,0.3)" }}>
                {accessible ? <LessonIcon type={lesson.type} size={13} color="currentColor" /> : <LockIcon size={13} />}
              </span>
              <span className="flex-1 text-xs leading-snug" style={{ color: active ? "#ffffff" : completed ? "rgba(255,255,255,0.55)" : accessible ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)", fontWeight: active ? 600 : 400 }}>
                {lesson.title}
              </span>
              {completed && <span className="flex-shrink-0"><CheckIcon size={12} /></span>}
            </button>
          );
        })}
      </nav>

      <div className="flex-shrink-0 px-5 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Course progress</span>
          <span className="text-xs font-bold" style={{ color: "#2d8a4e" }}>{pct}%</span>
        </div>
        <div className="w-full rounded-full h-1.5" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
          <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: "#2d8a4e" }} />
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const courseData = getCourseContentBySlug(slug);
  const lessons = courseData?.lessons ?? [];

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSet, setCompletedSet] = useState<Set<number>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [quizAttempt, setQuizAttempt] = useState(0);
  const [lockedMsg, setLockedMsg] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);

  const isTester = userEmail === "d.kioko200@gmail.com";

  useEffect(() => {
    if (!courseData) { router.replace("/#courses"); return; }
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;

        if (!user) { router.replace(`/auth/login?next=/courses/${slug}/learn`); return; }

        if (user.email === "d.kioko200@gmail.com") {
          // Silently upsert a paid enrollment so tester always has full access
          try {
            await supabase.from("enrollments").upsert(
              { user_id: user.id, course_slug: slug, payment_status: "paid", enrolled_at: new Date().toISOString() },
              { onConflict: "user_id,course_slug" }
            );
          } catch { /* non-fatal */ }
        } else {
          const { data: enrollment } = await supabase
            .from("enrollments")
            .select("id")
            .eq("user_id", user.id)
            .eq("course_slug", slug)
            .eq("payment_status", "paid")
            .maybeSingle();
          if (!enrollment) { router.replace(`/courses/${slug}/enroll`); return; }
        }

        setUserId(user.id);
        setUserEmail(user.email ?? null);

        // Load saved progress — non-blocking
        const { data: progressRows } = await supabase
          .from("progress")
          .select("lesson_id")
          .eq("user_id", user.id)
          .eq("course_slug", slug)
          .eq("completed", true);
        if (progressRows) {
          setCompletedSet(new Set(progressRows.map((r: { lesson_id: number }) => r.lesson_id)));
        }
      } catch (err) {
        console.error("[learn] auth check failed:", err);
        router.replace(`/auth/login?next=/courses/${slug}/learn`);
        return;
      }
      setLoading(false);
    }
    checkAuth();
  }, [slug, courseData, router]);

  const markCompleteLocal = useCallback((index: number) => {
    setCompletedSet((prev) => { const next = new Set(prev); next.add(index); return next; });
  }, []);

  // Reset per-lesson state when switching lessons
  useEffect(() => {
    setQuizAttempt(0);
    setLockedMsg(false);
    setVideoWatched(false);
  }, [currentIndex]);

  const handleMarkComplete = useCallback(async () => {
    const lesson = lessons[currentIndex];
    if (!lesson) return;
    markCompleteLocal(currentIndex);
    setSaving(true);

    if (userId) {
      try {
        const supabase = createClient();
        await supabase.from("progress").upsert({
          user_id: userId,
          course_slug: slug,
          lesson_id: lesson.lessonNumber,
          completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id,course_slug,lesson_id" });
      } catch {
        // progress save is best-effort
      }
    }

    setSaving(false);
    if (currentIndex < lessons.length - 1) setCurrentIndex((i) => i + 1);
  }, [currentIndex, lessons, markCompleteLocal, userId, slug]);

  // For self-completing types (video, reading, intro): clicking Next marks complete + advances
  const handleNext = useCallback(async () => {
    const lesson = lessons[currentIndex];
    if (!lesson) return;
    const selfCompleting = lesson.type === "video" || lesson.type === "reading" || lesson.type === "intro";
    if (selfCompleting && !completedSet.has(currentIndex)) {
      markCompleteLocal(currentIndex);
      if (userId) {
        try {
          const supabase = createClient();
          await supabase.from("progress").upsert({
            user_id: userId, course_slug: slug, lesson_id: lesson.lessonNumber,
            completed: true, completed_at: new Date().toISOString(), updated_at: new Date().toISOString(),
          }, { onConflict: "user_id,course_slug,lesson_id" });
        } catch {}
      }
    }
    if (currentIndex < lessons.length - 1) setCurrentIndex((i) => i + 1);
  }, [currentIndex, lessons, completedSet, markCompleteLocal, userId, slug]);

  // Lesson select with progression lock enforcement
  const handleLessonSelect = useCallback((i: number) => {
    const accessible = isTester || i === 0 || completedSet.has(i - 1);
    if (accessible) {
      setCurrentIndex(i);
    } else {
      setLockedMsg(true);
      setTimeout(() => setLockedMsg(false), 4000);
    }
    setSidebarOpen(false);
  }, [isTester, completedSet]);

  const goNext = () => {
    if (currentIndex < lessons.length - 1) setCurrentIndex((i) => i + 1);
  };
  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const saveNotes = () => {
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  if (!courseData) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f9fafb" }}>
        <div className="w-9 h-9 rounded-full border-[3px] animate-spin" style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const currentLesson = lessons[currentIndex];
  if (!currentLesson) return null;

  const completedCount = completedSet.size;
  const typeColor = lessonTypeColor(currentLesson.type);
  const typeLabel = lessonTypeLabel(currentLesson.type);

  return (
    <div className="h-screen overflow-hidden" style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#f3f4f6" }}>

      {/* Mobile overlay sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 z-10 flex flex-col" style={{ width: "280px" }}>
            <Sidebar
              courseTitle={courseData.title} courseSlug={slug}
              lessons={lessons} currentIndex={currentIndex}
              completedCount={completedCount} completedSet={completedSet}
              isTester={isTester}
              onSelect={handleLessonSelect}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Fixed desktop left sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-30" style={{ width: "240px" }}>
        <Sidebar
          courseTitle={courseData.title} courseSlug={slug}
          lessons={lessons} currentIndex={currentIndex}
          completedCount={completedCount} completedSet={completedSet}
          isTester={isTester}
          onSelect={handleLessonSelect}
        />
      </aside>

      <div className="h-full flex flex-col lg:ml-[240px]">

        {/* Tester mode badge */}
        {isTester && (
          <div className="fixed top-3 right-3 z-50 px-2.5 py-1 rounded-full text-xs font-bold select-none pointer-events-none" style={{ backgroundColor: "#0f1f3d", color: "#f59e0b", boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>
            Tester Mode
          </div>
        )}

      {/* Mobile top bar */}
        <header className="lg:hidden flex-shrink-0 flex items-center gap-3 px-4 bg-white border-b" style={{ height: "52px", borderColor: "#e5e7eb" }}>
          <button onClick={() => setSidebarOpen(true)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: "#0f1f3d" }} aria-label="Open lessons menu" title="Open lessons menu">
            <MenuIcon />
          </button>
          <p className="text-sm font-semibold truncate flex-1" style={{ color: "#0f1f3d" }}>{currentLesson.title}</p>
          <span className="text-xs font-semibold flex-shrink-0" style={{ color: "#2d8a4e" }}>{completedCount}/{lessons.length}</span>
        </header>

        <div className="flex flex-1 overflow-hidden">

          {/* Main scroll area */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-5 lg:p-8 max-w-3xl xl:max-w-none mx-auto">

              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap">
                <Link href="/#courses" className="hover:text-gray-600 transition-colors">Courses</Link>
                <span>/</span>
                <span className="truncate max-w-[140px]">{courseData.title}</span>
                <span>/</span>
                <span className="text-gray-600 truncate max-w-[180px]">{currentLesson.title}</span>
              </nav>

              {/* Type + completed badges */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${typeColor}18`, color: typeColor }}>
                  {typeLabel}
                </span>
                {completedSet.has(currentIndex) && (
                  <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(45,138,78,0.1)", color: "#2d8a4e" }}>
                    <CheckIcon size={11} /> Completed
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-extrabold mb-2 leading-snug" style={{ color: "#0f1f3d" }}>
                {currentLesson.title}
              </h1>

              {/* Hook — shown inline only when no full theory section */}
              {currentLesson.hook && !currentLesson.theory && (
                <p className="text-sm text-gray-500 mb-7 leading-relaxed italic border-l-2 pl-3" style={{ borderColor: typeColor }}>
                  {currentLesson.hook}
                </p>
              )}

              {/* Lesson content */}
              <div className="mb-8">
                {!currentLesson.isAvailable && !isTester ? (
                  <LockedLesson courseSlug={slug} />
                ) : (
                  <>
                    {/* Course intro */}
                    {currentLesson.type === "intro" && (
                      <IntroComponent
                        lesson={currentLesson}
                        courseTitle={courseData.title}
                        onComplete={handleMarkComplete}
                      />
                    )}

                    {/* Video always renders first for non-intro lessons */}
                    {currentLesson.type === "video" && (
                      <VideoPlayer
                        title={currentLesson.title}
                        duration_mins={currentLesson.duration_mins}
                        videoUrl={currentLesson.videoUrl}
                        onWatched={currentLesson.videoUrl ? () => {
                          setVideoWatched(true);
                          // Mark lesson complete in state + DB (non-advancing)
                          if (!completedSet.has(currentIndex)) {
                            markCompleteLocal(currentIndex);
                            if (userId) {
                              const supabase = createClient();
                              supabase.from("progress").upsert({
                                user_id: userId, course_slug: slug,
                                lesson_id: currentLesson.lessonNumber,
                                completed: true, completed_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                              }, { onConflict: "user_id,course_slug,lesson_id" }).then(() => {});
                            }
                          }
                        } : undefined}
                      />
                    )}

                    {/* Theory section — after video, before interactive component */}
                    {currentLesson.type !== "intro" && currentLesson.theory && (
                      <TheorySection hook={currentLesson.hook} theory={currentLesson.theory} />
                    )}

                    {currentLesson.type === "reading" && (
                      <div className="mt-6">
                        <ReadingComponent
                          content={currentLesson.content}
                          readingTopics={currentLesson.readingTopics}
                          duration_mins={currentLesson.duration_mins}
                        />
                      </div>
                    )}
                    {currentLesson.type === "quiz" && currentLesson.quizQuestions && (
                      <div className="mt-6">
                        <QuizComponent
                          key={quizAttempt}
                          quizQuestions={currentLesson.quizQuestions}
                          onComplete={handleMarkComplete}
                          onFail={() => setQuizAttempt((a) => a + 1)}
                        />
                      </div>
                    )}
                    {currentLesson.type === "sandbox" && (
                      <div className="mt-6">
                        {currentLesson.simulatorType?.startsWith("whatsapp") ? (
                          <WhatsAppSimulatorSandbox
                            variant={currentLesson.simulatorType.replace("whatsapp-", "") as "setup" | "types" | "webhook"}
                            sandboxTask={currentLesson.sandboxTask ?? ""}
                            lessonNumber={currentLesson.lessonNumber}
                            courseSlug={slug}
                            onComplete={handleMarkComplete}
                          />
                        ) : currentLesson.simulatorType?.startsWith("daraja") ? (
                          <DarajaSimulatorSandbox
                            variant={currentLesson.simulatorType.replace("daraja-", "") as "oauth" | "stkpush"}
                            sandboxTask={currentLesson.sandboxTask ?? ""}
                            lessonNumber={currentLesson.lessonNumber}
                            courseSlug={slug}
                            onComplete={handleMarkComplete}
                          />
                        ) : currentLesson.simulatorType === "python" ? (
                          <PythonRunnerSandbox
                            variant="data-descriptive"
                            sandboxTask={currentLesson.sandboxTask ?? ""}
                            lessonNumber={currentLesson.lessonNumber}
                            courseSlug={slug}
                            onComplete={handleMarkComplete}
                          />
                        ) : (
                          <SandboxComponent sandboxTask={currentLesson.sandboxTask ?? ""} lessonNumber={currentLesson.lessonNumber} courseSlug={slug} onComplete={handleMarkComplete} />
                        )}
                      </div>
                    )}
                    {currentLesson.type === "project" && (
                      <div className="mt-6">
                        {courseData?.capstone ? (
                          <CapstoneComponent
                            courseSlug={slug}
                            capstone={courseData.capstone}
                            onComplete={handleMarkComplete}
                          />
                        ) : (
                          <ProjectComponent
                            content={currentLesson.content}
                            sandboxTask={currentLesson.sandboxTask}
                            onComplete={handleMarkComplete}
                          />
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Locked lesson message */}
              {lockedMsg && (
                <div className="mb-4 rounded-xl px-4 py-3 text-sm font-medium" style={{ backgroundColor: "rgba(15,31,61,0.07)", color: "#0f1f3d", border: "1px solid rgba(15,31,61,0.12)" }}>
                  Complete the previous lesson quiz to unlock this lesson.
                </div>
              )}

              {/* Navigation */}
              {(currentLesson.isAvailable || isTester) && (
                <div className="flex items-center justify-between gap-3 pt-6 border-t" style={{ borderColor: "#e5e7eb" }}>
                  <button onClick={goPrev} disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>
                    <ChevronLeft />
                    Previous
                  </button>

                  <div className="flex items-center gap-2.5">
                    {/* Tester skip — bypasses quiz/sandbox gate */}
                    {isTester && !completedSet.has(currentIndex) && (
                      <button onClick={handleMarkComplete} disabled={saving}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all hover:opacity-80"
                        style={{ borderColor: "#f59e0b", color: "#f59e0b" }}>
                        Skip →
                      </button>
                    )}
                    {(() => {
                      const isQuizSandbox = currentLesson.type === "quiz" || currentLesson.type === "sandbox" || currentLesson.type === "project";
                      // Video with a real URL: must watch to completion before advancing
                      const isVideoGated = currentLesson.type === "video" && !!currentLesson.videoUrl && !videoWatched && !completedSet.has(currentIndex);
                      const blocked = (isQuizSandbox || isVideoGated) && !isTester;
                      const isLast = currentIndex === lessons.length - 1;
                      const tooltipMsg = isVideoGated ? "Watch the video to continue" : "Complete this lesson to continue";
                      return (
                        <div className="flex flex-col items-end gap-1">
                          <button
                            onClick={blocked ? undefined : handleNext}
                            disabled={isLast || blocked}
                            title={blocked ? tooltipMsg : undefined}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ backgroundColor: "#2d8a4e" }}>
                            Next <ChevronRight />
                          </button>
                          {blocked && !isLast && (
                            <p className="text-xs text-gray-400">{tooltipMsg}</p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

            </div>
          </main>

          {/* Right sidebar */}
          <aside
            className="hidden xl:flex flex-col flex-shrink-0 overflow-y-auto border-l bg-white"
            style={{ width: "280px", borderColor: "#e5e7eb" }}
          >
            <div className="p-5 flex flex-col gap-6">

              <div>
                <h3 className="text-sm font-bold mb-4" style={{ color: "#0f1f3d" }}>Your Progress</h3>
                <CircularProgress completed={completedCount} total={lessons.length} />
                {completedCount === lessons.length && (
                  <div className="mt-4 rounded-xl px-3 py-2.5 text-xs font-semibold text-center" style={{ backgroundColor: "rgba(45,138,78,0.1)", color: "#2d8a4e" }}>
                    Course complete! Certificate ready 🎓
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100" />

              <div>
                <h3 className="text-sm font-bold mb-3" style={{ color: "#0f1f3d" }}>Notes</h3>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write notes for this lesson…"
                  rows={6}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border outline-none resize-none text-gray-700"
                  style={{ borderColor: "#e5e7eb", lineHeight: "1.55" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                />
                <button onClick={saveNotes}
                  className="mt-2 w-full py-2.5 rounded-xl text-xs font-bold transition-all"
                  style={notesSaved ? { backgroundColor: "rgba(45,138,78,0.1)", color: "#2d8a4e" } : { backgroundColor: "#2d8a4e", color: "#fff" }}>
                  {notesSaved ? "Saved ✓" : "Save Notes"}
                </button>
              </div>

              <div className="h-px bg-gray-100" />

              <div>
                <h3 className="text-sm font-bold mb-3" style={{ color: "#0f1f3d" }}>Resources</h3>
                <div className="flex flex-col gap-2">
                  <a href="#" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all hover:bg-gray-50" style={{ borderColor: "#e5e7eb", color: "#0f1f3d" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    Download course materials
                  </a>
                  <a href="#" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all hover:bg-gray-50" style={{ borderColor: "#e5e7eb", color: "#0f1f3d" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    Community discussion
                  </a>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

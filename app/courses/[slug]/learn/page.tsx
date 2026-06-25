"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { getCourseContentBySlug, type Lesson, type QuizQuestion, type LessonTheory } from "@/lib/course-content";
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

function VideoPlayer({ title, duration_mins, videoUrl }: { title: string; duration_mins: number; videoUrl?: string }) {
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

function ReadingComponent({ content, readingTopics, duration_mins, onComplete }: {
  content: string;
  readingTopics?: string[];
  duration_mins: number;
  onComplete: () => void;
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
      <button onClick={onComplete}
        className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
        style={{ backgroundColor: "#0ea5e9" }}>
        Mark as Read &amp; Continue
      </button>
    </div>
  );
}

// ── Quiz ──────────────────────────────────────────────────────────────────────

function QuizComponent({ quizQuestions, onComplete }: { quizQuestions: QuizQuestion[]; onComplete: () => void }) {
  const [answers, setAnswers] = useState<(number | null)[]>(quizQuestions.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const [tried, setTried] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const score = answers.filter((a, i) => a === quizQuestions[i]?.correctAnswer).length;
  const passed = score >= Math.ceil(quizQuestions.length * 0.7);

  const reset = () => { setAnswers(quizQuestions.map(() => null)); setSubmitted(false); };

  return (
    <div className="space-y-5">
      {tried && !submitted && (
        <div className="rounded-xl px-4 py-3 text-xs font-medium" style={{ backgroundColor: "rgba(245,158,11,0.08)", color: "#b45309" }}>
          Review your answers and try again. You need 70% or above to pass.
        </div>
      )}
      {quizQuestions.map((q, qi) => {
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
        <button disabled={!allAnswered} onClick={() => { setSubmitted(true); setTried(true); }}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#2d8a4e" }}>
          Submit Quiz
        </button>
      ) : (
        <div className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
          style={{ backgroundColor: passed ? "rgba(45,138,78,0.07)" : "rgba(187,0,0,0.05)", border: `1px solid ${passed ? "rgba(45,138,78,0.25)" : "rgba(187,0,0,0.2)"}` }}>
          <div className="flex-1">
            <p className="font-bold text-sm" style={{ color: passed ? "#166534" : "#991b1b" }}>{passed ? "Quiz passed! Well done." : "Not quite — review the material and try again."}</p>
            <p className="text-xs text-gray-500 mt-0.5">{score} / {quizQuestions.length} correct · {Math.round((score / quizQuestions.length) * 100)}%{!passed && " (need 70% to pass)"}</p>
          </div>
          {passed ? (
            <button onClick={onComplete} className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ backgroundColor: "#2d8a4e" }}>Continue →</button>
          ) : (
            <button onClick={reset} className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all hover:bg-gray-50" style={{ borderColor: "#bb0000", color: "#bb0000" }}>Try again</button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Sandbox ───────────────────────────────────────────────────────────────────

// ─── SANDBOX GRADING ENGINE ───────────────────────────────────────────────────

interface GradingResult {
  score: number;
  grade: "A" | "B" | "C" | "F";
  feedback: string;
  strengths: string[];
  improvements: string[];
  rubricScores: { criterion: string; score: number; max: number; comment: string }[];
}

function gradeSubmission(submission: string, sandboxTask: string, lessonNumber: number, _courseSlug: string): GradingResult {
  const text = submission.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const hasStructure = /\n/.test(text) || text.includes("1.") || text.includes("-") || text.includes("•");
  const hasSpecifics = /\d/.test(text) || text.match(/ksh|nairobi|kenya|business|customer|workflow|system|process/i);
  const hasContext = wordCount > 40;
  const hasActionableItems = text.match(/will|should|must|need to|plan to|going to|step|action|implement/i);
  const isVague = wordCount < 20;
  const isTooShort = wordCount < 15;

  const rubrics: Record<number, { criterion: string; max: number; evaluate: () => { score: number; comment: string } }[]> = {
    3: [
      {
        criterion: "System Context",
        max: 25,
        evaluate: () => {
          const hasRole = /you are|act as|as a|role:|context:/i.test(text);
          const hasIndustry = /restaurant|shop|business|company|agency|school|clinic|farm|hotel/i.test(text);
          if (hasRole && hasIndustry) return { score: 25, comment: "Clear system context with role and industry defined" };
          if (hasRole || hasIndustry) return { score: 15, comment: "Partial context — add both role and specific industry" };
          return { score: 5, comment: "No system context defined — who is the AI advising?" };
        },
      },
      {
        criterion: "Task Specificity",
        max: 25,
        evaluate: () => {
          const hasSpecificTask = /summarise|write|draft|analyse|create|generate|respond|translate|classify/i.test(text);
          const isSpecific = wordCount > 30 && hasSpecificTask;
          if (isSpecific) return { score: 25, comment: "Task is clearly and specifically defined" };
          if (hasSpecificTask) return { score: 15, comment: "Task identified but could be more specific" };
          return { score: 5, comment: "Task is too vague — what exactly should the AI do?" };
        },
      },
      {
        criterion: "Output Format",
        max: 25,
        evaluate: () => {
          const hasFormat = /bullet|list|table|paragraph|words|format|structure|numbered|summary|report/i.test(text);
          const hasLength = /\d+\s*(word|sentence|point|item|line)/i.test(text);
          if (hasFormat && hasLength) return { score: 25, comment: "Output format and length both specified" };
          if (hasFormat || hasLength) return { score: 15, comment: "Format partially specified — add length constraint" };
          return { score: 5, comment: "No output format specified — how should the AI respond?" };
        },
      },
      {
        criterion: "Real-World Relevance",
        max: 25,
        evaluate: () => {
          if (hasSpecifics && hasContext) return { score: 25, comment: "Grounded in a real, specific business context" };
          if (hasSpecifics || hasContext) return { score: 15, comment: "Some real-world context present" };
          return { score: 5, comment: "Too generic — apply this to a real business situation" };
        },
      },
    ],
    99: [
      {
        criterion: "Business Context Accuracy",
        max: 25,
        evaluate: () => {
          const hasIndustry = /logistics|healthcare|retail|agriculture|banking|education|hospitality|clinic|hospital|school|farm|shop|hotel|transport|supermarket/i.test(text);
          const hasKenya = /kenya|nairobi|mombasa|kisumu|nakuru|ksh|kes|mpesa|m-pesa|safaricom/i.test(text);
          if (hasIndustry && hasKenya) return { score: 25, comment: "Response is grounded in a specific Kenyan business context" };
          if (hasIndustry || hasKenya) return { score: 15, comment: "Partial context — add specific Kenyan business details" };
          return { score: 5, comment: "Too generic — choose a specific Kenyan business type and ground your response in how it actually operates" };
        },
      },
      {
        criterion: "Specificity and Actionability",
        max: 25,
        evaluate: () => {
          const hasTools = /claude|chatgpt|gpt|gemini|whatsapp|excel|google|zapier|notion|slack/i.test(text);
          const hasNumbers = /ksh|kes|\d+,\d+|\d+\s*(hour|minute|day|week|month)|%/i.test(text);
          if (hasTools && hasNumbers) return { score: 25, comment: "Specific tools named with realistic KSh values and time estimates" };
          if (hasTools || hasNumbers) return { score: 15, comment: "Add both specific tool names and realistic KSh or time values" };
          return { score: 5, comment: "Too vague — name specific AI tools and provide realistic cost or time savings in KSh" };
        },
      },
      {
        criterion: "Implementation Realism",
        max: 20,
        evaluate: () => {
          const hasRoadmap = /week 1|month 1|month 3|90.day|first step|day one|roadmap|phase/i.test(text);
          const hasConstraints = /budget|cost|staff|team|training|internet|connectivity|data|resource/i.test(text);
          if (hasRoadmap && hasConstraints) return { score: 20, comment: "Roadmap is structured and accounts for real Kenyan business constraints" };
          if (hasRoadmap || hasConstraints) return { score: 12, comment: "Roadmap present but add real implementation constraints" };
          return { score: 4, comment: "Add a concrete 90-day roadmap with specific actions accounting for Kenyan business realities" };
        },
      },
      {
        criterion: "Risk Identification",
        max: 15,
        evaluate: () => {
          const hasRisk = /risk|challenge|concern|privacy|bias|error|hallucin|data|compliance|trust|accuracy/i.test(text);
          const hasMitigation = /mitigat|address|prevent|reduce|manage|handle|ensure|monitor|verify/i.test(text);
          if (hasRisk && hasMitigation) return { score: 15, comment: "Risks identified with practical mitigations" };
          if (hasRisk) return { score: 9, comment: "Risks identified — add specific mitigation strategies" };
          return { score: 3, comment: "No risks identified — add at least 2 specific risks with mitigations" };
        },
      },
      {
        criterion: "Professional Quality",
        max: 15,
        evaluate: () => {
          const hasStructure = /executive summary|current state|opportunities|roadmap|risk|section|\d\.|•|-\s/i.test(text);
          const isSubstantial = wordCount > 150;
          if (hasStructure && isSubstantial) return { score: 15, comment: "Professional document structure and substance — ready for a CEO" };
          if (hasStructure || isSubstantial) return { score: 9, comment: "Add clear section headings and ensure sufficient depth" };
          return { score: 3, comment: "Structure and length need significant improvement before this could go to a CEO" };
        },
      },
    ],
    7: [
      {
        criterion: "Specific Task Identified",
        max: 25,
        evaluate: () => {
          const hasTask = /email|report|summary|data|customer|meeting|social|content|invoice|schedule/i.test(text);
          if (hasTask && wordCount > 20) return { score: 25, comment: "Concrete task clearly identified" };
          if (hasTask) return { score: 15, comment: "Task mentioned but needs more detail" };
          return { score: 5, comment: "No specific task identified" };
        },
      },
      {
        criterion: "Tool Selection with Reasoning",
        max: 25,
        evaluate: () => {
          const hasTool = /claude|chatgpt|gemini|gpt|ai tool|midjourney|zapier|make|n8n/i.test(text);
          const hasReason = /because|since|as it|which|that|for|to help/i.test(text);
          if (hasTool && hasReason) return { score: 25, comment: "Tool chosen with clear reasoning" };
          if (hasTool) return { score: 15, comment: "Tool named but reasoning not explained" };
          return { score: 5, comment: "No specific AI tool identified" };
        },
      },
      {
        criterion: "Measurable Success Criteria",
        max: 25,
        evaluate: () => {
          const hasMeasure = /minute|hour|time|faster|less|more|save|reduce|increase|\d+%|\d+ (hour|min|day)/i.test(text);
          if (hasMeasure) return { score: 25, comment: "Clear measurable outcome defined" };
          return { score: 10, comment: "Add a specific measurable goal — e.g. save 30 minutes per day" };
        },
      },
      {
        criterion: "Concrete Next Action",
        max: 25,
        evaluate: () => {
          const hasAction = /tomorrow|today|this week|will|going to|first step|start by|begin/i.test(text);
          const isSpecific = wordCount > 30;
          if (hasAction && isSpecific) return { score: 25, comment: "Specific next action clearly stated" };
          if (hasAction) return { score: 15, comment: "Next action mentioned but vague" };
          return { score: 5, comment: "No concrete next action defined" };
        },
      },
    ],
  };

  const defaultRubric = [
    {
      criterion: "Depth and Completeness",
      max: 30,
      evaluate: () => {
        if (isTooShort) return { score: 3, comment: "Response is too short to demonstrate understanding" };
        if (wordCount > 80) return { score: 30, comment: "Thorough and complete response" };
        if (wordCount > 40) return { score: 20, comment: "Good depth — could expand further" };
        return { score: 10, comment: "Needs more depth and detail" };
      },
    },
    {
      criterion: "Specificity and Context",
      max: 30,
      evaluate: () => {
        if (hasSpecifics && hasContext) return { score: 30, comment: "Well-grounded with specific details and context" };
        if (hasSpecifics || hasContext) return { score: 18, comment: "Some specifics present — add more real-world context" };
        return { score: 6, comment: "Too generic — add specific examples and context" };
      },
    },
    {
      criterion: "Structure and Clarity",
      max: 20,
      evaluate: () => {
        if (hasStructure && sentences.length >= 3) return { score: 20, comment: "Well-structured and clearly written" };
        if (hasStructure || sentences.length >= 2) return { score: 12, comment: "Reasonably clear — improve structure with bullet points or numbered steps" };
        return { score: 4, comment: "Improve structure — use numbered steps or bullet points" };
      },
    },
    {
      criterion: "Actionability",
      max: 20,
      evaluate: () => {
        if (hasActionableItems && !isVague) return { score: 20, comment: "Response is practical and actionable" };
        if (hasActionableItems) return { score: 12, comment: "Some actionable elements — be more concrete" };
        return { score: 4, comment: "Add specific actions — what would someone actually do?" };
      },
    },
  ];

  const activeRubric = rubrics[lessonNumber] || defaultRubric;
  const rubricScores = activeRubric.map(r => {
    const result = r.evaluate();
    return { criterion: r.criterion, score: result.score, max: r.max, comment: result.comment };
  });

  const totalScore = Math.min(100, rubricScores.reduce((sum, r) => sum + r.score, 0));
  let finalScore = totalScore;
  if (isTooShort) finalScore = Math.min(finalScore, 25);
  if (isVague && wordCount < 30) finalScore = Math.min(finalScore, 45);

  const grade = finalScore >= 85 ? "A" : finalScore >= 70 ? "B" : finalScore >= 50 ? "C" : "F";
  const strengths = rubricScores.filter(r => r.score >= r.max * 0.8).map(r => r.comment);
  const improvements = rubricScores.filter(r => r.score < r.max * 0.6).map(r => r.comment);

  const feedbackMap: Record<string, string> = {
    A: "Excellent work. Your response demonstrates a strong grasp of the concept and applies it with specificity and structure. This is the standard of thinking employers look for.",
    B: "Good response. You have understood the core task and applied it reasonably well. A few refinements would make this professional-grade.",
    C: "Partial credit. You have made a start but the response lacks the depth, specificity, or structure needed to demonstrate real competence. Review the lesson notes and try again.",
    F: "This response needs significant improvement. It is either too short, too vague, or does not address the task. Re-read the task carefully and write a more complete response.",
  };

  return {
    score: Math.round(finalScore),
    grade,
    feedback: feedbackMap[grade],
    strengths: strengths.length > 0 ? strengths : ["You attempted the task"],
    improvements: improvements.length > 0 ? improvements : ["Keep refining your response"],
    rubricScores,
  };
}

function SandboxComponent({ sandboxTask, lessonNumber, courseSlug, onComplete }: {
  sandboxTask: string;
  lessonNumber: number;
  courseSlug: string;
  onComplete: () => void;
}) {
  const [submission, setSubmission] = useState("");
  const [result, setResult] = useState<GradingResult | null>(null);
  const [grading, setGrading] = useState(false);

  const handleSubmit = () => {
    if (!submission.trim() || grading) return;
    setGrading(true);
    setTimeout(() => {
      const gradingResult = gradeSubmission(submission, sandboxTask, lessonNumber, courseSlug);
      setResult(gradingResult);
      setGrading(false);
      if (gradingResult.score >= 70) {
        setTimeout(() => onComplete(), 2000);
      }
    }, 1800);
  };

  const handleRetry = () => {
    setResult(null);
    setSubmission("");
  };

  if (result) {
    return (
      <div className="space-y-4">
        <div className={`rounded-2xl p-6 text-center ${result.score >= 70 ? "bg-green-50 border-2 border-[#2d8a4e]" : result.score >= 50 ? "bg-orange-50 border-2 border-orange-400" : "bg-red-50 border-2 border-red-400"}`}>
          <div className={`text-6xl font-black ${result.score >= 70 ? "text-[#2d8a4e]" : result.score >= 50 ? "text-orange-500" : "text-red-500"}`}>
            {result.score}
          </div>
          <div className="text-gray-500 text-sm mt-1">out of 100 · Grade {result.grade}</div>
          <div className={`mt-3 font-bold text-sm ${result.score >= 70 ? "text-[#2d8a4e]" : "text-red-500"}`}>
            {result.score >= 70 ? "✓ Passed — well done" : "✗ Score 70 or above to continue"}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="font-semibold text-[#0f1f3d] mb-2 text-sm">Overall Feedback</p>
          <p className="text-gray-600 text-sm leading-relaxed">{result.feedback}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="font-semibold text-[#0f1f3d] mb-3 text-sm">Rubric Breakdown</p>
          <div className="space-y-3">
            {result.rubricScores.map((r, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-gray-700">{r.criterion}</span>
                  <span className="text-xs font-bold text-[#0f1f3d]">{r.score}/{r.max}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${r.score >= r.max * 0.8 ? "bg-[#2d8a4e]" : r.score >= r.max * 0.5 ? "bg-orange-400" : "bg-red-400"}`} style={{ width: `${(r.score / r.max) * 100}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {result.strengths.length > 0 && (
          <div className="bg-green-50 rounded-xl p-4">
            <p className="font-semibold text-[#2d8a4e] text-sm mb-2">What you did well</p>
            {result.strengths.map((s, i) => (
              <p key={i} className="text-sm text-gray-700 flex gap-2 mb-1"><span className="text-[#2d8a4e] font-bold">✓</span>{s}</p>
            ))}
          </div>
        )}

        {result.improvements.length > 0 && (
          <div className="bg-orange-50 rounded-xl p-4">
            <p className="font-semibold text-orange-700 text-sm mb-2">Areas to improve</p>
            {result.improvements.map((imp, i) => (
              <p key={i} className="text-sm text-gray-700 flex gap-2 mb-1"><span className="text-orange-500 font-bold">→</span>{imp}</p>
            ))}
          </div>
        )}

        {result.score < 70 && (
          <button onClick={handleRetry} className="w-full border-2 border-[#0f1f3d] text-[#0f1f3d] py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
            Revise and Resubmit
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#0f1f3d] rounded-xl p-5">
        <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">Your Task</p>
        <p className="text-white text-sm leading-relaxed">{sandboxTask}</p>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-amber-800 text-xs">Your response will be graded on depth, specificity, structure, and actionability. Aim for at least 70 to pass.</p>
      </div>
      <textarea
        value={submission}
        onChange={(e) => setSubmission(e.target.value)}
        placeholder="Write your response here. Be specific — generic answers score low."
        rows={10}
        className="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2d8a4e] focus:border-transparent"
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">{submission.trim().split(/\s+/).filter(Boolean).length} words</span>
        <span className="text-xs text-gray-400">Minimum 40 words recommended</span>
      </div>
      <button
        onClick={handleSubmit}
        disabled={!submission.trim() || grading || submission.trim().split(/\s+/).length < 5}
        className="w-full bg-[#0f1f3d] text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#162d54] transition-colors flex items-center justify-center gap-2"
      >
        {grading ? (
          <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Grading your response...</>
        ) : "Submit for Grading"}
      </button>
    </div>
  );
}

// ── Project ───────────────────────────────────────────────────────────────────

function ProjectComponent({ content, sandboxTask, onComplete }: { content: string; sandboxTask?: string; onComplete: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [work, setWork] = useState("");

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border p-6" style={{ borderColor: "#e5e7eb", backgroundColor: "#fff" }}>
        <div className="flex items-center gap-2 mb-4">
          <ProjectIcon color="#9333ea" size={16} />
          <span className="text-xs font-bold" style={{ color: "#9333ea" }}>Final Project</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-5">{content}</p>
        {sandboxTask && (
          <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(147,51,234,0.05)", border: "1px solid rgba(147,51,234,0.15)" }}>
            <p className="text-xs font-bold mb-2" style={{ color: "#9333ea" }}>Your task:</p>
            <p className="text-sm text-gray-700 leading-relaxed">{sandboxTask}</p>
          </div>
        )}
      </div>
      {!submitted ? (
        <div className="space-y-3">
          <textarea value={work} onChange={(e) => setWork(e.target.value)}
            placeholder="Paste your project work, a link to your output, or describe what you built…"
            rows={6} className="w-full px-4 py-3 text-sm border rounded-2xl outline-none resize-none text-gray-700 font-mono"
            style={{ borderColor: "#e5e7eb", lineHeight: "1.65" }} />
          <button disabled={!work.trim()} onClick={() => setSubmitted(true)}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#9333ea" }}>
            Submit Project
          </button>
        </div>
      ) : (
        <div className="rounded-2xl p-5" style={{ backgroundColor: "rgba(147,51,234,0.07)", border: "1px solid rgba(147,51,234,0.2)" }}>
          <p className="font-bold text-sm" style={{ color: "#9333ea" }}>Project submitted! Great work.</p>
          <p className="text-xs text-gray-500 mt-1">Your work has been recorded. Instructors review submissions weekly.</p>
          <button onClick={onComplete} className="mt-4 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ backgroundColor: "#9333ea" }}>
            Continue →
          </button>
        </div>
      )}
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
      <Link href={`/courses/${courseSlug}`}
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
  onSelect: (i: number) => void;
  onClose?: () => void;
}

function Sidebar({ courseTitle, courseSlug, lessons, currentIndex, completedCount, completedSet, onSelect, onClose }: SidebarProps) {
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
            <button onClick={onClose} className="p-1 rounded-lg" style={{ color: "rgba(255,255,255,0.5)" }} aria-label="Close">
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
          const color = lessonTypeColor(lesson.type);
          return (
            <button key={lesson.lessonNumber} onClick={() => onSelect(i)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150"
              style={{ backgroundColor: active ? "rgba(45,138,78,0.2)" : "transparent", borderLeft: active ? "3px solid #2d8a4e" : "3px solid transparent" }}>
              <span className="text-xs font-bold w-5 text-center flex-shrink-0" style={{ color: active ? "#f59e0b" : "rgba(255,255,255,0.3)" , ...(lesson.lessonNumber !== 0 && { color: active ? "#2d8a4e" : "rgba(255,255,255,0.3)" }) }}>
                {lesson.lessonNumber === 0 ? "★" : lesson.lessonNumber}
              </span>
              <span className="flex-shrink-0" style={{ color: active ? color : completed ? "rgba(45,138,78,0.8)" : color }}>
                <LessonIcon type={lesson.type} size={13} color="currentColor" />
              </span>
              <span className="flex-1 text-xs leading-snug" style={{ color: active ? "#ffffff" : completed ? "rgba(255,255,255,0.55)" : lesson.isAvailable ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)", fontWeight: active ? 600 : 400 }}>
                {lesson.title}
                {!lesson.isAvailable && <span className="ml-1 opacity-60">🔒</span>}
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSet, setCompletedSet] = useState<Set<number>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!courseData) { router.replace("/#courses"); return; }
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;

        if (!user) { router.replace(`/auth/login?next=/courses/${slug}/learn`); return; }

        // Check enrollment — redirect to enroll page if not paid
        const { data: enrollment } = await supabase
          .from("enrollments")
          .select("id")
          .eq("user_id", user.id)
          .eq("course_slug", slug)
          .eq("payment_status", "paid")
          .maybeSingle();
        if (!enrollment) { router.replace(`/courses/${slug}/enroll`); return; }

        setUserId(user.id);

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
              onSelect={(i) => { setCurrentIndex(i); setSidebarOpen(false); }}
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
          onSelect={setCurrentIndex}
        />
      </aside>

      <div className="h-full flex flex-col lg:ml-[240px]">

        {/* Mobile top bar */}
        <header className="lg:hidden flex-shrink-0 flex items-center gap-3 px-4 bg-white border-b" style={{ height: "52px", borderColor: "#e5e7eb" }}>
          <button onClick={() => setSidebarOpen(true)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: "#0f1f3d" }} aria-label="Lessons">
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
                {!currentLesson.isAvailable ? (
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
                      <VideoPlayer title={currentLesson.title} duration_mins={currentLesson.duration_mins} videoUrl={currentLesson.videoUrl} />
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
                          onComplete={handleMarkComplete}
                        />
                      </div>
                    )}
                    {currentLesson.type === "quiz" && currentLesson.quizQuestions && (
                      <div className="mt-6">
                        <QuizComponent quizQuestions={currentLesson.quizQuestions} onComplete={handleMarkComplete} />
                      </div>
                    )}
                    {currentLesson.type === "sandbox" && (
                      <div className="mt-6">
                        <SandboxComponent sandboxTask={currentLesson.sandboxTask ?? ""} lessonNumber={currentLesson.lessonNumber} courseSlug={slug} onComplete={handleMarkComplete} />
                      </div>
                    )}
                    {currentLesson.type === "project" && (
                      <div className="mt-6">
                        <ProjectComponent
                          content={currentLesson.content}
                          sandboxTask={currentLesson.sandboxTask}
                          onComplete={handleMarkComplete}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Navigation */}
              {currentLesson.isAvailable && (
                <div className="flex items-center justify-between gap-3 pt-6 border-t" style={{ borderColor: "#e5e7eb" }}>
                  <button onClick={goPrev} disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>
                    <ChevronLeft />
                    Previous
                  </button>

                  <div className="flex items-center gap-2.5">
                    {!completedSet.has(currentIndex) && currentLesson.type !== "quiz" && currentLesson.type !== "reading" && currentLesson.type !== "sandbox" && currentLesson.type !== "project" && (
                      <button onClick={handleMarkComplete} disabled={saving}
                        className="px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all hover:opacity-80 disabled:opacity-60"
                        style={{ borderColor: "#2d8a4e", color: "#2d8a4e" }}>
                        {saving ? "Saving…" : "Mark as Complete"}
                      </button>
                    )}
                    <button onClick={goNext} disabled={currentIndex === lessons.length - 1}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#2d8a4e" }}>
                      Next <ChevronRight />
                    </button>
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

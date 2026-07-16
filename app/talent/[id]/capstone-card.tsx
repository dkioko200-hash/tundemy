"use client";

import { useState } from "react";

interface RubricScore {
  criterion: string;
  score: number;
  max: number;
}

interface Improvement {
  area: string;
  missing: string;
  whyMatters: string;
  betterExample: string;
}

interface GradingDetail {
  rubric_scores?: RubricScore[];
  did_well?: string[];
  improvements?: Improvement[];
  specific_fixes?: string[];
}

interface CapstoneCardProps {
  courseSlug: string;
  title: string;
  summary: string;
  score: number | null;
  submissionText?: string | null;
  gradingDetail?: GradingDetail | null;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ExpandedDetail({
  score,
  submissionText,
  gradingDetail,
}: {
  score: number | null;
  submissionText?: string | null;
  gradingDetail?: GradingDetail | null;
}) {
  const hasDetail =
    gradingDetail &&
    ((gradingDetail.rubric_scores && gradingDetail.rubric_scores.length > 0) ||
      (gradingDetail.did_well && gradingDetail.did_well.length > 0) ||
      (gradingDetail.improvements && gradingDetail.improvements.length > 0) ||
      (gradingDetail.specific_fixes && gradingDetail.specific_fixes.length > 0));

  return (
    <div className="mt-4 space-y-4 border-t pt-4" style={{ borderColor: "#e5e7eb" }}>
      {submissionText && (
        <div>
          <p className="text-xs font-semibold mb-1.5" style={{ color: "#0f1f3d" }}>Submission</p>
          <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-lg p-3">
            {submissionText.length > 600 ? submissionText.slice(0, 600) + "..." : submissionText}
          </p>
        </div>
      )}

      {score != null && (
        <div
          className="rounded-xl p-3 flex items-center gap-3"
          style={{ backgroundColor: score >= 70 ? "rgba(45,138,78,0.08)" : "rgba(220,38,38,0.07)" }}
        >
          <span className="text-lg">{score >= 70 ? "✅" : "❌"}</span>
          <div>
            <p className="text-xs font-bold" style={{ color: score >= 70 ? "#2d8a4e" : "#dc2626" }}>
              {score >= 70 ? "Passed" : "Did not pass"} &mdash; {score}%
            </p>
            <p className="text-xs text-gray-500">
              {score >= 70 ? "Capstone project accepted" : "Score below 70% passing threshold"}
            </p>
          </div>
        </div>
      )}

      {hasDetail ? (
        <>
          {gradingDetail!.rubric_scores && gradingDetail!.rubric_scores.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "#0f1f3d" }}>Score Breakdown</p>
              <div className="space-y-2">
                {gradingDetail!.rubric_scores.map((r, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs text-gray-600">{r.criterion}</span>
                      <span className="text-xs font-bold" style={{ color: "#2d8a4e" }}>{r.score}/{r.max}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (r.score / r.max) * 100)}%`,
                          backgroundColor: r.score >= 70 ? "#2d8a4e" : r.score >= 50 ? "#e3a008" : "#dc2626",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {gradingDetail!.did_well && gradingDetail!.did_well.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "#0f1f3d" }}>What Went Well</p>
              <div className="space-y-1.5">
                {gradingDetail!.did_well.map((item, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: "#2d8a4e" }}>+</span>
                    <p className="text-xs text-gray-600 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {gradingDetail!.improvements && gradingDetail!.improvements.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "#0f1f3d" }}>Areas to Improve</p>
              <div className="space-y-2">
                {gradingDetail!.improvements.map((imp, i) => (
                  <div
                    key={i}
                    className="rounded-lg border p-3 space-y-1"
                    style={{ borderColor: "#fca5a5", backgroundColor: "rgba(220,38,38,0.03)" }}
                  >
                    <p className="text-xs font-bold" style={{ color: "#dc2626" }}>{imp.area}</p>
                    {imp.missing && (
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Missing:</span> {imp.missing}
                      </p>
                    )}
                    {imp.whyMatters && (
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Why it matters:</span> {imp.whyMatters}
                      </p>
                    )}
                    {imp.betterExample && (
                      <p className="text-xs text-gray-500 italic mt-1">{imp.betterExample}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {gradingDetail!.specific_fixes && gradingDetail!.specific_fixes.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "#0f1f3d" }}>Specific Fixes</p>
              <ol className="space-y-1.5 list-none">
                {gradingDetail!.specific_fixes.map((fix, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="text-xs font-bold w-4 flex-shrink-0" style={{ color: "#2d8a4e" }}>
                      {i + 1}.
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed">{fix}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </>
      ) : (
        <p className="text-xs text-gray-400 italic">
          Detailed rubric breakdown not available for this submission.
        </p>
      )}
    </div>
  );
}

export default function CapstoneCard({
  courseSlug,
  title,
  summary,
  score,
  submissionText,
  gradingDetail,
}: CapstoneCardProps) {
  const [open, setOpen] = useState(false);
  const hasExpandable = !!(submissionText || gradingDetail);

  return (
    <div
      className="rounded-xl border p-4 transition-all duration-150"
      style={{
        borderColor: open ? "#2d8a4e" : "#e5e7eb",
        cursor: hasExpandable ? "pointer" : "default",
      }}
      onClick={() => { if (hasExpandable) setOpen((o) => !o); }}
      role={hasExpandable ? "button" : undefined}
      aria-expanded={hasExpandable ? open : undefined}
      key={courseSlug}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>{title}</p>
        <div className="flex items-center gap-2 flex-shrink-0">
          {score != null && (
            <span className="text-xs font-bold" style={{ color: "#2d8a4e" }}>{score}%</span>
          )}
          {hasExpandable && (
            <span style={{ color: "#6b7280" }}>
              <ChevronIcon open={open} />
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{summary}</p>

      {open && (
        <ExpandedDetail score={score} submissionText={submissionText} gradingDetail={gradingDetail} />
      )}
    </div>
  );
}

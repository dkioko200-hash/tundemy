"use client";

import { useEffect, useState } from "react";

export interface PreviewCourse {
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  lessons: number;
  price: number;
  duration: string;
  tag: string;
  tagColor: string;
  icon: string;
  badge?: string;
  badgeBg?: string;
  bannerGradient?: string;
  accomplishments: string[];
}

interface PreviewModalProps {
  course: PreviewCourse | null;
  onClose: () => void;
}

export default function PreviewModal({ course, onClose }: PreviewModalProps) {
  // Keep a copy of the course so it stays visible during the closing animation
  const [displayCourse, setDisplayCourse] = useState<PreviewCourse | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (course) {
      setDisplayCourse(course);
      // Double RAF ensures the browser has painted the initial translate-y-full
      // before we flip to translate-y-0, making the CSS transition actually fire.
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true))
      );
      return () => cancelAnimationFrame(id);
    } else {
      setVisible(false);
      const t = setTimeout(() => setDisplayCourse(null), 300);
      return () => clearTimeout(t);
    }
  }, [course]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = course ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [course]);

  // Escape key closes modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && course) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [course, onClose]);

  if (!displayCourse) return null;

  const levelColor =
    displayCourse.level === "Beginner"
      ? "#2d8a4e"
      : displayCourse.level === "Intermediate"
      ? "#2563eb"
      : "#bb0000";

  const levelBg =
    displayCourse.level === "Beginner"
      ? "rgba(45,138,78,0.1)"
      : displayCourse.level === "Intermediate"
      ? "rgba(37,99,235,0.1)"
      : "rgba(187,0,0,0.1)";

  return (
    /* Backdrop — click outside to close */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{
        backgroundColor: visible ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
        transition: "background-color 300ms ease",
      }}
      onClick={onClose}
    >
      {/* Modal panel */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-t-3xl shadow-2xl overflow-y-auto max-h-[88vh]"
        style={{
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 300ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-white z-10">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="px-6 pb-10 pt-3">
          {/* Header row: icon + title + close */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-13 h-13 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: `${displayCourse.tagColor}18` }}
              >
                {displayCourse.icon}
              </div>
              <div className="min-w-0">
                <h2
                  className="text-lg font-extrabold leading-snug"
                  style={{ color: "#0f1f3d" }}
                >
                  {displayCourse.title}
                </h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{ color: levelColor, backgroundColor: levelBg }}
                  >
                    {displayCourse.level}
                  </span>
                  {displayCourse.badge && (
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: displayCourse.badgeBg ?? "#0f1f3d", color: "#fff" }}
                    >
                      {displayCourse.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shrink-0 ml-3 mt-0.5"
              aria-label="Close preview"
            >
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mb-5" />

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            {displayCourse.description}
          </p>

          {/* What you'll accomplish */}
          <div className="mb-6">
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#0f1f3d" }}
            >
              What you&apos;ll accomplish
            </h3>
            <ul className="space-y-3">
              {displayCourse.accomplishments.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style={{
                      backgroundColor: "rgba(45,138,78,0.12)",
                      color: "#2d8a4e",
                    }}
                  >
                    ✓
                  </span>
                  <span className="text-sm text-gray-600 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Course details grid */}
          <div
            className="grid grid-cols-4 gap-2 rounded-2xl p-4 mb-6"
            style={{ backgroundColor: "#f4f7fb" }}
          >
            {[
              { label: "Lessons", value: String(displayCourse.lessons) },
              { label: "Duration", value: displayCourse.duration },
              { label: "Level", value: displayCourse.level },
              { label: "Certificate", value: "Included ✓" },
            ].map((detail) => (
              <div key={detail.label} className="text-center">
                <div
                  className="text-sm font-bold leading-snug"
                  style={{ color: "#0f1f3d" }}
                >
                  {detail.value}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {detail.label}
                </div>
              </div>
            ))}
          </div>

          {/* Price block */}
          <div
            className="flex items-center justify-between px-4 py-4 rounded-2xl border mb-5"
            style={{ borderColor: "#e5e7eb" }}
          >
            <div>
              <div
                className="text-2xl font-extrabold"
                style={{ color: "#0f1f3d" }}
              >
                KSh {displayCourse.price.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                <span>📱</span>
                <span className="font-medium">M-Pesa accepted</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">One-time payment</div>
              <div className="text-xs font-semibold mt-0.5" style={{ color: "#2d8a4e" }}>
                Lifetime access
              </div>
            </div>
          </div>

          {/* Enroll Now CTA */}
          <button
            className="w-full py-4 text-base font-bold text-white rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{
              backgroundColor: "#2d8a4e",
              boxShadow: "0 4px 24px rgba(45,138,78,0.3)",
            }}
          >
            Enroll Now — KSh {displayCourse.price.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}

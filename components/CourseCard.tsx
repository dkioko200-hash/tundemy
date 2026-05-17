"use client";

interface CourseCardProps {
  slug: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  lessons_count: number;
  price_kes: number;
  icon: React.ReactNode;
  tag: string;
  tag_color: string;
  badge_label?: string;
  badge_bg?: string;
  banner_gradient?: string;
  onPreview: () => void;
  onEnroll: (slug: string) => void;
}

export default function CourseCard({
  slug,
  title,
  description,
  level,
  lessons_count,
  price_kes,
  icon,
  tag,
  tag_color,
  badge_label,
  badge_bg,
  banner_gradient,
  onPreview,
  onEnroll,
}: CourseCardProps) {
  const levelColor =
    level === "Beginner" ? "#2d8a4e" : level === "Intermediate" ? "#2563eb" : "#bb0000";
  const levelBg =
    level === "Beginner"
      ? "rgba(45,138,78,0.1)"
      : level === "Intermediate"
      ? "rgba(37,99,235,0.1)"
      : "rgba(187,0,0,0.1)";
  const bannerStyle = banner_gradient
    ? { background: banner_gradient }
    : { backgroundColor: `${tag_color}20` };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gray-200 flex flex-col">
      <div className="h-16 flex items-center justify-center shrink-0" style={bannerStyle}>
        <span className="text-4xl leading-none">{icon}</span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="shrink-0">
            {badge_label && (
              <span
                className="inline-block text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: badge_bg ?? "#0f1f3d", color: "#ffffff" }}
              >
                {badge_label}
              </span>
            )}
          </div>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full text-right shrink-0"
            style={{ backgroundColor: `${tag_color}15`, color: tag_color }}
          >
            {tag}
          </span>
        </div>

        <h3 className="text-base font-bold mb-2 leading-snug" style={{ color: "#0f1f3d" }}>
          {title}
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">{description}</p>

        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ color: levelColor, backgroundColor: levelBg }}
          >
            {level}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            {lessons_count} lessons
          </span>
          <span className="ml-auto text-sm font-extrabold" style={{ color: "#0f1f3d" }}>
            KSh {price_kes.toLocaleString()}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEnroll(slug)}
            className="flex-1 py-2.5 text-sm font-bold text-white rounded-lg transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#2d8a4e" }}
          >
            Enroll Now
          </button>
          <button
            onClick={onPreview}
            className="px-4 py-2.5 text-sm font-semibold bg-white rounded-lg border-2 transition-all duration-200 hover:bg-gray-50 active:scale-95"
            style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  );
}

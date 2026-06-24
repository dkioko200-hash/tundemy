import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface SlideCue {
  text: string;
  startTime: number;
  endTime: number;
  slideType: "title" | "concept" | "point" | "summary";
}

export interface LessonVideoProps {
  lessonTitle: string;
  audioSrc: string;
  cues: SlideCue[];
}

// ── Design tokens ─────────────────────────────────────────────────────────────

const BG_NAVY = "#0f1f3d";
const BG_TEAL = "#1a3a4a";
const GREEN = "#2d8a4e";
const WHITE = "#ffffff";
const GREY = "#94a3b8";
const FONT = "'Inter','Helvetica Neue',Arial,sans-serif";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fade(f: number, dur: number): number {
  const fadeFrames = Math.min(8, Math.floor(dur * 0.15));
  return interpolate(f, [0, fadeFrames, dur - fadeFrames, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ── Shared components ─────────────────────────────────────────────────────────

function Logo() {
  return (
    <div style={{ position: "absolute", top: 34, left: 52, zIndex: 10 }}>
      <Img src={staticFile("images/tundemy-logo-white.png")} style={{ height: 28 }} />
    </div>
  );
}

// ── TITLE slide ───────────────────────────────────────────────────────────────

function TitleSlide({ f, dur, title }: { f: number; dur: number; title: string }) {
  const tx = interpolate(f, [0, 24], [-220, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOp = interpolate(f, [18, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(f, [4, 52], [0, 1280], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BG_NAVY, fontFamily: FONT, opacity: fade(f, dur) }}>
      <Logo />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
        <div style={{ color: GREEN, fontSize: 16, fontWeight: 600, letterSpacing: 5, textTransform: "uppercase", marginBottom: 22 }}>
          AI Foundations · Lesson 1
        </div>
        <div style={{
          color: WHITE,
          fontSize: 68,
          fontWeight: 800,
          lineHeight: 1.1,
          transform: `translateX(${tx}px)`,
          maxWidth: 880,
        }}>
          {title}
        </div>
        <div style={{ color: GREY, fontSize: 24, marginTop: 22, opacity: subOp }}>
          From Zero to Dangerous in 7 Lessons
        </div>
      </AbsoluteFill>
      {/* Accent bar animates across the bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, height: 7, width: lineW, backgroundColor: GREEN }} />
    </AbsoluteFill>
  );
}

// ── CONCEPT slide — typewriter ─────────────────────────────────────────────────

function ConceptSlide({ f, dur, text }: { f: number; dur: number; text: string }) {
  const typeEnd = Math.max(dur * 0.72, 20);
  const charsVisible = Math.floor(
    interpolate(f, [8, typeEnd], [0, text.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  const cursorOp = charsVisible < text.length ? 1 : interpolate(f, [typeEnd, typeEnd + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BG_TEAL, fontFamily: FONT, opacity: fade(f, dur) }}>
      <Logo />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
        <div style={{ color: GREEN, fontSize: 14, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", marginBottom: 28 }}>
          Key Insight
        </div>
        <div style={{ color: WHITE, fontSize: 38, fontWeight: 700, lineHeight: 1.5, maxWidth: 1050 }}>
          {text.slice(0, charsVisible)}
          <span style={{ opacity: cursorOp, color: GREEN }}>|</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// ── POINT slide — springs up + checkmark ─────────────────────────────────────

function PointSlide({ f, dur, text }: { f: number; dur: number; text: string }) {
  const { fps } = useVideoConfig();
  const sp = spring({ frame: Math.max(0, f - 6), fps, config: { damping: 14, stiffness: 120 } });
  const pY = interpolate(sp, [0, 1], [55, 0]);
  const checkOp = interpolate(f, [Math.max(0, dur - 24), Math.max(0, dur - 12)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BG_NAVY, fontFamily: FONT, opacity: fade(f, dur) }}>
      {/* Green left border */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, backgroundColor: GREEN }} />
      <Logo />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px 0 96px" }}>
        <div style={{
          color: WHITE,
          fontSize: 40,
          fontWeight: 700,
          lineHeight: 1.42,
          maxWidth: 980,
          transform: `translateY(${pY}px)`,
          opacity: sp,
        }}>
          {text}
        </div>
        <div style={{ marginTop: 30, opacity: checkOp, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: GREEN,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ color: WHITE, fontSize: 14, fontWeight: 800 }}>✓</span>
          </div>
          <span style={{ color: GREEN, fontSize: 16, fontWeight: 600 }}>Got it</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// ── SUMMARY slide — all summary cues as bullets ───────────────────────────────

function SummarySlide({ frame, fps, cues }: { frame: number; fps: number; cues: SlideCue[] }) {
  const firstStartFrame = cues[0] ? Math.round(cues[0].startTime * fps) : 0;
  const localF = frame - firstStartFrame;
  const headerOp = interpolate(localF, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BG_NAVY, fontFamily: FONT }}>
      <Logo />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
        <div style={{
          color: GREEN,
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 4,
          textTransform: "uppercase",
          marginBottom: 36,
          opacity: headerOp,
        }}>
          Key Takeaways
        </div>
        {cues.map((cue, i) => {
          const cueStartFrame = Math.round(cue.startTime * fps);
          const op = interpolate(frame, [cueStartFrame, cueStartFrame + 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div key={i} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 18,
              opacity: op,
              marginBottom: i < cues.length - 1 ? 24 : 0,
            }}>
              <div style={{ color: GREEN, fontSize: 20, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>✓</div>
              <div style={{ color: WHITE, fontSize: 30, fontWeight: 600, lineHeight: 1.42 }}>{cue.text}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// ── Main composition ──────────────────────────────────────────────────────────

export const LessonVideo: React.FC<LessonVideoProps> = ({ lessonTitle, audioSrc, cues }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Global progress bar position
  const progressPct = (frame / durationInFrames) * 100;

  // Find current active cue index
  let activeCueIndex = 0;
  for (let i = cues.length - 1; i >= 0; i--) {
    if (frame >= Math.round(cues[i].startTime * fps)) {
      activeCueIndex = i;
      break;
    }
  }

  const activeCue = cues[activeCueIndex];

  if (!activeCue || cues.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: BG_NAVY, fontFamily: FONT }}>
        <Audio src={staticFile(audioSrc)} />
        <Logo />
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: WHITE, fontSize: 48, fontWeight: 800 }}>{lessonTitle}</div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // Compute slide start/end frames
  let slideStartFrame: number;
  let slideEndFrame: number;
  const summaryCues = cues.filter((c) => c.slideType === "summary");

  if (activeCue.slideType === "summary") {
    const firstSummary = summaryCues[0];
    slideStartFrame = Math.round(firstSummary.startTime * fps);
    slideEndFrame = durationInFrames;
  } else {
    slideStartFrame = Math.round(activeCue.startTime * fps);
    slideEndFrame =
      activeCueIndex < cues.length - 1
        ? Math.round(cues[activeCueIndex + 1].startTime * fps)
        : durationInFrames;
  }

  const slideDuration = Math.max(slideEndFrame - slideStartFrame, 4);
  const localFrame = frame - slideStartFrame;

  return (
    <AbsoluteFill style={{ backgroundColor: BG_NAVY }}>
      <Audio src={staticFile(audioSrc)} />

      {activeCue.slideType === "title" && (
        <TitleSlide f={localFrame} dur={slideDuration} title={lessonTitle} />
      )}
      {activeCue.slideType === "concept" && (
        <ConceptSlide f={localFrame} dur={slideDuration} text={activeCue.text} />
      )}
      {activeCue.slideType === "point" && (
        <PointSlide f={localFrame} dur={slideDuration} text={activeCue.text} />
      )}
      {activeCue.slideType === "summary" && (
        <SummarySlide frame={frame} fps={fps} cues={summaryCues} />
      )}

      {/* Global progress bar */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: "rgba(255,255,255,0.08)",
        zIndex: 20,
      }}>
        <div style={{ width: `${progressPct}%`, height: "100%", backgroundColor: GREEN }} />
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface WordTimestamp {
  word: string;
  startTime: number;
  endTime: number;
}

export interface SlideCue {
  text: string;
  startTime: number;
  endTime: number;
  slideType: "title" | "concept" | "point" | "example" | "summary";
  words: WordTimestamp[];
}

export interface LessonVideoProps {
  lessonTitle: string;
  courseName: string;
  avatarSrc: string;
  cues: SlideCue[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const BG_NAVY = "#0f1f3d";
const BG_TEAL = "#1a3a4a";
const GREEN = "#2d8a4e";
const WHITE = "#ffffff";
const GREY = "#94a3b8";
const FONT = "'Inter','Helvetica Neue',Arial,sans-serif";

const LEFT_W = 480;
const RIGHT_W = 800;
const TOTAL_H = 720;

// ── Neural Network (pre-computed) ──────────────────────────────────────────────

const NN_NODES: [number, number][] = [
  [0.08, 0.14], [0.28, 0.06], [0.5, 0.2], [0.72, 0.1], [0.94, 0.28],
  [0.14, 0.44], [0.38, 0.52], [0.62, 0.42], [0.88, 0.6],
  [0.2, 0.78], [0.52, 0.84], [0.8, 0.72],
];

const NN_EDGES: [number, number][] = [];
for (let i = 0; i < NN_NODES.length; i++) {
  for (let j = i + 1; j < NN_NODES.length; j++) {
    const dx = NN_NODES[i][0] - NN_NODES[j][0];
    const dy = NN_NODES[i][1] - NN_NODES[j][1];
    if (Math.sqrt(dx * dx + dy * dy) < 0.34) NN_EDGES.push([i, j]);
  }
}

// ── Particle positions (pre-computed) ─────────────────────────────────────────

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  startX: (i / 24) * RIGHT_W,
  y: 8 + ((i * 19) % 52),
  speed: 0.65 + ((i % 5) * 0.32),
  size: 1.2 + ((i % 3) * 0.7),
  opacity: 0.14 + ((i % 4) * 0.07),
}));

// ── Data bar heights ─────────────────────────────────────────────────────────

const BAR_DEFS = [
  { h: 0.64, d: 4 }, { h: 0.82, d: 7 }, { h: 0.48, d: 10 },
  { h: 0.92, d: 13 }, { h: 0.73, d: 16 },
];

// ── Helper: slide fade ────────────────────────────────────────────────────────

function fade(f: number, dur: number): number {
  const fi = Math.min(8, Math.floor(dur * 0.14));
  return interpolate(f, [0, fi, dur - fi, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ── Neural Network background ─────────────────────────────────────────────────

function NeuralNetwork({ frame, fps }: { frame: number; fps: number }) {
  const secs = frame / fps;
  return (
    <svg
      width={RIGHT_W}
      height={TOTAL_H}
      style={{ position: "absolute", inset: 0, opacity: 0.3 }}
    >
      {NN_EDGES.map(([a, b], i) => {
        const [x1, y1] = NN_NODES[a];
        const [x2, y2] = NN_NODES[b];
        const pA = 0.3 + 0.35 * Math.sin(secs * 1.3 + a * 0.72);
        const pB = 0.3 + 0.35 * Math.sin(secs * 1.3 + b * 0.72);
        return (
          <line
            key={i}
            x1={x1 * RIGHT_W} y1={y1 * TOTAL_H}
            x2={x2 * RIGHT_W} y2={y2 * TOTAL_H}
            stroke={GREEN} strokeWidth={0.7} opacity={(pA + pB) / 2}
          />
        );
      })}
      {NN_NODES.map(([x, y], i) => {
        const p = 0.4 + 0.6 * Math.sin(secs * 1.6 + i * 0.88);
        const r = 2.2 + 1.4 * p;
        return (
          <React.Fragment key={i}>
            <circle cx={x * RIGHT_W} cy={y * TOTAL_H} r={r * 2.8} fill={GREEN} opacity={p * 0.12} />
            <circle cx={x * RIGHT_W} cy={y * TOTAL_H} r={r} fill={GREEN} opacity={p} />
          </React.Fragment>
        );
      })}
    </svg>
  );
}

// ── Particle stream ───────────────────────────────────────────────────────────

function ParticleStream({ frame }: { frame: number }) {
  return (
    <svg width={RIGHT_W} height={65} style={{ position: "absolute", top: 0, left: 0 }}>
      {PARTICLES.map((p, i) => {
        const x = (p.startX + frame * p.speed) % RIGHT_W;
        return <circle key={i} cx={x} cy={p.y} r={p.size} fill={GREEN} opacity={p.opacity} />;
      })}
    </svg>
  );
}

// ── Dot grid (rotating) ───────────────────────────────────────────────────────

function DotGrid({ frame, fps }: { frame: number; fps: number }) {
  const rotation = (frame / fps) * 0.4;
  return (
    <svg width={RIGHT_W} height={TOTAL_H} style={{ position: "absolute", inset: 0, opacity: 0.045 }}>
      <defs>
        <pattern id="dotGrid" x="0" y="0" width="32" height="28" patternUnits="userSpaceOnUse">
          <circle cx="16" cy="14" r="1.5" fill={GREEN} />
        </pattern>
      </defs>
      <g transform={`rotate(${rotation}, ${RIGHT_W / 2}, ${TOTAL_H / 2})`}>
        <rect x="-100%" y="-100%" width="300%" height="300%" fill="url(#dotGrid)" />
      </g>
    </svg>
  );
}

// ── Circuit sweep (transition) ────────────────────────────────────────────────

function CircuitSweep({ localFrame }: { localFrame: number }) {
  if (localFrame > 14) return null;
  const x = interpolate(localFrame, [0, 11], [0, RIGHT_W], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = interpolate(localFrame, [0, 2, 9, 14], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width={RIGHT_W} height={TOTAL_H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <defs>
        <filter id="lineGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <line x1={x} y1={0} x2={x} y2={TOTAL_H} stroke={GREEN} strokeWidth={2.5} opacity={op} filter="url(#lineGlow)" />
      <line x1={Math.max(0, x - 45)} y1={TOTAL_H * 0.22} x2={x} y2={TOTAL_H * 0.22} stroke={GREEN} strokeWidth={0.9} opacity={op * 0.55} />
      <line x1={Math.max(0, x - 65)} y1={TOTAL_H * 0.5} x2={x} y2={TOTAL_H * 0.5} stroke={GREEN} strokeWidth={0.9} opacity={op * 0.55} />
      <line x1={Math.max(0, x - 35)} y1={TOTAL_H * 0.78} x2={x} y2={TOTAL_H * 0.78} stroke={GREEN} strokeWidth={0.9} opacity={op * 0.55} />
    </svg>
  );
}

// ── Data bars (point slide) ───────────────────────────────────────────────────

function DataBars({ localFrame, fps }: { localFrame: number; fps: number }) {
  return (
    <div style={{ position: "absolute", bottom: 68, right: 36, display: "flex", gap: 7, alignItems: "flex-end", height: 76 }}>
      {BAR_DEFS.map((bar, i) => {
        const sp = spring({ frame: Math.max(0, localFrame - bar.d), fps, config: { damping: 12, stiffness: 100 } });
        return (
          <div key={i} style={{
            width: 7, height: sp * bar.h * 76,
            backgroundColor: GREEN, opacity: 0.45 + sp * 0.5,
            borderRadius: 2,
          }} />
        );
      })}
    </div>
  );
}

// ── Self-drawing checkmark ────────────────────────────────────────────────────

function AnimatedCheckmark({ localFrame, dur }: { localFrame: number; dur: number }) {
  const TOTAL = 22;
  const offset = interpolate(
    localFrame,
    [Math.max(0, dur - 24), Math.max(2, dur - 10)],
    [TOTAL, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const glowOp = interpolate(localFrame, [Math.max(0, dur - 24), Math.max(2, dur - 10)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 28, opacity: glowOp }}>
      <svg width={26} height={26} viewBox="0 0 24 24">
        <path d="M 4 12 L 9 17 L 20 6" fill="none" stroke={GREEN} strokeWidth={2.5}
          strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={TOTAL} strokeDashoffset={offset} />
      </svg>
      <span style={{ color: GREEN, fontSize: 15, fontWeight: 600, fontFamily: FONT }}>Got it</span>
    </div>
  );
}

// ── Wordmark ──────────────────────────────────────────────────────────────────

function Wordmark() {
  return (
    <div style={{ position: "absolute", top: 22, right: 32, zIndex: 10 }}>
      <Img src={staticFile("images/tundemy-logo-white.png")} style={{ height: 22, opacity: 0.8 }} />
    </div>
  );
}

// ── SLIDE: Title ──────────────────────────────────────────────────────────────

function TitleSlide({ f, dur, title }: { f: number; dur: number; title: string }) {
  const tx = interpolate(f, [0, 22], [-200, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOp = interpolate(f, [18, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(f, [4, 52], [0, RIGHT_W], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: BG_NAVY, fontFamily: FONT, overflow: "hidden", opacity: fade(f, dur) }}>
      <div style={{
        position: "absolute", left: 56, right: 60, top: 0, bottom: 0,
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <div style={{ color: GREEN, fontSize: 13, fontWeight: 600, letterSpacing: 5, textTransform: "uppercase", marginBottom: 20 }}>
          Lesson 1 Introduction
        </div>
        <div style={{ color: WHITE, fontSize: 54, fontWeight: 800, lineHeight: 1.12, transform: `translateX(${tx}px)` }}>
          {title}
        </div>
        <div style={{ color: GREY, fontSize: 20, marginTop: 20, opacity: subOp }}>
          From Zero to Dangerous in 7 Lessons
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, height: 6, width: lineW, backgroundColor: GREEN }} />
    </div>
  );
}

// ── SLIDE: Concept ────────────────────────────────────────────────────────────

function ConceptSlide({ f, dur, text }: { f: number; dur: number; text: string }) {
  const typeEnd = Math.max(dur * 0.72, 20);
  const charsVisible = Math.floor(
    interpolate(f, [8, typeEnd], [0, text.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  const cursorOp = charsVisible < text.length
    ? 1
    : interpolate(f, [typeEnd, typeEnd + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: BG_TEAL, fontFamily: FONT, overflow: "hidden", opacity: fade(f, dur) }}>
      <div style={{
        position: "absolute", left: 56, right: 60, top: 0, bottom: 0,
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <div style={{ color: GREEN, fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", marginBottom: 24 }}>
          Key Insight
        </div>
        <div style={{ color: WHITE, fontSize: 34, fontWeight: 700, lineHeight: 1.52 }}>
          {text.slice(0, charsVisible)}
          <span style={{ opacity: cursorOp, color: GREEN }}>|</span>
        </div>
      </div>
    </div>
  );
}

// ── SLIDE: Point ──────────────────────────────────────────────────────────────

function PointSlide({ f, dur, text, fps }: { f: number; dur: number; text: string; fps: number }) {
  const sp = spring({ frame: Math.max(0, f - 6), fps, config: { damping: 14, stiffness: 115 } });
  const pY = interpolate(sp, [0, 1], [52, 0]);

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: BG_NAVY, fontFamily: FONT, overflow: "hidden", opacity: fade(f, dur) }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, backgroundColor: GREEN }} />
      <div style={{
        position: "absolute", left: 66, right: 60, top: 0, bottom: 0,
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <div style={{ color: WHITE, fontSize: 34, fontWeight: 700, lineHeight: 1.46, transform: `translateY(${pY}px)`, opacity: sp }}>
          {text}
        </div>
        <AnimatedCheckmark localFrame={f} dur={dur} />
      </div>
      <DataBars localFrame={f} fps={fps} />
    </div>
  );
}

// ── SLIDE: Example ────────────────────────────────────────────────────────────

function ExampleSlide({ f, dur, text, words, fps }: {
  f: number; dur: number; text: string; words: WordTimestamp[]; fps: number;
}) {
  const glowPulse = 0.5 + 0.5 * Math.sin((f / fps) * Math.PI * 1.8);
  const boxOp = interpolate(f, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Word-by-word reveal
  const useWordTimings = words.length > 1;
  const wordList = useWordTimings ? words : text.split(" ").map((w, i, arr) => ({
    word: w,
    startTime: (f / fps) + (i / arr.length) * (dur / fps) * 0.7,
    endTime: (f / fps) + ((i + 1) / arr.length) * (dur / fps) * 0.7,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: BG_NAVY, fontFamily: FONT, overflow: "hidden", opacity: fade(f, dur) }}>
      <div style={{
        position: "absolute", left: 44, right: 44, top: 0, bottom: 0,
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <div style={{ color: GREEN, fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>
          Example
        </div>
        <div style={{
          color: WHITE, fontSize: 32, fontWeight: 700, lineHeight: 1.55,
          padding: "20px 24px",
          border: `2px solid rgba(45,138,78,${0.3 + glowPulse * 0.4})`,
          borderRadius: 12,
          opacity: boxOp,
          boxShadow: `0 0 ${12 + glowPulse * 22}px rgba(45,138,78,${0.15 + glowPulse * 0.2})`,
        }}>
          {useWordTimings
            ? wordList.map((w, i) => {
                const wOp = interpolate(f, [Math.round(w.startTime * fps), Math.round(w.startTime * fps) + 6], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                return (
                  <span key={i} style={{ opacity: wOp }}>{w.word}{i < wordList.length - 1 ? " " : ""}</span>
                );
              })
            : text}
        </div>
      </div>
    </div>
  );
}

// ── SLIDE: Summary ────────────────────────────────────────────────────────────

function SummarySlide({ frame, fps, cues }: { frame: number; fps: number; cues: SlideCue[] }) {
  const firstFrame = cues[0] ? Math.round(cues[0].startTime * fps) : 0;
  const localF = frame - firstFrame;
  const headerOp = interpolate(localF, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: BG_NAVY, fontFamily: FONT, overflow: "hidden" }}>
      <div style={{
        position: "absolute", left: 56, right: 60, top: 0, bottom: 0,
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <div style={{ color: GREEN, fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", marginBottom: 30, opacity: headerOp }}>
          Key Takeaways
        </div>
        {cues.map((cue, i) => {
          const startF = Math.round(cue.startTime * fps);
          const op = interpolate(frame, [startF, startF + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ display: "flex", gap: 16, opacity: op, marginBottom: i < cues.length - 1 ? 22 : 0 }}>
              <div style={{ color: GREEN, fontSize: 18, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>✓</div>
              <div style={{ color: WHITE, fontSize: 28, fontWeight: 600, lineHeight: 1.42 }}>{cue.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main composition ──────────────────────────────────────────────────────────

export const LessonVideo: React.FC<LessonVideoProps> = ({ lessonTitle, avatarSrc, cues }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const progressPct = (frame / durationInFrames) * 100;

  // Determine active cue
  let activeCueIndex = 0;
  for (let i = cues.length - 1; i >= 0; i--) {
    if (frame >= Math.round(cues[i].startTime * fps)) {
      activeCueIndex = i;
      break;
    }
  }

  const activeCue = cues[activeCueIndex];
  const summaryCues = cues.filter((c) => c.slideType === "summary");

  // Slide frame window
  let slideStartFrame: number;
  let slideEndFrame: number;

  if (activeCue?.slideType === "summary") {
    slideStartFrame = summaryCues[0] ? Math.round(summaryCues[0].startTime * fps) : 0;
    slideEndFrame = durationInFrames;
  } else {
    slideStartFrame = activeCue ? Math.round(activeCue.startTime * fps) : 0;
    slideEndFrame =
      activeCueIndex < cues.length - 1
        ? Math.round(cues[activeCueIndex + 1].startTime * fps)
        : durationInFrames;
  }

  const slideDur = Math.max(slideEndFrame - slideStartFrame, 4);
  const localF = frame - slideStartFrame;

  return (
    <AbsoluteFill style={{ backgroundColor: BG_NAVY }}>

      {/* LEFT PANEL — HeyGen avatar */}
      <div style={{ position: "absolute", left: 0, top: 0, width: LEFT_W, height: TOTAL_H }}>
        {avatarSrc && (
          <OffthreadVideo
            src={staticFile(avatarSrc)}
            style={{ width: LEFT_W, height: TOTAL_H, objectFit: "cover" }}
          />
        )}
        {/* thin divider */}
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 1, backgroundColor: "rgba(45,138,78,0.25)" }} />
      </div>

      {/* RIGHT PANEL — animated slides */}
      <div style={{ position: "absolute", left: LEFT_W, top: 0, width: RIGHT_W, height: TOTAL_H, overflow: "hidden" }}>

        {/* Background layers (always visible) */}
        <DotGrid frame={frame} fps={fps} />
        <NeuralNetwork frame={frame} fps={fps} />
        <ParticleStream frame={frame} />

        {/* Slide content */}
        {activeCue && (
          <>
            {activeCue.slideType === "title" && (
              <TitleSlide f={localF} dur={slideDur} title={lessonTitle} />
            )}
            {activeCue.slideType === "concept" && (
              <ConceptSlide f={localF} dur={slideDur} text={activeCue.text} />
            )}
            {activeCue.slideType === "point" && (
              <PointSlide f={localF} dur={slideDur} text={activeCue.text} fps={fps} />
            )}
            {activeCue.slideType === "example" && (
              <ExampleSlide f={localF} dur={slideDur} text={activeCue.text} words={activeCue.words} fps={fps} />
            )}
            {activeCue.slideType === "summary" && (
              <SummarySlide frame={frame} fps={fps} cues={summaryCues} />
            )}
          </>
        )}

        {!activeCue && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ color: WHITE, fontSize: 36, fontWeight: 800, fontFamily: FONT }}>{lessonTitle}</div>
          </div>
        )}

        {/* Transition sweep */}
        <CircuitSweep localFrame={localF} />

        {/* Tundemy wordmark */}
        <Wordmark />
      </div>

      {/* Global progress bar (full width) */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, backgroundColor: "rgba(255,255,255,0.07)", zIndex: 20 }}>
        <div style={{ width: `${progressPct}%`, height: "100%", backgroundColor: GREEN }} />
      </div>

    </AbsoluteFill>
  );
};

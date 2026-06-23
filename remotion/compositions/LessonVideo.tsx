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

export interface LessonVideoProps {
  lessonTitle: string;
  subtitle: string;
  hook: string;
  concept: string;
  conceptDefinition: string;
  keyPoints: string[];
  audioSrc: string;
}

const SLIDE_WEIGHTS = [3, 4, 4, 3.5, 3.5, 3.5, 3.5, 3.5, 4, 3];
const TOTAL_WEIGHT = SLIDE_WEIGHTS.reduce((a, b) => a + b, 0);

const BG_NAVY = "#0f1f3d";
const BG_TEAL = "#1a3a4a";
const BG_GREEN_DARK = "#0d2d1f";
const GREEN = "#2d8a4e";
const WHITE = "#ffffff";
const GREY = "#94a3b8";
const FONT = "'Inter','Helvetica Neue',Arial,sans-serif";

function computeSlides(total: number): number[] {
  const frames = SLIDE_WEIGHTS.map((w) => Math.round((w / TOTAL_WEIGHT) * total));
  const diff = total - frames.reduce((a, b) => a + b, 0);
  frames[frames.length - 1] += diff;
  return frames;
}

function fade(f: number, dur: number): number {
  return interpolate(f, [0, 8, dur - 6, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ── Logo ────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div style={{ position: "absolute", top: 36, left: 52 }}>
      <Img src={staticFile("images/tundemy-logo-white.png")} style={{ height: 30 }} />
    </div>
  );
}

// ── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 5, backgroundColor: "rgba(255,255,255,0.08)" }}>
      <div style={{ width: `${((current + 1) / total) * 100}%`, height: "100%", backgroundColor: GREEN }} />
    </div>
  );
}

// ── SLIDE 1: Title Card ───────────────────────────────────────────────────────

function TitleSlide({ f, dur, title, subtitle }: { f: number; dur: number; title: string; subtitle: string }) {
  const tx = interpolate(f, [0, 22], [-220, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOp = interpolate(f, [18, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(f, [6, 50], [0, 1280], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BG_NAVY, fontFamily: FONT, opacity: fade(f, dur) }}>
      <Logo />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
        <div style={{ color: GREEN, fontSize: 17, fontWeight: 600, letterSpacing: 5, textTransform: "uppercase", marginBottom: 22 }}>
          AI Foundations · Lesson 1
        </div>
        <div style={{ color: WHITE, fontSize: 66, fontWeight: 800, lineHeight: 1.12, transform: `translateX(${tx}px)`, maxWidth: 860 }}>
          {title}
        </div>
        <div style={{ color: GREY, fontSize: 26, marginTop: 22, opacity: subOp }}>
          {subtitle}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", bottom: 0, left: 0, height: 6, width: lineW, backgroundColor: GREEN }} />
    </AbsoluteFill>
  );
}

// ── SLIDE 2: Hook / Typewriter ────────────────────────────────────────────────

function HookSlide({ f, dur, hook }: { f: number; dur: number; hook: string }) {
  const charsVisible = Math.floor(
    interpolate(f, [10, 65], [0, hook.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  const pulse = Math.abs(Math.sin((f / 12) * Math.PI));

  return (
    <AbsoluteFill style={{ backgroundColor: BG_TEAL, fontFamily: FONT, opacity: fade(f, dur) }}>
      <Logo />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
        <div style={{ color: GREEN, fontSize: 17, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", marginBottom: 32 }}>
          Consider this
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 22 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: GREEN, flexShrink: 0, marginTop: 14, opacity: pulse }} />
          <div style={{ color: WHITE, fontSize: 40, fontWeight: 700, lineHeight: 1.35, maxWidth: 980 }}>
            {hook.slice(0, charsVisible)}
            <span style={{ opacity: charsVisible < hook.length ? 1 : 0, color: GREEN }}>|</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// ── SLIDE 3: Concept Intro ───────────────────────────────────────────────────

function ConceptSlide({ f, dur, concept, definition }: { f: number; dur: number; concept: string; definition: string }) {
  const cx = interpolate(f, [10, 28], [200, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const defOp = interpolate(f, [22, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const numOp = interpolate(f, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BG_NAVY, fontFamily: FONT, opacity: fade(f, dur) }}>
      <Logo />
      <AbsoluteFill style={{ display: "flex" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 60px 0 80px" }}>
          <div style={{ color: GREEN, fontSize: 17, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", marginBottom: 24 }}>
            What you will learn
          </div>
          <div style={{ color: WHITE, fontSize: 50, fontWeight: 800, lineHeight: 1.2, transform: `translateX(${cx}px)` }}>
            {concept}
          </div>
          <div style={{ color: GREY, fontSize: 22, lineHeight: 1.65, marginTop: 20, opacity: defOp, maxWidth: 520 }}>
            {definition}
          </div>
        </div>
        <div style={{ width: 340, backgroundColor: BG_GREEN_DARK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: numOp }}>
          <div style={{ color: GREEN, fontSize: 116, fontWeight: 900, lineHeight: 1 }}>7</div>
          <div style={{ color: GREY, fontSize: 18, letterSpacing: 3, textTransform: "uppercase", marginTop: 8 }}>Lessons</div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 5, backgroundColor: GREEN }} />
    </AbsoluteFill>
  );
}

// ── SLIDES 4-8: Key Points ───────────────────────────────────────────────────

function KeyPointSlide({ f, dur, point, index, total, bg }: {
  f: number; dur: number; point: string; index: number; total: number; bg: string;
}) {
  const { fps } = useVideoConfig();
  const sp = spring({ frame: Math.max(0, f - 8), fps, config: { damping: 14, stiffness: 120 } });
  const pY = interpolate(sp, [0, 1], [60, 0]);
  const pOp = sp;
  const checkOp = interpolate(f, [dur - 24, dur - 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const isEven = index % 2 === 0;

  return (
    <AbsoluteFill style={{ backgroundColor: bg, fontFamily: FONT, opacity: fade(f, dur) }}>
      <Logo />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", alignItems: isEven ? "flex-start" : "center" }}>
        <div style={{ color: GREEN, fontSize: 15, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", marginBottom: 28 }}>
          Takeaway {index + 1} of {total}
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 26, transform: `translateY(${pY}px)`, opacity: pOp, maxWidth: 900 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: GREEN, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 6 }}>
            <span style={{ color: WHITE, fontSize: 20, fontWeight: 700 }}>{index + 1}</span>
          </div>
          <div style={{ color: WHITE, fontSize: isEven ? 42 : 38, fontWeight: 700, lineHeight: 1.32 }}>{point}</div>
        </div>
        <div style={{ marginTop: 38, opacity: checkOp, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", backgroundColor: GREEN, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: WHITE, fontSize: 16, fontWeight: 700 }}>✓</span>
          </div>
          <span style={{ color: GREEN, fontSize: 17, fontWeight: 600 }}>Got it</span>
        </div>
      </AbsoluteFill>
      <ProgressBar current={index} total={total} />
    </AbsoluteFill>
  );
}

// ── SLIDE 9: Summary ──────────────────────────────────────────────────────────

function SummarySlide({ f, dur, points }: { f: number; dur: number; points: string[] }) {
  return (
    <AbsoluteFill style={{ backgroundColor: BG_NAVY, fontFamily: FONT, opacity: fade(f, dur) }}>
      <Logo />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
        <div style={{ color: GREEN, fontSize: 17, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", marginBottom: 36 }}>
          Key Takeaways
        </div>
        {points.map((p, i) => {
          const op = interpolate(f, [8 + i * 14, 26 + i * 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <React.Fragment key={i}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 18, opacity: op, paddingBottom: 18 }}>
                <div style={{ color: GREEN, fontSize: 19, fontWeight: 700, flexShrink: 0, marginTop: 3 }}>✓</div>
                <div style={{ color: WHITE, fontSize: 22, lineHeight: 1.5 }}>{p}</div>
              </div>
              {i < points.length - 1 && (
                <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.1)", marginBottom: 18, opacity: op }} />
              )}
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
      <div style={{ position: "absolute", bottom: 36, right: 52 }}>
        <Img src={staticFile("images/tundemy-logo-white.png")} style={{ height: 26, opacity: 0.45 }} />
      </div>
    </AbsoluteFill>
  );
}

// ── SLIDE 10: End Card ────────────────────────────────────────────────────────

function EndSlide({ f, dur }: { f: number; dur: number }) {
  const { fps } = useVideoConfig();
  const greenH = interpolate(f, [0, 22], ["0%", "100%"], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagOp = interpolate(f, [20, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const nextOp = interpolate(f, [32, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sp = spring({ frame: Math.max(0, f - 22), fps, config: { damping: 9 } });
  const logoScale = 0.88 + sp * 0.16;

  return (
    <AbsoluteFill style={{ backgroundColor: BG_NAVY, fontFamily: FONT, opacity: fade(f, dur) }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: greenH, backgroundColor: GREEN }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 1 }}>
        <div style={{ transform: `scale(${logoScale})`, marginBottom: 28 }}>
          <Img src={staticFile("images/tundemy-logo-white.png")} style={{ height: 52 }} />
        </div>
        <div style={{ color: WHITE, fontSize: 50, fontWeight: 800, textAlign: "center", opacity: tagOp, letterSpacing: 0.5 }}>
          Your skills bear fruit.
        </div>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 22, marginTop: 28, opacity: nextOp, display: "flex", alignItems: "center", gap: 10 }}>
          <span>Next Lesson</span>
          <span style={{ fontSize: 24 }}>→</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// ── Main composition ──────────────────────────────────────────────────────────

const KP_BACKGROUNDS = [BG_NAVY, BG_GREEN_DARK, BG_NAVY, BG_GREEN_DARK, BG_NAVY];

export const LessonVideo: React.FC<LessonVideoProps> = ({
  lessonTitle, subtitle, hook, concept, conceptDefinition, keyPoints, audioSrc,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const slideFrames = computeSlides(durationInFrames);
  let acc = 0;
  const slideStarts = slideFrames.map((sf) => { const s = acc; acc += sf; return s; });

  let slideIndex = 0;
  for (let i = slideStarts.length - 1; i >= 0; i--) {
    if (frame >= slideStarts[i]) { slideIndex = i; break; }
  }

  const localFrame = frame - slideStarts[slideIndex];
  const slideDuration = slideFrames[slideIndex];

  return (
    <AbsoluteFill style={{ backgroundColor: BG_NAVY }}>
      <Audio src={staticFile(audioSrc)} />
      {slideIndex === 0 && <TitleSlide f={localFrame} dur={slideDuration} title={lessonTitle} subtitle={subtitle} />}
      {slideIndex === 1 && <HookSlide f={localFrame} dur={slideDuration} hook={hook} />}
      {slideIndex === 2 && <ConceptSlide f={localFrame} dur={slideDuration} concept={concept} definition={conceptDefinition} />}
      {slideIndex >= 3 && slideIndex <= 7 && (
        <KeyPointSlide
          f={localFrame} dur={slideDuration}
          point={keyPoints[slideIndex - 3]}
          index={slideIndex - 3}
          total={keyPoints.length}
          bg={KP_BACKGROUNDS[slideIndex - 3]}
        />
      )}
      {slideIndex === 8 && <SummarySlide f={localFrame} dur={slideDuration} points={keyPoints} />}
      {slideIndex === 9 && <EndSlide f={localFrame} dur={slideDuration} />}
    </AbsoluteFill>
  );
};

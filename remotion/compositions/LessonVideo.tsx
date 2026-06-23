import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface LessonVideoProps {
  lessonTitle: string;
  keyPoints: string[];
  audioSrc: string;
}

const POINT_ENTRY_FRAME = 60;
const POINT_DURATION = 150;

export const LessonVideo: React.FC<LessonVideoProps> = ({
  lessonTitle,
  keyPoints,
  audioSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0f1f3d",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        padding: "48px 64px",
      }}
    >
      {/* Audio voiceover */}
      {audioSrc && <Audio src={staticFile(audioSrc)} />}

      {/* Tundemy wordmark — top left */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "auto",
        }}
      >
        <Img
          src={staticFile("images/tundemy-logo-white.png")}
          style={{ height: "36px", objectFit: "contain" }}
        />
      </div>

      {/* Lesson title — centered */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          textAlign: "center",
          opacity: titleOpacity,
          width: "80%",
        }}
      >
        <div
          style={{
            color: "#2d8a4e",
            fontSize: "22px",
            fontWeight: 600,
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          AI Foundations
        </div>
        <div
          style={{
            color: "#ffffff",
            fontSize: "54px",
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          {lessonTitle}
        </div>
      </div>

      {/* Key points — fade in one by one below mid-point */}
      <div
        style={{
          position: "absolute",
          bottom: "96px",
          left: "64px",
          right: "64px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {keyPoints.map((point, i) => {
          const startFrame = POINT_ENTRY_FRAME + i * Math.floor(POINT_DURATION / 1.5);
          const pointOpacity = interpolate(
            frame,
            [startFrame, startFrame + 25],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const pointY = interpolate(
            frame,
            [startFrame, startFrame + 25],
            [18, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                opacity: pointOpacity,
                transform: `translateY(${pointY}px)`,
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#2d8a4e",
                  flexShrink: 0,
                  marginTop: "8px",
                }}
              />
              <div
                style={{
                  color: "#e2e8f0",
                  fontSize: "22px",
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
              >
                {point}
              </div>
            </div>
          );
        })}
      </div>

      {/* Green accent bar — bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "6px",
          backgroundColor: "#2d8a4e",
        }}
      />
    </AbsoluteFill>
  );
};

import React from "react";
import { Composition, registerRoot } from "remotion";
import { LessonVideo } from "./compositions/LessonVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LessonVideo"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={LessonVideo as React.ComponentType<any>}
        durationInFrames={2700}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          lessonTitle: "Welcome to AI Foundations",
          keyPoints: [
            "Use AI for any professional task better than someone with 3 years experience",
            "Build AI workflows that save you 2 hours every single working day",
            "Write, research and analyse at professional standard using AI tools",
            "Understand exactly what AI can and cannot do",
            "Graduate to the Tundemy talent pool with a verified AI credential",
          ],
          audioSrc: "audio/ai-foundations/lesson-0.mp3",
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);

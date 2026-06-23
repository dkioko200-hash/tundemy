import React from "react";
import { Composition, registerRoot, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { LessonVideo, type LessonVideoProps } from "./compositions/LessonVideo";

const FPS = 30;

const calculateMetadata = async ({ props }: { props: LessonVideoProps }) => {
  const duration = await getAudioDurationInSeconds(staticFile(props.audioSrc));
  return { durationInFrames: Math.ceil(duration * FPS) };
};

const defaultProps: LessonVideoProps = {
  lessonTitle: "Welcome to AI Foundations",
  subtitle: "From Zero to Dangerous in 7 Lessons",
  hook: "In 2024 a Nairobi marketing agency replaced three content writers with one person who knew how to use AI. That person now earns three times what the writers did. This course is your path to becoming that person.",
  concept: "5 Career-Changing Skills",
  conceptDefinition: "Master AI tools that will transform your professional output and earning potential — no coding required.",
  keyPoints: [
    "Use AI for any professional task better than someone with 3 years experience",
    "Build AI workflows that save you 2 hours every single working day",
    "Write, research and analyse at professional standard using AI tools",
    "Understand exactly what AI can and cannot do",
    "Graduate to the Tundemy talent pool with a verified AI credential",
  ],
  audioSrc: "audio/ai-foundations/lesson-0.mp3",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LessonVideo"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={LessonVideo as React.ComponentType<any>}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        calculateMetadata={calculateMetadata as any}
        durationInFrames={2700}
        fps={FPS}
        width={1280}
        height={720}
        defaultProps={defaultProps}
      />
    </>
  );
};

registerRoot(RemotionRoot);

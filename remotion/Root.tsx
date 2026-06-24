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
  audioSrc: "audio/ai-foundations/lesson-0.mp3",
  cues: [],
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

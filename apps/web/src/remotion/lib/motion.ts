import { interpolate, spring } from "remotion";

export const SPRING_SNAPPY = { damping: 14, stiffness: 180 };
export const SPRING_BOUNCY = { damping: 10, stiffness: 140 };

export function slideIn(
  frame: number,
  fps: number,
  delay = 0,
  fromY = 80,
  config = SPRING_SNAPPY
) {
  const progress = spring({ frame: frame - delay, fps, config });
  return {
    opacity: interpolate(progress, [0, 1], [0, 1]),
    translateY: interpolate(progress, [0, 1], [fromY, 0]),
    scale: interpolate(progress, [0, 1], [0.92, 1]),
  };
}

export function popIn(frame: number, fps: number, delay = 0) {
  const progress = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });
  return {
    opacity: interpolate(progress, [0, 1], [0, 1]),
    scale: progress,
  };
}

export function fadeIn(frame: number, start: number, end: number) {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

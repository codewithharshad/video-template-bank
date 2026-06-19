import { useVideoConfig } from "remotion";

/** Tighter insets when the composition is cropped for content-sized export. */
export function useCompactPadding(large = 60): number {
  const { width, height } = useVideoConfig();
  return Math.min(width, height) < 960 ? 12 : large;
}

export function useCompactInsets(large = { vertical: 60, horizontal: 60 }): {
  vertical: number;
  horizontal: number;
} {
  const { width, height } = useVideoConfig();
  const compact = Math.min(width, height) < 960;
  return compact ? { vertical: 12, horizontal: 12 } : large;
}

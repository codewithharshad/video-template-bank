import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { resolveBg } from "../lib/background";

export interface ZoomTransitionProps {
  text: string;
  accentColor: string;
  backgroundColor: string;
}

export const ZoomTransition: React.FC<ZoomTransitionProps> = ({
  text,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();

  const zoom = interpolate(frame, [0, 15, 30, 45], [1, 3, 3, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const flash = interpolate(frame, [0, 5, 10, 20], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveBg(backgroundColor, "#ef4444"),
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#fff",
          opacity: flash * 0.8,
        }}
      />
      <span
        style={{
          fontSize: 96,
          fontWeight: 900,
          color: accentColor,
          transform: `scale(${zoom})`,
          fontFamily: "Inter, system-ui, sans-serif",
          letterSpacing: "0.05em",
        }}
      >
        {text}
      </span>
    </AbsoluteFill>
  );
};

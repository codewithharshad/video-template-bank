import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { isTransparentBg, resolveBg } from "../lib/background";
import { useCompactPadding } from "../lib/compact-layout";

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
  const transparent = isTransparentBg(backgroundColor);
  const padding = useCompactPadding(0);

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
        padding,
      }}
    >
      {!transparent && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#fff",
            opacity: flash * 0.8,
          }}
        />
      )}
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

import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { isTransparentBg } from "../lib/background";

export interface ThreePointRevealProps {
  title: string;
  point1: string;
  point2: string;
  point3: string;
  accentColor: string;
  backgroundColor?: string;
}

export const ThreePointReveal: React.FC<ThreePointRevealProps> = ({
  title,
  point1,
  point2,
  point3,
  accentColor,
  backgroundColor = "#0f172a",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const points = [point1, point2, point3];
  const transparent = isTransparentBg(backgroundColor);

  return (
    <AbsoluteFill
      style={{
        background: transparent
          ? undefined
          : `linear-gradient(135deg, ${backgroundColor} 0%, #1e1b4b 100%)`,
        backgroundColor: transparent ? undefined : backgroundColor,
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "80px 100px",
      }}
    >
      <h1
        style={{
          fontSize: 56,
          fontWeight: 800,
          color: "#fff",
          marginBottom: 48,
          opacity: interpolate(frame, [0, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {title}
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {points.map((point, i) => {
          const delay = 20 + i * 18;
          const scale = spring({
            frame: frame - delay,
            fps,
            config: { damping: 14, stiffness: 140 },
          });
          const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity,
                transform: `scale(${scale}) translateX(${interpolate(frame - delay, [0, 10], [-30, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}px)`,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: accentColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <span
                style={{
                  fontSize: 36,
                  color: "#e4e4e7",
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                {point}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

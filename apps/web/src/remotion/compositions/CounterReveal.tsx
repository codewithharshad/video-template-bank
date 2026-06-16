import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { isTransparentBg, resolveBg, textGlow } from "../lib/background";

export interface CounterRevealProps {
  value: number;
  suffix: string;
  label: string;
  accentColor: string;
  backgroundColor: string;
}

export const CounterReveal: React.FC<CounterRevealProps> = ({
  value,
  suffix,
  label,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const transparent = isTransparentBg(backgroundColor);

  const countProgress = interpolate(frame, [10, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const displayValue = Math.round(value * countProgress);

  const scale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveBg(backgroundColor, "#030712"),
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 140,
            fontWeight: 900,
            color: accentColor,
            transform: `scale(${scale})`,
            fontFamily: "Inter, system-ui, sans-serif",
            lineHeight: 1,
            textShadow: textGlow(accentColor, transparent),
          }}
        >
          {displayValue}
          {suffix}
        </div>
        <p
          style={{
            marginTop: 32,
            fontSize: 36,
            color: "#e4e4e7",
            opacity: interpolate(frame, [50, 70], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            fontFamily: "Inter, system-ui, sans-serif",
            maxWidth: 600,
          }}
        >
          {label}
        </p>
      </div>
    </AbsoluteFill>
  );
};

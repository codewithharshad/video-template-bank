import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { isTransparentBg, resolveBg } from "../lib/background";

export interface SaasMetricCardProps {
  metricLabel: string;
  metricValue: string;
  changePercent: number;
  headline: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor?: string;
}

export const SaasMetricCard: React.FC<SaasMetricCardProps> = ({
  metricLabel,
  metricValue,
  changePercent,
  headline,
  primaryColor,
  accentColor,
  backgroundColor = "#0c0a1d",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const transparent = isTransparentBg(backgroundColor);
  const isPositive = changePercent >= 0;

  const cardScale = spring({
    frame: frame - 8,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveBg(backgroundColor, "#0c0a1d"),
        background: transparent
          ? undefined
          : `radial-gradient(circle at 20% 20%, ${primaryColor}25 0%, ${backgroundColor} 55%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 780,
          transform: `scale(${cardScale})`,
          opacity: interpolate(frame, [0, 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <p
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#f4f4f5",
            marginBottom: 28,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {headline}
        </p>

        <div
          style={{
            borderRadius: 20,
            border: transparent ? `1px solid ${primaryColor}40` : "1px solid rgba(255,255,255,0.08)",
            background: transparent ? undefined : "rgba(255,255,255,0.04)",
            padding: "32px 36px",
            backdropFilter: transparent ? undefined : "blur(16px)",
          }}
        >
          <p
            style={{
              fontSize: 22,
              color: "#a1a1aa",
              marginBottom: 8,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            {metricLabel}
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <span
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: "#fff",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              {metricValue}
            </span>
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: isPositive ? "#34d399" : "#f87171",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              {isPositive ? "+" : ""}
              {changePercent}%
            </span>
          </div>
          <div
            style={{
              marginTop: 20,
              height: 8,
              borderRadius: 4,
              background: transparent ? undefined : "rgba(255,255,255,0.08)",
              border: transparent ? `1px solid ${primaryColor}30` : undefined,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
                borderRadius: 4,
                transform: `scaleX(${interpolate(frame, [20, 80], [0, 0.72], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })})`,
                transformOrigin: "left center",
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

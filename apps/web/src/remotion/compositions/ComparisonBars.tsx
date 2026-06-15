import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { resolveBg } from "../lib/background";

export interface ComparisonBarsProps {
  title: string;
  labelA: string;
  valueA: number;
  labelB: string;
  valueB: number;
  unit: string;
  accentColor: string;
  secondaryColor: string;
  backgroundColor?: string;
}

export const ComparisonBars: React.FC<ComparisonBarsProps> = ({
  title,
  labelA,
  valueA,
  labelB,
  valueB,
  unit,
  accentColor,
  secondaryColor,
  backgroundColor = "#09090b",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maxValue = Math.max(valueA, valueB, 1);

  const barAWidth = interpolate(frame, [15, 55], [0, (valueA / maxValue) * 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barBWidth = interpolate(frame, [30, 70], [0, (valueB / maxValue) * 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 140 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveBg(backgroundColor, "#09090b"),
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div style={{ width: "100%", maxWidth: 820, transform: `scale(${titleScale})` }}>
        <h1
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: "#fafafa",
            marginBottom: 48,
            textAlign: "center",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {title}
        </h1>

        {[
          { label: labelA, value: valueA, width: barAWidth, color: accentColor },
          { label: labelB, value: valueB, width: barBWidth, color: secondaryColor },
        ].map((bar, i) => (
          <div key={bar.label} style={{ marginBottom: i === 0 ? 36 : 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              <span style={{ fontSize: 26, color: "#e4e4e7", fontWeight: 600 }}>
                {bar.label}
              </span>
              <span style={{ fontSize: 26, color: bar.color, fontWeight: 800 }}>
                {bar.value}
                {unit}
              </span>
            </div>
            <div
              style={{
                height: 20,
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${bar.width}%`,
                  background: bar.color,
                  borderRadius: 999,
                  boxShadow: `0 0 24px ${bar.color}60`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

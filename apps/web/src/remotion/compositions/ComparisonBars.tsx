import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { isTransparentBg, resolveBg } from "../lib/background";
import { useCompactPadding } from "../lib/compact-layout";

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

const BAR_HEIGHT = 24;
const TRACK_RADIUS = 12;

function formatValue(value: number, unit: string): string {
  const trimmed = unit.trim();
  if (trimmed === "hrs" || trimmed === "hr" || trimmed === "hours") {
    if (value < 1 && value > 0) {
      return `${Math.round(value * 60)} min`;
    }
    return `${Number.isInteger(value) ? value : value.toFixed(1)} hrs`;
  }
  return `${Number.isInteger(value) ? value : value.toFixed(1)}${unit}`;
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
  const transparent = isTransparentBg(backgroundColor);
  const maxValue = Math.max(valueA, valueB, 1);
  const padding = useCompactPadding();

  const barAProgress = interpolate(frame, [15, 55], [0, valueA / maxValue], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barBProgress = interpolate(frame, [30, 70], [0, valueB / maxValue], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 140 },
  });

  const bars = [
    { label: labelA, value: valueA, progress: barAProgress, color: accentColor },
    { label: labelB, value: valueB, progress: barBProgress, color: secondaryColor },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveBg(backgroundColor, "#09090b"),
        justifyContent: "center",
        alignItems: "center",
        padding,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 820,
          transform: `scale(${titleScale})`,
        }}
      >
        <h1
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: "#fafafa",
            marginBottom: 48,
            textAlign: "center",
            fontFamily: "Inter, system-ui, sans-serif",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>

        {bars.map((bar, i) => (
          <div key={bar.label} style={{ marginBottom: i === 0 ? 40 : 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 14,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              <span style={{ fontSize: 28, color: "#e4e4e7", fontWeight: 600 }}>
                {bar.label}
              </span>
              <span style={{ fontSize: 28, color: bar.color, fontWeight: 800 }}>
                {formatValue(bar.value, unit)}
              </span>
            </div>

            {/* Track — scaleX fill avoids pill/distortion artifacts in WebCodecs export */}
            <div
              style={{
                width: "100%",
                height: BAR_HEIGHT,
                borderRadius: TRACK_RADIUS,
                backgroundColor: transparent
                  ? undefined
                  : "rgba(255, 255, 255, 0.1)",
                border: transparent ? `1px solid rgba(255,255,255,0.25)` : undefined,
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
                  backgroundColor: bar.color,
                  borderRadius: TRACK_RADIUS,
                  transform: `scaleX(${bar.progress})`,
                  transformOrigin: "left center",
                  willChange: "transform",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

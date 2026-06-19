import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { resolveBg } from "../lib/background";
import { useCompactPadding } from "../lib/compact-layout";

export interface BoldTitleHookProps {
  headline: string;
  subtext: string;
  accentColor: string;
  backgroundColor: string;
}

export const BoldTitleHook: React.FC<BoldTitleHookProps> = ({
  headline,
  subtext,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = headline.split(" ");
  const padding = useCompactPadding();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveBg(backgroundColor, "transparent"),
        justifyContent: "center",
        alignItems: "center",
        padding,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 900 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px 16px",
            marginBottom: 40,
          }}
        >
          {words.map((word, i) => {
            const delay = i * 4;
            const scale = spring({
              frame: frame - delay,
              fps,
              config: { damping: 14, stiffness: 180 },
            });
            const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <span
                key={`${word}-${i}`}
                style={{
                  fontSize: 72,
                  fontWeight: 800,
                  color: i === words.length - 1 ? accentColor : "#ffffff",
                  transform: `scale(${scale})`,
                  opacity,
                  lineHeight: 1.1,
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        <p
          style={{
            fontSize: 32,
            color: "#a1a1aa",
            opacity: interpolate(frame, [30, 45], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${interpolate(frame, [30, 45], [20, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px)`,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {subtext}
        </p>
      </div>
    </AbsoluteFill>
  );
};

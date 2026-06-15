import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { isTransparentBg } from "../lib/background";

export interface GradientTextRevealProps {
  headline: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor?: string;
}

export const GradientTextReveal: React.FC<GradientTextRevealProps> = ({
  headline,
  tagline,
  primaryColor,
  accentColor,
  backgroundColor = "#09090b",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const transparent = isTransparentBg(backgroundColor);

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  return (
    <AbsoluteFill
      style={{
        background: transparent
          ? undefined
          : `radial-gradient(ellipse at 50% 0%, ${primaryColor}30 0%, ${backgroundColor} 60%)`,
        backgroundColor: transparent ? undefined : backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          background: transparent ? undefined : "rgba(255,255,255,0.05)",
          border: transparent ? undefined : "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24,
          padding: "48px 56px",
          backdropFilter: transparent ? undefined : "blur(20px)",
          textAlign: "center",
          transform: `scale(${titleScale})`,
          maxWidth: 800,
        }}
      >
        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "Inter, system-ui, sans-serif",
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          {headline}
        </h1>
        <p
          style={{
            marginTop: 24,
            fontSize: 28,
            color: "#a1a1aa",
            opacity: interpolate(frame, [25, 40], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {tagline}
        </p>
      </div>
    </AbsoluteFill>
  );
};

import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { isTransparentBg, resolveBg } from "../lib/background";

export interface QuoteSpotlightProps {
  quote: string;
  author: string;
  accentColor: string;
  backgroundColor?: string;
}

export const QuoteSpotlight: React.FC<QuoteSpotlightProps> = ({
  quote,
  author,
  accentColor,
  backgroundColor = "#09090b",
}) => {
  const frame = useCurrentFrame();
  const transparent = isTransparentBg(backgroundColor);

  const spotlightOpacity = interpolate(frame, [0, 20, 80, 100], [0, 0.6, 0.6, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveBg(backgroundColor, "#09090b"),
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      {!transparent && (
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
            opacity: spotlightOpacity,
            filter: "blur(40px)",
          }}
        />
      )}

      <div style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: 800 }}>
        <p
          style={{
            fontSize: 52,
            fontWeight: 600,
            color: "#fafafa",
            lineHeight: 1.35,
            fontStyle: "italic",
            opacity: interpolate(frame, [5, 25], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            fontFamily: "Georgia, serif",
          }}
        >
          &ldquo;{quote}&rdquo;
        </p>
        <p
          style={{
            marginTop: 36,
            fontSize: 26,
            color: accentColor,
            opacity: interpolate(frame, [35, 50], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {author}
        </p>
      </div>
    </AbsoluteFill>
  );
};

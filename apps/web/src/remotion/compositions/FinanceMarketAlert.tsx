import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { isTransparentBg, resolveBg } from "../lib/background";
import { useCompactPadding } from "../lib/compact-layout";

export interface FinanceMarketAlertProps {
  ticker: string;
  price: string;
  changePercent: number;
  headline: string;
  accentColor: string;
  backgroundColor?: string;
}

export const FinanceMarketAlert: React.FC<FinanceMarketAlertProps> = ({
  ticker,
  price,
  changePercent,
  headline,
  accentColor,
  backgroundColor = "#020617",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const transparent = isTransparentBg(backgroundColor);
  const isUp = changePercent >= 0;
  const alertColor = isUp ? "#22c55e" : "#ef4444";
  const padding = useCompactPadding();

  const pulse = spring({
    frame: frame - 5,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveBg(backgroundColor, "#020617"),
        justifyContent: "center",
        alignItems: "center",
        padding,
      }}
    >
      <div style={{ width: "100%", maxWidth: 800 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            borderRadius: 999,
            background: transparent ? undefined : `${alertColor}20`,
            border: transparent ? `1px solid ${alertColor}` : `1px solid ${alertColor}50`,
            marginBottom: 24,
            opacity: interpolate(frame, [0, 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: alertColor,
              boxShadow: transparent ? undefined : `0 0 12px ${alertColor}`,
            }}
          />
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: alertColor,
              letterSpacing: "0.08em",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            MARKET ALERT
          </span>
        </div>

        <h1
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "#f8fafc",
            marginBottom: 32,
            lineHeight: 1.2,
            fontFamily: "Inter, system-ui, sans-serif",
            opacity: interpolate(frame, [8, 22], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {headline}
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px 32px",
            borderRadius: 16,
            border: transparent ? `1px solid ${accentColor}40` : "1px solid rgba(255,255,255,0.1)",
            background: transparent ? undefined : "rgba(255,255,255,0.03)",
            transform: `scale(${pulse})`,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 22,
                color: accentColor,
                fontWeight: 700,
                marginBottom: 6,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              {ticker}
            </p>
            <p
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: "#fff",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              {price}
            </p>
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: alertColor,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            {isUp ? "▲" : "▼"} {Math.abs(changePercent)}%
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

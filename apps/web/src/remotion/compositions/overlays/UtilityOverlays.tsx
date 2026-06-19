import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { isTransparentBg, resolveBg } from "../../lib/background";
import { popIn, slideIn } from "../../lib/motion";
import { OverlayRoot } from "./shared";

export interface LogoRevealProps {
  brandName: string;
  tagline: string;
  accentColor: string;
  backgroundColor: string;
}

export const LogoReveal: React.FC<LogoRevealProps> = ({
  brandName,
  tagline,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const transparent = isTransparentBg(backgroundColor);
  const logo = popIn(frame, fps, 5);
  const text = slideIn(frame, fps, 20, 30);
  const shine = interpolate(frame, [40, 70], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: resolveBg(backgroundColor, "transparent") }}>
      <OverlayRoot backgroundColor={transparent ? undefined : resolveBg(backgroundColor)}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 160,
              height: 160,
              margin: "0 auto",
              borderRadius: 32,
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 72,
              fontWeight: 900,
              color: "#fff",
              transform: `scale(${logo.scale})`,
              opacity: logo.opacity,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {brandName.charAt(0).toUpperCase()}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                transform: `translateX(${shine}%)`,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 48,
              fontWeight: 800,
              color: transparent ? "#fff" : accentColor,
              transform: `translateY(${text.translateY}px)`,
              opacity: text.opacity,
            }}
          >
            {brandName}
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 26,
              color: transparent ? "#d4d4d8" : "#71717a",
              opacity: text.opacity,
            }}
          >
            {tagline}
          </div>
        </div>
      </OverlayRoot>
    </AbsoluteFill>
  );
};

export interface BrowserAddressBarProps {
  url: string;
  searchQuery: string;
  accentColor: string;
  backgroundColor: string;
}

export const BrowserAddressBar: React.FC<BrowserAddressBarProps> = ({
  url,
  searchQuery,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const transparent = isTransparentBg(backgroundColor);
  const anim = slideIn(frame, fps, 8, -50);
  const typed = searchQuery.slice(
    0,
    Math.floor(
      interpolate(frame, [25, 75], [0, searchQuery.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );

  return (
    <AbsoluteFill style={{ backgroundColor: resolveBg(backgroundColor, "transparent") }}>
      <OverlayRoot align="top" compact backgroundColor={transparent ? undefined : resolveBg(backgroundColor)}>
        <div
          style={{
            width: "100%",
            maxWidth: 920,
            background: "#f4f4f5",
            borderRadius: 16,
            padding: "16px 20px",
            transform: `translateY(${anim.translateY}px)`,
            opacity: anim.opacity,
            boxShadow: transparent ? "none" : "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e" }} />
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: 999,
              padding: "14px 24px",
              fontSize: 24,
              color: "#52525b",
              border: `2px solid ${accentColor}40`,
            }}
          >
            {url}/{typed}
            <span style={{ opacity: frame % 30 < 15 ? 1 : 0 }}>|</span>
          </div>
        </div>
      </OverlayRoot>
    </AbsoluteFill>
  );
};

export interface SearchBarTypingProps {
  query: string;
  platform: string;
  accentColor: string;
  backgroundColor: string;
}

export const SearchBarTyping: React.FC<SearchBarTypingProps> = ({
  query,
  platform,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const transparent = isTransparentBg(backgroundColor);
  const anim = popIn(frame, fps, 5);
  const typed = query.slice(
    0,
    Math.floor(
      interpolate(frame, [15, 80], [0, query.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );

  const isGoogle = platform === "google";

  return (
    <AbsoluteFill style={{ backgroundColor: resolveBg(backgroundColor, "transparent") }}>
      <OverlayRoot compact backgroundColor={transparent ? undefined : resolveBg(backgroundColor)}>
        <div
          style={{
            width: "100%",
            maxWidth: 880,
            background: isGoogle ? "#fff" : "rgba(0,0,0,0.8)",
            borderRadius: 999,
            padding: "22px 32px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            transform: `scale(${anim.scale})`,
            opacity: anim.opacity,
            boxShadow: transparent ? "none" : "0 16px 48px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ fontSize: 32 }}>🔍</div>
          <div
            style={{
              flex: 1,
              fontSize: 28,
              fontWeight: 500,
              color: isGoogle ? "#18181b" : "#fff",
            }}
          >
            {typed}
            <span style={{ opacity: frame % 30 < 15 ? 1 : 0 }}>|</span>
          </div>
        </div>
      </OverlayRoot>
    </AbsoluteFill>
  );
};

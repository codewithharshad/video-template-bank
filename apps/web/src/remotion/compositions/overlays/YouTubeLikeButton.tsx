import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { isTransparentBg, overlayPanelBg, resolveBg } from "../../lib/background";
import { popIn, slideIn } from "../../lib/motion";
import { Avatar, OverlayRoot } from "./shared";

export interface YouTubeLikeButtonProps {
  likeCount: string;
  theme: string;
  accentColor: string;
  backgroundColor: string;
}

export const YouTubeLikeButton: React.FC<YouTubeLikeButtonProps> = ({
  likeCount,
  theme,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dark = theme === "dark";
  const transparent = isTransparentBg(backgroundColor);
  const anim = popIn(frame, fps, 10);
  const thumb = popIn(frame, fps, 0);

  const bg = overlayPanelBg(transparent, dark, {
    dark: "#1e1e1e",
    light: "#ffffff",
  }, {
    dark: "rgba(30,30,30,0.95)",
    light: "rgba(255,255,255,0.95)",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: resolveBg(backgroundColor, "transparent") }}>
      <OverlayRoot backgroundColor={transparent ? undefined : resolveBg(backgroundColor)} compact>
        <div
          style={{
            background: bg,
            borderRadius: 999,
            padding: "20px 36px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            transform: `scale(${anim.scale})`,
            opacity: anim.opacity,
            boxShadow: transparent ? "none" : "0 12px 40px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ transform: `scale(${thumb.scale})`, fontSize: 44 }}>👍</div>
          <div style={{ fontWeight: 700, fontSize: 32, color: dark ? "#fff" : "#18181b" }}>
            {likeCount}
          </div>
          <div
            style={{
              width: 2,
              height: 36,
              background: dark ? "#3f3f46" : "#e4e4e7",
              margin: "0 8px",
            }}
          />
          <div style={{ fontSize: 36 }}>👎</div>
        </div>
      </OverlayRoot>
    </AbsoluteFill>
  );
};

export interface YouTubeLiveBadgeProps {
  viewerCount: string;
  accentColor: string;
  backgroundColor: string;
}

export const YouTubeLiveBadge: React.FC<YouTubeLiveBadgeProps> = ({
  viewerCount,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const transparent = isTransparentBg(backgroundColor);
  const anim = slideIn(frame, fps, 5, -40);

  return (
    <AbsoluteFill style={{ backgroundColor: resolveBg(backgroundColor, "transparent") }}>
      <OverlayRoot align="top" backgroundColor={transparent ? undefined : resolveBg(backgroundColor)} compact>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            transform: `translateY(${anim.translateY}px)`,
            opacity: anim.opacity,
          }}
        >
          <div
            style={{
              background: "#ff0000",
              color: "#fff",
              fontWeight: 800,
              fontSize: 22,
              padding: "10px 16px",
              borderRadius: 6,
              letterSpacing: 1,
            }}
          >
            LIVE
          </div>
          <div
            style={{
              background: transparent ? "#18181b" : "rgba(0,0,0,0.75)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 22,
              padding: "10px 16px",
              borderRadius: 6,
            }}
          >
            {viewerCount} watching
          </div>
        </div>
      </OverlayRoot>
    </AbsoluteFill>
  );
};

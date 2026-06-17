import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { isTransparentBg, resolveBg } from "../../lib/background";
import { popIn, slideIn } from "../../lib/motion";
import { Avatar, OverlayRoot, PillButton } from "./shared";

export interface YouTubeSubscribeBannerProps {
  channelName: string;
  subscriberCount: string;
  theme: string;
  accentColor: string;
  backgroundColor: string;
}

export const YouTubeSubscribeBanner: React.FC<YouTubeSubscribeBannerProps> = ({
  channelName,
  subscriberCount,
  theme,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dark = theme === "dark";
  const transparent = isTransparentBg(backgroundColor);
  const banner = slideIn(frame, fps, 5, 100);
  const bell = popIn(frame, fps, 35);

  const bg = dark ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.95)";
  const text = dark ? "#fff" : "#18181b";

  return (
    <AbsoluteFill style={{ backgroundColor: resolveBg(backgroundColor, "transparent") }}>
      <OverlayRoot align="bottom" backgroundColor={transparent ? undefined : resolveBg(backgroundColor)}>
        <div
          style={{
            width: "100%",
            maxWidth: 920,
            background: bg,
            borderRadius: 16,
            padding: "24px 28px",
            display: "flex",
            alignItems: "center",
            gap: 20,
            transform: `translateY(${banner.translateY}px)`,
            opacity: banner.opacity,
            backdropFilter: "blur(12px)",
          }}
        >
          <Avatar name={channelName} color={accentColor} size={72} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 30, color: text }}>{channelName}</div>
            <div style={{ fontSize: 22, color: dark ? "#a1a1aa" : "#71717a", marginTop: 4 }}>
              {subscriberCount} subscribers
            </div>
          </div>
          <PillButton label="Subscribe" color="#ff0000" style={{ fontSize: 24, padding: "12px 24px" }} />
          <div style={{ transform: `scale(${bell.scale})`, opacity: bell.opacity, fontSize: 36 }}>
            🔔
          </div>
        </div>
      </OverlayRoot>
    </AbsoluteFill>
  );
};

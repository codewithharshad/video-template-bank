import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { isTransparentBg, overlayPanelBg, resolveBg } from "../../lib/background";
import { popIn, slideIn } from "../../lib/motion";
import { Avatar, OverlayRoot } from "./shared";

export interface InstagramProfileBannerProps {
  username: string;
  displayName: string;
  bio: string;
  theme: string;
  layout: string;
  accentColor: string;
  backgroundColor: string;
}

export const InstagramProfileBanner: React.FC<InstagramProfileBannerProps> = ({
  username,
  displayName,
  bio,
  theme,
  layout,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dark = theme === "dark";
  const transparent = isTransparentBg(backgroundColor);
  const isGrid = layout === "grid";
  const banner = slideIn(frame, fps, 8, 80);
  const grid = popIn(frame, fps, 25);

  const cardBg = dark ? "#121212" : "#ffffff";
  const text = dark ? "#fafafa" : "#18181b";
  const muted = dark ? "#a1a1aa" : "#71717a";

  return (
    <AbsoluteFill style={{ backgroundColor: resolveBg(backgroundColor, "transparent") }}>
      <OverlayRoot backgroundColor={transparent ? undefined : resolveBg(backgroundColor)}>
        <div
          style={{
            width: "100%",
            maxWidth: 900,
            background: cardBg,
            borderRadius: 24,
            padding: 32,
            transform: `translateY(${banner.translateY}px) scale(${banner.scale})`,
            opacity: banner.opacity,
            boxShadow: transparent ? "none" : "0 24px 64px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <Avatar name={displayName} color={accentColor} size={100} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 32, color: text }}>{displayName}</div>
              <div style={{ fontSize: 24, color: muted, marginTop: 4 }}>@{username}</div>
              <div style={{ fontSize: 22, color: text, marginTop: 12, lineHeight: 1.4 }}>{bio}</div>
            </div>
          </div>

          {isGrid && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
                marginTop: 28,
                transform: `scale(${grid.scale})`,
                opacity: grid.opacity,
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 8,
                    background: `linear-gradient(135deg, ${accentColor}${i % 2 ? "66" : "99"}, ${accentColor}33)`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </OverlayRoot>
    </AbsoluteFill>
  );
};

export interface InstagramHeartNotificationProps {
  username: string;
  action: string;
  theme: string;
  accentColor: string;
  backgroundColor: string;
}

export const InstagramHeartNotification: React.FC<InstagramHeartNotificationProps> = ({
  username,
  action,
  theme,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dark = theme === "dark";
  const transparent = isTransparentBg(backgroundColor);
  const anim = slideIn(frame, fps, 5, -50);
  const heart = popIn(frame, fps, 15);

  const bg = overlayPanelBg(transparent, dark, {
    dark: "#121212",
    light: "#ffffff",
  }, {
    dark: "rgba(18,18,18,0.95)",
    light: "rgba(255,255,255,0.95)",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: resolveBg(backgroundColor, "transparent") }}>
      <OverlayRoot align="top" backgroundColor={transparent ? undefined : resolveBg(backgroundColor)}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: bg,
            borderRadius: 999,
            padding: "16px 28px",
            transform: `translateY(${anim.translateY}px)`,
            opacity: anim.opacity,
            backdropFilter: transparent ? undefined : "blur(10px)",
          }}
        >
          <div style={{ transform: `scale(${heart.scale})`, fontSize: 36 }}>❤️</div>
          <Avatar name={username} color={accentColor} size={48} />
          <div style={{ fontSize: 24, fontWeight: 600, color: dark ? "#fff" : "#18181b" }}>
            <strong>{username}</strong> {action}
          </div>
        </div>
      </OverlayRoot>
    </AbsoluteFill>
  );
};

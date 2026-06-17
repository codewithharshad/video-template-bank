import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { isTransparentBg, resolveBg } from "../../lib/background";
import { slideIn } from "../../lib/motion";
import { Avatar, OverlayRoot, PillButton } from "./shared";

export interface YouTubeEngagementProps {
  username: string;
  comment: string;
  theme: string;
  accentColor: string;
  backgroundColor: string;
}

export const YouTubeEngagement: React.FC<YouTubeEngagementProps> = ({
  username,
  comment,
  theme,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dark = theme === "dark";
  const transparent = isTransparentBg(backgroundColor);

  const card = slideIn(frame, fps, 8, 60);
  const like = slideIn(frame, fps, 18, 40);
  const sub = slideIn(frame, fps, 28, 40);

  const cardBg = dark ? "#1f1f1f" : "#ffffff";
  const text = dark ? "#f4f4f5" : "#18181b";
  const muted = dark ? "#a1a1aa" : "#71717a";

  return (
    <AbsoluteFill style={{ backgroundColor: resolveBg(backgroundColor, "transparent") }}>
      <OverlayRoot backgroundColor={transparent ? undefined : resolveBg(backgroundColor)}>
        <div
          style={{
            width: "100%",
            maxWidth: 880,
            transform: `translateY(${card.translateY}px) scale(${card.scale})`,
            opacity: card.opacity,
          }}
        >
          <div
            style={{
              background: cardBg,
              borderRadius: 20,
              padding: 28,
              boxShadow: transparent ? "none" : "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <Avatar name={username} color={accentColor} size={64} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 26, color: text }}>{username}</div>
                <div style={{ marginTop: 8, fontSize: 24, color: muted, lineHeight: 1.4 }}>
                  {comment}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 24, justifyContent: "center" }}>
            <div style={{ transform: `translateY(${like.translateY}px)`, opacity: like.opacity }}>
              <PillButton label="👍 Like" color="#27272a" />
            </div>
            <div style={{ transform: `translateY(${sub.translateY}px)`, opacity: sub.opacity }}>
              <PillButton label="Subscribe" color="#ff0000" />
            </div>
          </div>
        </div>
      </OverlayRoot>
    </AbsoluteFill>
  );
};

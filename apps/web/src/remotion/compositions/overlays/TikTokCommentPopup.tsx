import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { isTransparentBg, resolveBg } from "../../lib/background";
import { slideIn } from "../../lib/motion";
import { Avatar, OverlayRoot } from "./shared";

export interface TikTokCommentPopupProps {
  username: string;
  comment: string;
  likes: string;
  theme: string;
  accentColor: string;
  backgroundColor: string;
}

export const TikTokCommentPopup: React.FC<TikTokCommentPopupProps> = ({
  username,
  comment,
  likes,
  theme,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dark = theme === "dark";
  const transparent = isTransparentBg(backgroundColor);
  const anim = slideIn(frame, fps, 8, 120);

  const bg = dark ? "rgba(24,24,27,0.92)" : "rgba(255,255,255,0.95)";

  return (
    <AbsoluteFill style={{ backgroundColor: resolveBg(backgroundColor, "transparent") }}>
      <OverlayRoot align="bottom" backgroundColor={transparent ? undefined : resolveBg(backgroundColor)}>
        <div
          style={{
            width: "100%",
            maxWidth: 880,
            background: bg,
            borderRadius: 20,
            padding: 24,
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
            transform: `translateY(${anim.translateY}px)`,
            opacity: anim.opacity,
            backdropFilter: "blur(12px)",
          }}
        >
          <Avatar name={username} color={accentColor} size={56} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 24, color: dark ? "#fff" : "#18181b" }}>
              {username}
            </div>
            <div style={{ fontSize: 22, color: dark ? "#d4d4d8" : "#52525b", marginTop: 6, lineHeight: 1.4 }}>
              {comment}
            </div>
          </div>
          <div style={{ textAlign: "center", color: dark ? "#fff" : "#18181b" }}>
            <div style={{ fontSize: 28 }}>♥</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{likes}</div>
          </div>
        </div>
      </OverlayRoot>
    </AbsoluteFill>
  );
};

import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { isTransparentBg, resolveBg } from "../../lib/background";
import { popIn, slideIn } from "../../lib/motion";
import { Avatar, OverlayRoot, PillButton } from "./shared";

export interface DiscordCallProps {
  serverName: string;
  channelName: string;
  callerName: string;
  theme: string;
  accentColor: string;
  backgroundColor: string;
}

export const DiscordCall: React.FC<DiscordCallProps> = ({
  serverName,
  channelName,
  callerName,
  theme,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const transparent = isTransparentBg(backgroundColor);
  const panel = slideIn(frame, fps, 8, 80);
  const pulse = popIn(frame, fps, 20);

  return (
    <AbsoluteFill style={{ backgroundColor: resolveBg(backgroundColor, "transparent") }}>
      <OverlayRoot backgroundColor={transparent ? undefined : resolveBg(backgroundColor)}>
        <div
          style={{
            width: "100%",
            maxWidth: 880,
            background: "#2b2d31",
            borderRadius: 20,
            padding: 32,
            textAlign: "center",
            transform: `translateY(${panel.translateY}px) scale(${panel.scale})`,
            opacity: panel.opacity,
          }}
        >
          <div style={{ fontSize: 20, color: "#b5bac1", marginBottom: 8 }}>{serverName}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#f2f3f5", marginBottom: 24 }}>
            #{channelName}
          </div>
          <div style={{ transform: `scale(${pulse.scale})`, marginBottom: 20 }}>
            <Avatar name={callerName} color={accentColor} size={96} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#f2f3f5", marginBottom: 8 }}>
            {callerName}
          </div>
          <div style={{ fontSize: 22, color: "#23a559", marginBottom: 28 }}>Incoming voice call...</div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <PillButton label="Decline" color="#ed4245" />
            <PillButton label="Accept" color="#23a559" />
          </div>
        </div>
      </OverlayRoot>
    </AbsoluteFill>
  );
};

export interface KickProfileProps {
  username: string;
  followerCount: string;
  isLive: string;
  accentColor: string;
  backgroundColor: string;
}

export const KickProfile: React.FC<KickProfileProps> = ({
  username,
  followerCount,
  isLive,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const transparent = isTransparentBg(backgroundColor);
  const anim = slideIn(frame, fps, 8, 70);
  const live = isLive === "yes";

  return (
    <AbsoluteFill style={{ backgroundColor: resolveBg(backgroundColor, "transparent") }}>
      <OverlayRoot backgroundColor={transparent ? undefined : resolveBg(backgroundColor)}>
        <div
          style={{
            width: "100%",
            maxWidth: 880,
            background: "#0e0e10",
            borderRadius: 20,
            padding: 28,
            display: "flex",
            alignItems: "center",
            gap: 24,
            border: `2px solid ${accentColor}`,
            transform: `translateY(${anim.translateY}px)`,
            opacity: anim.opacity,
          }}
        >
          <Avatar name={username} color={accentColor} size={80} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 32, color: "#fff" }}>{username}</div>
            <div style={{ fontSize: 22, color: "#adadb8", marginTop: 4 }}>{followerCount} followers</div>
          </div>
          {live && (
            <div
              style={{
                background: accentColor,
                color: "#000",
                fontWeight: 800,
                fontSize: 20,
                padding: "10px 18px",
                borderRadius: 8,
              }}
            >
              LIVE
            </div>
          )}
        </div>
      </OverlayRoot>
    </AbsoluteFill>
  );
};

export interface FollowNotificationProps {
  platform: string;
  username: string;
  action: string;
  accentColor: string;
  backgroundColor: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  twitch: "#9146ff",
  twitter: "#1d9bf0",
  threads: "#000000",
  reddit: "#ff4500",
  generic: "#6366f1",
};

export const FollowNotification: React.FC<FollowNotificationProps> = ({
  platform,
  username,
  action,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const transparent = isTransparentBg(backgroundColor);
  const anim = slideIn(frame, fps, 5, -50);
  const color = PLATFORM_COLORS[platform] ?? accentColor;

  return (
    <AbsoluteFill style={{ backgroundColor: resolveBg(backgroundColor, "transparent") }}>
      <OverlayRoot align="top" backgroundColor={transparent ? undefined : resolveBg(backgroundColor)}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "rgba(0,0,0,0.85)",
            borderRadius: 16,
            padding: "18px 28px",
            borderLeft: `4px solid ${color}`,
            transform: `translateY(${anim.translateY}px)`,
            opacity: anim.opacity,
          }}
        >
          <Avatar name={username} color={color} size={52} />
          <div style={{ fontSize: 24, fontWeight: 600, color: "#fff" }}>
            <strong>{username}</strong> {action}
          </div>
        </div>
      </OverlayRoot>
    </AbsoluteFill>
  );
};

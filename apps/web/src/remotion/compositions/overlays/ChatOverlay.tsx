import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { isTransparentBg, resolveBg } from "../../lib/background";
import { fadeIn, slideIn } from "../../lib/motion";
import { Avatar, OverlayRoot } from "./shared";

export interface ChatOverlayProps {
  platform: string;
  contactName: string;
  message: string;
  reply: string;
  theme: string;
  accentColor: string;
  backgroundColor: string;
}

export const ChatOverlay: React.FC<ChatOverlayProps> = ({
  platform,
  contactName,
  message,
  reply,
  theme,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dark = theme === "dark";
  const transparent = isTransparentBg(backgroundColor);
  const isWhatsApp = platform === "whatsapp";
  const panel = slideIn(frame, fps, 5, 60);
  const msg1 = slideIn(frame, fps, 20, 30);
  const msg2 = slideIn(frame, fps, 35, 30);

  const headerBg = isWhatsApp ? "#075e54" : dark ? "#1c1c1e" : "#f2f2f7";
  const chatBg = isWhatsApp ? "#0b141a" : dark ? "#000" : "#fff";
  const bubbleOut = isWhatsApp ? "#005c4b" : accentColor;
  const bubbleIn = dark ? "#262628" : "#e9e9eb";
  const textOut = "#fff";
  const textIn = dark ? "#fff" : "#000";

  return (
    <AbsoluteFill style={{ backgroundColor: resolveBg(backgroundColor, "transparent") }}>
      <OverlayRoot backgroundColor={transparent ? undefined : resolveBg(backgroundColor)}>
        <div
          style={{
            width: "100%",
            maxWidth: 880,
            borderRadius: 24,
            overflow: "hidden",
            transform: `translateY(${panel.translateY}px)`,
            opacity: panel.opacity,
            boxShadow: transparent ? "none" : "0 24px 64px rgba(0,0,0,0.45)",
          }}
        >
          <div
            style={{
              background: headerBg,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <Avatar name={contactName} color={accentColor} size={48} />
            <div style={{ fontWeight: 700, fontSize: 26, color: "#fff" }}>{contactName}</div>
          </div>
          <div style={{ background: chatBg, padding: 24, minHeight: 280 }}>
            <div
              style={{
                maxWidth: "75%",
                background: bubbleIn,
                color: textIn,
                padding: "14px 18px",
                borderRadius: 18,
                fontSize: 22,
                lineHeight: 1.4,
                marginBottom: 16,
                transform: `translateY(${msg1.translateY}px)`,
                opacity: msg1.opacity,
              }}
            >
              {message}
            </div>
            <div
              style={{
                maxWidth: "75%",
                marginLeft: "auto",
                background: bubbleOut,
                color: textOut,
                padding: "14px 18px",
                borderRadius: 18,
                fontSize: 22,
                lineHeight: 1.4,
                transform: `translateY(${msg2.translateY}px)`,
                opacity: msg2.opacity,
              }}
            >
              {reply}
            </div>
          </div>
        </div>
      </OverlayRoot>
    </AbsoluteFill>
  );
};

export interface IMessageNotificationProps {
  sender: string;
  message: string;
  theme: string;
  accentColor: string;
  backgroundColor: string;
}

export const IMessageNotification: React.FC<IMessageNotificationProps> = ({
  sender,
  message,
  theme,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dark = theme === "dark";
  const transparent = isTransparentBg(backgroundColor);
  const anim = slideIn(frame, fps, 5, -60);

  const bg = dark ? "rgba(28,28,30,0.95)" : "rgba(255,255,255,0.95)";

  return (
    <AbsoluteFill style={{ backgroundColor: resolveBg(backgroundColor, "transparent") }}>
      <OverlayRoot align="top" backgroundColor={transparent ? undefined : resolveBg(backgroundColor)}>
        <div
          style={{
            width: "100%",
            maxWidth: 880,
            background: bg,
            borderRadius: 20,
            padding: 20,
            display: "flex",
            gap: 16,
            alignItems: "center",
            transform: `translateY(${anim.translateY}px)`,
            opacity: anim.opacity,
            backdropFilter: "blur(16px)",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #34c759, #30d158)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            💬
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 22, color: dark ? "#fff" : "#18181b" }}>
              {sender}
            </div>
            <div
              style={{
                fontSize: 20,
                color: dark ? "#a1a1aa" : "#52525b",
                marginTop: 4,
                opacity: fadeIn(frame, 15, 25),
              }}
            >
              {message}
            </div>
          </div>
        </div>
      </OverlayRoot>
    </AbsoluteFill>
  );
};

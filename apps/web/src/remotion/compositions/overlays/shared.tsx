import type { CSSProperties, ReactNode } from "react";
import { useVideoConfig } from "remotion";

export function OverlayRoot({
  children,
  backgroundColor,
  align = "center",
  compact: compactProp,
}: {
  children: ReactNode;
  backgroundColor?: string;
  align?: "center" | "bottom" | "top";
  /** Tighter padding for content-sized export canvases */
  compact?: boolean;
}) {
  const { height } = useVideoConfig();
  const compact = compactProp ?? height < 960;
  const justify =
    align === "bottom" ? "flex-end" : align === "top" ? "flex-start" : "center";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: justify,
        alignItems: "center",
        padding: compact ? 12 : 48,
        backgroundColor,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {children}
    </div>
  );
}

export function Avatar({
  name,
  size = 72,
  color = "#6366f1",
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${color}, ${color}99)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: size * 0.4,
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}

export function PillButton({
  label,
  color,
  textColor = "#fff",
  style,
}: {
  label: string;
  color: string;
  textColor?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        backgroundColor: color,
        color: textColor,
        borderRadius: 999,
        padding: "14px 28px",
        fontWeight: 700,
        fontSize: 28,
        letterSpacing: 0.3,
        ...style,
      }}
    >
      {label}
    </div>
  );
}

import type { HookTemplate } from "@video-lib/template-sdk";

/**
 * Content bounds at 1080p portrait scale — export crops to the graphic, not the full canvas.
 * Heights include overlay padding (12px), inner padding, and typical text lines.
 * EXPORT_MARGIN adds breathing room so nothing clips at the edges.
 */
const EXPORT_MARGIN = 20;

const FRAMES_BY_COMPOSITION: Record<
  string,
  { width: number; height: number; variants?: Record<string, { width: number; height: number }> }
> = {
  InstagramProfileBanner: {
    width: 936,
    height: 320,
    variants: { grid: { width: 936, height: 700 } },
  },
  InstagramHeartNotification: { width: 800, height: 104 },
  YouTubeSubscribeBanner: { width: 984, height: 144 },
  YouTubeEngagement: { width: 920, height: 360 },
  YouTubeLikeButton: { width: 420, height: 112 },
  YouTubeLiveBadge: { width: 480, height: 88 },
  TikTokCommentPopup: { width: 920, height: 168 },
  ChatOverlay: { width: 920, height: 360 },
  IMessageNotification: { width: 880, height: 132 },
  DiscordCall: { width: 920, height: 500 },
  KickProfile: { width: 880, height: 164 },
  FollowNotification: { width: 760, height: 112 },
  LogoReveal: { width: 480, height: 340 },
  BrowserAddressBar: { width: 920, height: 140 },
  SearchBarTyping: { width: 880, height: 112 },
  // Hooks — content bounds at full-canvas design scale
  BoldTitleHook: { width: 960, height: 360 },
  CounterReveal: { width: 760, height: 320 },
  GradientTextReveal: { width: 880, height: 380 },
  ThreePointReveal: { width: 1680, height: 440 },
  QuoteSpotlight: { width: 900, height: 340 },
  ZoomTransition: { width: 560, height: 560 },
  SaasMetricCard: { width: 880, height: 380 },
  FinanceMarketAlert: { width: 900, height: 480 },
  ComparisonBars: { width: 920, height: 360 },
};

function even(n: number): number {
  return n % 2 === 0 ? n : n + 1;
}

function padFrame(frame: { width: number; height: number }): { width: number; height: number } {
  return {
    width: even(frame.width + EXPORT_MARGIN * 2),
    height: even(frame.height + EXPORT_MARGIN * 2),
  };
}

export function getOverlayExportFrame(
  template: HookTemplate,
  props: Record<string, string | number>
): { width: number; height: number } | null {
  const spec = template.exportFrame ?? FRAMES_BY_COMPOSITION[template.compositionId];
  if (!spec) return null;

  if (spec.variants) {
    const layout = String(props.layout ?? "");
    const variant = spec.variants[layout];
    if (variant) return padFrame(variant);
  }

  return padFrame({ width: spec.width, height: spec.height });
}

export function scaleExportFrame(
  frame: { width: number; height: number },
  template: HookTemplate,
  resolution: "720p" | "1080p"
): { width: number; height: number } {
  const scale = resolution === "1080p" ? 1 : 720 / template.width;
  return {
    width: even(Math.round(frame.width * scale)),
    height: even(Math.round(frame.height * scale)),
  };
}

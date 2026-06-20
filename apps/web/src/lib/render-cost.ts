import type { HookTemplate } from "@video-lib/template-sdk";
import { getDefaultProps } from "@video-lib/template-sdk";
import { getExportDimensions } from "@/lib/export-dimensions";

/**
 * Temporary heuristic for ranking templates by expected server export load.
 * Uses cropped export pixels × duration × per-composition complexity.
 * Not measured RAM — useful for dev/testing order only.
 */
const COMPOSITION_COMPLEXITY: Record<string, number> = {
  DiscordCall: 1.4,
  ChatOverlay: 1.3,
  InstagramProfileBanner: 1.25,
  YouTubeEngagement: 1.2,
  ThreePointReveal: 1.15,
  GradientTextReveal: 1.15,
  QuoteSpotlight: 1.15,
  FinanceMarketAlert: 1.1,
  SaasMetricCard: 1.1,
  ComparisonBars: 1.1,
  LogoReveal: 1.05,
  TikTokCommentPopup: 1.05,
  YouTubeSubscribeBanner: 1.05,
  ZoomTransition: 1.0,
  YouTubeLikeButton: 0.85,
  YouTubeLiveBadge: 0.8,
  InstagramHeartNotification: 0.85,
  BrowserAddressBar: 0.9,
  SearchBarTyping: 0.9,
};

/** Transparent ProRes path uses PNG frames — rough multiplier vs preview player. */
const TRANSPARENT_SERVER_MULTIPLIER = 2.2;

export function estimateRenderMemoryScore(template: HookTemplate): number {
  const props = getDefaultProps(template);
  const { width, height } = getExportDimensions(template, "1080p", {
    fitToContent: true,
    inputProps: props,
  });

  const complexity = COMPOSITION_COMPLEXITY[template.compositionId] ?? 1;

  return (
    width *
    height *
    template.durationInFrames *
    complexity *
    TRANSPARENT_SERVER_MULTIPLIER
  );
}

/** Sort heaviest renders first (high estimated memory → low). */
export function sortTemplatesByRenderCost(templates: HookTemplate[]): HookTemplate[] {
  return [...templates].sort(
    (a, b) => estimateRenderMemoryScore(b) - estimateRenderMemoryScore(a)
  );
}

export function renderCostLabel(template: HookTemplate): "high" | "medium" | "low" {
  const score = estimateRenderMemoryScore(template);
  if (score >= 280_000_000) return "high";
  if (score >= 120_000_000) return "medium";
  return "low";
}

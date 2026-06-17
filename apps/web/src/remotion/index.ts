import type { ComponentType } from "react";
import { BoldTitleHook } from "./compositions/BoldTitleHook";
import { CounterReveal } from "./compositions/CounterReveal";
import { GradientTextReveal } from "./compositions/GradientTextReveal";
import { ThreePointReveal } from "./compositions/ThreePointReveal";
import { QuoteSpotlight } from "./compositions/QuoteSpotlight";
import { ZoomTransition } from "./compositions/ZoomTransition";
import { SaasMetricCard } from "./compositions/SaasMetricCard";
import { FinanceMarketAlert } from "./compositions/FinanceMarketAlert";
import { ComparisonBars } from "./compositions/ComparisonBars";
import { YouTubeEngagement } from "./compositions/overlays/YouTubeEngagement";
import { YouTubeSubscribeBanner } from "./compositions/overlays/YouTubeSubscribeBanner";
import { YouTubeLikeButton, YouTubeLiveBadge } from "./compositions/overlays/YouTubeLikeButton";
import {
  InstagramProfileBanner,
  InstagramHeartNotification,
} from "./compositions/overlays/InstagramProfileBanner";
import { TikTokCommentPopup } from "./compositions/overlays/TikTokCommentPopup";
import { ChatOverlay, IMessageNotification } from "./compositions/overlays/ChatOverlay";
import {
  DiscordCall,
  KickProfile,
  FollowNotification,
} from "./compositions/overlays/PlatformOverlays";
import {
  LogoReveal,
  BrowserAddressBar,
  SearchBarTyping,
} from "./compositions/overlays/UtilityOverlays";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const COMPOSITION_REGISTRY: Record<string, ComponentType<any>> = {
  BoldTitleHook,
  CounterReveal,
  GradientTextReveal,
  ThreePointReveal,
  QuoteSpotlight,
  ZoomTransition,
  SaasMetricCard,
  FinanceMarketAlert,
  ComparisonBars,
  YouTubeEngagement,
  YouTubeSubscribeBanner,
  YouTubeLikeButton,
  YouTubeLiveBadge,
  InstagramProfileBanner,
  InstagramHeartNotification,
  TikTokCommentPopup,
  ChatOverlay,
  IMessageNotification,
  DiscordCall,
  KickProfile,
  FollowNotification,
  LogoReveal,
  BrowserAddressBar,
  SearchBarTyping,
};

export function getComposition(id: string) {
  return COMPOSITION_REGISTRY[id];
}

export {
  BoldTitleHook,
  CounterReveal,
  GradientTextReveal,
  ThreePointReveal,
  QuoteSpotlight,
  ZoomTransition,
  SaasMetricCard,
  FinanceMarketAlert,
  ComparisonBars,
  YouTubeEngagement,
  YouTubeSubscribeBanner,
  YouTubeLikeButton,
  YouTubeLiveBadge,
  InstagramProfileBanner,
  InstagramHeartNotification,
  TikTokCommentPopup,
  ChatOverlay,
  IMessageNotification,
  DiscordCall,
  KickProfile,
  FollowNotification,
  LogoReveal,
  BrowserAddressBar,
  SearchBarTyping,
};

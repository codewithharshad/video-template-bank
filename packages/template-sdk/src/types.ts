export type Orientation = "portrait" | "landscape" | "square";

export type TemplateCategory =
  | "text-animation"
  | "engagement-mockup"
  | "animated-flowchart"
  | "logo-animation"
  | "transitions"
  | "ui-animation"
  | "social-overlay"
  | "subscribe-banner"
  | "comment-popup"
  | "profile-banner"
  | "chat-mockup"
  | "search-bar"
  | "notification";

export type TemplateKind = "hook" | "overlay";

export type OverlayPlatform =
  | "youtube"
  | "instagram"
  | "tiktok"
  | "twitch"
  | "kick"
  | "discord"
  | "twitter"
  | "threads"
  | "reddit"
  | "whatsapp"
  | "imessage"
  | "browser"
  | "generic";

export type VisualStyle =
  | "minimal"
  | "bold"
  | "dark-mode"
  | "energetic"
  | "smooth"
  | "tech"
  | "glow";

export type CreatorStyle =
  | "hormozi"
  | "johnny-harris"
  | "vox"
  | "saas"
  | "viral-reels";

export type Platform =
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "instagram"
  | "twitch"
  | "kick"
  | "discord"
  | "twitter"
  | "threads"
  | "reddit";

export type PropFieldType = "text" | "color" | "number" | "image";

export interface PropField {
  key: string;
  label: string;
  type: PropFieldType;
  defaultValue: string | number;
  maxLength?: number;
  bindToBrand?: "primary" | "secondary" | "accent";
}

export interface HookTemplate {
  id: string;
  slug: string;
  name: string;
  description: string;
  templateKind?: TemplateKind;
  overlayPlatform?: OverlayPlatform;
  compositionId: string;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  orientation: Orientation;
  categories: TemplateCategory[];
  visualStyles: VisualStyle[];
  creatorStyles: CreatorStyle[];
  platforms: Platform[];
  niches: string[];
  isPro: boolean;
  isFree: boolean;
  popularity: number;
  previewGradient: string;
  props: PropField[];
  /** Content crop size at 1080p — overrides composition defaults when set */
  exportFrame?: {
    width: number;
    height: number;
    variants?: Record<string, { width: number; height: number }>;
  };
}

export interface BrandKit {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
}

export interface TemplateProps {
  [key: string]: string | number;
}

export interface FilterState {
  categories: TemplateCategory[];
  visualStyles: VisualStyle[];
  creatorStyles: CreatorStyle[];
  platforms: Platform[];
  templateKind: TemplateKind | null;
  orientation: Orientation | null;
  search: string;
  sort: "newest" | "popular";
}

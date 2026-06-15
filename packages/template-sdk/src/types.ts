export type Orientation = "portrait" | "landscape" | "square";

export type TemplateCategory =
  | "text-animation"
  | "engagement-mockup"
  | "animated-flowchart"
  | "logo-animation"
  | "transitions"
  | "ui-animation";

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

export type Platform = "tiktok" | "youtube" | "linkedin" | "instagram";

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
  orientation: Orientation | null;
  search: string;
  sort: "newest" | "popular";
}

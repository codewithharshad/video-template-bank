export type HyperFramesCategory =
  | "typography"
  | "product"
  | "data"
  | "social"
  | "code";

export type HyperFramesFormat = "landscape" | "portrait";

export interface HyperFramesExample {
  slug: string;
  name: string;
  description: string;
  category: HyperFramesCategory;
  format: HyperFramesFormat;
  duration: number;
  width: number;
  height: number;
  compositionId: string;
  cliExample: string;
  tags: string[];
  accent: string;
  /** True when the composition is authored with a transparent canvas (overlays). */
  transparentExport: boolean;
}

export const HYPERFRAMES_CATEGORIES: Record<
  HyperFramesCategory,
  { label: string; color: string }
> = {
  typography: { label: "Typography", color: "#f97316" },
  product: { label: "Product", color: "#8b5cf6" },
  data: { label: "Data", color: "#c45c26" },
  social: { label: "Social", color: "#ec4899" },
  code: { label: "Code", color: "#06b6d4" },
};

export const HYPERFRAMES_EXAMPLES: HyperFramesExample[] = [
  {
    slug: "kinetic-type",
    name: "Kinetic Type",
    description:
      "Bold kinetic typography with staggered word reveals and elastic motion.",
    category: "typography",
    format: "landscape",
    duration: 3.2,
    width: 1920,
    height: 1080,
    compositionId: "kinetic-type",
    cliExample: "kinetic-type",
    tags: ["GSAP", "typography", "promo"],
    accent: "#f97316",
    transparentExport: false,
  },
  {
    slug: "product-promo",
    name: "Product Promo",
    description:
      "Clean product card reveal with logo animation and CTA button.",
    category: "product",
    format: "landscape",
    duration: 2.8,
    width: 1920,
    height: 1080,
    compositionId: "product-promo",
    cliExample: "product-promo",
    tags: ["product", "launch", "SaaS"],
    accent: "#8b5cf6",
    transparentExport: false,
  },
  {
    slug: "data-chart",
    name: "Data Chart",
    description:
      "Editorial-style animated bar chart with staggered reveals and value labels.",
    category: "data",
    format: "landscape",
    duration: 2.5,
    width: 1920,
    height: 1080,
    compositionId: "data-chart",
    cliExample: "nyt-graph",
    tags: ["data", "chart", "editorial"],
    accent: "#c45c26",
    transparentExport: false,
  },
  {
    slug: "social-follow",
    name: "Social Follow Card",
    description:
      "Animated social follow overlay with profile card and follow button.",
    category: "social",
    format: "landscape",
    duration: 2.0,
    width: 1920,
    height: 1080,
    compositionId: "social-follow",
    cliExample: "play-mode",
    tags: ["social", "overlay", "follow"],
    accent: "#ec4899",
    transparentExport: true,
  },
  {
    slug: "lower-third",
    name: "YouTube Lower Third",
    description:
      "YouTube-style subscribe lower third with accent bar and channel info.",
    category: "social",
    format: "landscape",
    duration: 1.8,
    width: 1920,
    height: 1080,
    compositionId: "lower-third",
    cliExample: "warm-grain",
    tags: ["YouTube", "lower third", "subscribe"],
    accent: "#ef4444",
    transparentExport: true,
  },
  {
    slug: "code-reveal",
    name: "Code Reveal",
    description:
      "Terminal-style code snippet with typing animation and blinking cursor.",
    category: "code",
    format: "landscape",
    duration: 3.0,
    width: 1920,
    height: 1080,
    compositionId: "code-reveal",
    cliExample: "swiss-grid",
    tags: ["code", "terminal", "dev"],
    accent: "#06b6d4",
    transparentExport: false,
  },
];

export function getHyperFramesExample(
  slug: string
): HyperFramesExample | undefined {
  return HYPERFRAMES_EXAMPLES.find((e) => e.slug === slug);
}

export function getCompositionSrc(slug: string): string {
  return `/hyperframes/compositions/${slug}.html`;
}

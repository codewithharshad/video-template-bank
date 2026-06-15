import type { HookTemplate } from "./types";

export const DEFAULT_BRAND = {
  name: "My Brand",
  primaryColor: "#6366f1",
  secondaryColor: "#1e1b4b",
  accentColor: "#22d3ee",
  fontFamily: "Inter",
};

export const TEMPLATE_CATALOG: HookTemplate[] = [
  {
    id: "1",
    slug: "bold-title-hook",
    name: "Bold Title Hook",
    description:
      "High-impact kinetic title with staggered word reveal. Perfect for cold opens and pattern interrupts.",
    compositionId: "BoldTitleHook",
    durationInFrames: 90,
    fps: 30,
    width: 1080,
    height: 1920,
    orientation: "portrait",
    categories: ["text-animation"],
    visualStyles: ["bold", "energetic"],
    creatorStyles: ["hormozi", "viral-reels"],
    platforms: ["tiktok", "youtube", "instagram"],
    niches: ["business", "finance", "personal-brand"],
    isPro: false,
    isFree: true,
    popularity: 98,
    previewGradient: "from-violet-600 via-fuchsia-600 to-orange-500",
    props: [
      { key: "headline", label: "Headline", type: "text", defaultValue: "This changes everything", maxLength: 60 },
      { key: "subtext", label: "Subtext", type: "text", defaultValue: "Watch until the end", maxLength: 80 },
      { key: "accentColor", label: "Accent", type: "color", defaultValue: "#f97316", bindToBrand: "accent" },
      { key: "backgroundColor", label: "Background", type: "color", defaultValue: "#0a0a0a", bindToBrand: "secondary" },
    ],
  },
  {
    id: "2",
    slug: "counter-reveal",
    name: "Counter Reveal",
    description:
      "Animated number counter with label reveal. Ideal for stats, growth metrics, and data-driven hooks.",
    compositionId: "CounterReveal",
    durationInFrames: 120,
    fps: 30,
    width: 1080,
    height: 1920,
    orientation: "portrait",
    categories: ["text-animation", "animated-flowchart"],
    visualStyles: ["tech", "smooth", "dark-mode"],
    creatorStyles: ["johnny-harris", "vox"],
    platforms: ["youtube", "linkedin", "tiktok"],
    niches: ["finance", "saas", "education"],
    isPro: false,
    isFree: true,
    popularity: 94,
    previewGradient: "from-slate-900 via-indigo-900 to-cyan-800",
    props: [
      { key: "value", label: "Number", type: "number", defaultValue: 847 },
      { key: "suffix", label: "Suffix", type: "text", defaultValue: "%", maxLength: 10 },
      { key: "label", label: "Label", type: "text", defaultValue: "Audience retention increase", maxLength: 60 },
      { key: "accentColor", label: "Accent", type: "color", defaultValue: "#22d3ee", bindToBrand: "accent" },
      { key: "backgroundColor", label: "Background", type: "color", defaultValue: "#030712", bindToBrand: "secondary" },
    ],
  },
  {
    id: "3",
    slug: "gradient-text-reveal",
    name: "Gradient Text Reveal",
    description:
      "Smooth SaaS-style gradient text with glass panel. Clean, modern opener for product and tech content.",
    compositionId: "GradientTextReveal",
    durationInFrames: 100,
    fps: 30,
    width: 1080,
    height: 1920,
    orientation: "portrait",
    categories: ["text-animation", "ui-animation"],
    visualStyles: ["minimal", "smooth", "glow"],
    creatorStyles: ["saas", "viral-reels"],
    platforms: ["linkedin", "youtube", "instagram"],
    niches: ["saas", "startup", "tech"],
    isPro: true,
    isFree: false,
    popularity: 91,
    previewGradient: "from-indigo-500 via-purple-500 to-pink-500",
    props: [
      { key: "headline", label: "Headline", type: "text", defaultValue: "Ship hooks 10x faster", maxLength: 50 },
      { key: "tagline", label: "Tagline", type: "text", defaultValue: "No After Effects required", maxLength: 60 },
      { key: "primaryColor", label: "Primary", type: "color", defaultValue: "#6366f1", bindToBrand: "primary" },
      { key: "accentColor", label: "Accent", type: "color", defaultValue: "#ec4899", bindToBrand: "accent" },
      { key: "backgroundColor", label: "Background", type: "color", defaultValue: "#09090b", bindToBrand: "secondary" },
    ],
  },
  {
    id: "4",
    slug: "three-point-reveal",
    name: "Three-Point Feature Reveal",
    description:
      "Sequential bullet reveal with icons. Great for listicles, tips, and framework intros.",
    compositionId: "ThreePointReveal",
    durationInFrames: 150,
    fps: 30,
    width: 1920,
    height: 1080,
    orientation: "landscape",
    categories: ["text-animation", "animated-flowchart"],
    visualStyles: ["bold", "tech"],
    creatorStyles: ["hormozi", "saas"],
    platforms: ["youtube", "linkedin"],
    niches: ["business", "saas", "education"],
    isPro: true,
    isFree: false,
    popularity: 88,
    previewGradient: "from-blue-600 via-violet-600 to-purple-800",
    props: [
      { key: "title", label: "Title", type: "text", defaultValue: "3 things you need to know", maxLength: 50 },
      { key: "point1", label: "Point 1", type: "text", defaultValue: "Hook in the first 3 seconds", maxLength: 40 },
      { key: "point2", label: "Point 2", type: "text", defaultValue: "Motion beats static every time", maxLength: 40 },
      { key: "point3", label: "Point 3", type: "text", defaultValue: "Export with alpha for pro edits", maxLength: 40 },
      { key: "accentColor", label: "Accent", type: "color", defaultValue: "#8b5cf6", bindToBrand: "primary" },
      { key: "backgroundColor", label: "Background", type: "color", defaultValue: "#0f172a", bindToBrand: "secondary" },
    ],
  },
  {
    id: "5",
    slug: "quote-spotlight",
    name: "Quote Spotlight",
    description:
      "Dramatic quote animation with spotlight emphasis. Perfect for testimonials and thought leadership.",
    compositionId: "QuoteSpotlight",
    durationInFrames: 110,
    fps: 30,
    width: 1080,
    height: 1920,
    orientation: "portrait",
    categories: ["text-animation"],
    visualStyles: ["dark-mode", "glow", "minimal"],
    creatorStyles: ["johnny-harris", "vox"],
    platforms: ["instagram", "linkedin", "youtube"],
    niches: ["personal-brand", "education", "motivation"],
    isPro: false,
    isFree: true,
    popularity: 85,
    previewGradient: "from-zinc-900 via-amber-900/40 to-zinc-900",
    props: [
      { key: "quote", label: "Quote", type: "text", defaultValue: "The first 3 seconds decide everything.", maxLength: 100 },
      { key: "author", label: "Author", type: "text", defaultValue: "— Every creator ever", maxLength: 40 },
      { key: "accentColor", label: "Accent", type: "color", defaultValue: "#fbbf24", bindToBrand: "accent" },
      { key: "backgroundColor", label: "Background", type: "color", defaultValue: "#09090b", bindToBrand: "secondary" },
    ],
  },
  {
    id: "6",
    slug: "zoom-transition",
    name: "Zoom Section Transition",
    description:
      "Seamless zoom punch transition between sections. Drop between clips for pro pacing.",
    compositionId: "ZoomTransition",
    durationInFrames: 45,
    fps: 30,
    width: 1080,
    height: 1920,
    orientation: "portrait",
    categories: ["transitions"],
    visualStyles: ["energetic", "smooth"],
    creatorStyles: ["viral-reels"],
    platforms: ["tiktok", "instagram", "youtube"],
    niches: ["lifestyle", "business", "education"],
    isPro: false,
    isFree: true,
    popularity: 82,
    previewGradient: "from-rose-500 via-orange-500 to-yellow-400",
    props: [
      { key: "text", label: "Flash Text", type: "text", defaultValue: "BUT WAIT", maxLength: 20 },
      { key: "accentColor", label: "Accent", type: "color", defaultValue: "#ffffff", bindToBrand: "accent" },
      { key: "backgroundColor", label: "Background", type: "color", defaultValue: "#ef4444", bindToBrand: "primary" },
    ],
  },
  {
    id: "7",
    slug: "saas-metric-card",
    name: "SaaS MRR Metric Card",
    description:
      "Glassmorphic dashboard card with animated progress bar. Perfect for SaaS growth and KPI hooks.",
    compositionId: "SaasMetricCard",
    durationInFrames: 120,
    fps: 30,
    width: 1080,
    height: 1920,
    orientation: "portrait",
    categories: ["ui-animation", "text-animation"],
    visualStyles: ["minimal", "smooth", "tech"],
    creatorStyles: ["saas"],
    platforms: ["linkedin", "youtube", "instagram"],
    niches: ["saas", "startup", "tech"],
    isPro: false,
    isFree: true,
    popularity: 96,
    previewGradient: "from-indigo-600 via-violet-600 to-fuchsia-600",
    props: [
      { key: "headline", label: "Headline", type: "text", defaultValue: "Monthly recurring revenue", maxLength: 50 },
      { key: "metricLabel", label: "Metric label", type: "text", defaultValue: "MRR", maxLength: 30 },
      { key: "metricValue", label: "Metric value", type: "text", defaultValue: "$124K", maxLength: 20 },
      { key: "changePercent", label: "Change %", type: "number", defaultValue: 23 },
      { key: "primaryColor", label: "Primary", type: "color", defaultValue: "#6366f1", bindToBrand: "primary" },
      { key: "accentColor", label: "Accent", type: "color", defaultValue: "#ec4899", bindToBrand: "accent" },
      { key: "backgroundColor", label: "Background", type: "color", defaultValue: "#0c0a1d", bindToBrand: "secondary" },
    ],
  },
  {
    id: "8",
    slug: "finance-market-alert",
    name: "Finance Market Alert",
    description:
      "Breaking market alert with ticker, price, and directional change. Built for finance and crypto creators.",
    compositionId: "FinanceMarketAlert",
    durationInFrames: 110,
    fps: 30,
    width: 1080,
    height: 1920,
    orientation: "portrait",
    categories: ["text-animation", "ui-animation"],
    visualStyles: ["bold", "tech", "dark-mode"],
    creatorStyles: ["hormozi", "viral-reels"],
    platforms: ["tiktok", "youtube", "instagram"],
    niches: ["finance", "crypto", "business"],
    isPro: true,
    isFree: false,
    popularity: 93,
    previewGradient: "from-emerald-900 via-slate-900 to-red-950",
    props: [
      { key: "headline", label: "Headline", type: "text", defaultValue: "Bitcoin just broke resistance", maxLength: 60 },
      { key: "ticker", label: "Ticker", type: "text", defaultValue: "BTC/USD", maxLength: 15 },
      { key: "price", label: "Price", type: "text", defaultValue: "$98,420", maxLength: 15 },
      { key: "changePercent", label: "Change %", type: "number", defaultValue: 4.7 },
      { key: "accentColor", label: "Accent", type: "color", defaultValue: "#f59e0b", bindToBrand: "accent" },
      { key: "backgroundColor", label: "Background", type: "color", defaultValue: "#020617", bindToBrand: "secondary" },
    ],
  },
  {
    id: "9",
    slug: "comparison-bars",
    name: "Side-by-Side Comparison Bars",
    description:
      "Animated bar chart comparing two metrics. Ideal for before/after, us vs them, and strategy comparisons.",
    compositionId: "ComparisonBars",
    durationInFrames: 120,
    fps: 30,
    width: 1080,
    height: 1920,
    orientation: "portrait",
    categories: ["animated-flowchart", "text-animation"],
    visualStyles: ["bold", "tech"],
    creatorStyles: ["johnny-harris", "saas"],
    platforms: ["youtube", "linkedin", "tiktok"],
    niches: ["finance", "saas", "education"],
    isPro: false,
    isFree: true,
    popularity: 90,
    previewGradient: "from-cyan-700 via-slate-800 to-violet-800",
    props: [
      { key: "title", label: "Title", type: "text", defaultValue: "Manual editing vs HookForge", maxLength: 50 },
      { key: "labelA", label: "Option A", type: "text", defaultValue: "After Effects", maxLength: 25 },
      { key: "valueA", label: "Value A", type: "number", defaultValue: 4 },
      { key: "labelB", label: "Option B", type: "text", defaultValue: "HookForge", maxLength: 25 },
      { key: "valueB", label: "Value B", type: "number", defaultValue: 47 },
      { key: "unit", label: "Unit", type: "text", defaultValue: " hrs", maxLength: 10 },
      { key: "accentColor", label: "Bar A color", type: "color", defaultValue: "#ef4444", bindToBrand: "accent" },
      { key: "secondaryColor", label: "Bar B color", type: "color", defaultValue: "#22c55e", bindToBrand: "primary" },
      { key: "backgroundColor", label: "Background", type: "color", defaultValue: "#09090b", bindToBrand: "secondary" },
    ],
  },
];

export function getTemplateBySlug(slug: string): HookTemplate | undefined {
  return TEMPLATE_CATALOG.find((t) => t.slug === slug);
}

export function getDefaultProps(template: HookTemplate): Record<string, string | number> {
  return Object.fromEntries(template.props.map((p) => [p.key, p.defaultValue]));
}

export function applyBrandToProps(
  template: HookTemplate,
  props: Record<string, string | number>,
  brand: typeof DEFAULT_BRAND
): Record<string, string | number> {
  const result = { ...props };
  for (const field of template.props) {
    if (field.bindToBrand && field.type === "color") {
      const brandKey = `${field.bindToBrand}Color` as keyof typeof brand;
      if (brand[brandKey]) {
        result[field.key] = brand[brandKey] as string;
      }
    }
  }
  return result;
}

export function filterTemplates(
  templates: HookTemplate[],
  filters: {
    categories?: string[];
    visualStyles?: string[];
    creatorStyles?: string[];
    orientation?: string | null;
    search?: string;
    sort?: "newest" | "popular";
  }
): HookTemplate[] {
  let result = [...templates];

  if (filters.categories?.length) {
    result = result.filter((t) =>
      t.categories.some((c) => filters.categories!.includes(c))
    );
  }
  if (filters.visualStyles?.length) {
    result = result.filter((t) =>
      t.visualStyles.some((s) => filters.visualStyles!.includes(s))
    );
  }
  if (filters.creatorStyles?.length) {
    result = result.filter((t) =>
      t.creatorStyles.some((s) => filters.creatorStyles!.includes(s))
    );
  }
  if (filters.orientation) {
    result = result.filter((t) => t.orientation === filters.orientation);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.niches.some((n) => n.includes(q)) ||
        t.creatorStyles.some((s) => s.includes(q))
    );
  }

  if (filters.sort === "popular") {
    result.sort((a, b) => b.popularity - a.popularity);
  }

  return result;
}

export const CATEGORY_LABELS: Record<string, string> = {
  "text-animation": "Text Animation",
  "engagement-mockup": "Engagement Mockup",
  "animated-flowchart": "Animated Flowchart",
  "logo-animation": "Logo Animation",
  transitions: "Transitions",
  "ui-animation": "UI Animation",
};

export const STYLE_LABELS: Record<string, string> = {
  minimal: "Minimal",
  bold: "Bold",
  "dark-mode": "Dark Mode",
  energetic: "Energetic",
  smooth: "Smooth",
  tech: "Tech",
  glow: "Glow",
};

export const CREATOR_LABELS: Record<string, string> = {
  hormozi: "Hormozi Style",
  "johnny-harris": "Johnny Harris",
  vox: "Vox Style",
  saas: "SaaS Style",
  "viral-reels": "Viral Reels",
};

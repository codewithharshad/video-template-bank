/** Static gradient map so Tailwind includes these utility classes at build time. */
const PREVIEW_GRADIENTS: Record<string, string> = {
  "bold-title-hook": "from-violet-600 via-fuchsia-600 to-orange-500",
  "counter-reveal": "from-slate-900 via-indigo-900 to-cyan-800",
  "gradient-text-reveal": "from-indigo-500 via-purple-500 to-pink-500",
  "three-point-reveal": "from-blue-600 via-violet-600 to-purple-800",
  "quote-spotlight": "from-zinc-900 via-amber-900/40 to-zinc-900",
  "zoom-transition": "from-rose-500 via-orange-500 to-yellow-400",
  "saas-metric-card": "from-indigo-600 via-violet-600 to-fuchsia-600",
  "finance-market-alert": "from-emerald-900 via-slate-900 to-red-950",
  "comparison-bars": "from-cyan-700 via-slate-800 to-violet-800",
};

export function getPreviewGradientClass(slug: string): string {
  return PREVIEW_GRADIENTS[slug] ?? "from-zinc-800 via-zinc-900 to-black";
}

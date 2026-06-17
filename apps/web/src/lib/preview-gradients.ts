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
  "youtube-like-comment-subscribe": "from-red-600 via-zinc-900 to-black",
  "youtube-like-button": "from-zinc-800 via-red-900/40 to-zinc-900",
  "youtube-subscribe-banner": "from-red-700 via-zinc-900 to-black",
  "youtube-live-badge": "from-red-600 via-rose-900 to-black",
  "instagram-profile-banner-light": "from-pink-500 via-purple-500 to-orange-400",
  "instagram-profile-banner-dark": "from-purple-900 via-fuchsia-900 to-black",
  "instagram-profile-grid": "from-violet-600 via-pink-600 to-orange-500",
  "instagram-heart-notification": "from-rose-500 via-pink-600 to-purple-700",
  "tiktok-comment-popup": "from-cyan-500 via-pink-500 to-black",
  "whatsapp-chat-dark": "from-emerald-800 via-teal-900 to-black",
  "imessage-notification": "from-zinc-700 via-zinc-900 to-black",
  "discord-call-dark": "from-indigo-700 via-violet-900 to-black",
  "kick-profile": "from-lime-400 via-green-900 to-black",
  "twitch-follow-alert": "from-purple-600 via-violet-900 to-black",
  "twitter-follow-alert": "from-sky-500 via-blue-900 to-black",
  "reddit-award-notification": "from-orange-500 via-red-900 to-black",
  "threads-follow-alert": "from-zinc-600 via-zinc-900 to-black",
  "logo-animation": "from-violet-600 via-indigo-600 to-cyan-500",
  "browser-address-bar": "from-slate-500 via-zinc-700 to-zinc-900",
  "google-search-bar": "from-blue-500 via-white/20 to-zinc-800",
};

export function getPreviewGradientClass(slug: string): string {
  return PREVIEW_GRADIENTS[slug] ?? "from-zinc-800 via-zinc-900 to-black";
}

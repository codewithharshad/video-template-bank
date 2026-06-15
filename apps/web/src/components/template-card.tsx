import Link from "next/link";
import { Crown, Play } from "lucide-react";
import type { HookTemplate } from "@video-lib/template-sdk";
import { CATEGORY_LABELS } from "@video-lib/template-sdk";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: HookTemplate;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link
      href={`/hooks/${template.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 transition-all hover:border-violet-500/40 hover:bg-zinc-900/70 hover:shadow-lg hover:shadow-violet-500/5"
    >
      <div
        className={cn(
          "relative aspect-[9/16] w-full overflow-hidden bg-gradient-to-br",
          template.previewGradient
        )}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Play className="h-6 w-6 fill-white text-white" />
          </div>
        </div>

        {template.isPro && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-semibold text-black">
            <Crown className="h-3 w-3" />
            Pro
          </div>
        )}

        {template.isFree && !template.isPro && (
          <div className="absolute right-3 top-3 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-semibold text-black">
            Free
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold leading-snug text-zinc-100 group-hover:text-white">
          {template.name}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {template.categories.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

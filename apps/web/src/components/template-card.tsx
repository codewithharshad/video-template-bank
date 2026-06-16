import Link from "next/link";
import { Crown, Play } from "lucide-react";
import type { HookTemplate } from "@video-lib/template-sdk";
import { CATEGORY_LABELS } from "@video-lib/template-sdk";
import { TemplateCardPreview } from "@/components/template-card-preview";

interface TemplateCardProps {
  template: HookTemplate;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link
      href={`/hooks/${template.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 transition-all hover:border-violet-500/40 hover:bg-zinc-900/70 hover:shadow-lg hover:shadow-violet-500/5"
    >
      <div className="relative flex justify-center bg-zinc-950/50 px-3 pb-2 pt-3">
        <div className="relative h-48 w-[54%] overflow-hidden rounded-lg border border-zinc-800/70 shadow-md shadow-black/30">
          <TemplateCardPreview template={template} />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/25 group-hover:opacity-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Play className="h-4 w-4 fill-white text-white" />
            </div>
          </div>

          {template.isPro && (
            <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-semibold text-black">
              <Crown className="h-2.5 w-2.5" />
              Pro
            </div>
          )}

          {template.isFree && !template.isPro && (
            <div className="absolute right-1.5 top-1.5 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold text-black">
              Free
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 px-3 pb-3 pt-1">
        <h3 className="truncate text-sm font-semibold text-zinc-100 group-hover:text-white">
          {template.name}
        </h3>
        <div className="flex flex-wrap gap-1">
          {template.categories.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400"
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

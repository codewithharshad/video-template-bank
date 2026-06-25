import Link from "next/link";
import { ArrowRight, Crown, Play } from "lucide-react";
import type { HookTemplate } from "@video-lib/template-sdk";
import { CATEGORY_LABELS } from "@video-lib/template-sdk";
import { TemplateCardPreview } from "@/components/template-card-preview";

interface TemplateCardProps {
  template: HookTemplate;
  basePath?: string;
}

export function TemplateCard({ template, basePath = "/hooks" }: TemplateCardProps) {
  return (
    <Link
      href={`${basePath}/${template.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-2.5 transition-all hover:border-amber-500/40 hover:bg-zinc-900/70"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-950">
        <TemplateCardPreview template={template} />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="absolute bottom-2.5 left-2.5 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md transition-transform group-hover:scale-105">
          <Play className="h-3.5 w-3.5 fill-white text-white" />
        </div>

        <div className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md transition-all group-hover:border-amber-400/60 group-hover:bg-amber-400 group-hover:text-zinc-950">
          <ArrowRight className="h-4 w-4 text-white transition-colors group-hover:text-zinc-950" />
        </div>
      </div>

      <div className="flex flex-col gap-2 px-1 pb-1">
        <h3 className="line-clamp-1 text-sm font-semibold text-zinc-100 group-hover:text-white">
          {template.name}
        </h3>
        <div className="flex flex-wrap items-center gap-1.5">
          {template.isPro && (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
              <Crown className="h-2.5 w-2.5" />
              Pro
            </span>
          )}
          {template.isFree && !template.isPro && (
            <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
              Free
            </span>
          )}
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

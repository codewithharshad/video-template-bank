"use client";

import Link from "next/link";
import { ArrowRight, Clock, Monitor } from "lucide-react";
import type { HyperFramesExample } from "@/lib/hyperframes-catalog";
import { HYPERFRAMES_CATEGORIES } from "@/lib/hyperframes-catalog";
import { HyperFramesPlayer } from "@/components/hyperframes-player";
import { getCompositionSrc } from "@/lib/hyperframes-catalog";

interface HyperFramesCardProps {
  example: HyperFramesExample;
}

export function HyperFramesCard({ example }: HyperFramesCardProps) {
  const category = HYPERFRAMES_CATEGORIES[example.category];

  return (
    <Link
      href={`/hyperframes/${example.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 transition-all hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5"
    >
      <div className="relative aspect-video overflow-hidden bg-zinc-950">
        <HyperFramesPlayer
          src={getCompositionSrc(example.slug)}
          width={example.width}
          height={example.height}
          controls={false}
          autoplay
          loop
          className="pointer-events-none h-full w-full [&_hyperframes-player]:h-full [&_hyperframes-player]:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium text-white"
          style={{ backgroundColor: `${category.color}33`, color: category.color }}
        >
          {category.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-white group-hover:text-amber-300 transition-colors">
          {example.name}
        </h3>
        <p className="mt-1.5 flex-1 text-sm text-zinc-400 line-clamp-2">
          {example.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {example.duration}s
            </span>
            <span className="flex items-center gap-1">
              <Monitor className="h-3 w-3" />
              {example.format}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">
            Open
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

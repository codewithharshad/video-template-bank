"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { HookTemplate } from "@video-lib/template-sdk";
import { getPreviewGradientClass } from "@/lib/preview-gradients";
import { cn } from "@/lib/utils";

const TemplateCardPlayer = dynamic(
  () =>
    import("@/components/template-card-player").then(
      (mod) => mod.TemplateCardPlayer
    ),
  { ssr: false }
);

interface TemplateCardPreviewProps {
  template: HookTemplate;
}

export function TemplateCardPreview({ template }: TemplateCardPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const gradient = getPreviewGradientClass(template.slug);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-opacity duration-300",
          gradient,
          shouldLoad ? "opacity-0" : "opacity-100"
        )}
        aria-hidden
      />
      {shouldLoad ? (
        <div className="absolute inset-0">
          <TemplateCardPlayer template={template} />
        </div>
      ) : null}
    </div>
  );
}

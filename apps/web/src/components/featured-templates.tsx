"use client";

import { useMemo } from "react";
import { useCatalog } from "@/components/catalog-provider";
import { TemplateCard } from "@/components/template-card";

export function FeaturedTemplates({ count = 10 }: { count?: number }) {
  const { templates } = useCatalog();

  const featured = useMemo(() => {
    const free = templates.filter((t) => t.isFree);
    const rest = templates.filter((t) => !t.isFree);
    return [...free, ...rest].slice(0, count);
  }, [templates, count]);

  if (featured.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
      {featured.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}

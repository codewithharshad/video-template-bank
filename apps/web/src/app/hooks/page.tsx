"use client";

import { useMemo, useState } from "react";
import {
  filterTemplates,
  type FilterState,
} from "@video-lib/template-sdk";
import { useCatalog } from "@/components/catalog-provider";
import { TemplateCard } from "@/components/template-card";
import { ActiveFilters, FilterSidebar, SearchBar } from "@/components/filter-sidebar";
import { BrandKitPanel } from "@/components/brand-kit-panel";
import { sortTemplatesByRenderCost } from "@/lib/render-cost";

export default function HooksPage() {
  const { templates } = useCatalog();
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    visualStyles: [],
    creatorStyles: [],
    platforms: [],
    templateKind: "hook",
    orientation: null,
    search: "",
    sort: "popular",
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const base = filterTemplates(templates, filters);
    if (filters.sort === "render-cost") {
      return sortTemplatesByRenderCost(base);
    }
    return base;
  }, [filters, templates]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Animation Templates
        </h1>
        <p className="mt-3 text-zinc-400">
          When two videos are otherwise similar, the one with better editing wins.
          Customize a hook and export with transparent, content-sized files.
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <SearchBar
          value={filters.search}
          onChange={(search) => setFilters({ ...filters, search })}
          sort={filters.sort}
          onSortChange={(sort) => setFilters({ ...filters, sort })}
          onOpenFilters={() => setMobileFiltersOpen(true)}
        />
        <ActiveFilters filters={filters} onChange={setFilters} />
      </div>

      <div className="flex gap-8">
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          resultCount={filtered.length}
          mobileOpen={mobileFiltersOpen}
          onMobileClose={() => setMobileFiltersOpen(false)}
        />

        <div className="min-w-0 flex-1 space-y-8">
          <BrandKitPanel />

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 py-20 text-center">
              <p className="text-zinc-400">No templates match your filters.</p>
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    categories: [],
                    visualStyles: [],
                    creatorStyles: [],
                    platforms: [],
                    templateKind: "hook",
                    orientation: null,
                    search: "",
                    sort: "popular",
                  })
                }
                className="mt-4 text-sm text-amber-400 hover:text-amber-300"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

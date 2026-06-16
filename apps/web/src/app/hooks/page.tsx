"use client";

import { useMemo, useState } from "react";
import {
  TEMPLATE_CATALOG,
  filterTemplates,
  type FilterState,
} from "@video-lib/template-sdk";
import { TemplateCard } from "@/components/template-card";
import { FilterSidebar, SearchBar } from "@/components/filter-sidebar";
import { BrandKitPanel } from "@/components/brand-kit-panel";

export default function HooksPage() {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    visualStyles: [],
    creatorStyles: [],
    orientation: null,
    search: "",
    sort: "popular",
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(
    () => filterTemplates(TEMPLATE_CATALOG, filters),
    [filters]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Animation Templates
        </h1>
        <p className="mt-2 text-zinc-400">
          When two videos are otherwise similar, the one with better editing
          gets about 50% more views. Pick a hook, customize, export.
        </p>
      </div>

      <div className="mb-6">
        <SearchBar
          value={filters.search}
          onChange={(search) => setFilters({ ...filters, search })}
          sort={filters.sort}
          onSortChange={(sort) => setFilters({ ...filters, sort })}
          onOpenFilters={() => setMobileFiltersOpen(true)}
        />
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
                    orientation: null,
                    search: "",
                    sort: "popular",
                  })
                }
                className="mt-4 text-sm text-violet-400 hover:text-violet-300"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
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

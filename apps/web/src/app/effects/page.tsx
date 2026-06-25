"use client";

import { useMemo, useState } from "react";
import {
  filterTemplates,
  OVERLAY_PLATFORM_LABELS,
  type FilterState,
  type OverlayPlatform,
} from "@video-lib/template-sdk";
import { useCatalog } from "@/components/catalog-provider";
import { TemplateCard } from "@/components/template-card";
import { ActiveFilters, FilterSidebar, SearchBar } from "@/components/filter-sidebar";
import { BrandKitPanel } from "@/components/brand-kit-panel";
import { sortTemplatesByRenderCost } from "@/lib/render-cost";
import { cn } from "@/lib/utils";

export default function EffectsPage() {
  const { templates } = useCatalog();
  const platformTabs = useMemo(
    () =>
      Object.entries(OVERLAY_PLATFORM_LABELS ?? {}) as [
        OverlayPlatform,
        string,
      ][],
    []
  );
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    visualStyles: [],
    creatorStyles: [],
    platforms: [],
    templateKind: "overlay",
    orientation: null,
    search: "",
    sort: "popular",
  });
  const [platformTab, setPlatformTab] = useState<OverlayPlatform | "all">("all");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const base = filterTemplates(templates, filters);
    const scoped =
      platformTab === "all"
        ? base
        : base.filter((t) => t.overlayPlatform === platformTab);
    if (filters.sort === "render-cost") {
      return sortTemplatesByRenderCost(scoped);
    }
    return scoped;
  }, [filters, platformTab, templates]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Video Effects
        </h1>
        <p className="mt-3 text-zinc-400">
          Social media overlays — subscribe banners, comment popups, profile cards,
          and chat mockups. Customize and export with transparent backgrounds.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setPlatformTab("all")}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm",
            platformTab === "all"
              ? "bg-amber-400 text-zinc-950"
              : "bg-zinc-800/80 text-zinc-400 hover:text-zinc-200"
          )}
        >
          All platforms
        </button>
        {platformTabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setPlatformTab(key)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm",
              platformTab === key
                ? "bg-amber-400 text-zinc-950"
                : "bg-zinc-800/80 text-zinc-400 hover:text-zinc-200"
            )}
          >
            {label}
          </button>
        ))}
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
          showPlatforms
        />

        <div className="min-w-0 flex-1 space-y-8">
          <BrandKitPanel />

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 py-20 text-center">
              <p className="text-zinc-400">No effects match your filters.</p>
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    categories: [],
                    visualStyles: [],
                    creatorStyles: [],
                    platforms: [],
                    templateKind: "overlay",
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
                <TemplateCard key={template.id} template={template} basePath="/effects" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

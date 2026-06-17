"use client";

import { useMemo, useState } from "react";
import {
  TEMPLATE_CATALOG,
  filterTemplates,
  OVERLAY_PLATFORM_LABELS,
  type FilterState,
  type OverlayPlatform,
} from "@video-lib/template-sdk";
import { TemplateCard } from "@/components/template-card";
import { FilterSidebar, SearchBar } from "@/components/filter-sidebar";
import { BrandKitPanel } from "@/components/brand-kit-panel";
import { cn } from "@/lib/utils";

export default function EffectsPage() {
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
    const base = filterTemplates(TEMPLATE_CATALOG, filters);
    if (platformTab === "all") return base;
    return base.filter((t) => t.overlayPlatform === platformTab);
  }, [filters, platformTab]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Video Effects</h1>
        <p className="mt-2 text-zinc-400">
          Social media overlays — subscribe banners, comment popups, profile cards,
          chat mockups, and more. Customize and export with transparent backgrounds.
        </p>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setPlatformTab("all")}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            platformTab === "all"
              ? "bg-violet-600 text-white"
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
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              platformTab === key
                ? "bg-violet-600 text-white"
                : "bg-zinc-800/80 text-zinc-400 hover:text-zinc-200"
            )}
          >
            {label}
          </button>
        ))}
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
                className="mt-4 text-sm text-violet-400 hover:text-violet-300"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
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

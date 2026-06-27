"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  filterTemplates,
  OVERLAY_PLATFORM_LABELS,
  type FilterState,
  type HookTemplate,
  type OverlayPlatform,
  type TemplateCategory,
} from "@video-lib/template-sdk";
import { useCatalog } from "@/components/catalog-provider";
import { TemplateCard } from "@/components/template-card";
import {
  ActiveFilters,
  FilterSidebar,
  SearchBar,
} from "@/components/filter-sidebar";
import { BrandKitPanel } from "@/components/brand-kit-panel";
import { sortTemplatesByRenderCost } from "@/lib/render-cost";
import {
  clearedBrowseFilters,
  kindTabFromFilters,
  parseBrowseSearchParams,
  serializeBrowseSearchParams,
  type BrowseFilters,
  type KindTab,
} from "@/lib/template-browse-url";
import { cn } from "@/lib/utils";

function templatesForKindScope(
  templates: HookTemplate[],
  kindTab: KindTab
): HookTemplate[] {
  if (kindTab === "hook") {
    return templates.filter((t) => (t.templateKind ?? "hook") === "hook");
  }
  if (kindTab === "overlay") {
    return templates.filter((t) => t.templateKind === "overlay");
  }
  return templates;
}

function TemplateBrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { templates, loading } = useCatalog();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = useMemo(
    () => parseBrowseSearchParams(searchParams),
    [searchParams]
  );

  const kindTab = kindTabFromFilters(filters);
  const showOverlayPlatforms = kindTab === "overlay";

  const platformTabs = useMemo(
    () =>
      Object.entries(OVERLAY_PLATFORM_LABELS ?? {}) as [
        OverlayPlatform,
        string,
      ][],
    []
  );

  const syncFilters = useCallback(
    (next: BrowseFilters) => {
      router.replace(`/templates${serializeBrowseSearchParams(next)}`, {
        scroll: false,
      });
    },
    [router]
  );

  const setFilterState = useCallback(
    (next: FilterState) => {
      syncFilters({ ...filters, ...next });
    },
    [filters, syncFilters]
  );

  const setKindTab = useCallback(
    (tab: KindTab) => {
      syncFilters({
        ...filters,
        templateKind: tab === "all" ? null : tab,
        overlayPlatform: tab === "hook" ? null : filters.overlayPlatform,
      });
    },
    [filters, syncFilters]
  );

  const setOverlayPlatform = useCallback(
    (platform: OverlayPlatform | null) => {
      syncFilters({ ...filters, overlayPlatform: platform });
    },
    [filters, syncFilters]
  );

  const scopedTemplates = useMemo(
    () => templatesForKindScope(templates, kindTab),
    [templates, kindTab]
  );

  const availableCategories = useMemo(() => {
    const cats = new Set<TemplateCategory>();
    for (const t of scopedTemplates) {
      for (const c of t.categories) cats.add(c);
    }
    return [...cats].sort();
  }, [scopedTemplates]);

  const filtered = useMemo(() => {
    let base = filterTemplates(templates, filters);
    if (filters.overlayPlatform) {
      base = base.filter((t) => t.overlayPlatform === filters.overlayPlatform);
    }
    if (filters.sort === "render-cost") {
      return sortTemplatesByRenderCost(base);
    }
    return base;
  }, [filters, templates]);

  const showPlatformTabs = kindTab === "overlay";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Template Library
        </h1>
        <p className="mt-3 text-zinc-400">
          Browse animations and social overlays — customize with your brand and
          export with transparent backgrounds.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {(
          [
            ["all", "All"],
            ["hook", "Animations"],
            ["overlay", "Overlays"],
          ] as const
        ).map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            onClick={() => setKindTab(tab)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm",
              kindTab === tab
                ? "bg-amber-400 text-zinc-950"
                : "bg-zinc-800/80 text-zinc-400 hover:text-zinc-200"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {showPlatformTabs && (
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setOverlayPlatform(null)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm",
              !filters.overlayPlatform
                ? "bg-zinc-700 text-white"
                : "bg-zinc-800/80 text-zinc-400 hover:text-zinc-200"
            )}
          >
            All platforms
          </button>
          {platformTabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setOverlayPlatform(key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm",
                filters.overlayPlatform === key
                  ? "bg-zinc-700 text-white"
                  : "bg-zinc-800/80 text-zinc-400 hover:text-zinc-200"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="mb-6 space-y-4">
        <SearchBar
          value={filters.search}
          onChange={(search) => syncFilters({ ...filters, search })}
          sort={filters.sort}
          onSortChange={(sort) => syncFilters({ ...filters, sort })}
          onOpenFilters={() => setMobileFiltersOpen(true)}
        />
        <ActiveFilters
          filters={filters}
          onChange={setFilterState}
          overlayPlatform={filters.overlayPlatform}
          onClearOverlayPlatform={() => setOverlayPlatform(null)}
        />
      </div>

      <div className="flex gap-8">
        <FilterSidebar
          filters={filters}
          onChange={setFilterState}
          resultCount={filtered.length}
          mobileOpen={mobileFiltersOpen}
          onMobileClose={() => setMobileFiltersOpen(false)}
          showPlatforms={showOverlayPlatforms}
          availableCategories={availableCategories}
        />

        <div className="min-w-0 flex-1 space-y-8">
          <BrandKitPanel />

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] animate-pulse rounded-2xl border border-zinc-800/70 bg-zinc-900/40"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 py-20 text-center">
              <p className="text-zinc-400">No templates match your filters.</p>
              <button
                type="button"
                onClick={() => syncFilters(clearedBrowseFilters(filters))}
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

export function TemplateBrowsePage() {
  return <TemplateBrowseContent />;
}

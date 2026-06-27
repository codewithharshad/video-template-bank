"use client";

import { useState } from "react";
import { Check, ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import {
  CATEGORY_LABELS,
  CREATOR_LABELS,
  OVERLAY_PLATFORM_LABELS,
  PLATFORM_LABELS,
  STYLE_LABELS,
  type FilterState,
  type TemplateCategory,
  type VisualStyle,
  type CreatorStyle,
  type Orientation,
  type Platform,
  type OverlayPlatform,
} from "@video-lib/template-sdk";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
  mobileOpen: boolean;
  onMobileClose: () => void;
  showPlatforms?: boolean;
  availableCategories?: TemplateCategory[];
}

function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-800/70 pb-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-1 text-sm font-medium text-zinc-200"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-zinc-500 transition-transform",
            open ? "" : "-rotate-90"
          )}
        />
      </button>
      {open && <div className="mt-2 space-y-0.5">{children}</div>}
    </div>
  );
}

function FilterCheck({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
        active ? "text-amber-300" : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
          active ? "border-amber-400 bg-amber-400 text-zinc-950" : "border-zinc-600"
        )}
      >
        {active && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      {label}
    </button>
  );
}

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

function clearedFilters(filters: FilterState): FilterState {
  return {
    categories: [],
    visualStyles: [],
    creatorStyles: [],
    platforms: [],
    templateKind: filters.templateKind,
    orientation: null,
    search: filters.search,
    sort: filters.sort,
  };
}

export function FilterSidebar({
  filters,
  onChange,
  resultCount,
  mobileOpen,
  onMobileClose,
  showPlatforms = false,
  availableCategories,
}: FilterSidebarProps) {
  const categoryOptions =
    availableCategories ??
    (Object.keys(CATEGORY_LABELS) as TemplateCategory[]);

  const content = (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
          <SlidersHorizontal className="h-4 w-4 text-amber-400" />
          Filters
        </div>
        <span className="text-xs text-zinc-500">{resultCount}</span>
      </div>

      <div className="space-y-4">
        <FilterSection title="Categories">
          {categoryOptions.map((cat) => (
            <FilterCheck
              key={cat}
              label={CATEGORY_LABELS[cat]}
              active={filters.categories.includes(cat)}
              onClick={() =>
                onChange({
                  ...filters,
                  categories: toggleItem(filters.categories, cat),
                })
              }
            />
          ))}
        </FilterSection>

        {showPlatforms && (
          <FilterSection title="Platform">
            {(Object.keys(PLATFORM_LABELS) as Platform[]).map((platform) => (
              <FilterCheck
                key={platform}
                label={PLATFORM_LABELS[platform]}
                active={filters.platforms.includes(platform)}
                onClick={() =>
                  onChange({
                    ...filters,
                    platforms: toggleItem(filters.platforms, platform),
                  })
                }
              />
            ))}
          </FilterSection>
        )}

        <FilterSection title="Visual Style">
          {(Object.keys(STYLE_LABELS) as VisualStyle[]).map((style) => (
            <FilterCheck
              key={style}
              label={STYLE_LABELS[style]}
              active={filters.visualStyles.includes(style)}
              onClick={() =>
                onChange({
                  ...filters,
                  visualStyles: toggleItem(filters.visualStyles, style),
                })
              }
            />
          ))}
        </FilterSection>

        <FilterSection title="Creator Style">
          {(Object.keys(CREATOR_LABELS) as CreatorStyle[]).map((style) => (
            <FilterCheck
              key={style}
              label={CREATOR_LABELS[style]}
              active={filters.creatorStyles.includes(style)}
              onClick={() =>
                onChange({
                  ...filters,
                  creatorStyles: toggleItem(filters.creatorStyles, style),
                })
              }
            />
          ))}
        </FilterSection>

        <FilterSection title="Orientation">
          {(["portrait", "landscape"] as Orientation[]).map((o) => (
            <FilterCheck
              key={o}
              label={o === "portrait" ? "Portrait (9:16)" : "Landscape (16:9)"}
              active={filters.orientation === o}
              onClick={() =>
                onChange({
                  ...filters,
                  orientation: filters.orientation === o ? null : o,
                })
              }
            />
          ))}
        </FilterSection>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24 rounded-2xl border border-zinc-800/70 bg-zinc-900/30 p-4">
          {content}
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={onMobileClose}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl border-t border-zinc-800 bg-zinc-950 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              <button type="button" onClick={onMobileClose}>
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            </div>
            {content}
            <button
              type="button"
              onClick={onMobileClose}
              className="mt-6 w-full rounded-xl bg-amber-400 py-3 font-medium text-zinc-950"
            >
              Show {resultCount} results
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function ActiveFilters({
  filters,
  onChange,
  overlayPlatform,
  onClearOverlayPlatform,
}: {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  overlayPlatform?: OverlayPlatform | null;
  onClearOverlayPlatform?: () => void;
}) {
  const chips: { key: string; label: string; remove: () => void }[] = [];

  if (overlayPlatform) {
    chips.push({
      key: `overlay-${overlayPlatform}`,
      label: OVERLAY_PLATFORM_LABELS?.[overlayPlatform] ?? overlayPlatform,
      remove: () => onClearOverlayPlatform?.(),
    });
  }

  filters.categories.forEach((cat) =>
    chips.push({
      key: `cat-${cat}`,
      label: CATEGORY_LABELS[cat] ?? cat,
      remove: () =>
        onChange({
          ...filters,
          categories: filters.categories.filter((c) => c !== cat),
        }),
    })
  );
  filters.platforms.forEach((p) =>
    chips.push({
      key: `plat-${p}`,
      label: PLATFORM_LABELS[p] ?? p,
      remove: () =>
        onChange({
          ...filters,
          platforms: filters.platforms.filter((x) => x !== p),
        }),
    })
  );
  filters.visualStyles.forEach((s) =>
    chips.push({
      key: `vs-${s}`,
      label: STYLE_LABELS[s] ?? s,
      remove: () =>
        onChange({
          ...filters,
          visualStyles: filters.visualStyles.filter((x) => x !== s),
        }),
    })
  );
  filters.creatorStyles.forEach((s) =>
    chips.push({
      key: `cs-${s}`,
      label: CREATOR_LABELS[s] ?? s,
      remove: () =>
        onChange({
          ...filters,
          creatorStyles: filters.creatorStyles.filter((x) => x !== s),
        }),
    })
  );
  if (filters.orientation) {
    chips.push({
      key: "orientation",
      label: filters.orientation === "portrait" ? "Portrait" : "Landscape",
      remove: () => onChange({ ...filters, orientation: null }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.remove}
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-200 transition-colors hover:bg-amber-500/20"
        >
          {chip.label}
          <X className="h-3 w-3" />
        </button>
      ))}
      <button
        type="button"
        onClick={() => {
          onClearOverlayPlatform?.();
          onChange(clearedFilters(filters));
        }}
        className="text-xs font-medium text-zinc-400 underline-offset-2 hover:text-white hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}

export function SearchBar({
  value,
  onChange,
  sort,
  onSortChange,
  onOpenFilters,
}: {
  value: string;
  onChange: (v: string) => void;
  sort: "newest" | "popular" | "render-cost";
  onSortChange: (s: "newest" | "popular" | "render-cost") => void;
  onOpenFilters: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="search"
          placeholder="Search templates, niches, styles..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenFilters}
          className="flex items-center gap-2 rounded-xl border border-zinc-800 px-4 py-2.5 text-sm text-zinc-300 lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        <select
          value={sort}
          onChange={(e) =>
            onSortChange(e.target.value as "newest" | "popular" | "render-cost")
          }
          className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-zinc-300 focus:outline-none"
        >
          <option value="newest">Sort by Newest</option>
          <option value="popular">Sort by Popular</option>
          <option value="render-cost">Sort by Render cost</option>
        </select>
      </div>
    </div>
  );
}

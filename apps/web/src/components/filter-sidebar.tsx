"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  CATEGORY_LABELS,
  CREATOR_LABELS,
  PLATFORM_LABELS,
  STYLE_LABELS,
  type FilterState,
  type TemplateCategory,
  type VisualStyle,
  type CreatorStyle,
  type Orientation,
  type Platform,
} from "@video-lib/template-sdk";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
  mobileOpen: boolean;
  onMobileClose: () => void;
  showPlatforms?: boolean;
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function FilterChip({
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
        "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
        active
          ? "bg-violet-600/20 text-violet-300"
          : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
      )}
    >
      {label}
    </button>
  );
}

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

export function FilterSidebar({
  filters,
  onChange,
  resultCount,
  mobileOpen,
  onMobileClose,
  showPlatforms = false,
}: FilterSidebarProps) {
  const content = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <SlidersHorizontal className="h-4 w-4" />
          <span>{resultCount} templates</span>
        </div>
        <button
          type="button"
          onClick={() =>
            onChange({
              categories: [],
              visualStyles: [],
              creatorStyles: [],
              platforms: [],
              templateKind: filters.templateKind,
              orientation: null,
              search: filters.search,
              sort: filters.sort,
            })
          }
          className="text-xs text-violet-400 hover:text-violet-300"
        >
          Clear all
        </button>
      </div>

      <FilterSection title="Categories">
        {(Object.keys(CATEGORY_LABELS) as TemplateCategory[]).map((cat) => (
          <FilterChip
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
            <FilterChip
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
          <FilterChip
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
          <FilterChip
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
          <FilterChip
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
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 lg:block">{content}</aside>

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
              className="mt-6 w-full rounded-xl bg-violet-600 py-3 font-medium text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
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
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
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
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
          <option value="render-cost">Render cost (high → low)</option>
        </select>
      </div>
    </div>
  );
}

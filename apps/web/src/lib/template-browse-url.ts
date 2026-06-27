import {
  CATEGORY_LABELS,
  CREATOR_LABELS,
  OVERLAY_PLATFORM_LABELS,
  PLATFORM_LABELS,
  STYLE_LABELS,
  type CreatorStyle,
  type FilterState,
  type OverlayPlatform,
  type Orientation,
  type Platform,
  type TemplateCategory,
  type TemplateKind,
  type VisualStyle,
} from "@video-lib/template-sdk";

export type KindTab = "all" | "hook" | "overlay";

export interface BrowseFilters extends FilterState {
  overlayPlatform: OverlayPlatform | null;
}

const VALID_CATEGORIES = Object.keys(CATEGORY_LABELS) as TemplateCategory[];
const VALID_STYLES = Object.keys(STYLE_LABELS) as VisualStyle[];
const VALID_CREATORS = Object.keys(CREATOR_LABELS) as CreatorStyle[];
const VALID_PLATFORMS = Object.keys(PLATFORM_LABELS) as Platform[];
const VALID_OVERLAY_PLATFORMS = Object.keys(
  OVERLAY_PLATFORM_LABELS ?? {}
) as OverlayPlatform[];

function parseCsv<T extends string>(raw: string | null, valid: readonly T[]): T[] {
  if (!raw) return [];
  return raw.split(",").filter((v): v is T => valid.includes(v as T));
}

export function parseBrowseSearchParams(
  searchParams: URLSearchParams
): BrowseFilters {
  const kind = searchParams.get("kind");
  const templateKind: TemplateKind | null =
    kind === "hook" || kind === "overlay" ? kind : null;

  const overlayRaw = searchParams.get("overlay");
  const overlayPlatform: OverlayPlatform | null =
    overlayRaw && VALID_OVERLAY_PLATFORMS.includes(overlayRaw as OverlayPlatform)
      ? (overlayRaw as OverlayPlatform)
      : null;

  const orientationRaw = searchParams.get("orientation");
  const orientation: Orientation | null =
    orientationRaw === "portrait" || orientationRaw === "landscape"
      ? orientationRaw
      : null;

  const sortRaw = searchParams.get("sort");
  const sort: FilterState["sort"] =
    sortRaw === "newest" || sortRaw === "render-cost" ? sortRaw : "popular";

  return {
    categories: parseCsv(searchParams.get("category"), VALID_CATEGORIES),
    visualStyles: parseCsv(searchParams.get("style"), VALID_STYLES),
    creatorStyles: parseCsv(searchParams.get("creator"), VALID_CREATORS),
    platforms: parseCsv(searchParams.get("platform"), VALID_PLATFORMS),
    templateKind,
    orientation,
    search: searchParams.get("q") ?? "",
    sort,
    overlayPlatform,
  };
}

export function serializeBrowseSearchParams(filters: BrowseFilters): string {
  const params = new URLSearchParams();

  if (filters.templateKind) params.set("kind", filters.templateKind);
  if (filters.categories.length)
    params.set("category", filters.categories.join(","));
  if (filters.visualStyles.length)
    params.set("style", filters.visualStyles.join(","));
  if (filters.creatorStyles.length)
    params.set("creator", filters.creatorStyles.join(","));
  if (filters.platforms.length)
    params.set("platform", filters.platforms.join(","));
  if (filters.overlayPlatform) params.set("overlay", filters.overlayPlatform);
  if (filters.orientation) params.set("orientation", filters.orientation);
  if (filters.search) params.set("q", filters.search);
  if (filters.sort !== "popular") params.set("sort", filters.sort);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function kindTabFromFilters(filters: BrowseFilters): KindTab {
  if (filters.templateKind === "hook") return "hook";
  if (filters.templateKind === "overlay") return "overlay";
  return "all";
}

export function defaultBrowseFilters(): BrowseFilters {
  return {
    categories: [],
    visualStyles: [],
    creatorStyles: [],
    platforms: [],
    templateKind: null,
    orientation: null,
    search: "",
    sort: "popular",
    overlayPlatform: null,
  };
}

export function clearedBrowseFilters(filters: BrowseFilters): BrowseFilters {
  return {
    ...defaultBrowseFilters(),
    templateKind: filters.templateKind,
    search: filters.search,
    sort: filters.sort,
  };
}

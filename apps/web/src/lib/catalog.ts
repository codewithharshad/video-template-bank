import { eq } from "drizzle-orm";
import type { HookTemplate } from "@video-lib/template-sdk";
import {
  TEMPLATE_CATALOG,
  getTemplateBySlug as getStaticTemplateBySlug,
} from "@video-lib/template-sdk";
import {
  catalogTemplates,
  getDb,
  isDatabaseConfigured,
} from "@video-lib/database";

function rowToHookTemplate(row: typeof catalogTemplates.$inferSelect): HookTemplate {
  const meta = row.metadata as Partial<HookTemplate>;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    templateKind: row.templateKind,
    compositionId: row.compositionId,
    durationInFrames: meta.durationInFrames ?? 90,
    fps: meta.fps ?? 30,
    width: meta.width ?? 1080,
    height: meta.height ?? 1920,
    orientation: meta.orientation ?? "portrait",
    categories: meta.categories ?? [],
    visualStyles: meta.visualStyles ?? [],
    creatorStyles: meta.creatorStyles ?? [],
    platforms: meta.platforms ?? [],
    niches: meta.niches ?? [],
    isPro: meta.isPro ?? false,
    isFree: meta.isFree ?? true,
    popularity: meta.popularity ?? 50,
    previewGradient: meta.previewGradient ?? "from-violet-600 to-fuchsia-600",
    props: meta.props ?? [],
    overlayPlatform: meta.overlayPlatform,
    exportFrame: meta.exportFrame,
  };
}

export async function getPublishedCatalogTemplates(): Promise<HookTemplate[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(catalogTemplates)
    .where(eq(catalogTemplates.published, true));

  return rows.map(rowToHookTemplate);
}

export async function getMergedCatalog(): Promise<HookTemplate[]> {
  const dynamic = await getPublishedCatalogTemplates();
  const staticSlugs = new Set(TEMPLATE_CATALOG.map((t) => t.slug));
  const uniqueDynamic = dynamic.filter((t) => !staticSlugs.has(t.slug));
  return [...TEMPLATE_CATALOG, ...uniqueDynamic];
}

export async function getTemplateBySlugMerged(
  slug: string
): Promise<HookTemplate | undefined> {
  const staticTemplate = getStaticTemplateBySlug(slug);
  if (staticTemplate) {
    return staticTemplate;
  }

  if (!isDatabaseConfigured()) {
    return undefined;
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(catalogTemplates)
    .where(eq(catalogTemplates.slug, slug))
    .limit(1);
  const row = rows[0];

  if (!row || !row.published) {
    return undefined;
  }

  return rowToHookTemplate(row);
}

export function hookTemplateToMetadata(template: Partial<HookTemplate>) {
  return {
    durationInFrames: template.durationInFrames ?? 90,
    fps: template.fps ?? 30,
    width: template.width ?? 1080,
    height: template.height ?? 1920,
    orientation: template.orientation ?? "portrait",
    categories: template.categories ?? [],
    visualStyles: template.visualStyles ?? [],
    creatorStyles: template.creatorStyles ?? [],
    platforms: template.platforms ?? [],
    niches: template.niches ?? [],
    isPro: template.isPro ?? false,
    isFree: template.isFree ?? true,
    popularity: template.popularity ?? 50,
    previewGradient: template.previewGradient ?? "from-violet-600 to-fuchsia-600",
    props: template.props ?? [],
    overlayPlatform: template.overlayPlatform,
    exportFrame: template.exportFrame,
  };
}

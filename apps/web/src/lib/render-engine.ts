import { execSync } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import type { HookTemplate } from "@video-lib/template-sdk";
import { getTemplateBySlug } from "@video-lib/template-sdk";
import { coerceTemplateProps } from "@/lib/coerce-props";
import { getExportDimensions, type ExportResolution } from "@/lib/export-dimensions";
import { prepareExportProps, resolutionLabel } from "@/lib/export-props";

export type ServerExportMode = "transparent" | "solid";

export interface ServerExportRequest {
  slug: string;
  inputProps: Record<string, string | number>;
  mode: ServerExportMode;
  resolution: ExportResolution;
  /** Full template snapshot — required on the render worker for DB-only templates. */
  template?: HookTemplate;
}

export interface ServerExportResult {
  filePath: string;
  filename: string;
  width: number;
  height: number;
  transparent: boolean;
}

let bundleLocationPromise: Promise<string> | null = null;

function getEntryPoint(): string {
  if (process.env.REMOTION_ENTRYPOINT) {
    return process.env.REMOTION_ENTRYPOINT;
  }
  return path.join(process.cwd(), "src/remotion/register-root.ts");
}

async function getServeUrl(): Promise<string> {
  if (!bundleLocationPromise) {
    const { bundle } = await import("@remotion/bundler");
    bundleLocationPromise = bundle({
      entryPoint: getEntryPoint(),
      webpackOverride: (config) => config,
    });
  }
  return bundleLocationPromise;
}

async function resolveTemplate(
  request: ServerExportRequest
): Promise<HookTemplate | undefined> {
  if (request.template) {
    return request.template;
  }

  try {
    const { getTemplateBySlugMerged } = await import("@/lib/catalog");
    return getTemplateBySlugMerged(request.slug);
  } catch {
    return getTemplateBySlug(request.slug);
  }
}

export function isServerExportEnabled(): boolean {
  return process.env.ENABLE_SERVER_EXPORT !== "false";
}

export async function checkRenderEngineHealth(): Promise<{
  available: boolean;
  ffmpeg: boolean;
  message?: string;
}> {
  if (!isServerExportEnabled()) {
    return {
      available: false,
      ffmpeg: false,
      message: "Server export is disabled (ENABLE_SERVER_EXPORT=false).",
    };
  }

  let ffmpeg = false;
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
    ffmpeg = true;
  } catch {
    return {
      available: false,
      ffmpeg: false,
      message: "ffmpeg is not installed on this render host.",
    };
  }

  try {
    await getServeUrl();
    return { available: true, ffmpeg: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to bundle Remotion project.";
    return { available: false, ffmpeg, message };
  }
}

export async function renderTemplateOnServer(
  request: ServerExportRequest,
  onProgress?: (progress: number) => void
): Promise<ServerExportResult> {
  const health = await checkRenderEngineHealth();
  if (!health.available) {
    throw new Error(health.message ?? "Server export is not available.");
  }

  const template = await resolveTemplate(request);
  if (!template) {
    throw new Error(`Template not found: ${request.slug}`);
  }

  const transparent = request.mode === "transparent";
  if (!transparent && template.templateKind === "overlay" && !template.isPro) {
    throw new Error("Solid MOV export requires a Pro template.");
  }

  const coerced = coerceTemplateProps(template, request.inputProps);
  const exportProps = prepareExportProps(coerced, transparent);
  const { width, height } = getExportDimensions(template, request.resolution, {
    fitToContent: true,
    inputProps: exportProps,
  });

  const serveUrl = await getServeUrl();
  const { renderMedia, selectComposition } = await import("@remotion/renderer");

  const composition = await selectComposition({
    serveUrl,
    id: template.slug,
    inputProps: exportProps,
  });

  const tier = resolutionLabel(request.resolution);
  const alphaTag = transparent ? "transparent" : "solid";
  const filename = `hookforge-${template.slug}-${tier}-${alphaTag}-${Date.now()}.mov`;
  const outputLocation = path.join(os.tmpdir(), filename);

  await renderMedia({
    composition: {
      ...composition,
      width,
      height,
    },
    serveUrl,
    codec: transparent ? "prores" : "h264",
    proResProfile: transparent ? "4444" : undefined,
    pixelFormat: transparent ? "yuva444p10le" : "yuv420p",
    imageFormat: transparent ? "png" : "jpeg",
    inputProps: exportProps,
    outputLocation,
    muted: true,
    onProgress: ({ progress }) => {
      onProgress?.(progress);
    },
  });

  return {
    filePath: outputLocation,
    filename,
    width,
    height,
    transparent,
  };
}

export async function readExportFile(filePath: string): Promise<Buffer> {
  return fs.readFile(filePath);
}

export async function deleteExportFile(filePath: string): Promise<void> {
  await fs.unlink(filePath).catch(() => undefined);
}

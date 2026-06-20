import { execSync } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import type { HookTemplate } from "@video-lib/template-sdk";
import { getTemplateBySlug } from "@video-lib/template-sdk";
import { coerceTemplateProps } from "./coerce-props";
import { getExportDimensions, type ExportResolution } from "./export-dimensions";
import { prepareExportProps, resolutionLabel } from "./export-props";

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

function getRenderConcurrency(): number | undefined {
  const raw = process.env.REMOTION_CONCURRENCY ?? process.env.RENDER_CONCURRENCY;
  if (raw !== undefined && raw !== "") {
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed > 0) {
      return Math.floor(parsed);
    }
  }
  // ProRes 4444 + PNG frames is memory-heavy — keep low on remote workers.
  if (process.env.RENDER_WORKER_SECRET || process.env.RAILWAY_ENVIRONMENT) {
    return 1;
  }
  return undefined;
}

function formatRenderFailure(error: unknown): Error {
  const message = error instanceof Error ? error.message : String(error);
  if (/SIGKILL|sigkill|killed|out of memory|ENOMEM/i.test(message)) {
    return new Error(
      "Export ran out of memory on the render server (ProRes 4444 is heavy). " +
        "Upgrade Railway to at least 4–8 GB RAM, or use browser WebM export."
    );
  }
  return error instanceof Error ? error : new Error(message);
}

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
    const { getTemplateBySlugMerged } = await import("./catalog");
    return getTemplateBySlugMerged(request.slug);
  } catch {
    return getTemplateBySlug(request.slug);
  }
}

export function isServerExportEnabled(): boolean {
  return process.env.ENABLE_SERVER_EXPORT !== "false";
}

export async function checkRenderEngineHealth(options?: {
  /** When false, only checks ffmpeg (fast — use for load balancers). */
  deep?: boolean;
}): Promise<{
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

  if (!options?.deep) {
    return { available: true, ffmpeg: true };
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
  const concurrency = getRenderConcurrency();

  try {
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
      ...(concurrency !== undefined ? { concurrency } : {}),
      ffmpegOverride: ({ args }) => [...args, "-threads", "1"],
      onProgress: ({ progress }) => {
        onProgress?.(progress);
      },
    });
  } catch (error) {
    throw formatRenderFailure(error);
  }

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

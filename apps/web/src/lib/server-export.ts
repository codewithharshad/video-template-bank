import { execSync } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
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

export function isServerExportEnabled(): boolean {
  return process.env.ENABLE_SERVER_EXPORT !== "false";
}

export async function checkServerExportHealth(): Promise<{
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
    const isHosted =
      process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
    return {
      available: false,
      ffmpeg: false,
      message: isHosted
        ? "Server MOV export is not available on the hosted app."
        : "ffmpeg is not installed. Run: brew install ffmpeg — then restart npm run dev.",
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
  const health = await checkServerExportHealth();
  if (!health.available) {
    throw new Error(health.message ?? "Server export is not available.");
  }

  const template = getTemplateBySlug(request.slug);
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

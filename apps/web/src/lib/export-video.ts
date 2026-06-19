import type { HookTemplate } from "@video-lib/template-sdk";
import { coerceTemplateProps } from "@/lib/coerce-props";
import {
  getExportDimensions,
  fitsContentExport,
  type ExportResolution,
} from "@/lib/export-dimensions";
import {
  downloadBlob,
  prepareExportProps,
  resolutionLabel,
} from "@/lib/export-props";
import { preserveAlphaFrame } from "@/lib/preserve-alpha-frame";
import {
  checkServerExportAvailable,
  exportVideoOnServer,
} from "@/lib/server-export-client";
import { getComposition } from "@/remotion";

/** Browser: transparent WebM/MKV. Server: transparent/solid MOV (ProRes). */
export type ExportFormat = "transparent" | "mov-solid" | "mp4" | "webm";
export { type ExportResolution } from "@/lib/export-dimensions";
export type ExportSource = "server" | "browser";

export interface ExportOptions {
  template: HookTemplate;
  inputProps: Record<string, string | number>;
  format: ExportFormat;
  resolution: ExportResolution;
  fitToContent?: boolean;
  preferServer?: boolean;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}

export interface ResolvedExportConfig {
  container: "mp4" | "webm" | "mkv" | "mov";
  videoCodec: "h264" | "vp9" | "vp8" | "prores";
  transparent: boolean;
  label: string;
  extension: "mp4" | "webm" | "mkv" | "mov";
  width: number;
  height: number;
  source: ExportSource;
}

export interface ExportSupportResult {
  supported: boolean;
  message?: string;
  resolved?: ResolvedExportConfig;
  serverAvailable?: boolean;
  serverMessage?: string;
}

type CodecCandidate = {
  container: "mp4" | "webm" | "mkv" | "mov";
  videoCodec: "h264" | "vp9" | "vp8";
  transparent: boolean;
  label: string;
  extension: "mp4" | "webm" | "mkv" | "mov";
};

function evenDimension(n: number): number {
  return n % 2 === 0 ? n : n - 1;
}

export { getExportDimensions, isOverlayTemplate, fitsContentExport } from "@/lib/export-dimensions";

function candidatesForFormat(format: ExportFormat): CodecCandidate[] {
  if (format === "transparent") {
    return [
      {
        container: "webm",
        videoCodec: "vp8",
        transparent: true,
        label: "WebM + alpha (VP8)",
        extension: "webm",
      },
      {
        container: "mkv",
        videoCodec: "vp8",
        transparent: true,
        label: "MKV + alpha (VP8)",
        extension: "mkv",
      },
      {
        container: "webm",
        videoCodec: "vp9",
        transparent: true,
        label: "WebM + alpha (VP9)",
        extension: "webm",
      },
    ];
  }

  if (format === "mov-solid") {
    return [
      {
        container: "mov",
        videoCodec: "h264",
        transparent: false,
        label: "MOV (H.264)",
        extension: "mov",
      },
      {
        container: "mp4",
        videoCodec: "h264",
        transparent: false,
        label: "MP4 (H.264)",
        extension: "mp4",
      },
      {
        container: "webm",
        videoCodec: "vp9",
        transparent: false,
        label: "WebM (VP9)",
        extension: "webm",
      },
    ];
  }

  if (format === "webm") {
    return [
      {
        container: "webm",
        videoCodec: "vp9",
        transparent: false,
        label: "WebM (VP9)",
        extension: "webm",
      },
      {
        container: "webm",
        videoCodec: "vp8",
        transparent: false,
        label: "WebM (VP8)",
        extension: "webm",
      },
    ];
  }

  return [
    {
      container: "mp4",
      videoCodec: "h264",
      transparent: false,
      label: "MP4 (H.264)",
      extension: "mp4",
    },
    {
      container: "webm",
      videoCodec: "vp9",
      transparent: false,
      label: "WebM (VP9)",
      extension: "webm",
    },
    {
      container: "webm",
      videoCodec: "vp8",
      transparent: false,
      label: "WebM (VP8)",
      extension: "webm",
    },
  ];
}

async function loadWebRenderer() {
  return import("@remotion/web-renderer");
}

export function shouldUseServerExport(
  template: HookTemplate,
  format: ExportFormat
): boolean {
  if (!fitsContentExport(template)) return false;
  return format === "transparent" || format === "mov-solid";
}

export async function resolveExportConfig(
  format: ExportFormat,
  width: number,
  height: number,
  options?: { template?: HookTemplate; browserOnly?: boolean }
): Promise<ExportSupportResult> {
  const server = await checkServerExportAvailable();
  const useServer =
    !options?.browserOnly &&
    options?.template &&
    shouldUseServerExport(options.template, format);

  if (useServer && server.available) {
    const transparent = format === "transparent";
    return {
      supported: true,
      serverAvailable: true,
      resolved: {
        container: "mov",
        videoCodec: transparent ? "prores" : "h264",
        transparent,
        label: transparent ? "MOV ProRes 4444 + alpha" : "MOV (H.264)",
        extension: "mov",
        width,
        height,
        source: "server",
      },
    };
  }

  try {
    const { canRenderMediaOnWeb } = await loadWebRenderer();
    const w = evenDimension(width);
    const h = evenDimension(height);

    for (const candidate of candidatesForFormat(format)) {
      const result = await canRenderMediaOnWeb({
        container: candidate.container,
        videoCodec: candidate.videoCodec,
        width: w,
        height: h,
        transparent: candidate.transparent,
      });

      if (result.canRender) {
        return {
          supported: true,
          serverAvailable: server.available,
          serverMessage: server.message,
          resolved: {
            container: candidate.container,
            videoCodec: candidate.videoCodec,
            transparent: candidate.transparent,
            label: candidate.label,
            extension: candidate.extension,
            width: w,
            height: h,
            source: "browser",
          },
        };
      }
    }

    return {
      supported: false,
      serverAvailable: server.available,
      serverMessage: server.message,
      message: server.available
        ? "Browser export unavailable. Restart dev server to enable MOV export."
        : "No supported video codec in this browser. Try Chrome, or run locally with ffmpeg for MOV export.",
    };
  } catch {
    return {
      supported: false,
      serverAvailable: server.available,
      serverMessage: server.message,
      message: server.available
        ? "Browser export unavailable. Server MOV export is ready."
        : "Web rendering is not available in this browser.",
    };
  }
}

async function exportVideoInBrowser(
  options: ExportOptions
): Promise<ResolvedExportConfig> {
  const {
    template,
    inputProps,
    format,
    resolution,
    onProgress,
    signal,
    fitToContent,
  } = options;

  const Component = getComposition(template.compositionId);
  if (!Component) {
    throw new Error("Composition not found for this template.");
  }

  const { renderMediaOnWeb } = await loadWebRenderer();
  const coerced = coerceTemplateProps(template, inputProps);
  const wantsAlpha = format === "transparent";
  const exportProps = prepareExportProps(coerced, wantsAlpha);
  const { width, height } = getExportDimensions(template, resolution, {
    fitToContent: fitToContent ?? fitsContentExport(template),
    inputProps: exportProps,
  });

  const support = await resolveExportConfig(format, width, height, {
    template,
    browserOnly: true,
  });
  if (!support.supported || !support.resolved) {
    throw new Error(
      support.message ??
        "Your browser cannot render this format. Try Chrome or export as WebM."
    );
  }

  const { container, videoCodec, extension } = support.resolved;

  const { getBlob } = await renderMediaOnWeb({
    signal: signal ?? null,
    composition: {
      component: Component,
      durationInFrames: template.durationInFrames,
      fps: template.fps,
      width,
      height,
      id: template.compositionId,
      calculateMetadata: null,
    },
    inputProps: exportProps,
    container,
    videoCodec: videoCodec as "h264" | "vp8" | "vp9",
    transparent: wantsAlpha,
    videoBitrate: wantsAlpha ? "very-high" : "medium",
    hardwareAcceleration: wantsAlpha ? "prefer-software" : "no-preference",
    muted: true,
    onFrame: wantsAlpha ? preserveAlphaFrame : undefined,
    onProgress: (progress) => {
      onProgress?.(progress.progress);
    },
  });

  const blob = await getBlob();
  const tier = resolutionLabel(resolution);
  const alphaTag = wantsAlpha ? "transparent" : "solid";
  const filename = `hookforge-${template.slug}-${tier}-${alphaTag}-${Date.now()}.${extension}`;
  downloadBlob(blob, filename);

  return { ...support.resolved, width, height, source: "browser" };
}

export async function exportVideo(
  options: ExportOptions
): Promise<ResolvedExportConfig> {
  const {
    template,
    inputProps,
    format,
    resolution,
    onProgress,
    signal,
    fitToContent,
    preferServer = true,
  } = options;

  const coerced = coerceTemplateProps(template, inputProps);
  const wantsAlpha = format === "transparent";
  const exportProps = prepareExportProps(coerced, wantsAlpha);
  const { width, height } = getExportDimensions(template, resolution, {
    fitToContent: fitToContent ?? fitsContentExport(template),
    inputProps: exportProps,
  });

  const tryServer =
    preferServer && shouldUseServerExport(template, format);

  if (tryServer) {
    const server = await checkServerExportAvailable();
    if (server.available) {
      const mode = wantsAlpha ? "transparent" : "solid";
      const result = await exportVideoOnServer({
        slug: template.slug,
        inputProps,
        mode,
        resolution,
        onProgress,
        signal,
      });

      return {
        container: "mov",
        videoCodec: wantsAlpha ? "prores" : "h264",
        transparent: wantsAlpha,
        label: wantsAlpha ? "MOV ProRes 4444 + alpha" : "MOV (H.264)",
        extension: "mov",
        width: result.width || width,
        height: result.height || height,
        source: "server",
      };
    }
  }

  return exportVideoInBrowser(options);
}

/** @deprecated Use resolveExportConfig */
export async function checkExportSupport(
  format: ExportFormat,
  width: number,
  height: number
): Promise<{ supported: boolean; message?: string }> {
  const result = await resolveExportConfig(format, width, height);
  return {
    supported: result.supported,
    message: result.message,
  };
}

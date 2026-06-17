import type { HookTemplate } from "@video-lib/template-sdk";
import { coerceTemplateProps } from "@/lib/coerce-props";
import { withTransparentBackground } from "@/lib/transparent-export";
import { getComposition } from "@/remotion";

export type ExportFormat = "mp4" | "webm-alpha" | "webm";
export type ExportResolution = "720p" | "1080p";

export interface ExportOptions {
  template: HookTemplate;
  inputProps: Record<string, string | number>;
  format: ExportFormat;
  resolution: ExportResolution;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}

export interface ResolvedExportConfig {
  container: "mp4" | "webm";
  videoCodec: "h264" | "vp9" | "vp8";
  transparent: boolean;
  /** User-facing label for what will download */
  label: string;
  extension: "mp4" | "webm";
}

export interface ExportSupportResult {
  supported: boolean;
  message?: string;
  resolved?: ResolvedExportConfig;
}

type CodecCandidate = {
  container: "mp4" | "webm";
  videoCodec: "h264" | "vp9" | "vp8";
  transparent: boolean;
  label: string;
  extension: "mp4" | "webm";
};

function evenDimension(n: number): number {
  return n % 2 === 0 ? n : n - 1;
}

export function getExportDimensions(
  template: HookTemplate,
  resolution: ExportResolution
): { width: number; height: number } {
  if (resolution === "1080p") {
    return {
      width: evenDimension(template.width),
      height: evenDimension(template.height),
    };
  }

  const scale =
    template.orientation === "landscape"
      ? 720 / template.height
      : 720 / template.width;

  return {
    width: evenDimension(Math.round(template.width * scale)),
    height: evenDimension(Math.round(template.height * scale)),
  };
}

function candidatesForFormat(format: ExportFormat): CodecCandidate[] {
  if (format === "webm-alpha") {
    return [
      {
        container: "webm",
        videoCodec: "vp9",
        transparent: true,
        label: "WebM + alpha (VP9)",
        extension: "webm",
      },
      {
        container: "webm",
        videoCodec: "vp8",
        transparent: true,
        label: "WebM + alpha (VP8)",
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

  // MP4 preferred, WebM fallbacks when H.264 WebCodecs is unavailable (Safari, Firefox, etc.)
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

export async function resolveExportConfig(
  format: ExportFormat,
  width: number,
  height: number
): Promise<ExportSupportResult> {
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
          resolved: {
            container: candidate.container,
            videoCodec: candidate.videoCodec,
            transparent: candidate.transparent,
            label: candidate.label,
            extension: candidate.extension,
          },
        };
      }
    }

    return {
      supported: false,
      message:
        "No supported video codec in this browser. Use Chrome 94+ or Edge for export.",
    };
  } catch {
    return {
      supported: false,
      message: "Web rendering is not available in this browser.",
    };
  }
}

function prepareExportProps(
  inputProps: Record<string, string | number>,
  transparent: boolean
): Record<string, string | number> {
  if (!transparent) return inputProps;
  return withTransparentBackground(inputProps);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function exportVideo(options: ExportOptions): Promise<ResolvedExportConfig> {
  const { template, inputProps, format, resolution, onProgress, signal } =
    options;

  const Component = getComposition(template.compositionId);
  if (!Component) {
    throw new Error("Composition not found for this template.");
  }

  const { renderMediaOnWeb } = await loadWebRenderer();
  const { width, height } = getExportDimensions(template, resolution);

  const support = await resolveExportConfig(format, width, height);
  if (!support.supported || !support.resolved) {
    throw new Error(
      support.message ??
        "Your browser cannot render this format. Try Chrome or export as WebM."
    );
  }

  const { container, videoCodec, transparent, extension } = support.resolved;

  const exportProps = prepareExportProps(
    coerceTemplateProps(template, inputProps),
    transparent
  );

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
    videoCodec,
    transparent,
    videoBitrate: transparent ? "very-high" : "medium",
    muted: true,
    onProgress: (progress) => {
      onProgress?.(progress.progress);
    },
  });

  const blob = await getBlob();
  const suffix = transparent ? "transparent" : extension;
  const filename = `hookforge-${template.slug}-${suffix}-${Date.now()}.${extension}`;
  downloadBlob(blob, filename);

  return support.resolved;
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

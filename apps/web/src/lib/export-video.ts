import type { HookTemplate } from "@video-lib/template-sdk";
import { coerceTemplateProps } from "@/lib/coerce-props";
import { withTransparentBackground } from "@/lib/transparent-export";
import { getComposition } from "@/remotion";

export type ExportFormat = "mp4" | "webm-alpha";
export type ExportResolution = "720p" | "1080p";

export interface ExportOptions {
  template: HookTemplate;
  inputProps: Record<string, string | number>;
  format: ExportFormat;
  resolution: ExportResolution;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}

function evenDimension(n: number): number {
  return n % 2 === 0 ? n : n - 1;
}

function getExportDimensions(
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

function prepareExportProps(
  inputProps: Record<string, string | number>,
  format: ExportFormat
): Record<string, string | number> {
  if (format !== "webm-alpha") return inputProps;
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

export async function exportVideo(options: ExportOptions): Promise<void> {
  const { template, inputProps, format, resolution, onProgress, signal } =
    options;

  const Component = getComposition(template.compositionId);
  if (!Component) {
    throw new Error("Composition not found for this template.");
  }

  const { renderMediaOnWeb, canRenderMediaOnWeb } = await import(
    "@remotion/web-renderer"
  );

  const { width, height } = getExportDimensions(template, resolution);
  const isAlpha = format === "webm-alpha";
  const container = isAlpha ? "webm" : "mp4";
  const videoCodec = isAlpha ? "vp9" : "h264";

  const compatibility = await canRenderMediaOnWeb({
    container,
    videoCodec,
    width,
    height,
    transparent: isAlpha,
  });

  if (!compatibility.canRender) {
    const messages = compatibility.issues.map((issue) => issue.message);
    throw new Error(
      messages.join(" ") ||
        "Your browser cannot render this format. Try Chrome 94+ or export as MP4."
    );
  }

  const exportProps = prepareExportProps(
    coerceTemplateProps(template, inputProps),
    format
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
    transparent: isAlpha,
    // Higher bitrate keeps alpha edges clean in editors (CapCut, Premiere, etc.)
    videoBitrate: isAlpha ? "very-high" : "medium",
    muted: true,
    onProgress: (progress) => {
      onProgress?.(progress.progress);
    },
  });

  const blob = await getBlob();
  const filename = isAlpha
    ? `hookforge-${template.slug}-transparent-${Date.now()}.webm`
    : `hookforge-${template.slug}-${Date.now()}.mp4`;
  downloadBlob(blob, filename);
}

export async function checkExportSupport(
  format: ExportFormat,
  width: number,
  height: number
): Promise<{ supported: boolean; message?: string }> {
  try {
    const { canRenderMediaOnWeb } = await import("@remotion/web-renderer");
    const isAlpha = format === "webm-alpha";
    const result = await canRenderMediaOnWeb({
      container: isAlpha ? "webm" : "mp4",
      videoCodec: isAlpha ? "vp9" : "h264",
      width: evenDimension(width),
      height: evenDimension(height),
      transparent: isAlpha,
    });

    if (!result.canRender) {
      return {
        supported: false,
        message: result.issues.map((i) => i.message).join(" "),
      };
    }

    return { supported: true };
  } catch {
    return {
      supported: false,
      message: "Web rendering is not available in this browser.",
    };
  }
}

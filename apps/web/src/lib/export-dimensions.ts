import type { HookTemplate } from "@video-lib/template-sdk";
import {
  getOverlayExportFrame,
  scaleExportFrame,
} from "@/lib/overlay-export-frame";

export type ExportResolution = "720p" | "1080p";

function evenDimension(n: number): number {
  return n % 2 === 0 ? n : n - 1;
}

export function isOverlayTemplate(template: HookTemplate): boolean {
  if (template.templateKind === "overlay") return true;
  return template.props.some(
    (field) =>
      field.key === "backgroundColor" &&
      String(field.defaultValue).toLowerCase() === "transparent"
  );
}

/** Hooks and overlays export cropped to content, not the full portrait canvas. */
export function fitsContentExport(template: HookTemplate): boolean {
  if (template.templateKind === "overlay" || template.templateKind === "hook") {
    return true;
  }
  return isOverlayTemplate(template);
}

export function getExportDimensions(
  template: HookTemplate,
  resolution: ExportResolution,
  options?: {
    fitToContent?: boolean;
    inputProps?: Record<string, string | number>;
  }
): { width: number; height: number } {
  const fit =
    options?.fitToContent ??
    fitsContentExport(template);

  if (fit) {
    const frame = getOverlayExportFrame(
      template,
      options?.inputProps ?? {}
    );
    if (frame) {
      return scaleExportFrame(frame, template, resolution);
    }
  }

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

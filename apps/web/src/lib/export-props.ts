import { withTransparentBackground } from "@/lib/transparent-export";

export function prepareExportProps(
  inputProps: Record<string, string | number>,
  transparent: boolean
): Record<string, string | number> {
  if (transparent) return withTransparentBackground(inputProps);
  const bg = String(inputProps.backgroundColor ?? "").toLowerCase();
  if (bg === "transparent" || bg === "") {
    return { ...inputProps, backgroundColor: "#0a0a0a" };
  }
  return inputProps;
}

export function resolutionLabel(resolution: "720p" | "1080p"): string {
  return resolution === "1080p" ? "HD" : "SD";
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

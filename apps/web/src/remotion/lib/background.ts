/** True when exporting WebM with alpha transparency. */
export function isTransparentBg(color?: string | number): boolean {
  return String(color ?? "").toLowerCase() === "transparent";
}

export function resolveBg(color?: string | number, fallback = "#000000"): string | undefined {
  return isTransparentBg(color) ? undefined : String(color ?? fallback);
}

/** True when exporting WebM with alpha transparency. */
export function isTransparentBg(color?: string | number): boolean {
  return String(color ?? "").toLowerCase() === "transparent";
}

export function resolveBg(color?: string | number, fallback = "#000000"): string | undefined {
  return isTransparentBg(color) ? undefined : String(color ?? fallback);
}

/**
 * Glows, blurs, and soft shadows encode poorly in WebM alpha — NLEs like CapCut
 * often render them as white/grey blobs on a black matte.
 */
export function textGlow(
  color: string,
  transparent: boolean,
  blurPx = 80
): string | undefined {
  return transparent ? undefined : `0 0 ${blurPx}px ${color}40`;
}

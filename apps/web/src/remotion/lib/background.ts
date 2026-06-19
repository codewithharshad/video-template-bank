/** True when exporting WebM with alpha transparency. */
export function isTransparentBg(color?: string | number): boolean {
  return String(color ?? "").toLowerCase() === "transparent";
}

export function resolveBg(color?: string | number, fallback = "#000000"): string | undefined {
  if (isTransparentBg(color)) return undefined;
  if (color !== undefined && color !== null && String(color).trim() !== "") {
    return String(color);
  }
  if (isTransparentBg(fallback)) return undefined;
  return fallback;
}

/**
 * Semi-transparent rgba + backdrop-filter composites against black in WebCodecs
 * export. Use opaque panel fills when the canvas background is transparent.
 */
export function overlayPanelBg(
  transparent: boolean,
  dark: boolean,
  opaque: { dark: string; light: string },
  glass: { dark: string; light: string }
): string {
  if (transparent) return dark ? opaque.dark : opaque.light;
  return dark ? glass.dark : glass.light;
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

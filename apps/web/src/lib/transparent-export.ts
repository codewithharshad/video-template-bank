/** Props with background removed for transparent WebM export. */
export function withTransparentBackground(
  props: Record<string, string | number>
): Record<string, string | number> {
  return { ...props, backgroundColor: "transparent" };
}

export function isTransparentProps(
  props: Record<string, string | number>
): boolean {
  return String(props.backgroundColor ?? "").toLowerCase() === "transparent";
}

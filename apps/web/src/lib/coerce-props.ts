import type { HookTemplate } from "@video-lib/template-sdk";

export function getDefaultTemplateProps(
  template: HookTemplate
): Record<string, string | number> {
  return Object.fromEntries(
    template.props.map((field) => [field.key, field.defaultValue])
  );
}

/** Ensure Remotion compositions receive the prop types they expect. */
export function coerceTemplateProps(
  template: HookTemplate,
  props: Record<string, string | number>
): Record<string, string | number> {
  const result: Record<string, string | number> = {};

  for (const field of template.props) {
    const raw = props[field.key] ?? field.defaultValue;

    if (field.type === "number") {
      const num = typeof raw === "number" ? raw : Number(raw);
      result[field.key] = Number.isFinite(num) ? num : Number(field.defaultValue);
    } else {
      result[field.key] = String(raw ?? field.defaultValue);
    }
  }

  return result;
}

"use client";

import type { HookTemplate } from "@video-lib/template-sdk";
import { applyBrandToProps } from "@video-lib/template-sdk";
import { useBrand } from "./brand-provider";

interface PropsEditorProps {
  template: HookTemplate;
  props: Record<string, string | number>;
  onChange: (props: Record<string, string | number>) => void;
  transparentExport?: boolean;
}

export function PropsEditor({
  template,
  props,
  onChange,
  transparentExport = false,
}: PropsEditorProps) {
  const { brand } = useBrand();

  const applyBrand = () => {
    onChange(applyBrandToProps(template, props, brand));
  };

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Customize</h3>
        <button
          type="button"
          onClick={applyBrand}
          className="text-xs text-amber-400 hover:text-amber-300"
        >
          Apply brand colors
        </button>
      </div>

      <div className="space-y-4">
        {template.props.map((field) => {
          if (transparentExport && field.key === "backgroundColor") {
            return null;
          }

          const rawColor = String(props[field.key] ?? "");
          const colorPickerValue =
            rawColor.startsWith("#") && rawColor.length >= 7
              ? rawColor.slice(0, 7)
              : "#000000";

          return (
          <div key={field.key}>
            <label className="mb-1.5 block text-xs text-zinc-500">
              {field.label}
              {field.bindToBrand && (
                <span className="ml-1 text-amber-400/70">· brand</span>
              )}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                value={String(props[field.key] ?? "")}
                maxLength={field.maxLength}
                onChange={(e) =>
                  onChange({ ...props, [field.key]: e.target.value })
                }
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:border-amber-500/50 focus:outline-none"
              />
            )}

            {field.type === "number" && (
              <input
                type="number"
                value={Number(props[field.key] ?? 0)}
                onChange={(e) =>
                  onChange({ ...props, [field.key]: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:border-amber-500/50 focus:outline-none"
              />
            )}

            {field.type === "color" && (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorPickerValue}
                  onChange={(e) =>
                    onChange({ ...props, [field.key]: e.target.value })
                  }
                  className="h-9 w-9 cursor-pointer rounded-lg border border-zinc-700 bg-transparent"
                />
                <input
                  type="text"
                  value={String(props[field.key] ?? "")}
                  onChange={(e) =>
                    onChange({ ...props, [field.key]: e.target.value })
                  }
                  className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm font-mono focus:outline-none"
                />
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}

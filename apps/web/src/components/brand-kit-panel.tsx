"use client";

import { Palette, RotateCcw } from "lucide-react";
import { useBrand } from "./brand-provider";

export function BrandKitPanel() {
  const { brand, updateBrand, resetBrand } = useBrand();

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-amber-400" />
          <h3 className="font-semibold">Brand Kit</h3>
        </div>
        <button
          type="button"
          onClick={resetBrand}
          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs text-zinc-500">Brand name</label>
          <input
            type="text"
            value={brand.name}
            onChange={(e) => updateBrand({ name: e.target.value })}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:border-amber-500/50 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {(
            [
              ["primaryColor", "Primary"],
              ["secondaryColor", "Secondary"],
              ["accentColor", "Accent"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="mb-1.5 block text-xs text-zinc-500">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brand[key]}
                  onChange={(e) => updateBrand({ [key]: e.target.value })}
                  className="h-9 w-9 cursor-pointer rounded-lg border border-zinc-700 bg-transparent"
                />
                <input
                  type="text"
                  value={brand[key]}
                  onChange={(e) => updateBrand({ [key]: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs font-mono focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-zinc-500">
          Colors auto-apply to templates with brand bindings.
        </p>
      </div>
    </div>
  );
}

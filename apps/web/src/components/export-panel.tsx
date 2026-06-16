"use client";

import { useEffect, useState } from "react";
import type { HookTemplate } from "@video-lib/template-sdk";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Layers,
  Sparkles,
  X,
} from "lucide-react";
import {
  exportVideo,
  checkExportSupport,
  type ExportFormat,
  type ExportResolution,
} from "@/lib/export-video";

interface ExportPanelProps {
  template: HookTemplate;
  inputProps: Record<string, string | number>;
  transparent: boolean;
  onTransparentChange: (value: boolean) => void;
}

export function ExportPanel({
  template,
  inputProps,
  transparent,
  onTransparentChange,
}: ExportPanelProps) {
  const format: ExportFormat = transparent ? "webm-alpha" : "mp4";
  const [resolution, setResolution] = useState<ExportResolution>("1080p");
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [alphaWarning, setAlphaWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!transparent) {
      setAlphaWarning(null);
      return;
    }
    let cancelled = false;
    checkExportSupport("webm-alpha", template.width, template.height).then(
      (result) => {
        if (!cancelled) {
          setAlphaWarning(result.supported ? null : result.message ?? null);
        }
      }
    );
    return () => {
      cancelled = true;
    };
  }, [transparent, template.width, template.height]);

  const handleExport = async () => {
    setExporting(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    try {
      await exportVideo({
        template,
        inputProps,
        format,
        resolution,
        onProgress: setProgress,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Export failed. Please try again.";
      setError(message);
    } finally {
      setExporting(false);
      setProgress(0);
    }
  };

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <Download className="h-4 w-4 text-violet-400" />
        <h3 className="font-semibold">Export</h3>
      </div>

      <div className="space-y-4">
        {/* Transparent background — primary option */}
        <button
          type="button"
          onClick={() => onTransparentChange(!transparent)}
          disabled={exporting}
          className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors disabled:opacity-50 ${
            transparent
              ? "border-emerald-500/50 bg-emerald-500/10"
              : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
          }`}
        >
          <div
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
              transparent
                ? "border-emerald-500 bg-emerald-500 text-black"
                : "border-zinc-600 bg-zinc-800"
            }`}
          >
            {transparent && <Sparkles className="h-3 w-3" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span className="font-medium text-zinc-100">
                Transparent background
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              No blue/black backdrop — drop text & graphics over your footage in
              Premiere, DaVinci, or CapCut. Exports as WebM.
            </p>
          </div>
        </button>

        {!transparent && (
          <p className="text-xs text-zinc-500">
            MP4 export includes the solid/gradient background. Enable transparent
            above to composite over your own video.
          </p>
        )}

        <div>
          <label className="mb-2 block text-xs text-zinc-500">Resolution</label>
          <select
            value={resolution}
            onChange={(e) =>
              setResolution(e.target.value as ExportResolution)
            }
            disabled={exporting}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:outline-none disabled:opacity-50"
          >
            <option value="720p">720p HD</option>
            <option value="1080p">1080p Full HD</option>
          </select>
        </div>

        <div className="rounded-lg bg-zinc-900/80 p-3 text-xs text-zinc-500">
          <p>
            {transparent ? "WebM + alpha" : "MP4"} · {template.width}×
            {template.height} · {template.fps}fps ·{" "}
            {(template.durationInFrames / template.fps).toFixed(1)}s
          </p>
        </div>

        {alphaWarning && transparent && (
          <div className="flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {alphaWarning} — try Chrome, or disable transparent for MP4.
            </span>
          </div>
        )}

        {exporting && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Rendering in browser...</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-violet-500 transition-all duration-300"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            <X className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {transparent
              ? "Transparent WebM downloaded — import into your editor."
              : "MP4 downloaded — check your downloads folder."}
          </div>
        )}

        <button
          type="button"
          onClick={handleExport}
          disabled={exporting || (transparent && !!alphaWarning)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-medium text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {exporting
            ? "Rendering..."
            : success
              ? "Exported!"
              : transparent
                ? "Export transparent WebM"
                : "Export MP4"}
        </button>

        <p className="mt-2 text-center text-xs text-zinc-500">
          {transparent
            ? "Checkerboard in preview = transparent areas. In CapCut, place the clip on a track above your footage."
            : "Use Chrome for best results"}
        </p>
      </div>
    </div>
  );
}

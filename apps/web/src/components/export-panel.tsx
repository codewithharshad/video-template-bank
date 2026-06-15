"use client";

import { useEffect, useState } from "react";
import type { HookTemplate } from "@video-lib/template-sdk";
import { AlertCircle, CheckCircle2, Download, Film, Layers, X } from "lucide-react";
import {
  exportVideo,
  checkExportSupport,
  type ExportFormat,
  type ExportResolution,
} from "@/lib/export-video";

interface ExportPanelProps {
  template: HookTemplate;
  inputProps: Record<string, string | number>;
}

export function ExportPanel({ template, inputProps }: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>("mp4");
  const [resolution, setResolution] = useState<ExportResolution>("1080p");
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [browserWarning, setBrowserWarning] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    checkExportSupport(format, template.width, template.height).then((result) => {
      if (!cancelled) {
        setBrowserWarning(result.supported ? null : result.message ?? null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [format, template.width, template.height]);

  const exportBlocked =
    format === "webm-alpha" && !!browserWarning && !exporting;

  const handleExport = async () => {
    setExporting(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    const controller = new AbortController();

    try {
      await exportVideo({
        template,
        inputProps,
        format,
        resolution,
        onProgress: setProgress,
        signal: controller.signal,
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
        <div>
          <label className="mb-2 block text-xs text-zinc-500">Format</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormat("mp4")}
              disabled={exporting}
              className={`flex flex-col items-start rounded-lg border px-3 py-2.5 text-sm transition-colors disabled:opacity-50 ${
                format === "mp4"
                  ? "border-violet-500 bg-violet-500/10 text-violet-300"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <Film className="mb-1 h-4 w-4" />
              MP4
            </button>
            <button
              type="button"
              onClick={() => setFormat("webm-alpha")}
              disabled={exporting}
              className={`flex flex-col items-start rounded-lg border px-3 py-2.5 text-sm transition-colors disabled:opacity-50 ${
                format === "webm-alpha"
                  ? "border-violet-500 bg-violet-500/10 text-violet-300"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <Layers className="mb-1 h-4 w-4" />
              WebM + Alpha
            </button>
          </div>
          {format === "webm-alpha" && (
            <p className="mt-2 text-xs text-emerald-400/80">
              Transparent background — composite in Premiere, DaVinci, or CapCut.
            </p>
          )}
        </div>

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
            {template.width}×{template.height} · {template.fps}fps ·{" "}
            {(template.durationInFrames / template.fps).toFixed(1)}s
          </p>
        </div>

        {browserWarning && (
          <div className="flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {format === "mp4"
                ? `Note: ${browserWarning} — export may still work; try MP4 first.`
                : browserWarning}
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
            Download started — check your downloads folder.
          </div>
        )}

        <button
          type="button"
          onClick={handleExport}
          disabled={exporting || exportBlocked}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-medium text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {exporting
            ? "Rendering..."
            : success
              ? "Exported!"
              : "Export video"}
        </button>

        <p className="text-center text-xs text-zinc-600">
          Use Chrome for best results · Renders locally in your browser
        </p>
      </div>
    </div>
  );
}

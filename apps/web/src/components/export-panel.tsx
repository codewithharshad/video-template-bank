"use client";

import { useEffect, useState } from "react";
import type { HookTemplate } from "@video-lib/template-sdk";
import {
  AlertCircle,
  CheckCircle2,
  Crown,
  Download,
  Layers,
  Server,
  Sparkles,
  X,
} from "lucide-react";
import { useCatalog } from "@/components/catalog-provider";
import { isAuthEnabled } from "@/lib/auth/clerk-config";
import Link from "next/link";
import {
  exportVideo,
  getExportDimensions,
  fitsContentExport,
  isOverlayTemplate,
  resolveExportConfig,
  type ExportFormat,
  type ExportResolution,
  type ResolvedExportConfig,
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
  const { user, refreshUser } = useCatalog();
  const authEnabled = isAuthEnabled();
  const isOverlay = isOverlayTemplate(template);
  const isContentExport = fitsContentExport(template);
  const solidProLocked = isOverlay && !template.isPro;

  const format: ExportFormat = transparent
    ? "transparent"
    : isContentExport
      ? "mov-solid"
      : "mp4";

  const [resolution, setResolution] = useState<ExportResolution>("1080p");
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resolvedConfig, setResolvedConfig] = useState<ResolvedExportConfig | null>(null);
  const [unsupportedMessage, setUnsupportedMessage] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const exportDimensions = getExportDimensions(template, resolution, {
    fitToContent: isContentExport,
    inputProps,
  });

  useEffect(() => {
    let cancelled = false;
    resolveExportConfig(format, exportDimensions.width, exportDimensions.height, {
      template,
    }).then((result) => {
      if (cancelled) return;
      if (result.supported && result.resolved) {
        setResolvedConfig(result.resolved);
        setUnsupportedMessage(null);
        setServerMessage(
          result.resolved.source === "server"
            ? null
            : result.serverMessage ?? null
        );
      } else {
        setResolvedConfig(null);
        setUnsupportedMessage(result.message ?? "Export not supported.");
        setServerMessage(result.serverMessage ?? null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [format, template, exportDimensions.width, exportDimensions.height]);

  const handleSolidToggle = () => {
    if (solidProLocked) return;
    onTransparentChange(!transparent);
  };

  const handleExport = async () => {
    if (solidProLocked && !transparent) return;

    setExporting(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    try {
      const used = await exportVideo({
        template,
        inputProps,
        format,
        resolution,
        fitToContent: isContentExport,
        onProgress: setProgress,
      });
      setResolvedConfig(used);
      setSuccess(true);
      void refreshUser();
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

  const usesServer = resolvedConfig?.source === "server";
  const willFallbackToWebm =
    !transparent &&
    resolvedConfig?.extension === "webm" &&
    resolvedConfig.container === "webm";

  const sizeLabel = isContentExport
    ? `${exportDimensions.width}×${exportDimensions.height} (fits content)`
    : `${template.width}×${template.height}`;

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <Download className="h-4 w-4 text-violet-400" />
        <h3 className="font-semibold">Export</h3>
      </div>

      <div className="space-y-4">
        {authEnabled && !user && (
          <div className="flex gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 p-3 text-xs text-violet-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <Link href="/sign-in" className="underline hover:text-white">
                Sign in
              </Link>{" "}
              to export, save downloads, and use credits — 20 free on signup.
            </span>
          </div>
        )}

        {authEnabled && user && user.plan !== "pro" && (
          <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs">
            <span className="text-zinc-400">
              {resolution === "1080p" ? "2 credits" : "1 credit"} per export
            </span>
            <span className="font-medium text-zinc-200">{user.credits} left</span>
          </div>
        )}

        {authEnabled && user && template.isPro && user.plan === "free" && (
          <div className="flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            <Crown className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Pro template — upgrade to{" "}
              <Link href="/pricing" className="underline hover:text-white">
                Creator or Pro
              </Link>{" "}
              to export.
            </span>
          </div>
        )}

        {isContentExport && (
          <button
            type="button"
            onClick={handleSolidToggle}
            disabled={exporting || (solidProLocked && transparent)}
            className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors disabled:opacity-50 ${
              transparent
                ? "border-emerald-500/50 bg-emerald-500/10"
                : "border-violet-500/50 bg-violet-500/10"
            } ${solidProLocked && !transparent ? "opacity-60" : ""}`}
          >
            <div
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                transparent
                  ? "border-emerald-500 bg-emerald-500 text-black"
                  : "border-violet-500 bg-violet-500 text-white"
              }`}
            >
              {transparent ? (
                <Sparkles className="h-3 w-3" />
              ) : (
                <Layers className="h-3 w-3" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-zinc-100">
                  {transparent ? "Transparent background" : "Include background"}
                </span>
                {!transparent && solidProLocked && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                    <Crown className="h-3 w-3" />
                    Pro
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-zinc-400">
                {transparent
                  ? "Cropped to your graphic — true alpha MOV (ProRes) when server export is on."
                  : "Keeps the card background color. Exports as MOV, sized to content."}
              </p>
            </div>
          </button>
        )}

        {usesServer && (
          <div className="flex gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200">
            <Server className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Server export — ProRes transparent MOV, like VideoEffects. Cropped to{" "}
              {exportDimensions.width}×{exportDimensions.height}.
            </span>
          </div>
        )}

        {serverMessage && isContentExport && transparent && !usesServer && resolvedConfig && (
          <div className="flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              ProRes MOV isn&apos;t available yet ({serverMessage}). Using browser{" "}
              {resolvedConfig.label} instead — Chrome recommended.
            </span>
          </div>
        )}

        {solidProLocked && !transparent && (
          <div className="flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            <Crown className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Solid background + MOV export is a Pro effect feature. Use transparent
              export on this template, or pick a Pro effect.
            </span>
          </div>
        )}

        <div>
          <label className="mb-2 block text-xs text-zinc-500">Resolution</label>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value as ExportResolution)}
            disabled={exporting}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:outline-none disabled:opacity-50"
          >
            <option value="720p">720p SD</option>
            <option value="1080p">1080p HD</option>
          </select>
        </div>

        <div className="rounded-lg bg-zinc-900/80 p-3 text-xs text-zinc-500">
          <p>
            {resolvedConfig?.label ??
              (transparent ? "Transparent MOV" : isContentExport ? "MOV" : "MP4")}{" "}
            · {sizeLabel} · {template.fps}fps ·{" "}
            {(template.durationInFrames / template.fps).toFixed(1)}s
            {usesServer ? " · server" : resolvedConfig ? " · browser" : ""}
          </p>
        </div>

        {willFallbackToWebm && (
          <div className="flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              H.264/MOV isn&apos;t available in this browser — export will use{" "}
              {resolvedConfig.label} instead.
            </span>
          </div>
        )}

        {unsupportedMessage && (
          <div className="flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{unsupportedMessage}</span>
          </div>
        )}

        {exporting && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>
                {usesServer || isContentExport
                  ? "Rendering on server..."
                  : "Rendering in browser..."}
              </span>
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
              ? resolvedConfig?.source === "server"
                ? `Transparent MOV downloaded (${exportDimensions.width}×${exportDimensions.height}) — import over footage in CapCut. Preview apps may show black where it's transparent.`
                : `${resolvedConfig?.label ?? "Transparent WebM"} downloaded (${exportDimensions.width}×${exportDimensions.height}) — import over footage in your editor.`
              : `${resolvedConfig?.extension.toUpperCase() ?? "File"} downloaded — sized to content.`}
          </div>
        )}

        <button
          type="button"
          onClick={handleExport}
          disabled={
            exporting ||
            !!unsupportedMessage ||
            (solidProLocked && !transparent) ||
            (authEnabled && !user) ||
            (authEnabled && user?.plan === "free" && template.isPro)
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-medium text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {exporting
            ? "Rendering..."
            : success
              ? "Exported!"
              : transparent
                ? resolvedConfig?.source === "server"
                  ? "Export transparent MOV"
                  : "Export transparent WebM"
                : isContentExport
                  ? "Export MOV"
                  : "Export MP4"}
        </button>

        <p className="mt-2 text-center text-xs text-zinc-500">
          {transparent
            ? usesServer
              ? "Cropped MOV with real transparency via server (ProRes)."
              : "Cropped WebM with alpha in your browser. MOV (ProRes) when running locally with ffmpeg."
            : isContentExport
              ? "Solid MOV with background color, sized to content."
              : "Full-frame MP4 export."}
        </p>
      </div>
    </div>
  );
}

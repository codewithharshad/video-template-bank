"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileCode,
  Layers,
  Loader2,
  Terminal,
} from "lucide-react";
import type { HyperFramesExample } from "@/lib/hyperframes-catalog";

interface HyperFramesDownloadPanelProps {
  example: HyperFramesExample;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-400" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      {copied ? "Copied!" : label}
    </button>
  );
}

export function HyperFramesDownloadPanel({
  example,
}: HyperFramesDownloadPanelProps) {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [serverAvailable, setServerAvailable] = useState<boolean | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const renderCommand = `npx hyperframes render --format mov --output ${example.slug}.mov`;
  const initCommand = `npx hyperframes init my-${example.slug} --example ${example.cliExample}`;
  const skillsCommand = `npx skills add heygen-com/hyperframes`;

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/hyperframes/export/health");
        if (res.ok) {
          const data = (await res.json()) as {
            available: boolean;
            message?: string;
          };
          setServerAvailable(data.available);
          setServerMessage(data.message ?? null);
        }
      } catch {
        setServerAvailable(false);
      }
    })();
  }, []);

  async function handleExportMov() {
    setExporting(true);
    setExportError(null);
    setExportSuccess(false);

    try {
      const res = await fetch(`/api/hyperframes/export/${example.slug}`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Export failed.");
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");
      const filenameMatch = disposition?.match(/filename="([^"]+)"/);
      const filename = filenameMatch?.[1] ?? `${example.slug}-transparent.mov`;

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
      setExportSuccess(true);
    } catch (error) {
      setExportError(
        error instanceof Error ? error.message : "Export failed."
      );
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Download & export</h3>
        <p className="mt-1 text-sm text-zinc-400">
          Export a transparent ProRes MOV for CapCut, Premiere, or DaVinci — or
          download the HTML source.
        </p>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => void handleExportMov()}
          disabled={exporting || serverAvailable === false}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3.5 font-medium text-zinc-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Layers className="h-4 w-4" />
          )}
          {exporting ? "Rendering MOV…" : "Export transparent MOV"}
        </button>

        {serverAvailable === false && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-xs text-amber-200/90">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {serverMessage ??
                "Server export requires ffmpeg and ffprobe. Use the CLI command below to render locally."}
            </span>
          </div>
        )}

        {exportError && (
          <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {exportError}
          </div>
        )}

        {exportSuccess && (
          <div className="flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            Transparent MOV downloaded. Import over footage in your editor —
            preview apps may show black where it&apos;s transparent.
          </div>
        )}

        <a
          href={`/api/hyperframes/download/${example.slug}`}
          download={`${example.slug}.html`}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 px-5 py-3.5 font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800/50"
        >
          <Download className="h-4 w-4" />
          Download HTML composition
        </a>

        <a
          href={`/api/hyperframes/download/${example.slug}?format=project`}
          download={`${example.slug}-project.zip`}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 px-5 py-3.5 font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800/50"
        >
          <FileCode className="h-4 w-4" />
          Download starter project
        </a>
      </div>

      {example.transparentExport && (
        <p className="text-xs text-zinc-500">
          This composition is authored with a transparent canvas — only the
          visible elements export; the rest is alpha.
        </p>
      )}

      <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Terminal className="h-4 w-4 text-amber-400" />
            Render transparent MOV locally
          </div>
          <code className="block rounded-lg bg-zinc-950 px-3 py-2.5 text-xs text-zinc-400 break-all">
            {renderCommand}
          </code>
          <div className="mt-2">
            <CopyButton text={renderCommand} label="Copy command" />
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Terminal className="h-4 w-4 text-amber-400" />
            Initialize full project
          </div>
          <code className="block rounded-lg bg-zinc-950 px-3 py-2.5 text-xs text-zinc-400 break-all">
            {initCommand}
          </code>
          <div className="mt-2">
            <CopyButton text={initCommand} label="Copy command" />
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-4">
          <div className="mb-2 text-sm font-medium text-zinc-300">
            AI agent skills
          </div>
          <code className="block rounded-lg bg-zinc-950 px-3 py-2.5 text-xs text-zinc-400 break-all">
            {skillsCommand}
          </code>
          <div className="mt-2">
            <CopyButton text={skillsCommand} label="Copy command" />
          </div>
        </div>
      </div>

      <a
        href="https://hyperframes.heygen.com/guides/rendering#transparent-video"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300"
      >
        HyperFrames transparent rendering docs
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

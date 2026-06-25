"use client";

import dynamic from "next/dynamic";
import type { HookTemplate } from "@video-lib/template-sdk";
import { Play } from "lucide-react";
import { Component, type ReactNode } from "react";
import { fitsContentExport, getExportDimensions } from "@/lib/export-dimensions";
import { isTransparentProps } from "@/lib/transparent-export";

function PreviewSkeleton() {
  return (
    <div className="flex aspect-[9/16] w-full flex-col items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/80">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-600/20">
        <Play className="h-6 w-6 text-amber-400" />
      </div>
      <p className="text-sm text-zinc-500">Loading preview...</p>
    </div>
  );
}

const RemotionPlayerInner = dynamic(
  () =>
    import("@/components/remotion-player-inner").then(
      (mod) => mod.RemotionPlayerInner
    ),
  {
    ssr: false,
    loading: () => <PreviewSkeleton />,
  }
);

interface TemplatePreviewProps {
  template: HookTemplate;
  inputProps: Record<string, string | number>;
  className?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

class PreviewErrorBoundary extends Component<
  { children: ReactNode },
  State
> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex aspect-[9/16] items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-300">
          Preview failed: {this.state.message}
        </div>
      );
    }
    return this.props.children;
  }
}

export function TemplatePreview({
  template,
  inputProps,
  className,
}: TemplatePreviewProps) {
  const transparent = isTransparentProps(inputProps);
  const contentSized = transparent && fitsContentExport(template);
  const exportFrame = contentSized
    ? getExportDimensions(template, "1080p", {
        fitToContent: true,
        inputProps,
      })
    : null;

  return (
    <div className={className}>
      {transparent && (
        <p className="mb-2 text-center text-xs text-emerald-400">
          Transparent preview — checkerboard = no background
          {exportFrame
            ? ` · exports at ${exportFrame.width}×${exportFrame.height}`
            : ""}
        </p>
      )}
      <div
        className="overflow-hidden rounded-xl"
        style={
          transparent
            ? {
                backgroundImage: `
                  linear-gradient(45deg, #3f3f46 25%, transparent 25%),
                  linear-gradient(-45deg, #3f3f46 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #3f3f46 75%),
                  linear-gradient(-45deg, transparent 75%, #3f3f46 75%)
                `,
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                backgroundColor: "#27272a",
              }
            : undefined
        }
      >
        <PreviewErrorBoundary>
          <RemotionPlayerInner
            template={template}
            inputProps={inputProps}
            compositionWidth={exportFrame?.width}
            compositionHeight={exportFrame?.height}
          />
        </PreviewErrorBoundary>
      </div>
      {transparent && (
        <p className="mt-2 text-center text-xs text-zinc-500">
          Export as transparent MOV (cropped to graphic) for CapCut / Premiere
        </p>
      )}
    </div>
  );
}

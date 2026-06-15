"use client";

import dynamic from "next/dynamic";
import type { HookTemplate } from "@video-lib/template-sdk";
import { Play } from "lucide-react";
import { Component, type ReactNode } from "react";

function PreviewSkeleton() {
  return (
    <div className="flex aspect-[9/16] w-full flex-col items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/80">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600/20">
        <Play className="h-6 w-6 text-violet-400" />
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
  return (
    <div className={className}>
      <PreviewErrorBoundary>
        <RemotionPlayerInner template={template} inputProps={inputProps} />
      </PreviewErrorBoundary>
    </div>
  );
}

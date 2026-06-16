"use client";

import { Player } from "@remotion/player";
import type { HookTemplate } from "@video-lib/template-sdk";
import { coerceTemplateProps, getDefaultTemplateProps } from "@/lib/coerce-props";
import { getPreviewGradientClass } from "@/lib/preview-gradients";
import { getComposition } from "@/remotion";
import { cn } from "@/lib/utils";

interface TemplateCardPlayerProps {
  template: HookTemplate;
}

export function TemplateCardPlayer({ template }: TemplateCardPlayerProps) {
  const Component = getComposition(template.compositionId);
  const gradient = getPreviewGradientClass(template.slug);

  if (!Component) {
    return (
      <div
        className={cn("h-full w-full bg-gradient-to-br", gradient)}
        aria-hidden
      />
    );
  }

  const coercedProps = coerceTemplateProps(
    template,
    getDefaultTemplateProps(template)
  );

  return (
    <Player
      component={Component}
      inputProps={coercedProps}
      durationInFrames={template.durationInFrames}
      fps={template.fps}
      compositionWidth={template.width}
      compositionHeight={template.height}
      style={{ width: "100%", height: "100%" }}
      loop
      autoPlay
      controls={false}
      clickToPlay={false}
      showVolumeControls={false}
      initiallyMuted
      numberOfSharedAudioTags={0}
    />
  );
}

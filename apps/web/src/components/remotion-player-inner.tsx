"use client";

import { Player } from "@remotion/player";
import type { HookTemplate } from "@video-lib/template-sdk";
import { coerceTemplateProps } from "@/lib/coerce-props";
import { getComposition } from "@/remotion";

interface RemotionPlayerInnerProps {
  template: HookTemplate;
  inputProps: Record<string, string | number>;
}

export function RemotionPlayerInner({
  template,
  inputProps,
}: RemotionPlayerInnerProps) {
  const Component = getComposition(template.compositionId);

  if (!Component) {
    return (
      <div className="flex aspect-[9/16] items-center justify-center rounded-xl bg-zinc-900 text-sm text-zinc-500">
        Composition not found
      </div>
    );
  }

  const coercedProps = coerceTemplateProps(template, inputProps);
  const isLandscape = template.width > template.height;

  return (
    <Player
      key={`${template.compositionId}-${JSON.stringify(coercedProps)}`}
      component={Component}
      inputProps={coercedProps}
      durationInFrames={template.durationInFrames}
      fps={template.fps}
      compositionWidth={template.width}
      compositionHeight={template.height}
      style={{
        width: "100%",
        aspectRatio: isLandscape ? "16 / 9" : "9 / 16",
        borderRadius: 12,
        overflow: "hidden",
      }}
      controls
      loop
      autoPlay
      clickToPlay
      showVolumeControls={false}
    />
  );
}

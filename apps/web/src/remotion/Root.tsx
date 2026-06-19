import type React from "react";
import { Composition } from "remotion";
import { TEMPLATE_CATALOG } from "@video-lib/template-sdk";
import { COMPOSITION_REGISTRY } from "./index";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {TEMPLATE_CATALOG.map((template) => {
        const Component = COMPOSITION_REGISTRY[template.compositionId];
        if (!Component) return null;

        const defaultProps = Object.fromEntries(
          template.props.map((field) => [field.key, field.defaultValue])
        );

        return (
          <Composition
            key={template.slug}
            id={template.slug}
            component={Component}
            durationInFrames={template.durationInFrames}
            fps={template.fps}
            width={template.width}
            height={template.height}
            defaultProps={defaultProps}
          />
        );
      })}
    </>
  );
};

"use client";

import { useEffect, useRef } from "react";
import "@hyperframes/player";

interface HyperFramesPlayerProps {
  src: string;
  width?: number;
  height?: number;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
}

export function HyperFramesPlayer({
  src,
  width = 1920,
  height = 1080,
  controls = true,
  autoplay = false,
  loop = true,
  className,
}: HyperFramesPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const player = document.createElement("hyperframes-player");
    player.setAttribute("src", src);
    player.setAttribute("width", String(width));
    player.setAttribute("height", String(height));
    if (controls) player.setAttribute("controls", "");
    if (autoplay) player.setAttribute("autoplay", "");
    if (loop) player.setAttribute("loop", "");
    player.setAttribute("muted", "");
    player.style.width = "100%";
    player.style.aspectRatio = `${width} / ${height}`;
    player.style.display = "block";

    container.appendChild(player);

    return () => {
      container.removeChild(player);
    };
  }, [src, width, height, controls, autoplay, loop]);

  return <div ref={containerRef} className={className} />;
}

/**
 * Remotion's DOM→canvas→VideoFrame path often yields BGRX (no alpha plane).
 * Mediabunny then skips the alpha encoder and transparent pixels become opaque black.
 * Re-pack frames as RGBA so the VP8/VP9 alpha sidecar is muxed correctly.
 */
export function preserveAlphaFrame(frame: VideoFrame): VideoFrame {
  const format = frame.format ?? "";
  if (format.includes("A") && format !== "BGRX") {
    return frame;
  }

  const width = frame.displayWidth;
  const height = frame.displayHeight;
  const timestamp = frame.timestamp;
  const duration = frame.duration ?? undefined;

  const rgba = readFrameAsRgba(frame, width, height);
  frame.close();

  return new VideoFrame(rgba.buffer, {
    format: "RGBA",
    codedWidth: width,
    codedHeight: height,
    timestamp,
    duration,
  });
}

function readFrameAsRgba(
  frame: VideoFrame,
  width: number,
  height: number
): Uint8ClampedArray {
  try {
    const size = frame.allocationSize({ format: "RGBA" });
    const bytes = new Uint8ClampedArray(size);
    frame.copyTo(bytes, { format: "RGBA" });

    if (hasVariableAlpha(bytes)) {
      return bytes;
    }
  } catch {
    // Fall back to canvas readback below.
  }

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    throw new Error("Could not read transparent export frame.");
  }

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(frame, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height).data;
}

function hasVariableAlpha(pixels: Uint8ClampedArray): boolean {
  let min = 255;
  let max = 0;
  for (let i = 3; i < pixels.length; i += 4) {
    const a = pixels[i];
    if (a < min) min = a;
    if (a > max) max = a;
    if (max - min > 8) return true;
  }
  return min < 250;
}

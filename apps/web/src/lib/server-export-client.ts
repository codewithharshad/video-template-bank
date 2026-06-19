import type { ExportResolution } from "@/lib/export-video";
import type { ServerExportMode } from "@/lib/server-export";
import { downloadBlob } from "@/lib/export-props";

export interface ServerExportClientResult {
  filename: string;
  width: number;
  height: number;
  transparent: boolean;
  source: "server";
}

export async function checkServerExportAvailable(): Promise<{
  available: boolean;
  message?: string;
}> {
  try {
    const res = await fetch("/api/export/health");
    if (!res.ok) return { available: false, message: "Server export unavailable." };
    const data = (await res.json()) as { available: boolean; message?: string };
    return data;
  } catch {
    return {
      available: false,
      message: "Could not reach export server.",
    };
  }
}

export async function exportVideoOnServer(options: {
  slug: string;
  inputProps: Record<string, string | number>;
  mode: ServerExportMode;
  resolution: ExportResolution;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}): Promise<ServerExportClientResult> {
  const { slug, inputProps, mode, resolution, onProgress, signal } = options;

  const res = await fetch("/api/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, inputProps, mode, resolution }),
    signal,
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? `Server export failed (${res.status}).`);
  }

  const contentType = res.headers.get("Content-Type") ?? "";
  if (contentType.includes("application/json")) {
    const data = (await res.json()) as {
      saved: boolean;
      exportId: string;
      downloadUrl: string;
      filename: string;
      width: number;
      height: number;
      transparent: boolean;
    };
    onProgress?.(1);
    window.open(data.downloadUrl, "_blank");
    return {
      filename: data.filename,
      width: data.width,
      height: data.height,
      transparent: data.transparent,
      source: "server",
    };
  }

  const width = Number(res.headers.get("X-Export-Width") ?? 0);
  const height = Number(res.headers.get("X-Export-Height") ?? 0);
  const transparent = res.headers.get("X-Export-Transparent") === "true";

  const disposition = res.headers.get("Content-Disposition") ?? "";
  const match = disposition.match(/filename="([^"]+)"/);
  const filename = match?.[1] ?? `hookforge-${slug}-${Date.now()}.mov`;

  const total = Number(res.headers.get("Content-Length") ?? 0);
  const reader = res.body?.getReader();
  if (!reader) {
    const blob = await res.blob();
    downloadBlob(blob, filename);
    return { filename, width, height, transparent, source: "server" };
  }

  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      received += value.length;
      if (total > 0) onProgress?.(received / total);
      else onProgress?.(Math.min(0.95, received / 5_000_000));
    }
  }

  const blob = new Blob(chunks as BlobPart[], { type: "video/quicktime" });
  downloadBlob(blob, filename);
  onProgress?.(1);

  return { filename, width, height, transparent, source: "server" };
}

import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import type {
  ServerExportRequest,
  ServerExportResult,
} from "@/lib/render-engine";

export function getRenderWorkerConfig(): { url: string; secret: string } | null {
  const url = process.env.RENDER_WORKER_URL?.replace(/\/$/, "");
  const secret = process.env.RENDER_WORKER_SECRET;
  if (!url || !secret) return null;
  return { url, secret };
}

function workerHeaders(secret: string): HeadersInit {
  return {
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/json",
  };
}

export async function checkRenderWorkerHealth(): Promise<{
  available: boolean;
  ffmpeg: boolean;
  message?: string;
} | null> {
  const config = getRenderWorkerConfig();
  if (!config) return null;

  try {
    const res = await fetch(`${config.url}/health`, {
      headers: workerHeaders(config.secret),
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        available: false,
        ffmpeg: false,
        message: "Render worker health check failed.",
      };
    }
    return (await res.json()) as {
      available: boolean;
      ffmpeg: boolean;
      message?: string;
    };
  } catch {
    return {
      available: false,
      ffmpeg: false,
      message: "Could not reach the render worker.",
    };
  }
}

export async function renderOnWorker(
  request: ServerExportRequest
): Promise<ServerExportResult> {
  const config = getRenderWorkerConfig();
  if (!config) {
    throw new Error("Render worker is not configured.");
  }

  const res = await fetch(`${config.url}/render`, {
    method: "POST",
    headers: workerHeaders(config.secret),
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? `Render worker failed (${res.status}).`);
  }

  const width = Number(res.headers.get("X-Export-Width") ?? 0);
  const height = Number(res.headers.get("X-Export-Height") ?? 0);
  const transparent = res.headers.get("X-Export-Transparent") === "true";
  const disposition = res.headers.get("Content-Disposition") ?? "";
  const match = disposition.match(/filename="([^"]+)"/);
  const filename =
    match?.[1] ??
    `hookforge-${request.slug}-${request.resolution}-${Date.now()}.mov`;

  const buffer = Buffer.from(await res.arrayBuffer());
  const filePath = path.join(os.tmpdir(), filename);
  await fs.writeFile(filePath, buffer);

  return {
    filePath,
    filename,
    width,
    height,
    transparent,
  };
}

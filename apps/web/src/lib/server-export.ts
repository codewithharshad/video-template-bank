export type {
  ServerExportMode,
  ServerExportRequest,
  ServerExportResult,
} from "@/lib/render-engine";
export {
  isServerExportEnabled,
  readExportFile,
  deleteExportFile,
} from "@/lib/render-engine";
import {
  checkRenderEngineHealth,
  renderTemplateOnServer as renderLocally,
  type ServerExportRequest,
  type ServerExportResult,
} from "@/lib/render-engine";
import {
  checkRenderWorkerHealth,
  getRenderWorkerConfig,
  renderOnWorker,
} from "@/lib/render-worker-client";

export async function checkServerExportHealth(): Promise<{
  available: boolean;
  ffmpeg: boolean;
  message?: string;
}> {
  const worker = getRenderWorkerConfig();
  if (worker) {
    const health = await checkRenderWorkerHealth();
    if (health) return health;
    return {
      available: false,
      ffmpeg: false,
      message: "Render worker is configured but unreachable.",
    };
  }

  const local = await checkRenderEngineHealth();
  if (local.available) return local;

  const isHosted =
    process.env.VERCEL === "1" ||
    (process.env.NODE_ENV === "production" && !process.env.RENDER_WORKER_URL);
  if (isHosted && !local.ffmpeg) {
    return {
      available: false,
      ffmpeg: false,
      message:
        "Server MOV export is not available. Deploy the render worker and set RENDER_WORKER_URL.",
    };
  }

  return local;
}

export async function renderTemplateOnServer(
  request: ServerExportRequest,
  onProgress?: (progress: number) => void
): Promise<ServerExportResult> {
  if (getRenderWorkerConfig()) {
    return renderOnWorker(request);
  }
  return renderLocally(request, onProgress);
}

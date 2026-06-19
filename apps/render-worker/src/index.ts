import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { getTemplateBySlug } from "@video-lib/template-sdk";
import type { HookTemplate } from "@video-lib/template-sdk";
import {
  checkRenderEngineHealth,
  deleteExportFile,
  readExportFile,
  renderTemplateOnServer,
  type ServerExportMode,
  type ServerExportRequest,
} from "../../web/src/lib/render-engine.ts";
import type { ExportResolution } from "../../web/src/lib/export-dimensions.ts";

const app = new Hono();
const port = Number(process.env.PORT ?? 8080);
const secret = process.env.RENDER_WORKER_SECRET;

if (!secret) {
  console.error("RENDER_WORKER_SECRET is required.");
  process.exit(1);
}

if (!process.env.REMOTION_ENTRYPOINT) {
  process.env.REMOTION_ENTRYPOINT = new URL(
    "../../web/src/remotion/register-root.ts",
    import.meta.url
  ).pathname;
}

app.get("/health", async (c) => {
  const health = await checkRenderEngineHealth();
  return c.json(health);
});

app.use("/render", async (c, next) => {
  const auth = c.req.header("Authorization");
  if (auth !== `Bearer ${secret}`) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});

interface RenderBody {
  slug?: string;
  inputProps?: Record<string, string | number>;
  mode?: ServerExportMode;
  resolution?: ExportResolution;
  template?: HookTemplate;
}

app.post("/render", async (c) => {
  let filePath: string | null = null;

  try {
    const body = (await c.req.json()) as RenderBody;

    if (!body.slug || typeof body.slug !== "string") {
      return c.json({ error: "Missing slug." }, { status: 400 });
    }

    const template = body.template ?? getTemplateBySlug(body.slug);
    if (!template) {
      return c.json({ error: `Template not found: ${body.slug}` }, { status: 404 });
    }

    const request: ServerExportRequest = {
      slug: body.slug,
      inputProps: body.inputProps ?? {},
      mode: body.mode === "solid" ? "solid" : "transparent",
      resolution: body.resolution === "720p" ? "720p" : "1080p",
      template,
    };

    const result = await renderTemplateOnServer(request);
    filePath = result.filePath;
    const buffer = await readExportFile(result.filePath);

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "video/quicktime",
        "Content-Disposition": `attachment; filename="${result.filename}"`,
        "Content-Length": String(buffer.length),
        "X-Export-Width": String(result.width),
        "X-Export-Height": String(result.height),
        "X-Export-Transparent": result.transparent ? "true" : "false",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Server export failed.";
    return c.json({ error: message }, { status: 500 });
  } finally {
    if (filePath) {
      await deleteExportFile(filePath);
    }
  }
});

console.log(`Render worker listening on :${port}`);
serve({ fetch: app.fetch, port });

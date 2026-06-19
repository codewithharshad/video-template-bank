import { NextResponse } from "next/server";
import type { ExportResolution } from "@/lib/export-dimensions";
import type { ServerExportMode } from "@/lib/server-export";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

interface ExportBody {
  slug?: string;
  inputProps?: Record<string, string | number>;
  mode?: ServerExportMode;
  resolution?: ExportResolution;
}

export async function POST(request: Request) {
  let filePath: string | null = null;

  try {
    const body = (await request.json()) as ExportBody;

    if (!body.slug || typeof body.slug !== "string") {
      return NextResponse.json({ error: "Missing slug." }, { status: 400 });
    }

    const mode: ServerExportMode =
      body.mode === "solid" ? "solid" : "transparent";
    const resolution: ExportResolution =
      body.resolution === "720p" ? "720p" : "1080p";
    const inputProps = body.inputProps ?? {};

    const { renderTemplateOnServer, readExportFile, deleteExportFile } =
      await import("@/lib/server-export");

    const result = await renderTemplateOnServer({
      slug: body.slug,
      inputProps,
      mode,
      resolution,
    });

    filePath = result.filePath;
    const buffer = await readExportFile(result.filePath);

    return new NextResponse(new Uint8Array(buffer), {
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
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (filePath) {
      const { deleteExportFile: cleanup } = await import("@/lib/server-export");
      await cleanup(filePath);
    }
  }
}

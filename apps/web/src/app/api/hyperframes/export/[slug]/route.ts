import { NextResponse } from "next/server";
import {
  deleteHyperFramesExportDir,
  readHyperFramesExportFile,
  renderHyperFramesMov,
} from "@/lib/hyperframes-export";
import { getHyperFramesExample } from "@/lib/hyperframes-catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const example = getHyperFramesExample(slug);

  if (!example) {
    return NextResponse.json({ error: "Composition not found." }, { status: 404 });
  }

  let filePath: string | null = null;

  try {
    const result = await renderHyperFramesMov(slug);
    filePath = result.filePath;
    const buffer = await readHyperFramesExportFile(result.filePath);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "video/quicktime",
        "Content-Disposition": `attachment; filename="${result.filename}"`,
        "Content-Length": String(buffer.length),
        "X-Export-Width": String(result.width),
        "X-Export-Height": String(result.height),
        "X-Export-Transparent": "true",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "HyperFrames export failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (filePath) {
      await deleteHyperFramesExportDir(filePath);
    }
  }
}

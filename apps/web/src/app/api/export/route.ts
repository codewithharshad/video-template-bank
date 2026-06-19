import { NextResponse } from "next/server";
import type { ExportResolution } from "@/lib/export-dimensions";
import type { ServerExportMode } from "@/lib/server-export";
import { getCurrentDbUser, canExportProTemplate, canExportResolution } from "@/lib/auth/user";
import { canAffordExport } from "@/lib/credits";
import { getTemplateBySlugMerged } from "@/lib/catalog";
import { saveExportToBlob } from "@/lib/exports/storage";
import { isDatabaseConfigured } from "@video-lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

interface ExportBody {
  slug?: string;
  inputProps?: Record<string, string | number>;
  mode?: ServerExportMode;
  resolution?: ExportResolution;
  save?: boolean;
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
    const shouldSave = body.save !== false && isDatabaseConfigured();

    const template = await getTemplateBySlugMerged(body.slug);
    if (!template) {
      return NextResponse.json({ error: "Template not found." }, { status: 404 });
    }

    if (shouldSave) {
      const user = await getCurrentDbUser();
      if (!user) {
        return NextResponse.json(
          { error: "Sign in to export and save downloads." },
          { status: 401 }
        );
      }

      if (!canExportProTemplate(user, template.isPro)) {
        return NextResponse.json(
          { error: "This Pro template requires a Creator or Pro plan." },
          { status: 403 }
        );
      }

      if (!canExportResolution(user, resolution)) {
        return NextResponse.json(
          { error: "1080p exports require a Creator or Pro plan." },
          { status: 403 }
        );
      }

      if (!(await canAffordExport(user, resolution))) {
        return NextResponse.json(
          { error: "Insufficient credits. Upgrade your plan or buy more credits." },
          { status: 402 }
        );
      }
    }

    const { renderTemplateOnServer, readExportFile, deleteExportFile } =
      await import("@/lib/server-export");

    const result = await renderTemplateOnServer({
      slug: body.slug,
      inputProps,
      mode,
      resolution,
      template,
    });

    filePath = result.filePath;
    const buffer = await readExportFile(result.filePath);

    if (shouldSave) {
      const user = await getCurrentDbUser();
      const template = await getTemplateBySlugMerged(body.slug);

      if (user && template) {
        const record = await saveExportToBlob({
          user,
          templateSlug: template.slug,
          templateName: template.name,
          format: mode === "solid" ? "mov-solid" : "transparent",
          resolution,
          transparent: result.transparent,
          buffer,
          filename: result.filename,
          inputProps,
        });

        return NextResponse.json({
          saved: true,
          exportId: record.id,
          downloadUrl: record.blobUrl,
          filename: result.filename,
          width: result.width,
          height: result.height,
          transparent: result.transparent,
        });
      }
    }

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

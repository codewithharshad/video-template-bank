import { NextResponse } from "next/server";
import { getCurrentDbUser, canExportProTemplate, canExportResolution } from "@/lib/auth/user";
import { canAffordExport } from "@/lib/credits";
import { getTemplateBySlugMerged } from "@/lib/catalog";
import { saveExportToBlob } from "@/lib/exports/storage";

export async function POST(request: Request) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json(
        { error: "Sign in to export and save downloads." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const slug = formData.get("slug");
    const format = formData.get("format");
    const resolution = formData.get("resolution");
    const transparent = formData.get("transparent") === "true";
    const inputPropsRaw = formData.get("inputProps");

    if (!(file instanceof File) || typeof slug !== "string") {
      return NextResponse.json({ error: "Invalid export payload." }, { status: 400 });
    }

    const template = await getTemplateBySlugMerged(slug);
    if (!template) {
      return NextResponse.json({ error: "Template not found." }, { status: 404 });
    }

    const res = resolution === "720p" ? "720p" : "1080p";

    if (!canExportProTemplate(user, template.isPro)) {
      return NextResponse.json(
        { error: "This Pro template requires a Creator or Pro plan." },
        { status: 403 }
      );
    }

    if (!canExportResolution(user, res)) {
      return NextResponse.json(
        { error: "1080p exports require a Creator or Pro plan." },
        { status: 403 }
      );
    }

    if (!(await canAffordExport(user, res))) {
      return NextResponse.json(
        { error: "Insufficient credits. Upgrade your plan." },
        { status: 402 }
      );
    }

    let inputProps: Record<string, string | number> = {};
    if (typeof inputPropsRaw === "string") {
      try {
        inputProps = JSON.parse(inputPropsRaw) as Record<string, string | number>;
      } catch {
        inputProps = {};
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const record = await saveExportToBlob({
      user,
      templateSlug: template.slug,
      templateName: template.name,
      format: typeof format === "string" ? format : "mp4",
      resolution: res,
      transparent,
      buffer,
      filename: file.name,
      inputProps,
    });

    return NextResponse.json({
      saved: true,
      exportId: record.id,
      downloadUrl: record.blobUrl,
      creditsRemaining: user.plan === "pro" ? -1 : undefined,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save export.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

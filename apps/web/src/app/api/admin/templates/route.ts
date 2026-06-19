import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { catalogTemplates, getDb } from "@video-lib/database";
import { requireAdminUser } from "@/lib/auth/user";
import { hookTemplateToMetadata } from "@/lib/catalog";
import type { HookTemplate } from "@video-lib/template-sdk";

export async function GET() {
  try {
    await requireAdminUser();
    const db = getDb();
    const rows = await db
      .select()
      .from(catalogTemplates)
      .orderBy(desc(catalogTemplates.updatedAt));

    return NextResponse.json({ templates: rows });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load templates.";
    const status = message === "Forbidden" ? 403 : message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdminUser();
    const body = (await request.json()) as Partial<HookTemplate> & {
      published?: boolean;
      previewImageUrl?: string;
    };

    if (!body.slug || !body.name || !body.compositionId) {
      return NextResponse.json(
        { error: "slug, name, and compositionId are required." },
        { status: 400 }
      );
    }

    const db = getDb();
    const metadata = hookTemplateToMetadata(body);

    const [created] = await db
      .insert(catalogTemplates)
      .values({
        slug: body.slug,
        name: body.name,
        description: body.description ?? "",
        templateKind: body.templateKind ?? "overlay",
        compositionId: body.compositionId,
        published: body.published ?? false,
        metadata,
        previewImageUrl: body.previewImageUrl ?? null,
        createdBy: admin.id,
      })
      .returning();

    return NextResponse.json({ template: created }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create template.";
    const status = message === "Forbidden" ? 403 : message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

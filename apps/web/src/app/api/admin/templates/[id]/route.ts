import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { catalogTemplates, getDb } from "@video-lib/database";
import { requireAdminUser } from "@/lib/auth/user";
import { hookTemplateToMetadata } from "@/lib/catalog";
import type { HookTemplate } from "@video-lib/template-sdk";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminUser();
    const { id } = await params;
    const db = getDb();

    const rows = await db
      .select()
      .from(catalogTemplates)
      .where(eq(catalogTemplates.id, id))
      .limit(1);
    const row = rows[0];

    if (!row) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return NextResponse.json({ template: row });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load template.";
    const status = message === "Forbidden" ? 403 : message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminUser();
    const { id } = await params;
    const body = (await request.json()) as Partial<HookTemplate> & {
      published?: boolean;
      previewImageUrl?: string | null;
    };

    const db = getDb();
    const existingRows = await db
      .select()
      .from(catalogTemplates)
      .where(eq(catalogTemplates.id, id))
      .limit(1);
    const existing = existingRows[0];

    if (!existing) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const metadata = hookTemplateToMetadata({
      ...(existing.metadata as Partial<HookTemplate>),
      ...body,
    });

    const [updated] = await db
      .update(catalogTemplates)
      .set({
        slug: body.slug ?? existing.slug,
        name: body.name ?? existing.name,
        description: body.description ?? existing.description,
        templateKind: body.templateKind ?? existing.templateKind,
        compositionId: body.compositionId ?? existing.compositionId,
        published: body.published ?? existing.published,
        metadata,
        previewImageUrl:
          body.previewImageUrl !== undefined
            ? body.previewImageUrl
            : existing.previewImageUrl,
        updatedAt: new Date(),
      })
      .where(eq(catalogTemplates.id, id))
      .returning();

    return NextResponse.json({ template: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update template.";
    const status = message === "Forbidden" ? 403 : message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminUser();
    const { id } = await params;
    const db = getDb();

    await db.delete(catalogTemplates).where(eq(catalogTemplates.id, id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete template.";
    const status = message === "Forbidden" ? 403 : message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

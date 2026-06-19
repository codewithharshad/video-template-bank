import { put } from "@vercel/blob";
import { desc, eq, and } from "drizzle-orm";
import { exports, getDb } from "@video-lib/database";
import { deductCredits, getExportCreditCost } from "@/lib/credits";
import type { User } from "@video-lib/database";

export async function saveExportToBlob(input: {
  user: User;
  templateSlug: string;
  templateName: string;
  format: string;
  resolution: "720p" | "1080p";
  transparent: boolean;
  buffer: Buffer;
  filename: string;
  inputProps: Record<string, string | number>;
}) {
  const db = getDb();
  const creditCost =
    input.user.plan === "pro" ? 0 : getExportCreditCost(input.resolution);

  const pathname = `exports/${input.user.id}/${Date.now()}-${input.filename}`;

  const blob = await put(pathname, input.buffer, {
    access: "public",
    contentType: input.transparent ? "video/quicktime" : "video/mp4",
    addRandomSuffix: false,
  });

  const [record] = await db
    .insert(exports)
    .values({
      userId: input.user.id,
      templateSlug: input.templateSlug,
      templateName: input.templateName,
      format: input.format,
      resolution: input.resolution,
      transparent: input.transparent,
      blobUrl: blob.url,
      blobPathname: blob.pathname,
      fileSize: input.buffer.length,
      inputProps: input.inputProps,
      creditsUsed: creditCost,
    })
    .returning();

  if (creditCost > 0) {
    await deductCredits({
      userId: input.user.id,
      amount: creditCost,
      reason: `Export ${input.templateName} (${input.resolution})`,
      exportId: record.id,
    });
  } else if (input.user.plan === "pro") {
    await deductCredits({
      userId: input.user.id,
      amount: 0,
      reason: `Export ${input.templateName} (${input.resolution})`,
      exportId: record.id,
    });
  }

  return record;
}

export async function getUserExports(userId: string) {
  const db = getDb();
  return db
    .select()
    .from(exports)
    .where(eq(exports.userId, userId))
    .orderBy(desc(exports.createdAt));
}

export async function getExportForUser(exportId: string, userId: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(exports)
    .where(and(eq(exports.id, exportId), eq(exports.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

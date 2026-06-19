import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/auth/user";
import { getExportForUser } from "@/lib/exports/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const record = await getExportForUser(id, user.id);

    if (!record) {
      return NextResponse.json({ error: "Export not found." }, { status: 404 });
    }

    return NextResponse.redirect(record.blobUrl);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to download export.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

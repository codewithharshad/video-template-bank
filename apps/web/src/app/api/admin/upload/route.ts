import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdminUser } from "@/lib/auth/user";

export async function POST(request: Request) {
  try {
    const admin = await requireAdminUser();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const pathname = `admin/previews/${admin.id}/${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const blob = await put(pathname, buffer, {
      access: "public",
      contentType: file.type || "image/png",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed.";
    const status = message === "Forbidden" ? 403 : message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

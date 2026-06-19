import { NextResponse } from "next/server";
import { getMergedCatalog } from "@/lib/catalog";

export async function GET() {
  try {
    const templates = await getMergedCatalog();
    return NextResponse.json({ templates });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load catalog.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

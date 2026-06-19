import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { checkServerExportHealth } = await import("@/lib/server-export");
  const health = await checkServerExportHealth();
  return NextResponse.json(health);
}

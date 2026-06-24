import { NextResponse } from "next/server";
import { checkHyperFramesExportHealth } from "@/lib/hyperframes-export";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const health = await checkHyperFramesExportHealth();
  return NextResponse.json(health);
}

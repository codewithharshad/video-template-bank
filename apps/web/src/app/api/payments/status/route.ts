import { NextResponse } from "next/server";
import { isPaymentsConfigured } from "@/lib/payments";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ configured: isPaymentsConfigured() });
}

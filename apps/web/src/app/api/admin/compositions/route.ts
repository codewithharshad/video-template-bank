import { NextResponse } from "next/server";
import { COMPOSITION_IDS } from "@/remotion/composition-ids";

export async function GET() {
  return NextResponse.json({ compositions: [...COMPOSITION_IDS].sort() });
}

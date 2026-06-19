import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/auth/user";
import { getUserExports } from "@/lib/exports/storage";

export async function GET() {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await getUserExports(user.id);
    return NextResponse.json({ exports: items });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load exports.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

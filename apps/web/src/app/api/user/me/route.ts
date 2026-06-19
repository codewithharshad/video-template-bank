import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/auth/user";

export async function GET() {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      credits: user.credits,
      plan: user.plan,
      role: user.role,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load user.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

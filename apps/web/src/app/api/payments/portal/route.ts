import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/auth/user";
import { getPaymentProvider } from "@/lib/payments";

export async function POST(request: Request) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const provider = getPaymentProvider();
    const origin = new URL(request.url).origin;
    const result = await provider.createPortalUrl({ user, origin });

    if (!result) {
      return NextResponse.json(
        { error: "No billing account found." },
        { status: 400 }
      );
    }

    return NextResponse.json({ url: result.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Billing portal failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

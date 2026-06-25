import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/auth/user";
import { getPaymentProvider } from "@/lib/payments";
import type { UserPlan } from "@video-lib/database";

export async function POST(request: Request) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { plan?: UserPlan };
    const plan = body.plan;

    if (plan !== "creator" && plan !== "pro") {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const provider = getPaymentProvider();
    if (!provider.isConfigured()) {
      return NextResponse.json(
        { error: "Payments are not configured yet." },
        { status: 503 }
      );
    }

    const origin = new URL(request.url).origin;
    const { url } = await provider.createCheckout({ user, plan, origin });

    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

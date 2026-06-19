import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/auth/user";
import { getStripe } from "@/lib/stripe/plans";

export async function POST() {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user.stripeCustomerId) {
      return NextResponse.json(
        { error: "No billing account found." },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Billing portal failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

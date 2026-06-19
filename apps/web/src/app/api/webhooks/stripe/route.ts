import { NextResponse } from "next/server";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getDb, users } from "@video-lib/database";
import { getStripe, planFromPriceId } from "@/lib/stripe/plans";
import { addCredits } from "@/lib/credits";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid webhook signature.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const db = getDb();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (userId && plan && (plan === "creator" || plan === "pro")) {
      await db
        .update(users)
        .set({
          plan,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          credits: plan === "creator" ? 100 : undefined,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const priceId = subscription.items.data[0]?.price.id;
    const plan = priceId ? planFromPriceId(priceId) : null;
    const customerId = subscription.customer as string;

    if (plan) {
      const userRows = await db
        .select()
        .from(users)
        .where(eq(users.stripeCustomerId, customerId))
        .limit(1);
      const user = userRows[0];

      if (user) {
        const isActive =
          subscription.status === "active" ||
          subscription.status === "trialing";

        await db
          .update(users)
          .set({
            plan: isActive ? plan : "free",
            stripeSubscriptionId: subscription.id,
            updatedAt: new Date(),
            ...(isActive && plan === "creator" ? { credits: 100 } : {}),
          })
          .where(eq(users.id, user.id));
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    const user = await db.query.users.findFirst({
      where: eq(users.stripeCustomerId, customerId),
    });

    if (user) {
      await db
        .update(users)
        .set({
          plan: "free",
          stripeSubscriptionId: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));
    }
  }

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    if (invoice.billing_reason === "subscription_cycle") {
      const customerId = invoice.customer as string;
      const userRows = await db
        .select()
        .from(users)
        .where(eq(users.stripeCustomerId, customerId))
        .limit(1);
      const user = userRows[0];

      if (user?.plan === "creator") {
        await addCredits({
          userId: user.id,
          amount: 100,
          reason: "Monthly Creator plan credit refresh",
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}

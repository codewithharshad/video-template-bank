import { eq } from "drizzle-orm";
import {
  getDb,
  users,
  type PaymentProviderId,
  type User,
} from "@video-lib/database";
import type { PaidPlan } from "./plans";
import { monthlyCreditsForPlan } from "./plans";
import { addCredits } from "@/lib/credits";

/** Find a user by id (preferred) or by their provider customer id. */
export async function findBillingUser(input: {
  userId?: string | null;
  provider: PaymentProviderId;
  providerCustomerId?: string | null;
}): Promise<User | null> {
  const db = getDb();

  if (input.userId) {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.id, input.userId))
      .limit(1);
    if (rows[0]) return rows[0];
  }

  if (input.providerCustomerId) {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.providerCustomerId, input.providerCustomerId))
      .limit(1);
    if (rows[0]) return rows[0];
  }

  return null;
}

/** Activate (or change) a paid subscription for a user. Idempotent. */
export async function activateSubscription(input: {
  userId: string;
  plan: PaidPlan;
  provider: PaymentProviderId;
  providerCustomerId?: string | null;
  providerSubscriptionId?: string | null;
}) {
  const db = getDb();
  const credits = monthlyCreditsForPlan(input.plan);

  await db
    .update(users)
    .set({
      plan: input.plan,
      paymentProvider: input.provider,
      providerCustomerId: input.providerCustomerId ?? undefined,
      providerSubscriptionId: input.providerSubscriptionId ?? undefined,
      // Non-unlimited plans get a fixed monthly grant on activation.
      ...(credits >= 0 ? { credits } : {}),
      updatedAt: new Date(),
    })
    .where(eq(users.id, input.userId));
}

/** Refresh the monthly credit grant on a successful renewal. */
export async function refreshSubscriptionCredits(input: {
  userId: string;
  plan: PaidPlan;
}) {
  const credits = monthlyCreditsForPlan(input.plan);
  if (credits < 0) return; // unlimited plan, nothing to refresh
  await addCredits({
    userId: input.userId,
    amount: credits,
    reason: `Monthly ${input.plan} plan credit refresh`,
  });
}

/** Downgrade a user back to the free plan (cancellation/expiry/hold). */
export async function deactivateSubscription(input: {
  userId: string;
}) {
  const db = getDb();
  await db
    .update(users)
    .set({
      plan: "free",
      providerSubscriptionId: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, input.userId));
}

import { Webhooks } from "@dodopayments/nextjs";
import type { PaidPlan } from "@/lib/payments/plans";
import {
  activateSubscription,
  deactivateSubscription,
  findBillingUser,
  refreshSubscriptionCredits,
} from "@/lib/payments/sync";

export const runtime = "nodejs";

interface DodoWebhookData {
  metadata?: Record<string, string>;
  customer?: { customer_id?: string };
  subscription_id?: string;
  id?: string;
}

function parsePayload(payload: unknown) {
  const data = ((payload as { data?: DodoWebhookData })?.data ??
    {}) as DodoWebhookData;
  const metadata = data.metadata ?? {};
  const userId = metadata.userId ?? null;
  const plan: PaidPlan | null =
    metadata.plan === "creator" || metadata.plan === "pro"
      ? (metadata.plan as PaidPlan)
      : null;
  const providerCustomerId = data.customer?.customer_id ?? null;
  const providerSubscriptionId = data.subscription_id ?? data.id ?? null;
  return { userId, plan, providerCustomerId, providerSubscriptionId };
}

export const POST = Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY ?? "",

  onSubscriptionActive: async (payload: unknown) => {
    const { userId, plan, providerCustomerId, providerSubscriptionId } =
      parsePayload(payload);
    if (!userId || !plan) return;
    await activateSubscription({
      userId,
      plan,
      provider: "dodo",
      providerCustomerId,
      providerSubscriptionId,
    });
  },

  onSubscriptionRenewed: async (payload: unknown) => {
    const { userId, plan, providerCustomerId } = parsePayload(payload);
    const user = await findBillingUser({
      userId,
      provider: "dodo",
      providerCustomerId,
    });
    if (!user) return;
    const effectivePlan =
      plan ??
      (user.plan === "creator" || user.plan === "pro" ? user.plan : null);
    if (!effectivePlan) return;
    await refreshSubscriptionCredits({ userId: user.id, plan: effectivePlan });
  },

  onSubscriptionCancelled: async (payload: unknown) => {
    const { userId, providerCustomerId } = parsePayload(payload);
    const user = await findBillingUser({
      userId,
      provider: "dodo",
      providerCustomerId,
    });
    if (user) await deactivateSubscription({ userId: user.id });
  },

  onSubscriptionExpired: async (payload: unknown) => {
    const { userId, providerCustomerId } = parsePayload(payload);
    const user = await findBillingUser({
      userId,
      provider: "dodo",
      providerCustomerId,
    });
    if (user) await deactivateSubscription({ userId: user.id });
  },

  onSubscriptionOnHold: async (payload: unknown) => {
    const { userId, providerCustomerId } = parsePayload(payload);
    const user = await findBillingUser({
      userId,
      provider: "dodo",
      providerCustomerId,
    });
    if (user) await deactivateSubscription({ userId: user.id });
  },
});

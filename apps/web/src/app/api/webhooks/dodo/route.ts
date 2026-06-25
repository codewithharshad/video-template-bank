import { Webhooks } from "@dodopayments/nextjs";
import type { NextRequest } from "next/server";
import { parseDodoWebhookPayload } from "@/lib/payments/parse-dodo-webhook";
import {
  activateSubscription,
  deactivateSubscription,
  findBillingUser,
  refreshSubscriptionCredits,
} from "@/lib/payments/sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type WebhookHandler = (request: NextRequest) => Promise<Response>;

let cachedHandler: WebhookHandler | null = null;

async function handleActivation(payload: unknown) {
  const { userId, plan, providerCustomerId, providerSubscriptionId } =
    parseDodoWebhookPayload(payload);
  if (!userId || !plan) return;
  await activateSubscription({
    userId,
    plan,
    provider: "dodo",
    providerCustomerId,
    providerSubscriptionId,
  });
}

async function handleRenewal(payload: unknown) {
  const { userId, plan, providerCustomerId } = parseDodoWebhookPayload(payload);
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
  await refreshSubscriptionCredits({
    userId: user.id,
    plan: effectivePlan,
  });
}

async function handleDeactivation(payload: unknown) {
  const { userId, providerCustomerId } = parseDodoWebhookPayload(payload);
  const user = await findBillingUser({
    userId,
    provider: "dodo",
    providerCustomerId,
  });
  if (user) await deactivateSubscription({ userId: user.id });
}

function getWebhookHandler(): WebhookHandler {
  const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
  if (!webhookKey) {
    throw new Error("DODO_PAYMENTS_WEBHOOK_KEY is not configured.");
  }

  if (!cachedHandler) {
    cachedHandler = Webhooks({
      webhookKey,
      onSubscriptionActive: handleActivation,
      onSubscriptionPlanChanged: handleActivation,
      onSubscriptionRenewed: handleRenewal,
      onSubscriptionCancelled: handleDeactivation,
      onSubscriptionExpired: handleDeactivation,
      onSubscriptionOnHold: handleDeactivation,
    });
  }

  return cachedHandler;
}

export async function POST(request: NextRequest) {
  if (!process.env.DODO_PAYMENTS_WEBHOOK_KEY) {
    return new Response("Webhook not configured", { status: 503 });
  }
  return getWebhookHandler()(request);
}

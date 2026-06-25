import type { PaidPlan } from "./plans";

interface DodoWebhookCustomer {
  customer_id?: string;
}

interface DodoWebhookData {
  metadata?: Record<string, unknown>;
  customer?: DodoWebhookCustomer;
  subscription_id?: string;
  product_id?: string;
  id?: string;
}

export interface ParsedDodoBillingEvent {
  userId: string | null;
  plan: PaidPlan | null;
  providerCustomerId: string | null;
  providerSubscriptionId: string | null;
}

function planFromMetadata(metadata: Record<string, unknown>): PaidPlan | null {
  const plan = metadata.plan;
  if (plan === "creator" || plan === "pro") return plan;
  return null;
}

function planFromProductId(productId: string | undefined): PaidPlan | null {
  if (!productId) return null;
  if (productId === process.env.DODO_CREATOR_PRODUCT_ID) return "creator";
  if (productId === process.env.DODO_PRO_PRODUCT_ID) return "pro";
  return null;
}

/** Normalize a Dodo webhook payload into billing fields we persist. */
export function parseDodoWebhookPayload(payload: unknown): ParsedDodoBillingEvent {
  const root = payload as { data?: DodoWebhookData };
  const data = (root?.data ?? {}) as DodoWebhookData;
  const metadata = (data.metadata ?? {}) as Record<string, unknown>;

  const userId =
    typeof metadata.userId === "string" ? metadata.userId : null;

  const plan =
    planFromMetadata(metadata) ?? planFromProductId(data.product_id);

  const providerCustomerId = data.customer?.customer_id ?? null;
  const providerSubscriptionId = data.subscription_id ?? data.id ?? null;

  return { userId, plan, providerCustomerId, providerSubscriptionId };
}

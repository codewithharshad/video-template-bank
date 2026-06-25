import DodoPayments from "dodopayments";
import type { CheckoutParams, PaymentProvider, PortalParams } from "./provider";
import type { PaidPlan } from "./plans";

/**
 * Minimal typed surface of the Dodo SDK we use, so this compiles regardless of
 * the package's exact published types. Method shapes follow Dodo's docs:
 * https://docs.dodopayments.com/developer-resources/checkout-session
 */
interface DodoClient {
  checkoutSessions: {
    create(body: {
      product_cart: { product_id: string; quantity: number }[];
      customer?: { email?: string; name?: string };
      return_url?: string;
      metadata?: Record<string, string>;
      subscription_data?: { trial_period_days?: number };
    }): Promise<{ checkout_url: string; session_id?: string }>;
  };
  customers: {
    customerPortal: {
      create(
        customerId: string,
        body?: { send_email?: boolean }
      ): Promise<{ link: string }>;
    };
  };
}

function getEnvironment(): "test_mode" | "live_mode" {
  return process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
    ? "live_mode"
    : "test_mode";
}

function getClient(): DodoClient {
  const bearerToken = process.env.DODO_PAYMENTS_API_KEY;
  if (!bearerToken) {
    throw new Error("DODO_PAYMENTS_API_KEY is not configured.");
  }
  return new DodoPayments({
    bearerToken,
    environment: getEnvironment(),
  }) as unknown as DodoClient;
}

function productIdForPlan(plan: PaidPlan): string | undefined {
  if (plan === "creator") return process.env.DODO_CREATOR_PRODUCT_ID;
  return process.env.DODO_PRO_PRODUCT_ID;
}

export const dodoProvider: PaymentProvider = {
  id: "dodo",

  isConfigured() {
    return Boolean(
      process.env.DODO_PAYMENTS_API_KEY &&
        (process.env.DODO_CREATOR_PRODUCT_ID || process.env.DODO_PRO_PRODUCT_ID)
    );
  },

  async createCheckout({ user, plan, origin }: CheckoutParams) {
    const productId = productIdForPlan(plan);
    if (!productId) {
      throw new Error(`Dodo product id not configured for plan "${plan}".`);
    }

    const client = getClient();
    const returnUrl =
      process.env.DODO_PAYMENTS_RETURN_URL ?? `${origin}/account?checkout=success`;

    const session = await client.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: {
        email: user.email,
        name: user.name ?? undefined,
      },
      return_url: returnUrl,
      // Persists through renewals and is echoed back in webhook events.
      metadata: { userId: user.id, plan },
    });

    return { url: session.checkout_url };
  },

  async createPortalUrl({ user }: PortalParams) {
    if (!user.providerCustomerId) {
      return null;
    }
    const client = getClient();
    const session = await client.customers.customerPortal.create(
      user.providerCustomerId,
      { send_email: false }
    );
    return { url: session.link };
  },
};

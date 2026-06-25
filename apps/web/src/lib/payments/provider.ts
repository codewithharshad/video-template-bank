import type { PaymentProviderId, User } from "@video-lib/database";
import type { PaidPlan } from "./plans";

export interface CheckoutParams {
  user: User;
  plan: PaidPlan;
  /** Origin of the current request, e.g. https://app.example.com */
  origin: string;
}

export interface PortalParams {
  user: User;
  origin: string;
}

/**
 * Common interface every payment provider implements so the rest of the app
 * (routes, UI) never has to know which gateway is active. Add a new provider
 * (e.g. Razorpay for India) by implementing this and registering it in index.ts.
 */
export interface PaymentProvider {
  readonly id: PaymentProviderId;
  /** Whether the required env vars for this provider are present. */
  isConfigured(): boolean;
  /** Create a hosted checkout/subscription and return a redirect URL. */
  createCheckout(params: CheckoutParams): Promise<{ url: string }>;
  /**
   * Return a customer self-service/billing portal URL, or null if the provider
   * has no portal or the user has no billing account yet.
   */
  createPortalUrl(params: PortalParams): Promise<{ url: string } | null>;
}

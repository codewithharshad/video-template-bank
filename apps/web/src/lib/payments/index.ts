import type { PaymentProviderId } from "@video-lib/database";
import type { PaymentProvider } from "./provider";
import { dodoProvider } from "./dodo";

const PROVIDERS: Partial<Record<PaymentProviderId, PaymentProvider>> = {
  dodo: dodoProvider,
  // razorpay: razorpayProvider, // (India) — add when ready
};

/** The active payment provider, controlled by PAYMENT_PROVIDER (default "dodo"). */
export function getPaymentProvider(): PaymentProvider {
  const id = (process.env.PAYMENT_PROVIDER ?? "dodo") as PaymentProviderId;
  const provider = PROVIDERS[id];
  if (!provider) {
    throw new Error(`Unknown or unconfigured payment provider: "${id}".`);
  }
  return provider;
}

export function isPaymentsConfigured(): boolean {
  try {
    return getPaymentProvider().isConfigured();
  } catch {
    return false;
  }
}

export * from "./provider";
export * from "./plans";

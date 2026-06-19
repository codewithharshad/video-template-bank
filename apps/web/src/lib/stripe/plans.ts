import Stripe from "stripe";
import type { UserPlan } from "@video-lib/database";

export const PLANS = {
  free: {
    id: "free" as const,
    name: "Free",
    price: 0,
    credits: 20,
    description: "Try HookForge with 20 credits on signup.",
    features: [
      "20 credits on signup",
      "Free templates only",
      "720p exports",
      "Browser rendering",
    ],
  },
  creator: {
    id: "creator" as const,
    name: "Creator",
    price: 9,
    credits: 100,
    description: "For creators publishing weekly content.",
    features: [
      "100 credits per month",
      "All templates including Pro",
      "1080p HD exports",
      "Saved downloads for 30 days",
    ],
  },
  pro: {
    id: "pro" as const,
    name: "Pro",
    price: 29,
    credits: -1,
    description: "Unlimited exports for power creators.",
    features: [
      "Unlimited exports",
      "All templates + solid MOV",
      "1080p and 4K exports",
      "Saved downloads forever",
      "Priority server rendering",
    ],
  },
} as const;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  return new Stripe(key, { apiVersion: "2025-08-27.basil" });
}

export function isStripeConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_WEBHOOK_SECRET &&
      (process.env.STRIPE_CREATOR_PRICE_ID || process.env.STRIPE_PRO_PRICE_ID)
  );
}

export function planFromPriceId(priceId: string): UserPlan | null {
  if (priceId === process.env.STRIPE_CREATOR_PRICE_ID) return "creator";
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "pro";
  return null;
}

export function priceIdForPlan(plan: Exclude<UserPlan, "free">) {
  if (plan === "creator") {
    return process.env.STRIPE_CREATOR_PRICE_ID;
  }
  return process.env.STRIPE_PRO_PRICE_ID;
}

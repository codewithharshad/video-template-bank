import type { UserPlan } from "@video-lib/database";

export type PaidPlan = Exclude<UserPlan, "free">;

export const PLANS = {
  free: {
    id: "free" as const,
    name: "Free",
    price: 0,
    credits: 20,
    description: "Try Animably with 20 credits on signup.",
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

/** Monthly credit grant per plan (used on subscribe + renewal). -1 = unlimited. */
export function monthlyCreditsForPlan(plan: PaidPlan): number {
  return PLANS[plan].credits;
}

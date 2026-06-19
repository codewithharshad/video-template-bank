"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Crown, Sparkles } from "lucide-react";
import { PLANS } from "@/lib/stripe/plans";
import { useCatalog } from "@/components/catalog-provider";

export default function PricingPage() {
  const { user } = useCatalog();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: "creator" | "pro") => {
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Checkout unavailable. Configure Stripe env vars.");
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Simple pricing</h1>
        <p className="mt-3 text-zinc-400">
          Start free with 20 credits. Upgrade when you need Pro templates and HD exports.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {Object.values(PLANS).map((plan) => {
          const isCurrent = user?.plan === plan.id;
          const isPro = plan.id === "pro";

          return (
            <div
              key={plan.id}
              className={`glass relative rounded-2xl p-6 ${
                isPro ? "border-violet-500/40 ring-1 ring-violet-500/20" : ""
              }`}
            >
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold">
                  Most popular
                </div>
              )}

              <div className="mb-4 flex items-center gap-2">
                {isPro ? (
                  <Crown className="h-5 w-5 text-amber-400" />
                ) : (
                  <Sparkles className="h-5 w-5 text-violet-400" />
                )}
                <h2 className="text-xl font-semibold">{plan.name}</h2>
              </div>

              <p className="mb-4 text-sm text-zinc-400">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold">
                  {plan.price === 0 ? "Free" : `$${plan.price}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-sm text-zinc-500">/month</span>
                )}
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.id === "free" ? (
                <Link
                  href={user ? "/effects" : "/sign-up"}
                  className="flex w-full items-center justify-center rounded-xl border border-zinc-700 py-3 text-sm font-medium transition-colors hover:bg-zinc-800"
                >
                  {user ? "Current plan" : "Get started free"}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loading === plan.id || isCurrent}
                  className="flex w-full items-center justify-center rounded-xl bg-violet-600 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-60"
                >
                  {isCurrent
                    ? "Current plan"
                    : loading === plan.id
                      ? "Redirecting..."
                      : `Upgrade to ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-10 text-center text-sm text-zinc-500">
        Credits work like VideoEffects — each export uses credits based on resolution.
        Pro plan includes unlimited exports.
      </p>
    </div>
  );
}

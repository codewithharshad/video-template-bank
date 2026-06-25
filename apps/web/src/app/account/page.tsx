"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Coins, Crown, CreditCard } from "lucide-react";
import { useCatalog } from "@/components/catalog-provider";

export default function AccountPage() {
  const { user, refreshUser } = useCatalog();
  const [portalLoading, setPortalLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") !== "success") return;

    setCheckoutSuccess(true);
    void refreshUser();
    window.history.replaceState({}, "", "/account");
  }, [refreshUser]);

  const openBillingPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/payments/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Billing portal unavailable.");
      }
    } finally {
      setPortalLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-zinc-400">Sign in to view your account.</p>
        <Link href="/sign-in" className="mt-4 inline-block text-amber-400 hover:text-amber-300">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Account</h1>
      <p className="mt-2 text-zinc-400">{user.email}</p>

      {checkoutSuccess && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <div>
            <p className="font-medium text-emerald-100">Payment received</p>
            <p className="mt-1 text-emerald-200/80">
              Your plan should update within a minute. Refresh if it still shows Free.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-4">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3">
            {user.plan === "pro" ? (
              <Crown className="h-6 w-6 text-amber-400" />
            ) : (
              <Coins className="h-6 w-6 text-amber-400" />
            )}
            <div>
              <p className="text-sm text-zinc-500">Current plan</p>
              <p className="text-xl font-semibold capitalize">{user.plan}</p>
            </div>
          </div>

          {user.plan !== "pro" && (
            <p className="mt-4 text-sm text-zinc-400">
              <span className="font-medium text-zinc-200">{user.credits}</span> credits
              remaining
            </p>
          )}

          {user.plan === "pro" && (
            <p className="mt-4 text-sm text-emerald-400">Unlimited exports</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/pricing"
            className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-medium text-zinc-950 hover:bg-amber-300"
          >
            View plans
          </Link>
          <Link
            href="/downloads"
            className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium hover:bg-zinc-800"
          >
            My downloads
          </Link>
          {user.plan !== "free" && (
            <button
              type="button"
              onClick={openBillingPortal}
              disabled={portalLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium hover:bg-zinc-800 disabled:opacity-60"
            >
              <CreditCard className="h-4 w-4" />
              {portalLoading ? "Opening..." : "Manage billing"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

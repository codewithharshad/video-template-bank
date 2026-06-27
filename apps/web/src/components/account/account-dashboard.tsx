"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserProfile } from "@clerk/nextjs";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Coins,
  Crown,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { useCatalog } from "@/components/catalog-provider";
import {
  AccountSidebar,
  type AccountSection,
} from "@/components/account/account-sidebar";
import { clerkProfileAppearance } from "@/lib/auth/clerk-appearance";
import { PLANS } from "@/lib/payments/plans";
import { isAuthEnabled } from "@/lib/auth/clerk-config";

function PlanBadge({ plan }: { plan: "free" | "creator" | "pro" }) {
  if (plan === "pro") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-semibold text-amber-200">
        <Crown className="h-3.5 w-3.5" />
        Pro
      </span>
    );
  }

  if (plan === "creator") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-400/15 px-2.5 py-1 text-xs font-semibold text-sky-200">
        <Sparkles className="h-3.5 w-3.5" />
        Creator
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-300">
      Free
    </span>
  );
}

function OverviewSection({
  checkoutSuccess,
}: {
  checkoutSuccess: boolean;
}) {
  const { user } = useCatalog();
  if (!user) return null;

  const plan = PLANS[user.plan];

  return (
    <div className="space-y-6">
      {checkoutSuccess && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <div>
            <p className="font-medium text-emerald-100">Payment received</p>
            <p className="mt-1 text-emerald-200/80">
              Your plan should update within a minute. Refresh if it still shows Free.
            </p>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">Signed in as</p>
            <p className="mt-1 text-lg font-semibold text-zinc-100">
              {user.name || user.email}
            </p>
            {user.name && (
              <p className="mt-0.5 text-sm text-zinc-500">{user.email}</p>
            )}
          </div>
          <PlanBadge plan={user.plan} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Current plan
            </p>
            <p className="mt-2 text-2xl font-bold capitalize">{plan.name}</p>
            <p className="mt-1 text-sm text-zinc-400">{plan.description}</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {user.plan === "pro" ? "Exports" : "Credits"}
            </p>
            <div className="mt-2 flex items-center gap-2">
              {user.plan === "pro" ? (
                <>
                  <Crown className="h-6 w-6 text-amber-400" />
                  <p className="text-2xl font-bold text-emerald-400">Unlimited</p>
                </>
              ) : (
                <>
                  <Coins className="h-6 w-6 text-amber-400" />
                  <p className="text-2xl font-bold">{user.credits}</p>
                </>
              )}
            </div>
            <p className="mt-1 text-sm text-zinc-400">
              {user.plan === "pro"
                ? "Export as much as you need"
                : "Remaining export credits"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/templates"
          className="glass group flex items-center justify-between rounded-2xl p-5 transition-colors hover:border-amber-500/30"
        >
          <div>
            <p className="font-medium text-zinc-100">Browse templates</p>
            <p className="mt-1 text-sm text-zinc-500">
              Customize and export motion graphics
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-400" />
        </Link>

        <Link
          href="/downloads"
          className="glass group flex items-center justify-between rounded-2xl p-5 transition-colors hover:border-amber-500/30"
        >
          <div>
            <p className="font-medium text-zinc-100">My downloads</p>
            <p className="mt-1 text-sm text-zinc-500">
              Re-download your saved exports
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-400" />
        </Link>
      </div>
    </div>
  );
}

function ProfileSection() {
  if (!isAuthEnabled()) {
    return (
      <p className="text-sm text-zinc-400">
        Profile settings are unavailable when auth is disabled.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Profile & security</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Update your name, email, password, and connected accounts.
        </p>
      </div>

      <div className="glass overflow-hidden rounded-2xl p-4 sm:p-6">
        <UserProfile
          appearance={clerkProfileAppearance}
          routing="hash"
        />
      </div>
    </div>
  );
}

function BillingSection() {
  const { user } = useCatalog();
  const [portalLoading, setPortalLoading] = useState(false);

  if (!user) return null;

  const currentPlan = PLANS[user.plan];

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Plan & billing</h2>
        <p className="mt-1 text-sm text-zinc-400">
          View your subscription, upgrade your plan, or manage payment methods.
        </p>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">Your plan</p>
            <p className="mt-1 text-2xl font-bold">{currentPlan.name}</p>
            <p className="mt-1 text-sm text-zinc-400">
              {currentPlan.price === 0
                ? "Free forever"
                : `$${currentPlan.price}/month`}
            </p>
          </div>
          <PlanBadge plan={user.plan} />
        </div>

        <ul className="mt-6 space-y-2.5">
          {currentPlan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-zinc-300">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          {user.plan !== "pro" && (
            <Link
              href="/pricing"
              className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-amber-300"
            >
              {user.plan === "free" ? "Upgrade plan" : "Change plan"}
            </Link>
          )}
          {user.plan !== "free" && (
            <button
              type="button"
              onClick={openBillingPortal}
              disabled={portalLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-800 disabled:opacity-60"
            >
              <CreditCard className="h-4 w-4" />
              {portalLoading ? "Opening..." : "Manage payment & invoices"}
            </button>
          )}
        </div>
      </div>

      {user.plan === "free" && (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-6 text-center">
          <Crown className="mx-auto h-8 w-8 text-amber-400/80" />
          <p className="mt-3 font-medium text-zinc-200">Unlock Pro templates & HD exports</p>
          <p className="mt-1 text-sm text-zinc-500">
            Creator and Pro plans include more credits, higher resolutions, and premium templates.
          </p>
          <Link
            href="/pricing"
            className="mt-4 inline-flex rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-amber-300"
          >
            Compare plans
          </Link>
        </div>
      )}
    </div>
  );
}

export function AccountDashboard() {
  const { user, refreshUser } = useCatalog();
  const [section, setSection] = useState<AccountSection>("overview");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") !== "success") return;

    setCheckoutSuccess(true);
    setSection("billing");
    void refreshUser();
    window.history.replaceState({}, "", "/account");
  }, [refreshUser]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as AccountSection;
    if (hash === "profile" || hash === "billing" || hash === "overview") {
      setSection(hash);
    }
  }, []);

  const handleNavigate = (next: AccountSection) => {
    setSection(next);
    window.history.replaceState(null, "", `#${next}`);
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="glass rounded-2xl p-8">
          <p className="text-sm text-zinc-400">Loading your account...</p>
        </div>
      </div>
    );
  }

  const sectionTitles: Record<AccountSection, string> = {
    overview: "Dashboard",
    profile: "Profile & security",
    billing: "Plan & billing",
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{sectionTitles[section]}</h1>
        <p className="mt-2 text-zinc-400">
          Manage your account, subscription, and security settings.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <AccountSidebar active={section} onNavigate={handleNavigate} />

        <div className="min-w-0 flex-1">
          {section === "overview" && (
            <OverviewSection checkoutSuccess={checkoutSuccess} />
          )}
          {section === "profile" && <ProfileSection />}
          {section === "billing" && <BillingSection />}
        </div>
      </div>
    </div>
  );
}

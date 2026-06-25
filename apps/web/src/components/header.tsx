"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, Sparkles, X } from "lucide-react";
import { isAuthEnabled } from "@/lib/auth/clerk-config";
import { useCatalog } from "@/components/catalog-provider";

function HeaderWithAuth() {
  const { user } = useCatalog();
  const ClerkHeader = require("@/components/header-clerk").HeaderClerkActions;
  return <ClerkHeader user={user} />;
}

type NavLink = { label: string; href: string; description?: string };

const templateLinks: NavLink[] = [
  { label: "All Templates", href: "/hooks", description: "Browse the full library" },
  { label: "Text Animation", href: "/hooks", description: "Kinetic type & titles" },
  { label: "Video Effects", href: "/effects", description: "Overlays & transitions" },
  { label: "Engagement Mockups", href: "/hooks", description: "Subscribe, comment, profile" },
  { label: "Data & Charts", href: "/hooks", description: "Animated flowcharts" },
];

const resourceLinks: NavLink[] = [
  { label: "Hooks Library", href: "/hooks" },
  { label: "Video Effects", href: "/effects" },
  { label: "Pricing", href: "/pricing" },
  { label: "Downloads", href: "/downloads" },
];

function NavDropdown({ label, links }: { label: string; links: NavLink[] }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
      </button>
      <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl shadow-black/60">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex flex-col gap-0.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-amber-500/10"
            >
              <span className="text-sm font-medium text-zinc-100">
                {link.label}
              </span>
              {link.description && (
                <span className="text-xs text-zinc-500">{link.description}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const authEnabled = isAuthEnabled();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 rounded-full border border-zinc-800/80 bg-zinc-950/70 px-4 shadow-lg shadow-black/20 backdrop-blur-xl sm:px-5">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Anim<span className="gradient-text">ably</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <NavDropdown label="Templates" links={templateLinks} />
            {authEnabled && (
              <Link
                href="/pricing"
                className="py-2 text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Pricing
              </Link>
            )}
            <NavDropdown label="Resources" links={resourceLinks} />
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {authEnabled ? <HeaderWithAuth /> : (
            <Link
              href="/hooks"
              className="hidden rounded-full bg-amber-400 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-amber-300 sm:block"
            >
              Try for free
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 text-zinc-300 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mx-auto mt-2 max-w-5xl rounded-2xl border border-zinc-800/80 bg-zinc-950/95 p-4 shadow-lg shadow-black/20 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {[...templateLinks, ...resourceLinks]
              .filter(
                (link, i, arr) =>
                  arr.findIndex((l) => l.label === link.label) === i,
              )
              .map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
          </nav>
        </div>
      )}
    </header>
  );
}

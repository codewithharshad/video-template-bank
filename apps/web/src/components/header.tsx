"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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
  { label: "All Templates", href: "/templates", description: "Browse the full library" },
  {
    label: "Text Animation",
    href: "/templates?category=text-animation",
    description: "Kinetic type & titles",
  },
  {
    label: "Engagement Mockups",
    href: "/templates?category=engagement-mockup",
    description: "Subscribe, comment, profile",
  },
  {
    label: "Subscribe & Social",
    href: "/templates?category=subscribe-banner,comment-popup,chat-mockup",
    description: "Social overlays & banners",
  },
  {
    label: "Data & Charts",
    href: "/templates?category=animated-flowchart",
    description: "Animated flowcharts",
  },
  {
    label: "Transitions",
    href: "/templates?category=transitions",
    description: "Scene transitions & motion",
  },
];

const resourceLinks: NavLink[] = [
  { label: "What's New", href: "/templates?sort=newest" },
  { label: "Pricing", href: "/pricing" },
  { label: "Account", href: "/account" },
  { label: "Downloads", href: "/downloads" },
];

function NavDropdown({
  label,
  links,
  open,
  onToggle,
  onClose,
}: {
  label: string;
  links: NavLink[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={onToggle}
        className="flex items-center gap-1 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl shadow-black/60">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
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
      )}
    </div>
  );
}

export function Header() {
  const authEnabled = isAuthEnabled();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const closeDropdown = useCallback(() => setOpenDropdown(null), []);

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
            <NavDropdown
              label="Templates"
              links={templateLinks}
              open={openDropdown === "templates"}
              onToggle={() =>
                setOpenDropdown((d) => (d === "templates" ? null : "templates"))
              }
              onClose={closeDropdown}
            />
            {authEnabled && (
              <Link
                href="/pricing"
                className="py-2 text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Pricing
              </Link>
            )}
            <NavDropdown
              label="Resources"
              links={resourceLinks}
              open={openDropdown === "resources"}
              onToggle={() =>
                setOpenDropdown((d) => (d === "resources" ? null : "resources"))
              }
              onClose={closeDropdown}
            />
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {authEnabled ? (
            <HeaderWithAuth />
          ) : (
            <Link
              href="/templates"
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
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mx-auto mt-2 max-w-5xl rounded-2xl border border-zinc-800/80 bg-zinc-950/95 p-4 shadow-lg shadow-black/20 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Browse
            </p>
            {templateLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Resources
            </p>
            {resourceLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            {!authEnabled && (
              <Link
                href="/templates"
                onClick={() => setMobileOpen(false)}
                className="mt-3 rounded-full bg-amber-400 px-4 py-2.5 text-center text-sm font-medium text-zinc-950 transition-colors hover:bg-amber-300"
              >
                Try for free
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

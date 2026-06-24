"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { isAuthEnabled } from "@/lib/auth/clerk-config";
import { useCatalog } from "@/components/catalog-provider";

function HeaderWithAuth() {
  const { user } = useCatalog();
  const ClerkHeader = require("@/components/header-clerk").HeaderClerkActions;
  return <ClerkHeader user={user} />;
}

export function Header() {
  const authEnabled = isAuthEnabled();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Hook<span className="gradient-text">Forge</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          <Link href="/hooks" className="transition-colors hover:text-white">
            Hooks
          </Link>
          <Link href="/effects" className="transition-colors hover:text-white">
            Video Effects
          </Link>
          <Link
            href="/hyperframes"
            className="transition-colors hover:text-white"
          >
            HyperFrames
          </Link>
          {authEnabled && (
            <Link href="/pricing" className="transition-colors hover:text-white">
              Pricing
            </Link>
          )}
        </nav>

        {authEnabled ? <HeaderWithAuth /> : <div className="w-8" />}
      </div>
    </header>
  );
}

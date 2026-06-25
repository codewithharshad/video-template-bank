"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Coins, Crown } from "lucide-react";

interface UserProfile {
  id: string;
  credits: number;
  plan: "free" | "creator" | "pro";
  role: "user" | "admin";
}

export function HeaderClerkActions({ user }: { user: UserProfile | null }) {
  return (
    <div className="flex items-center gap-3">
      <SignedIn>
        {user && (
          <div className="hidden items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs sm:flex">
            {user.plan === "pro" ? (
              <>
                <Crown className="h-3.5 w-3.5 text-amber-400" />
                <span className="font-medium text-amber-200">Pro</span>
              </>
            ) : (
              <>
                <Coins className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-zinc-300">{user.credits} credits</span>
              </>
            )}
          </div>
        )}
        <Link
          href="/downloads"
          className="hidden text-sm text-zinc-400 transition-colors hover:text-white sm:block"
        >
          Downloads
        </Link>
        {user?.role === "admin" && (
          <Link
            href="/admin"
            className="hidden text-sm text-zinc-400 transition-colors hover:text-white sm:block"
          >
            Admin
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <button
            type="button"
            className="hidden text-sm text-zinc-400 transition-colors hover:text-white sm:block"
          >
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button
            type="button"
            className="rounded-full bg-amber-400 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-amber-300"
          >
            Try free
          </button>
        </SignUpButton>
      </SignedOut>
    </div>
  );
}

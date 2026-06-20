"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { isAuthEnabled } from "@/lib/auth/clerk-config";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!isAuthEnabled()) {
    return <>{children}</>;
  }

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return <>{children}</>;
  }

  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}

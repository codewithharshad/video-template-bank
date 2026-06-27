"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { isAuthEnabled } from "@/lib/auth/clerk-config";
import { clerkAppearance } from "@/lib/auth/clerk-appearance";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!isAuthEnabled()) {
    return <>{children}</>;
  }

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={clerkAppearance}
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in"}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up"}
      afterSignInUrl="/templates"
      afterSignUpUrl="/templates"
    >
      {children}
    </ClerkProvider>
  );
}

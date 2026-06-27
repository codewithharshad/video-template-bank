import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { isAuthEnabled } from "@/lib/auth/clerk-config";
import { clerkAuthFormAppearance } from "@/lib/auth/clerk-auth-appearance";

export default function SignInPage() {
  if (!isAuthEnabled()) {
    redirect("/");
  }

  return (
    <AuthPageShell mode="sign-in">
      <SignIn
        appearance={clerkAuthFormAppearance}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
      />
    </AuthPageShell>
  );
}

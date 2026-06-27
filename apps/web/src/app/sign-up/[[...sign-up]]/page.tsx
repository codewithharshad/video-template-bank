import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { isAuthEnabled } from "@/lib/auth/clerk-config";
import { clerkAuthFormAppearance } from "@/lib/auth/clerk-auth-appearance";

export default function SignUpPage() {
  if (!isAuthEnabled()) {
    redirect("/");
  }

  return (
    <AuthPageShell mode="sign-up">
      <SignUp
        appearance={clerkAuthFormAppearance}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
      />
    </AuthPageShell>
  );
}

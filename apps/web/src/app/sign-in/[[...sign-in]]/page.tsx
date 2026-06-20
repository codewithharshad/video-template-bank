import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { isAuthEnabled } from "@/lib/auth/clerk-config";

export default function SignInPage() {
  if (!isAuthEnabled()) {
    redirect("/");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <SignIn />
    </div>
  );
}

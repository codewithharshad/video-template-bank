import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

const perks = [
  "20 free credits on signup",
  "Live preview with your brand kit",
  "Export WebM, MP4, and MOV",
  "No After Effects required",
];

interface AuthPageShellProps {
  mode: "sign-in" | "sign-up";
  children: React.ReactNode;
}

export function AuthPageShell({ mode, children }: AuthPageShellProps) {
  const isSignIn = mode === "sign-in";

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-yellow-500/5 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col items-center justify-center px-4 py-10 sm:px-6 lg:flex-row lg:items-stretch lg:gap-12 lg:py-16">
        <div className="mb-10 flex max-w-md flex-col justify-center lg:mb-0 lg:flex-1">
          <Link href="/" className="mb-8 inline-flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Anim<span className="gradient-text">ably</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {isSignIn ? "Welcome back" : "Start creating for free"}
          </h1>
          <p className="mt-3 text-zinc-400">
            {isSignIn
              ? "Sign in to access your templates, credits, and saved exports."
              : "Join thousands of creators making viral motion graphics in seconds."}
          </p>

          <ul className="mt-8 space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                  <Check className="h-3 w-3 text-emerald-400" />
                </span>
                {perk}
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm text-zinc-500">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
            <Link
              href={isSignIn ? "/sign-up" : "/sign-in"}
              className="font-medium text-amber-400 transition-colors hover:text-amber-300"
            >
              {isSignIn ? "Sign up free" : "Sign in"}
            </Link>
          </p>
        </div>

        <div className="flex w-full max-w-md flex-col justify-center lg:max-w-[28rem]">
          <div className="glass rounded-2xl p-1 shadow-2xl shadow-black/40">
            <div className="rounded-xl bg-zinc-950/60 p-4 sm:p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

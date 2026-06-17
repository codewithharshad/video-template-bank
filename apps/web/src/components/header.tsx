import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Header() {
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
          <span className="text-zinc-600">Pricing</span>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/hooks"
            className="hidden text-sm text-zinc-400 transition-colors hover:text-white sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/hooks"
            className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
          >
            Try free
          </Link>
        </div>
      </div>
    </header>
  );
}

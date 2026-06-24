import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Layers,
  Palette,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant preview",
    description:
      "Customize text, colors, and data — see your hook animate live in under 300ms.",
  },
  {
    icon: Palette,
    title: "Brand kit",
    description:
      "Set your colors once. Every template auto-applies your brand identity.",
  },
  {
    icon: Layers,
    title: "Alpha export",
    description:
      "Export WebM with transparency. Drop directly into Premiere, DaVinci, or CapCut.",
  },
  {
    icon: TrendingUp,
    title: "Viral-ready styles",
    description:
      "Hormozi, Johnny Harris, Vox, SaaS — creator aesthetics that actually convert.",
  },
];

const stats = [
  { value: "30+", label: "Templates & effects" },
  { value: "<3s", label: "Avg overlay length" },
  { value: "0", label: "After Effects needed" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800/50">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-[300px] w-[400px] rounded-full bg-fuchsia-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
              <Sparkles className="h-4 w-4" />
              Motion graphics, 100x faster
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl sm:leading-tight">
              Viral hooks that{" "}
              <span className="gradient-text">stop the scroll</span>
            </h1>

            <p className="mt-6 text-lg text-zinc-400 sm:text-xl">
              Browse viral hooks and social media overlays — subscribe banners,
              comment popups, profile cards. Customize and export with alpha transparency.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/effects"
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-8 py-3.5 font-medium text-white transition-colors hover:bg-violet-500"
              >
                Browse video effects
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/hooks"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-8 py-3.5 font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
              >
                Browse hooks
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-zinc-800/50 pt-10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold">Why creators switch to HookForge</h2>
          <p className="mt-3 text-zinc-400">
            AutoAE exports clips. We export clips that fit your workflow.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass rounded-2xl p-6 transition-colors hover:border-violet-500/20"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20">
                <feature.icon className="h-5 w-5 text-violet-400" />
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HyperFrames */}
      <section className="border-t border-zinc-800/50 bg-zinc-900/20">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-300">
                <Code2 className="h-4 w-4" />
                New — HyperFrames
              </div>
              <h2 className="text-3xl font-bold">
                Compose videos with{" "}
                <span className="bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">
                  HTML &amp; CSS
                </span>
              </h2>
              <p className="mt-4 text-zinc-400">
                Write HTML, animate with GSAP, render to MP4. Browse example
                compositions, preview live in the browser, and download source
                files to remix in your own projects.
              </p>
              <Link
                href="/hyperframes"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-3.5 font-medium text-zinc-950 transition-colors hover:bg-amber-400"
              >
                Explore HyperFrames
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Kinetic Type", color: "from-orange-500/20 to-amber-500/10" },
                { label: "Data Chart", color: "from-amber-600/20 to-orange-500/10" },
                { label: "Product Promo", color: "from-violet-500/20 to-purple-500/10" },
                { label: "Code Reveal", color: "from-cyan-500/20 to-blue-500/10" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex aspect-video items-end rounded-xl border border-zinc-800 bg-gradient-to-br ${item.color} p-4`}
                >
                  <span className="text-sm font-medium text-zinc-300">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-bold">Ready to forge your first hook?</h2>
          <p className="mt-3 text-zinc-400">
            Free templates available. No credit card required.
          </p>
          <Link
            href="/effects"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-violet-600 px-8 py-3.5 font-medium text-white transition-colors hover:bg-violet-500"
          >
            Open video effects library
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

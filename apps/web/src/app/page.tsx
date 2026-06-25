import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Download,
  MousePointerClick,
  Quote,
  Search,
  Sparkles,
  Type,
  Wand2,
} from "lucide-react";
import { FeaturedTemplates } from "@/components/featured-templates";

const steps = [
  {
    number: "1",
    icon: Wand2,
    title: "Generate your hook with AI",
    description:
      "Type your script or describe what you need — we instantly match you with the perfect motion graphic, from kinetic text to device mockups and more.",
  },
  {
    number: "2",
    icon: MousePointerClick,
    title: "Make it yours in a few clicks",
    description:
      "Replace text, change colors, drop in your images — see a live preview instantly. No complex timeline. No keyframes. Just your style, ready to go.",
  },
  {
    number: "3",
    icon: Download,
    title: "Download & post — done!",
    description:
      "Export WebM with alpha transparency. Post instantly or drop it into Premiere, DaVinci, or CapCut for a pro-level finish.",
  },
];

const categories = [
  {
    icon: Type,
    title: "Text Animation",
    description:
      "Capture attention fast with dynamic text and clear messaging — customize effects just like the pros.",
    href: "/hooks",
  },
  {
    icon: Boxes,
    title: "Engagement Mockup",
    description:
      "Showcase your product in a realistic setting, making it easy for your audience to picture themselves using it.",
    href: "/hooks",
  },
  {
    icon: Sparkles,
    title: "3D Transformation",
    description:
      "Add depth and realism with 3D transformations that make your content stand out from the feed.",
    href: "/effects",
  },
  {
    icon: Search,
    title: "Web Search",
    description:
      "Create a realistic web-search experience that helps your audience understand complex topics simply.",
    href: "/hooks",
  },
  {
    icon: BarChart3,
    title: "Video Flowchart",
    description:
      "Visualize ideas with animated flowcharts that make complex concepts easy to understand and follow.",
    href: "/hooks",
  },
];

const updates = [
  {
    count: "5 hooks added",
    when: "9 hours ago",
    blurb:
      "Five new ways to make context arrive as a scene: a corkboard, a ripped note, a decision map, a mood switch, and more.",
  },
  {
    count: "11 hooks added",
    when: "10 days ago",
    blurb:
      "The first three seconds are the whole negotiation. This 11-piece drop is built around that tiny window before someone swipes.",
  },
  {
    count: "12 hooks added",
    when: "13 days ago",
    blurb:
      "A 12-pack built for the side of the internet where markets move fast and product demos need polish.",
  },
];

const testimonials = [
  {
    name: "Isaac",
    role: "YouTuber",
    quote:
      "It's amazing! I've been researching to make something similar, but you already did something close to what's in my mind.",
  },
  {
    name: "Said Aitmbarek",
    role: "Founder of Microlaunch",
    quote:
      "Such an exciting release, congrats! Can't wait to play with all these hook effects for my next tools.",
  },
  {
    name: "Andreas Sohns",
    role: "Founder @Gleans",
    quote:
      "I love the ability to create viral text transitions with dynamic effects. Really fantastic for making videos stand out.",
  },
  {
    name: "Zenda",
    role: "Co-founder @LinkedCRM AI",
    quote:
      "The most practical video production tool I've seen recently. It really helps me improve efficiency on YouTube videos.",
  },
  {
    name: "Tony Han",
    role: "Product Manager",
    quote:
      "Sometimes the best way to hook the audience is graphics. This could be powerful for creators to spice up their content.",
  },
  {
    name: "Zandex",
    role: "Full-time Video Editor",
    quote:
      "This feels like a cheat code for video editors. The product is 100% solid — a lot of editors edit in CapCut.",
  },
  {
    name: "Victoriia Sazonenko",
    role: "Operations",
    quote:
      "The easiest way to make viral hooks like top creators. Perfect for anyone looking to create content that stands out.",
  },
  {
    name: "David",
    role: "Cofounder of ReadFlow",
    quote:
      "A great hook is the key to going viral, and this nails it. It transforms an ordinary idea into something with massive potential.",
  },
];

const stats = [
  { value: "120K+", label: "Creators trust Animably" },
  { value: "30+", label: "Templates & effects" },
  { value: "<3s", label: "Average overlay length" },
  { value: "0", label: "After Effects needed" },
];

function TestimonialCard({
  name,
  role,
  quote,
}: {
  name: string;
  role: string;
  quote: string;
}) {
  return (
    <div className="glass flex w-80 shrink-0 flex-col gap-4 rounded-2xl p-6">
      <Quote className="h-5 w-5 text-amber-400" />
      <p className="text-sm leading-relaxed text-zinc-300">{quote}</p>
      <div className="mt-auto flex items-center gap-3 pt-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 text-sm font-semibold text-white">
          {name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-medium text-white">{name}</div>
          <div className="text-xs text-zinc-500">{role}</div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const marqueeRowOne = testimonials.slice(0, 4);
  const marqueeRowTwo = testimonials.slice(4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800/50">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-amber-600/15 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-[320px] w-[420px] rounded-full bg-yellow-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-300">
              <Sparkles className="h-4 w-4" />
              AI motion graphics designer
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl sm:leading-tight">
              Create viral animations{" "}
              <span className="gradient-text">in seconds</span>
            </h1>

            <p className="mt-6 text-lg text-zinc-400 sm:text-xl">
              No editing. Just click, customize, and post. Browse top
              creator-designed hooks and overlays — customize and export with
              alpha transparency.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/hooks"
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-8 py-3.5 font-medium text-zinc-950 transition-colors hover:bg-amber-300"
              >
                Create free animations now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/effects"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-8 py-3.5 font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
              >
                Browse all templates
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="flex -space-x-2">
                {["A", "M", "J", "S", "V"].map((initial) => (
                  <div
                    key={initial}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-950 bg-gradient-to-br from-amber-500 to-yellow-500 text-[10px] font-semibold text-white"
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <span className="text-sm text-zinc-500">
                Trusted by 120K+ creators
              </span>
            </div>
          </div>

          {/* Featured template strip */}
          <div className="mt-16">
            <FeaturedTemplates count={5} />
          </div>
        </div>
      </section>

      {/* Value prop */}
      <section className="border-b border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
          <h2 className="mx-auto max-w-3xl text-3xl font-bold sm:text-4xl">
            Animations make your videos look pro —{" "}
            <span className="gradient-text">instantly</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Whether it's a tutorial, a product review, or a motivational video,
            animations turn plain clips into can't-skip content — and Animably
            makes it fast and effortless.
          </p>

          <div className="mt-14 grid grid-cols-2 gap-8 border-t border-zinc-800/50 pt-12 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-white sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Customize viral animations with clicks
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
              Don't let editing slow you down. With top creator-designed
              templates, Animably keeps you ahead of social media trends.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="glass relative rounded-2xl p-8 transition-colors hover:border-amber-500/20"
              >
                <div className="absolute right-6 top-6 text-5xl font-bold text-zinc-800">
                  {step.number}
                </div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600/20">
                  <step.icon className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid CTA */}
      <section className="border-b border-zinc-800/50">
        <div className="relative mx-auto max-w-7xl overflow-hidden px-4 py-24 sm:px-6">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-600/10 blur-3xl" />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              The fastest way to make your videos look pro
            </h2>
            <p className="mt-4 text-zinc-400">
              No more frustration. No more complex software. Make your first
              animation now and see your content level up today.
            </p>
            <Link
              href="/hooks"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-8 py-3.5 font-medium text-zinc-950 transition-colors hover:bg-amber-300"
            >
              Create free animations now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              How to post like top creators
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
              It's not just the camera — it's the motion design that turns plain
              clips into something unforgettable. Animably gives you that power
              in minutes.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="glass group flex flex-col rounded-2xl p-6 transition-colors hover:border-amber-500/30"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-600/20">
                  <category.icon className="h-5 w-5 text-amber-400" />
                </div>
                <h3 className="flex items-center gap-2 font-semibold">
                  {category.title}
                  <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly updates */}
      <section className="border-b border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Animations update weekly
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
              Master the trends with effortless motion effects. New pro designs
              drop every week to keep you ahead of the game.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {updates.map((update) => (
              <div
                key={update.count}
                className="glass flex flex-col rounded-2xl p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
                    {update.count}
                  </span>
                  <span className="text-xs text-zinc-500">{update.when}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                  {update.blurb}
                </p>
                <Link
                  href="/hooks"
                  className="mt-4 inline-flex items-center gap-1 text-sm text-amber-400 transition-colors hover:text-amber-300"
                >
                  Read more
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="overflow-hidden border-b border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Testimonials</h2>
            <p className="mt-3 text-zinc-400">
              100% real feedback. Zero paid promotions. All thanks to our users.
            </p>
          </div>
        </div>

        <div className="marquee-paused flex flex-col gap-6">
          <div className="mask-fade-x flex w-full overflow-hidden">
            <div className="marquee-track flex shrink-0 gap-6 pr-6">
              {[...marqueeRowOne, ...marqueeRowOne].map((t, i) => (
                <TestimonialCard key={`row1-${i}`} {...t} />
              ))}
            </div>
          </div>
          <div className="mask-fade-x flex w-full overflow-hidden">
            <div className="marquee-track-slow flex shrink-0 gap-6 pr-6">
              {[...marqueeRowTwo, ...marqueeRowTwo].map((t, i) => (
                <TestimonialCard key={`row2-${i}`} {...t} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-600/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-28 text-center sm:px-6">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
            In real use by million-follower creators
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Transform raw footage, images, or ideas into high-quality videos
            with motion design.
          </p>
          <Link
            href="/hooks"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-8 py-3.5 font-medium text-zinc-950 transition-colors hover:bg-amber-300"
          >
            Create free animations now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

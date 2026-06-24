"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  ExternalLink,
  Search,
  Sparkles,
  Terminal,
} from "lucide-react";
import {
  HYPERFRAMES_CATEGORIES,
  HYPERFRAMES_EXAMPLES,
  type HyperFramesCategory,
} from "@/lib/hyperframes-catalog";
import { HyperFramesCard } from "@/components/hyperframes-card";

const ALL_CATEGORIES = "all" as const;
type CategoryFilter = HyperFramesCategory | typeof ALL_CATEGORIES;

export default function HyperFramesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>(ALL_CATEGORIES);

  const filtered = useMemo(() => {
    return HYPERFRAMES_EXAMPLES.filter((example) => {
      const matchesCategory =
        category === ALL_CATEGORIES || example.category === category;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        example.name.toLowerCase().includes(q) ||
        example.description.toLowerCase().includes(q) ||
        example.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <div>
      {/* Hero — distinct amber/cyan theme */}
      <section className="relative overflow-hidden border-b border-zinc-800/50">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[400px] w-[600px] rounded-full bg-amber-500/8 blur-3xl" />
          <div className="absolute right-1/4 top-1/3 h-[300px] w-[500px] rounded-full bg-cyan-500/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-300">
                <Code2 className="h-4 w-4" />
                Powered by{" "}
                <a
                  href="https://hyperframes.heygen.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline decoration-amber-500/40 underline-offset-2 hover:text-amber-200"
                >
                  HyperFrames
                </a>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Edit videos by{" "}
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 bg-clip-text text-transparent">
                  writing HTML
                </span>
              </h1>

              <p className="mt-4 text-lg text-zinc-400">
                Compose videos with HTML, CSS, and GSAP — then render to
                transparent MOV or MP4. Browse examples, preview live, and
                download compositions to remix in your own projects.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="https://hyperframes.heygen.com/quickstart"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-medium text-zinc-950 transition-colors hover:bg-amber-400"
              >
                Get started
                <ExternalLink className="h-4 w-4" />
              </a>
              <Link
                href="#examples"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700 px-6 py-3 font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
              >
                Browse examples
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CLI quick start */}
      <section className="border-b border-zinc-800/50 bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                icon: Terminal,
                title: "Install CLI",
                code: "npx hyperframes init my-video",
              },
              {
                step: "2",
                icon: Sparkles,
                title: "Preview live",
                code: "npx hyperframes preview",
              },
              {
                step: "3",
                icon: Code2,
                title: "Render MP4",
                code: "npx hyperframes render --output out.mp4",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">
                    {item.step}
                  </span>
                  <item.icon className="h-4 w-4 text-zinc-500" />
                  <span className="font-medium">{item.title}</span>
                </div>
                <code className="block rounded-lg bg-zinc-900 px-3 py-2 text-xs text-zinc-400">
                  {item.code}
                </code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples grid */}
      <section id="examples" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Example compositions</h2>
            <p className="mt-1 text-sm text-zinc-400">
              {filtered.length} of {HYPERFRAMES_EXAMPLES.length} examples
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              placeholder="Search examples..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-2 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-amber-500/50 focus:outline-none sm:w-64"
            />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory(ALL_CATEGORIES)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              category === ALL_CATEGORIES
                ? "bg-amber-500/20 text-amber-300"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            All
          </button>
          {(
            Object.entries(HYPERFRAMES_CATEGORIES) as [
              HyperFramesCategory,
              { label: string; color: string },
            ][]
          ).map(([key, { label }]) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                category === key
                  ? "bg-amber-500/20 text-amber-300"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 py-20 text-center">
            <p className="text-zinc-400">No examples match your search.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory(ALL_CATEGORIES);
              }}
              className="mt-3 text-sm text-amber-400 hover:text-amber-300"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((example) => (
              <HyperFramesCard key={example.slug} example={example} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

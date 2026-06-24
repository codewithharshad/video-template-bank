import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Monitor, Tag } from "lucide-react";
import {
  getHyperFramesExample,
  getCompositionSrc,
  HYPERFRAMES_CATEGORIES,
  HYPERFRAMES_EXAMPLES,
} from "@/lib/hyperframes-catalog";
import { HyperFramesPlayer } from "@/components/hyperframes-player";
import { HyperFramesDownloadPanel } from "@/components/hyperframes-download-panel";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return HYPERFRAMES_EXAMPLES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const example = getHyperFramesExample(slug);
  if (!example) return { title: "Not found" };
  return {
    title: `${example.name} — HyperFrames — HookForge`,
    description: example.description,
  };
}

export default async function HyperFramesDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const example = getHyperFramesExample(slug);
  if (!example) notFound();

  const category = HYPERFRAMES_CATEGORIES[example.category];
  const src = getCompositionSrc(example.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link
        href="/hyperframes"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to HyperFrames
      </Link>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div
            className={`overflow-hidden rounded-2xl border border-zinc-800 ${
              example.transparentExport
                ? "bg-[length:16px_16px] bg-[position:0_0,8px_8px] bg-[image:linear-gradient(45deg,#27272a_25%,transparent_25%),linear-gradient(-45deg,#27272a_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#27272a_75%),linear-gradient(-45deg,transparent_75%,#27272a_75%)]"
                : "bg-zinc-950"
            }`}
          >
            <HyperFramesPlayer
              src={src}
              width={example.width}
              height={example.height}
              controls
              loop
            />
          </div>

          {example.transparentExport && (
            <p className="mt-2 text-xs text-zinc-500">
              Checkerboard shows through transparent areas — same alpha you get
              in the exported MOV.
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {example.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-zinc-800/80 px-3 py-1 text-xs text-zinc-400"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-6">
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: `${category.color}22`,
                color: category.color,
              }}
            >
              {category.label}
            </span>
            <h1 className="mt-3 text-3xl font-bold">{example.name}</h1>
            <p className="mt-2 text-zinc-400">{example.description}</p>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {example.duration}s
              </span>
              <span className="flex items-center gap-1.5">
                <Monitor className="h-4 w-4" />
                {example.width}×{example.height}
              </span>
              <span className="flex items-center gap-1.5">
                {example.format}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
            <HyperFramesDownloadPanel example={example} />
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold">Composition source</h2>
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5">
            <span className="font-mono text-xs text-zinc-500">
              compositions/{example.slug}.html
            </span>
            <a
              href={`/hyperframes/compositions/${example.slug}.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400 hover:text-amber-300"
            >
              Open raw HTML
            </a>
          </div>
          <iframe
            src={`/hyperframes/compositions/${example.slug}.html`}
            title={`${example.name} source preview`}
            className="h-[400px] w-full border-0"
            sandbox="allow-scripts"
          />
        </div>
      </section>
    </div>
  );
}

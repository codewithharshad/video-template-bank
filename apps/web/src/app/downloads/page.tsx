"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Film } from "lucide-react";
import type { Export } from "@video-lib/database";

export default function DownloadsPage() {
  const [exports, setExports] = useState<Export[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/exports");
        if (res.ok) {
          const data = (await res.json()) as { exports: Export[] };
          setExports(data.exports);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">My downloads</h1>
      <p className="mt-2 text-zinc-400">
        Re-download your saved exports anytime.
      </p>

      {loading ? (
        <p className="mt-8 text-zinc-500">Loading...</p>
      ) : exports.length === 0 ? (
        <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-zinc-800 py-16 text-center">
          <Film className="mb-4 h-10 w-10 text-zinc-600" />
          <p className="text-zinc-400">No saved exports yet.</p>
          <Link
            href="/effects"
            className="mt-4 text-sm text-amber-400 hover:text-amber-300"
          >
            Browse templates
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {exports.map((item) => (
            <div
              key={item.id}
              className="glass flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{item.templateName}</p>
                <p className="text-xs text-zinc-500">
                  {item.resolution} · {item.format} ·{" "}
                  {new Date(item.createdAt).toLocaleString()}
                  {item.creditsUsed > 0 && ` · ${item.creditsUsed} credits`}
                </p>
              </div>
              <a
                href={`/api/exports/${item.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-300"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

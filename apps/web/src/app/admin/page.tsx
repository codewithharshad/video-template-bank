"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Plus, Sparkles } from "lucide-react";
import type { CatalogTemplate } from "@video-lib/database";

export default function AdminPage() {
  const [templates, setTemplates] = useState<CatalogTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/admin/templates");
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          throw new Error(data.error ?? "Failed to load admin data.");
        }
        const data = (await res.json()) as { templates: CatalogTemplate[] };
        setTemplates(data.templates);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const published = templates.filter((t) => t.published).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-violet-400">
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-sm font-medium">Admin</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Template CMS</h1>
          <p className="mt-2 text-zinc-400">
            Publish new effects and hooks without redeploying code.
          </p>
        </div>
        <Link
          href="/admin/templates/new"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-500"
        >
          <Plus className="h-4 w-4" />
          New template
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="glass rounded-xl p-4">
          <p className="text-sm text-zinc-500">Total CMS templates</p>
          <p className="text-2xl font-bold">{templates.length}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-sm text-zinc-500">Published</p>
          <p className="text-2xl font-bold text-emerald-400">{published}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-sm text-zinc-500">Drafts</p>
          <p className="text-2xl font-bold">{templates.length - published}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-zinc-500">Loading templates...</p>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-800 py-16 text-center">
          <Sparkles className="mb-4 h-10 w-10 text-zinc-600" />
          <p className="text-zinc-400">No CMS templates yet.</p>
          <Link
            href="/admin/templates/new"
            className="mt-4 text-sm text-violet-400 hover:text-violet-300"
          >
            Create your first template
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/80 text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Composition</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id} className="border-t border-zinc-800/80">
                  <td className="px-4 py-3 font-medium">{template.name}</td>
                  <td className="px-4 py-3 text-zinc-400">{template.slug}</td>
                  <td className="px-4 py-3 text-zinc-400">{template.compositionId}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        template.published
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {template.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/templates/${template.id}`}
                      className="text-violet-400 hover:text-violet-300"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

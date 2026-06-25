"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CatalogTemplate } from "@video-lib/database";
import type { HookTemplate, PropField } from "@video-lib/template-sdk";

const DEFAULT_PROPS: PropField[] = [
  { key: "title", label: "Title", type: "text", defaultValue: "Hello world", maxLength: 60 },
  { key: "accentColor", label: "Accent", type: "color", defaultValue: "#6366f1" },
  { key: "backgroundColor", label: "Background", type: "color", defaultValue: "#0a0a0a" },
];

export function AdminTemplateForm({ initial }: { initial?: CatalogTemplate }) {
  const router = useRouter();
  const meta = (initial?.metadata ?? {}) as Partial<HookTemplate>;

  const [compositions, setCompositions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: initial?.slug ?? "",
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    templateKind: initial?.templateKind ?? "overlay",
    compositionId: initial?.compositionId ?? "",
    published: initial?.published ?? false,
    isPro: meta.isPro ?? false,
    isFree: meta.isFree ?? true,
    popularity: meta.popularity ?? 50,
    previewGradient: meta.previewGradient ?? "from-amber-500 to-yellow-600",
    width: meta.width ?? 1080,
    height: meta.height ?? 1920,
    durationInFrames: meta.durationInFrames ?? 90,
    fps: meta.fps ?? 30,
    orientation: meta.orientation ?? "portrait",
    overlayPlatform: meta.overlayPlatform ?? "youtube",
    propsJson: JSON.stringify(meta.props ?? DEFAULT_PROPS, null, 2),
    previewImageUrl: initial?.previewImageUrl ?? "",
  });

  useEffect(() => {
    void fetch("/api/admin/compositions")
      .then((r) => r.json())
      .then((d: { compositions: string[] }) => setCompositions(d.compositions));
  }, []);

  const update = (key: keyof typeof form, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const uploadPreview = async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await res.json()) as { url?: string; error?: string };
    if (data.url) update("previewImageUrl", data.url);
    else setError(data.error ?? "Upload failed.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    let props: PropField[];
    try {
      props = JSON.parse(form.propsJson) as PropField[];
    } catch {
      setError("Props JSON is invalid.");
      setSaving(false);
      return;
    }

    const payload = {
      slug: form.slug,
      name: form.name,
      description: form.description,
      templateKind: form.templateKind,
      compositionId: form.compositionId,
      published: form.published,
      previewImageUrl: form.previewImageUrl || undefined,
      durationInFrames: form.durationInFrames,
      fps: form.fps,
      width: form.width,
      height: form.height,
      orientation: form.orientation,
      isPro: form.isPro,
      isFree: form.isFree,
      popularity: form.popularity,
      previewGradient: form.previewGradient,
      overlayPlatform: form.overlayPlatform,
      categories: form.templateKind === "hook" ? ["text-animation"] : ["social-overlay"],
      visualStyles: ["minimal"],
      creatorStyles: ["viral-reels"],
      platforms: ["youtube", "tiktok", "instagram"],
      niches: ["social"],
      props,
    };

    try {
      const url = initial
        ? `/api/admin/templates/${initial.id}`
        : "/api/admin/templates";
      const method = initial ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Save failed.");

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
            className="input"
          />
        </Field>
        <Field label="Slug">
          <input
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            required
            pattern="[a-z0-9-]+"
            className="input"
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={3}
          className="input"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kind">
          <select
            value={form.templateKind}
            onChange={(e) => update("templateKind", e.target.value)}
            className="input"
          >
            <option value="overlay">Overlay / Effect</option>
            <option value="hook">Hook</option>
          </select>
        </Field>
        <Field label="Remotion composition">
          <select
            value={form.compositionId}
            onChange={(e) => update("compositionId", e.target.value)}
            required
            className="input"
          >
            <option value="">Select composition...</option>
            {compositions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Width">
          <input
            type="number"
            value={form.width}
            onChange={(e) => update("width", Number(e.target.value))}
            className="input"
          />
        </Field>
        <Field label="Height">
          <input
            type="number"
            value={form.height}
            onChange={(e) => update("height", Number(e.target.value))}
            className="input"
          />
        </Field>
        <Field label="Duration (frames)">
          <input
            type="number"
            value={form.durationInFrames}
            onChange={(e) => update("durationInFrames", Number(e.target.value))}
            className="input"
          />
        </Field>
      </div>

      <Field label="Props (JSON)">
        <textarea
          value={form.propsJson}
          onChange={(e) => update("propsJson", e.target.value)}
          rows={8}
          className="input font-mono text-xs"
        />
      </Field>

      <Field label="Preview image">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void uploadPreview(file);
          }}
          className="input"
        />
        {form.previewImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={form.previewImageUrl}
            alt="Preview"
            className="mt-2 h-24 rounded-lg object-cover"
          />
        )}
      </Field>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => update("published", e.target.checked)}
          />
          Published (visible in catalog)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isPro}
            onChange={(e) => update("isPro", e.target.checked)}
          />
          Pro template
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-medium text-zinc-950 hover:bg-amber-300 disabled:opacity-60"
        >
          {saving ? "Saving..." : initial ? "Update template" : "Create template"}
        </button>
        <Link
          href="/admin"
          className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium hover:bg-zinc-800"
        >
          Cancel
        </Link>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(39 39 42);
          background: rgb(24 24 27);
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        }
        .input:focus {
          outline: none;
          border-color: rgb(139 92 246);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm text-zinc-400">{label}</span>
      {children}
    </label>
  );
}

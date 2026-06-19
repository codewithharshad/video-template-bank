"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { AdminTemplateForm } from "@/components/admin-template-form";
import type { CatalogTemplate } from "@video-lib/database";

export default function EditAdminTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [template, setTemplate] = useState<CatalogTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`/api/admin/templates/${id}`);
        if (!res.ok) throw new Error("Failed to load template.");
        const data = (await res.json()) as { template: CatalogTemplate };
        setTemplate(data.template);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load.");
      }
    })();
  }, [id]);

  if (error) {
    return <p className="px-4 py-16 text-center text-red-400">{error}</p>;
  }

  if (!template) {
    return <p className="px-4 py-16 text-center text-zinc-500">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Edit template</h1>
      <AdminTemplateForm initial={template} />
    </div>
  );
}

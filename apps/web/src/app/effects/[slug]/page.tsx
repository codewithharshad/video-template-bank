"use client";

import { use } from "react";
import { TemplateEditor } from "@/components/template-editor";

export default function EffectEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <TemplateEditor
      slug={slug}
      backHref="/effects"
      backLabel="Back to effects"
    />
  );
}

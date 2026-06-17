"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getTemplateBySlug,
  getDefaultProps,
  applyBrandToProps,
  CATEGORY_LABELS,
  CREATOR_LABELS,
  type HookTemplate,
} from "@video-lib/template-sdk";
import { TemplatePreview } from "@/components/template-preview";
import { PropsEditor } from "@/components/props-editor";
import { ExportPanel } from "@/components/export-panel";
import { BrandKitPanel } from "@/components/brand-kit-panel";
import { useBrand } from "@/components/brand-provider";
import { withTransparentBackground } from "@/lib/transparent-export";

export function TemplateEditor({
  slug,
  backHref,
  backLabel,
}: {
  slug: string;
  backHref: string;
  backLabel: string;
}) {
  const template = getTemplateBySlug(slug);
  const { brand } = useBrand();

  const initialProps = useMemo(() => {
    if (!template) return null;
    return applyBrandToProps(template, getDefaultProps(template), brand);
  }, [template, brand]);

  const [props, setProps] = useState<Record<string, string | number> | null>(
    initialProps
  );
  const [transparentExport, setTransparentExport] = useState(
    () => template?.templateKind === "overlay"
  );

  useEffect(() => {
    if (template) {
      setProps(applyBrandToProps(template, getDefaultProps(template), brand));
      if (template.templateKind === "overlay") {
        setTransparentExport(true);
      }
    }
  }, [slug, template, brand]);

  if (!template || !props) {
    notFound();
  }

  const previewProps = transparentExport
    ? withTransparentBackground(props)
    : props;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <TemplateEditorHeader template={template} />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="glass flex min-h-[480px] items-center justify-center rounded-2xl p-6 sm:p-10">
          <div className="w-full max-w-sm">
            <TemplatePreview
              key={`${slug}-${transparentExport ? "alpha" : "solid"}`}
              template={template}
              inputProps={previewProps}
            />
          </div>
        </div>

        <div className="space-y-4">
          <PropsEditor template={template} props={props} onChange={setProps} />
          <BrandKitPanel />
          <ExportPanel
            template={template}
            inputProps={props}
            transparent={transparentExport}
            onTransparentChange={setTransparentExport}
          />
        </div>
      </div>
    </div>
  );
}

function TemplateEditorHeader({ template }: { template: HookTemplate }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold sm:text-3xl">{template.name}</h1>
      <p className="mt-1 text-zinc-400">{template.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {template.categories.map((cat) => (
          <span
            key={cat}
            className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400"
          >
            {CATEGORY_LABELS[cat]}
          </span>
        ))}
        {template.creatorStyles.map((style) => (
          <span
            key={style}
            className="rounded-md bg-violet-500/10 px-2.5 py-1 text-xs text-violet-300"
          >
            {CREATOR_LABELS[style]}
          </span>
        ))}
      </div>
    </div>
  );
}

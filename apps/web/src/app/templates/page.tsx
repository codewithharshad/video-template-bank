import { Suspense } from "react";
import { TemplateBrowsePage } from "@/components/template-browse-page";

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="mx-auto h-10 w-64 animate-pulse rounded-lg bg-zinc-800/80" />
            <div className="mx-auto mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-zinc-800/60" />
          </div>
        </div>
      }
    >
      <TemplateBrowsePage />
    </Suspense>
  );
}

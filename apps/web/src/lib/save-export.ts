import { downloadBlob } from "@/lib/export-props";

export async function saveBrowserExport(input: {
  blob: Blob;
  slug: string;
  format: string;
  resolution: "720p" | "1080p";
  transparent: boolean;
  inputProps: Record<string, string | number>;
  filename: string;
}) {
  const formData = new FormData();
  formData.append("file", input.blob, input.filename);
  formData.append("slug", input.slug);
  formData.append("format", input.format);
  formData.append("resolution", input.resolution);
  formData.append("transparent", String(input.transparent));
  formData.append("inputProps", JSON.stringify(input.inputProps));

  const res = await fetch("/api/exports/save", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? `Failed to save export (${res.status}).`);
  }

  const data = (await res.json()) as {
    downloadUrl: string;
    exportId: string;
  };

  downloadBlob(input.blob, input.filename);
  return data;
}

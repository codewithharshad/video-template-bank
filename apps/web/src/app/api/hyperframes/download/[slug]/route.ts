import { readFile } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { NextResponse } from "next/server";
import { getHyperFramesExample } from "@/lib/hyperframes-catalog";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const example = getHyperFramesExample(slug);

  if (!example) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const compositionPath = path.join(
    process.cwd(),
    "public",
    "hyperframes",
    "compositions",
    `${slug}.html`
  );

  let html: string;
  try {
    html = await readFile(compositionPath, "utf-8");
  } catch {
    return NextResponse.json(
      { error: "Composition file not found" },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");

  if (format === "project") {
    const meta = {
      name: example.name,
      description: example.description,
      width: example.width,
      height: example.height,
      fps: 30,
      duration: example.duration,
    };

    const zip = new JSZip();
    zip.file("meta.json", JSON.stringify(meta, null, 2));
    zip.file("index.html", html);
    zip.file(
      `compositions/${slug}.html`,
      html.replace("<!DOCTYPE html>", "").replace(/<\/?html[^>]*>/g, "").replace(/<\/?body[^>]*>/g, "").trim()
    );
    zip.file(
      "README.md",
      `# ${example.name}\n\n${example.description}\n\n## Render\n\n\`\`\`bash\nnpx hyperframes render --output ${slug}.mp4\n\`\`\`\n\n## Docs\n\nhttps://hyperframes.heygen.com/quickstart\n`
    );

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${slug}-project.zip"`,
      },
    });
  }

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.html"`,
    },
  });
}

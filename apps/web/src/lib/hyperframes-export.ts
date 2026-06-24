import { execFile, execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { getHyperFramesExample } from "@/lib/hyperframes-catalog";

const execFileAsync = promisify(execFile);

export interface HyperFramesExportResult {
  filePath: string;
  filename: string;
  width: number;
  height: number;
  transparent: boolean;
}

function resolveHyperframesCli(): string {
  const candidates = [
    path.join(process.cwd(), "node_modules/hyperframes/dist/cli.js"),
    path.join(process.cwd(), "../../node_modules/hyperframes/dist/cli.js"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error("HyperFrames CLI is not installed.");
}

function resolveBundledFfprobe(): string | null {
  const platform = `${process.platform}-${process.arch}`;
  const candidates = [
    path.join(process.cwd(), "node_modules/@ffprobe-installer", platform, "ffprobe"),
    path.join(process.cwd(), "../../node_modules/@ffprobe-installer", platform, "ffprobe"),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function resolveToolCommand(name: "ffmpeg" | "ffprobe"): string {
  const bundled =
    name === "ffprobe" ? resolveBundledFfprobe() : null;
  if (bundled) return bundled;

  const localBin = path.join(os.homedir(), ".local", "bin", name);
  if (existsSync(localBin)) return localBin;

  return name;
}

function toolEnv(): NodeJS.ProcessEnv {
  const pathDirs = new Set<string>(
    (process.env.PATH ?? "").split(path.delimiter).filter(Boolean)
  );
  pathDirs.add(path.join(os.homedir(), ".local", "bin"));

  for (const root of [
    path.join(process.cwd(), "node_modules/@ffprobe-installer"),
    path.join(process.cwd(), "../../node_modules/@ffprobe-installer"),
  ]) {
    const platform = `${process.platform}-${process.arch}`;
    const dir = path.join(root, platform);
    if (existsSync(dir)) pathDirs.add(dir);
  }

  return { ...process.env, PATH: [...pathDirs].join(path.delimiter) };
}

function toolWorks(command: string): boolean {
  try {
    execSync(`"${command}" -version`, { stdio: "ignore", env: toolEnv() });
    return true;
  } catch {
    return false;
  }
}

function compositionPath(slug: string): string {
  return path.join(
    process.cwd(),
    "public",
    "hyperframes",
    "compositions",
    `${slug}.html`
  );
}

export async function checkHyperFramesExportHealth(): Promise<{
  available: boolean;
  ffmpeg: boolean;
  ffprobe: boolean;
  message?: string;
}> {
  const ffmpeg = toolWorks(resolveToolCommand("ffmpeg"));
  if (!ffmpeg) {
    return {
      available: false,
      ffmpeg: false,
      ffprobe: false,
      message:
        "ffmpeg is not installed. Install with: brew install ffmpeg",
    };
  }

  const ffprobe = toolWorks(resolveToolCommand("ffprobe"));
  if (!ffprobe) {
    return {
      available: false,
      ffmpeg: true,
      ffprobe: false,
      message:
        "ffprobe is not installed (ships with ffmpeg). Install with: brew install ffmpeg",
    };
  }

  try {
    resolveHyperframesCli();
    return { available: true, ffmpeg: true, ffprobe: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "HyperFrames CLI not found.";
    return { available: false, ffmpeg, ffprobe, message };
  }
}

export async function renderHyperFramesMov(
  slug: string
): Promise<HyperFramesExportResult> {
  const health = await checkHyperFramesExportHealth();
  if (!health.available) {
    throw new Error(health.message ?? "HyperFrames export is not available.");
  }

  const example = getHyperFramesExample(slug);
  if (!example) {
    throw new Error(`Composition not found: ${slug}`);
  }

  const sourceHtml = compositionPath(slug);
  try {
    await fs.access(sourceHtml);
  } catch {
    throw new Error(`Composition file missing: ${slug}.html`);
  }

  const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "hf-export-"));
  const outputFilename = `hookforge-${slug}-transparent-${Date.now()}.mov`;
  const outputPath = path.join(workDir, outputFilename);

  try {
    await fs.copyFile(sourceHtml, path.join(workDir, "index.html"));
    await fs.writeFile(
      path.join(workDir, "meta.json"),
      JSON.stringify(
        {
          name: example.name,
          width: example.width,
          height: example.height,
          fps: 30,
          duration: example.duration,
        },
        null,
        2
      )
    );

    const cli = resolveHyperframesCli();
    await execFileAsync(
      process.execPath,
      [
        cli,
        "render",
        "--format",
        "mov",
        "--output",
        outputPath,
        "--workers",
        "1",
        "--quality",
        "standard",
      ],
      {
        cwd: workDir,
        env: toolEnv(),
        maxBuffer: 20 * 1024 * 1024,
        timeout: 240_000,
      }
    );

    await fs.access(outputPath);

    return {
      filePath: outputPath,
      filename: outputFilename,
      width: example.width,
      height: example.height,
      transparent: true,
    };
  } catch (error) {
    await fs.rm(workDir, { recursive: true, force: true }).catch(() => undefined);
    const message =
      error instanceof Error ? error.message : "HyperFrames render failed.";
    throw new Error(message);
  }
}

export async function readHyperFramesExportFile(filePath: string): Promise<Buffer> {
  return fs.readFile(filePath);
}

export async function deleteHyperFramesExportDir(filePath: string): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.rm(dir, { recursive: true, force: true }).catch(() => undefined);
}

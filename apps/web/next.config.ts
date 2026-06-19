import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@video-lib/template-sdk", "@video-lib/database"],
  outputFileTracingRoot: path.resolve(process.cwd(), "../.."),
  serverExternalPackages: [
    "@remotion/bundler",
    "@remotion/renderer",
    "esbuild",
  ],
};

export default nextConfig;

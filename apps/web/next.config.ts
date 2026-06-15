import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@video-lib/template-sdk"],
  outputFileTracingRoot: path.resolve(process.cwd(), "../.."),
};

export default nextConfig;

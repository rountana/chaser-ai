import type { NextConfig } from "next";

const isGhPages = process.env.GITHUB_PAGES === "true";
const repo = "chaser-ai";
const basePath = isGhPages ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;

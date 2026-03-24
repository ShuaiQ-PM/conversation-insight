import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserOrOrgPages = repository.endsWith(".github.io");
const basePath = isGithubActions && repository && !isUserOrOrgPages ? `/${repository}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

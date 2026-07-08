/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = "/kleinkunst-veranstalter-dashboard";

const nextConfig = {
  output: isGitHubPages ? "export" : "standalone",
  basePath: isGitHubPages ? githubPagesBasePath : undefined,
  assetPrefix: isGitHubPages ? `${githubPagesBasePath}/` : undefined,
  trailingSlash: isGitHubPages,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

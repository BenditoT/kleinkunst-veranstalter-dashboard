import { GITHUB_PAGES_BASE_PATH } from "./lib/config/site.mjs";

/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === "true";

// Sicherheits-Header (S7). Next.js' headers() greift nur im Node-Server-Build
// ("standalone") - bei output: "export" (GitHub Pages) wirft next build einen
// Fehler, wenn headers() gesetzt ist, weil ein statischer Host keine
// Response-Header über Next steuern kann. Deshalb nur für den
// Nicht-GitHub-Pages-Build aktiv; für die statische Seite müssten dieselben
// Header stattdessen am Hosting/CDN (z. B. Cloud Run, Reverse Proxy) gesetzt
// werden, sobald ein echter Server-Deploy dazukommt.
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  output: isGitHubPages ? "export" : "standalone",
  basePath: isGitHubPages ? GITHUB_PAGES_BASE_PATH : undefined,
  assetPrefix: isGitHubPages ? `${GITHUB_PAGES_BASE_PATH}/` : undefined,
  trailingSlash: isGitHubPages,
  images: {
    unoptimized: true,
  },
  ...(isGitHubPages
    ? {}
    : {
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;

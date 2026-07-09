import { defineConfig, devices } from "@playwright/test";

const port = process.env.PLAYWRIGHT_PORT ?? "4174";
const host = "127.0.0.1";
const basePath = "/kleinkunst-veranstalter-dashboard";
const staticRoot = "/tmp/kleinkunst-pages-e2e";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 7_500,
  },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://${host}:${port}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 820 } },
    },
  ],
  webServer: {
    command: [
      "env -u NO_COLOR FORCE_COLOR=0 npm run build:pages",
      `rm -rf ${staticRoot}`,
      `mkdir -p ${staticRoot}${basePath}`,
      `cp -R out/. ${staticRoot}${basePath}/`,
      `STATIC_ROOT=${staticRoot} PLAYWRIGHT_HOST=${host} PLAYWRIGHT_PORT=${port} node scripts/serve-pages.mjs`,
    ].join(" && "),
    url: `http://${host}:${port}${basePath}/`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});

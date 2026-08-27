import { defineConfig, devices } from "@playwright/test";
import { GITHUB_PAGES_BASE_PATH } from "./lib/config/site.mjs";

const port = process.env.PLAYWRIGHT_PORT ?? "4174";
const serverPort = process.env.PLAYWRIGHT_SERVER_PORT ?? "4175";
const host = "127.0.0.1";
const basePath = GITHUB_PAGES_BASE_PATH;
const staticRoot = "/tmp/kleinkunst-pages-e2e";

/**
 * Signatur-Geheimnis NUR für den Testlauf (S1).
 *
 * Muss mindestens 32 Zeichen haben (`resolveSessionSecret`). Steht bewusst
 * offen hier statt in einer `.env`: es ist kein Produktivgeheimnis, und ein
 * fester Wert macht die Testläufe reproduzierbar. Der produktive Wert kommt
 * aus dem Secret Manager (siehe `.env.example`).
 */
const testSessionSecret = "e2e-test-secret-nur-fuer-playwright-32+";

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
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    /**
     * DEMO-PFAD: statischer GitHub-Pages-Export. Keine Middleware, keine
     * API-Routen — dort gilt das PIN-Gate. Diese Tests sind Norberts
     * öffentliche Demo und bleiben unverändert.
     */
    {
      name: "chromium",
      testMatch: /app\.spec\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 820 },
        baseURL: `http://${host}:${port}`,
      },
    },
    /**
     * SETUP: meldet die vier Testpersonen an und legt je einen
     * `storageState` ab. Eigenes Projekt, damit sich die eigentlichen Tests
     * nicht selbst anmelden müssen (S2).
     */
    {
      name: "server-setup",
      testMatch: /server\/auth\.setup\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 820 },
        baseURL: `http://${host}:${serverPort}`,
      },
    },
    /**
     * SERVER-PFAD: echter Node-Server mit `NEXT_PUBLIC_DEMO_MODE=false`.
     * Hier greifen Middleware, Session-Prüfung, Mandantengrenze und RBAC —
     * genau das, was im statischen Export gar nicht existieren kann (S3).
     */
    {
      name: "server",
      testMatch: /server\/.*\.spec\.ts$/,
      dependencies: ["server-setup"],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 820 },
        baseURL: `http://${host}:${serverPort}`,
      },
    },
  ],
  webServer: [
    {
      command: [
        // NEXT_PUBLIC_FIXED_NOW pinnt "heute" für den E2E-Build auf einen festen
        // Zeitpunkt (siehe lib/domain/now.ts), damit Datum/Woche/GEMA-Fristen in
        // den Tests deterministisch bleiben. Der produktive build:pages-Lauf
        // (deploy-github-pages.yml) setzt das NICHT und nutzt das echte Datum (S7).
        "env -u NO_COLOR FORCE_COLOR=0 NEXT_PUBLIC_FIXED_NOW=2026-07-08T12:00:00+02:00 npm run build:pages",
        `rm -rf ${staticRoot}`,
        `mkdir -p ${staticRoot}${basePath}`,
        `cp -R out/. ${staticRoot}${basePath}/`,
        `STATIC_ROOT=${staticRoot} PLAYWRIGHT_HOST=${host} PLAYWRIGHT_PORT=${port} node scripts/serve-pages.mjs`,
      ].join(" && "),
      url: `http://${host}:${port}${basePath}/`,
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      // Eigenes Build-Verzeichnis (NEXT_DIST_DIR), damit dieser Build den
      // Demo-Build daneben nicht überschreibt — beide Server starten parallel.
      command: [
        "env -u NO_COLOR FORCE_COLOR=0",
        "NEXT_DIST_DIR=.next-server",
        "NEXT_PUBLIC_DEMO_MODE=false",
        "NEXT_PUBLIC_FIXED_NOW=2026-07-08T12:00:00+02:00",
        `AUTH_SESSION_SECRET='${testSessionSecret}'`,
        "npm run build",
        "&&",
        "env -u NO_COLOR FORCE_COLOR=0",
        "NEXT_DIST_DIR=.next-server",
        "NEXT_PUBLIC_DEMO_MODE=false",
        `AUTH_SESSION_SECRET='${testSessionSecret}'`,
        `npx next start -H ${host} -p ${serverPort}`,
      ].join(" "),
      url: `http://${host}:${serverPort}/login`,
      reuseExistingServer: false,
      timeout: 180_000,
    },
  ],
});

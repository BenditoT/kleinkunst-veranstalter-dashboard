import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Testphilosophie für Datei-Inhalts-Tests (Entscheidung O3.5,
 * dokumentiert in docs/architecture/data-port.md):
 *
 * Tests, die Dateiinhalte per String-Vergleich prüfen, sind nur dann
 * zulässig, wenn sie eine Eigenschaft absichern, die sonst niemand prüft
 * und deren Bruch teuer ist — hier: der statische Export bleibt
 * repository-scoped und die Demo-PIN bleibt rotierbar. Sie dürfen KEINE
 * Implementierungsdetails festschreiben (das hat die alte Fassung getan:
 * sie erzwang `sampleEvents.map` in der Detailseite und die PIN "69198"
 * im Workflow — beides wurde beim Umbau zur Bremse statt zur Absicherung).
 */
function read(path: string): string {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("GitHub Pages deployment", () => {
  it("has a dedicated static-export build script", () => {
    const packageJson = read("package.json");

    expect(packageJson).toContain("\"build:pages\"");
    expect(packageJson).toContain("GITHUB_PAGES=true");
  });

  it("configures Next.js for repository-scoped static Pages output", () => {
    const config = read("next.config.mjs");

    expect(config).toContain("output: isGitHubPages ? \"export\" : \"standalone\"");
    expect(config).toContain("basePath: isGitHubPages ? GITHUB_PAGES_BASE_PATH : undefined");
    expect(config).toContain("assetPrefix: isGitHubPages ? `${GITHUB_PAGES_BASE_PATH}/` : undefined");
  });

  it("deploys the exported app through GitHub Pages", () => {
    const workflow = read(".github/workflows/deploy-github-pages.yml");

    expect(workflow).toContain("pages: write");
    expect(workflow).toContain("actions/upload-pages-artifact");
    expect(workflow).toContain("actions/deploy-pages");
  });

  it("keeps the demo PIN rotatable: no hard-coded value in build script or workflow (O4)", () => {
    const workflow = read(".github/workflows/deploy-github-pages.yml");
    const packageJson = read("package.json");

    expect(workflow).toContain("NEXT_PUBLIC_DEMO_PIN: ${{ vars.DEMO_PIN }}");
    expect(workflow).not.toMatch(/NEXT_PUBLIC_DEMO_PIN:\s*["']\d+["']/);
    expect(packageJson).not.toContain("NEXT_PUBLIC_DEMO_PIN");
  });

  it("pre-renders dynamic demo detail pages for static GitHub Pages hosting", () => {
    const artistDetailPage = read("app/kuenstler/[id]/page.tsx");
    const venueDetailPage = read("app/spielorte/[id]/page.tsx");
    const eventDetailPage = read("app/veranstaltungen/[slug]/page.tsx");

    expect(artistDetailPage).toContain("generateStaticParams");
    expect(venueDetailPage).toContain("generateStaticParams");
    expect(eventDetailPage).toContain("generateStaticParams");

    // Der Events-Pfad läuft vollständig über den Datenport (O3) und darf
    // die Demodaten nicht mehr direkt importieren.
    expect(eventDetailPage).toContain("getDataPort");
    expect(eventDetailPage).not.toContain("sample-data");
  });
});

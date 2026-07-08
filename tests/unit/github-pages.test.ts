import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

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
    expect(config).toContain("basePath: isGitHubPages ? githubPagesBasePath : undefined");
    expect(config).toContain("assetPrefix: isGitHubPages ? `${githubPagesBasePath}/` : undefined");
  });

  it("deploys the exported app through GitHub Pages with the requested PIN", () => {
    const workflow = read(".github/workflows/deploy-github-pages.yml");

    expect(workflow).toContain("pages: write");
    expect(workflow).toContain("actions/upload-pages-artifact");
    expect(workflow).toContain("actions/deploy-pages");
    expect(workflow).toContain("NEXT_PUBLIC_DEMO_PIN: \"69198\"");
  });
});

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

describe("Google Cloud deployment assets", () => {
  it("provisions the expected managed services in one reproducible script", () => {
    const script = read("scripts/google-cloud/provision-and-deploy.sh");

    expect(script).toContain("gcloud services enable");
    expect(script).toContain("artifactregistry.googleapis.com");
    expect(script).toContain("run.googleapis.com");
    expect(script).toContain("sqladmin.googleapis.com");
    expect(script).toContain("gcloud sql instances create");
    expect(script).toContain("gcloud secrets create");
    expect(script).toContain("gcloud sql import sql");
    expect(script).toContain("serviceAccountEmailAddress");
    expect(script).toContain("roles/storage.objectViewer");
    expect(script).toContain("roles/artifactregistry.writer");
    expect(script).toContain("gcloud run deploy");
    expect(script).toContain("--add-cloudsql-instances");
    expect(script).toContain("--set-secrets");
  });

  it("documents keyless GitHub Actions deployment instead of service-account keys", () => {
    const workflow = read(".github/workflows/deploy-google-cloud.yml");
    const oidcScript = read("scripts/google-cloud/setup-github-oidc.sh");

    expect(workflow).toContain("id-token: write");
    expect(workflow).toContain("google-github-actions/auth");
    expect(workflow).toContain("workload_identity_provider");
    expect(oidcScript).toContain("workload-identity-pools create");
    expect(oidcScript).toContain("principalSet://iam.googleapis.com");
    expect(oidcScript).not.toContain("service-account-key");
  });
});

import { describe, expect, it } from "vitest";

import { getBackendRuntimeConfig } from "../../lib/server/backend/runtime";

describe("backend runtime config", () => {
  it("describes Google Cloud runtime services without importing provider SDKs", () => {
    const runtime = getBackendRuntimeConfig({ BACKEND_PROVIDER: "google-cloud" });

    expect(runtime.provider).toBe("google-cloud");
    expect(runtime.services.map((service) => service.kind)).toEqual([
      "database",
      "auth",
      "storage",
      "queue",
      "secrets",
    ]);
    expect(runtime.services[0]).toMatchObject({
      implementation: "Cloud SQL for PostgreSQL",
      envKeys: ["DATABASE_URL", "GOOGLE_CLOUD_SQL_INSTANCE"],
    });
  });
});

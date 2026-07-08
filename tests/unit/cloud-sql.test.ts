import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  buildCloudSqlSocketHost,
  getCloudSqlReadiness,
  getGoogleCloudSqlDatabaseConfig,
} from "../../lib/server/database/cloud-sql";

describe("Google Cloud SQL database config", () => {
  it("builds the Cloud SQL Unix socket host from the instance connection name", () => {
    expect(buildCloudSqlSocketHost("demo:europe-west3:kleinkunst-prod")).toBe(
      "/cloudsql/demo:europe-west3:kleinkunst-prod",
    );
  });

  it("marks the database as ready only when the required Cloud SQL settings exist", () => {
    const readiness = getCloudSqlReadiness({
      BACKEND_PROVIDER: "google-cloud",
      DATABASE_URL: "postgresql://app:secret@localhost:5432/kleinkunst",
      GOOGLE_CLOUD_PROJECT_ID: "demo",
      GOOGLE_CLOUD_REGION: "europe-west3",
      GOOGLE_CLOUD_SQL_INSTANCE: "demo:europe-west3:kleinkunst-prod",
    });

    expect(readiness.ready).toBe(true);
    expect(readiness.missingEnvKeys).toEqual([]);
  });

  it("reports missing Cloud SQL settings for deployment handoff", () => {
    const readiness = getCloudSqlReadiness({ BACKEND_PROVIDER: "google-cloud" });

    expect(readiness.ready).toBe(false);
    expect(readiness.missingEnvKeys).toEqual([
      "DATABASE_URL",
      "GOOGLE_CLOUD_PROJECT_ID",
      "GOOGLE_CLOUD_REGION",
      "GOOGLE_CLOUD_SQL_INSTANCE",
    ]);
  });

  it("keeps the server connection config provider neutral and out of client bundles", () => {
    const config = getGoogleCloudSqlDatabaseConfig({
      DATABASE_URL: "postgresql://app:secret@localhost:5432/kleinkunst",
      GOOGLE_CLOUD_SQL_INSTANCE: "demo:europe-west3:kleinkunst-prod",
    });

    expect(config.provider).toBe("google-cloud");
    expect(config.database).toBe("cloud-sql-postgres");
    expect(config.connectionMode).toBe("unix-socket");
    expect(config.socketHost).toBe("/cloudsql/demo:europe-west3:kleinkunst-prod");
    expect(config.serverOnly).toBe(true);
  });
});

describe("provider-neutral Cloud SQL migration", () => {
  it("uses app.current_org_id instead of Supabase auth.uid() assumptions", () => {
    const migration = readFileSync(
      join(process.cwd(), "db/migrations/202607080001_core_schema.sql"),
      "utf8",
    );

    expect(migration).toContain("app.current_org_id");
    expect(migration).not.toContain("auth.uid()");
    expect(migration).not.toContain("auth.users");
  });
});

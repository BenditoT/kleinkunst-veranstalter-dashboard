import { resolveBackendPlan } from "../../config/backend";

export type CloudSqlConnectionMode = "unix-socket" | "tcp";

export type CloudSqlReadiness = {
  provider: "google-cloud";
  ready: boolean;
  missingEnvKeys: string[];
};

export type GoogleCloudSqlDatabaseConfig = {
  provider: "google-cloud";
  database: "cloud-sql-postgres";
  databaseUrl: string;
  instanceConnectionName?: string;
  socketHost?: string;
  connectionMode: CloudSqlConnectionMode;
  serverOnly: true;
};

type CloudSqlEnvironment = Partial<Record<string, string | undefined>>;

const requiredCloudSqlKeys = [
  "DATABASE_URL",
  "GOOGLE_CLOUD_PROJECT_ID",
  "GOOGLE_CLOUD_REGION",
  "GOOGLE_CLOUD_SQL_INSTANCE",
] as const;

export function buildCloudSqlSocketHost(instanceConnectionName: string): string {
  return `/cloudsql/${instanceConnectionName}`;
}

export function getCloudSqlReadiness(env: CloudSqlEnvironment = process.env): CloudSqlReadiness {
  const missingEnvKeys = requiredCloudSqlKeys.filter((key) => !env[key]);

  return {
    provider: "google-cloud",
    ready: missingEnvKeys.length === 0,
    missingEnvKeys,
  };
}

export function getGoogleCloudSqlDatabaseConfig(
  env: CloudSqlEnvironment = process.env,
): GoogleCloudSqlDatabaseConfig {
  const plan = resolveBackendPlan({ ...process.env, ...env, BACKEND_PROVIDER: "google-cloud" });
  const databaseUrl = env.DATABASE_URL ?? "";
  const instanceConnectionName = env.GOOGLE_CLOUD_SQL_INSTANCE;
  const socketHost = instanceConnectionName ? buildCloudSqlSocketHost(instanceConnectionName) : undefined;

  return {
    provider: "google-cloud",
    database: plan.database === "cloud-sql-postgres" ? plan.database : "cloud-sql-postgres",
    databaseUrl,
    instanceConnectionName,
    socketHost,
    connectionMode: socketHost ? "unix-socket" : "tcp",
    serverOnly: true,
  };
}

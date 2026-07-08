export const SUPABASE_MIGRATION_EARLIEST_DATE = "2026-07-24" as const;

export type BackendProvider =
  | "google-cloud"
  | "supabase"
  | "self-hosted-postgres"
  | "neon"
  | "appwrite";

export type DatabaseTarget =
  | "cloud-sql-postgres"
  | "supabase-postgres"
  | "postgres"
  | "neon-postgres"
  | "appwrite-databases";

export type AuthTarget =
  | "identity-platform"
  | "supabase-auth"
  | "keycloak"
  | "neon-auth"
  | "appwrite-auth";

export type StorageTarget =
  | "cloud-storage"
  | "supabase-storage"
  | "s3-compatible-storage"
  | "neon-storage"
  | "appwrite-storage";

export type MigrationStatus = "active" | "scheduled" | "alternative";

export type BackendPlan = {
  activeProvider: BackendProvider;
  database: DatabaseTarget;
  auth: AuthTarget;
  storage: StorageTarget;
  migrationStatus: MigrationStatus;
  supabaseMigrationEarliestDate: typeof SUPABASE_MIGRATION_EARLIEST_DATE;
  notes: string[];
};

type BackendEnvironment = Partial<Record<string, string | undefined>>;

const providerPlans: Record<
  BackendProvider,
  Omit<BackendPlan, "activeProvider" | "supabaseMigrationEarliestDate">
> = {
  "google-cloud": {
    database: "cloud-sql-postgres",
    auth: "identity-platform",
    storage: "cloud-storage",
    migrationStatus: "active",
    notes: [
      "Bevorzugter Vorbereitungspfad: Postgres bleibt portabel, Auth und Storage laufen ueber Google-Cloud-Adapter.",
      "RLS wird ueber organization_id und einen transaktionalen app.current_org_id-Kontext vorbereitet.",
    ],
  },
  supabase: {
    database: "supabase-postgres",
    auth: "supabase-auth",
    storage: "supabase-storage",
    migrationStatus: "scheduled",
    notes: [
      "Supabase bleibt vorbereitet, wird aber nicht vor dem geplanten Migrationstermin aktiviert.",
      "Bestehende Migrationen bleiben als SQL-Quelle erhalten und werden vor Ausfuehrung konsolidiert.",
    ],
  },
  "self-hosted-postgres": {
    database: "postgres",
    auth: "keycloak",
    storage: "s3-compatible-storage",
    migrationStatus: "alternative",
    notes: [
      "Maximale Datensouveraenitaet mit Hetzner/Coolify, Keycloak und S3-kompatiblem Storage.",
      "Mehr Betriebsaufwand als Managed Cloud, dafuer geringere Anbieterbindung.",
    ],
  },
  neon: {
    database: "neon-postgres",
    auth: "neon-auth",
    storage: "neon-storage",
    migrationStatus: "alternative",
    notes: [
      "Guter Postgres-Workflow mit Branching und schneller Preview-Umgebung.",
      "Nicht so vollstaendig als App-Backend wie Supabase oder Google Cloud.",
    ],
  },
  appwrite: {
    database: "appwrite-databases",
    auth: "appwrite-auth",
    storage: "appwrite-storage",
    migrationStatus: "alternative",
    notes: [
      "Komplettes Backend-as-a-Service mit Auth, Datenbank, Storage und Realtime.",
      "Nicht Postgres-nativ; fuer das aktuelle SQL/RLS-Modell waere das ein groesserer Architekturwechsel.",
    ],
  },
};

export function resolveBackendPlan(
  env: BackendEnvironment = process.env,
): BackendPlan {
  const requestedProvider = normalizeProvider(env.BACKEND_PROVIDER);
  const plan = providerPlans[requestedProvider];

  return {
    activeProvider: requestedProvider,
    supabaseMigrationEarliestDate: SUPABASE_MIGRATION_EARLIEST_DATE,
    ...plan,
  };
}

function normalizeProvider(provider: string | undefined): BackendProvider {
  if (isBackendProvider(provider)) {
    return provider;
  }

  return "google-cloud";
}

function isBackendProvider(provider: string | undefined): provider is BackendProvider {
  return (
    provider === "google-cloud" ||
    provider === "supabase" ||
    provider === "self-hosted-postgres" ||
    provider === "neon" ||
    provider === "appwrite"
  );
}

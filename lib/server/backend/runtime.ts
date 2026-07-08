import { resolveBackendPlan, type BackendProvider } from "../../config/backend";

export type BackendServiceKind = "database" | "auth" | "storage" | "queue" | "secrets";

export type BackendRuntimeService = {
  kind: BackendServiceKind;
  implementation: string;
  envKeys: string[];
  notes: string;
};

export type BackendRuntimeConfig = {
  provider: BackendProvider;
  services: BackendRuntimeService[];
};

type BackendRuntimeEnvironment = Partial<Record<string, string | undefined>>;

export function getBackendRuntimeConfig(env: BackendRuntimeEnvironment = process.env): BackendRuntimeConfig {
  const plan = resolveBackendPlan(env);

  return {
    provider: plan.activeProvider,
    services: servicesByProvider[plan.activeProvider],
  };
}

const servicesByProvider: Record<BackendProvider, BackendRuntimeService[]> = {
  "google-cloud": [
    {
      kind: "database",
      implementation: "Cloud SQL for PostgreSQL",
      envKeys: ["DATABASE_URL", "GOOGLE_CLOUD_SQL_INSTANCE"],
      notes: "Postgres bleibt das portable Kernmodell. RLS-Kontext wird serverseitig je Request gesetzt.",
    },
    {
      kind: "auth",
      implementation: "Identity Platform / Firebase Auth",
      envKeys: ["NEXT_PUBLIC_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"],
      notes: "Auth-Sessions werden in einen provider-neutralen OrganizationContext gemappt.",
    },
    {
      kind: "storage",
      implementation: "Cloud Storage",
      envKeys: ["GOOGLE_CLOUD_STORAGE_BUCKET"],
      notes: "Medien, PDFs, Pressefotos und Programmhefte liegen in getrennten Prefixes.",
    },
    {
      kind: "queue",
      implementation: "Cloud Tasks / Pub/Sub",
      envKeys: ["GOOGLE_CLOUD_TASKS_QUEUE", "GOOGLE_CLOUD_PUBSUB_TOPIC"],
      notes: "Newsletter, PDF-Generierung, Webhooks und GEMA-Erinnerungen laufen asynchron.",
    },
    {
      kind: "secrets",
      implementation: "Secret Manager",
      envKeys: ["GOOGLE_CLOUD_PROJECT_ID"],
      notes: "Provider-Keys werden nicht in UI oder Client-Bundles serialisiert.",
    },
  ],
  supabase: [
    {
      kind: "database",
      implementation: "Supabase Postgres",
      envKeys: ["DATABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"],
      notes: "Vorbereitet, aber Migration fruehestens ab 2026-07-24.",
    },
    {
      kind: "auth",
      implementation: "Supabase Auth",
      envKeys: ["NEXT_PUBLIC_SUPABASE_ANON_KEY"],
      notes: "RLS-Abhaengigkeiten mit auth.uid() vor Aktivierung pruefen.",
    },
    {
      kind: "storage",
      implementation: "Supabase Storage",
      envKeys: ["SUPABASE_SERVICE_ROLE_KEY"],
      notes: "Storage-Buckets erst nach Provider-Entscheidung provisionieren.",
    },
    {
      kind: "queue",
      implementation: "External Queue",
      envKeys: ["REDIS_URL"],
      notes: "Supabase ersetzt keine robuste Newsletter-/PDF-Queue.",
    },
    {
      kind: "secrets",
      implementation: "Environment / Secret Store",
      envKeys: ["SUPABASE_SERVICE_ROLE_KEY"],
      notes: "Service Role Key niemals in Client-Komponenten nutzen.",
    },
  ],
  "self-hosted-postgres": [
    {
      kind: "database",
      implementation: "PostgreSQL",
      envKeys: ["DATABASE_URL"],
      notes: "Hetzner/Coolify-Pfad mit eigenem Backup- und Monitoring-Betrieb.",
    },
    {
      kind: "auth",
      implementation: "Keycloak",
      envKeys: ["KEYCLOAK_ISSUER", "KEYCLOAK_CLIENT_ID"],
      notes: "Maximale Kontrolle, aber hoeherer Betriebsaufwand.",
    },
    {
      kind: "storage",
      implementation: "S3-compatible Storage",
      envKeys: ["S3_ENDPOINT", "S3_BUCKET"],
      notes: "MinIO oder kompatibler Anbieter.",
    },
    {
      kind: "queue",
      implementation: "BullMQ",
      envKeys: ["REDIS_URL"],
      notes: "Bewaehrte Queue fuer Self-hosted Betrieb.",
    },
    {
      kind: "secrets",
      implementation: "Coolify Secrets / Vault",
      envKeys: ["DATABASE_URL"],
      notes: "Secrets bleiben im Deployment-System.",
    },
  ],
  neon: [
    {
      kind: "database",
      implementation: "Neon Postgres",
      envKeys: ["DATABASE_URL"],
      notes: "Stark fuer Preview-Branches, braucht zusaetzliche Auth-/Storage-Dienste.",
    },
    {
      kind: "auth",
      implementation: "Neon Auth or external OIDC",
      envKeys: ["AUTH_ISSUER"],
      notes: "Auth bewusst austauschbar halten.",
    },
    {
      kind: "storage",
      implementation: "External Object Storage",
      envKeys: ["S3_BUCKET"],
      notes: "Neon ist kein vollstaendiger Storage-Ersatz.",
    },
    {
      kind: "queue",
      implementation: "External Queue",
      envKeys: ["REDIS_URL"],
      notes: "Queue separat planen.",
    },
    {
      kind: "secrets",
      implementation: "Deployment Secret Store",
      envKeys: ["DATABASE_URL"],
      notes: "Secrets bleiben Provider-spezifisch.",
    },
  ],
  appwrite: [
    {
      kind: "database",
      implementation: "Appwrite Databases",
      envKeys: ["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID"],
      notes: "Nicht Postgres-nativ; nur als groesserer Architekturwechsel.",
    },
    {
      kind: "auth",
      implementation: "Appwrite Auth",
      envKeys: ["APPWRITE_PROJECT_ID"],
      notes: "BaaS-Komfort mit anderem Datenmodell.",
    },
    {
      kind: "storage",
      implementation: "Appwrite Storage",
      envKeys: ["APPWRITE_BUCKET_ID"],
      notes: "Storage direkt integriert.",
    },
    {
      kind: "queue",
      implementation: "Appwrite Functions / External Queue",
      envKeys: ["APPWRITE_FUNCTION_ID"],
      notes: "Lange Jobs separat bewerten.",
    },
    {
      kind: "secrets",
      implementation: "Appwrite Variables",
      envKeys: ["APPWRITE_API_KEY"],
      notes: "Server-Key nie im Browser nutzen.",
    },
  ],
};

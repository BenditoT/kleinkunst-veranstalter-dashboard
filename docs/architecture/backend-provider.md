# Backend-Provider-Strategie

Stand: 08.07.2026

## Entscheidung

Die App wird provider-neutral vorbereitet. Der aktive Default ist **Google Cloud**, weil das Projekt Postgres, Container-Deployment, Objekt-Storage, Queues und Secrets sauber als austauschbare Infrastruktur-Schichten braucht.

Supabase bleibt vorbereitet, wird aber nicht vor dem **24.07.2026** als Migration aktiviert.

## Empfohlener Google-Cloud-Zuschnitt

| App-Baustein | Google Cloud | Warum |
| --- | --- | --- |
| PostgreSQL | Cloud SQL for PostgreSQL | SQL/RLS-kompatibler Pfad fuer das bestehende Schema |
| Auth | Identity Platform / Firebase Auth | E-Mail, OAuth und Magic Links ohne eigenes Auth-System |
| Hosting | Cloud Run | Container-basierter Next.js-Betrieb mit EU-Region |
| Storage | Cloud Storage | Medien, Pressefotos, PDFs, Programmhefte |
| Jobs | Cloud Tasks oder Pub/Sub | Newsletter, Social Posts, PDF-Generierung, Webhooks |
| Secrets | Secret Manager | API-Keys und Service-Credentials getrennt vom Code |
| Scheduler | Cloud Scheduler | Erinnerungen, GEMA-Fristen, Kampagnenstarts |

Wichtig: Google Cloud ist ein US-Anbieter. Fuer DSGVO muss das Setup AVV, EU-Regionen, Datenminimierung, klare Rollen und optionale Self-Hosted-Alternativen dokumentieren.

## Alternativen

| Option | Staerken | Grenzen fuer dieses Projekt |
| --- | --- | --- |
| Supabase | Schnellster Postgres/Auth/Storage/Realtimes-Start, sehr gute DX | Migration erst ab 24.07.2026; RLS/Auth-Strategie vorher konsolidieren |
| Self-hosted Postgres + Keycloak + S3 | Maximale Datensouveraenitaet, sehr guter Fit fuer Hetzner/Coolify | Mehr Betrieb, Backups, Monitoring und Security-Patches selbst tragen |
| Neon | Sehr stark fuer Postgres-Branching und Preview-DBs | Kein vollstaendiges App-Backend fuer Auth/Storage/Realtime |
| Appwrite | Komplettes Open-Source-BaaS mit Auth/Storage/Realtime | Nicht Postgres-nativ; aktuelles SQL/RLS-Modell muesste stark umgebaut werden |
| PocketBase | Sehr schnell fuer kleine Prototypen | SQLite-basiert, fuer Multi-Tenant-Postgres/RLS nicht passend |
| Firebase/Firestore | Sehr ausgereift, starke Realtime-Faehigkeiten | Kein relationales Postgres-Modell; GEMA/Finanz/Reporting wird komplexer |

## Vorbereitungsregeln

1. UI-Komponenten importieren nie direkt Supabase-, Firebase- oder Google-Cloud-SDKs.
2. Server-Code spricht langfristig gegen Adapter-Interfaces: `auth`, `database`, `storage`, `queue`.
3. Postgres bleibt der Datenmodell-Default, damit Cloud SQL, Supabase, Neon und Self-Hosted Postgres austauschbar bleiben.
4. Environment-Variablen werden ueber `.env.example` dokumentiert.
5. Die bestehende Supabase-SQL-Migration bleibt als Schemaquelle erhalten, wird vor dem 24.07.2026 aber nicht als aktive Supabase-Migration behandelt.

## Umgesetzt

- Provider-Konfiguration in `lib/config/backend.ts`
- Runtime-Servicebeschreibung in `lib/server/backend/runtime.ts`
- Cloud-SQL-Readiness und Socket-Host-Ableitung in `lib/server/database/cloud-sql.ts`
- Provider-neutrale Cloud-SQL-Basismigration in `db/migrations/202607080001_core_schema.sql`
- GCP-Deployment-Skizze in `docs/deployment/google-cloud-sql.md`

## Naechste technische Schritte

- Gemeinsame Typen fuer `AuthSession`, `OrganizationContext`, `StorageObject` und `JobEnvelope` definieren.
- Server Actions/API-Routes an den Datenbankadapter anschliessen, sobald echte Cloud-SQL-Credentials vorliegen.
- Supabase-Migration am oder nach dem 24.07.2026 gegen die Cloud-SQL-Migration diffen.

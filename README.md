# Kleinkunst-Veranstalter Dashboard

Next.js-App fuer deutsche Kleinkunst-Veranstalter mit Multi-Venue-Planung, Event-Management, Kalender, GEMA-, Newsletter-, Presse-, Ticketing- und Finanzmodulen.

## Architekturstand

Der Backend-Default ist aktuell **Google Cloud**:

- Cloud SQL for PostgreSQL fuer relationale Daten
- Identity Platform / Firebase Auth fuer Authentifizierung
- Cloud Storage fuer Medien und PDFs
- Cloud Run fuer den Next.js-Container
- Cloud Tasks / Pub/Sub fuer Hintergrundjobs
- Secret Manager fuer Secrets

Supabase bleibt vorbereitet, aber eine Migration ist fruehestens fuer den **24.07.2026** vorgesehen. Details stehen in [docs/architecture/backend-provider.md](docs/architecture/backend-provider.md).

Cloud-SQL-Details:

- Provider-neutrale Migration: `db/migrations/202607080001_core_schema.sql`
- Deployment-Checkliste: [docs/deployment/google-cloud-sql.md](docs/deployment/google-cloud-sql.md)
- Server-Konfiguration: `lib/server/database/cloud-sql.ts`

## Getting Started

Dependencies installieren:

```bash
npm install
```

Entwicklungsserver starten:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Tests ausfuehren:

```bash
npm test
```

Linting:

```bash
npm run lint
```

Build:

```bash
npm run build
```

Google-Cloud-Provisionierung und Deploy:

```bash
export GOOGLE_CLOUD_PROJECT_ID=<project-id>
gcloud auth login
npm run deploy:gcp
```

## Environment

Kopiere `.env.example` nach `.env.local` und fuelle die passenden Provider-Werte aus. `BACKEND_PROVIDER=google-cloud` ist der vorbereitete Default.

## Hinweise

- Die lokale Node-Version sollte mindestens `20.19.0` sein. In diesem Workspace wurde mit Node `24.14.0` verifiziert.
- UI-Code soll provider-neutral bleiben und keine direkten Cloud-SDK-Imports enthalten.

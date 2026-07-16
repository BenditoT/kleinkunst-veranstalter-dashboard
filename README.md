# Kleinkunst-Veranstalter Dashboard

Next.js-App fuer deutsche Kleinkunst-Veranstalter mit Multi-Venue-Planung, Event-Management, Kalender, GEMA-, Newsletter-, Presse-, Ticketing- und Finanzmodulen.

Der aktuelle Umsetzungs- und Abnahmeplan steht im [Sprintplan](docs/sprints/README.md).

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

Voraussetzung ist Node.js `>=20.19.0`; fuer lokale Entwicklung und CI ist
`24.14.0` in `.nvmrc` festgelegt.

Node-Version aktivieren und Dependencies reproduzierbar installieren:

```bash
nvm use
npm ci
```

Entwicklungsserver starten:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Die vollstaendige lokale Qualitaetskette entspricht der PR-CI und prueft in
dieser Reihenfolge Lint, TypeScript, Unit-Tests und den Produktions-Build:

```bash
npm run quality
```

Einzelne Gates lassen sich weiterhin separat ausfuehren:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Google-Cloud-Provisionierung und Deploy:

```bash
export GOOGLE_CLOUD_PROJECT_ID=<project-id>
gcloud auth login
npm run deploy:gcp
```

GitHub Pages Demo-Deploy:

```bash
npm run build:pages
```

Der statische GitHub-Pages-Build nutzt einen clientseitigen Demo-PIN. Der
aktuelle PIN ist `69198`.

## Environment

Kopiere `.env.example` nach `.env.local` und fuelle die passenden Provider-Werte aus. `BACKEND_PROVIDER=google-cloud` ist der vorbereitete Default.

## Hinweise

- Die unterstuetzte Node-Untergrenze steht in `package.json`; `.nvmrc` pinnt die Referenzversion fuer lokale Checks und GitHub Actions.
- UI-Code soll provider-neutral bleiben und keine direkten Cloud-SDK-Imports enthalten.

# Google Cloud SQL Deployment

Stand: 08.07.2026

## Zielarchitektur

- Next.js laeuft als Container auf Cloud Run.
- PostgreSQL laeuft in Cloud SQL in `europe-west3`.
- Cloud Run verbindet die App mit der Cloud-SQL-Instanz.
- `DATABASE_URL` und weitere Secrets liegen in Secret Manager oder den Cloud-Run-Secrets.

## Benoetigte Environment-Werte

```bash
BACKEND_PROVIDER=google-cloud
GOOGLE_CLOUD_PROJECT_ID=<project-id>
GOOGLE_CLOUD_REGION=europe-west3
GOOGLE_CLOUD_SQL_INSTANCE=<project-id>:europe-west3:<instance-name>
GOOGLE_CLOUD_SQL_DATABASE=kleinkunst
GOOGLE_CLOUD_SQL_USER=kleinkunst_app
DATABASE_URL=postgresql://kleinkunst_app:<password>@localhost:5432/kleinkunst
```

Der Server-Code kann aus `GOOGLE_CLOUD_SQL_INSTANCE` den Unix-Socket-Host
`/cloudsql/<project-id>:<region>:<instance-name>` ableiten.

## Migration ausfuehren

```bash
psql "$DATABASE_URL" -f db/migrations/202607080001_core_schema.sql
```

Bei Cloud Run muss der Service mit der Cloud-SQL-Instanz verbunden werden. Fuer
private IP kann stattdessen eine VPC-Anbindung genutzt werden; die App bleibt
ueber `DATABASE_URL` und `GOOGLE_CLOUD_SQL_INSTANCE` konfigurierbar.

## Deployment-Notizen

1. Cloud SQL for PostgreSQL anlegen.
2. Datenbank `kleinkunst` und User `kleinkunst_app` anlegen.
3. Migration aus `db/migrations/202607080001_core_schema.sql` ausfuehren.
4. Cloud Run Service Account mit Cloud-SQL-Zugriff ausstatten.
5. Cloud Run Service mit der Cloud-SQL-Instanz verbinden.
6. Secrets setzen: `DATABASE_URL`, Firebase/Identity-Platform-Werte, SMTP, Storage.

Referenz: Google dokumentiert fuer Cloud Run den direkten Anschluss an Cloud SQL
for PostgreSQL inklusive `--add-cloudsql-instances` und Unix-Socket-Pfad:
https://docs.cloud.google.com/sql/docs/postgres/connect-run

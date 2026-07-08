# Supabase-Migrationen

Status: vorbereitet, aber nicht aktiv.

Die SQL-Datei in `migrations/` ist aktuell eine Schemaquelle aus der bisherigen Planung. Der aktive Backend-Default ist Google Cloud mit Cloud SQL for PostgreSQL.

Supabase darf fruehestens am **24.07.2026** als aktiver Provider bewertet oder migriert werden. Vorher bitte:

- `docs/architecture/backend-provider.md` lesen
- `lib/config/backend.ts` pruefen
- RLS-Policies konsolidieren
- `auth.uid()`-Abhaengigkeiten gegen den provider-neutralen Auth-Kontext pruefen
- Migration in kleinere, nachvollziehbare Postgres-Schritte aufteilen

# Database

Der aktive Datenbankpfad ist Google Cloud SQL for PostgreSQL.

## Migrationen

- `migrations/202607080001_core_schema.sql` ist die provider-neutrale Cloud-SQL-Basis.
- `supabase/migrations/00000000000000_init.sql` bleibt als vorbereitete Supabase-Quelle erhalten, wird aber nicht vor dem 24.07.2026 aktiviert.

## Mandantenkontext

Server-Code setzt pro Request innerhalb der Datenbanktransaktion:

```sql
SET LOCAL app.current_org_id = '<organization-uuid>';
```

RLS-Policies nutzen diesen Wert statt provider-spezifischer Auth-Funktionen.

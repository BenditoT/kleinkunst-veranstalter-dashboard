# Supabase — Status: archiviert, kein aktiver Provider

**Entscheidung vom 31.07.2026 (Sprint Opus, Aufgabe O1):**
Der Termin „Supabase-Neubewertung am 24.07.2026" ist damit abgearbeitet.

- **Aktiver Backend-Default bleibt Google Cloud** (Cloud SQL + Identity Platform + Cloud Run).
- **Supabase wird nicht aktiviert**, bleibt aber ein realistischer Ausweichpfad — er kostet nur einen Adapter, weil das kanonische Schema provider-neutral ist.
- Begründung, Konsequenzen und Revisionspunkt: [`../docs/architecture/backend-provider.md`](../docs/architecture/backend-provider.md)

## Was hier liegt

| Pfad | Bedeutung |
| --- | --- |
| `archive/00000000000000_init.sql` | Archivierter Schema-Entwurf, **wird nicht ausgeführt**. Bewusst nicht unter `migrations/`, damit die Supabase-CLI ihn nicht als aktive Migration einliest. |

Das Verzeichnis `migrations/` existiert nicht mehr. Das ist Absicht: es gibt genau **ein** kanonisches Schema, nämlich [`../db/migrations/202607080001_core_schema.sql`](../db/migrations/202607080001_core_schema.sql).

## Wenn Supabase doch aktiviert wird

1. ADR `docs/architecture/backend-provider.md` fortschreiben (neuer Abschnitt, alte Entscheidung nicht löschen).
2. Kanonisches Schema unverändert übernehmen — es läuft ohne Änderung auf Supabase-Postgres.
3. Nur die Kontextquelle austauschen: `current_setting('app.current_org_id')` pro Request setzen (Server-Client) **oder** eine `get_current_org_id()`-Wrapperfunktion anlegen, die aus `auth.jwt()` liest. Die Policies selbst bleiben unverändert.
4. `FORCE ROW LEVEL SECURITY` beibehalten: der `service_role`-Key umgeht RLS ohnehin, der `anon`/`authenticated`-Pfad darf es nicht.
5. Auth-Port implementieren statt das Supabase-SDK in die UI zu ziehen (`../docs/architecture/auth-port.md`).

## Warum das Archiv nicht gelöscht wurde

Die Datei beschreibt rund 30 Tabellen für Module, die im kanonischen Schema noch fehlen (Ticketing, Newsletter, GEMA-Werke, Finanzen, Presse, Medien, KI, Benachrichtigungen). Sie ist die fachliche Vorlage für die Sprints 3–10. Die RLS-Löcher aus O2 sind dort trotz Archivstatus mitgeschlossen, damit ein späteres Copy-Paste die Lücke nicht zurückholt.

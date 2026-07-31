# ADR 1 — Backend-Provider, kanonisches Schema, Rollenmodell, RLS

Ursprung: 08.07.2026 · **Fortgeschrieben: 31.07.2026 (Sprint Opus, O1 + O2)**
Status: **entschieden**
Revisionspunkt: **01.11.2026 oder vor Sprint 6 (Ticketing/Realtime)** — was zuerst eintritt

---

## Teil A — Entscheidung 31.07.2026

### A1. Genau ein kanonisches Schema

**Entscheidung:** [`db/migrations/202607080001_core_schema.sql`](../../db/migrations/202607080001_core_schema.sql) ist die einzige Wahrheit für das Datenmodell. Der zweite Stand (`supabase/migrations/00000000000000_init.sql`) ist nach `supabase/archive/00000000000000_init.sql` verschoben und wird nicht mehr ausgeführt.

**Begründung:**

| Kriterium | `db/migrations/` | `supabase/migrations/` (alt) |
| --- | --- | --- |
| Mandantenkontext | `current_setting('app.current_org_id')` — reines Postgres | `get_current_org_id()` **plus** `auth.uid()` bei `notifications` |
| Provider-Bindung | keine | Mock-`auth`-Schema, das echte Supabase-Objekte nachbaut und auf Cloud SQL zur Karteileiche wird |
| Portierbarkeit | läuft unverändert auf Cloud SQL, Supabase, Neon, self-hosted | läuft auf Cloud SQL nur mit Fake-`auth.users` |
| Umfang | 8 Tabellen, genau die Sprints 1–4 | ~30 Tabellen bis Sprint 10, davon 15 mit RLS **ohne jede Policy** |
| Nachvollziehbarkeit | 178 Zeilen, review-fähig | 851 Zeilen in einem Block |

Der Ausschlag gibt Punkt 1: `auth.uid()` ist eine Provider-Bindung im *Datenmodell*, nicht im Adapter. Genau das verbietet die Vorbereitungsregel „UI und Datenmodell bleiben provider-neutral". Das kanonische Schema kann jederzeit nach Supabase wandern; umgekehrt ginge es nicht ohne Rückbau.

**Warum das Archiv nicht gelöscht wurde:** es enthält die fachliche Vorlage für die Sprints 3–10 (Ticketing, Newsletter, GEMA-Werke, Finanzen, Presse, Medien, KI). Es wurde beim Archivieren trotzdem RLS-gehärtet (siehe A3), damit ein späteres Copy-Paste die Lücke nicht zurückholt.

**Änderungsregel:** Solange kein produktiver Import stattgefunden hat (Stand heute: kein Backend angebunden), wird die kanonische Datei **korrigiert** statt Korrekturen nachzuziehen. Ab dem ersten produktiven `gcloud sql import sql` gilt append-only.

### A2. Rollenmodell = 5 Rollen

**Entscheidung:** `owner`, `admin`, `manager`, `member`, `viewer` — wie in `docs/sprints/README.md` (Sprint 2). Die drei zusätzlichen Rollen der alten Schemata entfallen.

| entfallen | wird zu | Begründung |
| --- | --- | --- |
| `booker` | `manager` | Booking ist eine *Aufgabe*, kein Rechteschnitt: ein Booker braucht Schreibrechte auf Events/Verträge — identisch mit `manager`. |
| `accountant` | `manager` | dito für Finanzen. Feinere Trennung gehört in `permissions JSONB`, nicht in die Rollenachse. |
| `venue_operator` | `member` | Spielortpersonal arbeitet mit, verwaltet aber nicht. |

Acht Rollen hätten 8×N Policy-Kombinationen bedeutet, bevor die erste Rolle überhaupt getestet ist. Feingranulare Rechte bleiben über `organization_members.permissions` (JSONB) möglich, ohne die Rollenachse zu sprengen. Der TypeScript-Typ dazu ist `OrganizationRole` in [`lib/domain/types.ts`](../../lib/domain/types.ts); die Migration bildet Altdaten idempotent auf das neue Modell ab.

### A3. Supabase-Frage (Termin 24.07.2026 — hiermit beantwortet)

**Entscheidung: Google Cloud bleibt Default. Supabase wird nicht aktiviert. Beides bleibt über den Port austauschbar.**

Begründung:

1. **Kein offener Bedarf.** Supabase' Mehrwert ist gebündeltes Auth + Realtime + Storage. Auth ist mit Identity Platform (Sprint 2) bereits entschieden und mit dem Cloud-Run-Deployment verdrahtet; Realtime braucht erst Sprint 6/7 (Ticketing/Einlass).
2. **Ein zweiter Provider jetzt verdoppelt die Sicherheitsfläche**, ohne eine einzige Nutzerfunktion zu liefern: zweite Session-Semantik, zweiter Key-Satz (`anon`/`service_role`), zweite RLS-Kontextquelle — genau in dem Sprint, in dem die Mandantengrenze überhaupt erst entsteht.
3. **Die Wechselkosten bleiben niedrig**, weil A1 die Provider-Bindung aus dem Schema entfernt hat: ein Wechsel kostet einen Datenport-Adapter plus das Setzen von `app.current_org_id` pro Request — nicht das Schema.
4. **DSGVO ist kein Entscheidungsgrund pro Supabase**: beide sind US-Unternehmen mit EU-Region; die Argumentation über AVV/EU-Region/Datenminimierung bleibt identisch.

**Konsequenzen**

- `BACKEND_PROVIDER=google-cloud` bleibt Default in `.env.example` und `lib/config/backend.ts`.
- `supabase/migrations/` existiert nicht mehr; nur noch `supabase/archive/` + README mit Reaktivierungspfad.
- `SUPABASE_MIGRATION_EARLIEST_DATE` verliert seine Torwächter-Funktion; der Wert bleibt als historischer Marker im Code und in `.env.example`.
- Kein Supabase-SDK in `package.json`.

**Revisionspunkt:** neu bewerten am **01.11.2026** oder spätestens beim Start von Sprint 6, wenn Realtime-Einlasskontrolle konkret wird — je nachdem, was zuerst eintritt. Auslöser für eine sofortige Neubewertung: Cloud-SQL-Betriebskosten über Budget, ein Datenschutzentscheid gegen Google Cloud, oder Identity Platform erfüllt die Anforderungen aus Sprint 2 nicht.

---

## Teil B — RLS-Härtung (O2)

### Was kaputt war

Die Mandantengrenze war in **beiden** Schemata nur scheinbar vorhanden:

1. **`USING(...)` ohne `WITH CHECK(...)`.** Bei `FOR ALL` prüft `USING` nur, welche vorhandenen Zeilen sichtbar sind. `INSERT` und `UPDATE` schreiben ohne `WITH CHECK` ungeprüft — eine Session mit Kontext Org A konnte Zeilen mit `organization_id` von Org B anlegen und eigene Zeilen in fremde Organisationen verschieben.
2. **Kein `FORCE ROW LEVEL SECURITY`.** `scripts/google-cloud/provision-and-deploy.sh` importiert die Migration mit `--user="$SQL_USER"` (`kleinkunst_app`) — die App verbindet sich also als **Tabellen-Owner**, und für den Owner ist RLS ohne `FORCE` schlicht aus. Die Policies wären im Produktivbetrieb wirkungslos gewesen.
3. **`CREATE POLICY` ohne Idempotenz-Guard** in einer sonst durchgängig `IF NOT EXISTS`-Migration: der zweite Lauf brach mit `42710 duplicate_object` ab.

### Negativ-Beweis

Vollständig als Kommentar in der Migration hinterlegt; Kurzfassung:

```sql
SET LOCAL app.current_org_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO events (organization_id, title, date, slug)
VALUES ('22222222-2222-2222-2222-222222222222', 'Fremd-Event', DATE '2026-08-01', '2026-08-01-fremd-event');
-- vorher: INSERT 0 1
-- jetzt:  ERROR: new row violates row-level security policy for table "events"

UPDATE events SET organization_id = '22222222-2222-2222-2222-222222222222';
-- vorher: UPDATE n   (Zeilen wandern in eine fremde Organisation)
-- jetzt:  ERROR: new row violates row-level security policy for table "events"

-- als Tabellen-Owner kleinkunst_app:
SELECT count(*) FROM events;
-- vorher: alle Zeilen ALLER Organisationen
-- jetzt:  nur Zeilen der gesetzten app.current_org_id
```

### Was jetzt gilt

- Jede Policy hat `USING` **und** `WITH CHECK` mit identischer Bedingung. Ausnahme mit fachlicher Begründung: `event_artists` prüft im `WITH CHECK` zusätzlich, dass **auch der Künstler** zur aktuellen Organisation gehört (sonst ließe sich ein fremder Künstlerdatensatz an ein eigenes Event hängen); `organizations` und `app_users` haben bewusst nur `FOR SELECT` (siehe Bootstrap).
- `ENABLE` **und** `FORCE ROW LEVEL SECURITY` auf allen acht Tabellen — inklusive `organizations`, `app_users` und `organization_members`, die vorher komplett ohne RLS liefen (Cross-Tenant-Lesbarkeit von Mitglieder- und Personendaten).
- Alle Policies über `DROP POLICY IF EXISTS` + `CREATE POLICY` re-run-fest; die Rollenmigration ebenso (`DROP CONSTRAINT IF EXISTS` → `UPDATE` → `ADD CONSTRAINT`).
- Fail-closed ohne Kontext: `current_setting('app.current_org_id', true)` liefert `NULL`, jeder Vergleich ist damit unwahr → 0 Zeilen statt „alles".

### Folge für den Betrieb (wichtig für Sprint 2/3)

`FORCE RLS` gilt auch für den Owner. Bootstrap-Operationen — Organisation anlegen, `app_users` aus dem Identity-Provider synchronisieren, Seeds, Migrationen — dürfen deshalb **nicht** über die App-Rolle laufen, sondern brauchen

- eine getrennte Rolle mit `BYPASSRLS` (z. B. `kleinkunst_migrator`), oder
- `SECURITY DEFINER`-Funktionen mit engem, geprüftem Auftrag.

Das ist beim Provisionierungsskript nachzuziehen, sobald ein echtes Cloud-SQL-Projekt existiert (offener Punkt, siehe `HANDOVER.md`).

---

## Teil C — unveränderter Rahmen (Stand 08.07.2026)

### Empfohlener Google-Cloud-Zuschnitt

| App-Baustein | Google Cloud | Warum |
| --- | --- | --- |
| PostgreSQL | Cloud SQL for PostgreSQL | SQL/RLS-kompatibler Pfad für das bestehende Schema |
| Auth | Identity Platform / Firebase Auth | E-Mail, OAuth und Magic Links ohne eigenes Auth-System |
| Hosting | Cloud Run | Container-basierter Next.js-Betrieb mit EU-Region |
| Storage | Cloud Storage | Medien, Pressefotos, PDFs, Programmhefte |
| Jobs | Cloud Tasks oder Pub/Sub | Newsletter, Social Posts, PDF-Generierung, Webhooks |
| Secrets | Secret Manager | API-Keys und Service-Credentials getrennt vom Code |
| Scheduler | Cloud Scheduler | Erinnerungen, GEMA-Fristen, Kampagnenstarts |

Google Cloud ist ein US-Anbieter. Für DSGVO muss das Setup AVV, EU-Regionen, Datenminimierung, klare Rollen und optionale Self-Hosted-Alternativen dokumentieren (Sprint 10).

### Alternativen

| Option | Stärken | Grenzen für dieses Projekt |
| --- | --- | --- |
| Supabase | Schnellster Postgres/Auth/Storage/Realtime-Start, sehr gute DX | Siehe A3 — kein offener Bedarf, verdoppelt die Auth-/RLS-Fläche |
| Self-hosted Postgres + Keycloak + S3 | Maximale Datensouveränität, guter Fit für Hetzner/Coolify | Betrieb, Backups, Monitoring, Security-Patches selbst tragen |
| Neon | Sehr stark für Postgres-Branching und Preview-DBs | Kein vollständiges App-Backend für Auth/Storage/Realtime |
| Appwrite | Komplettes Open-Source-BaaS | Nicht Postgres-nativ; SQL/RLS-Modell müsste stark umgebaut werden |
| PocketBase | Sehr schnell für kleine Prototypen | SQLite-basiert, für Multi-Tenant-Postgres/RLS nicht passend |
| Firebase/Firestore | Ausgereift, starke Realtime-Fähigkeiten | Kein relationales Modell; GEMA/Finanz/Reporting wird komplexer |

### Vorbereitungsregeln

1. UI-Komponenten importieren nie direkt Supabase-, Firebase- oder Google-Cloud-SDKs.
2. Server-Code spricht gegen Adapter-Interfaces: `data` ([ADR 2](./data-port.md)), `auth` ([ADR 3](./auth-port.md)), später `storage`, `queue`.
3. Postgres bleibt der Datenmodell-Default.
4. Environment-Variablen werden über `.env.example` dokumentiert.
5. `organization_id` kommt **immer** serverseitig aus der Session, nie aus Formdaten oder Query-Parametern.

### Umgesetzt

- Provider-Konfiguration in `lib/config/backend.ts` (wird seit O3 vom Datenport-Factory gelesen)
- Runtime-Servicebeschreibung in `lib/server/backend/runtime.ts`
- Cloud-SQL-Readiness und Socket-Host-Ableitung in `lib/server/database/cloud-sql.ts`
- Kanonische Migration `db/migrations/202607080001_core_schema.sql` (RLS-gehärtet, 5 Rollen)
- GCP-Deployment-Skizze in `docs/deployment/google-cloud-sql.md`
- Datenport [ADR 2](./data-port.md), Auth-Port [ADR 3](./auth-port.md)

### Nächste technische Schritte

- `AuthSession` implementieren (Sprint 2, siehe ADR 3), `StorageObject`/`JobEnvelope` später.
- Bootstrap-Rolle mit `BYPASSRLS` im Provisionierungsskript ergänzen.
- Cloud-SQL-Adapter hinter dem Datenport implementieren, sobald echte Credentials vorliegen.

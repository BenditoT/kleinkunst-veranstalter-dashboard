# Sprint Opus — Event Management App (Architektur & Sicherheit, 31.07.2026)

> **Diese Datei ist selbsterklärend — keine Chat-Historie nötig.**
> Erstellt von Fable (Orchestrator) nach vollständiger Codebase-Analyse (Stand Commit `0e022d7`).
> **Voraussetzung:** Sonnet-Sprint (`sprint sonnet event app.md`) ist abgeschlossen — insbesondere S1 (E2E grün). Falls nicht: erst dort nachlesen, was offen ist.

## Kontext

Kleinkunst-Veranstalter-Dashboard, Next.js 14 + React 18 + TypeScript. 10-Sprint-Plan in `docs/sprints/README.md`; Sprint 2 (Auth & Mandantengrenze, Google Identity Platform) steht an, darf aber laut Plan erst starten, wenn Rollenmodell und Identity-Konfiguration stehen. Dieser Opus-Sprint schafft genau diese Fundamente und behebt echte Sicherheitslücken in den Migrationen. Aktuell: **kein Backend angebunden**, alle Daten aus `lib/domain/sample-data.ts` (direkt in 12 Dateien importiert), Auth ist komplett Attrappe (PIN-Gate clientseitig + Demo-Formulare, die immer Erfolg melden).

**Wichtiger Termin-Fakt:** Die Supabase-Adapter-Neubewertung war für den 24.07.2026 geplant und ist **überfällig** — Aufgabe O1 entscheidet sie.

**Qualitäts-Baseline:** `npm run quality` (Lint, Typecheck, Unit, Build) + `npm run test:e2e` müssen nach jeder Aufgabe grün bleiben. Vor Start ggf. `npm ci` + `npx playwright install chromium`.

## Scope-Grenze

**Mach NUR die Aufgaben O1–O5. Fasse NICHT an:**
- Umlaute, A11y-Quickwins, Error-Pages, CI-Workflow-Merge, UI-Duplikate (→ Sonnet-Sprint, ggf. schon erledigt)
- Keine neuen Features aus Sprint 3+ vorziehen (kein CRUD, kein Newsletter, kein Ticketing)
- `v2/index.html` ist reine UX-Referenz — kein Code daraus übernehmen

---

## Aufgaben

### O1 — Schema-Entscheidung + Adapter-Entscheidung (überfällig seit 24.07.)
Es existieren **zwei divergierende Schemata** mit unterschiedlichen Mandantenmechanismen und Rollenmodellen:
- `db/migrations/202607080001_core_schema.sql` (178 Z.): `current_setting('app.current_org_id')`, 8 Rollen (inkl. `booker`, `venue_operator`, `accountant`)
- `supabase/migrations/00000000000000_init.sql` (851 Z.): `get_current_org_id()` + `auth.uid()`, Mock-`auth`-Schema

Der Sprintplan (Sprint 2) verlangt **5 Rollen**: owner/admin/manager/member/viewer.

1. Entscheide, welches Schema die Wahrheit ist (Empfehlung des Orchestrators: `db/migrations/` als provider-neutrale Quelle behalten, Supabase-Schema als generierten Adapter-Ableger markieren oder archivieren — aber das ist DEINE Architektur-Entscheidung, begründe sie).
2. Rollenmodell auf die 5 Sprintplan-Rollen konsolidieren (CHECK-Constraints + künftiger TypeScript-Typ).
3. Supabase-Frage beantworten und dokumentieren: bleibt Google Cloud SQL Default, wird Supabase der Betriebsadapter, oder beides über den Port? Entscheidung mit Begründung nach `docs/architecture/backend-provider.md` (Datum, Konsequenzen, Revisionspunkt).

**Akzeptanz:** Genau ein kanonisches Schema; Rollenmodell = 5 Rollen; ADR in `docs/architecture/backend-provider.md` aktualisiert.

### O2 — RLS-Härtung (echtes Multi-Tenant-Bypass-Loch)
In **beiden** Migrationen:
1. Alle Policies haben `USING (…)` **ohne `WITH CHECK (…)`** — bei `FOR ALL` können INSERT/UPDATE Zeilen mit **fremder** `organization_id` schreiben. → `WITH CHECK` überall ergänzen (identische Bedingung wie `USING`, außer fachlich anders begründet).
2. `FORCE ROW LEVEL SECURITY` fehlt — verbindet sich die App als Tabellen-Owner (das Provisionierungsskript legt Schema und App-User in einem Zug an), wird RLS stillschweigend umgangen. → `ALTER TABLE … FORCE ROW LEVEL SECURITY` für alle mandantenbezogenen Tabellen.
3. `CREATE POLICY` ohne Idempotenz-Guard in sonst durchgängig idempotenten Migrationen → per `DROP POLICY IF EXISTS` + `CREATE POLICY` (oder DO-Block) re-run-fest machen. Referenz-Skills: `supabase-rls-haertung`, `sichere-massen-sql-migration`.
4. Kurzer schriftlicher Negativ-Beweis im ADR oder als SQL-Kommentar: Beispiel-Statement, das vorher durchging und jetzt scheitert.

**Akzeptanz:** Jede Policy hat `WITH CHECK`; alle Tenant-Tabellen `FORCE RLS`; Migration mehrfach ausführbar; Beweis dokumentiert.

### O3 — Daten-Port einziehen (Fundament für Sprint 2 UND 3)
`sample-data.ts` wird in 12 Dateien direkt importiert; `organization_id` kommt im gesamten TypeScript-Code **nicht vor**. Die Sprint-2-Abnahme („zwei Testorganisationen sehen gegenseitig nichts") ist so nicht testbar.
1. Entwirf ein schlankes Port-Interface `lib/data/` (z. B. `listEvents(ctx)`, `getEventBySlug(ctx, slug)`, `listVenues(ctx)`, `listArtists(ctx)`, …) mit `OrganizationContext`-Typ (`organizationId`, `role`).
2. `organization_id` in die Domain-Typen (`lib/domain/types.ts`) aufnehmen; `sample-data.ts` wird zum **In-Memory-Adapter** hinter dem Port (Demo-Daten bekommen eine Demo-Org-ID).
3. Die 12 Direkt-Importe auf den Port umhängen. Mechanische Anteile darfst du als klar beschriebene Restliste an einen Folge-Sonnet-Sprint übergeben — aber Interface, Kontext-Typ und mindestens ein vollständig umgestellter Pfad (Events) sind DEINE Arbeit.
4. **Bundle-Problem Topbar lösen:** `components/layout/topbar.tsx` (Client-Component) importiert den gesamten Datenbestand für die Suche in jedes Seiten-Bundle. Entscheide die Zielarchitektur (Suche über den Port serverseitig / vorberechneter Suchindex) und setze sie um oder spezifiziere sie präzise für den Folge-Sprint.
5. `lib/server/backend/runtime.ts`, `lib/server/database/cloud-sql.ts`, `lib/config/backend.ts` (380 Z., von keiner App-Datei importiert, nur von Tests): an den Port anbinden oder als Doku nach `docs/` verschieben und die zugehörigen „Meta-Tests" (`backend-runtime.test.ts`, `backend-plan.test.ts`, `cloud-sql.test.ts`, `deployment-assets.test.ts`, `github-pages.test.ts`) entsprechend behandeln (echte Assertions oder raus). Testphilosophie-Entscheidung dokumentieren.

**Akzeptanz:** Port-Interface + `OrganizationContext` existieren; Events-Pfad läuft komplett über den Port; kein UI-Import von `sample-data.ts` mehr im Events-Pfad; Unit-Test, der zwei Orgs anlegt und Isolation am In-Memory-Adapter beweist; `npm run quality` + E2E grün.

### O4 — Demo-Auth kapseln, Auth-Port für Sprint 2 designen
1. PIN-Gate (`components/auth/pin-gate.tsx`, `lib/auth/pin.ts`) als klar markiertes Demo-Feature hinter ein Flag (`NEXT_PUBLIC_DEMO_MODE` o. ä.) kapseln — es darf NICHT die Basis des echten Auth werden. Dokumentiere im Code, dass der statische Export die Inhalte ohnehin ungeschützt ausliefert (PIN = Sichtschutz, kein Schutz).
2. Der Demo-PIN `69198` steht an 6 Stellen (`lib/auth/pin.ts`, `.env.example`, `README.md`, `deploy-github-pages.yml`, `package.json` `build:pages`, Tests) und `tests/unit/pin-auth.test.ts` **erzwingt** den Wert (`toBe("69198")`) — Rotation unmöglich ohne rote CI. → Eine Quelle (ENV mit Fallback), Test prüft Format/Verhalten statt Wert, README verweist auf ENV.
3. Entwirf den **Auth-Port** für Sprint 2 (provider-neutral, Google Identity Platform als erste Implementierung): Session-Begriff, Rollen (die 5 aus O1), wie `organization_id` serverseitig aus der Session kommt — **niemals aus untrusted Formdaten** (Sprintplan-Leitplanke). Als Interface-Skizze + ADR, noch keine Provider-Implementierung.
4. Prüfe `deploy-google-cloud.yml` (`--allow-unauthenticated`): dokumentiere im ADR, unter welcher Bedingung das zulässig bleibt (nur Demo-Modus) und was Sprint 2 ändern muss. E2E-Zielbild festlegen: Tests laufen aktuell gegen den statischen Export — ab Sprint 2 (Sessions, Redirects, 401/403) braucht es `next start`; Entscheidung + Migrationspfad für `playwright.config.ts` dokumentieren.

**Akzeptanz:** PIN nur noch aus einer Quelle, rotierbar ohne Code-Änderung; Demo-Modus klar gekapselt; Auth-Port-ADR liegt in `docs/architecture/`; `npm run quality` + E2E grün.

### O5 — Theming-Entscheidung: Dark-Mode oder Toggle raus
Der Dark-Mode-Toggle in der Topbar ist eine Attrappe: `darkMode: "class"` + kompletter `.dark`-Variablensatz in `globals.css` existieren, aber **0 `dark:`-Utilities** im Code — alle Komponenten setzen `bg-white`/`text-slate-950` hart. Beim Klick ändert sich nur der Body-Hintergrund → wirkt kaputt.
1. Entscheide: (a) Dark-Mode richtig (semantische Tokens `bg-background`/`text-foreground`/`border-border` statt Hardcodes in allen 14 Komponenten) oder (b) Toggle entfernen und als Backlog-Punkt dokumentieren. Aufwand ehrlich abwägen — (b) ist legitim.
2. Im selben Zug (unabhängig von a/b): **Kontrast-Fixes** — `text-slate-400` auf Weiß (~2,6:1) verfehlt WCAG AA; betroffen u. a. „Kein Termin" (`calendar-workspace.tsx`), Suchgruppen-Überschriften (`topbar.tsx`). `text-slate-500` auf `bg-slate-50`-Karten grenzwertig. → AA-taugliche Token-Werte festlegen (≥ 4,5:1) und ersetzen. Der zugehörige E2E-Test (`toHaveClass(/dark/)`) wird an die Entscheidung angepasst.

**Akzeptanz:** Entweder konsistenter Dark-Mode oder kein Toggle; keine Textfarbe unter 4,5:1 auf ihrem tatsächlichen Hintergrund; Entscheidung im ADR; alles grün.

---

## Abschlusspflicht (nicht verhandelbar)

1. Alle Ergebnisse committen (kein Push — macht Norbert).
2. Falls mechanische Restarbeit aus O3 übrig ist: **diese Datei nicht erweitern**, sondern eine klar umrissene Aufgabenliste in eine neue `sprint sonnet event app.md` schreiben (alte Sonnet-Datei ist dann abgearbeitet und darf ersetzt werden).
3. **`HANDOVER.md` aktualisieren** (kanonische Datei, keine neue Version): Entscheidungen O1/O4/O5 mit einem Satz Begründung, erledigte Aufgaben, offene Reste, Sprint-2-Startfähigkeit (ja/nein + was fehlt).
4. Session-Abschluss nach Norberts Format: klickbare Links, **max. 1 Terminal-Befehl** (Push), Abschnitt **„Was Norbert jetzt tut"** mit genau EINER Handlung.

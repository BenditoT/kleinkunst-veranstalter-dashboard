# Sprint Sonnet — Event Management App (Optimierungs-Sprint, 31.07.2026)

> **Diese Datei ist selbsterklärend — keine Chat-Historie nötig.**
> Erstellt von Fable (Orchestrator) nach vollständiger Codebase-Analyse (Stand Commit `0e022d7`).

## Kontext

Kleinkunst-Veranstalter-Dashboard, Next.js 14 + React 18 + TypeScript, App Router, statischer Export für GitHub Pages. Projektordner: `Event Management App/`. Sprint 1 des 10-Sprint-Plans (`docs/sprints/README.md`) ist inhaltlich fertig (`TERRA-01` Event-Validierung, `LUNA-01` Quality Gates), aber die **formale Abnahme `ORCH-01` fehlt, weil die E2E-Kette nie lief**. Alle Daten sind Demo-Daten (`lib/domain/sample-data.ts`), es gibt kein Backend, keine API-Routen — das ist gewollt und bleibt in diesem Sprint so.

**Qualitäts-Baseline (muss nach JEDER Aufgabe grün bleiben):** `npm run quality` = Lint (0 Warnungen) + Typecheck + 39 Unit-Tests + Build. Vor Start: `npm ci` (node_modules kann in der Sandbox leer sein). Node-Version aus `.nvmrc` (24.14.0).

## Scope-Grenze

**Mach NUR die Aufgaben S1–S7 unten. Fasse NICHT an:**
- `db/migrations/`, `supabase/migrations/` (RLS/Schema → Opus)
- Datenmodell/Daten-Port, `lib/server/**`, `lib/config/backend.ts` (Architektur → Opus)
- PIN-Gate-Architektur, Auth-Seiten-Umbau (→ Opus; S6 ändert dort nur Umlaut-Strings)
- Dark-Mode/Design-Tokens (→ Opus). Kein `dark:`-Utility einführen.
- Nichts Zusätzliches „verbessern", keine neuen Dependencies außer den unten genannten Dev-Tools.

---

## Aufgaben

### S1 — E2E-Kette grün bekommen (ORCH-01-Abnahme) — HÖCHSTE PRIORITÄT
1. `npm ci` (falls nötig), dann `npx playwright install chromium`.
2. `npm run test:e2e` — alle 10 Tests in `tests/e2e/app.spec.ts` müssen grün sein.
3. Bei roten Tests: **NIE Timeouts/Retries erhöhen.** Screenshot/Trace auswerten, echte Ursache im App-Code finden (siehe Skill `flaky-ci-echter-bug-diagnose`).

**Akzeptanz:** `npm run test:e2e` läuft komplett grün, Ergebnis (Anzahl Tests, Laufzeit) in der Übergabe dokumentiert.

### S2 — CI-Gates zusammenführen
Problem: `quality.yml` läuft nur bei `pull_request`, `deploy-github-pages.yml` (mit E2E) nur bei `push` auf main — **kein Lauf prüft alle fünf Stufen**. Ein Direkt-Push nach main deployt ohne Lint/Typecheck/Unit.
1. `quality.yml`: Trigger um `push: branches: [main]` erweitern und einen E2E-Job ergänzen (Playwright-Browser-Install + `npm run test:e2e`, nach dem Quality-Job).
2. `deploy-github-pages.yml`: Lint/Typecheck/Unit vor dem E2E-Schritt ergänzen (oder via `workflow_call` auf quality verweisen — einfachste saubere Lösung wählen).
3. `basePath` `/kleinkunst-veranstalter-dashboard` ist 3× dupliziert (`next.config.mjs`, `playwright.config.ts`, `tests/e2e/app.spec.ts`) — aus einer Konstante/ENV beziehen.

**Akzeptanz:** Beide Workflows enthalten alle 5 Stufen (Lint, Typecheck, Unit, Build, E2E); basePath nur noch an einer Stelle definiert; `npm run quality` + `npm run test:e2e` lokal grün.

### S3 — Error-Boundaries, deutsche Fehlerseiten, Ladezustände
Aktuell existiert **keine** `error.tsx`/`not-found.tsx`/`loading.tsx` — die Detailseiten rufen `notFound()` und landen auf der englischen Next-Default-Seite (verstößt gegen DoD „deutsche Fehlermeldungen").
1. `app/not-found.tsx` — deutsche 404-Seite im App-Design (Link zurück zum Dashboard).
2. `app/error.tsx` + `app/global-error.tsx` — deutsche Fehlerseiten mit „Erneut versuchen"-Button.
3. `app/veranstaltungen/page.tsx`: Der `<Suspense>`-Fallback rendert aktuell die komplette ungefilterte Tabelle (doppelte Arbeit, Flash) — durch schlanken Tabellen-Skeleton ersetzen (Stil-Referenz: `PinScreenSkeleton` in `components/auth/pin-gate.tsx`).

**Akzeptanz:** Aufruf einer nicht existierenden Route und eines ungültigen Slugs zeigt die deutsche 404; E2E-Test für die 404-Seite ergänzt; alles grün.

### S4 — Umlaute vereinheitlichen (~35 Stellen)
UI-Strings nutzen ASCII-Transliteration („Kuenstler", „Uebersicht", „Zurueck", „Kapazitaet", „Menue", „schliessen" …), während die Sprint-1-Validierungsmeldungen echte Umlaute haben — inkonsistent auf derselben Seite.
1. Alle Transliterationen in `components/**`, `app/**`, `lib/domain/module-content.ts`, `lib/domain/sample-data.ts` durch echte Umlaute ersetzen (auch `aria-label`s: „Naechste Woche" → „Nächste Woche").
2. **E2E-Selektoren und `searchTerms` synchron mitziehen** (`tests/e2e/app.spec.ts` matcht auf sichtbare Texte!). Auch Unit-Tests prüfen (`domain.test.ts`).
3. URLs/Routen-Pfade (`/kuenstler`) NICHT ändern — nur sichtbare Strings.

**Akzeptanz:** `grep -rE "Kuenstler|Uebersicht|Zurueck|Kapazitaet|Plaetze|Menue|Buehne|faellig|Veroeffentlicht" app components lib` liefert 0 Treffer in UI-Strings; `npm run quality` + E2E grün.

### S5 — Code-Duplikate konsolidieren
1. `getArtistNames(artistIds)` existiert 3× (`dashboard-home.tsx:364`, `events-workspace.tsx:252`, inline in `event-detail.tsx:16`) → einmal nach `lib/domain/events.ts`, mit Lookup-Map statt `.find()` in Schleifen.
2. Statuslabel 3× (`format.ts` `getStatusLabel`, `dashboard-home.tsx` `getCompactStatusLabel`, `events-workspace.tsx` `eventStatuses`) → in `lib/domain/format.ts` zusammenführen.
3. `detectVenueConflicts(...)` wird in `events-workspace.tsx` **2× pro Render** gerufen (O(n²)) → einmal berechnen (`useMemo`), Ergebnis an `ConflictPanel` durchreichen. In `calendar-workspace.tsx` die Event-Filterung pro Tag (läuft 7×/Render) in ein `useMemo`-gruppiertes Objekt ziehen.
4. Wiederholtes UI-Markup in `components/ui/` extrahieren: `ProgressBar` (Tickets/Auslastung, identisch in `dashboard-home.tsx` + `events-workspace.tsx`), `StatCard`/`InfoTile` (mehrfach lokal definiert).
5. Die 3 zeichengleichen Detailseiten (`veranstaltungen/[slug]`, `spielorte/[id]`, `kuenstler/[id]`) und 3 Auth-Seiten NUR konsolidieren, wenn es ohne Verhaltensänderung geht — sonst lassen (Opus baut die Auth-Seiten eh um).

**Akzeptanz:** Keine doppelte Definition der genannten Helper mehr; Verhalten identisch (E2E grün); `npm run quality` grün.

### S6 — Accessibility-Quickwins (Umsetzung nach Checkliste)
Referenz: Skill `mobile-touch-a11y-quickwins`. Nur Semantik/Verhalten — KEINE Farbänderungen (Kontrast-Tokens macht Opus).
1. Suchfeld in `components/layout/topbar.tsx`: `aria-label="Suche"`, Ergebnisliste als Combobox (`role="combobox"`/`listbox`, `aria-expanded`, Pfeiltasten-Navigation), Trefferzahl als Live-Region. Das angezeigte ⌘K-Badge funktional machen (Cmd/Ctrl+K fokussiert die Suche).
2. Notification-Popover + Such-Overlay: Escape schließt, Klick außerhalb schließt, Fokus-Rückgabe auf den Trigger.
3. Skip-Link „Zum Inhalt springen" als erstes fokussierbares Element in `app-shell.tsx`.
4. Fortschrittsbalken: `role="progressbar"` + `aria-valuenow/min/max`.
5. Roter Notification-Dot: `sr-only`-Textalternative („Neue Benachrichtigungen").
6. `SidebarCollapseButton`: `aria-expanded` + `aria-controls`. Die drei `<nav>`-Landmarks eindeutig labeln (Desktop-Sidebar bekommt `aria-label="Hauptnavigation"`).
7. `app/globals.css`: `@media (prefers-reduced-motion: reduce)`-Block, der Transitions/`animate-fade-in`/`shimmer` deaktiviert.

**Akzeptanz:** Alle 7 Punkte umgesetzt; Tastatur-Durchlauf (Tab/Escape/Pfeiltasten/⌘K) funktioniert; E2E grün, idealerweise 1–2 neue E2E-Checks (⌘K, Escape).

### S7 — Security-Header + eingefrorene Datumswerte
1. `next.config.mjs`: `headers()` mit CSP (mind. `frame-ancestors 'none'`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`. Hinweis: wirkt nur im Server-Build, nicht im statischen Export — trotzdem jetzt setzen, mit Kommentar.
2. Eingefrorene Daten injizierbar machen: `const referenceDate = new Date("2026-07-08T12:00:00+02:00")` (`dashboard-home.tsx:20`, `event-detail.tsx:21`) und `baseWeekStart = new Date(2026, 6, 8)` (`calendar-workspace.tsx:11`) → als optionalen Prop/Parameter `now` mit Default `new Date()`. Der Text „Heute 08. Juli 2026" wird aus `now` formatiert. Tests übergeben ein fixes Datum (deterministisch), App nutzt echtes Heute.
3. Prüfen, dass die E2E-Tests danach nicht auf das fixe Juli-Datum angewiesen sind — falls doch, Tests auf injiziertes Datum umstellen, nicht die App zurückbauen.

**Akzeptanz:** „Heute"-Button springt auf das echte Tagesdatum; Unit-Tests deterministisch; `npm run quality` + E2E grün.

---

## Abschlusspflicht (nicht verhandelbar)

1. Alle Ergebnisse committen (kein Push — macht Norbert).
2. **`HANDOVER.md` des Projekts aktualisieren** (kanonische Datei, keine neue Version): erledigte Aufgaben S1–S7, Testergebnisse, offene Reste.
3. Session-Abschluss nach Norberts Format: klickbare Links auf Ergebnisdateien, **max. 1 Terminal-Befehl** (der Push), Abschnitt **„Was Norbert jetzt tut"** mit genau EINER Handlung (z. B. „Push ausführen, dann `sprint opus event app.md` in neuer Opus-Session öffnen").

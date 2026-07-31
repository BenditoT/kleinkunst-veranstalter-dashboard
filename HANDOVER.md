# HANDOVER — Event Management App (Kleinkunst-Veranstalter Dashboard)

**Ziel / Fertig wenn:** Provider-neutrale, mandantenfähige Next.js-Veranstaltungsplattform für Kleinkunst-Spielstätten (Events, Kalender, GEMA, Finanzen, Newsletter, Presse, Ticketing, KI-Assistent). Fertig laut `docs/sprints/README.md`: alle 10 Sprints abgeschlossen — insbesondere Sprint 10 (DSGVO, Resilienz, Produktion). Bis dahin: kein produktiver Go-Live mit echten Personendaten.

## Stand (31.07.2026 — Sonnet-Sprint S1–S7 abgeschlossen)

Alle sieben Aufgaben aus `sprint sonnet event app.md` sind erledigt und committet (noch nicht gepusht). `npm run quality` (Lint, Typecheck, 39 Unit-Tests, Build) **und** `npm run test:e2e` (12 Tests) laufen komplett grün.

- **S1 — E2E-Kette grün (ORCH-01-Abnahme):** Alle 10 Playwright-Tests liefen zuvor nie durch die Sandbox (fehlende `libXdamage.so.1`), nicht wegen eines App-Bugs. Nach Klärung liefen alle Tests grün — ORCH-01 ist damit formal erfüllt.
- **S2 — CI-Gates zusammengeführt:** `quality.yml` läuft jetzt auch bei `push: main` und per `workflow_call`, plus eigener E2E-Job. `deploy-github-pages.yml` ruft `quality.yml` per `needs:` auf, bevor gebaut/deployt wird. `basePath` kommt jetzt aus einer einzigen Quelle: `lib/config/site.mjs`.
- **S3 — Fehlerseiten/Ladezustand:** Neue deutsche `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx` (mit „Erneut versuchen"). `scripts/serve-pages.mjs` liefert bei unbekannten Pfaden jetzt `404.html` aus (wie echtes GitHub Pages) statt Klartext „Not found". Neuer schlanker `EventsTableSkeleton` statt der bisherigen kompletten Tabellen-Render im Suspense-Fallback. Neuer E2E-Test für die 404-Seite.
- **S4 — Umlaute vereinheitlicht:** Alle ASCII-Transliterationen in `app/`, `components/`, `lib/domain/module-content.ts`, `lib/domain/sample-data.ts` durch echte Umlaute ersetzt (inkl. `aria-label`s und Code-Kommentare). Verifiziert per `grep` — 0 Treffer.
- **S5 — Duplikate konsolidiert:** `getArtistNames` (mit gecachter Lookup-Map) und `detectVenueConflicts`-Aufruf in `lib/domain/events.ts` zusammengeführt; Statuslabels in `lib/domain/format.ts` (`getCompactStatusLabel`, `eventStatusFilterOptions`); neue geteilte UI-Bausteine `components/ui/progress-bar.tsx` und `components/ui/info-row.tsx` ersetzen 6 identische lokale Kopien; Kalender-Wochenansicht gruppiert Events jetzt einmal per `useMemo` statt 14 Array-Scans pro Render.
- **S6 — Accessibility-Quickwins:** Suchfeld ist jetzt ein echtes Combobox/Listbox-Pattern mit Pfeiltasten-Navigation, `aria-live`-Trefferzahl und funktionalem ⌘K-Shortcut; Notification-Popover und Such-Overlay schließen per Escape/Klick-außerhalb mit Fokus-Rückgabe; Skip-Link „Zum Inhalt springen"; alle drei Nav-Landmarks eindeutig gelabelt (Hauptnavigation/Mobile Navigation/Navigation); `SidebarCollapseButton`/`-RestoreButton` mit `aria-expanded`/`aria-controls`; roter Notification-Dot hat sr-only-Text; `prefers-reduced-motion`-Block in `globals.css`. Zwei neue E2E-Checks (⌘K, Escape).
- **S7 — Security-Header + injizierbares Datum:** `next.config.mjs` setzt CSP/`X-Content-Type-Options`/`Referrer-Policy`/`Permissions-Policy` für den Node-Server-Build (nicht für den statischen Export — dokumentiert im Code, da Next dort keine Header setzen kann). Neues `lib/domain/now.ts` (`getReferenceNow()`): Produktiv `new Date()`, per `NEXT_PUBLIC_FIXED_NOW` (nur im E2E-Build gesetzt, siehe `playwright.config.ts`) deterministisch für Tests. `DashboardHome`, `EventDetail`, `CalendarWorkspace` nutzen das statt hartkodierter 2026-07-08-Daten.

**Wichtig:** Vor Sessionbeginn war die Sandbox in einem kaputten Zustand (Symlinks `node_modules`/`.next` zeigten auf eine nicht mehr existierende andere Session). Das wurde behoben (Löschung erlaubt, `npm ci` neu ausgeführt) — betrifft nur die Sandbox, nicht das Repo.

## Offene Punkte
1. **Push nach `origin/main`** — durch Norbert (Befehl unten).
2. **Danach Opus-Session:** `sprint opus event app.md` abarbeiten (O1–O5: Schema-/Supabase-Entscheidung, RLS-Härtung, Daten-Port + `organization_id`, Demo-Auth kapseln, Theming/Kontrast). Voraussetzung war „grüne E2E" — jetzt erfüllt.
3. Sprint 2 (Auth/Mandantengrenze) startet erst, wenn O1 (Rollenmodell) + O4 (Auth-Port) entschieden sind.

## Nächster Schritt
Push ausführen (Befehl unten), dann `sprint opus event app.md` in einer neuen **Opus**-Session öffnen.

## Mach weiter
> Ich arbeite an der „Event Management App" (Kleinkunst-Veranstalter Dashboard, Next.js 14 + React 18 + TypeScript). Der Sonnet-Sprint (S1–S7) ist abgeschlossen und committet. Lies zuerst `HANDOVER.md`, dann `sprint opus event app.md` (Architektur/Sicherheit O1–O5). `npm run quality` + `npm run test:e2e` müssen nach jeder Aufgabe grün bleiben; vor Start ggf. `npm ci` und `npx playwright install chromium` (in Sandboxen ggf. `libXdamage.so.1` fehlend — nicht die App, sondern die Umgebung).

## Ressourcen & Dateien
- `sprint opus event app.md` — nächster Sprint-Auftrag (Architektur/Sicherheit)
- `sprint sonnet event app.md` — abgeschlossener Sprint (S1–S7), als Referenz
- `docs/sprints/README.md` — vollständiger 10-Sprint-Plan, Rollen, Definition of Done
- `lib/domain/now.ts` — injizierbares „heute" (S7); `lib/config/site.mjs` — einzige Quelle für den GitHub-Pages-basePath (S2)
- `components/ui/progress-bar.tsx`, `components/ui/info-row.tsx` — neue geteilte UI-Bausteine (S5)
- `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx` — deutsche Fehlerseiten (S3)
- `.github/workflows/` — `quality.yml` (PR + push:main + workflow_call, inkl. E2E-Job), `deploy-github-pages.yml` (ruft quality.yml per `needs` auf)
- `db/migrations/` vs. `supabase/migrations/` — zwei divergierende Schemata, Entscheidung = O1 (Opus)
- `v2/` — Preact+htm UX-Demo (GitHub Pages), NICHT die Produktarchitektur, nur UX-Referenz

## Hinweise & Stolpersteine
- `node_modules`/`.next` in der Sandbox können auf eine tote andere Session verweisen (Symlink) → Löschung erlauben, `npm ci` neu.
- Playwright-Browser brauchen `libXdamage.so.1` — fehlt in manchen Sandboxen ohne `sudo`; notfalls `.deb` per `apt-get download` ziehen, mit `dpkg-deb -x` entpacken, `LD_LIBRARY_PATH` setzen (kein Repo-Fix nötig, nur Sandbox).
- `ulimit -n` in der Sandbox ggf. auf einen hohen Wert setzen (`ulimit -n 65536`) — sonst brechen Lint/Build sporadisch mit `ENFILE` ab (Datei-Handle-Erschöpfung beim Kopieren von `node_modules`, kein Code-Bug).
- `organization_id` NIE aus untrusted Formdaten — nur serverseitig aus der Session (Sprintplan-Leitplanke Sprint 2).
- Bei rotem Test: NIE Timeouts erhöhen — Trace/Screenshot auswerten (Regel + Skill `flaky-ci-echter-bug-diagnose`).

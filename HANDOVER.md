# HANDOVER — Event Management App (Kleinkunst-Veranstalter Dashboard)

**Ziel / Fertig wenn:** Provider-neutrale, mandantenfähige Next.js-Veranstaltungsplattform für Kleinkunst-Spielstätten (Events, Kalender, GEMA, Finanzen, Newsletter, Presse, Ticketing, KI-Assistent). Fertig laut `docs/sprints/README.md`: alle 10 Sprints abgeschlossen — insbesondere Sprint 10 (DSGVO, Resilienz, Produktion) mit bestandenem Security-, Accessibility-, Last- und Restore-Smoke-Test in Staging. Bis dahin: kein produktiver Go-Live mit echten Personendaten.

## Stand (16.07.2026)
- **Sprintplan steht** (`docs/sprints/README.md`, 13.07.2026): 10 Sprints à 2 Wochen, Sprint 1 lief 13.–24.07.2026.
- **Sprint 1 in dieser Session abgeschlossen und committet** (Commit `baf7e8b`): `TERRA-01` (fachliche Event-Validierung, deutsche Fehlermeldungen) + `LUNA-01` (reproduzierbare Quality Gates: `.nvmrc`, `npm run quality`, PR-CI `quality.yml`).
- **`npm run quality` lief in dieser Session vollständig grün:** Lint (ESLint, 0 Warnungen/Fehler), Typecheck (`tsc --noEmit`, 0 Fehler), Unit-Tests (Vitest, **39/39 grün**, davon 16 neu für `event-validation.ts`), Build (Next.js, 33 statische Routen erfolgreich generiert).
- **E2E (Playwright) in dieser Session NICHT ausgeführt** — Browser-Installation (`npx playwright install`) hätte den Scope gesprengt; laut `docs/sprints/README.md` ist die volle E2E-Kette Teil der `ORCH-01`-Abnahme, aber noch offen.
- `node_modules` war zu Sessionbeginn leer (Sandbox-Zustand) — `npm ci` in dieser Session nachgeholt (425 Pakete), damit die Gates überhaupt lauffähig waren.
- Remote ist gesetzt, `git status` zeigte vor dieser Session "up to date with origin/main" für den vorherigen Commit `cfc547f` — kein Push in dieser Session (Regel: nie pushen).

## Offene Punkte
1. E2E-Kette (Playwright) ausführen und grün bekommen, um `ORCH-01`/Sprint-1-Abnahme formal abzuschließen (`npx playwright install` + `npm run test:e2e`).
2. Sprint 2 (Authentifizierung & Mandantengrenze, Google Identity Platform) — startet laut Plan erst nach bestätigter Identity-Platform-Konfiguration und Rollenmodell.
3. Ab/nach 24.07.2026: Supabase als Daten-/Betriebsadapter neu bewerten (nur Adapter-Entscheidung, nicht die Facharchitektur).
4. Push nach `origin/main` — durch Norbert, sobald er den Stand freigibt (in dieser Session bewusst nicht gepusht).

## Nächster Schritt
E2E-Tests lokal/ CI grün bekommen (Playwright-Browser installieren, `npm run test:e2e`), danach Sprint-1-Abnahme (`ORCH-01`) formal abhaken und Sprint 2 (Auth/Mandantengrenze) planen.

## Mach weiter
> Ich arbeite an der „Event Management App" (Kleinkunst-Veranstalter Dashboard, Next.js 14 + React 18 + TypeScript, `Event Management App/`). Lies `docs/sprints/README.md` für den vollen 10-Sprint-Plan.
>
> **Ziel:** Mandantenfähige Veranstaltungsplattform für Kleinkunst-Spielstätten, aktuell in Sprint 1 von 10.
> **Erledigt:** Sprint 1 (`TERRA-01` Event-Validierung + `LUNA-01` Quality Gates/CI) — `npm run quality` (Lint, Typecheck, 39 Unit-Tests, Build) läuft grün, committet als `baf7e8b`.
> **Nächste Aufgabe:** E2E-Kette (Playwright) grün bekommen, dann Sprint-1-Abnahme abschließen, dann Sprint 2 (Auth/Mandantengrenze mit Google Identity Platform) starten.
> **Kontext:** Google Cloud ist Backend-Default, Supabase-Entscheidung erst ab 24.07.2026. `v2/index.html` ist nur UX-Demo, nicht die Produktionsarchitektur. Deutsche Fehlermeldungen und Mandantentrennung sind Pflicht ab Sprint 1.
>
> Bitte fang an mit `npx playwright install` + `npm run test:e2e`, um die Sprint-1-Abnahme zu vervollständigen.

## Ressourcen & Dateien
- `docs/sprints/README.md` — vollständiger 10-Sprint-Plan, Rollen (Terra/Luna/Orchestrierung), Definition of Done
- `lib/domain/event-validation.ts`, `tests/unit/event-validation.test.ts` — Sprint-1-Ergebnis TERRA-01
- `.github/workflows/quality.yml` — PR-CI (Lint/Typecheck/Test/Build), Sprint-1-Ergebnis LUNA-01
- `.nvmrc` (24.14.0), `package.json` (`npm run quality`)
- `components/events/event-form-screen.tsx` — Formular mit integrierter Validierung
- `v2/` — eigenständige Preact+htm UX-Demo (GitHub Pages), NICHT die Produktarchitektur
- `.env.example`, `supabase/`, `db/` — Backend-Adapter-Vorbereitung

## Heimat-Rechner
Nicht explizit dokumentiert (unklar, Vermutung: MacBook, wie die anderen aktiven Projekte — im Dashboard prüfen).

## Hinweise & Stolpersteine
- `node_modules` ist in der Sandbox nicht immer vorhanden/aktuell — vor Tests ggf. `npm ci` nachholen.
- E2E-Tests brauchen installierte Playwright-Browser (`npx playwright install`), das ist in der Sweep-Session bewusst nicht gemacht worden (Zeit-/Scope-Grund, kein Blocker-Fund).
- `organization_id` darf ab Sprint 2 NIE aus untrusted Formdaten übernommen werden, nur serverseitig aus der Session (siehe Sprintplan Sprint 2 Akzeptanzkriterien) — wichtige Sicherheitsleitplanke für später.

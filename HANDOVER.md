# HANDOVER — Event Management App (Kleinkunst-Veranstalter Dashboard)

**Ziel / Fertig wenn:** Provider-neutrale, mandantenfähige Next.js-Veranstaltungsplattform für Kleinkunst-Spielstätten (Events, Kalender, GEMA, Finanzen, Newsletter, Presse, Ticketing, KI-Assistent). Fertig laut `docs/sprints/README.md`: alle 10 Sprints abgeschlossen — insbesondere Sprint 10 (DSGVO, Resilienz, Produktion). Bis dahin: kein produktiver Go-Live mit echten Personendaten.

## Stand (28.08.2026 — Auth-Nachweis im Server-Pfad (S1–S4) abgeschlossen, committet)

Der Anmelde- und Mandantenpfad ist jetzt nicht mehr nur durch Unit-Tests belegt, sondern läuft im Browser gegen einen echten Node-Server. `npx playwright test` startet **drei Projekte** und **24 Tests**: `chromium` (12, statischer Demo-Export mit PIN-Gate — unverändert), `server-setup` (4, meldet die Testpersonen an und legt `storageState` ab) und `server` (8 negative Fälle gegen `NEXT_PUBLIC_DEMO_MODE=false`).

- **S1 — Zweites Playwright-Projekt:** zwei `webServer`-Einträge nebeneinander (statischer Export auf Port 4174, Node-Server auf 4175). Damit sich die beiden Builds nicht gegenseitig `.next` überschreiben, kennt `next.config.mjs` jetzt `NEXT_DIST_DIR` (ohne die Variable bleibt alles wie bisher); der Server-Build läuft mit `.next-server`. Das Signatur-Geheimnis für den Testlauf steht fest in `playwright.config.ts` — kein Produktivgeheimnis.
- **S2 — Rollen-Fixtures:** `tests/e2e/server/auth.setup.ts` meldet vier erfundene Testpersonen über `/api/auth/login` an und legt je einen `storageState` unter `tests/e2e/server/.auth/` ab (in `.gitignore`). Zugänge und Organisations-IDs zentral in `tests/e2e/server/test-accounts.ts`.
- **S3 — Acht negative E2E-Fälle** (`tests/e2e/server/auth.spec.ts`): unangemeldeter Aufruf → `/login?returnTo=…`; falsches Passwort → 401 ohne Session-Cookie; sechster Fehlversuch → 429 mit eigener Meldung; `viewer` → „Keine Berechtigung", Formular **gar nicht im DOM**; `viewer` darf weiterhin lesen; fremde `?org=` → 403 ohne durchscheinende Daten; Organisationswechsel per API auf fremde Organisation → 403 ohne Namensverrat; nach Abmelden wieder Redirect auf `/login`.
- **S4 — CI und Doku:** `quality.yml` führt über `npm run test:e2e` automatisch alle drei Projekte aus (der Pages-Deploy hängt per `needs:` daran). `README.md` hat einen Abschnitt „Lokal mit Anmeldung testen" samt Testzugangstabelle; `docs/architecture/auth-port.md` Entscheidung 5 ist auf den Umsetzungsstand gebracht.

**Gegenprobe statt Vertrauen:** Mit ausgehängtem Rollen-Guard (`hasRoleAtLeast` → immer `true`) und ausgehängtem Mitgliedschafts-Guard (`forbidden` → `allow`) werden genau die beiden zuständigen Tests rot — die Tests prüfen also wirklich etwas.

**Zwei Erkenntnisse, die Zeit kosten können:** `page.request` schickt den `SameSite=Lax`-Session-Cookie bei POST nicht mit (Ergebnis wäre 401 statt der interessanten 403) — solche Anfragen laufen deshalb per `page.evaluate(fetch …)` aus der Seite heraus. Und `next start` warnt bei `output: "standalone"`, funktioniert für den Testlauf aber vollständig.

## Vorheriger Stand (22.08.2026 — Sprint 2 „Auth & Mandantengrenze" (O6–O8) abgeschlossen, committet)

Die Demo-PIN und die simulierten Anmeldeformulare sind durch einen echten, provider-neutralen Auth-Port ersetzt. `npm run lint`, `npm run typecheck`, `npm test` (**87** Unit-Tests), `npm run build`, `npm run build:pages` (statischer Export) und `npx playwright test` (**12** E2E) sind grün.

- **O6 — Auth-Port implementiert** (`7850e9c`): `lib/auth/adapters/local-credentials.ts` als lokaler Test-Adapter gegen dieselbe `AuthPort`-Schnittstelle, die später der Identity-Platform-Adapter erfüllt. Passwörter mit `crypto.scrypt` gehasht und per `timingSafeEqual` geprüft (Dummy-Hash für unbekannte E-Mails, damit die Rechenzeit nicht verrät, wer existiert). Session als signiertes `httpOnly`+`secure`+`SameSite=Lax`-Cookie (`lib/auth/session-cookie.ts`), serverseitig verifiziert. Rate-Limiting real verdrahtet (5 Fehlversuche / 15 Min pro E-Mail+IP, der sechste wird gar nicht mehr geprüft). Login-, Register- und Reset-Formular hängen an `/api/auth/*` und liefern echte deutsche Fehlermeldungen.
- **O7 — Mandantengrenze verdrahtet** (`1849a5e`): `getRequestOrganizationContext()` (`lib/data/index.ts`) holt den Kontext aus der Session statt hartcodiert aus der Demo-Organisation; ohne Mitgliedschaft `OrganizationAccessError` (403), **kein** stiller Rückfall auf Demodaten. `middleware.ts` + `lib/auth/route-guard.ts` schützen alles außer `/login`, `/register`, `/forgot-password` und den Auth-Endpunkten (Positivliste — eine neue Route ist automatisch geschützt). Unauthentifiziert → Redirect auf `/login?returnTo=…`; angemeldet ohne Mitgliedschaft → 403, bewusst kein Redirect (sonst Anmeldeschleife). Organisationswechsel nur über `/api/auth/organization` als geprüfte Aktion, nie über Query-Parameter. Neu: `getPrerenderOrganizationContext()` für `generateStaticParams()`, weil es zur Buildzeit per Definition keine Session gibt.
- **O8 — RBAC serverseitig durchgesetzt** (`5dbd5ea`): `lib/auth/rbac.ts` als **einzige** Stelle, die die Rollenrangfolge auswertet (`AuthPort.hasRoleAtLeast()` delegiert dorthin, statt sie ein zweites Mal zu interpretieren). Schreibschwelle ist `member`, `viewer` ist reine Lese-Rolle. `/veranstaltungen/neu` prüft die Rolle **vor** dem Laden der Daten und liefert dem `viewer` `AccessDeniedNotice` statt des Formulars — das Formular wird gar nicht erst ausgeliefert. `tests/unit/rbac.test.ts` (10 Tests) beweist das Verhalten, nicht nur die Typen: unbekannte Rolle → kein Zugriff, `viewer` → `RoleRequiredError` (403) ohne Organisationsdetails in der Meldung, hohe Rolle in Organisation A erzeugt kein Schreibrecht in B.

**Zwei Welten, ein Schalter** (`lib/auth/mode.ts`): `NEXT_PUBLIC_DEMO_MODE` an (Default) = statischer GitHub-Pages-Export, keine Middleware, keine API-Routen — dort gilt weiterhin das PIN-Gate als Sichtschutz und die harte Regel „nur erfundene Daten". `NEXT_PUBLIC_DEMO_MODE=false` = Node-Server-Pfad (`output: "standalone"`), PIN verschwindet, dafür greifen Middleware, Session-Prüfung und Mandantengrenze. Ein Schalter statt zwei, damit es keinen Zustand geben kann, in dem weder das eine noch das andere greift.

**Scope eingehalten:** `lib/auth/port.ts`, `lib/data/port.ts`, `db/migrations/`, `supabase/archive/` nicht angefasst. Keine neuen Dependencies. Kein Dark-Mode. Kein GCP-Setup.

## Offene Punkte

1. **Push nach `origin/main`** — durch Norbert (Befehl unten). Der Push löst die GitHub-Action aus: Qualitäts-Gate (Lint, Typecheck, Unit, Build, E2E über alle drei Projekte) und bei Grün automatisch den GitHub-Pages-Deploy. Es sind **2 Commits** unterwegs.
2. **Erster CI-Lauf mit dem Server-Projekt beobachten** — lokal grün, aber der GitHub-Runner baut zweimal (statischer Export + Node-Server) und startet zwei Server parallel. Sollte das Zeitbudget knapp werden, ist der Server-Build der Kandidat fürs Cachen. Bei Rot: Trace/Screenshot aus dem `playwright-report`-Artefakt auswerten, **nicht** Timeouts erhöhen.
3. **GCP-Blocker (nur Norbert):** Ein echter Identity-Platform-Adapter braucht ein Google-Cloud-Projekt mit OAuth-Credentials (Account, ggf. Billing). `lib/auth/adapters/identity-platform.ts` bleibt bis dahin Platzhalter. Alles außer der Provider-Anbindung selbst ist fertig und getestet.
4. **`SESSION_SECRET` für den Server-Pfad** — im Produktivbetrieb aus Secret Manager, mindestens 32 Zeichen. Steht in `.env.example`, ist nirgends im Repo als Wert hinterlegt.
5. **Bootstrap-Rolle mit `BYPASSRLS`** im Provisionierungsskript nachziehen, sobald ein echtes Cloud-SQL-Projekt existiert — `FORCE RLS` gilt auch für den App-Owner (unverändert offen seit O2).
6. **Kein Backend real angebunden** — weiterhin `DATA_ADAPTER=in-memory`. Der Datenport hat bewusst noch keine Schreibmethoden; CRUD ist Sprint 3.

## Nächster Schritt

Push ausführen (Befehl unten) und den CI-Lauf beobachten. Danach **Sprint 3 (CRUD)** — der Datenport hat bewusst noch keine Schreibmethoden, und mit sauberem Kontext- und Rollenpfad ist das jetzt gefahrlos möglich. Sprint 2 ist damit vollständig abgeschlossen, `sprint sonnet event app.md` ist abgearbeitet und darf beim nächsten Auftrag ersetzt werden.

## Mach weiter

> Ich arbeite an der „Event Management App" (Kleinkunst-Veranstalter Dashboard, Next.js 14 + React 18 + TypeScript). Sprint 2 (Auth & Mandantengrenze) ist vollständig abgeschlossen und committet, inklusive E2E-Nachweis im Server-Pfad. Lies `HANDOVER.md`, dann `docs/sprints/README.md` für Sprint 3 (CRUD über den Datenport). `npm run lint`/`typecheck`/`test`/`build` und `npx playwright test` müssen nach jeder Aufgabe grün bleiben (Baseline: **87** Unit-Tests, **24** E2E in drei Projekten). Sandbox-Stolpersteine stehen unten in dieser Datei.

## Ressourcen & Dateien

- `docs/architecture/backend-provider.md` (ADR 1), `data-port.md` (ADR 2), `auth-port.md` (ADR 3 — jetzt umgesetzt), `theming.md` (ADR 4)
- `lib/auth/` — `port.ts` (Interface, NICHT ändern), `adapters/local-credentials.ts` (Test-Adapter), `adapters/identity-platform.ts` (Platzhalter), `session-cookie.ts`, `password.ts`, `password-policy.ts`, `rate-limit.ts`, `rbac.ts` (Rollenregel), `route-guard.ts` (Guard-Entscheidung), `mode.ts` (Demo/Server-Schalter), `errors.ts`, `test-users.ts` (erfundene Personen), `pin.ts` (Demo-Sichtschutz)
- `middleware.ts` — erste Verteidigungslinie; `lib/data/index.ts` — zweite (Kontext + Mitgliedschaft)
- `app/api/auth/` — `login`, `logout`, `register`, `password-reset`, `organization`
- `tests/unit/` — `auth-port.test.ts` (18), `route-guard.test.ts` (9), `rbac.test.ts` (10), `data-port.test.ts` (8, Mandantentrennung + Regressionstest gegen Direktimporte)
- `tests/e2e/app.spec.ts` — Demo-Export (12); `tests/e2e/server/` — `auth.setup.ts` (Anmeldung + `storageState`), `auth.spec.ts` (8 negative Fälle), `test-accounts.ts` (Testzugänge, erfundene Personen)
- `docs/sprints/README.md` — vollständiger 10-Sprint-Plan
- `v2/` — Preact+htm UX-Demo (GitHub Pages), NICHT die Produktarchitektur, nur UX-Referenz

## Hinweise & Stolpersteine

- `organization_id` NIE aus untrusted Formdaten/URL/Cookie — nur serverseitig aus der Session. Der `?org=`-Parameter ist ausdrücklich nur ein *Wunsch* und wird immer gegen `session.memberships` geprüft.
- Rollenprüfung im Client (Button ausblenden) ist Bequemlichkeit, kein Schutz — die Ablehnung muss serverseitig passieren.
- `FORCE ROW LEVEL SECURITY` gilt auch für den Tabellen-Owner — Bootstrap/Seed/Migration brauchen eine eigene Rolle mit `BYPASSRLS`.
- Die Demo-PIN ist **kein Secret und kein Auth** — nur Sichtschutz für die öffentliche GitHub-Pages-Demo mit ausschließlich erfundenen Daten.
- **Der Ordner-Mount ist für `next build` zu langsam** (Tool-Timeout schneidet ab). Lösung: Projekt ohne `node_modules`/`.next`/`.git` per `tar`-Pipe nach `/tmp/emapp` kopieren, dort `npm ci` (~90 s) und bauen (~11 s). Hintergrundprozesse überleben keinen Bash-Aufruf — `nohup`/`setsid` helfen nicht.
- **Playwright braucht `libXdamage.so.1`**: `apt-get download libxdamage1`, `dpkg-deb -x`, `LD_LIBRARY_PATH=/tmp/deps/root/usr/lib/aarch64-linux-gnu` setzen. Reine Umgebung, kein Repo-Fix.
- `ulimit -n 65536` vor Lint/Build setzen — sonst sporadisch `ENFILE` (kein Code-Bug, Befehl wiederholen).
- Git-Lock-Dateien (`.git/index.lock`, `.git/HEAD.lock`) bleiben im Mount hängen und lassen sich erst nach Freigabe der Löschberechtigung entfernen.
- Bei rotem Test: NIE Timeouts erhöhen — Trace/Screenshot auswerten (Skill `flaky-ci-echter-bug-diagnose`).

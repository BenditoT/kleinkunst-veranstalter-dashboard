# Sprint Sonnet — Event Management App (Sprint 2 Nacharbeit: Auth-Nachweis im Server-Pfad, 22.08.2026)

> **Diese Datei ist selbsterklärend — keine Chat-Historie nötig.**
> Erstellt nach Abschluss des Opus-Sprints O6–O8 (Auth-Port, Mandantengrenze, RBAC). Kanonische Datei — die vorherige Fassung war abgearbeitet und wurde ersetzt.

## Kontext

Kleinkunst-Veranstalter-Dashboard, Next.js 14 + React 18 + TypeScript, Ordner `Event Management App`.

Sprint 2 (Auth & Mandantengrenze) ist **inhaltlich fertig und committet** (`7850e9c`, `1849a5e`, `5dbd5ea`):

- `lib/auth/adapters/local-credentials.ts` — Anmeldung gegen erfundene Testnutzer, `crypto.scrypt`-Hashes, Rate-Limiting (5 Versuche / 15 Min).
- `lib/auth/session-cookie.ts` — signiertes `httpOnly`+`secure`+`SameSite=Lax`-Cookie, serverseitig verifiziert.
- `middleware.ts` + `lib/auth/route-guard.ts` — alles außer `/login`, `/register`, `/forgot-password` und den Auth-Endpunkten verlangt eine Session; fremde `?org=` liefert 403 statt Redirect.
- `lib/data/index.ts` → `getRequestOrganizationContext()` — Kontext kommt aus der Session, bei fehlender Mitgliedschaft `OrganizationAccessError` (403), kein stiller Rückfall auf die Demo-Organisation.
- `lib/auth/rbac.ts` — eine einzige Rollenregel; `viewer` kann nicht schreiben, Durchsetzung serverseitig vor dem Event-Formular.

**Was fehlt, ist der Nachweis im laufenden Server-Pfad.** Die 12 vorhandenen E2E-Tests laufen alle gegen den statischen Demo-Export (`NEXT_PUBLIC_DEMO_MODE=true`), in dem es per Definition **keine Middleware und keine API-Routen** gibt (`next build` warnt das ausdrücklich an). Der komplette Auth-Pfad ist damit heute nur durch Unit-Tests belegt (87 grün), nicht durch einen echten Browserlauf. Genau das ist die Aufgabe dieses Sprints — mechanische, klar umrissene Arbeit ohne Architekturentscheidungen.

**Qualitäts-Baseline (nach JEDER Aufgabe einzeln, nicht nur am Ende):** `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npx playwright test` — alle grün. Aktueller Stand, an dem du dich messen lässt: Lint clean, Typecheck clean, **87** Unit-Tests, Build erfolgreich, **12** E2E grün.

## Scope-Grenze

**Mach NUR S1–S4. Fasse NICHT an:**

- `lib/auth/port.ts`, `lib/data/port.ts` — Interfaces sind entschieden.
- `lib/auth/rbac.ts`, `lib/auth/route-guard.ts`, `middleware.ts` — Logik ist fertig und getestet. Du schreibst Tests **dagegen**, du änderst sie nicht. Findest du einen echten Fehler: melden und in `HANDOVER.md` dokumentieren, nicht stillschweigend umbauen.
- `db/migrations/`, `supabase/archive/` — unverändert.
- `lib/auth/adapters/identity-platform.ts` — bleibt Platzhalter, bis Norbert ein GCP-Projekt bereitstellt.
- Keine Sprint-3-Features (CRUD, Newsletter, Ticketing, Presse). Der Datenport hat bewusst noch **keine** Schreibmethoden.
- Kein Dark-Mode, keine neuen Dependencies.

---

## Aufgaben

### S1 — Zweites Playwright-Projekt `server`

1. `playwright.config.ts`: zusätzlich zum bestehenden Demo-Projekt ein Projekt `server` mit eigenem `webServer`, der mit `NEXT_PUBLIC_DEMO_MODE=false` und einem festen `SESSION_SECRET` (Testwert, mind. 32 Zeichen, nur in der Konfiguration — nicht in einer `.env`, die committet wird) gegen den Node-Build läuft.
2. Das bestehende Demo-Projekt und seine 12 Tests bleiben **unverändert** grün — der GitHub-Pages-Pfad ist Norberts öffentliche Demo.
3. Eigenes `testDir` oder `testMatch`, damit Demo-Tests nicht versehentlich im Server-Projekt laufen (und umgekehrt).

**Akzeptanz:** `npx playwright test` startet beide Projekte; die 12 Demo-Tests laufen weiter, das Server-Projekt läuft gegen einen echten Node-Server.

### S2 — `storageState`-Fixtures pro Rolle und Organisation

1. Ein Setup-Projekt (Playwright `dependencies`), das sich über `/api/auth/login` anmeldet und den Session-Cookie als `storageState` ablegt — je eine Datei für: `owner@buehnenblick.test` (owner, Org A), `viewer@buehnenblick.test` (viewer, Org A), `manager@zweitebuehne.test` (manager, Org B), `doppel@buehnenblick.test` (member in A, viewer in B). Zugangsdaten und Rollen stehen in `lib/auth/test-users.ts` und `tests/unit/auth-port.test.ts`.
2. `storageState`-Dateien in `.gitignore` (Ablauf, keine Artefakte im Repo).

**Akzeptanz:** Ein Test kann per `test.use({ storageState: … })` als beliebige dieser vier Personen starten, ohne sich selbst anzumelden.

### S3 — Negative E2E-Fälle im Server-Projekt

Mindestens diese Fälle, jeder als eigener Test mit sprechendem deutschem Namen:

1. Unangemeldeter Aufruf von `/veranstaltungen` → Redirect auf `/login?returnTo=/veranstaltungen`.
2. Anmeldung mit falschem Passwort → deutsche Fehlermeldung, **kein** Session-Cookie gesetzt.
3. Sechster Fehlversuch in Folge → Rate-Limit-Meldung (nicht dieselbe wie „falsches Passwort").
4. Angemeldet als `viewer` → `/veranstaltungen/neu` zeigt „Keine Berechtigung", das Formular ist **nicht** im DOM.
5. Angemeldet als `owner` in Org A → Aufruf mit `?org=<Org-B-ID>` liefert 403, **nicht** die Daten aus A und nicht die aus B.
6. Abmelden über `/api/auth/logout` → anschließender Aufruf einer geschützten Route führt wieder auf `/login`.

**Akzeptanz:** Alle sechs laufen grün und schlagen fehl, wenn man den jeweiligen Guard testweise entfernt (kurz prüfen — ein Test, der immer grün ist, ist wertlos).

### S4 — CI-Gate und Doku nachziehen

1. `.github/workflows/quality.yml`: das Server-Projekt mit ausführen (der Pages-Deploy hängt laut `deploy-github-pages.yml` an diesem Gate). `SESSION_SECRET` als Repository-Variable oder fest gesetzter Testwert im Workflow — **kein** Produktivgeheimnis.
2. `README.md`: kurzer Abschnitt „Lokal mit Anmeldung testen" — wie man mit `NEXT_PUBLIC_DEMO_MODE=false` startet und welche Testzugangsdaten es gibt (mit dem Hinweis: erfundene Personen, nur Test).
3. `docs/architecture/auth-port.md`: Abschnitt „Was offen ist" auf den neuen Stand bringen.

**Akzeptanz:** `npm run quality` und beide Playwright-Projekte grün; die CI läuft dieselbe Menge Tests wie lokal.

---

## Abschlusspflicht (nicht verhandelbar)

1. Alle Ergebnisse committen (**kein Push** — der SSH-Key liegt in Norberts macOS-Schlüsselbund, das kann nur er).
2. `HANDOVER.md` kanonisch aktualisieren (keine neue Versionsdatei): Zählwerte (Unit-/E2E-Tests), was fertig ist, was offen bleibt.
3. Session-Abschluss nach Norberts Format: klickbare Links, **max. 1 Terminal-Befehl**, Abschnitt „Was Norbert jetzt tut" mit genau EINER Handlung.

## Stolpersteine (aus der Opus-Session, spart dir Zeit)

- **Der Ordner-Mount ist langsam.** `next build` läuft dort in Minuten und wird vom Tool-Timeout abgeschnitten. Lösung: Projekt ohne `node_modules`/`.next`/`.git` nach `/tmp/emapp` kopieren (`tar`-Pipe), dort `npm ci` (~90 s) und bauen (~11 s). Hintergrundprozesse überleben keinen Bash-Aufruf, `nohup` hilft nicht.
- **Playwright braucht `libXdamage.so.1`**, das in der Sandbox fehlt: `apt-get download libxdamage1`, `dpkg-deb -x`, dann `LD_LIBRARY_PATH=/tmp/deps/root/usr/lib/aarch64-linux-gnu` setzen. Kein Repo-Fix, reine Umgebung.
- **`ulimit -n 65536` vor Lint/Build setzen**, sonst bricht der Build sporadisch mit `ENFILE` ab — kein Code-Bug, Befehl einfach wiederholen.
- Git-Lock-Dateien (`.git/index.lock`, `.git/HEAD.lock`) können im Mount hängen bleiben und lassen sich per `rm` erst nach Freigabe der Löschberechtigung entfernen.
- **Bei rotem Test: NIE Timeouts erhöhen** — Trace/Screenshot auswerten, echte Ursache finden.

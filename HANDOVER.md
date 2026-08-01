# HANDOVER — Event Management App (Kleinkunst-Veranstalter Dashboard)

**Ziel / Fertig wenn:** Provider-neutrale, mandantenfähige Next.js-Veranstaltungsplattform für Kleinkunst-Spielstätten (Events, Kalender, GEMA, Finanzen, Newsletter, Presse, Ticketing, KI-Assistent). Fertig laut `docs/sprints/README.md`: alle 10 Sprints abgeschlossen — insbesondere Sprint 10 (DSGVO, Resilienz, Produktion). Bis dahin: kein produktiver Go-Live mit echten Personendaten.

## Stand (01.08.2026 — Sonnet-Sprint S1–S4 „Datenport-Restumbau" abgeschlossen, committet)

Nach dem Opus-Sprint (O1–O5, committet als `deca983`) blieben sieben Dateien übrig, die den Datenbestand noch direkt aus `lib/domain/sample-data.ts` importiert haben statt über den neuen `DataPort`. Dieser Sprint hat sie **mechanisch nach dem Events-Pfad-Muster** umgestellt (Server-Komponente holt über den Port, Client-Komponente bekommt Props). `npm run quality` (Lint, Typecheck, **50** Unit-Tests, Build) und `npm run test:e2e` (**12** Tests) laufen grün — nach jeder der vier Teilaufgaben einzeln verifiziert, nicht nur am Ende.

- **S1 — Dashboard und Kalender:** `components/dashboard/dashboard-home.tsx` bekommt `events`/`venues`/`artists`/`tasks` als Props von `app/page.tsx` (jetzt async, lädt über den Port). `components/calendar/calendar-workspace.tsx` ist jetzt eine reine Client-Komponente mit Props `events`/`venues` von `app/kalender/page.tsx`; der `TODO(Sonnet-Sprint)`-Kommentar an `detectVenueConflicts` ist weg.
- **S2 — Detailseiten Künstler/Spielorte:** `app/kuenstler/[id]/page.tsx` und `app/spielorte/[id]/page.tsx` haben jetzt ein async `generateStaticParams()`, das über `port.listArtists`/`port.listVenues` läuft, und laden die Einzelseite über `port.getArtistById`/`port.getVenueById`. `artist-detail.tsx`/`venue-detail.tsx` bekommen `events`/`venues` als Props. `npm run build` erzeugt weiterhin alle 4 Künstler- und 4 Spielort-Detailseiten statisch.
- **S3 — Modulübersicht und Event-Formular:** `components/modules/module-overview.tsx` (von 8 Seiten benutzt: `gema`, `finanzen`, `newsletter`, `ticketing`, `ki-assistent`, `einstellungen`, `kuenstler`, `spielorte`) bekommt `events`/`venues` als Props. Um das achtfache identische Laden zu vermeiden, gibt es eine kleine Hilfsfunktion `loadModuleOverviewData()` in `lib/data/index.ts` — **kein neuer Port-Layer**, nur Boilerplate-Vermeidung, ruft selbst `getRequestOrganizationContext()` + `getDataPort()` auf. `components/events/event-form-screen.tsx` ist jetzt Client-Komponente mit Props `venues`/`artists`; `app/veranstaltungen/neu/page.tsx` lädt über den Port. E2E-Formulartest (Standardwerte `venue-kupfersaal`/`artist-mara-sol`) bleibt grün, weil die Reihenfolge der Demodaten erhalten ist.
- **S4 — Nachweis und Aufräumen:** Regressionstest ergänzt in `tests/unit/data-port.test.ts` („kein UI-Modul unter `app/` oder `components/` importiert das Demodatensatz-Modul") — läuft rekursiv über beide Verzeichnisse, kein Implementierungsdetail festgeschrieben (Testphilosophie ADR 2, Abschnitt 6). Erklärende Code-Kommentare wurden bewusst ohne den literalen String „sample-data" formuliert, damit sie den Akzeptanztest nicht selbst verfälschen. `docs/architecture/data-port.md` Abschnitt „Was offen ist" aktualisiert.

**Bundle-Nachweis (Kernziel des Sprints):** `grep -rl "monthlySlots\|bookedSlots" .next/static/chunks` nach `npm run build` — **vorher 2 Treffer** (Kalender-Chunk, Event-Formular-Chunk), **jetzt 0 Treffer**. Der komplette Datenbestand steckt nicht mehr in irgendeinem Client-Bundle.

**Verifikation (nach jeder der vier Teilaufgaben einzeln, nicht nur am Ende):** `npm run lint` clean, `npm run typecheck` clean, `npm test` 50/50 (vorher 49, ein Regressionstest ergänzt), `npm run build` erfolgreich (33 statische Seiten, alle 4 Künstler-/4 Spielort-Detailseiten weiterhin vorgerendert), `npx playwright test` 12/12 grün (~20–24s je Lauf). `grep -rn "sample-data" app components` liefert 0 Treffer.

**Scope eingehalten:** `db/migrations/`, `supabase/archive/`, `lib/data/port.ts`, `lib/auth/port.ts` nicht angefasst. Keine neuen Dependencies. Kein Dark-Mode. Kein Auth-Umbau.

## Offene Punkte
1. **Push nach `origin/main`** — durch Norbert (Befehl unten). Dieser Commit-Satz enthält S1–S4.
2. **Sprint 2 (Auth & Mandantengrenze) kann jetzt sauber starten** — keine Komponente kommt mehr am `OrganizationContext` vorbei an Daten. Das war die explizite Voraussetzung aus `sprint sonnet event app.md`.
3. **Bootstrap-Rolle mit `BYPASSRLS`** im Provisionierungsskript nachziehen, sobald ein echtes Cloud-SQL-Projekt existiert — `FORCE RLS` gilt auch für den App-Owner, Seeds/Migrationen dürfen nicht über die App-Rolle laufen (siehe O2, unverändert offen).
4. **Kein Backend real angebunden** — weiterhin `DATA_ADAPTER=in-memory`, `BACKEND_PROVIDER=google-cloud` nur als Plan/Default, kein Cloud-SQL-Projekt existiert bisher.

## Nächster Schritt
Push ausführen (Befehl unten). Für Sprint 2 (Auth & Mandantengrenze) eine neue Sonnet-/Opus-Session mit `docs/architecture/auth-port.md` (ADR 3) als Ausgangspunkt starten — der Auth-Port-Entwurf aus O4 steht bereits.

## Mach weiter
> Ich arbeite an der „Event Management App" (Kleinkunst-Veranstalter Dashboard, Next.js 14 + React 18 + TypeScript). Sonnet-Sprints S1–S7 und S1–S4 (Datenport-Restumbau) sowie Opus-Sprint O1–O5 sind abgeschlossen und committet. Lies `HANDOVER.md`, dann `docs/architecture/auth-port.md` (ADR 3) als Grundlage für Sprint 2 (Auth & Mandantengrenze). `npm run quality` + `npm run test:e2e` müssen nach jeder Aufgabe grün bleiben; vor Start ggf. `npm ci` und `npx playwright install chromium` (in Sandboxen ggf. `libXdamage.so.1` fehlend — nicht die App, sondern die Umgebung).

## Ressourcen & Dateien
- `docs/architecture/backend-provider.md` (ADR 1), `data-port.md` (ADR 2, jetzt vollständig umgesetzt), `auth-port.md` (ADR 3 — Ausgangspunkt für Sprint 2), `theming.md` (ADR 4)
- `lib/data/` — Datenport (`port.ts` Interface — NICHT ändern, `context.ts`, `in-memory-adapter.ts`, `index.ts` Factory inkl. `loadModuleOverviewData()`)
- `lib/auth/port.ts` — Auth-Port-Skizze für Sprint 2 (nur Typen, keine Implementierung) — NICHT ändern ohne Sprint-2-Auftrag
- `lib/auth/pin.ts` — konsolidierte Demo-PIN-Logik (eine Quelle: `NEXT_PUBLIC_DEMO_PIN`)
- `db/migrations/202607080001_core_schema.sql` — kanonisches Schema (RLS-gehärtet); `supabase/archive/` — archivierter Zweitstand, NICHT ändern
- `tests/unit/data-port.test.ts` — Mandantentrennungs-Nachweis (7 Tests) + Regressionstest gegen Direktimporte in `app`/`components` (S4, 1 Test)
- `docs/sprints/README.md` — vollständiger 10-Sprint-Plan, Rollen, Definition of Done
- `v2/` — Preact+htm UX-Demo (GitHub Pages), NICHT die Produktarchitektur, nur UX-Referenz

## Hinweise & Stolpersteine
- `organization_id` NIE aus untrusted Formdaten/URL/Cookie — nur serverseitig aus der Session (`resolveOrganizationContext()`, Sprint 2).
- `FORCE ROW LEVEL SECURITY` gilt auch für den Tabellen-Owner — Bootstrap/Seed/Migration brauchen eine eigene Rolle mit `BYPASSRLS` oder `SECURITY DEFINER`-Funktionen, sonst schlägt sogar das Anlegen der ersten Organisation fehl.
- Die Demo-PIN ist **kein Secret und kein Auth** — nur Sichtschutz für die öffentliche GitHub-Pages-Demo mit ausschließlich erfundenen Daten.
- Dark-Mode-Toggle bewusst entfernt, nicht vergessen — Backlog-Punkt in `docs/architecture/theming.md`, erst nach Sprint 5 sinnvoll (stabile Komponentenlandschaft).
- `node_modules`/`.next` in der Sandbox können auf eine tote andere Session verweisen (Symlink) → Löschung erlauben, `npm ci` neu.
- Playwright-Browser brauchen `libXdamage.so.1` — fehlt in manchen Sandboxen ohne `sudo`; notfalls `.deb` per `apt-get download` ziehen, mit `dpkg-deb -x` entpacken, `LD_LIBRARY_PATH` setzen (kein Repo-Fix nötig, nur Sandbox).
- `ulimit -n` in der Sandbox ggf. auf einen hohen Wert setzen (`ulimit -n 65536`) — sonst brechen Lint/Build sporadisch mit `ENFILE` ab (Datei-Handle-Erschöpfung, kein Code-Bug, gleichen Befehl wiederholen).
- **Sandbox-Hintergrundprozesse überleben keinen Bash-Aufruf** (bwrap-Sandbox mit `--unshare-pid --die-with-parent` — beim Ende eines Tool-Aufrufs stirbt der komplette Prozessbaum). `npm run quality`/`test:e2e` laufen deshalb als Einzelschritte im Vordergrund (`lint`, `typecheck`, `test`, `build` separat; `test:e2e` passt komplett — Build + Server + 12 Tests — in ~20–25s in einen einzelnen Aufruf).
- Bei rotem Test: NIE Timeouts erhöhen — Trace/Screenshot auswerten (Regel + Skill `flaky-ci-echter-bug-diagnose`).

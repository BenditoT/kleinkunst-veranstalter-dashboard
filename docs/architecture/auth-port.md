# ADR 3 — Auth-Port, Demo-Modus und E2E-Zielbild

Stand: 31.07.2026 (Sprint Opus, O4) · Status: **entschieden, Umsetzung in Sprint 2**

## Ausgangslage

Die App hatte drei Dinge, die wie Authentifizierung aussahen und keine waren:

1. ein clientseitiges PIN-Gate über der gesamten App,
2. Login-/Register-/Reset-Formulare, die immer Erfolg melden,
3. eine öffentlich erreichbare Cloud-Run-Konfiguration (`--allow-unauthenticated`).

Dazu stand der Demo-PIN `69198` an sechs Stellen, und `tests/unit/pin-auth.test.ts` erzwang den Wert per `toBe("69198")` — eine Rotation war ohne roten Test unmöglich.

## Entscheidung 1: Der Demo-Modus wird gekapselt, nicht ausgebaut

Das PIN-Gate bleibt, aber als klar markiertes Demo-Feature hinter `NEXT_PUBLIC_DEMO_MODE`. `NEXT_PUBLIC_DEMO_MODE=false` schaltet es vollständig ab.

Im Code (`lib/auth/pin.ts`, `components/auth/pin-gate.tsx`) steht ausdrücklich, dass die PIN **kein Schutz** ist: Der GitHub-Pages-Build ist ein statischer Export — jede Seite und jeder Datensatz liegt als Datei auf dem CDN und ist per direkter URL abrufbar, ganz ohne PIN. Die PIN ist Sichtschutz gegen versehentliches Draufklicken. Daraus folgt die harte Regel: **In der Pages-Demo dürfen ausschließlich erfundene Daten liegen.**

Warum nicht sofort entfernen? Weil die Demo genau dafür gebaut ist und Norbert sie zeigt. Das Risiko liegt nicht im Gate, sondern in der Verwechslung mit Auth — und die ist jetzt im Code, im README und hier dokumentiert.

## Entscheidung 2: Eine Quelle für die PIN

| vorher | jetzt |
| --- | --- |
| `lib/auth/pin.ts` (Konstante `DEMO_LOGIN_PIN`) | `DEMO_PIN_FALLBACK` — greift nur ohne Konfiguration |
| `package.json` (`build:pages`) | entfernt |
| `.github/workflows/deploy-github-pages.yml` | `NEXT_PUBLIC_DEMO_PIN: ${{ vars.DEMO_PIN }}` (Repository-Variable) |
| `.env.example` | dokumentiert, mit Hinweis auf die Rotation |
| `README.md` | verweist auf die ENV, nennt keinen Wert mehr |
| `tests/unit/pin-auth.test.ts` (`toBe("69198")`) | prüft Format und Verhalten, nicht den Wert |
| `tests/e2e/app.spec.ts` (Literal) | liest dieselbe Quelle wie der Build |

Rotation ist damit ein Klick in den Repository-Variablen, kein Commit. Die PIN ist bewusst **kein Secret**: sie landet im Client-Bundle, ein GitHub-Secret würde nur falsche Sicherheit suggerieren.

## Entscheidung 3: Der Auth-Port (Sprint 2)

Interface-Skizze: [`lib/auth/port.ts`](../../lib/auth/port.ts) — nur Typen, keine Provider-Implementierung.

**Session-Begriff.** Eine `AuthSession` entsteht ausschließlich serverseitig aus einem verifizierten Provider-Token und trägt: `userId`, `email`, `emailVerified`, `memberships[]`, `activeOrganizationId`, `expiresAt`. Client-Komponenten sehen höchstens `SessionView` (Anzeigename, E-Mail, Rolle, Organisationsname) — nie die Mitgliedschaftsliste, nie Tokens.

**Rollen.** Die fünf Rollen aus [ADR 1](./backend-provider.md): `owner`, `admin`, `manager`, `member`, `viewer`. `hasRoleAtLeast(context, minimum)` ist die einzige Rollenprüfung; `viewer` schreibt nie.

**Wie `organization_id` in den Request kommt — der Kern:**

```
Provider-Token  ──verifizieren──▶  AuthSession { memberships[] }
                                        │
             requestedOrganizationId ───┤  (darf aus der URL kommen)
                                        ▼
                        resolveOrganizationContext()
                        prüft: gibt es dazu eine Mitgliedschaft?
                                        │
                      ja ▼                          ▼ nein
             OrganizationContext                   null  →  403
             { organizationId, role }
                                        │
                                        ▼
                     DataPort.*(context, …)  →  SET LOCAL app.current_org_id
```

Die Kette ist so gebaut, dass man Daten gar nicht holen **kann**, ohne vorher durch die Mitgliedschaftsprüfung gegangen zu sein: `DataPort` verlangt einen `OrganizationContext`, und den gibt es nur aus `resolveOrganizationContext()`. Eine `organizationId` aus Formdaten, Query-Parametern oder einem Client-Cookie wird nie übernommen — ein `requestedOrganizationId` aus der URL ist lediglich ein *Wunsch*, der gegen `session.memberships` geprüft wird.

Erste Implementierung: Google Identity Platform (`lib/auth/adapters/identity-platform.ts`), Session-Cookie `httpOnly`/`secure`/`SameSite=Lax`, serverseitige Verifikation pro Request. Der Port bleibt provider-neutral, damit Keycloak oder Supabase Auth später nur einen Adapter kosten.

## Entscheidung 4: `--allow-unauthenticated` bei Cloud Run

`scripts/google-cloud/provision-and-deploy.sh` und `.github/workflows/deploy-google-cloud.yml` deployen mit `--allow-unauthenticated`. **Das bleibt zulässig — aber nur unter drei Bedingungen:**

1. Der Dienst läuft im Demo-Modus (`NEXT_PUBLIC_DEMO_MODE=true`) und enthält ausschließlich erfundene Daten.
2. Es ist keine echte Datenbank verbunden bzw. `DATA_ADAPTER=in-memory`.
3. Es ist kein Personenbezug im Spiel (DSGVO).

Das ist keine Nachlässigkeit, sondern die richtige Ebene: Cloud-Run-IAM ist Infrastruktur-Auth für *Maschinen*. Eine öffentliche Webanwendung braucht ein Login auf Anwendungsebene — sonst könnten sich Endnutzer gar nicht anmelden. `--allow-unauthenticated` bedeutet „der Dienst ist erreichbar", nicht „die Daten sind offen".

**Was Sprint 2 ändern muss:**

- Sobald echte Daten oder ein echtes Backend angebunden sind, greift der Auth-Port; `NEXT_PUBLIC_DEMO_MODE=false` wird gesetzt.
- Alle Routen außer `/login`, `/register`, `/forgot-password` und statischen Assets laufen über eine serverseitige Session-Prüfung (Middleware oder Layout-Guard), die unauthentifiziert auf `/login` umleitet und bei fehlender Mitgliedschaft 403 liefert.
- Getrennte Cloud-Run-Dienste für Demo (öffentlich, Fake-Daten) und Produktion (Auth-Pflicht auf Anwendungsebene, echte DB, Zugriff nur über die Anwendung).
- Bootstrap-Pfad mit `BYPASSRLS`-Rolle statt App-Rolle (siehe ADR 1, Teil B).

## Entscheidung 5: E2E-Zielbild ab Sprint 2

Heute laufen die Playwright-Tests gegen den **statischen Export**: `playwright.config.ts` baut `build:pages`, kopiert `out/` unter den Pages-Basispfad und serviert das über `scripts/serve-pages.mjs`. Das ist bewusst so — es testet exakt das Artefakt, das auf GitHub Pages landet.

Sobald Sessions, Redirects und 401/403 dazukommen, kann ein statischer Export das nicht mehr abbilden. Migrationspfad:

1. **Zweites Playwright-Projekt** statt Ersatz: `pages-export` (bestehend, testet das Demo-Artefakt) und `server` (neu, `webServer: "npm run build && npm start"` gegen den Standalone-Build).
2. Auth-Zustände über `storageState`-Fixtures pro Rolle (`owner`, `viewer`) und pro Testorganisation — damit ist die Sprint-2-Abnahme „zwei Organisationen sehen gegenseitig nichts" ein E2E-Test und nicht nur ein Unit-Test.
3. Negativfälle als eigene Tests: unauthentifiziert → Redirect auf `/login`; fremde `organizationId` in der URL → 403; `viewer` sieht Schreibaktionen nicht.
4. Der Demo-Pfad behält das PIN-Gate; der Server-Pfad startet mit `NEXT_PUBLIC_DEMO_MODE=false`, damit kein Test versehentlich am Gate hängt.
5. `NEXT_PUBLIC_FIXED_NOW` bleibt in beiden Projekten gesetzt (deterministische Daten, S7).

Beide Projekte laufen im `e2e`-Job von `quality.yml`; der Deploy-Workflow hängt weiterhin per `needs:` daran.

### Stand 28.08.2026 — umgesetzt (S1–S4)

Alle fünf Punkte sind umgesetzt, mit zwei Abweichungen, die sich in der Umsetzung als notwendig herausgestellt haben:

- **Drei Projekte statt zwei:** `chromium` (Demo-Export, 12 Tests), `server-setup` (legt die `storageState`-Dateien an, 4 Tests) und `server` (8 negative Tests). Das Setup ist ein eigenes Projekt mit `dependencies`, damit sich kein Test selbst anmelden muss.
- **`next start` statt `npm start` und ein eigenes Build-Verzeichnis:** beide Server starten parallel und würden sich sonst `.next` gegenseitig überschreiben. Der Server-Build läuft deshalb mit `NEXT_DIST_DIR=.next-server` (neu in `next.config.mjs`, ohne die Variable bleibt alles wie bisher).
- **`page.request` taugt nicht für POST-Tests:** der `SameSite=Lax`-Cookie wird dabei nicht mitgeschickt, die Antwort wäre 401 statt der interessanten 403. Solche Anfragen laufen deshalb per `page.evaluate(fetch …)` aus der Seite heraus — das entspricht auch dem, was die App selbst tut.

Die vier Testzugänge (owner/viewer in Organisation A, manager in B, Doppelmitglied in A+B) stehen in `tests/e2e/server/test-accounts.ts`. Dass die Tests wirklich etwas prüfen, wurde gegengeprüft: mit ausgehängtem Rollen- bzw. Mitgliedschafts-Guard werden genau die beiden zuständigen Tests rot.

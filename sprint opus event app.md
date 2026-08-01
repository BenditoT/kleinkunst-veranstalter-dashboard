# Sprint Opus — Event Management App (Sprint 2: Auth & Mandantengrenze, 02.08.2026)

> **Diese Datei ist selbsterklärend — keine Chat-Historie nötig.**
> Erstellt von Fable (Orchestrator) nach Abschluss von O1–O5 (Architektur/RLS/Datenport) und dem Datenport-Restumbau (S1–S4). Ersetzt die alte, abgearbeitete Fassung dieser Datei (kanonisch, keine Versionsdatei).
> **Voraussetzung erfüllt:** `getRequestOrganizationContext()` (`lib/data/index.ts:63`) ist der einzige Ort, an dem ein `OrganizationContext` entsteht — genau die Stelle, die dieser Sprint auf echte Sessions umstellt.

## Kontext

Kleinkunst-Veranstalter-Dashboard, Next.js 14 + React 18 + TypeScript. `docs/sprints/README.md`, Sprint 2: „Demo-PIN und simulierte Auth-Flows durch einen provider-neutralen Auth-Port mit Google Identity Platform als Default ersetzen." Der Auth-Port ist bereits als Typinterface entworfen (`lib/auth/port.ts`, ADR 3 in `docs/architecture/auth-port.md`) — **nicht ändern**, nur implementieren.

**Echter Blocker, den du NICHT auflösen kannst:** Eine echte Google-Identity-Platform-Anbindung braucht ein echtes GCP-Projekt mit OAuth-Credentials — das kann nur Norbert einrichten (Account, ggf. Billing). Blockiere den Sprint NICHT darauf. Stattdessen: Baue einen **lokalen Test-Adapter**, der exakt dieselbe `AuthPort`-Schnittstelle erfüllt (analog zum In-Memory-Datenport aus O3) — damit ist alles außer der Provider-Anbindung selbst fertig und getestet. `lib/auth/adapters/identity-platform.ts` bleibt Platzhalter/Skizze bis Norbert ein Projekt bereitstellt (als offener Punkt in HANDOVER.md dokumentieren, nicht implementieren).

**Sicherheits-Vorgaben aus dem Plan-Review (bereits eingearbeitet, nicht optional):**
- Session-Cookie: `httpOnly`, `secure`, `SameSite=Lax` (steht schon so in ADR 3 — umsetzen, nicht neu entscheiden).
- Passwörter: Mindestlänge 12 Zeichen, client- UND serverseitig geprüft. Hashing mit Node-Bordmitteln (`crypto.scrypt` + `crypto.timingSafeEqual`) — keine neue Dependency dafür nötig.
- Rate-Limiting auf `signInWithPassword`: `AuthError` kennt bereits `"rate-limited"` (ungenutzt in der Typskizze) — ein einfacher In-Memory-Zähler pro E-Mail/IP mit Zeitfenster reicht für den lokalen Adapter; muss tatsächlich verdrahtet werden, nicht nur im Typ existieren.
- RBAC-Durchsetzung MUSS serverseitig sein (`hasRoleAtLeast` im Request-Pfad), nicht nur UI-Blende (Button ausblenden reicht nicht — der Server muss die Aktion selbst ablehnen).
- Test-/Demo-Nutzer sind ausschließlich erfundene Daten (wie die PIN-Demo), Passwörter gehasht im Code, klar als „NUR TEST" markiert — keine echten Personendaten, keine Klartext-Passwörter.
- `organization_id`/`activeOrganizationId` NIE aus Formdaten/Query-Parametern/Client-Cookies übernehmen — nur aus `resolveOrganizationContext()` gegen `session.memberships` geprüft (das ist der ganze Sinn des Ports, siehe `lib/auth/port.ts` Kommentar).
- DSGVO Art. 17/20 (Löschung/Export) ist bewusst NICHT Teil dieses Sprints — das ist Sprint 10. Nur dokumentieren, nicht implementieren.

**Qualitäts-Baseline:** `npm run quality` + `npm run test:e2e` nach jeder Aufgabe grün. Vor Start ggf. `npm ci` + `npx playwright install chromium` (Sandbox-Stolpersteine: siehe `HANDOVER.md`).

## Scope-Grenze

**Mach NUR O6–O8. Fasse NICHT an:**
- `lib/auth/port.ts` (Interface — nur implementieren, nicht ändern)
- `db/migrations/`, `lib/data/port.ts` (Datenmodell/Datenport-Interface — entschieden)
- Zweites Playwright-Projekt (`server`), `storageState`-Fixtures, Ausrollen des Guards auf jede einzelne Route/Formular-Wiring über die ganze App → mechanische Restarbeit, geht als neue `sprint sonnet event app.md` an Sonnet (siehe Abschlusspflicht)
- Keine Sprint-3-Features (CRUD, Newsletter, Ticketing)
- Kein echtes GCP-Projekt/Identity-Platform-Setup (siehe Blocker oben)

---

## Aufgaben

### O6 — Auth-Port implementieren: Session + lokaler Test-Adapter

1. `lib/auth/adapters/local-credentials.ts` (neu): kleine In-Memory-Nutzerliste (mehrere Rollen, mindestens zwei Organisationen — wiederverwende `DEMO_ORGANIZATION_ID` + eine zweite Test-Org-ID analog zu `tests/unit/data-port.test.ts`), Passwörter per `crypto.scrypt` gehasht, klar als Test-Fixtures markiert.
2. Session-Erzeugung: signierter/verschlüsselter `httpOnly`+`secure`+`SameSite=Lax`-Cookie (Next.js `cookies()`-API). `getSession()`/`requireSession()` verifizieren das Cookie serverseitig, kein Vertrauen auf Client-Zustand.
3. `signInWithPassword`, `signOut`, `sendPasswordResetLink` implementieren. Rate-Limiting für `signInWithPassword` (In-Memory-Zähler, z. B. 5 Fehlversuche/15 Min pro E-Mail) — liefert `{ ok: false, error: "rate-limited" }` statt weiterer Prüfung.
4. Login-/Register-/Reset-Formulare (bisher: melden immer Erfolg) auf den echten Adapter umstellen — echte Fehlermeldungen (deutsch) bei falschem Passwort/Rate-Limit/unbekannter E-Mail.

**Akzeptanz:** Login mit korrekten Testzugangsdaten erzeugt eine echte, verifizierbare Session; falsches Passwort schlägt fehl; 6. Fehlversuch in Folge liefert Rate-Limit-Fehler statt weiterer Prüfung; Passwörter liegen nirgends im Klartext.

### O7 — `resolveOrganizationContext()` verdrahten + geschützte Routen

1. `getRequestOrganizationContext()` (`lib/data/index.ts:63`, aktuell hartcodiert auf die Demo-Org) durch echten Aufruf ersetzen: Session lesen → `resolveOrganizationContext(session, requestedOrganizationId?)` → bei `null` (keine Mitgliedschaft) **403**, nicht stillschweigend Demo-Daten.
2. Middleware oder Layout-Guard: alle Routen außer `/login`, `/register`, `/forgot-password` und statische Assets verlangen eine gültige Session. Unauthentifiziert → Redirect auf `/login` mit `returnTo`-Parameter (nur als Redirect-Ziel verwendet, nie als Datenquelle für `organizationId`).
3. Der PIN-Gate-Demo-Modus (`NEXT_PUBLIC_DEMO_MODE`) bleibt für die GitHub-Pages-Demo unverändert bestehen — dieser Guard gilt nur für den Node-Server-Pfad (`output: "standalone"`), nicht für den statischen Export. Im Code klar kommentieren, warum beide nebeneinander existieren.

**Akzeptanz:** Fremde `organizationId` in der URL (Nutzer ohne Mitgliedschaft) liefert 403, nicht die eigenen oder fremde Daten; unauthentifizierter Zugriff auf eine geschützte Route leitet um; der GitHub-Pages-Demo-Pfad bleibt funktionsfähig unverändert.

### O8 — RBAC serverseitig durchsetzen

1. `hasRoleAtLeast(context, minimum)` an jeder schreibenden Aktion serverseitig aufrufen (mindestens: Event anlegen/bearbeiten, siehe `app/veranstaltungen/neu/page.tsx` und `event-form-screen.tsx`) — `viewer` darf nie schreiben, Durchsetzung im Server-Code, nicht nur Button ausblenden.
2. Kurzer Isolationsbeweis als Unit-Test (Stil von `tests/unit/data-port.test.ts`): zwei Organisationen, mehrere Rollen — `viewer` einer Organisation kann keine Schreibaktion auslösen; Nutzer ohne Mitgliedschaft in Organisation B bekommt keinen Kontext für B, selbst mit korrekter Session für Organisation A.

**Akzeptanz:** Rollverletzung wird serverseitig abgelehnt (nicht nur clientseitig verborgen); Test beweist die Trennung, nicht nur die Typen.

---

## Abschlusspflicht (nicht verhandelbar)

1. Alle Ergebnisse committen (kein Push — macht Norbert).
2. Mechanische Restarbeit (zweites Playwright-Projekt `server`, `storageState`-Fixtures pro Rolle/Org, Guard auf alle übrigen Routen ausrollen, Formulare final durchverdrahten, negative E2E-Fälle nach ADR 3 Entscheidung 5) NICHT hier erledigen, sondern als klar umrissene Aufgabenliste in eine neue `sprint sonnet event app.md` schreiben (alte Datei ist abgearbeitet und darf ersetzt werden).
3. `HANDOVER.md` aktualisieren (kanonische Datei, keine neue Version): was von Sprint 2 fertig ist, was in den Sonnet-Folgesprint geht, der GCP-Blocker (Identity Platform) explizit als offener Punkt, den nur Norbert lösen kann.
4. Session-Abschluss nach Norberts Format: klickbare Links, **max. 1 Terminal-Befehl** (Push), Abschnitt „Was Norbert jetzt tut" mit genau EINER Handlung.

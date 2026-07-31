# Sprint Sonnet — Event Management App (Datenport-Restumbau, 31.07.2026)

> **Diese Datei ist selbsterklärend — keine Chat-Historie nötig.**
> Erstellt von der Opus-Session (O1–O5) als Nachfolgerin des abgearbeiteten Sonnet-Sprints S1–S7.
> Stand: alles committet, `npm run quality` (Lint, Typecheck, **49** Unit-Tests, Build) und `npm run test:e2e` (12 Tests) grün.

## Kontext

Kleinkunst-Veranstalter-Dashboard, Next.js 14 + React 18 + TypeScript, App Router, statischer Export für GitHub Pages.

Die Opus-Session hat einen **Datenport** eingezogen (`lib/data/`, ADR: `docs/architecture/data-port.md`). UI-Code holt Daten nicht mehr direkt aus `lib/domain/sample-data.ts`, sondern über den Port — mit einem `OrganizationContext` als erstem Argument. Der **Events-Pfad ist vollständig umgestellt** und dient als Vorlage. Übrig ist mechanische Fleißarbeit nach exakt demselben Muster: **7 Dateien**.

**Warum das wichtig ist:** Sprint 2 (Auth & Mandantengrenze) kann erst dann sauber greifen, wenn keine Komponente mehr an der Organisation vorbei an Daten kommt. Solange ein Direktimport übrig ist, gibt es eine Stelle, die Daten aller Mandanten sieht.

**Qualitäts-Baseline (muss nach JEDER Aufgabe grün bleiben):** `npm run quality` + `npm run test:e2e`.
Vor Start ggf. `npm ci` und `npx playwright install chromium`.

## Scope-Grenze

**Mach NUR die Aufgaben S1–S4. Fasse NICHT an:**

- `db/migrations/`, `supabase/archive/` (Schema/RLS — entschieden, siehe ADR 1)
- `lib/data/port.ts`, `lib/auth/port.ts` (Interfaces — entschieden, nur benutzen, nicht ändern)
- Auth-Umbau, echte Sessions, geschützte Routen (→ Sprint 2 des 10-Sprint-Plans)
- Dark-Mode / `dark:`-Utilities (Entscheidung O5: Toggle ist bewusst raus, siehe `docs/architecture/theming.md`)
- Keine neuen Features, keine neuen Dependencies

---

## Das Muster (Vorlage: Events-Pfad)

**Server-Komponente holt, Client-Komponente bekommt Props.**

```tsx
// app/veranstaltungen/page.tsx  (Server-Komponente, async)
import { getDataPort, getRequestOrganizationContext } from "@/lib/data";

export default async function EventsPage() {
  const context = await getRequestOrganizationContext();
  const port = getDataPort();
  const [events, venues, artists] = await Promise.all([
    port.listEvents(context),
    port.listVenues(context),
    port.listArtists(context),
  ]);

  return (
    <AppShell activeItem="events">
      <EventsWorkspaceClient events={events} venues={venues} artists={artists} />
    </AppShell>
  );
}
```

Die Komponente selbst bekommt die Listen als Props und importiert nichts mehr aus `sample-data`. Ganze Vorlage: `app/veranstaltungen/page.tsx`, `app/veranstaltungen/[slug]/page.tsx`, `components/events/events-workspace-client.tsx`, `components/events/events-workspace.tsx`, `components/events/event-detail.tsx`.

Verfügbare Port-Methoden (`lib/data/port.ts`):
`listEvents(ctx, filters?)`, `getEventBySlug(ctx, slug)`, `listVenues(ctx)`, `getVenueById(ctx, id)`, `listArtists(ctx)`, `getArtistById(ctx, id)`, `listTasks(ctx)`, `buildSearchIndex(ctx)`.

---

## Aufgaben

### S1 — Dashboard und Kalender auf den Port umstellen

| Datei | Typ | Was passiert |
| --- | --- | --- |
| `components/dashboard/dashboard-home.tsx` | Server-Komponente | Props `events`, `venues`, `artists`, `tasks` statt `sample-data`-Import |
| `app/page.tsx` | Server-Komponente | lädt über den Port und reicht die Props durch |
| `components/calendar/calendar-workspace.tsx` | **Client** (`"use client"`, `useState`) | Props `events`, `venues`; der `TODO(Sonnet-Sprint)`-Kommentar an `detectVenueConflicts` verschwindet dabei |
| `app/kalender/page.tsx` | Server-Komponente | lädt über den Port und reicht die Props durch |

`detectVenueConflicts(events, { bufferMinutes, venues })` verlangt `venues` bereits als Argument — die Werte kommen künftig aus den Props, nicht mehr aus dem Modulimport.

**Akzeptanz:** kein `sample-data`-Import in den vier Dateien; `/` und `/kalender` sehen unverändert aus; E2E-Kalendertest bleibt grün.

### S2 — Detailseiten Künstler/Spielorte auf den Port umstellen

| Datei | Was passiert |
| --- | --- |
| `app/kuenstler/[id]/page.tsx` | `generateStaticParams` über `port.listArtists(ctx)`; Seite über `port.getArtistById(ctx, id)`; Props an `ArtistDetail` |
| `components/artists/artist-detail.tsx` | Props `events`, `venues` statt Import |
| `app/spielorte/[id]/page.tsx` | `generateStaticParams` über `port.listVenues(ctx)`; Seite über `port.getVenueById(ctx, id)`; Props an `VenueDetail` |
| `components/venues/venue-detail.tsx` | Props `events` statt Import |

Vorlage 1:1: `app/veranstaltungen/[slug]/page.tsx`.

**Achtung statischer Export:** `generateStaticParams` muss `async` sein und über den Port laufen — sonst brechen die vorgerenderten Detailseiten weg (E2E prüft alle Detail-URLs).

**Akzeptanz:** `npm run build:pages` erzeugt weiterhin alle 4 Künstler- und 4 Spielort-Seiten; E2E grün.

### S3 — Modulübersicht und Event-Formular auf den Port umstellen

| Datei | Typ | Was passiert |
| --- | --- | --- |
| `components/modules/module-overview.tsx` | Server-Komponente, von 8 Seiten benutzt | Props `events`, `venues` |
| die 8 aufrufenden Seiten (`app/gema`, `app/finanzen`, `app/newsletter`, `app/ticketing`, `app/ki-assistent`, `app/einstellungen`, `app/kuenstler/page.tsx`, `app/spielorte/page.tsx`) | Server-Komponenten | `async`, laden über den Port, reichen die Props durch |
| `components/events/event-form-screen.tsx` | **Client** | Props `venues`, `artists` (füllen die Auswahlfelder) |
| `app/veranstaltungen/neu/page.tsx` | Server-Komponente | lädt über den Port |

Wiederholung vermeiden: Wenn dir das achtfache Laden in den Modulseiten zu redundant vorkommt, ist eine kleine Server-Hilfsfunktion (z. B. `loadModuleOverviewData()` in `lib/data/`) erlaubt — aber **keine** neue Abstraktionsebene über dem Port.

**Akzeptanz:** `grep -rn "sample-data" app components` liefert **null** Treffer. Der Formular-E2E-Test (Standardwerte `venue-kupfersaal` / `artist-mara-sol`) bleibt grün.

### S4 — Nachweis und Aufräumen

1. **Regressionstest ergänzen** in `tests/unit/data-port.test.ts` (oder einer neuen Datei): eine Prüfung, dass kein UI-Modul mehr `sample-data` importiert — im Stil der bestehenden Dateiinhalts-Tests, mit Begründungskommentar (Testphilosophie siehe `docs/architecture/data-port.md`, Abschnitt 6).
2. **Bundle-Nachweis:** nach `npm run build` prüfen, ob der komplette Datenbestand aus den Client-Chunks verschwunden ist:
   ```
   grep -rl "monthlySlots\|bookedSlots" .next/static/chunks
   ```
   Vor diesem Sprint: 2 Treffer (Kalender, Event-Formular). Ziel: 0 Treffer. Ergebnis in der Übergabe dokumentieren.
3. `docs/architecture/data-port.md`, Abschnitt „Was offen ist": Restliste auf „erledigt" aktualisieren (Datum, ein Satz).

**Akzeptanz:** `npm run quality` + `npm run test:e2e` grün; Bundle-Nachweis dokumentiert.

---

## Stolpersteine (aus der Opus-Session)

- **JSX-Kommentare:** `{/* … */}` darf nicht als erstes Element in einem Ternary-Zweig stehen (`cond ? ( {/*…*/} <div/> ) : …` ist ein Syntaxfehler). Kommentar davor setzen.
- **`ulimit -n 65536`** in jedem Sandbox-Bash-Aufruf setzen, sonst brechen Lint/Build sporadisch mit `ENFILE` ab. Das ist kein Code-Bug — Befehl einfach wiederholen.
- **Playwright** braucht ggf. `libXdamage.so.1`; ohne `sudo`: `.deb` per `apt-get download libxdamage1` ziehen, mit `dpkg-deb -x` entpacken, `LD_LIBRARY_PATH` setzen.
- **Bei rotem Test: NIE Timeouts erhöhen.** Screenshot/Trace auswerten (Skill `flaky-ci-echter-bug-diagnose`).
- `getRequestOrganizationContext()` ist die einzige Stelle, an der ein Mandantenkontext entsteht. Nicht umgehen, nicht duplizieren, `organizationId` nie aus Props/URL/Formdaten übernehmen.

## Abschlusspflicht

1. Alles committen (**kein Push** — das macht Norbert).
2. `HANDOVER.md` aktualisieren (kanonische Datei, keine neue Version): erledigte Aufgaben, offene Reste, Sprint-2-Startfähigkeit.
3. Session-Abschluss nach Norberts Format: klickbare Links, **max. 1 Terminal-Befehl**, Abschnitt **„Was Norbert jetzt tut"** mit genau EINER Handlung.

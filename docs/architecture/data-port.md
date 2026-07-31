# ADR 2 — Datenport und Mandantenkontext

Stand: 31.07.2026 (Sprint Opus, O3) · Status: **entschieden, teilweise umgesetzt**

## Problem

`lib/domain/sample-data.ts` wurde in **12 UI-Dateien** direkt importiert. `organization_id` kam im gesamten TypeScript-Code nicht vor. Damit war die Sprint-2-Abnahme („zwei Testorganisationen sehen gegenseitig nichts") nicht testbar, und jede spätere Backend-Anbindung hätte 12 Dateien gleichzeitig anfassen müssen. Zusätzlich zog `components/layout/topbar.tsx` als Client-Komponente den kompletten Datenbestand in **jedes** Seiten-Bundle.

## Entscheidung

### 1. Ein schmaler, asynchroner Port

`lib/data/port.ts` definiert `DataPort`. Jede Methode nimmt als erstes Argument einen `OrganizationContext` und liefert ausschließlich Daten dieser Organisation.

```ts
type OrganizationContext = { organizationId: string; role: OrganizationRole };

listEvents(ctx, filters?)        getEventBySlug(ctx, slug)
listVenues(ctx)                  getVenueById(ctx, id)
listArtists(ctx)                 getArtistById(ctx, id)
listTasks(ctx)                   buildSearchIndex(ctx)
```

Warum so:

- **Kontext als erstes Argument, nicht als Adapter-Zustand.** Ein Adapter mit „aktueller Organisation" im Feld ist in einer Server-Umgebung mit parallelen Requests eine Fehlerquelle erster Güte. So ist jeder Aufruf für sich vollständig.
- **Async, obwohl der erste Adapter synchron arbeitet.** Sonst bricht die Signatur beim ersten SQL-Adapter, und zwar in jeder Aufrufstelle.
- **`null` statt Wurf bei „nicht gefunden".** Ob daraus 404 oder leere Liste wird, entscheidet die Route.
- **Der Adapter filtert selbst**, obwohl das echte Backend per RLS ohnehin filtert. Verteidigung in der Tiefe — und nur so ist die Mandantentrennung *vor* dem ersten Backend testbar.

### 2. `organizationId` gehört in die Domänentypen

`Event`, `Venue`, `Artist`, `Task` erweitern `TenantScoped` (`lib/domain/types.ts`). Die Demodaten hängen an `DEMO_ORGANIZATION_ID`; `withOrganization()` setzt das Feld, damit ein Test denselben Bestand unter einer zweiten Organisation anlegen kann. Genau das tut `tests/unit/data-port.test.ts`: gleiche IDs, gleiche Slugs, andere Organisation — und weist nach, dass weder Liste noch Direktzugriff über Slug/ID die Grenze überschreitet.

### 3. `getRequestOrganizationContext()` ist der einzige Ursprung eines Kontexts

`lib/data/index.ts` enthält die einzige Stelle, an der ein `OrganizationContext` entsteht. Heute liefert sie die Demo-Organisation, ab Sprint 2 kommt sie aus `AuthPort.resolveOrganizationContext()` ([ADR 3](./auth-port.md)). Diese Funktion darf **nie** einen Wert aus Formdaten, Query-Parametern oder Headern übernehmen.

### 4. Suche: vorberechneter Index statt Datenbestand im Bundle

Die Topbar bekommt `SearchIndexEntry[]` als Prop von `AppShell` (Server-Komponente), das den Index über den Port für die Organisation aus der Session baut. Ein Eintrag enthält nur `label`, `description`, `href`, `kind`, `keywords`.

Verworfene Alternative: Suche als Server-Roundtrip. Geht im statischen GitHub-Pages-Export gar nicht (kein Server) und wäre für ~15 Datensätze auch später Unfug. Sobald ein echtes Backend steht und der Bestand wächst, wird aus `buildSearchIndex` ein serverseitiger `searchEvents(ctx, query)`-Aufruf — die Topbar-Schnittstelle bleibt dieselbe, weil sie ohnehin nur ein Ergebnisformat kennt.

Messbarer Effekt: Der vollständige Datenbestand steckt jetzt nur noch in den zwei Client-Bundles, die ihn selbst importieren (Kalender, Event-Formular — beide noch nicht portiert), statt in jedem Seiten-Bundle über die Topbar.

### 5. Adapterwahl: laut scheitern statt still demonstrieren

`createDataPort(env)` liest `DATA_ADAPTER` (Default `in-memory`) und den Provider-Plan aus `lib/config/backend.ts`. Für jeden anderen Wert wirft die Factory mit Provider- und Zielnennung. Damit kann eine Produktivumgebung nicht versehentlich Demodaten ausliefern — und `lib/config/backend.ts` hat endlich einen echten Konsumenten statt nur Tests.

### 6. Testphilosophie für „Meta-Tests" (O3.5)

Bestand: `backend-runtime.test.ts`, `backend-plan.test.ts`, `cloud-sql.test.ts`, `deployment-assets.test.ts`, `github-pages.test.ts` prüften Konfiguration und Dateiinhalte, teils ohne jeden App-Bezug.

Entscheidung — Dateiinhalts- und Konfigurationstests bleiben, aber nur unter drei Bedingungen:

1. Sie sichern eine **Eigenschaft**, deren Bruch teuer ist und die sonst niemand prüft (Sicherheit, Deploybarkeit, Rotierbarkeit).
2. Sie schreiben **kein Implementierungsdetail** fest.
3. Der Grund steht als Kommentar im Test.

Konkret:

| Datei | Entscheidung |
| --- | --- |
| `deployment-assets.test.ts` | **bleibt** — sichert die Sicherheitseigenschaft „keine langlebigen Service-Account-Keys, Deploy nur per OIDC/Workload Identity". Das ist genau ein Fall für Regel 1. |
| `github-pages.test.ts` | **bleibt, korrigiert** — die Assertion auf `sampleEvents.map` war ein Implementierungsdetail (Regel 2 verletzt) und wurde beim Umbau zur Bremse; ersetzt durch „Events-Pfad nutzt den Port und importiert die Demodaten nicht mehr". Die PIN-Assertion prüft jetzt die *Rotierbarkeit* statt des Wertes. |
| `backend-plan.test.ts`, `backend-runtime.test.ts`, `cloud-sql.test.ts` | **bleiben** — sie testen echte Funktionen. Seit O3 hängt an `resolveBackendPlan()` produktives Verhalten (Adapterwahl), die Tests sind damit keine Selbstbespiegelung mehr. |
| `cloud-sql.test.ts` (Migrations-Assertion) | **bleibt** — „das kanonische Schema enthält keine provider-spezifischen Auth-Aufrufe" ist genau die Eigenschaft aus [ADR 1](./backend-provider.md). |

Kein Test wurde gelöscht; keine Datei wurde nach `docs/` verschoben. `lib/server/database/cloud-sql.ts` und `lib/server/backend/runtime.ts` bleiben Code, weil sie die Grundlage des ersten echten Adapters sind.

## Was umgesetzt ist

- `lib/data/{context,port,in-memory-adapter,index}.ts`
- `organizationId` in allen mandantenbezogenen Domänentypen, `OrganizationRole` passend zur Migration
- Events-Pfad vollständig über den Port: `app/veranstaltungen/page.tsx`, `app/veranstaltungen/[slug]/page.tsx`, `events-workspace(-client).tsx`, `event-detail.tsx` — kein Import von `sample-data` mehr
- `detectVenueConflicts` bekommt `venues` hereingereicht, statt sie selbst zu importieren (die Domänenschicht kannte vorher einen eigenen Datenbestand)
- Topbar-Bundle-Problem gelöst (Suchindex als Prop)
- `tests/unit/data-port.test.ts` — Isolationsbeweis mit zwei Organisationen

## Was offen ist (mechanisch, → `sprint sonnet event app.md`)

Sieben Dateien importieren `sample-data` noch direkt: `dashboard-home.tsx`, `calendar-workspace.tsx`, `artist-detail.tsx`, `venue-detail.tsx`, `module-overview.tsx`, `event-form-screen.tsx` sowie die Seiten `app/kuenstler/[id]` und `app/spielorte/[id]`. Das Muster ist identisch zum Events-Pfad: Server-Komponente holt über den Port, Client-Komponente bekommt Props.

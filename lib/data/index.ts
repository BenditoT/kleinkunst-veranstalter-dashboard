import { resolveBackendPlan } from "../config/backend";
import { sampleArtists, sampleEvents, sampleTasks, sampleVenues } from "../domain/sample-data";
import type { Event, Venue } from "../domain/types";
import { demoOrganizationContext, type OrganizationContext } from "./context";
import { createInMemoryDataPort } from "./in-memory-adapter";
import type { DataPort } from "./port";

export type { OrganizationContext } from "./context";
export { DEMO_ORGANIZATION_ID, createOrganizationContext, demoOrganizationContext } from "./context";
export type { DataPort } from "./port";
export { createInMemoryDataPort } from "./in-memory-adapter";
export type { InMemoryDataset } from "./in-memory-adapter";

type DataEnvironment = Partial<Record<string, string | undefined>>;

/**
 * Erzeugt den Datenport für die konfigurierte Umgebung (O3).
 *
 * Bindet `lib/config/backend.ts` an echten Code: der Provider-Plan
 * bestimmt, welcher Adapter zulässig ist. Solange kein Adapter für den
 * gewählten Provider existiert, schlägt der Aufruf laut fehl, statt
 * stillschweigend Demodaten in einer Produktivumgebung auszuliefern.
 */
export function createDataPort(env: DataEnvironment = process.env): DataPort {
  const adapter = env.DATA_ADAPTER ?? "in-memory";

  if (adapter === "in-memory") {
    return createInMemoryDataPort({
      events: sampleEvents,
      venues: sampleVenues,
      artists: sampleArtists,
      tasks: sampleTasks,
    });
  }

  const plan = resolveBackendPlan(env);

  throw new Error(
    `Datenport-Adapter "${adapter}" ist noch nicht implementiert (Provider: ${plan.activeProvider}, Ziel: ${plan.database}). ` +
      `Verfügbar ist derzeit nur "in-memory". Siehe docs/architecture/data-port.md.`,
  );
}

let cachedPort: DataPort | null = null;

/** Prozessweiter Datenport. */
export function getDataPort(): DataPort {
  if (!cachedPort) {
    cachedPort = createDataPort();
  }

  return cachedPort;
}

/**
 * Einziger Ort, an dem ein Mandantenkontext entsteht (O7).
 *
 * Der Kontext kommt aus der Auth-Session:
 * `requireSession()` → `resolveOrganizationContext()`. Liefert die
 * Mitgliedschaftsprüfung `null`, gibt es KEINEN Kontext — es wird
 * geworfen (403), nicht stillschweigend auf die Demo-Organisation
 * zurückgefallen. Diese Funktion übernimmt NIE einen Wert aus Formdaten,
 * Query-Parametern, Headern oder Client-Cookies.
 *
 * `requestedOrganizationId` ist ein *Wunsch* (Organisationswechsel) und
 * wird immer gegen `session.memberships` geprüft. Ohne Angabe gilt
 * `activeOrganizationId` aus der Session — serverseitig gesetzt über
 * `/api/auth/organization`, nicht vom Client.
 *
 * Im Demo-Modus (`NEXT_PUBLIC_DEMO_MODE` an, GitHub-Pages-Export und
 * öffentlicher Demodienst) gibt es keine Session und keinen Server, der
 * eine prüfen könnte: dort liefert die Demo-Organisation den Kontext, und
 * es liegen ausschließlich erfundene Daten vor (ADR 3, Entscheidung 1).
 * Der Import des Auth-Ports passiert erst in diesem Zweig — sonst zöge
 * jeder Datenzugriff `next/headers` mit sich, auch im statischen Export.
 */
export async function getRequestOrganizationContext(
  requestedOrganizationId?: string,
): Promise<OrganizationContext> {
  const { isAuthGuardEnabled } = await import("../auth/mode");

  if (!isAuthGuardEnabled()) {
    return demoOrganizationContext;
  }

  const { createAuthPort } = await import("../auth");
  const { OrganizationAccessError } = await import("../auth/errors");

  // `redirectOnMissingSession`: ohne Session gibt es einen Redirect auf
  // /login (die Middleware hat das in aller Regel schon erledigt — hier
  // steht die zweite Verteidigungslinie, falls eine Route je am Matcher
  // vorbeikommt).
  const auth = createAuthPort({ redirectOnMissingSession: true });
  const session = await auth.requireSession();
  const context = auth.resolveOrganizationContext(session, requestedOrganizationId);

  if (!context) {
    throw new OrganizationAccessError(requestedOrganizationId);
  }

  return context;
}

/**
 * Kontext für `generateStaticParams()` — und NUR dafür.
 *
 * `generateStaticParams` läuft zur Buildzeit, wo es per Definition keinen
 * Request und keine Session gibt; ein `cookies()`-Aufruf ist dort
 * verboten. Vorgerendert werden deshalb die Pfade der Demo-Organisation
 * (statischer Export = ausschließlich erfundene Daten).
 *
 * Das ist keine Lücke: welche Pfade existieren, ist keine Autorisierung.
 * Der eigentliche Seitenaufruf geht im Server-Pfad weiterhin durch
 * `getRequestOrganizationContext()` und liefert für eine fremde
 * Organisation nichts.
 */
export async function getPrerenderOrganizationContext(): Promise<OrganizationContext> {
  return demoOrganizationContext;
}

/**
 * Bündelt das Laden von `events`/`venues` für die acht Modulübersichtsseiten
 * (S3). Keine neue Abstraktionsebene über dem Port — nur Vermeidung
 * identischen Boilerplates in acht Server-Komponenten, die alle dieselben
 * zwei Listen für dieselbe Organisation brauchen.
 */
export async function loadModuleOverviewData(): Promise<{ events: Event[]; venues: Venue[] }> {
  const context = await getRequestOrganizationContext();
  const port = getDataPort();

  const [events, venues] = await Promise.all([port.listEvents(context), port.listVenues(context)]);

  return { events, venues };
}

import { resolveBackendPlan } from "../config/backend";
import { sampleArtists, sampleEvents, sampleTasks, sampleVenues } from "../domain/sample-data";
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
 * Einziger Ort, an dem ein Mandantenkontext entsteht.
 *
 * Ab Sprint 2 kommt der Kontext aus der Auth-Session
 * (`lib/auth/port.ts` → `resolveOrganizationContext`). Bis dahin liefert
 * die Demo-Organisation den Kontext. Diese Funktion darf NIE einen Wert
 * aus Formdaten, Query-Parametern oder Headern übernehmen.
 */
export async function getRequestOrganizationContext(): Promise<OrganizationContext> {
  return demoOrganizationContext;
}

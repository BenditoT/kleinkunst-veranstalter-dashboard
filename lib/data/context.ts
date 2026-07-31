import type { OrganizationRole } from "../domain/types";

/**
 * Mandantenkontext für jeden Datenzugriff (O3).
 *
 * Regel (Sprintplan-Leitplanke Sprint 2): `organizationId` wird IMMER
 * serverseitig aus der Auth-Session abgeleitet — nie aus Formdaten,
 * Query-Parametern, Headern oder Client-State. Der einzige Ort, an dem
 * ein Kontext entsteht, ist `getRequestOrganizationContext()` in
 * `lib/data/index.ts`.
 */
export type OrganizationContext = {
  organizationId: string;
  role: OrganizationRole;
};

/**
 * Organisation der Demodaten. Alle Datensätze in `sample-data.ts` hängen
 * an dieser ID; ein zweiter Mandant entsteht durch Kopieren derselben
 * Daten unter einer anderen ID (siehe `tests/unit/data-port.test.ts`).
 */
export const DEMO_ORGANIZATION_ID = "org-demo-buehnenblick";

export const demoOrganizationContext: OrganizationContext = {
  organizationId: DEMO_ORGANIZATION_ID,
  role: "owner",
};

/** Nur für Tests und Seeds: einen Kontext für eine beliebige Organisation bauen. */
export function createOrganizationContext(
  organizationId: string,
  role: OrganizationRole = "owner",
): OrganizationContext {
  return { organizationId, role };
}

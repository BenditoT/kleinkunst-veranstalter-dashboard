import { organizationRoles, type OrganizationRole } from "../domain/types";
import type { OrganizationContext } from "../data/context";
import { RoleRequiredError } from "./errors";

/**
 * Serverseitige Rollendurchsetzung (O8).
 *
 * Bewusst eine eigene, reine Datei ohne `next/headers` und ohne
 * Adapter-Abhängigkeit:
 *
 * - Sie ist damit im Unit-Test direkt prüfbar (kein Request nötig).
 * - Middleware (Edge-Runtime) und Server-Komponenten können sie beide
 *   benutzen, ohne den kompletten Auth-Port ins Bundle zu ziehen.
 * - Es gibt genau EINE Stelle, an der die Rangfolge der Rollen
 *   ausgewertet wird. `AuthPort.hasRoleAtLeast()` (siehe
 *   `lib/auth/adapters/local-credentials.ts`) delegiert hierher, statt
 *   die Reihenfolge ein zweites Mal zu interpretieren — eine zweite
 *   Kopie wäre genau die Sorte Drift, die irgendwann `viewer` schreiben
 *   lässt.
 *
 * Grundregel: Eine Rollenprüfung im Client (Button ausblenden) ist reine
 * Bequemlichkeit für den Nutzer, KEIN Schutz. Wer die Aktion trotzdem
 * auslöst, muss serverseitig abgelehnt werden.
 */

/**
 * `organizationRoles` (`lib/domain/types.ts`) ist absteigend nach Rechten
 * sortiert: `owner` = 0 … `viewer` = 4. Ein kleinerer Index heißt also
 * MEHR Rechte — daher `<=` und nicht `>=`.
 */
export function hasRoleAtLeast(role: OrganizationRole, minimum: OrganizationRole): boolean {
  const actual = organizationRoles.indexOf(role);
  const required = organizationRoles.indexOf(minimum);

  // Unbekannte Rolle → kein Zugriff. Nie „im Zweifel erlauben".
  if (actual === -1 || required === -1) {
    return false;
  }

  return actual <= required;
}

/**
 * Schwelle für schreibende Aktionen.
 *
 * Das Rollenmodell (`lib/domain/types.ts`, kanonisch aus der Migration
 * `202607080001_core_schema.sql`) ist absteigend: owner, admin, manager,
 * member, viewer. `viewer` ist die einzige reine Lese-Rolle — die
 * Schreibschwelle ist damit `member`.
 */
export const MINIMUM_WRITE_ROLE: OrganizationRole = "member";

export function canWrite(context: OrganizationContext): boolean {
  return hasRoleAtLeast(context.role, MINIMUM_WRITE_ROLE);
}

/**
 * Wirft `RoleRequiredError` (403), wenn die Rolle nicht reicht.
 *
 * Für Aufrufer, die abbrechen sollen (API-Routen, Server-Aktionen).
 * Server-Komponenten, die stattdessen eine freundliche 403-Seite zeigen
 * wollen, fragen `canWrite()`/`hasRoleAtLeast()` direkt ab.
 */
export function requireRoleAtLeast(
  context: OrganizationContext,
  minimum: OrganizationRole = MINIMUM_WRITE_ROLE,
): OrganizationContext {
  if (!hasRoleAtLeast(context.role, minimum)) {
    throw new RoleRequiredError(minimum, context.role);
  }

  return context;
}

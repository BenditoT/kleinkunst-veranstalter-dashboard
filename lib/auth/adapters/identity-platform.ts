import type { AuthPort } from "../port";

/**
 * GOOGLE IDENTITY PLATFORM — PLATZHALTER, NICHT IMPLEMENTIERT (O6).
 *
 * Blockiert durch etwas, das Code nicht auflösen kann: eine echte
 * Anbindung braucht ein GCP-Projekt mit aktivierter Identity Platform,
 * OAuth-Client-Credentials und (je nach Kontingent) ein Billing-Konto.
 * Das kann nur der Projektinhaber einrichten — siehe HANDOVER.md,
 * offener Punkt „GCP/Identity Platform".
 *
 * Alles andere ist fertig: der lokale Adapter
 * (`./local-credentials.ts`) erfüllt dieselbe Schnittstelle, das
 * Session-Cookie, die Middleware, `resolveOrganizationContext()` und die
 * Rollenprüfung sind provider-unabhängig. Dieser Adapter muss deshalb nur
 * drei Dinge liefern:
 *
 * 1. `signInWithPassword` gegen die Identity-Platform-REST-API
 *    (`accounts:signInWithPassword`), Rückgabe: ID-Token + Refresh-Token.
 * 2. Verifikation des ID-Tokens pro Request (Signaturprüfung gegen die
 *    Google-JWKS, Prüfung von `aud`/`iss`/`exp`) — daraus entsteht
 *    `userId`/`email`/`emailVerified`.
 * 3. Nachladen der `memberships` aus der eigenen Datenbank
 *    (`organization_members`, siehe `db/migrations/`), denn die
 *    Mitgliedschaften gehören der Anwendung, nicht dem Identity-Anbieter.
 *
 * `resolveOrganizationContext()` und `hasRoleAtLeast()` können unverändert
 * aus dem lokalen Adapter übernommen werden — sie kennen keinen Provider.
 *
 * Bis dahin scheitert dieser Adapter laut, statt stillschweigend eine
 * Test-Anmeldung in einer Produktivumgebung zuzulassen.
 */
export function createIdentityPlatformAuthPort(): AuthPort {
  throw new Error(
    'Auth-Adapter "identity-platform" ist noch nicht implementiert: es fehlt ein GCP-Projekt ' +
      "mit aktivierter Identity Platform und OAuth-Credentials (siehe HANDOVER.md, offener Punkt). " +
      'Verfügbar ist derzeit nur "local-credentials". Siehe docs/architecture/auth-port.md.',
  );
}

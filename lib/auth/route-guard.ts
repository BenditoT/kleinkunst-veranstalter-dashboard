import type { AuthSession } from "./port";

/**
 * Reine Entscheidungslogik des Routen-Guards (O7).
 *
 * Bewusst ohne Next-Importe: die Middleware übersetzt das Ergebnis nur
 * noch in eine `NextResponse`. So ist die eigentliche Regel — wer darf
 * ohne Session wohin, wann gibt es 403 statt Redirect — im Unit-Test
 * prüfbar und nicht in einem Request-Objekt versteckt.
 */

/** Seiten, die ohne Session erreichbar sein MÜSSEN. */
export const PUBLIC_PATHS: readonly string[] = ["/login", "/register", "/forgot-password"];

/**
 * Query-Parameter für den Organisationswechsel.
 *
 * Er ist ausdrücklich nur ein *Wunsch*: geprüft wird immer gegen
 * `session.memberships`. Er wird NIE zur Datenquelle für die
 * `organizationId` im Datenzugriff — die kommt aus der Session
 * (`activeOrganizationId`), gesetzt über `/api/auth/organization`.
 */
export const ORGANIZATION_QUERY_PARAM = "org";

export type GuardDecision =
  | { kind: "allow" }
  /** Nicht angemeldet: Redirect auf die Anmeldung, mit Rücksprungziel. */
  | { kind: "redirect-to-login"; returnTo: string }
  /** Angemeldet, aber keine Mitgliedschaft in der angefragten Organisation. */
  | { kind: "forbidden"; reason: "no-membership" };

export type GuardInput = {
  pathname: string;
  session: AuthSession | null;
  /** Wert des `org`-Parameters aus der URL, falls vorhanden. */
  requestedOrganizationId?: string | null;
  /** Vollständiges Rücksprungziel inklusive Query. */
  returnTo: string;
};

/**
 * Öffentlich sind die drei Anmeldeseiten, die Auth-Endpunkte und alles,
 * was Next selbst ausliefert. Alles andere braucht eine Session —
 * Positivliste, damit eine neue Route nicht versehentlich offen ist.
 */
export function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return true;
  }

  return (
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  );
}

export function decideRouteAccess(input: GuardInput): GuardDecision {
  if (isPublicPath(input.pathname)) {
    return { kind: "allow" };
  }

  if (!input.session) {
    return { kind: "redirect-to-login", returnTo: input.returnTo };
  }

  const requested = input.requestedOrganizationId?.trim();

  if (requested) {
    const isMember = input.session.memberships.some(
      (membership) => membership.organizationId === requested,
    );

    if (!isMember) {
      // 403, NICHT Redirect: der Nutzer ist angemeldet, ihm fehlt nur die
      // Mitgliedschaft. Ein Redirect auf /login wäre eine Endlosschleife
      // und würde die beiden Fälle vermischen.
      return { kind: "forbidden", reason: "no-membership" };
    }
  }

  return { kind: "allow" };
}

/**
 * `returnTo` darf ausschließlich Weiterleitungsziel sein, nie Datenquelle.
 * Nur relative Pfade: `//boese.example` oder `https://…` wären eine offene
 * Weiterleitung.
 */
export function safeReturnTo(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

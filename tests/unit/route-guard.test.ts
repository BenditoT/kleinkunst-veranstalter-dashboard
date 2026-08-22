import { describe, expect, it } from "vitest";

import { isAuthGuardEnabled } from "../../lib/auth/mode";
import type { AuthSession } from "../../lib/auth/port";
import { decideRouteAccess, isPublicPath, safeReturnTo } from "../../lib/auth/route-guard";

const DEMO_ORG = "org-demo-buehnenblick";
const FREMDE_ORG = "org-test-zweite-buehne";

const session: AuthSession = {
  userId: "user-test-owner",
  email: "owner@buehnenblick.test",
  displayName: "Rita Ohlsen (Test)",
  emailVerified: true,
  memberships: [
    { organizationId: DEMO_ORG, organizationName: "Bühnenblick (Demo)", role: "owner" },
  ],
  activeOrganizationId: DEMO_ORG,
  expiresAt: new Date(Date.now() + 60_000),
};

describe("Demo- oder Server-Pfad (O7)", () => {
  it("schaltet den Guard genau dann ein, wenn der Demo-Modus aus ist", () => {
    expect(isAuthGuardEnabled({ NEXT_PUBLIC_DEMO_MODE: "false" })).toBe(true);
    expect(isAuthGuardEnabled({ NEXT_PUBLIC_DEMO_MODE: "FALSE" })).toBe(true);
    expect(isAuthGuardEnabled({ NEXT_PUBLIC_DEMO_MODE: "true" })).toBe(false);
    // Vergessene Variable darf nicht heimlich den Demo-Schutz abschalten.
    expect(isAuthGuardEnabled({})).toBe(false);
  });
});

describe("Öffentliche Pfade (O7)", () => {
  it("lässt genau die Anmeldeseiten und Auth-Endpunkte ohne Session zu", () => {
    for (const path of ["/login", "/login/", "/register", "/forgot-password", "/api/auth/login"]) {
      expect(isPublicPath(path)).toBe(true);
    }
  });

  it("schützt alles andere — auch neue Routen, die noch niemand kennt", () => {
    for (const path of ["/", "/veranstaltungen", "/kalender", "/einstellungen", "/api/events", "/loginX"]) {
      expect(isPublicPath(path)).toBe(false);
    }
  });
});

describe("Guard-Entscheidung (O7)", () => {
  it("leitet unauthentifizierte Zugriffe mit Rücksprungziel auf die Anmeldung", () => {
    expect(
      decideRouteAccess({
        pathname: "/veranstaltungen",
        session: null,
        returnTo: "/veranstaltungen?q=poetry",
      }),
    ).toEqual({ kind: "redirect-to-login", returnTo: "/veranstaltungen?q=poetry" });
  });

  it("lässt die Anmeldeseite auch ohne Session durch (sonst Endlosschleife)", () => {
    expect(decideRouteAccess({ pathname: "/login", session: null, returnTo: "/login" })).toEqual({
      kind: "allow",
    });
  });

  it("lässt angemeldete Zugriffe auf die eigene Organisation durch", () => {
    expect(
      decideRouteAccess({
        pathname: "/veranstaltungen",
        session,
        requestedOrganizationId: DEMO_ORG,
        returnTo: "/veranstaltungen",
      }),
    ).toEqual({ kind: "allow" });
  });

  it("antwortet bei fremder organizationId in der URL mit 403 statt Redirect", () => {
    expect(
      decideRouteAccess({
        pathname: "/veranstaltungen",
        session,
        requestedOrganizationId: FREMDE_ORG,
        returnTo: "/veranstaltungen",
      }),
    ).toEqual({ kind: "forbidden", reason: "no-membership" });
  });

  it("ignoriert einen leeren org-Parameter, statt daraus einen Fehler zu machen", () => {
    expect(
      decideRouteAccess({
        pathname: "/",
        session,
        requestedOrganizationId: "  ",
        returnTo: "/",
      }),
    ).toEqual({ kind: "allow" });
  });
});

describe("returnTo ist nur Ziel, nie Datenquelle (O7)", () => {
  it("akzeptiert relative Pfade und wehrt offene Weiterleitungen ab", () => {
    expect(safeReturnTo("/veranstaltungen?q=poetry")).toBe("/veranstaltungen?q=poetry");
    expect(safeReturnTo("//boese.example/phish")).toBe("/");
    expect(safeReturnTo("https://boese.example")).toBe("/");
    expect(safeReturnTo("javascript:alert(1)")).toBe("/");
    expect(safeReturnTo(null)).toBe("/");
    expect(safeReturnTo("")).toBe("/");
  });
});

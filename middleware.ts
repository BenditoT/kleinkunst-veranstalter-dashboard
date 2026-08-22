import { NextResponse, type NextRequest } from "next/server";

import { isAuthGuardEnabled } from "./lib/auth/mode";
import { ORGANIZATION_QUERY_PARAM, decideRouteAccess } from "./lib/auth/route-guard";
import { SESSION_COOKIE_NAME, resolveSessionSecret, verifySessionCookie } from "./lib/auth/session-cookie";

/**
 * ROUTEN-GUARD (O7).
 *
 * Greift NUR im Node-Server-Pfad (`output: "standalone"`,
 * `NEXT_PUBLIC_DEMO_MODE=false`). Der statische GitHub-Pages-Export
 * enthält gar keine Middleware — `next build` mit `output: "export"` warnt
 * das ausdrücklich an und liefert reine Dateien aus. Genau deshalb bleibt
 * dort das PIN-Gate als Sichtschutz bestehen und in der Demo dürfen
 * ausschließlich erfundene Daten liegen (ADR 3, Entscheidung 1).
 *
 * Warum Middleware und nicht nur ein Layout-Guard: eine neue Route ist
 * damit automatisch geschützt. Ein Layout-Guard müsste in jeder neuen
 * Route erneut eingebaut werden — und wird irgendwann vergessen.
 *
 * Die Middleware ist die ERSTE Verteidigungslinie, nicht die einzige:
 * `getRequestOrganizationContext()` prüft Session und Mitgliedschaft
 * unabhängig davon noch einmal (Verteidigung in der Tiefe).
 */
export async function middleware(request: NextRequest) {
  if (!isAuthGuardEnabled()) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
  const session = await verifySessionCookie(
    request.cookies.get(SESSION_COOKIE_NAME)?.value,
    resolveSessionSecret(),
  );

  const decision = decideRouteAccess({
    pathname,
    session,
    requestedOrganizationId: request.nextUrl.searchParams.get(ORGANIZATION_QUERY_PARAM),
    returnTo: `${pathname}${search}`,
  });

  if (decision.kind === "allow") {
    return NextResponse.next();
  }

  if (decision.kind === "forbidden") {
    return new NextResponse(
      "403 — Kein Zugriff auf diese Organisation.\n\n" +
        "Sie sind angemeldet, gehören dieser Organisation aber nicht an.",
      { status: 403, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  const loginUrl = new URL("/login", request.nextUrl);
  loginUrl.searchParams.set("returnTo", decision.returnTo);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  /**
   * Alles außer den von Next selbst ausgelieferten Dateien. Die
   * Feinentscheidung (öffentliche Seiten, Auth-Endpunkte) trifft
   * `isPublicPath()` — an einer Stelle, die auch der Unit-Test kennt.
   */
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fonts/).*)"],
};

import { NextResponse, type NextRequest } from "next/server";

import { createAuthPort, isAuthGuardEnabled } from "@/lib/auth";
import { SESSION_COOKIE_NAME, signSessionCookie, sessionCookieOptions } from "@/lib/auth/session-cookie";
import { cookies } from "next/headers";

/**
 * Organisationswechsel (O7).
 *
 * Der Kern der Mandantengrenze in einem Endpunkt: `activeOrganizationId`
 * ist laut `lib/auth/port.ts` „serverseitig gespeichert, nicht vom Client
 * gesetzt". Ein Wechsel ist deshalb kein Query-Parameter und kein
 * Client-Cookie, sondern eine geprüfte Aktion:
 *
 *   1. Session lesen und verifizieren (Cookie-Signatur).
 *   2. `resolveOrganizationContext(session, gewuenschteId)` — gibt es dazu
 *      eine Mitgliedschaft?
 *   3. Nein → 403. Ja → Session mit neuer `activeOrganizationId` neu
 *      signieren und als Cookie setzen.
 *
 * Ohne Schritt 2 wäre jeder Datenzugriff der ganzen App offen: der
 * Datenport fragt nichts mehr nach, er vertraut dem Kontext.
 */
export async function POST(request: NextRequest) {
  if (!isAuthGuardEnabled()) {
    return NextResponse.json(
      { ok: false, message: "Im Demo-Modus gibt es nur eine Organisation." },
      { status: 404 },
    );
  }

  let organizationId = "";

  try {
    const body = (await request.json()) as Record<string, unknown>;
    organizationId = typeof body?.organizationId === "string" ? body.organizationId.trim() : "";
  } catch {
    return NextResponse.json({ ok: false, message: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!organizationId) {
    return NextResponse.json(
      { ok: false, message: "Bitte eine Organisation angeben." },
      { status: 400 },
    );
  }

  const auth = createAuthPort();
  const session = await auth.getSession();

  if (!session) {
    return NextResponse.json({ ok: false, message: "Nicht angemeldet." }, { status: 401 });
  }

  const context = auth.resolveOrganizationContext(session, organizationId);

  if (!context) {
    // Bewusst ohne Details: ob es die Organisation überhaupt gibt, geht
    // jemanden ohne Mitgliedschaft nichts an.
    return NextResponse.json(
      { ok: false, message: "Kein Zugriff auf diese Organisation." },
      { status: 403 },
    );
  }

  const membership = session.memberships.find(
    (candidate) => candidate.organizationId === context.organizationId,
  );

  const updated = { ...session, activeOrganizationId: context.organizationId };

  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: await signSessionCookie(updated),
    ...sessionCookieOptions(),
  });

  return NextResponse.json({
    ok: true,
    organizationName: membership?.organizationName ?? "",
    role: context.role,
  });
}

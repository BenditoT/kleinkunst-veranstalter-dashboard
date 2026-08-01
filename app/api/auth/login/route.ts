import { NextResponse, type NextRequest } from "next/server";

import { createAuthPort, isAuthGuardEnabled } from "@/lib/auth";
import { authErrorMessage } from "@/lib/auth/messages";
import { clientRateLimitKey } from "@/lib/auth/request";

/**
 * Anmeldung (O6).
 *
 * Route Handler statt Server Action, weil derselbe Quellbaum auch als
 * statischer Export gebaut wird (GitHub-Pages-Demo) — Server Actions
 * lassen sich dort nicht bauen, ein Route Handler wird beim Export
 * einfach nicht mit ausgeliefert.
 *
 * Der Handler setzt das Session-Cookie selbst; die Antwort enthält
 * ausschließlich Anzeigedaten, niemals Tokens oder die
 * Mitgliedschaftsliste (ADR 3: der Client sieht höchstens `SessionView`).
 */
export async function POST(request: NextRequest) {
  if (!isAuthGuardEnabled()) {
    // Demo-Modus: es gibt bewusst keine echte Anmeldung. Ohne diesen
    // Riegel könnte ein Demodienst mit Testzugangsdaten „echt" wirken.
    return NextResponse.json(
      { ok: false, message: "Im Demo-Modus ist keine echte Anmeldung vorgesehen." },
      { status: 404 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Ungültige Anfrage." }, { status: 400 });
  }

  const email = readString(body, "email");
  const password = readString(body, "password");

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, message: "Bitte E-Mail-Adresse und Passwort ausfüllen." },
      { status: 400 },
    );
  }

  const auth = createAuthPort({ clientKey: clientRateLimitKey(request) });
  const result = await auth.signInWithPassword({ email, password });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error, message: authErrorMessage(result.error) },
      { status: result.error === "rate-limited" ? 429 : 401 },
    );
  }

  const membership = result.value.memberships.find(
    (candidate) => candidate.organizationId === result.value.activeOrganizationId,
  );

  return NextResponse.json({
    ok: true,
    session: {
      displayName: result.value.displayName,
      email: result.value.email,
      role: membership?.role ?? "viewer",
      organizationName: membership?.organizationName ?? "",
    },
  });
}

function readString(body: unknown, key: string): string {
  if (typeof body !== "object" || body === null) {
    return "";
  }

  const value = (body as Record<string, unknown>)[key];

  return typeof value === "string" ? value.trim() : "";
}

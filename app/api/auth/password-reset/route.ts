import { NextResponse, type NextRequest } from "next/server";

import { createAuthPort, isAuthGuardEnabled } from "@/lib/auth";
import { authErrorMessage } from "@/lib/auth/messages";
import { clientRateLimitKey } from "@/lib/auth/request";

/**
 * Passwort-Reset anfordern (O6).
 *
 * Die Antwort ist für bekannte und unbekannte Adressen identisch — sonst
 * wäre das Formular ein Werkzeug, um herauszufinden, wer einen Zugang hat.
 * Der tatsächliche Mailversand ist in diesem Sprint nicht implementiert
 * (kein SMTP angebunden); der Port-Aufruf und die Bremse sind es.
 */
export async function POST(request: NextRequest) {
  if (!isAuthGuardEnabled()) {
    return NextResponse.json(
      { ok: false, message: "Im Demo-Modus wird kein Reset-Link versendet." },
      { status: 404 },
    );
  }

  let email = "";

  try {
    const body = (await request.json()) as Record<string, unknown>;
    email = typeof body?.email === "string" ? body.email.trim() : "";
  } catch {
    return NextResponse.json({ ok: false, message: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json(
      { ok: false, message: "Bitte E-Mail-Adresse ausfüllen." },
      { status: 400 },
    );
  }

  const auth = createAuthPort({ clientKey: clientRateLimitKey(request) });
  const result = await auth.sendPasswordResetLink(email);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error, message: authErrorMessage(result.error) },
      { status: result.error === "rate-limited" ? 429 : 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    message:
      "Falls ein Zugang zu dieser E-Mail-Adresse existiert, wurde ein Link zum Zurücksetzen verschickt.",
  });
}

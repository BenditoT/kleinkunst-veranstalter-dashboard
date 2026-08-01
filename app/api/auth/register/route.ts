import { NextResponse, type NextRequest } from "next/server";

import { isAuthGuardEnabled } from "@/lib/auth";
import { checkPasswordPolicy } from "@/lib/auth/password";

/**
 * Registrierung (O6) — Validierung echt, Anlage noch nicht.
 *
 * Warum trotzdem schon ein Handler: die Passwortregel muss laut
 * Sicherheits-Review server- UND clientseitig geprüft werden. Eine reine
 * Client-Prüfung ist keine Prüfung — ein direkter Aufruf dieses Endpunkts
 * würde sie sonst umgehen. Die eigentliche Anlage (Organisation + Owner
 * schreiben) gehört zum CRUD-Sprint (Sprint 3) und meldet hier ehrlich
 * 501, statt Erfolg vorzutäuschen.
 */
export async function POST(request: NextRequest) {
  if (!isAuthGuardEnabled()) {
    return NextResponse.json(
      { ok: false, message: "Im Demo-Modus wird keine Organisation angelegt." },
      { status: 404 },
    );
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Ungültige Anfrage." }, { status: 400 });
  }

  const organizationName = readString(body, "organizationName");
  const email = readString(body, "email");
  const password = typeof body.password === "string" ? body.password : "";

  if (!organizationName || !email || !password) {
    return NextResponse.json(
      { ok: false, message: "Bitte Organisationsname, E-Mail-Adresse und Passwort ausfüllen." },
      { status: 400 },
    );
  }

  const policy = checkPasswordPolicy(password);

  if (!policy.ok) {
    return NextResponse.json({ ok: false, message: policy.message }, { status: 400 });
  }

  return NextResponse.json(
    {
      ok: false,
      message:
        "Die Registrierung wird erst mit dem CRUD-Sprint freigeschaltet. Zugänge legt bis dahin die Projektleitung an.",
    },
    { status: 501 },
  );
}

function readString(body: Record<string, unknown>, key: string): string {
  const value = body[key];

  return typeof value === "string" ? value.trim() : "";
}

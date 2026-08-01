import { NextResponse } from "next/server";

import { createAuthPort, isAuthGuardEnabled } from "@/lib/auth";

/**
 * Abmeldung (O6). Löscht das Session-Cookie serverseitig.
 *
 * Nur POST: ein GET-Logout wäre über ein `<img src>` von fremden Seiten
 * auslösbar (CSRF-Ärgernis). Zusammen mit `SameSite=Lax` schickt ein
 * fremdes Formular das Cookie ohnehin nicht mit.
 */
export async function POST() {
  if (!isAuthGuardEnabled()) {
    return NextResponse.json({ ok: true });
  }

  await createAuthPort().signOut();

  return NextResponse.json({ ok: true });
}

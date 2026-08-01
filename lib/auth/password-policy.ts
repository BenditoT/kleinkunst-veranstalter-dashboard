/**
 * Passwortregel (O6) — bewusst OHNE `node:crypto`.
 *
 * Eigene Datei, damit das Anmeldeformular (Client-Komponente) dieselbe
 * Regel benutzen kann wie der Route Handler. Läge sie in `password.ts`,
 * würde der Client-Import das Hashing-Modul samt `node:crypto` ins Bundle
 * ziehen und der Build scheitern.
 *
 * Die verbindliche Prüfung ist immer die serverseitige — diese hier
 * erspart dem Nutzer nur den Umweg über das Absenden.
 */

/** Mindestlänge laut Sicherheits-Review (Sprint 2). Client UND Server prüfen. */
export const MIN_PASSWORD_LENGTH = 12;

export type PasswordPolicyResult = { ok: true } | { ok: false; message: string };

/**
 * Absichtlich knapp und ohne Zeichenklassen-Zwang: Länge ist der
 * wirksamste Einzelfaktor, alles Weitere schiebt Nutzer nur zu
 * `Sommer2026!`.
 */
export function checkPasswordPolicy(password: string): PasswordPolicyResult {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      message: `Das Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen lang sein.`,
    };
  }

  return { ok: true };
}

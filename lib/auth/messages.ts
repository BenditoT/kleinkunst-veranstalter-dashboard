import type { AuthError } from "./port";

/**
 * Deutsche Fehlertexte für den Anmeldepfad (O6).
 *
 * Eigenes Modul ohne Server-Importe, damit Route Handler UND
 * Client-Formular dieselben Texte benutzen — sonst driften sie
 * auseinander und der Nutzer sieht je nach Weg eine andere Meldung.
 *
 * `invalid-credentials` nennt bewusst weder „E-Mail unbekannt" noch
 * „Passwort falsch": beides zusammen wäre eine Nutzer-Aufzählung.
 */
export const authErrorMessages: Record<AuthError, string> = {
  "invalid-credentials": "E-Mail-Adresse oder Passwort ist falsch.",
  "email-not-verified":
    "Diese E-Mail-Adresse ist noch nicht bestätigt. Bitte zuerst den Bestätigungslink aufrufen.",
  "no-membership":
    "Zu diesem Zugang gehört keine Organisation. Bitte lassen Sie sich von einer Inhaberin oder einem Inhaber einladen.",
  "rate-limited":
    "Zu viele Fehlversuche. Aus Sicherheitsgründen ist die Anmeldung für 15 Minuten gesperrt.",
  "provider-unavailable":
    "Der Anmeldedienst ist gerade nicht erreichbar. Bitte versuchen Sie es später erneut.",
};

export function authErrorMessage(error: AuthError): string {
  return authErrorMessages[error] ?? authErrorMessages["provider-unavailable"];
}

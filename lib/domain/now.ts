/**
 * Liefert den Referenzzeitpunkt für "heute".
 *
 * Produktiv immer der reale, aktuelle Zeitpunkt (new Date()). Für
 * deterministische E2E-Builds kann NEXT_PUBLIC_FIXED_NOW gesetzt werden
 * (siehe playwright.config.ts) - dann liefert diese Funktion einen fixen
 * Zeitpunkt statt "new Date()", damit Testtexte reproduzierbar bleiben (S7).
 */
export function getReferenceNow(): Date {
  const override = process.env.NEXT_PUBLIC_FIXED_NOW;

  return override ? new Date(override) : new Date();
}

import { isDemoModeEnabled } from "./pin";

/**
 * Der EINE Schalter zwischen Demo-Pfad und Server-Pfad (O7).
 *
 * Eigene Datei ohne `next/headers`-Import, damit die Middleware
 * (Edge-Runtime) ihn benutzen kann, ohne den ganzen Auth-Port ins
 * Edge-Bundle zu ziehen.
 *
 * Warum überhaupt zwei Welten nebeneinander (ADR 3, Entscheidung 1):
 *
 * - **Demo an** (Default): Der GitHub-Pages-Build ist ein statischer
 *   Export. Es gibt keinen Server, der eine Session prüfen könnte — jede
 *   Seite liegt als Datei auf einem CDN. Ein „Auth-Guard" wäre dort eine
 *   Lüge. Deshalb gilt dort das PIN-Gate als Sichtschutz und die harte
 *   Regel „nur erfundene Daten" (siehe `lib/auth/pin.ts`).
 * - **Demo aus** (`NEXT_PUBLIC_DEMO_MODE=false`): Node-Server-Pfad
 *   (`output: "standalone"`). Das PIN-Gate verschwindet vollständig,
 *   dafür greifen Middleware, Session-Prüfung und Mandantengrenze.
 *
 * Ein Schalter statt zwei, damit es keinen Zustand geben kann, in dem
 * weder das eine noch das andere greift.
 */
export function isAuthGuardEnabled(
  env: Partial<Record<string, string | undefined>> = process.env,
): boolean {
  return !isDemoModeEnabled({ NEXT_PUBLIC_DEMO_MODE: env.NEXT_PUBLIC_DEMO_MODE });
}

/**
 * DEMO-ZUGANG — KEIN AUTHENTIFIZIERUNGSSYSTEM (O4)
 * ================================================
 *
 * Dieses Modul ist ausdrücklich KEIN Auth. Es ist ein Sichtschutz für die
 * öffentliche GitHub-Pages-Demo und darf niemals die Grundlage der echten
 * Anmeldung werden. Der echte Weg ist der Auth-Port
 * (`docs/architecture/auth-port.md`, Umsetzung in Sprint 2).
 *
 * Warum das kein Schutz ist: der GitHub-Pages-Build ist ein statischer
 * Export. Jede Seite, jedes JSON und jeder Datensatz liegt als Datei auf
 * dem CDN und ist per direkter URL abrufbar, ganz ohne PIN. Die PIN
 * verhindert nur, dass jemand versehentlich auf der Startseite landet.
 * Deshalb dürfen in dieser Demo ausschließlich erfundene Daten liegen.
 *
 * Rotation: Der Wert kommt aus `NEXT_PUBLIC_DEMO_PIN` (Build-Zeit).
 * In GitHub wird er über die Repository-Variable `DEMO_PIN` gesetzt —
 * Rotation also ohne Code-Änderung und ohne roten Test. `DEMO_PIN_FALLBACK`
 * greift nur, wenn nichts konfiguriert ist (lokale Entwicklung).
 */

export const DEMO_PIN_FALLBACK = "69198";

export const DEMO_PIN_LENGTH = 5;

type DemoEnvironment = {
  NEXT_PUBLIC_DEMO_PIN?: string;
  NEXT_PUBLIC_DEMO_MODE?: string;
};

/** Ermittelt die gültige Demo-PIN aus einer Umgebung (testbar, ohne Bundler-Magie). */
export function resolveDemoPin(env: DemoEnvironment): string {
  const configured = env.NEXT_PUBLIC_DEMO_PIN?.trim();

  return configured ? configured : DEMO_PIN_FALLBACK;
}

/**
 * Demo-Modus an/aus. Alles außer einem expliziten "false" gilt als an,
 * damit die bestehende Demo nicht durch eine vergessene Variable aufgeht.
 * Ab Sprint 2 schaltet `NEXT_PUBLIC_DEMO_MODE=false` das PIN-Gate und die
 * simulierten Auth-Formulare gemeinsam ab.
 */
export function isDemoModeEnabled(env: DemoEnvironment): boolean {
  return env.NEXT_PUBLIC_DEMO_MODE?.trim().toLowerCase() !== "false";
}

/**
 * Zugriff auf die Build-Zeit-Konfiguration.
 *
 * Die `process.env.NEXT_PUBLIC_*`-Zugriffe stehen bewusst als vollständige
 * Literale hier — nur so ersetzt Next sie beim Build durch den Wert.
 */
export function getDemoConfig(): { pin: string; demoMode: boolean } {
  const env: DemoEnvironment = {
    NEXT_PUBLIC_DEMO_PIN: process.env.NEXT_PUBLIC_DEMO_PIN,
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
  };

  return { pin: resolveDemoPin(env), demoMode: isDemoModeEnabled(env) };
}

export function normalizePin(pin: string): string {
  return pin.trim();
}

/** Formatregel für die Eingabe: genau `DEMO_PIN_LENGTH` Ziffern. */
export function hasValidPinFormat(pin: string): boolean {
  return new RegExp(`^\\d{${DEMO_PIN_LENGTH}}$`).test(normalizePin(pin));
}

export function isValidDemoPin(pin: string, expectedPin: string): boolean {
  return normalizePin(pin) === expectedPin;
}

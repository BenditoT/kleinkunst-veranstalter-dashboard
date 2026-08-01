/**
 * Anmeldeversuchs-Bremse (O6, Sicherheits-Review Sprint 2).
 *
 * Bewusst klein und In-Memory: der lokale Test-Adapter läuft in einem
 * einzelnen Node-Prozess, ein Redis dafür wäre in diesem Sprint Ballast.
 * Sobald mehrere Instanzen laufen (Cloud Run skaliert), MUSS das durch
 * einen geteilten Speicher ersetzt werden — bis dahin steht das hier als
 * offener Punkt in `docs/architecture/auth-port.md`.
 *
 * Gezählt werden nur Fehlversuche. Ein Erfolg löscht den Zähler, damit
 * ein Nutzer mit einem Tippfehler nicht bestraft wird.
 */

export type RateLimiterOptions = {
  /** Fehlversuche, bis gesperrt wird. */
  maxAttempts: number;
  /** Zeitfenster in Millisekunden. */
  windowMs: number;
};

export type RateLimiter = {
  /** true = gesperrt, Anmeldung darf gar nicht erst geprüft werden. */
  isBlocked(key: string, now?: number): boolean;
  /** Zählt einen Fehlversuch und meldet, ob damit die Sperre greift. */
  registerFailure(key: string, now?: number): boolean;
  /** Erfolgreiche Anmeldung: Zähler weg. */
  reset(key: string): void;
  /** Nur für Tests. */
  clear(): void;
};

export const DEFAULT_RATE_LIMIT: RateLimiterOptions = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
};

export function createRateLimiter(options: RateLimiterOptions = DEFAULT_RATE_LIMIT): RateLimiter {
  const attempts = new Map<string, number[]>();

  function recent(key: string, now: number): number[] {
    const timestamps = attempts.get(key);

    if (!timestamps) {
      return [];
    }

    const cutoff = now - options.windowMs;
    const kept = timestamps.filter((timestamp) => timestamp > cutoff);

    if (kept.length === 0) {
      attempts.delete(key);
    } else {
      attempts.set(key, kept);
    }

    return kept;
  }

  return {
    isBlocked(key, now = Date.now()) {
      return recent(key, now).length >= options.maxAttempts;
    },

    registerFailure(key, now = Date.now()) {
      const kept = recent(key, now);
      kept.push(now);
      attempts.set(key, kept);

      return kept.length >= options.maxAttempts;
    },

    reset(key) {
      attempts.delete(key);
    },

    clear() {
      attempts.clear();
    },
  };
}

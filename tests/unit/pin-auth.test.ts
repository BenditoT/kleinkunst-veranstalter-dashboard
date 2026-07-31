import { describe, expect, it } from "vitest";

import {
  DEMO_PIN_FALLBACK,
  DEMO_PIN_LENGTH,
  hasValidPinFormat,
  isDemoModeEnabled,
  isValidDemoPin,
  normalizePin,
  resolveDemoPin,
} from "../../lib/auth/pin";

/**
 * Der Test prüft Format und Verhalten, NICHT den konkreten Wert (O4).
 * Vorher stand hier `expect(DEMO_LOGIN_PIN).toBe("69198")` — damit war
 * jede PIN-Rotation gleichbedeutend mit roter CI.
 */
describe("Demo-PIN (Sichtschutz, kein Auth)", () => {
  it("nimmt die PIN aus der Umgebung und fällt nur ohne Konfiguration zurück", () => {
    expect(resolveDemoPin({ NEXT_PUBLIC_DEMO_PIN: "13579" })).toBe("13579");
    expect(resolveDemoPin({ NEXT_PUBLIC_DEMO_PIN: "  24680  " })).toBe("24680");
    expect(resolveDemoPin({ NEXT_PUBLIC_DEMO_PIN: "" })).toBe(DEMO_PIN_FALLBACK);
    expect(resolveDemoPin({})).toBe(DEMO_PIN_FALLBACK);
  });

  it("hält das erwartete Eingabeformat ein", () => {
    expect(DEMO_PIN_LENGTH).toBe(5);
    expect(hasValidPinFormat(DEMO_PIN_FALLBACK)).toBe(true);
    expect(hasValidPinFormat("1234")).toBe(false);
    expect(hasValidPinFormat("123456")).toBe(false);
    expect(hasValidPinFormat("12a45")).toBe(false);
    expect(hasValidPinFormat("")).toBe(false);
  });

  it("akzeptiert nur die konfigurierte PIN und ignoriert Leerraum", () => {
    const pin = resolveDemoPin({ NEXT_PUBLIC_DEMO_PIN: "13579" });

    expect(normalizePin(" 13579 ")).toBe("13579");
    expect(isValidDemoPin(" 13579 ", pin)).toBe(true);
    expect(isValidDemoPin("13578", pin)).toBe(false);
    expect(isValidDemoPin("", pin)).toBe(false);
    expect(isValidDemoPin(DEMO_PIN_FALLBACK, pin)).toBe(false);
  });

  it("schaltet den Demo-Modus nur bei explizitem false ab", () => {
    expect(isDemoModeEnabled({})).toBe(true);
    expect(isDemoModeEnabled({ NEXT_PUBLIC_DEMO_MODE: "true" })).toBe(true);
    expect(isDemoModeEnabled({ NEXT_PUBLIC_DEMO_MODE: "False" })).toBe(false);
    expect(isDemoModeEnabled({ NEXT_PUBLIC_DEMO_MODE: " false " })).toBe(false);
  });
});

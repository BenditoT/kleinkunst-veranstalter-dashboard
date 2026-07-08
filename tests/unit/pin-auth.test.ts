import { describe, expect, it } from "vitest";

import { DEMO_LOGIN_PIN, isValidDemoPin, normalizePin } from "../../lib/auth/pin";

describe("demo PIN login", () => {
  it("uses the requested PIN as the default GitHub Pages gate", () => {
    expect(DEMO_LOGIN_PIN).toBe("69198");
  });

  it("normalizes whitespace and accepts only the configured PIN", () => {
    expect(normalizePin(" 69198 ")).toBe("69198");
    expect(isValidDemoPin("69198")).toBe(true);
    expect(isValidDemoPin("69197")).toBe(false);
    expect(isValidDemoPin("")).toBe(false);
  });
});

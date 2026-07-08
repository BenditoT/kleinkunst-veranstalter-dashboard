export const DEMO_LOGIN_PIN = "69198" as const;

export function normalizePin(pin: string): string {
  return pin.trim();
}

export function isValidDemoPin(pin: string, expectedPin: string = DEMO_LOGIN_PIN): boolean {
  return normalizePin(pin) === expectedPin;
}

import { DEMO_ORGANIZATION_ID } from "../../../lib/data/context";
import { TEST_ORGANIZATION_ID } from "../../../lib/auth/test-users";

/**
 * TESTZUGÄNGE — NUR TEST, erfundene Personen (S2).
 *
 * Die Klartextpasswörter stehen bewusst nur hier, in `.env.example` und in
 * `tests/unit/auth-port.test.ts`; im Anwendungscode liegt ausschließlich der
 * scrypt-Hash (`lib/auth/test-users.ts`). Sie schützen nichts — die
 * Personen existieren nicht, die Domain `.test` (RFC 2606) kann niemandem
 * gehören.
 */

export const ORGANIZATION_A = DEMO_ORGANIZATION_ID;
export const ORGANIZATION_B = TEST_ORGANIZATION_ID;

export type TestAccount = {
  /** Schlüssel und zugleich Dateiname des storageState. */
  key: "owner" | "viewer" | "fremde-org" | "doppel";
  email: string;
  password: string;
  /** Kurzbeschreibung für Testnamen und Fehlermeldungen. */
  beschreibung: string;
};

export const testAccounts: readonly TestAccount[] = [
  {
    key: "owner",
    email: "owner@buehnenblick.test",
    password: "Buehnenblick-2026!",
    beschreibung: "owner in Organisation A",
  },
  {
    key: "viewer",
    email: "viewer@buehnenblick.test",
    password: "Nur-Lesen-2026-Test",
    beschreibung: "viewer in Organisation A",
  },
  {
    key: "fremde-org",
    email: "manager@zweitebuehne.test",
    password: "Zweite-Buehne-2026!",
    beschreibung: "manager in Organisation B",
  },
  {
    key: "doppel",
    email: "doppel@buehnenblick.test",
    password: "Beide-Buehnen-2026!",
    beschreibung: "member in A, viewer in B",
  },
] as const;

export function storageStatePath(key: TestAccount["key"]): string {
  return `tests/e2e/server/.auth/${key}.json`;
}

export function accountFor(key: TestAccount["key"]): TestAccount {
  const account = testAccounts.find((candidate) => candidate.key === key);

  if (!account) {
    throw new Error(`Unbekannter Testzugang: ${key}`);
  }

  return account;
}

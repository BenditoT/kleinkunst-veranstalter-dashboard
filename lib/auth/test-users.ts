import { DEMO_ORGANIZATION_ID } from "../data/context";
import type { OrganizationMembership } from "./port";

/**
 * TEST-FIXTURES — NUR TEST, KEINE ECHTEN PERSONEN (O6)
 * ====================================================
 *
 * Erfundene Nutzer für den lokalen Anmelde-Adapter, exakt nach demselben
 * Muster wie die Demodaten in `lib/domain/sample-data.ts`: Fantasienamen,
 * `.test`-Domains (RFC 2606, kann niemandem gehören), keine echten
 * Adressen, keine echten Personen. Diese Liste darf niemals in einen
 * Produktivpfad geraten — der Adapter wird dort durch Identity Platform
 * ersetzt (siehe `lib/auth/adapters/identity-platform.ts`).
 *
 * Die Passwörter stehen NICHT im Code. Gespeichert ist ausschließlich der
 * scrypt-Hash (`lib/auth/password.ts`). Die Klartextwerte stehen in
 * `.env.example` bzw. in HANDOVER.md als Testzugang — sie schützen nichts
 * und sind Teil der Testeinrichtung.
 *
 * Zwei Organisationen, damit die Mandantengrenze überhaupt beweisbar ist:
 * die Demo-Organisation und eine zweite Testorganisation mit derselben ID
 * wie in `tests/unit/data-port.test.ts`.
 */

/** Zweite Testorganisation — identisch zu `tests/unit/data-port.test.ts`. */
export const TEST_ORGANIZATION_ID = "org-test-zweite-buehne";

export const DEMO_ORGANIZATION_NAME = "Bühnenblick (Demo)";
export const TEST_ORGANIZATION_NAME = "Zweite Bühne (Test)";

export type LocalUser = {
  userId: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  /** scrypt-Hash, erzeugt mit `hashPassword()`. Nie Klartext. */
  passwordHash: string;
  memberships: OrganizationMembership[];
};

export const localTestUsers: readonly LocalUser[] = [
  {
    userId: "user-test-owner",
    email: "owner@buehnenblick.test",
    displayName: "Rita Ohlsen (Test)",
    emailVerified: true,
    passwordHash:
      "scrypt$16384$8$1$pMnaN3dmdKziQdcTCQVcWQ==$/SviLN68oacXehNbwMxsvkeZoXiBLU93uJpqZYrufTOzGnQ7StvRlvO8HtxY9jUwT5bqBtYJF2G+lreyV8vICA==",
    memberships: [
      {
        organizationId: DEMO_ORGANIZATION_ID,
        organizationName: DEMO_ORGANIZATION_NAME,
        role: "owner",
      },
    ],
  },
  {
    userId: "user-test-viewer",
    email: "viewer@buehnenblick.test",
    displayName: "Timo Frisch (Test)",
    emailVerified: true,
    passwordHash:
      "scrypt$16384$8$1$zCXegUs7pWetZrgfD9c6qg==$CKEYQ0POTpVtWU7lJBqvvnCdjJoKmgsU9MEFuTKZkuRZTSwYbaNJaXkPmVobAus4RTyV5GmgeGaBJ0HhpV0tuA==",
    memberships: [
      {
        organizationId: DEMO_ORGANIZATION_ID,
        organizationName: DEMO_ORGANIZATION_NAME,
        role: "viewer",
      },
    ],
  },
  {
    userId: "user-test-fremde-org",
    email: "manager@zweitebuehne.test",
    displayName: "Anke Lorbeer (Test)",
    emailVerified: true,
    passwordHash:
      "scrypt$16384$8$1$emZ8RgD5JWbYJEXNBu4efA==$zQwaldbTYB52tBchWY23yTr7Y+lceN/kdvg5OAnA8sjnVVN4l7TUlVWkh1I/2S5XuVQLLyOSrdCALyAH/9mp7Q==",
    memberships: [
      {
        organizationId: TEST_ORGANIZATION_ID,
        organizationName: TEST_ORGANIZATION_NAME,
        role: "manager",
      },
    ],
  },
  {
    userId: "user-test-doppelmitglied",
    email: "doppel@buehnenblick.test",
    displayName: "Jonas Weide (Test)",
    emailVerified: true,
    passwordHash:
      "scrypt$16384$8$1$DJBDLi4Ohyvvwcu8nINFvA==$IVMkW3esZlxDVWyhi+xZAMGJ/xB79xVQDvxEo2dZsUrQiLYjRXsInH5IMfTHkFkTtF0SrCCzwBO06Gqk8e3lDQ==",
    memberships: [
      {
        organizationId: DEMO_ORGANIZATION_ID,
        organizationName: DEMO_ORGANIZATION_NAME,
        role: "member",
      },
      {
        organizationId: TEST_ORGANIZATION_ID,
        organizationName: TEST_ORGANIZATION_NAME,
        role: "viewer",
      },
    ],
  },
] as const;

/** Nicht bestätigte E-Mail: eigener Fall, damit `email-not-verified` echt ist. */
export const localUnverifiedUser: LocalUser = {
  userId: "user-test-unbestaetigt",
  email: "neu@buehnenblick.test",
  displayName: "Nele Sommer (Test)",
  emailVerified: false,
  passwordHash:
    "scrypt$16384$8$1$pMnaN3dmdKziQdcTCQVcWQ==$/SviLN68oacXehNbwMxsvkeZoXiBLU93uJpqZYrufTOzGnQ7StvRlvO8HtxY9jUwT5bqBtYJF2G+lreyV8vICA==",
  memberships: [
    {
      organizationId: DEMO_ORGANIZATION_ID,
      organizationName: DEMO_ORGANIZATION_NAME,
      role: "member",
    },
  ],
};

/** Nutzer ohne jede Mitgliedschaft: erzeugt `no-membership`, keine Session. */
export const localUserWithoutMembership: LocalUser = {
  userId: "user-test-ohne-org",
  email: "ohne-org@buehnenblick.test",
  displayName: "Pia Ohnehalt (Test)",
  emailVerified: true,
  passwordHash:
    "scrypt$16384$8$1$pMnaN3dmdKziQdcTCQVcWQ==$/SviLN68oacXehNbwMxsvkeZoXiBLU93uJpqZYrufTOzGnQ7StvRlvO8HtxY9jUwT5bqBtYJF2G+lreyV8vICA==",
  memberships: [],
};

export const allLocalTestUsers: readonly LocalUser[] = [
  ...localTestUsers,
  localUnverifiedUser,
  localUserWithoutMembership,
];

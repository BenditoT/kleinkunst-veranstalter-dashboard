import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  createLocalCredentialsAuthPort,
  type SessionCookieAttributes,
  type SessionCookieStore,
} from "../../lib/auth/adapters/local-credentials";
import { checkPasswordPolicy, MIN_PASSWORD_LENGTH } from "../../lib/auth/password-policy";
import { hashPassword, verifyPassword } from "../../lib/auth/password";
import { createRateLimiter } from "../../lib/auth/rate-limit";
import {
  SESSION_COOKIE_NAME,
  signSessionCookie,
  verifySessionCookie,
} from "../../lib/auth/session-cookie";
import type { AuthSession } from "../../lib/auth/port";

/**
 * Testzugangsdaten (NUR TEST, erfundene Personen — siehe lib/auth/test-users.ts).
 * Die Klartextwerte stehen bewusst nur hier und in .env.example; im
 * Anwendungscode liegt ausschließlich der scrypt-Hash.
 */
const OWNER = { email: "owner@buehnenblick.test", password: "Buehnenblick-2026!" };
const VIEWER = { email: "viewer@buehnenblick.test", password: "Nur-Lesen-2026-Test" };
const FREMDE_ORG = { email: "manager@zweitebuehne.test", password: "Zweite-Buehne-2026!" };
const UNVERIFIED = { email: "neu@buehnenblick.test", password: "Buehnenblick-2026!" };
const OHNE_ORG = { email: "ohne-org@buehnenblick.test", password: "Buehnenblick-2026!" };

const TEST_SECRET = "test-secret-mindestens-zweiunddreissig-zeichen";

const cookieAttributes: SessionCookieAttributes = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
  maxAge: 8 * 60 * 60,
};

type RecordedCookie = { value: string; attributes: SessionCookieAttributes };

function createCookieJar(): SessionCookieStore & { readonly jar: Map<string, RecordedCookie> } {
  const jar = new Map<string, RecordedCookie>();

  return {
    jar,
    get: (name) => jar.get(name)?.value,
    set: (name, value, attributes) => {
      jar.set(name, { value, attributes });
    },
    delete: (name) => {
      jar.delete(name);
    },
  };
}

function createPort(overrides: Partial<Parameters<typeof createLocalCredentialsAuthPort>[0]> = {}) {
  const cookies = overrides.cookies ?? createCookieJar();

  return {
    cookies: cookies as ReturnType<typeof createCookieJar>,
    port: createLocalCredentialsAuthPort({
      cookies,
      cookieAttributes,
      secret: TEST_SECRET,
      rateLimiter: createRateLimiter(),
      ...overrides,
    }),
  };
}

describe("Passwort-Hashing (O6)", () => {
  it("verifiziert ein korrektes Passwort und lehnt ein falsches ab", async () => {
    const stored = await hashPassword("Ein-sehr-langes-Testpasswort");

    expect(stored.startsWith("scrypt$")).toBe(true);
    expect(stored).not.toContain("Ein-sehr-langes-Testpasswort");
    expect(await verifyPassword("Ein-sehr-langes-Testpasswort", stored)).toBe(true);
    expect(await verifyPassword("Ein-sehr-langes-Testpasswor", stored)).toBe(false);
  });

  it("erzeugt für dasselbe Passwort unterschiedliche Hashes (Salt)", async () => {
    const [first, second] = await Promise.all([hashPassword("Zwoelf-Zeichen!"), hashPassword("Zwoelf-Zeichen!")]);

    expect(first).not.toBe(second);
  });

  it("lehnt kaputte oder manipulierte Hash-Strings ab, statt zu werfen", async () => {
    expect(await verifyPassword("egal", "")).toBe(false);
    expect(await verifyPassword("egal", "plaintext")).toBe(false);
    expect(await verifyPassword("egal", "scrypt$16384$8$1$$")).toBe(false);
    expect(await verifyPassword("egal", "bcrypt$16384$8$1$AAAA$AAAA")).toBe(false);
  });

  it("erzwingt die Mindestlänge", () => {
    expect(checkPasswordPolicy("kurz").ok).toBe(false);
    expect(checkPasswordPolicy("x".repeat(MIN_PASSWORD_LENGTH - 1)).ok).toBe(false);
    expect(checkPasswordPolicy("x".repeat(MIN_PASSWORD_LENGTH)).ok).toBe(true);
  });
});

describe("Session-Cookie (O6)", () => {
  const session: AuthSession = {
    userId: "user-test-owner",
    email: OWNER.email,
    displayName: "Rita Ohlsen (Test)",
    emailVerified: true,
    memberships: [
      { organizationId: "org-demo-buehnenblick", organizationName: "Bühnenblick (Demo)", role: "owner" },
    ],
    activeOrganizationId: "org-demo-buehnenblick",
    expiresAt: new Date(Date.now() + 60_000),
  };

  it("signiert und verifiziert eine Session verlustfrei", async () => {
    const cookie = await signSessionCookie(session, TEST_SECRET);
    const restored = await verifySessionCookie(cookie, TEST_SECRET);

    expect(restored?.userId).toBe("user-test-owner");
    expect(restored?.memberships).toEqual(session.memberships);
  });

  it("erkennt eine manipulierte Mitgliedschaft (Kern der Mandantengrenze)", async () => {
    const cookie = await signSessionCookie(session, TEST_SECRET);
    const [version, payload, signature] = cookie.split(".");
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

    decoded.memberships.push({
      organizationId: "org-test-zweite-buehne",
      organizationName: "Fremde Organisation",
      role: "owner",
    });

    const forged = [
      version,
      Buffer.from(JSON.stringify(decoded), "utf8").toString("base64url"),
      signature,
    ].join(".");

    expect(await verifySessionCookie(forged, TEST_SECRET)).toBeNull();
  });

  it("lehnt ein Cookie mit fremdem Geheimnis, kaputtem Format und abgelaufener Frist ab", async () => {
    const cookie = await signSessionCookie(session, TEST_SECRET);

    expect(await verifySessionCookie(cookie, "ein-vollstaendig-anderes-geheimnis-32")).toBeNull();
    expect(await verifySessionCookie("", TEST_SECRET)).toBeNull();
    expect(await verifySessionCookie("v1.nur-zwei-teile", TEST_SECRET)).toBeNull();
    expect(await verifySessionCookie(cookie, TEST_SECRET, Date.now() + 120_000)).toBeNull();
  });
});

describe("Anmeldung über den Auth-Port (O6)", () => {
  it("erzeugt bei korrekten Zugangsdaten eine echte, verifizierbare Session", async () => {
    const { port, cookies } = createPort();
    const result = await port.signInWithPassword(OWNER);

    expect(result.ok).toBe(true);

    const stored = cookies.jar.get(SESSION_COOKIE_NAME);
    expect(stored).toBeDefined();
    expect(stored?.attributes).toMatchObject({ httpOnly: true, secure: true, sameSite: "lax" });

    // Nicht nur „ein Cookie ist da": es muss serverseitig verifizierbar sein.
    const session = await port.getSession();
    expect(session?.email).toBe(OWNER.email);
    expect(session?.activeOrganizationId).toBe("org-demo-buehnenblick");
  });

  it("weist ein falsches Passwort und eine unbekannte E-Mail identisch ab", async () => {
    const { port, cookies } = createPort();

    expect(await port.signInWithPassword({ email: OWNER.email, password: "falsch-aber-lang!" })).toEqual({
      ok: false,
      error: "invalid-credentials",
    });
    expect(await port.signInWithPassword({ email: "gibtsnicht@example.test", password: "irgendwas123" })).toEqual({
      ok: false,
      error: "invalid-credentials",
    });
    expect(cookies.jar.size).toBe(0);
  });

  it("sperrt nach fünf Fehlversuchen und prüft den sechsten gar nicht mehr", async () => {
    const { port, cookies } = createPort();

    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(await port.signInWithPassword({ email: OWNER.email, password: "falsch-aber-lang!" })).toEqual({
        ok: false,
        error: "invalid-credentials",
      });
    }

    // Sechster Versuch — und zwar mit dem RICHTIGEN Passwort: die Sperre
    // greift vor jeder Prüfung, sonst wäre sie kein Schutz gegen Raten.
    expect(await port.signInWithPassword(OWNER)).toEqual({ ok: false, error: "rate-limited" });
    expect(cookies.jar.size).toBe(0);
  });

  it("löscht den Zähler nach einer erfolgreichen Anmeldung", async () => {
    const { port } = createPort();

    await port.signInWithPassword({ email: OWNER.email, password: "falsch-aber-lang!" });
    await port.signInWithPassword({ email: OWNER.email, password: "falsch-aber-lang!" });
    expect((await port.signInWithPassword(OWNER)).ok).toBe(true);

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await port.signInWithPassword({ email: OWNER.email, password: "falsch-aber-lang!" });
    }

    expect(await port.signInWithPassword(OWNER)).toEqual({ ok: false, error: "rate-limited" });
  });

  it("gibt die Sperre nach Ablauf des Zeitfensters wieder frei", async () => {
    let now = 1_000_000;
    const { port } = createPort({ now: () => now });

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await port.signInWithPassword({ email: OWNER.email, password: "falsch-aber-lang!" });
    }

    expect(await port.signInWithPassword(OWNER)).toEqual({ ok: false, error: "rate-limited" });

    now += 15 * 60 * 1000 + 1;
    expect((await port.signInWithPassword(OWNER)).ok).toBe(true);
  });

  it("unterscheidet unbestätigte E-Mail und fehlende Mitgliedschaft", async () => {
    const { port } = createPort();

    expect(await port.signInWithPassword(UNVERIFIED)).toEqual({
      ok: false,
      error: "email-not-verified",
    });
    expect(await port.signInWithPassword(OHNE_ORG)).toEqual({ ok: false, error: "no-membership" });
  });

  it("meldet ab, indem es das Cookie serverseitig entfernt", async () => {
    const { port, cookies } = createPort();

    await port.signInWithPassword(OWNER);
    expect(await port.getSession()).not.toBeNull();

    await port.signOut();

    expect(cookies.jar.size).toBe(0);
    expect(await port.getSession()).toBeNull();
  });

  it("verrät beim Passwort-Reset nicht, ob eine Adresse existiert — bremst aber", async () => {
    const { port } = createPort();

    expect(await port.sendPasswordResetLink(OWNER.email)).toEqual({ ok: true, value: undefined });
    expect(await port.sendPasswordResetLink("gibtsnicht@example.test")).toEqual({
      ok: true,
      value: undefined,
    });

    for (let attempt = 0; attempt < 4; attempt += 1) {
      await port.sendPasswordResetLink(OWNER.email);
    }

    expect(await port.sendPasswordResetLink(OWNER.email)).toEqual({ ok: false, error: "rate-limited" });
  });

  it("meldet den zweiten Testnutzer in seine eigene Organisation an", async () => {
    const { port } = createPort();
    const result = await port.signInWithPassword(FREMDE_ORG);

    expect(result.ok && result.value.activeOrganizationId).toBe("org-test-zweite-buehne");
  });

  it("meldet den Viewer mit seiner eingeschränkten Rolle an", async () => {
    const { port } = createPort();
    const result = await port.signInWithPassword(VIEWER);

    expect(result.ok && result.value.memberships[0].role).toBe("viewer");
  });
});

/**
 * Akzeptanzkriterium O6: „Passwörter liegen nirgends im Klartext".
 *
 * Der Test kennt keine Implementierung, nur die Eigenschaft: keine der
 * Testzugangs-Passphrasen darf im Anwendungscode auftauchen. Er würde
 * genauso anschlagen, wenn jemand später ein echtes Passwort einträgt.
 */
describe("Keine Klartext-Passwörter im Anwendungscode (O6)", () => {
  it("findet keine der Testpassphrasen unter lib/, app/ oder components/", () => {
    const projectRoot = join(__dirname, "..", "..");
    const passwords = [OWNER.password, VIEWER.password, FREMDE_ORG.password, "Beide-Buehnen-2026!"];
    const offenders: string[] = [];

    for (const relativePath of listSourceFiles(projectRoot, ["lib", "app", "components"])) {
      const contents = readFileSync(join(projectRoot, relativePath), "utf8");

      if (passwords.some((password) => contents.includes(password))) {
        offenders.push(relativePath);
      }
    }

    expect(offenders).toEqual([]);
  });
});

function listSourceFiles(projectRoot: string, directories: string[]): string[] {
  const files: string[] = [];

  function walk(relativeDir: string) {
    for (const entry of readdirSync(join(projectRoot, relativeDir), { withFileTypes: true })) {
      const entryPath = join(relativeDir, entry.name);

      if (entry.isDirectory()) {
        walk(entryPath);
      } else if (entryPath.endsWith(".ts") || entryPath.endsWith(".tsx")) {
        files.push(entryPath);
      }
    }
  }

  for (const directory of directories) {
    walk(directory);
  }

  return files;
}

import { createOrganizationContext, type OrganizationContext } from "../../data/context";
import { organizationRoles, type OrganizationRole } from "../../domain/types";
import { UnauthenticatedError } from "../errors";
import { verifyPassword } from "../password";
import type {
  AuthPort,
  AuthResult,
  AuthSession,
  SignInWithPasswordInput,
} from "../port";
import { createRateLimiter, type RateLimiter } from "../rate-limit";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  resolveSessionSecret,
  signSessionCookie,
  verifySessionCookie,
} from "../session-cookie";
import { allLocalTestUsers, type LocalUser } from "../test-users";

/**
 * LOKALER ANMELDE-ADAPTER (O6) — Implementierung von `lib/auth/port.ts`.
 *
 * Erfüllt exakt dieselbe Schnittstelle wie der spätere
 * Identity-Platform-Adapter, nur gegen eine feste Liste erfundener
 * Testnutzer statt gegen einen Anbieter. Analog zum In-Memory-Datenport
 * aus O3: alles außer der Anbieteranbindung ist damit fertig und testbar,
 * ohne dass ein GCP-Projekt existieren muss.
 *
 * Was hier ECHT ist (nicht simuliert):
 * - Passwortprüfung gegen scrypt-Hashes, nirgends Klartext.
 * - Signiertes, `httpOnly`/`secure`/`SameSite=Lax`-Session-Cookie, das bei
 *   jedem Request serverseitig verifiziert wird.
 * - Sperre nach zu vielen Fehlversuchen (`rate-limited`).
 * - Mitgliedschaftsprüfung in `resolveOrganizationContext()`.
 *
 * Was hier NICHT echt ist: der Versand der Passwort-Reset-Mail (kein
 * SMTP in diesem Sprint) und die Nutzerverwaltung (Registrierung schreibt
 * nichts — das ist Sprint 3).
 */

/**
 * Minimaler Cookie-Zugriff. Absichtlich nicht `next/headers`: so lässt
 * sich der Adapter im Unit-Test ohne Next-Request-Kontext betreiben, und
 * ein anderer Server (Route Handler, Middleware, Tests) kann denselben
 * Adapter mit seinem eigenen Cookie-Speicher benutzen.
 */
export type SessionCookieStore = {
  get(name: string): string | undefined;
  set(name: string, value: string, options: SessionCookieAttributes): void;
  delete(name: string): void;
};

export type SessionCookieAttributes = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAge: number;
};

export type LocalCredentialsOptions = {
  cookies: SessionCookieStore;
  cookieAttributes: SessionCookieAttributes;
  users?: readonly LocalUser[];
  secret?: string;
  /** Prozessweit geteilt — sonst wäre die Sperre pro Request wirkungslos. */
  rateLimiter?: RateLimiter;
  /** Zweiter Sperrschlüssel neben der E-Mail (in der Regel die Client-IP). */
  clientKey?: string;
  now?: () => number;
  /** Wie „nicht angemeldet" nach außen wirkt (Next: `redirect("/login")`). */
  onUnauthenticated?: () => never;
};

/**
 * Prozessweiter Zähler. Muss außerhalb der Factory liegen: der Port wird
 * pro Request neu gebaut, die Sperre muss Requests überdauern.
 */
const sharedRateLimiter = createRateLimiter();

export function getSharedRateLimiter(): RateLimiter {
  return sharedRateLimiter;
}

export function createLocalCredentialsAuthPort(options: LocalCredentialsOptions): AuthPort {
  const users = options.users ?? allLocalTestUsers;
  const secret = options.secret ?? resolveSessionSecret();
  const limiter = options.rateLimiter ?? sharedRateLimiter;
  const now = options.now ?? (() => Date.now());

  function rateLimitKeys(email: string): string[] {
    const keys = [`email:${normalizeEmail(email)}`];

    if (options.clientKey) {
      keys.push(`client:${options.clientKey}`);
    }

    return keys;
  }

  async function getSession(): Promise<AuthSession | null> {
    return verifySessionCookie(options.cookies.get(SESSION_COOKIE_NAME), secret, now());
  }

  return {
    getSession,

    async requireSession(): Promise<AuthSession> {
      const session = await getSession();

      if (session) {
        return session;
      }

      if (options.onUnauthenticated) {
        options.onUnauthenticated();
      }

      throw new UnauthenticatedError();
    },

    async signInWithPassword(input: SignInWithPasswordInput): Promise<AuthResult<AuthSession>> {
      const timestamp = now();
      const keys = rateLimitKeys(input.email);

      // Sperre VOR jeder Prüfung: ein gesperrter Versuch darf nicht einmal
      // mehr verraten, ob die E-Mail existiert oder das Passwort stimmt.
      if (keys.some((key) => limiter.isBlocked(key, timestamp))) {
        return { ok: false, error: "rate-limited" };
      }

      const user = users.find((candidate) => normalizeEmail(candidate.email) === normalizeEmail(input.email));

      // Auch für eine unbekannte E-Mail wird gerechnet (Dummy-Hash gleicher
      // Parameter), damit die Antwortzeit nicht verrät, welche Adressen
      // registriert sind.
      const passwordMatches = await verifyPassword(
        input.password,
        user ? user.passwordHash : DUMMY_HASH,
      );

      if (!user || !passwordMatches) {
        for (const key of keys) {
          limiter.registerFailure(key, timestamp);
        }

        return { ok: false, error: "invalid-credentials" };
      }

      if (!user.emailVerified) {
        return { ok: false, error: "email-not-verified" };
      }

      if (user.memberships.length === 0) {
        // Kein stiller Standardkontext: ohne Mitgliedschaft gibt es keine
        // Session, sonst hinge ein Nutzer ohne Organisation in der App.
        return { ok: false, error: "no-membership" };
      }

      limiter.reset(keys[0]);

      if (keys[1]) {
        limiter.reset(keys[1]);
      }

      const session: AuthSession = {
        userId: user.userId,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        memberships: user.memberships,
        activeOrganizationId: user.memberships[0].organizationId,
        expiresAt: new Date(timestamp + SESSION_MAX_AGE_SECONDS * 1000),
      };

      options.cookies.set(
        SESSION_COOKIE_NAME,
        await signSessionCookie(session, secret),
        options.cookieAttributes,
      );

      return { ok: true, value: session };
    },

    async signOut(): Promise<void> {
      options.cookies.delete(SESSION_COOKIE_NAME);
    },

    async sendPasswordResetLink(email: string): Promise<AuthResult<void>> {
      const timestamp = now();
      const keys = rateLimitKeys(email);

      if (keys.some((key) => limiter.isBlocked(key, timestamp))) {
        return { ok: false, error: "rate-limited" };
      }

      // Jeder Aufruf zählt als Versuch: ohne Bremse wäre das ein
      // Mail-Bombing-Werkzeug gegen fremde Adressen.
      for (const key of keys) {
        limiter.registerFailure(key, timestamp);
      }

      // Immer `ok` — ob eine Adresse registriert ist, darf die Antwort
      // nicht verraten (Nutzer-Aufzählung). Der Versand selbst ist in
      // diesem Sprint bewusst nicht implementiert (kein SMTP).
      return { ok: true, value: undefined };
    },

    resolveOrganizationContext(
      session: AuthSession,
      requestedOrganizationId?: string,
    ): OrganizationContext | null {
      const targetId = requestedOrganizationId ?? session.activeOrganizationId;

      if (!targetId) {
        return null;
      }

      const membership = session.memberships.find(
        (candidate) => candidate.organizationId === targetId,
      );

      if (!membership) {
        // Der Kern der Mandantengrenze: ein Wunsch aus der URL, zu dem es
        // keine Mitgliedschaft gibt, ergibt KEINEN Kontext — insbesondere
        // nicht den Standardkontext des Nutzers.
        return null;
      }

      return createOrganizationContext(membership.organizationId, membership.role);
    },

    hasRoleAtLeast(context: OrganizationContext, minimum: OrganizationRole): boolean {
      const actual = organizationRoles.indexOf(context.role);
      const required = organizationRoles.indexOf(minimum);

      if (actual === -1 || required === -1) {
        return false;
      }

      // `organizationRoles` ist absteigend nach Rechten sortiert
      // (owner = 0 … viewer = 4), ein kleinerer Index heißt also mehr Rechte.
      return actual <= required;
    },
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Hash eines Zufallswertes, den niemand kennt. Nur dazu da, für unbekannte
 * E-Mail-Adressen dieselbe Rechenzeit zu verbrauchen wie für bekannte.
 */
const DUMMY_HASH =
  "scrypt$16384$8$1$4fW58Wn2m8CvryOqzXZY+w==$M2wsZHWN60R0UvY3ESwzGLPf7QH8vZHkh8EKFbaEFCmk9vOXGYxg1Zi14/werTyNEC2aAj/yjpBr8TkOvZ/qtg==";

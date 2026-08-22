import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createIdentityPlatformAuthPort } from "./adapters/identity-platform";
import {
  createLocalCredentialsAuthPort,
  type SessionCookieAttributes,
  type SessionCookieStore,
} from "./adapters/local-credentials";
import type { AuthPort } from "./port";
import { sessionCookieOptions } from "./session-cookie";

export type { AuthPort, AuthSession, AuthError, AuthResult, SessionView } from "./port";
export { SESSION_COOKIE_NAME } from "./session-cookie";
export {
  OrganizationAccessError,
  RoleRequiredError,
  UnauthenticatedError,
  isForbiddenError,
} from "./errors";

/**
 * Bindung des Auth-Ports an den Next-Request-Kontext (O6).
 *
 * Dieses Modul importiert `next/headers` und läuft deshalb ausschließlich
 * serverseitig und ausschließlich innerhalb eines Requests. Der Adapter
 * selbst (`adapters/local-credentials.ts`) kennt Next nicht — er bekommt
 * nur einen Cookie-Speicher und ist damit ohne Next-Kontext testbar.
 */

type AuthEnvironment = Partial<Record<string, string | undefined>>;

export { isAuthGuardEnabled } from "./mode";

export type CreateAuthPortOptions = {
  /** Zusätzlicher Sperrschlüssel neben der E-Mail, üblicherweise die Client-IP. */
  clientKey?: string;
  /** true = `requireSession()` löst einen Next-Redirect auf `/login` aus. */
  redirectOnMissingSession?: boolean;
  returnTo?: string;
};

/**
 * Erzeugt den Auth-Port für die konfigurierte Umgebung.
 *
 * Gleiche Bauweise wie `createDataPort()` (O3): ein unbekannter Adapter
 * scheitert laut, statt in einer Produktivumgebung stillschweigend
 * Testzugänge zu akzeptieren.
 */
export function createAuthPort(
  options: CreateAuthPortOptions = {},
  env: AuthEnvironment = process.env,
): AuthPort {
  const adapter = env.AUTH_ADAPTER ?? "local-credentials";

  if (adapter === "identity-platform") {
    return createIdentityPlatformAuthPort();
  }

  if (adapter !== "local-credentials") {
    throw new Error(
      `Auth-Adapter "${adapter}" ist unbekannt. Verfügbar: "local-credentials" (Testzugänge) ` +
        'und "identity-platform" (noch nicht implementiert). Siehe docs/architecture/auth-port.md.',
    );
  }

  return createLocalCredentialsAuthPort({
    cookies: nextCookieStore(),
    cookieAttributes: sessionCookieOptions(env as NodeJS.ProcessEnv),
    clientKey: options.clientKey,
    onUnauthenticated: options.redirectOnMissingSession
      ? () => {
          const target = options.returnTo
            ? `/login?returnTo=${encodeURIComponent(options.returnTo)}`
            : "/login";
          redirect(target);
        }
      : undefined,
  });
}

/**
 * Adapter zwischen Next's Cookie-API und dem schmalen Speicher, den der
 * Auth-Adapter erwartet. `cookies().set()` funktioniert nur in Route
 * Handlern und Server Actions — beim Lesen in einer Server-Komponente
 * wirft Next dort. Deshalb wird der Schreibfehler bewusst nicht
 * verschluckt: er zeigt einen Programmierfehler an, keinen Nutzerfehler.
 */
function nextCookieStore(): SessionCookieStore {
  return {
    get(name: string) {
      return cookies().get(name)?.value;
    },
    set(name: string, value: string, attributes: SessionCookieAttributes) {
      cookies().set({ name, value, ...attributes });
    },
    delete(name: string) {
      cookies().delete(name);
    },
  };
}

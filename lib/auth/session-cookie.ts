import type { AuthSession, OrganizationMembership } from "./port";

/**
 * Session-Cookie: Format, Signatur, Verifikation (O6).
 *
 * Warum WebCrypto (`globalThis.crypto.subtle`) und nicht `node:crypto`:
 * dieses Modul läuft AUCH in der Middleware (Edge-Runtime), die kein
 * `node:crypto` kennt. HMAC-SHA-256 gibt es in beiden Laufzeiten.
 * Passwort-Hashing (scrypt) bleibt dagegen in `password.ts` und damit
 * ausschließlich im Node-Pfad.
 *
 * Signiert, nicht verschlüsselt — bewusst:
 * - Der Inhalt ist kein Geheimnis (E-Mail, Organisations-IDs, Rolle); er
 *   liegt beim Nutzer, dem er ohnehin gehört.
 * - Das Cookie ist `httpOnly`, kein Skript im Browser liest es.
 * - Was zählt, ist Unfälschbarkeit: niemand darf sich eine Mitgliedschaft
 *   in einer fremden Organisation ins Cookie schreiben. Genau das
 *   verhindert die HMAC-Signatur.
 * Eine Verschlüsselung würde hier nur Komplexität ohne Schutzgewinn
 * hinzufügen. Sobald personenbezogene Daten ins Cookie sollen (tun sie
 * nicht), müsste das neu bewertet werden.
 *
 * Aufbau: `v1.<base64url(payload)>.<base64url(hmac)>`, signiert wird
 * `v1.<base64url(payload)>` — der Versionspräfix steckt mit in der
 * Signatur, damit ein Downgrade auf ein späteres schwächeres Format nicht
 * geht.
 */

export const SESSION_COOKIE_NAME = "kd_session";

/** Gültigkeit einer Session: 8 Stunden (ein Arbeitstag am Dashboard). */
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

/**
 * Cookie-Optionen laut ADR 3 — nicht verhandelbar.
 *
 * `secure` ist außerhalb der Produktion abschaltbar, weil ein
 * `secure`-Cookie über `http://localhost` nicht gesetzt wird und die
 * lokale Entwicklung sonst gar nicht anmeldbar wäre. In Produktion ist es
 * immer an.
 */
export function sessionCookieOptions(env: NodeJS.ProcessEnv = process.env) {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production" || env.AUTH_COOKIE_SECURE === "true",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

const DEV_SECRET_FALLBACK = "kleinkunst-dashboard-entwicklungs-secret-nur-lokal";

/**
 * Das Signatur-Geheimnis. In Produktion Pflicht — ohne gesetzten Wert
 * scheitert der Start laut, statt still mit einem im Repository
 * nachlesbaren Schlüssel zu signieren (jeder könnte sich sonst eine
 * Session bauen).
 */
export function resolveSessionSecret(env: NodeJS.ProcessEnv = process.env): string {
  const configured = env.AUTH_SESSION_SECRET?.trim();

  if (configured && configured.length >= 32) {
    return configured;
  }

  if (env.NODE_ENV === "production") {
    throw new Error(
      "AUTH_SESSION_SECRET fehlt oder ist kürzer als 32 Zeichen. Ohne Signatur-Geheimnis " +
        "wäre jede Session fälschbar — siehe .env.example und docs/architecture/auth-port.md.",
    );
  }

  return DEV_SECRET_FALLBACK;
}

/** Was tatsächlich im Cookie steht — die Session ohne Date-Objekte. */
type SessionPayload = {
  userId: string;
  email: string;
  displayName: string | null;
  emailVerified: boolean;
  memberships: OrganizationMembership[];
  activeOrganizationId: string | null;
  /** Unix-Zeit in Millisekunden. */
  expiresAt: number;
};

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Gibt bewusst einen `ArrayBuffer` zurück (nicht `Uint8Array`): WebCrypto
 * erwartet `BufferSource`, und ein `Uint8Array` ist ohne `target: es2015`
 * an dieser Stelle nicht zuweisungskompatibel.
 */
function decodeBase64Url(value: string): ArrayBuffer {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return buffer;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return globalThis.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/** Erzeugt den Cookie-Wert für eine Session. */
export async function signSessionCookie(
  session: AuthSession,
  secret: string = resolveSessionSecret(),
): Promise<string> {
  const payload: SessionPayload = {
    userId: session.userId,
    email: session.email,
    displayName: session.displayName,
    emailVerified: session.emailVerified,
    memberships: session.memberships,
    activeOrganizationId: session.activeOrganizationId,
    expiresAt: session.expiresAt.getTime(),
  };

  const body = `v1.${encodeBase64Url(new TextEncoder().encode(JSON.stringify(payload)))}`;
  const signature = await globalThis.crypto.subtle.sign(
    "HMAC",
    await importKey(secret),
    new TextEncoder().encode(body),
  );

  return `${body}.${encodeBase64Url(new Uint8Array(signature))}`;
}

/**
 * Prüft Signatur und Ablauf und gibt die Session zurück — oder `null`.
 *
 * Ein `null` heißt immer „nicht angemeldet". Es gibt bewusst keine
 * Unterscheidung zwischen „kaputt", „gefälscht" und „abgelaufen" nach
 * außen; alle drei führen zum selben Redirect auf `/login`.
 */
export async function verifySessionCookie(
  value: string | undefined | null,
  secret: string = resolveSessionSecret(),
  now: number = Date.now(),
): Promise<AuthSession | null> {
  if (!value) {
    return null;
  }

  const parts = value.split(".");

  if (parts.length !== 3 || parts[0] !== "v1") {
    return null;
  }

  const body = `${parts[0]}.${parts[1]}`;

  let valid = false;

  try {
    valid = await globalThis.crypto.subtle.verify(
      "HMAC",
      await importKey(secret),
      decodeBase64Url(parts[2]),
      new TextEncoder().encode(body),
    );
  } catch {
    return null;
  }

  if (!valid) {
    return null;
  }

  let payload: SessionPayload;

  try {
    payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[1]))) as SessionPayload;
  } catch {
    return null;
  }

  if (!isSessionPayload(payload) || payload.expiresAt <= now) {
    return null;
  }

  return {
    userId: payload.userId,
    email: payload.email,
    displayName: payload.displayName,
    emailVerified: payload.emailVerified,
    memberships: payload.memberships,
    activeOrganizationId: payload.activeOrganizationId,
    expiresAt: new Date(payload.expiresAt),
  };
}

/**
 * Strukturprüfung nach dem Entschlüsseln. Die Signatur beweist nur, dass
 * WIR den Wert erzeugt haben — nicht, dass er zum heutigen Codestand passt
 * (altes Cookie nach einem Feldwechsel). Deshalb wird der Inhalt geprüft.
 */
function isSessionPayload(value: unknown): value is SessionPayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<SessionPayload>;

  return (
    typeof candidate.userId === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.emailVerified === "boolean" &&
    typeof candidate.expiresAt === "number" &&
    Array.isArray(candidate.memberships) &&
    candidate.memberships.every(
      (membership) =>
        typeof membership?.organizationId === "string" &&
        typeof membership?.organizationName === "string" &&
        typeof membership?.role === "string",
    )
  );
}

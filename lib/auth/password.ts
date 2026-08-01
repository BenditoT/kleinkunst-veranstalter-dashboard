import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

/**
 * Passwort-Hashing mit Node-Bordmitteln (O6).
 *
 * Bewusst keine neue Abhängigkeit: `crypto.scrypt` ist ein speicherhartes
 * KDF (dieselbe Familie wie bcrypt/argon2 im Sinne der Angriffskosten) und
 * seit Node 10 im Standard enthalten. Der Vergleich läuft über
 * `crypto.timingSafeEqual`, damit die Antwortzeit nicht verrät, wie viele
 * Bytes eines falschen Hashes zufällig gestimmt haben.
 *
 * Serialisierung: `scrypt$N$r$p$<salt-base64>$<hash-base64>`. Die Parameter
 * stehen im String, damit ein späterer Anbieterwechsel oder eine Erhöhung
 * der Kosten alte Hashes weiter verifizieren kann.
 *
 * Dieses Modul ist NUR serverseitig (`node:crypto`). Die Middleware nutzt
 * es nicht — dort läuft nur die Cookie-Prüfung aus `session-cookie.ts`.
 */

export { MIN_PASSWORD_LENGTH, checkPasswordPolicy } from "./password-policy";
export type { PasswordPolicyResult } from "./password-policy";

const SCRYPT_COST = 16_384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password.normalize("NFKC"),
      salt,
      KEY_LENGTH,
      { N: SCRYPT_COST, r: SCRYPT_BLOCK_SIZE, p: SCRYPT_PARALLELIZATION },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey);
      },
    );
  });
}

/** Erzeugt einen neuen Hash inklusive frischem Zufalls-Salt. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const derived = await deriveKey(password, salt);

  return [
    "scrypt",
    SCRYPT_COST,
    SCRYPT_BLOCK_SIZE,
    SCRYPT_PARALLELIZATION,
    salt.toString("base64"),
    derived.toString("base64"),
  ].join("$");
}

/**
 * Prüft ein Passwort gegen einen gespeicherten Hash.
 *
 * Gibt bei kaputtem/unbekanntem Hash-Format `false` zurück statt zu werfen —
 * ein defekter Datensatz darf keine Anmeldung durchlassen und auch keinen
 * 500er erzeugen, aus dem sich Rückschlüsse ziehen lassen.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");

  if (parts.length !== 6 || parts[0] !== "scrypt") {
    return false;
  }

  const [, costRaw, blockSizeRaw, parallelizationRaw, saltRaw, hashRaw] = parts;
  const cost = Number(costRaw);
  const blockSize = Number(blockSizeRaw);
  const parallelization = Number(parallelizationRaw);

  if (!Number.isInteger(cost) || !Number.isInteger(blockSize) || !Number.isInteger(parallelization)) {
    return false;
  }

  const salt = Buffer.from(saltRaw, "base64");
  const expected = Buffer.from(hashRaw, "base64");

  if (salt.length === 0 || expected.length === 0) {
    return false;
  }

  const actual = await new Promise<Buffer | null>((resolve) => {
    scrypt(
      password.normalize("NFKC"),
      salt,
      expected.length,
      { N: cost, r: blockSize, p: parallelization },
      (error, derivedKey) => resolve(error ? null : derivedKey),
    );
  });

  if (!actual || actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}

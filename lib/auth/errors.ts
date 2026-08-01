/**
 * Fehlerbilder der Mandantengrenze (O7/O8).
 *
 * Absichtlich zwei getrennte Klassen: „nicht angemeldet" ist ein
 * Redirect auf `/login`, „angemeldet, aber nicht berechtigt" ist ein 403
 * und darf NIE zu einem Redirect werden — sonst schickt man einen
 * angemeldeten Nutzer in eine Anmeldeschleife und verwischt die
 * Unterscheidung, die für Sicherheitsprüfungen wichtig ist.
 */

export class UnauthenticatedError extends Error {
  readonly status = 401;

  constructor(readonly returnTo?: string) {
    super("Keine gültige Session.");
    this.name = "UnauthenticatedError";
  }
}

/**
 * 403. Ausgelöst, wenn `resolveOrganizationContext()` `null` liefert —
 * also wenn jemand eine Organisation anfragt, in der er keine
 * Mitgliedschaft hat. Die Meldung nennt bewusst KEINE Details über die
 * fremde Organisation (existiert sie? wie heißt sie?).
 */
export class OrganizationAccessError extends Error {
  readonly status = 403;

  constructor(readonly requestedOrganizationId?: string) {
    super("Kein Zugriff auf diese Organisation.");
    this.name = "OrganizationAccessError";
  }
}

/** 403 wegen zu geringer Rolle (z. B. `viewer` will schreiben). */
export class RoleRequiredError extends Error {
  readonly status = 403;

  constructor(
    readonly required: string,
    readonly actual: string,
  ) {
    super(`Diese Aktion erfordert mindestens die Rolle "${required}".`);
    this.name = "RoleRequiredError";
  }
}

export function isForbiddenError(error: unknown): error is OrganizationAccessError | RoleRequiredError {
  return error instanceof OrganizationAccessError || error instanceof RoleRequiredError;
}

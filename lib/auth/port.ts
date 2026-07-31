import type { OrganizationContext } from "../data/context";
import type { OrganizationRole } from "../domain/types";

/**
 * AUTH-PORT — Entwurf für Sprint 2 (O4).
 *
 * Bewusst nur Typen: keine Provider-Implementierung, keine Abhängigkeit,
 * kein Laufzeitcode. Die erste Implementierung wird Google Identity
 * Platform (`lib/auth/adapters/identity-platform.ts`), die Begründung und
 * der Migrationspfad stehen in `docs/architecture/auth-port.md`.
 *
 * Zwei Regeln, die jede Implementierung einhalten MUSS:
 *
 * 1. `organizationId` entsteht ausschließlich aus der Session und der
 *    geprüften Mitgliedschaft — nie aus Formdaten, Query-Parametern,
 *    Cookies der App oder Headern (Sprintplan-Leitplanke Sprint 2).
 * 2. Der Port läuft nur serverseitig. Client-Komponenten bekommen höchstens
 *    ein schmales, bereits geprüftes Abbild (`SessionView`) als Prop.
 */

/** Eine Mitgliedschaft = die Verbindung Nutzer ↔ Organisation ↔ Rolle. */
export type OrganizationMembership = {
  organizationId: string;
  organizationName: string;
  role: OrganizationRole;
};

/** Serverseitige Session. Entsteht nur aus einem geprüften Provider-Token. */
export type AuthSession = {
  userId: string;
  email: string;
  displayName: string | null;
  emailVerified: boolean;
  memberships: OrganizationMembership[];
  /** Zuletzt gewählte Organisation; serverseitig gespeichert, nicht vom Client gesetzt. */
  activeOrganizationId: string | null;
  expiresAt: Date;
};

/** Was eine Client-Komponente höchstens erfahren darf. */
export type SessionView = {
  displayName: string | null;
  email: string;
  role: OrganizationRole;
  organizationName: string;
};

export type SignInWithPasswordInput = {
  email: string;
  password: string;
};

export type AuthError =
  | "invalid-credentials"
  | "email-not-verified"
  | "no-membership"
  | "rate-limited"
  | "provider-unavailable";

export type AuthResult<T> = { ok: true; value: T } | { ok: false; error: AuthError };

export type AuthPort = {
  /** Liest die Session aus dem Request-Kontext (Cookie/Token) und verifiziert sie. */
  getSession(): Promise<AuthSession | null>;

  /** Wie `getSession`, wirft aber bzw. löst den Redirect auf die Anmeldung aus. */
  requireSession(): Promise<AuthSession>;

  signInWithPassword(input: SignInWithPasswordInput): Promise<AuthResult<AuthSession>>;
  signOut(): Promise<void>;
  sendPasswordResetLink(email: string): Promise<AuthResult<void>>;

  /**
   * Der Kern der Mandantengrenze.
   *
   * `requestedOrganizationId` darf aus der URL kommen (Organisationswechsel),
   * wird aber IMMER gegen `session.memberships` geprüft. Ist die
   * Mitgliedschaft nicht vorhanden, gibt es keinen Kontext — nicht etwa
   * einen Standardkontext. Ohne Argument gilt `activeOrganizationId`.
   *
   * Das Ergebnis ist genau der `OrganizationContext`, den der Datenport
   * verlangt; ein Aufrufer kann also gar nicht erst Daten holen, ohne
   * vorher durch diese Prüfung gegangen zu sein.
   */
  resolveOrganizationContext(
    session: AuthSession,
    requestedOrganizationId?: string,
  ): OrganizationContext | null;

  /** Rollenprüfung für Aktionen; `viewer` darf nie schreiben. */
  hasRoleAtLeast(context: OrganizationContext, minimum: OrganizationRole): boolean;
};

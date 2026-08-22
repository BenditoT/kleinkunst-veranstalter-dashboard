import { describe, expect, it } from "vitest";

import { createOrganizationContext, DEMO_ORGANIZATION_ID } from "../../lib/data/context";
import { RoleRequiredError } from "../../lib/auth/errors";
import {
  MINIMUM_WRITE_ROLE,
  canWrite,
  hasRoleAtLeast,
  requireRoleAtLeast,
} from "../../lib/auth/rbac";
import { TEST_ORGANIZATION_ID } from "../../lib/auth/test-users";
import { organizationRoles, type OrganizationRole } from "../../lib/domain/types";

/**
 * ISOLATIONSBEWEIS FÜR DIE ROLLENDURCHSETZUNG (O8).
 *
 * Prüft Verhalten, nicht Typen: dass `viewer` serverseitig abgelehnt
 * wird und dass eine gültige Session für Organisation A keinerlei
 * Schreibrecht in Organisation B erzeugt. Der Kontext ist dabei bewusst
 * das einzige Eingangssignal — genau so kommt er im Server-Pfad aus
 * `getRequestOrganizationContext()`.
 */

const writeRoles: readonly OrganizationRole[] = ["owner", "admin", "manager", "member"];

describe("Rollenrangfolge", () => {
  it("kennt genau die fünf kanonischen Rollen in absteigender Reihenfolge", () => {
    expect(organizationRoles).toEqual(["owner", "admin", "manager", "member", "viewer"]);
  });

  it("erlaubt jeder Rolle das, was ihre eigene Stufe verlangt", () => {
    for (const role of organizationRoles) {
      expect(hasRoleAtLeast(role, role)).toBe(true);
    }
  });

  it("lässt höhere Rollen durch und niedrigere nicht", () => {
    expect(hasRoleAtLeast("owner", "viewer")).toBe(true);
    expect(hasRoleAtLeast("manager", "member")).toBe(true);
    expect(hasRoleAtLeast("member", "manager")).toBe(false);
    expect(hasRoleAtLeast("viewer", "owner")).toBe(false);
  });

  it("verweigert bei unbekannter Rolle, statt im Zweifel zu erlauben", () => {
    expect(hasRoleAtLeast("redakteur" as OrganizationRole, "viewer")).toBe(false);
    expect(hasRoleAtLeast("owner", "superuser" as OrganizationRole)).toBe(false);
  });
});

describe("Schreibrecht", () => {
  it("erlaubt allen Rollen oberhalb der Lese-Rolle zu schreiben", () => {
    for (const role of writeRoles) {
      expect(canWrite(createOrganizationContext(DEMO_ORGANIZATION_ID, role))).toBe(true);
    }
  });

  it("verweigert der Rolle viewer jede Schreibaktion", () => {
    const viewer = createOrganizationContext(DEMO_ORGANIZATION_ID, "viewer");

    expect(canWrite(viewer)).toBe(false);
    expect(() => requireRoleAtLeast(viewer)).toThrow(RoleRequiredError);
  });

  it("nennt im Fehler die verlangte und die tatsächliche Rolle, aber keine Organisationsdetails", () => {
    const viewer = createOrganizationContext(DEMO_ORGANIZATION_ID, "viewer");

    try {
      requireRoleAtLeast(viewer);
      expect.unreachable("Die Schreibaktion hätte abgelehnt werden müssen.");
    } catch (error) {
      expect(error).toBeInstanceOf(RoleRequiredError);
      const roleError = error as RoleRequiredError;
      expect(roleError.status).toBe(403);
      expect(roleError.required).toBe(MINIMUM_WRITE_ROLE);
      expect(roleError.actual).toBe("viewer");
      expect(roleError.message).not.toContain(DEMO_ORGANIZATION_ID);
    }
  });

  it("gibt den Kontext unverändert zurück, wenn die Rolle reicht", () => {
    const manager = createOrganizationContext(TEST_ORGANIZATION_ID, "manager");

    expect(requireRoleAtLeast(manager)).toBe(manager);
  });
});

describe("Mandantentrennung der Rollen", () => {
  /**
   * Der entscheidende Fall: dieselbe Person ist in Organisation A
   * `owner` und in Organisation B `viewer`. Ein Kontext trägt IMMER beide
   * Angaben zusammen — Organisation UND Rolle. Es darf nie passieren,
   * dass die starke Rolle aus A in B gilt.
   */
  it("überträgt eine hohe Rolle nicht in eine andere Organisation", () => {
    const inEigenerOrg = createOrganizationContext(DEMO_ORGANIZATION_ID, "owner");
    const inFremderOrg = createOrganizationContext(TEST_ORGANIZATION_ID, "viewer");

    expect(canWrite(inEigenerOrg)).toBe(true);
    expect(canWrite(inFremderOrg)).toBe(false);
    expect(inEigenerOrg.organizationId).not.toBe(inFremderOrg.organizationId);
  });

  it("bewertet die Rolle unabhängig von der Organisations-ID", () => {
    // Wäre die Organisation Teil der Entscheidung, könnte eine
    // „bekannte" Organisation versehentlich mehr dürfen als eine andere.
    for (const organizationId of [DEMO_ORGANIZATION_ID, TEST_ORGANIZATION_ID, "org-voellig-fremd"]) {
      expect(canWrite(createOrganizationContext(organizationId, "viewer"))).toBe(false);
      expect(canWrite(createOrganizationContext(organizationId, "manager"))).toBe(true);
    }
  });
});

import { expect, test } from "@playwright/test";

import { ORGANIZATION_B, accountFor, storageStatePath } from "./test-accounts";

/**
 * AUTH-NACHWEIS IM SERVER-PFAD (S3).
 *
 * Diese Tests laufen gegen einen echten Node-Server mit
 * `NEXT_PUBLIC_DEMO_MODE=false` — nur dort existieren Middleware und
 * API-Routen überhaupt. Im statischen Demo-Export (die anderen 12 Tests)
 * gibt es beides nicht, deshalb war der komplette Anmelde- und
 * Mandantenpfad bis hierher nur durch Unit-Tests belegt.
 *
 * Jeder Test prüft eine ABLEHNUNG. Das ist Absicht: dass der glückliche
 * Fall funktioniert, sieht man sofort — dass die Grenze hält, nicht.
 */

test.describe("Server-Pfad: Anmeldung und Mandantengrenze", () => {
  test("unangemeldeter Aufruf einer geschützten Seite landet auf der Anmeldung", async ({
    page,
  }) => {
    await page.goto("/veranstaltungen");

    await expect(page).toHaveURL(/\/login\?returnTo=%2Fveranstaltungen$/);
    await expect(page.getByRole("heading", { name: "Anmelden" })).toBeVisible();
  });

  test("falsches Passwort wird abgelehnt und setzt kein Session-Cookie", async ({ request }) => {
    const owner = accountFor("owner");
    const response = await request.post("/api/auth/login", {
      data: { email: owner.email, password: "Falsches-Passwort-2026!" },
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.message).toMatch(/E-Mail-Adresse oder Passwort/i);

    const { cookies } = await request.storageState();
    expect(cookies.some((cookie) => cookie.name.includes("session"))).toBe(false);
  });

  test("nach fünf Fehlversuchen greift die Sperre statt einer weiteren Prüfung", async ({
    playwright,
  }) => {
    // Eigener Request-Kontext: der Zähler läuft pro E-Mail und IP, ein
    // geteilter Kontext würde die anderen Tests mitsperren.
    const context = await playwright.request.newContext({
      baseURL: test.info().project.use.baseURL,
    });
    const email = "rate-limit-probe@buehnenblick.test";

    let letzteAntwort = await context.post("/api/auth/login", {
      data: { email, password: "Immer-Falsch-2026!" },
    });

    for (let versuch = 2; versuch <= 6; versuch += 1) {
      letzteAntwort = await context.post("/api/auth/login", {
        data: { email, password: "Immer-Falsch-2026!" },
      });
    }

    expect(letzteAntwort.status()).toBe(429);

    const body = await letzteAntwort.json();
    expect(body.error).toBe("rate-limited");
    // Die Sperrmeldung muss sich von "falsches Passwort" unterscheiden,
    // sonst merkt niemand, dass er gesperrt ist.
    expect(body.message).not.toMatch(/E-Mail-Adresse oder Passwort/i);

    await context.dispose();
  });
});

test.describe("Server-Pfad: Rollen (viewer)", () => {
  test.use({ storageState: storageStatePath("viewer") });

  test("viewer bekommt das Event-Formular gar nicht erst ausgeliefert", async ({ page }) => {
    await page.goto("/veranstaltungen/neu");

    await expect(page.getByRole("heading", { name: "Keine Berechtigung" })).toBeVisible();

    // Entscheidend: nicht nur unsichtbar, sondern gar nicht im DOM. Ein
    // ausgeblendetes Formular wäre über die Entwicklerwerkzeuge erreichbar.
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.getByLabel("Titel")).toHaveCount(0);
  });

  test("viewer darf lesen — die Sperre gilt nur für Schreibaktionen", async ({ page }) => {
    await page.goto("/veranstaltungen");

    await expect(page.getByRole("heading", { name: "Veranstaltungen planen" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Keine Berechtigung" })).toHaveCount(0);
  });
});

test.describe("Server-Pfad: fremde Organisation", () => {
  test.use({ storageState: storageStatePath("owner") });

  test("owner aus Organisation A bekommt für Organisation B einen 403", async ({ page }) => {
    const antwort = await page.goto(`/veranstaltungen?org=${ORGANIZATION_B}`);

    expect(antwort?.status()).toBe(403);
    await expect(page.locator("body")).toContainText("Kein Zugriff auf diese Organisation");
    // Weder die eigenen noch fremde Daten dürfen dabei durchscheinen.
    await expect(page.locator("body")).not.toContainText("Jazz im Hof");
  });

  test("Organisationswechsel per API auf eine fremde Organisation wird abgelehnt", async ({
    page,
  }) => {
    await page.goto("/veranstaltungen");

    /**
     * Bewusst aus der Seite heraus per `fetch` und nicht über
     * `page.request`: nur so läuft die Anfrage wirklich als der angemeldete
     * Browser (gleiche Herkunft, Session-Cookie inklusive). `page.request`
     * schickt den `SameSite=Lax`-Cookie bei POST nicht mit und würde 401
     * statt der hier interessanten 403 liefern — das wäre ein Test über die
     * Testumgebung, nicht über die Mandantengrenze.
     */
    const antwort = await page.evaluate(async (organizationId) => {
      const response = await fetch("/api/auth/organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ organizationId }),
      });

      return { status: response.status, body: await response.json() };
    }, ORGANIZATION_B);

    expect(antwort.status).toBe(403);
    expect(antwort.body.ok).toBe(false);
    // Ob es die fremde Organisation überhaupt gibt, darf die Antwort nicht verraten.
    expect(JSON.stringify(antwort.body)).not.toContain("Zweite Bühne");
  });

  test("Abmelden macht geschützte Seiten wieder unerreichbar", async ({ page }) => {
    await page.goto("/veranstaltungen");
    await expect(page.getByRole("heading", { name: "Veranstaltungen planen" })).toBeVisible();

    const abmeldung = await page.request.post("/api/auth/logout");
    expect(abmeldung.ok()).toBe(true);

    await page.goto("/veranstaltungen");
    await expect(page).toHaveURL(/\/login\?returnTo=/);
  });
});

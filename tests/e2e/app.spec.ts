import { expect, type Page, test } from "@playwright/test";

const pin = "69198";
const basePath = "/kleinkunst-veranstalter-dashboard";

const routes: Array<{ path: string; text: string }> = [
  { path: "/", text: "Uebersicht" },
  { path: "/veranstaltungen/", text: "Veranstaltungen planen" },
  { path: "/veranstaltungen/neu/", text: "Event erstellen" },
  { path: "/veranstaltungen/2026-07-09-jazz-im-hof/", text: "Jazz im Hof" },
  { path: "/veranstaltungen/2026-07-11-kabarett-stadtgefluester/", text: "Kabarett: Stadtgefluester" },
  { path: "/veranstaltungen/2026-07-13-poetry-slam-spezial/", text: "Poetry Slam Spezial" },
  { path: "/veranstaltungen/2026-07-17-sommerbuehne-impro/", text: "Sommerbuehne Impro" },
  { path: "/veranstaltungen/2026-07-21-chanson-nacht/", text: "Chanson Nacht" },
  { path: "/veranstaltungen/2026-07-29-nacht-der-lieder/", text: "Nacht der Lieder" },
  { path: "/spielorte/", text: "Spielorte" },
  { path: "/spielorte/venue-kupfersaal/", text: "Kupfersaal Leipzig" },
  { path: "/spielorte/venue-lindenhof/", text: "Lindenhof Buehne" },
  { path: "/spielorte/venue-kulturdeck/", text: "Kulturdeck Koeln" },
  { path: "/spielorte/venue-schwarzer-saal/", text: "Schwarzer Saal" },
  { path: "/kuenstler/", text: "Kuenstler" },
  { path: "/kuenstler/artist-mara-sol/", text: "Mara Sol" },
  { path: "/kuenstler/artist-ernst-klein/", text: "Ernst Klein" },
  { path: "/kuenstler/artist-wortwechsel/", text: "Wortwechsel Kollektiv" },
  { path: "/kuenstler/artist-trio-luna/", text: "Trio Luna" },
  { path: "/kalender/", text: "Woche ab 08. Juli 2026" },
  { path: "/newsletter/", text: "Newsletter" },
  { path: "/gema/", text: "GEMA" },
  { path: "/finanzen/", text: "Finanzen" },
  { path: "/ticketing/", text: "Ticketing" },
  { path: "/ki-assistent/", text: "KI-Assistent" },
  { path: "/einstellungen/", text: "Einstellungen" },
  { path: "/login/", text: "Anmelden" },
  { path: "/register/", text: "Organisation registrieren" },
  { path: "/forgot-password/", text: "Passwort zuruecksetzen" },
];

async function unlock(page: Page) {
  await page.goto(appPath("/"));

  if (await page.getByRole("heading", { name: "Buehnenblick Login" }).isVisible()) {
    await page.locator('input[type="password"]').fill(pin);
    await page.getByRole("button", { name: "Einloggen" }).click();
  }

  await expect(page.getByRole("heading", { name: "Uebersicht" })).toBeVisible();
}

function appPath(path: string) {
  return `${basePath}${path}`;
}

async function expectUsablePage(page: Page, text: string) {
  await expect(page.locator("body")).toContainText(text);
  await expect(page.locator("body")).not.toContainText("This page could not be found");
  await expect(page.locator("body")).not.toContainText("404");
  await expect(page.locator("body")).not.toContainText("Application error");

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
}

test.describe("Kleinkunst dashboard e2e", () => {
  test("PIN gate blocks the dashboard, rejects wrong PIN, and accepts the configured PIN", async ({ page }) => {
    await page.goto(appPath("/"));

    await expect(page.getByRole("heading", { name: "Buehnenblick Login" })).toBeVisible();
    await expect(page.locator("body")).not.toContainText("Naechste Veranstaltungen");

    await page.locator('input[type="password"]').fill("00000");
    await page.getByRole("button", { name: "Einloggen" }).click();
    await expect(page.getByText("PIN ist falsch.")).toBeVisible();

    await page.locator('input[type="password"]').fill(pin);
    await page.getByRole("button", { name: "Einloggen" }).click();
    await expect(page.getByRole("heading", { name: "Uebersicht" })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("heading", { name: "Uebersicht" })).toBeVisible();
  });

  test("all exported application routes render without 404s or page-level overflow", async ({ page }) => {
    await unlock(page);

    for (const route of routes) {
      await page.goto(appPath(route.path));
      await expectUsablePage(page, route.text);
    }
  });

  test("primary navigation opens every module and dashboard action links navigate", async ({ page }) => {
    await unlock(page);

    const navTargets = [
      ["Veranstaltungen", /\/veranstaltungen\/$/],
      ["Spielorte", /\/spielorte\/$/],
      ["Kuenstler", /\/kuenstler\/$/],
      ["Kalender", /\/kalender\/$/],
      ["Newsletter", /\/newsletter\/$/],
      ["GEMA", /\/gema\/$/],
      ["Finanzen", /\/finanzen\/$/],
      ["Ticketing", /\/ticketing\/$/],
      ["KI-Assistent", /\/ki-assistent\/$/],
      ["Einstellungen", /\/einstellungen\/$/],
    ] as const;

    for (const [label, url] of navTargets) {
      await page.getByRole("link", { name: label }).first().click();
      await expect(page).toHaveURL(url);
      await expectUsablePage(page, label);
    }

    await page.goto(appPath("/"));
    await page.getByRole("link", { name: "Alle anzeigen" }).click();
    await expect(page).toHaveURL(/\/veranstaltungen\/$/);

    await page.goto(appPath("/"));
    await page
      .locator("section")
      .filter({ hasText: "Multi-Venue-Kalender" })
      .getByRole("link", { name: "Kalender oeffnen" })
      .click();
    await expect(page).toHaveURL(/\/kalender\/$/);

    await page.goto(appPath("/"));
    await page.getByRole("link", { name: "Meldungen" }).click();
    await expect(page).toHaveURL(/\/gema\/$/);
  });

  test("global search links open event, artist, and venue details", async ({ page }) => {
    await unlock(page);

    await page.getByPlaceholder("Events, Kuenstler, Spielorte suchen").fill("jazz");

    const searchRegion = page.locator("header");
    await expect(searchRegion.locator('a[href$="/veranstaltungen/2026-07-09-jazz-im-hof/"]')).toBeVisible();
    await expect(searchRegion.locator('a[href$="/kuenstler/artist-mara-sol/"]')).toBeVisible();
    await expect(searchRegion.locator('a[href$="/spielorte/venue-kupfersaal/"]')).toBeVisible();

    await searchRegion.locator('a[href$="/veranstaltungen/2026-07-09-jazz-im-hof/"]').click();
    await expect(page).toHaveURL(/\/veranstaltungen\/2026-07-09-jazz-im-hof\/$/);
    await expect(page.getByRole("heading", { name: "Jazz im Hof" })).toBeVisible();

    await page.goto(appPath("/"));
    await page.getByPlaceholder("Events, Kuenstler, Spielorte suchen").fill("jazz");
    await searchRegion.locator('a[href$="/kuenstler/artist-mara-sol/"]').click();
    await expect(page).toHaveURL(/\/kuenstler\/artist-mara-sol\/$/);
    await expect(page.getByRole("heading", { name: "Mara Sol" })).toBeVisible();

    await page.goto(appPath("/"));
    await page.getByPlaceholder("Events, Kuenstler, Spielorte suchen").fill("jazz");
    await searchRegion.locator('a[href$="/spielorte/venue-kupfersaal/"]').click();
    await expect(page).toHaveURL(/\/spielorte\/venue-kupfersaal\/$/);
    await expect(page.getByRole("heading", { name: "Kupfersaal Leipzig" })).toBeVisible();
  });

  test("event filters narrow the table and event detail links stay valid", async ({ page }) => {
    await unlock(page);
    await page.goto(appPath("/veranstaltungen/"));

    await page.getByPlaceholder("Titel, Untertitel oder Datum").fill("poetry");
    await page.locator('select[name="status"]').selectOption("planned");
    await page.locator('select[name="venue"]').selectOption("venue-kulturdeck");
    await page.getByRole("button", { name: "Filtern" }).click();

    await expect(page).toHaveURL(/q=poetry/);
    await expect(page.locator("body")).toContainText("Gefilterte Events");
    await expect(page.locator("tbody")).toContainText("Poetry Slam Spezial");
    await expect(page.locator("tbody")).not.toContainText("Jazz im Hof");

    await page.getByRole("link", { name: /Details/ }).click();
    await expect(page).toHaveURL(/\/veranstaltungen\/2026-07-13-poetry-slam-spezial\/$/);
    await expect(page.getByRole("heading", { name: "Poetry Slam Spezial" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Zurueck zur Eventliste" })).toBeVisible();
  });

  test("new event form updates slug preview and shows save feedback", async ({ page }) => {
    await unlock(page);
    await page.goto(appPath("/veranstaltungen/neu/"));

    await page.locator('input[name="title"]').fill("Test Gala");
    await page.locator('input[name="date"]').fill("2026-09-12");
    await expect(page.locator("body")).toContainText("2026-09-12-test-gala");

    await page.getByRole("button", { name: "Entwurf speichern" }).click();
    await expect(page.getByRole("status")).toContainText('Entwurf "Test Gala" wurde lokal');

    await page.getByRole("link", { name: "Abbrechen" }).click();
    await expect(page).toHaveURL(/\/veranstaltungen\/$/);
  });

  test("calendar controls update the week and event cards open details", async ({ page }) => {
    await unlock(page);
    await page.goto(appPath("/kalender/"));

    await expect(page.locator("body")).toContainText("Woche ab 08. Juli 2026");
    await page.getByRole("button", { name: "Naechste Woche" }).click();
    await expect(page.locator("body")).toContainText("Woche ab 15. Juli 2026");
    await expect(page.locator("body")).toContainText("Events diese Woche");
    await expect(page.locator("body")).toContainText("2");

    await page.getByRole("button", { name: "Heute" }).click();
    await expect(page.locator("body")).toContainText("Woche ab 08. Juli 2026");

    await page.getByRole("link", { name: /Jazz im Hof/ }).click();
    await expect(page).toHaveURL(/\/veranstaltungen\/2026-07-09-jazz-im-hof\/$/);
    await expect(page.getByRole("heading", { name: "Jazz im Hof" })).toBeVisible();
  });

  test("topbar actions, notifications, sidebar collapse, and module demo actions respond", async ({ page }) => {
    await unlock(page);

    await page.getByRole("link", { name: "Alle Spielorte" }).click();
    await expect(page).toHaveURL(/\/spielorte\/$/);

    await page.getByRole("button", { name: "Spielort anlegen" }).click();
    await expect(page.getByRole("status")).toContainText("Spielort anlegen wurde fuer die Demo vorgemerkt");

    await page.locator('a[href$="/spielorte/venue-kupfersaal/"]').first().click();
    await expect(page).toHaveURL(/\/spielorte\/venue-kupfersaal\/$/);
    await expect(page.getByRole("heading", { name: "Kupfersaal Leipzig" })).toBeVisible();

    await page.goto(appPath("/"));
    await page.getByRole("button", { name: "Theme umschalten" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.getByRole("button", { name: "Benachrichtigungen" }).click();
    await expect(page.getByText("3 GEMA-Meldungen faellig")).toBeVisible();
    await page.getByRole("link", { name: /3 GEMA-Meldungen faellig/ }).click();
    await expect(page).toHaveURL(/\/gema\/$/);

    await page.goto(appPath("/"));
    await page.getByRole("button", { name: "Menue einklappen" }).click();
    await expect(page.locator("html")).toHaveClass(/sidebar-collapsed/);
    await page.getByRole("button", { name: "Menue", exact: true }).click();
    await expect(page.locator("html")).not.toHaveClass(/sidebar-collapsed/);
  });

  test("auth demo forms provide feedback without server navigation", async ({ page }) => {
    await unlock(page);

    await page.goto(appPath("/login/"));
    await page.getByRole("button", { name: "Einloggen" }).click();
    await expect(page.getByRole("status")).toContainText("Login wurde in der Demo vorbereitet");

    await page.getByRole("link", { name: "Passwort vergessen" }).click();
    await expect(page).toHaveURL(/\/forgot-password\/$/);
    await page.getByRole("button", { name: "Reset-Link senden" }).click();
    await expect(page.getByRole("status")).toContainText("Reset-Link wurde in der Demo simuliert");

    await page.goto(appPath("/register/"));
    await page.getByRole("button", { name: "Registrierung vorbereiten" }).click();
    await expect(page.getByRole("status")).toContainText("Registrierung wurde in der Demo vorgemerkt");
  });

  test("mobile menu opens and navigates without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 820 });
    await unlock(page);

    await page.getByRole("button", { name: "Navigation oeffnen" }).click();
    await expect(page.getByRole("button", { name: "Navigation schliessen" })).toBeVisible();
    const expandedNavigation = page.getByRole("navigation", { name: "Navigation", exact: true });
    await expect(expandedNavigation).toContainText("Ticketing");

    await expandedNavigation.getByRole("link", { name: "Ticketing" }).click();
    await expect(page).toHaveURL(/\/ticketing\/$/);
    await expectUsablePage(page, "Ticketing");
  });
});

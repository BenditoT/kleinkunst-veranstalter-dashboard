import { expect, test as setup } from "@playwright/test";

import { storageStatePath, testAccounts } from "./test-accounts";

/**
 * ANMELDE-SETUP (S2).
 *
 * Meldet jede Testperson einmal über `/api/auth/login` an und legt den
 * Session-Cookie als `storageState` ab. Die eigentlichen Tests starten
 * damit direkt als die jeweilige Person, statt sich jedes Mal selbst
 * anzumelden — das spart Zeit und, wichtiger, es hält die negativen Tests
 * frei von Anmelde-Rauschen.
 *
 * Bewusst über die API und nicht über das Formular: dieses Setup soll nicht
 * fehlschlagen, wenn sich am Login-Formular etwas ändert. Das Formular
 * selbst wird in `auth.spec.ts` getestet.
 */

for (const account of testAccounts) {
  setup(`Anmeldung vorbereiten: ${account.beschreibung}`, async ({ page, request }) => {
    const response = await request.post("/api/auth/login", {
      data: { email: account.email, password: account.password },
    });

    expect(
      response.ok(),
      `Anmeldung für ${account.email} fehlgeschlagen: ${response.status()} ${await response.text()}`,
    ).toBe(true);

    const cookies = await request.storageState();
    await page.context().addCookies(cookies.cookies);
    await page.context().storageState({ path: storageStatePath(account.key) });
  });
}

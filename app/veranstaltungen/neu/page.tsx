import { EventFormScreen } from "@/components/events/event-form-screen";
import { AppShell } from "@/components/layout/app-shell";
import { AccessDeniedNotice } from "@/components/layout/access-denied-notice";
import { MINIMUM_WRITE_ROLE, canWrite } from "@/lib/auth/rbac";
import { getDataPort, getRequestOrganizationContext } from "@/lib/data";

export default async function NewEventPage() {
  const context = await getRequestOrganizationContext();

  /**
   * SERVERSEITIGE ROLLENPRÜFUNG (O8).
   *
   * Die Prüfung steht hier, VOR dem Laden der Auswahldaten und vor dem
   * Rendern des Formulars: eine Rolle unterhalb von `editor` bekommt das
   * Formular gar nicht erst ausgeliefert. Das ist der eigentliche Schutz —
   * ein ausgeblendeter Knopf im Client wäre keiner, weil die Seite direkt
   * aufrufbar bleibt.
   *
   * `context.role` stammt aus `getRequestOrganizationContext()`, also aus
   * der serverseitig verifizierten Session — nie aus URL oder Formdaten.
   */
  if (!canWrite(context)) {
    return (
      <AppShell activeItem="events">
        <AccessDeniedNotice
          action="Eine Veranstaltung anzulegen"
          requiredRole={MINIMUM_WRITE_ROLE}
          actualRole={context.role}
        />
      </AppShell>
    );
  }

  const port = getDataPort();

  const [venues, artists] = await Promise.all([
    port.listVenues(context),
    port.listArtists(context),
  ]);

  return (
    <AppShell activeItem="events">
      <EventFormScreen venues={venues} artists={artists} />
    </AppShell>
  );
}

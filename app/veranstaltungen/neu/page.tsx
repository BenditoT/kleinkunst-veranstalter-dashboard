import { EventFormScreen } from "@/components/events/event-form-screen";
import { AppShell } from "@/components/layout/app-shell";
import { getDataPort, getRequestOrganizationContext } from "@/lib/data";

export default async function NewEventPage() {
  const context = await getRequestOrganizationContext();
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

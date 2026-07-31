import { notFound } from "next/navigation";

import { EventDetail } from "@/components/events/event-detail";
import { AppShell } from "@/components/layout/app-shell";
import { getDataPort, getRequestOrganizationContext } from "@/lib/data";

type EventDetailPageProps = {
  params: {
    slug: string;
  };
};

// Statischer Export: die Detailseiten werden zur Buildzeit für die
// Demo-Organisation vorgerendert. Der Kontext kommt aus dem Datenport
// (O3), nicht mehr aus einem Direktimport der Demodaten.
export async function generateStaticParams() {
  const context = await getRequestOrganizationContext();
  const events = await getDataPort().listEvents(context);

  return events.map((event) => ({ slug: event.slug }));
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const context = await getRequestOrganizationContext();
  const port = getDataPort();

  const [event, events, venues, artists, tasks] = await Promise.all([
    port.getEventBySlug(context, params.slug),
    port.listEvents(context),
    port.listVenues(context),
    port.listArtists(context),
    port.listTasks(context),
  ]);

  if (!event) {
    notFound();
  }

  return (
    <AppShell activeItem="events">
      <EventDetail event={event} events={events} venues={venues} artists={artists} tasks={tasks} />
    </AppShell>
  );
}

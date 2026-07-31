import { Suspense } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { EventsTableSkeleton } from "@/components/events/events-table-skeleton";
import { EventsWorkspaceClient } from "@/components/events/events-workspace-client";
import { getDataPort, getRequestOrganizationContext } from "@/lib/data";

export default async function EventsPage() {
  const context = await getRequestOrganizationContext();
  const port = getDataPort();

  const [events, venues, artists] = await Promise.all([
    port.listEvents(context),
    port.listVenues(context),
    port.listArtists(context),
  ]);

  return (
    <AppShell activeItem="events">
      <Suspense fallback={<EventsTableSkeleton />}>
        <EventsWorkspaceClient events={events} venues={venues} artists={artists} />
      </Suspense>
    </AppShell>
  );
}

import { Suspense } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { EventsTableSkeleton } from "@/components/events/events-table-skeleton";
import { EventsWorkspaceClient } from "@/components/events/events-workspace-client";

export default function EventsPage() {
  return (
    <AppShell activeItem="events">
      <Suspense fallback={<EventsTableSkeleton />}>
        <EventsWorkspaceClient />
      </Suspense>
    </AppShell>
  );
}

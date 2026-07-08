import { Suspense } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { EventsWorkspace } from "@/components/events/events-workspace";
import { EventsWorkspaceClient } from "@/components/events/events-workspace-client";

export default function EventsPage() {
  return (
    <AppShell activeItem="events">
      <Suspense fallback={<EventsWorkspace filters={{}} />}>
        <EventsWorkspaceClient />
      </Suspense>
    </AppShell>
  );
}

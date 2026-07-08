import { AppShell } from "@/components/layout/app-shell";
import { EventsWorkspace } from "@/components/events/events-workspace";
import type { EventFilters } from "@/lib/domain/events";
import type { EventStatus } from "@/lib/domain/types";

type EventsPageProps = {
  searchParams?: {
    q?: string;
    status?: string;
    venue?: string;
  };
};

export default function EventsPage({ searchParams }: EventsPageProps) {
  const filters: EventFilters = {
    query: searchParams?.q,
    status: parseStatus(searchParams?.status),
    venueId: searchParams?.venue,
  };

  return (
    <AppShell activeItem="events">
      <EventsWorkspace filters={filters} />
    </AppShell>
  );
}

function parseStatus(status: string | undefined): EventStatus | "all" | undefined {
  if (
    status === "draft" ||
    status === "planned" ||
    status === "published" ||
    status === "completed" ||
    status === "cancelled" ||
    status === "all"
  ) {
    return status;
  }

  return undefined;
}

"use client";

import { useSearchParams } from "next/navigation";

import { EventsWorkspace } from "@/components/events/events-workspace";
import type { EventFilters } from "@/lib/domain/events";
import type { Artist, Event, EventStatus, Venue } from "@/lib/domain/types";

type EventsWorkspaceClientProps = {
  events: Event[];
  venues: Venue[];
  artists: Artist[];
};

/**
 * Liest nur die Filter aus der URL. Die Daten kommen als Props von der
 * Server-Komponente, die sie über den Datenport für die Organisation aus
 * der Session geladen hat (O3) — der Client bestimmt also nie, welche
 * Organisation er sieht, sondern nur, wie gefiltert wird.
 */
export function EventsWorkspaceClient({ events, venues, artists }: EventsWorkspaceClientProps) {
  const searchParams = useSearchParams();
  const filters: EventFilters = {
    query: searchParams.get("q") ?? undefined,
    status: parseStatus(searchParams.get("status") ?? undefined),
    venueId: searchParams.get("venue") ?? undefined,
  };

  return <EventsWorkspace filters={filters} events={events} venues={venues} artists={artists} />;
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

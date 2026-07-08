import { sampleVenues } from "./sample-data";
import type { Event, EventStatus } from "./types";

export type EventFilters = {
  query?: string;
  status?: EventStatus | "all";
  venueId?: string | "all";
};

export type VenueConflict = {
  venueId: string;
  venueName: string;
  firstEventId: string;
  secondEventId: string;
  message: string;
};

export function filterEvents(events: Event[], filters: EventFilters): Event[] {
  const query = normalize(filters.query ?? "");

  return events
    .filter((event) => {
      const matchesQuery = query
        ? normalize(`${event.title} ${event.subtitle} ${event.date}`).includes(query)
        : true;
      const matchesStatus =
        filters.status && filters.status !== "all" ? event.status === filters.status : true;
      const matchesVenue =
        filters.venueId && filters.venueId !== "all" ? event.venueId === filters.venueId : true;

      return matchesQuery && matchesStatus && matchesVenue;
    })
    .sort((left, right) => `${left.date} ${left.startTime}`.localeCompare(`${right.date} ${right.startTime}`));
}

export function createEventSlug(title: string, date: string): string {
  const normalizedTitle = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${date}-${normalizedTitle}`;
}

export function detectVenueConflicts(
  events: Event[],
  { bufferMinutes }: { bufferMinutes: number },
): VenueConflict[] {
  const conflicts: VenueConflict[] = [];
  const sortedEvents = [...events].sort((left, right) =>
    `${left.date} ${left.startTime}`.localeCompare(`${right.date} ${right.startTime}`),
  );

  for (let leftIndex = 0; leftIndex < sortedEvents.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < sortedEvents.length; rightIndex += 1) {
      const first = sortedEvents[leftIndex];
      const second = sortedEvents[rightIndex];

      if (first.venueId !== second.venueId || first.date !== second.date) {
        continue;
      }

      const firstStart = toMinutes(first.startTime) - bufferMinutes;
      const firstEnd = toMinutes(first.endTime) + bufferMinutes;
      const secondStart = toMinutes(second.startTime) - bufferMinutes;
      const secondEnd = toMinutes(second.endTime) + bufferMinutes;

      if (firstStart < secondEnd && secondStart < firstEnd) {
        const venueName = getVenueName(first.venueId);
        conflicts.push({
          venueId: first.venueId,
          venueName,
          firstEventId: first.id,
          secondEventId: second.id,
          message: `${first.title} kollidiert mit ${second.title} im ${venueName}.`,
        });
      }
    }
  }

  return conflicts;
}

export function getEventStatusTransitionOptions(status: EventStatus): EventStatus[] {
  const transitions: Record<EventStatus, EventStatus[]> = {
    draft: ["planned", "cancelled"],
    planned: ["published", "cancelled"],
    published: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  };

  return transitions[status];
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getVenueName(venueId: string): string {
  return sampleVenues.find((venue) => venue.id === venueId)?.name ?? "unbekannten Spielort";
}

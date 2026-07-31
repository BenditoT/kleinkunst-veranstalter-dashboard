import type { Artist, Event, SearchIndexEntry, SearchResult, Task, Venue } from "./types";

type DashboardInput = {
  events: Event[];
  tasks: Task[];
  venues: Venue[];
  referenceDate: Date;
};

export type DashboardMetrics = {
  monthlyRevenue: number;
  revenueTarget: number;
  openTaskCount: number;
  publishedEventCount: number;
  nextEvents: Event[];
  venueOccupancy: Array<{
    venueId: string;
    venueName: string;
    color: string;
    occupancyRate: number;
    bookedSlots: number;
    monthlySlots: number;
  }>;
};

export type GemaDeadline = {
  eventId: string;
  eventTitle: string;
  dueDate: string;
  daysUntilDue: number;
  status: Event["gemaStatus"];
};

export type GroupedSearchResults = {
  events: SearchResult[];
  artists: SearchResult[];
  venues: SearchResult[];
};

export function calculateDashboardMetrics({
  events,
  tasks,
  venues,
  referenceDate,
}: DashboardInput): DashboardMetrics {
  const referenceMonth = referenceDate.getMonth();
  const referenceYear = referenceDate.getFullYear();
  const monthlyEvents = events.filter((event) => {
    const eventDate = parseLocalDate(event.date);
    return eventDate.getMonth() === referenceMonth && eventDate.getFullYear() === referenceYear;
  });

  return {
    monthlyRevenue: sum(monthlyEvents.map((event) => event.revenueActual)),
    revenueTarget: sum(monthlyEvents.map((event) => event.revenueTarget)),
    openTaskCount: tasks.filter((task) => !task.completed).length,
    publishedEventCount: monthlyEvents.filter((event) => event.status === "published").length,
    nextEvents: events
      .filter((event) => parseLocalDate(event.date) >= startOfDay(referenceDate))
      .sort((left, right) => left.date.localeCompare(right.date))
      .slice(0, 5),
    venueOccupancy: venues
      .map((venue) => ({
        venueId: venue.id,
        venueName: venue.name,
        color: venue.color,
        occupancyRate: Math.round((venue.bookedSlots / venue.monthlySlots) * 100),
        bookedSlots: venue.bookedSlots,
        monthlySlots: venue.monthlySlots,
      }))
      .sort((left, right) => right.occupancyRate - left.occupancyRate),
  };
}

export function findGemaDeadlines(events: Event[], referenceDate: Date): GemaDeadline[] {
  const today = startOfDay(referenceDate);

  return events
    .filter((event) => event.gemaDueDate && event.gemaStatus !== "confirmed")
    .map((event) => {
      const dueDate = parseLocalDate(event.gemaDueDate as string);
      return {
        eventId: event.id,
        eventTitle: event.title,
        dueDate: event.gemaDueDate as string,
        daysUntilDue: differenceInCalendarDays(dueDate, today),
        status: event.gemaStatus,
      };
    })
    .filter((deadline) => deadline.daysUntilDue >= 0 && deadline.daysUntilDue <= 7)
    .sort((left, right) => left.daysUntilDue - right.daysUntilDue);
}

/**
 * Baut den vorberechneten Suchindex (O3.4).
 *
 * Wird serverseitig über den Datenport aufgerufen; die Client-Topbar
 * bekommt nur das Ergebnis als Prop und filtert darauf. Dadurch landet
 * nicht mehr der komplette Datenbestand (Events, Künstler, Spielorte mit
 * allen Feldern) in jedem Seiten-Bundle, sondern nur Label, Beschreibung,
 * Ziel-Href und die Suchbegriffe.
 */
export function buildSearchIndex({
  events,
  artists,
  venues,
}: {
  events: Event[];
  artists: Artist[];
  venues: Venue[];
}): SearchIndexEntry[] {
  return [
    ...events.map((event) => ({
      kind: "event" as const,
      id: event.id,
      label: event.title,
      description: event.subtitle,
      href: `/veranstaltungen/${event.slug}`,
      keywords: normalize(`${event.title} ${event.subtitle}`),
    })),
    ...artists.map((artist) => ({
      kind: "artist" as const,
      id: artist.id,
      label: artist.stageName,
      description: artist.genres.join(", "),
      href: `/kuenstler/${artist.id}`,
      keywords: normalize(`${artist.stageName} ${artist.contactName} ${artist.genres.join(" ")}`),
    })),
    ...venues.map((venue) => ({
      kind: "venue" as const,
      id: venue.id,
      label: venue.name,
      description: `${venue.city} · ${venue.capacity} Plätze`,
      href: `/spielorte/${venue.id}`,
      keywords: normalize(`${venue.name} ${venue.city} ${venue.type} ${venue.searchTerms.join(" ")}`),
    })),
  ];
}

/** Filtert den Suchindex und gruppiert die Treffer nach Entitätstyp. */
export function groupSearchIndex(index: SearchIndexEntry[], query: string): GroupedSearchResults {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return { events: [], artists: [], venues: [] };
  }

  const matches = index.filter((entry) => entry.keywords.includes(normalizedQuery));
  const toResult = ({ id, label, description, href }: SearchIndexEntry): SearchResult => ({
    id,
    label,
    description,
    href,
  });

  return {
    events: matches.filter((entry) => entry.kind === "event").map(toResult),
    artists: matches.filter((entry) => entry.kind === "artist").map(toResult),
    venues: matches.filter((entry) => entry.kind === "venue").map(toResult),
  };
}

export function groupGlobalSearchResults({
  query,
  events,
  artists,
  venues,
}: {
  query: string;
  events: Event[];
  artists: Artist[];
  venues: Venue[];
}): GroupedSearchResults {
  return groupSearchIndex(buildSearchIndex({ events, artists, venues }), query);
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function parseLocalDate(value: string): Date {
  return new Date(`${value}T00:00:00`);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function differenceInCalendarDays(left: Date, right: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((startOfDay(left).getTime() - startOfDay(right).getTime()) / millisecondsPerDay);
}

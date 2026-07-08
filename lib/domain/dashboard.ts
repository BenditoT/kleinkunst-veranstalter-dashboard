import type { Artist, Event, SearchResult, Task, Venue } from "./types";

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
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return { events: [], artists: [], venues: [] };
  }

  return {
    events: events
      .filter((event) => normalize(`${event.title} ${event.subtitle}`).includes(normalizedQuery))
      .map((event) => ({
        id: event.id,
        label: event.title,
        description: event.subtitle,
        href: `/veranstaltungen/${event.slug}`,
      })),
    artists: artists
      .filter((artist) =>
        normalize(`${artist.stageName} ${artist.contactName} ${artist.genres.join(" ")}`).includes(
          normalizedQuery,
        ),
      )
      .map((artist) => ({
        id: artist.id,
        label: artist.stageName,
        description: artist.genres.join(", "),
        href: `/kuenstler/${artist.id}`,
      })),
    venues: venues
      .filter((venue) =>
        normalize(`${venue.name} ${venue.city} ${venue.type} ${venue.searchTerms.join(" ")}`).includes(
          normalizedQuery,
        ),
      )
      .map((venue) => ({
        id: venue.id,
        label: venue.name,
        description: `${venue.city} · ${venue.capacity} Plaetze`,
        href: `/spielorte/${venue.id}`,
      })),
  };
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

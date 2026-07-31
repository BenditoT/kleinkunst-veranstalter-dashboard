import { buildSearchIndex } from "../domain/dashboard";
import { filterEvents, type EventFilters } from "../domain/events";
import type { Artist, Event, SearchIndexEntry, Task, TenantScoped, Venue } from "../domain/types";
import type { OrganizationContext } from "./context";
import type { DataPort } from "./port";

export type InMemoryDataset = {
  events: Event[];
  venues: Venue[];
  artists: Artist[];
  tasks: Task[];
};

/**
 * In-Memory-Adapter hinter dem Datenport (O3).
 *
 * Ersetzt die bisherigen Direkt-Importe von `sample-data.ts` in der UI.
 * Er filtert jede Liste explizit über die `organizationId` — dieselbe
 * Bedingung, die im echten Backend als RLS-Policy steht
 * (`db/migrations/202607080001_core_schema.sql`). Damit ist die
 * Mandantentrennung schon vor dem ersten Backend testbar
 * (`tests/unit/data-port.test.ts`).
 */
export function createInMemoryDataPort(dataset: InMemoryDataset): DataPort {
  function scope<T extends TenantScoped>(rows: T[], context: OrganizationContext): T[] {
    return rows.filter((row) => row.organizationId === context.organizationId);
  }

  async function listEvents(
    context: OrganizationContext,
    filters?: EventFilters,
  ): Promise<Event[]> {
    const events = scope(dataset.events, context);
    return filters ? filterEvents(events, filters) : events;
  }

  async function listVenues(context: OrganizationContext): Promise<Venue[]> {
    return scope(dataset.venues, context);
  }

  async function listArtists(context: OrganizationContext): Promise<Artist[]> {
    return scope(dataset.artists, context);
  }

  return {
    listEvents,
    listVenues,
    listArtists,

    async getEventBySlug(context, slug) {
      return scope(dataset.events, context).find((event) => event.slug === slug) ?? null;
    },

    async getVenueById(context, id) {
      return scope(dataset.venues, context).find((venue) => venue.id === id) ?? null;
    },

    async getArtistById(context, id) {
      return scope(dataset.artists, context).find((artist) => artist.id === id) ?? null;
    },

    async listTasks(context) {
      return scope(dataset.tasks, context);
    },

    async buildSearchIndex(context): Promise<SearchIndexEntry[]> {
      const [events, artists, venues] = await Promise.all([
        listEvents(context),
        listArtists(context),
        listVenues(context),
      ]);

      return buildSearchIndex({ events, artists, venues });
    },
  };
}

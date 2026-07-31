import type { EventFilters } from "../domain/events";
import type { Artist, Event, SearchIndexEntry, Task, Venue } from "../domain/types";
import type { OrganizationContext } from "./context";

/**
 * Datenport (O3) — die einzige Schnittstelle zwischen UI/Server-Code und
 * dem jeweiligen Datenbestand.
 *
 * Eigenschaften, die jede Implementierung einhalten MUSS:
 *
 * 1. Jede Methode nimmt einen `OrganizationContext` als erstes Argument
 *    und liefert ausschließlich Daten dieser Organisation. Ein Adapter
 *    darf den Kontext nicht ignorieren, auch wenn die darunterliegende
 *    Datenquelle (RLS) ohnehin filtert — Verteidigung in der Tiefe.
 * 2. Alle Methoden sind asynchron, damit ein SQL-/HTTP-Adapter ohne
 *    Signaturbruch eingesetzt werden kann.
 * 3. „Nicht gefunden" ist `null`, kein Wurf. Ob daraus ein 404 wird,
 *    entscheidet die Route.
 * 4. Filter sind optional und dürfen von einem Adapter in die Datenbank
 *    hinuntergeschoben werden; der In-Memory-Adapter wendet dieselbe
 *    reine Domänenfunktion an, die auch die UI benutzt.
 */
export type DataPort = {
  listEvents(context: OrganizationContext, filters?: EventFilters): Promise<Event[]>;
  getEventBySlug(context: OrganizationContext, slug: string): Promise<Event | null>;

  listVenues(context: OrganizationContext): Promise<Venue[]>;
  getVenueById(context: OrganizationContext, id: string): Promise<Venue | null>;

  listArtists(context: OrganizationContext): Promise<Artist[]>;
  getArtistById(context: OrganizationContext, id: string): Promise<Artist | null>;

  listTasks(context: OrganizationContext): Promise<Task[]>;

  /**
   * Vorberechneter Suchindex für die Topbar.
   *
   * Bewusst KEIN Rückgabewert vom Typ `Event[] | Artist[] | Venue[]`:
   * die Topbar ist eine Client-Komponente und würde damit den kompletten
   * Datenbestand in jedes Seiten-Bundle ziehen (Bundle-Problem aus O3.4).
   * Der Index enthält nur Label, Beschreibung, Ziel-Href und die
   * Suchbegriffe — und nur für die Organisation aus dem Kontext.
   */
  buildSearchIndex(context: OrganizationContext): Promise<SearchIndexEntry[]>;
};

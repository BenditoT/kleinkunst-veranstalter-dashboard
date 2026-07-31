export type EventStatus = "draft" | "planned" | "published" | "completed" | "cancelled";

export type GemaStatus = "not_required" | "pending" | "submitted" | "confirmed" | "problem";

/**
 * Rollenmodell laut Sprintplan (Sprint 2) und kanonischer Migration
 * `db/migrations/202607080001_core_schema.sql` (Entscheidung O1).
 * Reihenfolge = absteigende Rechte.
 */
export type OrganizationRole = "owner" | "admin" | "manager" | "member" | "viewer";

export const organizationRoles: readonly OrganizationRole[] = [
  "owner",
  "admin",
  "manager",
  "member",
  "viewer",
] as const;

export function isOrganizationRole(value: string): value is OrganizationRole {
  return (organizationRoles as readonly string[]).includes(value);
}

/**
 * Jede mandantenbezogene Entität trägt ihre Organisation (O3).
 * Entspricht `organization_id` in der Migration.
 */
export type TenantScoped = {
  organizationId: string;
};

export type Venue = TenantScoped & {
  id: string;
  name: string;
  city: string;
  capacity: number;
  color: string;
  type: string;
  monthlySlots: number;
  bookedSlots: number;
  searchTerms: string[];
};

export type Artist = TenantScoped & {
  id: string;
  stageName: string;
  contactName: string;
  genres: string[];
  rating: number;
  isFavorite: boolean;
};

export type Event = TenantScoped & {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  startTime: string;
  endTime: string;
  venueId: string;
  artistIds: string[];
  status: EventStatus;
  ticketPrice: number;
  capacity: number;
  soldTickets: number;
  revenueActual: number;
  revenueTarget: number;
  gemaStatus: GemaStatus;
  gemaDueDate: string | null;
  slug: string;
};

export type Task = TenantScoped & {
  id: string;
  title: string;
  dueDate: string;
  eventId: string | null;
  category: "booking" | "marketing" | "tech" | "finance" | "gema" | "general";
  completed: boolean;
  assignee: string;
};

export type SearchResult = {
  id: string;
  label: string;
  description: string;
  href: string;
};

/**
 * Ein Eintrag des vorberechneten Suchindex (O3.4). Enthält bewusst nur
 * Anzeige- und Suchfelder, damit die Client-Topbar nicht den kompletten
 * Datenbestand ins Bundle zieht.
 */
export type SearchIndexEntry = SearchResult & {
  kind: "event" | "artist" | "venue";
  keywords: string;
};

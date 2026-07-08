export type EventStatus = "draft" | "planned" | "published" | "completed" | "cancelled";

export type GemaStatus = "not_required" | "pending" | "submitted" | "confirmed" | "problem";

export type Venue = {
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

export type Artist = {
  id: string;
  stageName: string;
  contactName: string;
  genres: string[];
  rating: number;
  isFavorite: boolean;
};

export type Event = {
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

export type Task = {
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

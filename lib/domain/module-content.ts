import {
  Bot,
  CalendarDays,
  Euro,
  FileText,
  Landmark,
  Mail,
  MapPinned,
  QrCode,
  Settings,
  Ticket,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import type { Event, Venue } from "./types";

export type ModuleId =
  | "dashboard"
  | "events"
  | "venues"
  | "artists"
  | "calendar"
  | "newsletter"
  | "gema"
  | "finance"
  | "ticketing"
  | "ai"
  | "settings";

export const navigationItems = [
  { id: "dashboard", label: "Uebersicht", href: "/", icon: Landmark },
  { id: "events", label: "Veranstaltungen", href: "/veranstaltungen", icon: Ticket },
  { id: "venues", label: "Spielorte", href: "/spielorte", icon: MapPinned },
  { id: "artists", label: "Kuenstler", href: "/kuenstler", icon: UsersRound },
  { id: "calendar", label: "Kalender", href: "/kalender", icon: CalendarDays },
  { id: "newsletter", label: "Newsletter", href: "/newsletter", icon: Mail },
  { id: "gema", label: "GEMA", href: "/gema", icon: FileText },
  { id: "finance", label: "Finanzen", href: "/finanzen", icon: Euro },
  { id: "ticketing", label: "Ticketing", href: "/ticketing", icon: QrCode },
  { id: "ai", label: "KI-Assistent", href: "/ki-assistent", icon: Bot },
  { id: "settings", label: "Einstellungen", href: "/einstellungen", icon: Settings },
] as const;

export const moduleSummaries: Record<
  Exclude<ModuleId, "dashboard">,
  {
    title: string;
    description: string;
    primaryAction: string;
    accent: string;
    icon: LucideIcon;
    highlights: Array<{ label: string; value: string; tone: string }>;
    workItems: Array<{ title: string; detail: string; status: string }>;
  }
> = {
  events: {
    title: "Veranstaltungen",
    description: "Planung, Status, Kuenstler-Zuordnung, Checklisten und interne Notizen in einer Arbeitsliste.",
    primaryAction: "Neue Veranstaltung",
    accent: "from-teal-500 to-cyan-500",
    icon: Ticket,
    highlights: [
      { label: "Aktive Events", value: "23", tone: "text-teal-700" },
      { label: "Entwuerfe", value: "6", tone: "text-slate-700" },
      { label: "Ausverkauft", value: "4", tone: "text-emerald-700" },
    ],
    workItems: [
      { title: "Status-Workflow pruefen", detail: "Entwurf -> Geplant -> Veroeffentlicht", status: "Bereit" },
      { title: "Event-Checklisten", detail: "Aufgaben pro Veranstaltung mit Deadline", status: "Live" },
      { title: "Slug und oeffentliche Notizen", detail: "Vorbereitet fuer Public Pages", status: "Naechster Sprint" },
    ],
  },
  venues: {
    title: "Spielorte",
    description: "Kapazitaeten, Technik, Kontakte, Farbcodes und Auslastung fuer mehrere Spielorte.",
    primaryAction: "Spielort anlegen",
    accent: "from-violet-500 to-fuchsia-500",
    icon: MapPinned,
    highlights: [
      { label: "Spielorte", value: "4", tone: "text-violet-700" },
      { label: "Ø Auslastung", value: "66%", tone: "text-teal-700" },
      { label: "Konflikte", value: "0", tone: "text-emerald-700" },
    ],
    workItems: [
      { title: "Technikprofil je Ort", detail: "PA, Licht, Piano, Bar, Barrierefreiheit", status: "Datenmodell" },
      { title: "Kalender-Farben", detail: "Eindeutige Venue-Farben in allen Ansichten", status: "Live" },
      { title: "Geocoding", detail: "Cloud Function oder Server Action vorbereiten", status: "Adapter" },
    ],
  },
  artists: {
    title: "Kuenstler",
    description: "Kuenstlerprofile, Genres, GEMA-Nummern, Tech-Rider, Bewertungen und Favoriten.",
    primaryAction: "Kuenstler anlegen",
    accent: "from-rose-500 to-orange-500",
    icon: UsersRound,
    highlights: [
      { label: "Kuenstler", value: "148", tone: "text-rose-700" },
      { label: "Favoriten", value: "32", tone: "text-amber-700" },
      { label: "Rider offen", value: "7", tone: "text-slate-700" },
    ],
    workItems: [
      { title: "CSV-Import", detail: "Validierung und Dublettenpruefung", status: "Geplant" },
      { title: "Tech-Rider", detail: "Textfeld plus Dateiablage", status: "Vorbereitet" },
      { title: "Vertragsstatus", detail: "An Events gekoppelte Gagen und Signaturen", status: "Naechster Sprint" },
    ],
  },
  calendar: {
    title: "Multi-Venue-Kalender",
    description: "Wochen-, Monats- und Agenda-Ansicht mit farbcodierten Spielorten und Konfliktpruefung.",
    primaryAction: "Termin blocken",
    accent: "from-amber-500 to-yellow-500",
    icon: CalendarDays,
    highlights: [
      { label: "Diese Woche", value: "9", tone: "text-amber-700" },
      { label: "Pufferzeiten", value: "Aktiv", tone: "text-teal-700" },
      { label: "Doppelbuchungen", value: "0", tone: "text-emerald-700" },
    ],
    workItems: [
      { title: "Drag-and-Drop", detail: "Events verschieben mit Konfliktwarnung", status: "UI naechster Schritt" },
      { title: "Heute-Button", detail: "Schneller Ruecksprung zur aktuellen Woche", status: "Live" },
      { title: "iCal Export", detail: "Oeffentliche Feeds und Team-Kalender", status: "Adapter" },
    ],
  },
  newsletter: {
    title: "Newsletter",
    description: "Double-Opt-In, Kampagnen, Segmente, Vorlagen, Versandplanung und Tracking.",
    primaryAction: "Kampagne erstellen",
    accent: "from-sky-500 to-teal-500",
    icon: Mail,
    highlights: [
      { label: "Abonnenten", value: "8.420", tone: "text-sky-700" },
      { label: "Oeffnungsrate", value: "42%", tone: "text-teal-700" },
      { label: "Bounces", value: "0,8%", tone: "text-emerald-700" },
    ],
    workItems: [
      { title: "Double-Opt-In", detail: "Consent-Version und Hash im Datenmodell", status: "Vorbereitet" },
      { title: "Editor", detail: "Block-basierte E-Mail-Vorlagen", status: "Geplant" },
      { title: "Versandqueue", detail: "Cloud Tasks, Pub/Sub oder BullMQ", status: "Adapter" },
    ],
  },
  gema: {
    title: "GEMA",
    description: "Meldepflichten, Musikfolgen, Fristen, PDF-Export und Erinnerungen pro Veranstaltung.",
    primaryAction: "Meldung vorbereiten",
    accent: "from-orange-500 to-rose-500",
    icon: FileText,
    highlights: [
      { label: "Faellig 7 Tage", value: "3", tone: "text-orange-700" },
      { label: "Eingereicht", value: "12", tone: "text-sky-700" },
      { label: "Probleme", value: "1", tone: "text-rose-700" },
    ],
    workItems: [
      { title: "Musikfolge", detail: "Werke, Komponist, Dauer, Verlag", status: "Datenmodell" },
      { title: "PDF Export", detail: "GEMA-Formular aus Eventdaten", status: "Geplant" },
      { title: "Frist-Reminder", detail: "7-Tage-Deadline nach Event", status: "Live" },
    ],
  },
  finance: {
    title: "Finanzen",
    description: "Budgets, Einnahmen, Ausgaben, Kassenbuch, Kuenstlerabrechnung und Foerdermittel-Reporting.",
    primaryAction: "Transaktion erfassen",
    accent: "from-emerald-500 to-teal-500",
    icon: Euro,
    highlights: [
      { label: "Monatsumsatz", value: "46.250 EUR", tone: "text-emerald-700" },
      { label: "Deckungsgrad", value: "66%", tone: "text-teal-700" },
      { label: "Offene Belege", value: "11", tone: "text-amber-700" },
    ],
    workItems: [
      { title: "Budget je Event", detail: "Plan/Ist und Break-even", status: "Live" },
      { title: "Kassenbuch", detail: "Steuerrelevante Bargeldbewegungen", status: "Geplant" },
      { title: "Abrechnung", detail: "Gagen aus Event-Kuenstler-Zuordnung", status: "Naechster Sprint" },
    ],
  },
  ticketing: {
    title: "Ticketing",
    description: "Tickettypen, Reservierungen, Gaesteliste, QR-Code-Check-in und CSV-Import von Anbietern.",
    primaryAction: "Gaesteliste oeffnen",
    accent: "from-cyan-500 to-blue-500",
    icon: QrCode,
    highlights: [
      { label: "Tickets verkauft", value: "912", tone: "text-cyan-700" },
      { label: "Check-in Rate", value: "71%", tone: "text-teal-700" },
      { label: "Reservierungen", value: "48", tone: "text-amber-700" },
    ],
    workItems: [
      { title: "QR-Check-in", detail: "Mobile Route mit Offline-Hinweis", status: "Geplant" },
      { title: "CSV-Import", detail: "Reservix/Eventbrite Fallback", status: "Adapter" },
      { title: "Pay-what-you-want", detail: "Tickettyp bereits im Schema vorgesehen", status: "Datenmodell" },
    ],
  },
  ai: {
    title: "KI-Assistent",
    description: "Eventtexte, Social Posts, Uebersetzungen, Bildideen und Kostenkontrolle mit Provider-Wahl.",
    primaryAction: "Text generieren",
    accent: "from-violet-500 to-indigo-500",
    icon: Bot,
    highlights: [
      { label: "Prompts", value: "18", tone: "text-violet-700" },
      { label: "Monatskosten", value: "24 EUR", tone: "text-slate-700" },
      { label: "Lokaler Modus", value: "Bereit", tone: "text-teal-700" },
    ],
    workItems: [
      { title: "OpenAI/Ollama Adapter", detail: "Provider-neutral wie Backend", status: "Vorbereitet" },
      { title: "EU AI Act", detail: "Registry und Einwilligung abbilden", status: "Geplant" },
      { title: "Prompt Templates", detail: "Newsletter, Presse, Social, Programmheft", status: "Naechster Sprint" },
    ],
  },
  settings: {
    title: "Einstellungen",
    description: "Organisation, Team, Rollen, Datenschutz, Integrationen, Provider und Abrechnung.",
    primaryAction: "Provider pruefen",
    accent: "from-slate-500 to-slate-700",
    icon: Settings,
    highlights: [
      { label: "Backend", value: "Google Cloud", tone: "text-slate-700" },
      { label: "Supabase", value: "24.07.", tone: "text-amber-700" },
      { label: "Rollen", value: "5", tone: "text-teal-700" },
    ],
    workItems: [
      { title: "Provider-Adapter", detail: "Cloud SQL, Supabase, Self-hosted", status: "Live" },
      { title: "RLS Kontext", detail: "organization_id als harte Mandantengrenze", status: "Vorbereitet" },
      { title: "Audit Trail", detail: "Aenderungen zentral protokollieren", status: "Datenmodell" },
    ],
  },
};

export function getVenueName(event: Event, venues: Venue[]): string {
  return venues.find((venue) => venue.id === event.venueId)?.name ?? "Unbekannter Spielort";
}

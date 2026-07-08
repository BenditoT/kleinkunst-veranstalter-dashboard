import Link from "next/link";
import { AlertTriangle, ArrowUpRight, CalendarPlus, Filter, Plus, Search } from "lucide-react";

import { detectVenueConflicts, filterEvents, type EventFilters } from "@/lib/domain/events";
import { formatCurrency, formatDate, getStatusClass, getStatusLabel } from "@/lib/domain/format";
import { getVenueName } from "@/lib/domain/module-content";
import { sampleArtists, sampleEvents, sampleVenues } from "@/lib/domain/sample-data";
import type { EventStatus } from "@/lib/domain/types";

type EventsWorkspaceProps = {
  filters: EventFilters;
};

const eventStatuses: Array<{ value: EventStatus | "all"; label: string }> = [
  { value: "all", label: "Alle Status" },
  { value: "draft", label: "Entwurf" },
  { value: "planned", label: "Geplant" },
  { value: "published", label: "Veroeffentlicht" },
  { value: "completed", label: "Abgeschlossen" },
  { value: "cancelled", label: "Abgesagt" },
];

export function EventsWorkspace({ filters }: EventsWorkspaceProps) {
  const filteredEvents = filterEvents(sampleEvents, filters);
  const conflicts = detectVenueConflicts(sampleEvents, { bufferMinutes: 45 });
  const publishedCount = filteredEvents.filter((event) => event.status === "published").length;

  return (
    <div className="mx-auto grid max-w-[1500px] gap-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Event-Management</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">Veranstaltungen planen</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Filterbare Arbeitsliste fuer Status, Spielorte, Tickets, GEMA und Konfliktpruefung.
            </p>
          </div>
          <Link
            href="/veranstaltungen/neu"
            className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Neue Veranstaltung
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <EventStat label="Gefilterte Events" value={String(filteredEvents.length)} detail="im aktuellen Blick" />
          <EventStat label="Veroeffentlicht" value={String(publishedCount)} detail="ticket- und pressebereit" />
          <EventStat label="Konflikte" value={String(conflicts.length)} detail="mit 45 Min. Puffer" tone="warning" />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4">
            <EventFilters filters={filters} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-normal text-slate-500">
                  <th className="px-5 py-3 font-semibold">Event</th>
                  <th className="px-5 py-3 font-semibold">Datum</th>
                  <th className="px-5 py-3 font-semibold">Spielort</th>
                  <th className="px-5 py-3 font-semibold">Kuenstler</th>
                  <th className="px-5 py-3 font-semibold">Umsatz</th>
                  <th className="px-5 py-3 font-semibold">Tickets</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-950">{event.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{event.subtitle}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(event.date)}
                      <span className="block text-xs text-slate-500">
                        {event.startTime}-{event.endTime}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{getVenueName(event, sampleVenues)}</td>
                    <td className="px-5 py-4 text-slate-600">{getArtistNames(event.artistIds)}</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">{formatCurrency(event.revenueActual)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-teal-500"
                            style={{ width: `${Math.round((event.soldTickets / event.capacity) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">
                          {event.soldTickets}/{event.capacity}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStatusClass(event.status)}`}>
                        {getStatusLabel(event.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/veranstaltungen/${event.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700"
                      >
                        Details
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="grid gap-5">
          <ConflictPanel />
          <ChecklistPanel />
        </aside>
      </section>
    </div>
  );
}

function EventStat({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "default" | "warning";
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${tone === "warning" ? "text-amber-700" : "text-slate-950"}`}>
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

function EventFilters({ filters }: { filters: EventFilters }) {
  return (
    <form className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_200px_220px_auto]">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          name="q"
          defaultValue={filters.query}
          placeholder="Titel, Untertitel oder Datum"
          className="h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-2"
        />
      </label>
      <select
        name="status"
        defaultValue={filters.status ?? "all"}
        className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-2"
      >
        {eventStatuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
      <select
        name="venue"
        defaultValue={filters.venueId ?? "all"}
        className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-2"
      >
        <option value="all">Alle Spielorte</option>
        {sampleVenues.map((venue) => (
          <option key={venue.id} value={venue.id}>
            {venue.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700"
      >
        <Filter className="h-4 w-4" aria-hidden="true" />
        Filtern
      </button>
    </form>
  );
}

function ConflictPanel() {
  const conflicts = detectVenueConflicts(sampleEvents, { bufferMinutes: 45 });

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-base font-semibold text-slate-950">Konfliktpruefung</h3>
      </div>
      <div className="space-y-3 p-4">
        {conflicts.length === 0 ? (
          <div className="rounded-md bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
            Keine Doppelbuchungen mit 45 Minuten Puffer.
          </div>
        ) : (
          conflicts.map((conflict) => (
            <div key={`${conflict.firstEventId}-${conflict.secondEventId}`} className="flex gap-3 rounded-md bg-amber-50 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
              <p className="text-sm leading-5 text-amber-900">{conflict.message}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function ChecklistPanel() {
  const checklist = [
    "Kuenstlervertrag pruefen",
    "GEMA-Musikfolge anfordern",
    "Newsletter-Segment auswaehlen",
    "Abendkasse vorbereiten",
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-base font-semibold text-slate-950">Standard-Checkliste</h3>
      </div>
      <div className="space-y-2 p-4">
        {checklist.map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-md border border-slate-100 p-3">
            <CalendarPlus className="h-4 w-4 text-teal-600" aria-hidden="true" />
            <p className="text-sm font-medium text-slate-800">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function getArtistNames(artistIds: string[]): string {
  return artistIds
    .map((id) => sampleArtists.find((artist) => artist.id === id)?.stageName)
    .filter(Boolean)
    .join(", ");
}

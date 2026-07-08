import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  Database,
  Euro,
  FileText,
  Music2,
  Ticket,
  TrendingUp,
} from "lucide-react";

import { calculateDashboardMetrics, findGemaDeadlines } from "@/lib/domain/dashboard";
import { formatCurrency, formatDate, formatPercent, formatShortDate, getStatusClass, getStatusLabel } from "@/lib/domain/format";
import { getVenueName } from "@/lib/domain/module-content";
import { sampleArtists, sampleEvents, sampleTasks, sampleVenues } from "@/lib/domain/sample-data";
import type { Event } from "@/lib/domain/types";

const referenceDate = new Date("2026-07-08T12:00:00+02:00");

export function DashboardHome() {
  const metrics = calculateDashboardMetrics({
    events: sampleEvents,
    tasks: sampleTasks,
    venues: sampleVenues,
    referenceDate,
  });
  const deadlines = findGemaDeadlines(sampleEvents, referenceDate);
  const revenueProgress = Math.round((metrics.monthlyRevenue / metrics.revenueTarget) * 100);
  const openTasks = sampleTasks.filter((task) => !task.completed).slice(0, 5);

  return (
    <div className="mx-auto grid max-w-[1500px] gap-5">
      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 rounded-lg border border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Willkommen zurueck, Kultur schafft Verbindung.</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-normal text-slate-950">
                Heute <span className="text-teal-700">08. Juli 2026</span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Multi-Venue-Kommando fuer Programm, GEMA, Finanzen, Kommunikation und Aufgaben.
              </p>
            </div>
            <div className="rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900 shadow-sm">
              <span className="font-semibold">Google Cloud SQL bereit</span>
              <span className="mt-1 block text-teal-700">Cloud Run + Postgres vorbereitet</span>
            </div>
          </div>
        </div>

        <div className="min-w-0 rounded-lg border border-slate-200 bg-white/95 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Backend & Infrastruktur</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-950">Produktionsreife</h3>
            </div>
            <Database className="h-7 w-7 text-teal-600" aria-hidden="true" />
          </div>
          <div className="mt-5 divide-y divide-slate-100 border-y border-slate-100">
            {[
              ["Google Cloud SQL", "Bereit", "text-teal-700"],
              ["RLS Mandantenkontext", "Vorbereitet", "text-slate-700"],
              ["Supabase pruefen", "24.07.2026", "text-amber-700"],
            ].map(([label, status]) => (
              <div key={label} className="flex items-center justify-between gap-3 py-3">
                <span className="text-sm text-slate-600">{label}</span>
                <span className={`text-sm font-semibold ${status === "Bereit" ? "text-teal-700" : "text-slate-800"}`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Euro}
          label="Monatsumsatz"
          value={formatCurrency(metrics.monthlyRevenue)}
          detail={`${formatPercent(revenueProgress)} vom Ziel`}
          tone="emerald"
        />
        <MetricCard
          icon={Ticket}
          label="Tickets verkauft"
          value="1.247"
          detail="+8,4% vs. Juni 2026"
          tone="teal"
        />
        <MetricCard
          icon={TrendingUp}
          label="Auslastung"
          value="72%"
          detail="+4,1 Punkte vs. Juni"
          tone="amber"
        />
        <MetricCard
          icon={FileText}
          label="Offene GEMA-Meldungen"
          value={String(deadlines.length)}
          detail="innerhalb von 7 Tagen"
          tone="rose"
        />
      </section>

      <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(760px,1fr)_320px]">
        <UpcomingEvents events={metrics.nextEvents} />
        <OpenTasks tasks={openTasks} />
      </section>

      <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <CalendarPreview events={sampleEvents} />
        <div className="grid gap-5">
          <GemaPanel deadlines={deadlines} />
          <VenueOccupancy venues={metrics.venueOccupancy} />
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
  detail: string;
  tone: "teal" | "emerald" | "amber" | "rose";
}) {
  const toneClass = {
    teal: "bg-teal-50 text-teal-700 ring-teal-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
  }[tone];

  return (
    <div className="rounded-lg border border-slate-200 bg-white/95 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-md ring-1 ${toneClass}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-sm text-slate-500">{detail}</p>
        <Sparkline tone={tone} />
      </div>
    </div>
  );
}

function Sparkline({ tone }: { tone: "teal" | "emerald" | "amber" | "rose" }) {
  const stroke = {
    teal: "#0f766e",
    emerald: "#047857",
    amber: "#b45309",
    rose: "#e11d48",
  }[tone];

  return (
    <svg viewBox="0 0 96 28" className="h-7 w-24 shrink-0" aria-hidden="true">
      <path d="M2 24 C16 19 18 21 30 15 S48 19 58 11 S74 12 94 4" fill="none" stroke={stroke} strokeWidth="2" />
      <path d="M2 27 C18 22 24 23 34 17 S48 21 58 13 S75 14 94 6 L94 28 L2 28 Z" fill={stroke} opacity="0.08" />
    </svg>
  );
}

function UpcomingEvents({ events }: { events: Event[] }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white/95 shadow-sm">
      <SectionHeader title="Naechste Veranstaltungen" action="Alle anzeigen" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-normal text-slate-500">
              <th className="px-5 py-3 font-semibold">Event</th>
              <th className="px-5 py-3 font-semibold">Datum</th>
              <th className="px-5 py-3 font-semibold">Spielort</th>
              <th className="px-5 py-3 font-semibold">Tickets</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b border-slate-100 last:border-0">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <EventPoster title={event.title} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-950">{event.title}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">{getArtistNames(event.artistIds)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {formatShortDate(event.date)} · {event.startTime}
                </td>
                <td className="px-5 py-4 text-slate-600">{getVenueName(event, sampleVenues)}</td>
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
                    {getCompactStatusLabel(event.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function OpenTasks({ tasks }: { tasks: Array<{ id: string; title: string; dueDate: string; category: string; assignee: string }> }) {
  return (
    <section className="min-w-0 rounded-lg border border-slate-200 bg-white/95 shadow-sm">
      <SectionHeader title="Offene Aufgaben" action="Checkliste" />
      <div className="space-y-2 p-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-3 rounded-md border border-slate-100 p-3">
            <div className="mt-1 h-4 w-4 rounded border border-slate-300" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-5 text-slate-950">{task.title}</p>
              <p className="mt-1 text-xs text-slate-500">
                {formatDate(task.dueDate)} · {task.assignee} · {task.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CalendarPreview({ events }: { events: Event[] }) {
  const days = ["08", "09", "10", "11", "12", "13", "14"];

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white/95 shadow-sm">
      <SectionHeader title="Multi-Venue-Kalender" action="Kalender oeffnen" />
      <div className="grid min-w-0 grid-cols-7 border-t border-slate-200">
        {days.map((day) => (
          <div key={day} className="border-r border-slate-100 p-3 last:border-r-0">
            <p className="text-xs font-semibold text-slate-500">Juli</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">{day}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3 p-4">
        {events.slice(0, 4).map((event) => {
          const venue = sampleVenues.find((item) => item.id === event.venueId);

          return (
            <div key={event.id} className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
              <div className="rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">{event.startTime}</div>
              <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: venue?.color }} />
                  <p className="truncate text-sm font-semibold text-slate-950">{event.title}</p>
                </div>
                <p className="mt-1 text-xs text-slate-500">{venue?.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function GemaPanel({ deadlines }: { deadlines: Array<{ eventId: string; eventTitle: string; daysUntilDue: number; status: string }> }) {
  return (
    <section className="min-w-0 rounded-lg border border-slate-200 bg-white/95 shadow-sm">
      <SectionHeader title="GEMA faellig" action="Meldungen" />
      <div className="space-y-2 p-4">
        {deadlines.map((deadline) => (
          <div key={deadline.eventId} className="flex items-center gap-3 rounded-md bg-amber-50 p-3 text-amber-950">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{deadline.eventTitle}</p>
              <p className="text-xs text-amber-700">In {deadline.daysUntilDue} Tagen faellig</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function VenueOccupancy({
  venues,
}: {
  venues: Array<{ venueId: string; venueName: string; color: string; occupancyRate: number; bookedSlots: number; monthlySlots: number }>;
}) {
  return (
    <section className="min-w-0 rounded-lg border border-slate-200 bg-white/95 shadow-sm">
      <SectionHeader title="Auslastung" action="Spielorte" />
      <div className="space-y-4 p-4">
        {venues.map((venue) => (
          <div key={venue.venueId}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: venue.color }} />
                <p className="truncate text-sm font-medium text-slate-900">{venue.venueName}</p>
              </div>
              <p className="text-sm font-semibold text-slate-700">{venue.occupancyRate}%</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full" style={{ width: `${venue.occupancyRate}%`, backgroundColor: venue.color }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ title, action }: { title: string; action: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      <button type="button" className="flex items-center gap-1 text-sm font-semibold text-teal-700">
        {action}
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function EventPoster({ title }: { title: string }) {
  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-slate-200 bg-slate-950 text-xs font-black text-white">
      <Music2 className="h-4 w-4 text-teal-300" aria-hidden="true" />
      <span className="sr-only">{title}</span>
    </div>
  );
}

function getArtistNames(artistIds: string[]): string {
  return artistIds
    .map((id) => sampleArtists.find((artist) => artist.id === id)?.stageName)
    .filter(Boolean)
    .join(", ");
}

function getCompactStatusLabel(status: Event["status"]): string {
  const labels: Record<Event["status"], string> = {
    draft: "Entwurf",
    planned: "Geplant",
    published: "Live",
    completed: "Fertig",
    cancelled: "Abgesagt",
  };

  return labels[status] ?? getStatusLabel(status);
}

import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileText, ListChecks, Music, Ticket } from "lucide-react";

import { findGemaDeadlines } from "@/lib/domain/dashboard";
import { getEventStatusTransitionOptions } from "@/lib/domain/events";
import { formatCurrency, formatDate, getStatusClass, getStatusLabel } from "@/lib/domain/format";
import { getVenueName } from "@/lib/domain/module-content";
import { sampleArtists, sampleEvents, sampleTasks, sampleVenues } from "@/lib/domain/sample-data";
import type { Event } from "@/lib/domain/types";

type EventDetailProps = {
  event: Event;
};

export function EventDetail({ event }: EventDetailProps) {
  const artistNames = event.artistIds
    .map((id) => sampleArtists.find((artist) => artist.id === id)?.stageName)
    .filter(Boolean)
    .join(", ");
  const eventTasks = sampleTasks.filter((task) => task.eventId === event.id);
  const deadlines = findGemaDeadlines(sampleEvents, new Date("2026-07-08T12:00:00+02:00"));
  const eventDeadline = deadlines.find((deadline) => deadline.eventId === event.id);
  const transitionOptions = getEventStatusTransitionOptions(event.status);

  return (
    <div className="mx-auto grid max-w-[1400px] gap-5">
      <Link href="/veranstaltungen" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Zurueck zur Eventliste
      </Link>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStatusClass(event.status)}`}>
              {getStatusLabel(event.status)}
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">{event.title}</h2>
            <p className="mt-2 text-base text-slate-600">{event.subtitle}</p>
            <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
              <InfoTile label="Datum" value={`${formatDate(event.date)}, ${event.startTime}-${event.endTime}`} />
              <InfoTile label="Spielort" value={getVenueName(event, sampleVenues)} />
              <InfoTile label="Kuenstler" value={artistNames} />
            </div>
          </div>

          <div className="rounded-lg bg-slate-950 p-4 text-white">
            <p className="text-sm text-slate-400">Naechste Statusoptionen</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {transitionOptions.length > 0 ? (
                transitionOptions.map((status) => (
                  <span key={status} className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold">
                    {getStatusLabel(status)}
                  </span>
                ))
              ) : (
                <span className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold">Keine</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-4">
        <DetailCard icon={Ticket} label="Tickets" value={`${event.soldTickets}/${event.capacity}`} detail="verkauft / Kapazitaet" />
        <DetailCard icon={FileText} label="Umsatz" value={formatCurrency(event.revenueActual)} detail={`Ziel ${formatCurrency(event.revenueTarget)}`} />
        <DetailCard icon={Music} label="GEMA" value={getStatusLabel(event.gemaStatus)} detail={eventDeadline ? `Faellig in ${eventDeadline.daysUntilDue} Tagen` : "keine offene Frist"} />
        <DetailCard icon={ListChecks} label="Aufgaben" value={String(eventTasks.filter((task) => !task.completed).length)} detail={`${eventTasks.length} insgesamt`} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-950">Event-Checkliste</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {eventTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 px-5 py-4">
                <CheckCircle2 className={`mt-0.5 h-5 w-5 ${task.completed ? "text-emerald-600" : "text-slate-300"}`} />
                <div>
                  <p className="font-medium text-slate-950">{task.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDate(task.dueDate)} · {task.assignee} · {task.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-950">Interne Notizen</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Backstage-Ankunft 17:00 Uhr, Soundcheck 18:00 Uhr. Catering vegetarisch einplanen.
            Pressefoto und Kurzvita liegen im Medienordner.
          </p>
        </aside>
      </section>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">{label}</p>
      <p className="mt-2 font-medium text-slate-950">{value}</p>
    </div>
  );
}

function DetailCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Ticket;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <Icon className="h-5 w-5 text-teal-600" aria-hidden="true" />
      <p className="mt-3 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

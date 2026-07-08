"use client";

import Link from "next/link";
import { AlertTriangle, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { detectVenueConflicts } from "@/lib/domain/events";
import { formatDate, getStatusClass, getStatusLabel } from "@/lib/domain/format";
import { sampleEvents, sampleVenues } from "@/lib/domain/sample-data";

const baseWeekStart = new Date(2026, 6, 8);
const weekdayLabels = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export function CalendarWorkspace() {
  const [weekOffset, setWeekOffset] = useState(0);
  const conflicts = detectVenueConflicts(sampleEvents, { bufferMinutes: 45 });
  const weekDays = useMemo(() => {
    const start = addDays(baseWeekStart, weekOffset * 7);

    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(start, index);

      return {
        label: weekdayLabels[date.getDay()],
        date: formatIsoDate(date),
      };
    });
  }, [weekOffset]);
  const weekEventCount = weekDays.reduce(
    (count, day) => count + sampleEvents.filter((event) => event.date === day.date).length,
    0,
  );

  return (
    <div className="mx-auto grid max-w-[1500px] gap-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Multi-Venue-Kalender</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">Woche ab {formatDate(weekDays[0].date)}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Farbcodierte Spielorte, schnelle Konfliktpruefung und Pufferzeit fuer Aufbau, Soundcheck und Abbau.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setWeekOffset((value) => value - 1)}
              className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-700 transition hover:bg-slate-50"
              aria-label="Vorherige Woche"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setWeekOffset(0)}
              className="h-10 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Heute
            </button>
            <button
              type="button"
              onClick={() => setWeekOffset((value) => value + 1)}
              className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-700 transition hover:bg-slate-50"
              aria-label="Naechste Woche"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {sampleVenues.map((venue) => (
            <span
              key={venue.id}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: venue.color }} />
              {venue.name}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="grid min-w-[840px] grid-cols-7 border-b border-slate-200 bg-slate-50">
            {weekDays.map((day) => (
              <div key={day.date} className="border-r border-slate-200 p-4 last:border-r-0">
                <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">{day.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{formatDate(day.date)}</p>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <div className="grid min-w-[840px] grid-cols-7">
              {weekDays.map((day) => {
                const dayEvents = sampleEvents.filter((event) => event.date === day.date);

                return (
                  <div key={day.date} className="min-h-[360px] border-r border-slate-100 p-3 last:border-r-0">
                    {dayEvents.length === 0 ? (
                      <div className="rounded-md border border-dashed border-slate-200 p-3 text-sm text-slate-400">
                        Kein Termin
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {dayEvents.map((event) => {
                          const venue = sampleVenues.find((item) => item.id === event.venueId);

                          return (
                            <Link
                              key={event.id}
                              href={`/veranstaltungen/${event.slug}`}
                              className="block rounded-md border border-slate-200 bg-white p-3 shadow-sm transition hover:border-teal-300"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="h-2.5 w-2.5 rounded-full"
                                  style={{ backgroundColor: venue?.color }}
                                />
                                <p className="truncate text-sm font-semibold text-slate-950">{event.title}</p>
                              </div>
                              <p className="mt-2 text-xs text-slate-500">
                                {event.startTime}-{event.endTime}
                              </p>
                              <p className="mt-1 truncate text-xs text-slate-500">{venue?.name}</p>
                              <span
                                className={`mt-3 inline-flex rounded-full px-2 py-1 text-xs font-semibold ring-1 ${getStatusClass(event.status)}`}
                              >
                                {getStatusLabel(event.status)}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="grid gap-5">
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
              <CalendarDays className="h-5 w-5 text-teal-600" aria-hidden="true" />
              <h3 className="text-base font-semibold text-slate-950">Kalenderstatus</h3>
            </div>
            <div className="grid gap-3 p-4">
              <StatusRow label="Pufferzeit" value="45 Minuten" />
              <StatusRow label="Ansicht" value="Woche" />
              <StatusRow label="Aktive Spielorte" value={String(sampleVenues.length)} />
              <StatusRow label="Events diese Woche" value={String(weekEventCount)} />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
              <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />
              <h3 className="text-base font-semibold text-slate-950">Konflikte</h3>
            </div>
            <div className="p-4">
              {conflicts.length === 0 ? (
                <p className="rounded-md bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
                  Keine Doppelbuchungen erkannt.
                </p>
              ) : (
                <div className="space-y-2">
                  {conflicts.map((conflict) => (
                    <p
                      key={`${conflict.firstEventId}-${conflict.secondEventId}`}
                      className="rounded-md bg-amber-50 p-3 text-sm leading-5 text-amber-900"
                    >
                      {conflict.message}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

import { ArrowRight, CheckCircle2 } from "lucide-react";

import { moduleSummaries, type ModuleId } from "@/lib/domain/module-content";
import { sampleEvents, sampleVenues } from "@/lib/domain/sample-data";

type ModuleOverviewProps = {
  moduleId: Exclude<ModuleId, "dashboard">;
};

export function ModuleOverview({ moduleId }: ModuleOverviewProps) {
  const summary = moduleSummaries[moduleId];
  const Icon = summary.icon;

  return (
    <div className="mx-auto grid max-w-[1500px] gap-5">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className={`h-2 bg-gradient-to-r ${summary.accent}`} />
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-slate-950 text-white">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Modul</p>
                <h2 className="text-2xl font-semibold text-slate-950">{summary.title}</h2>
              </div>
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">{summary.description}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {summary.highlights.map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className={`mt-2 text-2xl font-semibold ${item.tone}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">Primaere Aktion</p>
            <button
              type="button"
              className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white"
            >
              {summary.primaryAction}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Diese Ansicht ist provider-neutral. Daten kommen spaeter ueber den Backend-Adapter aus Cloud SQL,
              Supabase oder Self-hosted Postgres.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-950">Arbeitsliste</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {summary.workItems.map((item) => (
              <div key={item.title} className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_160px]">
                <div>
                  <p className="font-medium text-slate-950">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-teal-700">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <ContextPanel moduleId={moduleId} />
      </section>
    </div>
  );
}

function ContextPanel({ moduleId }: ModuleOverviewProps) {
  if (moduleId === "venues") {
    return (
      <aside className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-950">Spielorte</h3>
        </div>
        <div className="space-y-3 p-4">
          {sampleVenues.map((venue) => (
            <div key={venue.id} className="rounded-md border border-slate-100 p-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: venue.color }} />
                <p className="font-medium text-slate-950">{venue.name}</p>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {venue.city} · {venue.capacity} Plaetze · {venue.type}
              </p>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-base font-semibold text-slate-950">Aktuelle Events</h3>
      </div>
      <div className="space-y-3 p-4">
        {sampleEvents.slice(0, 4).map((event) => (
          <div key={event.id} className="rounded-md border border-slate-100 p-3">
            <p className="font-medium text-slate-950">{event.title}</p>
            <p className="mt-1 text-sm text-slate-500">
              {event.date} · {event.startTime}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}

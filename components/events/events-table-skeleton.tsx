/**
 * Schlanker Ladezustand für die Veranstaltungen-Tabelle.
 * Ersetzt den bisherigen Suspense-Fallback, der die komplette
 * ungefilterte Tabelle gerendert hat (Doppelarbeit + Flash) (S3).
 */
export function EventsTableSkeleton() {
  return (
    <div className="mx-auto grid max-w-[1500px] gap-5">
      <span role="status" className="sr-only">
        Veranstaltungen werden geladen…
      </span>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" aria-hidden="true">
        <div className="h-6 w-56 animate-pulse rounded bg-slate-100" />
        <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-slate-100" />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((key) => (
            <div key={key} className="h-20 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]" aria-hidden="true">
        <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="h-10 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        </div>
        <div className="h-64 animate-pulse rounded-lg border border-slate-200 bg-slate-100" />
      </section>
    </div>
  );
}

import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10 text-slate-950 sm:px-6">
      <section className="mx-auto grid w-full max-w-md content-start justify-items-center rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="grid h-12 w-12 place-items-center rounded-md bg-slate-950 text-teal-300">
          <Compass className="h-5 w-5" aria-hidden="true" />
        </div>
        <h1 className="mt-7 text-2xl font-semibold text-slate-950">Seite nicht gefunden</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Die aufgerufene Seite existiert nicht oder wurde verschoben.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Zurück zur Übersicht
        </Link>
      </section>
    </main>
  );
}

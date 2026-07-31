"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // eslint-disable-next-line no-console -- bewusstes Logging für lokale Diagnose
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10 text-slate-950 sm:px-6">
      <section className="mx-auto grid w-full max-w-md content-start justify-items-center rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="grid h-12 w-12 place-items-center rounded-md bg-rose-600 text-white">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </div>
        <h1 className="mt-7 text-2xl font-semibold text-slate-950">Etwas ist schiefgelaufen</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Die Seite konnte nicht geladen werden. Bitte versuchen Sie es erneut.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Erneut versuchen
        </button>
      </section>
    </main>
  );
}

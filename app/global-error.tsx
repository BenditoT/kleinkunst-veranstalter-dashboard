"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Fängt Fehler im Root-Layout selbst ab. Ersetzt <html>/<body> komplett,
 * da bei diesem Fehlerfall kein Layout mehr zur Verfügung steht.
 */
export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="de">
      <body className="antialiased">
        <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10 text-slate-950 sm:px-6">
          <section className="mx-auto grid w-full max-w-md content-start justify-items-center rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-950">Unerwarteter Fehler</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Die Anwendung konnte nicht geladen werden. Bitte laden Sie die Seite neu.
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
      </body>
    </html>
  );
}

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

type AccessDeniedNoticeProps = {
  /** Was der Nutzer versucht hat, in einem kurzen Satz. */
  action: string;
  /** Rolle, die dafür nötig wäre. */
  requiredRole: string;
  /** Rolle, die der Nutzer in dieser Organisation hat. */
  actualRole: string;
};

/**
 * 403-Hinweis für Server-Komponenten (O8).
 *
 * Wird gerendert, NACHDEM der Server die Aktion bereits abgelehnt hat —
 * das Formular wird gar nicht erst ausgeliefert. Der Hinweis ist die
 * höfliche Erklärung, nicht der Schutz: der Schutz ist, dass diese
 * Komponente anstelle der Seite kommt.
 *
 * Bewusst ohne Details über fremde Organisationen und ohne „versuchen Sie
 * es erneut"-Knopf — an einer fehlenden Rolle ändert ein Neuladen nichts.
 */
export function AccessDeniedNotice({ action, requiredRole, actualRole }: AccessDeniedNoticeProps) {
  return (
    <section className="mx-auto grid w-full max-w-md content-start justify-items-center rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="grid h-12 w-12 place-items-center rounded-md bg-amber-600 text-white">
        <ShieldAlert className="h-5 w-5" aria-hidden="true" />
      </div>
      <h1 className="mt-7 text-2xl font-semibold text-slate-950">Keine Berechtigung</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {action} erfordert mindestens die Rolle <strong>{requiredRole}</strong>. Ihre Rolle in dieser
        Organisation ist <strong>{actualRole}</strong>.
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Bitte wenden Sie sich an eine Person mit Verwaltungsrechten Ihrer Organisation.
      </p>
      <Link
        href="/veranstaltungen"
        className="mt-7 inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Zurück zur Übersicht
      </Link>
    </section>
  );
}

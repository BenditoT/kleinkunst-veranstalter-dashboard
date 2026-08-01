"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useState } from "react";

import { getDemoConfig } from "@/lib/auth/pin";
import { checkPasswordPolicy } from "@/lib/auth/password-policy";

const { demoMode } = getDemoConfig();

type CredentialsAuthFormProps = {
  children: ReactNode;
  /** Server-Endpunkt für den echten Pfad (`NEXT_PUBLIC_DEMO_MODE=false`). */
  endpoint: string;
  /** Meldung im Demo-Modus, in dem es keinen Server gibt. */
  demoSuccessMessage: string;
  /** true = Passwortregel schon im Formular prüfen (Registrierung). */
  enforcePasswordPolicy?: boolean;
  /** true = nach erfolgreicher Anmeldung weiterleiten. */
  redirectOnSuccess?: boolean;
};

/**
 * Anmeldeformular gegen den echten Auth-Port (O6).
 *
 * Zwei Betriebsarten, weil derselbe Quellbaum zwei Ziele bedient:
 *
 * - **Demo-Modus** (`NEXT_PUBLIC_DEMO_MODE` an, GitHub-Pages-Export und
 *   der öffentliche Demodienst): Es gibt keinen Server, der eine Anmeldung
 *   prüfen könnte — der statische Export hat keine Route Handler. Das
 *   Formular meldet deshalb weiterhin ehrlich, dass hier nichts angemeldet
 *   wird. Geschützt ist dort nichts (siehe `lib/auth/pin.ts`).
 * - **Server-Modus** (`NEXT_PUBLIC_DEMO_MODE=false`): echte Anfrage an den
 *   Route Handler, echte deutsche Fehlermeldungen aus
 *   `lib/auth/messages.ts`, Session-Cookie setzt der Server.
 *
 * Der Client entscheidet dabei nichts Sicherheitsrelevantes: er zeigt nur
 * an, was der Server geantwortet hat. Die Passwortregel wird hier nur
 * *zusätzlich* geprüft, damit man nicht erst nach dem Absenden merkt, dass
 * das Passwort zu kurz ist — die verbindliche Prüfung läuft im Handler.
 */
export function CredentialsAuthForm({
  children,
  endpoint,
  demoSuccessMessage,
  enforcePasswordPolicy = false,
  redirectOnSuccess = false,
}: CredentialsAuthFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, typeof value === "string" ? value : ""]),
    );

    if (demoMode) {
      setStatus(demoSuccessMessage);
      return;
    }

    if (enforcePasswordPolicy) {
      const policy = checkPasswordPolicy(typeof payload.password === "string" ? payload.password : "");

      if (!policy.ok) {
        setError(policy.message);
        return;
      }
    }

    setIsPending(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !result.ok) {
        setError(result.message ?? "Die Anfrage konnte nicht verarbeitet werden.");
        return;
      }

      if (redirectOnSuccess) {
        router.replace(safeReturnTo());
        router.refresh();
        return;
      }

      setStatus(result.message ?? "Erledigt.");
    } catch {
      setError("Der Server ist nicht erreichbar. Bitte später erneut versuchen.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      {children}

      {error ? (
        <p role="alert" className="rounded-md bg-rose-50 px-3 py-2 text-sm font-medium leading-5 text-rose-700">
          <AlertTriangle className="mr-2 inline h-4 w-4 align-[-3px]" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      {status ? (
        <p role="status" className="rounded-md bg-teal-50 px-3 py-2 text-sm font-medium leading-5 text-teal-800">
          <CheckCircle2 className="mr-2 inline h-4 w-4 align-[-3px]" aria-hidden="true" />
          {status}
        </p>
      ) : null}

      {isPending ? (
        <p className="text-sm text-slate-500" aria-live="polite">
          Wird geprüft …
        </p>
      ) : null}
    </form>
  );
}

/**
 * `returnTo` darf ausschließlich Weiterleitungsziel sein und niemals
 * Datenquelle (keine `organizationId` daraus!). Zusätzlich wird nur ein
 * relativer Pfad akzeptiert: `//boese.example` oder `https://…` wären
 * eine offene Weiterleitung.
 */
function safeReturnTo(): string {
  if (typeof window === "undefined") {
    return "/";
  }

  const requested = new URLSearchParams(window.location.search).get("returnTo");

  if (!requested || !requested.startsWith("/") || requested.startsWith("//")) {
    return "/";
  }

  return requested;
}

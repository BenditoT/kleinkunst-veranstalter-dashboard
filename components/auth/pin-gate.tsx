"use client";

import { LockKeyhole } from "lucide-react";
import { FormEvent, ReactNode, useEffect, useState } from "react";

import { DEMO_LOGIN_PIN, isValidDemoPin } from "@/lib/auth/pin";

const storageKey = "kleinkunst-dashboard-pin-session";
const configuredPin = process.env.NEXT_PUBLIC_DEMO_PIN ?? DEMO_LOGIN_PIN;

type PinGateProps = {
  children: ReactNode;
};

export function PinGate({ children }: PinGateProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  useEffect(() => {
    setIsUnlocked(window.sessionStorage.getItem(storageKey) === "unlocked");
    setHasCheckedSession(true);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isValidDemoPin(pin, configuredPin)) {
      window.sessionStorage.setItem(storageKey, "unlocked");
      setIsUnlocked(true);
      setError("");
      return;
    }

    setError("PIN ist falsch.");
    setPin("");
  }

  if (!hasCheckedSession) {
    return <PinScreenSkeleton />;
  }

  if (isUnlocked) {
    return children;
  }

  return (
    <main className="grid min-h-screen bg-slate-100 px-4 py-10 text-slate-950 sm:px-6">
      <section className="mx-auto grid w-full max-w-md content-start rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid h-12 w-12 place-items-center rounded-md bg-slate-950 text-teal-300">
          <LockKeyhole className="h-5 w-5" aria-hidden="true" />
        </div>
        <h1 className="mt-7 text-2xl font-semibold text-slate-950">Buehnenblick Login</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Geschuetzte Demo fuer das Kleinkunst-Veranstalter Dashboard.
        </p>

        <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">PIN</span>
            <input
              value={pin}
              onChange={(event) => {
                setPin(event.target.value.replace(/\D/g, "").slice(0, 5));
                setError("");
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              type="password"
              autoComplete="one-time-code"
              autoFocus
              className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-white px-3 text-lg font-semibold tracking-[0.3em] text-slate-950 outline-none ring-teal-500 transition focus:border-teal-500 focus:ring-2"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "pin-error" : undefined}
            />
          </label>
          {error ? (
            <p id="pin-error" className="text-sm font-medium text-rose-600">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="flex h-11 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Einloggen
          </button>
        </form>
      </section>
    </main>
  );
}

function PinScreenSkeleton() {
  return <main className="min-h-screen bg-slate-100" aria-label="Login wird geladen" />;
}

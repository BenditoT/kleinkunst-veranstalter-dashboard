import Link from "next/link";
import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <main className="grid min-h-screen bg-slate-100 px-4 py-10 text-slate-950 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
        <section className="bg-slate-950 p-8 text-white sm:p-10">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal-400 text-base font-black text-slate-950">
            KD
          </div>
          <h1 className="mt-8 text-3xl font-semibold tracking-normal">Kleinkunst Dashboard</h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
            Multi-Venue-Planung, GEMA-Fristen, Finanzen, Newsletter und Aufgaben in einem deutschen
            Arbeitsdashboard.
          </p>
          <div className="mt-8 rounded-lg bg-white/6 p-4">
            <p className="text-sm font-semibold">Backend vorbereitet</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Default: Google Cloud. Supabase-Migration fruehestens ab 24.07.2026.
            </p>
          </div>
        </section>

        <section className="p-8 sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
          </div>
          {children}
          <div className="mt-6 text-sm text-slate-500">{footer}</div>
        </section>
      </div>
    </main>
  );
}

export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-teal-700 hover:text-teal-800">
      {children}
    </Link>
  );
}

export function AuthInput({ label, type = "text", name }: { label: string; type?: string; name: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        name={name}
        type={type}
        className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none ring-teal-500 transition focus:border-teal-500 focus:ring-2"
      />
    </label>
  );
}

export function AuthSubmit({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="flex h-11 w-full items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
    >
      {children}
    </button>
  );
}

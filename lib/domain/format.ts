import type { Event, EventStatus } from "./types";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function formatLongDate(value: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}

export function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${value}T00:00:00`));
}

export function formatPercent(value: number): string {
  return `${value}%`;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: "Entwurf",
    planned: "Geplant",
    published: "Veröffentlicht",
    completed: "Abgeschlossen",
    cancelled: "Abgesagt",
    not_required: "Nicht nötig",
    pending: "Fällig",
    submitted: "Eingereicht",
    confirmed: "Bestätigt",
    problem: "Problem",
  };

  return labels[status] ?? status;
}

/**
 * Kompaktes Statuslabel für knappe UI-Flächen (Dashboard-Tabelle).
 * Konsolidiert aus dashboard-home.tsx (S5).
 */
export function getCompactStatusLabel(status: Event["status"]): string {
  const labels: Record<Event["status"], string> = {
    draft: "Entwurf",
    planned: "Geplant",
    published: "Live",
    completed: "Fertig",
    cancelled: "Abgesagt",
  };

  return labels[status] ?? getStatusLabel(status);
}

/**
 * Optionen für den Status-Filter (inkl. "Alle Status").
 * Konsolidiert aus events-workspace.tsx (S5).
 */
export const eventStatusFilterOptions: Array<{ value: EventStatus | "all"; label: string }> = [
  { value: "all", label: "Alle Status" },
  { value: "draft", label: getStatusLabel("draft") },
  { value: "planned", label: getStatusLabel("planned") },
  { value: "published", label: getStatusLabel("published") },
  { value: "completed", label: getStatusLabel("completed") },
  { value: "cancelled", label: getStatusLabel("cancelled") },
];

export function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    draft: "bg-slate-100 text-slate-700 ring-slate-200",
    planned: "bg-violet-50 text-violet-700 ring-violet-200",
    published: "bg-teal-50 text-teal-700 ring-teal-200",
    completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
    pending: "bg-amber-50 text-amber-800 ring-amber-200",
    submitted: "bg-sky-50 text-sky-700 ring-sky-200",
    confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    problem: "bg-rose-50 text-rose-700 ring-rose-200",
    not_required: "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return classes[status] ?? classes.draft;
}

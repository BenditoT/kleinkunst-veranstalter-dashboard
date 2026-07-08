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
    published: "Veroeffentlicht",
    completed: "Abgeschlossen",
    cancelled: "Abgesagt",
    not_required: "Nicht noetig",
    pending: "Faellig",
    submitted: "Eingereicht",
    confirmed: "Bestaetigt",
    problem: "Problem",
  };

  return labels[status] ?? status;
}

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

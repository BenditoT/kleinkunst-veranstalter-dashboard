type ProgressBarProps = {
  value: number;
  max: number;
  label: string;
  color?: string;
  trackClassName?: string;
};

/**
 * Gemeinsame Fortschritts-/Auslastungsleiste (Tickets, Venue-Auslastung).
 * Konsolidiert aus dashboard-home.tsx, events-workspace.tsx und venue-detail.tsx (S5).
 * Trägt role="progressbar" + aria-valuenow/min/max für Screenreader (S6).
 */
export function ProgressBar({ value, max, label, color, trackClassName = "" }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`h-2 overflow-hidden rounded-full bg-slate-100 ${trackClassName}`}
    >
      <div
        className="h-full rounded-full bg-teal-500"
        style={{ width: `${percent}%`, backgroundColor: color }}
      />
    </div>
  );
}

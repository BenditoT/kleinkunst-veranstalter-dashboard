type InfoRowTone = "slate" | "white";

const toneClasses: Record<InfoRowTone, string> = {
  slate: "bg-slate-50",
  white: "bg-white",
};

type InfoRowProps = {
  label: string;
  value: string;
  tone?: InfoRowTone;
};

/**
 * Gemeinsame Label/Wert-Zeile ("StatusLine"/"StatusRow").
 * Konsolidiert aus venue-detail.tsx, artist-detail.tsx und calendar-workspace.tsx (S5).
 */
export function InfoRow({ label, value, tone = "slate" }: InfoRowProps) {
  return (
    <div className={`flex items-center justify-between rounded-md px-3 py-2 ${toneClasses[tone]}`}>
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

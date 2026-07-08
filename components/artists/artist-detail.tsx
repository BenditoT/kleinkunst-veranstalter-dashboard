import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Star, Ticket, UserRound } from "lucide-react";

import { formatCurrency, formatDate, getStatusClass, getStatusLabel } from "@/lib/domain/format";
import { getVenueName } from "@/lib/domain/module-content";
import { sampleEvents, sampleVenues } from "@/lib/domain/sample-data";
import type { Artist } from "@/lib/domain/types";

type ArtistDetailProps = {
  artist: Artist;
};

export function ArtistDetail({ artist }: ArtistDetailProps) {
  const artistEvents = sampleEvents
    .filter((event) => event.artistIds.includes(artist.id))
    .sort((left, right) => `${left.date} ${left.startTime}`.localeCompare(`${right.date} ${right.startTime}`));
  const totalRevenue = artistEvents.reduce((sum, event) => sum + event.revenueActual, 0);
  const totalTickets = artistEvents.reduce((sum, event) => sum + event.soldTickets, 0);

  return (
    <div className="mx-auto grid max-w-[1300px] gap-5">
      <Link href="/kuenstler" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Zurueck zu Kuenstler
      </Link>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-slate-950 text-teal-300">
              <UserRound className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Kuenstlerprofil</p>
              <h2 className="mt-1 text-3xl font-semibold text-slate-950">{artist.stageName}</h2>
              <p className="mt-2 text-sm text-slate-600">Kontakt: {artist.contactName}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {artist.genres.map((genre) => (
                  <span key={genre} className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">Booking-Status</p>
            <div className="mt-4 grid gap-3">
              <StatusLine label="Bewertung" value={`${artist.rating}/5`} />
              <StatusLine label="Favorit" value={artist.isFavorite ? "Ja" : "Nein"} />
              <StatusLine label="Events" value={String(artistEvents.length)} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label="Gesamtumsatz" value={formatCurrency(totalRevenue)} />
        <SummaryCard label="Tickets" value={String(totalTickets)} />
        <SummaryCard label="Favoritenstatus" value={artist.isFavorite ? "Gelistet" : "Neutral"} icon="star" />
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-950">Verknuepfte Veranstaltungen</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {artistEvents.map((event) => (
            <Link
              key={event.id}
              href={`/veranstaltungen/${event.slug}`}
              className="grid gap-3 px-5 py-4 transition hover:bg-slate-50 md:grid-cols-[minmax(0,1fr)_180px_160px_auto]"
            >
              <div>
                <p className="font-semibold text-slate-950">{event.title}</p>
                <p className="mt-1 text-sm text-slate-500">{event.subtitle}</p>
              </div>
              <p className="text-sm text-slate-600">
                {formatDate(event.date)}
                <span className="block text-xs text-slate-500">{event.startTime}-{event.endTime}</span>
              </p>
              <p className="text-sm text-slate-600">{getVenueName(event, sampleVenues)}</p>
              <span className={`h-fit rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStatusClass(event.status)}`}>
                {getStatusLabel(event.status)}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatusLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-white px-3 py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: string; icon?: "star" }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {icon === "star" ? (
        <Star className="h-5 w-5 text-amber-500" aria-hidden="true" />
      ) : (
        <Ticket className="h-5 w-5 text-teal-600" aria-hidden="true" />
      )}
      <p className="mt-3 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
      <ArrowUpRight className="mt-3 h-4 w-4 text-slate-400" aria-hidden="true" />
    </div>
  );
}

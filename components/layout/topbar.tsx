"use client";

import Link from "next/link";
import { Bell, CalendarDays, Command, Landmark, Menu, Moon, Plus, Search, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { groupGlobalSearchResults } from "@/lib/domain/dashboard";
import { navigationItems, type ModuleId } from "@/lib/domain/module-content";
import { sampleArtists, sampleEvents, sampleVenues } from "@/lib/domain/sample-data";

type TopbarProps = {
  activeItem: ModuleId;
};

export function Topbar({ activeItem }: TopbarProps) {
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);
  const activeLabel = navigationItems.find((item) => item.id === activeItem)?.label ?? "Uebersicht";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const searchResults = useMemo(
    () =>
      groupGlobalSearchResults({
        query,
        events: sampleEvents,
        artists: sampleArtists,
        venues: sampleVenues,
      }),
    [query],
  );

  const hasResults =
    searchResults.events.length > 0 || searchResults.artists.length > 0 || searchResults.venues.length > 0;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
      <div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-700 lg:hidden"
          aria-label="Navigation oeffnen"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="w-36 shrink-0 sm:w-44">
          <p className="text-xs font-semibold text-slate-500">Arbeitsbereich</p>
          <h1 className="truncate text-xl font-semibold text-slate-950">{activeLabel}</h1>
        </div>

        <div className="relative ml-auto hidden w-full max-w-md md:block xl:max-w-2xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Events, Kuenstler, Spielorte suchen"
            className="h-11 w-full rounded-md border border-slate-200 bg-slate-50/80 pl-10 pr-20 text-sm outline-none ring-teal-500 transition focus:border-teal-500 focus:bg-white focus:ring-2"
          />
          <div className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500">
            <Command className="h-3 w-3" aria-hidden="true" /> K
          </div>

          {query ? (
            <div className="absolute left-0 right-0 top-12 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
              {hasResults ? (
                <div className="max-h-80 overflow-y-auto p-2">
                  <SearchGroup title="Veranstaltungen" items={searchResults.events} />
                  <SearchGroup title="Kuenstler" items={searchResults.artists} />
                  <SearchGroup title="Spielorte" items={searchResults.venues} />
                </div>
              ) : (
                <p className="p-4 text-sm text-slate-500">Keine Treffer gefunden.</p>
              )}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="hidden h-11 shrink-0 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 xl:flex"
        >
          <Landmark className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <span className="whitespace-nowrap">Alle Spielorte</span>
        </button>

        <button
          type="button"
          className="hidden h-11 w-11 shrink-0 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 sm:grid"
          aria-label="Kalender oeffnen"
        >
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
        </button>

        <Link
          href="/veranstaltungen/neu"
          className="hidden h-11 shrink-0 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:flex"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="whitespace-nowrap">Neue Veranstaltung</span>
        </Link>

        <button
          type="button"
          onClick={() => setDark((value) => !value)}
          className="grid h-11 w-11 place-items-center rounded-md border border-slate-200 bg-white text-slate-700"
          aria-label="Theme umschalten"
        >
          {dark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
        </button>

        <button
          type="button"
          className="relative grid h-11 w-11 place-items-center rounded-md border border-slate-200 bg-white text-slate-700"
          aria-label="Benachrichtigungen"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
        </button>
      </div>
    </header>
  );
}

function SearchGroup({
  title,
  items,
}: {
  title: string;
  items: Array<{ id: string; label: string; description: string; href: string }>;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-1">
      <p className="px-2 py-1 text-xs font-semibold uppercase tracking-normal text-slate-400">{title}</p>
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="block rounded-md px-2 py-2 text-sm transition hover:bg-slate-50"
        >
          <span className="font-medium text-slate-900">{item.label}</span>
          <span className="mt-0.5 block text-xs text-slate-500">{item.description}</span>
        </Link>
      ))}
    </section>
  );
}

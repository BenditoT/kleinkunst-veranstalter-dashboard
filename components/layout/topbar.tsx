"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CalendarDays, Command, Landmark, Menu, Moon, Plus, Search, Sun, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";

import { groupGlobalSearchResults } from "@/lib/domain/dashboard";
import { navigationItems, type ModuleId } from "@/lib/domain/module-content";
import { sampleArtists, sampleEvents, sampleVenues } from "@/lib/domain/sample-data";
import type { SearchResult } from "@/lib/domain/types";

type TopbarProps = {
  activeItem: ModuleId;
};

export function Topbar({ activeItem }: TopbarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dark, setDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const activeLabel = navigationItems.find((item) => item.id === activeItem)?.label ?? "Übersicht";

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notificationsPanelRef = useRef<HTMLDivElement>(null);
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);

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

  const flatResults = useMemo<SearchResult[]>(
    () => [...searchResults.events, ...searchResults.artists, ...searchResults.venues],
    [searchResults],
  );
  const hasResults = flatResults.length > 0;
  const isSearchExpanded = Boolean(query) && isSearchOpen;

  // Cmd/Ctrl+K fokussiert die Suche, unabhängig davon wo der Fokus gerade ist (S6).
  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  // Such-Overlay: Klick außerhalb schließt die Ergebnisliste (Fokus bleibt im Feld) (S6).
  useEffect(() => {
    if (!isSearchExpanded) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchExpanded]);

  // Notification-Popover: Escape und Klick außerhalb schließen, Fokus geht zurück auf den Trigger (S6).
  useEffect(() => {
    if (!notificationsOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsPanelRef.current &&
        !notificationsPanelRef.current.contains(event.target as Node) &&
        !notificationsButtonRef.current?.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        notificationsButtonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [notificationsOpen]);

  function handleSearchChange(value: string) {
    setQuery(value);
    setActiveIndex(-1);
    setIsSearchOpen(true);
  }

  function handleSearchKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (!isSearchExpanded) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((value) => Math.min(value + 1, flatResults.length - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((value) => Math.max(value - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      if (activeIndex >= 0 && flatResults[activeIndex]) {
        event.preventDefault();
        setIsSearchOpen(false);
        router.push(flatResults[activeIndex].href);
      }
      return;
    }

    if (event.key === "Escape") {
      setIsSearchOpen(false);
      searchInputRef.current?.focus();
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
      <div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-700 lg:hidden"
          aria-label={mobileMenuOpen ? "Navigation schließen" : "Navigation öffnen"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>

        <div className="w-36 shrink-0 sm:w-44">
          <p className="text-xs font-semibold text-slate-500">Arbeitsbereich</p>
          <h1 className="truncate text-xl font-semibold text-slate-950">{activeLabel}</h1>
        </div>

        <div ref={searchContainerRef} className="relative ml-auto hidden w-full max-w-md md:block xl:max-w-2xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchInputRef}
            value={query}
            onChange={(event) => handleSearchChange(event.target.value)}
            onFocus={() => query && setIsSearchOpen(true)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Events, Künstler, Spielorte suchen"
            aria-label="Suche"
            role="combobox"
            aria-expanded={isSearchExpanded}
            aria-controls="global-search-listbox"
            aria-autocomplete="list"
            aria-activedescendant={
              isSearchExpanded && activeIndex >= 0 && flatResults[activeIndex]
                ? `search-option-${flatResults[activeIndex].id}`
                : undefined
            }
            className="h-11 w-full rounded-md border border-slate-200 bg-slate-50/80 pl-10 pr-20 text-sm outline-none ring-teal-500 transition focus:border-teal-500 focus:bg-white focus:ring-2"
          />
          <div className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500">
            <Command className="h-3 w-3" aria-hidden="true" /> K
          </div>

          <p aria-live="polite" className="sr-only">
            {query ? `${flatResults.length} Treffer gefunden` : ""}
          </p>

          {isSearchExpanded ? (
            <div
              id="global-search-listbox"
              role="listbox"
              aria-label="Suchergebnisse"
              className="absolute left-0 right-0 top-12 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
            >
              {hasResults ? (
                <div className="max-h-80 overflow-y-auto p-2">
                  <SearchGroup title="Veranstaltungen" items={searchResults.events} flatResults={flatResults} activeIndex={activeIndex} />
                  <SearchGroup title="Künstler" items={searchResults.artists} flatResults={flatResults} activeIndex={activeIndex} />
                  <SearchGroup title="Spielorte" items={searchResults.venues} flatResults={flatResults} activeIndex={activeIndex} />
                </div>
              ) : (
                <p className="p-4 text-sm text-slate-500">Keine Treffer gefunden.</p>
              )}
            </div>
          ) : null}
        </div>

        <Link
          href="/spielorte"
          className="hidden h-11 shrink-0 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 xl:flex"
        >
          <Landmark className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <span className="whitespace-nowrap">Alle Spielorte</span>
        </Link>

        <Link
          href="/kalender"
          className="hidden h-11 w-11 shrink-0 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 sm:grid"
          aria-label="Kalender öffnen"
        >
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
        </Link>

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
          ref={notificationsButtonRef}
          type="button"
          onClick={() => setNotificationsOpen((value) => !value)}
          className="relative grid h-11 w-11 place-items-center rounded-md border border-slate-200 bg-white text-slate-700"
          aria-label="Benachrichtigungen"
          aria-expanded={notificationsOpen}
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" aria-hidden="true" />
          <span className="sr-only">Neue Benachrichtigungen</span>
        </button>
      </div>

      {mobileMenuOpen ? (
        <nav className="grid gap-1 border-t border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden" aria-label="Navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeItem;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold ${
                  isActive ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      ) : null}

      {notificationsOpen ? (
        <div
          ref={notificationsPanelRef}
          className="absolute right-4 top-[72px] z-30 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-slate-200 bg-white p-3 shadow-xl sm:right-6 lg:right-8"
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <p className="text-sm font-semibold text-slate-950">Benachrichtigungen</p>
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen(false);
                notificationsButtonRef.current?.focus();
              }}
              className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
              aria-label="Benachrichtigungen schließen"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-3 grid gap-2">
            <NotificationLink
              href="/gema"
              title="3 GEMA-Meldungen fällig"
              detail="Fristen für Jazz, Kabarett und Poetry Slam prüfen."
              onClick={() => setNotificationsOpen(false)}
            />
            <NotificationLink
              href="/veranstaltungen?status=planned"
              title="2 geplante Events vorbereiten"
              detail="Poetry Slam und Sommerbühne brauchen finale Checklisten."
              onClick={() => setNotificationsOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}

function NotificationLink({
  href,
  title,
  detail,
  onClick,
}: {
  href: string;
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className="block rounded-md border border-slate-100 p-3 transition hover:bg-slate-50">
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
    </Link>
  );
}

function SearchGroup({
  title,
  items,
  flatResults,
  activeIndex,
}: {
  title: string;
  items: SearchResult[];
  flatResults: SearchResult[];
  activeIndex: number;
}) {
  if (items.length === 0) {
    return null;
  }

  const activeId = flatResults[activeIndex]?.id;

  return (
    <section className="py-1">
      <p className="px-2 py-1 text-xs font-semibold uppercase tracking-normal text-slate-400">{title}</p>
      {items.map((item) => (
        <Link
          key={item.id}
          id={`search-option-${item.id}`}
          role="option"
          aria-selected={item.id === activeId}
          href={item.href}
          className={`block rounded-md px-2 py-2 text-sm transition hover:bg-slate-50 ${
            item.id === activeId ? "bg-slate-100" : ""
          }`}
        >
          <span className="font-medium text-slate-900">{item.label}</span>
          <span className="mt-0.5 block text-xs text-slate-500">{item.description}</span>
        </Link>
      ))}
    </section>
  );
}

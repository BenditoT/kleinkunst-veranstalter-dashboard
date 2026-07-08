import Link from "next/link";
import { ChevronsLeft, Database, Landmark } from "lucide-react";
import type { ReactNode } from "react";

import { navigationItems, type ModuleId } from "@/lib/domain/module-content";

import { Topbar } from "./topbar";

type AppShellProps = {
  activeItem: ModuleId;
  children: ReactNode;
};

export function AppShell({ activeItem, children }: AppShellProps) {
  return (
    <div className="min-h-screen text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[268px] border-r border-slate-900/80 bg-slate-950 text-white shadow-2xl lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
          <div className="grid h-11 w-11 place-items-center rounded-md border border-teal-300/30 bg-teal-400/20 text-teal-100">
            <Landmark className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-semibold leading-5">Buehnenblick</p>
            <p className="text-xs text-slate-400">Kleinkunst Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeItem;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition ${
                  isActive
                    ? "border border-teal-300/20 bg-teal-500/20 text-white shadow-sm"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-md border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-400" />
              <p className="text-xs font-medium text-slate-300">Datenbank</p>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Database className="h-4 w-4 text-teal-300" aria-hidden="true" />
              Google Cloud SQL
            </div>
            <div className="mt-3 border-t border-white/10 pt-3">
              <p className="text-xs text-slate-400">Backend-Status</p>
              <p className="mt-1 text-xs font-semibold text-teal-300">Betriebsbereit vorbereitet</p>
            </div>
          </div>
          <button
            type="button"
            className="mt-4 flex h-10 w-full items-center gap-2 rounded-md px-2 text-sm font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
            Menue einklappen
          </button>
        </div>
      </aside>

      <div className="lg:pl-[268px]">
        <Topbar activeItem={activeItem} />
        <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <nav className="flex gap-2 overflow-x-auto" aria-label="Mobile Navigation">
            {navigationItems.map((item) => {
              const isActive = item.id === activeItem;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <main className="min-h-screen px-4 pb-10 pt-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

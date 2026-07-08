"use client";

import { ChevronsLeft, Menu } from "lucide-react";
import { useEffect, useState } from "react";

const collapsedClassName = "sidebar-collapsed";
const changeEventName = "kleinkunst-sidebar-collapsed-change";

function setCollapsed(value: boolean) {
  document.documentElement.classList.toggle(collapsedClassName, value);
  window.dispatchEvent(new CustomEvent(changeEventName, { detail: value }));
}

export function SidebarCollapseButton() {
  return (
    <button
      type="button"
      onClick={() => setCollapsed(true)}
      className="mt-4 flex h-10 w-full items-center gap-2 rounded-md px-2 text-sm font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
    >
      <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
      Menue einklappen
    </button>
  );
}

export function SidebarRestoreButton() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setIsCollapsed(document.documentElement.classList.contains(collapsedClassName));

    function handleChange(event: Event) {
      setIsCollapsed(Boolean((event as CustomEvent<boolean>).detail));
    }

    window.addEventListener(changeEventName, handleChange);

    return () => window.removeEventListener(changeEventName, handleChange);
  }, []);

  if (!isCollapsed) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => setCollapsed(false)}
      className="fixed left-3 top-24 z-40 hidden h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-lg transition hover:bg-slate-50 lg:flex"
    >
      <Menu className="h-4 w-4" aria-hidden="true" />
      Menue
    </button>
  );
}

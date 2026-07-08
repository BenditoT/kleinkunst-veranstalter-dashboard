"use client";

import { useSearchParams } from "next/navigation";

import { EventsWorkspace } from "@/components/events/events-workspace";
import type { EventFilters } from "@/lib/domain/events";
import type { EventStatus } from "@/lib/domain/types";

export function EventsWorkspaceClient() {
  const searchParams = useSearchParams();
  const filters: EventFilters = {
    query: searchParams.get("q") ?? undefined,
    status: parseStatus(searchParams.get("status") ?? undefined),
    venueId: searchParams.get("venue") ?? undefined,
  };

  return <EventsWorkspace filters={filters} />;
}

function parseStatus(status: string | undefined): EventStatus | "all" | undefined {
  if (
    status === "draft" ||
    status === "planned" ||
    status === "published" ||
    status === "completed" ||
    status === "cancelled" ||
    status === "all"
  ) {
    return status;
  }

  return undefined;
}

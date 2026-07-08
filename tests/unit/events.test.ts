import { describe, expect, it } from "vitest";

import {
  createEventSlug,
  detectVenueConflicts,
  filterEvents,
  getEventStatusTransitionOptions,
} from "../../lib/domain/events";
import { sampleEvents } from "../../lib/domain/sample-data";

describe("event domain helpers", () => {
  it("filters events by search query, status and venue", () => {
    const results = filterEvents(sampleEvents, {
      query: "poetry",
      status: "planned",
      venueId: "venue-kulturdeck",
    });

    expect(results.map((event) => event.title)).toEqual(["Poetry Slam Spezial"]);
  });

  it("creates stable German-friendly slugs from title and date", () => {
    expect(createEventSlug("Kabarett: Stadtgefluester!", "2026-07-11")).toBe(
      "2026-07-11-kabarett-stadtgefluester",
    );
  });

  it("detects venue conflicts including setup buffer time", () => {
    const conflictEvents = [
      ...sampleEvents,
      {
        ...sampleEvents[0],
        id: "event-conflict",
        title: "Late Night Jazz Session",
        startTime: "21:15",
        endTime: "22:30",
      },
    ];

    const conflicts = detectVenueConflicts(conflictEvents, { bufferMinutes: 45 });

    expect(conflicts).toEqual([
      {
        venueId: "venue-kupfersaal",
        venueName: "Kupfersaal Leipzig",
        firstEventId: "event-jazz-im-hof",
        secondEventId: "event-conflict",
        message: "Jazz im Hof kollidiert mit Late Night Jazz Session im Kupfersaal Leipzig.",
      },
    ]);
  });

  it("allows only forward event status transitions for active events", () => {
    expect(getEventStatusTransitionOptions("draft")).toEqual(["planned", "cancelled"]);
    expect(getEventStatusTransitionOptions("published")).toEqual(["completed", "cancelled"]);
    expect(getEventStatusTransitionOptions("completed")).toEqual([]);
  });
});

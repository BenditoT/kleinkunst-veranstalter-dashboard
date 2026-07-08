import { describe, expect, it } from "vitest";

import {
  calculateDashboardMetrics,
  findGemaDeadlines,
  groupGlobalSearchResults,
} from "../../lib/domain/dashboard";
import { sampleArtists, sampleEvents, sampleTasks, sampleVenues } from "../../lib/domain/sample-data";

describe("dashboard domain helpers", () => {
  it("calculates monthly revenue, open tasks and venue occupancy", () => {
    const metrics = calculateDashboardMetrics({
      events: sampleEvents,
      tasks: sampleTasks,
      venues: sampleVenues,
      referenceDate: new Date("2026-07-08T12:00:00+02:00"),
    });

    expect(metrics.monthlyRevenue).toBe(46250);
    expect(metrics.openTaskCount).toBe(8);
    expect(metrics.nextEvents.map((event) => event.title)).toEqual([
      "Jazz im Hof",
      "Kabarett: Stadtgefluester",
      "Poetry Slam Spezial",
      "Sommerbuehne Impro",
      "Chanson Nacht",
    ]);
    expect(metrics.venueOccupancy[0]).toMatchObject({
      venueName: "Kupfersaal Leipzig",
      occupancyRate: 82,
    });
  });

  it("finds GEMA deadlines due within seven days", () => {
    const deadlines = findGemaDeadlines(sampleEvents, new Date("2026-07-08T12:00:00+02:00"));

    expect(deadlines.map((deadline) => deadline.eventTitle)).toEqual([
      "Jazz im Hof",
      "Kabarett: Stadtgefluester",
      "Poetry Slam Spezial",
    ]);
    expect(deadlines[0]).toMatchObject({
      daysUntilDue: 1,
      status: "pending",
    });
  });

  it("groups global search results by entity type", () => {
    const results = groupGlobalSearchResults({
      query: "jazz",
      events: sampleEvents,
      artists: sampleArtists,
      venues: sampleVenues,
    });

    expect(results.events.map((result) => result.label)).toEqual(["Jazz im Hof"]);
    expect(results.artists.map((result) => result.label)).toEqual(["Mara Sol"]);
    expect(results.venues.map((result) => result.label)).toEqual(["Kupfersaal Leipzig"]);
  });
});

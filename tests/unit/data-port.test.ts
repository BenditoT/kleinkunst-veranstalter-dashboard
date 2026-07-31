import { describe, expect, it } from "vitest";

import { DEMO_ORGANIZATION_ID, createOrganizationContext } from "../../lib/data/context";
import { createDataPort } from "../../lib/data";
import { createInMemoryDataPort } from "../../lib/data/in-memory-adapter";
import {
  sampleArtists,
  sampleEvents,
  sampleTasks,
  sampleVenues,
  withOrganization,
} from "../../lib/domain/sample-data";
import type { Artist, Event, Task, Venue } from "../../lib/domain/types";

const OTHER_ORGANIZATION_ID = "org-test-zweite-buehne";

const demoContext = createOrganizationContext(DEMO_ORGANIZATION_ID);
const otherContext = createOrganizationContext(OTHER_ORGANIZATION_ID, "viewer");

/**
 * Zwei Mandanten mit identischen Datensätzen (gleiche IDs, gleiche Slugs)
 * unter unterschiedlicher organization_id. Wer hier durchkommt, filtert
 * wirklich nach Organisation und nicht zufällig nach IDs.
 */
function createTwoOrganizationPort() {
  return createInMemoryDataPort({
    events: [
      ...sampleEvents,
      ...withOrganization<Event>(OTHER_ORGANIZATION_ID, [
        {
          ...sampleEvents[0],
          title: "Fremde Gala",
          subtitle: "Darf niemals in der Demo-Organisation auftauchen",
          slug: "2026-08-01-fremde-gala",
        },
      ]),
    ],
    venues: [
      ...sampleVenues,
      ...withOrganization<Venue>(OTHER_ORGANIZATION_ID, [
        { ...sampleVenues[0], name: "Fremde Halle" },
      ]),
    ],
    artists: [
      ...sampleArtists,
      ...withOrganization<Artist>(OTHER_ORGANIZATION_ID, [
        { ...sampleArtists[0], stageName: "Fremder Act" },
      ]),
    ],
    tasks: [
      ...sampleTasks,
      ...withOrganization<Task>(OTHER_ORGANIZATION_ID, [
        { ...sampleTasks[0], title: "Fremde Aufgabe" },
      ]),
    ],
  });
}

describe("Datenport — Mandantentrennung", () => {
  it("liefert je Organisation nur deren eigene Datensätze", async () => {
    const port = createTwoOrganizationPort();

    const [demoEvents, otherEvents] = await Promise.all([
      port.listEvents(demoContext),
      port.listEvents(otherContext),
    ]);

    expect(demoEvents).toHaveLength(sampleEvents.length);
    expect(demoEvents.every((event) => event.organizationId === DEMO_ORGANIZATION_ID)).toBe(true);
    expect(demoEvents.map((event) => event.title)).not.toContain("Fremde Gala");

    expect(otherEvents.map((event) => event.title)).toEqual(["Fremde Gala"]);
  });

  it("findet fremde Datensätze auch nicht über ihre ID oder ihren Slug", async () => {
    const port = createTwoOrganizationPort();

    expect(await port.getEventBySlug(demoContext, "2026-08-01-fremde-gala")).toBeNull();
    expect(await port.getEventBySlug(otherContext, "2026-07-09-jazz-im-hof")).toBeNull();
    expect(await port.getVenueById(otherContext, sampleVenues[0].id)).toMatchObject({
      name: "Fremde Halle",
      organizationId: OTHER_ORGANIZATION_ID,
    });
  });

  it("trennt Spielorte, Künstler und Aufgaben genauso", async () => {
    const port = createTwoOrganizationPort();

    expect((await port.listVenues(otherContext)).map((venue) => venue.name)).toEqual(["Fremde Halle"]);
    expect((await port.listArtists(otherContext)).map((artist) => artist.stageName)).toEqual([
      "Fremder Act",
    ]);
    expect((await port.listTasks(otherContext)).map((task) => task.title)).toEqual([
      "Fremde Aufgabe",
    ]);
  });

  it("baut den Suchindex nur aus Daten der eigenen Organisation", async () => {
    const port = createTwoOrganizationPort();

    const demoIndex = await port.buildSearchIndex(demoContext);
    const otherIndex = await port.buildSearchIndex(otherContext);

    expect(demoIndex.some((entry) => entry.label === "Fremde Gala")).toBe(false);
    expect(otherIndex.map((entry) => entry.label).sort()).toEqual([
      "Fremde Gala",
      "Fremde Halle",
      "Fremder Act",
    ]);
  });

  it("wendet Eventfilter innerhalb der Organisation an", async () => {
    const port = createTwoOrganizationPort();

    const filtered = await port.listEvents(demoContext, { query: "poetry", status: "planned" });

    expect(filtered.map((event) => event.title)).toEqual(["Poetry Slam Spezial"]);
  });
});

describe("Datenport-Factory", () => {
  it("liefert ohne Konfiguration den In-Memory-Adapter mit den Demodaten", async () => {
    const port = createDataPort({});

    expect((await port.listEvents(demoContext)).length).toBe(sampleEvents.length);
  });

  it("scheitert laut, statt in einer Produktivumgebung stillschweigend Demodaten zu liefern", () => {
    expect(() => createDataPort({ DATA_ADAPTER: "cloud-sql", BACKEND_PROVIDER: "google-cloud" })).toThrow(
      /cloud-sql.*nicht implementiert|nicht implementiert/,
    );
    expect(() => createDataPort({ DATA_ADAPTER: "cloud-sql" })).toThrow(/cloud-sql-postgres/);
  });
});

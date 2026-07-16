import { describe, expect, it } from "vitest";

import { type EventInput, validateEventInput } from "../../lib/domain/event-validation";

const validInput: EventInput = {
  title: "Jazz im Hof",
  date: "2026-08-01",
  startTime: "20:00",
  endTime: "22:15",
  ticketPrice: "28.50",
  capacity: "320",
};

describe("event input validation", () => {
  it("accepts and normalizes a complete event input", () => {
    expect(
      validateEventInput({
        ...validInput,
        title: "  Jazz im Hof  ",
        ticketPrice: "28,50",
      }),
    ).toEqual({
      success: true,
      data: {
        title: "Jazz im Hof",
        date: "2026-08-01",
        startTime: "20:00",
        endTime: "22:15",
        ticketPrice: 28.5,
        capacity: 320,
      },
    });
  });

  it("returns German field errors for all missing required values", () => {
    expect(
      validateEventInput({
        title: "   ",
        date: "",
        startTime: "",
        endTime: "",
        ticketPrice: "",
        capacity: "",
      }),
    ).toEqual({
      success: false,
      errors: {
        title: "Bitte geben Sie einen Titel ein.",
        date: "Bitte geben Sie ein gültiges Datum im Format JJJJ-MM-TT ein.",
        startTime: "Bitte geben Sie eine gültige Beginnzeit im Format HH:MM ein.",
        endTime: "Bitte geben Sie eine gültige Endzeit im Format HH:MM ein.",
        ticketPrice:
          "Der Ticketpreis muss 0 Euro oder mehr betragen und darf höchstens zwei Nachkommastellen haben.",
        capacity: "Die Kapazität muss eine positive ganze Zahl sein.",
      },
    });
  });

  it.each(["01.08.2026", "2026-02-30", "2025-02-29", "2026-2-01"])(
    "rejects the invalid ISO date %s",
    (date) => {
      const result = validateEventInput({ ...validInput, date });

      expect(result).toEqual({
        success: false,
        errors: {
          date: "Bitte geben Sie ein gültiges Datum im Format JJJJ-MM-TT ein.",
        },
      });
    },
  );

  it("rejects malformed times and an end that is not after the start", () => {
    expect(validateEventInput({ ...validInput, startTime: "24:00", endTime: "9:30" })).toEqual({
      success: false,
      errors: {
        startTime: "Bitte geben Sie eine gültige Beginnzeit im Format HH:MM ein.",
        endTime: "Bitte geben Sie eine gültige Endzeit im Format HH:MM ein.",
      },
    });

    expect(validateEventInput({ ...validInput, startTime: "20:00", endTime: "20:00" })).toEqual({
      success: false,
      errors: {
        endTime: "Die Endzeit muss nach der Beginnzeit liegen.",
      },
    });

    expect(validateEventInput({ ...validInput, startTime: "20:00", endTime: "19:59" })).toEqual({
      success: false,
      errors: {
        endTime: "Die Endzeit muss nach der Beginnzeit liegen.",
      },
    });
  });

  it.each(["-1", "12.345", "kostenlos", Number.POSITIVE_INFINITY])(
    "rejects the invalid ticket price %s",
    (ticketPrice) => {
      expect(validateEventInput({ ...validInput, ticketPrice })).toEqual({
        success: false,
        errors: {
          ticketPrice:
            "Der Ticketpreis muss 0 Euro oder mehr betragen und darf höchstens zwei Nachkommastellen haben.",
        },
      });
    },
  );

  it.each(["0", "12.5", "-4", "viele", Number.MAX_SAFE_INTEGER + 1])(
    "rejects the invalid capacity %s",
    (capacity) => {
      expect(validateEventInput({ ...validInput, capacity })).toEqual({
        success: false,
        errors: {
          capacity: "Die Kapazität muss eine positive ganze Zahl sein.",
        },
      });
    },
  );
});

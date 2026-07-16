export type EventInput = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  ticketPrice: string | number;
  capacity: string | number;
};

export type EventInputField = keyof EventInput;

export type EventInputErrors = Partial<Record<EventInputField, string>>;

export type ValidatedEventInput = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  ticketPrice: number;
  capacity: number;
};

export type EventValidationResult =
  | { success: true; data: ValidatedEventInput }
  | { success: false; errors: EventInputErrors };

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
const ticketPricePattern = /^\d+(?:[.,]\d{1,2})?$/;
const capacityPattern = /^\d+$/;

/**
 * Validates and normalizes the fields required to create an event draft.
 * The function is intentionally independent of React and browser APIs so the
 * same rules can be reused at server and UI boundaries.
 */
export function validateEventInput(input: Readonly<EventInput>): EventValidationResult {
  const title = input.title.trim();
  const date = input.date.trim();
  const startTime = input.startTime.trim();
  const endTime = input.endTime.trim();
  const ticketPrice = parseTicketPrice(input.ticketPrice);
  const capacity = parseCapacity(input.capacity);
  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);
  const errors: EventInputErrors = {};

  if (!title) {
    errors.title = "Bitte geben Sie einen Titel ein.";
  }

  if (!isValidIsoDate(date)) {
    errors.date = "Bitte geben Sie ein gültiges Datum im Format JJJJ-MM-TT ein.";
  }

  if (startMinutes === null) {
    errors.startTime = "Bitte geben Sie eine gültige Beginnzeit im Format HH:MM ein.";
  }

  if (endMinutes === null) {
    errors.endTime = "Bitte geben Sie eine gültige Endzeit im Format HH:MM ein.";
  } else if (startMinutes !== null && endMinutes <= startMinutes) {
    errors.endTime = "Die Endzeit muss nach der Beginnzeit liegen.";
  }

  if (ticketPrice === null) {
    errors.ticketPrice =
      "Der Ticketpreis muss 0 Euro oder mehr betragen und darf höchstens zwei Nachkommastellen haben.";
  }

  if (capacity === null) {
    errors.capacity = "Die Kapazität muss eine positive ganze Zahl sein.";
  }

  if (Object.keys(errors).length > 0 || ticketPrice === null || capacity === null) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      title,
      date,
      startTime,
      endTime,
      ticketPrice,
      capacity,
    },
  };
}

function isValidIsoDate(value: string): boolean {
  if (!isoDatePattern.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value;
}

function parseTime(value: string): number | null {
  const match = timePattern.exec(value);

  if (!match) {
    return null;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

function parseTicketPrice(value: string | number): number | null {
  const normalizedValue = String(value).trim();

  if (!ticketPricePattern.test(normalizedValue)) {
    return null;
  }

  const parsedValue = Number(normalizedValue.replace(",", "."));
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function parseCapacity(value: string | number): number | null {
  const normalizedValue = String(value).trim();

  if (!capacityPattern.test(normalizedValue)) {
    return null;
  }

  const parsedValue = Number(normalizedValue);
  return Number.isSafeInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

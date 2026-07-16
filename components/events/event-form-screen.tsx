"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Save } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { createEventSlug } from "@/lib/domain/events";
import {
  type EventInputErrors,
  type EventInputField,
  validateEventInput,
} from "@/lib/domain/event-validation";
import { sampleArtists, sampleVenues } from "@/lib/domain/sample-data";

const validationFields: readonly EventInputField[] = [
  "title",
  "date",
  "startTime",
  "endTime",
  "ticketPrice",
  "capacity",
];

export function EventFormScreen() {
  const [title, setTitle] = useState("Neue Veranstaltung");
  const [date, setDate] = useState("2026-08-01");
  const [errors, setErrors] = useState<EventInputErrors>({});
  const [savedMessage, setSavedMessage] = useState("");
  const previewSlug = useMemo(
    () => createEventSlug(title.trim() || "Neue Veranstaltung", date || "2026-08-01"),
    [date, title],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const validation = validateEventInput({
      title: getFormValue(formData, "title"),
      date: getFormValue(formData, "date"),
      startTime: getFormValue(formData, "startTime"),
      endTime: getFormValue(formData, "endTime"),
      ticketPrice: getFormValue(formData, "ticketPrice"),
      capacity: getFormValue(formData, "capacity"),
    });

    if (!validation.success) {
      setErrors(validation.errors);
      setSavedMessage("");

      const firstInvalidField = validationFields.find((field) => validation.errors[field]);
      window.requestAnimationFrame(() => {
        const field = firstInvalidField ? form.elements.namedItem(firstInvalidField) : null;

        if (field instanceof HTMLElement) {
          field.focus();
        }
      });
      return;
    }

    setErrors({});
    setSavedMessage(`Entwurf "${validation.data.title}" wurde lokal für die Demo vorbereitet.`);
  }

  function handleFormChange(event: FormEvent<HTMLFormElement>) {
    const target = event.target;

    if (
      !(target instanceof HTMLInputElement) &&
      !(target instanceof HTMLSelectElement) &&
      !(target instanceof HTMLTextAreaElement)
    ) {
      return;
    }

    setSavedMessage("");

    if (!validationFields.includes(target.name as EventInputField)) {
      return;
    }

    const changedField = target.name as EventInputField;
    setErrors((currentErrors) => {
      if (!currentErrors[changedField] && !(changedField === "startTime" && currentErrors.endTime)) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[changedField];

      if (changedField === "startTime") {
        delete nextErrors.endTime;
      }

      return nextErrors;
    });
  }

  return (
    <div className="mx-auto grid max-w-[1100px] gap-5">
      <Link href="/veranstaltungen" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Zurueck zur Eventliste
      </Link>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-slate-500">Event erstellen</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">Neue Veranstaltung</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Dieses Formular ist fuer den spaeteren Server-Action/tRPC-Flow vorbereitet. Validierung,
            Slug-Generierung und Provider-Adapter bleiben getrennt von der UI.
          </p>
        </div>

        <form className="mt-6 grid gap-5" onChange={handleFormChange} onSubmit={handleSubmit} noValidate>
          {Object.keys(errors).length > 0 ? (
            <p role="alert" className="rounded-md bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              Bitte korrigieren Sie die markierten Felder.
            </p>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Titel"
              name="title"
              value={title}
              onChange={setTitle}
              placeholder="Jazz im Hof"
              error={errors.title}
              required
            />
            <FormField label="Untertitel" name="subtitle" placeholder="Sommerabend mit Mara Sol" />
            <FormField
              label="Datum"
              name="date"
              type="date"
              value={date}
              onChange={setDate}
              error={errors.date}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="Beginn"
                name="startTime"
                type="time"
                error={errors.startTime}
                required
              />
              <FormField label="Ende" name="endTime" type="time" error={errors.endTime} required />
            </div>
            <label htmlFor="venueId" className="block">
              <span className="text-sm font-medium text-slate-700">Spielort</span>
              <select
                id="venueId"
                name="venueId"
                className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-2"
              >
                {sampleVenues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="artistId" className="block">
              <span className="text-sm font-medium text-slate-700">Kuenstler</span>
              <select
                id="artistId"
                name="artistId"
                className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-2"
              >
                {sampleArtists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.stageName}
                  </option>
                ))}
              </select>
            </label>
            <FormField
              label="Ticketpreis"
              name="ticketPrice"
              type="number"
              placeholder="28"
              min={0}
              step="0.01"
              inputMode="decimal"
              error={errors.ticketPrice}
              required
            />
            <FormField
              label="Kapazitaet"
              name="capacity"
              type="number"
              placeholder="320"
              min={1}
              step={1}
              inputMode="numeric"
              error={errors.capacity}
              required
            />
          </div>

          <label htmlFor="description" className="block">
            <span className="text-sm font-medium text-slate-700">Beschreibung</span>
            <textarea
              id="description"
              name="description"
              rows={5}
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-2"
              placeholder="Kurzbeschreibung fuer Programm, Newsletter und Presse..."
            />
          </label>

          <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-600">
            Vorschau-Slug: <span className="font-semibold text-slate-950">{previewSlug}</span>
          </div>

          {savedMessage ? (
            <p role="status" className="rounded-md bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">
              <CheckCircle2 className="mr-2 inline h-4 w-4 align-[-3px]" aria-hidden="true" />
              {savedMessage}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/veranstaltungen"
              className="flex h-11 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700"
            >
              Abbrechen
            </Link>
            <button
              type="submit"
              className="flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              Entwurf speichern
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  min,
  step,
  inputMode,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  min?: number;
  step?: number | string;
  inputMode?: "decimal" | "numeric";
}) {
  const inputId = `event-${name}`;
  const errorId = `${inputId}-error`;

  return (
    <label htmlFor={inputId} className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        required={required}
        min={min}
        step={step}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`mt-2 h-11 w-full rounded-md border bg-white px-3 text-sm outline-none ring-teal-500 focus:ring-2 ${
          error
            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
            : "border-slate-200 focus:border-teal-500"
        }`}
      />
      {error ? (
        <span id={errorId} className="mt-1.5 block text-sm font-medium text-rose-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function getFormValue(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

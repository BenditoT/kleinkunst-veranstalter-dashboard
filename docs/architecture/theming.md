# ADR 4 — Theming: kein Dark-Mode, dafür AA-Kontrast

Stand: 31.07.2026 (Sprint Opus, O5) · Status: **entschieden, umgesetzt**

## Befund

Der Dark-Mode-Toggle in der Topbar war eine Attrappe:

- `tailwind.config.ts` setzt `darkMode: "class"`,
- `app/globals.css` enthält einen vollständigen `.dark`-Variablensatz,
- aber im gesamten Code stehen **0 `dark:`-Utilities**. Alle 14 Komponenten setzen `bg-white`, `text-slate-950`, `border-slate-200` hart.

Beim Klick änderte sich nur der Body-Hintergrund über `bg-background`. Das Ergebnis: dunkler Rand um eine unverändert weiße Oberfläche — es wirkte kaputt, weil es kaputt war. Ein E2E-Test (`toHaveClass(/dark/)`) hat diesen Zustand sogar abgesichert.

## Entscheidung: Variante (b) — Toggle entfernen, Dark-Mode ins Backlog

**Der Toggle ist raus.** Ein echter Dark-Mode bleibt als Backlog-Punkt dokumentiert.

Begründung — ehrliche Aufwandsabwägung:

| | Variante (a): Dark-Mode richtig | Variante (b): Toggle raus |
| --- | --- | --- |
| Umfang | 14 Komponenten von Hardcodes auf semantische Tokens (`bg-card`, `text-foreground`, `border-border`, `text-muted-foreground`) umstellen | eine Schaltfläche, ein Testabschnitt |
| Risiko | trifft jede Fläche der App; visuelle Regressionen sind in dieser Sprintphase nicht abgesichert (keine Screenshot-Tests) | praktisch null |
| Kollisionsgefahr | maximal — Sprint 2/3 fassen dieselben Komponenten für Auth-Guards und CRUD an | keine |
| Nutzen jetzt | kosmetisch | ein sichtbar defektes Bedienelement verschwindet |

Dazu kommt ein Reihenfolgeargument: Die Token-Umstellung ist erst dann sinnvoll, wenn die Komponentenlandschaft steht. Sprint 3 (CRUD), 4 (Kalender/Suche) und 5+ bringen neue Oberflächen; jede davon würde sonst zweimal angefasst — einmal für Dark-Mode, einmal fachlich. Ein Toggle, der nichts tut, ist außerdem schlechter als kein Toggle: er kostet Vertrauen.

### Backlog-Punkt „echter Dark-Mode" (nicht terminiert)

Voraussetzung: die Komponentenlandschaft ist stabil (frühestens nach Sprint 5). Vorgehen, wenn er kommt:

1. Semantische Tokens sind bereits vorhanden (`globals.css`, `tailwind.config.ts`) — sie bleiben absichtlich stehen, damit die Grundlage nicht neu erfunden werden muss.
2. Hardcodes ersetzen: `bg-white` → `bg-card`, `text-slate-950` → `text-foreground`, `text-slate-500/600` → `text-muted-foreground`, `border-slate-200` → `border-border`.
3. Der dunkle Variablensatz muss dabei selbst auf AA geprüft werden — `--muted-foreground` ist dort Slate 400.
4. Umschalter mit `prefers-color-scheme` als Startwert, Persistenz in `localStorage`, kein Flackern beim ersten Rendern (Inline-Skript im `<head>`).
5. Erst dann darf der Toggle zurück in die Topbar.

## Kontrast-Fixes (unabhängig von der Toggle-Entscheidung)

Gemessen wurde gegen den **tatsächlichen** Hintergrund, nicht gegen den nominellen.

| Ort | vorher | Kontrast | jetzt | Kontrast |
| --- | --- | --- | --- | --- |
| „Kein Termin", `calendar-workspace.tsx` | `text-slate-400` auf Weiß | 2,6:1 ✗ | `text-slate-600` | 7,6:1 ✓ |
| Suchgruppen-Überschriften, `topbar.tsx` | `text-slate-400` auf Weiß | 2,6:1 ✗ | `text-slate-600` | 7,6:1 ✓ |
| Such-Icon im Eingabefeld (`topbar.tsx`, `events-workspace.tsx`) | `text-slate-400` | 2,6:1 ✗ (WCAG 1.4.11 verlangt 3:1 für Bedienelemente) | `text-slate-500` | 4,8:1 ✓ |
| Pfeil-Icons in Detailkarten (`venue-detail.tsx`, `artist-detail.tsx`) | `text-slate-400` | 2,6:1 | `text-slate-500` | 4,8:1 ✓ |

**Bewusst unverändert geblieben:**

- `text-slate-400` auf `bg-slate-950` (Sidebar in `app-shell.tsx`, `sidebar-collapse-controls.tsx`, Statuskarte in `event-detail.tsx`): 7,9:1 — deutlich über AA. Slate 400 ist nur auf hellem Grund ein Problem.
- `text-slate-500` auf `bg-slate-50`-Karten (u. a. `EventStat`, `InfoTile`): 4,52:1 — knapp, aber über der AA-Schwelle von 4,5:1. Ein Wechsel auf Slate 600 wäre eine reine Geschmacksfrage und hätte die halbe Oberfläche verändert; für AAA (7:1) müsste ohnehin ein eigener Durchgang mit Designentscheidung her.

**Regel für neue Komponenten:** Auf hellem Grund ist `text-slate-500` die unterste zulässige Stufe für Fließtext; `text-slate-400` ist nur auf dunklem Grund erlaubt.

## Auswirkung auf die Tests

`tests/e2e/app.spec.ts` prüfte vorher `toHaveClass(/dark/)` nach einem Klick auf „Theme umschalten". Der Abschnitt prüft jetzt das Gegenteil: die Schaltfläche existiert nicht mehr und `<html>` trägt keine `dark`-Klasse. Damit kann die Attrappe nicht unbemerkt zurückkommen.

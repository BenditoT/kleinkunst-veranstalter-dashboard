# Fable-Orchestrierung — Event Management App (Autonomie-Protokoll)

> Diese Datei ist die Übergabe für eine **Fable-5-Session**, die als Orchestrator arbeitet: sie implementiert nie selbst, sondern startet, überwacht und verifiziert Sonnet-/Opus-Subagenten — und meldet sich bei Norbert nur, wenn es technisch unvermeidbar ist. Selbsterklärend, ohne Chat-Historie lesbar.
>
> Ziel: Norberts Interaktion auf das absolute Minimum reduzieren. Seine Zeit ist gerade die knappste Ressource im ganzen Betrieb — nicht Tokens, nicht Zeit von Claude.

## Verhältnis zu bestehenden Regeln

Ergänzt (nicht ersetzt) den Abschnitt „Modell-Orchestrierung (Fable = Orchestrator)" in Norberts globaler CLAUDE.md und den Skill `fable-direkt-orchestrierung`. Unterschied: schärfere, verbindliche Autonomie-Regeln — weniger Ermessen, weniger Rückfragen, als dort beschrieben.

## Grundregel: Autonomie zuerst

1. Fable liest `HANDOVER.md` und die anstehende(n) Sprint-Datei(en) selbst — ohne vorher bei Norbert nachzufragen, was zu tun ist.
2. Fable startet Sub-Sessions **direkt per Agent-Tool** (`model: "sonnet"` / `model: "opus"`). Es gibt keine „bitte öffne eine neue Session"-Übergabe an Norbert mehr — das war das alte Muster, das dieses Protokoll ablöst.
3. Fable **verifiziert jedes Subagenten-Ergebnis selbst**: Diffs lesen, Tests laufen lassen, Quality-Gates prüfen. Der Abschlussbericht eines Subagenten ist eine Behauptung, kein Nachweis — Fable liest die tatsächlich veränderten Dateien nach, bevor es sie als erledigt verbucht.
4. **Bricht ein Subagent ab** (API-Fehler, Verbindungsabbruch, Limit): Fable prüft den echten Fortschritt (`git status`/`git diff --stat`), briefed einen **neuen** Agent-Call vollständig über den Stand (was ist schon gemacht, was fehlt, welche Stolpersteine wurden schon gelöst) und macht selbst weiter. In dieser Umgebung war ein Resume-Mechanismus (`SendMessage` an eine bestehende Agent-ID) nicht zuverlässig verfügbar — Fable verlässt sich nicht darauf, sondern nutzt den Neustart-mit-vollem-Briefing-Weg als Standard.
5. Nach jeder Teilaufgabe: Qualitäts-Baseline selbst grün bekommen (`npm run quality` + `npm run test:e2e`, oder das projektspezifische Äquivalent), bevor es weitergeht. Bei Rot: Ursache auswerten (Screenshot/Trace), nicht Timeouts hochsetzen (Skill `flaky-ci-echter-bug-diagnose`).
6. Am Ende: kanonische `HANDOVER.md` aktualisieren (keine neue Version), committen. **Kein Push** — siehe unten.

## Wann Fable NICHT fragen darf (der Normalfall)

- Welche von mehreren technisch gültigen Umsetzungen, welche Bibliothek, welcher Name, welche Reihenfolge kleinerer Schritte — Fable wählt die im Sprintauftrag/ADR begründete oder naheliegendste Option, hält die Wahl in einem Satz fest, macht weiter.
- Ob ein Subagenten-Ergebnis „gut genug" ist — das prüft Fable selbst gegen die Akzeptanzkriterien der jeweiligen Sprint-Datei.
- Jeder Terminalbefehl, den Fable/ein Subagent selbst per Sandbox-Bash ausführen kann (`npm ci`, Lint, Test, Build, `playwright install`, `git add`/`commit`) — wird selbst ausgeführt, nie an Norbert weitergereicht.
- Normale Architektur-Ermessensfragen innerhalb eines Sprints (das ist genau der Job der Opus-Sub-Session, nicht von Norbert).

## Die einzigen erlaubten Rückfragen (abschließende Liste)

Nur bei einem der folgenden Fälle darf Fable Norbert unterbrechen — sonst nie:

1. Ein Geheimnis, Passwort, 2FA-Code oder Zahlungsmittel, das nur Norbert eingeben kann.
2. Eine Entscheidung mit echtem Geld-, Rechts- oder Datenverlust-Risiko, die sich nicht aus Sprintauftrag/ADRs ableiten lässt (z. B. „Produktivdaten löschen", „echte Personendaten freigeben", „Geld ausgeben").
3. Zwei Architekturoptionen ohne erkennbar überlegene Wahl **und** mit hohen späteren Wechselkosten. Selbst dann keine offene Frage — Fable schlägt die eigene Empfehlung vor und bittet nur um Bestätigung/Veto, mit kurzer Begründung.

Jeder andere Unsicherheitsfall: eigene Einschätzung nehmen, Empfehlung umsetzen, Begründung in `HANDOVER.md` oder einem ADR festhalten. Lieber eine dokumentierte, revidierbare Entscheidung als eine Rückfrage.

## Terminalbefehle an Norbert: nur das technisch Unvermeidbare

Alles, was in der Sandbox läuft, läuft in der Sandbox — nie an Norbert delegiert. Norbert bekommt ausschließlich Befehle, die zwingend auf seinem echten Rechner laufen müssen (typischerweise `git push`, weil der SSH-Key nur in seinem Schlüsselbund liegt und Pushen laut Hausregel immer seine eigene Handlung bleibt). Wenn so ein Befehl nötig ist: **genau einer**, als 1-Klick-Codeblock, am Ende der Session — nie mehrere, nie zwischendurch.

## Aktueller Auftrag (Stand 01.08.2026)

- Nächster Sprint: `sprint sonnet event app.md` (Datenport-Restumbau S1–S4 — 7 Dateien mechanisch nach dem Events-Pfad-Muster umstellen, siehe `docs/architecture/data-port.md`).
- Fable startet dafür sofort einen Sonnet-Subagenten (Agent-Tool, `model: "sonnet"`), briefed ihn mit dem Pfad zur Sprint-Datei plus den bekannten Sandbox-Stolpersteinen (`HANDOVER.md` → „Hinweise & Stolpersteine": `ulimit -n 65536`, `libXdamage.so.1`-Workaround, Symlink-Fix bei `node_modules`/`.next`).
- Taucht beim Restumbau eine **echte neue** Architektur-/Sicherheitsfrage auf (nicht: mechanisches Nacharbeiten nach vorgegebenem Muster) → zusätzlich einen Opus-Subagenten nachziehen, mit einer knappen neuen Sprint-Datei nach demselben Aufbau wie `sprint opus event app.md`.
- Danach: Bundle-Nachweis (`grep -rl "monthlySlots\|bookedSlots" .next/static/chunks` → muss 0 Treffer liefern, vorher 2), Abschnitt „Was offen ist" in `docs/architecture/data-port.md` aktualisieren, `HANDOVER.md` aktualisieren, committen.

## Session-Abschluss (unverändert Pflicht)

Klickbare Links auf alle Ergebnisse. **Max. 1 Terminal-Befehl.** Abschnitt „Was Norbert jetzt tut" mit genau **einer** Handlung. `HANDOVER.md` aktuell.

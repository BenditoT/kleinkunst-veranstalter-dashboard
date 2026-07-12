# Übergabe: Kleinkunst Dashboard 2.0

**Stand:** 10.07.2026 · **Version:** 2.0.0 · **Datei:** `v2/index.html` (Single-File, Preact+htm via esm.sh)

## Was ist das?

Grundlegende Neuentwicklung der Kleinkunst-Veranstalter-App als Single-File-Webapp.
Die alte Next.js-Version 1.0 im Hauptordner bleibt unverändert bestehen.

**Nutzung:** `v2/index.html` einfach im Browser öffnen (Doppelklick). Kein Server, kein npm, kein Login nötig. Daten werden automatisch im Browser gespeichert (localStorage, Schlüssel `kleinkunst_dashboard_v2`).

## Warum 2.0? (UX-Probleme der V1)

| V1 (Next.js) | V2 (Single-File) |
|---|---|
| Nur Anzeige, Demo-Daten fest einprogrammiert | Alles anlegen/bearbeiten/löschen, Autosave |
| 6 von 11 Modulen Platzhalter | Alle Module funktional |
| Technik-Jargon im Dashboard ("Google Cloud SQL bereit") | Veranstalter-KPIs: Events, Tickets, Umsatz, Aufgaben, GEMA |
| Keine Umlaute ("Kuenstler") | Korrektes Deutsch |
| Braucht npm/Dev-Server | Doppelklick genügt |
| Kein Mobile-Konzept | Bottom-Nav, FAB, 44px-Touch-Targets |

## Funktionen 2.0

- **Übersicht:** 5 klickbare KPI-Karten, nächste Events, dringende Aufgaben, GEMA-Warnungen
- **Veranstaltungen:** CRUD mit Suche/Filter, Auslastungsbalken, Detail-Ansicht mit Checkliste
- **Kalender:** Monatsansicht, Farben pro Spielort, Tag antippen = Event anlegen, ⚠️ Konflikt-Warnung bei Doppelbelegung (gleicher Ort/Tag, ±30 Min Puffer)
- **Spielorte & Künstler:** Karten-Ansicht, CRUD, Favoriten/Bewertung, kommende Auftritte
- **Finanzen:** Einnahmen/Kosten/Ergebnis pro Event, Monat und Spielort
- **GEMA:** Ampel (Rot=überfällig/Problem, Gelb=Frist ≤7 Tage, Grün=ok), Status direkt umstellbar
- **Aufgaben:** Kategorien, Fälligkeiten, Standard-Checklisten-Vorlage (9 Aufgaben, Fristen automatisch relativ zum Eventdatum)
- **Sonstiges:** Globale Suche, Onboarding beim Erststart, Toasts, Backup-Export/-Import (JSON), Demo-Daten-Reset

## Technik

- Preact 10.19.3 + htm 3.1.1 via esm.sh (CDN nötig beim ersten Laden)
- Funktionale setState-Updates überall (Stale-Closure-sicher), Escape schließt Modals, kein innerHTML (XSS-sicher)
- Demo-Daten aus V1 übernommen, um `costs` und Kontaktfelder erweitert

## Verifiziert

Headless-Smoke-Test (happy-dom): 18/18 bestanden — alle 9 Views rendern, Event anlegen, Checklisten-Vorlage, localStorage-Persistenz.

## Nächste Schritte (optional)

1. Deploy auf GitHub Pages (Skill `github-pages-deploy` / SSH-Deploy BenditoT)
2. Supabase-Anbindung für Multi-Device (DataService-Pattern nachrüsten)
3. Passwort-Gate, falls öffentlich gehostet (Skill `password-gate`)
4. Newsletter-/Ticketing-Modul, wenn Bedarf konkret wird

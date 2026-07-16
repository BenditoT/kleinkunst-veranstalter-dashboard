# Sprintplan: Kleinkunst-Veranstalter Dashboard

**Planungsstand:** 13.07.2026  
**Takt:** 10 Sprints à 2 Wochen  
**Produktziel:** Eine provider-neutrale, mandantenfähige Veranstaltungsplattform für mehrere Spielorte mit belastbaren Kernprozessen für Events, Kalender, GEMA, Finanzen und Kommunikation.

## Leitplanken

- Google Cloud ist der aktuelle Backend-Default. Fach- und UI-Code importiert keine Cloud-SDKs direkt.
- PostgreSQL bleibt die gemeinsame Datenmodell-Grenze. Über Supabase wird frühestens ab dem 24.07.2026 neu entschieden.
- Die Next.js-App im Projektstamm ist das Produkt. `v2/index.html` ist eine eigenständige UX-Demo und keine zweite Produktionsarchitektur.
- Jeder Sprint liefert einen vertikalen, testbaren Produktinkrement. Reine Platzhalter gelten nicht als fertig.
- Sicherheit, Barrierefreiheit, Mandantentrennung und Observability werden nicht in den letzten Sprint verschoben, sondern ab Sprint 1 mitgeführt.

## Rollen

| Rolle | Verantwortung |
| --- | --- |
| Orchestrierung | Scope, Architekturentscheidungen, Integration, Abnahme und Release-Entscheid |
| Terra | Fachlogik und produktnahe Frontend-Flows |
| Luna | Engineering-System, automatisierte Qualitätsgates und Betriebsreife |

## Zeitplan

| Sprint | Zeitraum | Status |
| --- | --- | --- |
| 1 | 13.07.–24.07.2026 | In Arbeit |
| 2 | 27.07.–07.08.2026 | Geplant |
| 3 | 10.08.–21.08.2026 | Geplant |
| 4 | 24.08.–04.09.2026 | Geplant |
| 5 | 07.09.–18.09.2026 | Geplant |
| 6 | 21.09.–02.10.2026 | Geplant |
| 7 | 05.10.–16.10.2026 | Geplant |
| 8 | 19.10.–30.10.2026 | Geplant |
| 9 | 02.11.–13.11.2026 | Geplant |
| 10 | 16.11.–27.11.2026 | Geplant |

## Gemeinsame Definition of Done

Ein Arbeitspaket ist nur abgeschlossen, wenn:

1. Akzeptanzkriterien im Produkt oder in automatisierten Tests nachweisbar sind.
2. TypeScript im Strict-Modus ohne Fehler läuft.
3. Lint, Unit-Tests und der produktive Build grün sind.
4. Kritische Nutzerpfade durch E2E-Tests oder einen dokumentierten manuellen Check abgedeckt sind.
5. Provider-Grenzen, Mandantentrennung und deutsche Fehlermeldungen erhalten bleiben.
6. Dokumentation und Beispielkonfiguration bei geänderten Schnittstellen aktualisiert sind.

## Roadmap

### Sprint 1 – Baseline und Engineering-System

**Ziel:** Eine reproduzierbare, überprüfbare Basis schaffen und die vorhandene Demo fachlich absichern.

**Ergebnisse:**

- Unterstützte Node-Version ist maschinenlesbar festgelegt.
- Ein einziger Qualitätsbefehl prüft Lint, Typen, Unit-Tests und Build.
- CI führt dieselben Gates auf jedem Pull Request aus.
- Das Event-Formular validiert Kernfelder barrierearm und mit deutschen Meldungen.
- Architektur- und Sprintentscheidungen sind im Repository auffindbar.

**Abnahme:** Frischer Checkout, `npm ci` und die dokumentierte Qualitätskette laufen mit der unterstützten Node-Version; ungültige Events können nicht als erfolgreich gespeichert gemeldet werden.

### Sprint 2 – Authentifizierung und Mandantengrenze

**Ziel:** Demo-PIN und simulierte Auth-Flows durch einen provider-neutralen Auth-Port mit Google Identity Platform als Default ersetzen.

**Ergebnisse:**

- Login, Registrierung, Passwort-Reset und Logout gegen den Auth-Adapter.
- Geschützte Routen und serverseitige Session-Prüfung.
- Rollen `owner`, `admin`, `manager`, `member`, `viewer`.
- `organization_id` wird serverseitig aus der Session abgeleitet und nie aus untrusted Formdaten übernommen.
- Auditierbare Tests für Rechte- und Organisationsgrenzen.

**Abnahme:** Zwei Testorganisationen können keine Daten der jeweils anderen lesen oder verändern; unauthentifizierte Zugriffe werden konsistent umgeleitet oder mit 401/403 abgewiesen.

### Sprint 3 – Persistente Kern-CRUDs

**Ziel:** Spielorte, Künstler, Veranstaltungen und Kontakte vollständig über den Backend-Port verwalten.

**Ergebnisse:**

- Erstellen, Anzeigen, Bearbeiten, Archivieren und Wiederherstellen der vier Kernentitäten.
- Servervalidierung, Slug-Eindeutigkeit und nachvollziehbare Statusübergänge.
- Event-Checklisten, Künstlerzuordnung und Venue-Technikprofile.
- CSV-Import für Künstler und Kontakte mit Vorschau, Dublettenprüfung und Fehlerbericht.
- Optimistische UI nur dort, wo Fehler sauber zurückgerollt werden.

**Abnahme:** CRUD-, Rollen- und Negativfälle sind integriert getestet; archivierte Daten verschwinden aus Standardlisten, bleiben aber wiederherstellbar.

### Sprint 4 – Dashboard, Kalender und Suche

**Ziel:** Den täglichen Dispositionsfluss über mehrere Spielorte produktiv nutzbar machen.

**Ergebnisse:**

- Wochen-, Monats- und Agendaansicht mit Venue-Farben.
- Konfliktprüfung inklusive Auf-/Abbaupuffer und unter Ausschluss abgesagter Termine.
- Filter nach Ort, Status und Zeitraum sowie ein belastbarer Heute-Sprung.
- Dashboard-KPIs aus echten Daten statt fest codierter Zahlen.
- Globale Suche über Events, Künstler, Spielorte und Kontakte mit Tastaturnavigation.

**Abnahme:** Doppelbelegungen werden vor dem Speichern erklärt; Kalender und Dashboard zeigen nach CRUD-Änderungen dieselben Daten.

### Sprint 5 – GEMA und Finanzen

**Ziel:** Meldefristen und wirtschaftliche Eventsteuerung als erstes fachliches MVP-Differenzierungsmerkmal liefern.

**Ergebnisse:**

- GEMA-Status, Musikfolgen, Fristen und Erinnerungen pro Veranstaltung.
- Versionierter Tarifrechner mit nachvollziehbarer Berechnungsgrundlage.
- Eventbudgets mit Plan/Ist, Einnahmen, Kosten und Break-even.
- Kassenbuch-Grundfluss und steuerlich getrennte Kategorien.
- PDF- und CSV-Exporte mit reproduzierbaren Summen.

**Abnahme:** Referenzfälle für GEMA und Finanzen ergeben centgenau erwartete Werte; jede Berechnung zeigt Tarifversion und Eingangsgrößen.

### Sprint 6 – Newsletter und Einwilligung

**Ziel:** DSGVO-taugliche Abonnentenverwaltung und einen verlässlichen Kampagnenfluss bereitstellen.

**Ergebnisse:**

- Double-Opt-In, Abmeldung und versionierter Einwilligungsnachweis.
- Abonnenten, Tags, Segmente und Dublettenbehandlung.
- Blockbasierte, responsive Kampagnenvorlagen mit Eventdaten.
- Versandadapter, Queue, Retry/Idempotenz und Provider-Webhooks.
- Zustell-, Klick-, Bounce- und Abmeldestatistiken; Öffnungen werden als unzuverlässige Hilfsmetrik gekennzeichnet.

**Abnahme:** Ein kompletter DOI- und Abmeldepfad ist E2E-getestet; ein Retry erzeugt keine doppelte Nachricht.

### Sprint 7 – Ticketing und Einlass

**Ziel:** Reservierungen, Gästelisten und mobilen Check-in für kleine Veranstaltungsbetriebe abdecken.

**Ergebnisse:**

- Tickettypen, Kontingente, Reservierungen, Frei- und Gästekarten.
- Signierte, einmalig verwendbare QR-Codes.
- Mobile Check-in-Ansicht mit sofortiger Doppel-Scan-Warnung.
- Begrenzter Offline-Modus mit erklärtem Synchronisationskonflikt-Verhalten.
- Gästelistenexport und Anbieter-CSV-Import.

**Abnahme:** Gleichzeitige Scans desselben Tickets führen höchstens zu einem gültigen Check-in; Kapazitätsgrenzen werden serverseitig erzwungen.

### Sprint 8 – Presse, Social und Medien

**Ziel:** Wiederverwendbare Eventinhalte kontrolliert in Presse- und Social-Kanäle bringen.

**Ergebnisse:**

- Pressekontakte, Verteiler, Pressemitteilungen und öffentliche Pressemappen.
- Medienbibliothek mit Metadaten, Rechten und Ablaufdatum.
- Plattform-Adapter zunächst für die priorisierten, tatsächlich freigegebenen Kanäle.
- Entwürfe, Freigabeprozess, Scheduling und provider-spezifische Fehlermeldungen.
- Kein automatisches Publizieren ohne explizite Freigabe.

**Abnahme:** Ein Event kann ohne Copy-and-paste in eine Pressemitteilung und einen freigegebenen Social-Entwurf überführt werden; fehlende Medienrechte blockieren Veröffentlichung.

### Sprint 9 – KI-Assistent mit Sicherheitsgrenzen

**Ziel:** Textassistenz liefern, ohne fachliche Kontrolle, Datenschutz oder Kostenkontrolle aufzugeben.

**Ergebnisse:**

- Provider-Port für OpenAI, Ollama und deaktivierten Modus.
- Promptvorlagen für Eventtexte, Newsletter, Presse und Social.
- Streaming, Abbruch, Retry und explizite Übernahme statt automatischer Speicherung.
- Personenbezogene Daten werden vor externen Aufrufen minimiert; Nutzung und Kosten werden protokolliert.
- Generierte Inhalte sind als Entwurf gekennzeichnet und bleiben editierbar.

**Abnahme:** Providerwechsel erfordert keine UI-Änderung; ein deaktivierter oder nicht erreichbarer Provider degradiert verständlich und ohne Datenverlust.

### Sprint 10 – DSGVO, Resilienz und Produktion

**Ziel:** Den MVP sicher, beobachtbar und wiederherstellbar produktiv betreiben.

**Ergebnisse:**

- Datenexport, Lösch-/Anonymisierungsworkflow, Aufbewahrungsregeln und Audit-Log.
- Accessibility-Review nach WCAG 2.2 AA für die kritischen Pfade.
- Performancebudgets, strukturierte Logs, Metriken, Alerts und Runbooks.
- Backup/Restore-Probe sowie dokumentierter Rollback.
- Cloud-Run-Deployment über OIDC, getrennte Staging-/Produktionskonfiguration und Secret Manager.

**Abnahme:** Staging besteht Security-, Accessibility-, Last- und Restore-Smoke-Tests; der Release- und Rollback-Weg ist von einer zweiten Person ausführbar.

## Aktueller Ausführungsschnitt

Für Sprint 1 werden zwei konfliktarme Pakete parallel umgesetzt:

| Paket | Owner | Scope | Akzeptanzkriterien |
| --- | --- | --- | --- |
| `TERRA-01` | Terra | Fachliche Event-Eingabe | Wiederverwendbare, getestete Validierung für Titel, Datum, Zeiten, Preis und Kapazität; Formular zeigt deutsche Feldfehler, ist korrekt beschriftet und meldet Erfolg nur für gültige Eingaben. |
| `LUNA-01` | Luna | Reproduzierbare Quality Gates | Node-Anforderung, Typecheck-/Quality-Skripte und PR-CI; lokale und CI-Kommandos verwenden dieselbe Reihenfolge; README beschreibt den Einstieg. |
| `ORCH-01` | Orchestrierung | Integration und Abnahme | Reviews auf Scope, Architektur, Tests und UX; Konflikte auflösen; vollständige Unit-, Lint-, Typecheck-, Build- und E2E-Kette ausführen. |

## Abhängigkeiten und Entscheidungszeitpunkte

- Sprint 2 startet erst nach bestätigter Identity-Platform-Konfiguration und Rollenmodell.
- Am oder nach dem 24.07.2026 wird nur der Daten-/Betriebsadapter Supabase neu bewertet, nicht die Facharchitektur.
- Externe Newsletter-, Social-, Ticket- und KI-Provider benötigen vor Umsetzung einen Datenschutz-, Kosten- und API-Freigabeentscheid.
- Sprint 7 darf ohne geklärtes Offline-Konfliktmodell nicht in produktiven Einlassbetrieb gehen.
- Sprint 10 benötigt einen realen Restore-Test; ein vorhandenes Backup allein erfüllt die Abnahme nicht.

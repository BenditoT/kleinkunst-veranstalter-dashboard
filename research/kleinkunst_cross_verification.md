# Cross-Verification & Insights: Kleinkunst-Veranstalter Dashboard-App

> **Analyse-Basis:** 12 Dimensions-Spezifikationen (Dim01-Dim12)
> **Analyse-Ziel:** Konflikte, Redundanzen, uebergeordnete Insights & konsolidierte Empfehlungen
> **Status:** v1.0 — Vollstaendige Analyse

---

## 1. Konflikte & Widersprueche

### 1.1 Tech-Stack-Inkonsistenzen

| # | Konflikt | Betroffene Dimensionen | Schwere |
|---|----------|----------------------|---------|
| K1 | **Next.js Version:** Dim11 empfiehlt Next.js 14+, Dim10 fordert Next.js 15+ | Dim10 vs Dim11 | **Hoch** |
| K2 | **Tailwind CSS Version:** Dim11 nennt 3.4+, Dim10 nennt 4.x | Dim10 vs Dim11 | **Hoch** |
| K3 | **shadcn/ui Version:** Dim11 nennt "latest" ohne Pinning, Dim10 spezifiziert keine Version | Dim10 vs Dim11 | **Mittel** |
| K4 | **React Version:** Dim11 fordert React 19+, Dim10 fordert React 18+ | Dim10 vs Dim11 | **Hoch** |
| K5 | **State Management:** Dim11: Zustand + TanStack Query; Dim10: Zustand + TanStack Query + react-grid-layout; Dim06: Context API | Dim06 vs Dim10/11 | **Mittel** |

**Empfohlene Aufloesung:** Einheitlicher Stack aus **Dim11 (die juengere Spezifikation)** uebernehmen: Next.js 15+, React 19+, Tailwind CSS 4.x, TypeScript 5.7+. Dim10 ist aelter und muss aktualisiert werden.

---

### 1.2 Architektur-Widersprueche

| # | Konflikt | Betroffene Dimensionen | Schwere |
|---|----------|----------------------|---------|
| K6 | **API-Paradigma:** Dim11 setzt auf tRPC (intern) + REST (extern); Dim09 definiert GraphQL Schema (AvailabilityResult, VenueBooking Types) | Dim09 vs Dim11 | **Hoch** |
| K7 | **Hosting-Strategie:** Dim11 propagiert "Monolith mit modularem Aufbau" auf Hetzner + Coolify; Dim12 fordert "maximale Datensouveraenitaet durch Self-Hosting" — aber beide erwaehnen Sentry (US-Anbieter) und GitHub Actions (Microsoft) | Dim11 vs Dim12 | **Kritisch** |
| K8 | **RLS-Strategie:** Dim11 definiert RLS mit `current_setting('app.current_org_id')`; Dim12 definiert RLS mit `auth.uid()` | Dim11 vs Dim12 | **Hoch** |

**Empfohlene Aufloesung:** Trennung strikt einhalten: tRPC fuer alles Frontend-Backend-Kommunikation, REST nur fuer externe Webhooks/API-Keys. GraphQL-Schema in Dim09 ist veraltet und wird durch tRPC ersetzt. Sentry muss durch selbst-gehostete Alternative (z.B. GlitchTip) ersetzt werden oder als optionaler Konfigurationsparameter gekennzeichnet werden.

---

### 1.3 Datenmodell-Inkonsistenzen

| # | Konflikt | Betroffene Dimensionen | Schwere |
|---|----------|----------------------|---------|
| K9 | **events-Tabelle Status-Values:** Dim01 (entwurf, geplant, live, abgeschlossen, abgesagt), Dim11 (draft, published, cancelled, postponed, completed) | Dim01 vs Dim11 | **Kritisch** |
| K10 | **venues-Tabelle Schema:** Dim09 hat 25+ Felder (has_stage, has_piano, setup_time_minutes, color); Dim11 hat nur 15 Felder (address als JSONB, keine Einzelfacility-Flags) | Dim09 vs Dim11 | **Hoch** |
| K11 | **Kontakt-Tabellen:** Dim02: `contacts`, Dim04: `press_contacts`, Dim09: `venue_contacts`, Dim12: `consents` referenziert `contacts` — aber keine FK-Beziehung definiert zwischen press_contacts und contacts | Dim02/04/09/12 | **Kritisch** |
| K12 | **User Roles:** Dim11 (owner, admin, manager, member, viewer), Dim12 (owner, admin, organizer, viewer, api) — "manager" vs "organizer", "member" vs fehlend, "api" nur in Dim12 | Dim11 vs Dim12 | **Hoch** |
| K13 | **notifications-Tabelle:** Dim10 definiert `notifications` mit type-ENUM; Dim03 definiert `newsletter_deliveries`; Dim05 hat eigene Notification-Queue — keine einheitliche Notification-Architektur | Dim03/05/10 | **Mittel** |

**Empfohlene Aufloesung:** Dim11 als führendes Datenmodell akzeptieren (juengste Spezifikation). Dim09-Facility-Flags als JSONB `facilities` Feld integrieren. Kontakt-Tabellen vereinheitlichen: eine zentrale `contacts`-Tabelle mit `type`-Feld und Modul-spezifischen Join-Tabellen. Rollen-Schema aus Dim11 uebernehmen und "organizer" als Alias fuer "manager" dokumentieren.

---

### 1.4 Annahme-Widersprueche

| # | Konflikt | Betroffene Dimensionen | Schwere |
|---|----------|----------------------|---------|
| K14 | **DSGVO-Konformitaet vs. externe Dienste:** Dim12 fordert "keine US-Cloud, keine CDN von US-Anbietern"; Dim11 nutzt Sentry; Dim06 integriert Eventim/Reservix (US-Cloud moeglich); Dim09 nutzt Google Calendar API | Dim06/09/11/12 | **Kritisch** |
| K15 | **Offline-Faehigkeit:** Dim11 propagiert "Online-first mit Offline-Sync"; Dim10 setzt auf Echtzeit-WebSocket — keine Konsistenz bei gleichzeitigem Offline-Modus | Dim10 vs Dim11 | **Mittel** |
| K16 | **Multi-Tenancy:** Dim11 definiert `organization_id` als Mandanten-Trennung; Dim02 definiert `is_global` bei Kontakten — das bricht das Multi-Tenancy-Pattern | Dim02 vs Dim11 | **Hoch** |

---

### 1.5 Performance-Widersprueche

| # | Konflikt | Betroffene Dimensionen | Schwere |
|---|----------|----------------------|---------|
| K17 | **Dashboard-Ladezeit:** Dim10 fordert "laedt in <2 Sekunden"; Dim10 definiert 12+ Widget-Typen mit Echtzeit-Daten — bei 5-15 Spielorten nicht realistisch ohne Aggregration | Dim10 intern | **Mittel** |
| K18 | **Ticketing-Sync:** Dim06 fordert "Echtzeit-Synchronisation"; Dim11 definiert BullMQ fuer Background Jobs — Echtzeit ist nicht mit Queue-basiertem Sync vereinbar | Dim06 vs Dim11 | **Mittel** |

---

## 2. Redundanzen

### 2.1 Datenmodell-Redundanzen

| # | Redundanz | Betroffene Dimensionen | Konsolidierungsvorschlag |
|---|-----------|----------------------|------------------------|
| R1 | **Kontakt-Tabellen (3x):** `contacts` (Dim02), `press_contacts` (Dim04), `venue_contacts` (Dim09) | Dim02/04/09 | Eine `contacts`-Tabelle + `contact_links`-Join-Tabelle mit `context: 'general' \| 'press' \| 'venue'` |
| R2 | **Event-Status-Felder (2x):** Dim01 `status`, Dim06 `booking_status` — semantisch unklar | Dim01/06 | Einheitliches `event_status`-ENUM mit klarer Semantik |
| R3 | **Kalender-Entitaeten (3x):** `events` (Dim01), `venue_bookings` (Dim09), `external_calendar_events` (Dim09) | Dim01/09 | `events` als Master-Tabelle, `venue_bookings` als Verknuepfung, `external_calendar_events` als Cache |
| R4 | **Benachrichtigungen (4x):** `notifications` (Dim10), `newsletter_deliveries` (Dim03), Social-Media-Queue (Dim05), `deletion_requests` (Dim12) | Dim03/05/10/12 | Zentrale `notifications`-Tabelle mit `source`-Feld und modulspezifischen Detail-Tabellen |
| R5 | **Statistik-Aggregationen (3x):** `event_stats` (Dim01), `venue_stats` (Dim09), Finanz-Reports (Dim07) | Dim01/07/09 | Materialisierte Views oder zentrale `aggregations`-Tabelle mit `metric_type` |

### 2.2 Funktionale Redundanzen

| # | Redundanz | Betroffene Dimensionen | Konsolidierungsvorschlag |
|---|-----------|----------------------|------------------------|
| R6 | **Template-Systeme (3x):** Newsletter-Templates (Dim03), Presse-Templates (Dim04), Programmheft-Templates (Dim08) | Dim03/04/08 | Zentrales Template-System mit `template_type`-ENUM |
| R7 | **PDF-Generierung (4x):** Programmheft-PDF (Dim08), Finanz-Reports (Dim07), Presse-Mitteilungen (Dim04), GEMA-Meldungen (Dim12) | Dim04/07/08/12 | Einheitlicher PDF-Service (Playwright + Paged.js) |
| R8 | **Kalender-Ansichten (3x):** Event-Kalender (Dim01), Multi-Venue-Kalender (Dim09), Social-Media-Planer (Dim05) | Dim01/05/09 | Einheitliche Kalender-Komponente (@fullcalendar) mit unterschiedlichen Datenquellen |
| R9 | **Drag-and-Drop (2x):** Dashboard-Widgets (Dim10), Programmheft-Layout (Dim08) | Dim08/10 | Einheitliche DnD-Bibliothek (@dnd-kit) |
| R10 | **Suche (2x):** Globale Suche (Dim10), KI-Semantic Search (Dim02) | Dim02/10 | PostgreSQL FTS als Fallback, KI-Search als opt-in Upgrade |

### 2.3 Integrations-Redundanzen

| # | Redundanz | Betroffene Dimensionen | Konsolidierungsvorschlag |
|---|-----------|----------------------|------------------------|
| R11 | **OAuth-Flows (3x):** Google Calendar (Dim09), Social Media (Dim05), Auth (Dim11) | Dim05/09/11 | Zentraler OAuth-Manager mit Token-Refresh-Logik |
| R12 | **Webhook-Handler (4x):** Newsletter (Dim03), Ticketing (Dim06), Presse (Dim04), Kalender (Dim09) | Dim03/04/06/09 | Zentrale Webhook-Verarbeitung mit `source`-Routing |
| R13 | **iCal-Feeds (2x):** Oeffentliche Kalender-Feeds (Dim09), Gaesteliste-Export (Dim06) | Dim06/09 | Einheitlicher iCal-Service |

---

## 3. Insights (14 uebergeordnete Erkenntnisse)

### Insight 1: Der Kalender ist die versteckte Drehscheibe der gesamten App

**Sichtbar aus:** Dim01 (Events), Dim06 (Ticketing-Zeitplan), Dim07 (Finanz-Termine), Dim08 (Programmheft-Druckdeadline), Dim09 (Multi-Orte-Verwaltung)

Der Kalender (Dim09) ist nicht nur ein "Ansichts-Feature" — er ist das zentrale Koordinationssystem. Alle Module muessen in die Kalender-Infrastruktur integriert werden: Finanz-Deadlines (GEMA-Meldung 7 Tage nach Event), Programmheft-Druckdeadlines (X Tage vor Event), Ticketing-Start/Ende. Eine Aenderung im Event-Kalender hat Kaskadeneffekte auf 5+ Module. Die `venue_bookings`-Tabelle ist die technische Kerndrehscheibe — sie muss von Anfang an performant und konsistent sein.

**Strategische Implikation:** Der Kalender muss als **erstes** stabilisiert werden (vor Event-Management selbst). Ohne robuste Kalender-Basis brechen abhaengige Features.

---

### Insight 2: Kuenstler sind die verbindende Entitaet zwischen fast allen Modulen

**Sichtbar aus:** Dim01 (Event-Kuenstler), Dim02 (Kuenstler-DB), Dim03 (Newsletter-Empfaenger), Dim04 (Pressekontakt), Dim07 (Abrechnung), Dim08 (Programmheft-Biografie), Dim12 (DSGVO-Daten)

Ein Kuenstler erscheint in mindestens 7 Modulen gleichzeitig. In keiner Dimension wird diese Querschnittsrolle explizit modelliert. Das fuehrt zu Inkonsistenzen: Ein Kuenstler in der Datenbank (Dim02) muss auch als Kontakt (Dim02), Newsletter-Empfaenger (Dim03), Pressekontakt (Dim04), Abrechnungsempfaenger (Dim07) und DSGVO-Betroffener (Dim12) verwaltet werden.

**Strategische Implikation:** Ein **Kuenstler-Identity-Service** als zentrale microservice-aehnliche Komponente ist noetig — nicht als echter Microservice, sondern als Domain-Layer im Monolithen, der alle anderen Module mit konsistenten Kuenstlerdaten versorgt.

---

### Insight 3: Das "Kleinkunst-Segment" ist extrem preissensibel — jede Feature-Entscheidung muss sich in ROI rechnen

**Sichtbar aus:** Dim06 (Ticketpreise 5-30 Euro, Kapazitaet 50-300), Dim07 (Geringe Margen, Break-Even-Analyse), Dim10 (Ehrenamtliche/nebenberufliche Veranstalter)

Die Kombination aus niedrigen Ticketpreisen (5-30 Euro), begrenzten Kapazitaeten (50-300 Gaeste) und ehrenamtlicher/nebenberuflicher Arbeitsweise macht jede Software-Investition zur Kosten-Nutzen-Rechnung. Ein Feature, das 2 Stunden/Monat spart, hat bei einem Preis von 30 Euro/Monat einen ROI von "2 Stunden Lohn". Das macht die Zielgruppe preissensibler als Enterprise-Kunden.

**Strategische Implikation:** Preismodell muss **value-basiert** sein (pro Spielort, nicht pro Benutzer). Features, die nicht direkt Zeit sparen (z.B. KI-Gimmicks), sollten optional sein.

---

### Insight 4: GEMA-Compliance ist ein kritischer Pfad, der 4 Dimensionen verbindet

**Sichtbar aus:** Dim07 (GEMA-Meldung), Dim08 (Programmheft-Setliste), Dim12 (DSGVO/GEMA-Compliance), Dim11 (Architektur)

Die GEMA-Meldung ist in keiner Dimension vollstaendig modelliert, aber alle beruehren sie: Dim07 (Finanzen) hat GEMA-Kosten, Dim08 (Programmheft) hat die Setliste, Dim12 (Compliance) hat das Meldeformular. Die Setliste aus dem Programmheft muss automatisch in die GEMA-Meldung (Dim12) fliessen, und die GEMA-Kosten muessen in die Finanzabrechnung (Dim07). Diese Verbindung existiert nur implizit.

**Strategische Implikation:** Ein **GEMA-Workflow-Modul** als eigener Service — nicht nur Datenbanktabelle, sondern Workflow: Setliste erfassen → GEMA-Formular generieren → Erinnerung senden → Status tracken → Kosten in Finanzen buchen.

---

### Insight 5: KI-Features sind ueber 5 Dimensionen verteilt, aber nicht konsolidiert

**Sichtbar aus:** Dim02 (Kuenstler-Empfehlungen), Dim03 (KI-Textgenerierung Newsletter), Dim05 (KI-Post-Generierung), Dim10 (KI-Widgets, NLP-Querying), Dim12 (AI Registry, EU AI Act)

KI wird in fast jeder Dimension erwaehnt, aber ohne zentrale Strategie. Dim12 fordert eine AI Registry — aber die ist leer, wenn nicht alle KI-Features zentral erfasst werden. Der EU AI Act (ab August 2026) macht dies zur Pflicht.

**Strategische Implikation:** Ein **KI-Layer** als zentrale Infrastruktur: Alle KI-Features muessen in der `ai_registry` (Dim12) registriert sein, mit Einwilligungs-Management (Dim12) und Audit-Trail. KI ist kein "Nice-to-have" — sie wird fuer DSGVO-Konformitaet noetig.

---

### Insight 6: Newsletter + Social Media + Presse = Ein unsichtbarer Kommunikations-Workflow

**Sichtbar aus:** Dim03 (Newsletter), Dim04 (Presse), Dim05 (Social Media)

Die drei Kommunikations-Module bilden zusammen einen natuerlichen Workflow, der in keiner Dimension explizit modelliert wird:
1. Event wird erstellt (Dim01)
2. Newsletter wird geschrieben und verschickt (Dim03)
3. Social-Media-Posts werden geplant (Dim05)
4. Pressemitteilung wird verfasst und verteilt (Dim04)

Alle drei nutzen aehnliche Daten (Event-Titel, Datum, Spielort, Kuenstlername), aber jede Dimension definiert eigene Templates und Workflows.

**Strategische Implikation:** Ein **"Event Promotion Workflow"** — nach Event-Erstellung wird ein Wizard gestartet, der Newsletter-Text, Social-Media-Posts und Pressemitteilung aus den Event-Daten generiert und den Versand koordiniert.

---n

### Insight 7: Multi-Venue-Management ist das eigentliche Alleinstellungsmerkmal

**Sichtbar aus:** Dim09 (5-15 Spielorte pro Veranstalter), Dim01 (Event-Spielort-Zuordnung), Dim06 (Ticketing pro Spielort), Dim07 (Finanzen pro Spielort)

Generische Event-Management-Tools (Eventbrite, XING Events) unterstuetzen keine Multi-Venue-Struktur mit 5-15 Spielorten. Jeder Spielort hat eigene Vertraege, Technik, Kontaktpersonen, Kapazitaeten und Kalender. Diese Komplexitaet ist das Alleinstellungsmerkmal.

**Strategische Implikation:** Multi-Venue-Management (Dim09) muss als **P0-Feature** in Phase 1 implementiert werden — nicht als spaeteres Add-on. Ohne dieses Feature ist die App nicht besser als bestehende Tools.

---

### Insight 8: Self-Hosting als Verkaufsargument im Kultursektor ist hochriskant

**Sichtbar aus:** Dim11 (Hetzner + Coolify), Dim12 (DSGVO-Selbsthosting), Dim09 (Google/Outlook Calendar Sync), Dim05 (Social Media APIs)

Dim11/Dim12 propagieren Self-Hosting als Alleinstellungsmerkmal. Aber: Jede externe Integration (Google Calendar, Social Media APIs, Ticketing-Anbieter) bricht dieses Modell. Daten fliessen notwendigerweise zu US-Anbietern (Google, Meta, Eventim). Das Verkaufsargument "alles in Deutschland" ist technisch nicht erreichbar.

**Strategische Implikation:** Positionierung auf **"Kontrolle ueber Primaerdaten"** (Kuenstlerdaten, Gaestelisten, Finanzen bleiben in DE) statt "alles in Deutschland". Externe Integrationen sind notwendiges Uebel und muessen transparent dokumentiert werden.

---

### Insight 9: Das "10-Sekunden-Prinzip" (Dim10) ist der Schluessel zur Adoption

**Sichtbar aus:** Dim10 (Dashboard-Ladezeit <2s, <7 Elemente pro Widget), Dim11 (Online-first), Dim07 (ehrenamtliche Veranstalter)

Kleinkunst-Veranstalter arbeiten nebenberuflich. Wenn das Dashboard nicht in 10 Sekunden den Status zeigt, wird es nicht genutzt. Das ist kein UX-Nice-to-have — es ist ein Produktadoptions-Kriterium.

**Strategische Implikation:** Performance ist ein Feature. Jede Phase der Roadmap muss einen Performance-Budget-Test bestehen: Dashboard laedt in <2s bei 10 Spielorten, 50 Events, 5 Team-Mitgliedern.

---

### Insight 10: Ticketing-Integration ist der groesste technische Risikofaktor

**Sichtbar aus:** Dim06 (7+ Anbieter, unterschiedliche APIs), Dim11 (tRPC + REST), Dim12 (DSGVO bei Datenuebertragung)

Die Ticketing-Integration (Dim06) ist der komplexeste technische Teil: 7+ Anbieter (Eventim, Reservix, Weezevent, Kulturkarten, Eventbrite, Uni-Tickets, Regional), jeder mit eigener API, Rate-Limits, Authentifizierung und Datenschutzvereinbarung. Ein einziger API-Change beim Anbieter kann die Integration brechen.

**Strategische Implikation:** Ticketing-Integration als **optionales Plugin-System** designen — nicht als Core-Feature. CSV-Import als Fallback fuer jeden Anbieter. Keine Echtzeit-Sync versprechen, sondern taegliche Batch-Import.

---

### Insight 11: Programmheft (Dim08) ist komplexer als gedacht — potenzieller Scope-Creep

**Sichtbar aus:** Dim08 (PDF-Generator, Layout-System, Werbebanner), Dim01 (Event-Daten), Dim02 (Kuenstler-Bios), Dim12 (Impressum, Barrierefreiheit)

Das Programmheft verbindet Event-Daten, Kuenstler-Biografien, Spielort-Details, Werbebanner und Compliance-Anforderungen (Impressum, Barrierefreiheit). Der Druck-PDF-Export mit professionellem Layout ist nahe an Desktop-Publishing-Software.

**Strategische Implikation:** Programmheft als **separates, kostenpflichtiges Modul** positionieren. Nicht in Phase 1/2, sondern Phase 3+. Fuer Phase 1 reicht ein einfacher Event-Export als PDF.

---

### Insight 12: Die Finanz-Abrechnung ist der am wenigsten verhandelbare Feature-Bereich

**Sichtbar aus:** Dim07 (Kuenstler-Abrechnung, GEMA), Dim12 (DSGVO-Audit-Trail), Dim01 (Event-Absage = Rueckabwicklung)

Fehler bei der Finanz-Abrechnung (Dim07) haben direkte rechtliche und finanzielle Konsequenzen: Künstler muessen korrekt abgerechnet werden, GEMA-Meldungen muessen vollstaendig sein, bei Event-Absagen muessen Rueckzahlungen korrekt verarbeitet werden. Die Audit-Trail-Anforderung (Dim12) macht dies zur Pflicht.

**Strategische Implikation:** Finanz-Modul (Dim07) muss **hoechste Testabdeckung** haben (>90%). Automatisierte Tests fuer alle Abrechnungsszenarien. Keine "schnellen Features" im Finanz-Modul ohne QA.

---

### Insight 13: Die Rollen- und Berechtigungs-Architektur hat eine Luecke

**Sichtbar aus:** Dim11 (5 Rollen), Dim12 (5 Rollen, aber andere), Dim01 (Event-Operationen), Dim07 (Finanz-Zugriff)

Keine Dimension modelliert die Berechtigungen fuer **Cross-Modul-Operationen**. Beispiel: Ein "manager" darf Events erstellen — aber darf er auch die dazugehoerige GEMA-Meldung sehen? Darf er die Finanz-Abrechnung einsehen? Die Rolle "organizer" (Dim12) vs "manager" (Dim11) ist unklar.

**Strategische Implikation:** Zentrale **Permission-Matrix** erstellen: Welche Rolle darf in welchem Modul welche Operation durchfuehren? Diese Matrix als lebendes Dokument pflegen und vor jedem Feature-Release aktualisieren.

---

### Insight 14: Notification-UEberlastung ist ein reales Risiko

**Sichtbar aus:** Dim03 (Newsletter-Versand-Status), Dim05 (Social-Media-Post-Erinnerungen), Dim09 (Kalender-Konfliktwarnungen), Dim10 (Notification-Inbox), Dim12 (GEMA-Erinnerung, Loeschantrag-Benachrichtigung)

5+ Module generieren Benachrichtigungen. Bei 15 Spielorten und 50 Events/Monat kann ein Veranstalter schnell mit 20+ Benachrichtigungen/Tag ueberflutet werden. Die Notification-Inbox (Dim10) wird dann zur Last statt zum Nutzen.

**Strategische Implikation:** **Smart Notifications** — Benachrichtigungen werden aggregiert (z.B. "3 Events diese Woche benoetigen GEMA-Meldung" statt 3 Einzelbenachrichtigungen). Taegliche Zusammenfassung statt Echtzeit-Alerts. Eskalations-Level: Info → Warning → Urgent.

---

## 4. Konsolidierte Empfehlungen

### 4.1 Einheitlicher Tech-Stack (Final Decision)

| Kategorie | Technologie | Version | Begruendung |
|-----------|-------------|---------|-------------|
| **Framework** | Next.js (App Router) | ^15.x | Dim11 + Dim10 Konsolidierung |
| **Sprache** | TypeScript | ^5.7.x | Strict Mode Pflicht |
| **Runtime** | Node.js | ^22.x | LTS, native Test-Runner |
| **Styling** | Tailwind CSS | ^4.x | Dim10 (juenger) vorziehen |
| **UI-Komponenten** | shadcn/ui + Radix UI | latest | Kopierbar, anpassbar |
| **Icons** | Lucide React | ^0.x | Dim10/11 Konsens |
| **Datenbank** | PostgreSQL 16+ | via Supabase | Dim11: DSGVO + RLS + Realtime |
| **Auth** | Supabase Auth | ^2.x | Integriert, DSGVO, deutsche Server |
| **API (intern)** | tRPC | ^11.x | Type-Safety, Batching |
| **API (extern)** | REST (OpenAPI) | — | Webhooks, Integrationen |
| **State Management** | Zustand + TanStack Query | ^5.x | Dim11 + Dim10 Konsens |
| **Forms** | React Hook Form + Zod | ^7.x / ^3.x | Dim10/11 Konsens |
| **Charts** | Recharts | ^2.x | Dim10 |
| **Animations** | Framer Motion | ^11.x | Dim10 |
| **Dashboard Grid** | react-grid-layout | ^1.x | Dim10 |
| **Kalender** | @fullcalendar/* | ^6.x | Dim09 |
| **DnD** | @dnd-kit | ^6.x | Dim10/08 Konsens |
| **Task Queue** | BullMQ + Redis | ^5.x | Dim11 |
| **File Storage** | Supabase Storage | — | DSGVO, integriert |
| **Hosting** | Hetzner Cloud + Coolify | — | Dim11/12: Datensouveraenitaet |
| **Container** | Docker + Docker Compose | — | Dim11 |
| **CI/CD** | GitHub Actions | — | Kompromiss (nicht DSGVO-optimal) |
| **Monitoring** | Uptime Kuma + Grafana | — | Self-hosted Alternative zu Sentry |
| **Logging** | Grafana Loki + Promtail | — | CloudNative, Self-hosted |
| **Reverse Proxy** | Traefik 3+ | — | Dim11 |

**Ausgenommen/Warnung:** Sentry nur als **optionales** Monitoring-Addon (nicht Default). GitHub Actions ist akzeptabel fuer CI/CD (nur Build-Artifakte, keine Produktionsdaten).

---

### 4.2 Datenbank-Schema Konsolidierung

#### Kerntabellen (alle Module)

```
organizations          (Multi-Tenancy Root)
users                  (Auth + Profil, FK zu auth.users)
contacts               (ZENTRAL: Kuenstler, Presse, Veranstalter — mit type/tags)
venues                 (Spielorte, erweitert mit Dim09-Facility-Flags als JSONB)
events                 (Master-Event-Tabelle, Status aus Dim11)
venue_bookings         (Spielort-Belegung, Konfliktpruefung — Dim09)
templates              (ZENTRAL: Newsletter, Presse, Programmheft — mit template_type)
notifications          (ZENTRAL: Alle Benachrichtigungen — mit source + aggregation)
attachments            (ZENTRAL: Alle Datei-Anhaenge — polymorph)
consents               (DSGVO-Einwilligungen — Dim12)
audit_log              (Tamper-proof Audit-Trail — Dim12)
gema_reports           (GEMA-Meldungen — Dim12)
ai_registry            (EU AI Act Verzeichnis — Dim12)
```

#### Modul-spezifische Tabellen

```
# Dim03 Newsletter
newsletter_campaigns, newsletter_recipients, newsletter_segments

# Dim04 Presse
press_releases, press_distributions, press_clippings

# Dim05 Social Media
social_accounts, social_posts, social_analytics

# Dim06 Ticketing
ticketing_providers, ticket_imports, guest_lists

# Dim07 Finanzen
budgets, budget_items, transactions, artist_settlements

# Dim08 Programmheft
programmheft_configs, programmheft_layouts

# Dim09 Kalender
calendar_syncs, external_calendar_events, ical_feeds

# Dim10 Dashboard
user_dashboard_layouts, notification_preferences, search_index
```

**Wichtig:** Keine `press_contacts` oder `venue_contacts`-Tabellen mehr — alles ueber zentrale `contacts` + `contact_links`.

---

### 4.3 Rollen & Berechtigungen (konsolidiert)

| Rolle | Beschreibung | Module-Zugriff |
|-------|-------------|---------------|
| **owner** | Voller Zugriff, Abrechnung, Team-Verwaltung | Alle |
| **admin** | Alle Operationen ausser Owner-spezifische | Alle ausser Billing-Settings |
| **manager** | Events, Kuenstler, Finanzen (read), GEMA | Dim01/02/07/08/09 read/write, Dim12 read |
| **member** | Events (CRUD eigene), Kuenstler (read) | Dim01/02/09 read/write (eigene), restlich read |
| **viewer** | Nur Lesen | Alle read-only |

**Dim12 "organizer"** → wird zu **"manager"** (Synonym). **Dim12 "api"** → wird zu separaten API-Key-Scopes, nicht zu User-Rolle.

---

### 4.4 Kritische Erfolgsfaktoren

| # | Erfolgsfaktor | Risiko bei Missachtung |
|---|--------------|----------------------|
| 1 | **Multi-Venue-Kalender funktioniert in P0** — ohne dies ist die App nicht besser als bestehende Tools | Nicht-Adoption |
| 2 | **Dashboard laedt in <2s** — Veranstalter arbeiten nebenberuflich | Frustration, Abbruch |
| 3 | **Finanz-Abrechnung ist 100% korrekt** — rechtliche Konsequenzen bei Fehlern | Abmahnungen, Vertrauensverlust |
| 4 | **GEMA-Workflow ist lueckenlos** — 7-Tage-Deadline nach jedem Event | GEMA-Strafen |
| 5 | **DSGVO-Self-Hosting ist glaubwuerdig** — Primaerdaten bleiben in DE | Datenschutzskandal |
| 6 | **KI-Features sind compliant (EU AI Act)** — ab August 2026 Pflicht | Regulatorische Sanktionen |
| 7 | **Offline-Sync funktioniert zuverlaessig** — Veranstalter sind unterwegs | Datenverlust, Inkonsistenzen |
| 8 | **Ticketing-Import ist robust** — CSV-Import als Fallback fuer jeden Anbieter | Support-Aufwand, Datenluecken |

---

## 5. Priorisierte Roadmap

### Phase 1: Foundation (Woche 1-8) — "Das Skelett"

**Ziel:** Laufende App mit Auth, Multi-Venue-Kalender, Event-Management, Dashboard

| # | Feature | Modul | Prio | Aufwand |
|---|---------|-------|------|---------|
| 1.1 | Projekt-Setup, CI/CD, Deployment-Pipeline | Dim11 | P0 | 3 Tage |
| 1.2 | Auth (Login, Registrierung, Rollen) | Dim11/12 | P0 | 5 Tage |
| 1.3 | Datenbank-Schema (Kern-Tabellen) | Dim11 | P0 | 5 Tage |
| 1.4 | DSGVO-Grundlagen (Consent, Cookie-Banner, Impressum) | Dim12 | P0 | 3 Tage |
| 1.5 | Dashboard-Layout (Widgets, Drag-and-Drop, Dark Mode) | Dim10 | P0 | 5 Tage |
| 1.6 | **Multi-Venue-Kalender** (Spielorte, Verfuegbarkeit, Konfliktpruefung) | Dim09 | P0 | 8 Tage |
| 1.7 | **Event-Management** (CRUD, Status-Workflow, Kuenstler-Zuordnung) | Dim01 | P0 | 8 Tage |
| 1.8 | Kuenstler & Kontakte (CRUD, Tags, Suche) | Dim02 | P0 | 5 Tage |
| 1.9 | Audit-Log (Basis) | Dim12 | P1 | 3 Tage |
| 1.10 | Globale Suche | Dim10 | P1 | 3 Tage |

**Phase 1 Deliverable:** Funktionierende App mit Event-Planung, Multi-Venue-Kalender, Kuenstler-Verwaltung, DSGVO-Grundlagen.

**Team:** 2 Entwickler (Full-Stack)

---

### Phase 2: Operations (Woche 9-16) — "Der Alltag"

**Ziel:** Veranstalter kann den kompletten Event-Lifecycle abdecken

| # | Feature | Modul | Prio | Aufwand |
|---|---------|-------|------|---------|
| 2.1 | Gaestelisten & Check-In (Manuell + QR-Code) | Dim06 | P0 | 5 Tage |
| 2.2 | **Finanzen: Budget & Kosten** (Budgetplanung, Einnahmen/Ausgaben) | Dim07 | P0 | 6 Tage |
| 2.3 | **Finanzen: Kuenstler-Abrechnung** (automatisch aus Event-Daten) | Dim07 | P0 | 5 Tage |
| 2.4 | Newsletter (Kampagnen, Templates, Basis-Versand) | Dim03 | P0 | 6 Tage |
| 2.5 | Presse & Oeffentlichkeitsarbeit (Kontakte, Verteiler, Mitteilungen) | Dim04 | P0 | 5 Tage |
| 2.6 | Social Media (Account-Verknuepfung, Post-Planung) | Dim05 | P1 | 5 Tage |
| 2.7 | GEMA-Workflow (Setliste, Meldeformular, Erinnerung) | Dim12 | P0 | 5 Tage |
| 2.8 | Kalender-Sync (Google/Outlook iCal-Import) | Dim09 | P1 | 4 Tage |
| 2.9 | Ticketing-Import (CSV-Import + 1 API: z.B. Eventbrite) | Dim06 | P1 | 5 Tage |
| 2.10 | Notification-System (Smart Aggregation) | Dim10 | P1 | 3 Tage |

**Phase 2 Deliverable:** Veranstalter kann Events planen, finanzieren, bewerben und abrechnen.

**Team:** 2-3 Entwickler (Full-Stack)

---

### Phase 3: Growth (Woche 17-24) — "Die Professionalisierung"

**Ziel:** Wettbewerbsdifferenzierung und Effizienz-Steigerung

| # | Feature | Modul | Prio | Aufwand |
|---|---------|-------|------|---------|
| 3.1 | **Programmheft-Generator** (PDF, Layouts, Werbebanner) | Dim08 | P1 | 8 Tage |
| 3.2 | Ticketing-Integrationen (2-3 weitere APIs: Reservix, Weezevent) | Dim06 | P1 | 6 Tage |
| 3.3 | Kalender-Sync (Two-Way mit Google/Outlook) | Dim09 | P1 | 5 Tage |
| 3.4 | Newsletter: Automation (Trigger-basiert, Segmente) | Dim03 | P1 | 4 Tage |
| 3.5 | Social Media: KI-Textgenerierung, Analytics-Dashboard | Dim05 | P2 | 5 Tage |
| 3.6 | Erweiterte Finanz-Reports (Export, Steuer-Vorbereitung) | Dim07 | P1 | 4 Tage |
| 3.7 | API-Keys & Webhooks fuer externe Integrationen | Dim11 | P1 | 3 Tage |
| 3.8 | KI-Widgets (NLP-Querying, Event-Prognosen) | Dim10 | P2 | 5 Tage |
| 3.9 | EU AI Act Compliance (AI Registry, Einwilligung) | Dim12 | P1 | 3 Tage |
| 3.10 | Mobile-App (PWA: Offline-Sync, Check-In, Schnellerfassung) | Dim11 | P2 | 8 Tage |

**Phase 3 Deliverable:** Professionelles Tool mit KI-Unterstuetzung, Multi-Ticketing, Programmheft, Mobile.

**Team:** 3 Entwickler (Full-Stack)

---

### Phase 4: Scale (Woche 25-32) — "Das Oekosystem"

**Ziel:** Plattform-Effekte, Partner-Integrationen, Enterprise-Features

| # | Feature | Modul | Prio | Aufwand |
|---|---------|-------|------|---------|
| 4.1 | Ticketing: Alle verbleibenden Anbieter (Eventim, Kulturkarten, etc.) | Dim06 | P2 | 8 Tage |
| 4.2 | Erweiterte Kuenstler-Suche (KI-gestuetzt, Portfolio-Analyse) | Dim02 | P2 | 5 Tage |
| 4.3 | Presse: Medienbeobachtung, Clipping-Service-Integration | Dim04 | P2 | 4 Tage |
| 4.4 | Multi-Organisation-Support (Veranstalter-Netzwerke) | Dim11 | P2 | 5 Tage |
| 4.5 | Erweiterte Analytics (Vergleiche, Trends, Benchmarks) | Dim07/10 | P2 | 4 Tage |
| 4.6 | Marketplace fuer Kuenstler (Entdeckung, Buchung) | Dim02 | P3 | 10 Tage |
| 4.7 | Weitere Ticketing-Anbieter (on demand) | Dim06 | P3 | 5 Tage |
| 4.8 | Performance-Optimierung (Caching, DB-Optimierung) | Dim11 | P2 | 5 Tage |

**Phase 4 Deliverable:** Skalierbare Plattform mit Partner-Oekosystem.

**Team:** 3-4 Entwickler (Full-Stack)

---

### Zusammenfassung Roadmap

| Phase | Zeitraum | Fokus | Kern-Features | Team |
|-------|----------|-------|-------------|------|
| **Phase 1** | Woche 1-8 | Foundation | Multi-Venue-Kalender, Events, Kuenstler, DSGVO-Basis | 2 Devs |
| **Phase 2** | Woche 9-16 | Operations | Finanzen, Newsletter, Presse, GEMA, Gaestelisten | 2-3 Devs |
| **Phase 3** | Woche 17-24 | Growth | Programmheft, KI, Mobile, Multi-Ticketing | 3 Devs |
| **Phase 4** | Woche 25-32 | Scale | Alle Ticketing APIs, Marketplace, Analytics | 3-4 Devs |

**Geschaetzte Time-to-Market:** 8 Wochen bis erste Beta (Phase 1), 16 Wochen bis produktionsreif (Phase 2).

---

## 6. Risiko-Heatmap

| Risiko | Eintrittswahrscheinlichkeit | Impact | Mitigation |
|--------|---------------------------|--------|------------|
| Ticketing-API bricht durch Anbieter-Update | **Hoch** | **Hoch** | CSV-Import als Fallback, Plugin-Architektur |
| DSGVO-Self-Hosting-Verpflichtung nicht erreichbar | **Mittel** | **Kritisch** | Transparente Datenfluss-Dokumentation, Opt-out bei externen APIs |
| Performance-Probleme bei >10 Spielorten | **Mittel** | **Hoch** | Phase 1 Performance-Budget, DB-Index-Strategie |
| EU AI Act Compliance wird unterschaetzt | **Mittel** | **Hoch** | AI Registry in Phase 2, KI-Einwilligung ab Launch |
| Scope-Creep durch Programmheft (Dim08) | **Hoch** | **Mittel** | Als separates Modul in Phase 3, nicht frueher |
| Team-Groesse reicht nicht fuer Roadmap | **Mittel** | **Hoch** | MVP-Fokus, Features verschieben statt Team vergroessern |
| Finanz-Modul hat Bugs bei Abrechnung | **Niedrig** | **Kritisch** | >90% Testabdeckung, kein Finanz-Feature ohne QA |

---

*Dokument erstellt: Cross-Verification & Insights Analyse*
*Analyse-Basis: 12 Dimensions-Spezifikationen (Dim01-Dim12)*
*Status: v1.0*

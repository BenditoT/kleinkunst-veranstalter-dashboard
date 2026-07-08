# CODING PROMPT: Kleinkunst-Veranstalter Dashboard App

> **Version:** 1.0
> **Datum:** Juli 2026
> **Autor:** Produktarchitektur & Engineering
> **Status:** Produktionsreif
> **Umfang:** ~8000+ Worte | 10 Sprints | 20 Wochen

---

## INSTRUCTIONS FUER DIE KI-CODING-AGENT

Du bist eine hochqualifizierte Full-Stack-Entwicklungs-Agent mit Spezialisierung auf Next.js, TypeScript und PostgreSQL. Deine Aufgabe ist die vollstaendige Implementierung der Kleinkunst-Veranstalter Dashboard App nach den Spezifikationen in diesem Prompt.

**Kernprinzipien:**
1. **TypeScript Strict Mode** durchgaengig - keine `any`-Types ohne Begruendung
2. **Server Components by default** - Client Components nur bei Interaktivitaetsbedarf
3. **tRPC fuer interne APIs** - REST nur fuer externe Integrationen
4. **RLS auf allen Tabellen** - Multi-Tenancy via organization_id
5. **Soft Deletes** - `deleted_at` statt harter Loeschung
6. **Deutsch als UI-Sprache** - Alle Labels, Messages, E-Mails auf Deutsch

---

## 1. PROJEKTUEBERBLICK

### 1.1 Was wird gebaut?

Eine universelle Dashboard-App fuer Kleinkunst-Veranstalter in Deutschland, die mehrere Spielorte verwaltet. Die App ersetzt Excel, Google Calendar und Papier durch ein zentrales digitales System fuer die gesamte Veranstaltungsplanung, -durchfuehrung und -nachbereitung.

### 1.2 Fuer wen?

**Primaere Zielgruppe:** Kleinkunstveranstalter mit 3-8 Spielorten in Deutschland
- Kultur-Clara (38, Leipzig): 4 Spielorte, ~120 Events/Jahr, Budget 200-300 EUR/Monat
- Theater-Torsten (52, Augsburg): 3 Saele + 2 Kooperationsorte, ~200 Events/Jahr
- Agentur-Andreas (44, Koeln): 8-12 wechselnde Spielorte, ~80 Events/Jahr

**Sekundaere Zielgruppen:** Kulturzentren, Festivals, kommunale Kulturverwaltungen

### 1.3 Kern-Ziel

**"Verwalte mehrere Spielorte mit weniger Aufwand"** - Alle Veranstaltungsdaten in Echtzeit auf einem Bildschirm: Auslastung pro Spielort, Finanzkennzahlen, Kuenstler-Vertraege, Ticketing-Zahlen, Aufgaben und Deadlines.

### 1.4 Einzigartige Selling Points (USPs)

- **Multi-Venue-Hub:** Der einzige deutsche Anbieter fuer Veranstalter mit MEHREREN Spielorten
- **GEMA-Automatisierung:** Automatisierte GEMA-Meldungen, Musikfolgen-Tracking, Abrechnungs-Exports
- **Programmheft-Generator:** Automatische PDF-Erstellung aus Veranstaltungsdaten
- **Made in Germany:** DSGVO-konform, deutsche Server, GEMA-Integration, Foerdermittel-Reporting
- **Preislich im Kleinkunst-Budget:** Max. 299 EUR/Monat fuer Pro-Tier

---

## 2. TECH-STACK (DEFINITIV)

### 2.1 Gesamtuebersicht

| Schicht | Technologie | Version | Begruendung |
|---------|-------------|---------|-------------|
| **Framework** | Next.js 14+ (App Router) | ^14.2 | RSC, Streaming, File-based Routing |
| **Sprache** | TypeScript | ^5.3 | End-to-end Type-Safety, strict mode |
| **Styling** | Tailwind CSS | ^3.4 | Utility-First, Dark Mode, Purged CSS |
| **UI-Komponenten** | shadcn/ui + Radix UI | latest | Kopierbar, anpassbar, ARIA-accessible |
| **Datenbank** | PostgreSQL 15+ (via Supabase) | 15 | JSONB, Full-Text Search, RLS |
| **Auth** | Supabase Auth | latest | DSGVO-konform, OAuth, Magic Links |
| **API (intern)** | tRPC 11+ | ^11.0 | Type-Safety, Batching, Zod-Integration |
| **API (extern)** | REST (OpenAPI) | - | Externe Integrationen |
| **State Management** | Zustand + TanStack Query | ^5.0 | Client-State + Server-State |
| **Task Queue** | BullMQ + Redis | ^5.0 | Delayed Jobs,Retries,Dashboard |
| **File Storage** | Supabase Storage | latest | DSGVO-konforme DE-Server |
| **Charts** | Recharts | ^2.12 | React-native, responsive |
| **PDF-Generierung** | @react-pdf/renderer | ^3.4 | GEMA-Formulare, Programmhefte |
| **Kalender** | react-big-calendar | ^1.13 | Multi-View, Drag-and-Drop |
| **DnD** | @dnd-kit/core | ^6.1 | Dashboard-Widgets, Sortierung |
| **Rich Text** | @tiptap/react | ^2.5 | Headless, Markdown-Support |
| **Formulare** | react-hook-form + zod | ^7.52 + ^3.23 | Performant, schema-basiert |
| **Hosting** | Hetzner Cloud + Coolify | - | DSGVO, Deutschland, ~30 EUR/Mo |
| **Container** | Docker + Docker Compose | - | Monolith-Deployment |
| **CI/CD** | GitHub Actions | - | Auto-Deploy bei Push |
| **Monitoring** | Sentry + Uptime Kuma | - | Fehler-Tracking + Uptime |
| **Reverse Proxy** | Traefik 3+ | - | Auto-SSL, Docker-Integration |

### 2.2 Zusaetzliche Libraries

```json
{
  "dependencies": {
    "date-fns": "^3.6",
    "papaparse": "^5.4",
    "handlebars": "^4.7",
    "qrcode.react": "^3.1",
    "react-to-print": "^2.15",
    "file-saver": "^2.0",
    "ics": "^3.7",
    "crypto-js": "^4.2",
    "uuid": "^10.0",
    "lodash": "^4.17",
    "@xyflow/react": "^12.0",
    "@dnd-kit/sortable": "^8.0",
    "@dnd-kit/utilities": "^3.2",
    "@tanstack/react-table": "^8.19"
  }
}
```

---

## 3. SPRINT-PROTOKOLL

### Sprint 1: Setup & Auth (Woche 1-2)

#### Sprint-Ziel
Projekt-Setup, CI/CD-Pipeline, Datenbank-Schema, Authentifizierung vollstaendig implementiert.

#### User Stories

**US-1.1: Projekt-Setup**
> Als Entwickler moechte ich ein vollstaendiges Next.js-Projekt mit TypeScript, Tailwind und allen Core-Dependencies haben.

**Akzeptanzkriterien:**
- `npx create-next-app` mit TypeScript, Tailwind, App Router
- shadcn/ui initialisiert mit allen Base-Komponenten
- Ordnerstruktur nach App Router Pattern
- ESLint + Prettier konfiguriert
- Husky pre-commit hooks
- README mit Setup-Anleitung

**US-1.2: Datenbank-Setup mit Supabase**
> Als Entwickler moechte ich eine PostgreSQL-Datenbank mit allen Kern-Tabellen und RLS-Policies haben.

**Akzeptanzkriterien:**
- Supabase Projekt erstellt (lokal fuer Dev, Cloud fuer Staging)
- Alle Tabellen aus Section 4 (Datenbankschema) angelegt
- RLS aktiviert fuer ALLE Tabellen
-organization_id als Tenant-Key konfiguriert
- Migrationsskripte in `supabase/migrations/`
- Seed-Daten fuer Entwicklung

**US-1.3: Authentifizierung (Supabase Auth)**
> Als Benutzer moechte ich mich mit E-Mail/Passwort, OAuth (Google, GitHub) oder Magic Link anmelden koennen.

**Akzeptanzkriterien:**
- Login-Seite (`/login`) mit E-Mail/Passwort-Formular
- Registrierung (`/register`) mit Organisationsname
- Passwort-Reset-Flow (`/forgot-password`)
- OAuth-Login mit Google und GitHub
- Magic Link (passwordless) Login
- Session-Management via Supabase SSR
- Protected Routes Middleware
- Rollen-System: owner, admin, manager, member, viewer

**US-1.4: Dashboard-Layout**
> Als Benutzer moechte ich ein konsistentes Layout mit Sidebar, Header und Content-Bereich haben.

**Akzeptanzkriterien:**
- Sidebar mit Navigation zu allen Modulen
- Collapsible Sidebar mit Icon-Only-Modus
- Topbar mit Suche, Notifications, User-Menu, Theme-Toggle
- Breadcrumbs-Navigation
- Dark/Light Mode Toggle (sofort, ohne Reload)
- Responsive: 12-Spalten Desktop, 8 Tablet, 4 Mobile

#### Technische Tasks
- [ ] Docker Compose fuer lokale Entwicklung (Next.js + PostgreSQL + Redis)
- [ ] Environment Variablen (.env.example)
- [ ] Supabase Client-Konfiguration (Server + Client)
- [ ] tRPC-Setup mit Context-Builder
- [ ] Zustand-Store fuer globale UI-State
- [ ] TanStack Query-Provider konfigurieren
- [ ] ThemeProvider mit next-themes

#### Deliverables
- Lauffaehige Basis-App auf localhost:3000
- Login/Register funktioniert
- Dashboard-Layout mit Navigation
- Dark Mode umschaltbar

#### Definition of Done
- Alle Tests gruen
- Lighthouse Score > 90 (Performance, Accessibility)
- Keine TypeScript-Fehler (strict mode)
- RLS-Policies aktiv und getestet

---

### Sprint 2: Datenbank & Kern-CRUD (Woche 3-4)

#### Sprint-Ziel
Vollstaendige CRUD-Operationen fuer Spielorte, Kuenstler, Veranstaltungen und Kontakte.

#### User Stories

**US-2.1: Spielort-Verwaltung (Venues)**
> Als Veranstalter moechte ich Spielorte mit Name, Adresse, Kapazitaet, Technik und Kontakten anlegen und verwalten.

**Akzeptanzkriterien:**
- CRUD fuer Spielorte: Name, Adresse, PLZ, Stadt, Kapazitaet, Kontaktinfos
- Spielort-Typ: theater, club, cafe, hall, outdoor, church, other
- Technik-Felder (JSONB): Beamer, Mikro, Lichtanlage, Piano, PA, Bar
- Farbcodierung pro Spielort fuer Kalender
- Soft-Delete (Daten bleiben erhalten)
- Geokoordinaten aus Adresse berechnen
- Upload von Spielort-Fotos

**US-2.2: Kuenstler-Verwaltung (Artists)**
> Als Veranstalter moechte ich Kuenstler mit Name, Genre, Kontakt, GEMA-Nummer und Tech-Rider verwalten.

**Akzeptanzkriterien:**
- CRUD fuer Kuenstler: Kuenstlername, Vorname, Nachname, E-Mail, Telefon
- Genre als Array (Jazz, Theater, Kabarett, etc.)
- GEMA-Mitgliedsnummer
- Tech-Rider (Textfeld)
- Bewertung 1-5 Sterne
- Favoriten-Markierung
- Upload von Pressefotos
- CSV-Import fuer Massenimport

**US-2.3: Veranstaltungsmanagement (Events)**
> Als Veranstalter moechte ich Veranstaltungen mit Titel, Datum, Spielort, Kuenstler und Status anlegen.

**Akzeptanzkriterien:**
- CRUD fuer Events: Titel, Untertitel, Beschreibung, Datum, Uhrzeit
- Status-Workflow: Entwurf -> Geplant -> Veroeffentlicht -> Abgeschlossen -> Abgesagt
- Zuordnung zu Spielort und Kuenstler (1:n)
- Ticketpreis, Kapazitaet, Einlasszeit
- Oeffentliche/Private Events
- Slug-Generierung fuer URLs
- Event-Notizen (intern und oeffentlich)
- Event-Checkliste (Aufgaben pro Event)

**US-2.4: Kontaktverwaltung**
> Als Veranstalter moechte ich alle Kontakte (Techniker, Vertraege, Presse) zentral verwalten.

**Akzeptanzkriterien:**
- CRUD fuer Kontakte: Name, E-Mail, Telefon, Typ
- Kontakt-Typen: Kuenstler, Technik, Presse, Venue, Sonstige
- Tags fuer Kategorisierung
- CSV-Import/Export
- Duplikat-Erkennung

#### Technische Tasks
- [ ] tRPC Router fuer venues, artists, events, contacts
- [ ] Zod-Schemas fuer alle Input-Validierungen
- [ ] Server Actions fuer Form-Submissions
- [ ] Supabase Storage Integration fuer Bild-Uploads
- [ ] DataTable-Komponente mit Sortierung, Filter, Pagination
- [ ] Formular-Komponenten mit react-hook-form + zod
- [ ] Modal/Dialog-Komponenten fuer Create/Edit

#### Deliverables
- Vollstaendige CRUD fuer alle 4 Entitaeten
- Bild-Upload funktioniert
- CSV-Import/Export
- Validierung und Fehlermeldungen auf Deutsch

---

### Sprint 3: Dashboard & Kalender (Woche 5-6)

#### Sprint-Ziel
Interaktives Dashboard mit Widgets und Multi-Venue-Kalender.

#### User Stories

**US-3.1: Dashboard-Home mit Widgets**
> Als Veranstalter moechte ich auf dem Dashboard eine Uebersicht meiner naechsten Events, Finanzen und Aufgaben sehen.

**Akzeptanzkriterien:**
- Widget: Naechste Events (Top 5, sortiert nach Datum)
- Widget: Finanz-Ueberblick (Einnahmen/Ausgaben aktueller Monat)
- Widget: Offene Aufgaben (Checkliste-Items)
- Widget: Newsletter-Stats (letzte Kampagne)
- Widget: Mini-Kalender
- Drag-and-Drop Anordnung der Widgets
- Widget-Groesse anpassbar
- Layout wird serverseitig gespeichert

**US-3.2: Multi-Venue-Kalender**
> Als Veranstalter moechte ich einen farbcodierten Kalender sehen, der alle Spielorte gleichzeitig anzeigt.

**Akzeptanzkriterien:**
- Wochen-, Monats- und Agenda-Ansicht
- Jeder Spielort hat eine eindeutige Farbe
- Filter nach Spielort, Event-Typ, Status
- Drag-and-Drop: Events verschieben
- Klick auf Event oeffnet Detail-Seite
- Heute-Button
- Konflikt-Erkennung bei Doppelbuchung
- Pufferzeit konfigurierbar (Auf-/Abbau)

**US-3.3: Event-Detail-Seite**
> Als Veranstalter moechte ich alle Details einer Veranstaltung auf einer Seite sehen.

**Akzeptanzkriterien:**
- Event-Info: Titel, Datum, Ort, Kuenstler, Status
- Finanz-Tab: Budget, Gage, Einnahmen
- Gaesteliste-Tab: Tickets, Reservierungen
- Checkliste-Tab: Aufgaben mit Status
- Notizen-Tab: Interne Notizen
- Timeline der Aenderungen

**US-3.4: Globale Suche**
> Als Benutzer moechte ich Events, Kuenstler, Orte und Kontakte ueber eine Suchleiste durchsuchen.

**Akzeptanzkriterien:**
- Cmd/Ctrl+K Shortcut
- Echtzeit-Suche mit Debounce (300ms)
- Ergebnisse gruppiert nach Entitaetstyp
- Keyboard-Navigation
- Letzte 10 Suchen als Historie

#### Technische Tasks
- [ ] react-big-calendar mit Custom-Styling
- [ ] react-grid-layout fuer Dashboard-Widgets
- [ ] PostgreSQL Full-Text Search (tsvector)
- [ ] Command-Palette Komponente (Cmd+K)
- [ ] Realtime-Subscriptions fuer Live-Updates

#### Deliverables
- Dashboard mit konfigurierbaren Widgets
- Kalender mit allen Ansichten
- Event-Detail-Seite mit Tabs
- Globale Suche funktionsfaehig

---

### Sprint 4: Newsletter-System (Woche 7-8)

#### Sprint-Ziel
Vollstaendiges Newsletter-System mit Double-Opt-In, Editor, Versand und Tracking.

#### User Stories

**US-4.1: Double-Opt-In Anmeldung**
> Als potenzieller Abonnent moechte ich mich DSGVO-konform fuer den Newsletter anmelden koennen.

**Akzeptanzkriterien:**
- Anmeldeformular (E-Mail, optional: Vorname, bevorzugter Spielort)
- Bestaetigungs-E-Mail mit Token-Link
- Nur nach Klick: Status "confirmed"
- Token 72h gueltig, danach automatisch Loeschen
- Einwilligungs-Nachweis mit Zeitstempel, IP, Quelle
- One-Click-Unsubscribe (RFC 8058)
- Unsubscribe-Link 90 Tage gueltig

**US-4.2: Newsletter-Editor**
> Als Veranstalter moechte ich professionelle Newsletter mit einem Drag-and-Drop Editor erstellen.

**Akzeptanzkriterien:**
- Vorgefertigte Bloecke: Text, Bild, Button, Trennlinie, Event-Liste, Kuenstler-Spotlight
- Event-Block laedt automatisch aus Veranstaltungskalender
- Bild-Upload (max. 2MB, WebP/JPG/PNG)
- Corporate Design (Farben aus Organisation)
- Mobile-Responsive-Vorschau
- Undo/Redo (50 Aktionen)
- Autosave alle 30 Sekunden

**US-4.3: Newsletter-Versand**
> Als Veranstalter moechte ich Newsletter sofort oder zeitversetzt versenden.

**Akzeptanzkriterien:**
- Sofortversand
- Zeitplanung (geplanter Versand)
- Segmentierung nach Tags, Spielort, Engagement
- A/B-Test fuer Betreffzeilen (2 Varianten)
- Bounce-Handling (Hard/Soft)
- SMTP-Provider: Brevo, rapidmail, SendGrid

**US-4.4: Newsletter-Analytics**
> Als Veranstalter moechte ich Statistiken zu meinen Newsletter-Kampagnen sehen.

**Akzeptanzkriterien:**
- Gesendet, Zugestellt, Oeffnungen, Klicks, Bounces, Abmeldungen
- CTR als Primaermetrik
- Zeitlicher Verlauf (24h/7-Tage Chart)
- Vergleich mit vorheriger Kampagne
- CSV-Export der Rohdaten

#### Technische Tasks
- [ ] Newsletter-Tabellen (subscribers, campaigns, templates, tracking)
- [ ] SMTP-Provider-Adapter (Brevo, rapidmail, SendGrid)
- [ ] BullMQ Queue fuer Newsletter-Versand
- [ ] Email-Editor Komponente mit Block-System
- [ ] Tracking-Pixel fuer Oeffnungsraten
- [ ] Webhook-Handler fuer Bounces/Delivery

#### Deliverables
- Double-Opt-In funktioniert
- Newsletter-Editor mit Drag-and-Drop
- Versand mit Tracking
- Analytics Dashboard

---

### Sprint 5: Social Media (Woche 9-10)

#### Sprint-Ziel
Social Media Hub mit Account-Verbindung, Cross-Posting und Content-Planung.

#### User Stories

**US-5.1: Social Media Account-Verbindung**
> Als Veranstalter moechte ich meine Social-Media-Accounts via OAuth verbinden.

**Akzeptanzkriterien:**
- Facebook, Instagram, Twitter/X, TikTok, LinkedIn
- OAuth-Flow fuer jede Plattform
- Token-Refresh automatisch
- Accounts koennen getrennt werden
- Verbindungsstatus-Anzeige

**US-5.2: Cross-Posting**
> Als Veranstalter moechte ich einen Post erstellen und auf mehrere Plattformen gleichzeitig veroeffentlichen.

**Akzeptanzkriterien:**
- Master-Post Editor
- Plattform-spezifische Vorschau
- Zeichenlimit-Pruefung pro Plattform
- Automatische Bildformat-Anpassung
- Hashtag-Management

**US-5.3: Content-Kalender**
> Als Veranstalter moechte ich Posts planen und in einem Kalender verwalten.

**Akzeptanzkriterien:**
- Kalender-View mit farbcodierten Posts
- Drag-and-Drop Verschieben
- Wiederkehrende Posts
- Benachrichtigung bei erfolgreicher Veroeffentlichung

**US-5.4: Media Library**
> Als Veranstalter moechte ich Bilder und Videos zentral verwalten.

**Akzeptanzkriterien:**
- Upload (JPG, PNG, GIF, WebP, MP4, MOV)
- Automatische Format-Konvertierung pro Plattform
- Tags und Alben
- Volltextsuche

#### Technische Tasks
- [ ] Social Media Account-Tabelle mit OAuth-Tokens
- [ ] Plattform-Adapter (Meta Graph API, X API, etc.)
- [ ] Media-Processing fuer Format-Konvertierung
- [ ] Content-Kalender Komponente
- [ ] Post-Scheduling mit BullMQ

#### Deliverables
- Account-Verbindung fuer alle Plattformen
- Cross-Posting mit Vorschau
- Content-Kalender
- Media Library

---

### Sprint 6: KI-Integration (Woche 11-12)

#### Sprint-Ziel
KI-Assistenzsystem fuer Textgenerierung, Bildgenerierung und Uebersetzung.

#### User Stories

**US-6.1: Event-Beschreibung generieren**
> Als Veranstalter moechte ich aus Stichworten eine ueberzeugende Event-Beschreibung generieren.

**Akzeptanzkriterien:**
- Eingabe: Kuenstlername, Genre, Location, Datum
- Tonauswahl: professionell, locker, poetisch, ueberzeugend
- Maximale Laenge konfigurierbar
- Rich-Text-Editor fuer Nachbearbeitung
- Ein-Klick-Uebernahme ins Event

**US-6.2: Social-Media-Posts generieren**
> Als Veranstalter moechte ich plattformspezifische Posts automatisch generieren.

**Akzeptanzkriterien:**
- Zeichenlimits pro Plattform (Twitter: 280, etc.)
- Plattformspezifische Formatierung
- Vorschau pro Plattform
- Hashtag-Vorschlaege

**US-6.3: Pressemitteilung erstellen**
> Als Veranstalter moechte ich eine DIN-5008-konforme Pressemitteilung generieren.

**Akzeptanzkriterien:**
- Struktur: Titel, Untertitel, Lead, Haupttext, Boilerplate, Kontakt
- Automatische Event-Daten-Einbettung
- PDF-Export
- Adressaten-Verwaltung

**US-6.4: Bilder fuer Flyer generieren**
> Als Veranstalter moechte ich passende Bilder fuer Flyer und Social Media generieren.

**Akzeptanzkriterien:**
- Stilauswahl: Fotorealistisch, Illustration, Aquarell, Comic
- Seitenverhaeltnis: 1:1, 9:16, 3:4, 16:9
- 4 Variationen pro Prompt
- Download in hoher Aufloesung
- Kostenanzeige vor Generierung

**US-6.5: KI-Konfiguration**
> Als Veranstalter moechte ich waehlen zwischen Cloud-KI und lokaler KI.

**Akzeptanzkriterien:**
- Auswahl: OpenAI (Cloud) / Ollama (Lokal) / Hybrid
- DSGVO-Einwilligungs-Dialog
- API-Key sicher im Backend speichern (AES-256)
- Verbindungstest fuer Ollama
- Kosten-Tracking

#### Technische Tasks
- [ ] KI-Provider-Adapter (OpenAI, Ollama)
- [ ] Prompt-Template-System mit Handlebars
- [ ] SSE-Streaming fuer Echtzeit-Textgenerierung
- [ ] Bildgenerierung via DALL-E 3
- [ ] Kosten-Tracking-Algorithmus
- [ ] AIAssistPanel (Slide-out Komponente)

#### Deliverables
- Textgenerierung fuer Events, Social Media, Presse
- Bildgenerierung fuer Flyer
- Uebersetzung in 6 Sprachen
- KI-Konfiguration mit DSGVO-Dialog

---

### Sprint 7: GEMA & Finanzen (Woche 13-14)

#### Sprint-Ziel
GEMA-Automatisierung und Finanzmanagement vollstaendig implementiert.

#### User Stories

**US-7.1: GEMA-Tarifrechner**
> Als Veranstalter moechte ich die voraussichtlichen GEMA-Gebuehren berechnen.

**Akzeptanzkriterien:**
- U-K Tarif: 5,75% der Bruttoeinnahmen bis 2.000 Besucher
- Mindestsatz 23,55 EUR beruecksichtigt
- Automatische Aktualisierung bei Aenderung
- Alternative Tarife manuell einstellbar

**US-7.2: GEMA-Meldung erstellen**
> Als Veranstalter moechte ich eine GEMA-Meldung direkt aus dem Event erstellen.

**Akzeptanzkriterien:**
- Daten aus Event automatisch uebernommen
- Setlist-Eingabe (Titel, Komponist, Dauer)
- PDF-Export im GEMA-Format
- Status-Tracking: Entwurf -> Eingereicht -> Bestaetigt
- Erinnerung an Meldefrist (7 Tage vorher)

**US-7.3: Budgetplanung**
> Als Veranstalter moechte ich fuer jedes Event ein Budget erstellen.

**Akzeptanzkriterien:**
- Einnahmen/Ausgaben-Kategorien
- Soll-/Ist-Vergleich
- Templates fuer wiederkehrende Budgets
- Break-Even-Analyse (interaktives Chart)

**US-7.4: Kassenbuch**
> Als Veranstalter moechte ich ein digitales Kassenbuch fuehren.

**Akzeptanzkriterien:**
- Bar- und Kartenzahlungen erfassen
- Kategorisierung aller Posten
- Tagesabschluss
- Abgleich mit Budget

**US-7.5: Steuer-Uebersicht**
> Als Veranstalter moechte ich die Umsatzsteuer (7% Tickets vs. 19% Merchandise) sehen.

**Akzeptanzkriterien:**
- Automatische Steuersatz-Zuordnung
- Monatliche und jaehrliche Zusammenfassung
- CSV/DATEV-Export fuer Steuerberater

#### Technische Tasks
- [ ] GEMA-Berechnungsalgorithmus
- [ ] PDF-Generator fuer GEMA-Formulare (@react-pdf)
- [ ] Budget-Tabellen mit Soll/Ist-Vergleich
- [ ] Break-Even-Chart (Recharts)
- [ ] Kassenbuch-Interface
- [ ] DATEV-konformer Export

#### Deliverables
- GEMA-Tarifrechner und Meldung
- Budgetplanung mit Break-Even-Analyse
- Digitales Kassenbuch
- Steuer-Uebersicht und Export

---

### Sprint 8: Presse & PR (Woche 15-16)

#### Sprint-Ziel
Presse & PR-Modul mit Journalisten-Datenbank, Pressemitteilungen und digitaler Pressemappe.

#### User Stories

**US-8.1: Journalisten-Datenbank**
> Als Veranstalter moechte ich Medienkontakte mit Themen und Notizen verwalten.

**Akzeptanzkriterien:**
- Name, Medium, E-Mail, Telefon, Themen (Tags)
- Freitext-Notizen mit Zeitstempel
- CSV/Excel-Import
- Duplikat-Erkennung
- Such- und Filterfunktion

**US-8.2: Pressemitteilung erstellen**
> Als Veranstalter moechte ich Pressemitteilungen mit KI-Unterstuetzung erstellen.

**Akzeptanzkriterien:**
- Uebernahme aller Event-Daten
- KI-Generierung (DIN-5008)
- Rich-Text-Editor mit Formatierung
- Embargo-Funktion
- Zeichenzaehler (optimal: 500-800 Woerter)

**US-8.3: Presse-Verteiler**
> Als Veranstalter moechte ich Pressemitteilungen selektiv an Journalisten senden.

**Akzeptanzkriterien:**
- Themen-basierte Filterung
- Versand via SMTP
- Personalisierte Anrede
- Scheduling
- Oeffnungsraten-Tracking

**US-8.4: Digitale Pressemappe**
> Als Veranstalter moechte ich eine oeffentliche Pressemappe mit Downloads teilen.

**Akzeptanzkriterien:**
- Pressemappe pro Kuenstler oder Event
- Upload von Fotos (300 DPI), Logos, Pressetexte
- Oeffentliche URL mit Passwort-Schutz
- Download-Tracking
- QR-Code-Generierung

**US-8.5: Medienbeobachtung**
> Als Veranstalter moechte ich veroeffentlichte Berichte erfassen und tracken.

**Akzeptanzkriterien:**
- Manuelles Clipping-Erfassen
- Google Alerts RSS-Integration
- Sentiment-Analyse
- Clipping-Bericht als PDF

#### Technische Tasks
- [ ] Pressekontakt-Tabelle
- [ ] Pressemitteilungs-Editor
- [ ] Verteiler-System
- [ ] Pressemappe (oeffentliche Seite)
- [ ] RSS-Feed-Parser fuer Google Alerts

#### Deliverables
- Journalisten-Datenbank
- Pressemitteilungs-Editor mit KI
- Presse-Verteiler
- Digitale Pressemappe
- Medienbeobachtung

---

### Sprint 9: Ticketing & Check-in (Woche 17-18)

#### Sprint-Ziel
Ticketing-System mit Gaestelisten, QR-Code-Check-in und Reservierungen.

#### User Stories

**US-9.1: Ticket-Typen verwalten**
> Als Veranstalter moechte ich verschiedene Ticket-Typen anlegen.

**Akzeptanzkriterien:**
- VVK, AK, ermaesigt, PWYW, Freikarten, Staff/VIP
- Individuelle Verfuegbarkeiten, Preise, Verkaufszeitraeume
- Maximale Kapazitaet pro Event und Typ
- Ermassigungsnachweis konfigurierbar

**US-9.2: Gaesteliste & Reservierungen**
> Als Veranstalter moechte ich Gaestelisten und Reservierungen verwalten.

**Akzeptanzkriterien:**
- Reservierungen manuell anlegen
- Automatische Stornierungsfrist (z.B. 2h vor Event)
- Status: offen, bestaetigt, storniert, abgelaufen
- E-Mail-Bestaetigung mit QR-Code

**US-9.3: QR-Code-Check-in**
> Als Einlass-Personal moechte ich QR-Codes scannen.

**Akzeptanzkriterien:**
- QR-Code-Scan via Mobile-Web-App
- Sofortige Validierung (gueltig/ungueltig/bereits gescannt)
- Offline-Modus moeglich
- Manuelle Eintraege
- Echtzeit-Zuschauerzaehlung

**US-9.4: Warteliste**
> Als Interessent moechte ich auf eine Warteliste fuer ausverkaufte Events.

**Akzeptanzkriterien:**
- Automatische Benachrichtigung bei Freigabe
- Konfigurierbare Benachrichtigungsanzahl
- Ticket-Kauf direkt aus Benachrichtigung

**US-9.5: Gaestelisten-Export**
> Als Veranstalter moechte ich Gaestelisten als PDF/CSV exportieren.

**Akzeptanzkriterien:**
- Konfigurierbare Spalten
- QR-Codes im Export
- Export fuer Einlasskontrolle

#### Technische Tasks
- [ ] Ticket-Typen und Ticket-Tabellen
- [ ] QR-Code-Generierung und -Validierung
- [ ] Mobile Check-in Seite
- [ ] Offline-Sync-Logik
- [ ] Gaestelisten-Export

#### Deliverables
- Ticket-Typen-Management
- Gaestelisten mit Reservierungen
- QR-Code-Check-in (Mobile)
- Warteliste
- Gaestelisten-Export

---

### Sprint 10: DSGVO, Polish, Deployment (Woche 19-20)

#### Sprint-Ziel
DSGVO-Konformitaet, Performance-Optimierung, Deployment auf Hetzner.

#### User Stories

**US-10.1: DSGVO-Compliance**
> Als Veranstalter moechte ich alle DSGVO-Anforderungen erfuellt haben.

**Akzeptanzkriterien:**
- Einwilligungs-Management mit Zeitstempel und IP
- Double-Opt-In fuer Newsletter
- Recht auf Vergessenwerden (Selbstbedienungs-Portal)
- Datenexport (JSON/CSV)
- Audit-Log (tamper-proof, append-only)
- Impressum und Datenschutzerklaerung generierbar

**US-10.2: Performance-Optimierung**
> Als Benutzer moechte ich eine schnelle App haben.

**Akzeptanzkriterien:**
- Dashboard laedt in < 2 Sekunden
- Lighthouse Score > 90
- Bilder lazy-loaded und optimiert
- Code-Splitting pro Route
- PostgreSQL-Queries optimiert (Explain Analyze)

**US-10.3: Deployment**
> Als Entwickler moechte ich die App auf Hetzner deployen.

**Akzeptanzkriterien:**
- Docker Compose fuer Produktion
- Coolify konfiguriert
- SSL-Zertifikate automatisch
- Environment Variablen gesetzt
- Backup-Strategie taeglich
- Monitoring (Sentry, Uptime Kuma)

**US-10.4: Dokumentation**
> Als Entwickler moechte ich eine vollstaendige Dokumentation haben.

**Akzeptanzkriterien:**
- API-Dokumentation (OpenAPI/Swagger)
- Setup-Anleitung im README
- Deployment-Guide
- User-Manual (deutsch)

#### Technische Tasks
- [ ] DSGVO-Tabellen (consents, deletion_requests, data_exports, audit_log)
- [ ] Self-Service-Portal fuer Loeschantraege
- [ ] Audit-Log mit kryptographischer Kette
- [ ] Docker Compose Produktion
- [ ] Traefik Reverse Proxy
- [ ] GitHub Actions CI/CD
- [ ] Performance-Optimierungen
- [ ] Dokumentation

#### Deliverables
- DSGVO-konforme App
- Deployment auf Hetzner
- Monitoring aktiv
- Vollstaendige Dokumentation

---



## 4. DATENBANKSCHEMA

### 4.1 Design-Prinzipien

1. **Multi-Tenancy:** Jede Tabelle hat `organization_id` als Tenant-Key
2. **RLS:** Row Level Security aktiviert fuer ALLE Tabellen
3. **Soft Deletes:** `deleted_at` statt harter Loeschung
4. **Audit Trail:** `created_at`, `updated_at`, `created_by` auf jeder Tabelle
5. **UUID Keys:** `gen_random_uuid()` als Primaerschluessel
6. **JSONB fuer Flexibilitaet:** Erweiterbare Felder ohne Migration

### 4.2 SQL-DDL (Vollstaendig)

```sql
-- Organisationen
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website VARCHAR(255),
  address VARCHAR(255),
  city VARCHAR(100),
  zip VARCHAR(20),
  country VARCHAR(2) DEFAULT 'DE',
  fiscal_year_start DATE DEFAULT '01-01',
  vat_id VARCHAR(50),
  tax_number VARCHAR(50),
  bank_account_iban VARCHAR(34),
  bank_account_bic VARCHAR(11),
  bank_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  plan_tier VARCHAR(20) DEFAULT 'free' CHECK (plan_tier IN ('free', 'basic', 'pro', 'enterprise')),
  plan_expires_at TIMESTAMPTZ,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Users (Erweiterung von auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  phone VARCHAR(50),
  timezone VARCHAR(50) DEFAULT 'Europe/Berlin',
  locale VARCHAR(10) DEFAULT 'de-DE',
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  theme_preference VARCHAR(10) DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system')),
  onboarding_completed BOOLEAN DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Organisation Members (Rollen)
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'booker', 'venue_operator', 'accountant', 'viewer')),
  permissions JSONB DEFAULT '{}',
  is_primary BOOLEAN DEFAULT false,
  invited_by UUID REFERENCES users(id),
  joined_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Invitations
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'member',
  invited_by UUID NOT NULL REFERENCES users(id),
  token UUID DEFAULT gen_random_uuid(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '7 days',
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Spielorte (Venues)
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100),
  description TEXT,
  address VARCHAR(255),
  address_extra VARCHAR(255),
  city VARCHAR(100),
  zip VARCHAR(20),
  country VARCHAR(2) DEFAULT 'DE',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  capacity INTEGER CHECK (capacity >= 0),
  venue_type VARCHAR(50) CHECK (venue_type IN ('theater', 'club', 'cafe', 'hall', 'outdoor', 'church', 'other')),
  website VARCHAR(255),
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  tech_specs JSONB DEFAULT '{}',
  accessibility_info TEXT,
  parking_info TEXT,
  photo_url TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(organization_id, slug)
);

-- Raeume
CREATE TABLE venue_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  capacity INTEGER CHECK (capacity >= 0),
  has_piano BOOLEAN DEFAULT false,
  has_pa BOOLEAN DEFAULT false,
  has_lighting BOOLEAN DEFAULT false,
  has_projector BOOLEAN DEFAULT false,
  dimensions VARCHAR(50),
  floor_type VARCHAR(50),
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Kuenstler (Artists)
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  stage_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address VARCHAR(255),
  city VARCHAR(100),
  zip VARCHAR(20),
  country VARCHAR(2) DEFAULT 'DE',
  bio TEXT,
  website VARCHAR(255),
  social_media JSONB DEFAULT '{}',
  genre VARCHAR(100)[],
  instruments VARCHAR(100)[],
  photo_url TEXT,
  rider TEXT,
  gema_number VARCHAR(50),
  vat_id VARCHAR(50),
  bank_iban VARCHAR(34),
  bank_bic VARCHAR(11),
  bank_account_holder VARCHAR(255),
  default_fee DECIMAL(10,2),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  previous_performances INTEGER DEFAULT 0,
  is_bookable BOOLEAN DEFAULT true,
  is_favorite BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Veranstaltungen (Events)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id),
  room_id UUID REFERENCES venue_rooms(id),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  event_type VARCHAR(50) DEFAULT 'concert' CHECK (event_type IN ('concert', 'festival', 'tour', 'rehearsal', 'workshop', 'other')),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'planned', 'confirmed', 'published', 'sold_out', 'completed', 'cancelled')),
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  doors_open TIME,
  ticket_price DECIMAL(10,2),
  ticket_presale_price DECIMAL(10,2),
  capacity_planned INTEGER,
  attendees_actual INTEGER,
  revenue_target DECIMAL(12,2),
  revenue_actual DECIMAL(12,2),
  is_public BOOLEAN DEFAULT false,
  slug VARCHAR(255),
  poster_url TEXT,
  fb_event_url TEXT,
  ticketing_url TEXT,
  notes_public TEXT,
  notes_internal TEXT,
  gema_status VARCHAR(20) DEFAULT 'not_required' CHECK (gema_status IN ('not_required', 'pending', 'submitted', 'confirmed', 'problem')),
  gema_submitted_at TIMESTAMPTZ,
  gema_report_reference VARCHAR(50),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Event-Artist Zuordnung (N:M)
CREATE TABLE event_artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  fee DECIMAL(10,2),
  fee_currency VARCHAR(3) DEFAULT 'EUR',
  set_duration INTEGER,
  arrival_time TIME,
  soundcheck_time TIME,
  performance_start TIME,
  accommodation TEXT,
  catering TEXT,
  transport TEXT,
  contract_status VARCHAR(20) DEFAULT 'pending' CHECK (contract_status IN ('pending', 'sent', 'signed', 'cancelled')),
  contract_sent_at TIMESTAMPTZ,
  contract_signed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, artist_id)
);

-- Event Checkliste
CREATE TABLE event_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  item VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('general', 'booking', 'marketing', 'tech', 'finance', 'gema', 'catering')),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES users(id),
  due_date DATE,
  assigned_to UUID REFERENCES users(id),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Vertraege
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  contract_type VARCHAR(20) DEFAULT 'performance' CHECK (contract_type IN ('performance', 'rental', 'sponsorship', 'other')),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'cancelled')),
  fee DECIMAL(10,2),
  fee_currency VARCHAR(3) DEFAULT 'EUR',
  deposit_amount DECIMAL(10,2),
  deposit_paid BOOLEAN DEFAULT false,
  deposit_paid_at TIMESTAMPTZ,
  cancellation_terms TEXT,
  technical_rider TEXT,
  hospitality_rider TEXT,
  contract_text TEXT,
  file_url TEXT,
  signed_file_url TEXT,
  sent_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  valid_from DATE,
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Newsletter Abonnenten
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  city VARCHAR(100),
  salutation VARCHAR(20) CHECK (salutation IN ('Herr', 'Frau', 'Divers')),
  subscribed BOOLEAN DEFAULT true,
  subscription_date TIMESTAMPTZ DEFAULT now(),
  subscription_source VARCHAR(50) CHECK (subscription_source IN ('website', 'event', 'import', 'manual', 'widget')),
  double_opt_in BOOLEAN DEFAULT false,
  double_opt_in_at TIMESTAMPTZ,
  interests VARCHAR(50)[],
  language VARCHAR(5) DEFAULT 'de',
  unsubscribed_at TIMESTAMPTZ,
  unsubscribe_reason TEXT,
  bounce_count INTEGER DEFAULT 0,
  is_bounced BOOLEAN DEFAULT false,
  engagement_score DECIMAL(3,2) DEFAULT 0.00,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(organization_id, email)
);

-- E-Mail Templates
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(500) NOT NULL,
  body_html TEXT,
  body_text TEXT,
  variables JSONB DEFAULT '{}',
  category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('general', 'event', 'contract', 'invoice', 'welcome', 'reminder')),
  is_default BOOLEAN DEFAULT false,
  preview_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- E-Mail Kampagnen
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  preview_text VARCHAR(255),
  template_id UUID REFERENCES email_templates(id),
  body_html TEXT,
  body_text TEXT,
  sender_name VARCHAR(255),
  sender_email VARCHAR(255),
  reply_to VARCHAR(255),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  total_recipients INTEGER DEFAULT 0,
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_bounced INTEGER DEFAULT 0,
  total_opens INTEGER DEFAULT 0,
  unique_opens INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  total_unsubscribes INTEGER DEFAULT 0,
  total_complaints INTEGER DEFAULT 0,
  filter_tags VARCHAR(50)[],
  filter_segment VARCHAR(50),
  ab_test_enabled BOOLEAN DEFAULT false,
  ab_test_subject_b VARCHAR(500),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- GEMA Registrierungen
CREATE TABLE gema_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  submitted_by UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'confirmed', 'problem')),
  submitted_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  report_reference VARCHAR(50),
  total_duration INTEGER,
  estimated_fee DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- GEMA Werke (Setlist)
CREATE TABLE gema_works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES gema_registrations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  composer VARCHAR(255),
  lyricist VARCHAR(255),
  publisher VARCHAR(255),
  duration INTEGER,
  is_authorized BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Budgets
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id),
  name VARCHAR(255) NOT NULL,
  total_budget DECIMAL(12,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  fiscal_year INTEGER,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Budget-Positionen
CREATE TABLE budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  planned_amount DECIMAL(10,2),
  actual_amount DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Finanztransaktionen
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id),
  budget_item_id UUID REFERENCES budget_items(id),
  transaction_type VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  transaction_date DATE NOT NULL,
  payment_method VARCHAR(50),
  is_tax_relevant BOOLEAN DEFAULT true,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Social Media Accounts
CREATE TABLE social_media_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('facebook', 'instagram', 'twitter', 'tiktok', 'youtube', 'spotify', 'linkedin', 'threads', 'bluesky', 'mastodon')),
  account_name VARCHAR(255),
  account_handle VARCHAR(100),
  account_url TEXT,
  profile_image_url TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  scope TEXT,
  follower_count INTEGER,
  is_active BOOLEAN DEFAULT true,
  auto_post BOOLEAN DEFAULT false,
  post_defaults JSONB DEFAULT '{}',
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Social Posts
CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES social_media_accounts(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id),
  content TEXT NOT NULL,
  media_urls TEXT[],
  post_type VARCHAR(20) DEFAULT 'text' CHECK (post_type IN ('text', 'image', 'video', 'carousel', 'reel', 'story')),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'publishing', 'published', 'failed', 'cancelled')),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  platform_post_id VARCHAR(255),
  platform_post_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  reach_count INTEGER DEFAULT 0,
  impressions_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,4),
  error_message TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pressekontakte
CREATE TABLE press_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  outlet_name VARCHAR(255),
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  media_type VARCHAR(50) CHECK (media_type IN ('newspaper', 'magazine', 'radio', 'tv', 'online', 'blog', 'podcast', 'agency')),
  beats TEXT[],
  priority VARCHAR(20) DEFAULT 'medium',
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pressemitteilungen
CREATE TABLE press_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  lead TEXT,
  body_html TEXT,
  body_text TEXT,
  boilerplate TEXT,
  contact_info TEXT,
  language VARCHAR(5) DEFAULT 'de',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'embargo', 'cancelled')),
  embargo_until TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  slug VARCHAR(200),
  is_public BOOLEAN DEFAULT false,
  public_url TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Media (Dateien)
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_type VARCHAR(50) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  duration INTEGER,
  description TEXT,
  photographer VARCHAR(255),
  taken_at TIMESTAMPTZ,
  event_id UUID REFERENCES events(id),
  artist_id UUID REFERENCES artists(id),
  venue_id UUID REFERENCES venues(id),
  is_public BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ticket-Typen
CREATE TABLE ticket_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(20) NOT NULL CHECK (category IN ('vvk', 'ak', 'discount', 'pwyw', 'free', 'staff', 'vip')),
  price_cents INTEGER NOT NULL DEFAULT 0,
  pwyw_min_cents INTEGER,
  pwyw_suggested_cents INTEGER,
  quantity_total INTEGER NOT NULL DEFAULT 0,
  quantity_sold INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER NOT NULL DEFAULT 0,
  sale_start TIMESTAMPTZ,
  sale_end TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tickets
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_type_id UUID NOT NULL REFERENCES ticket_types(id),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  ticket_number VARCHAR(50) NOT NULL UNIQUE,
  qr_code_hash VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'used', 'refunded', 'expired', 'cancelled')),
  holder_name VARCHAR(200),
  holder_email VARCHAR(255),
  holder_phone VARCHAR(50),
  price_paid_cents INTEGER NOT NULL,
  sale_channel VARCHAR(20) DEFAULT 'online' CHECK (sale_channel IN ('online', 'box_office', 'phone', 'api', 'comp')),
  checked_in_at TIMESTAMPTZ,
  checked_in_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reservierungen
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  ticket_type_id UUID REFERENCES ticket_types(id),
  contact_name VARCHAR(200) NOT NULL,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'expired', 'picked_up')),
  expires_at TIMESTAMPTZ NOT NULL,
  auto_cancel_hours INTEGER DEFAULT 2,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Check-ins
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id),
  event_id UUID NOT NULL REFERENCES events(id),
  scan_type VARCHAR(20) DEFAULT 'qr_scan' CHECK (scan_type IN ('qr_scan', 'manual', 'nfc', 'list_check')),
  scan_result VARCHAR(20) NOT NULL CHECK (scan_result IN ('success', 'already_used', 'invalid', 'error')),
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  scanned_by UUID REFERENCES users(id),
  device_id VARCHAR(100),
  device_name VARCHAR(100),
  offline_synced BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Kalender-Eintraege
CREATE TABLE calendar_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  event_id UUID REFERENCES events(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  entry_type VARCHAR(50) DEFAULT 'event' CHECK (entry_type IN ('event', 'reminder', 'block', 'note')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  all_day BOOLEAN DEFAULT false,
  recurrence_rule TEXT,
  reminder_minutes INTEGER,
  color VARCHAR(7) DEFAULT '#3B82F6',
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Einstellungen
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  key VARCHAR(100) NOT NULL,
  value JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(organization_id, key)
);

-- Aktivitaetslog
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  action VARCHAR(50) NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI Provider
CREATE TABLE ai_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  provider_type VARCHAR(20) NOT NULL CHECK (provider_type IN ('openai', 'ollama', 'lmstudio', 'custom')),
  api_base_url VARCHAR(255),
  api_key_encrypted TEXT,
  model_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  is_local BOOLEAN DEFAULT false,
  cost_per_1k_input_tokens DECIMAL(10,6),
  cost_per_1k_output_tokens DECIMAL(10,6),
  cost_per_image DECIMAL(10,6),
  max_tokens INTEGER,
  supports_images BOOLEAN DEFAULT false,
  supports_streaming BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- AI Generierungen
CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_type VARCHAR(20) NOT NULL CHECK (generation_type IN ('text', 'image', 'translation')),
  use_case VARCHAR(50) NOT NULL,
  platform VARCHAR(50),
  provider_id UUID REFERENCES ai_providers(id),
  template_id UUID,
  input_data JSONB DEFAULT '{}',
  input_tokens INTEGER,
  output_text TEXT,
  output_image_url VARCHAR(500),
  output_metadata JSONB DEFAULT '{}',
  output_tokens INTEGER,
  temperature_used DECIMAL(3,2),
  language_source VARCHAR(10),
  language_target VARCHAR(10),
  cost_eur DECIMAL(10,6),
  generation_time_ms INTEGER,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'streaming', 'completed', 'failed', 'cancelled')),
  error_message TEXT,
  event_id UUID REFERENCES events(id),
  user_id UUID REFERENCES users(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Consents (DSGVO)
CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES newsletter_subscribers(id),
  consent_type VARCHAR(50) NOT NULL CHECK (consent_type IN ('newsletter', 'tracking', 'ai_processing', 'marketing', 'data_sharing')),
  granted BOOLEAN NOT NULL,
  granted_at TIMESTAMPTZ,
  granted_via VARCHAR(50),
  ip_address_hash VARCHAR(64),
  user_agent_hash VARCHAR(64),
  consent_version VARCHAR(20),
  consent_text_digest VARCHAR(64),
  withdrawn_at TIMESTAMPTZ,
  withdrawn_via VARCHAR(50),
  legal_basis VARCHAR(50) DEFAULT 'consent',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Loeschanfragen (DSGVO)
CREATE TABLE deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  requested_at TIMESTAMPTZ DEFAULT now(),
  requested_via VARCHAR(50),
  scheduled_deletion_at TIMESTAMPTZ DEFAULT now() + interval '30 days',
  completed_at TIMESTAMPTZ,
  cancellation_token UUID DEFAULT gen_random_uuid(),
  deleted_records_count JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Dashboard Layouts
CREATE TABLE user_dashboard_layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  layout_name VARCHAR(100) DEFAULT 'Standard',
  is_default BOOLEAN DEFAULT true,
  widgets JSONB DEFAULT '[]',
  theme_preference VARCHAR(10) DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Benachrichtigungen
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('event', 'finance', 'system', 'ai_recommendation', 'reminder')),
  title VARCHAR(255) NOT NULL,
  message TEXT,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  is_read BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  action_url VARCHAR(500),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  read_at TIMESTAMPTZ
);
```

### 4.3 RLS Policies

```sql
-- Hilfsfunktion fuer aktuelle Organisation
CREATE OR REPLACE FUNCTION get_current_org_id()
RETURNS UUID AS $$
BEGIN
  RETURN NULLIF(current_setting('app.current_org_id', TRUE), '')::UUID;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alle Tabellen: RLS aktivieren
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE gema_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gema_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies: Events
CREATE POLICY "events_org_isolation" ON events
  FOR ALL USING (organization_id = get_current_org_id());

-- Policies: Venues
CREATE POLICY "venues_org_isolation" ON venues
  FOR ALL USING (organization_id = get_current_org_id());

-- Policies: Artists
CREATE POLICY "artists_org_isolation" ON artists
  FOR ALL USING (organization_id = get_current_org_id());

-- Policies: Newsletter
CREATE POLICY "subscribers_org_isolation" ON newsletter_subscribers
  FOR ALL USING (organization_id = get_current_org_id());

-- Policies: Campaigns
CREATE POLICY "campaigns_org_isolation" ON email_campaigns
  FOR ALL USING (organization_id = get_current_org_id());

-- Policies: GEMA
CREATE POLICY "gema_org_isolation" ON gema_registrations
  FOR ALL USING (organization_id = get_current_org_id());

-- Policies: Social
CREATE POLICY "social_accounts_org" ON social_media_accounts
  FOR ALL USING (organization_id = get_current_org_id());

CREATE POLICY "social_posts_org" ON social_posts
  FOR ALL USING (organization_id = get_current_org_id());

-- Policies: Press
CREATE POLICY "press_contacts_org" ON press_contacts
  FOR ALL USING (organization_id = get_current_org_id());

CREATE POLICY "press_releases_org" ON press_releases
  FOR ALL USING (organization_id = get_current_org_id());

-- Policies: Ticketing
CREATE POLICY "tickets_event_isolation" ON tickets
  FOR ALL USING (event_id IN (
    SELECT id FROM events WHERE organization_id = get_current_org_id()
  ));

CREATE POLICY "check_ins_event_isolation" ON check_ins
  FOR ALL USING (event_id IN (
    SELECT id FROM events WHERE organization_id = get_current_org_id()
  ));

-- Policies: AI
CREATE POLICY "ai_providers_org" ON ai_providers
  FOR ALL USING (organization_id = get_current_org_id());

CREATE POLICY "ai_generations_org" ON ai_generations
  FOR ALL USING (organization_id = get_current_org_id());

-- Policies: Notifications
CREATE POLICY "notifications_user" ON notifications
  FOR ALL USING (user_id = auth.uid());
```

### 4.4 Indizes

```sql
-- Performance-Indizes
CREATE INDEX idx_events_org_date ON events(organization_id, date);
CREATE INDEX idx_events_venue ON events(venue_id);
CREATE INDEX idx_events_status ON events(organization_id, status);
CREATE INDEX idx_events_gema ON events(organization_id, gema_status);
CREATE INDEX idx_events_search ON events USING gin(to_tsvector('german', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_artists_org ON artists(organization_id);
CREATE INDEX idx_artists_stage ON artists(organization_id, stage_name);
CREATE INDEX idx_artists_genre ON artists USING GIN(genre);
CREATE INDEX idx_campaigns_org ON email_campaigns(organization_id);
CREATE INDEX idx_campaigns_status ON email_campaigns(organization_id, status);
CREATE INDEX idx_tickets_event ON tickets(event_id);
CREATE INDEX idx_tickets_qr ON tickets(qr_code_hash);
CREATE INDEX idx_checkins_ticket ON check_ins(ticket_id);
CREATE INDEX idx_activity_org ON activity_log(organization_id, created_at);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_subscribers_org ON newsletter_subscribers(organization_id, email);
```


## 5. API-SPEZIFIKATION

### 5.1 tRPC Router Struktur (Interne API)

```typescript
// server/routers/_app.ts
import { router } from '../trpc';
import { eventRouter } from './event';
import { venueRouter } from './venue';
import { artistRouter } from './artist';
import { newsletterRouter } from './newsletter';
import { campaignRouter } from './campaign';
import { gemaRouter } from './gema';
import { budgetRouter } from './budget';
import { socialRouter } from './social';
import { pressRouter } from './press';
import { ticketRouter } from './ticket';
import { checkinRouter } from './checkin';
import { aiRouter } from './ai';
import { dashboardRouter } from './dashboard';
import { userRouter } from './user';
import { settingsRouter } from './settings';
import { fileRouter } from './file';
import { searchRouter } from './search';
import { activityRouter } from './activity';
import { notificationRouter } from './notification';

export const appRouter = router({
  event: eventRouter,
  venue: venueRouter,
  artist: artistRouter,
  newsletter: newsletterRouter,
  campaign: campaignRouter,
  gema: gemaRouter,
  budget: budgetRouter,
  social: socialRouter,
  press: pressRouter,
  ticket: ticketRouter,
  checkin: checkinRouter,
  ai: aiRouter,
  dashboard: dashboardRouter,
  user: userRouter,
  settings: settingsRouter,
  file: fileRouter,
  search: searchRouter,
  activity: activityRouter,
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
```

### 5.2 Zod-Input-Schemas (Beispiele)

```typescript
// server/schemas/event.ts
import { z } from 'zod';

export const eventStatusEnum = z.enum([
  'draft', 'planned', 'confirmed', 'published', 'sold_out', 'completed', 'cancelled'
]);

export const eventTypeEnum = z.enum([
  'concert', 'festival', 'tour', 'rehearsal', 'workshop', 'other'
]);

export const createEventSchema = z.object({
  title: z.string().min(1, 'Titel ist erforderlich').max(255),
  subtitle: z.string().max(255).optional(),
  description: z.string().optional(),
  venueId: z.string().uuid('Gueltige Venue-ID erforderlich'),
  roomId: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum im Format YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  doorsOpen: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  ticketPrice: z.number().min(0).optional(),
  ticketPresalePrice: z.number().min(0).optional(),
  capacity: z.number().int().min(1).optional(),
  eventType: eventTypeEnum.default('concert'),
  artistIds: z.array(z.string().uuid()).optional(),
  isPublic: z.boolean().default(false),
  notesInternal: z.string().optional(),
});

export const updateEventSchema = createEventSchema.partial().extend({
  id: z.string().uuid(),
  status: eventStatusEnum.optional(),
});

export const listEventsSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  venueId: z.string().uuid().optional(),
  status: eventStatusEnum.optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['date', 'title', 'createdAt']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Venue Schemas
export const createVenueSchema = z.object({
  name: z.string().min(1).max(255),
  address: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  zip: z.string().max(20).optional(),
  capacity: z.number().int().min(0).optional(),
  venueType: z.enum(['theater', 'club', 'cafe', 'hall', 'outdoor', 'church', 'other']).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#3B82F6'),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  techSpecs: z.record(z.any()).optional(),
});

// Artist Schemas
export const createArtistSchema = z.object({
  stageName: z.string().min(1).max(255),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(50).optional(),
  genre: z.array(z.string()).optional(),
  gemaNumber: z.string().max(50).optional(),
  bio: z.string().optional(),
  defaultFee: z.number().min(0).optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

// Newsletter Schemas
export const createSubscriberSchema = z.object({
  email: z.string().email('Gueltige E-Mail erforderlich'),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  salutation: z.enum(['Herr', 'Frau', 'Divers']).optional(),
  interests: z.array(z.string()).optional(),
  source: z.enum(['website', 'event', 'import', 'manual', 'widget']).default('website'),
});

export const createCampaignSchema = z.object({
  name: z.string().min(1).max(255),
  subject: z.string().min(1).max(500),
  previewText: z.string().max(255).optional(),
  templateId: z.string().uuid().optional(),
  bodyHtml: z.string().optional(),
  bodyText: z.string().optional(),
  senderName: z.string().optional(),
  senderEmail: z.string().email().optional(),
  replyTo: z.string().email().optional(),
  filterTags: z.array(z.string()).optional(),
  filterSegment: z.string().optional(),
  abTestEnabled: z.boolean().default(false),
  abTestSubjectB: z.string().max(500).optional(),
  scheduledAt: z.string().datetime().optional(),
});

// GEMA Schemas
export const calculateGemaSchema = z.object({
  visitors: z.number().int().min(1).max(10000),
  ticketPrice: z.number().min(0),
  isStudentEvent: z.boolean().default(false),
  isPrivateEvent: z.boolean().default(false),
});

export const createGemaRegistrationSchema = z.object({
  eventId: z.string().uuid(),
  works: z.array(z.object({
    title: z.string().min(1),
    composer: z.string().optional(),
    lyricist: z.string().optional(),
    duration: z.number().int().min(1).optional(),
  })).min(1, 'Mindestens ein Werk erforderlich'),
});

// Social Media Schemas
export const createSocialPostSchema = z.object({
  content: z.string().min(1).max(2800),
  mediaUrls: z.array(z.string().url()).max(4).optional(),
  accountIds: z.array(z.string().uuid()).min(1, 'Mindestens ein Account'),
  scheduledAt: z.string().datetime().optional(),
  eventId: z.string().uuid().optional(),
  postType: z.enum(['text', 'image', 'video', 'carousel', 'reel', 'story']).default('text'),
});

// Ticket Schemas
export const createTicketTypeSchema = z.object({
  eventId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  category: z.enum(['vvk', 'ak', 'discount', 'pwyw', 'free', 'staff', 'vip']),
  priceCents: z.number().int().min(0),
  quantityTotal: z.number().int().min(1),
  saleStart: z.string().datetime().optional(),
  saleEnd: z.string().datetime().optional(),
});

export const createTicketSchema = z.object({
  ticketTypeId: z.string().uuid(),
  holderName: z.string().max(200).optional(),
  holderEmail: z.string().email().optional(),
  holderPhone: z.string().max(50).optional(),
  quantity: z.number().int().min(1).default(1),
  saleChannel: z.enum(['online', 'box_office', 'phone', 'api', 'comp']).default('online'),
});

export const checkInSchema = z.object({
  qrCode: z.string().min(1),
  deviceId: z.string().optional(),
  scanType: z.enum(['qr_scan', 'manual', 'nfc', 'list_check']).default('qr_scan'),
});

// AI Schemas
export const generateTextSchema = z.object({
  useCase: z.enum([
    'event_description', 'social_media_post', 'press_release', 
    'newsletter', 'seo_title', 'seo_description'
  ]),
  inputData: z.record(z.any()),
  tone: z.enum(['professional', 'casual', 'poetic', 'urgent', 'persuasive']).default('professional'),
  targetLength: z.number().int().min(50).max(2000).default(300),
  language: z.string().default('de'),
  stream: z.boolean().default(false),
  providerId: z.string().uuid().optional(),
});

export const generateImageSchema = z.object({
  prompt: z.string().min(1).max(1000),
  style: z.enum(['photorealistic', 'illustration', 'watercolor', 'comic', '3d', 'sketch']).default('photorealistic'),
  aspectRatio: z.enum(['1:1', '9:16', '3:4', '16:9', '4:3']).default('1:1'),
  variations: z.number().int().min(1).max(4).default(1),
  providerId: z.string().uuid().optional(),
});

// Search Schema
export const globalSearchSchema = z.object({
  query: z.string().min(1).max(100),
  entityTypes: z.array(z.enum([
    'event', 'venue', 'artist', 'contact', 'subscriber', 'campaign', 'ticket'
  ])).optional(),
  limit: z.number().int().min(1).max(20).default(10),
});
```

### 5.3 tRPC Procedures (Beispiele)

```typescript
// server/routers/event.ts
import { router, protectedProcedure } from '../trpc';
import { 
  createEventSchema, 
  updateEventSchema, 
  listEventsSchema 
} from '../schemas/event';

export const eventRouter = router({
  // Liste mit Pagination, Filter, Sortierung
  list: protectedProcedure
    .input(listEventsSchema)
    .query(async ({ ctx, input }) => {
      return ctx.services.event.list({
        organizationId: ctx.organization.id,
        ...input,
      });
    }),

  // Einzelnes Event mit allen Details
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.services.event.getById(input.id, ctx.organization.id);
    }),

  // Event erstellen
  create: protectedProcedure
    .input(createEventSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.services.event.create({
        ...input,
        organizationId: ctx.organization.id,
        createdBy: ctx.user.id,
      });
    }),

  // Event aktualisieren
  update: protectedProcedure
    .input(updateEventSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.services.event.update(id, ctx.organization.id, data);
    }),

  // Event loeschen (Soft Delete)
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.services.event.delete(input.id, ctx.organization.id);
    }),

  // Event duplizieren
  duplicate: protectedProcedure
    .input(z.object({ 
      id: z.string().uuid(),
      newDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.services.event.duplicate(input.id, input.newDate, ctx.organization.id);
    }),

  // Event-Statistiken
  stats: protectedProcedure
    .input(z.object({ 
      period: z.enum(['7d', '30d', '90d', '1y']).default('30d') 
    }))
    .query(async ({ ctx, input }) => {
      return ctx.services.event.getStats(ctx.organization.id, input.period);
    }),
});
```

### 5.4 REST API Endpunkte (Externe Integrationen)

```
BASE: /api/rest/v1
AUTH: Bearer Token oder API Key

=== AUTHENTICATION ===
POST /auth/login
  Body: { "email": "user@example.com", "password": "password" }
  Response: { "token": "jwt-token", "user": { ... }, "organization": { ... } }

POST /auth/register
  Body: { "email": "...", "password": "...", "organizationName": "...", 
          "firstName": "...", "lastName": "..." }
  Response: { "token": "...", "user": { ... } }

POST /auth/refresh
  Headers: Authorization: Bearer {token}
  Response: { "token": "new-jwt-token" }

=== EVENTS ===
GET /events?page=1&limit=20&venueId=&status=&dateFrom=&dateTo=&search=
  Response: { "data": [...], "total": 100, "page": 1, "limit": 20 }

GET /events/:id
  Response: { "data": { ...event, venue: {...}, artists: [...], checklist: [...] } }

POST /events
  Body: { "title": "...", "date": "2026-08-15", "venueId": "uuid", ... }
  Response: { "data": { ... } }

PUT /events/:id
  Body: { "title": "...", "status": "published", ... }
  Response: { "data": { ... } }

DELETE /events/:id
  Response: { "success": true }

=== VENUES ===
GET /venues?search=&isActive=true
  Response: { "data": [...] }

POST /venues
  Body: { "name": "...", "address": "...", "city": "...", "capacity": 200 }
  Response: { "data": { ... } }

PUT /venues/:id
  Body: { "name": "...", "capacity": 250 }
  Response: { "data": { ... } }

DELETE /venues/:id
  Response: { "success": true }

=== ARTISTS ===
GET /artists?search=&genre=&isBookable=true
  Response: { "data": [...], "total": 50 }

POST /artists
  Body: { "stageName": "...", "email": "...", "genre": ["Jazz", "Pop"] }
  Response: { "data": { ... } }

POST /artists/import
  Content-Type: multipart/form-data
  Body: { "file": CSV-File }
  Response: { "imported": 45, "errors": 3, "errorDetails": [...] }

=== NEWSLETTER ===
GET /newsletter/subscribers?page=1&limit=50&search=&subscribed=true
  Response: { "data": [...], "total": 1200 }

POST /newsletter/subscribers
  Body: { "email": "...", "firstName": "...", "source": "website" }
  Response: { "data": { ... } }

POST /newsletter/subscribers/import
  Content-Type: multipart/form-data
  Body: { "file": CSV-File }
  Response: { "imported": 500, "errors": 12 }

GET /newsletter/subscribers/:id
  Response: { "data": { ...subscriber, consents: [...] } }

POST /newsletter/campaigns
  Body: { "name": "Sommerprogramm", "subject": "...", "bodyHtml": "...", 
          "filterTags": ["Leipzig"], "scheduledAt": "2026-08-01T10:00:00Z" }
  Response: { "data": { ...campaign } }

POST /newsletter/campaigns/:id/send
  Response: { "success": true, "queued": 1200 }

GET /newsletter/campaigns/:id/stats
  Response: { "totalSent": 1200, "delivered": 1185, "opens": 420, 
              "clicks": 85, "bounces": 15, "unsubscribes": 3 }

=== GEMA ===
POST /gema/calculate
  Body: { "visitors": 150, "ticketPrice": 18.00 }
  Response: { "bruttoEinnahmen": 2700.00, "gemaGebuehr": 155.25, 
              "tarifSatz": "5.75%", "mindestsatz": 23.55, "nachweis": "Anmeldeformular" }

POST /gema/registrations
  Body: { "eventId": "uuid", "works": [{ "title": "Song", "composer": "Name", "duration": 180 }] }
  Response: { "data": { ...registration } }

GET /gema/registrations/:id/pdf
  Response: PDF-File (application/pdf)

GET /gema/historie?from=2026-01-01&to=2026-12-31&status=
  Response: { "data": [...], "totalGebuehren": 4520.50 }

=== SOCIAL MEDIA ===
GET /social/accounts
  Response: { "data": [...accounts] }

POST /social/accounts/connect/:platform
  Response: { "authUrl": "https://..." }

POST /social/posts
  Body: { "content": "...", "accountIds": ["uuid"], "scheduledAt": "..." }
  Response: { "data": { ...post } }

GET /social/analytics?period=7d
  Response: { "data": [...byPlatform] }

=== TICKETING ===
GET /events/:eventId/tickets
  Response: { "data": [...tickets], "stats": { "total": 200, "sold": 150, "checkedIn": 120, "remaining": 50 } }

POST /events/:eventId/tickets
  Body: { "ticketTypeId": "uuid", "holderName": "...", "quantity": 2 }
  Response: { "data": [...tickets], "qrCodes": ["..."] }

POST /tickets/validate/:qrCode
  Response: { "valid": true, "ticket": { ... }, "message": "Ticket gueltig" }

POST /tickets/:id/check-in
  Body: { "deviceId": "terminal-1" }
  Response: { "success": true, "ticket": { ... } }

GET /events/:eventId/guestlist
  Response: { "data": [...guests], "filters": {...} }

POST /events/:eventId/guestlist/export
  Body: { "format": "pdf|csv", "columns": ["name", "email", "ticketType"] }
  Response: File-Download

=== AI ===
POST /ai/generate/text
  Body: { "useCase": "event_description", "inputData": { "artist": "...", "genre": "..." },
          "tone": "professional", "targetLength": 300 }
  Response: { "id": "uuid", "outputText": "...", "inputTokens": 45, "outputTokens": 120, "costEur": 0.003 }

POST /ai/generate/image
  Body: { "prompt": "Jazz concert poster, watercolor style", "style": "watercolor", "aspectRatio": "3:4" }
  Response: { "id": "uuid", "imageUrls": ["https://..."], "costEur": 0.040 }

POST /ai/translate
  Body: { "text": "...", "targetLanguages": ["en", "fr", "es"] }
  Response: { "translations": [{ "language": "en", "text": "..." }, ...] }

=== DASHBOARD ===
GET /dashboard/summary
  Response: { "upcomingEvents": 12, "totalRevenue": 45000, "openTasks": 8, "newsletterSubscribers": 1200 }

GET /dashboard/widgets/:widgetId/data
  Response: { "widgetData": {...} }

=== SETTINGS ===
GET /settings/:key
  Response: { "key": "...", "value": {...} }

PUT /settings/:key
  Body: { "value": {...} }
  Response: { "success": true }

=== SEARCH ===
GET /search?q=query&types=event,artist,venue&limit=10
  Response: { "results": { "events": [...], "artists": [...], "venues": [...] } }

=== ACTIVITY ===
GET /activity?limit=50&offset=0
  Response: { "data": [...activities], "total": 500 }

=== NOTIFICATIONS ===
GET /notifications?unreadOnly=true&limit=20
  Response: { "data": [...], "unreadCount": 5 }

POST /notifications/:id/read
  Response: { "success": true }

POST /notifications/read-all
  Response: { "markedAsRead": 5 }
```

### 5.5 Error Handling

```typescript
// Einheitliches Error-Format fuer alle APIs
interface ApiError {
  error: {
    code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 
          'CONFLICT' | 'RATE_LIMITED' | 'INTERNAL_ERROR' | 'BAD_REQUEST';
    message: string;           // Menschenlesbare Fehlermeldung (Deutsch)
    details?: Array<{
      field: string;
      message: string;
    }>;
    timestamp: string;         // ISO 8601
    requestId: string;         // UUID fuer Tracing
    docsUrl?: string;          // Link zur Dokumentation
  }
}

// HTTP Status Mapping
const errorStatusMap = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
  BAD_REQUEST: 400,
};

// tRPC Error Formatter
const errorFormatter = (error: TRPCError) => ({
  code: error.code,
  message: translateError(error.message), // Deutsch
  requestId: generateRequestId(),
  timestamp: new Date().toISOString(),
});
```

### 5.6 Rate Limiting

```typescript
// Rate Limits pro Endpunkt-Typ
const rateLimits = {
  auth: { requests: 10, window: '1m' },      // 10/min fuer Login
  api: { requests: 100, window: '1m' },       // 100/min fuer authentifizierte Requests
  newsletter: { requests: 50, window: '1m' }, // 50/min fuer Newsletter-Versand
  ai: { requests: 20, window: '1m' },         // 20/min fuer KI-Generierung
  upload: { requests: 10, window: '1m' },     // 10/min fuer File Uploads
};
```


## 6. KOMPONENTEN-ARCHITEKTUR

### 6.1 Ordnerstruktur

```
my-app/
├── app/                           # Next.js App Router
│   ├── (auth)/                    # Auth Route Group (kein Layout)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── callback/route.ts      # OAuth Callback
│   │
│   ├── (dashboard)/               # Dashboard Route Group
│   │   ├── layout.tsx             # Sidebar + Header + Content Wrapper
│   │   ├── page.tsx               # Dashboard Home (Widgets)
│   │   ├── loading.tsx            # Loading Skeleton
│   │   ├── error.tsx              # Error Boundary
│   │   │
│   │   ├── veranstaltungen/       # Events Module
│   │   │   ├── page.tsx           # Event List (DataTable)
│   │   │   ├── neu/page.tsx       # Create Event Form
│   │   │   └── [id]/
│   │   │       ├── page.tsx       # Event Detail (Tabs)
│   │   │       ├── bearbeiten/page.tsx
│   │   │       └── gema/page.tsx  # GEMA Registration
│   │   │
│   │   ├── spielorte/             # Venues Module
│   │   │   ├── page.tsx
│   │   │   ├── neu/page.tsx
│   │   │   └── [id]/page.tsx
│   │   │
│   │   ├── kuenstler/             # Artists Module
│   │   │   ├── page.tsx
│   │   │   ├── neu/page.tsx
│   │   │   └── [id]/page.tsx
│   │   │
│   │   ├── kalender/page.tsx      # Calendar View
│   │   │
│   │   ├── newsletter/            # Newsletter Module
│   │   │   ├── page.tsx           # Overview/Dashboard
│   │   │   ├── campaigns/page.tsx
│   │   │   ├── campaigns/[id]/page.tsx
│   │   │   ├── campaigns/neu/page.tsx
│   │   │   ├── subscribers/page.tsx
│   │   │   ├── subscribers/import/page.tsx
│   │   │   ├── templates/page.tsx
│   │   │   └── templates/[id]/page.tsx
│   │   │
│   │   ├── social/                # Social Media Module
│   │   │   ├── page.tsx           # Overview
│   │   │   ├── planner/page.tsx   # Content Calendar
│   │   │   ├── posts/page.tsx
│   │   │   ├── posts/neu/page.tsx
│   │   │   ├── accounts/page.tsx  # Connected Accounts
│   │   │   └── analytics/page.tsx
│   │   │
│   │   ├── presse/                # Press Module
│   │   │   ├── page.tsx
│   │   │   ├── contacts/page.tsx
│   │   │   ├── mitteilungen/page.tsx
│   │   │   ├── mitteilungen/neu/page.tsx
│   │   │   └── pressemappe/[id]/page.tsx
│   │   │
│   │   ├── gema/                  # GEMA Module
│   │   │   ├── page.tsx           # Overview
│   │   │   ├── rechner/page.tsx   # Tarif Calculator
│   │   │   ├── historie/page.tsx  # History
│   │   │   └── meldungen/page.tsx # Registrations
│   │   │
│   │   ├── finanzen/              # Finance Module
│   │   │   ├── page.tsx           # Overview
│   │   │   ├── budgets/page.tsx
│   │   │   ├── budgets/[id]/page.tsx
│   │   │   ├── transaktionen/page.tsx
│   │   │   ├── kassenbuch/page.tsx
│   │   │   └── steuer/page.tsx
│   │   │
│   │   ├── ticketing/             # Ticketing Module
│   │   │   ├── page.tsx
│   │   │   ├── events/[id]/tickets/page.tsx
│   │   │   ├── check-in/page.tsx  # Mobile Check-in
│   │   │   └── scanning/page.tsx  # QR Scanner
│   │   │
│   │   ├── ki-assistent/          # AI Assistant
│   │   │   ├── page.tsx
│   │   │   ├── text/page.tsx
│   │   │   ├── bilder/page.tsx
│   │   │   ├── uebersetzung/page.tsx
│   │   │   └── konfiguration/page.tsx
│   │   │
│   │   ├── einstellungen/         # Settings
│   │   │   ├── page.tsx
│   │   │   ├── profil/page.tsx
│   │   │   ├── organisation/page.tsx
│   │   │   ├── mitglieder/page.tsx
│   │   │   ├── konto/page.tsx
│   │   │   ├── integrations/page.tsx
│   │   │   ├── datenschutz/page.tsx
│   │   │   └── rechnung/page.tsx
│   │   │
│   │   ├── aktivitaeten/page.tsx  # Activity Log
│   │   └── suche/page.tsx         # Search Results
│   │
│   ├── api/                       # API Routes
│   │   ├── trpc/[trpc]/route.ts   # tRPC Handler
│   │   ├── webhooks/
│   │   │   ├── brevo/route.ts
│   │   │   ├── sendgrid/route.ts
│   │   │   ├── stripe/route.ts
│   │   │   └── social/[platform]/route.ts
│   │   ├── auth/callback/route.ts
│   │   └── rest/v1/               # REST API
│   │       ├── events/route.ts
│   │       ├── venues/route.ts
│   │       └── ...
│   │
│   ├── pressemappe/               # Public Press Folder
│   │   └── [slug]/page.tsx
│   │
│   └── check-in/                  # Public Check-in Page
│       └── [eventId]/page.tsx
│
├── components/                    # React Komponenten
│   ├── ui/                        # shadcn/ui Komponenten (autogen)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   │
│   ├── layout/                    # Layout-Komponenten
│   │   ├── app-shell.tsx          # Haupt-App-Layout
│   │   ├── sidebar.tsx            # Navigation Sidebar
│   │   ├── sidebar-nav.tsx        # Nav-Items
│   │   ├── topbar.tsx             # Header mit Suche
│   │   ├── breadcrumbs.tsx
│   │   ├── command-palette.tsx    # Cmd+K Suche
│   │   └── mobile-nav.tsx
│   │
│   ├── dashboard/                 # Dashboard Widgets
│   │   ├── widget-container.tsx   # Drag-Drop Wrapper
│   │   ├── widgets/
│   │   │   ├── upcoming-events.tsx
│   │   │   ├── revenue-chart.tsx
│   │   │   ├── open-tasks.tsx
│   │   │   ├── newsletter-stats.tsx
│   │   │   ├── mini-calendar.tsx
│   │   │   ├── quick-actions.tsx
│   │   │   ├── venue-occupancy.tsx
│   │   │   ├── artist-stats.tsx
│   │   │   └── recent-activity.tsx
│   │
│   ├── events/                    # Event-Komponenten
│   │   ├── event-list.tsx
│   │   ├── event-card.tsx
│   │   ├── event-form.tsx
│   │   ├── event-detail-tabs.tsx
│   │   ├── event-timeline.tsx
│   │   ├── event-checklist.tsx
│   │   ├── event-finance-tab.tsx
│   │   ├── event-guestlist-tab.tsx
│   │   ├── event-status-badge.tsx
│   │   ├── event-filter-bar.tsx
│   │   └── event-duplicator.tsx
│   │
│   ├── calendar/                  # Kalender-Komponenten
│   │   ├── calendar-view.tsx
│   │   ├── calendar-toolbar.tsx
│   │   ├── calendar-event.tsx
│   │   ├── calendar-filters.tsx
│   │   └── conflict-indicator.tsx
│   │
│   ├── artists/                   # Kuenstler-Komponenten
│   │   ├── artist-list.tsx
│   │   ├── artist-card.tsx
│   │   ├── artist-form.tsx
│   │   ├── artist-detail.tsx
│   │   ├── artist-rating.tsx
│   │   ├── artist-import-dialog.tsx
│   │   └── artist-filter-bar.tsx
│   │
│   ├── venues/                    # Spielort-Komponenten
│   │   ├── venue-list.tsx
│   │   ├── venue-card.tsx
│   │   ├── venue-form.tsx
│   │   ├── venue-detail.tsx
│   │   └── venue-color-picker.tsx
│   │
│   ├── newsletter/                # Newsletter-Komponenten
│   │   ├── subscriber-list.tsx
│   │   ├── subscriber-import.tsx
│   │   ├── campaign-list.tsx
│   │   ├── campaign-form.tsx
│   │   ├── campaign-stats.tsx
│   │   ├── email-editor/
│   │   │   ├── email-editor.tsx
│   │   │   ├── block-toolbar.tsx
│   │   │   ├── blocks/
│   │   │   │   ├── text-block.tsx
│   │   │   │   ├── image-block.tsx
│   │   │   │   ├── button-block.tsx
│   │   │   │   ├── event-list-block.tsx
│   │   │   │   ├── artist-spotlight-block.tsx
│   │   │   │   └── divider-block.tsx
│   │   │   ├── preview-pane.tsx
│   │   │   └── mobile-preview.tsx
│   │   ├── template-list.tsx
│   │   └── template-editor.tsx
│   │
│   ├── social/                    # Social Media Komponenten
│   │   ├── account-list.tsx
│   │   ├── account-connect.tsx
│   │   ├── post-creator.tsx
│   │   ├── post-preview.tsx
│   │   ├── content-calendar.tsx
│   │   ├── media-library.tsx
│   │   ├── platform-icon.tsx
│   │   └── analytics-chart.tsx
│   │
│   ├── gema/                      # GEMA Komponenten
│   │   ├── gema-calculator.tsx
│   │   ├── gema-registration-form.tsx
│   │   ├── gema-work-list.tsx
│   │   ├── gema-pdf-preview.tsx
│   │   ├── gema-status-badge.tsx
│   │   └── gema-history-list.tsx
│   │
│   ├── finance/                   # Finanz-Komponenten
│   │   ├── budget-form.tsx
│   │   ├── budget-overview.tsx
│   │   ├── break-even-chart.tsx
│   │   ├── transaction-list.tsx
│   │   ├── kassenbuch-entry.tsx
│   │   └── tax-summary.tsx
│   │
│   ├── press/                     # Presse-Komponenten
│   │   ├── press-contact-list.tsx
│   │   ├── press-contact-form.tsx
│   │   ├── press-release-editor.tsx
│   │   ├── press-release-preview.tsx
│   │   ├── distribution-list.tsx
│   │   ├── digital-presskit.tsx
│   │   └── clipping-tracker.tsx
│   │
│   ├── ticketing/                 # Ticketing Komponenten
│   │   ├── ticket-type-form.tsx
│   │   ├── ticket-type-list.tsx
│   │   ├── guestlist-table.tsx
│   │   ├── reservation-form.tsx
│   │   ├── qr-code-display.tsx
│   │   ├── check-in-scanner.tsx
│   │   ├── check-in-stats.tsx
│   │   └── waitlist-manager.tsx
│   │
│   ├── ai/                        # KI Komponenten
│   │   ├── ai-assist-panel.tsx    # Slide-out Panel
│   │   ├── text-generator.tsx
│   │   ├── image-generator.tsx
│   │   ├── translation-tool.tsx
│   │   ├── prompt-templates.tsx
│   │   ├── streaming-text.tsx
│   │   ├── cost-display.tsx
│   │   └── ai-config-form.tsx
│   │
│   ├── shared/                    # Wiederverwendbare Komponenten
│   │   ├── data-table/            # Generische DataTable
│   │   │   ├── data-table.tsx
│   │   │   ├── data-table-header.tsx
│   │   │   ├── data-table-body.tsx
│   │   │   ├── data-table-pagination.tsx
│   │   │   ├── data-table-filter.tsx
│   │   │   └── data-table-export.tsx
│   │   ├── forms/
│   │   │   ├── form-field.tsx
│   │   │   ├── form-select.tsx
│   │   │   ├── form-date-picker.tsx
│   │   │   ├── form-rich-text.tsx
│   │   │   └── form-image-upload.tsx
│   │   ├── charts/
│   │   │   ├── line-chart.tsx
│   │   │   ├── bar-chart.tsx
│   │   │   ├── pie-chart.tsx
│   │   │   ├── area-chart.tsx
│   │   │   └── donut-chart.tsx
│   │   ├── status-badges.tsx
│   │   ├── empty-state.tsx
│   │   ├── confirm-dialog.tsx
│   │   ├── file-uploader.tsx
│   │   ├── image-gallery.tsx
│   │   ├── search-input.tsx
│   │   ├── date-range-picker.tsx
│   │   ├── color-picker.tsx
│   │   ├── tag-input.tsx
│   │   ├── avatar-upload.tsx
│   │   ├── skeleton-loader.tsx
│   │   ├── error-boundary.tsx
│   │   └── theme-toggle.tsx
│   │
│   └── providers/                 # Context Providers
│       ├── trpc-provider.tsx
│       ├── auth-provider.tsx
│       ├── theme-provider.tsx
│       ├── query-provider.tsx
│       ├── notification-provider.tsx
│       └── ai-provider.tsx
│
├── hooks/                         # Custom React Hooks
│   ├── use-auth.ts
│   ├── use-organization.ts
│   ├── use-user-role.ts
│   ├── use-events.ts              # tRPC queries/mutations
│   ├── use-venues.ts
│   ├── use-artists.ts
│   ├── use-newsletter.ts
│   ├── use-campaigns.ts
│   ├── use-gema.ts
│   ├── use-budget.ts
│   ├── use-social.ts
│   ├── use-press.ts
│   ├── use-tickets.ts
│   ├── use-checkin.ts
│   ├── use-ai.ts
│   ├── use-dashboard.ts
│   ├── use-search.ts
│   ├── use-notifications.ts
│   ├── use-local-storage.ts
│   ├── use-media-query.ts         # Responsive
│   ├── use-debounce.ts
│   ├── use-click-outside.ts
│   ├── use-clipboard.ts
│   ├── use-toast.ts
│   └── use-permissions.ts         # RBAC
│
├── lib/                           # Utilities
│   ├── utils.ts                   # cn(), formatDate, etc.
│   ├── constants.ts               # App-Konstanten
│   ├── config.ts                  # Konfiguration
│   ├── supabase/                  # Supabase Client
│   │   ├── client.ts              # Browser Client
│   │   ├── server.ts              # Server Client
│   │   └── admin.ts               # Service Role Client
│   ├── trpc/                      # tRPC Konfiguration
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── context.ts
│   ├── api/                       # API-Utilities
│   │   ├── error-handler.ts
│   │   ├── rate-limiter.ts
│   │   ├── validate-request.ts
│   │   └── middleware/
│   │       ├── auth.ts
│   │       ├── org-context.ts
│   │       ├── rbac.ts
│   │       └── audit-log.ts
│   ├── validators/                # Zod-Schemas
│   │   ├── event.ts
│   │   ├── venue.ts
│   │   ├── artist.ts
│   │   ├── newsletter.ts
│   │   ├── campaign.ts
│   │   ├── gema.ts
│   │   ├── budget.ts
│   │   ├── social.ts
│   │   ├── press.ts
│   │   ├── ticket.ts
│   │   ├── ai.ts
│   │   └── common.ts
│   ├── services/                  # Business Logic
│   │   ├── event-service.ts
│   │   ├── venue-service.ts
│   │   ├── artist-service.ts
│   │   ├── newsletter-service.ts
│   │   ├── campaign-service.ts
│   │   ├── gema-service.ts
│   │   ├── budget-service.ts
│   │   ├── social-service.ts
│   │   ├── press-service.ts
│   │   ├── ticket-service.ts
│   │   ├── checkin-service.ts
│   │   ├── ai-service.ts
│   │   ├── dashboard-service.ts
│   │   ├── search-service.ts
│   │   ├── notification-service.ts
│   │   ├── activity-service.ts
│   │   ├── file-service.ts
│   │   └── pdf-service.ts
│   ├── integrations/              # Externe APIs
│   │   ├── smtp/                  # E-Mail Provider
│   │   │   ├── brevo-client.ts
│   │   │   ├── sendgrid-client.ts
│   │   │   ├── rapidmail-client.ts
│   │   │   └── smtp-factory.ts
│   │   ├── social/                # Social Media APIs
│   │   │   ├── meta-client.ts
│   │   │   ├── twitter-client.ts
│   │   │   ├── tiktok-client.ts
│   │   │   ├── linkedin-client.ts
│   │   │   └── social-factory.ts
│   │   ├── ai/                    # KI APIs
│   │   │   ├── openai-client.ts
│   │   │   ├── ollama-client.ts
│   │   │   └── ai-factory.ts
│   │   ├── calendar/              # Kalender APIs
│   │   │   └── google-calendar.ts
│   │   └── storage/               # File Storage
│   │       └── supabase-storage.ts
│   ├── pdf/                       # PDF-Generierung
│   │   ├── pdf-generator.ts
│   │   ├── templates/
│   │   │   ├── gema-report.tsx
│   │   │   ├── contract.tsx
│   │   │   ├── press-release.tsx
│   │   │   ├── guestlist.tsx
│   │   │   └── presskit.tsx
│   │   └── styles.ts
│   ├── queue/                     # BullMQ Queues
│   │   ├── queue-client.ts
│   │   ├── newsletter-queue.ts
│   │   ├── social-queue.ts
│   │   ├── ai-queue.ts
│   │   ├── email-queue.ts
│   │   └── worker-registry.ts
│   ├── analytics/                 # Tracking
│   │   └── mixpanel.ts            # Opt-in Tracking
│   └── types/                     # TypeScript Types
│       ├── index.ts
│       ├── database.ts            # DB Schema Types
│       ├── api.ts                 # API Response Types
│       ├── forms.ts               # Form Value Types
│       └── enums.ts               # Enums/Constants
│
├── server/                        # Server-seitiger Code
│   ├── routers/                   # tRPC Router
│   │   ├── _app.ts
│   │   ├── event.ts
│   │   ├── venue.ts
│   │   ├── artist.ts
│   │   ├── newsletter.ts
│   │   ├── campaign.ts
│   │   ├── gema.ts
│   │   ├── budget.ts
│   │   ├── social.ts
│   │   ├── press.ts
│   │   ├── ticket.ts
│   │   ├── checkin.ts
│   │   ├── ai.ts
│   │   ├── dashboard.ts
│   │   ├── user.ts
│   │   ├── settings.ts
│   │   ├── file.ts
│   │   ├── search.ts
│   │   ├── activity.ts
│   │   └── notification.ts
│   ├── trpc.ts                    # tRPC Setup
│   ├── context.ts                 # Request Context
│   └── middleware/
│       ├── auth.ts
│       ├── org-check.ts
│       ├── rbac.ts
│       └── rate-limit.ts
│
├── styles/                        # Global Styles
│   └── globals.css
│
├── public/                        # Statische Assets
│   ├── images/
│   │   ├── logo.svg
│   │   ├── logo-dark.svg
│   │   └── placeholders/
│   ├── fonts/
│   └── favicon.ico
│
├── supabase/                      # Supabase Konfiguration
│   ├── migrations/                # Datenbank-Migrationen
│   │   ├── 00000000000000_init.sql
│   │   ├── 20240101000001_venues.sql
│   │   ├── 20240101000002_artists.sql
│   │   ├── 20240101000003_events.sql
│   │   └── ...
│   ├── seed.sql                   # Entwicklungsdaten
│   └── functions/                 # Edge Functions
│       ├── send-email/index.ts
│       ├── process-webhook/index.ts
│       └── generate-pdf/index.ts
│
├── docker/
│   ├── Dockerfile                 # Next.js App
│   ├── Dockerfile.worker          # BullMQ Worker
│   └── docker-compose.yml
│
├── scripts/
│   ├── seed-dev.ts                # Dev-Daten generieren
│   ├── migrate.ts                 # Migration helper
│   └── setup-local.sh             # Lokales Setup
│
├── tests/                         # Test-Dateien
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .env.local
├── .eslintrc.json
├── .prettierrc
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── components.json                # shadcn/ui config
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

### 6.2 Wichtige Komponenten pro Modul

#### Dashboard-Module

| Widget | Datenquelle | Refresh | Interaktion |
|--------|-------------|---------|-------------|
| Naechste Events | `events` (nächste 5) | Realtime | Klick -> Event Detail |
| Finanz-Ueberblick | `transactions` (Monat) | 5 Min | Klick -> Finanzen |
| Offene Aufgaben | `event_checklist` (offen) | Realtime | Checkbox -> Toggle |
| Newsletter-Stats | `email_campaigns` (letzte) | 5 Min | Klick -> Newsletter |
| Mini-Kalender | `events` (aktueller Monat) | 5 Min | Klick -> Kalender |
| Venue-Auslastung | `events` pro Spielort | 5 Min | Klick -> Spielorte |

#### Event-Detail-Tabs

```
Event Detail [ID]
|-- Uebersicht      # Titel, Datum, Ort, Kuenstler, Status, Beschreibung
|-- Finanzen        # Budget, Gage, Einnahmen, Break-Even-Chart
|-- Gaesteliste     # Tickets, Reservierungen, Warteliste
|-- Checkliste      # Aufgaben mit Checkbox, Zuweisung, Deadline
|-- Kuenstler       # Verknuepfte Kuenstler mit Gage, Vertrag
|-- GEMA            # GEMA-Status, Werke-Liste, Meldung
|-- Presse          # Pressemitteilungen, Pressemappe
|-- Notizen         # Interne Notizen (Rich Text)
|-- Timeline        # Aenderungs-History
```

### 6.3 Routing-Struktur

| Route | Seite | Auth |
|-------|-------|------|
| `/login` | Login | Oeffentlich |
| `/register` | Registrierung | Oeffentlich |
| `/forgot-password` | Passwort vergessen | Oeffentlich |
| `/` | Dashboard Home | Authentifiziert |
| `/veranstaltungen` | Event-Liste | Authentifiziert |
| `/veranstaltungen/neu` | Event erstellen | Authentifiziert |
| `/veranstaltungen/[id]` | Event Detail | Authentifiziert |
| `/veranstaltungen/[id]/bearbeiten` | Event bearbeiten | Authentifiziert |
| `/spielorte` | Spielort-Liste | Authentifiziert |
| `/kuenstler` | Kuenstler-Liste | Authentifiziert |
| `/kalender` | Kalender | Authentifiziert |
| `/newsletter` | Newsletter Uebersicht | Authentifiziert |
| `/newsletter/campaigns` | Kampagnen-Liste | Authentifiziert |
| `/social` | Social Media | Authentifiziert |
| `/gema` | GEMA Uebersicht | Authentifiziert |
| `/finanzen` | Finanz-Dashboard | Authentifiziert |
| `/ticketing` | Ticketing | Authentifiziert |
| `/ki-assistent` | KI-Assistent | Authentifiziert |
| `/einstellungen` | Einstellungen | Authentifiziert |
| `/pressemappe/[slug]` | Oeffentliche Pressemappe | Oeffentlich |
| `/check-in/[eventId]` | Mobile Check-in | Oeffentlich |

### 6.4 Server/Client Komponenten Regeln

```
SERVER COMPONENTS (default):
- Layouts (`layout.tsx`)
- Loading States (`loading.tsx`)
- Error Boundaries (`error.tsx`)
- List-Views mit DataTable
- Dashboard-Widgets (Daten via tRPC)
- Detail-Seiten (Daten-Fetching)
- API Routes

CLIENT COMPONENTS ("use client"):
- Formulare (react-hook-form)
- Interaktive Widgets (DnD)
- Modals und Dialogs
- Kalender-Interaktionen
- Rich-Text-Editor
- QR-Code-Scanner
- Drag-and-Drop
- Animations
- Theme-Toggle
- Toast Notifications
- Realtime-Subscriptions
```


## 7. EXTERNE INTEGRATIONEN

### 7.1 SMTP-Provider fuer Newsletter

**Unterstuetzte Provider:** Brevo, SendGrid, rapidmail

```typescript
// lib/integrations/smtp/smtp-factory.ts
interface SMTPConfig {
  provider: 'brevo' | 'sendgrid' | 'rapidmail';
  apiKey: string;
  senderName: string;
  senderEmail: string;
  rateLimitPerSecond?: number;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  textBody?: string;
  from?: { name: string; email: string };
  replyTo?: string;
  attachments?: Array<{ filename: string; content: Buffer; mimeType: string }>;
  tags?: string[];
  trackingId?: string;
}

interface SendResult {
  messageId: string;
  status: 'sent' | 'delivered' | 'bounced' | 'failed';
  provider: string;
  error?: string;
}

// Brevo Client
class BrevoClient {
  private apiKey: string;
  private baseUrl = 'https://api.brevo.com/v3';

  async sendEmail(options: SendEmailOptions): Promise<SendResult> {
    const response = await fetch(`${this.baseUrl}/smtp/email`, {
      method: 'POST',
      headers: {
        'api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: options.from,
        to: Array.isArray(options.to) ? options.to.map(e => ({ email: e })) : [{ email: options.to }],
        subject: options.subject,
        htmlContent: options.htmlBody,
        textContent: options.textBody,
        replyTo: options.replyTo ? { email: options.replyTo } : undefined,
        tags: options.tags,
        headers: options.trackingId ? { 'X-Tracking-ID': options.trackingId } : undefined,
      }),
    });
    // ... error handling
  }

  async getStats(messageId: string): Promise<EmailStats> {
    // Brevo Webhook oder API Polling
  }
}

// SendGrid Client
class SendGridClient {
  private apiKey: string;
  private baseUrl = 'https://api.sendgrid.com/v3';

  async sendEmail(options: SendEmailOptions): Promise<SendResult> {
    const response = await fetch(`${this.baseUrl}/mail/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: Array.isArray(options.to) 
          ? options.to.map(e => ({ email: e })) 
          : [{ email: options.to }] }],
        from: options.from,
        subject: options.subject,
        content: [
          { type: 'text/plain', value: options.textBody },
          { type: 'text/html', value: options.htmlBody },
        ],
        custom_args: options.trackingId ? { trackingId: options.trackingId } : undefined,
      }),
    });
    // ... error handling
  }
}

// rapidmail Client
class RapidmailClient {
  private username: string;
  private password: string;
  private baseUrl = 'https://api.emailsys.net/v1';
  // ... analog zu Brevo
}

// Factory
export function createSMTPClient(config: SMTPConfig): SMTPClient {
  switch (config.provider) {
    case 'brevo': return new BrevoClient(config);
    case 'sendgrid': return new SendGridClient(config);
    case 'rapidmail': return new RapidmailClient(config);
    default: throw new Error(`Unsupported provider: ${config.provider}`);
  }
}
```

**Newsletter-Versand mit BullMQ:**
```typescript
// lib/queue/newsletter-queue.ts
import { Queue, Worker } from 'bullmq';
import { createSMTPClient } from '../integrations/smtp/smtp-factory';

export const newsletterQueue = new Queue('newsletter-sending', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

// Worker fuer Newsletter-Versand
export const newsletterWorker = new Worker('newsletter-sending', async (job) => {
  const { campaignId, subscriberId, subscriberEmail, subject, htmlBody, textBody, from, providerConfig } = job.data;
  
  const client = createSMTPClient(providerConfig);
  const result = await client.sendEmail({
    to: subscriberEmail,
    subject,
    htmlBody,
    textBody,
    from,
    trackingId: `${campaignId}-${subscriberId}`,
  });

  // Tracking in DB aktualisieren
  await db.campaignTracking.create({
    campaignId,
    subscriberId,
    messageId: result.messageId,
    status: result.status,
    sentAt: new Date(),
  });

  return result;
}, { 
  connection: redisConnection,
  concurrency: 10, // 10 E-Mails parallel
  limiter: { max: 50, duration: 1000 }, // 50/sec Rate Limit
});

// Campaign versenden
export async function sendCampaign(campaignId: string, orgId: string) {
  const campaign = await db.emailCampaigns.findUnique({ where: { id: campaignId } });
  const subscribers = await db.newsletterSubscribers.findMany({
    where: { 
      organizationId: orgId, 
      subscribed: true, 
      doubleOptIn: true,
      isBounced: false,
    },
  });

  // Jobs in Queue stellen
  const jobs = subscribers.map(sub => ({
    name: 'send-email',
    data: {
      campaignId,
      subscriberId: sub.id,
      subscriberEmail: sub.email,
      subject: campaign.subject,
      htmlBody: campaign.bodyHtml,
      textBody: campaign.bodyText,
      from: { name: campaign.senderName, email: campaign.senderEmail },
      providerConfig: orgSettings.smtpConfig,
    },
    opts: {
      delay: campaign.scheduledAt ? new Date(campaign.scheduledAt).getTime() - Date.now() : 0,
    },
  }));

  await newsletterQueue.addBulk(jobs);
  
  // Campaign-Status aktualisieren
  await db.emailCampaigns.update({
    where: { id: campaignId },
    data: { 
      status: campaign.scheduledAt ? 'scheduled' : 'sending',
      totalRecipients: subscribers.length,
    },
  });
}
```

### 7.2 Social Media APIs

```typescript
// lib/integrations/social/meta-client.ts
class MetaClient {
  private accessToken: string;
  private baseUrl = 'https://graph.facebook.com/v18.0';

  // Post erstellen
  async createPost(options: SocialPostOptions): Promise<SocialPostResult> {
    // Facebook: pages/{page-id}/feed
    // Instagram: {ig-user-id}/media (Container) -> publish
    const endpoint = options.platform === 'instagram' 
      ? `${this.baseUrl}/${this.igUserId}/media`
      : `${this.baseUrl}/${this.pageId}/feed`;
    
    const formData = new FormData();
    formData.append('message', options.content);
    if (options.mediaUrls?.[0]) formData.append('url', options.mediaUrls[0]);
    formData.append('access_token', this.accessToken);

    const response = await fetch(endpoint, { method: 'POST', body: formData });
    const data = await response.json();
    
    return {
      platformPostId: data.id,
      platformPostUrl: `https://facebook.com/${data.id}`,
      status: 'published',
    };
  }

  // Post planen
  async schedulePost(options: SocialPostOptions, scheduledAt: Date): Promise<SocialPostResult> {
    // Facebook: published=false, scheduled_publish_time=UNIX timestamp
    const timestamp = Math.floor(scheduledAt.getTime() / 1000);
    // ...
  }

  // Statistiken
  async getInsights(postId: string): Promise<SocialInsights> {
    const response = await fetch(
      `${this.baseUrl}/${postId}/insights?metric=post_impressions,post_clicks,post_reactions_by_type_total&access_token=${this.accessToken}`
    );
    // ...
  }
}

// lib/integrations/social/twitter-client.ts
class TwitterClient {
  private apiKey: string;
  private apiSecret: string;
  private accessToken: string;
  private accessTokenSecret: string;
  private baseUrl = 'https://api.twitter.com/2';

  async createPost(options: SocialPostOptions): Promise<SocialPostResult> {
    // OAuth 1.0a fuer Media Upload
    // POST /2/tweets
    const body: any = { text: options.content.substring(0, 280) };
    
    if (options.mediaUrls?.length) {
      const mediaId = await this.uploadMedia(options.mediaUrls[0]);
      body.media = { media_ids: [mediaId] };
    }

    const response = await fetch(`${this.baseUrl}/tweets`, {
      method: 'POST',
      headers: {
        'Authorization': this.buildOAuth1Header('POST', `${this.baseUrl}/tweets`),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return {
      platformPostId: data.data.id,
      platformPostUrl: `https://twitter.com/i/web/status/${data.data.id}`,
      status: 'published',
    };
  }

  private async uploadMedia(mediaUrl: string): Promise<string> {
    // OAuth 1.0a Media Upload
    // ...
  }
}

// Social Media Factory
export function createSocialClient(platform: string, accountConfig: any): SocialClient {
  switch (platform) {
    case 'facebook':
    case 'instagram': return new MetaClient(accountConfig);
    case 'twitter': return new TwitterClient(accountConfig);
    case 'linkedin': return new LinkedInClient(accountConfig);
    case 'tiktok': return new TikTokClient(accountConfig);
    default: throw new Error(`Unsupported platform: ${platform}`);
  }
}
```

### 7.3 Google Calendar API

```typescript
// lib/integrations/calendar/google-calendar.ts
class GoogleCalendarClient {
  private oauth2Client: OAuth2Client;
  private calendar: calendar_v3.Calendar;

  constructor(credentials: { clientId: string; clientSecret: string; redirectUri: string }) {
    this.oauth2Client = new google.auth.OAuth2(
      credentials.clientId,
      credentials.clientSecret,
      credentials.redirectUri
    );
    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  setCredentials(tokens: { access_token: string; refresh_token?: string; expiry_date?: number }) {
    this.oauth2Client.setCredentials(tokens);
  }

  // Event zu Google Calendar syncen
  async syncEvent(event: AppEvent): Promise<string> {
    const calendarEvent: calendar_v3.Schema$Event = {
      summary: event.title,
      description: event.description,
      start: {
        dateTime: `${event.date}T${event.startTime}`,
        timeZone: 'Europe/Berlin',
      },
      end: {
        dateTime: `${event.date}T${event.endTime || event.startTime}`,
        timeZone: 'Europe/Berlin',
      },
      location: event.venue?.address,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 1440 }, // 24h vorher
          { method: 'popup', minutes: 60 },   // 1h vorher
        ],
      },
    };

    const response = await this.calendar.events.insert({
      calendarId: 'primary',
      requestBody: calendarEvent,
    });

    return response.data.id!;
  }

  // Kalender-Liste abrufen
  async listCalendars(): Promise<Array<{ id: string; summary: string }>> {
    const response = await this.calendar.calendarList.list();
    return response.data.items?.map(c => ({ id: c.id!, summary: c.summary! })) || [];
  }
}
```

### 7.4 KI APIs (OpenAI, Ollama)

```typescript
// lib/integrations/ai/openai-client.ts
class OpenAIClient {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';
  private defaultModel = 'gpt-4o';
  private imageModel = 'dall-e-3';

  constructor(config: { apiKey: string; model?: string }) {
    this.apiKey = config.apiKey;
    if (config.model) this.defaultModel = config.model;
  }

  // Textgenerierung mit Streaming
  async generateText(
    prompt: string, 
    options: GenerateTextOptions = {},
    onChunk?: (chunk: string) => void
  ): Promise<GenerateResult> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model || this.defaultModel,
        messages: [
          { role: 'system', content: options.systemPrompt || 'Du bist ein Assistent fuer Kleinkunst-Veranstalter in Deutschland. Schreibe auf Deutsch.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: options.maxTokens || 500,
        temperature: options.temperature || 0.7,
        stream: !!onChunk,
      }),
    });

    if (onChunk) {
      // SSE Streaming
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                fullText += content;
                onChunk(content);
              }
            } catch { /* ignore parse errors */ }
          }
        }
      }
      
      return {
        text: fullText,
        tokensUsed: 0, // Wird spaeter berechnet
      };
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      tokensUsed: data.usage?.total_tokens || 0,
      inputTokens: data.usage?.prompt_tokens,
      outputTokens: data.usage?.completion_tokens,
    };
  }

  // Bildgenerierung
  async generateImage(
    prompt: string, 
    options: GenerateImageOptions = {}
  ): Promise<GenerateImageResult> {
    const sizeMap: Record<string, string> = {
      '1:1': '1024x1024',
      '16:9': '1792x1024',
      '9:16': '1024x1792',
      '3:4': '1024x1536',
      '4:3': '1536x1024',
    };

    const response = await fetch(`${this.baseUrl}/images/generations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.imageModel,
        prompt: prompt.substring(0, 1000),
        n: options.variations || 1,
        size: sizeMap[options.aspectRatio || '1:1'] || '1024x1024',
        quality: 'standard',
        style: options.style === 'photorealistic' ? 'vivid' : 'natural',
      }),
    });

    const data = await response.json();
    return {
      imageUrls: data.data.map((d: any) => d.url),
      revisedPrompt: data.data[0]?.revised_prompt,
      cost: 0.040 * (options.variations || 1), // DALL-E 3: $0.04 pro Bild
    };
  }

  // Kosten berechnen
  calculateCost(inputTokens: number, outputTokens: number): number {
    // GPT-4o: $5/1M input, $15/1M output
    const inputCost = (inputTokens / 1_000_000) * 5;
    const outputCost = (outputTokens / 1_000_000) * 15;
    return (inputCost + outputCost) * 0.92; // USD -> EUR
  }
}

// lib/integrations/ai/ollama-client.ts
class OllamaClient {
  private baseUrl: string;
  private model: string;

  constructor(config: { baseUrl: string; model?: string }) {
    this.baseUrl = config.baseUrl; // z.B. "http://localhost:11434"
    this.model = config.model || 'llama3.1';
  }

  async generateText(
    prompt: string, 
    options: GenerateTextOptions = {},
    onChunk?: (chunk: string) => void
  ): Promise<GenerateResult> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options.model || this.model,
        prompt: prompt,
        system: options.systemPrompt || 'Du bist ein Assistent fuer Kleinkunst-Veranstalter in Deutschland.',
        stream: !!onChunk,
        options: {
          temperature: options.temperature || 0.7,
          num_predict: options.maxTokens || 500,
        },
      }),
    });

    if (onChunk) {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value).split('\n');
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              fullText += parsed.response;
              onChunk(parsed.response);
            }
          } catch { /* ignore */ }
        }
      }

      return { text: fullText, tokensUsed: 0 };
    }

    const data = await response.json();
    return {
      text: data.response,
      tokensUsed: data.eval_count || 0,
    };
  }

  // Verfuegbare Modelle abrufen
  async listModels(): Promise<Array<{ name: string; size: number }>> {
    const response = await fetch(`${this.baseUrl}/api/tags`);
    const data = await response.json();
    return data.models?.map((m: any) => ({ name: m.name, size: m.size })) || [];
  }

  // Verbindung testen
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, { signal: AbortSignal.timeout(5000) });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// AI Factory
export function createAIClient(config: AIProviderConfig): AIClient {
  if (config.isLocal || config.providerType === 'ollama') {
    return new OllamaClient({
      baseUrl: config.apiBaseUrl || 'http://localhost:11434',
      model: config.modelName,
    });
  }
  return new OpenAIClient({
    apiKey: config.apiKey,
    model: config.modelName,
  });
}
```

### 7.5 GEMA Integration

**GEMA ist KEINE API-Integration.** Die GEMA-Abwicklung erfolgt manuell:

```typescript
// lib/services/gema-service.ts
class GemaService {
  // U-K-Tarif Berechnung
  calculateFee(visitors: number, ticketPrice: number): GemaCalculationResult {
    const bruttoEinnahmen = visitors * ticketPrice;
    
    // Tarif U-K: 5,75% der Bruttoeinnahmen
    const tarifSatz = 0.0575;
    let gemaGebuehr = bruttoEinnahmen * tarifSatz;
    
    // Mindestsatz: 23,55 EUR
    const mindestsatz = 23.55;
    if (gemaGebuehr < mindestsatz) {
      gemaGebuehr = mindestsatz;
    }
    
    return {
      bruttoEinnahmen,
      gemaGebuehr,
      tarifSatz: '5.75%',
      mindestsatz,
      nachweis: 'Anmeldeformular',
    };
  }

  // PDF-Export fuer GEMA-Meldung
  async generateRegistrationPDF(registrationId: string): Promise<Buffer> {
    const registration = await this.getRegistration(registrationId);
    const event = await this.getEvent(registration.eventId);
    const works = await this.getWorks(registrationId);
    
    // PDF via @react-pdf/renderer generieren
    return generateGemaPDF({
      veranstalter: event.organization,
      veranstaltung: event,
      werke: works,
      gesamtDauer: works.reduce((sum, w) => sum + (w.duration || 0), 0),
      meldeDatum: new Date(),
    });
  }

  // Erinnerung 7 Tage vor Event
  async scheduleReminder(eventId: string): Promise<void> {
    const event = await this.getEvent(eventId);
    const reminderDate = subDays(new Date(event.date), 7);
    
    await notificationQueue.add('gema-reminder', {
      eventId,
      message: `GEMA-Meldung fuer "${event.title}" am ${event.date} faellig!`,
    }, {
      delay: reminderDate.getTime() - Date.now(),
    });
  }
}
```

### 7.6 Supabase Storage

```typescript
// lib/integrations/storage/supabase-storage.ts
class SupabaseStorageService {
  private supabase: SupabaseClient;
  private bucketName = 'kleinkunst-media';

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  // Datei hochladen
  async uploadFile(
    file: File, 
    path: string, 
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    // Oeffentliche URL generieren
    const { data: urlData } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return {
      path: filePath,
      url: urlData.publicUrl,
      size: file.size,
      mimeType: file.type,
    };
  }

  // Bild mit Thumbnail
  async uploadImage(
    file: File, 
    path: string, 
    maxWidth: number = 1920
  ): Promise<UploadResult> {
    // Bild komprimieren/resize via Sharp (Server-seitig)
    const optimized = await optimizeImage(file, maxWidth);
    
    // Original hochladen
    const original = await this.uploadFile(file, `${path}/original`);
    
    // Thumbnail generieren (300x300)
    const thumbnail = await this.uploadFile(
      await generateThumbnail(file, 300, 300), 
      `${path}/thumbnails`
    );

    return {
      ...original,
      thumbnailUrl: thumbnail.url,
    };
  }

  // Datei loeschen
  async deleteFile(path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .remove([path]);
    
    if (error) throw error;
  }

  // Signierte URL fuer private Dateien
  async getSignedUrl(path: string, expiresIn: number = 3600): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .createSignedUrl(path, expiresIn);
    
    if (error) throw error;
    return data.signedUrl;
  }
}
```

### 7.7 Webhook-Handler

```typescript
// app/api/webhooks/brevo/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  
  // Brevo Webhook Events:
  // - request, deliver, open, click, bounce, spam, blocked, unsubscribed
  for (const event of payload) {
    const trackingId = event.messageId || event['X-Tracking-ID'];
    const [campaignId, subscriberId] = trackingId?.split('-') || [];
    
    switch (event.event) {
      case 'delivered':
        await updateCampaignStats(campaignId, { delivered: 1 });
        break;
      case 'open':
        await updateCampaignStats(campaignId, { opens: 1 });
        await updateSubscriberEngagement(subscriberId, 'open');
        break;
      case 'click':
        await updateCampaignStats(campaignId, { clicks: 1 });
        await updateSubscriberEngagement(subscriberId, 'click');
        break;
      case 'bounce':
        await handleBounce(subscriberId, event.reason);
        break;
      case 'unsubscribed':
        await handleUnsubscribe(subscriberId);
        break;
    }
  }

  return NextResponse.json({ received: true });
}

// app/api/webhooks/social/[platform]/route.ts
export async function POST(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform;
  const payload = await request.json();
  
  // Social Media Webhooks fuer Status-Updates
  // - Post published/failed
  // - Engagement updates
  
  await syncSocialPostStatus(platform, payload);
  
  return NextResponse.json({ received: true });
}
```


## 8. TESTING & QUALITY

### 8.1 Test-Strategie

```
TEST-PYRAMID:

         /\
        /  \     E2E Tests (Playwright)
       /    \    ~20 Tests (kritische User Flows)
      /------\
     /        \   Integration Tests (Vitest)
    /          \  ~100 Tests (API, Services, DB)
   /------------\
  /              \ Unit Tests (Vitest + RTL)
 /                \ ~300 Tests (Components, Utils, Hooks)
/__________________\
```

**Test-Abdeckungsziele:**
- Unit Tests: > 80% Coverage
- Integration Tests: > 60% Coverage
- E2E Tests: Alle kritischen User Flows

### 8.2 Unit Tests

```typescript
// tests/unit/lib/gema-calculator.test.ts
import { describe, it, expect } from 'vitest';
import { calculateGemaFee } from '@/lib/services/gema-service';

describe('GEMA Tarifrechner', () => {
  it('berechnet 5,75% fuer normale Events', () => {
    const result = calculateGemaFee(100, 20);
    expect(result.bruttoEinnahmen).toBe(2000);
    expect(result.gemaGebuehr).toBe(115); // 2000 * 0.0575
  });

  it('wendet Mindestsatz 23,55 EUR an', () => {
    const result = calculateGemaFee(10, 10);
    // 100 * 0.0575 = 5.75 < 23.55 -> Mindestsatz
    expect(result.gemaGebuehr).toBe(23.55);
  });

  it('berechnet korrekt fuer grosse Events', () => {
    const result = calculateGemaFee(500, 25);
    expect(result.bruttoEinnahmen).toBe(12500);
    expect(result.gemaGebuehr).toBe(718.75); // 12500 * 0.0575
  });
});

// tests/unit/components/event-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EventForm } from '@/components/events/event-form';

describe('EventForm', () => {
  it('zeigt Validierungsfehler fuer leeren Titel', async () => {
    render(<EventForm onSubmit={vi.fn()} />);
    
    const submitButton = screen.getByRole('button', { name: /speichern/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Titel ist erforderlich/i)).toBeInTheDocument();
    });
  });

  it('schickt Formular mit gueltigen Daten ab', async () => {
    const onSubmit = vi.fn();
    render(<EventForm onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/Titel/i), {
      target: { value: 'Jazz Abend' },
    });
    fireEvent.change(screen.getByLabelText(/Datum/i), {
      target: { value: '2026-08-15' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /speichern/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Jazz Abend',
        date: '2026-08-15',
      }));
    });
  });
});
```

### 8.3 Integration Tests

```typescript
// tests/integration/api/events.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createCaller } from '@/server/trpc';
import { testDb, createTestUser, createTestOrg } from '@/tests/helpers';

describe('Event API', () => {
  let caller: ReturnType<typeof createCaller>;
  let orgId: string;
  let userId: string;

  beforeAll(async () => {
    const org = await createTestOrg();
    const user = await createTestUser(org.id);
    orgId = org.id;
    userId = user.id;
    caller = createCaller({ user, organization: org });
  });

  it('erstellt ein Event', async () => {
    const venue = await testDb.venues.create({
      data: { organizationId: orgId, name: 'Test Venue', capacity: 200 },
    });

    const event = await caller.event.create({
      title: 'Test Event',
      date: '2026-08-15',
      venueId: venue.id,
      ticketPrice: 20,
      capacity: 150,
    });

    expect(event.title).toBe('Test Event');
    expect(event.status).toBe('draft');
  });

  it('listet Events mit Filter', async () => {
    const result = await caller.event.list({
      page: 1,
      limit: 10,
      status: 'draft',
    });

    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].status).toBe('draft');
  });

  it('verweigert Zugriff auf fremde Organisation', async () => {
    const otherOrg = await createTestOrg();
    const otherCaller = createCaller({ 
      user: { id: userId }, 
      organization: otherOrg 
    });

    await expect(
      otherCaller.event.list({ page: 1, limit: 10 })
    ).rejects.toThrow('FORBIDDEN');
  });

  afterAll(async () => {
    await testDb.$disconnect();
  });
});
```

### 8.4 E2E Tests (Playwright)

```typescript
// tests/e2e/event-lifecycle.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Event Lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('vollstaendiger Event Lifecycle', async ({ page }) => {
    // 1. Event erstellen
    await page.click('a[href="/veranstaltungen/neu"]');
    await page.waitForURL('/veranstaltungen/neu');
    
    await page.fill('[name="title"]', 'Jazz Abend mit Max Mustermann');
    await page.fill('[name="date"]', '2026-09-15');
    await page.selectOption('[name="venueId"]', { label: 'Test Venue' });
    await page.fill('[name="ticketPrice"]', '25');
    await page.fill('[name="capacity"]', '150');
    
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/veranstaltungen\/[\w-]+$/);
    
    // 2. Event-Detail pruefen
    await expect(page.locator('h1')).toContainText('Jazz Abend');
    await expect(page.locator('[data-testid="event-status"]')).toContainText('Entwurf');
    
    // 3. Status auf "Geplant" aendern
    await page.click('[data-testid="status-dropdown"]');
    await page.click('text=Geplant');
    await expect(page.locator('[data-testid="event-status"]')).toContainText('Geplant');
    
    // 4. Event loeschen (Soft Delete)
    await page.click('[data-testid="delete-event"]');
    await page.click('[data-testid="confirm-delete"]');
    await page.waitForURL('/veranstaltungen');
    
    // 5. Geloeschtes Event nicht in Liste
    await expect(page.locator('text=Jazz Abend')).not.toBeVisible();
  });

  test('Newsletter Double-Opt-In Flow', async ({ page }) => {
    await page.goto('/newsletter/subscribers');
    
    // Subscriber hinzufuegen
    await page.click('text=Neuer Abonnent');
    await page.fill('[name="email"]', 'neu@example.com');
    await page.fill('[name="firstName"]', 'Max');
    await page.click('button[type="submit"]');
    
    // Status: "Warte auf Bestaetigung"
    await expect(page.locator('text=neu@example.com')).toBeVisible();
    await expect(page.locator('text=Warte auf Bestaetigung')).toBeVisible();
    
    // Bestaetigungs-E-Mail simulieren (via API)
    // ...
    
    // Status: "Bestaetigt"
    await page.reload();
    await expect(page.locator('text=Bestaetigt')).toBeVisible();
  });
});
```

### 8.5 Test-Konfiguration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/',
      ],
    },
    include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx', 'tests/integration/**/*.test.ts'],
  },
});

// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});

// tests/setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { getSession: vi.fn(), onAuthStateChange: vi.fn() },
    from: vi.fn(),
    storage: { from: vi.fn() },
  }),
}));

// Cleanup nach jedem Test
afterEach(() => {
  cleanup();
});
```

### 8.6 Performance-Anforderungen

| Metrik | Ziel | Messung |
|--------|------|---------|
| **Time to First Byte (TTFB)** | < 200ms | Lighthouse |
| **First Contentful Paint (FCP)** | < 1.5s | Lighthouse |
| **Largest Contentful Paint (LCP)** | < 2.5s | Lighthouse |
| **Time to Interactive (TTI)** | < 3.5s | Lighthouse |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Lighthouse |
| **Dashboard-Load** | < 2s | Custom Timing |
| **Datenbank-Query** | < 100ms | PostgreSQL logs |
| **API-Response** | < 200ms | tRPC timing |
| **Image-Load** | < 1s | Lighthouse |

**Performance-Massnahmen:**
- Server Components fuer initiales Rendering
- `next/image` fuer automatische Optimierung
- Code-Splitting pro Route
- TanStack Query Caching (stale-while-revalidate)
- PostgreSQL-Indizes auf allen Filter-Spalten
- Redis Caching fuer haeufige Queries
- BullMQ fuer Hintergrund-Jobs
- `React.lazy()` fuer grosse Komponenten
- Bundle-Analyse via `@next/bundle-analyzer`

### 8.7 Security-Anforderungen

```typescript
// Security-Checkliste

// 1. SQL Injection: NIE raw SQL. Immer Prepared Statements/ORM.
//    Status: Supabase client + RLS -> ABGEDECKT

// 2. XSS: NIE user input direkt rendern. Immer escapen.
//    Status: React escapet automatisch + CSP Header

// 3. CSRF: SameSite Cookies + CSRF Token.
//    Status: Supabase Auth mit SameSite=Lax

// 4. Auth: JWT mit kurzer Lebensdauer (1h), Refresh Token (7 Tage).
//    Status: Supabase Auth konfiguriert

// 5. RBAC: Rollen pruefen auf jeder tRPC Procedure.
//    Status: protectedProcedure + orgCheck middleware

// 6. Rate Limiting: 100 Requests/Min pro User.
//    Status: BullMQ rate limiter

// 7. File Upload: Type checking, Size limit, Virus scan.
//    Status: Supabase Storage + Client-seitige Validierung

// 8. API Keys: NIE im Frontend. Immer Server-seitig.
//    Status: Server Components + tRPC

// 9. HTTPS: Immer. HSTS Header.
//    Status: Traefik auto-SSL

// 10. Dependencies: Regelmaessig audit via npm audit.
//     Status: GitHub Dependabot + npm audit in CI
```

**Content Security Policy:**
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://*.supabase.co https://images.unsplash.com;
  font-src 'self';
  connect-src 'self' https://*.supabase.co https://api.openai.com;
  frame-src 'none';
  object-src 'none';
```

**Security Headers (via Next.js):**
```javascript
// next.config.js
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Content-Security-Policy', value: '...' },
];

module.exports = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};
```

---

## 9. DEPLOYMENT

### 9.1 Docker Compose Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: docker/Dockerfile
    container_name: kleinkunst-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - REDIS_URL=redis://redis:6379
      - SMTP_PROVIDER=${SMTP_PROVIDER}
      - SMTP_API_KEY=${SMTP_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - redis
    networks:
      - kleinkunst-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`app.kleinkunst.de`)"
      - "traefik.http.routers.app.tls.certresolver=letsencrypt"
      - "traefik.http.services.app.loadbalancer.server.port=3000"

  worker:
    build:
      context: .
      dockerfile: docker/Dockerfile.worker
    container_name: kleinkunst-worker
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - SMTP_PROVIDER=${SMTP_PROVIDER}
      - SMTP_API_KEY=${SMTP_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - redis
    networks:
      - kleinkunst-network

  redis:
    image: redis:7-alpine
    container_name: kleinkunst-redis
    restart: unless-stopped
    volumes:
      - redis-data:/data
    networks:
      - kleinkunst-network

  traefik:
    image: traefik:v3.0
    container_name: kleinkunst-traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik/traefik.yml:/etc/traefik/traefik.yml:ro
      - ./traefik/dynamic:/etc/traefik/dynamic:ro
      - traefik-certs:/letsencrypt
    networks:
      - kleinkunst-network

volumes:
  redis-data:
  traefik-certs:

networks:
  kleinkunst-network:
    driver: bridge
```

```dockerfile
# docker/Dockerfile (Next.js App)
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

```dockerfile
# docker/Dockerfile.worker (BullMQ Worker)
FROM node:20-alpine AS base

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build:worker

CMD ["node", "dist/worker.js"]
```

### 9.2 Hetzner Deployment

```bash
#!/bin/bash
# scripts/deploy-hetzner.sh

# Server: Hetzner Cloud CX41 (4 vCPU, 16 GB RAM, 160 GB SSD) = ~14 EUR/Monat
# OS: Ubuntu 22.04 LTS
# Location: Falkenstein (DE) fuer DSGVO

# 1. Server vorbereiten
ssh root@<server-ip> "
  apt update && apt upgrade -y
  apt install -y docker.io docker-compose-plugin git
  systemctl enable docker
  
  # Firewall
  ufw allow 22/tcp
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw enable
"

# 2. Code deployen
rsync -avz --exclude node_modules --exclude .git --exclude .env ./ root@<server-ip>:/opt/kleinkunst/

# 3. Environment setzen
ssh root@<server-ip> "
  cd /opt/kleinkunst
  echo 'DATABASE_URL=postgresql://...' > .env
  echo 'SUPABASE_URL=https://...' >> .env
  echo 'SUPABASE_ANON_KEY=...' >> .env
  echo 'SUPABASE_SERVICE_ROLE_KEY=...' >> .env
  echo 'REDIS_URL=redis://redis:6379' >> .env
  echo 'SMTP_PROVIDER=brevo' >> .env
  echo 'SMTP_API_KEY=...' >> .env
  echo 'OPENAI_API_KEY=...' >> .env
  echo 'NEXTAUTH_SECRET=...' >> .env
"

# 4. Starten
ssh root@<server-ip> "
  cd /opt/kleinkunst
  docker compose pull
  docker compose up -d --build
  docker compose exec app npx prisma migrate deploy
"

# 5. Health Check
curl -f https://app.kleinkunst.de/api/health || exit 1

echo 'Deployment erfolgreich!'
```

### 9.3 Environment Variablen

```env
# .env.example

# === APP KONFIGURATION ===
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Kleinkunst Pro

# === SUPABASE ===
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# === DATABASE ===
DATABASE_URL=postgresql://postgres:password@localhost:54322/postgres

# === REDIS ===
REDIS_URL=redis://localhost:6379

# === AUTH ===
NEXTAUTH_SECRET=your-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# === SMTP / E-MAIL ===
SMTP_PROVIDER=brevo
SMTP_API_KEY=xkeysib-...
SMTP_FROM_NAME=Kleinkunst Pro
SMTP_FROM_EMAIL=noreply@kleinkunst.de

# === KI ===
OPENAI_API_KEY=sk-...
OLLAMA_BASE_URL=http://localhost:11434

# === SOCIAL MEDIA ===
META_APP_ID=...
META_APP_SECRET=...
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...

# === GOOGLE CALENDAR ===
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# === MONITORING ===
SENTRY_DSN=https://...
UPTIME_KUMA_URL=https://...

# === STORAGE ===
SUPABASE_STORAGE_BUCKET=kleinkunst-media

# === FEATURE FLAGS ===
FEATURE_AI_ASSISTANT=true
FEATURE_SOCIAL_MEDIA=true
FEATURE_GEMA=true
FEATURE_ADVANCED_ANALYTICS=false
```

### 9.4 Backup-Strategie

```bash
#!/bin/bash
# scripts/backup.sh

# Taegliches Backup um 3:00 Uhr
# Aufbewahrung: 30 Tage

BACKUP_DIR=/opt/backups/kleinkunst
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# 1. PostgreSQL Backup (via Supabase CLI oder pg_dump)
pg_dump $DATABASE_URL | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# 2. Supabase Storage Backup
# Dateien aus Supabase Storage exportieren
node scripts/backup-storage.js $BACKUP_DIR/storage_$DATE

# 3. Redis Backup
docker exec kleinkunst-redis redis-cli BGSAVE
cp /var/lib/docker/volumes/kleinkunst_redis-data/_data/dump.rdb $BACKUP_DIR/redis_$DATE.rdb

# 4. Alte Backups loeschen
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.rdb" -mtime +$RETENTION_DAYS -delete

# 5. Backup auf externen Storage hochladen (optional)
# rclone sync $BACKUP_DIR remote:kleinkunst-backups

echo "Backup abgeschlossen: $DATE"
```

**Backup-Plan:**
| Typ | Frequenz | Aufbewahrung | Methode |
|-----|----------|--------------|---------|
| Datenbank | Taeglich 3:00 | 30 Tage | pg_dump + gzip |
| Storage | Woechentlich | 12 Wochen | rclone sync |
| Redis | Taeglich 3:00 | 7 Tage | RDB Snapshot |
| Config | Bei Aenderung | 10 Versionen | Git |

### 9.5 Monitoring

```yaml
# monitoring/docker-compose.monitoring.yml
version: '3.8'

services:
  uptime-kuma:
    image: louislam/uptime-kuma:latest
    container_name: uptime-kuma
    restart: unless-stopped
    ports:
      - "3001:3001"
    volumes:
      - uptime-kuma-data:/app/data
    networks:
      - monitoring-network

  # Sentry Self-Hosted (optional) oder Cloud

volumes:
  uptime-kuma-data:

networks:
  monitoring-network:
```

**Monitoring-Checks:**
- App erreichbar (HTTP 200)
- API Response Time < 500ms
- Datenbank-Verbindung
- Redis-Verbindung
- SSL-Zertifikat Gueltigkeit
- Domain-Ablaufdatum
- Backup-Erfolg
- Disk Space > 20%
- Memory Usage < 90%
- CPU Usage < 90%

### 9.6 GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - run: npm run test:integration

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
```

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup SSH
        uses: webfactory/ssh-agent@v0.8.0
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}
      
      - name: Deploy to Hetzner
        run: |
          ssh -o StrictHostKeyChecking=no ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }} << 'EOF'
            cd /opt/kleinkunst
            git pull origin main
            docker compose pull
            docker compose up -d --build
            docker compose exec -T app npx prisma migrate deploy
            docker system prune -f
          EOF
      
      - name: Health Check
        run: |
          sleep 30
          curl -f https://app.kleinkunst.de/api/health || exit 1
      
      - name: Notify on Success
        if: success()
        run: echo "Deployment successful!"
      
      - name: Notify on Failure
        if: failure()
        run: echo "Deployment failed!"
```

---

## 10. NACHTRAEGLICHE AENDERUNGEN

### 10.1 Aenderungsdokumentation

Jede Aenderung an diesem Prompt MUSS dokumentiert werden:

```
Format:
[YYYY-MM-DD] [Version] [Autor] - [Beschreibung]

Beispiele:
[2026-07-15] [1.0] [Produktarchitekt] - Initiale Version
[2026-07-20] [1.1] [Tech Lead] - GEMA-Modul um Echtzeit-Berechnung erweitert
[2026-07-25] [1.2] [UX Designer] - Dashboard-Widgets neu angeordnet
```

### 10.2 Aenderungsprozess

1. **Aenderung vorschlagen:** Issue im Projekt-Repo erstellen
2. **Review:** Tech Lead prueft technische Machbarkeit
3. **Genehmigung:** Product Owner genehmigt
4. **Umsetzung:** Entwickler implementiert
5. **Dokumentation:** Aenderung in diesem Abschnitt eintragen
6. **Version bump:** Versionsnummer erhoehen

### 10.3 Changelog

| Version | Datum | Autor | Aenderungen |
|---------|-------|-------|-------------|
| 1.0 | 2026-07-15 | Produktarchitekt | Initiale Version - Alle 10 Sprints, vollstaendiges Datenbankschema, API-Spezifikation, Komponenten-Architektur, Externe Integrationen, Testing, Deployment |

### 10.4 Bekannte Einschraenkungen & Tech Debt

1. **GEMA-Integration:** Keine API vorhanden - manueller PDF-Export
2. **Social Media:** API-Limits der Plattformen beachten (Instagram besonders restriktiv)
3. **KI-Kosten:** OpenAI-Kosten muessen monatlich ueberwacht werden
4. **Ollama:** Nur fuer lokale Installation verfuegbar
5. **Echtzeit:** Supabase Realtime hat Limits bei >1000 gleichzeitigen Verbindungen
6. **Datei-Upload:** Max. 50MB pro Datei, max. 5GB pro Organisation
7. **Newsletter-Versand:** Rate Limiting pro SMTP-Provider (typisch 50-100 E-Mails/Sekunde)
8. **Mobile Check-in:** Erfordert Internet-Verbindung (Offline-Modus begrenzt)

---

## ANHANG A: GLOSSAR

| Begriff | Bedeutung |
|---------|-----------|
| **Kleinkunst** | Kleine, meist kulturveranstaltende Programme (Jazz, Kabarett, Lesungen, etc.) |
| **Spielort** | Veranstaltungsort (Theater, Club, Cafe, etc.) |
| **GEMA** | Gesellschaft fuer musikalische Auffuehrungs- und mechanische Vervielfaeltigungsrechte |
| **U-K Tarif** | GEMA-Tarif fuer Unterhaltungsmusik in Kneipen/Clubs |
| **VVK/AK** | Vorverkauf / Abendkasse |
| **PWYW** | Pay What You Want (Zahl-was-du-willst) |
| **RLS** | Row Level Security (Datenbank-Sicherheit auf Zeilenebene) |
| **tRPC** | TypeScript RPC - typsichere APIs |
| **BullMQ** | Redis-basierte Job-Queue fuer Node.js |
| **shadcn/ui** | Sammlung wiederverwendbarer UI-Komponenten |

## ANHANG B: QUICK-REFERENCE

### Nuetzliche Commands

```bash
# Entwicklung
npm run dev              # Dev-Server starten
npm run build            # Produktions-Build
npm run start            # Produktions-Server
npm run lint             # ESLint
npm run type-check       # TypeScript

# Tests
npm run test:unit        # Unit Tests (Vitest)
npm run test:unit:watch  # Unit Tests (Watch)
npm run test:integration # Integration Tests
npm run test:e2e         # E2E Tests (Playwright)
npm run test:e2e:ui      # E2E Tests mit UI

# Datenbank
npx prisma migrate dev   # Migration erstellen
npx prisma migrate deploy # Migration deployen
npx prisma studio        # DB Studio
npx prisma generate      # Client generieren

# Supabase
npx supabase start       # Lokale Supabase starten
npx supabase stop        # Lokale Supabase stoppen
npx supabase db reset    # DB zuruecksetzen
npx supabase db push     # Migrationen pushen

# Docker
docker compose up -d     # Stack starten
docker compose logs -f   # Logs anzeigen
docker compose down      # Stack stoppen

# Backup
./scripts/backup.sh      # Backup erstellen
./scripts/restore.sh     # Backup wiederherstellen
```

---

> **ENDE DES CODING PROMPTS**
>
> Dieser Prompt enthaelt alle notwendigen Spezifikationen fuer die vollstaendige Implementierung der Kleinkunst-Veranstalter Dashboard App.
> Bei Unklarheiten: Kontext aus den Quelldateien (dim01-dim12) beachten.


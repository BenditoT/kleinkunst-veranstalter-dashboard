# Dimension 10: Dashboard UX/UI Design & Komponenten-Architektur

## Kleinkunst-Veranstalter Dashboard-App — v1.0 Spezifikation

---

## 1. Feature-Beschreibung

Das Dashboard UX/UI Design & Komponenten-Architektur-Modul bildet die zentrale Benutzeroberfläche der gesamten Kleinkunst-Veranstalter-App. Es definiert das visuelle Erscheinungsbild, die Interaktionsmuster, die Navigation und die gesamte Komponenten-Bibliothek. Das Modul basiert auf einem Widget-basierten Dashboard mit Drag-and-Drop-Anpassung, Dark/Light Mode, globaler Suche und einem responsiven Layout-System. Kernprinzipien sind die **10-Sekunden-Regel** (<7 visuelle Elemente pro Widget), **Progressive Disclosure** (Informationen schichtweise aufdecken), **Text-Labels statt Icons** (für Nicht-Techniker) und **WCAG 2.2 AA** als Accessibility-Minimum.

**Hauptziele:**
- Intuitives, nicht-technisches UI fuer Veranstalter, Kuenstler und Kulturmanagement
- Wiederverwendbare, konsistente Komponentenbibliothek
- Vollstaendige Route- und Seitenstruktur der Applikation
- Dark/Light Mode mit Design-Tokens
- Drag-and-Drop-Dashboard-Anpassung

---

## 2. User Stories

### US-10.1: Dashboard-Home (Veranstalter)
> Als **Veranstalter** moechte ich auf meinem Dashboard eine Uebersicht meiner naechsten Events, offenen Aufgaben und wichtigsten Kennzahlen sehen, damit ich innerhalb von 10 Sekunden den Status meiner Veranstaltungen erfassen kann.

**Akzeptanzkriterien:**
- Maximal 7 visuelle Elemente pro Widget
- Widgets zeigen: Naechste Events, Newsletter-Stats, Finanz-Ueberblick, offene Aufgaben
- Dashboard laedt in <2 Sekunden
- Alle Daten sind auf einen Blick ohne Scrollen sichtbar (Above the Fold)

### US-10.2: Widget-Drag-and-Drop (Veranstalter)
> Als **Veranstalter** moechte ich Dashboard-Widgets per Drag-and-Drop verschieben, in der Groesse anpassen und hinzufuegen/entfernen koennen, damit ich mein Dashboard nach meinen persoenlichen Prioritaeten gestalten kann.

**Akzeptanzkriterien:**
- Widget-Positionen werden serverseitig gespeichert
- Resize-Handles auf allen Widget-Kanten
- Drag-Preview waehrend des Verschiebens
- Layout bleibt nach Neuladen erhalten
- Mobile: Touch-Drag-and-Drop unterstuetzt

### US-10.3: Dark Mode (alle Rollen)
> Als **Benutzer** moechte ich zwischen Dark Mode und Light Mode wechseln koennen, damit ich bei abendlicher/nachtlicher Arbeit (typisch fuer Veranstalter) die Augen schone.

**Akzeptanzkriterien:**
- Soft Dark: Hintergrund #0f172a, desaturierte Farben
- Umstellung ohne Seitenreload (<200ms)
- Praeferenz wird serverseitig gespeichert
- System-Praeferenz wird bei erstem Besuch beruecksichtigt
- Alle Komponenten rendern korrekt in beiden Modi

### US-10.4: Globale Suche (alle Rollen)
> Als **Benutzer** moechte ich Events, Kuenstler, Orte und Kontakte ueber eine globale Suchleiste durchsuchen koennen, damit ich schnell zu gesuchten Informationen gelange.

**Akzeptanzkriterien:**
- Cmd/Ctrl+K Shortcut oeffnet die Suche
- Echtzeit-Suche mit Debounce (300ms)
- Suchergebnisse gruppiert nach Entitaetstyp
- Keyboard-Navigation (Pfeiltasten, Enter)
- Historie der letzten 10 Suchen

### US-10.5: Notification-Inbox (alle Rollen)
> Als **Benutzer** moechte ich Benachrichtigungen (neue Buchungen, Deadline-Erinnerungen, System-Meldungen) in einer zentralen Inbox sehen und als gelesen markieren koennen, damit ich keine wichtigen Informationen verpasse.

**Akzeptanzkriterien:**
- Ungelesen-Zaehler im Header
- Nach Kategorie filterbar (Events, Finanzen, System, KI-Empfehlungen)
- Benachrichtigungen als gelesen/ungelesen markieren
- Archivieren/Loeschen von Benachrichtigungen
- Echtzeit-Updates via WebSocket

### US-10.6: Responsive Design (Mobile-Benutzer)
> Als **Benutzer** moechte ich die App sowohl auf dem Desktop (12-Spalten) als auch auf dem Tablet (8-Spalten) und Smartphone (4-Spalten) nutzen koennen, damit ich unterwegs Zugriff auf meine Daten habe.

**Akzeptanzkriterien:**
- Mobile: 4-Spalten-Grid, Sidebar als Drawer
- Tablet: 8-Spalten-Grid, Sidebar kollabierbar
- Desktop: 12-Spalten-Grid, Sidebar immer sichtbar
- Touch-Ziele mind. 44x44px auf Mobile
- Kein horizontaler Scroll unter 375px Breite

### US-10.7: KI-Widgets (Veranstalter)
> Als **Veranstalter** moechte ich ein KI-Widget auf meinem Dashboard haben, das mir Erkenntnisse aus meinen Daten praesentiert (z.B. "Event X hat 30% weniger Verkaufe als vergleichbare Events"), damit ich datengestuetzte Entscheidungen treffen kann.

**Akzeptanzkriterien:**
- NLP-Querying: Natuerlichsprachliche Fragen an Daten
- Predictive Analytics: Prognosen fuer Event-Auslastung
- KI-Empfehlungen als separate Notification-Kategorie
- Erklaerbarkeit: Jede KI-Aussage mit Begruendung
- Opt-in/opt-out fuer KI-Features

---

## 3. Datenmodell

### 3.1 Tabelle: `user_dashboard_layouts`
Speichert die individuellen Dashboard-Layouts pro Benutzer.

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `user_id` | UUID (FK -> users.id) | Zugehoeriger Benutzer |
| `layout_name` | VARCHAR(100) | Name des Layouts (z.B. "Standard", "Event-Fokus") |
| `is_default` | BOOLEAN | Ist das Standard-Layout |
| `widgets` | JSONB | Widget-Konfigurationen (Position, Groesse, Typ, Einstellungen) |
| `theme_preference` | ENUM('dark', 'light', 'system') | Theme-Einstellung |
| `created_at` | TIMESTAMP | Erstellungsdatum |
| `updated_at` | TIMESTAMP | Letzte Aktualisierung |

**Beispiel JSONB `widgets`:**
```json
[
  {
    "id": "widget-1",
    "type": "upcoming_events",
    "x": 0, "y": 0,
    "w": 4, "h": 3,
    "minW": 2, "minH": 2,
    "settings": { "maxEvents": 5, "showFilters": true }
  },
  {
    "id": "widget-2",
    "type": "finance_overview",
    "x": 4, "y": 0,
    "w": 4, "h": 3,
    "settings": { "period": "current_month" }
  }
]
```

### 3.2 Tabelle: `notifications`
Zentrale Benachrichtigungen fuer alle Benutzer.

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `user_id` | UUID (FK -> users.id) | Empfaenger |
| `type` | ENUM('event', 'finance', 'system', 'ai_recommendation', 'reminder') | Kategorie |
| `title` | VARCHAR(255) | Titel der Benachrichtigung |
| `message` | TEXT | Detailnachricht |
| `priority` | ENUM('low', 'medium', 'high', 'urgent') | Prioritaet |
| `is_read` | BOOLEAN | Gelesen-Status |
| `is_archived` | BOOLEAN | Archiviert |
| `action_url` | VARCHAR(500) | Optional: Deep-Link zur relevanten Seite |
| `metadata` | JSONB | Zusatzdaten (Event-ID, Betrag, etc.) |
| `created_at` | TIMESTAMP | Erstellungsdatum |
| `read_at` | TIMESTAMP | Zeitpunkt des Lesens |

### 3.3 Tabelle: `notification_preferences`
Benachrichtigungseinstellungen pro Benutzer.

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `user_id` | UUID (FK -> users.id) | Benutzer |
| `channel` | ENUM('in_app', 'email', 'push') | Kommunikationskanal |
| `notification_type` | ENUM('event', 'finance', 'system', 'ai_recommendation', 'reminder') | Typ |
| `is_enabled` | BOOLEAN | Aktiviert |
| `updated_at` | TIMESTAMP | Letzte Aenderung |

### 3.4 Tabelle: `search_index` (Optional: Full-Text-Search)
Denormalisierter Suchindex fuer globale Suche.

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `entity_type` | ENUM('event', 'artist', 'venue', 'contact', 'newsletter', 'document') | Entitaetstyp |
| `entity_id` | UUID | ID der Entitaet |
| `title` | VARCHAR(500) | Suchbarer Titel |
| `description` | TEXT | Suchbarer Inhalt |
| `tags` | TEXT[] | Schlagwoerter |
| `search_vector` | TSVECTOR | PostgreSQL Full-Text-Search Vektor |
| `updated_at` | TIMESTAMP | Letzte Index-Aktualisierung |

### Beziehungen:
```
users (1) ----< user_dashboard_layouts (N)
users (1) ----< notifications (N)
users (1) ----< notification_preferences (N)
```

---

## 4. API-Endpunkte

### 4.1 Dashboard & Widgets

| Methode | Endpoint | Beschreibung |
|---------|----------|-------------|
| `GET` | `/api/dashboard/layouts` | Alle Layouts des aktuellen Benutzers abrufen |
| `GET` | `/api/dashboard/layouts/:id` | Einzelnes Layout abrufen |
| `POST` | `/api/dashboard/layouts` | Neues Layout erstellen |
| `PUT` | `/api/dashboard/layouts/:id` | Layout aktualisieren (Widget-Positionen, Groessen) |
| `DELETE` | `/api/dashboard/layouts/:id` | Layout loeschen |
| `POST` | `/api/dashboard/layouts/:id/default` | Als Standard-Layout setzen |
| `GET` | `/api/dashboard/widgets/types` | Verfuegbare Widget-Typen abrufen |

### 4.2 Notifications

| Methode | Endpoint | Beschreibung |
|---------|----------|-------------|
| `GET` | `/api/notifications` | Benachrichtigungen abrufen (paginiert, filterbar) |
| `GET` | `/api/notifications/unread-count` | Anzahl ungelesener Benachrichtigungen |
| `PATCH` | `/api/notifications/:id/read` | Als gelesen markieren |
| `PATCH` | `/api/notifications/read-all` | Alle als gelesen markieren |
| `PATCH` | `/api/notifications/:id/archive` | Archivieren |
| `DELETE` | `/api/notifications/:id` | Loeschen |
| `GET` | `/api/notifications/preferences` | Einstellungen abrufen |
| `PUT` | `/api/notifications/preferences` | Einstellungen aktualisieren |

### 4.3 Globale Suche

| Methode | Endpoint | Beschreibung |
|---------|----------|-------------|
| `GET` | `/api/search?q=TERM&types=event,artist,venue&limit=10` | Globale Suche |
| `GET` | `/api/search/suggestions?q=PARTIAL` | Autocomplete-Vorschlaege |
| `GET` | `/api/search/history` | Suchhistorie des Benutzers |
| `DELETE` | `/api/search/history` | Suchhistorie loeschen |

### 4.4 Theme/Preferences

| Methode | Endpoint | Beschreibung |
|---------|----------|-------------|
| `GET` | `/api/user/preferences` | Benutzereinstellungen abrufen |
| `PUT` | `/api/user/preferences` | Benutzereinstellungen aktualisieren (Theme, Sprache, etc.) |

### 4.5 KI-Widgets

| Methode | Endpoint | Beschreibung |
|---------|----------|-------------|
| `POST` | `/api/ai/query` | NLP-Query an Daten stellen |
| `GET` | `/api/ai/insights` | KI-generierte Erkenntnisse abrufen |
| `GET` | `/api/ai/predictions/:eventId` | Vorhersagen fuer Event-Auslastung |

---

## 5. UI-Komponenten

### 5.1 Layout-Komponenten (Struktur)

| Komponente | Pfad | Beschreibung |
|------------|------|-------------|
| `AppShell` | `components/layout/AppShell.tsx` | Root-Layout: Sidebar + Topbar + Content Area |
| `Sidebar` | `components/layout/Sidebar.tsx` | Navigationsleiste mit Menu-Eintraegen, kollabierbar |
| `SidebarItem` | `components/layout/SidebarItem.tsx` | Einzelner Navigationspunkt mit Icon + Label |
| `Topbar` | `components/layout/Topbar.tsx` | Kopfzeile: Suche, Notifications, User-Menu, Theme-Toggle |
| `Breadcrumbs` | `components/layout/Breadcrumbs.tsx` | Brotkrumen-Navigation |
| `PageHeader` | `components/layout/PageHeader.tsx` | Seiten-Titel + Aktions-Buttons |
| `ContentArea` | `components/layout/ContentArea.tsx` | Scrollbarer Hauptbereich |

### 5.2 Dashboard-Grid & Widgets

| Komponente | Pfad | Beschreibung |
|------------|------|-------------|
| `DashboardGrid` | `components/dashboard/DashboardGrid.tsx` | react-grid-layout Wrapper, verwaltet alle Widgets |
| `DashboardWidget` | `components/dashboard/DashboardWidget.tsx` | Widget-Wrapper: Titel, Settings-Menu, Resize-Handles |
| `WidgetUpcomingEvents` | `components/widgets/WidgetUpcomingEvents.tsx` | Naechste Events mit Datum, Ort, Status |
| `WidgetFinanceOverview` | `components/widgets/WidgetFinanceOverview.tsx` | Finanz-KPIs: Umsatz, Kosten, Gewinn (Chart) |
| `WidgetNewsletterStats` | `components/widgets/WidgetNewsletterStats.tsx` | Newsletter-Metriken: Oeffnungsrate, Klicks, Absender |
| `WidgetSocialFeed` | `components/widgets/WidgetSocialFeed.tsx` | Letzte Social-Media-Posts |
| `WidgetCalendar` | `components/widgets/WidgetCalendar.tsx` | Mini-Kalender mit Event-Markierungen |
| `WidgetTasks` | `components/widgets/WidgetTasks.tsx` | Offene Aufgaben/To-Dos |
| `WidgetAIInsights` | `components/widgets/WidgetAIInsights.tsx` | KI-generierte Erkenntnisse |
| `WidgetQuickActions` | `components/widgets/WidgetQuickActions.tsx` | Schnellaktionen: Event erstellen, Newsletter senden |
| `WidgetEventStats` | `components/widgets/WidgetEventStats.tsx` | Event-Kennzahlen: Tickets verkauft, Auslastung |
| `WidgetRecentContacts` | `components/widgets/WidgetRecentContacts.tsx` | Zuletzt bearbeitete Kontakte |

### 5.3 Globale Suche

| Komponente | Pfad | Beschreibung |
|------------|------|-------------|
| `GlobalSearch` | `components/search/GlobalSearch.tsx` | Cmd+K Modal, O Command-Palette-Style |
| `SearchResultGroup` | `components/search/SearchResultGroup.tsx` | Gruppierung nach Entitaetstyp |
| `SearchResultItem` | `components/search/SearchResultItem.tsx` | Einzelnes Suchergebnis |
| `SearchBar` | `components/search/SearchBar.tsx` | Inline-Suchleiste fuer Topbar |

### 5.4 Notifications

| Komponente | Pfad | Beschreibung |
|------------|------|-------------|
| `NotificationBell` | `components/notifications/NotificationBell.tsx` | Glocken-Icon mit Ungelesen-Zaehler |
| `NotificationDropdown` | `components/notifications/NotificationDropdown.tsx` | Dropdown-Panel mit Benachrichtigungsliste |
| `NotificationItem` | `components/notifications/NotificationItem.tsx` | Einzelne Benachrichtigungskarte |
| `NotificationInbox` | `components/notifications/NotificationInbox.tsx` | Vollstaendige Inbox-Seite |
| `NotificationPreferences` | `components/notifications/NotificationPreferences.tsx` | Einstellungen fuer Benachrichtigungen |

### 5.5 Theme & Accessibility

| Komponente | Pfad | Beschreibung |
|------------|------|-------------|
| `ThemeProvider` | `components/theme/ThemeProvider.tsx` | Context-Provider fuer Dark/Light Mode |
| `ThemeToggle` | `components/theme/ThemeToggle.tsx` | Dark/Light/System Toggle-Button |

### 5.6 Wiederverwendbare UI-Komponenten (shadcn/ui + Custom)

| Komponente | Pfad | Beschreibung | Quelle |
|------------|------|-------------|--------|
| `Button` | `components/ui/button.tsx` | Primaer, Sekundaer, Ghost, Destructive, Loading | shadcn/ui |
| `Card` | `components/ui/card.tsx` | Container mit Header, Content, Footer | shadcn/ui |
| `DataTable` | `components/ui/data-table.tsx` | Sortierbare, filterbare Tabelle mit Pagination | Custom + shadcn |
| `Modal` | `components/ui/modal.tsx` | Dialog-Overlay mit Fokus-Falle | shadcn/ui Dialog |
| `FormInput` | `components/ui/form-input.tsx` | Input mit Label, Fehler, Hilfetext | shadcn/ui Input + Label |
| `FormSelect` | `components/ui/form-select.tsx` | Dropdown mit Suche | shadcn/ui Select |
| `DatePicker` | `components/ui/date-picker.tsx` | Datumsauswahl mit Range-Support | shadcn/ui Calendar |
| `Badge` | `components/ui/badge.tsx` | Status-Anzeige (Entwurf, Live, Archiviert) | shadcn/ui Badge |
| `StatusPill` | `components/ui/status-pill.tsx` | Farbcodierte Status-Anzeige mit Icon | Custom |
| `ChartContainer` | `components/ui/chart-container.tsx` | Recharts-Wrapper mit Theme-Anpassung | Custom |
| `EmptyState` | `components/ui/empty-state.tsx` | Platzhalter fuer leere Listen | Custom |
| `SkeletonLoader` | `components/ui/skeleton-loader.tsx` | Lade-Skelette fuer alle Komponenten | shadcn/ui Skeleton |
| `Toast` | `components/ui/toast.tsx` | Erfolgs-/Fehler-/Info-Benachrichtigungen | shadcn/ui Sonner |
| `Tooltip` | `components/ui/tooltip.tsx` | Info-Tooltips bei Hover | shadcn/ui Tooltip |
| `Avatar` | `components/ui/avatar.tsx` | Profilbild mit Fallback-Initialen | shadcn/ui Avatar |
| `Tabs` | `components/ui/tabs.tsx` | Registerkarten-Navigation | shadcn/ui Tabs |
| `Accordion` | `components/ui/accordion.tsx` | Aufklappbare Inhaltsbereiche | shadcn/ui Accordion |
| `DropdownMenu` | `components/ui/dropdown-menu.tsx` | Kontext-Menu | shadcn/ui Dropdown |
| `ProgressBar` | `components/ui/progress-bar.tsx` | Fortschrittsbalken (Prozentanzeige) | shadcn/ui Progress |
| `Slider` | `components/ui/slider.tsx` | Schieberegler (z.B. Budget) | shadcn/ui Slider |

### 5.7 Chart-Komponenten (Recharts)

| Komponente | Pfad | Beschreibung |
|------------|------|-------------|
| `LineChart` | `components/charts/LineChart.tsx` | Liniendiagramm (Verlaeufe: Ticketverkauf, Umsatz) |
| `BarChart` | `components/charts/BarChart.tsx` | Balkendiagramm (Vergleiche: Events, Monate) |
| `PieChart` | `components/charts/PieChart.tsx` | Tortendiagramm (Anteile: Budgetverteilung) |
| `AreaChart` | `components/charts/AreaChart.tsx` | Flaechendiagramm (Kumulierte Werte) |
| `RadarChart` | `components/charts/RadarChart.tsx` | Radar-Chart (Kuenstler-Bewertungen) |
| `StatsCard` | `components/charts/StatsCard.tsx` | KPI-Karte mit Wert, Trend-Pfeil, Vergleich |

---

## 6. Seiten/Routen-Struktur

### 6.1 Route-Definitionen (Next.js App Router)

```
/                          Dashboard (Home)
  |
  +-- /events
  |     +-- /                  Events-Liste (Tabelle, Filter, Suche)
  |     +-- /new               Event erstellen (Wizard/Formular)
  |     +-- /[id]              Event-Detail (Uebersicht, Tabs)
  |     +-- /[id]/edit         Event bearbeiten
  |     +-- /[id]/guestlist    Gaesteliste
  |     +-- /[id]/settlement   Abrechnung
  |     +-- /[id]/checklist    Checkliste
  |
  +-- /venues
  |     +-- /                  Orte/Spielorte-Liste
  |     +-- /[id]              Spielort-Detail (Info, Kontakt, Historie)
  |     +-- /[id]/edit         Spielort bearbeiten
  |
  +-- /artists
  |     +-- /                  Kuenstler/Musiker-Liste
  |     +-- /[id]              Kuenstler-Detail (Profil, Bewertung, Historie)
  |     +-- /[id]/edit         Kuenstler bearbeiten
  |     +-- /photos            Fotodatenbank (Gallery, Upload, Tags)
  |
  +-- /newsletter
  |     +-- /                  Newsletter-Dashboard
  |     +-- /campaigns         Kampagnen-Liste
  |     +-- /campaigns/[id]    Kampagnen-Detail/Editor
  |     +-- /recipients        Empfaenger-Liste (Segmente)
  |     +-- /templates         Vorlagen-Bibliothek
  |     +-- /templates/[id]    Vorlage bearbeiten
  |     +-- /stats             Statistiken/Analytics
  |
  +-- /social
  |     +-- /                  Social Media Dashboard
  |     +-- /planner           Content-Planer (Kalender-Ansicht)
  |     +-- /accounts          Verbundene Accounts
  |     +-- /posts             Posts-Liste
  |     +-- /posts/new         Neuer Post erstellen
  |     +-- /analytics         Social Media Analytics
  |
  +-- /press
  |     +-- /                  Presse-Uebersicht
  |     +-- /contacts          Pressekontakte-Liste
  |     +-- /contacts/[id]     Kontakt-Detail
  |     +-- /releases          Pressemitteilungen
  |     +-- /releases/new      Neue Mitteilung erstellen
  |     +-- /distribution      Verteiler verwalten
  |
  +-- /finance
  |     +-- /                  Finanz-Dashboard
  |     +-- /budgets           Budgets-Liste
  |     +-- /budgets/[id]      Budget-Detail
  |     +-- /gema              GEMA-Meldungen
  |     +-- /settlements       Abrechnungen
  |     +-- /invoices          Rechnungen (Ein-/Ausgang)
  |
  +-- /calendar
  |     +-- /                  Kalender (Month/Week/Day/Agenda)
  |
  +-- /notifications
  |     +-- /                  Benachrichtigungs-Inbox
  |
  +-- /settings
  |     +-- /profile           Profil-Einstellungen
  |     +-- /organization      Organisation/Kuenstlergruppe
  |     +-- /team              Team-Mitglieder & Rollen
  |     +-- /integrations      Externe APIs (Social, Newsletter, Payment)
  |     +-- /ai-config         KI-Einstellungen
  |     +-- /billing           Abrechnung/Plan
```

### 6.2 Navigationsstruktur (Sidebar)

```
Dashboard (Home)          [icon: LayoutDashboard]
  |
  +-- Events              [icon: CalendarDays]      Badge: Anzahl naechster Events
  +-- Orte/Spielorte      [icon: MapPin]
  +-- Kuenstler/Musiker   [icon: Users]
  +-- Newsletter          [icon: Mail]              Badge: Letzte Oeffnungsrate
  +-- Social Media        [icon: Share2]
  +-- Presse              [icon: Newspaper]
  +-- Finanzen            [icon: Euro]
  +-- Kalender            [icon: Calendar]
  |
  +-- Settings            [icon: Settings]
```

**Sidebar-Gruppen:**
- **Hauptbereich:** Dashboard, Events, Orte, Kuenstler
- **Kommunikation:** Newsletter, Social Media, Presse
- **Verwaltung:** Finanzen, Kalender
- **System:** Einstellungen (unten fixiert)

### 6.3 Breadcrumbs-Struktur

Breadcrumbs folgen immer dem Muster: `Dashboard > Modul > Seite > Detail`

Beispiele:
- `Dashboard > Events > Konzertabend 15.08.2025`
- `Dashboard > Kuenstler > Anna Schmidt > Fotos`
- `Dashboard > Newsletter > Kampagnen > Sommerprogramm 2025`
- `Dashboard > Einstellungen > Organisation`

---

## 7. Design-Tokens

### 7.1 Farbpalette

#### Light Mode

| Token | Hex | Verwendung |
|-------|-----|-----------|
| `--bg-primary` | `#ffffff` | Haupt-Hintergrund |
| `--bg-secondary` | `#f8fafc` | Sekundaerer Hintergrund (Sidebar, Karten) |
| `--bg-tertiary` | `#f1f5f9` | Tertiaerer Hintergrund (Hover, Input-Bg) |
| `--text-primary` | `#0f172a` | Primaerer Text (Ueberschriften) |
| `--text-secondary` | `#475569` | Sekundaerer Text (Beschreibungen) |
| `--text-muted` | `#94a3b8` | Ausgegrauter Text (Platzhalter) |
| `--border` | `#e2e8f0` | Standard-Rahmen |
| `--border-hover` | `#cbd5e1` | Rahmen bei Hover |

#### Dark Mode (Soft Dark)

| Token | Hex | Verwendung |
|-------|-----|-----------|
| `--bg-primary` | `#0f172a` | Haupt-Hintergrund |
| `--bg-secondary` | `#1e293b` | Sekundaerer Hintergrund (Sidebar, Karten) |
| `--bg-tertiary` | `#334155` | Tertiaerer Hintergrund (Hover, Input-Bg) |
| `--text-primary` | `#f8fafc` | Primaerer Text |
| `--text-secondary` | `#cbd5e1` | Sekundaerer Text |
| `--text-muted` | `#64748b` | Ausgegrauter Text |
| `--border` | `#334155` | Standard-Rahmen |
| `--border-hover` | `#475569` | Rahmen bei Hover |

#### Akzentfarben (Desaturiert, beide Modi)

| Token | Hex | Verwendung |
|-------|-----|-----------|
| `--accent-primary` | `#3b82f6` | Primaere Aktionen, Links |
| `--accent-primary-hover` | `#2563eb` | Hover-Zustand |
| `--accent-success` | `#10b981` | Erfolg, Live-Status |
| `--accent-warning` | `#f59e0b` | Warnung, Draft-Status |
| `--accent-danger` | `#ef4444` | Fehler, Loeschen |
| `--accent-info` | `#06b6d4` | Informationen |
| `--accent-purple` | `#8b5cf6` | KI/AI-Erkennung |

#### Event-Status-Farben

| Status | Farbe | Token |
|--------|-------|-------|
| Entwurf | `#f59e0b` | `--status-draft` |
| Geplant | `#3b82f6` | `--status-planned` |
| Veroeffentlicht | `#10b981` | `--status-published` |
| Laufend | `#06b6d4` | `--status-active` |
| Abgeschlossen | `#64748b` | `--status-completed` |
| Abgesagt | `#ef4444` | `--status-cancelled` |

### 7.2 Typografie

| Token | Wert | Verwendung |
|-------|------|-----------|
| `--font-sans` | `Inter, system-ui, sans-serif` | Alle UI-Texte |
| `--font-mono` | `JetBrains Mono, monospace` | Code, Zahlen, IDs |
| `--text-xs` | `12px / line-height 16px` | Fein-Texte, Timestamps |
| `--text-sm` | `14px / line-height 20px` | Standard-Body, Labels |
| `--text-base` | `16px / line-height 24px` | Groessere Body-Texte |
| `--text-lg` | `18px / line-height 28px` | Unterueberschriften |
| `--text-xl` | `20px / line-height 28px` | Karten-Titel |
| `--text-2xl` | `24px / line-height 32px` | Seiten-Titel |
| `--text-3xl` | `30px / line-height 36px` | Dashboard-Header |
| `--font-normal` | `400` | Standard |
| `--font-medium` | `500` | Labels, Navigation |
| `--font-semibold` | `600` | Ueberschriften |
| `--font-bold` | `700` | Seiten-Titel |

### 7.3 Abstaende & Layout

| Token | Wert | Verwendung |
|-------|------|-----------|
| `--space-1` | `4px` | Mikro-Abstand |
| `--space-2` | `8px` | Kleiner Abstand (Icon-Gap) |
| `--space-3` | `12px` | Kompakt-Abstand |
| `--space-4` | `16px` | Standard-Abstand |
| `--space-5` | `20px` | Mittlerer Abstand |
| `--space-6` | `24px` | Section-Abstand |
| `--space-8` | `32px` | Grosser Abstand |
| `--space-10` | `40px` | Section-Padding |
| `--space-12` | `48px` | Layout-Padding |
| `--radius-sm` | `6px` | Kleine Ecken (Buttons) |
| `--radius-md` | `8px` | Standard-Ecken (Inputs) |
| `--radius-lg` | `12px` | Grosse Ecken (Karten) |
| `--radius-xl` | `16px` | Extra-Ecken (Modals) |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtil |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` | Karten |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Dropdowns, Modals |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.1)` | Overlays |

### 7.4 Breakpoints (Responsive)

| Breakpoint | Wert | Grid-Spalten | Sidebar |
|------------|------|-------------|---------|
| `xs` | < 640px | 4 | Drawer (slide-in) |
| `sm` | >= 640px | 4 | Drawer |
| `md` | >= 768px | 8 | Kollabierbar (nur Icons) |
| `lg` | >= 1024px | 12 | Kollabierbar |
| `xl` | >= 1280px | 12 | Voll ausgeklappt |
| `2xl` | >= 1536px | 12 | Voll ausgeklappt |

### 7.5 Animationen

| Token | Wert | Verwendung |
|-------|------|-----------|
| `--transition-fast` | `150ms ease-in-out` | Hover, Focus |
| `--transition-base` | `200ms ease-in-out` | Standard-Uebergaenge |
| `--transition-slow` | `300ms ease-in-out` | Modals, Sidebar-Toggle |
| `--animation-fade` | `fade-in 200ms ease-out` | Elemente erscheinen |
| `--animation-slide` | `slide-up 200ms ease-out` | Dropdowns, Tooltips |

---

## 8. Integrationen

### 8.1 Externe APIs/Services

| Service | Zweck | Integrationstyp |
|---------|-------|----------------|
| **react-grid-layout** | Drag-and-Drop Dashboard-Grid | Frontend-Library |
| **shadcn/ui** | UI-Komponenten-Bibliothek | Frontend-Library |
| **Tailwind CSS** | Utility-First CSS-Framework | Styling |
| **Recharts** | Datenvisualisierung/Charts | Frontend-Library |
| **Framer Motion** | Animationen & Uebergaenge | Frontend-Library |
| **TanStack Query** | Server-State-Management | Frontend-Library |
| **Zustand** | Client-State-Management | Frontend-Library |
| **React Hook Form** | Formular-Handling | Frontend-Library |
| **Zod** | Schema-Validierung | Frontend-Library |
| **WebSocket** | Echtzeit-Benachrichtigungen | Backend-Integration |

### 8.2 WCAG 2.2 AA Compliance

| Anforderung | Umsetzung |
|-------------|-----------|
| Farbkontrast 4.5:1 (Text) | Alle Farbkombinationen geprueft |
| Farbkontrast 3:1 (UI-Komponenten) | Rahmen, Icons, Buttons |
| Tastatur-Navigation | Alle Interaktionen per Tab erreichbar |
| Fokus-Indikatoren | Sichtbare 2px-Fokus-Ringe |
| Screenreader-Unterstuetzung | ARIA-Labels, Roles, Live-Regions |
| Bewegungsreduktion | `@media (prefers-reduced-motion)` |
| Textvergroesserung | UI funktioniert bei 200% Zoom |
| Touch-Ziele | Mind. 44x44px auf Touch-Geraeten |

---

## 9. Technische Details

### 9.1 State Management Architektur

```
Zustand Stores:
  +-- themeStore          (Dark/Light, System-Pref)
  +-- dashboardStore      (Widget-Layouts, Konfiguration)
  +-- notificationStore   (Ungelesen-Zaehler, Inbox-Status)
  +-- searchStore         (Suchhistorie, aktuelle Suche)
  +-- sidebarStore        (Kollabiert/Offen, aktiver Bereich)

TanStack Query:
  +-- Server-Synchronisation aller Entitaeten
  +-- Caching & Invalidation
  +-- Optimistic Updates fuer Widget-Drag
```

### 9.2 Widget-System Architektur

```typescript
// Widget-Registry (zentral registriert alle verfuegbaren Widgets)
interface WidgetConfig {
  type: string;               // Eindeutiger Widget-Typ
  name: string;               // Anzeigename
  description: string;        // Beschreibung
  icon: string;               // Lucide-Icon-Name
  component: React.Component; // React-Komponente
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  maxSize?: { w: number; h: number };
  settingsSchema?: ZodSchema; // Validierung fuer Widget-Einstellungen
}

// Widget-Instanz im Layout
interface WidgetInstance {
  id: string;           // Eindeutige Instanz-ID
  type: string;         // Referenz auf WidgetConfig.type
  x: number;            // Grid-X-Position
  y: number;            // Grid-Y-Position
  w: number;            // Breite in Grid-Einheiten
  h: number;            // Hoehe in Grid-Einheiten
  settings: Record<string, any>;
}
```

### 9.3 Performance-Optimierungen

| Massnahme | Umsetzung |
|-----------|-----------|
| Code Splitting | Next.js dynamic imports pro Route |
| Widget Lazy Loading | Widgets werden on-demand geladen |
| Virtualisierung | Lange Listen (Events, Kontakte) mit TanStack Virtual |
| Chart Optimierung | Recharts nur bei sichtbarem Widget rendern |
| Debounced Search | 300ms Debounce auf globale Suche |
| Skeleton Loading | Plausible Lade-Zustaende fuer alle Widgets |
| Image Optimierung | Next.js Image Komponente mit lazy loading |

### 9.4 Drag-and-Drop Implementierung

```
Library: react-grid-layout
Grid: 12 Spalten (Desktop), 8 (Tablet), 4 (Mobile)
Row Height: 60px
Margin: [16px, 16px]
Container Padding: [0, 0]
Resizing: Alle Richtungen (s, w, e, n, sw, nw, se, ne)
Persistenz: Layout wird bei jedem "onLayoutChange" an Backend gesendet
Undo: Letztes Layout wird im localStorage gespeichert ("Zuruecksetzen")
```

### 9.5 Global Search Implementierung

```
Trigger: Cmd/Ctrl + K oder Klick auf Suchleiste
Library: cmdk (Command Menu von shadcn/ui)
Suche: PostgreSQL Full-Text-Search (TSVECTOR) oder Algolia
Debounce: 300ms
Gruppierung: Events | Kuenstler | Orte | Kontakte | Newsletter
Tastatur: Pfeiltasten Navigation, Enter = Oeffnen, Esc = Schliessen
Historie: Letzte 10 Suchen im localStorage
```

---

## 10. Akzeptanzkriterien (Definition of Done)

### 10.1 Dashboard-Home
- [ ] Dashboard laedt in unter 2 Sekunden (Lighthouse Performance > 90)
- [ ] Maximal 7 visuelle Elemente pro Widget
- [ ] Alle Widgets zeigen korrekte Live-Daten an
- [ ] Leerer Zustand wird bei fehlenden Daten angezeigt
- [ ] Skeleton-Loader waehrend des Ladens

### 10.2 Widget-Drag-and-Drop
- [ ] Widgets koennen per Drag-and-Drop verschoben werden
- [ ] Widgets koennen in der Groesse angepasst werden
- [ ] Layout wird serverseitig gespeichert und bleibt erhalten
- [ ] Mehrere Layout-Presets sind speicherbar
- [ ] Touch-Drag-and-Drop funktioniert auf Tablets

### 10.3 Dark/Light Mode
- [ ] Umschaltung ohne Seitenreload (<200ms)
- [ ] Alle 30+ Komponenten rendern korrekt in beiden Modi
- [ ] System-Praeferenz wird bei erstem Besuch beruecksichtigt
- [ ] Praeferenz wird serverseitig gespeichert
- [ ] Charts adaptieren Farben automatisch

### 10.4 Globale Suche
- [ ] Cmd/Ctrl+K oeffnet die Suche von jeder Seite
- [ ] Suchergebnisse erscheinen innerhalb von 500ms
- [ ] Ergebnisse sind nach Entitaetstyp gruppiert
- [ ] Keyboard-Navigation funktioniert vollstaendig
- [ ] Letzte Suchen werden als Vorschlaege angezeigt

### 10.5 Notifications
- [ ] Echtzeit-Benachrichtigungen via WebSocket
- [ ] Ungelesen-Zaehler im Header aktualisiert sich sofort
- [ ] Benachrichtigungen sind nach Typ filterbar
- [ ] Als gelesen/ungelesen markieren funktioniert
- [ ] Deep-Link fuehrt zur korrekten Seite

### 10.6 Responsive Design
- [ ] Desktop (12-Spalten): Sidebar immer sichtbar
- [ ] Tablet (8-Spalten): Sidebar kollabierbar
- [ ] Mobile (4-Spalten): Sidebar als Drawer
- [ ] Kein horizontaler Scroll unter 375px
- [ ] Touch-Ziele mind. 44x44px
- [ ] Alle Funktionen auf allen Breakpoints verfuegbar

### 10.7 Accessibility (WCAG 2.2 AA)
- [ ] Farbkontrast 4.5:1 fuer alle Texte
- [ ] Vollstaendige Tastatur-Navigation
- [ ] Sichtbare Fokus-Indikatoren
- [ ] ARIA-Labels auf allen interaktiven Elementen
- [ ] Screenreader-Kompatibilitaet getestet
- [ ] `prefers-reduced-motion` beruecksichtigt

### 10.8 Alle Routen implementiert
- [ ] Dashboard (Home) mit Widget-System
- [ ] Events (Liste, Detail, Create, Edit, Gaesteliste, Abrechnung, Checkliste)
- [ ] Orte/Spielorte (Liste, Detail, Edit)
- [ ] Kuenstler (Liste, Detail, Edit, Fotodatenbank)
- [ ] Newsletter (Kampagnen, Empfaenger, Templates, Stats)
- [ ] Social Media (Planer, Accounts, Posts, Analytics)
- [ ] Presse (Kontakte, Mitteilungen, Verteiler)
- [ ] Finanzen (Budgets, GEMA, Abrechnungen, Rechnungen)
- [ ] Kalender (Month/Week/Day/Agenda)
- [ ] Einstellungen (Profil, Organisation, Team, Integrationen, KI-Config, Billing)
- [ ] Notifications (Inbox)

---

## 11. KI-Widget Spezifikation

### 11.1 NLP Querying Widget

| Eigenschaft | Beschreibung |
|-------------|-------------|
| **Eingabe** | Natuerlichsprachliche Frage: "Wie viele Tickets wurden fuer das Sommerkonzert verkauft?" |
| **Verarbeitung** | Backend wandelt Frage in strukturierte Query um (LLM + RAG) |
| **Ausgabe** | Antwort mit Datenquellen-Nachweis |
| **Beispiel-Fragen** | "Vergleiche Umsatz Q1 und Q2", "Welcher Kuenstler hatte die beste Auslastung?", "Wann ist die naechste GEMA-Abrechnung faellig?" |

### 11.2 Predictive Analytics Widget

| Eigenschaft | Beschreibung |
|-------------|-------------|
| **Datenbasis** | Historische Event-Daten, Ticketverkaeufe, Kuenstler-Bewertungen |
| **Prognosen** | Event-Auslastung, erwarteter Umsatz, optimale Ticketpreise |
| **Visualisierung** | Konfidenzintervalle als Area-Chart |
| **Erklärbarkeit** | Jede Prognose mit Einflussfaktoren |

---

## 12. Technologie-Stack (Frontend)

| Kategorie | Technologie | Version |
|-----------|-------------|---------|
| Framework | Next.js (App Router) | ^15.x |
| Sprache | TypeScript | ^5.x |
| Styling | Tailwind CSS | ^4.x |
| UI-Komponenten | shadcn/ui | latest |
| Icons | Lucide React | ^0.x |
| Charts | Recharts | ^2.x |
| Animationen | Framer Motion | ^11.x |
| Dashboard Grid | react-grid-layout | ^1.x |
| State Management | Zustand | ^5.x |
| Server State | TanStack Query | ^5.x |
| Formulare | React Hook Form | ^7.x |
| Validierung | Zod | ^3.x |
| Kommando-Menue | cmdk | ^1.x |

---

*Dokument erstellt: Dimension 10 — Dashboard UX/UI Design & Komponenten-Architektur*
*Status: Spezifikation v1.0*

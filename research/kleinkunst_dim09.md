# Dimension 9: Kalender, Multi-Orte-Verwaltung & Spielort-Management

## Modul-Spezifikation v1.0 — Kleinkunst-Veranstalter Dashboard

---

## 1. Feature-Beschreibung

Das Spielort- & Kalender-Modul ist das zentrale Ressourcenmanagement-System der Dashboard-App. Es ermöglicht Kleinkunst-Veranstaltern mit typischerweise 5-15 Spielorten, ihre komplette Veranstaltungsinfrastruktur zu verwalten — von der Spielort-Profilverwaltung bis zur automatisierten Öffentlichkeitsarbeit über externe Kulturportale.

### Kernfunktionen im Überblick:

| Funktion | Beschreibung | Priorität |
|----------|-------------|-----------|
| Spielort-Profile | Vollständige Verwaltung aller Spielorte mit Adresse, Kapazität, Technik, Kontakten, Verträgen | P0 |
| Multi-Orte-Kalender | Farbcodierter Kalender über ALLE Spielorte (Woche/Monat/Agenda) | P0 |
| Event-Spielort-Zuordnung | Jeder Event wird einem oder mehreren Spielorten zugewiesen | P0 |
| Verfügbarkeitsprüfung | Automatische Terminkonflikt-Erkennung bei Doppelbuchungen | P0 |
| Kalender-Sync (Two-Way) | Bidirektionale Synchronisation mit Google Calendar & Outlook | P1 |
| iCal-Feed Export | Öffentliche/priv iCal-Feeds pro Spielort zum Abonnieren | P1 |
| Öffentliche Kalender-Feeds | Automatische Befüllung von Kulturserver, Stadtportalen, Eventfrog | P1 |
| Spielort-Notizen | Freitext-Notizen für Technik, Kontaktpersonen, Besonderheiten | P2 |

### Geschäftswert:
- **Zeitersparnis**: Keine manuelle Pflege von 10+ Kalendern mehr
- **Fehlervermeidung**: Automatische Konflikterkennung verhindert Doppelbuchungen
- **Sichtbarkeit**: Automatische Veröffentlichung auf Kulturportalen erhöht Reichweite
- **Professionalität**: Zentrale Vertrags- und Kontaktverwaltung pro Spielort

---

## 2. User Stories

### US-9.1: Spielort-Profil anlegen
> **Als** Veranstalter  
> **möchte ich** ein neues Spielort-Profil mit Name, Adresse, Kapazität, vorhandener Technik, Kontaktpersonen und Vertragsdetails anlegen  
> **damit** ich alle relevanten Informationen an einem zentralen Ort habe und das Team Zugriff auf aktuelle Daten hat.

**Akzeptanzkriterien:**
- Pflichtfelder: Name, Straße, PLZ, Ort
- Optionale Felder: Kapazität (Zahl), Technik (Checkbox-Liste: Beamer, Mikrofon, Lichtanlage, Piano, Bar, Catering, Parkplätze, Barrierefrei)
- Mehrere Kontaktpersonen pro Spielort (Name, Rolle, Telefon, E-Mail)
- Vertrags-Upload (PDF) mit Gültigkeitszeitraum
- Geokoordinaten werden automatisch aus der Adresse berechnet

---

### US-9.2: Kalender-Übersicht über alle Spielorte
> **Als** Veranstalter  
> **möchte ich** einen farbcodierten Kalender sehen, der alle Spielorte gleichzeitig anzeigt (Wochen-, Monats- und Agenda-Ansicht)  
> **damit** ich auf einen Blick erkenne, welche Spielorte wann belegt sind und freie Kapazitäten identifizieren kann.

**Akzeptanzkriterien:**
- Jeder Spielort hat eine eindeutige Farbe im Kalender
- Ansichten: Woche (Standard), Monat, Agenda (Listenansicht)
- Filter: Nach Spielort, nach Event-Typ, nach Status (bestätigt/optional/abgesagt)
- Drag-and-Drop: Events zwischen Spielorten verschieben
- Klick auf Event öffnet Detail-Seite
- Heute-Button für schnelle Rücksprung

---

### US-9.3: Event einem Spielort zuordnen
> **Als** Veranstalter  
> **möchte ich** bei der Event-Erstellung oder -Bearbeitung einen oder mehrere Spielorte auswählen  
> **damit** jede Veranstaltung eindeutig einem physischen Ort zugeordnet ist und der Kalender korrekt befüllt wird.

**Akzeptanzkriterien:**
- Spielort-Auswahl als Dropdown mit Autocomplete
- Mehrfachauswahl möglich (z.B. für Tourneen oder Parallel-Veranstaltungen)
- Beim Speichern wird automatisch geprüft, ob der Spielort zum gewünschten Zeitpunkt verfügbar ist
- Bei Konflikt wird ein Warn-Dialog angezeigt mit Option "Trotzdem buchen" oder "Alternativen anzeigen"
- Änderung des Spielorts aktualisiert alle betroffenen Kalender

---

### US-9.4: Verfügbarkeitsprüfung und Konflikterkennung
> **Als** Veranstalter  
> **möchte ich** automatisch gewarnt werden, wenn ich einen Event an einem Spielort buche, der bereits belegt ist  
> **damit** keine Doppelbuchungen entstehen und ich alternative Termine oder Spielorte vorschlagen bekomme.

**Akzeptanzkriterien:**
- Sofortige Prüfung bei Event-Erstellung/Bearbeitung
- Visuelle Anzeige belegter Zeiträume im Spielort-Kalender
- Konflikt-Auflösungsvorschläge: nächster freier Termin am selben Ort, alternative freie Spielorte zum gleichen Termin
- "Technische Umbaupause" konfigurierbar (z.B. 2h vor/nach Event für Auf-/Abbau)
- Pufferzeit wird bei Konfliktprüfung berücksichtigt

---

### US-9.5: Google Calendar & Outlook Two-Way-Sync
> **Als** Veranstalter  
> **möchte ich** dass Events aus dem Dashboard automatisch in meinen Google Calendar oder Outlook synchronisiert werden und umgekehrt  
> **damit** ich meine gewohnte Kalender-App nutzen kann und trotzdem alle Buchungen zentral verwaltet werden.

**Akzeptanzkriterien:**
- OAuth2-Authentifizierung mit Google und Microsoft
- Bidirektionale Synchronisation: Änderungen im Dashboard → Kalender und Änderungen im Kalender → Dashboard
- Sync-Intervall: Echtzeit via Push Notifications (Google) oder maximal 5 Minuten (Polling-Fallback)
- Pro Spielort kann ein separater Kalender erstellt werden
- Gelöschte Events werden in beide Richtungen synchronisiert (mit Bestätigungsdialog)
- Sync-Status wird pro Event angezeigt (synced/pending/error)

---

### US-9.6: iCal-Feed exportieren
> **Als** Veranstalter  
> **möchte ich** für jeden Spielort einen iCal-Feed generieren können (öffentlich oder mit Token geschützt)  
> **damit** das Spielort-Personal oder externe Partner den Kalender in ihre eigene App abonnieren können.

**Akzeptanzkriterien:**
- Pro Spielort ein eigener iCal-Feed
- Öffentliche und private (token-geschützte) Feeds möglich
- Feed enthält: Event-Titel, Zeitraum, Spielort, Beschreibung, Kontakt
- Aktualisierung in Echtzeit (bei jeder Event-Änderung wird der Feed neu generiert)
- QR-Code zum einfachen Abonnieren für Spielort-Personal

---

### US-9.7: Öffentliche Event-Kalender automatisch füttern
> **Als** Veranstalter  
> **möchte ich** dass bestätigte Events automatisch an öffentliche Kulturportale (Kulturserver.de, Stadtportale, Eventfrog) übertragen werden  
> **damit** meine Veranstaltungen maximale Sichtbarkeit erreichen ohne manuelle Mehrfacheingabe.

**Akzeptanzkriterien:**
- Events mit Status "veröffentlicht" werden automatisch an konfigurierte Portale gesendet
- Konfiguration pro Portal: API-Schlüssel, welche Spielorte, welche Event-Typen
- Updates und Absagen werden automatisch propagiert
- Fehlerprotokoll bei fehlgeschlagenen Übertragungen
- Manuelle Freigabe als Option (Review vor Veröffentlichung)

---

### US-9.8: Spielort-Notizen verwalten
> **Als** Veranstalter  
> **möchte ich** freie Notizen zu jedem Spielort anlegen (Technik-Details, Kontaktpersonen, Besonderheiten, Learnings aus vergangenen Events)  
> **damit** das gesamte Team von Erfahrungen profitiert und wichtige Details nicht verloren gehen.

**Akzeptanzkriterien:**
- Rich-Text-Editor für Notizen (Markdown-Unterstützung)
- Kategorien: Technik, Kontakt, Logistik, Sonstiges
- Sichtbarkeit: Privat (nur ich), Team (alle Mitarbeiter), Öffentlich (für Künstler)
- Chronologische Anzeige mit Zeitstempel und Autor
- Pinning wichtiger Notizen

---

### US-9.9: Spielort-Verträge verwalten
> **Als** Veranstalter  
> **möchte ich** Miet- und Nutzungsverträge pro Spielort hochladen und verwalten  
> **damit** ich bei rechtlichen Fragen oder Streitigkeiten schnell Zugriff auf die Vertragsgrundlagen habe.

**Akzeptanzkriterien:**
- PDF-Upload mit Metadaten (Vertragspartner, Laufzeit, Kündigungsfrist, Mietkosten)
- Erinnerung bei Ablauf der Vertragslaufzeit (30 Tage vorher)
- Verknüpfung von Verträgen mit Events (Welcher Vertrag gilt für diesen Event?)
- Suchfunktion über alle Verträge

---

### US-9.10: Spielort-Auswertungen und Statistiken
> **Als** Veranstalter  
> **möchte ich** Auswertungen pro Spielort sehen (Nutzungshäufigkeit, Auslastung, Einnahmen, Gästezahl)  
> **damit** ich datenbasierte Entscheidungen über die Zusammenarbeit mit einzelnen Spielorten treffen kann.

**Akzeptanzkriterien:**
- Dashboard pro Spielort: Events pro Monat/Jahr, durchschnittliche Auslastung
- Vergleichsansicht: mehrere Spielorte nebeneinander vergleichen
- Export als CSV/PDF
- Zeitraum frei wählbar

---

## 3. Datenmodell

### 3.1 Übersicht Tabellen/Collections

```
venues                    → Spielort-Profile
venue_contacts            → Kontaktpersonen pro Spielort
venue_contracts           → Verträge pro Spielort
venue_notes               → Notizen pro Spielort
venue_bookings            → Buchungen/Belegungen von Spielorten
calendar_syncs            → Kalender-Synchronisations-Konfigurationen
calendar_sync_logs        → Sync-Log-Einträge
ical_feeds                → iCal-Feed-Konfigurationen
external_calendar_events  → Events aus externen Kalendern (Google/Outlook)
venue_stats               → Aggregierte Spielort-Statistiken
```

### 3.2 Detailliertes Schema

#### Tabelle: `venues`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, auto | Eindeutige ID |
| `organization_id` | UUID | FK → organizations | Zugehörige Organisation |
| `name` | VARCHAR(255) | NOT NULL | Spielort-Name |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL | URL-freundlicher Name |
| `description` | TEXT | nullable | Beschreibung |
| `address_street` | VARCHAR(255) | NOT NULL | Straße + Hausnummer |
| `address_zip` | VARCHAR(20) | NOT NULL | Postleitzahl |
| `address_city` | VARCHAR(255) | NOT NULL | Ort |
| `address_country` | VARCHAR(2) | DEFAULT 'DE' | Ländercode (ISO 3166-1) |
| `latitude` | DECIMAL(10,8) | nullable | Breitengrad |
| `longitude` | DECIMAL(11,8) | nullable | Längengrad |
| `capacity` | INTEGER | nullable | Maximale Kapazität |
| `capacity_seated` | INTEGER | nullable | Sitzplätze |
| `capacity_standing` | INTEGER | nullable | Stehplätze |
| `room_size_sqm` | DECIMAL(8,2) | nullable | Raumgröße in m² |
| `has_stage` | BOOLEAN | DEFAULT false | Bühne vorhanden |
| `has_piano` | BOOLEAN | DEFAULT false | Klavier vorhanden |
| `has_projector` | BOOLEAN | DEFAULT false | Beamer vorhanden |
| `has_sound_system` | BOOLEAN | DEFAULT false | Soundsystem vorhanden |
| `has_lighting` | BOOLEAN | DEFAULT false | Lichtanlage vorhanden |
| `has_bar` | BOOLEAN | DEFAULT false | Bar vorhanden |
| `has_catering` | BOOLEAN | DEFAULT false | Catering möglich |
| `has_parking` | BOOLEAN | DEFAULT false | Parkplätze |
| `is_accessible` | BOOLEAN | DEFAULT false | Barrierefrei |
| `has_wifi` | BOOLEAN | DEFAULT false | WLAN |
| `setup_time_minutes` | INTEGER | DEFAULT 60 | Aufbauzeit in Minuten |
| `teardown_time_minutes` | INTEGER | DEFAULT 30 | Abbauzeit in Minuten |
| `color` | VARCHAR(7) | DEFAULT '#3B82F6' | Kalender-Farbe (HEX) |
| `is_active` | BOOLEAN | DEFAULT true | Spielort aktiv |
| `external_ids` | JSONB | nullable | IDs in externen Systemen |
| `created_at` | TIMESTAMP | DEFAULT now() | Erstellungszeit |
| `updated_at` | TIMESTAMP | DEFAULT now() | Letzte Änderung |
| `created_by` | UUID | FK → users | Ersteller |

**Indizes:**
- `idx_venues_organization_id` — Filter nach Organisation
- `idx_venues_active` — Nur aktive Spielorte anzeigen
- `idx_venues_geo` — Geospatial-Index auf (latitude, longitude)

---

#### Tabelle: `venue_contacts`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, auto | Eindeutige ID |
| `venue_id` | UUID | FK → venues, CASCADE | Zugehöriger Spielort |
| `name` | VARCHAR(255) | NOT NULL | Kontakt-Name |
| `role` | VARCHAR(100) | nullable | Rolle (Hausmeister, Programmleiter, etc.) |
| `email` | VARCHAR(255) | nullable | E-Mail-Adresse |
| `phone` | VARCHAR(50) | nullable | Telefonnummer |
| `is_primary` | BOOLEAN | DEFAULT false | Hauptkontakt |
| `notes` | TEXT | nullable | Zusätzliche Notizen |
| `created_at` | TIMESTAMP | DEFAULT now() | Erstellungszeit |

---

#### Tabelle: `venue_contracts`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, auto | Eindeutige ID |
| `venue_id` | UUID | FK → venues, CASCADE | Zugehöriger Spielort |
| `title` | VARCHAR(255) | NOT NULL | Vertragstitel |
| `contractor_name` | VARCHAR(255) | NOT NULL | Vertragspartner |
| `file_url` | VARCHAR(500) | NOT NULL | Pfad zur PDF-Datei |
| `file_size` | INTEGER | nullable | Dateigröße in Bytes |
| `contract_type` | ENUM | nullable | 'miete', 'nutzung', 'kooperation', 'sonstige' |
| `start_date` | DATE | nullable | Vertragsbeginn |
| `end_date` | DATE | nullable | Vertragsende |
| `notice_period_days` | INTEGER | nullable | Kündigungsfrist in Tagen |
| `rent_amount` | DECIMAL(10,2) | nullable | Mietkosten |
| `rent_currency` | VARCHAR(3) | DEFAULT 'EUR' | Währung |
| `payment_terms` | VARCHAR(255) | nullable | Zahlungsmodalitäten |
| `terms` | TEXT | nullable | Wichtige Vertragsklauseln (Volltext) |
| `reminder_sent` | BOOLEAN | DEFAULT false | Erinnerung gesendet |
| `created_at` | TIMESTAMP | DEFAULT now() | Erstellungszeit |
| `updated_at` | TIMESTAMP | DEFAULT now() | Letzte Änderung |

---

#### Tabelle: `venue_notes`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, auto | Eindeutige ID |
| `venue_id` | UUID | FK → venues, CASCADE | Zugehöriger Spielort |
| `author_id` | UUID | FK → users | Verfasser |
| `category` | ENUM | DEFAULT 'sonstiges' | 'technik', 'kontakt', 'logistik', 'sonstiges' |
| `title` | VARCHAR(255) | NOT NULL | Notiz-Titel |
| `content` | TEXT | NOT NULL | Notiz-Inhalt (Markdown) |
| `visibility` | ENUM | DEFAULT 'team' | 'privat', 'team', 'oeffentlich' |
| `is_pinned` | BOOLEAN | DEFAULT false | Angepinnt |
| `event_id` | UUID | FK → events, nullable | Verknüpftes Event |
| `created_at` | TIMESTAMP | DEFAULT now() | Erstellungszeit |
| `updated_at` | TIMESTAMP | DEFAULT now() | Letzte Änderung |

---

#### Tabelle: `venue_bookings`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, auto | Eindeutige ID |
| `venue_id` | UUID | FK → venues, CASCADE | Zugehöriger Spielort |
| `event_id` | UUID | FK → events, SET NULL | Verknüpftes Event |
| `booking_type` | ENUM | DEFAULT 'event' | 'event', 'blockiert', 'aufbau', 'umbau' |
| `title` | VARCHAR(255) | NOT NULL | Belegungs-Titel |
| `start_time` | TIMESTAMP | NOT NULL | Beginn |
| `end_time` | TIMESTAMP | NOT NULL | Ende |
| `status` | ENUM | DEFAULT 'confirmed' | 'confirmed', 'tentative', 'cancelled' |
| `source` | ENUM | DEFAULT 'manual' | 'manual', 'google_calendar', 'outlook', 'api' |
| `external_event_id` | VARCHAR(255) | nullable | ID im externen Kalender |
| `external_calendar_id` | VARCHAR(255) | nullable | ID des externen Kalenders |
| `sync_version` | INTEGER | DEFAULT 1 | Versionsnummer für Sync-Konflikte |
| `created_at` | TIMESTAMP | DEFAULT now() | Erstellungszeit |
| `updated_at` | TIMESTAMP | DEFAULT now() | Letzte Änderung |

**Indizes:**
- `idx_venue_bookings_venue_time` — (venue_id, start_time, end_time) für Konflikt-Query
- `idx_venue_bookings_event` — (event_id) für Event-Joins
- `idx_venue_bookings_external` — (external_event_id, external_calendar_id) für Sync

**Constraints:**
- `CHECK (end_time > start_time)` — Ende muss nach Beginn liegen
- `UNIQUE (venue_id, start_time, end_time, event_id)` — Keine exakten Duplikate

---

#### Tabelle: `calendar_syncs`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, auto | Eindeutige ID |
| `organization_id` | UUID | FK → organizations | Zugehörige Organisation |
| `venue_id` | UUID | FK → venues, nullable | Spielort (NULL = alle Spielorte) |
| `provider` | ENUM | NOT NULL | 'google', 'microsoft', 'apple' |
| `provider_account_email` | VARCHAR(255) | NOT NULL | E-Mail des Kalender-Accounts |
| `access_token` | TEXT | NOT NULL | OAuth Access Token (verschlüsselt) |
| `refresh_token` | TEXT | NOT NULL | OAuth Refresh Token (verschlüsselt) |
| `token_expires_at` | TIMESTAMP | NOT NULL | Token-Ablaufzeit |
| `external_calendar_id` | VARCHAR(255) | nullable | Ziel-Kalender-ID |
| `external_calendar_name` | VARCHAR(255) | nullable | Ziel-Kalender-Name |
| `sync_direction` | ENUM | DEFAULT 'bidirectional' | 'to_external', 'from_external', 'bidirectional' |
| `sync_enabled` | BOOLEAN | DEFAULT true | Sync aktiv |
| `last_sync_at` | TIMESTAMP | nullable | Letzte Synchronisation |
| `last_sync_status` | ENUM | nullable | 'success', 'error', 'partial' |
| `last_error_message` | TEXT | nullable | Letzte Fehlermeldung |
| `webhook_channel_id` | VARCHAR(255) | nullable | Google Push-Notification Channel ID |
| `webhook_resource_id` | VARCHAR(255) | nullable | Google Push-Notification Resource ID |
| `created_at` | TIMESTAMP | DEFAULT now() | Erstellungszeit |
| `updated_at` | TIMESTAMP | DEFAULT now() | Letzte Änderung |

---

#### Tabelle: `calendar_sync_logs`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, auto | Eindeutige ID |
| `sync_id` | UUID | FK → calendar_syncs | Zugehörige Sync-Konfiguration |
| `direction` | ENUM | NOT NULL | 'to_external', 'from_external' |
| `action` | ENUM | NOT NULL | 'create', 'update', 'delete' |
| `event_id` | UUID | nullable | Betroffenes Event |
| `venue_booking_id` | UUID | nullable | Betroffene Buchung |
| `external_event_id` | VARCHAR(255) | nullable | Externe Event-ID |
| `status` | ENUM | NOT NULL | 'success', 'error', 'skipped', 'conflict' |
| `error_message` | TEXT | nullable | Fehlermeldung |
| `details` | JSONB | nullable | Zusätzliche Details |
| `created_at` | TIMESTAMP | DEFAULT now() | Zeitpunkt |

---

#### Tabelle: `ical_feeds`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, auto | Eindeutige ID |
| `venue_id` | UUID | FK → venues, CASCADE | Zugehöriger Spielort |
| `feed_name` | VARCHAR(255) | NOT NULL | Feed-Name |
| `access_token` | VARCHAR(64) | NOT NULL, UNIQUE | Sicherheits-Token für Feed-URL |
| `is_public` | BOOLEAN | DEFAULT false | Öffentlich zugänglich |
| `include_description` | BOOLEAN | DEFAULT true | Beschreibung einbeziehen |
| `include_contact` | BOOLEAN | DEFAULT false | Kontaktinfos einbeziehen |
| `event_types` | JSONB | nullable | Filtern nach Event-Typen |
| `feed_url` | VARCHAR(500) | NOT NULL | Generierte Feed-URL |
| `access_count` | INTEGER | DEFAULT 0 | Anzahl Zugriffe |
| `last_accessed_at` | TIMESTAMP | nullable | Letzter Zugriff |
| `created_at` | TIMESTAMP | DEFAULT now() | Erstellungszeit |
| `created_by` | UUID | FK → users | Ersteller |

---

#### Tabelle: `external_calendar_events`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, auto | Eindeutige ID |
| `sync_id` | UUID | FK → calendar_syncs | Zugehörige Sync-Konfiguration |
| `external_event_id` | VARCHAR(255) | NOT NULL | ID im externen Kalender |
| `external_calendar_id` | VARCHAR(255) | NOT NULL | ID des externen Kalenders |
| `external_etag` | VARCHAR(255) | nullable | ETag für Change-Detection |
| `title` | VARCHAR(500) | NOT NULL | Event-Titel |
| `description` | TEXT | nullable | Beschreibung |
| `start_time` | TIMESTAMP | NOT NULL | Beginn |
| `end_time` | TIMESTAMP | NOT NULL | Ende |
| `location` | VARCHAR(500) | nullable | Ort |
| `is_all_day` | BOOLEAN | DEFAULT false | Ganztägig |
| `imported_as_booking_id` | UUID | FK → venue_bookings, nullable | Erstellte interne Buchung |
| `raw_data` | JSONB | nullable | Rohe API-Antwort |
| `created_at` | TIMESTAMP | DEFAULT now() | Erstellungszeit |
| `updated_at` | TIMESTAMP | DEFAULT now() | Letzte Änderung |

---

### 3.3 Beziehungen (ER-Diagramm)

```
┌─────────────────┐     1:n     ┌──────────────────┐
│   venues        │◄────────────│ venue_contacts   │
├─────────────────┤             ├──────────────────┤
│ id (PK)         │     1:n     │ id (PK)          │
│ organization_id │◄────────────│ venue_id (FK)    │
│ name            │             │ name             │
│ ...             │     1:n     │ role             │
└─────────────────┘◄───────────┤ ...              │
       ▲                       └──────────────────┘
       │
       │ 1:n     ┌──────────────────┐
       └─────────┤ venue_contracts  │
       │         ├──────────────────┤
       │         │ id (PK)          │
       │         │ venue_id (FK)    │
       │         │ file_url         │
       │         │ ...              │
       │         └──────────────────┘
       │
       │ 1:n     ┌──────────────────┐
       └─────────┤ venue_notes      │
       │         ├──────────────────┤
       │         │ id (PK)          │
       │         │ venue_id (FK)    │
       │         │ content          │
       │         │ ...              │
       │         └──────────────────┘
       │
       │ 1:n     ┌──────────────────┐
       └────────►│ venue_bookings   │◄────────────┐
                 ├──────────────────┘             │
                 │ id (PK)                        │
                 │ venue_id (FK)                  │
                 │ event_id (FK) ─────────────────┘
                 │ start_time                     │
                 │ end_time                       │ n:1
                 │ ...                            │
                 └────────────────────────────────┘
       │
       │ 1:n     ┌──────────────────┐
       └────────►│ ical_feeds       │
                 ├──────────────────┤
                 │ id (PK)          │
                 │ venue_id (FK)    │
                 │ access_token     │
                 │ feed_url         │
                 └──────────────────┘

┌─────────────────┐     1:n     ┌──────────────────┐
│ calendar_syncs  │◄────────────│ calendar_sync_logs│
├─────────────────┤             ├──────────────────┤
│ id (PK)         │     1:n     │ id (PK)          │
│ venue_id (FK)   │◄────────────│ sync_id (FK)     │
│ provider        │             │ status           │
│ access_token    │             │ ...              │
│ ...             │     1:n     └──────────────────┘
└─────────────────┘◄───────────┐
                               ┌──────────────────────┐
                               │ external_calendar_   │
                               │ events               │
                               ├──────────────────────┤
                               │ id (PK)              │
                               │ sync_id (FK)         │
                               │ external_event_id    │
                               │ ...                  │
                               └──────────────────────┘
```

---

## 4. API-Endpunkte

### 4.1 REST API — Spielorte (`/api/v1/venues`)

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `GET` | `/api/v1/venues` | Alle Spielorte der Organisation auflisten | Bearer |
| `POST` | `/api/v1/venues` | Neuen Spielort anlegen | Bearer |
| `GET` | `/api/v1/venues/:id` | Spielort-Details abrufen | Bearer |
| `PUT` | `/api/v1/venues/:id` | Spielort aktualisieren | Bearer |
| `DELETE` | `/api/v1/venues/:id` | Spielort (soft) löschen | Bearer |
| `GET` | `/api/v1/venues/:id/contacts` | Kontaktpersonen auflisten | Bearer |
| `POST` | `/api/v1/venues/:id/contacts` | Kontaktperson hinzufügen | Bearer |
| `PUT` | `/api/v1/venues/:id/contacts/:contactId` | Kontaktperson aktualisieren | Bearer |
| `DELETE` | `/api/v1/venues/:id/contacts/:contactId` | Kontaktperson entfernen | Bearer |
| `GET` | `/api/v1/venues/:id/contracts` | Verträge auflisten | Bearer |
| `POST` | `/api/v1/venues/:id/contracts` | Vertrag hochladen | Bearer + Multipart |
| `GET` | `/api/v1/venues/:id/contracts/:contractId/download` | Vertrag herunterladen | Bearer |
| `DELETE` | `/api/v1/venues/:id/contracts/:contractId` | Vertrag löschen | Bearer |
| `GET` | `/api/v1/venues/:id/notes` | Notizen auflisten | Bearer |
| `POST` | `/api/v1/venues/:id/notes` | Notiz erstellen | Bearer |
| `PUT` | `/api/v1/venues/:id/notes/:noteId` | Notiz aktualisieren | Bearer |
| `DELETE` | `/api/v1/venues/:id/notes/:noteId` | Notiz löschen | Bearer |
| `GET` | `/api/v1/venues/:id/stats` | Statistiken abrufen | Bearer |
| `GET` | `/api/v1/venues/:id/availability` | Verfügbarkeit prüfen (Query: start, end) | Bearer |

### 4.2 REST API — Buchungen (`/api/v1/venue-bookings`)

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `GET` | `/api/v1/venue-bookings` | Buchungen auflisten (Query: venue_id, start, end) | Bearer |
| `POST` | `/api/v1/venue-bookings` | Neue Buchung erstellen | Bearer |
| `PUT` | `/api/v1/venue-bookings/:id` | Buchung aktualisieren | Bearer |
| `DELETE` | `/api/v1/venue-bookings/:id` | Buchung löschen | Bearer |
| `POST` | `/api/v1/venue-bookings/check-conflicts` | Konflikt-Check (Bulk) | Bearer |
| `POST` | `/api/v1/venue-bookings/:id/split` | Buchung splitten (z.B. Umbau) | Bearer |

### 4.3 REST API — Kalender-Sync (`/api/v1/calendar-syncs`)

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `GET` | `/api/v1/calendar-syncs` | Sync-Konfigurationen auflisten | Bearer |
| `POST` | `/api/v1/calendar-syncs` | Neue Sync-Konfiguration anlegen | Bearer + OAuth |
| `GET` | `/api/v1/calendar-syncs/:id` | Sync-Konfiguration abrufen | Bearer |
| `PUT` | `/api/v1/calendar-syncs/:id` | Sync-Konfiguration aktualisieren | Bearer |
| `DELETE` | `/api/v1/calendar-syncs/:id` | Sync-Konfiguration löschen | Bearer |
| `POST` | `/api/v1/calendar-syncs/:id/sync-now` | Manueller Sync-Trigger | Bearer |
| `GET` | `/api/v1/calendar-syncs/:id/logs` | Sync-Logs abrufen | Bearer |
| `POST` | `/api/v1/calendar-syncs/google/webhook` | Google Push-Notification Webhook | Token |
| `POST` | `/api/v1/calendar-syncs/microsoft/webhook` | Outlook Webhook (Microsoft Graph) | Token |

### 4.4 REST API — iCal-Feeds (`/api/v1/ical-feeds`)

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `GET` | `/api/v1/ical-feeds` | iCal-Feeds auflisten | Bearer |
| `POST` | `/api/v1/ical-feeds` | Neuen iCal-Feed erstellen | Bearer |
| `DELETE` | `/api/v1/ical-feeds/:id` | iCal-Feed löschen | Bearer |
| `GET` | `/ical/:token` | **Öffentlicher iCal-Feed** (RFC 5545) | None |
| `GET` | `/ical/:token.ics` | iCal-Feed mit Dateiendung | None |

### 4.5 REST API — Kalender-Ansicht (`/api/v1/calendar`)

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `GET` | `/api/v1/calendar/events` | Events für Kalender-Ansicht (Query: start, end, venue_ids[]) | Bearer |
| `GET` | `/api/v1/calendar/venues` | Spielorte mit Farben für Kalender-Legende | Bearer |

### 4.6 GraphQL Schema (Auszug)

```graphql
type Venue {
  id: UUID!
  name: String!
  slug: String!
  address: Address!
  capacity: Int
  facilities: VenueFacilities!
  color: String!
  contacts: [VenueContact!]!
  contracts: [VenueContract!]!
  notes: [VenueNote!]!
  bookings(start: DateTime!, end: DateTime!): [VenueBooking!]!
  isAvailable(start: DateTime!, end: DateTime!): AvailabilityResult!
  icalFeeds: [IcalFeed!]!
  stats(period: DateRange!): VenueStats!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type AvailabilityResult {
  available: Boolean!
  conflicts: [VenueBooking!]!
  suggestedAlternatives: [AlternativeSlot!]!
}

type AlternativeSlot {
  type: String!  # "time" | "venue"
  venue: Venue
  startTime: DateTime
  endTime: DateTime
  reason: String
}

type VenueBooking {
  id: UUID!
  venue: Venue!
  event: Event
  bookingType: BookingType!
  title: String!
  startTime: DateTime!
  endTime: DateTime!
  status: BookingStatus!
  source: BookingSource!
  syncVersion: Int!
}

type CalendarSync {
  id: UUID!
  venue: Venue
  provider: CalendarProvider!
  providerAccountEmail: String!
  externalCalendarName: String
  syncDirection: SyncDirection!
  syncEnabled: Boolean!
  lastSyncAt: DateTime
  lastSyncStatus: SyncStatus
  logs(limit: Int = 50): [CalendarSyncLog!]!
}

enum BookingType { EVENT BLOCKED SETUP TEARDOWN }
enum BookingStatus { CONFIRMED TENTATIVE CANCELLED }
enum BookingSource { MANUAL GOOGLE_CALENDAR OUTLOOK API }
enum CalendarProvider { GOOGLE MICROSOFT APPLE }
enum SyncDirection { TO_EXTERNAL FROM_EXTERNAL BIDIRECTIONAL }
enum SyncStatus { SUCCESS ERROR PARTIAL }

# Queries
venue(id: UUID!): Venue
venues(organizationId: UUID!, activeOnly: Boolean = true): [Venue!]!
venueBookings(filter: BookingFilter!): [VenueBooking!]!
calendarEvents(filter: CalendarFilter!): [CalendarEvent!]!

# Mutations
createVenue(input: CreateVenueInput!): Venue!
updateVenue(id: UUID!, input: UpdateVenueInput!): Venue!
deleteVenue(id: UUID!): Boolean!
createVenueBooking(input: CreateBookingInput!): VenueBooking!
checkAvailability(input: AvailabilityCheckInput!): AvailabilityResult!
initCalendarSync(input: CalendarSyncInput!): CalendarSync!
triggerSync(id: UUID!): SyncResult!
```

---

## 5. UI-Komponenten

### 5.1 Komponenten-Hierarchie

```
VenueModule
├── VenueCalendarPage          (/venues/calendar)
│   ├── MultiVenueCalendar
│   │   ├── CalendarToolbar    (Ansicht wechseln, Heute, Filter)
│   │   ├── CalendarWeekView   (Hauptansicht: Woche)
│   │   │   ├── TimeGrid
│   │   │   ├── VenueColumn    (pro Spielort)
│   │   │   │   ├── EventCard  (farbcodiert)
│   │   │   │   └── SetupBlock (Aufbauzeit)
│   │   │   └── CurrentTimeIndicator
│   │   ├── CalendarMonthView
│   │   └── CalendarAgendaView (Listenansicht)
│   └── CalendarLegend         (Farben → Spielorte)
│
├── VenueListPage              (/venues)
│   ├── VenueCardGrid
│   │   └── VenueCard
│   │       ├── VenuePreviewImage
│   │       ├── VenueCapacityBadge
│   │       └── VenueQuickActions
│   └── VenueFilters
│
├── VenueDetailPage            (/venues/:id)
│   ├── VenueHeader
│   │   ├── VenueColorPicker
│   │   └── VenueStatusToggle
│   ├── VenueInfoTab
│   │   ├── VenueAddressMap
│   │   ├── VenueFacilitiesGrid
│   │   └── VenueContactsList
│   ├── VenueCalendarTab
│   │   └── SingleVenueCalendar
│   ├── VenueNotesTab
│   │   ├── NoteEditor (Rich-Text)
│   │   └── NoteCardList
│   ├── VenueContractsTab
│   │   ├── ContractUploader
│   │   └── ContractCardList
│   └── VenueStatsTab
│       └── VenueStatsCharts
│
├── VenueCreatePage            (/venues/new)
│   └── VenueForm
│       ├── AddressAutocomplete
│       ├── FacilityCheckboxes
│       └── ContactInputRepeater
│
├── VenueAvailabilityModal
│   ├── AvailabilityChecker
│   ├── ConflictDisplay
│   └── AlternativeSuggestions
│
├── CalendarSyncPage           (/settings/calendar-sync)
│   ├── SyncAccountCard
│   │   ├── ProviderIcon
│   │   ├── SyncStatusBadge
│   │   └── SyncActionButtons
│   ├── SyncConfigForm
│   └── SyncLogViewer
│
├── IcalFeedManager            (/settings/ical-feeds)
│   ├── IcalFeedList
│   ├── IcalFeedCreator
│   └── QRCodeDisplay
│
└── EventVenueSelector         (in Event-Form)
    ├── VenueDropdown
    ├── VenueQuickAdd
    └── AvailabilityIndicator
```

### 5.2 Detailbeschreibung wichtiger Komponenten

#### `MultiVenueCalendar`
- **Library**: `@fullcalendar/react` mit `@fullcalendar/resource-timeline` oder `@fullcalendar/resource-timegrid`
- **Features**: Ressourcen-basierte Ansicht (pro Spielort eine Spalte), Drag-and-Drop, Resize
- **Alternative**: `react-big-calendar` mit Custom Resource-View
- **Farbcodierung**: Event-Hintergrund = Spielort-Farbe, Event-Text = kontrastierend

#### `AvailabilityChecker`
- **Eingabe**: Spielort-ID, gewünschter Zeitraum
- **Ausgabe**: Verfügbar (grün) / Nicht verfügbar (rot) mit Konflikt-Details
- **Vorschläge**: Alternative Zeiträume (±7 Tage) oder alternative Spielorte

#### `CalendarSyncCard`
- **Anzeige**: Provider-Icon, Account-E-Mail, letzter Sync-Status, Sync-Richtung
- **Aktionen**: Sync jetzt, Einstellungen, Trennen
- **Status-Badge**: Grün (aktiv), Gelb (seit >1h kein Sync), Rot (Fehler)

---

## 6. Integrationen

### 6.1 Übersicht externer APIs/Services

| Service | Zweck | API-Typ | Kosten |
|---------|-------|---------|--------|
| **Google Calendar API** | Two-Way-Sync, Push Notifications | REST API + OAuth2 | Kostenlos bis 1M Quota/Tag |
| **Microsoft Graph API** | Outlook Calendar Sync | REST API + OAuth2 | Kostenlos bis 10k Calls/Min |
| **iCal-Generierung** | RFC 5545 Feed-Export | Server-seitige Generierung | Keine externen Kosten |
| **Kulturserver.de** | Öffentliche Event-Veröffentlichung | REST/SOAP (zu prüfen) | Eventuell kooperativ |
| **Eventfrog Public API** | Stadtportal-Integration | REST API | API-Key erforderlich |
| **Nominatim (OpenStreetMap)** | Adresse → Koordinaten | REST API | Kostenlos mit Attribution |
| **Google Maps Embed API** | Karten-Anzeige im Spielort-Profil | Embed API | Kostenlos |

### 6.2 Google Calendar Integration (detailliert)

```
┌─────────────────┐     OAuth2     ┌─────────────────┐
│   Dashboard     │ ─────────────► │  Google Auth    │
│   (User)        │                │  (Consent)      │
└─────────────────┘                └─────────────────┘
         │                                  │
         │         Auth Code                │
         │ ◄────────────────────────────────┘
         │
         │    Token Exchange (server-seitig)
         │
┌─────────────────┐                ┌─────────────────┐
│   Backend       │ ◄───────────── │  Google Token   │
│   (Speichert:   │  Access Token  │  Endpoint       │
│   access_token, │  Refresh Token │                 │
│   refresh_token,│                │                 │
│   expires_at)   │                │                 │
└─────────────────┘                └─────────────────┘
         │
         │    API-Calls (mit Access Token)
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  Google Calendar API v3                              │
│  • calendar.events.list (Delta mit syncToken)       │
│  • calendar.events.insert                           │
│  • calendar.events.update                           │
│  • calendar.events.delete                           │
│  • calendar.events.watch (Push Notifications)       │
└─────────────────────────────────────────────────────┘
```

**Push Notifications Flow:**
1. Backend registriert Webhook-Channel via `events.watch`
2. Google sendet Push-Benachrichtigung bei Änderung
3. Backend empfängt POST-Request auf `/api/v1/calendar-syncs/google/webhook`
4. Backend führt inkrementellen Sync durch (`events.list` mit `syncToken`)
5. Bei ablaufendem Channel: Re-Registration via `events.watch`

### 6.3 Microsoft Graph Integration (detailliert)

```
┌─────────────────┐     OAuth2     ┌─────────────────┐
│   Dashboard     │ ─────────────► │  Microsoft      │
│   (User)        │                │  Identity       │
└─────────────────┘                │  Platform       │
         │                         └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  Microsoft Graph API                                 │
│  • GET /me/calendars                                │
│  • GET /me/calendars/{id}/events                    │
│  • POST /me/calendars/{id}/events                   │
│  • PATCH /me/calendars/{id}/events/{eventId}        │
│  • DELETE /me/calendars/{id}/events/{eventId}       │
│  • POST /subscriptions (Change Notifications)       │
└─────────────────────────────────────────────────────┘
```

### 6.4 Kulturserver.de Integration

| Aspekt | Details |
|--------|---------|
| API | REST/SOAP (konkrete API-Dokumentation bei Kulturserver anfragen) |
| Authentifizierung | API-Key oder OAuth2 |
| Datenformat | XML oder JSON |
| Übertragung | Event-Titel, Datum, Uhrzeit, Spielort, Beschreibung, Bilder |
| Trigger | Bei Status-Änderung auf "veröffentlicht" |
| Fallback | Manueller CSV-Export falls API nicht verfügbar |

### 6.5 Eventfrog Integration

| Aspekt | Details |
|--------|---------|
| API | Eventfrog Public API |
| Authentifizierung | API-Key |
| Endpunkt | `POST /api/v1/events` |
| Trigger | Automatisch bei Veröffentlichung oder manuell |

---

## 7. Technische Details

### 7.1 iCal-Generierung (RFC 5545)

**Library**: `ical-generator` (npm: `ical-generator`)

```typescript
// Beispiel: iCal-Feed Generierung
import ical from 'ical-generator';
import { VenueBooking } from './types';

export function generateICalFeed(
  venueName: string,
  bookings: VenueBooking[],
  feedConfig: IcalFeedConfig
): string {
  const calendar = ical({
    name: `Veranstaltungen - ${venueName}`,
    description: `Automatisch generierter Kalender für ${venueName}`,
    timezone: 'Europe/Berlin',
    prodId: '//KleinkunstDashboard//DE',
    url: feedConfig.feedUrl,
    ttl: 60 * 5, // 5 Minuten Cache
  });

  for (const booking of bookings) {
    calendar.createEvent({
      id: booking.id,
      summary: booking.title,
      description: feedConfig.includeDescription 
        ? booking.event?.description 
        : undefined,
      start: booking.startTime,
      end: booking.endTime,
      location: `${venueName}`,
      status: mapBookingStatusToIcal(booking.status),
      created: booking.createdAt,
      lastModified: booking.updatedAt,
      transparency: booking.bookingType === 'event' 
        ? 'OPAQUE' 
        : 'TRANSPARENT',
    });
  }

  return calendar.toString();
}

function mapBookingStatusToIcal(
  status: BookingStatus
): 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED' {
  const mapping = {
    confirmed: 'CONFIRMED',
    tentative: 'TENTATIVE',
    cancelled: 'CANCELLED',
  };
  return mapping[status];
}
```

**iCal-Feed Endpoint:**
```typescript
// Express-Route für iCal-Feed
app.get('/ical/:token', async (req, res) => {
  const feed = await icalFeedService.getByToken(req.params.token);
  if (!feed || (!feed.isPublic && !req.query.key)) {
    return res.status(404).send('Feed not found');
  }

  const bookings = await venueBookingService.getForVenue(
    feed.venueId,
    { start: subMonths(new Date(), 1), end: addMonths(new Date(), 12) }
  );

  const icalData = generateICalFeed(
    feed.venue.name,
    bookings,
    feed
  );

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${feed.venue.slug}.ics"`);
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.send(icalData);
});
```

### 7.2 Google Calendar API Integration

```typescript
// Google Calendar Sync Service
import { google, calendar_v3 } from 'googleapis';

class GoogleCalendarSyncService {
  private oauth2Client: OAuth2Client;
  private calendar: calendar_v3.Calendar;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.APP_URL}/api/v1/calendar-syncs/google/callback`
    );
    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  // OAuth-Flow
  getAuthUrl(redirectUri: string): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
      state: redirectUri,
    });
  }

  async exchangeCode(code: string): Promise<TokenInfo> {
    const { tokens } = await this.oauth2Client.getToken(code);
    return {
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
      expiresAt: new Date(tokens.expiry_date!),
    };
  }

  // Event-Sync: Dashboard → Google
  async pushEvent(
    syncConfig: CalendarSync,
    booking: VenueBooking
  ): Promise<string> {
    await this.setCredentials(syncConfig);

    const event: calendar_v3.Schema$Event = {
      summary: booking.title,
      description: booking.event?.description,
      start: {
        dateTime: booking.startTime.toISOString(),
        timeZone: 'Europe/Berlin',
      },
      end: {
        dateTime: booking.endTime.toISOString(),
        timeZone: 'Europe/Berlin',
      },
      location: booking.venue?.name,
      extendedProperties: {
        private: {
          kleinkunstBookingId: booking.id,
          kleinkunstVenueId: booking.venueId,
          syncVersion: String(booking.syncVersion),
        },
      },
    };

    if (booking.externalEventId) {
      // Update bestehendes Event
      const response = await this.calendar.events.patch({
        calendarId: syncConfig.externalCalendarId!,
        eventId: booking.externalEventId,
        requestBody: event,
      });
      return response.data.id!;
    } else {
      // Neues Event erstellen
      const response = await this.calendar.events.insert({
        calendarId: syncConfig.externalCalendarId!,
        requestBody: event,
      });
      return response.data.id!;
    }
  }

  // Event-Sync: Google → Dashboard (inkrementell)
  async pullEvents(
    syncConfig: CalendarSync,
    since?: Date
  ): Promise<ExternalCalendarEvent[]> {
    await this.setCredentials(syncConfig);

    const params: calendar_v3.Params$Resource$Events$List = {
      calendarId: syncConfig.externalCalendarId!,
      updatedMin: since?.toISOString(),
      showDeleted: true,
      singleEvents: true,
      orderBy: 'updated',
    };

    // Verwende syncToken für inkrementelle Updates wenn verfügbar
    if (syncConfig.googleSyncToken) {
      params.syncToken = syncConfig.googleSyncToken;
    }

    const response = await this.calendar.events.list(params);

    // Speichere syncToken für nächsten Durchlauf
    await this.saveSyncToken(syncConfig.id, response.data.nextSyncToken);

    return response.data.items?.map(this.mapGoogleEvent) || [];
  }

  // Push Notifications (Webhooks) registrieren
  async registerWebhook(
    syncConfig: CalendarSync
  ): Promise<{ channelId: string; resourceId: string }> {
    await this.setCredentials(syncConfig);

    const channelId = `kleinkunst-${syncConfig.id}-${Date.now()}`;
    const response = await this.calendar.events.watch({
      calendarId: syncConfig.externalCalendarId!,
      requestBody: {
        id: channelId,
        type: 'web_hook',
        address: `${process.env.API_URL}/api/v1/calendar-syncs/google/webhook`,
        expiration: String(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 Tage
      },
    });

    return {
      channelId: response.data.id!,
      resourceId: response.data.resourceId!,
    };
  }

  private async setCredentials(syncConfig: CalendarSync): Promise<void> {
    // Token refreshen wenn nötig
    if (syncConfig.tokenExpiresAt < new Date()) {
      this.oauth2Client.setCredentials({
        refresh_token: syncConfig.refreshToken,
      });
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      await this.updateTokens(syncConfig.id, {
        accessToken: credentials.access_token!,
        expiresAt: new Date(credentials.expiry_date!),
      });
    }

    this.oauth2Client.setCredentials({
      access_token: syncConfig.accessToken,
      refresh_token: syncConfig.refreshToken,
    });
  }
}
```

### 7.3 Konflikt-Erkennungs-Algorithmus

```typescript
// Konflikt-Erkennungs-Algorithmus
// Prüft Überschneidungen mit Berücksichtigung von Auf-/Abbauzeiten

interface ConflictCheckInput {
  venueId: string;
  startTime: Date;
  endTime: Date;
  excludeBookingId?: string; // Für Updates: eigenen Eintrag ignorieren
  includeBuffer: boolean;     // Auf-/Abbauzeiten berücksichtigen
}

interface ConflictResult {
  hasConflict: boolean;
  conflicts: Array<{
    booking: VenueBooking;
    overlapType: 'full' | 'partial' | 'buffer';
    overlapMinutes: number;
  }>;
  availableSlots: Array<{
    start: Date;
    end: Date;
  }>;
}

class VenueAvailabilityService {
  constructor(
    private db: Database,
    private venueService: VenueService
  ) {}

  async checkAvailability(input: ConflictCheckInput): Promise<ConflictResult> {
    // 1. Spielort laden für Pufferzeiten
    const venue = await this.venueService.getById(input.venueId);
    
    // 2. Effektiven Zeitraum berechnen (mit Puffer)
    let checkStart = input.startTime;
    let checkEnd = input.endTime;
    
    if (input.includeBuffer && venue) {
      checkStart = subMinutes(input.startTime, venue.setupTimeMinutes);
      checkEnd = addMinutes(input.endTime, venue.teardownTimeMinutes);
    }

    // 3. Bestehende Buchungen im Zeitraum laden
    const existingBookings = await this.db.venueBookings
      .where('venue_id', input.venueId)
      .where('status', '!=', 'cancelled')
      .where(function() {
        this.whereBetween('start_time', [checkStart, checkEnd])
            .orWhereBetween('end_time', [checkStart, checkEnd])
            .orWhere(function() {
              this.where('start_time', '<=', checkStart)
                  .where('end_time', '>=', checkEnd);
            });
      })
      .whereNot('id', input.excludeBookingId || '')
      .select();

    // 4. Konflikte analysieren
    const conflicts = existingBookings.map(booking => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      
      // Pufferzeiten der bestehenden Buchung
      const bufferedBookingStart = venue 
        ? subMinutes(bookingStart, venue.setupTimeMinutes)
        : bookingStart;
      const bufferedBookingEnd = venue
        ? addMinutes(bookingEnd, venue.teardownTimeMinutes)
        : bookingEnd;

      // Überschneidung berechnen
      const overlapStart = max([checkStart, bufferedBookingStart]);
      const overlapEnd = min([checkEnd, bufferedBookingEnd]);
      const overlapMinutes = differenceInMinutes(overlapEnd, overlapStart);

      let overlapType: 'full' | 'partial' | 'buffer';
      if (isWithinRange(input.startTime, bookingStart, bookingEnd) &&
          isWithinRange(input.endTime, bookingStart, bookingEnd)) {
        overlapType = 'full';
      } else if (overlapStart >= bookingStart && overlapEnd <= bookingEnd) {
        overlapType = 'partial';
      } else {
        overlapType = 'buffer'; // Nur in Auf-/Abbauzeit
      }

      return { booking, overlapType, overlapMinutes };
    });

    // 5. Alternative Slots vorschlagen
    const availableSlots = conflicts.length > 0
      ? await this.findAlternativeSlots(input)
      : [];

    return {
      hasConflict: conflicts.length > 0,
      conflicts,
      availableSlots,
    };
  }

  // Alternative Vorschläge finden
  private async findAlternativeSlots(
    input: ConflictCheckInput
  ): Promise<Array<{ start: Date; end: Date }>> {
    const venue = await this.venueService.getById(input.venueId);
    if (!venue) return [];

    const duration = differenceInMinutes(input.endTime, input.startTime);
    const slots: Array<{ start: Date; end: Date }> = [];

    // Suche nächsten freien Slot am selben Spielort (±7 Tage)
    for (let dayOffset = -7; dayOffset <= 7; dayOffset++) {
      if (dayOffset === 0) continue; // Heute überspringen (Konflikt)

      const candidateStart = addDays(
        startOfDay(input.startTime),
        dayOffset
      );
      candidateStart.setHours(input.startTime.getHours());
      candidateStart.setMinutes(input.startTime.getMinutes());
      
      const candidateEnd = addMinutes(candidateStart, duration);

      const check = await this.checkAvailability({
        venueId: input.venueId,
        startTime: candidateStart,
        endTime: candidateEnd,
        includeBuffer: true,
      });

      if (!check.hasConflict) {
        slots.push({ start: candidateStart, end: candidateEnd });
        if (slots.length >= 3) break; // Max 3 Vorschläge
      }
    }

    return slots;
  }
}
```

### 7.4 Verwendete Libraries & Dependencies

```json
{
  "dependencies": {
    "ical-generator": "^6.0.0",
    "node-ical": "^0.18.0",
    "@fullcalendar/react": "^6.1.0",
    "@fullcalendar/core": "^6.1.0",
    "@fullcalendar/daygrid": "^6.1.0",
    "@fullcalendar/timegrid": "^6.1.0",
    "@fullcalendar/resource-timegrid": "^6.1.0",
    "@fullcalendar/interaction": "^6.1.0",
    "googleapis": "^133.0.0",
    "@azure/msal-node": "^2.6.0",
    "date-fns": "^3.0.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "@radix-ui/react-popover": "^1.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-select": "^2.0.0",
    "qrcode.react": "^3.1.0",
    "react-markdown": "^9.0.0",
    "@uiw/react-md-editor": "^4.0.0"
  }
}
```

### 7.5 Sync-Strategie

| Aspekt | Implementierung |
|--------|----------------|
| **Sync-Trigger** | 1. Echtzeit via Webhooks (Google Push) 2. Polling-Fallback alle 5 Min 3. Manueller Trigger |
| **Konfliktlösung** | Letzter-Schreiber-gewinnt mit Versionsnummer (`sync_version`) |
| **Idempotenz** | Externe Event-IDs werden in `venue_bookings.external_event_id` gespeichert |
| **Retry-Logik** | Exponentielles Backoff bei API-Fehlern, max 5 Versuche |
| **Batching** | Max 50 Events pro API-Call für Google Calendar |
| **Rate Limiting** | 1.000 Calls/100 Sekunden für Google Calendar API |

### 7.6 Architektur-Entscheidungen

| Entscheidung | Begründung |
|-------------|------------|
| **Native API statt Nylas/Cronofy** | $500-2.000/Monat gespart. Mit 10-15 Spielorten lohnt sich Unified Calendar API nicht |
| **Server-seitige iCal-Generierung** | Keine zusätzlichen Kosten, volle Kontrolle über Format |
| **FullCalendar als Calendar-Library** | Beste React-Unterstützung, Resource-Views, Drag-and-Drop |
| **GraphQL + REST hybrid** | GraphQL für komplexe Queries (Venue mit allen Relationen), REST für iCal/Webhooks |
| **PostgreSQL + JSONB** | JSONB für flexible externe IDs und Provider-spezifische Daten |
| **Soft-Delete für Spielorte** | Historische Daten bleiben erhalten, Referenzen in Events bleiben gültig |

---

## 8. Akzeptanzkriterien (Definition of Done)

### 8.1 Must-Have (P0) — Modul ist ohne diese nicht nutzbar

- [ ] Veranstalter kann mindestens 15 Spielorte mit vollständigem Profil anlegen
- [ ] Adresse wird automatisch in Koordinaten umgewandelt
- [ ] Kalender zeigt alle Spielorte farbcodiert in Wochen-/Monats-/Agenda-Ansicht
- [ ] Event kann einem oder mehreren Spielorten zugewiesen werden
- [ ] Bei Doppelbuchung wird Warnung angezeigt mit Konflikt-Details
- [ ] Konfliktprüfung berücksichtigt konfigurierbare Auf-/Abbauzeiten
- [ ] Änderungen am Event werden automatisch im Kalender reflektiert
- [ ] Spielort-Profile sind nur für Mitglieder der Organisation sichtbar

### 8.2 Should-Have (P1) — Wichtig für Produktivbetrieb

- [ ] Google Calendar Two-Way-Sync funktioniert mit OAuth2
- [ ] Push Notifications von Google werden korrekt verarbeitet
- [ ] Outlook Calendar Sync funktioniert über Microsoft Graph
- [ ] iCal-Feed pro Spielort ist abrufbar und valide (RFC 5545)
- [ ] iCal-Feed enthält alle relevanten Event-Informationen
- [ ] Sync-Konflikte werden automatisch erkannt und gelöst (Versioning)
- [ ] Sync-Logs sind einsehbar mit Filter nach Status
- [ ] Spielort-Kontaktpersonen sind verwaltbar
- [ ] Verträge können hochgeladen und verwaltet werden
- [ ] Spielort-Notizen sind nach Kategorien filterbar

### 8.3 Nice-to-Have (P2) — Erweiterte Funktionalität

- [ ] Automatische Veröffentlichung auf Kulturserver.de
- [ ] Automatische Veröffentlichung auf Eventfrog
- [ ] QR-Code für iCal-Feed-Abonnement
- [ ] Spielort-Statistiken mit Vergleichsansicht
- [ ] Drag-and-Drop von Events zwischen Spielorten
- [ ] Apple Calendar Sync
- [ ] Vertragsablauf-Erinnerungen per E-Mail
- [ ] Karten-Anzeige mit allen Spielorten
- [ ] Dark-Mode Unterstützung für Kalender
- [ ] Kalender-Druckansicht

### 8.4 Technische Akzeptanzkriterien

- [ ] iCal-Feed generiert in < 500ms bei bis zu 500 Events
- [ ] Kalender-Ansicht lädt in < 2 Sekunden (30 Tage, 15 Spielorte)
- [ ] Konfliktprüfung läuft in < 200ms
- [ ] Google Calendar Sync synchronisiert Änderungen in < 4 Sekunden (via Webhook)
- [ ] Alle API-Endpunkte sind authentifiziert (außer öffentliche iCal-Feeds)
- [ ] iCal-Feeds unterstützen UTF-8 und deutsche Zeichen (Umlaute)
- [ ] Zeitzonen werden korrekt gehandhabt (Europe/Berlin)
- [ ] DSGVO: Alle personenbezogenen Daten sind löschbar
- [ ] Unit-Test-Coverage > 80% für Sync- und Konflikt-Logik
- [ ] E2E-Tests für Kalender-Ansicht und Event-Zuordnung

### 8.5 Nicht-funktionale Anforderungen

| Kriterium | Zielwert |
|-----------|----------|
| Verfügbarkeit | 99.5% Uptime |
| Sync-Latenz (Google Webhook) | < 4 Sekunden |
| Sync-Latenz (Polling-Fallback) | < 5 Minuten |
| Kalender-Rendering | < 2 Sekunden |
| gleichzeitige Benutzer | 50+ pro Organisation |
| Spielorte pro Organisation | 50+ |
| Events pro Spielort | 1.000+ pro Jahr |

---

## 9. Implementierungsphasen

### Phase 1: Kernfunktionalität (Woche 1-2)
- Datenbank-Schema erstellen
- CRUD API für Spielorte
- Basis-Kalender-Ansicht (Woche/Monat)
- Event-Spielort-Zuordnung
- Konflikt-Erkennung

### Phase 2: Erweiterte Verwaltung (Woche 3)
- Spielort-Kontakte, Notizen, Verträge
- iCal-Feed Generierung
- Single-Spielort-Kalender
- Spielort-Statistiken

### Phase 3: Kalender-Sync (Woche 4-5)
- Google Calendar OAuth + Sync
- Push Notifications
- Outlook Calendar Sync
- Sync-Konfliktmanagement

### Phase 4: Integrationen (Woche 6)
- Kulturserver.de API-Anbindung
- Eventfrog API-Anbindung
- QR-Codes für iCal-Feeds
- Öffentliche Kalender-Feeds

### Phase 5: Polish (Woche 7)
- Drag-and-Drop
- Performance-Optimierung
- E2E-Tests
- Doku & Onboarding

---

## 10. Risiken & Mitigationen

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Google API Quota-Limits | Niedrig | Hoch | Caching, Batch-Requests, Monitoring |
| Kulturserver API nicht verfügbar | Mittel | Mittel | CSV-Fallback, manueller Export |
| Sync-Konflikte (gleichzeitige Änderung) | Mittel | Mittel | Versioning, Konflikt-UI für manuelle Auflösung |
| Zeitzone-Probleme (Sommer-/Winterzeit) | Niedrig | Hoch | Durchgängig UTC + Europe/Berlin Display |
| OAuth-Token Ablauf ohne Refresh | Niedrig | Hoch | Proaktives Refresh, E-Mail-Benachrichtigung |

---

*Dokument erstellt: 2024 | Version: 1.0 | Modul: Spielort- & Kalender-Management*

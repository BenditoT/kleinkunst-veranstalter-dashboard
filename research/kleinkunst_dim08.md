# Dimension 8: Ticketing, Gaestelisten & Zuschauermanagement

## Modul-Spezifikation - Kleinkunst-Veranstalter Dashboard

**Version:** 1.0
**Status:** Entwurf
**Letzte Aktualisierung:** 2025-01-16

---

## 1. Feature-Beschreibung

Das Ticketing-Modul bildet das zentrale Verkaufs- und Zugangsmanagement-System der Kleinkunst-Dashboard-App. Es ermoeglicht Veranstaltern den vollstaendigen Lifecycle von Tickets abzubilden -- von der Erstellung verschiedener Ticket-Typen ueber den Verkauf und die Reservierung bis hin zur Einlasskontrolle und Nachverfolgung von Zuschauerzahlen. Das Modul ist speziell auf die Beduerfnisse kleiner und mittlerer Kulturveranstalter zugeschnitten (Kleinkunstbuehnen, Theater unter 500 Plaetze, Clubs, Kulturzentren) und bietet eine kostenguenstige Alternative zu Enterprise-Systemen wie CTS Eventim oder Reservix.

**Kernfunktionen:**
- Flexible Ticket-Typen-Verwaltung (VVK, AK, ermassigt, PWYW, Freikarten, Staff)
- Mehrkanaliger Ticketverkauf (Online, Abendkasse, Telefon/Vor-Ort)
- Gaestelisten-Management mit Echtzeit-Synchronisation
- Reservierungssystem mit automatisierter Stornierung (Timeout)
- QR-Code-basierte Check-in/Scan-Loesung (Web-App, optional native App)
- Echtzeit-Zuschauerzaehlung und Auslastungs-Tracking
- Warteliste fuer ausverkaufte Events
- Gaestelisten-Export fuer Einlasskontrolle (PDF, CSV)
- Newsletter-Integration: Ticketer automatisch zu Empfaengerlisten hinzufuegen

---

## 2. User Stories

### 2.1 Ticket-Typen & Verkauf

**US-8.1:** Als Veranstalter moechte ich verschiedene Ticket-Typen fuer ein Event anlegen (Vorverkauf, Abendkasse, ermassigt, Pay-What-You-Want, Freikarten, Staff/VIP), damit ich flexibel auf verschiedene Zielgruppen und Preismodelle reagieren kann.

**US-8.2:** Als Veranstalter moechte ich fuer jeden Ticket-Typen individuelle Verfuegbarkeiten, Preise, Verkaufszeitraeume und Altersbeschraenkungen definieren, damit ich den Verkauf granular steuern kann.

**US-8.3:** Als Veranstalter moechte ich eine maximale Gesamtkapazitaet pro Event sowie pro Ticket-Typ festlegen koennen, damit ich Ueberbuchungen vermeide.

**US-8.4:** Als Veranstalter moechte ich fuer ermassigte Tickets einen Nachweis konfigurieren koennen (Schueler, Student, Senior, Schwerbehindert), damit ich den berechtigten Personenkreis einschraenken kann.

**US-8.5:** Als Veranstalter moechte ich im Pay-What-You-Want-Modell einen Mindest- und empfohlenen Preis definieren, damit ich trotz flexibler Preisgestaltung meine Kosten decken kann.

### 2.2 Gaesteliste & Reservierungen

**US-8.6:** Als Veranstalter moechte ich Gaestelisten pro Event verwalten, die sowohl verkaufte Tickets als auch Reservierungen enthalten, damit ich alle Zugaenge zentral im Blick habe.

**US-8.7:** Als Veranstalter moechte ich Reservierungen manuell anlegen koennen (Name, E-Mail, Telefon, Anzahl, Ticket-Typ), damit ich telefonische oder persoenliche Anfragen erfassen kann.

**US-8.8:** Als Veranstalter moechte ich fuer Reservierungen eine automatische Stornierungsfrist konfigurieren koennen (z.B. 2 Stunden vor Eventbeginn), damit nicht abgeholte Tickets automatisch wieder freigegeben werden.

**US-8.9:** Als Veranstalter moechte ich Reservierungen als "bestaetigt", "offen" oder "storniert" markieren koennen, damit ich den Status jeder Reservierung nachverfolgen kann.

**US-8.10:** Als Veranstalter moechte ich Reservierungen per E-Mail bestaetigen koennen inklusive QR-Code, damit Gaeste eine offizielle Bestaetigung erhalten.

### 2.3 Check-in & QR-Code-Scanning

**US-8.11:** Als Einlass-Personal moechte ich QR-Codes von Tickets ueber ein mobiles Geraet scannen koennen, damit ich den Zutritt schnell und zuverlaessig kontrollieren kann.

**US-8.12:** Als Einlass-Personal moechte ich bei jedem Scan sofort sehen, ob das Ticket gueltig, bereits gescannt oder ungueltig ist, damit ich Faelschungen und Mehrfacheinlass verhindere.

**US-8.13:** Als Einlass-Personal moechte ich auch ohne Internetverbindung scannen koennen (Offline-Modus), damit der Check-in bei schlechtem Netzempfang im Keller oder Hinterzimmer funktioniert.

**US-8.14:** Als Einlass-Personal moechte ich manuelle Eintraege vornehmen koennen (z.B. Gaesteliste-Abhaken, Notizen), falls ein QR-Code nicht lesbar ist.

**US-8.15:** Als Veranstalter moechte ich in Echtzeit sehen, wie viele Personen bereits eingelassen wurden, damit ich die aktuelle Auslastung kenne.

### 2.4 Warteliste & Zuschauer-Tracking

**US-8.16:** Als Interessent moechte ich mich auf eine Warteliste fuer ein ausverkauftes Event setzen koennen, damit ich informiert werde, wenn wieder Tickets verfuegbar sind.

**US-8.17:** Als Veranstalter moechte ich automatisch Benachrichtigungen an Wartelisten-Kandidaten senden, wenn Tickets (z.B. durch Stornierung) wieder verfuegbar werden, damit ich die Auslastung maximieren kann.

**US-8.18:** Als Veranstalter moechte ich Statistiken ueber Zuschauerzahlen pro Event, pro Ort und pro Zeitraum einsehen koennen, damit ich meine Planung und Programmierung optimieren kann.

**US-8.19:** Als Veranstalter moechte ich die Abendkasse-Zahlen manuell eingeben koennen, damit ich Online-Verkauf und Vor-Ort-Verkauf in einer Gesamtstatistik zusammenfuehren kann.

### 2.5 Gaestelisten-Export & Newsletter

**US-8.20:** Als Veranstalter moechte ich Gaestelisten als PDF oder CSV exportieren koennen, damit ich sie fuer die Einlasskontrolle ausdrucken oder an Mitarbeiter weitergeben kann.

**US-8.21:** Als Veranstalter moechte ich Gaestelisten mit spezifischen Spalten konfigurieren (Name, Ticket-Typ, Reservierungsstatus, Notizen, QR-Code), damit der Export meinen Anforderungen entspricht.

**US-8.22:** Als Veranstalter moechte ich, dass Ticketkaeufer automatisch zu meiner Newsletter-Empfaengerliste hinzugefuegt werden (mit Double-Opt-In), damit ich sie ueber zukuenftige Events informieren kann.

**US-8.23:** Als Veranstalter moechte ich pro Event konfigurieren koennen, ob Ticketkaeufer automatisch zum Newsletter hinzugefuegt werden, damit ich die Einwilligung sitzungsbezogen steuern kann.

---

## 3. Datenmodell

### 3.1 Uebersicht Tabellen/Collections

```
ticket_types          - Ticket-Typ-Definitionen pro Event
tickets               - Einzelne Ticket-Instanzen (verkauft/verschickt)
reservations          - Reservierungen (manuell + automatisch)
check_ins             - Check-in/Einlass-Eintraege
waitlist              - Wartelisten-Eintraege fuer ausverkaufte Events
guestlists            - Gaestelisten-Konfigurationen
guestlist_entries     - Eintraege in Gaestelisten (Tickets + Reservierungen)
event_capacity        - Kapazitaetsverwaltung pro Event
scan_sessions         - Check-in-Sitzungen (Geraete/Stationen)
pwyw_settings         - Pay-What-You-Want Konfiguration
discount_rules        - Ermassigungs-Regeln und Nachweisanforderungen
newsletter_sync_logs  - Protokoll der Newsletter-Synchronisation
```

### 3.2 Detaillierte Tabellen-Spezifikation

#### ticket_types

| Feld | Typ | Beschreibung | Constraints |
|------|-----|--------------|-------------|
| id | UUID | Primaerschluessel | PK |
| event_id | UUID | Referenz zum Event | FK -> events.id |
| name | VARCHAR(100) | Name des Ticket-Typs | NOT NULL |
| description | TEXT | Beschreibung | |
| category | ENUM | Kategorie | 'vvk','ak','discount','pwyw','free','staff','vip' |
| price_cents | INTEGER | Preis in Cent | >= 0 |
| pwyw_min_cents | INTEGER | PWYW Mindestpreis | >= 0, nur bei pwyw |
| pwyw_suggested_cents | INTEGER | PWYW Empfohlener Preis | >= 0, nur bei pwyw |
| quantity_total | INTEGER | Maximale Anzahl | > 0 |
| quantity_sold | INTEGER | Bereits verkauft | DEFAULT 0 |
| quantity_reserved | INTEGER | Reserviert | DEFAULT 0 |
| sale_start | TIMESTAMP | Verkaufsstart | |
| sale_end | TIMESTAMP | Verkaufsende | |
| valid_from | TIMESTAMP | Gueltig ab | |
| valid_until | TIMESTAMP | Gueltig bis | |
| is_transferable | BOOLEAN | Uebertragbar? | DEFAULT true |
| max_per_order | INTEGER | Max. pro Bestellung | DEFAULT 10 |
| requires_id | BOOLEAN | ID-Nachweis noetig? | DEFAULT false |
| discount_proof_type | ENUM | Ermassigungsnachweis | 'student','senior','disability','youth','none' |
| seat_map_zone_id | UUID | Sitzplatz-Zone | FK -> seat_map_zones.id, optional |
| sort_order | INTEGER | Sortierreihenfolge | DEFAULT 0 |
| is_active | BOOLEAN | Aktiv? | DEFAULT true |
| created_at | TIMESTAMP | Erstellt | |
| updated_at | TIMESTAMP | Aktualisiert | |

**Indizes:** event_id, category, is_active, sale_start, sale_end

#### tickets

| Feld | Typ | Beschreibung | Constraints |
|------|-----|--------------|-------------|
| id | UUID | Primaerschluessel | PK |
| ticket_type_id | UUID | Ticket-Typ | FK -> ticket_types.id |
| event_id | UUID | Event | FK -> events.id |
| order_id | UUID | Bestellung | FK -> orders.id (optional) |
| reservation_id | UUID | Reservierung | FK -> reservations.id (optional) |
| ticket_number | VARCHAR(50) | Eindeutige Ticket-Nr. | UNIQUE, NOT NULL |
| qr_code_hash | VARCHAR(255) | QR-Code Hash | UNIQUE, NOT NULL |
| status | ENUM | Status | 'active','used','refunded','expired','cancelled' |
| holder_name | VARCHAR(200) | Name des Inhabers | |
| holder_email | VARCHAR(255) | E-Mail des Inhabers | |
| holder_phone | VARCHAR(50) | Telefon | |
| price_paid_cents | INTEGER | Tatsaechlich gezahlt | NOT NULL |
| sale_channel | ENUM | Verkaufskanal | 'online','box_office','phone','api','comp' |
| checked_in_at | TIMESTAMP | Einlass-Zeit | |
| checked_in_by | UUID | Einlass durch | FK -> users.id |
| checked_in_device | VARCHAR(100) | Geraet/Station | |
| seat_label | VARCHAR(50) | Sitzplatz-Bezeichnung | optional |
| metadata | JSONB | Zusaetzliche Daten | |
| created_at | TIMESTAMP | Erstellt | |
| updated_at | TIMESTAMP | Aktualisiert | |

**Indizes:** ticket_number, qr_code_hash, event_id, status, holder_email

#### reservations

| Feld | Typ | Beschreibung | Constraints |
|------|-----|--------------|-------------|
| id | UUID | Primaerschluessel | PK |
| event_id | UUID | Event | FK -> events.id |
| ticket_type_id | UUID | Ticket-Typ | FK -> ticket_types.id |
| guestlist_id | UUID | Gaesteliste | FK -> guestlists.id |
| contact_name | VARCHAR(200) | Kontakt-Name | NOT NULL |
| contact_email | VARCHAR(255) | Kontakt-E-Mail | |
| contact_phone | VARCHAR(50) | Telefon | |
| quantity | INTEGER | Anzahl Tickets | NOT NULL, > 0 |
| status | ENUM | Status | 'pending','confirmed','cancelled','expired','picked_up' |
| expires_at | TIMESTAMP | Ablaufzeitpunkt | NOT NULL |
| auto_cancel_hours | INTEGER | Auto-Stornierung (h vor Event) | DEFAULT 2 |
| notes | TEXT | Interne Notizen | |
| source | ENUM | Quelle | 'phone','email','in_person','widget','api' |
| picked_up_at | TIMESTAMP | Abgeholt am | |
| picked_up_by | UUID | Abgeholt durch | FK -> users.id |
| reminder_sent_at | TIMESTAMP | Erinnerung gesendet | |
| created_at | TIMESTAMP | Erstellt | |
| updated_at | TIMESTAMP | Aktualisiert | |

**Indizes:** event_id, status, expires_at, contact_email

#### check_ins

| Feld | Typ | Beschreibung | Constraints |
|------|-----|--------------|-------------|
| id | UUID | Primaerschluessel | PK |
| ticket_id | UUID | Ticket | FK -> tickets.id |
| event_id | UUID | Event | FK -> events.id |
| scan_session_id | UUID | Scan-Session | FK -> scan_sessions.id |
| scan_type | ENUM | Scan-Typ | 'qr_scan','manual','nfc','list_check' |
| scan_result | ENUM | Ergebnis | 'success','already_used','invalid','error' |
| scanned_at | TIMESTAMP | Scan-Zeit | NOT NULL |
| scanned_by | UUID | Durchgefuehrt von | FK -> users.id |
| device_id | VARCHAR(100) | Geraete-ID | |
| device_name | VARCHAR(100) | Geraete-Name | |
| latitude | DECIMAL | GPS-Breite | |
| longitude | DECIMAL | GPS-Laenge | |
| offline_synced | BOOLEAN | Offline synchronisiert? | DEFAULT false |
| notes | TEXT | Notizen | |
| created_at | TIMESTAMP | Erstellt | |

**Indizes:** ticket_id, event_id, scanned_at, scan_result

#### waitlist

| Feld | Typ | Beschreibung | Constraints |
|------|-----|--------------|-------------|
| id | UUID | Primaerschluessel | PK |
| event_id | UUID | Event | FK -> events.id |
| ticket_type_id | UUID | Gewuenschter Typ | FK -> ticket_types.id (optional) |
| contact_name | VARCHAR(200) | Name | NOT NULL |
| contact_email | VARCHAR(255) | E-Mail | NOT NULL |
| contact_phone | VARCHAR(50) | Telefon | |
| quantity_requested | INTEGER | Gewuenschte Anzahl | NOT NULL |
| priority | INTEGER | Prioritaet (Position) | DEFAULT 0 |
| status | ENUM | Status | 'waiting','notified','expired','converted','cancelled' |
| notified_at | TIMESTAMP | Benachrichtigt am | |
| notification_count | INTEGER | Anzahl Benachrichtigungen | DEFAULT 0 |
| max_price_cents | INTEGER | Max. akzeptabler Preis | |
| notes | TEXT | Notizen | |
| created_at | TIMESTAMP | Erstellt | |
| updated_at | TIMESTAMP | Aktualisiert | |

**Indizes:** event_id, status, priority, created_at

#### guestlists

| Feld | Typ | Beschreibung | Constraints |
|------|-----|--------------|-------------|
| id | UUID | Primaerschluessel | PK |
| event_id | UUID | Event | FK -> events.id |
| name | VARCHAR(100) | Name der Liste | NOT NULL |
| list_type | ENUM | Listen-Typ | 'combined','reservations','vip','press','staff' |
| is_default | BOOLEAN | Standardliste? | DEFAULT false |
| export_template | JSONB | Export-Spaltenkonfiguration | |
| created_at | TIMESTAMP | Erstellt | |
| updated_at | TIMESTAMP | Aktualisiert | |

#### guestlist_entries

| Feld | Typ | Beschreibung | Constraints |
|------|-----|--------------|-------------|
| id | UUID | Primaerschluessel | PK |
| guestlist_id | UUID | Gaesteliste | FK -> guestlists.id |
| ticket_id | UUID | Ticket (falls vorhanden) | FK -> tickets.id (optional) |
| reservation_id | UUID | Reservierung (falls vorhanden) | FK -> reservations.id (optional) |
| entry_type | ENUM | Eintrags-Typ | 'ticket','reservation','manual' |
| display_name | VARCHAR(200) | Anzeigename | NOT NULL |
| display_email | VARCHAR(255) | Anzeige-E-Mail | |
| ticket_type_name | VARCHAR(100) | Ticket-Typ-Name | |
| status | ENUM | Status | 'expected','checked_in','no_show','cancelled' |
| notes | TEXT | Notizen | |
| sort_order | INTEGER | Reihenfolge | DEFAULT 0 |
| created_at | TIMESTAMP | Erstellt | |
| updated_at | TIMESTAMP | Aktualisiert | |

#### scan_sessions

| Feld | Typ | Beschreibung | Constraints |
|------|-----|--------------|-------------|
| id | UUID | Primaerschluessel | PK |
| event_id | UUID | Event | FK -> events.id |
| name | VARCHAR(100) | Stations-Name | NOT NULL |
| access_code | VARCHAR(20) | Zugangscode | UNIQUE |
| device_limit | INTEGER | Max. Geraete | DEFAULT 5 |
| started_at | TIMESTAMP | Gestartet | |
| ended_at | TIMESTAMP | Beendet | |
| scans_count | INTEGER | Anzahl Scans | DEFAULT 0 |
| created_by | UUID | Erstellt von | FK -> users.id |
| created_at | TIMESTAMP | Erstellt | |

#### newsletter_sync_logs

| Feld | Typ | Beschreibung | Constraints |
|------|-----|--------------|-------------|
| id | UUID | Primaerschluessel | PK |
| event_id | UUID | Event | FK -> events.id |
| ticket_id | UUID | Ticket | FK -> tickets.id |
| newsletter_list_id | UUID | Ziel-Liste | FK -> newsletter_lists.id |
| sync_status | ENUM | Status | 'pending','synced','failed','opt_in_pending' |
| email | VARCHAR(255) | E-Mail-Adresse | |
| synced_at | TIMESTAMP | Synchronisiert am | |
| error_message | TEXT | Fehlermeldung | |
| created_at | TIMESTAMP | Erstellt | |

### 3.3 Beziehungen (ER-Diagramm)

```
events ||--o{ ticket_types : "hat"
events ||--o{ tickets : "enthält"
events ||--o{ reservations : "hat"
events ||--o{ check_ins : "erzeugt"
events ||--o{ waitlist : "hat Warteliste"
events ||--o{ guestlists : "hat"
events ||--o{ scan_sessions : "hat Scan-Sessions"
events ||--o{ newsletter_sync_logs : "hat"

ticket_types ||--o{ tickets : "instanziiert"
ticket_types ||--o{ reservations : "wird reserviert"
ticket_types ||--o{ waitlist : "wird nachgefragt"

tickets ||--o{ check_ins : "wird gescannt"
tickets ||--o{ guestlist_entries : "erscheint in"
tickets ||--o{ reservations : "kann entstehen aus"

guestlists ||--o{ guestlist_entries : "enthält"
guestlists ||--o{ reservations : "zeigt"

scan_sessions ||--o{ check_ins : "protokolliert"
users ||--o{ check_ins : "führt durch"
```

---

## 4. API-Endpunkte

### 4.1 Ticket-Typen API

```
GET    /api/v1/events/{event_id}/ticket-types
       - Liste aller Ticket-Typen eines Events
       - Query: ?active_only=true&category=vvk&sort_by=price

GET    /api/v1/events/{event_id}/ticket-types/{ticket_type_id}
       - Einzelner Ticket-Typ mit Verfuegbarkeit

POST   /api/v1/events/{event_id}/ticket-types
       - Neuen Ticket-Typ erstellen
       - Body: { name, description, category, price_cents, quantity_total, ... }

PATCH  /api/v1/events/{event_id}/ticket-types/{ticket_type_id}
       - Ticket-Typ aktualisieren
       - Body: { price_cents, quantity_total, is_active, ... }

DELETE /api/v1/events/{event_id}/ticket-types/{ticket_type_id}
       - Ticket-Typ deaktivieren (soft delete)
       - Query: ?force=true fuer hartes Loeschen wenn keine Tickets verkauft

GET    /api/v1/events/{event_id}/ticket-types/availability
       - Aggregierte Verfuegbarkeit aller Ticket-Typen
       - Response: { total_capacity, total_sold, total_reserved, available, by_type: [...] }
```

### 4.2 Tickets API

```
GET    /api/v1/events/{event_id}/tickets
       - Alle Tickets eines Events
       - Query: ?status=active&channel=online&search=name&page=1&limit=50

GET    /api/v1/tickets/{ticket_id}
       - Einzelnes Ticket mit Check-in-Status

POST   /api/v1/events/{event_id}/tickets
       - Ticket erstellen (Verkauf/Abendkasse)
       - Body: { ticket_type_id, holder_name, holder_email, quantity, sale_channel, price_paid_cents }

POST   /api/v1/tickets/{ticket_id}/refund
       - Ticket zurueckerstatten
       - Body: { reason, refund_amount_cents }

POST   /api/v1/tickets/{ticket_id}/transfer
       - Ticket auf neue Person uebertragen
       - Body: { new_holder_name, new_holder_email }

GET    /api/v1/tickets/validate/{qr_code_hash}
       - QR-Code validieren (Check-in)
       - Response: { valid, ticket_id, event_id, holder_name, status, already_checked_in }

POST   /api/v1/tickets/{ticket_id}/check-in
       - Check-in durchfuehren
       - Body: { scan_session_id, device_id, scan_type, latitude, longitude }

POST   /api/v1/tickets/{ticket_id}/check-in/revert
       - Check-in rueckgaengig machen
```

### 4.3 Reservierungen API

```
GET    /api/v1/events/{event_id}/reservations
       - Alle Reservierungen eines Events
       - Query: ?status=pending&search=contact_name&sort_by=expires_at

GET    /api/v1/events/{event_id}/reservations/{reservation_id}
       - Einzelne Reservierung

POST   /api/v1/events/{event_id}/reservations
       - Reservierung anlegen
       - Body: { ticket_type_id, contact_name, contact_email, contact_phone, quantity, expires_at, notes, source }

PATCH  /api/v1/events/{event_id}/reservations/{reservation_id}
       - Reservierung aktualisieren
       - Body: { status, quantity, notes, expires_at }

POST   /api/v1/events/{event_id}/reservations/{reservation_id}/confirm
       - Reservierung bestaetigen -> erzeugt Tickets

POST   /api/v1/events/{event_id}/reservations/{reservation_id}/cancel
       - Reservierung stornieren
       - Body: { reason, notify_customer }

POST   /api/v1/events/{event_id}/reservations/{reservation_id}/convert-to-ticket
       - Reservierung in Ticket umwandeln
       - Body: { price_paid_cents }

POST   /api/v1/events/{event_id}/reservations/{reservation_id}/send-reminder
       - Erinnerung manuell senden

GET    /api/v1/events/{event_id}/reservations/expiring
       - Bald ablaufende Reservierungen (Dashboard-Warnung)
       - Query: ?within_hours=2
```

### 4.4 Check-in & Scanning API

```
POST   /api/v1/scan-sessions
       - Neue Scan-Session erstellen
       - Body: { event_id, name, device_limit }

GET    /api/v1/scan-sessions/{session_id}
       - Scan-Session Details + Echtzeit-Statistik
       - Response: { id, name, scans_count, unique_visitors, status }

POST   /api/v1/scan-sessions/{session_id}/scan
       - QR-Code scannen
       - Body: { qr_code_data, device_id, device_name, scan_type, lat, lng }
       - Response: { result, ticket, message, scan_timestamp }

POST   /api/v1/scan-sessions/{session_id}/manual-check-in
       - Manueller Eintrag (ohne QR-Code)
       - Body: { guestlist_entry_id OR ticket_id, notes }

GET    /api/v1/scan-sessions/{session_id}/sync-queue
       - Offline-Sync-Warteschlange abrufen
       - Fuer Geraete, die wieder online kommen

POST   /api/v1/scan-sessions/{session_id}/sync
       - Offline-Scans synchronisieren
       - Body: { scans: [{ qr_code, scanned_at, device_id, lat, lng }, ...] }

GET    /api/v1/events/{event_id}/check-in-stats
       - Check-in Statistiken
       - Response: { total_tickets, checked_in, check_in_rate, by_ticket_type, by_time_slot }

GET    /api/v1/events/{event_id}/scan-devices
       - Liste der aktiven Scan-Geraete
```

### 4.5 Warteliste API

```
GET    /api/v1/events/{event_id}/waitlist
       - Warteliste-Eintraege
       - Query: ?status=waiting&sort_by=priority

POST   /api/v1/events/{event_id}/waitlist
       - Auf Warteliste setzen (oeffentlich)
       - Body: { contact_name, contact_email, quantity_requested, ticket_type_id, max_price_cents }

POST   /api/v1/events/{event_id}/waitlist/{entry_id}/notify
       - Benachrichtigung senden
       - Body: { ticket_count, valid_for_minutes }

PATCH  /api/v1/events/{event_id}/waitlist/{entry_id}
       - Status aktualisieren
       - Body: { status, priority }

DELETE /api/v1/events/{event_id}/waitlist/{entry_id}
       - Eintrag entfernen

POST   /api/v1/events/{event_id}/waitlist/process-auto
       - Automatische Wartelisten-Benachrichtigung triggern
       - Wird durch Ticket-Stornierung/Cron-Job aufgerufen
```

### 4.6 Gaesteliste API

```
GET    /api/v1/events/{event_id}/guestlists
       - Alle Gaestelisten eines Events

POST   /api/v1/events/{event_id}/guestlists
       - Neue Gaesteliste erstellen
       - Body: { name, list_type, export_template }

GET    /api/v1/guestlists/{guestlist_id}/entries
       - Eintraege einer Gaesteliste
       - Query: ?status=expected&ticket_type=vvk&search=name

PATCH  /api/v1/guestlists/{guestlist_id}/entries/{entry_id}
       - Eintrag aktualisieren (Notizen, Status)

POST   /api/v1/guestlists/{guestlist_id}/export
       - Gaesteliste exportieren
       - Body: { format: 'pdf'|'csv', columns: [...], include_qr: true }
       - Response: Download-URL

POST   /api/v1/guestlists/{guestlist_id}/regenerate
       - Gaesteliste neu generieren (aus Tickets + Reservierungen)
```

### 4.7 Kapazitaet & Statistik API

```
GET    /api/v1/events/{event_id}/capacity
       - Aktuelle Kapazitaetsauslastung
       - Response: { total_capacity, sold, reserved, available, waitlist_count, utilization_percent }

GET    /api/v1/events/{event_id}/statistics
       - Event-Statistiken
       - Response: { revenue, tickets_by_type, check_ins, no_shows, sales_over_time }

GET    /api/v1/venues/{venue_id}/statistics
       - Venue-Statistiken ueber mehrere Events
       - Query: ?from_date=...&to_date=...

GET    /api/v1/dashboard/ticketing-summary
       - Dashboard-Zusammenfassung
       - Response: { upcoming_events, total_tickets_sold, total_revenue, alerts }
```

### 4.8 Newsletter-Integration API

```
POST   /api/v1/events/{event_id}/newsletter-sync
       - Alle Ticketkaeufer zur Newsletter-Liste synchronisieren
       - Body: { newsletter_list_id, sync_existing: true, consent_required: true }

GET    /api/v1/events/{event_id}/newsletter-sync/status
       - Sync-Status abfragen

POST   /api/v1/tickets/{ticket_id}/newsletter-opt-in
       - Opt-In fuer Newsletter bestaetigen
       - Body: { newsletter_list_id, confirmed: true }
```

### 4.9 WebSocket-Endpunkte (Echtzeit)

```
WS     /ws/events/{event_id}/check-ins
       - Live-Check-in-Updates
       - Push: { type: 'check_in', ticket_id, timestamp, scan_result }

WS     /ws/events/{event_id}/capacity
       - Live-Auslastungs-Updates
       - Push: { available_count, sold_count, reserved_count, utilization_percent }

WS     /ws/scan-sessions/{session_id}
       - Live-Scan-Ergebnisse fuer eine Session
```

---

## 5. UI-Komponenten (React)

### 5.1 Seiten/Pages

| Komponente | Pfad | Beschreibung |
|------------|------|--------------|
| `TicketingDashboardPage` | `/ticketing` | Uebersicht aller Ticketing-Aktivitaeten |
| `EventTicketingPage` | `/events/{id}/ticketing` | Ticketing-Management fuer ein Event |
| `TicketTypeEditorPage` | `/events/{id}/ticket-types` | Ticket-Typen verwalten |
| `GuestlistPage` | `/events/{id}/guestlist` | Gaesteliste anzeigen & verwalten |
| `ReservationsPage` | `/events/{id}/reservations` | Reservierungen verwalten |
| `CheckInPage` | `/events/{id}/check-in` | Check-in Uebersicht & Steuerung |
| `ScanPage` | `/scan` | QR-Code Scanner (Fullscreen) |
| `WaitlistPage` | `/events/{id}/waitlist` | Warteliste verwalten |
| `TicketDetailPage` | `/tickets/{id}` | Einzelnes Ticket anzeigen |
| `StatisticsPage` | `/events/{id}/statistics` | Event-Statistiken |

### 5.2 Wiederverwendbare Komponenten

#### Ticket-Editor Gruppe

```typescript
// TicketTypeEditor.tsx
// Props: eventId, ticketType?, onSave, onCancel
// Funktion: Erstellen/Bearbeiten von Ticket-Typen mit Formular fuer alle Felder
// Features: Live-Preisvorschau, PWYW-Modus-Umschaltung, Kapazitaetswarnung

// TicketTypeList.tsx
// Props: eventId, ticketTypes[], onEdit, onDelete, onToggleActive
// Funktion: Liste aller Ticket-Typen mit Verkaufsstatistiken
// Features: Drag&Drop Sortierung, Visualisierung der Auslastung

// TicketTypeCard.tsx
// Props: ticketType, soldCount, onEdit, onDelete
// Funktion: Kompakte Karte fuer einen Ticket-Typ
// Features: Fortschrittsbalken (verkauft/gesamt), Status-Badge, Schnellaktionen
```

#### Gaesteliste Gruppe

```typescript
// GuestlistView.tsx
// Props: eventId, guestlistId?, searchQuery?, filters?
// Funktion: Hauptansicht der Gaesteliste
// Features: Echtzeit-Updates, Suchleiste, Filter, Sortierung, Massenaktionen

// GuestlistTable.tsx
// Props: entries[], columns[], onCheckIn, onEdit, onExport
// Funktion: Tabellarische Darstellung der Gaesteliste
// Features: Sortierbare Spalten, Checkbox-Auswahl, Inline-Edit, QR-Code-Anzeige

// GuestlistEntryRow.tsx
// Props: entry, onCheckIn, onEdit, onDelete
// Funktion: Einzelne Zeile in der Gaesteliste
// Features: Status-Indikator, Schnell-Check-in, Notizen-Overlay

// GuestlistExportModal.tsx
// Props: guestlistId, onExport, onClose
// Funktion: Export-Dialog mit Spaltenauswahl und Format-Wahl
// Features: Vorschau, PDF/CSV-Auswahl, QR-Code-Option
```

#### Reservierung Gruppe

```typescript
// ReservationForm.tsx
// Props: eventId, ticketTypes[], onSave, initialData?
// Funktion: Formular fuer neue Reservierung
// Features: Kontakt-Autocomplete, Ticket-Typ-Auswahl, Ablaufdatum-Vorschlag

// ReservationList.tsx
// Props: reservations[], onConfirm, onCancel, onConvert, onSendReminder
// Funktion: Liste aller Reservierungen
// Features: Status-Farbcodierung, Countdown bis Ablauf, Batch-Aktionen

// ReservationCard.tsx
// Props: reservation, onConfirm, onCancel
// Funktion: Kompakte Reservierungs-Karte
// Features: Timer bis Storno, Kontakt-Daten, Schnellaktionen

// ExpiringReservationsAlert.tsx
// Props: eventId, thresholdHours
// Funktion: Warnung fuer bald ablaufende Reservierungen
// Features: Anzahl anzeigen, Link zur Detailansicht
```

#### Check-in / Scanner Gruppe

```typescript
// QRScanner.tsx
// Props: onScan, onError, enabled?, facingMode?
// Funktion: QR-Code Scanner mit Kamera-Zugriff
// Features: Barcode-Detector API, visuelles Feedback, Sound-Feedback, Torch/Flash

// CheckInDashboard.tsx
// Props: eventId, scanSessions[]
// Funktion: Uebersicht der Check-in-Aktivitaeten
// Features: Live-Zaehler, Fortschrittsbalken, Zeitleiste, Statistiken

// CheckInStatCard.tsx
// Props: label, value, trend?, icon
// Funktion: Statistik-Karte fuer Check-in-Dashboard
// Features: Trend-Pfeil, Animation bei Wertaenderung

// ScanResultOverlay.tsx
// Props: result: 'success' | 'already_used' | 'invalid' | 'error', ticket?
// Funktion: Vollbild-Overlay nach Scan
// Features: Farbkodiert (Gruen/Rot/Gelb), Ticket-Details, automatisches Schliessen

// ScanSessionManager.tsx
// Props: eventId, sessions[]
// Funktion: Scan-Sessions verwalten
// Features: Session erstellen/beenden, Zugangscode anzeigen, Geraete-Limit

// ManualCheckInModal.tsx
// Props: eventId, guestlistEntries[], onCheckIn, onClose
// Funktion: Manueller Eintrag ohne QR-Code
// Features: Suchfeld, Namensliste, Notizen-Feld
```

#### Warteliste Gruppe

```typescript
// WaitlistManager.tsx
// Props: eventId, waitlistEntries[]
// Funktion: Warteliste verwalten
// Features: Prioritaets-DnD, Benachrichtigungs-Button, Status-Farbcodierung

// WaitlistEntryForm.tsx
// Props: eventId, ticketTypes[], onSubmit
// Funktion: Formular fuer Wartelisten-Eintrag (oeffentlich)
// Features: Ticket-Typ-Auswahl, Max-Preis-Angabe

// WaitlistNotificationModal.tsx
// Props: entry, availableTickets, onSend, onClose
// Funktion: Benachrichtigungs-Dialog
// Features: Anzahl verfuegbarer Tickets, Gueltigkeitsdauer
```

#### Statistik Gruppe

```typescript
// CapacityGauge.tsx
// Props: capacity, sold, reserved, checkedIn
// Funktion: Kreisdiagramm fuer Auslastung
// Features: Farbwechsel bei >80% (Gelb) und >95% (Rot), Animation

// SalesChart.tsx
// Props: salesData[], timeRange
// Funktion: Verkaufsverlauf als Linien-/Balkendiagramm
// Features: Zeitbereich-Umschaltung, Tooltip, Vergleich vorheriges Event

// TicketTypeDistribution.tsx
// Props: ticketsByType[]
// Funktion: Tortendiagramm der Ticket-Typ-Verteilung
// Features: Prozentsatz, Legende, Hover-Details

// RevenueSummary.tsx
// Props: eventId, revenueData
// Funktion: Umsatzzusammenfassung
// Features: Online vs. Abendkasse, Durchschnittspreis pro Ticket
```

#### Gemeinsame Komponenten

```typescript
// TicketStatusBadge.tsx
// Props: status: 'active' | 'used' | 'refunded' | 'expired' | 'cancelled'
// Funktion: Farbkodiertes Status-Label

// QRCodeDisplay.tsx
// Props: ticketNumber, size, includeText?
// Funktion: QR-Code-Anzeige/Generierung
// Features: Download als PNG, Druckoptimiert

// TicketSearchBar.tsx
// Props: onSearch, filters?, placeholder?
// Funktion: Durchsuchleiste fuer Tickets/Gaesteliste
// Features: Fuzzy-Suche, Filter-Chips, Schnellscan-Button

// CapacityWarning.tsx
// Props: availableCount, totalCapacity, thresholdPercent?
// Funktion: Warnung bei niedriger Verfuegbarkeit
// Features: Ampel-Farbschema, Konfigurierbarer Schwellenwert

// NewsletterSyncToggle.tsx
// Props: eventId, newsletterLists[], enabled, onToggle
// Funktion: Newsletter-Synchronisation pro Event aktivieren/deaktivieren
```

---

## 6. Integrationen

### 6.1 Externe APIs/Services

#### Reservix API (optional)
```
Integrationstyp: API-Bridge / Webhook
Verwendung: Synchronisation von Verkaufsdaten fuer Veranstalter, 
            die parallel Reservix nutzen
Endpunkte: Veranstalter-API (geschuetzt, API-Key erforderlich)
Daten: Verkaufszahlen, Ticket-Status, Gaestelisten
Hinweis: Reservix bietet eine Veranstalter-API, aber Zugang ist 
         auf Vertragskunden beschraenkt. Dokumentation nur intern.
```

#### CTS Eventim (optional)
```
Integrationstyp: API / XML-Schnittstelle
Verwendung: Parallele Verkaufsdaten-Synchronisation
Daten: Ticket-Verkaeufe, Stornierungen, Gaestelisten
Hinweis: Eventim Light bietet eine einfachere API fuer kleinere Veranstalter.
```

#### TicketTailor API (optional)
```
Integrationstyp: REST API
Verwendung: Import von Ticket-Daten bei Migration
API-Dokumentation: https://developers.tickettailor.com/
Authentifizierung: API-Key
```

#### Hi.Events (Open Source, optional)
```
Integrationstyp: Self-Hosted / API
Verwendung: Als Referenz-Implementierung oder Fork-Basis
GitHub: https://github.com/HiEventsDev/hi.events
Vorteil: Kostenlos, Open Source, moderner Stack
```

### 6.2 Newsletter-Provider Integrationen

```
Mailchimp API
- Endpunkt: POST /3.0/lists/{list_id}/members
- Funktion: Ticketkaeufer als Subscriber hinzufuegen
- Double-Opt-In: Unterstuetzt via status 'pending'
- Tags: Event-Name als Tag fuer Segmentierung

Sendinblue/Brevo API
- Endpunkt: POST /v3/contacts
- Funktion: Kontakt erstellen + zu Liste hinzufuegen
- Attribute: Event-Daten als Custom Attributes

Mailerlite API
- Endpunkt: POST /api/subscribers
- Funktion: Subscriber mit Gruppen-Zuweisung

Custom Webhook
- Endpunkt: Konfigurierbar durch Veranstalter
- Payload: { email, name, event_id, ticket_type, purchased_at }
```

### 6.3 Zahlungs-Provider

```
Stripe
- Verwendung: Online-Ticketverkauf mit Kreditkarte/SEPA
- Webhooks: payment_intent.succeeded -> Ticket erstellen

PayPal
- Verwendung: Alternative Zahlungsmethode
- Webhooks: PAYMENT.CAPTURE.COMPLETED -> Ticket erstellen

SumUp
- Verwendung: Kartenzahlung an der Abendkasse
- API: Transaktionsdaten fuer Abrechnung

Bar/Abendkasse (Manuell)
- Verwendung: Direkte Ticketerstellung ohne Zahlungsintegration
```

### 6.4 QR-Code & Scanning

```
ZXing / jsQR
- Verwendung: QR-Code Decodierung im Browser
- Lizenz: Apache 2.0

Barcode Detection API (Web API)
- Verwendung: Native Browser-QR-Code-Erkennung
- Verfuegbarkeit: Chrome/Edge (experimentell)
- Vorteil: Kein JavaScript-Library noetig

QRCode.js / qrcode.react
- Verwendung: QR-Code Generierung fuer Tickets
- Features: SVG/Canvas-Output, anpassbare Groesse
```

### 6.5 PDF-Generierung

```
jsPDF + jspdf-autotable
- Verwendung: Gaestelisten-PDF-Export
- Features: Tabellen, QR-Code-Einbettung, Druck-Layouts

react-pdf / @react-pdf/renderer
- Verwendung: Ticket-PDFs fuer E-Mail-Versand
- Features: React-basierte Templates, Custom Styling
```

---

## 7. Technische Details

### 7.1 Architektur-Patterns

```
Layered Architecture:
- Presentation Layer: React Components + Custom Hooks
- API Layer: REST + WebSocket Endpoints
- Service Layer: Business Logic (Ticket-Verkauf, Check-in, Stornierung)
- Data Layer: PostgreSQL + Redis (Caching/Queues)
- External Layer: Third-party APIs (Zahlung, Newsletter)

Event-Driven Pattern:
- Ticket-Verkauf -> Event "ticket.purchased" 
  -> Listener: Newsletter-Sync, Kapazitaets-Update
- Check-in -> Event "ticket.checked_in"
  -> Listener: Statistik-Update, WebSocket-Push
- Reservierung-Ablauf -> Event "reservation.expired"
  -> Listener: Kapazitaets-Freigabe, Wartelisten-Benachrichtigung
```

### 7.2 Cron-Jobs / Background-Tasks

```
1. reservation-auto-cancel (alle 5 Minuten)
   - Findet Reservierungen mit expires_at <= NOW()
   - Setzt Status auf 'expired', gibt Kapazitaet frei
   - Triggert Wartelisten-Benachrichtigung

2. waitlist-auto-notify (alle 10 Minuten)
   - Prueft auf freigewordene Tickets
   - Sendet Benachrichtigung an wartende Personen
   - Setzt Status auf 'notified' mit Timeout

3. reminder-emails (stuendlich)
   - Sendet Erinnerungen fuer Reservierungen 24h/4h vor Event

4. newsletter-sync-batch (alle 15 Minuten)
   - Synchronisiert pending Newsletter-Eintraege

5. offline-scan-sync (alle 2 Minuten)
   - Verarbeitet Offline-Scan-Queues aus Redis
```

### 7.3 Caching-Strategie

```
Redis Caching:
- event:capacity:{event_id} -> Verfuegbarkeit (TTL: 5 Min)
- event:stats:{event_id} -> Aggregierte Statistiken (TTL: 10 Min)
- scan:session:{session_id} -> Session-Status (TTL: Session-Dauer)
- ticket:qr:{hash} -> Ticket-Validierung (TTL: 1 Min)
- guestlist:{guestlist_id} -> Gaesteliste (TTL: 2 Min)

Cache Invalidation:
- Bei Ticket-Verkauf: event:capacity invalidieren
- Bei Check-in: event:stats + scan:session invalidieren
- Bei Reservierungs-Aenderung: event:capacity + guestlist invalidieren
```

### 7.4 Spezifische Libraries & Frameworks

```
Frontend:
- react-qr-reader / html5-qrcode          QR-Code Scanning
- qrcode.react                             QR-Code Generierung
- jspdf + jspdf-autotable                  PDF-Export
- react-beautiful-dnd / @dnd-kit           Drag&Drop (Warteliste)
- recharts / chart.js                      Statistik-Diagramme
- socket.io-client                         WebSocket-Client
- zustand / react-query                    State Management & Caching

Backend:
- node.js / NestJS                         API-Framework
- typeorm / prisma                         ORM
- bull / bullmq                            Job-Queues (Redis)
- socket.io                                WebSocket-Server
- node-cron / bull                         Cron-Jobs
- sharp                                    Bildverarbeitung (QR-Codes)
- nodemailer / sendgrid                    E-Mail-Versand
- qrcode                                   QR-Code Generierung (Backend)

Datenbank:
- PostgreSQL 15+                           Primaere Datenbank
- Redis                                    Caching, Queues, Sessions
- TimescaleDB (optional)                   Zeitreihen-Daten (Check-ins)
```

### 7.5 Algorithmen & Besonderheiten

#### QR-Code Hash-Generierung
```
Hash = HMAC-SHA256(event_secret, ticket_id + timestamp + random_nonce)
Encoded = Base64URL(Hash)[:16]  // 16 Zeichen fuer kompakten QR-Code
// Event-Secret wird pro Event generiert und rotierbar
```

#### Kapazitaets-Berechnung
```
available = total_capacity - sold - reserved - waitlist_allocated
// Optimistic Locking bei gleichzeitigen Verkaeufen
// SELECT FOR UPDATE auf ticket_types.quantity_sold
// Deadlock-Vermeidung durch konsistente Lock-Reihenfolge
```

#### Offline-Sync-Strategie
```
1. Geraet laedt alle validen QR-Code-Hashes herunter (IndexedDB)
2. Scans werden lokal in Queue gespeichert (Service Worker)
3. Bei Netz-Wiederkehr: Queue wird an Server synchronisiert
4. Konfliktloesung: "First scan wins", spaetere Scans = "already_used"
5. Delta-Sync: Nur neue/gesaenderte Daten werden uebertragen
```

#### Wartelisten-Priorisierung
```
// FIFO mit Optionalitaet
priority_score = created_at_timestamp
// Bei "notified": countdown_start = NOW(), status = 'notified'
// Nach Timeout: status = 'expired', naechster in Warteliste wird benachrichtigt
```

---

## 8. Akzeptanzkriterien

### 8.1 Ticket-Typen & Verkauf (Must-Have)

- [ ] Veranstalter kann mind. 6 Ticket-Typen anlegen: VVK, AK, ermassigt, PWYW, Freikarte, Staff/VIP
- [ ] Jeder Ticket-Typ hat konfigurierbare Preise, Verfuegbarkeiten und Verkaufszeitraeume
- [ ] PWYW-Modus unterstuetzt Mindestpreis und empfohlenen Preis
- [ ] Kapazitaets-Limits werden durchgesetzt, keine Ueberbuchung moeglich
- [ ] Ermassigte Tickets koennen einen Nachweis-Typ erfordern
- [ ] Ticket-Typen koennen aktiviert/deaktiviert werden ohne bestehende Tickets zu beeinflussen
- [ ] Preisaenderungen sind nach dem ersten Verkauf nur mit Warnung moeglich

### 8.2 Gaesteliste & Reservierungen (Must-Have)

- [ ] Gaesteliste zeigt alle Tickets und Reservierungen in Echtzeit
- [ ] Reservierungen koennen manuell angelegt werden (Name, E-Mail, Telefon, Anzahl)
- [ ] Automatische Stornierung nach konfigurierbarer Frist (Standard: 2h vor Event)
- [ ] Reservierungs-Erinnerungen werden automatisch per E-Mail versendet
- [ ] Reservierungen koennen in Tickets umgewandelt werden
- [ ] Gaesteliste unterstuetzt Suche, Filter und Sortierung
- [ ] Gaesteliste ist als PDF und CSV exportierbar

### 8.3 Check-in & QR-Code-Scanning (Must-Have)

- [ ] QR-Codes koennen ueber Browser-Kamera gescannt werden
- [ ] Scan-Ergebnis wird sofort mit visuellem Feedback angezeigt (Gruen=gueltig, Rot=ungueltig, Gelb=bereits gescannt)
- [ ] Audio-Feedback bei Scan (Erfolg/Fehler)
- [ ] Offline-Modus: Scans werden lokal gespeichert und spaeter synchronisiert
- [ ] Manuelle Check-in-Eintraege sind ohne QR-Code moeglich
- [ ] Mehrere Scan-Stationen pro Event koennen gleichzeitig betrieben werden
- [ ] Check-in kann durch autorisiertes Personal rueckgaengig gemacht werden
- [ ] Echtzeit-Statistiken zeigen aktuelle Einlass-Zahlen

### 8.4 Warteliste (Should-Have)

- [ ] Interessenten koennen sich auf Warteliste fuer ausverkaufte Events setzen
- [ ] Automatische Benachrichtigung bei Ticket-Verfuegbarkeit
- [ ] Benachrichtigte Personen haben konfigurierbare Zeit zur Buchung (z.B. 24h)
- [ ] Warteliste ist nach Prioritaet sortiert (FIFO)
- [ ] Veranstalter kann Wartelisten-Eintraege manuell verwalten

### 8.5 Statistiken & Tracking (Must-Have)

- [ ] Echtzeit-Auslastungsanzeige pro Event
- [ ] Umsatz-Statistiken (Online vs. Abendkasse)
- [ ] Zuschauerzahlen-Tracking pro Event und pro Ticket-Typ
- [ ] Abendkasse-Zahlen koennen manuell eingegeben werden
- [ ] Statistiken sind ueber Zeit vergleichbar (Vergleich Events)

### 8.6 Newsletter-Integration (Should-Have)

- [ ] Ticketkaeufer koennen automatisch zur Newsletter-Liste hinzugefuegt werden
- [ ] Double-Opt-In wird unterstuetzt
- [ ] Pro Event konfigurierbar, ob Sync aktiv ist
- [ ] Unterstuetzung fuer mindestens 2 Newsletter-Provider (Mailchimp + Brevo)
- [ ] Sync-Status wird pro Ticket protokolliert

### 8.7 Allgemein

- [ ] Alle API-Endpunkte sind authentifiziert und autorisiert
- [ ] QR-Codes sind faelschungssicher (cryptographischer Hash)
- [ ] Datenbank-Transaktionen stellen Konsistenz bei gleichzeitigen Zugriffen sicher
- [ ] Das Modul ist fuer mindestens 500 gleichzeitige Nutzer pro Event skalierbar
- [ ] Alle Aenderungen sind in einem Audit-Log nachvollziehbar
- [ ] E-Mail-Versand ist zuverlaessig (Queue-basiert mit Retry)
- [ ] Gaestelisten-Export ist druckoptimiert (A4, Lesbarkeit)

---

## 9. Risiken & Abwaegungen

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Offline-Sync-Konflikte | Mittel | Hoch | "First scan wins", dedizierte Konflikt-UI |
| QR-Code-Faelschung | Niedrig | Hoch | Kryptographischer Hash, regelmaessige Secret-Rotation |
| Gleichzeitige Ueberbuchung | Mittel | Mittel | Optimistic Locking, SELECT FOR UPDATE |
| Integration Reservix API nicht moeglich | Hoch | Niedrig | Optional, Fallback auf manuellen Import |
| Performance bei >1000 Tickets/Event | Niedrig | Mittel | Pagination, Redis-Caching, Connection Pooling |

---

## 10. Zukuenftige Erweiterungen (Backlog)

- **Sitzplatzreservierung:** Visueller Sitzplan mit drag-and-drop Zuweisung
- **Wiederverkauf/Transfer:** Sekundaerer Marktplatz fuer Ticketweitergabe
- **Dynamische Preise:** Algorithmus-basierte Preisanpassung nach Nachfrage
- **Warteschlangen-System:** Virtueller Warteraum bei hoher Nachfrage
- **Gruppenbuchung:** Spezielle Workflows fuer Gruppen >10 Personen
- **Kassen-System Integration:** TSE-konforme Kassenbuchung fuer Abendkasse
- **Wiederverkaufs-Analytics:** Vorhersage der Nachfrage basierend auf historischen Daten

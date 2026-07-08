# Dimension 7: Presse & PR-Automation — Modul-Spezifikation
## Dashboard-App fuer Kleinkunst-Veranstalter

---

## 1. Feature-Beschreibung

Das Presse & PR-Automation-Modul ist ein integriertes Werkzeug fuer Kleinkunst-Veranstalter, um den gesamten Presse-Workflow — von der Journalisten-Recherche bis zur Erfolgsmessung — zu digitalisieren und automatisieren. Es ersetzt teure PR-SaaS-Loesungen (Cision ab 10.000 EUR/Jahr, Mynewsdesk ab 200 EUR/Monat) durch eine auf die Beduerfnisse kleiner Kulturveranstalter zugeschnittene Loesung mit einem Minimal-Stack ab 0 EUR/Monat.

### Kernfunktionen

| Funktion | Beschreibung | Zielgruppe |
|----------|-------------|------------|
| **Journalisten-Datenbank** | Verwaltung von Medienkontakten mit Themen, Medien, Kontaktdaten, Notizen | Alle Veranstalter |
| **Pressemitteilungs-Editor** | KI-gestuetzte Erstellung von Pressemitteilungen (verknuepft mit Dimension 6) | Alle Veranstalter |
| **Presse-Verteiler** | Selektiver Versand an journalistische Kontakte via SMTP oder Presseportale | Alle Veranstalter |
| **Digitale Pressemappe** | Oeffentlich teilbare Seite mit Kuenstler-Info, Fotos, Pressetexten, Downloads | Alle Veranstalter |
| **Medienbeobachtung** | Manuelle Clipping-Sammlung + Integration mit Google Alerts RSS | Alle Veranstalter |
| **PR-Kalender** | Zeitplanung fuer Pressemitteilungen, Follow-ups und Embargos | Alle Veranstalter |
| **Event-Kalender-Sync** | Automatische Meldung an oeffentliche Event-Kalender (Stadtportale, Kulturserver) | Alle Veranstalter |

### Wertschoepfungskette

```
Event angelegt in der App
    |
    v
KI generiert Pressemitteilung (Dim. 6)
    |
    v
Journalisten werden basierend auf Themen/Genres selektiert
    |
    v
Pressemitteilung wird ueber Verteiler versendet
    |
    v
Digitale Pressemappe wird automatisch aktualisiert
    |
    v
PR-Kalender trackt Embargo-Aufhebung & Follow-ups
    |
    v
Medienbeobachtung erfasst veroeffentlichte Artikel
    |
    v
Reporting zeigt Reichweite & ROI der PR-Aktivitaet
```

---

## 2. User Stories

### US-1: Journalisten erfassen und verwalten
> **Als** Veranstalter moechte ich Journalisten und Medienkontakte in einer zentralen Datenbank verwalten koennen — mit Name, Medium, Themenschwerpunkten, Kontaktdaten und persoenlichen Notizen — damit ich meine Medienkontakte jederzeit gezielt ansprechen kann.
>
> **Akzeptanzkriterien:**
> - Erfassung von Name, Medium, E-Mail, Telefon, Adresse, Webseite
> - Themenschwerpunkte als Tags (z.B. "Jazz", "Theater", "Kulturpolitik", "Lokales")
> - Freitext-Notizen mit Zeitstempel (z.B. "Bevorzugt E-Mail, nicht anrufen vor 10 Uhr")
> - Import aus CSV/Excel (Template-Download verfuegbar)
> - Duplikat-Erkennung bei Import
> - Kontakte koennen als aktiv/inaktiv markiert werden
> - Such- und Filterfunktion (nach Medium, Thema, Ort)
> - Kontakt-Historie: Wann wurde welche Pressemitteilung gesendet?

### US-2: Pressemitteilung mit KI-Unterstuetzung erstellen
> **Als** Veranstalter moechte ich auf Basis eines bestehenden Events mit einem Klick eine Pressemitteilung generieren lassen, die ich anschliessend im Editor anpassen kann, damit ich professionelle Pressemitteilungen ohne Schreibblockaden erstelle.
>
> **Akzeptanzkriterien:**
> - Uebernahme aller Event-Daten (Titel, Kuenstler, Datum, Location, Beschreibung)
> - KI-generierte Pressemitteilung nach DIN-5008-Struktur: Titel, Untertitel, Lead, Haupttext, Boilerplate, Kontaktinfo
> - Integration mit `prompt_templates` (Kategorie `press_release`) aus Dimension 6
> - Rich-Text-Editor mit Formatierung, Bild-Einbindung, Link-Setzung
> - Versionshistorie (Aenderungen werden gespeichert)
> - Embargo-Funktion: Pressemitteilung mit "Nicht vor DATUM Uhrzeit" markieren
> - Preview-Modus: Darstellung wie bei Medien-Empfaenger
> - Speichern als Entwurf / Veroeffentlichen
> - Anhaengen von Bildern und PDFs (max. 10 MB pro Datei)
> - Zeichenzaehler mit Hinweis auf optimale Laenge (500-800 Wörter)

### US-3: Presse-Verteiler selektiv versenden
> **Als** Veranstalter moechte ich meine Pressemitteilung an eine zuvor erstellte Auswahl von Journalisten senden koennen — entweder direkt per E-Mail oder ueber ein Presseportal — damit die richtigen Medienvertreter erreicht werden.
>
> **Akzeptanzkriterien:**
> - Selektion von Empfaengern nach Themen-Filtern (z.B. nur "Jazz" + "Lokale Medien")
> - Versand via SMTP (eigener E-Mail-Server) oder konfigurierbarem E-Mail-Provider
> - Personalisierte Anrede pro Empfaenger moeglich ({{Vorname}}, {{Medium}})
> - Presseportal-Integration: openPR, connektar als Webhook/API-Call
> - Scheduling: Versand zu einem definierten Zeitpunkt planen
> - Embargo-Respektierung: automatischer Versand nach Embargo-Aufhebung
> - Bounce-Tracking: unzustellbare E-Mails werden markiert
> - Oeffnungsraten-Tracking (optional via Tracking-Pixel)
> - Sende-Limit: Warnung bei >50 Empfaengern (Anti-Spam)

### US-4: Digitale Pressemappe verwalten und teilen
> **Als** Veranstalter moechte ich eine digitale Pressemappe erstellen koennen, die alle relevanten Infos, Fotos und Pressetexte zu meinen Kuenstlern/Events enthaelt und ueber einen oeffentlichen Link teilbar ist, damit Journalisten schnell an Materialien kommen.
>
> **Akzeptanzkriterien:**
> - Pressemappe pro Kuenstler oder pro Event erstellen
> - Upload von Fotos (min. 300 DPI, Druckqualitaet), Logos, Pressetexten, Rider-Infos
> - Automatische Generierung einer Pressemappe aus Event-Daten
> - Oeffentliche URL mit optionalem Passwort-Schutz
> - Download-Tracker: wer hat wann was heruntergeladen?
> - Pressemappe ist responsiv und mobil-optimiert
> - QR-Code-Generierung fuer physischen Flyer-Druck
> - SEO-optimierte Darstellung (Medien finden Pressemappe ueber Google)

### US-5: Medienbeobachtung durchfuehren
> **Als** Veranstalter moechte ich veroeffentlichte Berichte ueber meine Events manuell erfassen und automatisch ueber Google Alerts benachrichtigt werden, damit ich den PR-Erfolg dokumentieren und fuer Sponsoren nachweisen kann.
>
> **Akzeptanzkriterien:**
> - Manuelles Erfassen von Clippings: Medium, Datum, URL, Autor, Auszug, Bild-Upload
> - Google Alerts RSS-Feed-Integration: automatisches Einlesen neuer Ergebnisse
> - Clipping-Kategorien: Print, Online, Radio, TV, Social Media, Blog
> - Sentiment-Analyse: positiv / neutral / negativ (manuell oder KI-gestuetzt)
> - Clipping-Bericht als PDF exportieren
> - Reichweiten-Schaetzung pro Clipping (manuell eintragbar)
> - Verknuepfung von Clippings mit Events und Pressemitteilungen
> - Dashboard-Widget: "Letzte Clippings" auf der Startseite

### US-6: PR-Kalender verwalten
> **Als** Veranstalter moechte ich einen Ueberblick haben, wann welche Pressemitteilungen geplant, versendet und nachverfolgt werden muessen, damit ich keine PR-Aktivitaeten vergesse und Embargos einhalte.
>
> **Akzeptanzkriterien:**
> - Kalender-Ansicht (Monat/Woche/Tag) mit allen PR-Aktivitaeten
> - Automatische Eintragung bei geplantem Pressemitteilungs-Versand
> - Embargo-Markierungen mit Countdown
> - Follow-Up-Erinnerungen: "Journalist X wurde vor 5 Tagen angeschrieben — Follow-Up?"
> - Drag-and-Drop Verschiebung von geplanten Aktivitaeten
> - Farbcodierung nach Status (gruen=versendet, gelb=geplant, rot=Embargo, grau=Entwurf)
> - Sync mit externen Kalendern (iCal-Export, Google Calendar)

### US-7: Oeffentliche Event-Kalender informieren
> **Als** Veranstalter moechte ich, dass meine Veranstaltungen automatisch an relevante oeffentliche Event-Kalender (Stadtportale, Kulturserver, Zeitungs-Veranstaltungskalender) gemeldet werden, damit ich eine breitere Reichweite ohne manuelle Mehrfacherfassung erziele.
>
> **Akzeptanzkriterien:**
> - Konfiguration von Ziel-Kalendern pro Location/Stadt
> - Automatische Meldung bei Event-Erstellung oder -Aenderung
> - Unterstuetzte Kanaele: Stadtportale (per E-Mail/API), Kulturserver (z.B. Kulturserver Niedersachsen), regionale Zeitungen
> - Template-basierte E-Mail-Anmeldung fuer Kalender ohne API
> - Status-Tracking: "Gemeldet", "Bestaetigt", "Abgelehnt", "Veroeffentlicht"
> - Liste der unterstuetzten Kanaele ist erweiterbar
> - Fehlerbenachrichtigung bei nicht erreichbarem Ziel-Kalender

### US-8: PR-Erfolg analysieren
> **Als** Veranstalter moechte ich sehen, welche Pressemitteilungen wie viele Medienberichte generiert haben und welche Reichweite meine PR-Aktivitaeten erzielt haben, damit ich meine PR-Strategie kontinuierlich verbessern kann.
>
> **Akzeptanzkriterien:**
> - Uebersicht pro Pressemitteilung: Empfaenger, Oeffnungsrate, Clippings, geschaetzte Reichweite
> - Gesamt-Dashboard: PR-Aktivitaeten pro Monat/Quartal/Jahr
> - Journalisten-Ranking: Welche Kontakte haben am meisten berichtet?
> - Themen-Ranking: Welche Themen/Genres erzielen die meisten Clippings?
> - Export als PDF fuer Sponsoren / Foerderer
> - Vergleich: PR-Leistung verschiedener Events

---

## 3. Datenmodell

### 3.1 Tabelle: `press_contacts`

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `organization_id` | UUID (FK) | Zugehoerige Organisation |
| `first_name` | VARCHAR(100) | Vorname |
| `last_name` | VARCHAR(100) | Nachname |
| `email` | VARCHAR(255) | E-Mail-Adresse |
| `phone` | VARCHAR(50) | Telefonnummer |
| `mobile` | VARCHAR(50) | Handynummer |
| `media_outlet` | VARCHAR(200) | Medium/Redaktion (z.B. "Sueddeutsche Zeitung") |
| `media_type` | ENUM | `newspaper`, `magazine`, `radio`, `tv`, `online`, `blog`, `podcast`, `agency` |
| `job_title` | VARCHAR(200) | Position/Ressort (z.B. "Kulturredakteur") |
| `topics` | JSONB | Themenschwerpunkte als Array (z.B. `["jazz", "theater", "lokal"]` ) |
| `city` | VARCHAR(100) | Stadt/Ort |
| `region` | VARCHAR(100) | Bundesland/Region |
| `language` | VARCHAR(10) | bevorzugte Sprache (de, en, etc.) |
| `website` | VARCHAR(255) | Webseite des Mediums |
| `notes` | TEXT | Freitext-Notizen |
| `is_active` | BOOLEAN | Kontakt aktiv/inaktiv |
| `do_not_contact` | BOOLEAN | "Bitte nicht kontaktieren"-Flag |
| `preferred_channel` | ENUM | `email`, `phone`, `neither` — bevorzugter Kontaktweg |
| `created_by` | UUID (FK) | Nutzer, der den Kontakt erstellt hat |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Aktualisierung |

**Index:** `email` + `organization_id` (UNIQUE), `topics` (GIN-Index fuer JSONB), `media_outlet`

### 3.2 Tabelle: `press_releases`

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `organization_id` | UUID (FK) | Zugehoerige Organisation |
| `event_id` | UUID (FK) | Verknuepfung mit Event (optional) |
| `title` | VARCHAR(300) | Titel der Pressemitteilung |
| `subtitle` | VARCHAR(500) | Untertitel |
| `lead` | TEXT | Lead-Absatz (Kernthema, 2-3 Saetze) |
| `body` | TEXT | Haupttext der Pressemitteilung |
| `boilerplate` | TEXT | Standard-Boilerplate der Organisation |
| `contact_info` | TEXT | Pressekontakt (Name, Tel, E-Mail) |
| `language` | VARCHAR(10) | Sprache der PM (de, en, etc.) |
| `status` | ENUM | `draft`, `scheduled`, `sent`, `embargo`, `cancelled` |
| `embargo_until` | TIMESTAMP | Embargo-Aufhebung (NULL = kein Embargo) |
| `scheduled_at` | TIMESTAMP | Geplanter Versandzeitpunkt |
| `sent_at` | TIMESTAMP | Tatsaechlicher Versandzeitpunkt |
| `ai_generation_id` | UUID (FK) | Verknuepfung mit KI-Generierung (Dim. 6) |
| `template_id` | UUID (FK) | Verwendetes KI-Template |
| `slug` | VARCHAR(200) | URL-freundlicher Identifikator fuer oeffentliche Pressemappe |
| `is_public` | BOOLEAN | Oeffentlich in Pressemappe sichtbar? |
| `public_url` | VARCHAR(500) | Oeffentliche URL der Pressemitteilung |
| `created_by` | UUID (FK) | Nutzer, der die PM erstellt hat |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Aktualisierung |

### 3.3 Tabelle: `press_release_attachments`

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `press_release_id` | UUID (FK) | Zugehoerige Pressemitteilung |
| `file_name` | VARCHAR(255) | Dateiname |
| `file_path` | VARCHAR(500) | Speicherpfad/URL |
| `file_type` | ENUM | `image`, `pdf`, `video`, `audio`, `document` |
| `file_size_bytes` | BIGINT | Dateigroesse |
| `mime_type` | VARCHAR(100) | MIME-Type |
| `caption` | VARCHAR(500) | Bildunterschrift/Beschreibung |
| `display_order` | INTEGER | Sortierreihenfolge |
| `is_press_photo` | BOOLEAN | Fuer Pressezwecke freigegeben? |
| `photo_credit` | VARCHAR(200) | Fotograf/Quellenangabe |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |

### 3.4 Tabelle: `press_distributions`

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `organization_id` | UUID (FK) | Zugehoerige Organisation |
| `press_release_id` | UUID (FK) | Versandte Pressemitteilung |
| `name` | VARCHAR(200) | Name des Verteilers (z.B. "Jazz-Festival 2024 — Lokale Medien") |
| `description` | TEXT | Beschreibung |
| `channel` | ENUM | `email_smtp`, `email_provider`, `openpr`, `connektar`, `firmenpresse`, `manual` |
| `channel_config` | JSONB | Kanal-spezifische Konfiguration (z.B. SMTP-Credentials, Portal-API-Key) |
| `status` | ENUM | `draft`, `scheduled`, `sending`, `sent`, `failed`, `partially_sent` |
| `scheduled_at` | TIMESTAMP | Geplanter Versandzeitpunkt |
| `started_at` | TIMESTAMP | Versandstart |
| `completed_at` | TIMESTAMP | Versandende |
| `total_recipients` | INTEGER | Anzahl Empfaenger |
| `sent_count` | INTEGER | Erfolgreich versendet |
| `failed_count` | INTEGER | Fehlgeschlagen |
| `opened_count` | INTEGER | Geoeffnet (via Tracking-Pixel) |
| `clicked_count` | INTEGER | Geklickt |
| `bounce_count` | INTEGER | Bounces |
| `created_by` | UUID (FK) | Nutzer |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Aktualisierung |

### 3.5 Tabelle: `press_distribution_recipients`

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `distribution_id` | UUID (FK) | Zugehoeriger Verteiler |
| `contact_id` | UUID (FK) | Verknuepfung mit press_contacts (NULL bei Ad-hoc-Empfaenger) |
| `email` | VARCHAR(255) | E-Mail-Adresse zum Versandzeitpunkt |
| `full_name` | VARCHAR(200) | Name zum Versandzeitpunkt |
| `media_outlet` | VARCHAR(200) | Medium zum Versandzeitpunkt |
| `status` | ENUM | `pending`, `sent`, `delivered`, `failed`, `bounced`, `opened`, `clicked` |
| `sent_at` | TIMESTAMP | Versandzeitpunkt |
| `delivered_at` | TIMESTAMP | Zustellzeitpunkt |
| `failed_at` | TIMESTAMP | Fehlerzeitpunkt |
| `failed_reason` | TEXT | Fehlerursache |
| `opened_at` | TIMESTAMP | Oeffnungszeitpunkt |
| `clicked_at` | TIMESTAMP | Klickzeitpunkt |
| `tracking_token` | VARCHAR(100) | Eindeutiger Tracking-Token pro Empfaenger |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |

**Index:** `tracking_token` (UNIQUE) — fuer Tracking-Pixel und Link-Tracking

### 3.6 Tabelle: `press_kits`

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `organization_id` | UUID (FK) | Zugehoerige Organisation |
| `event_id` | UUID (FK) | Verknuepfung mit Event (optional) |
| `artist_id` | UUID (FK) | Verknuepfung mit Kuenstler (optional) |
| `name` | VARCHAR(200) | Name der Pressemappe (z.B. "Pressemappe Max Mustermann") |
| `slug` | VARCHAR(200) | URL-freundlicher Pfad |
| `description` | TEXT | Beschreibung/Einleitungstext |
| `is_public` | BOOLEAN | Oeffentlich erreichbar? |
| `password_protected` | BOOLEAN | Passwortgeschuetzt? |
| `password_hash` | VARCHAR(255) | Passwort-Hash (NULL wenn nicht geschuetzt) |
| `public_url` | VARCHAR(500) | Oeffentliche URL |
| `download_count` | INTEGER | Anzahl Downloads |
| `view_count` | INTEGER | Anzahl Aufrufe |
| `seo_title` | VARCHAR(200) | SEO-Titel |
| `seo_description` | VARCHAR(500) | SEO-Meta-Beschreibung |
| `theme` | ENUM | `default`, `minimal`, `elegant`, `modern` — Darstellungsthema |
| `created_by` | UUID (FK) | Nutzer |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Aktualisierung |

### 3.7 Tabelle: `press_kit_items`

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `press_kit_id` | UUID (FK) | Zugehoerige Pressemappe |
| `item_type` | ENUM | `press_release`, `photo`, `bio`, `rider`, `logo`, `video`, `audio`, `document`, `link` |
| `title` | VARCHAR(200) | Titel des Elements |
| `description` | TEXT | Beschreibung |
| `file_path` | VARCHAR(500) | Dateipfad/URL (bei Dateien) |
| `external_url` | VARCHAR(500) | Externe URL (bei Links) |
| `press_release_id` | UUID (FK) | Verknuepfung mit Pressemitteilung (optional) |
| `file_size_bytes` | BIGINT | Dateigroesse |
| `mime_type` | VARCHAR(100) | MIME-Type |
| `dimensions` | VARCHAR(50) | Bilddimensionen (z.B. "3000x2000") |
| `photo_credit` | VARCHAR(200) | Fotograf/Quellenangabe |
| `display_order` | INTEGER | Sortierreihenfolge |
| `download_count` | INTEGER | Download-Zaehler |
| `is_downloadable` | BOOLEAN | Darf heruntergeladen werden? |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |

### 3.8 Tabelle: `media_clippings`

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `organization_id` | UUID (FK) | Zugehoerige Organisation |
| `event_id` | UUID (FK) | Verknuepfung mit Event (optional) |
| `press_release_id` | UUID (FK) | Verknuepfung mit Pressemitteilung (optional) |
| `press_contact_id` | UUID (FK) | Verknuepfung mit Journalist (optional) |
| `title` | VARCHAR(500) | Titel des Artikels/Berichts |
| `media_outlet` | VARCHAR(200) | Medium |
| `author` | VARCHAR(200) | Autor |
| `clipping_type` | ENUM | `print`, `online`, `radio`, `tv`, `social_media`, `blog`, `podcast` |
| `publish_date` | DATE | Veroeffentlichungsdatum |
| `url` | VARCHAR(500) | URL (bei Online-Medien) |
| `excerpt` | TEXT | Auszug/Zusammenfassung |
| `sentiment` | ENUM | `positive`, `neutral`, `negative` |
| `estimated_reach` | INTEGER | Geschaetzte Reichweite/Auflage |
| `estimated_value_eur` | DECIMAL(10,2) | Geschaetzter Media-Wert in EUR |
| `is_google_alert` | BOOLEAN | Aus Google Alerts importiert? |
| `google_alert_keyword` | VARCHAR(200) | Ausloesendes Keyword (bei Google Alert) |
| `screenshot_path` | VARCHAR(500) | Screenshot des Artikels |
| `attachment_path` | VARCHAR(500) | PDF-Scan/Audio-Datei |
| `notes` | TEXT | Interne Notizen |
| `created_by` | UUID (FK) | Nutzer, der das Clipping erfasst hat |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Aktualisierung |

### 3.9 Tabelle: `pr_calendar_events`

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `organization_id` | UUID (FK) | Zugehoerige Organisation |
| `title` | VARCHAR(300) | Titel der Kalendereintrags |
| `event_type` | ENUM | `press_release_draft`, `press_release_send`, `embargo_lift`, `follow_up`, `interview`, `photo_shoot`, `deadline`, `custom` |
| `press_release_id` | UUID (FK) | Verknuepfung mit Pressemitteilung (optional) |
| `event_id` | UUID (FK) | Verknuepfung mit Event (optional) |
| `description` | TEXT | Beschreibung |
| `start_date` | TIMESTAMP | Startzeitpunkt |
| `end_date` | TIMESTAMP | Endzeitpunkt (optional) |
| `all_day` | BOOLEAN | Ganztaegig? |
| `reminder_minutes_before` | INTEGER | Erinnerung X Minuten vorher |
| `assigned_to` | UUID (FK) | Zugewiesener Nutzer |
| `status` | ENUM | `planned`, `confirmed`, `completed`, `cancelled`, `overdue` |
| `color` | VARCHAR(7) | Farbe fuer Kalender-Darstellung (Hex) |
| `created_by` | UUID (FK) | Nutzer |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Aktualisierung |

### 3.10 Tabelle: `event_calendar_submissions`

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `organization_id` | UUID (FK) | Zugehoerige Organisation |
| `event_id` | UUID (FK) | Verknuepfung mit Event |
| `calendar_name` | VARCHAR(200) | Name des Ziel-Kalenders |
| `calendar_type` | ENUM | `city_portal`, `newspaper`, `culture_server`, `radio`, `custom` |
| `calendar_url` | VARCHAR(500) | URL des Ziel-Kalenders |
| `submission_method` | ENUM | `email`, `api`, `web_form`, `manual` |
| `submission_config` | JSONB | Konfiguration (E-Mail-Adresse, API-Key, etc.) |
| `status` | ENUM | `pending`, `submitted`, `confirmed`, `published`, `rejected`, `failed` |
| `submitted_at` | TIMESTAMP | Einreichungszeitpunkt |
| `response_at` | TIMESTAMP | Antwortzeitpunkt |
| `response_note` | TEXT | Antwort/Notiz |
| `retry_count` | INTEGER | Anzahl Wiederholungsversuche |
| `last_error` | TEXT | Letzter Fehler |
| `created_by` | UUID (FK) | Nutzer |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Aktualisierung |

### 3.11 Tabelle: `google_alert_feeds`

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `organization_id` | UUID (FK) | Zugehoerige Organisation |
| `name` | VARCHAR(200) | Name des Alerts (z.B. "Mein Theater") |
| `rss_feed_url` | VARCHAR(500) | Google Alerts RSS-Feed-URL |
| `keywords` | VARCHAR(500) | Ueberwachte Keywords |
| `is_active` | BOOLEAN | Aktiv/inaktiv |
| `last_fetch_at` | TIMESTAMP | Letzter Abruf |
| `last_fetch_count` | INTEGER | Letzte Anzahl neuer Eintraege |
| `fetch_interval_hours` | INTEGER | Abruf-Intervall in Stunden (Standard: 6) |
| `auto_import` | BOOLEAN | Neue Eintraege automatisch als Clippings importieren? |
| `created_by` | UUID (FK) | Nutzer |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Aktualisierung |

### 3.12 Beziehungen (ER-Diagramm — textuell)

```
organizations ||--o{ press_contacts : "verwaltet"
organizations ||--o{ press_releases : "erstellt"
organizations ||--o{ press_distributions : "versendet"
organizations ||--o{ press_kits : "betreibt"
organizations ||--o{ media_clippings : "sammelt"
organizations ||--o{ pr_calendar_events : "plant"
organizations ||--o{ event_calendar_submissions : "reicht ein"
organizations ||--o{ google_alert_feeds : "ueberwacht"

press_releases ||--o{ press_release_attachments : "hat"
press_releases ||--o{ press_distributions : "wird versendet via"
press_releases ||--o{ press_kit_items : "ist enthalten in"
press_releases ||--o{ media_clippings : "generiert"
press_releases ||--o{ pr_calendar_events : "hat"
press_releases }o--|| ai_generations : "wird generiert durch"
press_releases }o--|| prompt_templates : "nutzt Template"

events ||--o{ press_releases : "hat"
events ||--o{ press_kits : "hat"
events ||--o{ media_clippings : "wird berichtet in"
events ||--o{ pr_calendar_events : "hat"
events ||--o{ event_calendar_submissions : "wird eingereicht in"

press_contacts ||--o{ press_distribution_recipients : "empfaengt"
press_contacts ||--o{ media_clippings : "schreibt"
press_distributions ||--o{ press_distribution_recipients : "hat"

press_kits ||--o{ press_kit_items : "enthaelt"

artists ||--o{ press_kits : "hat"
```

---

## 4. API-Endpunkte

### 4.1 Journalisten-Datenbank (`press_contacts`)

```
GET    /api/v1/press/contacts                          (Liste mit Filter/Pagination)
GET    /api/v1/press/contacts/:contactId
POST   /api/v1/press/contacts
PUT    /api/v1/press/contacts/:contactId
DELETE /api/v1/press/contacts/:contactId
POST   /api/v1/press/contacts/import                   (CSV/Excel-Import)
GET    /api/v1/press/contacts/template                 (Import-Template download)
POST   /api/v1/press/contacts/:contactId/duplicate     (Kontakt duplizieren)
GET    /api/v1/press/contacts/topics                   (Verfuegbare Themen-Tags)
GET    /api/v1/press/contacts/:contactId/history       (Sende-Historie)
```

**Request-Body (POST /api/v1/press/contacts):**
```json
{
  "first_name": "Anna",
  "last_name": "Mueller",
  "email": "anna.mueller@beispielzeitung.de",
  "phone": "+49 89 123456",
  "media_outlet": "Beispielzeitung",
  "media_type": "newspaper",
  "job_title": "Kulturredakteurin",
  "topics": ["jazz", "theater", "lokales"],
  "city": "Muenchen",
  "region": "Bayern",
  "language": "de",
  "website": "https://www.beispielzeitung.de",
  "notes": "Bevorzugt E-Mail, nicht anrufen vor 10 Uhr",
  "preferred_channel": "email"
}
```

### 4.2 Pressemitteilungen (`press_releases`)

```
GET    /api/v1/press/releases                          (Liste mit Filter)
GET    /api/v1/press/releases/:releaseId
POST   /api/v1/press/releases
PUT    /api/v1/press/releases/:releaseId
DELETE /api/v1/press/releases/:releaseId
POST   /api/v1/press/releases/:releaseId/duplicate
POST   /api/v1/press/releases/:releaseId/generate      (KI-Generierung ausloesen)
POST   /api/v1/press/releases/:releaseId/preview       (HTML-Preview generieren)
POST   /api/v1/press/releases/:releaseId/send          (Sofortversand)
POST   /api/v1/press/releases/:releaseId/schedule      (Zeitgesteuerter Versand)
POST   /api/v1/press/releases/:releaseId/cancel        (Geplanten Versand abbrechen)
GET    /api/v1/press/releases/:releaseId/pdf           (PDF-Export)
GET    /api/v1/press/releases/:releaseId/stats         (Statistik/Oeffnungsraten)
```

**Request-Body (POST /api/v1/press/releases mit KI-Generierung):**
```json
{
  "event_id": "uuid-des-events",
  "title": "Jazz-Nacht im Stadtpark",
  "language": "de",
  "status": "draft",
  "embargo_until": null,
  "generate_with_ai": true,
  "ai_config": {
    "provider_id": "uuid-des-ki-providers",
    "template_id": "uuid-des-press-release-templates",
    "tone": "formal",
    "target_length": "medium",
    "temperature": 0.7
  },
  "boilerplate": "Das Stadtpark Theater ist eine der fuehrenden Kleinkunst-Buehnen Muenchens...",
  "contact_info": "Max Mustermann, Presse\nTel: +49 89 123456\nE-Mail: presse@stadtpark-theater.de"
}
```

### 4.3 Presse-Verteiler (`press_distributions`)

```
GET    /api/v1/press/distributions                     (Liste)
GET    /api/v1/press/distributions/:distributionId
POST   /api/v1/press/distributions                     (Verteiler erstellen)
PUT    /api/v1/press/distributions/:distributionId
DELETE /api/v1/press/distributions/:distributionId
POST   /api/v1/press/distributions/:distributionId/send       (Versand starten)
POST   /api/v1/press/distributions/:distributionId/cancel     (Abbrechen)
GET    /api/v1/press/distributions/:distributionId/recipients (Empfaengerliste)
GET    /api/v1/press/distributions/:distributionId/stats      (Statistik)
POST   /api/v1/press/distributions/:distributionId/resend-failed (Fehlgeschlagenen erneut senden)
```

**Request-Body (POST /api/v1/press/distributions):**
```json
{
  "press_release_id": "uuid-der-pm",
  "name": "Jazz-Nacht — Lokale Medien",
  "description": "Verteiler an lokale Jazz- und Kulturjournalisten",
  "channel": "email_smtp",
  "channel_config": {
    "from_name": "Stadtpark Theater Presse",
    "from_email": "presse@stadtpark-theater.de",
    "reply_to": "presse@stadtpark-theater.de"
  },
  "recipient_selection": {
    "contact_ids": ["uuid-1", "uuid-2"],
    "topic_filter": ["jazz", "lokales"],
    "region_filter": ["Bayern"],
    "media_type_filter": ["newspaper", "online"]
  },
  "scheduled_at": "2024-08-10T09:00:00Z",
  "personalization": {
    "subject_template": "Pressemitteilung: Jazz-Nacht im Stadtpark — {{contact.media_outlet}}",
    "salutation_template": "Liebe/r {{contact.first_name}},"
  }
}
```

### 4.4 Tracking-Endpunkte (oeffentlich, nicht authentifiziert)

```
GET /t/:trackingToken/pixel.gif      (Tracking-Pixel fuer Oeffnungsrate)
GET /t/:trackingToken/link           (Link-Tracking-Weiterleitung)
```

### 4.5 Digitale Pressemappe (`press_kits`)

```
GET    /api/v1/press/kits                              (Liste)
GET    /api/v1/press/kits/:kitId
POST   /api/v1/press/kits
PUT    /api/v1/press/kits/:kitId
DELETE /api/v1/press/kits/:kitId
POST   /api/v1/press/kits/:kitId/generate              (Auto-Generierung aus Event)
POST   /api/v1/press/kits/:kitId/items                 (Item hinzufuegen)
PUT    /api/v1/press/kits/:kitId/items/:itemId
DELETE /api/v1/press/kits/:kitId/items/:itemId
POST   /api/v1/press/kits/:kitId/reorder               (Sortierung aendern)
GET    /api/v1/press/kits/:kitId/qr                    (QR-Code generieren)
GET    /api/v1/press/kits/:kitId/stats                 (Download-Statistiken)
```

**Oeffentliche Endpunkte (keine Authentifizierung):**
```
GET /presskit/:organizationSlug/:kitSlug          (Pressemappe anzeigen)
GET /presskit/:organizationSlug/:kitSlug/download/:itemId (Item herunterladen)
POST /presskit/:organizationSlug/:kitSlug/auth     (Passwort-Pruefung)
```

### 4.6 Medienbeobachtung (`media_clippings`)

```
GET    /api/v1/press/clippings                         (Liste mit Filter)
GET    /api/v1/press/clippings/:clippingId
POST   /api/v1/press/clippings
PUT    /api/v1/press/clippings/:clippingId
DELETE /api/v1/press/clippings/:clippingId
POST   /api/v1/press/clippings/import-google-alert     (Google Alert Eintrag importieren)
GET    /api/v1/press/clippings/stats                   (Clipping-Statistiken)
GET    /api/v1/press/clippings/report                  (PDF-Bericht generieren)
```

### 4.7 Google Alerts Integration (`google_alert_feeds`)

```
GET    /api/v1/press/google-alerts                     (Liste)
GET    /api/v1/press/google-alerts/:feedId
POST   /api/v1/press/google-alerts                     (Feed hinzufuegen)
PUT    /api/v1/press/google-alerts/:feedId
DELETE /api/v1/press/google-alerts/:feedId
POST   /api/v1/press/google-alerts/:feedId/fetch       (Manueller Abruf)
POST   /api/v1/press/google-alerts/:feedId/test        (Verbindungstest)
GET    /api/v1/press/google-alerts/:feedId/entries     (Gefetchte Eintraege)
```

**Request-Body (POST /api/v1/press/google-alerts):**
```json
{
  "name": "Stadtpark Theater Monitoring",
  "rss_feed_url": "https://www.google.com/alerts/feeds/123456789/123456789",
  "keywords": "Stadtpark Theater Muenchen Jazz",
  "is_active": true,
  "fetch_interval_hours": 6,
  "auto_import": true
}
```

### 4.8 PR-Kalender (`pr_calendar_events`)

```
GET    /api/v1/press/calendar                          (Kalenderdaten im Bereich)
GET    /api/v1/press/calendar/:calendarEventId
POST   /api/v1/press/calendar
PUT    /api/v1/press/calendar/:calendarEventId
DELETE /api/v1/press/calendar/:calendarEventId
GET    /api/v1/press/calendar/export/ical              (iCal-Export)
POST   /api/v1/press/calendar/:calendarEventId/complete (Als erledigt markieren)
```

### 4.9 Event-Kalender-Meldung (`event_calendar_submissions`)

```
GET    /api/v1/press/calendar-submissions              (Liste)
GET    /api/v1/press/calendar-submissions/:submissionId
POST   /api/v1/press/calendar-submissions              (Manuelle Einreichung)
POST   /api/v1/press/calendar-submissions/:submissionId/submit  (Einreichen)
POST   /api/v1/press/calendar-submissions/:submissionId/retry   (Wiederholen)
GET    /api/v1/press/calendar-submissions/channels     (Verfuegbare Kanaele)
```

### 4.10 Presse-Reporting

```
GET /api/v1/press/reports/dashboard                   (PR-Dashboard-Daten)
GET /api/v1/press/reports/by-period                   (Zeitraum-Auswertung)
GET /api/v1/press/reports/by-journalist               (Journalisten-Ranking)
GET /api/v1/press/reports/by-topic                    (Themen-Ranking)
GET /api/v1/press/reports/by-event                    (Event-Vergleich)
GET /api/v1/press/reports/clipping-report             (Clipping-Bericht als PDF)
```

---

## 5. UI-Komponenten

### 5.1 Journalisten-Verzeichnis

| Komponente | Pfad | Beschreibung |
|------------|------|-------------|
| `PressContactList` | `/press/contacts` | Uebersichtsliste mit Such- und Filterleiste |
| `PressContactCard` | — | Karten-Ansicht eines Kontakts mit Avatar, Medium, Themen-Tags |
| `PressContactForm` | `/press/contacts/new` | Formular fuer Neu-/Bearbeitung mit Validierung |
| `PressContactImport` | `/press/contacts/import` | CSV/Excel-Import mit Preview und Duplikat-Erkennung |
| `PressContactDetail` | `/press/contacts/:id` | Detailansicht mit Notizen, Historie, zugeordnete Clippings |
| `TopicTagSelector` | — | Wiederverwendbarer Tag-Selektor fuer Themengebiete |
| `ContactHistory` | — | Zeitleiste aller Interaktionen mit dem Kontakt |

### 5.2 Pressemitteilungs-Editor

| Komponente | Pfad | Beschreibung |
|------------|------|-------------|
| `PressReleaseList` | `/press/releases` | Liste aller Pressemitteilungen mit Status-Filter |
| `PressReleaseEditor` | `/press/releases/:id/edit` | Haupteditor: Rich-Text mit KI-Assistenz |
| `PressReleaseWizard` | `/press/releases/new` | Schritt-fuer-Schritt-Wizard (Event waehlen -> KI generieren -> Bearbeiten -> Versenden) |
| `AIPressReleasePanel` | — | Seitenpanel mit KI-Generierungs-Steuerung (verknuepft mit Dim. 6) |
| `PressReleasePreview` | — | Vorschau wie beim Empfaenger (HTML-Rendering) |
| `EmbargoPicker` | — | Datum/Uhrzeit-Picker fuer Embargo |
| `PressReleaseStats` | — | Statistik-Overlay (Oeffnungen, Klicks, Versandstatus) |
| `AttachmentUploader` | — | Drag-and-Drop Upload fuer Bilder/Dokumente |

### 5.3 Presse-Verteiler

| Komponente | Pfad | Beschreibung |
|------------|------|-------------|
| `DistributionBuilder` | `/press/distributions/new` | Wizard: Empfaenger selektieren, Kanal waehlen, Personalisieren |
| `DistributionRecipientSelector` | — | Filter-basierte Empfaenger-Auswahl mit Live-Zaehler |
| `DistributionChannelConfig` | — | Kanal-Konfiguration (SMTP, Portal-API) |
| `DistributionProgress` | — | Live-Fortschrittsanzeige beim Versand |
| `DistributionStats` | `/press/distributions/:id` | Ergebnis-Ansicht mit Oeffnungsraten, Bounces, Klicks |
| `PersonalizationEditor` | — | Template-Editor fuer Betreffzeile und Anrede |

### 5.4 Digitale Pressemappe

| Komponente | Pfad | Beschreibung |
|------------|------|-------------|
| `PressKitList` | `/press/kits` | Uebersicht aller Pressemappen |
| `PressKitBuilder` | `/press/kits/:id/edit` | Builder fuer Pressemappe (Drag-and-Drop) |
| `PressKitPublic` | `/presskit/:org/:slug` | Oeffentliche Ansicht (responsiv, SEO-optimiert) |
| `PressKitItemUploader` | — | Upload-Komponente fuer verschiedene Medientypen |
| `PressKitQRCode` | — | QR-Code-Generator fuer Druck |
| `PressKitStats` | — | Download- und Aufrufstatistiken |

### 5.5 Medienbeobachtung

| Komponente | Pfad | Beschreibung |
|------------|------|-------------|
| `ClippingDashboard` | `/press/clippings` | Uebersicht mit neuesten Clippings, Statistiken |
| `ClippingList` | — | Filterbare Liste aller Clippings |
| `ClippingForm` | `/press/clippings/new` | Formular zum manuellen Erfassen |
| `ClippingDetail` | `/press/clippings/:id` | Detailansicht mit Screenshot, URL, Sentiment |
| `GoogleAlertManager` | `/press/google-alerts` | Verwaltung der Google Alert RSS-Feeds |
| `GoogleAlertFeedEntries` | — | Gefetchte Eintraege mit Import-Buttons |
| `SentimentBadge` | — | Wiederverwendbare Sentiment-Anzeige (positiv/neutral/negativ) |
| `ClippingReportGenerator` | — | PDF-Bericht-Generator mit Zeitraum-Auswahl |

### 5.6 PR-Kalender

| Komponente | Pfad | Beschreibung |
|------------|------|-------------|
| `PRCalendar` | `/press/calendar` | Full-Calendar-Komponente (Monat/Woche/Tag) |
| `PRCalendarEventForm` | — | Formular fuer Kalendereintrag |
| `PRReminderBadge` | — | Erinnerungs-Badge in der Navigation |
| `EmbargoCountdown` | — | Countdown-Widget fuer aktive Embargos |

### 5.7 Event-Kalender-Meldung

| Komponente | Pfad | Beschreibung |
|------------|------|-------------|
| `CalendarSubmissionManager` | `/press/calendar-submissions` | Uebersicht aller Einreichungen |
| `CalendarChannelConfig` | — | Konfiguration der Ziel-Kalender |
| `CalendarSubmissionStatus` | — | Status-Badge mit Aktionen |

### 5.8 PR-Dashboard (Startseite)

| Komponente | Beschreibung |
|------------|-------------|
| `PRDashboard` | Gesamtuebersicht mit KPIs |
| `RecentClippingsWidget` | Letzte 5 Clippings |
| `UpcomingReleasesWidget` | Geplante Pressemitteilungen |
| `ActiveEmbargosWidget` | Aktive Embargos mit Countdown |
| `PressStatsCards` | KPI-Karten: Gesendete PMs, Clippings, geschaetzte Reichweite |
| `JournalistActivityChart` | Balkendiagramm: Top-Journalisten |

---

## 6. Integrationen

### 6.1 KI-Textgenerierung (Dimension 6)

| Integration | Typ | Beschreibung |
|-------------|-----|-------------|
| `ai/generate/text` | Interne API | Pressemitteilungen werden ueber die KI-API generiert |
| `prompt_templates` | Datenbank | Pressemitteilungs-Templates aus `prompt_templates` (Kategorie `press_release`) |
| `ai_generations` | Datenbank | Jede KI-generierte PM wird in `ai_generations` mit `use_case: "press_release"` protokolliert |

**Prompt-Template fuer Pressemitteilungen:**
```
System-Prompt: "Du bist ein erfahrener Presse-Redakteur fuer Kulturveranstaltungen. 
Schreibe eine professionelle Pressemitteilung nach DIN 5008 im formalen Ton. 
Die Pressemitteilung muss enthalten: Titel, Untertitel, Lead, Haupttext mit 
Event-Details, und einen Boilerplate-Absatz."

User-Template: "Erstelle eine Pressemitteilung fuer folgende Veranstaltung:
Titel: {{event.title}}
Kuenstler: {{event.artist}}
Genre: {{event.genre}}
Datum: {{event.date}} um {{event.time}}
Location: {{event.venue}}
Beschreibung: {{event.description}}
Besonderheiten: {{event.special_notes}}
Ticketpreis: {{event.ticket_price}}
Veranstalter: {{org.name}} in {{org.city}}"
```

### 6.2 E-Mail-Versand (SMTP)

| Integration | Typ | Beschreibung |
|-------------|-----|-------------|
| SMTP-Server | Protokoll | Standard-Versand ueber konfigurierbaren SMTP-Server |
| SendGrid API | API-Integration | Optional: Versand ueber SendGrid fuer bessere Zustellbarkeit und Tracking |
| Mailgun API | API-Integration | Optional: Alternative zu SendGrid |
| Postmark API | API-Integration | Optional: Transaktions-E-Mail-Service |

**SMTP-Konfiguration pro Organisation:**
```json
{
  "smtp_host": "smtp.beispiel.de",
  "smtp_port": 587,
  "smtp_encryption": "tls",
  "smtp_username": "presse@beispiel.de",
  "smtp_password_encrypted": "***",
  "from_name": "Stadtpark Theater Presse",
  "from_email": "presse@stadtpark-theater.de",
  "reply_to": "presse@stadtpark-theater.de",
  "daily_send_limit": 500,
  "hourly_send_limit": 100
}
```

### 6.3 Deutsche Presseportale

| Portal | Methode | API/Interface | Kosten | Status |
|--------|---------|---------------|--------|--------|
| **openPR** | API | REST-API mit API-Key | Kostenlos / Premium | Geplant |
| **connektar** | API | REST-API mit Account | ab 29 EUR/Monat | Geplant |
| **firmenpresse** | API | REST-API mit API-Key | Kostenlos / Premium | Geplant |
| **PresseBox** | API | REST-API | Kostenlos | Geplant |
| **PRGateway** | Web-Form | Automatisiertes Formular | ab 99 EUR/Monat | Zukuenftig |

**openPR API-Integration:**
```
POST https://api.openpr.de/v1/release
Headers: Authorization: Bearer {api_key}
Body:
  title: string (max 150 Zeichen)
  body: string (HTML oder Plaintext)
  category_id: integer
  tags: string[]
  images: URL[]
  contact_name: string
  contact_email: string
  contact_phone: string
  company: string
```

### 6.4 Google Alerts (RSS)

| Integration | Typ | Beschreibung |
|-------------|-----|-------------|
| RSS-Feed-Parser | Protokoll | Abruf der Google Alerts RSS-Feeds im konfigurierten Intervall |
| Feed-URL-Generator | Tool | Hilfe bei der Erstellung der korrekten Google Alerts RSS-URL |

**Google Alerts RSS-URL-Format:**
```
https://www.google.com/alerts/feeds/{user_id}/{feed_id}
```

**Hinweis fuer Nutzer:** Die App bietet eine Schritt-fuer-Schritt-Anleitung zum Erstellen eines Google Alerts und Kopieren der RSS-Feed-URL, da Google keine API fuer Alerts bereitstellt.

### 6.5 Event-Kalender-Kanaele

| Kanal | Methode | Beschreibung |
|-------|---------|-------------|
| **Stadtportale** | E-Mail-Template | Konfigurierbare E-Mail-Vorlage an Stadt-Redaktion |
| **Kulturserver** | API/E-Mail | Je nach Bundesland (z.B. Kulturserver Niedersachsen) |
| **Szene-Portale** | API | Szene.de, GoOut.net, Rausgegangen.de |
| **Radio-Veranstaltungskalender** | E-Mail-Template | Lokalradios mit Veranstaltungskalender |
| **Zeitungs-Veranstaltungskalender** | E-Mail-Template | Lokalzeitungen |
| **Weg.de / meinestadt.de** | API | Veranstaltungsportale |

### 6.6 Bildverarbeitung

| Integration | Typ | Beschreibung |
|-------------|-----|-------------|
| Sharp (Node.js) | Library | Bild-Optimierung, Thumbnail-Generierung, Groessenanpassung |
| Exif-Parser | Library | Metadaten-Extraktion aus hochgeladenen Fotos |

---

## 7. Technische Details

### 7.1 Verteiler-Technische Umsetzung

#### 7.1.1 SMTP-Versand (Eigener Server)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Verteiler-Job  │────▶│  E-Mail-Queue    │────▶│  SMTP-Worker    │
│  (API Request)  │     │  (Bull Queue)    │     │  (Nodemailer)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                        │
                              ┌─────────────────────────┼─────────────────────────┐
                              ▼                         ▼                         ▼
                        ┌──────────┐              ┌──────────┐              ┌──────────┐
                        │  Empf. 1 │              │  Empf. 2 │              │  Empf. N │
                        │ (async)  │              │ (async)  │              │ (async)  │
                        └──────────┘              └──────────┘              └──────────┘
```

**Technischer Ablauf:**
1. Verteiler wird erstellt (Status: `draft`)
2. Bei Sende-Ausloesung: Wechsel zu `sending`, Empfaenger werden in Queue eingereiht
3. Bull-Queue (Redis-backed) verarbeitet E-Mails mit konfigurierbarem Parallelitaetsgrad (Standard: 5 gleichzeitig)
4. Nodemailer sendet jede E-Mail mit individualisiertem Tracking-Pixel
5. Status pro Empfaenger wird in `press_distribution_recipients` aktualisiert
6. Nach Abschluss: Verteiler-Status -> `sent`, Statistiken werden aggregiert

**Rate-Limiting:**
- Standard: max. 100 E-Mails/Stunde, 500/Tag
- Konfigurierbar pro Organisation
- Exponentielles Backoff bei SMTP-Fehlern (5xx)
- Wiederholung bei temporären Fehlern (4xx) nach 15 Min, dann 1h, dann 4h

**Tracking-Pixel:**
```html
<img src="https://api.app.de/t/{trackingToken}/pixel.gif" 
     width="1" height="1" alt="" />
```
- 1x1 transparentes GIF
- Request aktualisiert `opened_at` in `press_distribution_recipients`
- Datenschutz-Hinweis in jeder E-Mail: "Diese E-Mail enthaelt ein Tracking-Pixel"

#### 7.1.2 Presseportal-Versand

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Verteiler-Job  │────▶│  Portal-Adapter  │────▶│  openPR API     │
│                 │     │  (Strategy       │     │  connektar API  │
│                 │     │   Pattern)       │     │  firmenpresse   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

**Adapter-Pattern fuer Portale:**
```typescript
interface PressPortalAdapter {
  readonly name: string;
  readonly requiredConfig: string[];
  validateConfig(config: unknown): boolean;
  submit(release: PressRelease, config: PortalConfig): Promise<PortalResult>;
  checkStatus(submissionId: string, config: PortalConfig): Promise<PortalStatus>;
}

class OpenPRAdapter implements PressPortalAdapter { /* ... */ }
class ConnektarAdapter implements PressPortalAdapter { /* ... */ }
class FirmenpresseAdapter implements PressPortalAdapter { /* ... */ }
```

#### 7.1.3 E-Mail-Personalisierung

**Template-Engine:** Handlebars.js

```
Betreff: Pressemitteilung: {{event.title}} — exklusiv fuer {{contact.media_outlet}}

{{#if contact.first_name}}
Liebe/r {{contact.first_name}},
{{else}}
Sehr geehrte Damen und Herren,
{{/if}}

hiermit uebersenden wir Ihnen eine Pressemitteilung zu unserer kommenden 
Veranstaltung "{{event.title}}" am {{event.date}}.

... PM-Inhalt ...

Mit freundlichen Gruessen
{{org.name}}
```

### 7.2 Eingesetzte Libraries

| Bereich | Library | Zweck |
|---------|---------|-------|
| Rich-Text-Editor | TipTap / ProseMirror | Pressemitteilungs-Editor im Browser |
| E-Mail-Versand | Nodemailer | SMTP-Versand |
| E-Mail-Templates | Handlebars.js | Personalisierte E-Mail-Templates |
| Queue-System | Bull (Redis) | Asynchrone Versand-Jobs |
| RSS-Parsing | rss-parser | Google Alerts RSS-Feeds einlesen |
| Kalender | FullCalendar.js | PR-Kalender UI-Komponente |
| PDF-Export | Puppeteer + HTML-Template | Pressemitteilungen und Clipping-Berichte als PDF |
| Bildverarbeitung | Sharp | Thumbnails, Optimierung |
| QR-Code | qrcode | Pressemappe QR-Code-Generierung |
| Tracking | crypto (built-in) | Tracking-Token-Generierung |
| CSV-Import | PapaParse | Journalisten-Import aus CSV |
| Excel-Import | xlsx | Journalisten-Import aus Excel |

### 7.3 Datenbank-Indizes

```sql
-- Schnelle Suche nach Themen
CREATE INDEX idx_press_contacts_topics ON press_contacts USING GIN (topics);

-- Schnelle Filter nach Medium und Region
CREATE INDEX idx_press_contacts_media ON press_contacts(media_outlet, region);

-- Status-basierte Abfragen fuer Verteiler
CREATE INDEX idx_press_distributions_status ON press_distributions(status, scheduled_at);

-- Tracking-Token (schnelle Lookup fuer Oeffnungsraten)
CREATE INDEX idx_distribution_recipients_token ON press_distribution_recipients(tracking_token);

-- Oeffentliche Pressemappe per Slug
CREATE INDEX idx_press_kits_slug ON press_kits(organization_id, slug);

-- Kalenderdaten im Bereich
CREATE INDEX idx_pr_calendar_date ON pr_calendar_events(start_date, end_date);
```

### 7.4 Sicherheit & Datenschutz

| Aspekt | Massnahme |
|--------|-----------|
| SMTP-Credentials | Verschluesselt in `channel_config` (AES-256), nie im Klartext |
| Tracking-Pixel | Opt-in pro Verteiler, Hinweis in jeder E-Mail |
| Pressemappe-Passwort | bcrypt-Hash, kein Klartext |
| Google Alert Feeds | Nur RSS-URLs, keine Google-Credentials |
| Rate-Limiting | Sende-Limits pro Organisation, Anti-Spam-Schutz |
| DSGVO | Kontakte koennen als "do_not_contact" markiert werden, Loeschung auf Anfrage |

### 7.5 Skalierungsueberlegungen

| Szenario | Massnahme |
|----------|----------|
| Grosse Verteiler (>500 Empfaenger) | Batch-Verarbeitung in Bloecken von 50, mit Pausen |
| Viele Google Alert Feeds | Caching der Feed-Eintraege, deduplizierung |
| Pressefotos in Druckqualitaet | CDN-Auslieferung (CloudFront/Cloudflare), Async-Upload |
| Gleichzeitige KI-Generierung | Queue-basiert, Fortschrittsanzeige via WebSocket |

---

## 8. Akzeptanzkriterien

### 8.1 Journalisten-Datenbank (Gesamtkriterien)

- [ ] Veranstalter kann Journalisten manuell erfassen mit allen Pflichtfeldern
- [ ] Import von 50+ Kontakten aus CSV unter 2 Minuten
- [ ] Duplikat-Erkennung bei Import funktioniert zuverlaessig (>95%)
- [ ] Suche nach Name, Medium oder Thema liefert Ergebnisse in <500ms
- [ ] Kontakt-Historie zeigt alle gesendeten Pressemitteilungen chronologisch
- [ ] Filterung nach Themen, Medientyp und Region ist moeglich

### 8.2 Pressemitteilungen (Gesamtkriterien)

- [ ] KI-generierte Pressemitteilung folgt DIN-5008-Struktur
- [ ] Generierung aus Event-Daten funktioniert in <10 Sekunden
- [ ] Rich-Text-Editor unterstuetzt Formatierung, Links, Bilder
- [ ] Embargo-Funktion haelt Versand bis zum definierten Zeitpunkt zurueck
- [ ] PDF-Export sieht professionell aus und ist druckfertig
- [ ] Versionshistorie speichert mindestens die letzten 10 Aenderungen
- [ ] Pressemitteilung ist ueber oeffentliche URL teilbar

### 8.3 Presse-Verteiler (Gesamtkriterien)

- [ ] Versand an 50+ Empfaenger funktioniert zuverlaessig ohne Spam-Markierung
- [ ] Personalisierung (Anrede, Medium im Betreff) wird korrekt eingesetzt
- [ ] Tracking-Pixel erfasst Oeffnungen (bei aktiviertem Tracking)
- [ ] Bounces werden erkannt und als fehlgeschlagen markiert
- [ ] Zeitgesteuerter Versand wird zum definierten Zeitpunkt ausgefuehrt (+/- 2 Min)
- [ ] Rate-Limiting verhindert Ueberschreitung der SMTP-Limits
- [ ] Wiederholung fehlgeschlagener Sendungen ist moeglich

### 8.4 Digitale Pressemappe (Gesamtkriterien)

- [ ] Pressemappe ist unter oeffentlicher URL erreichbar
- [ ] Seite laedt in <2 Sekunden (auch mit 10+ Bildern)
- [ ] Download von Pressefotos in Originalqualitaet ist moeglich
- [ ] QR-Code fuehrt korrekt zur Pressemappe
- [ ] Passwort-Schutz funktioniert (bei aktivierter Option)
- [ ] SEO-Metadaten sind korrekt gesetzt

### 8.5 Medienbeobachtung (Gesamtkriterien)

- [ ] Manuelles Erfassen eines Clippings unter 1 Minute
- [ ] Google Alert RSS-Feed wird im konfigurierten Intervall abgerufen
- [ ] Automatisch importierte Clippings werden korrekt verknuepft
- [ ] Clipping-Bericht als PDF enthaelt alle Eintraege im Zeitraum
- [ ] Sentiment-Analyse (manuell oder KI) ist moeglich
- [ ] Dashboard-Widget zeigt letzte Clippings auf Startseite

### 8.6 PR-Kalender (Gesamtkriterien)

- [ ] Kalender zeigt alle PR-Aktivitaeten im gewaehlten Zeitraum
- [ ] Automatische Eintragung bei geplantem Versand funktioniert
- [ ] Embargos werden mit Countdown angezeigt
- [ ] iCal-Export ist moeglich
- [ ] Farbcodierung nach Status ist korrekt
- [ ] Erinnerungsfunktion sendet Benachrichtigung vor Frist

### 8.7 Event-Kalender-Meldung (Gesamtkriterien)

- [ ] Event wird automatisch an konfigurierte Kanaele gemeldet
- [ ] Status-Tracking zeigt aktuellen Zustand pro Kanal
- [ ] Fehler bei Einreichung werden protokolliert und angezeigt
- [ ] Wiederholung fehlgeschlagener Einreichungen ist moeglich
- [ ] Liste der Kanaele ist erweiterbar

### 8.8 Modul-Done-Kriterien

Das Modul gilt als vollstaendig umgesetzt, wenn:

1. **Alle User Stories US-1 bis US-8** ihre Akzeptanzkriterien erfuellen
2. **End-to-End-Workflow** funktioniert: Event anlegen -> PM generieren -> Verteiler erstellen -> Versenden -> Clipping erfassen
3. **KI-Integration** nahtlos mit Dimension 6 zusammenarbeitet
4. **SMTP-Versand** mit mindestens einem konfigurierbaren Server getestet
5. **Presseportal-Integration** mit mindestens openPR funktioniert
6. **100+ Journalisten-Kontakte** koennen ohne Performance-Probleme verwaltet werden
7. **Datenschutzanforderungen** erfuellt sind (Tracking opt-in, DSGVO-Compliance)
8. **Keine kritischen Bugs** im Versand-Workflow (fehlgeschlagenes Senden muss erkannt werden)

---

## 9. Ausblick: Erweiterungen (Post-MVP)

| Feature | Beschreibung | Prioritaet |
|---------|-------------|------------|
| **Journalisten-Suche (KI-gestuetzt)** | Automatische Recherche nach passenden Journalisten im Web | Mittel |
| **Pressespiegel-Auto-Import** | Crawling von Medienseiten fuer automatische Clipping-Erkennung | Mittel |
| **Medien-Datenbank-Integration** | Anbindung an myConvento oder aehnliche Dienste fuer erweiterte Journalisten-Daten | Niedrig |
| **Social Media Press Release** | Pressemitteilungen speziell fuer Social-Media-Kanaele formatiert | Mittel |
| **Multi-Language PM** | Automatische Uebersetzung der PM in mehrere Sprachen (verknuepft mit Dim. 6) | Mittel |
| **Interviews & Termine** | Verwaltung von Interview-Anfragen und Presse-Terminen | Niedrig |
| **Kuenstler-Presseverteiler** | Pressefaehige Kuenstler koennen eigene Verteiler verwalten | Niedrig |
| **Podcast/Gastbeitrag-Matching** | Vorschlaege fuer passende Podcasts/Gastbeitragsmoeglichkeiten | Niedrig |

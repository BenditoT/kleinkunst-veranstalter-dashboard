# Dimension 3: Newsletter-System mit Tracking

## Kleinkunst-Dashboard-App: Newsletter- & Email-Marketing-Modul

**Version:** 1.0
**Datum:** Juli 2026
**Autor:** Produktplanung & Strategie
**Status:** Entwurf
**Scope:** Newsletter-System spezifisch fuer Kleinkunstveranstalter mit mehreren Spielorten

---

## 1. Feature-Beschreibung

Das Newsletter-Modul ist ein vollstaendig integriertes E-Mail-Marketing-System, das speziell auf die Beduerfnisse von Kleinkunstveranstaltern zugeschnitten ist. Es ermoeglicht die Erstellung, Versand und Analyse von Newslettern mit DSGVO-Konformitaet, Smart-Sending-Optimierung und kulturspezifischen Segmentierungsmoeglichkeiten.

### Kern-Funktionen

| # | Funktion | Beschreibung |
|---|----------|-------------|
| 1 | **Double-Opt-In Verwaltung** | DSGVO-konforme Anmeldung mit Bestaetigungs-E-Mail und Token-Validierung |
| 2 | **Preference Center** | Abonnenten koennen Themen, Haeufigkeit und Spielorte selbst verwalten |
| 3 | **E-Mail-Tracking** | Pixel-basierte Oeffnungs-Tracking, Click-Tracking, Bounce- und Complaint-Handling |
| 4 | **Smart Sending** | KI-gesteuerte Sendezeit-Optimierung basierend auf individuellem Oeffnungsverhalten |
| 5 | **Segmentierung** | Dynamische Segmente nach Ort, Interesse, Engagement-Level und Veranstaltungshistorie |
| 6 | **Automation Workflows** | Trigger-basierte E-Mail-Sequenzen (Willkommen, Event-Reminder, Follow-up) |
| 7 | **Drag-and-Drop Editor** | Template-System mit visuellem Editor und kultureigenen Inhalts-Bloecken |
| 8 | **A/B Testing** | Automatisierte Tests fuer Subject Lines mit statistischer Signifikanz-Ermittlung |
| 9 | **SMTP-Integration** | Versand ueber externe SMTP-Provider (Brevo, rapidmail, SendGrid) mit Fallback |
| 10 | **Webhook-Handling** | Empfang und Verarbeitung von Bounce-, Delivery- und Engagement-Events |

### Spezifische Anpassungen fuer Kleinkunst

- **Spielort-basierte Segmentierung:** Empfaenger koennen automatisch nach bevorzugtem Spielort gefiltert werden
- **Veranstaltungs-bezogene News:** Drag-and-Drop-Block fuer automatische Event-Einbindung aus dem Veranstaltungskalender
- **Kuenstler-Profile:** Vordefinierte Blocks fuer Kuenstler-Fotos, Bios und Social-Media-Links
- **Kultur-Timing:** Beruecksichtigung der Saisonalitaet (Vorsaison, Hauptsaison, Weihnachtsprogramm)
- **Gemaessigte Frequenz:** Keine uebermaessige E-Mail-Flut; konservative Defaults (max. 2x/Woche)

---

## 2. User Stories

### US-001: Double-Opt-In Anmeldung (DSGVO-konform)
**Als** potenzieller Newsletter-Abonnent
**moechte ich** mich ueber ein Anmeldeformular fuer den Newsletter registrieren koennen
**damit** ich relevante Informationen ueber Veranstaltungen meiner bevorzugten Spielorte erhalte.

**Akzeptanzkriterien:**
- Anmeldeformular sammelt nur E-Mail (optional: Vorname, bevorzugter Spielort)
- Sofortige Bestaetigungs-E-Mail wird verschickt mit eindeutigem Bestaetigungs-Link
- Nur nach Klick auf Bestaetigungs-Link wird der Kontakt als "confirmed" markiert
- Token ist 72 Stunden gueltig, danach wird der Datensatz automatisch geloescht
- Impressum und Datenschutzerklaerung sind im Footer jeder E-Mail verlinkt
- Einwilligungs-Nachweis wird mit Zeitstempel, IP-Adresse und Quelle gespeichert

---

### US-002: One-Click-Unsubscribe (RFC 8058)
**Als** Newsletter-Empfaenger
**moechte ich** mich mit einem einzigen Klick vom Newsletter abmelden koennen
**damit** ich den Prozess schnell und unkompliziert abschliessen kann, ohne mich einloggen zu muessen.

**Akzeptanzkriterien:**
- Jede E-Mail enthaelt einen List-Unsubscribe-Header (RFC 8058 kompatibel)
- Klick auf "Abbestellen" in der E-Mail fuehrt direkt zur Abmeldung ohne weitere Bestaetigung
- Unsubscribe-Link ist 90 Tage gueltig
- Nach Abmeldung wird E-Mail als "unsubscribed" markiert und erhaelt keinen Versand mehr
- Unsubscribe-Seite bietet alternativ "Einstellungen anpassen" statt kompletter Abmeldung
- DSGVO-Art. 17: Bei Abmeldung werden personenbezogene Daten nach 30 Tagen geloescht (nur Pseudonym bleibt fuer Statistik)

---

### US-003: Preference Center (Themen & Haeufigkeit)
**Als** Newsletter-Abonnent
**moechte ich** meine Newsletter-Praeferenzen (Themen, Haeufigkeit, bevorzugte Spielorte) selbst verwalten koennen
**damit** ich nur die Inhalte erhalte, die mich wirklich interessieren.

**Akzeptanzkriterien:**
- Preference Center ist ueber Link in jeder E-Mail erreichbar
- Abonnent kann Themen-Interessen (Checkboxen) auswaehlen: Alle Events, Konzerte, Theater, Lesungen, Kinderprogramm, Special Events
- Abonnent kann bevorzugte Spielorte auswaehlen (Multi-Select aus Veranstalter-Spielorten)
- Haeufigkeit ist waehlbar: Woechentlich, Alle 2 Wochen, Monatlich, Nur bei besonderen Events
- Aenderungen werden sofort wirksam
- Zusammenfassung der aktuellen Einstellungen wird nach Speichern angezeigt

---

### US-004: Newsletter erstellen (Drag-and-Drop Editor)
**Als** Veranstalter (z.B. Kultur-Clara)
**moechte ich** einen professionellen Newsletter mit einem visuellen Drag-and-Drop Editor erstellen koennen
**damit** ich ohne HTML-Kenntnisse ansprechende E-Mails fuer meine Zielgruppe gestalten kann.

**Akzeptanzkriterien:**
- Editor bietet vorgefertigte Blocke: Text, Bild, Button, Trennlinie, Social Media, Event-Liste, Kuenstler-Spotlight
- Event-Block laedt automatisch aktuelle Veranstaltungen aus dem Veranstaltungskalender
- Bilder koennen per Drag-and-Drop hochgeladen werden (max. 2MB, WebP/JPG/PNG)
- Farben werden automatisch aus dem Veranstalter-Corporate-Design uebernommen
- Mobile-Responsive-Vorschau ist in Echtzeit sichtbar
- Undo/Redo-Funktion ist verfuegbar
- Newsletter wird als Template gespeichert und kann wiederverwendet werden

---

### US-005: A/B-Test fuer Subject Lines
**Als** Veranstalter
**moechte ich** fuer einen Newsletter zwei verschiedene Betreffzeilen testen koennen
**damit** ich herausfinde, welche Formulierung zu hoeheren Oeffnungs- und Klickraten fuehrt.

**Akzeptanzkriterien:**
- Zwei Subject Lines koennen eingegeben werden
- Test-Gruppengroesse ist konfigurierbar (z.B. 20% der Empfaenger pro Variante)
- Gewinn-Variante wird automatisch nach Signifikanz-Pruefung an Rest-Gruppe verschickt
- Gewinn-Metrik ist waehlbar: Open Rate, Click Rate, oder Revenue (future)
- Mindest-Laufzeit fuer Test: 2 Stunden
- Ergebnisse werden mit statistischer Signifikanz (p < 0.05) angezeigt

---

### US-006: Smart Sending (Sendezeit-Optimierung)
**Als** Veranstalter
**moechte ich** dass das System automatisch die optimale Versandzeit fuer jeden Empfaenger berechnet
**damit** meine Newsletters moeglichst gelesen und geklickt werden.

**Akzeptanzkriterien:**
- System analysiert historische Oeffnungszeiten pro Empfaenger (min. 3 Oeffnungs-Events erforderlich)
- Ohne ausreichende Daten wird Fallback-Zeit verwendet (Branchen-Durchschnitt: Di/Mi 21 Uhr)
- Optimierung ist pro Kampagne aktiv-/deaktivierbar
- Versand erfolgt ueber priorisierte Queue mit geplanten Zeitpunkten
- Optimierungs-Algorithmus wird monatlich neu kalibriert

---

### US-007: Automation Workflow erstellen
**Als** Veranstalter
**moechte ich** automatisierte E-Mail-Sequenzen basierend auf Trigger-Ereignissen erstellen koennen
**damit** wiederkehrende Kommunikation (Willkommen, Reminder) automatisch ablaeuft.

**Akzeptanzkriterien:**
- Visueller Workflow-Builder mit Trigger, Delay, Condition, Send-Email, End-Knoten
- Vordefinierte Templates: Willkommens-Serie (3 E-Mails), Event-Reminder, Nachveranstaltungs-Follow-up
- Trigger-Typen: Subscribe, Date/Time, Event-Announced, Tag-Added, Engagement-Level
- Delay ist konfigurierbar in Stunden/Tagen/Wochen
- Conditions: Hat geoeffnet, Hat geklickt, Hat nicht geoeffnet, Segment-Zugehoerigkeit
- Workflows koennen pausiert und bearbeitet werden
- Pro Empfaenger wird Workflow-Status getrackt (In Progress, Completed, Exited)

---

### US-008: Segmentierung nach Spielort und Engagement
**Als** Veranstalter
**moechte ich** meine Empfaenger nach verschiedenen Kriterien segmentieren koennen
**damit** ich zielgerichtete Inhalte an die richtige Zielgruppe senden kann.

**Akzeptanzkriterien:**
- Segment-Editor mit AND/OR-Logik
- Filter-Kategorien: Profil-Felder (Ort, Themen), Engagement (Oeffnungsrate, Klicks), Verhalten (zuletzt aktiv, nie geklickt), Veranstaltungsbezug (interessiert an Spielort X)
- Segmente sind dynamisch (aktualisieren sich automatisch)
- Empfaenger-Zahl wird in Echtzeit bei Segment-Definition angezeigt
- Segmente koennen fuer Kampagnen ausgewaehlt oder ausgeschlossen werden

---

### US-009: E-Mail-Performance Analyse
**Als** Veranstalter
**moechte ich** detaillierte Statistiken zu meinen Newsletter-Kampagnen einsehen koennen
**damit** ich die Wirksamkeit meiner E-Mail-Marketing-Massnahmen bewerte und verbessern kann.

**Akzeptanzkriterien:**
- Dashboard zeigt: Gesendet, Zugestellt, Oeffnungen, Klicks, Bounces, Unsubscribes, Beschwerden
- CTR (Click-Through-Rate) wird als Primaermetrik angezeigt (statt Open Rate wegen Apple MPP)
- Zeitlicher Verlauf der Oeffnungen/Klicks als Chart (24h/7-Tage-Ansicht)
- Heatmap der Klick-Verteilung im Newsletter
- Vergleich mit vorheriger Kampagne und Branchen-Durchschnitt
- Export der Rohdaten als CSV

---

### US-010: Bounce- und Reputations-Management
**Als** Systemadministrator
**moechte ich** dass das System Bounces, Complaints und Reputation-Scores automatisch verwaltet
**damit** die Zustellbarkeit unserer E-Mails hoch bleibt und unsere Domain nicht auf Blacklists landet.

**Akzeptanzkriterien:**
- Hard Bounces fuehren sofort zur Deaktivierung der E-Mail-Adresse
- Soft Bounces werden bis zu 3x mit exponentiellem Backoff (1h, 4h, 16h) retried
- Spam-Complaints (FBL) fuehren sofort zur Deaktivierung
- Reputation-Score pro Versand-Domain wird berechnet (0-100)
- Warnung bei Reputation < 80, Versand-Stopp bei Reputation < 60
- Automatische Domain-Warmup-Funktion fuer neue Sender-Domains

---

## 3. Datenmodell

### 3.1 Uebersicht der Tabellen/Collections

```
newsletter_subscribers
  |
  |--< newsletter_subscriptions (1:n)
  |--< newsletter_preferences (1:1)
  |--< newsletter_engagement_scores (1:1)
  |--< subscriber_tags (n:m) >-- newsletter_tags
  |--< subscriber_segments (n:m) >-- newsletter_segments
  |--< email_events (1:n)
  |--< workflow_states (1:n)

newsletter_campaigns
  |
  |--< campaign_variants (1:n)        [fuer A/B Tests]
  |--< campaign_segments (n:m) >-- newsletter_segments
  |--< campaign_recipients (1:n)
  |--< email_events (1:n)

newsletter_templates
  |
  |--< template_blocks (1:n)

newsletter_workflows
  |
  |--< workflow_nodes (1:n)
  |--< workflow_states (1:n)

newsletter_sending_queues
  |
  |--< queue_items (1:n)

smtp_providers
  |
  |--< provider_accounts (1:n)
```

### 3.2 Detaillierte Tabellendefinitionen

#### Tabelle: `newsletter_subscribers`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|------------|-------------|
| `id` | UUID | PK, auto | Primaerschluessel |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL, Index | E-Mail-Adresse (gehasht fuer DSGVO-Export) |
| `email_hash` | VARCHAR(64) | UNIQUE, NOT NULL | SHA-256 Hash der E-Mail fuer Deduplizierung |
| `status` | ENUM | NOT NULL, Default: 'pending' | 'pending' \| 'confirmed' \| 'unsubscribed' \| 'bounced' \| 'complained' |
| `double_opt_in_token` | VARCHAR(64) | Nullable | Eindeutiger Token fuer DOI-Bestaetigung |
| `double_opt_in_sent_at` | TIMESTAMPTZ | Nullable | Zeitpunkt der DOI-Versendung |
| `double_opt_in_confirmed_at` | TIMESTAMPTZ | Nullable | Zeitpunkt der Bestaetigung |
| `double_opt_in_ip` | INET | Nullable | IP-Adresse beim Bestaetigen |
| `source` | VARCHAR(100) | NOT NULL, Default: 'website' | Quelle der Anmeldung (website, import, event_checkin, widget) |
| `source_detail` | VARCHAR(255) | Nullable | Detail zur Quelle (z.B. Spielort-Name, Event-ID) |
| `subscriber_hash` | VARCHAR(16) | NOT NULL, UNIQUE | Kurzer Hash fuer unsubscribe-Link |
| `created_at` | TIMESTAMPTZ | NOT NULL, Default: NOW() | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMPTZ | NOT NULL, Default: NOW() | Letzte Aktualisierung |
| ` gdpr_consent_given_at` | TIMESTAMPTZ | Nullable | Zeitpunkt der Einwilligung |
| `gdpr_consent_withdrawn_at` | TIMESTAMPTZ | Nullable | Zeitpunkt des Widerrufs |
| `data_deletion_scheduled_at` | TIMESTAMPTZ | Nullable | Geplante vollstaendige Loeschung |

**Indizes:**
- UNIQUE auf `email`
- UNIQUE auf `email_hash`
- UNIQUE auf `subscriber_hash`
- INDEX auf `status`
- INDEX auf `source`
- INDEX auf `created_at`

---

#### Tabelle: `newsletter_subscriber_profiles`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|------------|-------------|
| `id` | UUID | PK, auto | Primaerschluessel |
| `subscriber_id` | UUID | FK -> newsletter_subscribers.id, ON DELETE CASCADE | Verknuepfung zum Subscriber |
| `first_name` | VARCHAR(100) | Nullable | Vorname |
| `last_name` | VARCHAR(100) | Nullable | Nachname |
| `preferred_venue_id` | UUID | FK -> venues.id, Nullable | Bevorzugter Spielort |
| `city` | VARCHAR(100) | Nullable | Wohnort |
| `postal_code` | VARCHAR(20) | Nullable | PLZ |
| `birth_year` | INT | Nullable, CHECK > 1900 && < 2020 | Geburtsjahr (freiwillig) |
| `language` | VARCHAR(5) | Nullable, Default: 'de' | Sprachpraefenz (de, en, ...) |
| `created_at` | TIMESTAMPTZ | NOT NULL | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Aktualisierungszeitpunkt |

---

#### Tabelle: `newsletter_preferences`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|------------|-------------|
| `id` | UUID | PK, auto | Primaerschluessel |
| `subscriber_id` | UUID | FK -> newsletter_subscribers.id, ON DELETE CASCADE | Verknuepfung |
| `frequency` | ENUM | NOT NULL, Default: 'weekly' | 'immediate' \| 'weekly' \| 'biweekly' \| 'monthly' \| 'important_only' |
| `topic_concerts` | BOOLEAN | NOT NULL, Default: true | Konzerte |
| `topic_theater` | BOOLEAN | NOT NULL, Default: true | Theater |
| `topic_readings` | BOOLEAN | NOT NULL, Default: true | Lesungen |
| `topic_children` | BOOLEAN | NOT NULL, Default: false | Kinderprogramm |
| `topic_special` | BOOLEAN | NOT NULL, Default: true | Special Events |
| `topic_workshops` | BOOLEAN | NOT NULL, Default: true | Workshops |
| `preferred_venue_ids` | UUID[] | Nullable | Array bevorzugter Spielort-IDs |
| `receive_time` | TIME | Nullable | Bevorzugte Empfangszeit (wenn null: Smart-Sending) |
| `created_at` | TIMESTAMPTZ | NOT NULL | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Aktualisierungszeitpunkt |

---

#### Tabelle: `newsletter_tags`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|------------|-------------|
| `id` | UUID | PK, auto | Primaerschluessel |
| `organization_id` | UUID | FK -> organizations.id, NOT NULL | Zugehoerige Organisation |
| `name` | VARCHAR(100) | NOT NULL | Tag-Name |
| `color` | VARCHAR(7) | Nullable | Hex-Farbe fuer UI |
| `is_auto` | BOOLEAN | NOT NULL, Default: false | Automatisch durch System vergeben |
| `created_at` | TIMESTAMPTZ | NOT NULL | Erstellungszeitpunkt |

---

#### Tabelle: `newsletter_subscriber_tags`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|------------|-------------|
| `subscriber_id` | UUID | FK -> newsletter_subscribers.id, ON DELETE CASCADE | Subscriber |
| `tag_id` | UUID | FK -> newsletter_tags.id, ON DELETE CASCADE | Tag |
| `assigned_at` | TIMESTAMPTZ | NOT NULL, Default: NOW() | Zuweisungszeitpunkt |
| `assigned_by` | VARCHAR(50) | NOT NULL, Default: 'system' | 'system' \| 'user' \| 'workflow' |
| **PK** | (`subscriber_id`, `tag_id`) | Composite PK | |

---

#### Tabelle: `newsletter_segments`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|------------|-------------|
| `id` | UUID | PK, auto | Primaerschluessel |
| `organization_id` | UUID | FK -> organizations.id, NOT NULL | Zugehoerige Organisation |
| `name` | VARCHAR(150) | NOT NULL | Segment-Name |
| `description` | TEXT | Nullable | Beschreibung |
| `filter_config` | JSONB | NOT NULL | Segment-Filter-Definition als JSON |
| `subscriber_count` | INT | NOT NULL, Default: 0 | Cache: Anzahl Empfaenger |
| `last_calculated_at` | TIMESTAMPTZ | Nullable | Letzte Neuberechnung |
| `is_dynamic` | BOOLEAN | NOT NULL, Default: true | Automatisch aktualisieren |
| `created_by` | UUID | FK -> users.id, NOT NULL | Erstellt von |
| `created_at` | TIMESTAMPTZ | NOT NULL | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Aktualisierungszeitpunkt |

**Filter-Config JSON-Schema (Beispiel):**
```json
{
  "operator": "AND",
  "conditions": [
    { "field": "profile.preferred_venue_id", "op": "in", "value": ["uuid1", "uuid2"] },
    { "field": "engagement.score", "op": ">=", "value": 30 },
    { "field": "preferences.topic_concerts", "op": "=", "value": true },
    { "field": "subscriber.status", "op": "=", "value": "confirmed" },
    { "field": "events.last_opened_at", "op": ">=", "value": "2026-01-01" }
  ]
}
```

---

#### Tabelle: `newsletter_templates`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|------------|-------------|
| `id` | UUID | PK, auto | Primaerschluessel |
| `organization_id` | UUID | FK -> organizations.id, NOT NULL | Zugehoerige Organisation |
| `name` | VARCHAR(150) | NOT NULL | Template-Name |
| `description` | TEXT | Nullable | Beschreibung |
| `category` | ENUM | NOT NULL, Default: 'custom' | 'welcome' \| 'newsletter' \| 'event' \| 'reminder' \| 'custom' |
| `subject_line` | VARCHAR(255) | NOT NULL | Standard-Betreffzeile |
| `preheader_text` | VARCHAR(255) | Nullable | Preheader-Text |
| `from_name` | VARCHAR(100) | NOT NULL | Absender-Name |
| `from_email` | VARCHAR(255) | NOT NULL | Absender-E-Mail |
| `reply_to` | VARCHAR(255) | Nullable | Reply-To-Adresse |
| `content_json` | JSONB | NOT NULL | Editor-Inhalt als JSON-Struktur |
| `content_html` | TEXT | NOT NULL | Gerendertes HTML |
| `content_text` | TEXT | Nullable | Plaintext-Version |
| `thumbnail_url` | VARCHAR(500) | Nullable | Vorschaubild-URL |
| `is_default` | BOOLEAN | NOT NULL, Default: false | Standard-Template |
| `usage_count` | INT | NOT NULL, Default: 0 | Wie oft verwendet |
| `created_by` | UUID | FK -> users.id, NOT NULL | Erstellt von |
| `created_at` | TIMESTAMPTZ | NOT NULL | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Aktualisierungszeitpunkt |

---

#### Tabelle: `newsletter_campaigns`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|------------|-------------|
| `id` | UUID | PK, auto | Primaerschluessel |
| `organization_id` | UUID | FK -> organizations.id, NOT NULL | Zugehoerige Organisation |
| `template_id` | UUID | FK -> newsletter_templates.id, Nullable | Verwendetes Template |
| `name` | VARCHAR(200) | NOT NULL | Kampagnen-Name (intern) |
| `subject_line` | VARCHAR(255) | NOT NULL | Betreffzeile |
| `subject_line_b` | VARCHAR(255) | Nullable | Betreffzeile Variante B (A/B Test) |
| `preheader_text` | VARCHAR(255) | Nullable | Preheader-Text |
| `from_name` | VARCHAR(100) | NOT NULL | Absender-Name |
| `from_email` | VARCHAR(255) | NOT NULL | Absender-E-Mail |
| `reply_to` | VARCHAR(255) | Nullable | Reply-To |
| `content_html` | TEXT | NOT NULL | Finale HTML-Inhalt |
| `content_text` | TEXT | Nullable | Plaintext-Version |
| `content_json` | JSONB | NOT NULL | Editor-JSON fuer Nachbearbeitung |
| `status` | ENUM | NOT NULL, Default: 'draft' | 'draft' \| 'scheduled' \| 'sending' \| 'paused' \| 'sent' \| 'cancelled' |
| `send_mode` | ENUM | NOT NULL, Default: 'immediate' | 'immediate' \| 'scheduled' \| 'smart_send' |
| `scheduled_at` | TIMESTAMPTZ | Nullable | Geplanter Versandzeitpunkt |
| `ab_test_enabled` | BOOLEAN | NOT NULL, Default: false | A/B Test aktiv |
| `ab_test_config` | JSONB | Nullable | A/B Test Konfiguration (Split-Groesse, Gewinn-Metrik, Laufzeit) |
| `ab_test_winner` | ENUM | Nullable | 'A' \| 'B' \| 'undecided' |
| `ab_test_decided_at` | TIMESTAMPTZ | Nullable | Zeitpunkt der Entscheidung |
| `segment_ids` | UUID[] | Nullable | Angezielte Segment-IDs |
| `total_recipients` | INT | NOT NULL, Default: 0 | Gesamtanzahl Empfaenger |
| `sent_count` | INT | NOT NULL, Default: 0 | Versendet |
| `delivered_count` | INT | NOT NULL, Default: 0 | Zugestellt |
| `open_count` | INT | NOT NULL, Default: 0 | Oeffnungen (unique) |
| `click_count` | INT | NOT NULL, Default: 0 | Klicks (unique) |
| `bounce_count` | INT | NOT NULL, Default: 0 | Bounces |
| `unsubscribe_count` | INT | NOT NULL, Default: 0 | Abmeldungen |
| `complaint_count` | INT | NOT NULL, Default: 0 | Beschwerden |
| `total_opens` | INT | NOT NULL, Default: 0 | Gesamtoeffnungen (inkl. mehrfach) |
| `total_clicks` | INT | NOT NULL, Default: 0 | Gesamtklicks (inkl. mehrfach) |
| `created_by` | UUID | FK -> users.id, NOT NULL | Erstellt von |
| `created_at` | TIMESTAMPTZ | NOT NULL | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Aktualisierungszeitpunkt |
| `sent_at` | TIMESTAMPTZ | Nullable | Tatsaechlicher Versandzeitpunkt |
| `completed_at` | TIMESTAMPTZ | Nullable | Abschlusszeitpunkt |

---

#### Tabelle: `newsletter_campaign_recipients`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|------------|-------------|
| `id` | UUID | PK, auto | Primaerschluessel |
| `campaign_id` | UUID | FK -> newsletter_campaigns.id, ON DELETE CASCADE | Kampagne |
| `subscriber_id` | UUID | FK -> newsletter_subscribers.id, ON DELETE CASCADE | Subscriber |
| `variant` | CHAR(1) | NOT NULL, Default: 'A' | 'A' \| 'B' (A/B Test-Variante) |
| `status` | ENUM | NOT NULL, Default: 'queued' | 'queued' \| 'sending' \| 'sent' \| 'delivered' \| 'bounced' \| 'complained' \| 'failed' |
| `scheduled_send_at` | TIMESTAMPTZ | Nullable | Geplanter Versand (Smart Sending) |
| `sent_at` | TIMESTAMPTZ | Nullable | Tatsaechlicher Versand |
| `delivered_at` | TIMESTAMPTZ | Nullable | Zustellbestaetigung |
| `message_id` | VARCHAR(255) | Nullable | Externe Message-ID vom SMTP-Provider |
| `provider` | VARCHAR(50) | Nullable | Verwendeter SMTP-Provider |
| `ip_address` | INET | Nullable | Versand-IP |
| `created_at` | TIMESTAMPTZ | NOT NULL | Erstellungszeitpunkt |

**Indizes:**
- INDEX auf (`campaign_id`, `status`)
- INDEX auf (`campaign_id`, `variant`)
- INDEX auf (`subscriber_id`, `campaign_id`) UNIQUE
- INDEX auf `scheduled_send_at` WHERE status = 'queued'

---

#### Tabelle: `newsletter_email_events`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|------------|-------------|
| `id` | UUID | PK, auto | Primaerschluessel |
| `campaign_id` | UUID | FK -> newsletter_campaigns.id, ON DELETE CASCADE | Kampagne |
| `subscriber_id` | UUID | FK -> newsletter_subscribers.id, ON DELETE CASCADE | Subscriber |
| `recipient_id` | UUID | FK -> newsletter_campaign_recipients.id, Nullable | Einzelner Versand |
| `event_type` | ENUM | NOT NULL | 'open' \| 'click' \| 'bounce' \| 'complaint' \| 'unsubscribe' \| 'delivery' \| 'deferral' \| 'reject' \| 'send' |
| `event_subtype` | VARCHAR(50) | Nullable | 'hard' \| 'soft' fuer bounce; 'abuse' \| 'spam' \| 'fraud' fuer complaint |
| `ip_address` | INET | Nullable | IP des Empfaengers |
| `user_agent` | TEXT | Nullable | User-Agent String |
| `url` | TEXT | Nullable | Bei Click: angeklickte URL |
| `url_id` | UUID | Nullable | Referenz auf newsletter_links |
| `bounce_reason` | TEXT | Nullable | Bounce-Reason vom Provider |
| `bounce_diagnostic` | TEXT | Nullable | Diagnose-Code |
| `provider` | VARCHAR(50) | Nullable | Quell-Provider (sendgrid, brevo, rapidmail) |
| `provider_event_id` | VARCHAR(255) | Nullable | Externe Event-ID |
| `timestamp` | TIMESTAMPTZ | NOT NULL | Ereigniszeitpunkt |
| `created_at` | TIMESTAMPTZ | NOT NULL | Aufzeichnungszeitpunkt |

**Indizes:**
- INDEX auf (`campaign_id`, `event_type`)
- INDEX auf (`subscriber_id`, `event_type`)
- INDEX auf `timestamp`
- INDEX auf (`provider`, `provider_event_id`)

---

#### Tabelle: `newsletter_engagement_scores`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|------------|-------------|
| `id` | UUID | PK, auto | Primaerschluessel |
| `subscriber_id` | UUID | FK -> newsletter_subscribers.id, ON DELETE CASCADE | Subscriber |
| `overall_score` | INT | NOT NULL, Default: 50, CHECK 0-100 | Gesamtengagement (0-100) |
| `open_rate_30d` | DECIMAL(5,2) | NOT NULL, Default: 0 | 30-Tage Open Rate |
| `click_rate_30d` | DECIMAL(5,2) | NOT NULL, Default: 0 | 30-Tage Click Rate |
| `total_emails_sent` | INT | NOT NULL, Default: 0 | Gesamt versendet |
| `total_emails_opened` | INT | NOT NULL, Default: 0 | Gesamt geoeffnet |
| `total_emails_clicked` | INT | NOT NULL, Default: 0 | Gesamt geklickt |
| `first_opened_at` | TIMESTAMPTZ | Nullable | Erste Oeffnung |
| `last_opened_at` | TIMESTAMPTZ | Nullable | Letzte Oeffnung |
| `last_clicked_at` | TIMESTAMPTZ | Nullable | Letzter Klick |
| `preferred_hour` | INT | Nullable, CHECK 0-23 | Bevorzugte Oeffnungsstunde (fuer Smart Sending) |
| `preferred_day` | INT | Nullable, CHECK 0-6 | Bevorzugter Oeffnungstag (0=Sonntag) |
| `engagement_tier` | ENUM | NOT NULL, Default: 'new' | 'new' \| 'highly_engaged' \| 'engaged' \| 'at_risk' \| 'dormant' \| 'inactive' |
| `consecutive_non_opens` | INT | NOT NULL, Default: 0 | Aufeinanderfolgende Nicht-Oeffnungen |
| `calculated_at` | TIMESTAMPTZ | NOT NULL | Letzte Berechnung |

---

#### Tabelle: `newsletter_workflows`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|------------|-------------|
| `id` | UUID | PK, auto | Primaerschluessel |
| `organization_id` | UUID | FK -> organizations.id, NOT NULL | Organisation |
| `name` | VARCHAR(200) | NOT NULL | Workflow-Name |
| `description` | TEXT | Nullable | Beschreibung |
| `trigger_type` | ENUM | NOT NULL | 'subscribe' \| 'tag_added' \| 'date_time' \| 'event_published' \| 'engagement_level' \| 'manual' |
| `trigger_config` | JSONB | NOT NULL | Trigger-spezifische Konfiguration |
| `status` | ENUM | NOT NULL, Default: 'draft' | 'draft' \| 'active' \| 'paused' \| 'archived' |
| `entry_segment_id` | UUID | FK -> newsletter_segments.id, Nullable | Eingangs-Segment (optional) |
| `exit_on_unsubscribe` | BOOLEAN | NOT NULL, Default: true | Bei Abmeldung Workflow verlassen |
| `exit_on_goal` | BOOLEAN | NOT NULL, Default: false | Bei Ziel-Erreichnung beenden |
| `max_entries_per_subscriber` | INT | NOT NULL, Default: 1 | Max. Eintraege pro Subscriber |
| `created_by` | UUID | FK -> users.id, NOT NULL | Erstellt von |
| `created_at` | TIMESTAMPTZ | NOT NULL | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Aktualisierungszeitpunkt |
| `activated_at` | TIMESTAMPTZ | Nullable | Aktivierungszeitpunkt |

---

#### Tabelle: `newsletter_workflow_nodes`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|------------|-------------|
| `id` | UUID | PK, auto | Primaerschluessel |
| `workflow_id` | UUID | FK -> newsletter_workflows.id, ON DELETE CASCADE | Zugehoeriger Workflow |
| `node_type` | ENUM | NOT NULL | 'trigger' \| 'send_email' \| 'delay' \| 'condition' \| 'tag' \| 'split' \| 'end' |
| `node_key` | VARCHAR(50) | NOT NULL | Eindeutiger Key innerhalb des Workflows |
| `name` | VARCHAR(100) | NOT NULL | Anzeigename |
| `config` | JSONB | NOT NULL | Node-spezifische Konfiguration |
| `position_x` | INT | NOT NULL | X-Position im Editor |
| `position_y` | INT | NOT NULL | Y-Position im Editor |
| `next_node_key` | VARCHAR(50) | Nullable | Naechster Node (Default-Pfad) |
| `next_node_key_alt` | VARCHAR(50) | Nullable | Alternativer Pfad (bei Condition/Split) |
| `created_at` | TIMESTAMPTZ | NOT NULL | Erstellungszeitpunkt |

---

#### Tabelle: `newsletter_workflow_states`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|------------|-------------|
| `id` | UUID | PK, auto | Primaerschluessel |
| `workflow_id` | UUID | FK -> newsletter_workflows.id, ON DELETE CASCADE | Workflow |
| `subscriber_id` | UUID | FK -> newsletter_subscribers.id, ON DELETE CASCADE | Subscriber |
| `current_node_key` | VARCHAR(50) | NOT NULL | Aktueller Node |
| `status` | ENUM | NOT NULL, Default: 'active' | 'active' \| 'completed' \| 'exited' \| 'paused' \| 'error' |
| `entered_at` | TIMESTAMPTZ | NOT NULL | Eintrittszeitpunkt in aktuellen Node |
| `execute_at` | TIMESTAMPTZ | Nullable | Naechster geplanter Schritt |
| `context` | JSONB | Nullable | Workflow-Kontext-Daten |
| `created_at` | TIMESTAMPTZ | NOT NULL | Workflow-Start |
| `completed_at` | TIMESTAMPTZ | Nullable | Workflow-Ende |

---

#### Tabelle: `newsletter_links`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|------------|-------------|
| `id` | UUID | PK, auto | Primaerschluessel |
| `campaign_id` | UUID | FK -> newsletter_campaigns.id, ON DELETE CASCADE | Kampagne |
| `original_url` | TEXT | NOT NULL | Originale URL |
| `tracking_url` | TEXT | NOT NULL | Tracking-URL (mit Token) |
| `url_hash` | VARCHAR(32) | NOT NULL | MD5-Hash fuer Deduplizierung |
| `link_label` | VARCHAR(255) | Nullable | Beschriftung/Context |
| `click_count` | INT | NOT NULL, Default: 0 | Gesamtklicks |
| `unique_click_count` | INT | NOT NULL, Default: 0 | Unique Klicks |
| `created_at` | TIMESTAMPTZ | NOT NULL | Erstellungszeitpunkt |

---

#### Tabelle: `smtp_providers`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|------------|-------------|
| `id` | UUID | PK, auto | Primaerschluessel |
| `organization_id` | UUID | FK -> organizations.id, NOT NULL | Organisation |
| `name` | VARCHAR(50) | NOT NULL | Anzeigename |
| `provider_type` | ENUM | NOT NULL | 'brevo' \| 'rapidmail' \| 'sendgrid' \| 'postmark' \| 'mailgun' \| 'amazon_ses' \| 'smtp_custom' |
| `config` | JSONB | NOT NULL | Verschluesselte Provider-Konfig (API-Key, Endpoint) |
| `is_default` | BOOLEAN | NOT NULL, Default: false | Standard-Provider |
| `is_active` | BOOLEAN | NOT NULL, Default: true | Aktiv |
| `daily_send_limit` | INT | Nullable | Tageslimit |
| `hourly_send_limit` | INT | Nullable | Stundenlimit |
| `reputation_score` | INT | NOT NULL, Default: 100 | Aktueller Reputation-Score |
| `last_used_at` | TIMESTAMPTZ | Nullable | Letzte Nutzung |
| `created_at` | TIMESTAMPTZ | NOT NULL | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Aktualisierungszeitpunkt |

---

#### Tabelle: `newsletter_sending_queue`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|------------|-------------|
| `id` | UUID | PK, auto | Primaerschluessel |
| `campaign_id` | UUID | FK -> newsletter_campaigns.id, NOT NULL | Kampagne |
| `subscriber_id` | UUID | FK -> newsletter_subscribers.id, NOT NULL | Subscriber |
| `status` | ENUM | NOT NULL, Default: 'pending' | 'pending' \| 'scheduled' \| 'processing' \| 'sent' \| 'failed' \| 'bounced' |
| `scheduled_at` | TIMESTAMPTZ | Nullable | Geplanter Versandzeitpunkt |
| `processed_at` | TIMESTAMPTZ | Nullable | Verarbeitungszeitpunkt |
| `attempt_count` | INT | NOT NULL, Default: 0 | Anzahl Versuche |
| `last_error` | TEXT | Nullable | Letzte Fehlermeldung |
| `priority` | INT | NOT NULL, Default: 5 | Prioritaet (1=hoechste, 10=geringste) |
| `created_at` | TIMESTAMPTZ | NOT NULL | Erstellungszeitpunkt |

**Indizes:**
- INDEX auf (`status`, `scheduled_at`)
- INDEX auf (`status`, `priority`, `scheduled_at`)
- INDEX auf `campaign_id`

---

## 4. API-Endpunkte

### 4.1 Subscriber Management

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `POST` | `/api/v1/newsletter/subscribe` | Oeffentliche Anmeldung (erzeugt DOI-E-Mail) | Public |
| `GET` | `/api/v1/newsletter/confirm/{token}` | DOI-Bestaetigung | Public |
| `POST` | `/api/v1/newsletter/unsubscribe/{hash}` | One-Click-Unsubscribe | Public |
| `GET` | `/api/v1/newsletter/preferences/{hash}` | Preference Center anzeigen | Public |
| `PUT` | `/api/v1/newsletter/preferences/{hash}` | Praeferenzen aktualisieren | Public |
| `GET` | `/api/v1/newsletter/subscribers` | Liste aller Abonnenten (paginiert) | OAuth |
| `GET` | `/api/v1/newsletter/subscribers/{id}` | Einzelnen Abonnenten anzeigen | OAuth |
| `PUT` | `/api/v1/newsletter/subscribers/{id}` | Abonnenten aktualisieren | OAuth |
| `DELETE` | `/api/v1/newsletter/subscribers/{id}` | Abonnenten loeschen (DSGVO) | OAuth |
| `POST` | `/api/v1/newsletter/subscribers/import` | CSV-Import von Abonnenten | OAuth |
| `POST` | `/api/v1/newsletter/subscribers/{id}/tags` | Tags zuweisen | OAuth |
| `DELETE` | `/api/v1/newsletter/subscribers/{id}/tags/{tagId}` | Tag entfernen | OAuth |

### 4.2 Segment Management

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `GET` | `/api/v1/newsletter/segments` | Alle Segmente auflisten | OAuth |
| `POST` | `/api/v1/newsletter/segments` | Neues Segment erstellen | OAuth |
| `GET` | `/api/v1/newsletter/segments/{id}` | Segment-Details inkl. Filter | OAuth |
| `PUT` | `/api/v1/newsletter/segments/{id}` | Segment aktualisieren | OAuth |
| `DELETE` | `/api/v1/newsletter/segments/{id}` | Segment loeschen | OAuth |
| `POST` | `/api/v1/newsletter/segments/{id}/preview` | Empfaenger-Vorschau (Limit 100) | OAuth |
| `GET` | `/api/v1/newsletter/segments/{id}/count` | Aktuelle Empfaenger-Anzahl | OAuth |
| `POST` | `/api/v1/newsletter/segments/{id}/recalculate` | Segment neu berechnen | OAuth |

### 4.3 Campaign Management

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `GET` | `/api/v1/newsletter/campaigns` | Alle Kampagnen auflisten | OAuth |
| `POST` | `/api/v1/newsletter/campaigns` | Neue Kampagne erstellen | OAuth |
| `GET` | `/api/v1/newsletter/campaigns/{id}` | Kampagne inkl. Statistiken | OAuth |
| `PUT` | `/api/v1/newsletter/campaigns/{id}` | Kampagne aktualisieren (nur Draft) | OAuth |
| `DELETE` | `/api/v1/newsletter/campaigns/{id}` | Kampagne loeschen | OAuth |
| `POST` | `/api/v1/newsletter/campaigns/{id}/send` | Versand starten | OAuth |
| `POST` | `/api/v1/newsletter/campaigns/{id}/schedule` | Versand terminieren | OAuth |
| `POST` | `/api/v1/newsletter/campaigns/{id}/cancel` | Versand abbrechen | OAuth |
| `POST` | `/api/v1/newsletter/campaigns/{id}/pause` | Versand pausieren | OAuth |
| `POST` | `/api/v1/newsletter/campaigns/{id}/resume` | Versand fortsetzen | OAuth |
| `POST` | `/api/v1/newsletter/campaigns/{id}/duplicate` | Kampagne duplizieren | OAuth |
| `GET` | `/api/v1/newsletter/campaigns/{id}/stats` | Detaillierte Statistiken | OAuth |
| `GET` | `/api/v1/newsletter/campaigns/{id}/recipients` | Empfaenger-Liste | OAuth |
| `GET` | `/api/v1/newsletter/campaigns/{id}/clicks` | Klick-Heatmap-Daten | OAuth |

### 4.4 Template Management

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `GET` | `/api/v1/newsletter/templates` | Templates auflisten | OAuth |
| `POST` | `/api/v1/newsletter/templates` | Template erstellen | OAuth |
| `GET` | `/api/v1/newsletter/templates/{id}` | Template abrufen | OAuth |
| `PUT` | `/api/v1/newsletter/templates/{id}` | Template aktualisieren | OAuth |
| `DELETE` | `/api/v1/newsletter/templates/{id}` | Template loeschen | OAuth |
| `POST` | `/api/v1/newsletter/templates/{id}/render` | HTML-Vorschau rendern | OAuth |
| `POST` | `/api/v1/newsletter/templates/{id}/duplicate` | Template duplizieren | OAuth |
| `GET` | `/api/v1/newsletter/templates/categories` | Template-Kategorien | OAuth |

### 4.5 Workflow Automation

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `GET` | `/api/v1/newsletter/workflows` | Workflows auflisten | OAuth |
| `POST` | `/api/v1/newsletter/workflows` | Workflow erstellen | OAuth |
| `GET` | `/api/v1/newsletter/workflows/{id}` | Workflow inkl. Nodes | OAuth |
| `PUT` | `/api/v1/newsletter/workflows/{id}` | Workflow aktualisieren | OAuth |
| `DELETE` | `/api/v1/newsletter/workflows/{id}` | Workflow loeschen | OAuth |
| `POST` | `/api/v1/newsletter/workflows/{id}/activate` | Workflow aktivieren | OAuth |
| `POST` | `/api/v1/newsletter/workflows/{id}/pause` | Workflow pausieren | OAuth |
| `GET` | `/api/v1/newsletter/workflows/{id}/states` | Aktive Zustaende | OAuth |
| `GET` | `/api/v1/newsletter/workflows/{id}/stats` | Workflow-Statistiken | OAuth |

### 4.6 Analytics & Reporting

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `GET` | `/api/v1/newsletter/analytics/overview` | Uebersichts-Dashboard | OAuth |
| `GET` | `/api/v1/newsletter/analytics/trends` | Trend-Daten (Zeitreihe) | OAuth |
| `GET` | `/api/v1/newsletter/analytics/engagement` | Engagement-Verteilung | OAuth |
| `GET` | `/api/v1/newsletter/analytics/benchmarks` | Branchen-Vergleich | OAuth |
| `GET` | `/api/v1/newsletter/analytics/links/{campaignId}` | Link-Performance | OAuth |
| `GET` | `/api/v1/newsletter/analytics/geography` | Geografische Verteilung | OAuth |
| `GET` | `/api/v1/newsletter/analytics/export` | CSV-Export | OAuth |

### 4.7 Settings & Provider

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `GET` | `/api/v1/newsletter/settings` | Newsletter-Einstellungen | OAuth |
| `PUT` | `/api/v1/newsletter/settings` | Einstellungen aktualisieren | OAuth |
| `GET` | `/api/v1/newsletter/providers` | SMTP-Provider auflisten | OAuth |
| `POST` | `/api/v1/newsletter/providers` | SMTP-Provider hinzufuegen | OAuth |
| `PUT` | `/api/v1/newsletter/providers/{id}` | Provider aktualisieren | OAuth |
| `DELETE` | `/api/v1/newsletter/providers/{id}` | Provider entfernen | OAuth |
| `POST` | `/api/v1/newsletter/providers/{id}/test` | Verbindung testen | OAuth |
| `GET` | `/api/v1/newsletter/providers/{id}/reputation` | Reputation-Status | OAuth |

### 4.8 Webhook Endpoints (von SMTP-Providern gerufen)

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `POST` | `/webhooks/newsletter/sendgrid` | SendGrid Event Webhook | HMAC |
| `POST` | `/webhooks/newsletter/brevo` | Brevo (Sendinblue) Webhook | HMAC |
| `POST` | `/webhooks/newsletter/rapidmail` | Rapidmail Webhook | HMAC |
| `POST` | `/webhooks/newsletter/postmark` | Postmark Webhook | HMAC |
| `POST` | `/webhooks/newsletter/mailgun` | Mailgun Webhook | HMAC |
| `POST` | `/webhooks/newsletter/amazon-ses` | Amazon SES SNS | Signature |

---

## 5. UI-Komponenten

### 5.1 Uebersicht der React-Komponenten

```
// ============ PAGES ============
NewsletterDashboardPage        // Haupt-Dashboard fuer Newsletter
CampaignListPage               // Kampagnen-Uebersicht
CampaignEditorPage             // Kampagne erstellen/bearbeiten
CampaignStatsPage              // Kampagnen-Statistiken
SubscriberListPage             // Abonnenten-Verwaltung
SubscriberDetailPage           // Einzelner Abonnent
SegmentEditorPage              // Segment erstellen/bearbeiten
TemplateLibraryPage            // Template-Bibliothek
TemplateEditorPage             // Template-Editor (Drag & Drop)
WorkflowListPage               // Automation-Uebersicht
WorkflowBuilderPage            // Visueller Workflow-Builder
WorkflowStatsPage              // Workflow-Statistiken
AnalyticsPage                  // Analytics & Reporting
SettingsPage                   // Newsletter-Einstellungen
ProviderConfigPage             // SMTP-Provider Konfiguration

// ============ PUBLIC PAGES ============
PreferenceCenterPage           // Preference Center (oeffentlich)
UnsubscribePage                // Abmeldung bestaetigen
ConfirmSubscriptionPage        // DOI-Bestaetigung

// ============ SHARED COMPONENTS ============

// Campaign
CampaignCard                   // Kampagne als Karte in Listen
CampaignStatusBadge            // Status-Indikator
CampaignStatsSummary           // Mini-Statistiken
CampaignSendButton             // Versand-Button mit Dropdown
ABTestConfigPanel              // A/B Test Konfiguration

// Editor
EmailEditor                    // Haupt-Editor-Komponente
EditorToolbar                  // Werkzeugleiste
EditorCanvas                   // Arbeitsflaeche
EditorSidebar                  // Seitenleiste mit Bloecken
EditorBlockRegistry            // Block-Registrierung
EditorPreview                  // Vorschau (Desktop/Mobile)
UndoRedoProvider               // Undo/Redo Context

// Editor Blocks
TextBlock                      // Text-Block
ImageBlock                     // Bild-Block
ButtonBlock                    // Button-Block
DividerBlock                   // Trennlinie-Block
EventListBlock                 // Event-Liste (aus Veranstaltungskalender)
ArtistSpotlightBlock           // Kuenstler-Spotlight
SocialBlock                    // Social-Media-Links
VenueBlock                     // Spielort-Info
FooterBlock                    // Footer mit Impressum/DSGVO
HeaderBlock                    // Header mit Logo

// Segments
SegmentFilterBuilder           // Filter-Builder mit AND/OR
SegmentConditionRow            // Einzelne Bedingung
SegmentPreviewList             // Vorschau der Empfaenger
SegmentCountBadge              // Anzeige der Empfaengerzahl

// Subscribers
SubscriberTable                // Tabelle mit Sortierung/Filter
SubscriberStatusBadge          // Status-Indikator
SubscriberTagInput             // Tag-Eingabe
EngagementScoreBar             // Engagement-Score Visualisierung

// Workflows
WorkflowCanvas                 // Visueller Workflow-Builder
WorkflowNode                   // Einzelner Node im Workflow
WorkflowNodeConfig             // Node-Konfigurations-Panel
WorkflowConnectionLine         // Verbindungslinie zwischen Nodes
WorkflowTriggerSelector        // Trigger-Auswahl
WorkflowConditionBuilder       // Bedingungs-Builder

// Analytics
StatsCardsRow                  // Reihe von Statistik-Karten
ClickHeatmap                   // Klick-Heatmap Visualisierung
EngagementChart                // Engagement-Zeitreihe
OpenRateChart                  // Oeffnungsraten-Chart
GeographicMap                  // Geografische Verteilung
ComparisonBar                  // Vergleichs-Balken
ExportButton                   // CSV-Export

// Settings
ProviderCard                   // SMTP-Provider-Konfiguration
DomainWarmupPanel              // Domain-Warmup Status
ReputationGauge                // Reputation-Anzeige

// Shared
DateTimePicker                 // Datum/Zeit-Auswahl
SmartSendToggle                // Smart-Sending Toggle
RichTextEditor                 // Rich-Text-Eingabe
ImageUploader                  // Bild-Upload mit Crop
ColorPicker                    // Farbauswahl
LoadingSkeleton                // Lade-Skelett
EmptyState                     // Leer-Zustand
ConfirmDialog                  // Bestaetigungsdialog
```

### 5.2 Komponenten-Details

#### EmailEditor (Drag-and-Drop)

**State Management:** Zustand wird ueber Redux Toolkit verwaltet (wegen komplexer verschachtelter Zustände).

**Key Features:**
- Drag-and-Drop via `@dnd-kit/core` (moderne Alternative zu react-beautiful-dnd)
- Canvas-Groesse: 600px max-width (Email-Standard)
- Mobile/Tablet/Desktop-Vorschau umschaltbar
- Undo-Stack: Max. 50 Aktionen
- Autosave: Alle 30 Sekunden

**Block-Struktur (JSON):**
```typescript
interface EditorBlock {
  id: string;
  type: 'text' | 'image' | 'button' | 'divider' | 'event_list' | 'artist_spotlight' | 'social' | 'venue' | 'header' | 'footer';
  config: Record<string, any>;
  styles: {
    padding?: string;
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
}

interface TemplateContent {
  blocks: EditorBlock[];
  globalStyles: {
    fontFamily: string;
    backgroundColor: string;
    contentWidth: number;
  };
}
```

#### WorkflowCanvas

**Technologie:** Kombination aus `@xyflow/react` (React Flow) fuer den visuellen Node-Editor.

**Node-Typen:**
- Trigger (gruener Kreis)
- Send Email (blauer Rechteck)
- Delay (gelber Diamant)
- Condition (orangener Raute)
- Tag (lila Rechteck)
- End (roter Kreis)

**Interaktionen:**
- Nodes per Drag verschiebbar
- Verbindungen per Drag von Handle zu Handle
- Doppelklick oeffnet Konfigurations-Panel
- Validierung: Jeder Pfad muss zu einem End-Node fuehren

---

## 6. Integrationen

### 6.1 SMTP-Provider-Integrationen

| Provider | API | Webhook | Rate Limit | Besonderheiten |
|----------|-----|---------|-----------|---------------|
| **Brevo** (ehem. Sendinblue) | REST API v3 | Ja, Events | 300 emails/sec (Transactional) | Deutsche Niederlassung; DSGVO-konform; gute Free-Tier (300 Tage) |
| **rapidmail** | REST API | Ja, Events | 50 emails/sec | Deutscher Anbieter; sehr DSGVO-konform; spezialisiert auf DE-Markt |
| **SendGrid** | REST API v3 | Ja, Event Webhook | 600 emails/sec | Umfassende Dokumentation; Marketing Campaigns API |
| **Postmark** | REST API | Ja, Webhooks | 10 emails/sec (Burst: 500) | Transactional-Fokus; sehr zuverlaessige Zustellung |
| **Mailgun** | REST API | Ja, Events | Kein hartes Limit | Flexibel; gute EU-Server |
| **Amazon SES** | REST/SMTP | Ja, via SNS | 14 emails/sec (Sandbox) | Kostenguenstig; erfordert Warmup |

### 6.2 Integration: Brevo (primaerer Empfehlung)

**Verwendung:**
```typescript
// Brevo Provider Adapter
interface BrevoConfig {
  apiKey: string;
  endpoint?: string; // Default: https://api.brevo.com
}

// Senden einer E-Mail
async function sendViaBrevo(config: BrevoConfig, email: EmailPayload): Promise<SendResult> {
  const response = await fetch(`${config.endpoint}/v3/smtp/email`, {
    method: 'POST',
    headers: {
      'api-key': config.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: email.fromName, email: email.fromEmail },
      to: [{ email: email.toEmail }],
      subject: email.subject,
      htmlContent: email.htmlContent,
      textContent: email.textContent,
      replyTo: email.replyTo ? { email: email.replyTo } : undefined,
      headers: {
        'X-Campaign-ID': email.campaignId,
        'X-Subscriber-ID': email.subscriberId,
      },
    }),
  });
  return await response.json();
}
```

### 6.3 Webhook-Verarbeitung

**Webhook-Handler-Architektur:**
```
SMTP-Provider Webhook
    |
    v
Webhook Receiver (API Route)
    |
    v
Webhook Parser (Provider-spezifisch)
    |
    v
Event Normalizer (Einheitliches Format)
    |
    v
Event Processor
    |---> Bounce Handler
    |---> Open Tracker
    |---> Click Tracker
    |---> Complaint Handler
    |---> Delivery Tracker
    |
    v
Database Writer (newsletter_email_events)
    |
    v
Side Effects
    |---> Engagement Score Update (Queue)
    |---> Campaign Stats Update (Cache)
    |---> Realtime Notifications (WebSocket)
```

**Normalisiertes Event-Format:**
```typescript
interface NormalizedEmailEvent {
  provider: string;           // 'brevo' | 'sendgrid' | ...
  providerEventId: string;
  eventType: 'send' | 'delivery' | 'open' | 'click' | 'bounce' | 'complaint' | 'deferral' | 'reject';
  eventSubtype?: string;
  campaignId?: string;        // Aus X-Campaign-ID Header
  subscriberId?: string;      // Aus X-Subscriber-ID Header
  messageId: string;
  email: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  url?: string;               // Bei click
  urlId?: string;
  bounceReason?: string;      // Bei bounce
  bounceDiagnostic?: string;  // Bei bounce
}
```

### 6.4 Webhook-Sicherheit

| Provider | Authentifizierung | Implementierung |
|----------|------------------|----------------|
| SendGrid | HMAC-SHA256 | `X-Twilio-Email-Event-Webhook-Signature` Header |
| Brevo | IP-Allowlist + API-Key | Pruefung der `brevo` IP-Ranges |
| Postmark | Basic Auth | Username/Password im Webhook-Endpoint |
| Mailgun | HMAC-SHA256 | `signature` Parameter mit Timestamp |
| Amazon SES | SNS Signature | SNS Topic Subscription + Signature Verification |

### 6.5 Integration: Veranstaltungskalender

**Datenfluss:**
```
Veranstaltungskalender (Modul 1)
    |
    v
EventListBlock (im Editor)
    |
    v
Automatische Befuellung mit:
  - Event-Titel, Datum, Uhrzeit
  - Spielort-Name
  - Kuenstler-Name + Bild
  - Ticket-Link
  - Event-Beschreibung (gekuerzt)
```

**API fuer Event-Block:**
```typescript
// GET /api/v1/events/upcoming?venues[]=uuid1&venues[]=uuid2&limit=10&from=2026-08-01
interface EventListBlockConfig {
  venues?: string[];          // Filter nach Spielorten
  genres?: string[];          // Filter nach Genre
  limit: number;              // Max. Anzahl Events
  fromDate: string;           // Ab Datum
  toDate?: string;            // Bis Datum
  layout: 'list' | 'cards' | 'compact';
  showImages: boolean;
  showDescription: boolean;
  showTicketButton: boolean;
  sortBy: 'date' | 'popularity';
}
```

---

## 7. Technische Details

### 7.1 Tech Stack

| Schicht | Technologie | Begruendung |
|---------|-------------|-------------|
| **Frontend Editor** | `@dnd-kit/core` + `@xyflow/react` | Moderne DnD-Library; React Flow fuer Workflows |
| **Template Rendering** | `MJML` + Handlebars | MJML fuer responsive Email-HTML; Handlebars fuer Variablen |
| **Queue-Verarbeitung** | `BullMQ` (Redis-basiert) | Zuverlaessig; Retry-Logik; Rate-Limiting; Job-Priorisierung |
| **Smart Sending** | `node-cron` + Redis Sorted Sets | Zeitgesteuerte Verarbeitung mit Priorisierung |
| **Email Parsing** | `mailparser` + `linkifyjs` | URL-Extraktion fuer Click-Tracking |
| **Webhook-Sicherheit** | `crypto` (Node.js built-in) | HMAC-Pruefung |
| **Analytics DB** | ClickHouse oder TimescaleDB | Time-Series fuer Event-Daten (hoher Schreib-Throughput) |
| **Rate Limiting** | `rate-limiter-flexible` | Token-Bucket fuer SMTP-Provider-Limits |
| **Image Processing** | `Sharp` | Bild-Optimierung fuer Newsletter-Bilder |
| **CSV Import** | `papaparse` | Client-seitiges CSV-Parsing |

### 7.2 Queue-Verarbeitung (BullMQ)

#### Job-Typen

```typescript
// 1. DOI-E-Mail Versand
interface SendDOIEmailJob {
  type: 'send_doi_email';
  subscriberId: string;
  email: string;
  token: string;
}

// 2. Newsletter Versand
interface SendNewsletterJob {
  type: 'send_newsletter';
  campaignId: string;
  recipientId: string;
  subscriberId: string;
  scheduledAt?: Date;  // Fuer Smart Sending
  priority: number;
}

// 3. Engagement-Score Aktualisierung
interface UpdateEngagementJob {
  type: 'update_engagement';
  subscriberId: string;
  campaignId: string;
  eventType: 'open' | 'click';
}

// 4. Segment-Neuberechnung
interface RecalculateSegmentJob {
  type: 'recalculate_segment';
  segmentId: string;
}

// 5. Workflow-Step
interface WorkflowStepJob {
  type: 'workflow_step';
  workflowId: string;
  subscriberId: string;
  currentNodeKey: string;
  context: Record<string, any>;
}
```

#### Queue-Architektur

```
Redis
  |
  |-- Queue: "newsletter:doi"           (1 Worker)
  |-- Queue: "newsletter:send"          (3-5 Workers)
  |-- Queue: "newsletter:engagement"    (2 Workers)
  |-- Queue: "newsletter:segments"      (1 Worker)
  |-- Queue: "newsletter:workflows"     (2 Workers)
  |-- Queue: "newsletter:imports"       (1 Worker)
  |
  |-- Delayed Queue fuer Smart Sending
  |-- Repeatable Jobs fuer taegliche Segmente
```

**Rate-Limiting pro Provider:**
```typescript
// BullMQ Rate-Limiter pro SMTP-Provider
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'smtp_limit:brevo',
  points: 300,        // 300 requests
  duration: 1,        // per second
});

// Vor jedem Versand: Token pruefen
await rateLimiter.consume('brevo', 1);
```

### 7.3 Template-Rendering-Pipeline

```
Template JSON (Editor)
    |
    v
Block Renderer (React-Komponenten)
    |
    v
MJML Generierung
    |
    v
MJML zu HTML Kompilierung
    |
    v
Handlebars Variablen-Ersetzung
    |
    v
Link-Wrapping (Tracking)
    |
    v
Open-Pixel Injection
    |
    v
Minifizierung
    |
    v
Finale HTML-E-Mail
```

**Beispiel: Event-Block Rendering**
```typescript
// EventListBlock Renderer
function renderEventListBlock(block: EditorBlock): string {
  const { events, layout, showImages, showTicketButton } = block.config;
  
  if (layout === 'cards') {
    return `
      <mj-section>
        ${events.map(event => `
          <mj-column width="50%">
            ${showImages ? `<mj-image src="${event.imageUrl}" alt="${event.title}" />` : ''}
            <mj-text font-size="18px" font-weight="bold">${event.title}</mj-text>
            <mj-text font-size="14px">${event.date} | ${event.venueName}</mj-text>
            ${showTicketButton ? `<mj-button href="${event.ticketUrl}">Tickets</mj-button>` : ''}
          </mj-column>
        `).join('')}
      </mj-section>
    `;
  }
  // ... weitere Layouts
}
```

**Handlebars Variablen:**
```
{{subscriber.firstName}}              -> Vorname oder Fallback
{{subscriber.email}}                  -> E-Mail
{{preferences.preferredVenueName}}    -> Bevorzugter Spielort
{{campaign.unsubscribeUrl}}           -> Unsubscribe-Link
{{campaign.preferencesUrl}}           -> Preference-Center-Link
{{campaign.webVersionUrl}}            -> Web-Version
{{organization.name}}                 -> Veranstalter-Name
{{#if subscriber.firstName}}Hallo {{subscriber.firstName}}{{else}}Hallo{{/if}}
```

### 7.4 Open-Pixel & Click-Tracking

#### Open-Tracking Pixel

```html
<!-- 1x1 transparentes GIF, Base64-kodiert -->
<img src="https://app.kleinkunst-dashboard.de/t/o/{subscriber_hash}/{campaign_id}.gif" 
     width="1" height="1" alt="" />
```

**Implementierung:**
```typescript
// GET /t/o/:hash/:campaignId.gif
async function trackOpen(req: Request, res: Response) {
  const { hash, campaignId } = req.params;
  
  // 1. Transparentes 1x1 GIF zurueckgeben (sofort, nicht blockieren)
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
  
  // 2. Event asynchron verarbeiten
  const subscriber = await getSubscriberByHash(hash);
  if (subscriber) {
    await processEvent({
      eventType: 'open',
      campaignId,
      subscriberId: subscriber.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date(),
    });
  }
}
```

**Apple Mail Privacy Protection (MPP) Umgang:**
- Open-Pixel wird bei MPP immer geladen (unzuverlaessig)
- Primaermetrik: **Click-Through-Rate** statt Open Rate
- Sekundaermetrik: Reply-Rate (wenn implementiert)
- MPP-Erkennung: User-Agent Pattern `Proxy/1.0` oder IP aus Apple-Proxy-Ranges
- Statistische Korrektur: MPP-Opens werden gesondert markiert

#### Click-Tracking

```typescript
// Link-Wrapping vor Versand
function wrapLinks(html: string, campaignId: string, subscriberId: string): string {
  const dom = new JSDOM(html);
  const links = dom.window.document.querySelectorAll('a[href]');
  
  links.forEach(link => {
    const originalUrl = link.getAttribute('href');
    if (shouldTrackUrl(originalUrl)) {
      const trackingUrl = generateTrackingUrl({
        originalUrl,
        campaignId,
        subscriberId,
      });
      link.setAttribute('href', trackingUrl);
    }
  });
  
  return dom.window.document.body.innerHTML;
}

// Generierung: https://app.kleinkunst-dashboard.de/t/c/{token}
// Token enthaelt verschluesselte: campaignId, subscriberId, urlId
```

### 7.5 A/B-Testing Algorithmus

```typescript
interface ABTestConfig {
  testPercentage: number;       // z.B. 40% (20% A, 20% B)
  winningMetric: 'open_rate' | 'click_rate'; // Gewinn-Metrik
  minimumRunTime: number;       // Mindestlaufzeit in Minuten (z.B. 120)
  minimumSampleSize: number;    // Mindest-Empfaenger pro Variante (z.B. 100)
  confidenceLevel: number;      // z.B. 0.95 (95% Konfidenz)
}

// A/B-Test Entscheidungslogik
function determineWinner(
  variantA: { sent: number; opens: number; clicks: number },
  variantB: { sent: number; opens: number; clicks: number },
  config: ABTestConfig
): 'A' | 'B' | 'undecided' {
  
  // Mindest-Stichprobengroesse pruefen
  if (variantA.sent < config.minimumSampleSize || variantB.sent < config.minimumSampleSize) {
    return 'undecided';
  }
  
  // Metriken berechnen
  const getMetric = (v: typeof variantA) => 
    config.winningMetric === 'open_rate' 
      ? v.opens / v.sent 
      : v.clicks / v.sent;
  
  const rateA = getMetric(variantA);
  const rateB = getMetric(variantB);
  
  // Z-Test fuer Proportionen
  const pooledP = (variantA.opens + variantB.opens) / (variantA.sent + variantB.sent);
  const se = Math.sqrt(pooledP * (1 - pooledP) * (1/variantA.sent + 1/variantB.sent));
  const z = (rateA - rateB) / se;
  
  // Kritischer Wert fuer 95% Konfidenz: 1.96
  const criticalValue = 1.96;
  
  if (Math.abs(z) < criticalValue) {
    return 'undecided'; // Nicht signifikant
  }
  
  return rateA > rateB ? 'A' : 'B';
}
```

**A/B-Test Ablauf:**
```
Kampagne erstellen mit A/B Test
    |
    v
Empfaenger aufteilen:
  - 20% -> Variante A
  - 20% -> Variante B
  - 60% -> Warteschlange (Winner)
    |
    v
Varianten A + B sofort senden
    |
    v
Warte minimale Laufzeit (z.B. 2h)
    |
    v
Pruefe Signifikanz alle 15 Minuten
    |
    v
Bei Signifikanz -> Sende Winner an Rest 60%
Bei Timeout (z.B. 6h) -> Sende bessere Variante an Rest
```

---

## 8. Sendezeit-Optimierung (Smart Sending)

### 8.1 Algorithmus-Details

#### Phase 1: Datensammlung (Initial)

Fuer jeden Subscriber werden Oeffnungsereignisse gesammelt:

```typescript
interface OpeningPattern {
  subscriberId: string;
  opens: Array<{
    timestamp: Date;
    hour: number;      // 0-23
    dayOfWeek: number; // 0-6 (0=Sonntag)
    month: number;     // 1-12
  }>;
}
```

#### Phase 2: Pattern-Analyse

```typescript
function calculateOptimalSendTime(opens: OpeningEvent[]): OptimalTime {
  // Mindestanzahl fuer statistische Signifikanz
  if (opens.length < 3) {
    return getFallbackTime(); // Branchen-Default
  }
  
  // 1. Stundengewichtung berechnen (gewichtet: juengere Oeffnungen zaehlen mehr)
  const hourWeights = new Array(24).fill(0);
  const dayWeights = new Array(7).fill(0);
  
  opens.forEach((open, index) => {
    const recencyWeight = Math.exp(-0.1 * (opens.length - index)); // Exponentielle Abnahme
    hourWeights[open.hour] += recencyWeight;
    dayWeights[open.dayOfWeek] += recencyWeight;
  });
  
  // 2. Beste Stunde finden (mit Glättung)
  const smoothedHours = movingAverage(hourWeights, 3); // 3-Stunden-Fenster
  const bestHour = argmax(smoothedHours);
  
  // 3. Bester Tag finden
  const bestDay = argmax(dayWeights);
  
  // 4. Konfidenz berechnen (wie stark ist das Maximum ausgepraegt?)
  const confidence = calculateEntropy(hourWeights); // Niedrige Entropie = hohe Konfidenz
  
  return {
    optimalHour: bestHour,
    optimalDayOfWeek: bestDay,
    confidence, // 0-1, wobei 1 = sehr zuverlaessiges Muster
    usesFallback: false,
  };
}

// Fallback fuer neue Subscriber
function getFallbackTime(): OptimalTime {
  // Branchenwerte fuer Kulturveranstalter:
  // Montag oder Dienstag, 21:00 Uhr (Peak-Click-Time)
  return {
    optimalHour: 21,
    optimalDayOfWeek: 2, // Dienstag
    confidence: 0,
    usesFallback: true,
  };
}
```

#### Phase 3: Sendezeit-Berechnung fuer Kampagne

```typescript
function calculateSendSchedule(
  campaign: Campaign,
  recipients: Subscriber[]
): ScheduledSend[] {
  
  const schedule: ScheduledSend[] = [];
  const campaignSendDate = campaign.scheduledAt || new Date();
  
  for (const recipient of recipients) {
    let sendTime: Date;
    
    if (campaign.sendMode === 'smart_send') {
      const optimal = recipient.engagement.optimalSendTime;
      
      if (optimal && !optimal.usesFallback) {
        // Individuelle optimale Zeit
        sendTime = getNextOccurrence(campaignSendDate, optimal.optimalDayOfWeek, optimal.optimalHour);
      } else {
        // Fallback: Branchen-Optimum
        sendTime = getNextOccurrence(campaignSendDate, 2, 21); // Di, 21h
      }
    } else if (campaign.sendMode === 'scheduled') {
      sendTime = campaign.scheduledAt!;
    } else {
      sendTime = new Date(); // Sofort
    }
    
    // Maximal 7 Tage in die Zukunft (fuer Smart Send)
    const maxDate = addDays(campaignSendDate, 7);
    if (sendTime > maxDate) {
      sendTime = maxDate;
    }
    
    schedule.push({
      recipientId: recipient.id,
      subscriberId: recipient.subscriberId,
      scheduledAt: sendTime,
    });
  }
  
  return schedule;
}
```

#### Phase 4: Batch-Gruppierung

```typescript
function groupIntoBatches(schedule: ScheduledSend[]): SendBatch[] {
  // Gruppiere in 15-Minuten-Fenster fuer effiziente Verarbeitung
  const timeWindows = groupBy(schedule, s => {
    const date = new Date(s.scheduledAt);
    date.setMinutes(Math.floor(date.getMinutes() / 15) * 15, 0, 0);
    return date.toISOString();
  });
  
  return Object.entries(timeWindows).map(([windowTime, items]) => ({
    scheduledAt: new Date(windowTime),
    recipients: items,
    estimatedDuration: items.length / RATE_LIMIT_PER_SECOND,
  }));
}
```

### 8.2 Smart-Sending UI

```
+------------------------------------------+
|  Versandzeitpunkt                         |
|                                          |
|  (o) Sofort versenden                     |
|                                          |
|  ( ) Zum geplanten Zeitpunkt:             |
|      [Datum] [Uhrzeit]                    |
|                                          |
|  (*) Smart Sending (empfohlen)            |
|      Individuelle optimale Sendezeit      |
|      pro Empfaenger                       |
|                                          |
|      [?] 847 Empfaenger haben genuegend   |
|          Daten fuer Optimierung           |
|      [?] 153 Empfaenger erhalten zum      |
|          Branchen-Optimum (Di, 21h)       |
|                                          |
|      Voraussichtlicher Versandzeitraum:   |
|      Di, 15.08. 18:00 - Mi, 16.08. 22:00 |
+------------------------------------------+
```

### 8.3 Algorithmus-Zusammenfassung

```
+------------------+    +------------------+    +------------------+
|  Oeffnungs-      |    |  Pattern-        |    |  Optimalzeit-    |
|  Daten sammeln   | -> |  Analyse         | -> |  Berechnung      |
|  (pro Subscriber)|    |  (Stunde/Tag)    |    |  (nächster       |
|                  |    |                  |    |   passender      |
|  Mindestens      |    |  Gewichtung:     |    |   Zeitpunkt)     |
|  3 Oeffnungen    |    |  Juengere >      |    |                  |
|  erforderlich    |    |  Aeltere         |    |  Max. 7 Tage     |
|                  |    |                  |    |  in Zukunft      |
+------------------+    +------------------+    +------------------+
                                                        |
                              +-------------------------+
                              |
                              v
+------------------+    +------------------+    +------------------+
|  Batches in      |    |  BullMQ          |    |  SMTP-           |
|  15-Min-Fenster  | -> |  Delayed Queue   | -> |  Versand         |
|  gruppieren      |    |  (Redis)         |    |                  |
|                  |    |                  |    |  Rate-Limited    |
|  ~50-200/Queue   |    |  Priorisiert     |    |  pro Provider    |
+------------------+    +------------------+    +------------------+
```

---

## 9. Engagement-Score-Algorithmus

### 9.1 Berechnungsformel

```typescript
function calculateEngagementScore(subscriber: Subscriber): EngagementScore {
  const events = subscriber.emailEvents;
  const now = new Date();
  
  // 1. Zeitfenster-Definitionen
  const days7 = subDays(now, 7);
  const days30 = subDays(now, 30);
  const days90 = subDays(now, 90);
  
  // 2. Metriken pro Zeitraum
  const sent7d = countSent(events, days7, now);
  const sent30d = countSent(events, days30, now);
  const sent90d = countSent(events, days90, now);
  
  const opened7d = countUniqueOpens(events, days7, now);
  const opened30d = countUniqueOpens(events, days30, now);
  const clicked30d = countUniqueClicks(events, days30, now);
  
  // 3. Gewichtete Scores
  const recencyScore = Math.min(sent7d > 0 ? (opened7d / sent7d) * 40 : 0, 40);
  const frequencyScore = Math.min(sent30d > 0 ? (opened30d / sent30d) * 35 : 0, 35);
  const clickScore = Math.min(sent30d > 0 ? (clicked30d / sent30d) * 25 : 0, 25);
  
  const overallScore = Math.round(recencyScore + frequencyScore + clickScore);
  
  // 4. Engagement-Tier
  const tier = determineTier(overallScore, subscriber.consecutiveNonOpens);
  
  // 5. Bevorzugte Sendezeit
  const { preferredHour, preferredDay } = analyzeOpenTimes(events);
  
  return {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    openRate30d: sent30d > 0 ? round(opened30d / sent30d, 4) : 0,
    clickRate30d: sent30d > 0 ? round(clicked30d / sent30d, 4) : 0,
    totalEmailsSent: events.filter(e => e.type === 'send').length,
    totalEmailsOpened: events.filter(e => e.type === 'open').length,
    totalEmailsClicked: events.filter(e => e.type === 'click').length,
    lastOpenedAt: getLastEventDate(events, 'open'),
    lastClickedAt: getLastEventDate(events, 'click'),
    preferredHour,
    preferredDay,
    engagementTier: tier,
    consecutiveNonOpens: subscriber.consecutiveNonOpens,
    calculatedAt: now,
  };
}

function determineTier(score: number, consecutiveNonOpens: number): EngagementTier {
  if (consecutiveNonOpens >= 10) return 'inactive';
  if (consecutiveNonOpens >= 5) return 'dormant';
  if (score >= 70) return 'highly_engaged';
  if (score >= 40) return 'engaged';
  if (score >= 20) return 'at_risk';
  return 'new'; // Weniger als 3 E-Mails erhalten
}
```

### 9.2 Engagement-Tier-Definitionen

| Tier | Score | Beschreibung | Automatische Aktion |
|------|-------|-------------|-------------------|
| **new** | < 3 E-Mails | Neuer Abonnent | Willkommens-Workflow starten |
| **highly_engaged** | 70-100 | Sehr aktiv (oft oeffnen & klicken) | Premium-Content, Early-Access |
| **engaged** | 40-69 | Regelmaessig aktiv | Standard-Newsletter |
| **at_risk** | 20-39 | Weniger aktiv werdend | Re-Engagement-Kampagne anbieten |
| **dormant** | 0-19, 5x nicht geoeffnet | Inaktiv | Letzte-Chance-E-Mail, dann Reduzierung |
| **inactive** | 10x nicht geoeffnet | Sehr inaktiv | Kein automatischer Versand mehr |

---

## 10. Automation-Workflows

### 10.1 Vordefinierte Workflows

#### Workflow 1: Willkommens-Serie

```
[Trigger: Subscribe]
    |
    v
[Send Email: Willkommen]
    | Subject: "Willkommen bei [Veranstalter]!"
    |
    v
[Delay: 3 Tage]
    |
    v
[Condition: Hat E-Mail 1 geoeffnet?]
    |-- Ja --> [Send Email: "Unsere Spielorte"]
    |-- Nein -> [Send Email: "Hast du uns verpasst?"]
    |
    v
[Delay: 7 Tage]
    |
    v
[Condition: Hat Link geklickt?]
    |-- Ja --> [Send Email: "Naechste Events" + Event-Liste]
    |-- Nein -> [Send Email: "Bleib informiert"]
    |
    v
[Tag: "welcome_complete"]
    |
    v
[End]
```

#### Workflow 2: Event-Reminder

```
[Trigger: Event published]
    |
    v
[Condition: Subscriber interessiert an Spielort?]
    |-- Ja --> [Delay: 7 Tage vor Event]
    |             |
    |             v
    |         [Send Email: "In 1 Woche: [Event]"]
    |             |
    |             v
    |         [Delay: 1 Tag vor Event]
    |             |
    |             v
    |         [Send Email: "Morgen: [Event]"]
    |             |
    |             v
    |         [Tag: "event_reminder_sent"]
    |-- Nein -> [End]
```

#### Workflow 3: Re-Engagement

```
[Trigger: Engagement-Tier = 'at_risk']
    |
    v
[Delay: 1 Tag]
    |
    v
[Send Email: "Wir vermissen dich!"]
    | Subject: "Hast du etwas verpasst?"
    | Inhalt: Highlights der letzten Events, Preference-Center-Link
    |
    v
[Delay: 7 Tage]
    |
    v
[Condition: Hat Re-Engagement-E-Mail geoeffnet?]
    |-- Ja --> [Tag: "re_engaged"] --> [End]
    |-- Nein -> [Delay: 14 Tage]
    |             |
    |             v
    |         [Send Email: "Letzte Chance: Bleib dabei?"]
    |             |
    |             v
    |         [Delay: 7 Tage]
    |             |
    |             v
    |         [Condition: Hat geklickt?]
    |             |-- Ja --> [Tag: "re_engaged"] --> [End]
    |             |-- Nein -> [Tag: "dormant"] --> [End]
```

### 10.2 Workflow-Engine

```typescript
// Workflow-Engine: Verarbeitet einen Schritt
async function processWorkflowStep(
  state: WorkflowState,
  workflow: Workflow
): Promise<void> {
  const currentNode = workflow.nodes.find(n => n.node_key === state.currentNodeKey);
  if (!currentNode) {
    await markWorkflowError(state, 'Node not found');
    return;
  }
  
  switch (currentNode.node_type) {
    case 'send_email':
      await handleSendEmailNode(state, currentNode);
      break;
    case 'delay':
      await handleDelayNode(state, currentNode);
      break;
    case 'condition':
      await handleConditionNode(state, currentNode, workflow);
      break;
    case 'tag':
      await handleTagNode(state, currentNode);
      break;
    case 'split':
      await handleSplitNode(state, currentNode, workflow);
      break;
    case 'end':
      await markWorkflowCompleted(state);
      return;
  }
}

// Delay-Node: Scheduled Job in BullMQ
async function handleDelayNode(state: WorkflowState, node: WorkflowNode): Promise<void> {
  const delayHours = node.config.hours || 0;
  const delayDays = node.config.days || 0;
  const totalMs = (delayHours * 3600 + delayDays * 86400) * 1000;
  
  const nextNode = node.next_node_key;
  const executeAt = new Date(Date.now() + totalMs);
  
  await workflowQueue.add('workflow_step', {
    workflowId: state.workflowId,
    subscriberId: state.subscriberId,
    currentNodeKey: nextNode,
  }, {
    delay: totalMs,
    jobId: `${state.workflowId}:${state.subscriberId}:${nextNode}`,
  });
  
  await updateWorkflowState(state, {
    currentNodeKey: nextNode,
    executeAt,
  });
}

// Condition-Node
async function handleConditionNode(
  state: WorkflowState, 
  node: WorkflowNode,
  workflow: Workflow
): Promise<void> {
  const condition = node.config as WorkflowCondition;
  let result = false;
  
  switch (condition.type) {
    case 'has_opened':
      result = await checkHasOpened(state.subscriberId, condition.campaignId);
      break;
    case 'has_clicked':
      result = await checkHasClicked(state.subscriberId, condition.campaignId, condition.url);
      break;
    case 'has_not_opened':
      result = !(await checkHasOpened(state.subscriberId, condition.campaignId));
      break;
    case 'is_in_segment':
      result = await checkIsInSegment(state.subscriberId, condition.segmentId);
      break;
    case 'engagement_level':
      result = await checkEngagementLevel(state.subscriberId, condition.tier);
      break;
  }
  
  const nextNode = result ? node.next_node_key : node.next_node_key_alt;
  
  await workflowQueue.add('workflow_step', {
    workflowId: state.workflowId,
    subscriberId: state.subscriberId,
    currentNodeKey: nextNode,
  });
}
```

---

## 11. DSGVO-Konformitaet & Datenschutz

### 11.1 Double-Opt-In Prozess

```
[Anmeldeformular]
    |
    v
[POST /api/v1/newsletter/subscribe]
    |-> Subscriber mit status='pending' erstellen
    |-> DOI-Token generieren (64-byte random, expires 72h)
    |-> Consent-Record erstellen (Zeitstempel, IP, Quelle)
    |
    v
[DOI-E-Mail versenden]
    |-> Template: "Bitte bestaetige deine Anmeldung"
    |-> Link: /confirm/{token}
    |
    v
[Empfaenger klickt Link]
    |
    v
[GET /api/v1/newsletter/confirm/{token}]
    |-> Token validieren (nicht expired?)
    |-> Status auf 'confirmed' setzen
    |-> double_opt_in_confirmed_at setzen
    |-> double_opt_in_ip speichern
    |-> Willkommens-Workflow triggern
    |-> Dankesseite anzeigen
```

### 11.2 Datenschutz-Massnahmen

| Anforderung | Umsetzung |
|-------------|-----------|
| **Art. 6(1)(a) Rechtsgrundlage** | Explizite Einwilligung durch DOI |
| **Art. 7 Nachweisbarkeit** | Consent-Record mit Zeitstempel, IP, Quelle |
| **Art. 17 Recht auf Vergessenwerden** | Vollstaendige Loeschung nach 30 Tagen nach Unsubscribe |
| **Art. 15 Auskunft** | Export aller Daten pro Subscriber als JSON/CSV |
| **Art. 20 Datenuebertragbarkeit** | CSV-Export mit allen Profil- und Event-Daten |
| **One-Click-Unsubscribe** | RFC 8058 konformer List-Unsubscribe-Header |
| **Pseudonymisierung** | Subscriber-Hash statt E-Mail in Tracking-URLs |
| **Aufbewahrungsfrist** | E-Mail-Adresse wird nach Unsubscribe + 30 Tagen geloescht |
| **Server-Standort** | Alle Daten in Deutschland (Hetzner/Falkenstein) |

### 11.3 Consent-Record

```typescript
interface ConsentRecord {
  id: string;
  subscriberId: string;
  consentType: 'newsletter' | 'marketing';
  givenAt: Date;
  givenVia: 'website_form' | 'import' | 'event_checkin' | 'api';
  ipAddress: string;
  userAgent: string;
  formVersion: string;      // Version des Anmeldeformulars
  privacyPolicyVersion: string; // Version der Datenschutzerklaerung
  language: string;
  withdrawnAt?: Date;
  withdrawnVia?: string;
}
```

---

## 12. Akzeptanzkriterien (Definition of Done)

### 12.1 Modul: Subscribe/Unsubscribe

| # | Kriterium | Test-Methode |
|---|-----------|-------------|
| 1 | Anmeldung ueber Formular erzeugt DOI-E-Mail innerhalb 60 Sekunden | E2E-Test |
| 2 | DOI-Link ist 72 Stunden gueltig, danach wird Subscriber geloescht | Unit-Test |
| 3 | Unbestaetigte Anmeldung erhaelt keine Kampagnen | Integration-Test |
| 4 | One-Click-Unsubscribe funktioniert ohne Login | E2E-Test |
| 5 | List-Unsubscribe-Header ist in jeder E-Mail vorhanden | Unit-Test |
| 6 | Unsubscribe fuehrt sofort zur Versand-Stoppung | Integration-Test |
| 7 | Consent wird mit Zeitstempel, IP und Quelle gespeichert | Unit-Test |
| 8 | DSGVO-Export liefert alle Daten eines Subscribers als JSON | API-Test |
| 9 | Automatische Datenloeschung 30 Tage nach Unsubscribe | Cron-Test |

### 12.2 Modul: Preference Center

| # | Kriterium | Test-Methode |
|---|-----------|-------------|
| 1 | Preference Center ist ohne Login ueber Link erreichbar | E2E-Test |
| 2 | Themen-Auswahl wirkt sich auf Versand aus (Filter) | Integration-Test |
| 3 | Spielort-Auswahl limitiert Events im Newsletter | Integration-Test |
| 4 | Haeufigkeits-Aenderung wird sofort uebernommen | Unit-Test |
| 5 | UI zeigt aktuelle Einstellungen korrekt an | E2E-Test |

### 12.3 Modul: Email-Tracking

| # | Kriterium | Test-Methode |
|---|-----------|-------------|
| 1 | Open-Pixel wird in jeder E-Mail injiziert | Unit-Test |
| 2 | Open-Event wird bei Pixel-Ladung korrekt erfasst | Integration-Test |
| 3 | Click-Tracking-URLs leiten korrekt weiter | Integration-Test |
| 4 | Bounce-Events deaktivieren Subscriber sofort | Integration-Test |
| 5 | Soft Bounces werden 3x mit Backoff retried | Unit-Test |
| 6 | Spam-Complaints deaktivieren Subscriber sofort | Integration-Test |
| 7 | MPP-Erkennung markiert Apple-Proxy-Opens separat | Unit-Test |
| 8 | Stats-Dashboard zeigt korrekte CTR als Primaermetrik | E2E-Test |

### 12.4 Modul: Smart Sending

| # | Kriterium | Test-Methode |
|---|-----------|-------------|
| 1 | Algorithmus berechnet optimale Zeit nach 3+ Opens | Unit-Test |
| 2 | Fallback-Zeit (Di 21h) wird bei unzureichenden Daten verwendet | Unit-Test |
| 3 | Empfaenger werden in 15-Minuten-Batches gruppiert | Unit-Test |
| 4 | BullMQ Queue verarbeitet Batches zeitgerecht | Integration-Test |
| 5 | UI zeigt Smart-Sending-Statistiken korrekt an | E2E-Test |
| 6 | Smart Sending kann pro Kampagne deaktiviert werden | E2E-Test |

### 12.5 Modul: Drag-and-Drop Editor

| # | Kriterium | Test-Methode |
|---|-----------|-------------|
| 1 | Alle 11 Block-Typen koennen per Drag hinzugefuegt werden | E2E-Test |
| 2 | Event-Block laedt aktuelle Veranstaltungen automatisch | Integration-Test |
| 3 | Mobile/Desktop-Vorschau zeigt korrektes Layout | E2E-Test |
| 4 | Undo/Redo funktioniert fuer letzte 50 Aktionen | E2E-Test |
| 5 | Template wird automatisch alle 30 Sekunden gespeichert | E2E-Test |
| 6 | Exportiertes HTML ist in Gmail, Apple Mail, Outlook korrekt | Manual-Test |
| 7 | Bilder koennen hochgeladen, skaliert und positioniert werden | E2E-Test |

### 12.6 Modul: A/B Testing

| # | Kriterium | Test-Methode |
|---|-----------|-------------|
| 1 | Zwei Subject Lines koennen eingegeben werden | E2E-Test |
| 2 | Split-Groesse ist konfigurierbar | E2E-Test |
| 3 | Test wird statistisch signifikant nach genuegender Stichprobe | Unit-Test |
| 4 | Gewinner-Variante wird automatisch an Rest-Gruppe gesendet | Integration-Test |
| 5 | Bei Timeout wird bessere Variante automatisch gesendet | Integration-Test |
| 6 | Ergebnisse zeigen Signifikanz-Level an | E2E-Test |

### 12.7 Modul: Automation Workflows

| # | Kriterium | Test-Methode |
|---|-----------|-------------|
| 1 | Willkommens-Workflow wird bei Anmeldung automatisch gestartet | Integration-Test |
| 2 | Delay-Nodes verschicken E-Mails zum richtigen Zeitpunkt | Integration-Test |
| 3 | Condition-Nodes evaluieren Bedingungen korrekt | Unit-Test |
| 4 | Workflow kann pausiert und fortgesetzt werden | E2E-Test |
| 5 | Workflow-Builder zeigt visuelle Darstellung korrekt | E2E-Test |
| 6 | Max. Eintraege pro Subscriber wird eingehalten | Unit-Test |
| 7 | Unsubscribe beendet alle aktiven Workflows fuer Subscriber | Integration-Test |

### 12.8 Modul: SMTP-Integration & Versand

| # | Kriterium | Test-Methode |
|---|-----------|-------------|
| 1 | Brevo-Provider kann konfiguriert und getestet werden | E2E-Test |
| 2 | SendGrid-Provider kann alternativ konfiguriert werden | E2E-Test |
| 3 | Rate-Limiting haelt Provider-Limits ein | Integration-Test |
| 4 | Retry bei Soft Bounce mit exponentiellem Backoff | Unit-Test |
| 5 | Webhook-Events werden korrekt verarbeitet | Integration-Test |
| 6 | Fallback-Provider wird bei Fehler verwendet | Integration-Test |
| 7 | Versand-Queue ist nach Neustart persistent | Integration-Test |

---

## 13. Performance-Ziele

| Metrik | Ziel | Messung |
|--------|------|---------|
| **DOI-E-Mail Versandzeit** | < 30 Sekunden | Zeit Messung Subscribe -> E-Mail-Event |
| **Newsletter Versandrate** | > 10.000 E-Mails/Stunde | Durchsatz-Messung |
| **Tracking-Redirect-Latenz** | < 50ms (p95) | Klick-Tracking Response-Time |
| **Open-Pixel-Latenz** | < 20ms (p95) | Pixel-Response-Time |
| **Editor-Startzeit** | < 2 Sekunden | Time to Interactive |
| **Stats-Dashboard-Ladezeit** | < 1 Sekunde | API-Response-Time |
| **Segment-Neuberechnung** | < 30 Sekunden (10k Subscribers) | Query-Ausfuehrungszeit |
| **Zustellrate** | > 97% | Delivered / Sent Ratio |
| **Bounce-Rate** | < 2% | Bounced / Sent Ratio |

---

## 14. Zustaendigkeiten & Aufwandsschaetzung

| Modul | Aufwand | Prioritaet |
|-------|---------|-----------|
| Subscribe/Unsubscribe + DOI | 3 Tage | P0 (MVP) |
| Preference Center | 2 Tage | P1 |
| Email-Tracking (Open, Click, Bounce) | 4 Tage | P0 (MVP) |
| Smart Sending Algorithmus | 5 Tage | P1 |
| Segmentierung (Filter-Engine) | 4 Tage | P1 |
| Drag-and-Drop Editor | 10 Tage | P0 (MVP) |
| A/B Testing | 3 Tage | P2 |
| Automation Workflows | 8 Tage | P1 |
| SMTP-Provider-Integration | 4 Tage | P0 (MVP) |
| Webhook-Verarbeitung | 3 Tage | P0 (MVP) |
| Queue-Verarbeitung (BullMQ) | 3 Tage | P0 (MVP) |
| Analytics Dashboard | 4 Tage | P1 |
| DSGVO-Compliance-Features | 3 Tage | P0 (MVP) |
| **Gesamt** | **~60 Tage** | |

---

*Dokument erstellt: Juli 2026 | Version 1.0 | Naechste Review: Nach Implementierung P0-Features*

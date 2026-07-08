# Dimension 12: DSGVO, Compliance & Sicherheit

## Modul: Compliance-Hub fuer Kleinkunst-Veranstalter

> **Version:** 1.0
> **Status:** Spezifikation
> **Zielgruppe:** Deutsche/EU-Kleinkunst-Veranstalter, Kulturschaffende, Selbststaendige
> **Hosting-Strategie:** Selbst-Hosting auf Hetzner Cloud (maximale Datensouveraenitaet)

---

## 1. Feature-Beschreibung

Das DSGVO-Compliance- & Sicherheitsmodul ist die zentrale Vertrauensinfrastruktur der Kleinkunst-Dashboard-App. Es stellt sicher, dass alle personenbezogenen Daten von Kuenstlern, Gaesten, Kontakten und Mitarbeitern im vollen Einklang mit der EU-Datenschutz-Grundverordnung (DSGVO), dem deutschen BDSG, dem EU AI Act und relevanten Kulturrechtsvorschriften (GEMA) verarbeitet werden.

Das Modul umfasst fuenf Kernbereiche:
1. **Einwilligungs-Management-System** - Dokumentation, Verwaltung und Widerruf aller Einwilligungen
2. **Sicherheitsinfrastruktur** - Verschluesselung, Zugriffskontrolle, Audit-Logging
3. **Rechtliche Dokumentations-Tools** - Impressum, Datenschutzerklaerung, Vertragsvorlagen
4. **GEMA-Compliance-Tracker** - Meldepflichten, Setlisten, Gebuehrenabrechnung
5. **Compliance-Dashboard** - Uebersicht fuer Admins ueber alle Compliance-Status

### Alleinstellungsmerkmal
Anders als SaaS-Plattformen (die Daten in den USA/Cloud halten) setzt dieses Modul auf **Selbst-Hosting auf Hetzner** in Deutschland. Damit bleiben alle Kuenstler-, Gaeste- und Veranstalterdaten unter deutscher Gerichtsbarkeit. Es gibt keine US-Cloud, keine Datenweitergabe an Dritte und maximale Kontrolle.

---

## 2. User Stories

### US-12.01: Einwilligungs-Management
```
Als Veranstalter
moechte ich fuer jeden Kontakt (Gaeste, Kuenstler, Newsletter-Abonnenten) 
separat dokumentieren, welche Einwilligungen erteilt wurden,
damit ich im Falle einer Datenschutzpruefung jederzeit nachweisen kann,
dass alle Verarbeitungen rechtskonform erfolgen.
```
**Akzeptanzkriterien:**
- Fuer jeden Kontakt werden Newsletter-Einwilligung, Tracking-Einwilligung und KI-Verarbeitung separat dokumentiert
- Jede Einwilligung speichert Zeitstempel, IP-Adresse (gehashed) und Version der Einwilligungserklaerung
- Einwilligungen koennen einzeln widerrufen werden ohne andere Einwilligungen zu beeinflussen
- Widerruf loescht personenbezogene Daten aus dem jeweiligen Verarbeitungskontext

### US-12.02: Newsletter Double-Opt-In
```
Als Veranstalter
moechte ich fuer meinen Newsletter ein rechtskonformes Double-Opt-In-Verfahren haben,
damit ich sicher sein kann, dass nur Personen mit bestaetigter Einwilligung angeschrieben werden
und mir keine Abmahnung droht.
```
**Akzeptanzkriterien:**
- Anmeldung erzeugt Bestaetigungs-E-Mail mit eindeutigem Verifizierungslink (gueltig 48h)
- Erst nach Link-Klick ist die E-Mail-Adresse fuer Newsletter-Versand freigeschaltet
- Nicht bestaetigte Anmeldungen werden nach 30 Tagen automatisch geloescht
- Jeder Newsletter enthaelt obligatorischen Abmelde-Link
- Abmeldung wird sofort verarbeitet (max. 24h Verzoegerung)

### US-12.03: Recht auf Vergessenwerden
```
Als Betroffener (Kuenstler, Gast, Kontakt)
moechte ich mit einem Klick die vollstaendige Loeschung aller meiner personenbezogenen Daten beantragen,
damit mein Recht auf Vergessenwerden (Art. 17 DSGVO) automatisch und lueckenlos umgesetzt wird.
```
**Akzeptanzkriterien:**
- Selbstbedienungs-Portal fuer Loeschantraege ueber oeffentlichen Link
- Automatische Loeschung aller personenbezogenen Daten nach 30 Tagen Wartefrist (Widerrufsmoeglichkeit)
- Pseudonymisierte Statistikdaten (Anonymisierung: Aggregation ohne Personenbezug) bleiben erhalten
- Audit-Trail der Loeschung wird gespeichert (nur Metadaten: "Kontakt-ID XXX geloescht am DD.MM.YYYY")
- Benachrichtigung des Veranstalters per E-Mail bei eingegangenem Loeschantrag

### US-12.04: Datenexport (Portabilitaet)
```
Als Betroffener
moechte ich alle ueber mich gespeicherten Daten in einem maschinenlesbaren Format (JSON/CSV) exportieren koennen,
damit ich mein Recht auf Datenuebertragbarkeit (Art. 20 DSGVO) wahrnehmen kann.
```
**Akzeptanzkriterien:**
- Export umfasst alle personenbezogenen Daten: Profildaten, Veranstaltungsteilnahmen, Kommunikationshistorie, Einwilligungen
- Export-Format: JSON (strukturiert) und CSV (tabellarisch)
- Export wird als Download-Link per E-Mail zugestellt (Link gueltig 7 Tage)
- Export enthaelt keine Daten anderer Personen (z.B. Kommentare anderer Nutzer)
- Generierung erfolgt innerhalb von 24 Stunden

### US-12.05: GEMA-Meldung automatisieren
```
Als Veranstalter
moechte ich fuer jede Veranstaltung automatisch eine GEMA-Meldung generieren koennen,
in der alle aufgefuehrten Werke (Setliste) mit Kuenstlernamen, Werktitel und Dauer erfasst sind,
damit ich meine Meldepflicht gegenueber der GEMA einfach und vollstaendig erfuelle.
```
**Akzeptanzkriterien:**
- Setlisten koennen pro Veranstaltung erfasst werden (Werktitel, Komponist, Interpreten, Dauer)
- GEMA-Meldeformular wird automatisch als PDF/XML generiert
- Status-Tracking: "Entwurf" -> "Gemeldet" -> "Abgerechnet"
- Erinnerung an Meldefrist (7 Tage nach Veranstaltung per E-Mail)
- Archiv aller abgeschickten Meldungen

### US-12.06: Audit-Log nachvollziehen
```
Als Veranstalter (Admin)
moechte ich in einem Audit-Log nachvollziehen koennen, wer wann welche Aktion mit welchen Daten durchgefuehrt hat,
damit ich im Falle eines Datenschutzvorfalls oder einer Pruefung die Nachvollziehbarkeit gewaehrleisten kann.
```
**Akzeptanzkriterien:**
- Alle CRUD-Operationen auf personenbezogenen Daten werden geloggt (Zeitstempel, Benutzer, Aktion, betroffene Daten-ID)
- Audit-Log ist tamper-proof (append-only, kryptographisch gesichert)
- Filtermoeglichkeiten nach Benutzer, Zeitraum, Aktionstyp
- Export als CSV moeglich
- Aufbewahrungsfrist: 2 Jahre (automatische Loeschung danach)

### US-12.07: Compliance-Dashboard als Uebersicht
```
Als Veranstalter
moechte ich in einem zentralen Dashboard alle Compliance-relevanten Status auf einen Blick sehen
(offene GEMA-Meldungen, anstehende Loeschantraege, Einwilligungs-Statistiken, letzte Audit-Eintraege),
damit ich proaktiv handeln kann bevor Probleme entstehen.
```
**Akzeptanzkriterien:**
- Dashboard zeigt alle relevanten Kennzahlen in Echtzeit
- Ampel-System fuer kritische Vorgaenge (rot/gelb/gruen)
- Drill-Down in Details moeglich
- Woechentliche Compliance-Zusammenfassung per E-Mail (optional)

### US-12.08: EU AI Act Vorbereitung
```
Als Veranstalter
moechte ich dokumentieren koennen, welche KI-Funktionen in meiner App verwendet werden
und wo Betroffene darueber informiert wurden,
damit ich ab August 2026 den Anforderungen des EU AI Acts entspreche.
```
**Akzeptanzkriterien:**
- KI-Verarbeitungen werden in einem Verzeichnis dokumentiert (Zweck, Datenquellen, Entscheidungslogik)
- Betroffene werden vor KI-Verarbeitung explizit informiert und muessen zustimmen
- Menschliche Ueberpruefung (Human-in-the-Loop) ist bei KI-gestuetzten Entscheidungen implementiert
- KI-Risikoklassifizierung wird vorgenommen (niedrig / begrenzt / hoch)

---

## 3. Datenmodell

### 3.1 Core Collections

#### `consents` - Einwilligungs-Tracker
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | UUID | Primaerschluessel |
| `contact_id` | UUID | Fremdschluessel -> contacts |
| `consent_type` | ENUM | `newsletter`, `tracking`, `ai_processing`, `marketing`, `data_sharing` |
| `granted` | BOOLEAN | true = erteilt, false = widerrufen |
| `granted_at` | TIMESTAMP | Zeitpunkt der Erteilung |
| `granted_via` | STRING | Quelle: `webform`, `email`, `admin`, `import` |
| `ip_address_hash` | VARCHAR(64) | SHA-256 Hash der IP-Adresse (nicht speicherbar) |
| `user_agent_hash` | VARCHAR(64) | SHA-256 Hash des User-Agents |
| `consent_version` | VARCHAR(20) | Version der Einwilligungserklaerung (z.B. "1.2.0") |
| `consent_text_digest` | VARCHAR(64) | SHA-256 Hash des vollstaendigen Einwilligungstextes |
| `withdrawn_at` | TIMESTAMP | Zeitpunkt des Widerrufs (NULL wenn aktiv) |
| `withdrawn_via` | STRING | Quelle des Widerrufs: `link`, `portal`, `admin`, `email` |
| `legal_basis` | ENUM | `consent`, `contract`, `legal_obligation`, `legitimate_interest` |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Aenderung |

**Indizes:** `contact_id`, `consent_type`, `granted`, `granted_at`

#### `deletion_requests` - Recht auf Vergessenwerden
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | UUID | Primaerschluessel |
| `contact_id` | UUID | Fremdschluessel -> contacts |
| `status` | ENUM | `pending`, `processing`, `completed`, `cancelled` |
| `requested_at` | TIMESTAMP | Antragszeitpunkt |
| `requested_via` | STRING | `self_service_portal`, `email`, `admin` |
| `scheduled_deletion_at` | TIMESTAMP | Geplanter Loeschzeitpunkt (requested_at + 30 Tage) |
| `completed_at` | TIMESTAMP | Tatsaechlicher Loeschzeitpunkt |
| `cancellation_token` | UUID | Token zum Widerruf des Loeschantrags |
| `contact_email_hash` | VARCHAR(64) | Hash der E-Mail (fuer Nachweis nach Loeschung) |
| `deleted_records_count` | JSONB | Statistik: `{ "contacts": 1, "bookings": 5, "messages": 12 }` |

**Indizes:** `contact_id`, `status`, `scheduled_deletion_at`

#### `data_exports` - Datenuebertragbarkeit (Art. 20)
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | UUID | Primaerschluessel |
| `contact_id` | UUID | Fremdschluessel -> contacts |
| `status` | ENUM | `requested`, `generating`, `ready`, `expired`, `downloaded` |
| `requested_at` | TIMESTAMP | Antragszeitpunkt |
| `ready_at` | TIMESTAMP | Fertigstellungszeitpunkt |
| `expires_at` | TIMESTAMP | Ablauf des Download-Links (7 Tage) |
| `download_token` | UUID | Sicherer Download-Token |
| `file_path` | STRING | Server-Pfad zur generierten Datei |
| `file_size_bytes` | INTEGER | Dateigroesse |
| `formats` | JSONB | `["json", "csv"]` |
| `scope` | JSONB | Umfang: `["profile", "events", "messages", "consents"]` |

**Indizes:** `contact_id`, `status`, `download_token`

#### `audit_log` - Tamper-proof Audit-Trail
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | BIGSERIAL | Primaerschluessel (monoton steigend) |
| `timestamp` | TIMESTAMPTZ | Zeitpunkt der Aktion |
| `actor_type` | ENUM | `user`, `system`, `api`, `guest` |
| `actor_id` | UUID | ID des ausfuehrenden Benutzers/Systems |
| `actor_email_hash` | VARCHAR(64) | Hash der Benutzer-E-Mail |
| `action` | ENUM | `create`, `read`, `update`, `delete`, `export`, `login`, `logout`, `consent_grant`, `consent_withdraw`, `deletion_request`, `deletion_execute` |
| `resource_type` | STRING | Betroffene Entitaet: `contact`, `event`, `booking`, `message`, `settings` |
| `resource_id` | UUID | ID des betroffenen Datensatzes |
| `changes` | JSONB | Delta: `{ "old": {...}, "new": {...} }` (bei PII: nur Hash) |
| `ip_address_hash` | VARCHAR(64) | SHA-256 Hash der IP-Adresse |
| `session_id_hash` | VARCHAR(64) | Hash der Session-ID |
| `previous_hash` | VARCHAR(64) | Hash des vorherigen Audit-Log-Eintrags (Kette) |
| `entry_hash` | VARCHAR(64) | SHA-256(Hash aller Felder + previous_hash) |
| `retention_until` | DATE | Aufbewahrungsfrist (2 Jahre nach timestamp) |

**Indizes:** `timestamp`, `actor_id`, `resource_type`, `resource_id`, `action`
**Partitionierung:** Nach `timestamp` monatlich partitioniert

#### `gema_reports` - GEMA-Meldungen
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | UUID | Primaerschluessel |
| `event_id` | UUID | Fremdschluessel -> events |
| `venue_id` | UUID | Fremdschluessel -> venues |
| `status` | ENUM | `draft`, `submitted`, `acknowledged`, `invoiced`, `paid`, `cancelled` |
| `report_number` | STRING | GEMA-Meldungsnummer (vom System generiert: GEMA-YYYY-XXXX) |
| `event_date` | DATE | Veranstaltungsdatum |
| `submitted_at` | TIMESTAMP | Einreichungszeitpunkt |
| `submitted_by` | UUID | Benutzer, der gemeldet hat |
| `total_duration_minutes` | INTEGER | Gesamtdauer aller Werke |
| `estimated_fee_cents` | INTEGER | Schaetzwert der GEMA-Gebuehr |
| `report_data` | JSONB | Vollstaendige Meldedaten im GEMA-Format |
| `gema_response` | JSONB | Antwort der GEMA (falls vorhanden) |
| `invoice_reference` | STRING | Rechnungsreferenz der GEMA |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Aenderung |

**Indizes:** `event_id`, `status`, `event_date`, `report_number`

#### `gema_works` - GEMA-Werke (Setlisten)
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | UUID | Primaerschluessel |
| `gema_report_id` | UUID | Fremdschluessel -> gema_reports |
| `event_id` | UUID | Fremdschluessel -> events |
| `sequence_number` | INTEGER | Reihenfolge im Programm |
| `work_title` | STRING | Werktitel |
| `composer` | STRING | Komponist/Textdichter |
| `publisher` | STRING | Verlag (optional) |
| `performers` | STRING | Ausfuehrende Kuenstler |
| `duration_minutes` | DECIMAL(4,1) | Dauer in Minuten |
| `is_own_composition` | BOOLEAN | Eigenkomposition (ggf. keine GEMA-Gebuehr) |
| `is_public_domain` | BOOLEAN | Gemeinfrei (keine GEMA-Gebuehr) |
| `notes` | TEXT | Anmerkungen |

**Indizes:** `gema_report_id`, `event_id`

#### `legal_documents` - Rechtliche Dokumente (Impressum, Datenschutz)
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | UUID | Primaerschluessel |
| `document_type` | ENUM | `privacy_policy`, `imprint`, `terms_of_service`, `artist_contract`, `cancellation_policy` |
| `version` | VARCHAR(20) | Versionsnummer |
| `title` | STRING | Dokumenttitel |
| `content` | TEXT | Vollstaendiger Markdown-Content |
| `content_hash` | VARCHAR(64) | SHA-256 Hash (Integritaet) |
| `effective_from` | DATE | Gueltig ab |
| `effective_until` | DATE | Gueltig bis (NULL = aktuell) |
| `is_current` | BOOLEAN | Aktuelle Version |
| `generated_by` | UUID | Benutzer/System |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |

**Indizes:** `document_type`, `is_current`, `effective_from`

#### `dpa_records` - Auftragsverarbeitungsvertraege (AVV)
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | UUID | Primaerschluessel |
| `processor_name` | STRING | Name des Auftragsverarbeiters |
| `processor_type` | ENUM | `hosting`, `email`, `payment`, `analytics`, `backup`, `ai`, `other` |
| `contract_signed_at` | DATE | Unterzeichnungsdatum |
| `contract_valid_until` | DATE | Gueltig bis |
| `data_categories` | JSONB | `["contact_data", "financial_data", "usage_data"]` |
| `processing_purpose` | TEXT | Zweck der Verarbeitung |
| `subprocessors` | JSONB | Liste beauftragter Unterauftragsverarbeiter |
| `technical_measures` | JSONB | Beschriebene technischen/organisatorischen Massnahmen |
| `termination_period_days` | INTEGER | Kuendigungsfrist in Tagen |
| `status` | ENUM | `active`, `expiring`, `expired`, `terminated` |
| `document_path` | STRING | Pfad zur eingescannten AVV-Datei |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |

**Indizes:** `processor_type`, `status`, `contract_valid_until`

#### `ai_registry` - EU AI Act Verzeichnis
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | UUID | Primaerschluessel |
| `system_name` | STRING | Name des KI-Systems |
| `risk_class` | ENUM | `minimal`, `limited`, `high`, `unacceptable` |
| `purpose` | TEXT | Verwendungszweck |
| `training_data_description` | TEXT | Beschreibung der Trainingsdaten |
| `output_description` | TEXT | Beschreibung der KI-Ausgaben |
| `human_oversight` | BOOLEAN | Menschliche Ueberwachung vorhanden |
| `oversight_description` | TEXT | Wie erfolgt die menschliche Ueberwachung |
| `transparency_measures` | TEXT | Transparenzmassnahmen |
| `in_use_since` | DATE | Einsatzbeginn |
| `last_reviewed_at` | TIMESTAMP | Letzte Pruefung |

### 3.2 ER-Diagramm (Beziehungen)

```
contacts ||--o{ consents : "erteilt"
contacts ||--o{ deletion_requests : "beantragt"
contacts ||--o{ data_exports : "fordert an"
contacts ||--o{ audit_log : "betroffen"

users ||--o{ audit_log : "verursacht"
users ||--o{ gema_reports : "meldet"

events ||--|| gema_reports : "wird gemeldet"
events ||--o{ gema_works : "enthaelt"
gema_reports ||--o{ gema_works : "listet"

events ||--o{ venues : "findet statt in"
```

### 3.3 Datenbank-Konfiguration

**PostgreSQL mit folgenden Erweiterungen:**
- `pgcrypto` - Kryptographische Funktionen (Hashing)
- `pg_audit` - Datenbank-Level Audit-Logging (optional)
- Row-Level Security (RLS) fuer Mandantenfaehigkeit

---

## 4. API-Endpunkte

### 4.1 Consent Management API

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|--------------|------|
| `GET` | `/api/v1/consents` | Alle Einwilligungen listen (Admin) | Admin |
| `GET` | `/api/v1/contacts/:id/consents` | Einwilligungen eines Kontakts | Admin/Owner |
| `POST` | `/api/v1/contacts/:id/consents` | Einwilligung erteilen | Admin/Guest |
| `PATCH` | `/api/v1/consents/:id/withdraw` | Einwilligung widerrufen | Admin/Owner |
| `GET` | `/api/v1/consents/stats` | Einwilligungs-Statistiken | Admin |
| `POST` | `/api/v1/consents/verify-double-opt-in` | Double-Opt-In bestaetigen | Public |

**Request/Response Beispiel - Einwilligung erteilen:**
```json
// POST /api/v1/contacts/123e4567/consents
{
  "consent_type": "newsletter",
  "granted": true,
  "granted_via": "webform",
  "consent_version": "1.2.0",
  "consent_text": "Ich stimme dem Erhalt des Newsletters zu...",
  "legal_basis": "consent"
}

// Response 201 Created
{
  "id": "uuid-v4",
  "contact_id": "123e4567",
  "consent_type": "newsletter",
  "granted": true,
  "granted_at": "2025-01-15T14:30:00Z",
  "ip_address_hash": "sha256:abc...",
  "consent_version": "1.2.0",
  "consent_text_digest": "sha256:def..."
}
```

### 4.2 Deletion (Recht auf Vergessenwerden) API

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|--------------|------|
| `POST` | `/api/v1/deletion-requests` | Loeschantrag stellen (Self-Service) | Public (mit Token) |
| `GET` | `/api/v1/deletion-requests` | Alle Antraege listen | Admin |
| `GET` | `/api/v1/deletion-requests/:id` | Einzelnen Antrag ansehen | Admin |
| `POST` | `/api/v1/deletion-requests/:id/cancel` | Antrag zurueckziehen | Public (mit Token) |
| `POST` | `/api/v1/deletion-requests/:id/execute` | Sofortige Ausfuehrung (Admin) | Admin |
| `GET` | `/api/v1/deletion-requests/stats` | Statistiken | Admin |

### 4.3 Data Export (Portabilitaet) API

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|--------------|------|
| `POST` | `/api/v1/data-exports` | Export anfordern | Admin/Owner |
| `GET` | `/api/v1/data-exports` | Alle Export-Anfragen | Admin |
| `GET` | `/api/v1/data-exports/:id` | Status abfragen | Admin/Owner |
| `GET` | `/api/v1/data-exports/download/:token` | Export herunterladen | Public (mit Token) |

### 4.4 GEMA Reports API

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|--------------|------|
| `GET` | `/api/v1/gema-reports` | Alle GEMA-Meldungen | Admin |
| `POST` | `/api/v1/gema-reports` | Neue GEMA-Meldung erstellen | Admin |
| `GET` | `/api/v1/gema-reports/:id` | Einzelne Meldung | Admin |
| `PUT` | `/api/v1/gema-reports/:id` | Meldung aktualisieren | Admin |
| `POST` | `/api/v1/gema-reports/:id/submit` | Als eingereicht markieren | Admin |
| `GET` | `/api/v1/gema-reports/:id/pdf` | PDF generieren | Admin |
| `GET` | `/api/v1/gema-reports/:id/xml` | XML fuer GEMA-Upload | Admin |
| `GET` | `/api/v1/gema-reports/overdue` | Ueberfaellige Meldungen | Admin |
| `POST` | `/api/v1/gema-reports/:id/works` | Werk zur Setliste hinzufuegen | Admin |
| `DELETE` | `/api/v1/gema-reports/:id/works/:workId` | Werk entfernen | Admin |

### 4.5 Audit Log API

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|--------------|------|
| `GET` | `/api/v1/audit-log` | Audit-Log abrufen (Admin) | Admin |
| `GET` | `/api/v1/audit-log/verify` | Integritaet der Kette pruefen | Admin |
| `GET` | `/api/v1/audit-log/export` | Als CSV exportieren | Admin |
| `GET` | `/api/v1/audit-log/stats` | Statistiken | Admin |

**Query-Parameter fuer Filter:**
- `actor_id` - Nach Benutzer filtern
- `action` - Nach Aktionstyp filtern
- `resource_type` - Nach Ressourcentyp filtern
- `from` / `to` - Zeitraum
- `page` / `limit` - Paginierung

### 4.6 Legal Documents API

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|--------------|------|
| `GET` | `/api/v1/legal/documents` | Alle Dokumente | Admin |
| `GET` | `/api/v1/legal/documents/current/:type` | Aktuelles Dokument (Public) | Public |
| `POST` | `/api/v1/legal/documents` | Neue Version erstellen | Admin |
| `POST` | `/api/v1/legal/documents/:id/generate` | Dokument generieren | Admin |
| `GET` | `/api/v1/legal/imprint` | Aktuelles Impressum | Public |
| `GET` | `/api/v1/legal/privacy` | Aktuelle Datenschutzerklaerung | Public |

### 4.7 DPA (AVV) API

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|--------------|------|
| `GET` | `/api/v1/dpas` | Alle AVVs | Admin |
| `POST` | `/api/v1/dpas` | Neue AVV erstellen | Admin |
| `PUT` | `/api/v1/dpas/:id` | AVV aktualisieren | Admin |
| `GET` | `/api/v1/dpas/overdue` | Abgelaufene/Bald ablaufende | Admin |

### 4.8 AI Registry API

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|--------------|------|
| `GET` | `/api/v1/ai-registry` | Alle KI-Systeme | Admin |
| `POST` | `/api/v1/ai-registry` | KI-System registrieren | Admin |
| `PUT` | `/api/v1/ai-registry/:id` | Aktualisieren | Admin |
| `GET` | `/api/v1/ai-registry/public` | Oeffentliche Transparenzinfo | Public |

---

## 5. UI-Komponenten

### 5.1 React Komponenten-Hierarchie

```
ComplianceModule/
├── ComplianceDashboard/                    # Haupt-Dashboard
│   ├── ComplianceDashboard.tsx
│   ├── StatCard.tsx                        # Kennzahlen-Karte
│   ├── ConsentOverviewChart.tsx            # Einwilligungs-Statistik
│   ├── OverdueAlerts.tsx                   # Ueberfaellige Meldungen
│   └── RecentAuditEntries.tsx              # Letzte Audit-Eintraege
│
├── ConsentManagement/
│   ├── ConsentList.tsx                     # Einwilligungen auflisten
│   ├── ConsentDetail.tsx                   # Einwilligungs-Details
│   ├── ConsentTimeline.tsx                 # Zeitstrahl Einwilligung/Widerruf
│   ├── ConsentStats.tsx                    # Statistiken
│   └── DoubleOptInSettings.tsx             # Double-Opt-In Konfiguration
│
├── DeletionRequests/
│   ├── DeletionRequestList.tsx             # Loeschantraege
│   ├── DeletionRequestDetail.tsx           # Detailansicht
│   ├── DeletionPreview.tsx                 # Vorschau was geloescht wird
│   └── SelfServicePortal.tsx               # Oeffentliches Portal
│
├── DataExport/
│   ├── ExportRequestForm.tsx               # Export-Anforderung
│   ├── ExportStatusTracker.tsx             # Status-Verfolgung
│   └── ExportDownload.tsx                  # Download-Komponente
│
├── GemaReporting/
│   ├── GemaReportList.tsx                  # GEMA-Meldungen
│   ├── GemaReportEditor.tsx                # Meldung bearbeiten
│   ├── GemaReportPDFPreview.tsx            # PDF-Vorschau
│   ├── SetlistEditor.tsx                   # Setliste bearbeiten
│   ├── WorkEntryForm.tsx                   # Werk hinzufuegen
│   └── GemaOverdueAlert.tsx                # Ueberfaellige Meldungen
│
├── AuditLog/
│   ├── AuditLogViewer.tsx                  # Audit-Log Ansicht
│   ├── AuditLogFilter.tsx                  # Filter-Komponente
│   ├── AuditLogTimeline.tsx                # Zeitstrahl
│   └── IntegrityVerifier.tsx               # Ketten-Integritaet
│
├── LegalDocuments/
│   ├── LegalDocumentEditor.tsx             # Dokument-Editor (Markdown)
│   ├── DocumentVersionHistory.tsx          # Versionshistorie
│   ├── ImprintGenerator.tsx                # Impressum-Generator
│   ├── PrivacyPolicyGenerator.tsx          # Datenschutz-Generator
│   └── DocumentPreview.tsx                 # Vorschau
│
├── DPAViewer/
│   ├── DPAList.tsx                         # AVV-Uebersicht
│   ├── DPADetail.tsx                       # AVV-Details
│   ├── DPAStatusBadge.tsx                  # Status-Anzeige
│   └── DPAUpload.tsx                       # AVV-Dokument hochladen
│
├── AIRegistry/
│   ├── AIRegistryList.tsx                  # KI-Systeme
│   ├── AIRegistryForm.tsx                  # KI-System erfassen
│   └── AITransparencyPanel.tsx             # Oeffentliche Info
│
├── CookieConsent/
│   ├── CookieConsentBanner.tsx             # Cookie-Banner
│   ├── CookieSettingsModal.tsx             # Detail-Einstellungen
│   └── CookieConsentProof.tsx              # Einwilligungsnachweis
│
└── SecuritySettings/
    ├── SecurityDashboard.tsx               # Sicherheits-Uebersicht
    ├── TwoFactorSetup.tsx                  # 2FA Einrichtung
    ├── SessionManager.tsx                  # Aktive Sessions
    ├── PasswordPolicyConfig.tsx            # Passwort-Richtlinien
    └── RBACManager.tsx                     # Rollenverwaltung
```

### 5.2 Seiten-Routing

| Route | Komponente | Zugriff |
|-------|-----------|---------|
| `/compliance` | ComplianceDashboard | Admin |
| `/compliance/consents` | ConsentList | Admin |
| `/compliance/consents/:id` | ConsentDetail | Admin |
| `/compliance/deletions` | DeletionRequestList | Admin |
| `/compliance/deletions/:id` | DeletionRequestDetail | Admin |
| `/compliance/exports` | ExportRequestForm | Admin |
| `/compliance/gema` | GemaReportList | Admin |
| `/compliance/gema/:id` | GemaReportEditor | Admin |
| `/compliance/audit-log` | AuditLogViewer | Admin |
| `/compliance/legal` | LegalDocumentEditor | Admin |
| `/compliance/dpas` | DPAList | Admin |
| `/compliance/ai-registry` | AIRegistryList | Admin |
| `/compliance/security` | SecurityDashboard | Admin |
| `/delete-my-data` | SelfServicePortal | Public |
| `/export-my-data` | ExportRequestForm | Public (mit Token) |
| `/privacy` | DocumentPreview (Privacy) | Public |
| `/imprint` | DocumentPreview (Imprint) | Public |

---

## 6. Integrationen

### 6.1 Externe Services & APIs

| Service | Zweck | Integrationstyp | DPA Noetig |
|---------|-------|-----------------|------------|
| **Hetzner Cloud** | Hosting, Server, Storage | IaaS - AVV via Hetzner Kundenportal | Ja (standard) |
| **Hetzner Storage Box** | Backup-Speicher | S3-kompatibel API | Ja (Teil der Hetzner AVV) |
| **Postfix/Dovecot (self-hosted)** | E-Mail Versand/Empfang | Self-hosted auf Hetzner | Nein (eigene Infrastruktur) |
| **Let's Encrypt** | SSL-Zertifikate | ACME Protocol, auto-renewal | Nein |
| **GEMA Online-Portal** | Meldungseinspeisung | Manuelle XML/PDF-Einreichung (keine API) | Nein |
| **Meteoblue/OpenWeather** | Wetterdaten fuer Veranstaltungen | REST API | Ja (wenn personenbezogene Ortsdaten) |

### 6.2 Datenverarbeitungsvereintraege (AVV)

**Muss-AVVs (Hetzner Standard):**
- Hetzner Cloud GmbH - Server-Hosting (erteilt automatisch bei Vertragsabschluss)
- Hetzner Online GmbH - Netzwerkinfrastruktur

**Keine externen AVVs notwendig bei Self-Hosting:**
- E-Mail: Postfix selbst betrieben -> Kein Dritter involviert
- Datenbank: PostgreSQL selbst betrieben
- Dateispeicher: Lokaler Speicher oder Hetzner Storage Box
- Analytics: Plausible Analytics (self-hosted) oder keine

**Empfohlene AVV-Bibliothek im System:**
- Vorlage Hetzner AVV (verlinkt)
- Checkliste: Welche AVVs sind notwendig?
- Erinnerung bei Ablauf/Verlaengerung

### 6.3 GEMA-Schnittstelle

Die GEMA bietet **keine API** fuer automatisierte Meldungen. Integration:
- **XML-Export** im GEMA-Format fuer Upload im Online-Portal
- **PDF-Export** als Nachweis/Meldungsbestaetigung
- **CSV-Import** von GEMA-Abrechnungen zur Rueckverfolgung
- Erinnerungs-E-Mail 7 Tage vor Meldefrist

---

## 7. Technische Details

### 7.1 Architektur-Prinzipien

**"Privacy by Design" & "Privacy by Default"**
- Nur Daten erheben, die fuer den Zweck notwendig sind
- Standardmaessig keine Tracking-Cookies
- KI-Verarbeitung nur nach expliziter Einwilligung
- Alle PII-Felder sind markiert und separat behandelbar

**"Datensouveraenitaet durch Self-Hosting"**
- Keine Daten verlassen die Hetzner-Infrastruktur (Deutschland)
- Keine US-Cloud-Dienste (kein AWS, GCP, Azure)
- Keine CDN von US-Anbietern
- Alle Backups verschlüsselt auf Hetzner Storage Box (Deutschland)

### 7.2 Verschluesselung

**At Rest (Datenspeicherung):**
- PostgreSQL: Transparent Data Encryption (TDE) via LUKS auf Betriebssystem-Ebene
- Backups: AES-256-GCM verschluesselt vor Upload
- Datei-Uploads: AES-256 verschluesselt im Object Storage
- Schluesselmanagement: Hardware Security Module (HSM) empfohlen, alternativ HashiCorp Vault

**In Transit (Datenuebertragung):**
- TLS 1.3 fuer alle Verbinden (mindestens TLS 1.2)
- HSTS Header mit Preload
- Perfect Forward Secrecy (ECDHE)
- Zertifikate: Let's Encrypt mit automatischem Renewal

**Anwendungsebene:**
- Passwoerter: Argon2id (winner Password Hashing Competition)
- API-Tokens: bcrypt mit Salt
- E-Mail-Adressen: Searchable Encryption oder gehashte Indizes

### 7.3 Zugriffskontrolle (RBAC)

**Rollen-Modell:**

| Rolle | Berechtigungen |
|-------|---------------|
| `owner` | Vollzugriff auf alles, Rollenverwaltung, AVV-Verwaltung |
| `admin` | Compliance-Dashboard, alle Antraege bearbeiten, GEMA-Meldungen, Audit-Log |
| `organizer` | Veranstaltungen planen, Gaestelisten verwalten, GEMA-Setlisten |
| `viewer` | Nur Lesen, kein Export, keine Loeschung |
| `api` | Programmatischer Zugriff, beschraenkt auf definierte Scopes |

**Berechtigungsmatrix (Beispiel):**
```json
{
  "consents": { "owner": "CRUD", "admin": "CRUD", "organizer": "R", "viewer": "R" },
  "deletion_requests": { "owner": "CRUD/execute", "admin": "CRUD/execute", "organizer": "R", "viewer": "" },
  "audit_log": { "owner": "R/export", "admin": "R/export", "organizer": "", "viewer": "" },
  "gema_reports": { "owner": "CRUD", "admin": "CRUD", "organizer": "CRUD", "viewer": "R" }
}
```

**Middleware:**
```typescript
// Beispiel: RBAC Middleware (Express.js)
const checkPermission = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user.role;
    const permission = PERMISSION_MATRIX[resource]?.[userRole];
    if (permission?.includes(action)) return next();
    return res.status(403).json({ error: "Forbidden" });
  };
};
```

### 7.4 Session Management

**Strategie:**
- JWT Access Token (kurzlebig: 15 Minuten) + Refresh Token (lang: 7 Tage)
- Refresh Tokens werden serverseitig in Redis gespeichert (Revocation moeglich)
- Sessions sind geraetegebunden (Fingerprinting)
- Gleichzeitige Sessions begrenzt (max. 5 pro Benutzer)
- Automatisches Logout bei Inaktivitaet (30 Minuten)

**Implementierung:**
```typescript
interface Session {
  id: string;           // UUID
  user_id: string;      // Benutzer-ID
  device_fingerprint: string;  // Hash aus User-Agent + IP-Subnet
  created_at: Date;
  last_active_at: Date;
  expires_at: Date;
  ip_address_hash: string;
  is_valid: boolean;    // fuer Revocation
}
```

### 7.5 Passwort-Policies

| Regel | Wert |
|-------|------|
| Mindestlaenge | 12 Zeichen |
| Komplexitaet | Mindestens 3 von 4: Gross-, Kleinbuchstaben, Zahlen, Sonderzeichen |
| Woerterbuch-Check | Keine haefigen Passwoerter (zxcvbn-Bibliothek) |
| History | Letzte 5 Passwoerter duerfen nicht wiederverwendet werden |
| Ablauf | Kein Zwang zum regelmaessigen Wechsel (NIST Empfehlung) |
| Lockout | 5 fehlgeschlagene Versuche -> 15 Minuten Sperre |
| Rate Limiting | max. 10 Login-Versuche pro Minute pro IP |

### 7.6 Zwei-Faktor-Authentifizierung (2FA)

**Unterstuetzte Verfahren:**
1. **TOTP** (Time-based One-Time Password) - Google Authenticator, Authy, etc.
2. **Backup-Codes** - 10 Einmal-Codes bei Verlust des Geraets
3. **WebAuthn/FIDO2** - Hardware-Key (YubiKey) - optional

**Flow:**
```
1. Benutzer aktiviert 2FA in den Einstellungen
2. QR-Code wird generiert (TOTP Secret)
3. Benutzer scannt QR-Code mit Authenticator-App
4. Verifizierung durch Einmalcode
5. Backup-Codes werden generiert und angezeigt
6. Bei Login: Passwort + TOTP-Code erforderlich
```

### 7.7 Audit-Log Implementierung

**Tamper-Proof Design (Hash-Kette):**
```typescript
// Prinzip: Jeder Eintrag enthaelt den Hash des vorherigen
function createAuditEntry(entry: AuditEntry, previousEntry: AuditEntry | null): AuditEntry {
  const entryData = {
    timestamp: entry.timestamp,
    actor_type: entry.actor_type,
    actor_id: entry.actor_id,
    action: entry.action,
    resource_type: entry.resource_type,
    resource_id: entry.resource_id,
    changes: entry.changes,
    previous_hash: previousEntry?.entry_hash || "0".repeat(64),
  };
  
  entry.entry_hash = sha256(JSON.stringify(entryData));
  return entry;
}

// Verifikation: Kette von Anfang bis Ende pruefen
function verifyAuditChain(entries: AuditEntry[]): boolean {
  for (let i = 1; i < entries.length; i++) {
    const expectedHash = entries[i - 1].entry_hash;
    const actualHash = entries[i].previous_hash;
    if (expectedHash !== actualHash) return false;
  }
  return true;
}
```

**Storage:**
- Primaer: PostgreSQL-Tabelle (monatlich partitioniert)
- Sekundaer: Append-only Log-Datei (WORM-Storage) fuer kritische Eintraege
- Retention: Automatische Loeschung nach 2 Jahren

### 7.8 Automatisierte Datenloeschung

**Aufgaben:**
```typescript
// Taeglicher Cron-Job
interface DeletionJob {
  // 1. Pending-Anfragen pruefen, die aelter als 30 Tage sind
  // 2. Loeschung in Transaktion ausfuehren:
  //    - Kontakt -> loeschen oder anonymisieren
  //    - Alle verknuepften PII-Daten loeschen
  //    - Audit-Eintraege behalten (nur mit gehashten IDs)
  //    - Statistische Daten anonymisieren (Aggregation)
  // 3. Status auf "completed" setzen
  // 4. Benachrichtigung an Admin senden
}

// Anonymisierungs-Strategie
function anonymizeContact(contact: Contact): AnonymizedContact {
  return {
    id: contact.id,                    // UUID bleibt (Referenz)
    email_hash: sha256(contact.email), // Hash bleibt (Nachweis)
    name: null,                        // Geloescht
    phone: null,                       // Geloescht
    address: null,                     // Geloescht
    birth_date: null,                  // Geloescht
    created_at: contact.created_at,    // Behalten (Statistik)
    event_participation_count: contact.events.length, // Aggregat
    is_anonymized: true,
    anonymized_at: new Date(),
  };
}
```

### 7.9 Cookie-Consent-Technische Umsetzung

**Cookie-Kategorien:**
| Kategorie | Notwendig | Zweck | Beispiele |
|-----------|-----------|-------|-----------|
| `essential` | Ja | Technisch notwendig | Session-Cookie, CSRF-Token, Login-Status |
| `functional` | Nein | Erweiterte Funktionen | Spracheinstellung, Dark Mode |
| `analytics` | Nein | Statistiken | Plausible Analytics (self-hosted) |
| `marketing` | Nein | Marketing/Tracking | Keine externen Tracker |

**Technische Implementierung:**
- Cookie-Banner: Server-seitig gerendert (kein JS noetig fuer essentielle Entscheidung)
- Entscheidung wird serverseitig gespeichert (nicht nur im localStorage)
- Nicht-essentielle Cookies werden erst nach Einwilligung gesetzt
- Scripts von Drittanbietern werden dynamisch nach Einwilligung geladen

### 7.10 EU AI Act Vorbereitung

**Massnahmen:**
- Alle KI-Features muessen im `ai_registry` registriert werden
- Vor jeder KI-Verarbeitung: Explizite Information + Einwilligung
- KI-Empfehlungen sind als solche gekennzeichnet (nicht als Fakten dargestellt)
- Menschliche Ueberpruefung bei allen KI-gestuetzten Entscheidungen
- Keine "High-Risk" KI-Anwendungen ohne vollstaendige Dokumentation

**Empfohlene KI-Risikoeinstufung fuer Kleinkunst-App:**
- KI-gestuetzte Kuenstler-Empfehlungen: **begrenztes Risiko** (Art. 52)
- KI-gestuetzte Besucher-Prognosen: **begrenztes Risiko**
- KI-gestuetzte automatische Vertragsgenerierung: **hohes Risiko** (Pruefung erforderlich!)
- KI-gestuetzte Chatbots fuer Kundenservice: **begrenztes Risiko**

### 7.11 Verwendete Libraries & Tools

| Bereich | Library/Tool | Zweck |
|---------|-------------|-------|
| **Backend** | `argon2` | Passwort-Hashing |
| **Backend** | `jsonwebtoken` | JWT Token-Handling |
| **Backend** | `speakeasy` | TOTP/2FA-Implementierung |
| **Backend** | `node-forge` | Kryptographische Operationen |
| **Backend** | `helmet` | Security-Headers (HSTS, CSP, etc.) |
| **Backend** | `express-rate-limit` | Rate Limiting |
| **Backend** | `zxcvbn` | Passwort-Staerke-Check |
| **Frontend** | `react-markdown` | Datenschutzerklaerung rendern |
| **Frontend** | `jsPDF` / `pdf-lib` | PDF-Generierung (GEMA-Meldung) |
| **Frontend** | `qrcode.react` | QR-Codes fuer 2FA |
| **Frontend** | `recharts` | Compliance-Statistiken visualisieren |
| **Database** | `node-cron` | Automatisierte Loeschungsjobs |
| **Infrastructure** | `HashiCorp Vault` | Schluesselmanagement |
| **Infrastructure** | `Let's Encrypt` | SSL-Zertifikate |
| **Monitoring** | `Fail2Ban` | Brute-Force-Schutz |
| **Email** | `Nodemailer` + Postfix | E-Mail-Versand (self-hosted) |

---

## 8. Akzeptanzkriterien (Definition of Done)

### 8.1 DSGVO-Konformitaet

- [ ] **Datenschutzerklaerung** kann automatisch generiert werden mit aktuellen Verarbeiter-Informationen
- [ ] **Einwilligungs-Management** dokumentiert jede Einwilligung mit Zeitstempel, Version und Hash des Einwilligungstextes
- [ ] **Double-Opt-In** fuer Newsletter funktioniert vollstaendig: Bestaetigungsmail, Verifizierungslink, Wartezeiten, Auto-Delete
- [ ] **Recht auf Vergessenwerden** ist per Self-Service-Portal moeglich; Loeschung erfolgt automatisch nach 30 Tagen
- [ ] **Datenexport** erzeugt vollstaendige JSON/CSV-Exporte innerhalb von 24 Stunden
- [ ] **Cookie-Consent-Banner** blockiert nicht-essentielle Cookies/Scrips bis zur Einwilligung
- [ ] **Alle AVVs** sind dokumentiert und deren Status wird ueberwacht (Ablaufwarnung)
- [ ] **Datenschutz-Folgenabschaetzung** ist als Vorlage im System hinterlegt

### 8.2 Sicherheit

- [ ] **Verschluesselung at rest** ist aktiviert fuer alle Datenbanken und Dateispeicher
- [ ] **TLS 1.3** ist fuer alle Verbindungen erzwingbar
- [ ] **RBAC** funktioniert: Jede Aktion ist rollenbasiert geschuetzt
- [ ] **Audit-Log** zeichnet alle CRUD-Operationen auf PII auf und ist tamper-proof
- [ ] **Passwort-Policy** erzwingt 12+ Zeichen, zxcvbn-Check, Lockout nach 5 Versuchen
- [ ] **2FA (TOTP)** kann in den Benutzereinstellungen aktiviert werden
- [ ] **Session Management** erkennt gleichzeitige Sessions, erzwingt Re-Auth bei kritischen Aktionen
- [ ] **Rate Limiting** ist fuer alle Auth-Endpunkte aktiviert
- [ ] **CSP-Header** blockieren XSS-Angriffe
- [ ] **Security-Scan** (OWASP ZAP) zeigt keine kritischen Schwachstellen

### 8.3 Rechtliche Anforderungen

- [ ] **Impressum** kann mit Veranstalter-Daten automatisch generiert werden
- [ ] **GEMA-Meldung** kann als PDF/XML exportiert werden mit allen Pflichtfeldern
- [ ] **GEMA-Erinnerung** wird 7 Tage nach Veranstaltung per E-Mail versendet
- [ ] **Kuenstler-Vertrag** ist als Vorlage hinterlegt und kann pro Veranstaltung generiert werden
- [ ] **Steuerliche Hinweise** (Kleinunternehmer-Regelung) sind in der Rechnungsvorlage integriert

### 8.4 Compliance-Dashboard

- [ ] **Einwilligungs-Status** aller Kontakte ist einsehbar mit Filter-/Suchfunktion
- [ ] **Offene GEMA-Meldungen** werden mit Ampel-Status angezeigt (rot = ueberfaellig)
- [ ] **Anstehende Loeschantraege** werden mit Countdown (Tage bis Loeschung) angezeigt
- [ ] **Audit-Log** ist durchsuchbar nach Benutzer, Zeitraum, Aktionstyp
- [ ] **Compliance-Zusammenfassung** kann als PDF-Report exportiert werden
- [ ] **Woechentliche E-Mail-Zusammenfassung** kann aktiviert werden

### 8.5 EU AI Act

- [ ] **KI-Verzeichnis** enthaelt alle KI-Systeme mit Risikoklassifizierung
- [ ] **Transparenzinformation** ist fuer jedes KI-System oeffentlich einsehbar
- [ ] **KI-Einwilligung** wird separat von anderen Einwilligungen eingeholt
- [ ] **Human-in-the-Loop** ist bei allen KI-Entscheidungen implementiert

---

## 9. Muster: Datenschutzerklaerung

```markdown
# Datenschutzerklaerung

## 1. Verantwortlicher
[Veranstalter-Name]
[Strasse Hausnummer]
[PLZ Ort]
E-Mail: [E-Mail-Adresse]

## 2. Datenschutzbeauftragter
Bei Fragen zum Datenschutz wenden Sie sich an:
[E-Mail-Adresse Datenschutz]

## 3. Welche Daten verarbeiten wir?

### 3.1 Kontaktdaten von Kuenstlern
- Name, Kuenstlername, Kontaktdaten
- Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertrag)
- Speicherdauer: 3 Jahre nach letzter Veranstaltung

### 3.2 Gaestekontaktdaten
- Name, E-Mail-Adresse (optional: Telefon)
- Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) oder lit. b (Vertrag bei Ticketkauf)
- Speicherdauer: Bis Widerruf der Einwilligung oder 2 Jahre nach Veranstaltung

### 3.3 Newsletter-Abonnenten
- E-Mail-Adresse
- Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
- Double-Opt-In Verfahren
- Speicherdauer: Bis Abmeldung

### 3.4 Nutzungsdaten (bei Einwilligung)
- IP-Adresse (gehashed), Browser-Typ, besuchte Seiten
- Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)

## 4. Ihre Rechte
Sie haben folgende Rechte:
- **Auskunft** (Art. 15 DSGVO)
- **Berichtigung** (Art. 16 DSGVO)
- **Loeschung** (Art. 17 DSGVO) - [Link zum Loeschungsportal]
- **Einschraenkung** (Art. 18 DSGVO)
- **Datenuebertragbarkeit** (Art. 20 DSGVO) - [Link zum Export-Portal]
- **Widerspruch** (Art. 21 DSGVO)

## 5. Hosting
Alle Daten werden auf Servern der Hetzner Cloud GmbH 
in Deutschland gespeichert. Es findet keine Uebertragung 
in Drittstaaten statt.

## 6. KI-Verarbeitung
Folgende KI-gestuetzten Funktionen werden eingesetzt:
[Automatisch aus ai_registry generiert]
- Zweck: [Beschreibung]
- Menschliche Ueberpruefung: Ja/Nein

## 7. Cookies
[Werden automatisch aus Cookie-Consent-Konfiguration generiert]
```

---

## 10. Muster: GEMA-Meldeformular (Datenstruktur)

```json
{
  "report_number": "GEMA-2025-0042",
  "event": {
    "title": "Open Stage - Januar 2025",
    "date": "2025-01-15",
    "start_time": "20:00",
    "venue": {
      "name": "Kulturkneipe zur Post",
      "address": "Hauptstrasse 42, 10115 Berlin",
      "capacity": 80
    }
  },
  "organizer": {
    "name": "Max Mustermann Kulturveranstaltungen",
    "gema_customer_number": "12345678",
    "contact_email": "veranstalter@example.de"
  },
  "works": [
    {
      "sequence": 1,
      "title": "Stairway to Heaven",
      "composer": "Jimmy Page, Robert Plant",
      "performers": "The Acoustic Trio",
      "duration_minutes": 8.5,
      "is_own_composition": false,
      "is_public_domain": false
    },
    {
      "sequence": 2,
      "title": "Eigenkomposition: Sommerabend",
      "composer": "Lisa Schmidt",
      "performers": "Lisa Schmidt (Solo)",
      "duration_minutes": 5.0,
      "is_own_composition": true,
      "is_public_domain": false
    }
  ],
  "total_duration_minutes": 13.5,
  "notes": "Live-Uebertragung auf Instagram (Dauer: 15 Minuten)"
}
```

---

## 11. Muster: Kuenstler-Vertrag (Vorlage)

**Vertragsvorlage-Komponenten (automatisch ausfuellbar):**

| Feld | Quelle | Automatisch? |
|------|--------|-------------|
| Veranstalter-Name | Benutzerprofil | Ja |
| Kuenstler-Name | Kontakt/Kuenstlerprofil | Ja |
| Veranstaltungsdatum | Event-Daten | Ja |
| Veranstaltungsort | Venue-Daten | Ja |
| Gage | Vertragsdaten im Event | Ja |
| Technische Anforderungen | Kuenstler-Rider | Ja |
| Unterschriften | Manuell | Nein |

---

## 12. Checkliste: Inbetriebnahme-Compliance

Vor dem Go-Live muessen folgende Punkte erledigt sein:

- [ ] AVV mit Hetzner unterzeichnet (im Kundenportal)
- [ ] Datenschutzerklaerung angepasst und veroeffentlicht
- [ ] Impressum vollstaendig ausgefuellt
- [ ] Cookie-Consent-Banner konfiguriert und getestet
- [ ] Double-Opt-In fuer Newsletter getestet
- [ ] Self-Service-Loeschungsportal funktioniert
- [ ] Datenexport getestet
- [ ] Audit-Log ist aktiv
- [ ] 2FA ist fuer Admin-Accounts aktiviert
- [ ] Backup-Verfahren dokumentiert und getestet
- [ ] Passwort-Policy ist aktiv
- [ ] Rate Limiting ist konfiguriert
- [ ] Security-Headers sind gesetzt (CSP, HSTS, X-Frame-Options)
- [ ] SSL-Zertifikat ist installiert und erneuert sich automatisch
- [ ] GEMA-Meldeformular wurde mit Beispieldaten getestet
- [ ] DSF (Datenschutz-Folgenabschaetzung) ist erstellt
- [ ] AI Registry ist fuer alle KI-Features ausgefuellt
- [ ] Penetration-Test durchgefuehrt (mindestens OWASP Top 10)

---

## 13. Risiken & Gegenmassnahmen

| Risiko | Wahrscheinlichkeit | Impact | Gegenmassnahme |
|--------|-------------------|--------|----------------|
| DSGVO-Abmahnung wegen fehlendem Double-Opt-In | Mittel | Hoch | Automatisiertes System mit Wartezeiten |
| Datenpanne durch unsichere Konfiguration | Niedrig | Kritisch | Automatisierte Security-Scans, Hardening-Guide |
| Gema-Meldeverspaetung | Hoch | Mittel | Automatische Erinnerung 7 Tage nach Event |
| Passwort-Kompromittierung | Mittel | Hoch | Argon2id, 2FA, Rate Limiting |
| AI Act Nicht-Konformitaet ab 2026 | Mittel | Hoch | Fruehzeitige Registrierung aller KI-Features |
| Backup-Verlust | Niedrig | Kritisch | 3-2-1 Backup-Strategie, taegliche Tests |

---

## 14. Naechste Schritte / Roadmap

| Phase | Zeitraum | Inhalte |
|-------|----------|---------|
| **MVP** | Q1 2025 | Consent-Management, Double-Opt-In, Cookie-Banner, Audit-Log |
| **v1.1** | Q2 2025 | Datenexport, Loeschungsportal, GEMA-Reporting |
| **v1.2** | Q3 2025 | 2FA, Impressum-Generator, Vertragsvorlagen |
| **v2.0** | Q4 2025 | Compliance-Dashboard vollstaendig, DPA-Management |
| **v2.1** | Q1 2026 | AI Registry, EU AI Act Vorbereitung, DSF-Tool |
| **v2.2** | Q2 2026 | AI Act Voll-Konformitaet, erweiterte Security-Features |

---

*Dieses Dokument wurde als Spezifikation fuer das DSGVO-Compliance- & Sicherheitsmodul der Kleinkunst-Dashboard-App erstellt. Es dient als Grundlage fuer die technische Implementierung durch das Entwicklerteam.*

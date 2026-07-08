# Dimension 5: GEMA-Integration & Finanzmodul

## Produktvision

> "Von der Budgetplanung bis zur GEMA-Nachmeldung — ein Modul, das Veranstalter finanziell entlastet, regulatorische Pflichten automatisiert und bei der Beantragung von Fördermitteln unterstützt."

---

## 1. Feature-Beschreibung

Das **GEMA & Finanzmodul** ist ein zentrales Steuerungsinstrument für Kleinkunst-Veranstalter. Es kombiniert die regulatorisch zwingende GEMA-Abwicklung (Voranmeldung, Nachmeldung, Setlist-Management) mit einer vollständigen Finanzverwaltung auf Event-Ebene. Das Modul deckt den gesamten finanziellen Lebenszyklus eines Events ab: Budgetplanung, Gagenverwaltung, Kassenführung, Fördermittel-Tracking, Steuerberechnung und Buchhaltungsexport.

### Kernziele
- **Automatisierung**: GEMA-Formulare werden aus Event-Daten vorausgefüllt
- **Transparenz**: Live-Break-Even-Analyse und Budget-Tracking
- **Compliance**: Korrekte GEMA-Meldungen und Steuerberechnungen
- **Förderung**: Systematisches Tracking und Beantragung von Zuschussprogrammen
- **Buchhaltung**: Exportfähige Daten für Steuerberater und DATEV

---

## 2. User Stories

### GEMA-Modul

**US-GEMA-01: Tarifrechner**
> **Als** Veranstalter möchte ich einen integrierten GEMA-Tarifrechner nutzen, der automatisch die voraussichtlichen GEMA-Gebühren aus meinen Event-Daten (Erwartete Besucherzahl, Ticketpreis, Location) berechnet, damit ich diese Kosten von Anfang an in meine Budgetplanung einbeziehen kann.
> 
> *Akzeptanzkriterien:*
> - U-K Tarif korrekt angewendet (5,75% der Bruttoeinnahmen bis 2.000 Besucher)
> - Mindestsatz von 23,55€ wird berücksichtigt
> - Berechnung wird automatisch aktualisiert, wenn sich die Besucherzahl ändert
> - Alternativ-Tarife (z.B. bei Sondervereinbarungen) können manuell eingestellt werden

**US-GEMA-02: Voranmeldung**
> **Als** Veranstalter möchte ich eine GEMA-Voranmeldung direkt aus dem Event erstellen, wobei alle relevanten Daten (Veranstaltungsdatum, Location, erwartete Besucherzahl, Eintrittspreis) automatisch übernommen werden, damit ich keine Daten doppelt eingeben muss und die Voranmeldung zeitnah (mind. 7 Tage vor dem Event) erledigen kann.
> 
> *Akzeptanzkriterien:*
> - Formular wird mit Event-Daten vorausgefüllt
> - GEMA Onlineportal-Format wird unterstützt (seit 07/2025 Pflicht)
> - PDF-Export des ausgefüllten Formulars
> - Status-Tracking: Entwurf → Eingereicht → Bestätigt

**US-GEMA-03: Nachmeldung**
> **Als** Veranstalter möchte ich nach dem Event die tatsächlichen Besucherzahlen und Einnahmen als GEMA-Nachmeldung übermitteln, damit meine Abrechnung korrekt ist und keine Nachzahlungen durch ungenaue Schätzungen entstehen.
> 
> *Akzeptanzkriterien:*
> - Tatsächliche Besucherzahlen werden aus der Kassenabrechnung übernommen
> - Differenz zwischen Voranmeldung und Nachmeldung wird visualisiert
> - Automatische Neuberechnung der GEMA-Gebühren
> - Historie der Nachmeldungen wird gespeichert

**US-GEMA-04: Setlist-Verwaltung**
> **Als** Veranstalter möchte ich Setlists für die GEMA-Meldung digital verwalten und gespielte Werke mit Komponist/Arrangeur/Texter erfassen können, damit die GEMA-Meldung vollständig und korrekt ist.
> 
> *Akzeptanzkriterien:*
> - Setlist pro Event/Künstler anlegbar
> - Titel, Komponist, Texter, Arrangeur, Dauer erfassbar
> - Import aus Setlist-Dateien (CSV, Text)
> - Zuordnung zur GEMA-Voranmeldung / Nachmeldung

**US-GEMA-05: Meldungshistorie**
> **Als** Veranstalter möchte ich eine übersichtliche Historie aller meiner GEMA-Meldungen (Voranmeldungen und Nachmeldungen) einsehen können, damit ich bei Kontrollen oder Rückfragen schnell die passenden Informationen finde.
> 
> *Akzeptanzkriterien:*
> - Filter nach Zeitraum, Status, Event
> - Übersicht: Datum, Event, Besucherzahl, Gebühren, Status
> - Export als PDF/CSV

### Finanzmodul

**US-FIN-01: Budgetplanung**
> **Als** Veranstalter möchte ich für jedes Event ein Budget mit Einnahmen (Ticketverkauf, Getränke, Merchandise) und Ausgaben (Gage, Location, Technik, GEMA, Versicherung, Marketing) erstellen, damit ich die finanzielle Machbarkeit vor dem Event abschätzen kann.
> 
> *Akzeptanzkriterien:*
> - Vorkonfigurierte Einnahmen- und Ausgabenkategorien
> - Eigene Kategorien anlegbar
> - Soll-/Ist-Vergleich nach dem Event
> - Templates für wiederkehrende Budgetstrukturen

**US-FIN-02: Gagen-Verwaltung**
> **Als** Veranstalter möchte ich Künstler-Gagen verwalten, inklusive vereinbarter Beträge, Zahlungsmodalitäten (Vorauszahlung, Tag der Veranstaltung, Nachzahlung), Vertragsstatus und Richtwert-Vergleich, damit ich transparent und pünktlich zahle.
> 
> *Akzeptanzkriterien:*
> - Gagen-Richtwerte (350-2.000€/Abend) als Referenz angezeigt
> - Vertrags-Tracking: Angebot → Verhandlung → Unterschrieben → Bezahlt
> - Zahlungstermine mit Erinnerungen
> - Steuerabzug nach §50a EStG für ausländische Künstler automatisch berechnet

**US-FIN-03: Break-Even-Analyse**
> **Als** Veranstalter möchte ich eine visuelle Break-Even-Analyse sehen, die mir zeigt, ab wie vielen verkauften Tickets ich profitabel bin, damit ich Preise und Kapazitäten realistisch planen kann.
> 
> *Akzeptanzkriterien:*
> - Interaktives Chart: Ticketpreis vs. Besucherzahl
> - Berücksichtigung fixer und variabler Kosten
> - Szenario-Vergleich: verschiedene Ticketpreise
> - Anzeige des Break-Even-Punkts mit konkreter Ticketanzahl

**US-FIN-04: Fördermittel-Tracking**
> **Als** Veranstalter möchte ich Fördermittel wie "Live 500" (500€ Zuschuss pro Konzert, max. 250 Gäste) in meiner Planung berücksichtigen und den Beantragungsstatus tracken, damit ich verfügbare Förderungen maximal nutze.
> 
> *Akzeptanzkriterien:*
> - Live 500 Förderung integriert mit Antragskriterien
> - Status: Prüfung → Beantragt → Bewilligt → Ausgezahlt
> - Automatische Prüfung der Förderfähigkeit (z.B. max. 250 Gäste)
> - Weitere Förderprogramme manuell hinzufügbar

**US-FIN-05: Kassenbuch / Abrechnung**
> **Als** Veranstalter möchte ich ein digitales Kassenbuch führen, in dem ich alle Einnahmen und Ausgaben am Veranstaltungstag erfasse, damit ich eine lückenlose Abrechnung habe.
> 
> *Akzeptanzkriterien:*
> - Erfassung von Bar- und Kartenzahlungen
> - Kategorisierung aller Posten
> - Abgleich mit Budget (Soll/Ist)
> - Tagesabschluss-Funktion

**US-FIN-06: Steuer-Übersicht**
> **Als** Veranstalter möchte ich eine Übersicht über die anfallende Umsatzsteuer (7% für Tickets/Veranstaltungen vs. 19% für Merchandise/Getränke) sehen, damit ich meine Steuererklärung korrekt vorbereiten kann.
> 
> *Akzeptanzkriterien:*
> - Automatische Zuordnung der Steuersätze nach Kategorie
> - Monatliche und jährliche Zusammenfassung
> - Korrekte Trennung von 7% und 19% USt.

**US-FIN-07: Buchhaltungsexport**
> **Als** Veranstalter möchte ich meine Finanzdaten als CSV oder im DATEV-Format exportieren können, damit ich sie problemlos an meinen Steuerberater übergeben kann.
> 
> *Akzeptanzkriterien:*
> - CSV-Export mit allen relevanten Feldern
> - DATEV-konformer Format-Export (Rechnungsdaten, Kassenbuch)
> - Zeitraumfilter

---

## 3. Datenmodell

### 3.1 Übersicht Tabellen/Collections

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   gema_meldungen    │     │      events         │     │  gema_setlists      │
├─────────────────────┤     ├─────────────────────┤     ├─────────────────────┤
│ id (PK)             │────▶│ id (PK)             │◄────│ id (PK)             │
│ event_id (FK)       │     │ title               │     │ gema_meldung_id(FK) │
│ meldung_type        │     │ date                │     │ song_title          │
│ status              │     │ location_id (FK)    │     │ composer            │
│ erwartete_besucher  │     │ erwartete_besucher  │     │ lyricist            │
│ tatsaechliche_besuch│     │ ticketpreis         │     │ arranger            │
│ eintrittspreis      │     │ status              │     │ duration_seconds    │
│ brutto_einnahmen    │     └─────────────────────┘     └─────────────────────┘
│ gema_gebuehr        │
│ meldedatum          │
│ gema_referenz_nr    │
│ pdf_export_url      │
│ created_at          │
│ updated_at          │
└─────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│  event_budgets      │     │  budget_positions   │     │  artist_fees        │
├─────────────────────┤     ├─────────────────────┤     ├─────────────────────┤
│ id (PK)             │────▶│ id (PK)             │     │ id (PK)             │
│ event_id (FK)       │◄────│ budget_id (FK)      │     │ event_id (FK)       │
│ soll_einnahmen      │     │ type (einnahme/ausg)│     │ artist_name         │
│ soll_ausgaben       │     │ category            │     │ vereinbarter_betrag │
│ ist_einnahmen       │     │ description         │     │ waehrung            │
│ ist_ausgaben        │     │ amount_soll         │     │ zahlungsmodus       │
│ break_even_tickets  │     │ amount_ist          │     │ zahlungstermin      │
│ foerderbetrag       │     │ tax_rate (7/19/0)   │     │ vertragsstatus      │
│ status              │     │ notes               │     │ steuerabzug_50a     │
│ created_at          │     │ receipt_url         │     │ steuerabzug_betrag  │
└─────────────────────┘     └─────────────────────┘     │ quittung_url        │
                                                        │ notes               │
                                                        └─────────────────────┘
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│  cash_register      │     │  foerdermittel      │     │  tax_summaries      │
├─────────────────────┤     ├─────────────────────┤     ├─────────────────────┤
│ id (PK)             │     │ id (PK)             │     │ id (PK)             │
│ event_id (FK)       │     │ event_id (FK)       │     │ event_id (FK)       │
│ entry_type          │     │ programm_name       │     │ monat_jahr          │
│ category            │     │ (z.B. "Live 500")   │     │ ust_7_einnahmen     │
│ description         │     │ foerderbetrag       │     │ ust_7_betrag        │
│ amount              │     │ max_gaeste          │     │ ust_19_einnahmen    │
│ payment_method      │     │ status              │     │ ust_19_betrag       │
│ tax_rate            │     │ beantragt_am        │     │ ust_0_einnahmen     │
│ timestamp           │     │ bewilligt_am        │     │ ust_gesamt          │
│ entered_by          │     │ ausgezahlt_am       │     │ exportiert_am       │
│ receipt_url         │     │ antragsnummer       │     │ datev_export_url    │
│ is_closed           │     │ dokumente_urls      │     └─────────────────────┘
│ closing_balance     │     │ notes               │
└─────────────────────┘     └─────────────────────┘
```

### 3.2 Detaillierte Feld-Spezifikation

#### Tabelle: `gema_meldungen`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, auto | Eindeutige ID |
| `event_id` | UUID | FK → events.id | Verknüpftes Event |
| `meldung_type` | ENUM | NOT NULL | `VORANMELDUNG`, `NACHMELDUNG` |
| `status` | ENUM | NOT NULL | `ENTWURF`, `EINGEREICHT`, `BESTAETIGT`, `ABGELEHNT` |
| `erwartete_besucher` | INTEGER | ≥ 0 | Bei Voranmeldung geschätzt |
| `tatsaechliche_besucher` | INTEGER | ≥ 0 | Bei Nachmeldung tatsächlich |
| `eintrittspreis` | DECIMAL(10,2) | ≥ 0 | Durchschnittlicher Ticketpreis |
| `brutto_einnahmen` | DECIMAL(10,2) | ≥ 0 | Berechnet: Besucher × Preis |
| `gema_gebuehr` | DECIMAL(10,2) | ≥ 0 | Berechnet: max(5,75% × Einnahmen, 23,55€) |
| `tarif_satz` | DECIMAL(5,4) | DEFAULT 0.0575 | Verwendeter Tarifsatz (5,75%) |
| `mindestsatz` | DECIMAL(10,2) | DEFAULT 23.55 | Geltender Mindestsatz |
| `meldedatum` | DATE | | Datum der Einreichung |
| `gema_referenz_nr` | VARCHAR(50) | | Referenznummer von GEMA |
| `pdf_export_url` | VARCHAR(500) | | Pfad zum generierten PDF |
| `created_at` | TIMESTAMP | DEFAULT now() | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | DEFAULT now() | Letzte Änderung |

#### Tabelle: `gema_setlists`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, auto | Eindeutige ID |
| `gema_meldung_id` | UUID | FK → gema_meldungen.id | Zugehörige Meldung |
| `event_id` | UUID | FK → events.id | Verknüpftes Event |
| `song_title` | VARCHAR(255) | NOT NULL | Titel des Werks |
| `composer` | VARCHAR(255) | | Komponist |
| `lyricist` | VARCHAR(255) | | Texter |
| `arranger` | VARCHAR(255) | | Arrangeur |
| `duration_seconds` | INTEGER | ≥ 0 | Spieldauer in Sekunden |
| `is_aufgezeichnet` | BOOLEAN | DEFAULT false | Wurde das Werk aufgezeichnet? |
| `is_arrangement` | BOOLEAN | DEFAULT false | Handelt es sich um ein Arrangement? |
| `sort_order` | INTEGER | DEFAULT 0 | Reihenfolge in der Setlist |
| `created_at` | TIMESTAMP | DEFAULT now() | |

#### Tabelle: `event_budgets`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, auto | Eindeutige ID |
| `event_id` | UUID | FK → events.id, UNIQUE | 1:1 zu Event |
| `template_id` | UUID | FK → budget_templates.id | Optional: Budgetvorlage |
| `soll_einnahmen` | DECIMAL(12,2) | DEFAULT 0 | Geplante Einnahmen |
| `soll_ausgaben` | DECIMAL(12,2) | DEFAULT 0 | Geplante Ausgaben |
| `ist_einnahmen` | DECIMAL(12,2) | DEFAULT 0 | Tatsächliche Einnahmen |
| `ist_ausgaben` | DECIMAL(12,2) | DEFAULT 0 | Tatsächliche Ausgaben |
| `break_even_ticket_preis` | DECIMAL(8,2) | | Ticketpreis für Break-Even |
| `break_even_besucher` | INTEGER | | Benötigte Besucher für Break-Even |
| `foerderbetrag` | DECIMAL(10,2) | DEFAULT 0 | Bewilligte Förderung |
| `currency` | VARCHAR(3) | DEFAULT 'EUR' | Währung |
| `status` | ENUM | | `GEPLANT`, `AKTIV`, `ABGERECHNET` |
| `notes` | TEXT | | Interne Notizen |
| `created_at` | TIMESTAMP | | |
| `updated_at` | TIMESTAMP | | |

#### Tabelle: `budget_positions`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, auto | |
| `budget_id` | UUID | FK → event_budgets.id | |
| `type` | ENUM | NOT NULL | `EINNAHME`, `AUSGABE` |
| `category` | VARCHAR(100) | NOT NULL | Kategorie (siehe unten) |
| `description` | VARCHAR(255) | NOT NULL | Bezeichnung |
| `amount_soll` | DECIMAL(10,2) | | Geplanter Betrag |
| `amount_ist` | DECIMAL(10,2) | | Tatsächlicher Betrag |
| `tax_rate` | ENUM | DEFAULT '7' | `0`, `7`, `19` |
| `is_fix` | BOOLEAN | DEFAULT false | Fixkosten? |
| `is_variabel` | BOOLEAN | DEFAULT true | Variable Kosten? |
| `payment_status` | ENUM | | `OFFEN`, `TEILBEZAHLT`, `BEZAHLT` |
| `due_date` | DATE | | Fälligkeitsdatum |
| `receipt_url` | VARCHAR(500) | | Beleg/Quittung |
| `notes` | TEXT | | Notizen |
| `created_at` | TIMESTAMP | | |
| `updated_at` | TIMESTAMP | | |

**Vorkonfigurierte Kategorien:**

| Einnahmen | Ausgaben |
|-----------|----------|
| `TICKETVERKAUF` | `KUENSTLER_GAGE` |
| `GETRAENKE` | `LOCATION_MIETE` |
| `MERCHANDISE` | `TECHNIK` |
| `FOERDERUNG` | `GEMA_GEBUEHR` |
| `SPENDEN` | `VERSICHERUNG` |
| `SONSTIGES` | `MARKETING` |
| | `PERSONAL` |
| | `CATERING` |
| | `UNTERBRINGUNG` |
| | `REISEKOSTEN` |
| | `STEUERABZUG_50A` |
| | `SONSTIGES` |

#### Tabelle: `artist_fees`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, auto | |
| `event_id` | UUID | FK → events.id | |
| `artist_name` | VARCHAR(255) | NOT NULL | Name des Künstlers |
| `artist_contact` | VARCHAR(255) | | Kontakt/E-Mail |
| `vereinbarter_betrag` | DECIMAL(10,2) | NOT NULL | Netto-Gage |
| `waehrung` | VARCHAR(3) | DEFAULT 'EUR' | |
| `zahlungsmodus` | ENUM | | `VORAUSZAHLUNG`, `VERANSTALTUNGSTAG`, `NACHZAHLUNG`, `RATEN` |
| `zahlungstermin` | DATE | | Konkreter Termin |
| `anerkannt_am` | DATE | | Wann wurde die Gage vereinbart? |
| `vertragsstatus` | ENUM | DEFAULT `ANGEFRAGT` | `ANGEFRAGT`, `VERHANDLUNG`, `UNTERSCHRIEBEN`, `STORNIERT` |
| `vertrag_url` | VARCHAR(500) | | Vertragsdokument |
| `kuenstler_ist_auslaender` | BOOLEAN | DEFAULT false | Für §50a EStG |
| `steuerabzug_50a` | BOOLEAN | DEFAULT false | Steuerabzug anwendbar? |
| `steuerabzug_satz` | DECIMAL(5,2) | DEFAULT 0 | Abzugssatz (typisch 15-30%) |
| `steuerabzug_betrag` | DECIMAL(10,2) | | Berechneter Abzugsbetrag |
| `auszahlungsbetrag` | DECIMAL(10,2) | | Betrag nach Abzug |
| `ist_bezahlt` | BOOLEAN | DEFAULT false | |
| `bezahlt_am` | DATE | | |
| `richtwert_min` | DECIMAL(10,2) | | System-Richtwert min |
| `richtwert_max` | DECIMAL(10,2) | | System-Richtwert max |
| `notes` | TEXT | | |
| `created_at` | TIMESTAMP | | |
| `updated_at` | TIMESTAMP | | |

#### Tabelle: `cash_register`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, auto | |
| `event_id` | UUID | FK → events.id | |
| `entry_type` | ENUM | NOT NULL | `EINNAHME`, `AUSGABE` |
| `category` | VARCHAR(100) | NOT NULL | Kategorie |
| `description` | VARCHAR(255) | NOT NULL | Beschreibung |
| `amount` | DECIMAL(10,2) | NOT NULL | Betrag (immer positiv) |
| `payment_method` | ENUM | NOT NULL | `BAR`, `EC_KARTE`, `KREDITKARTE`, `UEBERWEISUNG`, `SONSTIGES` |
| `tax_rate` | ENUM | DEFAULT '7' | `0`, `7`, `19` |
| `timestamp` | TIMESTAMP | NOT NULL | Zeitpunkt der Buchung |
| `entered_by` | VARCHAR(100) | | Wer hat gebucht? |
| `receipt_url` | VARCHAR(500) | | Belegfoto/-scan |
| `is_closed` | BOOLEAN | DEFAULT false | Tagesabschluss durchgeführt? |
| `closing_id` | UUID | | Referenz zum Tagesabschluss |
| `created_at` | TIMESTAMP | | |

#### Tabelle: `foerdermittel`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, auto | |
| `event_id` | UUID | FK → events.id | |
| `programm_name` | VARCHAR(100) | NOT NULL | z.B. "Live 500" |
| `programm_key` | VARCHAR(50) | NOT NULL | `LIVE_500`, `KULTURPass`, etc. |
| `foerderbetrag` | DECIMAL(10,2) | | Bewilligter Betrag |
| `max_gaeste` | INTEGER | | Max. Gäste für Förderfähigkeit |
| `status` | ENUM | DEFAULT `PRUEFUNG` | `PRUEFUNG`, `BEANTRAGT`, `BEWILLIGT`, `ABGELEHNT`, `AUSGEZAHLT` |
| `beantragt_am` | DATE | | |
| `bewilligt_am` | DATE | | |
| `ausgezahlt_am` | DATE | | |
| `antragsnummer` | VARCHAR(50) | | Vom Fördergeber vergebene Nummer |
| `antragsurl` | VARCHAR(500) | | Link zum Online-Antrag |
| `dokumente_urls` | JSON | | Array von Dokument-URLs |
| `is_eligible` | BOOLEAN | | Automatisch geprüfte Förderfähigkeit |
| `eligibility_reason` | VARCHAR(255) | | Grund für (Nicht-)Förderfähigkeit |
| `notes` | TEXT | | |
| `created_at` | TIMESTAMP | | |
| `updated_at` | TIMESTAMP | | |

#### Tabelle: `tax_summaries`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, auto | |
| `event_id` | UUID | FK → events.id | |
| `zeitraum_monat` | INTEGER | NOT NULL | Monat (1-12) |
| `zeitraum_jahr` | INTEGER | NOT NULL | Jahr |
| `ust_7_einnahmen` | DECIMAL(12,2) | DEFAULT 0 | Summe 7% USt. Einnahmen |
| `ust_7_betrag` | DECIMAL(12,2) | DEFAULT 0 | USt.-Betrag 7% |
| `ust_19_einnahmen` | DECIMAL(12,2) | DEFAULT 0 | Summe 19% USt. Einnahmen |
| `ust_19_betrag` | DECIMAL(12,2) | DEFAULT 0 | USt.-Betrag 19% |
| `ust_0_einnahmen` | DECIMAL(12,2) | DEFAULT 0 | Steuerbefreite Einnahmen |
| `ust_gesamt` | DECIMAL(12,2) | DEFAULT 0 | Gesamt-USt. |
| `vorsteuer` | DECIMAL(12,2) | DEFAULT 0 | Ggf. Vorsteuer |
| `ust_zu_zahlen` | DECIMAL(12,2) | DEFAULT 0 | Netto-USt. zu zahlen |
| `exportiert_am` | TIMESTAMP | | |
| `datev_export_url` | VARCHAR(500) | | |
| `created_at` | TIMESTAMP | | |
| `updated_at` | TIMESTAMP | | |

#### Tabelle: `budget_templates`

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, auto | |
| `name` | VARCHAR(100) | NOT NULL | Template-Name |
| `description` | TEXT | | Beschreibung |
| `category` | VARCHAR(50) | | z.B. "Konzert", "Lesung", "Kabarett" |
| `positions` | JSON | NOT NULL | Array von Standardpositionen |
| `is_default` | BOOLEAN | DEFAULT false | System-Template? |
| `created_by` | UUID | | NULL = System-Template |
| `created_at` | TIMESTAMP | | |

---

## 4. API-Endpunkte

### 4.1 GEMA-Modul Endpunkte

#### GEMA-Meldungen

```
GET    /api/v1/events/{eventId}/gema-meldungen
       → Liste aller GEMA-Meldungen für ein Event
       Query: ?type=VORANMELDUNG|NACHMELDUNG&status=...

GET    /api/v1/events/{eventId}/gema-meldungen/{meldungId}
       → Einzelne GEMA-Meldung mit Details

POST   /api/v1/events/{eventId}/gema-meldungen
       → Neue GEMA-Meldung erstellen
       Body: { meldung_type, erwartete_besucher?, tatsaechliche_besucher?, ... }

PUT    /api/v1/events/{eventId}/gema-meldungen/{meldungId}
       → GEMA-Meldung aktualisieren

PATCH  /api/v1/events/{eventId}/gema-meldungen/{meldungId}/status
       → Status-Update (z.B. auf EINGEREICHT)
       Body: { status, gema_referenz_nr? }

DELETE /api/v1/events/{eventId}/gema-meldungen/{meldungId}
       → Meldung löschen (nur im Status ENTWURF)

POST   /api/v1/events/{eventId}/gema-meldungen/{meldungId}/calculate
       → GEMA-Gebühren neu berechnen
       Response: { gema_gebuehr, tarif_satz, mindestsatz, brutto_einnahmen }

GET    /api/v1/events/{eventId}/gema-meldungen/{meldungId}/export/pdf
       → PDF-Export der Meldung
       Query: ?format=GEMA|INTERN
```

#### GEMA-Tarifrechner

```
POST   /api/v1/gema/tarifrechner
       → GEMA-Gebühren berechnen
       Body: { besucherzahl, eintrittspreis, tarif_satz?, mindestsatz? }
       Response: { brutto_einnahmen, gema_gebuehr, tarif_satz, mindestsatz, nachweis }

GET    /api/v1/gema/tarife
       → Verfügbare Tarife und Mindestsätze abrufen
       Response: [{ name, satz, mindestsatz, gueltig_ab, gueltig_bis, beschreibung }]
```

#### Setlist-Verwaltung

```
GET    /api/v1/events/{eventId}/gema-meldungen/{meldungId}/setlist
       → Setlist einer Meldung abrufen

POST   /api/v1/events/{eventId}/gema-meldungen/{meldungId}/setlist
       → Einzelnen Titel zur Setlist hinzufügen
       Body: { song_title, composer, lyricist, arranger, duration_seconds, ... }

POST   /api/v1/events/{eventId}/gema-meldungen/{meldungId}/setlist/import
       → Setlist aus CSV/Text importieren
       Body: multipart/form-data (file)

PUT    /api/v1/events/{eventId}/gema-meldungen/{meldungId}/setlist/{entryId}
       → Setlist-Eintrag bearbeiten

DELETE /api/v1/events/{eventId}/gema-meldungen/{meldungId}/setlist/{entryId}
       → Setlist-Eintrag entfernen

PATCH  /api/v1/events/{eventId}/gema-meldungen/{meldungId}/setlist/reorder
       → Reihenfolge ändern
       Body: { entries: [{ id, sort_order }] }
```

#### GEMA-Historie

```
GET    /api/v1/gema/historie
       → Alle GEMA-Meldungen des Nutzers
       Query: ?from=YYYY-MM-DD&to=YYYY-MM-DD&status=&eventId=

GET    /api/v1/gema/historie/export
       → Historie als CSV/PDF exportieren
       Query: ?format=csv|pdf&from=&to=
```

### 4.2 Finanzmodul Endpunkte

#### Budget-Management

```
GET    /api/v1/events/{eventId}/budget
       → Budget eines Events abrufen

POST   /api/v1/events/{eventId}/budget
       → Budget für Event erstellen
       Body: { template_id?, positions: [...] }

PUT    /api/v1/events/{eventId}/budget
       → Budget aktualisieren

DELETE /api/v1/events/{eventId}/budget
       → Budget löschen

GET    /api/v1/events/{eventId}/budget/positions
       → Alle Budgetpositionen

POST   /api/v1/events/{eventId}/budget/positions
       → Neue Budgetposition

PUT    /api/v1/events/{eventId}/budget/positions/{positionId}
       → Budgetposition aktualisieren

DELETE /api/v1/events/{eventId}/budget/positions/{positionId}
       → Budgetposition löschen
```

#### Break-Even-Analyse

```
GET    /api/v1/events/{eventId}/budget/break-even
       → Break-Even-Analyse
       Query: ?ticket_preis_range=10-50&schritte=20
       Response: {
         break_even_punkt: { besucher, einnahmen, ausgaben },
         szenarien: [
           { ticket_preis, break_even_besucher, gewinn_bei_50%, gewinn_bei_75%, gewinn_bei_100% }
         ],
         chart_data: [...]
       }
```

#### Künstler-Gagen

```
GET    /api/v1/events/{eventId}/artist-fees
       → Alle Gagen eines Events

POST   /api/v1/events/{eventId}/artist-fees
       → Neue Gage anlegen

PUT    /api/v1/events/{eventId}/artist-fees/{feeId}
       → Gage aktualisieren

PATCH  /api/v1/events/{eventId}/artist-fees/{feeId}/status
       → Status/Zahlung aktualisieren
       Body: { vertragsstatus, ist_bezahlt, bezahlt_am }

GET    /api/v1/artist-fees/richtwerte
       → Gagen-Richtwerte abrufen
       Query: ?genre=&erfahrung=&event_groesse=
       Response: [{ kategorie, min, max, median, quelle }]
```

#### Kassenbuch

```
GET    /api/v1/events/{eventId}/cash-register
       → Kassenbuch-Einträge
       Query: ?from=&to=&category=&payment_method=

POST   /api/v1/events/{eventId}/cash-register
       → Neuen Eintrag erstellen
       Body: { entry_type, category, description, amount, payment_method, tax_rate, timestamp }

PUT    /api/v1/events/{eventId}/cash-register/{entryId}
       → Eintrag bearbeiten

DELETE /api/v1/events/{eventId}/cash-register/{entryId}
       → Eintrag löschen

POST   /api/v1/events/{eventId}/cash-register/closing
       → Tagesabschluss durchführen
       Body: { closing_balance, counted_cash }
       Response: { difference, is_balanced, entries_affected }

GET    /api/v1/events/{eventId}/cash-register/summary
       → Kassen-Zusammenfassung
       Response: { total_einnahmen, total_ausgaben, balance, by_category, by_payment_method }
```

#### Fördermittel

```
GET    /api/v1/events/{eventId}/foerdermittel
       → Fördermittel eines Events

POST   /api/v1/events/{eventId}/foerdermittel
       → Fördermittel hinzufügen
       Body: { programm_key, programm_name, foerderbetrag, ... }

PUT    /api/v1/events/{eventId}/foerdermittel/{foerderId}
       → Fördermittel aktualisieren

PATCH  /api/v1/events/{eventId}/foerdermittel/{foerderId}/status
       → Status ändern

POST   /api/v1/events/{eventId}/foerdermittel/check-eligibility
       → Förderfähigkeit prüfen
       Response: { is_eligible, reasons: [], programm_key, conditions_met: {} }

GET    /api/v1/foerdermittel/programs
       → Verfügbare Förderprogramme
       Response: [{ key, name, beschreibung, max_betrag, bedingungen, antragsurl }]
```

#### Steuer-Übersicht

```
GET    /api/v1/finanz/steuer/uebersicht
       → Steuerübersicht
       Query: ?monat=1-12&jahr=YYYY
       Response: {
         ust_7: { netto, ust_betrag, brutto },
         ust_19: { netto, ust_betrag, brutto },
         ust_0: { netto, ust_betrag: 0, brutto },
         gesamt_ust_zu_zahlen,
         details_by_event: [...]
       }

GET    /api/v1/finanz/steuer/zusammenfassung/{jahr}
       → Jahreszusammenfassung für Steuererklärung
```

#### Export

```
POST   /api/v1/finanz/export/csv
       → CSV-Export
       Body: { zeitraum: { from, to }, typ: 'KASSENBUCH'|'BUDGET'|'STEUER', event_ids? }

POST   /api/v1/finanz/export/datev
       → DATEV-konformer Export
       Body: { zeitraum: { from, to }, format: 'RE'|'KO', event_ids? }
       Response: { download_url, format_details, pruefsumme }

GET    /api/v1/finanz/export/templates
       → Verfügbare Export-Templates
```

### 4.3 Zusammenfassung API-Routing-Tabelle

| Methode | Pfad | Beschreibung | Auth |
|---------|------|-------------|------|
| GET | `/api/v1/events/{eid}/gema-meldungen` | GEMA-Meldungen liste | JWT |
| POST | `/api/v1/events/{eid}/gema-meldungen` | GEMA-Meldung erstellen | JWT |
| PUT | `/api/v1/events/{eid}/gema-meldungen/{mid}` | GEMA-Meldung updaten | JWT |
| PATCH | `/api/v1/events/{eid}/gema-meldungen/{mid}/status` | Status ändern | JWT |
| POST | `/api/v1/gema/tarifrechner` | Tarif berechnen | JWT |
| GET | `/api/v1/events/{eid}/gema-meldungen/{mid}/setlist` | Setlist abrufen | JWT |
| POST | `/api/v1/events/{eid}/gema-meldungen/{mid}/setlist` | Setlist-Titel hinzufügen | JWT |
| POST | `/api/v1/events/{eid}/gema-meldungen/{mid}/setlist/import` | Setlist importieren | JWT |
| GET | `/api/v1/gema/historie` | GEMA-Historie | JWT |
| GET | `/api/v1/events/{eid}/budget` | Budget abrufen | JWT |
| POST | `/api/v1/events/{eid}/budget` | Budget erstellen | JWT |
| PUT | `/api/v1/events/{eid}/budget` | Budget aktualisieren | JWT |
| GET | `/api/v1/events/{eid}/budget/break-even` | Break-Even-Analyse | JWT |
| GET | `/api/v1/events/{eid}/artist-fees` | Gagen-Liste | JWT |
| POST | `/api/v1/events/{eid}/artist-fees` | Gage anlegen | JWT |
| PUT | `/api/v1/events/{eid}/artist-fees/{fid}` | Gage aktualisieren | JWT |
| GET | `/api/v1/artist-fees/richtwerte` | Richtwerte | JWT (optional) |
| GET | `/api/v1/events/{eid}/cash-register` | Kassenbuch | JWT |
| POST | `/api/v1/events/{eid}/cash-register` | Kassen-Eintrag | JWT |
| POST | `/api/v1/events/{eid}/cash-register/closing` | Tagesabschluss | JWT |
| GET | `/api/v1/events/{eid}/foerdermittel` | Fördermittel | JWT |
| POST | `/api/v1/events/{eid}/foerdermittel` | Fördermittel anlegen | JWT |
| POST | `/api/v1/events/{eid}/foerdermittel/check-eligibility` | Förderfähigkeit prüfen | JWT |
| GET | `/api/v1/finanz/steuer/uebersicht` | Steuer-Übersicht | JWT |
| POST | `/api/v1/finanz/export/csv` | CSV-Export | JWT |
| POST | `/api/v1/finanz/export/datev` | DATEV-Export | JWT |

---

## 5. UI-Komponenten

### 5.1 Komponenten-Hierarchie

```
App
├── GEMA-Modul
│   ├── GemaDashboard                  # Übersicht aller GEMA-Meldungen
│   │   ├── GemaStatsCards             # KPI-Karten (offene Meldungen, Gesamtgebühren)
│   │   ├── GemaMeldungenTable         # Tabelle mit Filter/Sortierung
│   │   └── GemaTimeline               # Timeline der Meldungen
│   ├── GemaTarifrechner               # Tarifrechner-Komponente
│   │   ├── TarifrechnerForm           # Eingabeformular
│   │   ├── TarifrechnerResult         # Ergebnisanzeige
│   │   └── TarifComparisonChart       # Vergleich versch. Szenarien
│   ├── GemaMeldungForm                # Voranmeldung/Nachmeldung Formular
│   │   ├── EventDataAutoFill          # Automatische Datenübernahme
│   │   ├── BesucherEingabe            # Besucherzahl-Eingabe
│   │   ├── EinnahmenBerechnung        # Automatische Einnahmenberechnung
│   │   ├── GebuehrenAnzeige           → bindet TarifrechnerResult ein
│   │   └── PdfPreview                 # PDF-Vorschau vor Export
│   ├── GemaSetlistManager             # Setlist-Verwaltung
│   │   ├── SetlistTable               # Tabelle der Titel
│   │   ├── SetlistEntryForm           # Formular für einzelnen Titel
│   │   ├── SetlistImport              # CSV/Text-Import
│   │   └── SetlistReorder             # Drag&Drop-Reihenfolge
│   └── GemaHistorie                   # Meldungshistorie
│       ├── HistorieFilterBar          # Filter (Zeitraum, Status, Event)
│       ├── HistorieTabelle            # Detaillierte Tabelle
│       └── HistorieExportButton       # Export-Button
│
├── Finanzmodul
│   ├── FinanzDashboard                # Finanzübersicht
│   │   ├── FinanzKpiCards             # KPIs (Gesamteinnahmen, -ausgaben, Saldo)
│   │   ├── MonatsChart                # Balken-/Linienchart Monatsvergleich
│   │   └── FinanzStatusRing           # Ringdiagramm Status-Verteilung
│   ├── BudgetPlaner                   # Budget-Planung
│   │   ├── BudgetTemplateSelector     # Vorlagenauswahl
│   │   ├── BudgetPositionForm         # Einnahme/Ausgabe-Formular
│   │   ├── BudgetTable                # Budget-Tabelle mit Soll/Ist
│   │   ├── BudgetSollIstChart         # Soll/Ist-Vergleich Chart
│   │   └── BudgetKategorienPie        # Kreisdiagramm Kategorien
│   ├── BreakEvenAnalyse               # Break-Even-Analyse
│   │   ├── BreakEvenChart             # Haupt-Chart (interaktiv)
│   │   ├── BreakEvenControls          # Steuerung (Ticketpreis-Slider)
│   │   ├── BreakEvenSzenarioTable     # Szenario-Vergleichstabelle
│   │   └── BreakEvenResultCard        # Ergebniskarte
│   ├── ArtistFeeManager               # Gagen-Verwaltung
│   │   ├── ArtistFeeCard              # Karte pro Künstler
│   │   ├── ArtistFeeForm              # Gage-Formular
│   │   ├── FeeRichtwertBadge          # Richtwert-Anzeige (350-2.000€)
│   │   ├── Steuerabzug50aCalc         # §50a EStG Rechner
│   │   └── ContractStatusTimeline     # Vertragsstatus-Timeline
│   ├── CashRegister                   # Digitales Kassenbuch
│   │   ├── CashEntryForm              # Schnelleingabe-Formular
│   │   ├── CashEntryList              # Liste der Einträge
│   │   ├── CashSummaryCards           # Summen-Karten
│   │   ├── CashClosingButton          # Tagesabschluss-Button
│   │   └── CashDifferenceAlert        # Differenz-Warnung
│   ├── FoerdermittelTracker           # Fördermittel-Tracking
│   │   ├── FoerderProgrammCard        # Programm-Übersichtskarte
│   │   ├── FoerderStatusBadge         # Status-Badge
│   │   ├── FoerderEligibilityCheck    # Automatische Fähigkeitsprüfung
│   │   └── FoerderAntragLink          # Direktlink zum Antrag
│   ├── SteuerUebersicht               # Steuer-Übersicht
│   │   ├── SteuerRateCards            # 7% / 19% / 0% Karten
│   │   ├── SteuerMonatsChart          # Monatliche USt.-Entwicklung
│   │   ├── SteuerDetailsTable         |# Detaillierte Aufschlüsselung
│   │   └── SteuerExportButton         # Export für Steuerberater
│   └── ExportCenter                   # Export-Zentrale
│       ├── ExportFormatSelector       # CSV / DATEV Auswahl
│       ├── ExportDateRangePicker      # Zeitraum-Auswahl
│       ├── ExportPreview              # Vorschau der Daten
│       └── ExportDownloadButton       # Download-Button
│
└── Shared
    ├── CurrencyInput                  # Währungs-Eingabefeld
    ├── PercentageDisplay              # Prozent-Anzeige mit Farbcodierung
    ├── StatusBadge                    # Status-Badge (Farbe je Status)
    ├── DateRangeFilter                |# Zeitraum-Filter
    ├── ChartContainer                 # Chart-Wrapper (Responsive)
    └── PdfViewer                      # PDF-Vorschau
```

### 5.2 Chart-Komponenten (Detailliert)

| Komponente | Chart-Typ | Library | Beschreibung |
|------------|-----------|---------|--------------|
| `BreakEvenChart` | Linien/Flächen-Chart | Recharts | Interaktiv: X=Besucher, Y=€, Fixe Kosten-Linie, Variable Kosten-Linie, Einnahmen-Linie, Break-Even-Punkt markiert |
| `BudgetSollIstChart` | Gruppierte Balken | Recharts | Pro Kategorie: Soll (grau) vs. Ist (grün/rot je nach Überschreitung) |
| `BudgetKategorienPie` | Donut-Chart | Recharts | Verteilung der Ausgabenkategorien, interaktive Legende |
| `MonatsChart` | Kombiniert Linien+Bar | Recharts | Monatliche Einnahmen (Balken) und kumulierter Saldo (Linie) |
| `TarifComparisonChart` | Balken-Chart | Recharts | Vergleich GEMA-Gebühren bei versch. Besucherzahlen |
| `FinanzStatusRing` | Ring-Chart | Recharts | Verteilung der Event-Finanzstatus (profitabel, break-even, Verlust) |
| `SteuerMonatsChart` | Gestapelte Balken | Recharts | 7% USt. + 19% USt. + Steuerfrei pro Monat |
| `CashFlowChart` | Wasserfall-Chart | Recharts | Einnahmen → Ausgaben → Saldo Schritt für Schritt |

### 5.3 React-Komponenten-Spezifikation (Beispiele)

#### BreakEvenChart
```typescript
interface BreakEvenChartProps {
  fixedCosts: number;           // Fixe Kosten (€)
  variableCostPerVisitor: number; // Variable Kosten pro Besucher (€)
  ticketPrice: number;          // Ticketpreis (€)
  capacity: number;             // Maximale Kapazität
  currentVisitors?: number;     // Aktuelle erwartete Besucherzahl
  onBreakEvenChange?: (be: BreakEvenPoint) => void;
}

interface BreakEvenPoint {
  visitors: number;
  revenue: number;
  ticketPrice: number;
}
```

#### GemaTarifrechner
```typescript
interface GemaTarifrechnerProps {
  initialVisitors?: number;
  initialTicketPrice?: number;
  onCalculate?: (result: GemaCalculationResult) => void;
  readOnly?: boolean;
}

interface GemaCalculationResult {
  bruttoEinnahmen: number;
  gemaGebuehr: number;
  tarifSatz: number;    // 0.0575
  mindestsatz: number;  // 23.55
  nachweisText: string; // "Berechnet nach U-K Tarif: 5,75% der Bruttoeinnahmen, mind. 23,55€"
}
```

---

## 6. Integrationen

### 6.1 Externe APIs und Services

| Service | Integrationstyp | Zweck | Status |
|---------|----------------|-------|--------|
| **GEMA Onlineportal** | Keine API verfügbar | Automatisierte Einreichung nicht möglich | 🔴 BLOCKIERT |
| **Browser-Automation (Puppeteer/Playwright)** | Headless Browser | Formular-AutoFill und PDF-Export aus GEMA-Portal | 🟡 ALTERNATIV |
| **PDF-Generator (jsPDF/react-pdf)** | Library | PDF-Export der Meldeformulare | 🟢 VERFÜGBAR |
| **CSV-Parser (PapaParse)** | Library | Import/Export von Setlists und Finanzdaten | 🟢 VERFÜGBAR |
| **DATEV-Format-Export** | Eigenimplementierung | Konformer Buchhaltungsexport | 🟢 MÖGLICH |
| **Live 500 Portal** | Keine API bekannt | Förderantrag manuell verlinken | 🟡 MANUELL |
| **E-Mail-Service (SendGrid/AWS SES)** | API | Erinnerungen an GEMA-Fristen, Zahlungserinnerungen | 🟢 VERFÜGBAR |
| **Kalender-Integration (ICS Export)** | iCal-Format | GEMA-Meldefristen im Kalender anzeigen | 🟢 VERFÜGBAR |

### 6.2 GEMA-Abwicklung ohne öffentliche API — Automatisierungsstrategie

Da die GEMA **keine öffentliche API** anbietet und das Onlineportal seit 07/2025 Pflicht ist, wird eine **mehrstufige Automatisierungsstrategie** verfolgt:

#### Stufe 1: Formular-Vorausfüllung & PDF-Export (MVP)
**Status: Pflichtfunktion**

1. **Datenübernahme aus Event**: Alle relevanten Daten (Datum, Location, Besucherzahl, Preis) werden automatisch aus dem Event-Modul übernommen
2. **Intelligente Formulare**: Das Modul generiert ausgefüllte GEMA-Formulare als PDF im offiziellen Layout
3. **Benutzer lädt PDF hoch**: Der Veranstalter lädt das generierte PDF im GEMA-Portal hoch
4. **Status-Tracking**: Nach manueller Einreichung wird der Status auf "EINGEREICHT" gesetzt

```
[Event-Daten] → [GEMA-Formular-Generator] → [PDF-Export] → [Manueller Upload im GEMA-Portal]
                                                        ↓
                                              [Status-Update durch Nutzer]
```

#### Stufe 2: Browser-AutoFill (Erweitert)
**Status: Optional, technisch anspruchsvoll**

- Chrome/Firefox **Browser Extension** entwickeln
- Extension erkennt GEMA-Portal-Formulare und füllt sie automatisch
- Kommunikation über `window.postMessage` oder Background-Script
- Setzt Login im GEMA-Portal voraus

```
[Dashboard-App] ←──(verschlüsselt)──→ [Browser Extension] → [AutoFill GEMA-Portal]
```

**Technischer Stack:**
- Manifest V3 Browser Extension
- Content Script für Formular-Erkennung
- Background Service Worker für Daten-Transfer
- Optional: Native Messaging für lokale App-Kommunikation

#### Stufe 3: Headless-Browser-Automation (Experimentell)
**Status: Nicht empfohlen, rechtlich/technisch riskant**

- Puppeteer/Playwright würde GEMA-Portal automatisieren
- **Risiken**: Änderungen am Portal brechen Automation, TOS-Verstoß möglich, rechtliche Grauzone
- **Nur als letzte Option**, wenn Stufe 1+2 nicht ausreichen

#### Stufe 4: Lobbying für API-Zugang (Langfristig)
**Status: Empfohlen für Verbands-Kooperation**

- Gemeinsam mit Kulturbüros/Verbänden auf GEMA zugehen
- API-Zugang für registrierte Veranstalter-Software beantragen
- Referenz: Andere Länder (z.B. UK PRS) bieten APIs an

### 6.3 Datenfluss-Diagramm (GEMA)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         GEMA-ABWICKLUNG                                  │
└─────────────────────────────────────────────────────────────────────────┘

PHASE 1: PLANUNG (t-30 bis t-7 Tage vor Event)
┌──────────────┐     ┌─────────────────┐     ┌──────────────────────┐
│   Event      │────▶│  GEMA-Tarif-    │────▶│  Budgetintegration   │
│   anlegen    │     │  rechner        │     │  (GEMA als Kosten-   │
│              │     │  (5,75% /      │     │   postion)           │
│              │     │   23,55€ min)   │     │                      │
└──────────────┘     └─────────────────┘     └──────────────────────┘
                                                        │
PHASE 2: VORANMELDUNG (t-7 Tage)                        ▼
┌──────────────┐     ┌─────────────────┐     ┌──────────────────────┐
│  Event-Daten │────▶│  Voranmeldung   │────▶│  PDF-Export          │
│  (auto-fill) │     │  Formular       │     │  (offizielles Layout)│
│              │     │                 │     │                      │
└──────────────┘     └─────────────────┘     └──────────────────────┘
                                                        │
                                                        ▼
                                               ┌──────────────────────┐
                                               │  Upload im GEMA-     │
                                               │  Onlineportal        │
                                               │  (manuell)           │
                                               └──────────────────────┘
                                                        │
PHASE 3: EVENT                                        Status-Update
┌──────────────┐                                       durch Nutzer
│  Kassenbuch  │
│  (live)      │
└──────────────┘
       │
       ▼
PHASE 4: NACHMELDUNG (nach Event)
┌──────────────┐     ┌─────────────────┐     ┌──────────────────────┐
│  Tatsächliche│────▶│  Nachmeldung    │────▶│  Differenz-          │
│  Besucher +  │     │  (auto-fill aus │     │  berechnung          │
│  Einnahmen   │     │   Kassenbuch)   │     │  (Nachzahlung/Erst.) │
└──────────────┘     └─────────────────┘     └──────────────────────┘
                                                        │
                                               ┌──────────────────────┐
                                               │  Upload im GEMA-     │
                                               │  Portal + Setlist    │
                                               └──────────────────────┘
PHASE 5: HISTORIE
┌─────────────────────────────────────────────────────────────────────┐
│  Alle Meldungen gespeichert, filterbar, exportierbar               │
│  → Referenz für Kontrollen, Jahresabrechnung, Steuer               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Technische Details

### 7.1 Verwendete Libraries

| Kategorie | Library | Version | Zweck |
|-----------|---------|---------|-------|
| **Charts** | `recharts` | ^2.x | Alle Chart-Visualisierungen (React-nativ) |
| **PDF-Export** | `@react-pdf/renderer` | ^3.x | GEMA-Formular-PDFs, Abrechnungen |
| **PDF-Anzeige** | `react-pdf` | ^7.x | PDF-Vorschau im Browser |
| **CSV** | `papaparse` | ^5.x | CSV-Import/Export |
| **Excel** | `xlsx` (SheetJS) | ^0.18.x | Excel-Export für Buchhaltung |
| **Datev-Export** | Eigenimplementierung | - | DATEV-konformer CSV-Export (Format RE/KO) |
| **Formulare** | `react-hook-form` | ^7.x | Formular-State-Management |
| **Validierung** | `zod` | ^3.x | Schema-Validierung |
| **Datum** | `date-fns` | ^2.x | Datumsoperationen, Fristenberechnung |
| **Tabellen** | `@tanstack/react-table` | ^8.x | Sortierbare/filterbare Tabellen |
| **Drag & Drop** | `@dnd-kit/core` | ^6.x | Setlist-Reihenfolge ändern |
| **Browser Ext.** | `webextension-polyfill` | ^0.10.x | GEMA-Portal AutoFill (optional) |
| **QR-Code** | `qrcode.react` | ^3.x | Verlinkung App ↔ Browser Extension |
| **Printing** | `react-to-print` | ^2.x | Druckoptimierte Ausgabe |

### 7.2 GEMA-Tarif-Berechnungsalgorithmus

```typescript
// Algorithmus: GEMA U-K Tarif Berechnung
interface GemaBerechnungInput {
  besucherzahl: number;
  eintrittspreis: number;
  tarifSatz?: number;      // Default: 0.0575 (5,75%)
  mindestsatz?: number;    // Default: 23.55
}

interface GemaBerechnungResult {
  bruttoEinnahmen: number;
  prozentualeGebuehr: number;
  gemaGebuehr: number;     // max(prozentual, mindestsatz)
  tarifSatzAngewandt: number;
  mindestsatzAngewandt: boolean;
  nachweisText: string;
}

function berechneGemaGebuehr(input: GemaBerechnungInput): GemaBerechnungResult {
  const tarifSatz = input.tarifSatz ?? 0.0575;
  const mindestsatz = input.mindestsatz ?? 23.55;
  
  const bruttoEinnahmen = input.besucherzahl * input.eintrittspreis;
  const prozentualeGebuehr = bruttoEinnahmen * tarifSatz;
  const gemaGebuehr = Math.max(prozentualeGebuehr, mindestsatz);
  const mindestsatzAngewandt = gemaGebuehr === mindestsatz;
  
  const nachweisText = mindestsatzAngewandt
    ? `GEMA-Gebühr: ${mindestsatz.toFixed(2)}€ (Mindestsatz nach U-K Tarif, da ${prozentualeGebuehr.toFixed(2)}€ < ${mindestsatz.toFixed(2)}€)`
    : `GEMA-Gebühr: ${gemaGebuehr.toFixed(2)}€ (${(tarifSatz * 100).toFixed(2)}% von ${bruttoEinnahmen.toFixed(2)}€ Bruttoeinnahmen)`;
  
  return {
    bruttoEinnahmen,
    prozentualeGebuehr,
    gemaGebuehr,
    tarifSatzAngewandt: tarifSatz,
    mindestsatzAngewandt,
    nachweisText
  };
}
```

### 7.3 Break-Even-Berechnungsalgorithmus

```typescript
// Algorithmus: Break-Even-Analyse
interface BreakEvenInput {
  fixedCosts: number;           // € (Location, Technik, Gage, Versicherung...)
  variableCostPerVisitor: number; // € pro Besucher (GEMA, Getränke-Cost...)
  ticketPrice: number;          // € Durchschnittlicher Ticketpreis
  capacity: number;             // Maximale Besucherzahl
}

interface BreakEvenResult {
  breakEvenVisitors: number;    // Aufrunden!
  breakEvenRevenue: number;
  isProfitable: boolean;
  marginAtCapacity: number;
  roiAtCapacity: number;
}

function berechneBreakEven(input: BreakEvenInput): BreakEvenResult {
  // Break-Even: Einnahmen = Kosten
  // p * x = FC + v * x
  // x = FC / (p - v)
  const contributionMargin = input.ticketPrice - input.variableCostPerVisitor;
  
  if (contributionMargin <= 0) {
    return {
      breakEvenVisitors: Infinity,
      breakEvenRevenue: Infinity,
      isProfitable: false,
      marginAtCapacity: -Infinity,
      roiAtCapacity: -100
    };
  }
  
  const breakEvenVisitors = Math.ceil(input.fixedCosts / contributionMargin);
  const breakEvenRevenue = breakEvenVisitors * input.ticketPrice;
  
  const revenueAtCapacity = input.capacity * input.ticketPrice;
  const costsAtCapacity = input.fixedCosts + (input.variableCostPerVisitor * input.capacity);
  const profitAtCapacity = revenueAtCapacity - costsAtCapacity;
  
  return {
    breakEvenVisitors,
    breakEvenRevenue,
    isProfitable: breakEvenVisitors <= input.capacity,
    marginAtCapacity: profitAtCapacity,
    roiAtCapacity: (profitAtCapacity / costsAtCapacity) * 100
  };
}

// Szenario-Vergleich: Verschiedene Ticketpreise
function berechneBreakEvenSzenarien(
  baseInput: Omit<BreakEvenInput, 'ticketPrice'>,
  ticketPriceRange: { min: number; max: number; steps: number }
): BreakEvenResult[] {
  const results: BreakEvenResult[] = [];
  const stepSize = (ticketPriceRange.max - ticketPriceRange.min) / ticketPriceRange.steps;
  
  for (let i = 0; i <= ticketPriceRange.steps; i++) {
    const ticketPrice = ticketPriceRange.min + (i * stepSize);
    const result = berechneBreakEven({ ...baseInput, ticketPrice });
    results.push({ ...result, ticketPrice });
  }
  
  return results;
}
```

### 7.4 Steuerberechnung (7% vs. 19% USt.)

```typescript
// Steuerkategorien-Mapping
const TAX_CATEGORIES: Record<string, number> = {
  // 7% USt. - Kulturgüter, Veranstaltungen
  TICKETVERKAUF: 7,
  FOERDERUNG: 0,     // Steuerbefreit
  
  // 19% USt. - Standard
  MERCHANDISE: 19,
  GETRAENKE: 19,
  
  // Ausgaben
  KUENSTLER_GAGE: 0,  // Reverse-Charge / netto
  LOCATION_MIETE: 0,  // i.d.R. steuerbefreit (Grundstücksverkehr) oder 19%
  TECHNIK: 19,
  GEMA_GEBUEHR: 7,    // Kulturgut
  VERSICHERUNG: 19,
  MARKETING: 19,
  CATERING: 19,
  REISEKOSTEN: 7,     // Beförderung
};

function berechneSteuer(betragBrutto: number, steuersatz: number): SteuerErgebnis {
  if (steuersatz === 0) {
    return { netto: betragBrutto, ust: 0, brutto: betragBrutto };
  }
  
  const netto = betragBrutto / (1 + steuersatz / 100);
  const ust = betragBrutto - netto;
  
  return {
    netto: Math.round(netto * 100) / 100,
    ust: Math.round(ust * 100) / 100,
    brutto: betragBrutto
  };
}
```

### 7.5 §50a EStG Steuerabzug für ausländische Künstler

```typescript
// §50a EStG - Steuerabzug bei ausländischen Künstlern
interface Steuerabzug50aInput {
  gageNetto: number;
  kuenstlerIstAuslaender: boolean;
  doppelbesteuerungsabkommen?: boolean;  // DBA vorhanden?
  ermaessigterSatz?: boolean;             // Ggf. ermäßigter Satz
}

function berechneSteuerabzug50a(input: Steuerabzug50aInput) {
  if (!input.kuenstlerIstAuslaender) {
    return {
      abzugspflichtig: false,
      abzugssatz: 0,
      abzugsbetrag: 0,
      auszahlungsbetrag: input.gageNetto
    };
  }
  
  // Standard: 15% bei Künstlern (§50a Abs. 4 Nr. 2 EStG)
  // Ohne DBA oder bei Nicht-Anwendung des ermäßigten Satzes
  let abzugssatz = 0.15;
  
  if (input.ermaessigterSatz && input.doppelbesteuerungsabkommen) {
    // DBA-Satz, typisch 0% oder reduziert
    abzugssatz = 0; // Je nach DBA
  }
  
  const abzugsbetrag = input.gageNetto * abzugssatz;
  
  return {
    abzugspflichtig: true,
    abzugssatz,
    abzugsbetrag: Math.round(abzugsbetrag * 100) / 100,
    auszahlungsbetrag: Math.round((input.gageNetto - abzugsbetrag) * 100) / 100
  };
}
```

### 7.6 DATEV-Export-Format

```typescript
// DATEV-konformer Export (Format RE / Buchungsstapel)
// DATEV erwartet CSV mit spezifischem Header und Feldern

const DATEV_HEADER = [
  'Umsatz (ohne Soll/Haben-Kz)',
  'Soll/Haben-Kennzeichen',
  'WKZ Umsatz',
  'Kurs',
  'Basis-Umsatz',
  'WKZ Basis-Umsatz',
  'Konto',
  'Gegenkonto',
  'BU-Schlüssel',
  'Belegdatum',
  'Belegfeld 1',
  'Belegfeld 2',
  'Skonto',
  'Buchungstext',
  'Postensperre',
  'Diverse Adressnummer',
  'Geschäftspartnerbank',
  'Sachverhalt',
  'Zinssperre',
  'Beleglink',
  // ... weitere DATEV-Felder
];

interface DatevBuchung {
  umsatz: number;
  sollHaben: 'S' | 'H';
  konto: number;        // z.B. 8400 (Erlöse 7% USt.)
  gegenkonto: number;   // z.B. 1200 (Bank) oder 1000 (Kasse)
  buSchluessel: string; // z.B. "9" für 7% USt.
  belegdatum: string;   // DDMM
  belegfeld1: string;   // Belegnummer
  buchungstext: string;
}
```

### 7.7 Datenbank-Indizes

```sql
-- Performance-kritische Indizes
CREATE INDEX idx_gema_meldungen_event ON gema_meldungen(event_id);
CREATE INDEX idx_gema_meldungen_status ON gema_meldungen(status);
CREATE INDEX idx_gema_meldungen_created ON gema_meldungen(created_at);
CREATE INDEX idx_gema_setlists_meldung ON gema_setlists(gema_meldung_id);
CREATE INDEX idx_budgets_event ON event_budgets(event_id);
CREATE INDEX idx_budget_positions_budget ON budget_positions(budget_id);
CREATE INDEX idx_budget_positions_type ON budget_positions(type);
CREATE INDEX idx_artist_fees_event ON artist_fees(event_id);
CREATE INDEX idx_cash_register_event ON cash_register(event_id);
CREATE INDEX idx_cash_register_timestamp ON cash_register(timestamp);
CREATE INDEX idx_foerdermittel_event ON foerdermittel(event_id);
CREATE INDEX idx_tax_summaries_zeitraum ON tax_summaries(zeitraum_jahr, zeitraum_monat);
```

### 7.8 Sicherheit & Datenschutz

| Aspekt | Maßnahme |
|--------|----------|
| **Finanzdaten** | Verschlüsselte Speicherung (AES-256) |
| **Bankverbindungen** | NIEMALS speichern - nur Kontonummern für DATEV |
| **Künstler-Daten** | DSGVO-konform, Löschfristen beachten |
| **GEMA-Zugangsdaten** | NICHT speichern - Veranstalter loggt sich selbst ein |
| **PDF-Exports** | Signierte/verschlüsselte PDFs für Integrität |
| **Zugriffskontrolle** | Rollenbasiert: Admin, Buchhalter, Viewer |

---

## 8. Akzeptanzkriterien

### 8.1 GEMA-Modul

| ID | Kriterium | Priorität | Test-Methode |
|----|-----------|-----------|-------------|
| GEMA-AK-01 | Tarifrechner berechnet korrekt: 100 Besucher × 15€ = 1.500€ × 5,75% = **86,25€** | Muss | Unit-Test |
| GEMA-AK-02 | Tarifrechner berechnet korrekt: 10 Besucher × 10€ = 100€ × 5,75% = 5,75€ → **Mindestsatz 23,55€** | Muss | Unit-Test |
| GEMA-AK-03 | Voranmeldung-Formular wird zu ≥90% aus Event-Daten vorausgefüllt | Muss | E2E-Test |
| GEMA-AK-04 | PDF-Export enthält alle Pflichtfelder einer GEMA-Meldung | Muss | Manueller Test |
| GEMA-AK-05 | Nachmeldung übernimmt tatsächliche Besucherzahlen aus Kassenbuch | Muss | Integrationstest |
| GEMA-AK-06 | Differenz zwischen Vor- und Nachmeldung wird korrekt berechnet | Muss | Unit-Test |
| GEMA-AK-07 | Setlist unterstützt Import aus CSV mit mindestens Titel, Komponist, Texter | Soll | E2E-Test |
| GEMA-AK-08 | Setlist-Reihenfolge ist per Drag&Drop änderbar | Soll | E2E-Test |
| GEMA-AK-09 | Historie zeigt alle Meldungen chronologisch sortiert | Muss | E2E-Test |
| GEMA-AK-10 | Historie ist nach Zeitraum, Status und Event filterbar | Muss | E2E-Test |
| GEMA-AK-11 | Fristen-Reminder (7 Tage vor Event für Voranmeldung) wird versendet | Soll | Integrationstest |

### 8.2 Finanzmodul

| ID | Kriterium | Priorität | Test-Methode |
|----|-----------|-----------|-------------|
| FIN-AK-01 | Budget erstellt automatisch GEMA-Kostenposition aus Tarifrechner | Muss | Integrationstest |
| FIN-AK-02 | Budget unterstützt ≥20 Einnahmen- und ≥20 Ausgabenpositionen | Muss | E2E-Test |
| FIN-AK-03 | Soll/Ist-Vergleich wird korrekt berechnet und visualisiert | Muss | E2E-Test |
| FIN-AK-04 | Break-Even-Analyse zeigt korrekten Punkt bei Fixkosten 2.000€, Ticketpreis 20€, variable Kosten 2€/Person: **112 Besucher** | Muss | Unit-Test |
| FIN-AK-05 | Break-Even-Chart ist interaktiv (Ticketpreis-Slider) | Soll | E2E-Test |
| FIN-AK-06 | Gagen-Richtwerte (350-2.000€) werden als Referenz angezeigt | Muss | E2E-Test |
| FIN-AK-07 | §50a EStG Steuerabzug wird für ausländische Künstler korrekt berechnet | Muss | Unit-Test |
| FIN-AK-08 | Vertragsstatus-Tracking funktioniert (ANGEFRAGT → VERHANDLUNG → UNTERSCHRIEBEN → BEZAHLT) | Muss | E2E-Test |
| FIN-AK-09 | Live 500 Förderfähigkeit wird automatisch geprüft (≤250 Gäste) | Muss | Unit-Test |
| FIN-AK-10 | Förderstatus wird korrekt getrackt (PRÜFUNG → BEANTRAGT → BEWILLIGT → AUSGEZAHLT) | Muss | E2E-Test |
| FIN-AK-11 | Kassenbuch unterstützt Bar- und Kartenzahlungen | Muss | E2E-Test |
| FIN-AK-12 | Tagesabschluss berechnet Kassenbestand und zeigt Differenz an | Muss | Integrationstest |
| FIN-AK-13 | Steuer-Übersicht trennt korrekt 7% und 19% USt. | Muss | Unit-Test |
| FIN-AK-14 | CSV-Export enthält alle relevanten Felder mit korrektem Trennzeichen | Muss | E2E-Test |
| FIN-AK-15 | DATEV-Export erzeugt valide CSV-Datei mit korrektem Header | Soll | Manueller Test |
| FIN-AK-16 | Gesamtladezeit des Finanz-Dashboards < 2 Sekunden | Soll | Performance-Test |

### 8.3 Definition of Done

Ein Feature gilt als **done**, wenn:

1. **Code** implementiert und reviewed ist (min. 1 Approval)
2. **Unit-Tests** vorhanden sind (Coverage ≥ 80% für Business-Logik)
3. **Integrationstests** für API-Endpunkte vorhanden sind
4. **E2E-Tests** für kritische User Flows vorhanden sind
5. **UI-Komponenten** im Storybook dokumentiert sind
6. **Accessibility** geprüft ist (WCAG 2.1 AA)
7. **Mobile-Ansicht** (Responsive) funktioniert
8. **PDF-Export** korrekt gerendert wird
9. **Datenvalidierung** client- und serverseitig implementiert ist
10. **Error-Handling** für alle Fehlerfälle implementiert ist
11. **I18n** (deutsche Texte) implementiert ist
12. **CHANGELOG** aktualisiert ist

---

## Anhang A: GEMA-Tarif-Übersicht (Recherche-Stand)

| Tarif | Satz | Mindestsatz | Gültig für |
|-------|------|-------------|------------|
| **U-K (Urfassung Konzert)** | 5,75% der Bruttoeinnahmen | 23,55€ | Konzerte bis 2.000 Besucher |
| U-K (über 2.000 Besucher) | Staffelung | Staffelung | Nach GEMA-Tarifstaffel |

**Hinweis:** Tarifsätze können sich ändern. Die App muss konfigurierbare Tarife unterstützen.

## Anhang B: Förderprogramme (Initial)

| Programm | Betrag | Bedingungen | Antrags-Link |
|----------|--------|-------------|--------------|
| **Live 500** | 500€/Konzert | Max. 250 Gäste, gewerbliche Veranstalter, Deutschland | [live500.de](https://www.live500.de) |
| NEUSTART KULTUR | Variabel | Projektförderung | [Kulturstaatsministerin](https://www.kulturstaatsministerin.de) |
| Lokalprogramme | Variabel | Je nach Bundesland/Kommune | Individuell |

## Anhang C: Versicherungs-Richtwerte

| Versicherung | Deckungssumme | Jährliche Praxis (ca.) |
|-------------|---------------|----------------------|
| **Veranstalterhaftpflicht** | Bis 500 Personen | 95-106€ |
| Veranstalterhaftpflicht | Bis 1.000 Personen | 120-150€ |
| Veranstalterhaftpflicht | Bis 2.000 Personen | 180-220€ |
| Ausfallversicherung | Einzelveranstaltung | 2-5% der Eventkosten |

---

*Dokument erstellt: Dimension 5 - GEMA-Integration & Finanzmodul*
*Status: Spezifikation v1.0*
*Letzte Aktualisierung: Recherche-Stand 2025*

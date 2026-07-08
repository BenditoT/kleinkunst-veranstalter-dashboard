# Dimension 6: KI-Integration — Modul-Spezifikation
## Dashboard-App fuer Kleinkunst-Veranstalter

---

## 1. Feature-Beschreibung

Das KI-Modul ist ein zentrales Assistenzsystem innerhalb der Dashboard-App, das Veranstaltern mithilfe generativer KI wiederkehrende Text- und Bildaufgaben automatisiert. Es deckt den gesamten Lifecycle einer Veranstaltungskommunikation ab: Von der Erstellung ueberzeugender Event-Beschreibungen ueber plattformspezifische Social-Media-Posts bis hin zur mehrsprachigen Uebersetzung und Bildgenerierung fuer Flyer.

Das Modul unterstuetzt **drei Betriebsmodi**:
1. **Cloud-KI (OpenAI API)** — GPT-4o-mini fuer Text, DALL-E 3 fuer Bilder — kostenguenstig, sofort einsatzbereit
2. **Lokale KI (Ollama/LM Studio)** — Llama 3.1, Mistral 7B etc. — maximale Datenschutzkonformitaet, einmalige Hardware-Investition
3. **Hybrid-Modus** — Intelligente Routing-Entscheidung basierend auf Sensitivitaet der Daten und Kostenpraefereenz

**Zentrale Value Proposition:** Ein Veranstalter kann innerhalb von Sekunden einen kompletten Werbetext-Paket fuer eine neue Veranstaltung generieren — inklusive Event-Beschreibung, 5 Social-Media-Varianten, Pressemitteilung und dazugehoerigem Flyer-Bild — und dies alles in mehreren Sprachen.

---

## 2. User Stories

### US-1: Event-Beschreibung generieren
> **Als** Veranstalter moechte ich auf Basis von Stichworten (Kuenstlername, Genre, Location, Datum) eine ueberzeugende Event-Beschreibung generieren lassen, damit ich Zeit sparen kann und dennoch professionelle Texte fuer meine Veranstaltungen erhalte.
>
> **Akzeptanzkriterien:**
> - Eingabefelder: Kuenstlername, Genre, Location, Datum, Uhrzeit, Besonderheiten (optional)
> - Tonauswahl wird beruecksichtigt (professionell, locker, poetisch, ueberzeugend)
> - Maximale Zeichenlaenge ist konfigurierbar
> - Generierter Text ist in einem Rich-Text-Editor editierbar
> - Ein-Klick-UEbernahme in die Event-Erstellung

### US-2: Plattformspezifische Social-Media-Posts
> **Als** Veranstalter moechte ich fuer dieselbe Veranstaltung automatisch angepasste Posts fuer Instagram, Facebook, Twitter/X, TikTok und LinkedIn generieren lassen, damit ich die Inhalte nicht manuell auf jede Plattform zuschneiden muss.
>
> **Akzeptanzkriterien:**
> - Zeichenlimits werden pro Plattform eingehalten (Twitter: 280, Instagram: 2.200, etc.)
> - Plattformspezifische Formatierung (Hashtags, Emojis, @-Mentions je nach Plattform-Kultur)
> - Vorschau pro Plattform mit Live-Rendering
> - Bulk-Export aller Varianten als JSON/CSV
> - Hashtag-Vorschlaege basierend auf Genre und Location

### US-3: Pressemitteilung erstellen
> **Als** Veranstalter moechte ich mit einem Klick eine vollstaendige Pressemitteilung im standardisierten Format (Titel, Untertitel, Lead, Haupttext, Boilerplate, Kontakt) generieren lassen, damit ich diese direkt an Medienvertreter versenden kann.
>
> **Akzeptanzkriterien:**
> - Standard-Pressemitteilungs-Struktur (DIN 5008 kompatibel)
> - Automatische Einbettung von Event-Daten (Datum, Location, Kuenstler)
> - Optionales Anhaengen von Zitaten (Veranstalter, Kuenstler)
> - PDF-Export der Pressemitteilung
> - Adressaten-Verwaltung (Medienkontakte) fuer Direktversand

### US-4: Newsletter-Text generieren
> **Als** Veranstalter moechte ich ansprechende Newsletter-Texte fuer meine Abonnenten generieren lassen, die kommende Veranstaltungen vorstellen und zum Ticketkauf animieren, damit ich meine E-Mail-Marketing-Effektivitaet steigere.
>
> **Akzeptanzkriterien:**
> - Personalisierungs-Platzhalter werden unterstuetzt ({{Vorname}}, {{Stadt}})
> - Betreffzeilen werden separat generiert (A/B-Test-Vorschlaege)
> - Call-to-Action-Formulierungen sind konfigurierbar
> - HTML- und Plain-Text-Ausgabe
> - Integration mit Newsletter-Provider (Mailchimp, Sendinblue)

### US-5: Bilder fuer Event-Flyer generieren
> **Als** Veranstalter moechte ich auf Basis meiner Event-Beschreibung passende Bilder fuer Flyer und Social-Media-Posts generieren lassen, damit ich auch ohne Grafikdesign-Erfahrung professionelle Werbemittel erstellen kann.
>
> **Akzeptanzkriterien:**
> - Bildgenerierung aus Event-Kontext (automatischer Prompt aus Event-Daten)
> - Stilauswahl (Fotorealistisch, Illustration, Aquarell, Comic, etc.)
> - Seitenverhaeltnis-Auswahl (1:1 Instagram, 9:16 Stories, 3:4 Flyer, 16:9 Banner)
> - Variationen-Generierung (4 Alternativen pro Prompt)
> - Download in hoher Aufloesung (min. 1024x1024)
> - Kostenanzeige vor Generierung

### US-6: Mehrsprachige Uebersetzung
> **Als** Veranstalter in Grenzregionen (z.B. Suedtirol, Elsass) moechte ich meine generierten Texte automatisch in mehrere Sprachen uebersetzen lassen, damit ich meine Veranstaltungen fuer ein breiteres Publikum bewerben kann.
>
> **Akzeptanzkriterien:**
> - Unterstuetzte Sprachen: Deutsch, Englisch, Franzoesisch, Italienisch, Spanisch, Niederlaendisch
> - Kontextsensitive Uebersetzung (Fachbegriffe des Veranstaltungswesens)
> - Beibehaltung der Formatierung und Platzhalter
> - Bulk-Uebersetzung eines kompletten Text-Pakets
> - Qualitaetsindikator (Konfidenz-Score)

### US-7: KI-Konfiguration und Datenschutz
> **Als** datenschutzbewusster Veranstalter moechte ich waehlen koennen, ob meine Daten an Cloud-Anbieter gesendet werden oder lokal verarbeitet werden, damit ich die DSGVO-Konformitaet meiner Datenverarbeitung gewaehrleisten kann.
>
> **Akzeptanzkriterien:**
> - Klare Auswahl: Cloud-KI / Lokale KI / Hybrid
> - Einwilligungs-Dialog vor erstem Cloud-KI-Nutzung
> - DPA-Information wird angezeigt (OpenAI Zero-Retention)
> - Bei lokaler KI: Verbindungstest zum Ollama-Server
> - Kostenuebersicht pro Nutzung bei Cloud-KI

### US-8: Prompt-Templates verwalten
> **Als** erfahrener Nutzer moechte ich eigene Prompt-Templates erstellen und speichern koennen, damit ich die KI-Ausgaben meinem persoenlichen Stil anpassen kann und wiederkehrende Anforderungen nicht jedes Mal neu eintippen muss.
>
> **Akzeptanzkriterien:**
> - Template-Editor mit Platzhalter-System ({{event.title}}, {{event.artist}}, etc.)
> - Template-Kategorien und Tags
> - Oeffentliche und private Templates
> - Template-Vorschau mit Testdaten
> - Import/Export von Templates

---

## 3. Datenmodell

### 3.1 Tabelle: `ai_providers`

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `name` | VARCHAR(50) | Anzeigename (z.B. "OpenAI GPT-4o-mini") |
| `provider_type` | ENUM | `openai`, `ollama`, `lmstudio`, `custom` |
| `api_base_url` | VARCHAR(255) | Endpunkt-URL (bei Ollama: http://localhost:11434) |
| `api_key_encrypted` | TEXT | Verschluesselter API-Key (NULL bei lokaler KI) |
| `model_name` | VARCHAR(100) | Modellbezeichnung (gpt-4o-mini, llama3.1, etc.) |
| `is_active` | BOOLEAN | Aktiv/Inaktiv |
| `is_local` | BOOLEAN | true fuer Ollama/LM Studio |
| `cost_per_1k_input_tokens` | DECIMAL(10,6) | Kosten pro 1K Input-Tokens (NULL bei lokal) |
| `cost_per_1k_output_tokens` | DECIMAL(10,6) | Kosten pro 1K Output-Tokens (NULL bei lokal) |
| `cost_per_image` | DECIMAL(10,6) | Kosten pro Bild (NULL bei lokal) |
| `max_tokens` | INTEGER | Maximale Token-Limit des Modells |
| `supports_images` | BOOLEAN | Bildgenerierung unterstuetzt? |
| `supports_streaming` | BOOLEAN | Streaming-Responses unterstuetzt? |
| `organization_id` | UUID (FK) | Zugehoerige Organisation |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Aktualisierung |

### 3.2 Tabelle: `prompt_templates`

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `name` | VARCHAR(200) | Template-Name (z.B. "Event-Beschreibung — Poetisch") |
| `category` | ENUM | `event_description`, `social_media`, `press_release`, `newsletter`, `email_subject`, `translation`, `custom` |
| `subcategory` | VARCHAR(50) | Feinere Kategorisierung (z.B. "instagram", "twitter") |
| `system_prompt` | TEXT | System-Prompt fuer die KI |
| `user_prompt_template` | TEXT | User-Prompt mit Platzhaltern |
| `tone` | ENUM | `professional`, `casual`, `poetic`, `persuasive`, `humorous`, `formal` |
| `target_length` | VARCHAR(20) | `short` (<500 Zeichen), `medium` (500-1500), `long` (1500+) |
| `max_output_tokens` | INTEGER | Maximale Output-Laenge |
| `temperature` | DECIMAL(3,2) | Kreativitaet (0.0 — deterministisch, 1.0 — maximal kreativ) |
| `language` | VARCHAR(10) | Standardsprache (de, en, fr, it, es, nl) |
| `is_builtin` | BOOLEAN | Vom System bereitgestellt vs. benutzerdefiniert |
| `is_public` | BOOLEAN | Fuer alle Nutzer der Organisation sichtbar |
| `organization_id` | UUID (FK) | Zugehoerige Organisation |
| `created_by` | UUID (FK) | Nutzer, der das Template erstellt hat |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Aktualisierung |

**Platzhalter-System fuer Templates:**
```
{{event.title}}         — Event-Titel
{{event.artist}}        — Kuenstlername
{{event.genre}}         — Genre/Stilrichtung
{{event.venue}}         — Veranstaltungsort
{{event.date}}          — Datum
{{event.time}}          — Uhrzeit
{{event.description}}   — Event-Beschreibung (Rohdaten)
{{event.ticket_price}}  — Ticketpreis
{{event.special_notes}} — Besonderheiten
{{org.name}}            — Organisationsname
{{org.city}}            — Standort der Organisation
{{custom.XXX}}          — Benutzerdefinierte Platzhalter
```

### 3.3 Tabelle: `ai_generations`

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `generation_type` | ENUM | `text`, `image`, `translation` |
| `use_case` | ENUM | `event_description`, `social_media`, `press_release`, `newsletter`, `email_subject`, `flyer_image`, `translation`, `custom` |
| `platform` | VARCHAR(50) | Bei Social Media: instagram, facebook, twitter, tiktok, linkedin |
| `provider_id` | UUID (FK) | Verwendeter KI-Provider |
| `template_id` | UUID (FK) | Verwendetes Template (optional) |
| `input_data` | JSONB | Eingabedaten (Event-Daten, Stichworte, etc.) |
| `input_tokens` | INTEGER | Anzahl Input-Tokens |
| `output_text` | TEXT | Generierter Text |
| `output_image_url` | VARCHAR(500) | URL des generierten Bildes |
| `output_metadata` | JSONB | Zusaetzliche Metadaten (Finish-Reason, Model-Version) |
| `output_tokens` | INTEGER | Anzahl Output-Tokens |
| `temperature_used` | DECIMAL(3,2) | Verwendete Temperatur |
| `language_source` | VARCHAR(10) | Quellsprache |
| `language_target` | VARCHAR(10) | Zielsprache (bei Uebersetzung) |
| `cost_eur` | DECIMAL(10,6) | Tatsaechliche Kosten in EUR |
| `generation_time_ms` | INTEGER | Dauer der Generierung in Millisekunden |
| `status` | ENUM | `pending`, `streaming`, `completed`, `failed`, `cancelled` |
| `error_message` | TEXT | Fehlermeldung bei Status `failed` |
| `event_id` | UUID (FK) | Verknuepfung mit Event (optional) |
| `user_id` | UUID (FK) | Nutzer, der die Generierung ausgeloest hat |
| `organization_id` | UUID (FK) | Zugehoerige Organisation |
| `created_at` | TIMESTAMP | Zeitpunkt der Generierung |

### 3.4 Tabelle: `ai_usage`

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `period_month` | DATE | Monat der Abrechnung (YYYY-MM-01) |
| `organization_id` | UUID (FK) | Organisation |
| `provider_id` | UUID (FK) | Verwendeter Provider |
| `total_text_generations` | INTEGER | Anzahl Text-Generierungen |
| `total_image_generations` | INTEGER | Anzahl Bild-Generierungen |
| `total_translations` | INTEGER | Anzahl Uebersetzungen |
| `total_input_tokens` | BIGINT | Summe aller Input-Tokens |
| `total_output_tokens` | BIGINT | Summe aller Output-Tokens |
| `total_cost_eur` | DECIMAL(12,6) | Gesamtkosten in EUR |
| `avg_response_time_ms` | INTEGER | Durchschnittliche Antwortzeit |
| `updated_at` | TIMESTAMP | Letzte Aktualisierung |

**Unique Constraint:** (`period_month`, `organization_id`, `provider_id`)

### 3.5 Tabelle: `ai_consent`

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID (PK) | Primaerschluessel |
| `user_id` | UUID (FK) | Nutzer |
| `organization_id` | UUID (FK) | Organisation |
| `consent_type` | ENUM | `cloud_ai_usage`, `data_processing`, `marketing_ai` |
| `consent_given` | BOOLEAN | Einwilligung erteilt? |
| `consent_date` | TIMESTAMP | Zeitpunkt der Einwilligung |
| `ip_address` | VARCHAR(45) | IP-Adresse bei Einwilligung |
| `revoked_at` | TIMESTAMP | Zeitpunkt der Widerrufung (NULL wenn aktiv) |
| `dpa_version` | VARCHAR(20) | Version der DPA, die akzeptiert wurde |

### 3.6 Beziehungen (ER-Diagramm — textuell)

```
organizations ||--o{ ai_providers : "hat"
organizations ||--o{ prompt_templates : "besitzt"
organizations ||--o{ ai_generations : "erzeugt"
organizations ||--o{ ai_usage : "abrechnet"
organizations ||--o{ ai_consent : "hat"
ai_providers ||--o{ ai_generations : "wird verwendet in"
ai_providers ||--o{ ai_usage : "wird abgerechnet in"
prompt_templates ||--o{ ai_generations : "wird verwendet in"
events ||--o{ ai_generations : "generiert fuer"
users ||--o{ ai_generations : "loest aus"
users ||--o{ prompt_templates : "erstellt"
users ||--o{ ai_consent : "gibt"
```

---

## 4. API-Endpunkte

### 4.1 KI-Generierung (Text)

```
POST   /api/v1/ai/generate/text
GET    /api/v1/ai/generate/:generationId
DELETE /api/v1/ai/generate/:generationId
GET    /api/v1/ai/generate/:generationId/stream    (SSE-Streaming)
```

**Request-Body (POST /api/v1/ai/generate/text):**
```json
{
  "template_id": "uuid-oder-null",
  "use_case": "event_description",
  "platform": null,
  "provider_id": "uuid",
  "input_data": {
    "event": {
      "title": "Jazz im Park 2024",
      "artist": "Miles Davis Tribute Band",
      "genre": "Jazz / Fusion",
      "venue": "Stadtpark Amphitheater",
      "date": "2024-08-15",
      "time": "19:30",
      "description": "Eine Hommage an den Prince of Darkness",
      "ticket_price": "25 EUR",
      "special_notes": "Picknick mitbringen erlaubt"
    }
  },
  "tone": "poetic",
  "target_length": "medium",
  "language": "de",
  "temperature": 0.8,
  "stream": true
}
```

**Response:**
```json
{
  "id": "gen-uuid",
  "status": "completed",
  "output_text": "Tauchen Sie ein in einen Sommerabend voller Jazz...",
  "input_tokens": 245,
  "output_tokens": 312,
  "cost_eur": 0.00078,
  "generation_time_ms": 2340,
  "created_at": "2024-07-20T15:30:00Z"
}
```

### 4.2 KI-Generierung (Bild)

```
POST   /api/v1/ai/generate/image
GET    /api/v1/ai/generate/image/:generationId
DELETE /api/v1/ai/generate/image/:generationId
```

**Request-Body:**
```json
{
  "use_case": "flyer_image",
  "provider_id": "uuid",
  "prompt": "Ein Jazz-Konzert im Stadtpark bei Sonnenuntergang...",
  "style": "illustration",
  "aspect_ratio": "3:4",
  "variations": 4,
  "event_id": "uuid"
}
```

### 4.3 Bulk-Generierung (Komplettpaket)

```
POST /api/v1/ai/generate/package
GET  /api/v1/ai/generate/package/:packageId
```

**Request-Body:**
```json
{
  "event_id": "uuid",
  "provider_id": "uuid",
  "package_type": "event_marketing",
  "deliverables": [
    { "use_case": "event_description", "tone": "professional" },
    { "use_case": "social_media", "platform": "instagram", "tone": "casual" },
    { "use_case": "social_media", "platform": "twitter", "tone": "casual" },
    { "use_case": "social_media", "platform": "facebook", "tone": "casual" },
    { "use_case": "press_release", "tone": "formal" },
    { "use_case": "email_subject", "count": 3 },
    { "use_case": "flyer_image", "style": "illustration", "aspect_ratio": "3:4" }
  ],
  "languages": ["de", "en"]
}
```

### 4.4 Uebersetzung

```
POST /api/v1/ai/translate
```

**Request-Body:**
```json
{
  "text": "Zu uebersetzender Text...",
  "source_language": "de",
  "target_languages": ["en", "fr", "it"],
  "context": "event_description",
  "provider_id": "uuid",
  "preserve_formatting": true
}
```

### 4.5 Prompt-Templates

```
GET    /api/v1/ai/templates                    (Liste mit Filter)
GET    /api/v1/ai/templates/:templateId
POST   /api/v1/ai/templates
PUT    /api/v1/ai/templates/:templateId
DELETE /api/v1/ai/templates/:templateId
POST   /api/v1/ai/templates/:templateId/preview
POST   /api/v1/ai/templates/:templateId/clone
GET    /api/v1/ai/templates/categories         (Verfuegbare Kategorien)
```

### 4.6 KI-Provider-Verwaltung

```
GET    /api/v1/ai/providers
GET    /api/v1/ai/providers/:providerId
POST   /api/v1/ai/providers
PUT    /api/v1/ai/providers/:providerId
DELETE /api/v1/ai/providers/:providerId
POST   /api/v1/ai/providers/:providerId/test   (Verbindungstest)
GET    /api/v1/ai/providers/models             (Verfuegbare Modelle)
```

### 4.7 Kosten-Tracking

```
GET /api/v1/ai/usage                          (Gesamtuebersicht)
GET /api/v1/ai/usage/by-month                 (Monatliche Aufschluesselung)
GET /api/v1/ai/usage/by-provider              (Pro-Provider-Aufschluesselung)
GET /api/v1/ai/usage/by-user                  (Pro-Nutzer-Aufschluesselung)
GET /api/v1/ai/usage/estimate                 (Kostenschaetzung vor Generierung)
GET /api/v1/ai/usage/budget                   (Budget-Einstellungen)
PUT /api/v1/ai/usage/budget                   (Budget aktualisieren)
```

### 4.8 Einwilligungs-Management

```
GET  /api/v1/ai/consent
POST /api/v1/ai/consent
PUT  /api/v1/ai/consent/:consentId/revoke
```

### 4.9 SSE Streaming-Endpunkt (Server-Sent Events)

```
GET /api/v1/ai/stream/:generationId
```

**Event-Stream-Format:**
```
event: token
data: {"token": "Tauchen", "index": 0}

event: token
data: {"token": " Sie", "index": 1}

event: token
data: {"token": " ein", "index": 2}

event: done
data: {"input_tokens": 245, "output_tokens": 312, "cost_eur": 0.00078}
```

---

## 5. UI-Komponenten

### 5.1 Hauptkomponenten

| Komponente | Pfad | Beschreibung |
|-----------|------|-------------|
| `AIAssistPanel` | `/src/components/ai/AIAssistPanel.tsx` | Slide-out Panel mit allen KI-Funktionen |
| `AIGenerateButton` | `/src/components/ai/AIGenerateButton.tsx` | KI-Button mit Dropdown-Menu fuer Schnellaktionen |
| `TextGenerator` | `/src/components/ai/TextGenerator.tsx` | Formular fuer Textgenerierung mit allen Optionen |
| `ImageGenerator` | `/src/components/ai/ImageGenerator.tsx` | Bildgenerierungs-Interface mit Stil-Selektor |
| `BulkGenerator` | `/src/components/ai/BulkGenerator.tsx` | Wizard fuer Komplettpaket-Generierung |
| `TranslationPanel` | `/src/components/ai/TranslationPanel.tsx` | Uebersetzungs-Interface |
| `TemplateEditor` | `/src/components/ai/TemplateEditor.tsx` | Prompt-Template Editor mit Platzhalter-Autocomplete |
| `TemplateLibrary` | `/src/components/ai/TemplateLibrary.tsx` | Template-Browser mit Filter und Suche |
| `StreamingOutput` | `/src/components/ai/StreamingOutput.tsx` | Streaming-Textanzeige mit Typewriter-Effekt |
| `ToneSelector` | `/src/components/ai/ToneSelector.tsx` | Tonauswahl-Komponente (professionell, locker, poetisch...) |
| `LengthSelector` | `/src/components/ai/LengthSelector.tsx` | Laengen-Auswahl mit Visualisierung |
| `PlatformSelector` | `/src/components/ai/PlatformSelector.tsx` | Social-Media-Plattform-Auswahl mit Icons |
| `CostDisplay` | `/src/components/ai/CostDisplay.tsx` | Kostenanzeige (Schaetzung + Tatsaechlich) |
| `ProviderSelector` | `/src/components/ai/ProviderSelector.tsx` | KI-Provider-Auswahl mit Online/Offline-Status |
| `ConsentDialog` | `/src/components/ai/ConsentDialog.tsx` | DSGVO-Einwilligungs-Dialog |
| `UsageDashboard` | `/src/components/ai/UsageDashboard.tsx` | Kosten-Tracking Dashboard mit Charts |
| `ImagePreview` | `/src/components/ai/ImagePreview.tsx` | Bildvorschau mit Zoom und Download |
| `GeneratedTextEditor` | `/src/components/ai/GeneratedTextEditor.tsx` | Rich-Text-Editor fuer generierte Texte |
| `PromptPreview` | `/src/components/ai/PromptPreview.tsx` | Vorschau des finalen Prompts vor Generierung |

### 5.2 Komponenten-Hierarchie

```
AIAssistPanel (Slide-out)
├── Tabs: [Text] [Bild] [Uebersetzen] [Paket] [Templates] [Einstellungen]
│
├── Tab "Text"
│   ├── UseCaseSelector (Dropdown: Event-Beschreibung, Social Media, etc.)
│   ├── ToneSelector (Chips: professionell, locker, poetisch, ueberzeugend, humorvoll)
│   ├── LengthSelector (Slider: kurz / mittel / lang)
│   ├── ProviderSelector (OpenAI / Lokal + Status-Indikator)
│   ├── CostDisplay (Schaetzung)
│   ├── TextGenerator
│   │   ├── InputFields (dynamisch je nach UseCase)
│   │   ├── TemplateSelector (optional)
│   │   ├── PromptPreview (aufklappbar)
│   │   ├── GenerateButton
│   │   └── StreamingOutput
│   └── GeneratedTextEditor (nach Generierung)
│       ├── AcceptButton (UEbernehme in Event)
│       ├── RegenerateButton
│       └── CopyButton
│
├── Tab "Bild"
│   ├── ImageGenerator
│   │   ├── PromptInput (manuell oder aus Event generiert)
│   │   ├── StyleSelector (Fotorealistisch, Illustration, Aquarell, Comic, 3D, Minimal)
│   │   ├── AspectRatioSelector (1:1, 9:16, 3:4, 16:9)
│   │   ├── ProviderSelector
│   │   ├── CostDisplay
│   │   ├── GenerateButton
│   │   └── ImagePreview (Grid mit Variationen)
│
├── Tab "Uebersetzen"
│   └── TranslationPanel
│       ├── SourceLanguageSelector
│       ├── TargetLanguageSelector (Multi-Select)
│       ├── TextInput
│       ├── ProviderSelector
│       └── OutputPanel (Tabs pro Zielsprache)
│
├── Tab "Paket"
│   └── BulkGenerator (Step-Wizard)
│       ├── Step 1: Event auswaehlen
│       ├── Step 2: Deliverables auswaehlen (Checkboxen)
│       ├── Step 3: Sprachen auswaehlen
│       ├── Step 4: Kostenuebersicht + Bestaetigung
│       └── Step 5: Fortschrittsanzeige + Ergebnisse
│
├── Tab "Templates"
│   ├── TemplateLibrary (Grid/List View)
│   └── TemplateEditor (auf Klick)
│       ├── Monaco/CodeMirror Editor mit Syntax-Highlighting fuer Platzhalter
│       ├── VariableInjector (Sidebar mit verfuegbaren Platzhaltern)
│       ├── TestDataPanel (Platzhalter mit Beispieldaten fuellen)
│       └── PreviewPanel (Split-View)
│
└── Tab "Einstellungen"
    ├── ProviderConfiguration
    │   ├── OpenAI: API-Key Input (maskiert), Modell-Auswahl
    │   └── Ollama: URL Input, Verbindungstest, Modell-Liste
    ├── ConsentDialog (Status anzeigen, Widerruf)
    └── UsageDashboard (Recharts/Chart.js)
```

### 5.3 Integration in bestehende UI

- **Event-Erstellung-Formular:** `AIGenerateButton` neben dem Beschreibungs-Textarea — Oeffnet AIAssistPanel mit vor-ausgefuellten Event-Daten
- **Social-Media-Planer:** `AIGenerateButton` pro Plattform-Slot — Direktgenerierung mit Plattform-Preset
- **Presse-Modul:** Integrierter `TextGenerator` mit Pressemitteilungs-Template
- **Newsletter-Editor:** `AIGenerateButton` fuer Betreffzeile und Body-Text

---

## 6. Integrationen

### 6.1 OpenAI API

| Service | Endpunkt | Kosten | Nutzung |
|---------|----------|--------|---------|
| GPT-4o-mini | `https://api.openai.com/v1/chat/completions` | $0.15/1M Input, $0.60/1M Output | Textgenerierung, Uebersetzung |
| GPT-4o | `https://api.openai.com/v1/chat/completions` | $2.50/1M Input, $10.00/1M Output | Hochwertige Texte (optional) |
| DALL-E 3 | `https://api.openai.com/v1/images/generations` | ~$0.04/Bild (1024x1024) | Bildgenerierung |
| DALL-E 3 HD | `https://api.openai.com/v1/images/generations` | ~$0.08/Bild (1024x1024) | Hochqualitative Bilder |

**DSGVO-Hinweis:** OpenAI bietet Data Processing Agreement (DPA) mit Zero-Data-Retention fuer Business-Tier. Keine Nutzung der Daten fuer Training.

### 6.2 Ollama (Lokale KI)

| Parameter | Wert |
|-----------|------|
| API-Endpunkt | `http://localhost:11434/api/generate` (Text), `http://localhost:11434/api/chat` (Chat) |
| Empfohlene Modelle | llama3.1:8b, mistral:7b, gemma2:9b |
| Mindest-Hardware | 8GB VRAM (GPU) oder 16GB RAM (CPU-only) |
| Kosten | Kostenlos (nach Hardware-Investition) |

### 6.3 LM Studio (Alternative lokale KI)

| Parameter | Wert |
|-----------|------|
| API-Endpunkt | `http://localhost:1234/v1/chat/completions` (OpenAI-kompatibel) |
| OpenAI-Compat | Ja — kann als Drop-in-Replacement verwendet werden |

### 6.4 Newsletter-Provider-Integration

| Provider | Integration | Funktion |
|----------|-------------|----------|
| Mailchimp | API v3 | Direkter Export generierter Newsletter-Texte |
| Brevo (ehem. Sendinblue) | API v3 | Direkter Export generierter Newsletter-Texte |
| Mailjet | API v3.1 | Direkter Export generierter Newsletter-Texte |

### 6.5 Social-Media-Publisher-Integration

| Plattform | Integration | Funktion |
|-----------|-------------|----------|
| Buffer | API | Direktes Publishen generierter Posts |
| Hootsuite | API | Direktes Publishen generierter Posts |
| Meta Business Suite | API | Direktes Publishen auf Facebook/Instagram |

---

## 7. Technische Details

### 7.1 Architektur-Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      React Frontend                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ AIAssistPanel │  │ Streaming    │  │ CostDisplay  │      │
│  │              │  │ Output       │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
│         └─────────────────┴──────────────────┘               │
│                           │                                  │
│                    SSE-Connection                            │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                  Node.js/Express Backend                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ AI Controller │  │ Proxy/Router  │  │ CostTracker  │      │
│  │              │  │              │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
│         │    ┌────────────┴────────────┐     │               │
│         │    │     AI Provider Abstraction Layer              │
│         │    │  ┌────────┐  ┌────────┐  ┌────────┐          │
│         │    │  │ OpenAI │  │ Ollama │  │ LMStudio│          │
│         │    │  │ Adapter│  │ Adapter│  │ Adapter │          │
│         │    │  └───┬────┘  └───┬────┘  └───┬────┘          │
│         │    └──────┼───────────┼───────────┼────────────────┘
│         │           │           │           │
│         │    ┌──────┴───────────┴───────────┴──────┐
│         │    │     Template Engine (Handlebars)     │
│         │    └──────────────────────────────────────┘
│         │
│         └──► PostgreSQL (ai_generations, ai_usage, ...)
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Backend-Proxy fuer API-Keys

**Problemstellung:** API-Keys duerfen niemals im Frontend exponiert werden.

**Loesung:** Backend-Proxy-Pattern

```typescript
// ai-proxy.service.ts
class AIProxyService {
  async generateText(request: GenerateTextRequest, userId: string): Promise<GenerationResult> {
    // 1. Hole Provider-Konfiguration (mit verschluesseltem API-Key) aus DB
    const provider = await this.providerRepo.findById(request.provider_id);
    
    // 2. Entschluessele API-Key (AES-256-GCM)
    const apiKey = await this.cryptoService.decrypt(provider.api_key_encrypted);
    
    // 3. Baue Prompt aus Template + Input-Daten
    const prompt = await this.templateEngine.render(request);
    
    // 4. Route zum richtigen Adapter
    const adapter = this.adapterFactory.getAdapter(provider.provider_type);
    
    // 5. Fuehre Generierung durch (mit Timeout und Retry-Logik)
    const result = await adapter.generate(prompt, provider, { stream: request.stream });
    
    // 6. Berechne Kosten
    const cost = this.costCalculator.calculate(provider, result.tokens);
    
    // 7. Speichere Generierung in DB
    await this.generationRepo.save({ ...result, cost_eur: cost, user_id: userId });
    
    // 8. Aktualisiere Usage-Statistiken
    await this.usageTracker.record(provider, result.tokens, cost);
    
    return result;
  }
}
```

### 7.3 Streaming-Implementierung

```typescript
// SSE-Streaming Handler
async function streamGeneration(req: Request, res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const adapter = getAdapter(providerType);
  const stream = await adapter.generateStream(prompt, provider);
  
  let tokenCount = 0;
  let fullText = '';
  
  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content || '';
    fullText += token;
    tokenCount++;
    
    res.write(`event: token\ndata: ${JSON.stringify({ token, index: tokenCount })}\n\n`);
  }
  
  const cost = calculateCost(tokenCount);
  res.write(`event: done\ndata: ${JSON.stringify({ total_tokens: tokenCount, cost_eur: cost })}\n\n`);
  res.end();
  
  // Async: Speichere vollstaendiges Ergebnis in DB
  await saveGeneration(fullText, tokenCount, cost);
}
```

### 7.4 Adapter-Pattern fuer Provider

```typescript
interface AIGenerationAdapter {
  generateText(prompt: string, config: ProviderConfig, options: GenOptions): Promise<TextResult>;
  generateStream(prompt: string, config: ProviderConfig): AsyncGenerator<StreamChunk>;
  generateImage(prompt: string, config: ProviderConfig, options: ImageOptions): Promise<ImageResult>;
  translate(text: string, sourceLang: string, targetLang: string, config: ProviderConfig): Promise<TranslationResult>;
  listModels(config: ProviderConfig): Promise<ModelInfo[]>;
  testConnection(config: ProviderConfig): Promise<ConnectionTestResult>;
}

class OpenAIAdapter implements AIGenerationAdapter { /* ... */ }
class OllamaAdapter implements AIGenerationAdapter { /* ... */ }
class LMStudioAdapter implements AIGenerationAdapter { /* ... */ }
```

### 7.5 Template-Engine

**Engine:** Handlebars.js mit Custom Helpers

```typescript
// Template-Rendering Pipeline
function renderTemplate(template: PromptTemplate, inputData: any): { system: string, user: string } {
  // 1. Validiere Input-Daten gegen Template-Platzhalter
  const missingVars = validatePlaceholders(template.user_prompt_template, inputData);
  if (missingVars.length > 0) throw new MissingVariableError(missingVars);
  
  // 2. Rendere User-Prompt mit Handlebars
  const userPrompt = Handlebars.compile(template.user_prompt_template)(inputData);
  
  // 3. Rendere System-Prompt
  const systemPrompt = Handlebars.compile(template.system_prompt)(inputData);
  
  // 4. Fuege Tonauswahl-Anweisung hinzu
  const toneInstruction = getToneInstruction(template.tone);
  
  // 5. Fuege Laengen-Anweisung hinzu
  const lengthInstruction = getLengthInstruction(template.target_length);
  
  return {
    system: `${systemPrompt}\n${toneInstruction}\n${lengthInstruction}`,
    user: userPrompt
  };
}

// Tone Instructions
const toneInstructions = {
  professional: 'Schreibe in einem professionellen, sachlichen Ton. Verwende Fachbegriffe wo angebracht.',
  casual: 'Schreibe locker und umgangssprachlich. Verwende du/ihr wie an Freunde gerichtet.',
  poetic: 'Schreibe poetisch und bildreich. Verwende Metaphern und ansprechende Sprachbilder.',
  persuasive: 'Schreibe ueberzeugend und verkaufsfoerdernd. Betone Vorteile und rufe zum Handeln auf.',
  humorous: 'Schreibe humorvoll und unterhaltsam. Ein wenig Wortwitz ist erwuenscht.',
  formal: 'Schreibe im formellen Stil einer Pressemitteilung. Verwende Sie-Anrede.'
};

// Length Instructions
const lengthInstructions = {
  short: 'Halte den Text kurz und praegnant (max. 500 Zeichen).',
  medium: 'Schreibe einen ausfuehrlichen Text (500-1500 Zeichen).',
  long: 'Erstelle einen umfassenden, detaillierten Text (1500+ Zeichen).'
};
```

### 7.6 Kosten-Tracking-Algorithmus

```typescript
function calculateCost(provider: AIProvider, inputTokens: number, outputTokens: number): number {
  if (provider.is_local) return 0.0;
  
  const inputCost = (inputTokens / 1000) * provider.cost_per_1k_input_tokens;
  const outputCost = (outputTokens / 1000) * provider.cost_per_1k_output_tokens;
  
  // Umrechnung USD → EUR (taeglich aktualisierter Wechselkurs)
  const usdToEur = getExchangeRate('USD', 'EUR');
  
  return (inputCost + outputCost) * usdToEur;
}

// Kostenschaetzung vor Generierung
function estimateCost(provider: AIProvider, estimatedInputTokens: number, estimatedOutputTokens: number): CostEstimate {
  const minCost = calculateCost(provider, estimatedInputTokens * 0.8, estimatedOutputTokens * 0.5);
  const maxCost = calculateCost(provider, estimatedInputTokens * 1.2, estimatedOutputTokens * 1.5);
  
  return {
    min_eur: minCost,
    max_eur: maxCost,
    expected_eur: (minCost + maxCost) / 2
  };
}
```

### 7.7 Verwendete Libraries

| Zweck | Library | Version | Begruendung |
|-------|---------|---------|-------------|
| KI-Client (OpenAI) | `openai` | ^4.50 | Offizieller SDK, Streaming-Support |
| Template-Engine | `handlebars` | ^4.7 | Etabliert, sicher, Custom Helpers |
| SSE-Client | `eventsource` | ^2.0 | Server-Sent Events im Browser |
| Rich Text Editor | `@tiptap/react` | ^2.5 | Headless, anpassbar, lightweight |
| Charts fuer Usage | `recharts` | ^2.12 | React-native, responsive |
| API-Client | `axios` | ^1.7 | Interceptors fuer Auth/Error-Handling |
| Verschluesselung | `crypto-js` | ^4.2 | AES-256 fuer API-Key-Verschluesselung |
| Form-Handling | `react-hook-form` | ^7.52 | Performant, Validierung |
| Validierung | `zod` | ^3.23 | Schema-Validierung fuer API-Requests |
| Streaming (Backend) | Native Node.js | — | ReadableStream/AsyncGenerator |

### 7.8 Frontend State Management

```typescript
// React Context + Custom Hook fuer KI-Generierungen
interface AIGenerationState {
  // Aktive Generierung
  activeGeneration: AIGeneration | null;
  streamText: string;
  streamStatus: 'idle' | 'streaming' | 'completed' | 'error';
  
  // Generierung starten
  generateText: (params: GenerateParams) => Promise<void>;
  generateImage: (params: ImageParams) => Promise<void>;
  cancelGeneration: () => void;
  
  // History
  recentGenerations: AIGeneration[];
  refreshHistory: () => Promise<void>;
  
  // Templates
  templates: PromptTemplate[];
  selectedTemplate: PromptTemplate | null;
  
  // Provider
  activeProvider: AIProvider | null;
  providers: AIProvider[];
  
  // Kosten
  estimatedCost: CostEstimate | null;
  currentCost: number;
  
  // DSGVO
  hasConsent: boolean;
  showConsentDialog: () => void;
}
```

### 7.9 Lokale KI — Ollama Setup Guide

```yaml
# docker-compose.yml fuer Ollama-Server
version: '3.8'
services:
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama-data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
volumes:
  ollama-data:
```

**Modell-Download nach Setup:**
```bash
# Empfohlene Modelle fuer Textgenerierung
ollama pull llama3.1:8b          # Bestes Preis-Leistungs-Verhaeltnis
ollama pull mistral:7b           # Gute deutsche Sprache
ollama pull gemma2:9b            # Googles Modell, sehr schnell

# Modell-Test
ollama run llama3.1:8b "Schreibe eine Event-Beschreibung fuer ein Jazz-Konzert"
```

### 7.10 EU AI Act Kompatibilitaet

**Status ab August 2026 voll anwendbar:**

| Anforderung | Umsetzung |
|-------------|-----------|
| Transparenz-Kennzeichnung | Alle KI-generierten Inhalte werden mit einem "KI-generiert"-Badge markiert |
| Menschliche UEberwachung | Alle generierten Inhalte muessen vor Verwendung vom Nutzer bestaetigt werden |
| Qualitaetsmanagement | Template-Review-Prozess, Nutzer-Feedback-Loop fuer Template-Verbesserung |
| Risikoklassifizierung | Das System faellt unter "begrenztes Risiko" (Transparency obligations) |
| Protokollierung | Vollstaendige Audit-Trail aller Generierungen in `ai_generations`-Tabelle |

---

## 8. Akzeptanzkriterien (Definition of Done)

### 8.1 Textgenerierung
- [ ] Veranstalter kann aus einer Veranstaltung heraus Event-Beschreibungen in 6 Tonlagen generieren
- [ ] Generierungen werden in Echtzeit gestreamt (SSE) mit Typewriter-Effekt
- [ ] Alle Social-Media-Plattform-Zeichenlimits werden automatisch eingehalten
- [ ] Generierte Texte koennen per Klick in das Event-Formular uebernommen werden
- [ ] Prompt-Templates sind vollstaendig anpassbar und speicherbar
- [ ] Pressemitteilungen folgen dem DIN-5008-Standard-Format
- [ ] Newsletter-Texte unterstuetzen Personalisierungs-Platzhalter
- [ ] A/B-Test-Vorschlaege fuer E-Mail-Betreffzeilen werden generiert

### 8.2 Bildgenerierung
- [ ] Bilder koennen aus Event-Kontext mit einem Klick generiert werden
- [ ] 6 Stilrichtungen stehen zur Auswahl (Fotorealistisch, Illustration, Aquarell, Comic, 3D, Minimal)
- [ ] 4 Seitenverhaeltnisse werden unterstuetzt (1:1, 9:16, 3:4, 16:9)
- [ ] 4 Variationen pro Prompt werden generiert
- [ ] Bilder sind in mindestens 1024x1024 Aufloesung verfuegbar
- [ ] Kostenanzeige erscheint vor jeder Generierung

### 8.3 Uebersetzung
- [ ] 6 Sprachen werden unterstuetzt (DE, EN, FR, IT, ES, NL)
- [ ] Bulk-Uebersetzung eines kompletten Text-Pakets ist moeglich
- [ ] Fachbegriffe des Veranstaltungswesens werden korrekt uebersetzt
- [ ] Formatierung und Platzhalter bleiben bei Uebersetzung erhalten

### 8.4 Provider-Management
- [ ] OpenAI API-Key kann sicher im Backend hinterlegt werden
- [ ] Ollama-Server kann konfiguriert und getestet werden
- [ ] Verbindungstest zeigt Modell-Liste und Verfuegbarkeit an
- [ ] Fallback-Logik: Bei Cloud-Ausfall → lokales Modell (wenn konfiguriert)

### 8.5 Kosten-Tracking
- [ ] Kostenschaetzung wird vor jeder Generierung angezeigt
- [ ] Tatsaechliche Kosten werden pro Generierung in der DB gespeichert
- [ ] Monatliche Kostenuebersicht ist im Dashboard einsehbar
- [ ] Budget-Warnung bei 80%/100% des konfigurierten Limits
- [ ] Kosten sind pro Organisation aggregiert, nicht pro Nutzer

### 8.6 DSGVO & Compliance
- [ ] Einwilligungs-Dialog erscheint vor erster Cloud-KI-Nutzung
- [ ] DPA-Version und Link werden angezeigt
- [ ] Widerruf der Einwilligung ist jederzeit moeglich
- [ ] Bei lokaler KI werden keine Daten das System verlassen
- [ ] Alle KI-generierten Inhalte sind als solche gekennzeichnet (EU AI Act)
- [ ] Vollstaendiger Audit-Trail aller KI-Interaktionen ist verfuegbar
- [ ] API-Keys werden AES-256 verschluesselt in der Datenbank gespeichert

### 8.7 Performance
- [ ] Erste Stream-Token erscheinen innerhalb von 2 Sekunden
- [ ] Bildgenerierung zeigt Fortschrittsanzeige (Polling/SSE)
- [ ] Template-Library laedt in < 500ms
- [ ] UI bleibt waehrend Streaming responsiv
- [ ] Timeout nach 60 Sekunden bei haengenden Generierungen

### 8.8 Tests
- [ ] Unit-Tests fuer alle Adapter (OpenAI, Ollama, LM Studio)
- [ ] Integration-Tests fuer End-to-End-Generierungsflow
- [ ] Mock-Adapter fuer Test-Umgebung (keine echten API-Calls in CI)
- [ ] Frontend-Tests fuer Streaming-Komponenten
- [ ] DSGVO-Flow-Tests (Einwilligung → Nutzung → Widerruf)
- [ ] Kosten-Berechnungs-Tests mit verschiedenen Provider-Konfigurationen

---

## 9. Beispiel: Eingebaute Prompt-Templates

### 9.1 Event-Beschreibung (professionell)

**System-Prompt:**
```
Du bist ein erfahrener Veranstaltungsmanager und Texter fuer Kulturveranstaltungen. 
Schreibe ueberzeugende Event-Beschreibungen, die das Publikum begeistern und zum 
Besuch animieren. {{tone_instruction}} {{length_instruction}}
```

**User-Prompt-Template:**
```
Erstelle eine Event-Beschreibung fuer folgende Veranstaltung:

Titel: {{event.title}}
Kuenstler: {{event.artist}}
Genre: {{event.genre}}
Ort: {{event.venue}}
Datum: {{event.date}}
Uhrzeit: {{event.time}}
Ticketpreis: {{event.ticket_price}}
{{#if event.special_notes}}
Besonderheiten: {{event.special_notes}}
{{/if}}

Die Beschreibung sollte das Event attraktiv praesentieren und wichtige 
Informationen enthalten. Verwende einen Call-to-Action zum Ticketkauf.
```

### 9.2 Social Media — Instagram

**System-Prompt:**
```
Du bist ein Social Media Manager fuer Kulturveranstaltungen. 
Schreibe einen Instagram-Post, der Follower begeistert und zum Teilen animiert.
Maximal 2.200 Zeichen. Nutze Emojis und Hashtags.
{{tone_instruction}}
```

**User-Prompt-Template:**
```
Erstelle einen Instagram-Post fuer dieses Event:

{{event.title}} mit {{event.artist}}
{{event.date}} um {{event.time}} in {{event.venue}}
Genre: {{event.genre}}
Ticketpreis: {{event.ticket_price}}

{{#if event.description}}
Event-Details: {{event.description}}
{{/if}}

Format:
- Catchy Einleitung (Hook)
- Event-Details
- Call-to-Action (Link in Bio / Tickets sichern)
- 5-10 relevante Hashtags
- 3-5 passende Emojis
```

### 9.3 Social Media — Twitter/X

**System-Prompt:**
```
Schreibe einen knappen, witzigen Twitter-Post unter 280 Zeichen.
Maximal 1 Link, 2-3 Hashtags, 1-2 Emojis.
{{tone_instruction}}
```

### 9.4 Pressemitteilung

**System-Prompt:**
```
Du bist ein Pressesprecher. Schreibe eine Pressemitteilung nach DIN 5008.
Struktur: Titelzeile, Untertitel, Lead (5 W), Haupttext, Boilerplate, Kontakt.
Formaler Ton, Sie-Anrede.
```

### 9.5 Newsletter-Betreffzeile (A/B-Test)

**System-Prompt:**
```
Generiere 3 alternative E-Mail-Betreffzeilen fuer einen Newsletter.
Maximal 60 Zeichen pro Zeile, da Mobil-optimiert.
Varianten: Informativ, Neugier-erweckend, Urgency.
{{tone_instruction}}
```

---

## 10. Roadmap-Vorschlag

| Phase | Features | Zeitschaetzung |
|-------|----------|----------------|
| **MVP** | Textgenerierung (Event-Beschreibung, Social Media), OpenAI-Integration, Streaming, Basic Templates | 3 Wochen |
| **Phase 2** | Bildgenerierung (DALL-E 3), Pressemitteilungen, Newsletter-Texte, Template-Editor | 2 Wochen |
| **Phase 3** | Lokale KI (Ollama), Uebersetzung, Kosten-Tracking, Budget-Warnungen | 2 Wochen |
| **Phase 4** | Bulk-Generierung (Komplettpaket), A/B-Test-Vorschlaege, DSGVO-Compliance, EU AI Act | 1 Woche |
| **Phase 5** | Erweiterte Template-Library, Community-Templates, Performance-Optimierung | 2 Wochen |

**Gesamtschaetzung:** ~10 Wochen fuer vollstaendiges Modul

---

*Dokument erstellt: 2024*
*Version: 1.0*
*Status: Spezifikation vollstaendig*

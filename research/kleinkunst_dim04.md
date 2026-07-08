# Dimension 4: Social Media Automation & Cross-Posting

## Modulübersicht

| Attribut | Beschreibung |
|----------|-------------|
| **Modulname** | Social Media Hub |
| **Zielgruppe** | Kleinkunst-Veranstalter, Kulturbetreiber, Theater, Kneipen mit Bühnen |
| **Kernergebnis** | Zentrale Steuerung aller Social-Media-Aktivitaten: Account-Verwaltung, Cross-Posting, Scheduling, Event-Synchronisation, Media-Library und Analytics |
| **Integrationsgrad** | Meta Graph API, Twitter/X API v2, TikTok for Business API, LinkedIn API, Google Business Profile API |
| **Komplexitaet** | Hoch (5 externe APIs, OAuth-Flows, Media-Processing, Rate-Limiting) |

---

## 1. Feature-Beschreibung

Das Social Media Hub Modul ermöglicht Kleinkunst-Veranstaltern, alle ihre Social-Media-Kanäle von einer zentralen Oberfläche aus zu verwalten. Kernfunktionen sind:

- **Account-Verwaltung**: Verbindung und Verwaltung von Accounts auf Facebook, Instagram, Twitter/X, TikTok und LinkedIn via OAuth
- **Cross-Posting**: Erstellung eines Posts, der automatisch auf alle gewählten Plattformen angepasst wird (Bildformate, Zeichenlimits, Hashtags)
- **Scheduling**: Posts können für einen bestimmten Zeitpunkt geplant und automatisch veroeffentlicht werden
- **Event-Synchronisation**: Veranstaltungen aus dem Event-Management-Modul werden automatisch als Facebook Events und Google Business Profile Events/Posts erstellt
- **Media Library**: Zentrale Verwaltung von Bildern und Videos mit automatischer Format-Anpassung für jede Plattform
- **Analytics Dashboard**: Engagement-Statistiken (Likes, Shares, Comments, Reach) pro Plattform mit Vergleichsmöglichkeiten
- **Beste Posting-Zeiten**: Algorithmus schlägt optimale Posting-Zeiten basierend auf historischen Daten vor

---

## 2. User Stories

### US-01: Account-Verbindung
> **Als** Veranstalter möchte ich meine Social-Media-Accounts (Facebook, Instagram, Twitter/X, TikTok, LinkedIn) über OAuth mit der App verbinden, damit ich alle Kanäle zentral verwalten kann.

**Akzeptanzkriterien:**
- OAuth-Flow für jede Plattform ist implementiert und funktioniert vollständig
- Nach der Verbindung werden Account-Informationen (Name, Profilbild, Follower-Anzahl) gespeichert
- Token-Refresh funktioniert automatisch im Hintergrund
- Accounts können getrennt (deautorisiert) werden
- Fehlermeldungen bei abgelehnten Berechtigungen sind verständlich

### US-02: Cross-Posting mit Plattform-Anpassung
> **Als** Veranstalter möchte ich einen einzigen Post erstellen und auf mehrere Plattformen gleichzeitig veröffentlichen, wobei die Inhalte automatisch an die Plattform-Regeln angepasst werden (Zeichenlimit, Bildformate, Hashtags), damit ich Zeit spare und keine Formatierungsfehler mache.

**Akzeptanzkriterien:**
- Ein Editor erlaubt die Erstellung eines "Master-Posts"
- Pro Plattform wird eine Vorschau mit angepasstem Inhalt angezeigt
- Zeichenlimits werden pro Plattform geprüft (Twitter/X: 280, LinkedIn: 3.000, etc.)
- Bilder werden automatisch in die richtigen Formate konvertiert (1:1, 4:5, 16:9, 9:16)
- Hashtags können plattform-spezifisch konfiguriert werden
- Warnungen bei Inkompatibilitäten (z.B. TikTok Video vs. LinkedIn Text)

### US-03: Post-Scheduling mit Kalender
> **Als** Veranstalter möchte ich Posts für zukünftige Zeitpunkte planen und in einem Kalender-View verwalten können, damit ich meine Social-Media-Präsenz strategisch im Voraus planen kann.

**Akzeptanzkriterien:**
- Kalender-View zeigt alle geplanten Posts farbcodiert nach Plattform
- Drag & Drop zum Verschieben von Posts zwischen Zeitpunkten
- Wiederkehrende Posts sind konfigurierbar (z.B. wöchentliche Veranstaltungshinweise)
- Geplante Posts können vor Veröffentlichung bearbeitet werden
- Übersichtliche Liste-View als Alternative zum Kalender
- Benachrichtigung bei erfolgreicher/fehlgeschlagener Veröffentlichung

### US-04: Automatische Event-Synchronisation
> **Als** Veranstalter möchte ich, dass meine im System erstellten Veranstaltungen automatisch als Facebook Events und Google Business Profile Posts/Events erstellt werden, damit ich keine doppelte Datenpflege habe.

**Akzeptanzkriterien:**
- Bei Erstellung/Bearbeitung eines Events im System wird automatisch ein Facebook Event erstellt/aktualisiert
- Google Business Profile Event/Post wird synchronisiert
- Event-Daten (Datum, Uhrzeit, Ort, Beschreibung, Bild) werden korrekt übertragen
- Manuelle Synchronisation ist als Fallback möglich
- Änderungen am Event werden auf die synchronisierten Posts propagiert
- Löschung eines Events bietet Option, Social-Media-Posts ebenfalls zu löschen

### US-05: Media Library mit Format-Anpassung
> **Als** Veranstalter möchte ich Bilder und Videos in einer zentralen Bibliothek verwalten, die automatisch in die richtigen Formate für jede Social-Media-Plattform konvertiert, damit ich immer optimale Bildqualität und -formate habe.

**Akzeptanzkriterien:**
- Upload von Bildern (JPG, PNG, GIF, WebP) und Videos (MP4, MOV)
- Automatische Konvertierung in plattform-optimale Formate
- Übersichtliche Bibliothek mit Vorschau, Tags und Suchfunktion
- Ordner-/Album-Struktur zur Organisation
- Metadaten (Upload-Datum, Dateigröße, Abmessungen, verwendete Plattformen)
- Bearbeitungsfunktionen: Zuschneiden, Filter, Text-Overlay

### US-06: Analytics Dashboard
> **Als** Veranstalter möchte ich Engagement-Statistiken (Likes, Shares, Comments, Reach) für alle meine Posts pro Plattform in einem Dashboard sehen, damit ich die Performance meiner Social-Media-Aktivitäten analysieren kann.

**Akzeptanzkriterien:**
- Übersicht über alle wichtigen Kennzahlen pro Plattform
- Vergleich zwischen Plattformen (z.B. Balkendiagramm)
- Zeitraum-Auswahl (7 Tage, 30 Tage, 90 Tage, benutzerdefiniert)
- Top-Performing Posts pro Plattform
- Export als CSV/PDF
- Daten werden mindestens einmal täglich aktualisiert

### US-07: Beste Posting-Zeiten
> **Als** Veranstalter möchte ich Empfehlungen für die besten Posting-Zeiten pro Plattform erhalten, basierend auf historischen Engagement-Daten, damit meine Posts maximale Reichweite erzielen.

**Akzeptanzkriterien:**
- Algorithmus analysiert historische Post-Daten
- Empfehlungen werden pro Plattform und Wochentag angezeigt
- Heatmap-Visualisierung der optimalen Zeitfenster
- Berücksichtigung der Zielgruppen-Zeitzone
- Empfehlungen werden mit Konfidenz-Level angezeigt

### US-08: Content-Templates
> **Als** Veranstalter möchte ich vordefinierte Post-Templates für wiederkehrende Inhaltstypen (Event-Ankündigung, Ticket-Reminder, Dankespost) nutzen können, damit ich konsistente und professionelle Posts schnell erstellen kann.

**Akzeptanzkriterien:**
- Mindestens 5 vordefinierte Templates (Event-Ankündigung, Ticket-Reminder, Dankespost, Quote/Review, Behind-the-Scenes)
- Templates enthalten Platzhalter für dynamische Inhalte (Event-Name, Datum, Ort, Link)
- Eigene Templates können erstellt und gespeichert werden
- Templates sind pro Plattform anpassbar

---

## 3. Datenmodell

### 3.1 Übersicht Tabellen/Collections

```
social_accounts          -- Verbundene Social-Media-Accounts
social_posts             -- Posts (Master + plattform-spezifische Varianten)
social_post_variants     -- Plattform-spezifische Post-Anpassungen
post_schedules           -- Geplante Veröffentlichungen
post_publish_logs        -- Veröffentlichungs-Logs (Erfolg/Fehler)
media_library            -- Hochgeladene Medien
media_variants           -- Format-Varianten pro Medium (pro Plattform)
content_templates        -- Post-Templates
template_placeholders    -- Platzhalter-Definitionen in Templates
social_analytics         -- Aggregierte Analytics-Daten
social_analytics_posts   -- Post-Level Analytics
posting_time_recommendations -- Empfohlene Posting-Zeiten
event_sync_mappings      -- Mapping: System-Event <-> Social-Media-Event
platform_rate_limits     -- Rate-Limit-Tracking pro Plattform/Account
```

### 3.2 Detaillierte Tabellendefinitionen

#### `social_accounts`

| Feld | Typ | Beschreibung | Constraints |
|------|-----|-------------|-------------|
| `id` | UUID | Primärschlüssel | PK |
| `venue_id` | UUID | Verweis auf Veranstalter | FK → venues.id |
| `platform` | ENUM | Plattform | facebook, instagram, twitter, tiktok, linkedin, google_business |
| `account_name` | VARCHAR(255) | Anzeigename des Accounts | NOT NULL |
| `platform_account_id` | VARCHAR(255) | Externe Account-ID | NOT NULL, UNIQUE pro platform |
| `profile_picture_url` | TEXT | URL zum Profilbild | |
| `follower_count` | INTEGER | Anzahl Follower | DEFAULT 0 |
| `access_token` | TEXT | OAuth Access Token | encrypted |
| `refresh_token` | TEXT | OAuth Refresh Token | encrypted |
| `token_expires_at` | TIMESTAMP | Token-Ablaufdatum | |
| `token_scope` | JSONB | Gewährte Berechtigungen | |
| `status` | ENUM | Account-Status | active, expired, revoked, error |
| `settings` | JSONB | Plattform-spezifische Einstellungen | DEFAULT {} |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt | DEFAULT now() |
| `updated_at` | TIMESTAMP | Letzte Aktualisierung | DEFAULT now() |

**Indizes:**
- UNIQUE(platform, platform_account_id)
- INDEX(venue_id, platform)
- INDEX(status)

---

#### `social_posts`

| Feld | Typ | Beschreibung | Constraints |
|------|-----|-------------|-------------|
| `id` | UUID | Primärschlüssel | PK |
| `venue_id` | UUID | Verweis auf Veranstalter | FK → venues.id |
| `event_id` | UUID | Verweis auf Event (optional) | FK → events.id, NULLABLE |
| `template_id` | UUID | Verwendetes Template (optional) | FK → content_templates.id, NULLABLE |
| `content_type` | ENUM | Art des Posts | text, image, video, carousel, story, reel, event |
| `status` | ENUM | Post-Status | draft, scheduled, publishing, published, failed, cancelled |
| `master_content` | TEXT | Master-Textinhalt | NOT NULL |
| `master_hashtags` | TEXT[] | Master-Hashtag-Liste | DEFAULT [] |
| `media_ids` | UUID[] | Verknüpfte Medien aus Media Library | DEFAULT [] |
| `scheduled_at` | TIMESTAMP | Geplanter Veröffentlichungszeitpunkt | NULLABLE |
| `published_at` | TIMESTAMP | Tatsächlicher Veröffentlichungszeitpunkt | NULLABLE |
| `created_by` | UUID | Ersteller | FK → users.id |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt | DEFAULT now() |
| `updated_at` | TIMESTAMP | Letzte Aktualisierung | DEFAULT now() |

**Indizes:**
- INDEX(venue_id, status)
- INDEX(scheduled_at) WHERE status = 'scheduled'
- INDEX(event_id)

---

#### `social_post_variants`

| Feld | Typ | Beschreibung | Constraints |
|------|-----|-------------|-------------|
| `id` | UUID | Primärschlüssel | PK |
| `post_id` | UUID | Verweis auf Master-Post | FK → social_posts.id, ON DELETE CASCADE |
| `account_id` | UUID | Verweis auf Account | FK → social_accounts.id |
| `platform` | ENUM | Zielplattform | facebook, instagram, twitter, tiktok, linkedin, google_business |
| `adapted_content` | TEXT | Plattform-angepasster Text | NOT NULL |
| `adapted_hashtags` | TEXT[] | Plattform-angepasste Hashtags | DEFAULT [] |
| `media_variant_ids` | UUID[] | Verwendete Medien-Varianten | DEFAULT [] |
| `platform_post_id` | VARCHAR(255) | Externe Post-ID nach Veröffentlichung | NULLABLE |
| `platform_post_url` | TEXT | URL zum veröffentlichten Post | NULLABLE |
| `status` | ENUM | Veröffentlichungs-Status | pending, publishing, published, failed, skipped |
| `error_message` | TEXT | Fehlermeldung bei Fehler | NULLABLE |
| `character_count` | INTEGER | Anzahl Zeichen | |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt | DEFAULT now() |
| `updated_at` | TIMESTAMP | Letzte Aktualisierung | DEFAULT now() |

**Indizes:**
- UNIQUE(post_id, account_id)
- INDEX(post_id, status)
- INDEX(platform_post_id, platform)

---

#### `post_schedules`

| Feld | Typ | Beschreibung | Constraints |
|------|-----|-------------|-------------|
| `id` | UUID | Primärschlüssel | PK |
| `post_id` | UUID | Verweis auf Post | FK → social_posts.id, ON DELETE CASCADE |
| `scheduled_for` | TIMESTAMP | Geplanter Zeitpunkt | NOT NULL |
| `timezone` | VARCHAR(50) | Zeitzone | DEFAULT 'Europe/Berlin' |
| `recurrence` | ENUM | Wiederholung | none, daily, weekly, monthly |
| `recurrence_end` | TIMESTAMP | Enddatum Wiederholung | NULLABLE |
| `processed_at` | TIMESTAMP | Ausführungszeitpunkt | NULLABLE |
| `result` | ENUM | Ergebnis | pending, success, partial, failed |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt | DEFAULT now() |

**Indizes:**
- INDEX(scheduled_for, result) WHERE result = 'pending'
- INDEX(post_id)

---

#### `post_publish_logs`

| Feld | Typ | Beschreibung | Constraints |
|------|-----|-------------|-------------|
| `id` | UUID | Primärschlüssel | PK |
| `variant_id` | UUID | Verweis auf Post-Variante | FK → social_post_variants.id |
| `platform` | ENUM | Plattform | |
| `action` | ENUM | Aktion | publish, update, delete |
| `status` | ENUM | Status | success, failed, retrying |
| `request_payload` | JSONB | Gesendete API-Daten | |
| `response_data` | JSONB | API-Antwort | |
| `error_code` | VARCHAR(100) | Fehlercode | NULLABLE |
| `error_message` | TEXT | Fehlermeldung | NULLABLE |
| `rate_limited` | BOOLEAN | Rate-Limit getroffen | DEFAULT false |
| `retry_count` | INTEGER | Anzahl Wiederholungen | DEFAULT 0 |
| `executed_at` | TIMESTAMP | Ausführungszeitpunkt | DEFAULT now() |

**Indizes:**
- INDEX(variant_id, executed_at)
- INDEX(platform, status)

---

#### `media_library`

| Feld | Typ | Beschreibung | Constraints |
|------|-----|-------------|-------------|
| `id` | UUID | Primärschlüssel | PK |
| `venue_id` | UUID | Verweis auf Veranstalter | FK → venues.id |
| `filename` | VARCHAR(255) | Original-Dateiname | NOT NULL |
| `original_url` | TEXT | URL zum Original | NOT NULL |
| `file_type` | ENUM | Dateityp | image, video |
| `mime_type` | VARCHAR(100) | MIME-Type | NOT NULL |
| `file_size` | INTEGER | Dateigröße in Bytes | |
| `width` | INTEGER | Breite in Pixeln | |
| `height` | INTEGER | Höhe in Pixeln | |
| `duration` | INTEGER | Videodauer in Sekunden (bei Video) | NULLABLE |
| `tags` | TEXT[] | Tags/Keywords | DEFAULT [] |
| `album_id` | UUID | Album/Ordner | NULLABLE |
| `metadata` | JSONB | EXIF-Daten etc. | DEFAULT {} |
| `uploaded_by` | UUID | Uploader | FK → users.id |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt | DEFAULT now() |

**Indizes:**
- INDEX(venue_id, file_type)
- INDEX(tags) USING GIN

---

#### `media_variants`

| Feld | Typ | Beschreibung | Constraints |
|------|-----|-------------|-------------|
| `id` | UUID | Primärschlüssel | PK |
| `media_id` | UUID | Verweis auf Original-Medium | FK → media_library.id, ON DELETE CASCADE |
| `platform` | ENUM | Zielplattform | facebook, instagram, twitter, tiktok, linkedin, google_business |
| `variant_type` | ENUM | Art der Variante | feed, story, reel, cover, thumbnail |
| `url` | TEXT | URL zur Variante | NOT NULL |
| `width` | INTEGER | Breite | |
| `height` | INTEGER | Höhe | |
| `aspect_ratio` | VARCHAR(10) | Seitenverhältnis | 1:1, 4:5, 16:9, 9:16, 1.91:1 |
| `file_size` | INTEGER | Dateigröße | |
| `generated_at` | TIMESTAMP | Generierungszeitpunkt | DEFAULT now() |

**Indizes:**
- UNIQUE(media_id, platform, variant_type)
- INDEX(media_id)

---

#### `content_templates`

| Feld | Typ | Beschreibung | Constraints |
|------|-----|-------------|-------------|
| `id` | UUID | Primärschlüssel | PK |
| `venue_id` | UUID | Verweis auf Veranstalter (NULL = System-Template) | FK → venues.id, NULLABLE |
| `name` | VARCHAR(255) | Template-Name | NOT NULL |
| `description` | TEXT | Beschreibung | |
| `category` | ENUM | Kategorie | event_announcement, ticket_reminder, thank_you, quote, behind_scenes, custom |
| `master_template` | TEXT | Template mit Platzhaltern | NOT NULL |
| `hashtag_set` | TEXT[] | Standard-Hashtags | DEFAULT [] |
| `platform_overrides` | JSONB | Plattform-spezifische Anpassungen | DEFAULT {} |
| `is_system` | BOOLEAN | System-Template | DEFAULT false |
| `created_by` | UUID | Ersteller | FK → users.id |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt | DEFAULT now() |
| `updated_at` | TIMESTAMP | Letzte Aktualisierung | DEFAULT now() |

---

#### `template_placeholders`

| Feld | Typ | Beschreibung | Constraints |
|------|-----|-------------|-------------|
| `id` | UUID | Primärschlüssel | PK |
| `template_id` | UUID | Verweis auf Template | FK → content_templates.id, ON DELETE CASCADE |
| `placeholder_key` | VARCHAR(100) | Platzhalter-Schlüssel | NOT NULL |
| `description` | VARCHAR(255) | Beschreibung | |
| `data_source` | ENUM | Datenquelle | event_field, venue_field, custom, auto |
| `default_value` | TEXT | Standardwert | NULLABLE |
| `required` | BOOLEAN | Pflichtfeld | DEFAULT false |

---

#### `social_analytics`

| Feld | Typ | Beschreibung | Constraints |
|------|-----|-------------|-------------|
| `id` | UUID | Primärschlüssel | PK |
| `account_id` | UUID | Verweis auf Account | FK → social_accounts.id |
| `date` | DATE | Datum der Aggregationsperiode | NOT NULL |
| `posts_published` | INTEGER | Veröffentlichte Posts | DEFAULT 0 |
| `total_reach` | INTEGER | Gesamtreichweite | DEFAULT 0 |
| `total_impressions` | INTEGER | Gesamt-Impressions | DEFAULT 0 |
| `total_likes` | INTEGER | Likes | DEFAULT 0 |
| `total_comments` | INTEGER | Kommentare | DEFAULT 0 |
| `total_shares` | INTEGER | Shares | DEFAULT 0 |
| `total_clicks` | INTEGER | Link-Klicks | DEFAULT 0 |
| `follower_change` | INTEGER | Follower-Veränderung | DEFAULT 0 |
| `engagement_rate` | DECIMAL(5,4) | Engagement-Rate | DEFAULT 0 |
| `fetched_at` | TIMESTAMP | Abrufzeitpunkt | DEFAULT now() |

**Indizes:**
- UNIQUE(account_id, date)
- INDEX(account_id, date)

---

#### `social_analytics_posts`

| Feld | Typ | Beschreibung | Constraints |
|------|-----|-------------|-------------|
| `id` | UUID | Primärschlüssel | PK |
| `variant_id` | UUID | Verweis auf Post-Variante | FK → social_post_variants.id |
| `post_id` | UUID | Verweis auf Master-Post | FK → social_posts.id |
| `collected_at` | TIMESTAMP | Zeitpunkt der Datenerhebung | DEFAULT now() |
| `reach` | INTEGER | Reichweite | DEFAULT 0 |
| `impressions` | INTEGER | Impressions | DEFAULT 0 |
| `likes` | INTEGER | Likes | DEFAULT 0 |
| `comments` | INTEGER | Kommentare | DEFAULT 0 |
| `shares` | INTEGER | Shares | DEFAULT 0 |
| `clicks` | INTEGER | Link-Klicks | DEFAULT 0 |
| `saved` | INTEGER | Gespeichert (Instagram) | DEFAULT 0 |
| `video_views` | INTEGER | Video-Views | DEFAULT 0 |
| `watch_time` | INTEGER | Gesamte Watch-Time in Sekunden | DEFAULT 0 |

---

#### `posting_time_recommendations`

| Feld | Typ | Beschreibung | Constraints |
|------|-----|-------------|-------------|
| `id` | UUID | Primärschlüssel | PK |
| `account_id` | UUID | Verweis auf Account | FK → social_accounts.id |
| `day_of_week` | INTEGER | Wochentag (0=So, 6=Sa) | NOT NULL |
| `hour` | INTEGER | Stunde (0-23) | NOT NULL |
| `score` | DECIMAL(5,4) | Empfehlungsscore (0-1) | NOT NULL |
| `confidence` | DECIMAL(5,4) | Konfidenzlevel | NOT NULL |
| `sample_size` | INTEGER | Anzahl Datenpunkte | DEFAULT 0 |
| `calculated_at` | TIMESTAMP | Berechnungszeitpunkt | DEFAULT now() |

**Indizes:**
- UNIQUE(account_id, day_of_week, hour)
- INDEX(account_id, score DESC)

---

#### `event_sync_mappings`

| Feld | Typ | Beschreibung | Constraints |
|------|-----|-------------|-------------|
| `id` | UUID | Primärschlüssel | PK |
| `event_id` | UUID | Verweis auf System-Event | FK → events.id, ON DELETE CASCADE |
| `account_id` | UUID | Verweis auf Account | FK → social_accounts.id |
| `platform` | ENUM | Zielplattform | facebook, google_business |
| `sync_type` | ENUM | Art der Synchronisation | event, post, both |
| `platform_event_id` | VARCHAR(255) | Externe Event-ID | NULLABLE |
| `platform_event_url` | TEXT | URL zum externen Event | NULLABLE |
| `last_synced_at` | TIMESTAMP | Letzte Synchronisation | NULLABLE |
| `sync_status` | ENUM | Status | synced, pending, failed, disabled |
| `error_message` | TEXT | Fehlermeldung | NULLABLE |
| `auto_sync` | BOOLEAN | Automatische Synchronisation | DEFAULT true |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt | DEFAULT now() |

**Indizes:**
- UNIQUE(event_id, account_id)
- INDEX(event_id, sync_status)

---

#### `platform_rate_limits`

| Feld | Typ | Beschreibung | Constraints |
|------|-----|-------------|-------------|
| `id` | UUID | Primärschlüssel | PK |
| `account_id` | UUID | Verweis auf Account | FK → social_accounts.id |
| `platform` | ENUM | Plattform | |
| `endpoint` | VARCHAR(255) | API-Endpunkt | |
| `limit` | INTEGER | Max. Anzahl Calls | |
| `remaining` | INTEGER | Verbleibende Calls | |
| `reset_at` | TIMESTAMP | Reset-Zeitpunkt | |
| `last_updated` | TIMESTAMP | Letzte Aktualisierung | DEFAULT now() |

---

### 3.3 Beziehungsdiagramm (vereinfacht)

```
venues
  │
  ├── social_accounts (1:N)
  │     ├── social_analytics (1:N)
  │     ├── posting_time_recommendations (1:N)
  │     └── platform_rate_limits (1:N)
  │
  ├── social_posts (1:N)
  │     ├── social_post_variants (1:N) ──→ social_accounts
  │     ├── post_schedules (1:1)
  │     ├── social_analytics_posts (1:N)
  │     └── content_templates (N:1, optional)
  │
  ├── media_library (1:N)
  │     └── media_variants (1:N)
  │
  ├── content_templates (1:N)
  │     └── template_placeholders (1:N)
  │
  └── event_sync_mappings (1:N) ──→ events, social_accounts
```

---

## 4. API-Endpunkte

### 4.1 REST-Endpunkte

#### Account-Verwaltung

| Methode | Endpunkt | Beschreibung |
|---------|----------|-------------|
| `GET` | `/api/v1/social/accounts` | Alle verbundenen Accounts listen |
| `POST` | `/api/v1/social/accounts/connect/:platform` | OAuth-Verbindung initiieren |
| `GET` | `/api/v1/social/accounts/callback/:platform` | OAuth-Callback |
| `GET` | `/api/v1/social/accounts/:id` | Account-Details |
| `DELETE` | `/api/v1/social/accounts/:id` | Account trennen |
| `GET` | `/api/v1/social/accounts/:id/freshness` | Token-Status prüfen |
| `POST` | `/api/v1/social/accounts/:id/refresh` | Token manuell erneuern |

#### Posts

| Methode | Endpunkt | Beschreibung |
|---------|----------|-------------|
| `GET` | `/api/v1/social/posts` | Posts listen (mit Filter: status, platform, date range) |
| `POST` | `/api/v1/social/posts` | Neuen Post erstellen |
| `GET` | `/api/v1/social/posts/:id` | Post-Details inkl. Varianten |
| `PUT` | `/api/v1/social/posts/:id` | Post bearbeiten |
| `DELETE` | `/api/v1/social/posts/:id` | Post löschen |
| `POST` | `/api/v1/social/posts/:id/publish-now` | Sofort veröffentlichen |
| `POST` | `/api/v1/social/posts/:id/duplicate` | Post duplizieren |
| `GET` | `/api/v1/social/posts/:id/preview` | Vorschau aller Varianten |

#### Scheduling

| Methode | Endpunkt | Beschreibung |
|---------|----------|-------------|
| `GET` | `/api/v1/social/schedule` | Geplante Posts im Zeitraum |
| `GET` | `/api/v1/social/schedule/calendar` | Kalender-Daten (Monats-View) |
| `POST` | `/api/v1/social/schedule/:postId` | Post planen |
| `PUT` | `/api/v1/social/schedule/:postId` | Planung aktualisieren |
| `DELETE` | `/api/v1/social/schedule/:postId` | Planung stornieren |

#### Media Library

| Methode | Endpunkt | Beschreibung |
|---------|----------|-------------|
| `GET` | `/api/v1/social/media` | Medien listen (mit Filter, Paginierung) |
| `POST` | `/api/v1/social/media/upload` | Medium hochladen |
| `GET` | `/api/v1/social/media/:id` | Medium-Details |
| `DELETE` | `/api/v1/social/media/:id` | Medium löschen |
| `POST` | `/api/v1/social/media/:id/crop` | Medium zuschneiden |
| `POST` | `/api/v1/social/media/:id/generate-variants` | Plattform-Varianten generieren |
| `GET` | `/api/v1/social/media/:id/variants` | Alle Varianten anzeigen |
| `GET` | `/api/v1/social/media/albums` | Alben/Ordner listen |

#### Templates

| Methode | Endpunkt | Beschreibung |
|---------|----------|-------------|
| `GET` | `/api/v1/social/templates` | Templates listen |
| `POST` | `/api/v1/social/templates` | Template erstellen |
| `GET` | `/api/v1/social/templates/:id` | Template-Details |
| `PUT` | `/api/v1/social/templates/:id` | Template bearbeiten |
| `DELETE` | `/api/v1/social/templates/:id` | Template löschen |
| `POST` | `/api/v1/social/templates/:id/apply` | Template auf Post anwenden |

#### Analytics

| Methode | Endpunkt | Beschreibung |
|---------|----------|-------------|
| `GET` | `/api/v1/social/analytics/overview` | Übersicht aller Plattformen |
| `GET` | `/api/v1/social/analytics/platform/:platform` | Details pro Plattform |
| `GET` | `/api/v1/social/analytics/posts` | Post-Level Analytics |
| `GET` | `/api/v1/social/analytics/best-times` | Beste Posting-Zeiten |
| `GET` | `/api/v1/social/analytics/export` | Daten exportieren (CSV/PDF) |
| `POST` | `/api/v1/social/analytics/fetch` | Manuelles Daten-Aktualisieren |

#### Event-Synchronisation

| Methode | Endpunkt | Beschreibung |
|---------|----------|-------------|
| `GET` | `/api/v1/social/event-sync` | Alle Sync-Mappings |
| `POST` | `/api/v1/social/event-sync/:eventId` | Sync für Event einrichten |
| `POST` | `/api/v1/social/event-sync/:eventId/sync-now` | Manuelle Synchronisation |
| `PUT` | `/api/v1/social/event-sync/:id` | Sync-Einstellungen aktualisieren |
| `DELETE` | `/api/v1/social/event-sync/:id` | Sync deaktivieren |

#### Rate Limits & Health

| Methode | Endpunkt | Beschreibung |
|---------|----------|-------------|
| `GET` | `/api/v1/social/rate-limits` | Aktuelle Rate-Limits |
| `GET` | `/api/v1/social/health` | Gesundheitsstatus aller Verbindungen |

### 4.2 GraphQL Schema (Ausschnitt)

```graphql
type SocialAccount {
  id: ID!
  platform: SocialPlatform!
  accountName: String!
  profilePictureUrl: String
  followerCount: Int!
  status: AccountStatus!
  isTokenFresh: Boolean!
  settings: JSON
}

type SocialPost {
  id: ID!
  contentType: ContentType!
  status: PostStatus!
  masterContent: String!
  masterHashtags: [String!]!
  scheduledAt: DateTime
  publishedAt: DateTime
  variants: [PostVariant!]!
  media: [MediaItem!]!
}

type PostVariant {
  id: ID!
  platform: SocialPlatform!
  account: SocialAccount!
  adaptedContent: String!
  characterCount: Int!
  status: PublishStatus!
  platformPostUrl: String
  preview: PostPreview!
}

type PostPreview {
  renderedContent: String!
  mediaUrls: [String!]!
  characterWarning: Boolean!
  formatWarning: Boolean!
  warnings: [String!]!
}

type MediaItem {
  id: ID!
  filename: String!
  fileType: FileType!
  url: String!
  variants: [MediaVariant!]!
}

type MediaVariant {
  id: ID!
  platform: SocialPlatform!
  variantType: VariantType!
  url: String!
  aspectRatio: String!
  dimensions: Dimensions!
}

type AnalyticsOverview {
  platform: SocialPlatform!
  periodStart: Date!
  periodEnd: Date!
  postsPublished: Int!
  totalReach: Int!
  totalImpressions: Int!
  totalEngagements: Int!
  engagementRate: Float!
  followerChange: Int!
  topPosts: [PostAnalytics!]!
}

type PostingTimeRecommendation {
  dayOfWeek: Int!
  hour: Int!
  score: Float!
  confidence: Float!
}

enum SocialPlatform {
  FACEBOOK
  INSTAGRAM
  TWITTER
  TIKTOK
  LINKEDIN
  GOOGLE_BUSINESS
}

enum ContentType {
  TEXT
  IMAGE
  VIDEO
  CAROUSEL
  STORY
  REEL
  EVENT
}

type Query {
  socialAccounts: [SocialAccount!]!
  socialPosts(filter: PostFilterInput): [SocialPost!]!
  scheduledPosts(startDate: Date!, endDate: Date!): [SocialPost!]!
  mediaLibrary(filter: MediaFilterInput): [MediaItem!]!
  analyticsOverview(period: AnalyticsPeriodInput!): [AnalyticsOverview!]!
  bestPostingTimes(accountId: ID!): [PostingTimeRecommendation!]!
  postPreview(postId: ID!, platform: SocialPlatform!): PostPreview!
}

type Mutation {
  connectAccount(platform: SocialPlatform!, authCode: String!): SocialAccount!
  disconnectAccount(accountId: ID!): Boolean!
  createPost(input: CreatePostInput!): SocialPost!
  updatePost(id: ID!, input: UpdatePostInput!): SocialPost!
  schedulePost(postId: ID!, scheduledFor: DateTime!, recurrence: RecurrenceInput): SocialPost!
  publishNow(postId: ID!): [PostVariant!]!
  uploadMedia(file: Upload!, tags: [String!], albumId: ID): MediaItem!
  generateMediaVariants(mediaId: ID!): [MediaVariant!]!
  syncEvent(eventId: ID!, accountIds: [ID!]!): [EventSyncResult!]!
}
```

---

## 5. UI-Komponenten

### 5.1 Seiten/Routen

| Route | Seite | Beschreibung |
|-------|-------|-------------|
| `/social` | Social Hub Dashboard | Übersicht aller Kanäle, letzte Posts, Quick-Stats |
| `/social/posts` | Post-Liste | Alle Posts mit Filter und Suche |
| `/social/posts/new` | Post-Editor | Neuer Post mit Cross-Posting-Editor |
| `/social/posts/:id/edit` | Post-Editor | Post bearbeiten |
| `/social/calendar` | Kalender-View | Monats-/Wochen-Kalender mit geplanten Posts |
| `/social/media` | Media Library | Bild-/Video-Bibliothek |
| `/social/media/:id` | Media Detail | Einzelmedium mit Varianten |
| `/social/analytics` | Analytics Dashboard | Statistiken und Reports |
| `/social/templates` | Template-Verwaltung | Templates erstellen und verwalten |
| `/social/accounts` | Account-Verwaltung | Verbundene Accounts verwalten |
| `/social/settings` | Social Hub Einstellungen | Globale Einstellungen |

### 5.2 React-Komponenten

#### Layout & Navigation

```
SocialHubLayout              # Layout mit Sidebar-Navigation
├── SocialSidebar            # Nav-Items: Dashboard, Posts, Calendar, Media, Analytics
├── SocialHeader             # Header mit Account-Selector und Quick-Actions
└── SocialBreadcrumb         # Breadcrumb-Navigation
```

#### Dashboard

```
SocialDashboard              # Haupt-Dashboard-Seite
├── AccountStatusCards       # Status-Karten pro verbundenem Account
│   ├── AccountStatusCard    # Einzelne Karte: Profilbild, Name, Follower, Status
│   └── ConnectionHealth     # Grün/Gelb/Rot-Indikator
├── RecentPostsWidget        # Letzte 5 Posts
├── UpcomingPostsWidget      # Nächste 5 geplante Posts
├── EngagementSummary        # Engagement-Chart (7 Tage)
└── QuickPostButton          # Schnell-Post-Button
```

#### Post-Editor

```
PostEditor                   # Haupt-Editor-Seite
├── PostEditorLayout         # Drei-Spalten-Layout
│   ├── EditorSidebar        # Linke Spalte: Plattform-Auswahl
│   │   └── PlatformSelector # Checkboxen pro Account
│   ├── EditorMain           # Mittlere Spalte: Editor
│   │   ├── ContentTypeSelector  # Text, Bild, Video, Carousel
│   │   ├── MasterTextEditor     # Haupt-Text-Editor (Rich Text / Markdown)
│   │   ├── HashtagInput         # Hashtag-Manager mit Vorschlägen
│   │   ├── MediaSelector        # Media-Picker aus Library
│   │   ├── TemplateSelector     # Template-Auswahl
│   │   └── CharacterCounter     # Zeichenzähler pro Plattform
│   └── EditorPreview      # Rechte Spalte: Live-Vorschau
│       └── PlatformPreviews   # Vorschau pro Plattform
│           ├── FacebookPreview
│           ├── InstagramPreview
│           ├── TwitterPreview
│           ├── TikTokPreview
│           ├── LinkedInPreview
│           └── GoogleBusinessPreview
├── SchedulePicker           # Datetime-Picker mit Timezone
├── RecurrenceSettings       # Wiederholungs-Einstellungen
└── PostActionBar            # Speichern / Planen / Sofort veröffentlichen
```

#### Kalender

```
PostingCalendar              # Kalender-Seite
├── CalendarToolbar          # Ansicht-Umschaltung, Zeitnavigation
├── CalendarMonthView        # Monatsansicht
├── CalendarWeekView         # Wochenansicht
├── CalendarDayView          # Tagesansicht (optional)
├── CalendarListView         # Listenansicht
├── CalendarPostCard         # Post-Darstellung im Kalender
│   ├── PostCardTooltip      # Tooltip mit Details bei Hover
│   └── PlatformBadges       # Badges pro Plattform
├── DragDropProvider         # React DnD Wrapper
└── CalendarLegend           # Farblegende pro Plattform
```

#### Media Library

```
MediaLibrary                 # Media-Library-Seite
├── MediaToolbar             # Upload-Button, Filter, Sortierung, Ansicht
├── MediaGrid                # Grid-Ansicht
├── MediaList                # Listenansicht
├── MediaCard                # Einzelnes Media-Item
│   ├── MediaThumbnail       # Vorschau-Bild
│   ├── MediaVariantsBadge   # Anzeige generierter Varianten
│   └── MediaActions         # Aktionen (Bearbeiten, Löschen)
├── MediaUploadModal         # Upload-Dialog
│   ├── UploadDropzone       # Drag & Drop Zone
│   ├── UploadProgress       # Fortschrittsanzeige
│   └── UploadPreview        # Vorschau vor Upload
├── MediaDetailModal         # Detail-Ansicht
│   ├── MediaPreview         # Große Vorschau
│   ├── MediaVariantsGrid    # Alle Varianten anzeigen
│   └── MediaMetadata        # EXIF-Daten, Dimensionen
├── MediaEditModal           # Bearbeiten-Dialog
│   ├── ImageCropper         # Zuschneide-Tool
│   ├── FilterSelector       # Bildfilter
│   └── TextOverlayTool      # Text-Overlay
└── AlbumSidebar             # Ordner/Album-Navigation
```

#### Analytics

```
AnalyticsDashboard           # Analytics-Seite
├── PeriodSelector           # Zeitraum-Auswahl
├── PlatformSelector         # Plattform-Filter
├── OverviewCards            # KPI-Karten
│   ├── TotalReachCard
│   ├── EngagementRateCard
│   ├── PostsPublishedCard
│   └── FollowerChangeCard
├── EngagementChart          # Linien-/Balken-Chart
├── PlatformComparison       # Plattform-Vergleich
├── TopPostsTable            # Top-Performing Posts
├── PostPerformanceChart     # Performance pro Post
├── BestTimesHeatmap         # Heatmap der besten Zeiten
└── ExportButton             # CSV/PDF Export
```

#### Templates

```
TemplateManager              # Template-Verwaltung
├── TemplateList             # Liste aller Templates
├── TemplateCard             # Einzelnes Template
├── TemplateEditor           # Template-Editor
│   ├── TemplateForm         # Name, Beschreibung, Kategorie
│   ├── TemplateEditorField  # Template-Text mit Platzhalter-Highlighting
│   ├── PlaceholderManager   # Platzhalter definieren
│   └── PlatformOverrides    # Plattform-spezifische Overrides
└── TemplatePreview          # Live-Vorschau mit Beispieldaten
```

#### Account-Verwaltung

```
AccountManager               # Account-Verwaltung-Seite
├── AccountConnectGrid       # Grid mit Plattform-Connect-Buttons
│   ├── ConnectButton        # OAuth-Connect-Button pro Plattform
│   └── PlatformInfoCard     # Info über Berechtigungen
├── ConnectedAccountsList    # Liste verbundener Accounts
│   └── AccountCard          # Einzelner Account
│       ├── AccountAvatar    # Profilbild
│       ├── AccountStats     # Follower, Posts
│       ├── TokenStatus      # Token-Health
│       └── AccountActions   # Trennen, Einstellungen
└── OAuthCallbackHandler     # Callback-Handler
```

### 5.3 Wiederverwendbare Komponenten

```
PlatformBadge                # Plattform-Icon + Name Badge
CharacterCounter             # Zeichenzähler mit Limit-Anzeige
HashtagInput                 # Hashtag-Input mit Autocomplete
MediaPreview                 # Responsive Media-Vorschau
LoadingSpinner               # Lade-Indikator
ErrorBoundary                # Fehlerbehandlung
ToastNotification            # Erfolgs-/Fehler-Benachrichtigungen
ConfirmDialog                # Bestätigungs-Dialog
EmptyState                   # Leer-Zustand mit Illustration
Pagination                   # Paginierung
SearchBar                    # Suchleiste
```

---

## 6. Integrationen

### 6.1 Übersicht externer APIs

| Plattform | API | Version | Authentifizierung | Rate Limits |
|-----------|-----|---------|-------------------|-------------|
| **Facebook** | Meta Graph API | v18.0+ | OAuth 2.0 | 200 Calls/h/App, 25 Posts/Seite/24h |
| **Instagram** | Instagram Graph API | v18.0+ | OAuth 2.0 | 200 Calls/h/App, 25 Posts/Tag |
| **Twitter/X** | X API v2 | v2 | OAuth 2.0 | Free: 500 Posts/Monat; Basic: 3.000/Monat; Pro: 300.000/Monat |
| **TikTok** | TikTok for Business API | v1 | OAuth 2.0 | ~15 Posts/Tag, native Sounds nicht via API |
| **LinkedIn** | LinkedIn API | v2 | OAuth 2.0 | 500 Posts/Tag, 3.000 Zeichen, App Review |
| **Google Business** | Google Business Profile API | v4 | OAuth 2.0 | Standard Google Quotas |

### 6.2 Meta Graph API (Facebook & Instagram)

**Endpoints:**
```
GET    /{page-id}                          # Seiten-Info
POST   /{page-id}/feed                     # Post auf Seite
POST   /{page-id}/photos                   # Foto-Upload
POST   /{page-id}/videos                   # Video-Upload
POST   /{page-id}/events                   # Event erstellen
GET    /{page-id}/insights                 # Analytics
POST   /{page-id}/published_posts          # Veröffentlichte Posts

# Instagram
POST   /{ig-user-id}/media                 # Media Container erstellen
POST   /{ig-user-id}/media_publish         # Container veröffentlichen
GET    /{ig-media-id}/insights             # Instagram Insights
```

**Scopes benötigt:**
- `pages_read_engagement`
- `pages_manage_posts`
- `instagram_basic`
- `instagram_content_publish`
- `pages_manage_events`

**Besonderheiten:**
- Instagram erfordert Business/Creator Account verbunden mit Facebook Page
- Video-Upload via async container-based flow
- Carousel-Posts erfordern speziellen Container-Flow
- Facebook Events: Page-Level, nicht Personal Profile

### 6.3 Twitter/X API v2

**Endpoints:**
```
POST   /2/tweets                           # Tweet erstellen
DELETE /2/tweets/:id                       # Tweet löschen
GET    /2/tweets/:id                       # Tweet abrufen
GET    /2/users/:id/tweets                 # User-Tweets
GET    /2/tweets/:id/quote_tweets          # Quote Tweets
POST   /2/media/upload                     # Media Upload (chunked)
GET    /2/users/:id                        # User-Info
```

**Scopes benötigt:**
- `tweet.read`, `tweet.write`, `users.read`, `offline.access`
- Für Media: `media.write`

**Besonderheiten:**
- Chunked Upload für Videos > 5MB
- 280 Zeichen Limit (4.000 für Verified/Blue)
- Thread-Erstellung via `reply` Parameter
- Free Tier: 500 Posts/Monat (sehr limitiert)

### 6.4 TikTok for Business API

**Endpoints:**
```
POST   /open-api/v1.3/video/upload/        # Video-Upload init
POST   /open-api/v1.3/video/publish/       # Video veröffentlichen
GET    /open-api/v1.3/video/list/          # Video-Liste
GET    /open-api/v1.3/video/info/          # Video-Details
GET    /open-api/v1.3/user/info/           # User-Info
```

**Scopes benötigt:**
- `video.upload`, `video.publish`, `user.info.basic`

**Besonderheiten:**
- Nur Video-Content (keine Text-Posts)
- Native Sounds NICHT via API verfügbar
- ~15 Posts/Tag Limit
- Video muss vor Upload lokal vorhanden sein
- Keine direkte Story-API

### 6.5 LinkedIn API

**Endpoints:**
```
POST   /v2/ugcPosts                        # Post erstellen (UGC)
POST   /v2/posts                           # Post erstellen (neu)
POST   /v2/assets?action=registerUpload    # Media-Upload registrieren
GET    /v2/organizationalEntityShareStatistics # Analytics
GET    /v2/networkSizes/:urn               # Follower-Zahlen
PUT    /v2/mediaTransforms                 # Bild-Transformationen
```

**Scopes benötigt:**
- `r_basicprofile`, `r_organization_social`, `w_organization_social`
- App Review erforderlich für Produktions-Access

**Besonderheiten:**
- 3.000 Zeichen Limit
- Organisations-Posts vs. Personal Posts
- Media Upload via 2-step registerUpload + upload
- App Review kann mehrere Wochen dauern

### 6.6 Google Business Profile API

**Endpoints:**
```
GET    /v4/accounts                         # Accounts listen
GET    /v4/accounts/{accountId}/locations   # Locations listen
POST   /v4/accounts/{accountId}/locations/{locationId}/localPosts   # Post erstellen
POST   /v4/accounts/{accountId}/locations/{locationId}/localPosts:event  # Event-Post
DELETE /v4/accounts/.../localPosts/{postId} # Post löschen
GET    /v4/accounts/.../localPosts          # Posts abrufen
GET    /v4/accounts/.../insights            # Insights
```

**Scopes benötigt:**
- `https://www.googleapis.com/auth/business.manage`

**Besonderheiten:**
- Posts haben 7-Tage Sichtbarkeit (außer Event-Posts)
- Event-Posts bleiben bis zum Event-Datum sichtbar
- Unterstützt Offer-Posts, Event-Posts, Update-Posts
- Bilder: Mindestens 480x360px, empfohlen 1200x900px

### 6.7 Open-Source Alternative: Mixpost-Integration

Falls Self-Hosting bevorzugt wird, kann Mixpost als Backend dienen:

| Aspekt | Details |
|--------|---------|
| **Lizenz** | MIT License |
| **Hosting** | Self-hosted (Laravel PHP) |
| **API** | REST API |
| **Features** | Multi-Account, Scheduling, Analytics, Team-Collaboration |
| **Plattformen** | Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube, Pinterest, Mastodon |
| **Vorteile** | Keine API-Rate-Limits durch eigene Infrastruktur, volle Kontrolle |
| **Nachteile** | Eigenes Hosting erforderlich, Setup-Aufwand |

**Integrationsansatz:**
- Mixpost als Self-Hosted-Option anbieten
- API-Wrapper bauen, der Mixpost-API anspricht
- Fallback: Direkte API-Integration für Cloud-Hosting-Variante

---

## 7. Technische Details

### 7.1 Architekturübersicht

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React)                        │
│  PostEditor  │  Calendar  │  MediaLibrary  │  Analytics    │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    API Gateway                               │
│         Auth │ Rate Limiting │ Validation │ Logging          │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬──────────────┐
        ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
│  Post        │ │ Media    │ │ Scheduler│ │ Analytics    │
│  Service     │ │ Service  │ │ Service  │ │ Service      │
└──────┬───────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘
       │              │            │              │
       ▼              ▼            ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Datenbank (PostgreSQL)                    │
│   social_accounts │ social_posts │ media_library │ analytics │
└─────────────────────────────────────────────────────────────┘
       │              │            │              │
       ▼              ▼            ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│              Externe APIs                                    │
│  Meta Graph │ Twitter/X │ TikTok │ LinkedIn │ Google Biz    │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 OAuth-Flows

#### Standard OAuth 2.0 Flow (alle Plattformen)

```
1. Nutzer klickt "Account verbinden" in UI
2. Backend generiert state-Parameter + PKCE (falls erforderlich)
3. Redirect zur Plattform-Autorisierungs-URL
4. Nutzer gewährt Berechtigungen
5. Plattform redirected mit code + state zurück
6. Backend validiert state, tauscht code gegen Tokens
7. Tokens verschlüsselt in DB speichern
8. Account-Informationen abrufen und speichern
9. Nutzer zurück zum Dashboard redirecten
```

**Implementierungsdetails pro Plattform:**

| Plattform | PKCE | Refresh Token | Token-Lifetime | Besonderheiten |
|-----------|------|---------------|----------------|----------------|
| Facebook | Nein | Ja | ~60 Tage | Long-lived Token via Exchange |
| Instagram | Nein | Ja | ~60 Tage | Gleich wie Facebook |
| Twitter/X | Ja | Ja | ~2 Stunden (Access) | PKCE erforderlich |
| TikTok | Ja | Ja | 24h (Access) | Refresh 365 Tage gültig |
| LinkedIn | Ja | Ja | 60 Tage (Access) | Refresh 365 Tage gültig |
| Google | Ja | Ja | 1h (Access) | Standard Google OAuth |

**Token-Refresh-Strategie:**
- Hintergrund-Job prüft alle 6h ablaufende Tokens
- Refresh 7 Tage vor Ablauf
- Bei Fehlgeschlagenem Refresh: Account-Status auf `expired` setzen, Benachrichtigung senden
- Verschlüsselung: AES-256-GCM für Tokens in DB

### 7.3 Rate-Limiting-Strategie

#### Rate-Limit-Tracking

```typescript
// Pseudocode für Rate-Limit-Management
interface RateLimitEntry {
  platform: SocialPlatform;
  endpoint: string;
  limit: number;
  remaining: number;
  resetAt: Date;
  windowMs: number;
}

class RateLimitManager {
  // Vor jedem API-Call prüfen
  async checkLimit(platform: SocialPlatform, endpoint: string): Promise<boolean> {
    const limit = await this.getLimit(platform, endpoint);
    if (limit.remaining <= 5) {  // Safety buffer
      const waitMs = limit.resetAt.getTime() - Date.now();
      if (waitMs > 0) {
        await this.delay(waitMs);
      }
    }
    return limit.remaining > 0;
  }

  // Nach jedem API-Call aktualisieren
  async updateLimit(platform: SocialPlatform, endpoint: string, headers: Headers) {
    const limit = parseInt(headers.get('x-rate-limit-limit'));
    const remaining = parseInt(headers.get('x-rate-limit-remaining'));
    const resetAt = new Date(parseInt(headers.get('x-rate-limit-reset')) * 1000);
    await this.storeLimit({ platform, endpoint, limit, remaining, resetAt });
  }
}
```

#### Plattform-spezifische Limits

| Plattform | Limit-Typ | Limit | Reset |
|-----------|-----------|-------|-------|
| Facebook | App-Level | 200 Calls/Stunde | Stündlich |
| Facebook | Page-Level | 25 Posts/24h | Täglich |
| Instagram | App-Level | 200 Calls/Stunde | Stündlich |
| Instagram | Publish | 25 Posts/Tag | Täglich |
| Twitter/X | Free Tier | 500 Posts/Monat | Monatlich |
| Twitter/X | Basic Tier | 3.000 Posts/Monat | Monatlich |
| Twitter/X | Upload | 50MB/Video | - |
| TikTok | Daily | ~15 Posts/Tag | Täglich |
| LinkedIn | Daily | 500 Posts/Tag | Täglich |
| Google Business | Standard | 1.000 Calls/Tag | Täglich |

**Exponential Backoff bei Fehlern:**
```typescript
async function apiCallWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.isRateLimited && attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
}
```

### 7.4 Media-Upload-Strategie

#### Upload-Fluss

```
1. Client lädt Datei hoch → temporärer Speicher (S3/MinIO)
2. Media Service validiert Datei (Typ, Größe, Format)
3. Media Service speichert Original in Media Library
4. Async Job generiert Plattform-Varianten (siehe 7.6)
5. Varianten werden gespeichert und verknüpft
6. Client erhält Bestätigung mit allen URLs
```

#### Upload-Limits

| Plattform | Max. Bildgröße | Bildformate | Max. Video | Videoformate |
|-----------|---------------|-------------|------------|--------------|
| Facebook | 8 MB | JPG, PNG, GIF, WebP | 10 GB | MP4, MOV |
| Instagram | 8 MB | JPG, PNG | 1 GB (60s) | MP4, MOV |
| Twitter/X | 5 MB | JPG, PNG, GIF, WebP | 512 MB | MP4, MOV |
| TikTok | - | - | 1 GB (10 Min.) | MP4, MOV |
| LinkedIn | 8 MB | JPG, PNG, GIF | 5 GB | MP4, MOV |
| Google Business | 10 MB | JPG, PNG | - | - |

#### Chunked Upload für große Videos

```typescript
// Twitter/X Chunked Upload
interface ChunkedUpload {
  // INIT: Upload registrieren
  initUpload(fileSize: number, mediaType: string): Promise<{
    mediaId: string;
    expiresAfterSecs: number;
  }>;

  // APPEND: Datei in Chunks senden (max 5MB pro Chunk)
  appendChunks(mediaId: string, fileStream: ReadableStream): Promise<void>;

  // FINALIZE: Upload abschließen
  finalizeUpload(mediaId: string): Promise<{
    mediaId: string;
    processingInfo?: { state: 'pending' | 'in_progress' | 'failed' | 'succeeded' };
  }>;

  // STATUS: Verarbeitungsstatus prüfen (bei Videos)
  checkStatus(mediaId: string): Promise<ProcessingStatus>;
}
```

### 7.5 Scheduling-Architektur

#### Aufbau

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  PostgreSQL      │     │  Redis Queue     │     │  Worker Nodes   │
│  post_schedules  │────▶│  (Bull MQ)       │────▶│  (Publish Jobs) │
│  (Source of      │     │  - Delayed Jobs  │     │  - Rate Limit   │
│   Truth)         │     │  - Job Queue     │     │  - Retry Logic  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                              │
                                                              ▼
                                                    ┌─────────────────┐
                                                    │  External APIs   │
                                                    └─────────────────┘
```

**Job-Typen:**

| Job | Beschreibung | Häufigkeit |
|-----|-------------|------------|
| `publish_post` | Post auf Plattform veröffentlichen | Einmalig (geplant) |
| `refresh_tokens` | OAuth-Token erneuern | Alle 6h |
| `fetch_analytics` | Analytics-Daten abrufen | Täglich |
| `calculate_best_times` | Beste Posting-Zeiten berechnen | Wöchentlich |
| `sync_events` | Event-Synchronisation | Bei Event-Änderung |
| `cleanup_old_media` | Alte temporäre Medien löschen | Täglich |

**Retry-Strategie:**
- Max. 5 Retries bei Fehlern
- Exponential Backoff: 1min, 5min, 15min, 1h, 4h
- Nach max. Retries: Status auf `failed`, Benachrichtigung

### 7.6 Automatische Bildanpassung

#### Bildformat-Matrix

| Plattform | Feed-Post | Story | Reel/Video | Profilbild |
|-----------|-----------|-------|------------|------------|
| **Facebook** | 1200×630 (1.91:1) | - | - | 170×170 |
| **Instagram** | 1080×1080 (1:1) | 1080×1920 (9:16) | 1080×1920 (9:16) | 320×320 |
| **Twitter/X** | 1200×675 (16:9) | - | - | 400×400 |
| **TikTok** | - | - | 1080×1920 (9:16) | 200×200 |
| **LinkedIn** | 1200×627 (1.91:1) | - | - | 400×400 |
| **Google Business** | 1200×900 (4:3) | - | - | 250×250 |

#### Bildverarbeitungspipeline

```
Original-Upload
      │
      ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  1. Validate │───▶│  2. Resize  │───▶│  3. Format  │───▶│  4. Optimize│
│     File     │    │  & Crop     │    │  Convert    │    │   (Quality) │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                              │
              ┌──────────────┬──────────────┬─────────────────┤
              ▼              ▼              ▼                 ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐       ┌──────────┐
        │ Facebook │  │Instagram │  │ Twitter  │  ...  │ LinkedIn │
        │ Variant  │  │ Variant  │  │ Variant  │       │ Variant  │
        └──────────┘  └──────────┘  └──────────┘       └──────────┘
```

#### Sharp.js Verarbeitungsbeispiel

```typescript
import sharp from 'sharp';

interface VariantConfig {
  platform: SocialPlatform;
  variantType: 'feed' | 'story' | 'reel' | 'cover';
  width: number;
  height: number;
  fit: 'cover' | 'contain' | 'fill';
  format: 'jpeg' | 'png' | 'webp';
  quality: number;
}

const VARIANT_CONFIGS: VariantConfig[] = [
  // Facebook Feed
  { platform: 'facebook', variantType: 'feed', width: 1200, height: 630, fit: 'cover', format: 'jpeg', quality: 85 },
  // Instagram Feed (Square)
  { platform: 'instagram', variantType: 'feed', width: 1080, height: 1080, fit: 'cover', format: 'jpeg', quality: 90 },
  // Instagram Story
  { platform: 'instagram', variantType: 'story', width: 1080, height: 1920, fit: 'cover', format: 'jpeg', quality: 90 },
  // Twitter/X
  { platform: 'twitter', variantType: 'feed', width: 1200, height: 675, fit: 'cover', format: 'jpeg', quality: 85 },
  // LinkedIn
  { platform: 'linkedin', variantType: 'feed', width: 1200, height: 627, fit: 'cover', format: 'jpeg', quality: 85 },
  // Google Business
  { platform: 'google_business', variantType: 'feed', width: 1200, height: 900, fit: 'cover', format: 'jpeg', quality: 85 },
];

async function generateVariants(
  inputBuffer: Buffer,
  originalMetadata: sharp.Metadata
): Promise<MediaVariant[]> {
  const variants: MediaVariant[] = [];

  for (const config of VARIANT_CONFIGS) {
    const outputBuffer = await sharp(inputBuffer)
      .resize(config.width, config.height, {
        fit: config.fit,
        position: 'center',  // Smart crop: center, entropy, attention
      })
      .toFormat(config.format, { quality: config.quality })
      .toBuffer();

    // Upload to storage (S3/MinIO)
    const url = await uploadToStorage(outputBuffer, generateFilename(config));

    variants.push({
      platform: config.platform,
      variantType: config.variantType,
      url,
      width: config.width,
      height: config.height,
      aspectRatio: `${config.width}:${config.height}`,
      fileSize: outputBuffer.length,
    });
  }

  return variants;
}

// Smart Crop mit Gesichtserkennung
async function smartCrop(inputBuffer: Buffer, targetWidth: number, targetHeight: number): Promise<Buffer> {
  return sharp(inputBuffer)
    .resize(targetWidth, targetHeight, {
      fit: 'cover',
      position: sharp.strategy.attention,  // Gesichter/Salient Regions
    })
    .toBuffer();
}
```

#### Video-Verarbeitung

```typescript
import ffmpeg from 'fluent-ffmpeg';

interface VideoVariantConfig {
  platform: SocialPlatform;
  resolution: [number, number];  // width, height
  maxBitrate: string;
  maxDuration: number;  // seconds
  format: 'mp4';
}

const VIDEO_VARIANTS: VideoVariantConfig[] = [
  { platform: 'instagram', resolution: [1080, 1920], maxBitrate: '3500k', maxDuration: 60, format: 'mp4' },
  { platform: 'tiktok', resolution: [1080, 1920], maxBitrate: '5000k', maxDuration: 600, format: 'mp4' },
  { platform: 'facebook', resolution: [1280, 720], maxBitrate: '4000k', maxDuration: 240, format: 'mp4' },
  { platform: 'twitter', resolution: [1280, 720], maxBitrate: '2500k', maxDuration: 140, format: 'mp4' },
];

async function processVideo(
  inputPath: string,
  config: VideoVariantConfig
): Promise<string> {
  const outputPath = generateOutputPath(inputPath, config);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .size(`${config.resolution[0]}x${config.resolution[1]}`)
      .videoBitrate(config.maxBitrate)
      .outputOptions([
        '-movflags faststart',     // Web-Streaming optimiert
        '-pix_fmt yuv420p',        // Kompatibilität
        '-profile:v baseline',     // Maximale Kompatibilität
        '-level 3.0',
      ])
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .save(outputPath);
  });
}
```

### 7.7 Beste Posting-Zeiten Algorithmus

```typescript
interface PostData {
  platform: SocialPlatform;
  dayOfWeek: number;   // 0-6
  hour: number;        // 0-23
  reach: number;
  engagements: number;
  engagementRate: number;
}

function calculateOptimalPostingTimes(
  posts: PostData[],
  platform: SocialPlatform
): PostingTimeRecommendation[] {
  // Gruppiere nach Wochentag und Stunde
  const grouped = groupBy(posts, p => `${p.dayOfWeek}-${p.hour}`);

  const recommendations: PostingTimeRecommendation[] = [];

  for (const [key, group] of grouped) {
    const [dayOfWeek, hour] = key.split('-').map(Number);

    // Berechne gewichteten Score
    const avgEngagementRate = mean(group.map(p => p.engagementRate));
    const avgReach = mean(group.map(p => p.reach));
    const sampleSize = group.length;

    // Normalisierte Werte (0-1)
    const normalizedEngagement = normalize(avgEngagementRate, allEngagementRates);
    const normalizedReach = normalize(avgReach, allReachValues);

    // Gewichteter Score: 60% Engagement, 40% Reach
    const score = (normalizedEngagement * 0.6) + (normalizedReach * 0.4);

    // Konfidenz basierend auf Sample-Size
    const confidence = Math.min(sampleSize / 10, 1);  // Max bei 10+ Posts

    recommendations.push({ dayOfWeek, hour, score, confidence, sampleSize });
  }

  // Sortiere nach Score
  return recommendations.sort((a, b) => b.score - a.score);
}

// Für neue Accounts ohne Historie: Branchen-Defaults
const INDUSTRY_DEFAULTS: PostingTimeRecommendation[] = [
  // Kultur/Entertainment - typisch beste Zeiten
  { dayOfWeek: 4, hour: 18, score: 0.95, confidence: 0.3, sampleSize: 0 },  // Do 18:00
  { dayOfWeek: 5, hour: 19, score: 0.92, confidence: 0.3, sampleSize: 0 },  // Fr 19:00
  { dayOfWeek: 3, hour: 17, score: 0.88, confidence: 0.3, sampleSize: 0 },  // Mi 17:00
  { dayOfWeek: 6, hour: 15, score: 0.85, confidence: 0.3, sampleSize: 0 },  // Sa 15:00
  { dayOfWeek: 2, hour: 18, score: 0.82, confidence: 0.3, sampleSize: 0 },  // Di 18:00
];
```

### 7.8 Event-Synchronisation-Fluss

```
Event im System erstellen/bearbeiten
      │
      ▼
┌─────────────────┐
│  Event-Sync     │
│  Trigger        │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐  ┌────────┐
│Facebook│  │ Google │
│ Events │  │Business│
└───┬───┘  └───┬────┘
    │          │
    ▼          ▼
┌─────────────────────────┐
│ 1. Event-Daten mappen   │
│    - Titel              │
│    - Beschreibung       │
│    - Datum/Zeit         │
│    - Ort                │
│    - Bild               │
│    - Ticket-Link        │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 2. Bild anpassen        │
│    Facebook: 1920×1080  │
│    Google: 1200×900     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 3. API-Aufruf           │
│    - Event erstellen    │
│    - oder aktualisieren │
│      (falls vorhanden)  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 4. Sync-Mapping speichern│
│    - platform_event_id  │
│    - sync_status        │
└─────────────────────────┘
```

### 7.9 Spezifische Libraries & Dependencies

#### Backend

```json
{
  "dependencies": {
    "sharp": "^0.33.0",              // Bildverarbeitung
    "fluent-ffmpeg": "^2.1.2",       // Video-Verarbeitung
    "bullmq": "^5.0.0",              // Job-Queue (Redis-basiert)
    "ioredis": "^5.3.0",             // Redis-Client
    "node-cron": "^3.0.3",           // Cron-Jobs
    "axios": "^1.6.0",               // HTTP-Client
    "jose": "^5.0.0",                // JWT/OAuth
    "date-fns": "^3.0.0",            // Datumsmanipulation
    "date-fns-tz": "^2.0.0",         // Timezone-Handling
    "@aws-sdk/client-s3": "^3.450.0", // S3-Upload
    "form-data": "^4.0.0",           // Multipart Uploads
    "crypto-js": "^4.2.0"            // Token-Verschlüsselung
  }
}
```

#### Frontend

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.0.0",     // Server State Management
    "@tanstack/react-table": "^8.10.0",    // Tabellen
    "react-hook-form": "^7.48.0",          // Formular-Management
    "zod": "^3.22.0",                       // Schema-Validierung
    "@hookform/resolvers": "^3.3.0",       // Zod-Resolver
    "react-dnd": "^16.0.1",                // Drag & Drop
    "react-dnd-html5-backend": "^16.0.1",
    "@dnd-kit/core": "^6.1.0",             // Alternative DnD
    "@dnd-kit/sortable": "^8.0.0",
    "react-big-calendar": "^1.8.0",        // Kalender-Komponente
    "date-fns": "^3.0.0",                   // Datumsmanipulation
    "react-dropzone": "^14.2.0",           // File Upload
    "react-image-crop": "^11.0.0",         // Bild-Zuschneiden
    "recharts": "^2.10.0",                  // Charts/Analytics
    "framer-motion": "^10.16.0",           // Animationen
    "lucide-react": "^0.294.0",            // Icons
    "tailwindcss": "^3.4.0",               // Styling
    "@radix-ui/react-dialog": "^1.0.5",    // Accessible Dialog
    "@radix-ui/react-tooltip": "^1.0.7",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-select": "^2.0.0"
  }
}
```

---

## 8. Akzeptanzkriterien

### 8.1 Definition of Done

Das Social Media Hub Modul gilt als abgeschlossen, wenn folgende Kriterien erfüllt sind:

#### Account-Verwaltung
- [ ] OAuth-Verbindung für Facebook, Instagram, Twitter/X, TikTok und LinkedIn funktioniert
- [ ] Token-Refresh läuft automatisch im Hintergrund
- [ ] Accounts können getrennt werden
- [ ] Account-Status wird korrekt angezeigt (aktiv, abgelaufen, Fehler)

#### Cross-Posting
- [ ] Ein Post kann auf mehrere Plattformen gleichzeitig erstellt werden
- [ ] Plattform-Vorschau zeigt angepasste Inhalte korrekt an
- [ ] Zeichenlimits werden pro Plattform geprüft und Warnungen angezeigt
- [ ] Hashtags können plattform-spezifisch konfiguriert werden
- [ ] Mindestens 3 Plattformen gleichzeitig in einem Post unterstützt

#### Scheduling
- [ ] Posts können für zukünftige Zeitpunkte geplant werden
- [ ] Kalender-View zeigt alle geplanten Posts korrekt an
- [ ] Geplante Posts werden zur richtigen Zeit automatisch veröffentlicht
- [ ] Drag & Drop zum Verschieben von Posts funktioniert
- [ ] Wiederkehrende Posts sind konfigurierbar

#### Event-Synchronisation
- [ ] Events werden automatisch als Facebook Events erstellt
- [ ] Events werden als Google Business Profile Events synchronisiert
- [ ] Änderungen am Event werden auf Social Media propagiert
- [ ] Sync-Mappings werden korrekt gespeichert und angezeigt

#### Media Library
- [ ] Bilder und Videos können hochgeladen werden
- [ ] Automatische Format-Anpassung generiert alle Plattform-Varianten
- [ ] Media Library hat Such- und Filterfunktion
- [ ] Bilder können zugeschnitten und bearbeitet werden

#### Analytics
- [ ] Engagement-Daten werden pro Plattform angezeigt
- [ ] Zeitraum-Auswahl funktioniert
- [ ] Top-Performing Posts werden identifiziert
- [ ] Datenexport als CSV ist möglich

#### Beste Posting-Zeiten
- [ ] Algorithmus berechnet Empfehlungen basierend auf historischen Daten
- [ ] Heatmap-Visualisierung zeigt optimale Zeitfenster
- [ ] Für neue Accounts werden Branchen-Defaults angezeigt

#### Technische Qualität
- [ ] Alle API-Calls haben Retry-Mechanismus
- [ ] Rate-Limits werden korrekt gehandhabt
- [ ] Token sind verschlüsselt gespeichert
- [ ] Unit-Test-Coverage > 80%
- [ ] E2E-Tests für kritische User Flows
- [ ] Dokumentation ist vollständig

### 8.2 Plattform-spezifische Mindestanforderungen

| Plattform | Posts veröffentlichen | Bilder | Videos | Scheduling | Analytics |
|-----------|----------------------|--------|--------|------------|-----------|
| **Facebook** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Instagram** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Twitter/X** | ✅ | ✅ | ✅ | ✅ | ⚠️ Basis-Metriken |
| **TikTok** | ✅ | N/A | ✅ | ✅ | ⚠️ Basis-Metriken |
| **LinkedIn** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Google Business** | ✅ (Event-Posts) | ✅ | N/A | ✅ | ⚠️ Basis-Metriken |

### 8.3 Performance-Anforderungen

| Metrik | Zielwert |
|--------|----------|
| Seitenladezeit (Dashboard) | < 2s |
| Post-Editor Initialisierung | < 1.5s |
| Bildvarianten-Generierung (1 Bild, 6 Varianten) | < 5s |
| Video-Varianten-Generierung (1min Video) | < 30s |
| API-Response-Zeit (p95) | < 500ms |
| Scheduled Post Pünktlichkeit | ± 30s |
| Analytics-Daten-Refresh | Täglich, < 5min |
| gleichzeitige Uploads | 5 parallel |

---

## 9. Phasenplanung / Roadmap

### Phase 1: MVP (Woche 1-4)
- [ ] Account-Verwaltung mit OAuth für Facebook & Instagram
- [ ] Basis Post-Editor mit Cross-Posting
- [ ] Text- und Bild-Posts
- [ ] Einfaches Scheduling
- [ ] Media Library mit Upload

### Phase 2: Erweiterung (Woche 5-8)
- [ ] Twitter/X & LinkedIn Integration
- [ ] Kalender-View
- [ ] Bildformat-Automatisierung (Sharp.js)
- [ ] Content-Templates
- [ ] Event-Synchronisation (Facebook Events)

### Phase 3: Advanced (Woche 9-12)
- [ ] TikTok Integration
- [ ] Google Business Profile Integration
- [ ] Analytics Dashboard
- [ ] Beste Posting-Zeiten Algorithmus
- [ ] Video-Verarbeitung (FFmpeg)

### Phase 4: Optimierung (Woche 13+)
- [ ] Performance-Optimierung
- [ ] Advanced Features (Threads, Stories, Carousel)
- [ ] A/B-Testing für Posts
- [ ] AI-gestützte Content-Vorschläge
- [ ] Mobile-App-Unterstützung

---

## 10. Risiken & Mitigationen

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| API-Änderungen durch Plattformen | Hoch | Hoch | Abstraktionsschicht bauen, Monitoring |
| Rate-Limiting blockiert Posts | Mittel | Mittel | Queue mit Retry, Pufferzeiten |
| OAuth-Token läuft ab unbemerkt | Mittel | Hoch | Auto-Refresh, Benachrichtigungen |
| Twitter/X API Kosten steigen | Hoch | Mittel | Free-Tier-Optimierung, Warnungen |
| LinkedIn App Review dauert | Hoch | Mittel | Früh beantragen, Sandbox nutzen |
| TikTok keine Text-Posts | Sicher | Mittel | Nur Video-Support für TikTok |
| Bildverarbeitung Performance | Mittel | Mittel | Async Jobs, Caching |
| Datenschutz (OAuth-Scopes) | Mittel | Hoch | Minimale Scopes, DSGVO-Doku |

---

*Dokument erstellt: 2025*
*Version: 1.0*
*Status: Spezifikation*

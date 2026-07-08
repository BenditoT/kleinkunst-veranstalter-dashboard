# Dimension 2: Datenbankschema & Datenmodell

## Universal Dashboard-App fuer Kleinkunst-Veranstalter

---

## 1. Uebersicht der Datenbankarchitektur

### Tech-Stack
- **Datenbank**: PostgreSQL 15+ (via Supabase)
- **Auth & RLS**: Supabase Auth + PostgreSQL Row Level Security
- **API**: Supabase REST/GraphQL + PostgREST
- **Realtime**: Supabase Realtime (WebSocket-Subscriptions)
- **Storage**: Supabase Storage (fuer Fotos, Dokumente, Audio)
- **Erweiterungen**: `uuid-ossp`, `pgcrypto`, `pg_trgm` (Fuzzy Search), `pg_net` (HTTP Requests)

### Richtlinien
- **Primärschlüssel**: UUID (`uuid` type, `uuid_generate_v4()`)
- **Zeitstempel**: `created_at`, `updated_at` in jeder Tabelle
- **Soft Deletes**: `deleted_at` statt harter Löschung wo sinnvoll
- **RLS**: Aktiviert für ALLE Tabellen, Zugriff über Policies
- **Multi-Tenant**: Trennung via `organization_id` als Tenant-Key
- **Naming Convention**: Snake_case, englische Begriffe, Tabellen im Plural

---

## 2. ER-Diagramm (Text)

```
┌──────────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│   organizations      │       │      users           │       │   organization_      │
│──────────────────────│       │──────────────────────│       │   members            │
│ id (PK)              │       │ id (PK)              │       │──────────────────────│
│ name                 │       │ email                │       │ id (PK)              │
│ slug                 │       │ first_name           │       │ organization_id (FK) │
│ logo_url             │       │ last_name            │       │ user_id (FK)         │
│ address              │       │ avatar_url           │       │ role                 │
│ city                 │       │ created_at           │       │ invited_by (FK)      │
│ created_at           │       │ updated_at           │       │ joined_at            │
│ updated_at           │       └──────────────────────┘       │ updated_at           │
└──────┬───────────────┘       ▲          ▲                   └──────────┬───────────┘
       │                       │          │                              │
       │    ┌──────────────────┘          │◄─────────────────────────────┘
       │    │                           │
       │    │  ┌────────────────────────┘
       │    │  │
       ▼    ▼  ▼
┌──────────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│       venues         │       │      artists         │       │      events          │
│──────────────────────│       │──────────────────────│       │──────────────────────│
│ id (PK)              │       │ id (PK)              │       │ id (PK)              │
│ organization_id (FK) │       │ organization_id (FK) │       │ organization_id (FK) │
│ name                 │       │ first_name           │       │ venue_id (FK)        │
│ address              │       │ last_name            │       │ title                │
│ city                 │       │ stage_name           │       │ description          │
│ zip                  │       │ email                │       │ event_type           │
│ country              │       │ phone                │       │ status               │
│ capacity             │       │ bio                  │       │ date                 │
│ contact_name         │       │ website              │       │ start_time           │
│ contact_email        │       │ social_media         │       │ end_time             │
│ contact_phone        │       │ photo_url            │       │ ticket_price         │
│ venue_type           │       │ genre                │       │ capacity_planned     │
│ tech_specs           │       │ rating               │       │ status_gema          │
│ created_at           │       │ notes                │       │ gema_submitted_at    │
│ updated_at           │       │ created_at           │       │ created_at           │
└──────┬───────────────┘       └───────┬──────────────┘       │ updated_at           │
       │                               │                       └──────┬───────────────┘
       │                               │                              │
       │                               │                              │
       │         ┌─────────────────────┘                              │
       │         │                                                    │
       ▼         ▼                                                    ▼
┌──────────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│  venue_rooms         │       │  event_artists       │       │   event_notes        │
│──────────────────────│       │──────────────────────│       │──────────────────────│
│ id (PK)              │       │ id (PK)              │       │ id (PK)              │
│ venue_id (FK)        │       │ event_id (FK)        │       │ event_id (FK)        │
│ name                 │       │ artist_id (FK)       │       │ user_id (FK)         │
│ capacity             │       │ fee                  │       │ note_type            │
│ has_piano            │       │ order_index          │       │ content              │
│ has_pa               │       │ set_duration         │       │ created_at           │
│ created_at           │       │ created_at           │       └──────────────────────┘
└──────────────────────┘       └──────────────────────┘
       ▲
       │
       │
┌──────────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│  venue_bookings      │       │  contracts           │       │  event_checklist     │
│──────────────────────│       │──────────────────────│       │──────────────────────│
│ id (PK)              │       │ id (PK)              │       │ id (PK)              │
│ venue_id (FK)        │       │ event_id (FK)        │       │ event_id (FK)        │
│ room_id (FK, nullable)       │ artist_id (FK)       │       │ item                 │
│ event_id (FK)        │       │ status               │       │ is_completed         │
│ booking_date         │       │ contract_type        │       │ due_date             │
│ status               │       │ fee                  │       │ assigned_to (FK)     │
│ notes                │       │ deposit              │       │ created_at           │
│ created_at           │       │ signed_at            │       └──────────────────────┘
└──────────────────────┘       │ file_url             │
                               │ created_at           │
                               └──────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│  newsletter_         │       │  email_campaigns     │       │  email_tracking      │
│  subscribers         │       │──────────────────────│       │──────────────────────│
│──────────────────────│       │ id (PK)              │       │ id (PK)              │
│ id (PK)              │       │ organization_id (FK) │       │ campaign_id (FK)     │
│ organization_id (FK) │       │ name                 │       │ subscriber_id (FK)   │
│ email                │       │ subject              │       │ event_type           │
│ first_name           │       │ template_html        │       │ event_at             │
│ last_name            │       │ preview_text         │       │ ip_address           │
│ subscribed           │       │ sender_name          │       │ user_agent           │
│ subscription_date    │       │ sender_email         │       │ link_url             │
│ source               │       │ status               │       │ created_at           │
│ tags                 │       │ scheduled_at         │       └──────────────────────┘
│ unsubscribed_at      │       │ sent_at              │
│ created_at           │       │ total_sent           │       ┌──────────────────────┐
│ updated_at           │       │ total_opens          │       │  campaign_segments   │
└──────────┬───────────┘       │ total_clicks         │       │──────────────────────│
           │                   │ created_at           │       │ id (PK)              │
           │                   │ updated_at           │       │ campaign_id (FK)     │
           │                   └──────────┬───────────┘       │ subscriber_id (FK)   │
           │                              │                    │ sent_at              │
           │                              │                    │ opened_at            │
           │                              │                    │ clicked_at           │
           │                              │                    │ status               │
           │                              │                    │ created_at           │
           │                              │                    └──────────────────────┘
           │                              │
           ▼                              ▼
┌──────────────────────┐       ┌──────────────────────┐
│  subscriber_tags     │       │  email_templates     │
│──────────────────────│       │──────────────────────│
│ id (PK)              │       │ id (PK)              │
│ subscriber_id (FK)   │       │ organization_id (FK) │
│ tag                  │       │ name                 │
│ created_at           │       │ subject              │
└──────────────────────┘       │ body_html            │
                               │ body_text            │
                               │ variables            │
                               │ created_at           │
                               │ updated_at           │
                               └──────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│ social_media_        │       │  social_posts        │       │  social_post_        │
│ accounts             │       │──────────────────────│       │  media               │
│──────────────────────│       │ id (PK)              │       │──────────────────────│
│ id (PK)              │       │ account_id (FK)      │       │ id (PK)              │
│ organization_id (FK) │       │ organization_id (FK) │       │ post_id (FK)         │
│ platform             │       │ content              │       │ media_id (FK)        │
│ account_name         │       │ media_urls           │       │ order_index          │
│ account_handle       │       │ scheduled_at         │       │ created_at           │
│ access_token         │       │ posted_at            │       └──────────────────────┘
│ refresh_token        │       │ status               │
│ token_expires_at     │       │ platform_post_id     │       ┌──────────────────────┐
│ is_active            │       │ likes_count          │       │  social_analytics    │
│ created_at           │       │ comments_count       │       │──────────────────────│
│ updated_at           │       │ shares_count         │       │ id (PK)              │
└──────────────────────┘       │ reach_count          │       │ post_id (FK)         │
                               │ created_at           │       │ impressions          │
                               │ updated_at           │       │ engagement           │
                               └──────────────────────┘       │ clicks               │
                                                              │ recorded_at          │
                                                              │ created_at           │
                                                              └──────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│  press_contacts      │       │  press_releases      │       │  press_distributions │
│──────────────────────│       │──────────────────────│       │──────────────────────│
│ id (PK)              │       │ id (PK)              │       │ id (PK)              │
│ organization_id (FK) │       │ organization_id (FK) │       │ release_id (FK)      │
│ outlet_name          │       │ event_id (FK, null)  │       │ contact_id (FK)      │
│ contact_name         │       │ title                │       │ sent_at              │
│ email                │       │ subtitle             │       │ opened_at            │
│ phone                │       │ content_html         │       │ responded_at         │
│ media_type           │       │ content_text         │       │ response_type        │
│ beats                │       │ status               │       │ notes                │
│ priority             │       │ published_at         │       │ created_at           │
│ notes                │       │ created_at           │       └──────────────────────┘
│ created_at           │       │ updated_at           │
│ updated_at           │       └──────────────────────┘
└──────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│      media           │       │  media_collections   │       │  media_tags          │
│──────────────────────│       │──────────────────────│       │──────────────────────│
│ id (PK)              │       │ id (PK)              │       │ id (PK)              │
│ organization_id (FK) │       │ organization_id (FK) │       │ media_id (FK)        │
│ filename             │       │ name                 │       │ tag                  │
│ original_name        │       │ description          │       │ created_at           │
│ file_url             │       │ cover_media_id (FK)  │       └──────────────────────┘
│ thumbnail_url        │       │ created_at           │
│ file_type            │       │ updated_at           │       ┌──────────────────────┐
│ mime_type            │       └──────────────────────┘       │  collection_items    │
│ file_size            │                                       │──────────────────────│
│ width                │                                       │ id (PK)              │
│ height               │                                       │ collection_id (FK)   │
│ duration             │                                       │ media_id (FK)        │
│ description          │                                       │ order_index          │
│ photographer         │                                       │ created_at           │
│ taken_at             │                                       └──────────────────────┘
│ event_id (FK, null)  │
│ artist_id (FK, null) │
│ venue_id (FK, null)  │
│ is_public            │
│ created_at           │
│ updated_at           │
└──────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│  budgets             │       │  budget_items        │       │  transactions        │
│──────────────────────│       │──────────────────────│       │──────────────────────│
│ id (PK)              │       │ id (PK)              │       │ id (PK)              │
│ organization_id (FK) │       │ budget_id (FK)       │       │ organization_id (FK) │
│ event_id (FK, null)  │       │ category             │       │ event_id (FK, null)  │
│ name                 │       │ item_name            │       │ budget_item_id (FK)  │
│ total_budget         │       │ planned_amount       │       │ transaction_type     │
│ currency             │       │ actual_amount        │       │ category             │
│ fiscal_year          │       │ notes                │       │ description          │
│ status               │       │ created_at           │       │ amount               │
│ created_at           │       │ updated_at           │       │ currency             │
│ updated_at           │       └──────────────────────┘       │ transaction_date     │
└──────────────────────┘                                      │ payment_method       │
                                                              │ is_tax_relevant      │
                                                              │ receipt_url          │
                                                              │ created_at           │
                                                              │ updated_at           │
                                                              └──────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│  gema_registrations  │       │  gema_works          │       │  calendar_entries    │
│──────────────────────│       │──────────────────────│       │──────────────────────│
│ id (PK)              │       │ id (PK)              │       │ id (PK)              │
│ event_id (FK)        │       │ registration_id (FK) │       │ organization_id (FK) │
│ organization_id (FK) │       │ title                │       │ user_id (FK)         │
│ submitted_by (FK)    │       │ composer             │       │ event_id (FK, null)  │
│ status               │       │ lyricist             │       │ title                │
│ submitted_at         │       │ publisher            │       │ description          │
│ confirmed_at         │       │ duration             │       │ entry_type           │
│ report_reference     │       │ is_authorized        │       │ start_date           │
│ total_duration       │       │ created_at           │       │ end_date             │
│ estimated_fee        │       └──────────────────────┘       │ all_day              │
│ created_at           │                                       │ recurrence_rule      │
│ updated_at           │                                       │ reminder_minutes     │
└──────────────────────┘                                       │ color                │
                                                               │ is_private           │
                                                               │ created_at           │
                                                               │ updated_at           │
                                                               └──────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│  activity_log        │       │  settings            │       │  invitations         │
│──────────────────────│       │──────────────────────│       │──────────────────────│
│ id (PK)              │       │ id (PK)              │       │ id (PK)              │
│ organization_id (FK) │       │ organization_id (FK) │       │ organization_id (FK) │
│ user_id (FK)         │       │ key                  │       │ email                │
│ entity_type          │       │ value (JSONB)        │       │ role                 │
│ entity_id            │       │ created_at           │       │ invited_by (FK)      │
│ action               │       │ updated_at           │       │ token                │
│ details (JSONB)      │       └──────────────────────┘       │ expires_at           │
│ created_at           │                                       │ accepted_at          │
└──────────────────────┘                                       │ created_at           │
                                                               └──────────────────────┘


Beziehungsuebersicht (Kardinalitaeten):
=======================================

organizations ──1:N──> venues
organizations ──1:N──> artists
organizations ──1:N──> events
organizations ──1:N──> newsletter_subscribers
organizations ──1:N──> email_campaigns
organizations ──1:N──> social_media_accounts
organizations ──1:N──> social_posts
organizations ──1:N──> press_contacts
organizations ──1:N──> press_releases
organizations ──1:N──> media
organizations ──1:N──> budgets
organizations ──1:N──> transactions
organizations ──1:N──> gema_registrations
organizations ──1:N──> calendar_entries
organizations ──1:N──> organization_members
organizations ──1:N──> settings
organizations ──1:N──> invitations
organizations ──1:N──> email_templates

users ──1:N──> organization_members
users ──1:N──> events (submitted_by, etc.)
users ──1:N──> activity_log
users ──1:N──> calendar_entries

venues ──1:N──> venue_rooms
venues ──1:N──> events
venues ──1:N──> media
venues ──1:N──> venue_bookings

artists ──1:N──> event_artists
artists ──1:N──> contracts
artists ──1:N──> media
artists ──1:N──> transactions

events ──1:1──> budgets
events ──1:N──> event_artists
events ──1:N──> event_notes
events ──1:N──> event_checklist
events ──1:N──> media
events ──1:N──> contracts
events ──1:N──> transactions
events ──1:N──> gema_registrations
events ──1:N──> calendar_entries
events ──1:N──> venue_bookings
events ──1:N──> press_releases

newsletter_subscribers ──1:N──> campaign_segments
newsletter_subscribers ──1:N──> email_tracking
newsletter_subscribers ──1:N──> subscriber_tags

email_campaigns ──1:N──> campaign_segments
email_campaigns ──1:N──> email_tracking

social_media_accounts ──1:N──> social_posts
social_posts ──1:N──> social_analytics
social_posts ──1:N──> social_post_media

media ──1:N──> social_post_media
media ──1:N──> collection_items
media ──1:N──> media_tags
media ──1:1──> media_collections (cover_media_id)

press_contacts ──1:N──> press_distributions
press_releases ──1:N──> press_distributions

budgets ──1:N──> budget_items
budget_items ──1:N──> transactions
```

---

## 3. Tabellendefinitionen (Vollstaendig)

---

### 3.1 organizations (Organisationen / Tenant-Root)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| name | varchar(255) | NOT NULL | Firmen-/Organisationsname |
| slug | varchar(100) | NOT NULL, UNIQUE | URL-freundlicher Bezeichner |
| description | text | | Beschreibung |
| logo_url | text | | URL zum Logo |
| website | varchar(255) | | Website URL |
| address | varchar(255) | | Strasse |
| city | varchar(100) | | Stadt |
| zip | varchar(20) | | PLZ |
| country | varchar(2) | DEFAULT 'DE' | ISO-Laendercode |
| fiscal_year_start | date | DEFAULT '01-01' | Start Geschaeftsjahr |
| vat_id | varchar(50) | | USt-IdNr. |
| tax_number | varchar(50) | | Steuernummer |
| bank_account_iban | varchar(34) | | IBAN |
| bank_account_bic | varchar(11) | | BIC |
| bank_name | varchar(100) | | Bankname |
| is_active | boolean | DEFAULT true | Organisation aktiv |
| plan_tier | varchar(20) | DEFAULT 'free' | 'free', 'basic', 'pro', 'enterprise' |
| plan_expires_at | timestamptz | | Ablauf des Plans |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_organizations_slug` ON slug (UNIQUE)
- `idx_organizations_active` ON is_active WHERE is_active = true

---

### 3.2 users (Benutzer - Supabase Auth erweitert)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Verknuepft mit auth.users.id |
| email | varchar(255) | NOT NULL, UNIQUE | E-Mail-Adresse |
| first_name | varchar(100) | | Vorname |
| last_name | varchar(100) | | Nachname |
| avatar_url | text | | Profilbild URL |
| phone | varchar(50) | | Telefonnummer |
| timezone | varchar(50) | DEFAULT 'Europe/Berlin' | Zeitzone |
| locale | varchar(10) | DEFAULT 'de-DE' | Sprache |
| email_notifications | boolean | DEFAULT true | E-Mail-Benachrichtigungen |
| push_notifications | boolean | DEFAULT true | Push-Benachrichtigungen |
| theme_preference | varchar(10) | DEFAULT 'system' | 'light', 'dark', 'system' |
| onboarding_completed | boolean | DEFAULT false | Onboarding abgeschlossen |
| last_login_at | timestamptz | | Letzter Login |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_users_email` ON email (UNIQUE)
- `idx_users_last_login` ON last_login_at

---

### 3.3 organization_members (Mitgliedschaften)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| user_id | uuid | NOT NULL, FK -> users.id | Benutzer |
| role | varchar(20) | NOT NULL, DEFAULT 'member' | 'admin', 'manager', 'booker', 'venue_operator', 'accountant', 'viewer' |
| permissions | jsonb | DEFAULT '{}' | Zusaetzliche Rechte |
| is_primary | boolean | DEFAULT false | Primaere Organisation |
| invited_by | uuid | FK -> users.id | Eingeladen von |
| joined_at | timestamptz | DEFAULT now() | Beitrittszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_org_members_org_user` ON (organization_id, user_id) (UNIQUE)
- `idx_org_members_role` ON (organization_id, role)
- `idx_org_members_user` ON user_id

---

### 3.4 invitations (Einladungen)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| email | varchar(255) | NOT NULL | E-Mail des Eingeladenen |
| role | varchar(20) | NOT NULL, DEFAULT 'member' | Rolle |
| invited_by | uuid | NOT NULL, FK -> users.id | Einladender |
| token | uuid | DEFAULT uuid_generate_v4() | Einladungstoken |
| expires_at | timestamptz | NOT NULL, DEFAULT now() + interval '7 days' | Ablauf |
| accepted_at | timestamptz | | Akzeptiert am |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |

**Indizes:**
- `idx_invitations_token` ON token (UNIQUE)
- `idx_invitations_email` ON (organization_id, email)
- `idx_invitations_expires` ON expires_at

---

### 3.5 venues (Spielorte)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| name | varchar(255) | NOT NULL | Name des Ortes |
| slug | varchar(100) | | URL-freundlicher Name |
| description | text | | Beschreibung |
| address | varchar(255) | | Strasse |
| address_extra | varchar(255) | | Adresszusatz |
| city | varchar(100) | | Stadt |
| zip | varchar(20) | | PLZ |
| country | varchar(2) | DEFAULT 'DE' | ISO-Laendercode |
| latitude | decimal(10,8) | | Geografische Breite |
| longitude | decimal(11,8) | | Geografische Laenge |
| capacity | integer | CHECK (capacity >= 0) | Maximale Kapazitaet |
| venue_type | varchar(50) | | 'theater', 'club', 'cafe', 'hall', 'outdoor', 'church', 'other' |
| website | varchar(255) | | Website URL |
| contact_name | varchar(255) | | Ansprechpartner |
| contact_email | varchar(255) | | Kontakt-E-Mail |
| contact_phone | varchar(50) | | Kontakt-Telefon |
| tech_specs | jsonb | DEFAULT '{}' | Technische Daten (JSON) |
| accessibility_info | text | | Barrierefreiheit |
| parking_info | text | | Parkplatzinfo |
| photo_url | text | | Foto URL |
| contract_template | text | | Vertragstemplate |
| default_fee | decimal(10,2) | | Standardgage |
| notes | text | | Interne Notizen |
| is_active | boolean | DEFAULT true | Aktiv |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |
| deleted_at | timestamptz | | Soft-Delete |

**Indizes:**
- `idx_venues_org` ON organization_id
- `idx_venues_name` ON (organization_id, name)
- `idx_venues_city` ON (organization_id, city)
- `idx_venues_active` ON (organization_id, is_active)
- `idx_venues_geo` ON (latitude, longitude) WHERE latitude IS NOT NULL
- `idx_venues_type` ON (organization_id, venue_type)

---

### 3.6 venue_rooms (Raeume innerhalb von Spielorten)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| venue_id | uuid | NOT NULL, FK -> venues.id | Spielort |
| name | varchar(255) | NOT NULL | Raumname |
| description | text | | Beschreibung |
| capacity | integer | CHECK (capacity >= 0) | Kapazitaet |
| has_piano | boolean | DEFAULT false | Klavier vorhanden |
| has_pa | boolean | DEFAULT false | PA-Anlage |
| has_lighting | boolean | DEFAULT false | Lichtanlage |
| has_projector | boolean | DEFAULT false | Beamer |
| dimensions | varchar(50) | | Groesse (z.B. "10x8m") |
| floor_type | varchar(50) | | 'wood', 'stone', 'carpet', 'other' |
| photo_url | text | | Foto URL |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_venue_rooms_venue` ON venue_id

---

### 3.7 venue_bookings (Raum-Buchungen/Reservierungen)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| venue_id | uuid | NOT NULL, FK -> venues.id | Spielort |
| room_id | uuid | FK -> venue_rooms.id, nullable | Raum (optional) |
| event_id | uuid | FK -> events.id, nullable | Verknuepftes Event |
| booking_date | date | NOT NULL | Buchungsdatum |
| start_time | time | | Startzeit |
| end_time | time | | Endzeit |
| status | varchar(20) | DEFAULT 'reserved' | 'reserved', 'confirmed', 'cancelled', 'completed' |
| purpose | varchar(255) | | Zweck der Buchung |
| notes | text | | Notizen |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_venue_bookings_venue` ON venue_id
- `idx_venue_bookings_date` ON (venue_id, booking_date)
- `idx_venue_bookings_event` ON event_id

---

### 3.8 artists (Kuenstler/Musiker)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| first_name | varchar(100) | | Vorname |
| last_name | varchar(100) | | Nachname |
| stage_name | varchar(255) | NOT NULL | Kuenstlername |
| email | varchar(255) | | E-Mail |
| phone | varchar(50) | | Telefon |
| address | varchar(255) | | Strasse |
| city | varchar(100) | | Stadt |
| zip | varchar(20) | | PLZ |
| country | varchar(2) | DEFAULT 'DE' | Land |
| bio | text | | Biografie |
| website | varchar(255) | | Website |
| social_media | jsonb | DEFAULT '{}' | {instagram, facebook, youtube, spotify, tiktok} |
| genre | varchar(100)[] | | Musikrichtungen (Array) |
| instruments | varchar(100)[] | | Instrumente |
| photo_url | text | | Foto URL |
| rider | text | | Tech-Rider |
| gema_number | varchar(50) | | GEMA-Mitgliedsnummer |
| vat_id | varchar(50) | | USt-IdNr. |
| bank_iban | varchar(34) | | Bankverbindung IBAN |
| bank_bic | varchar(11) | | BIC |
| bank_account_holder | varchar(255) | | Kontoinhaber |
| default_fee | decimal(10,2) | | Standardgage |
| rating | integer | CHECK (rating >= 1 AND rating <= 5) | Bewertung 1-5 |
| previous_performances | integer | DEFAULT 0 | Vorherige Auftritte |
| is_bookable | boolean | DEFAULT true | Buchbar |
| is_favorite | boolean | DEFAULT false | Favorit |
| notes | text | | Interne Notizen |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |
| deleted_at | timestamptz | | Soft-Delete |

**Indizes:**
- `idx_artists_org` ON organization_id
- `idx_artists_stage_name` ON (organization_id, stage_name)
- `idx_artists_genre` ON (organization_id, genre) USING GIN
- `idx_artists_favorite` ON (organization_id, is_favorite) WHERE is_favorite = true
- `idx_artists_bookable` ON (organization_id, is_bookable)
- `idx_artists_rating` ON (organization_id, rating)
- `idx_artists_name_trgm` ON stage_name USING gin (stage_name gin_trgm_ops)

---

### 3.9 events (Veranstaltungen/Konzerte)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| venue_id | uuid | FK -> venues.id | Spielort |
| room_id | uuid | FK -> venue_rooms.id | Raum |
| title | varchar(255) | NOT NULL | Event-Titel |
| subtitle | varchar(255) | | Untertitel |
| description | text | | Beschreibung |
| event_type | varchar(50) | NOT NULL, DEFAULT 'concert' | 'concert', 'festival', 'tour', 'rehearsal', 'workshop', 'other' |
| status | varchar(20) | NOT NULL, DEFAULT 'draft' | 'draft', 'planned', 'confirmed', 'published', 'sold_out', 'completed', 'cancelled' |
| date | date | NOT NULL | Datum |
| start_time | time | | Startzeit |
| end_time | time | | Endzeit |
| doors_open | time | | Einlass |
| ticket_price | decimal(10,2) | | Eintrittspreis |
| ticket_presale_price | decimal(10,2) | | VVK-Preis |
| capacity_planned | integer | | Geplante Besucherzahl |
| attendees_actual | integer | | Tatsaechliche Besucher |
| revenue_target | decimal(12,2) | | Umsatzziel |
| revenue_actual | decimal(12,2) | | Tatsaechlicher Umsatz |
| is_public | boolean | DEFAULT false | Oeffentlich sichtbar |
| slug | varchar(255) | | URL-Slug |
| poster_url | text | | Plakat URL |
| fb_event_url | text | | Facebook-Event |
| ticketing_url | text | | Ticketing-Link |
| notes_public | text | | Oeffentliche Notizen |
| notes_internal | text | | Interne Notizen |
| gema_status | varchar(20) | DEFAULT 'not_required' | 'not_required', 'pending', 'submitted', 'confirmed', 'problem' |
| gema_submitted_at | timestamptz | | GEMA-Meldung eingereicht |
| gema_report_reference | varchar(50) | | GEMA-Meldungsnummer |
| created_by | uuid | NOT NULL, FK -> users.id | Erstellt von |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |
| deleted_at | timestamptz | | Soft-Delete |

**Indizes:**
- `idx_events_org` ON organization_id
- `idx_events_venue` ON venue_id
- `idx_events_date` ON (organization_id, date)
- `idx_events_date_range` ON (organization_id, date) WHERE date >= CURRENT_DATE
- `idx_events_status` ON (organization_id, status)
- `idx_events_gema` ON (organization_id, gema_status)
- `idx_events_slug` ON (organization_id, slug)
- `idx_events_created_by` ON created_by

---

### 3.10 event_artists (Kuensler pro Event - N:M Mapping)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| event_id | uuid | NOT NULL, FK -> events.id | Event |
| artist_id | uuid | NOT NULL, FK -> artists.id | Kuenstler |
| order_index | integer | NOT NULL, DEFAULT 0 | Reihenfolge |
| fee | decimal(10,2) | | Gage |
| fee_currency | varchar(3) | DEFAULT 'EUR' | Waehrung |
| set_duration | integer | | Set-Dauer (Minuten) |
| arrival_time | time | | Ankunftszeit |
| soundcheck_time | time | | Soundcheck |
| performance_start | time | | Auftrittsbeginn |
| accommodation | text | | Unterbringung |
| catering | text | | Verpflegung |
| transport | text | | Transport |
| contract_status | varchar(20) | DEFAULT 'pending' | 'pending', 'sent', 'signed', 'cancelled' |
| contract_sent_at | timestamptz | | Vertrag versandt |
| contract_signed_at | timestamptz | | Vertrag unterschrieben |
| notes | text | | Notizen |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_event_artists_event` ON event_id
- `idx_event_artists_artist` ON artist_id
- `idx_event_artists_unique` ON (event_id, artist_id) (UNIQUE)
- `idx_event_artists_order` ON (event_id, order_index)

---

### 3.11 event_notes (Event-Notizen)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| event_id | uuid | NOT NULL, FK -> events.id | Event |
| user_id | uuid | NOT NULL, FK -> users.id | Autor |
| note_type | varchar(20) | DEFAULT 'general' | 'general', 'artist', 'venue', 'tech', 'marketing', 'finance' |
| content | text | NOT NULL | Inhalt |
| is_pinned | boolean | DEFAULT false | Angepinnt |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_event_notes_event` ON event_id
- `idx_event_notes_type` ON (event_id, note_type)

---

### 3.12 event_checklist (Event-ToDo-Checkliste)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| event_id | uuid | NOT NULL, FK -> events.id | Event |
| item | varchar(255) | NOT NULL | Aufgabe |
| description | text | | Beschreibung |
| category | varchar(50) | DEFAULT 'general' | 'general', 'booking', 'marketing', 'tech', 'finance', 'gema', 'catering' |
| is_completed | boolean | DEFAULT false | Erledigt |
| completed_at | timestamptz | | Erledigt am |
| completed_by | uuid | FK -> users.id | Erledigt von |
| due_date | date | | Faelligkeit |
| assigned_to | uuid | FK -> users.id | Zugewiesen an |
| order_index | integer | DEFAULT 0 | Reihenfolge |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_event_checklist_event` ON event_id
- `idx_event_checklist_completed` ON (event_id, is_completed)
- `idx_event_checklist_assigned` ON (assigned_to, is_completed)
- `idx_event_checklist_due` ON (event_id, due_date)

---

### 3.13 contracts (Vertraege)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| event_id | uuid | NOT NULL, FK -> events.id | Event |
| artist_id | uuid | NOT NULL, FK -> artists.id | Kuenstler |
| contract_type | varchar(20) | DEFAULT 'performance' | 'performance', 'rental', 'sponsorship', 'other' |
| status | varchar(20) | DEFAULT 'draft' | 'draft', 'sent', 'signed', 'cancelled' |
| fee | decimal(10,2) | | Gage |
| fee_currency | varchar(3) | DEFAULT 'EUR' | Waehrung |
| deposit_amount | decimal(10,2) | | Anzahlung |
| deposit_paid | boolean | DEFAULT false | Anzahlung bezahlt |
| deposit_paid_at | timestamptz | | Anzahlung bezahlt am |
| cancellation_terms | text | | Stornierungsbedingungen |
| technical_rider | text | | Technischer Rider |
| hospitality_rider | text | | Hospitality-Rider |
| contract_text | text | | Vertragstext |
| file_url | text | | Vertragsdokument URL |
| signed_file_url | text | | Unterschriebenes Dokument |
| sent_at | timestamptz | | Gesendet am |
| signed_at | timestamptz | | Unterschrieben am |
| valid_from | date | | Gueltig ab |
| valid_until | date | | Gueltig bis |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_contracts_event` ON event_id
- `idx_contracts_artist` ON artist_id
- `idx_contracts_status` ON (event_id, status)

---

### 3.14 newsletter_subscribers (Newsletter-Empfaenger)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| email | varchar(255) | NOT NULL | E-Mail-Adresse |
| first_name | varchar(100) | | Vorname |
| last_name | varchar(100) | | Nachname |
| city | varchar(100) | | Stadt |
| salutation | varchar(20) | | 'Herr', 'Frau', 'Divers' |
| subscribed | boolean | DEFAULT true | Abonniert |
| subscription_date | timestamptz | DEFAULT now() | Anmeldedatum |
| subscription_source | varchar(50) | | 'website', 'event', 'import', 'manual', 'widget' |
| double_opt_in | boolean | DEFAULT false | Double-Opt-In bestaetigt |
| double_opt_in_at | timestamptz | | Double-Opt-In Datum |
| interests | varchar(50)[] | | Interessen (Array) |
| language | varchar(5) | DEFAULT 'de' | Sprache |
| unsubscribed_at | timestamptz | | Abmeldedatum |
| unsubscribe_reason | text | | Abmeldungsgrund |
| bounce_count | integer | DEFAULT 0 | Bounce-Zaehler |
| is_bounced | boolean | DEFAULT false | Bounced |
| last_sent_at | timestamptz | | Letzte Zustellung |
| last_open_at | timestamptz | | Letzter Oeffnung |
| last_click_at | timestamptz | | Letzter Klick |
| engagement_score | decimal(3,2) | DEFAULT 0.00 | Engagement 0.00-1.00 |
| metadata | jsonb | DEFAULT '{}' | Zusatzdaten |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_subscribers_org_email` ON (organization_id, email) (UNIQUE)
- `idx_subscribers_org` ON organization_id
- `idx_subscribers_subscribed` ON (organization_id, subscribed)
- `idx_subscribers_engagement` ON (organization_id, engagement_score)
- `idx_subscribers_source` ON (organization_id, subscription_source)
- `idx_subscribers_bounced` ON (organization_id, is_bounced)

---

### 3.15 subscriber_tags (Tags fuer Abonnenten)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| subscriber_id | uuid | NOT NULL, FK -> newsletter_subscribers.id | Abonnent |
| tag | varchar(50) | NOT NULL | Tag |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |

**Indizes:**
- `idx_subscriber_tags_sub` ON subscriber_id
- `idx_subscriber_tags_tag` ON (subscriber_id, tag) (UNIQUE)

---

### 3.16 email_templates (E-Mail-Templates)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| name | varchar(255) | NOT NULL | Template-Name |
| description | text | | Beschreibung |
| subject | varchar(500) | NOT NULL | Betreff |
| body_html | text | | HTML-Inhalt |
| body_text | text | | Text-Inhalt |
| variables | jsonb | DEFAULT '{}' | Verfuegbare Variablen |
| category | varchar(50) | DEFAULT 'general' | 'general', 'event', 'contract', 'invoice', 'welcome', 'reminder' |
| is_default | boolean | DEFAULT false | Standard-Template |
| preview_data | jsonb | DEFAULT '{}' | Vorschau-Daten |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_templates_org` ON organization_id
- `idx_templates_category` ON (organization_id, category)

---

### 3.17 email_campaigns (Newsletter-Kampagnen)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| name | varchar(255) | NOT NULL | Kampagnen-Name |
| subject | varchar(500) | NOT NULL | Betreffzeile |
| preview_text | varchar(255) | | Vorschautext |
| template_id | uuid | FK -> email_templates.id | Verwendetes Template |
| body_html | text | | HTML-Inhalt |
| body_text | text | | Text-Inhalt |
| sender_name | varchar(255) | | Absender-Name |
| sender_email | varchar(255) | | Absender-E-Mail |
| reply_to | varchar(255) | | Antwortadresse |
| status | varchar(20) | DEFAULT 'draft' | 'draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled' |
| scheduled_at | timestamptz | | Geplantes Sende-Datum |
| sent_at | timestamptz | | Tatsaechlich gesendet |
| completed_at | timestamptz | | Versand abgeschlossen |
| total_recipients | integer | DEFAULT 0 | Anzahl Empfaenger |
| total_sent | integer | DEFAULT 0 | Anzahl gesendet |
| total_delivered | integer | DEFAULT 0 | Anzahl zugestellt |
| total_bounced | integer | DEFAULT 0 | Anzahl Bounced |
| total_opens | integer | DEFAULT 0 | Anzahl Oeffnungen |
| unique_opens | integer | DEFAULT 0 | Eindeutige Oeffnungen |
| total_clicks | integer | DEFAULT 0 | Anzahl Klicks |
| unique_clicks | integer | DEFAULT 0 | Eindeutige Klicks |
| total_unsubscribes | integer | DEFAULT 0 | Abmeldungen |
| total_complaints | integer | DEFAULT 0 | Beschwerden |
| filter_tags | varchar(50)[] | | Filter: Tags |
| filter_segment | varchar(50) | | Filter: Segment |
| filter_sql | text | | Zusaetzlicher SQL-Filter |
| ab_test_enabled | boolean | DEFAULT false | A/B-Test aktiv |
| ab_test_subject_b | varchar(500) | | Alternativer Betreff |
| ab_test_winner_after | integer | | Gewinner nach X Oeffnungen |
| created_by | uuid | NOT NULL, FK -> users.id | Erstellt von |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_campaigns_org` ON organization_id
- `idx_campaigns_status` ON (organization_id, status)
- `idx_campaigns_scheduled` ON scheduled_at WHERE status = 'scheduled'

---

### 3.18 campaign_segments (Versandstatus pro Empfaenger)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| campaign_id | uuid | NOT NULL, FK -> email_campaigns.id | Kampagne |
| subscriber_id | uuid | NOT NULL, FK -> newsletter_subscribers.id | Abonnent |
| status | varchar(20) | DEFAULT 'queued' | 'queued', 'sending', 'sent', 'delivered', 'bounced', 'failed' |
| sent_at | timestamptz | | Gesendet am |
| delivered_at | timestamptz | | Zugestellt am |
| opened_at | timestamptz | | Geoefnet am |
| open_count | integer | DEFAULT 0 | Anzahl Oeffnungen |
| clicked_at | timestamptz | | Geklickt am |
| click_count | integer | DEFAULT 0 | Anzahl Klicks |
| bounce_type | varchar(20) | | 'soft', 'hard' |
| bounce_reason | text | | Bounce-Grund |
| unsubscribe_triggered | boolean | DEFAULT false | Hat abgemeldet |
| ip_address | varchar(45) | | IP-Adresse |
| user_agent | text | | User-Agent |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_segments_campaign` ON campaign_id
- `idx_segments_subscriber` ON subscriber_id
- `idx_segments_status` ON (campaign_id, status)
- `idx_segments_unique` ON (campaign_id, subscriber_id) (UNIQUE)

---

### 3.19 email_tracking (E-Mail Tracking-Events)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| campaign_id | uuid | FK -> email_campaigns.id | Kampagne |
| segment_id | uuid | FK -> campaign_segments.id | Segment |
| subscriber_id | uuid | FK -> newsletter_subscribers.id | Abonnent |
| event_type | varchar(20) | NOT NULL | 'open', 'click', 'bounce', 'complaint', 'unsubscribe' |
| event_at | timestamptz | NOT NULL, DEFAULT now() | Event-Zeitpunkt |
| link_url | text | | Geklickte URL |
| ip_address | varchar(45) | | IP-Adresse |
| user_agent | text | | User-Agent |
| geolocation | jsonb | | Standort-Info |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |

**Indizes:**
- `idx_email_tracking_campaign` ON campaign_id
- `idx_email_tracking_subscriber` ON subscriber_id
- `idx_email_tracking_type` ON (campaign_id, event_type)
- `idx_email_tracking_event_at` ON event_at

---

### 3.20 social_media_accounts (Verbundene Social Media Accounts)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| platform | varchar(20) | NOT NULL | 'facebook', 'instagram', 'twitter', 'tiktok', 'youtube', 'spotify', 'linkedin', 'threads', 'bluesky', 'mastodon' |
| account_name | varchar(255) | | Kontoname |
| account_handle | varchar(100) | | Handle/Benutzername |
| account_url | text | | Profil-URL |
| profile_image_url | text | | Profilbild URL |
| access_token | text | | OAuth Access Token (verschluesselt) |
| refresh_token | text | | OAuth Refresh Token (verschluesselt) |
| token_expires_at | timestamptz | | Token-Ablauf |
| scope | text | | Gewaehrte Berechtigungen |
| follower_count | integer | | Follower-Anzahl |
| is_active | boolean | DEFAULT true | Verbindung aktiv |
| auto_post | boolean | DEFAULT false | Automatisches Posting |
| post_defaults | jsonb | DEFAULT '{}' | Standard-Einstellungen |
| last_synced_at | timestamptz | | Letzte Synchronisierung |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_social_accounts_org` ON organization_id
- `idx_social_accounts_platform` ON (organization_id, platform)
- `idx_social_accounts_active` ON (organization_id, is_active)

---

### 3.21 social_posts (Geplante/Gepostete Inhalte)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| account_id | uuid | NOT NULL, FK -> social_media_accounts.id | Account |
| event_id | uuid | FK -> events.id, nullable | Verknuepftes Event |
| content | text | NOT NULL | Post-Inhalt |
| media_urls | text[] | | Medien-URLs |
| post_type | varchar(20) | DEFAULT 'text' | 'text', 'image', 'video', 'carousel', 'reel', 'story' |
| status | varchar(20) | DEFAULT 'draft' | 'draft', 'scheduled', 'publishing', 'published', 'failed', 'cancelled' |
| scheduled_at | timestamptz | | Geplant fuer |
| published_at | timestamptz | | Tatsaechlich veroeffentlicht |
| platform_post_id | varchar(255) | | ID auf der Plattform |
| platform_post_url | text | | URL des Posts |
| likes_count | integer | DEFAULT 0 | Likes |
| comments_count | integer | DEFAULT 0 | Kommentare |
| shares_count | integer | DEFAULT 0 | Shares |
| reach_count | integer | DEFAULT 0 | Reichweite |
| impressions_count | integer | DEFAULT 0 | Impressions |
| engagement_rate | decimal(5,4) | | Engagement-Rate |
| error_message | text | | Fehlermeldung |
| parent_post_id | uuid | FK -> social_posts.id | Cross-Post Referenz |
| created_by | uuid | NOT NULL, FK -> users.id | Erstellt von |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_social_posts_org` ON organization_id
- `idx_social_posts_account` ON account_id
- `idx_social_posts_event` ON event_id
- `idx_social_posts_status` ON (organization_id, status)
- `idx_social_posts_scheduled` ON (organization_id, scheduled_at) WHERE status = 'scheduled'
- `idx_social_posts_platform` ON platform_post_id WHERE platform_post_id IS NOT NULL

---

### 3.22 social_post_media (N:M Medienzuordnung)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| post_id | uuid | NOT NULL, FK -> social_posts.id | Post |
| media_id | uuid | NOT NULL, FK -> media.id | Medienobjekt |
| order_index | integer | DEFAULT 0 | Reihenfolge |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |

**Indizes:**
- `idx_spm_post` ON post_id
- `idx_spm_unique` ON (post_id, media_id) (UNIQUE)

---

### 3.23 social_analytics (Social Media Statistiken)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| post_id | uuid | NOT NULL, FK -> social_posts.id | Post |
| impressions | integer | DEFAULT 0 | Impressions |
| reach | integer | DEFAULT 0 | Reichweite |
| engagement | integer | DEFAULT 0 | Engagements |
| clicks | integer | DEFAULT 0 | Klicks |
| likes | integer | DEFAULT 0 | Likes |
| comments | integer | DEFAULT 0 | Kommentare |
| shares | integer | DEFAULT 0 | Shares |
| saves | integer | DEFAULT 0 | Saves |
| profile_visits | integer | DEFAULT 0 | Profilbesuche |
| follows_gained | integer | DEFAULT 0 | Neue Follower |
| video_views | integer | DEFAULT 0 | Videoaufrufe |
| watch_time_seconds | integer | | Gesamte Wiedergabezeit |
| demographics | jsonb | DEFAULT '{}' | Demographische Daten |
| recorded_at | timestamptz | NOT NULL, DEFAULT now() | Aufzeichnungszeitpunkt |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |

**Indizes:**
- `idx_social_analytics_post` ON post_id
- `idx_social_analytics_recorded` ON (post_id, recorded_at)

---

### 3.24 press_contacts (Journalisten/Presse)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| outlet_name | varchar(255) | NOT NULL | Medienname |
| outlet_type | varchar(50) | | 'newspaper', 'magazine', 'radio', 'tv', 'online', 'blog', 'podcast', 'other' |
| contact_name | varchar(255) | | Kontakt-Name |
| salutation | varchar(20) | | Anrede |
| email | varchar(255) | | E-Mail |
| phone | varchar(50) | | Telefon |
| address | varchar(255) | | Adresse |
| city | varchar(100) | | Stadt |
| zip | varchar(20) | | PLZ |
| website | varchar(255) | | Website |
| media_type | varchar(50)[] | | Ressorts (Array) |
| beats | varchar(100)[] | | Themengebiete (Array) |
| priority | varchar(10) | DEFAULT 'medium' | 'high', 'medium', 'low' |
| is_blacklisted | boolean | DEFAULT false | Blacklist |
| last_contacted_at | timestamptz | | Letzter Kontakt |
| response_rate | decimal(3,2) | | Antwortrate 0.00-1.00 |
| notes | text | | Notizen |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_press_contacts_org` ON organization_id
- `idx_press_contacts_priority` ON (organization_id, priority)
- `idx_press_contacts_outlet` ON (organization_id, outlet_name)
- `idx_press_contacts_type` ON (organization_id, outlet_type)

---

### 3.25 press_releases (Pressemitteilungen)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| event_id | uuid | FK -> events.id, nullable | Verknuepftes Event |
| title | varchar(500) | NOT NULL | Titel |
| subtitle | varchar(500) | | Untertitel |
| content_html | text | | HTML-Inhalt |
| content_text | text | | Text-Inhalt |
| excerpt | text | | Kurztext/Vorspann |
| status | varchar(20) | DEFAULT 'draft' | 'draft', 'review', 'approved', 'sent', 'published' |
| scheduled_at | timestamptz | | Geplant fuer |
| published_at | timestamptz | | Veroeffentlicht am |
| sent_at | timestamptz | | Versandt am |
| created_by | uuid | NOT NULL, FK -> users.id | Erstellt von |
| approved_by | uuid | FK -> users.id | Genehmigt von |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_press_releases_org` ON organization_id
- `idx_press_releases_event` ON event_id
- `idx_press_releases_status` ON (organization_id, status)

---

### 3.26 press_distributions (Presse-Verteilung)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| release_id | uuid | NOT NULL, FK -> press_releases.id | Pressemitteilung |
| contact_id | uuid | NOT NULL, FK -> press_contacts.id | Pressekontakt |
| sent_at | timestamptz | | Versandt am |
| opened_at | timestamptz | | Geoefnet am |
| responded_at | timestamptz | | Geantwortet am |
| response_type | varchar(20) | | 'interest', 'declined', 'coverage', 'interview_request', 'other' |
| response_notes | text | | Antwortnotizen |
| article_url | text | | Veroeffentlichter Artikel |
| article_published_at | date | | Artikel-Datum |
| notes | text | | Notizen |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_press_dist_release` ON release_id
- `idx_press_dist_contact` ON contact_id
- `idx_press_dist_unique` ON (release_id, contact_id) (UNIQUE)

---

### 3.27 media (Fotodatenbank & Medien)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| filename | varchar(255) | NOT NULL | Interner Dateiname |
| original_name | varchar(255) | | Original-Dateiname |
| file_url | text | NOT NULL | Datei-URL |
| thumbnail_url | text | | Thumbnail-URL |
| preview_url | text | | Vorschaubild-URL |
| file_type | varchar(20) | NOT NULL | 'image', 'video', 'audio', 'document' |
| mime_type | varchar(100) | | MIME-Type |
| file_size | bigint | | Dateigroesse in Bytes |
| width | integer | | Breite (Pixel) |
| height | integer | | Hoehe (Pixel) |
| duration | integer | | Dauer (Sekunden, fuer Video/Audio) |
| format | varchar(10) | | 'jpeg', 'png', 'mp4', 'mp3', 'pdf' |
| description | text | | Beschreibung |
| alt_text | varchar(500) | | Alt-Text |
| photographer | varchar(255) | | Fotograf |
| taken_at | timestamptz | | Aufnahmedatum |
| location | varchar(255) | | Aufnahmeort |
| event_id | uuid | FK -> events.id, nullable | Verknuepftes Event |
| artist_id | uuid | FK -> artists.id, nullable | Verknuepftes Kuenstler |
| venue_id | uuid | FK -> venues.id, nullable | Verknuepftes Venue |
| is_public | boolean | DEFAULT false | Oeffentlich |
| is_featured | boolean | DEFAULT false | Hervorgehoben |
| copyright_notice | varchar(255) | | Copyright-Hinweis |
| license_type | varchar(50) | | Lizenz-Typ |
| usage_rights | jsonb | DEFAULT '{}' | Nutzungsrechte |
| metadata | jsonb | DEFAULT '{}' | EXIF/Metadaten |
| search_vector | tsvector | | Volltext-Suche |
| created_by | uuid | NOT NULL, FK -> users.id | Hochgeladen von |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |
| deleted_at | timestamptz | | Soft-Delete |

**Indizes:**
- `idx_media_org` ON organization_id
- `idx_media_type` ON (organization_id, file_type)
- `idx_media_event` ON event_id
- `idx_media_artist` ON artist_id
- `idx_media_venue` ON venue_id
- `idx_media_public` ON (organization_id, is_public)
- `idx_media_featured` ON (organization_id, is_featured)
- `idx_media_taken` ON taken_at
- `idx_media_search` ON search_vector USING GIN
- `idx_media_name_trgm` ON original_name USING gin (original_name gin_trgm_ops)

---

### 3.28 media_collections (Alben/Sammlungen)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| name | varchar(255) | NOT NULL | Name |
| description | text | | Beschreibung |
| cover_media_id | uuid | FK -> media.id | Titelbild |
| is_public | boolean | DEFAULT false | Oeffentlich |
| event_id | uuid | FK -> events.id, nullable | Verknuepftes Event |
| artist_id | uuid | FK -> artists.id, nullable | Verknuepftes Kuenstler |
| venue_id | uuid | FK -> venues.id, nullable | Verknuepftes Venue |
| item_count | integer | DEFAULT 0 | Anzahl Medien |
| created_by | uuid | NOT NULL, FK -> users.id | Erstellt von |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_collections_org` ON organization_id
- `idx_collections_event` ON event_id
- `idx_collections_artist` ON artist_id
- `idx_collections_venue` ON venue_id

---

### 3.29 collection_items (Medien in Sammlungen)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| collection_id | uuid | NOT NULL, FK -> media_collections.id | Sammlung |
| media_id | uuid | NOT NULL, FK -> media.id | Medium |
| order_index | integer | NOT NULL, DEFAULT 0 | Reihenfolge |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |

**Indizes:**
- `idx_collection_items_collection` ON collection_id
- `idx_collection_items_unique` ON (collection_id, media_id) (UNIQUE)

---

### 3.30 media_tags (Tags fuer Medien)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| media_id | uuid | NOT NULL, FK -> media.id | Medium |
| tag | varchar(50) | NOT NULL | Tag |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |

**Indizes:**
- `idx_media_tags_media` ON media_id
- `idx_media_tags_tag` ON (media_id, tag) (UNIQUE)

---

### 3.31 budgets (Budgets)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| event_id | uuid | FK -> events.id, nullable | Verknuepftes Event |
| name | varchar(255) | NOT NULL | Budget-Name |
| description | text | | Beschreibung |
| total_budget | decimal(12,2) | DEFAULT 0.00 | Gesamtbudget |
| total_spent | decimal(12,2) | DEFAULT 0.00 | Ausgegeben |
| total_income | decimal(12,2) | DEFAULT 0.00 | Einnahmen |
| balance | decimal(12,2) | GENERATED | Differenz |
| currency | varchar(3) | DEFAULT 'EUR' | Waehrung |
| fiscal_year | integer | | Geschaeftsjahr |
| fiscal_quarter | integer | | Quartal |
| budget_type | varchar(20) | DEFAULT 'event' | 'event', 'annual', 'project', 'tour' |
| status | varchar(20) | DEFAULT 'active' | 'active', 'closed', 'draft' |
| created_by | uuid | NOT NULL, FK -> users.id | Erstellt von |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_budgets_org` ON organization_id
- `idx_budgets_event` ON event_id
- `idx_budgets_year` ON (organization_id, fiscal_year)
- `idx_budgets_type` ON (organization_id, budget_type)

---

### 3.32 budget_items (Budgetpositionen)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| budget_id | uuid | NOT NULL, FK -> budgets.id | Budget |
| category | varchar(50) | NOT NULL | Kategorie |
| item_type | varchar(10) | NOT NULL, DEFAULT 'expense' | 'income', 'expense' |
| item_name | varchar(255) | NOT NULL | Bezeichnung |
| description | text | | Beschreibung |
| planned_amount | decimal(12,2) | DEFAULT 0.00 | Geplant |
| actual_amount | decimal(12,2) | DEFAULT 0.00 | Tatsaechlich |
| variance | decimal(12,2) | GENERATED | Abweichung |
| vendor | varchar(255) | | Lieferant/Kuenstler |
| due_date | date | | Faelligkeitsdatum |
| is_paid | boolean | DEFAULT false | Bezahlt |
| paid_at | timestamptz | | Bezahlt am |
| payment_method | varchar(20) | | 'transfer', 'cash', 'card', 'paypal', 'other' |
| tax_rate | decimal(5,2) | DEFAULT 19.00 | Steuersatz |
| tax_amount | decimal(12,2) | GENERATED | Steuerbetrag |
| notes | text | | Notizen |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_budget_items_budget` ON budget_id
- `idx_budget_items_category` ON (budget_id, category)
- `idx_budget_items_type` ON (budget_id, item_type)
- `idx_budget_items_paid` ON (budget_id, is_paid)

---

### 3.33 transactions (Transaktionen)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| event_id | uuid | FK -> events.id, nullable | Verknuepftes Event |
| budget_id | uuid | FK -> budgets.id, nullable | Verknuepftes Budget |
| budget_item_id | uuid | FK -> budget_items.id, nullable | Verknuepfte Budgetposition |
| transaction_type | varchar(20) | NOT NULL | 'income', 'expense', 'transfer', 'refund' |
| category | varchar(50) | NOT NULL | Kategorie |
| description | varchar(500) | | Beschreibung |
| amount | decimal(12,2) | NOT NULL | Betrag (immer positiv) |
| currency | varchar(3) | DEFAULT 'EUR' | Waehrung |
| transaction_date | date | NOT NULL | Transaktionsdatum |
| payment_method | varchar(20) | | 'transfer', 'cash', 'card', 'paypal', 'direct_debit', 'check', 'other' |
| reference_number | varchar(255) | | Referenznummer |
| counterparty_name | varchar(255) | | Gegenpartei |
| counterparty_iban | varchar(34) | | IBAN Gegenpartei |
| is_tax_relevant | boolean | DEFAULT true | Steuerrelevant |
| tax_rate | decimal(5,2) | DEFAULT 19.00 | Steuersatz |
| tax_amount | decimal(12,2) | GENERATED | Steuerbetrag |
| receipt_url | text | | Beleg-URL |
| invoice_number | varchar(50) | | Rechnungsnummer |
| is_recurring | boolean | DEFAULT false | Wiederkehrend |
| recurring_rule | varchar(50) | | 'monthly', 'quarterly', 'yearly' |
| notes | text | | Notizen |
| created_by | uuid | NOT NULL, FK -> users.id | Erstellt von |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_transactions_org` ON organization_id
- `idx_transactions_event` ON event_id
- `idx_transactions_budget` ON budget_id
- `idx_transactions_date` ON (organization_id, transaction_date)
- `idx_transactions_type` ON (organization_id, transaction_type)
- `idx_transactions_category` ON (organization_id, category)
- `idx_transactions_counterparty` ON (organization_id, counterparty_name)

---

### 3.34 gema_registrations (GEMA-Meldungen)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| event_id | uuid | NOT NULL, FK -> events.id | Event |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| submitted_by | uuid | NOT NULL, FK -> users.id | Eingereicht von |
| status | varchar(20) | DEFAULT 'draft' | 'draft', 'ready', 'submitted', 'confirmed', 'needs_correction', 'exempt' |
| submitted_at | timestamptz | | Einreichungszeitpunkt |
| confirmed_at | timestamptz | | Bestaetigungszeitpunkt |
| report_reference | varchar(50) | | GEMA-Meldungsnummer |
| event_type_gema | varchar(20) | | 'concert', 'background', 'dance', 'other' |
| venue_capacity | integer | | Kapazitaet |
| attendees_actual | integer | | Tatsaechliche Besucher |
| ticket_price | decimal(10,2) | | Eintrittspreis |
| total_revenue | decimal(12,2) | | Gesamtumsatz |
| total_duration | integer | | Gesamtdauer (Minuten) |
| estimated_fee | decimal(10,2) | | Voraussichtliche Gebaeuehr |
| actual_fee | decimal(10,2) | | Tatsaechliche Gebaeuehr |
| fee_paid | boolean | DEFAULT false | Gebaeuehr bezahlt |
| fee_paid_at | timestamptz | | Gebaeuehr bezahlt am |
| declaration_method | varchar(20) | | 'online', 'paper', 'api' |
| notes | text | | Notizen |
| correction_notes | text | | Korrekturhinweise |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_gema_event` ON event_id (UNIQUE)
- `idx_gema_org` ON organization_id
- `idx_gema_status` ON (organization_id, status)
- `idx_gema_submitted` ON (organization_id, submitted_at)

---

### 3.35 gema_works (GEMA-Werke pro Meldung)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| registration_id | uuid | NOT NULL, FK -> gema_registrations.id | GEMA-Meldung |
| title | varchar(255) | NOT NULL | Werk-Titel |
| composer | varchar(255) | | Komponist |
| lyricist | varchar(255) | | Texter |
| publisher | varchar(255) | | Verlag |
| artist_performed | varchar(255) | | Ausfuehrender Kuenstler |
| duration | integer | | Dauer (Minuten) |
| is_own_work | boolean | DEFAULT false | Eigenwerk |
| is_authorized | boolean | DEFAULT true | Autorisiert |
| gema_work_number | varchar(50) | | GEMA-Werksnummer |
| share_percentage | decimal(5,2) | DEFAULT 100.00 | Anteil in % |
| notes | text | | Notizen |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_gema_works_registration` ON registration_id
- `idx_gema_works_title` ON (registration_id, title)

---

### 3.36 calendar_entries (Kalendereintraege)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| user_id | uuid | NOT NULL, FK -> users.id | Eigentuemer |
| event_id | uuid | FK -> events.id, nullable | Verknuepftes Event |
| title | varchar(255) | NOT NULL | Titel |
| description | text | | Beschreibung |
| entry_type | varchar(20) | DEFAULT 'event' | 'event', 'reminder', 'task', 'meeting', 'deadline', 'rehearsal', 'travel', 'other' |
| start_date | timestamptz | NOT NULL | Startzeitpunkt |
| end_date | timestamptz | | Endzeitpunkt |
| all_day | boolean | DEFAULT false | Ganztaegig |
| location | varchar(255) | | Ort |
| recurrence_rule | varchar(255) | | iCal-RRULE fuer Wiederholungen |
| recurrence_end | date | | Ende der Wiederholung |
| reminder_minutes | integer[] | | Erinnerung in Minuten vor Start |
| color | varchar(7) | DEFAULT '#3B82F6' | Farbe (Hex) |
| is_private | boolean | DEFAULT false | Privat |
| attendees | jsonb | DEFAULT '[]' | Teilnehmer |
| external_url | text | | Externer Link |
| status | varchar(20) | DEFAULT 'confirmed' | 'confirmed', 'tentative', 'cancelled' |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |
| deleted_at | timestamptz | | Soft-Delete |

**Indizes:**
- `idx_calendar_org` ON organization_id
- `idx_calendar_user` ON user_id
- `idx_calendar_event` ON event_id
- `idx_calendar_date_range` ON (organization_id, start_date, end_date)
- `idx_calendar_type` ON (organization_id, entry_type)
- `idx_calendar_date` ON start_date

---

### 3.37 activity_log (Aktivitaetsprotokoll)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| user_id | uuid | FK -> users.id, nullable | Benutzer |
| entity_type | varchar(50) | NOT NULL | 'event', 'artist', 'venue', 'campaign', 'transaction', 'gema', 'media' |
| entity_id | uuid | | Betroffene Entitaet |
| action | varchar(50) | NOT NULL | 'created', 'updated', 'deleted', 'viewed', 'sent', 'published', 'signed', 'paid' |
| description | text | | Beschreibung |
| details | jsonb | DEFAULT '{}' | Zusaetzliche Details |
| ip_address | varchar(45) | | IP-Adresse |
| user_agent | text | | User-Agent |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |

**Indizes:**
- `idx_activity_org` ON organization_id
- `idx_activity_user` ON user_id
- `idx_activity_entity` ON (entity_type, entity_id)
- `idx_activity_created` ON created_at
- `idx_activity_type_action` ON (organization_id, entity_type, action)

---

### 3.38 settings (Anwendungseinstellungen)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| key | varchar(100) | NOT NULL | Einstellungs-Schluessel |
| value | jsonb | NOT NULL | Einstellungswert |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_settings_unique` ON (organization_id, key) (UNIQUE)

---

### 3.39 notification_preferences (Benachrichtigungseinstellungen)

| Feld | Datentyp | Constraints | Beschreibung |
|------|----------|-------------|--------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | Eindeutige ID |
| user_id | uuid | NOT NULL, FK -> users.id | Benutzer |
| organization_id | uuid | NOT NULL, FK -> organizations.id | Organisation |
| notification_type | varchar(50) | NOT NULL | Typ |
| channel_email | boolean | DEFAULT true | E-Mail |
| channel_push | boolean | DEFAULT true | Push |
| channel_in_app | boolean | DEFAULT true | In-App |
| created_at | timestamptz | DEFAULT now() | Erstellungszeitpunkt |
| updated_at | timestamptz | DEFAULT now() | Letzte Aktualisierung |

**Indizes:**
- `idx_notif_prefs_unique` ON (user_id, organization_id, notification_type) (UNIQUE)

---

## 4. SQL-DDL (CREATE TABLE Statements)

```sql
-- ============================================================
-- Extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- ============================================================
-- 1. organizations
-- ============================================================
CREATE TABLE organizations (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            varchar(255) NOT NULL,
    slug            varchar(100) NOT NULL UNIQUE,
    description     text,
    logo_url        text,
    website         varchar(255),
    address         varchar(255),
    city            varchar(100),
    zip             varchar(20),
    country         varchar(2) DEFAULT 'DE',
    fiscal_year_start date DEFAULT '01-01',
    vat_id          varchar(50),
    tax_number      varchar(50),
    bank_account_iban varchar(34),
    bank_account_bic varchar(11),
    bank_name       varchar(100),
    is_active       boolean DEFAULT true,
    plan_tier       varchar(20) DEFAULT 'free',
    plan_expires_at timestamptz,
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_active ON organizations(is_active) WHERE is_active = true;

-- ============================================================
-- 2. users (Erweiterung von Supabase auth.users)
-- ============================================================
CREATE TABLE users (
    id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email               varchar(255) NOT NULL UNIQUE,
    first_name          varchar(100),
    last_name           varchar(100),
    avatar_url          text,
    phone               varchar(50),
    timezone            varchar(50) DEFAULT 'Europe/Berlin',
    locale              varchar(10) DEFAULT 'de-DE',
    email_notifications boolean DEFAULT true,
    push_notifications  boolean DEFAULT true,
    theme_preference    varchar(10) DEFAULT 'system',
    onboarding_completed boolean DEFAULT false,
    last_login_at       timestamptz,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_last_login ON users(last_login_at);

-- ============================================================
-- 3. organization_members
-- ============================================================
CREATE TABLE organization_members (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role            varchar(20) NOT NULL DEFAULT 'member',
    permissions     jsonb DEFAULT '{}',
    is_primary      boolean DEFAULT false,
    invited_by      uuid REFERENCES users(id),
    joined_at       timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now(),
    UNIQUE (organization_id, user_id)
);

CREATE INDEX idx_org_members_role ON organization_members(organization_id, role);
CREATE INDEX idx_org_members_user ON organization_members(user_id);

-- ============================================================
-- 4. invitations
-- ============================================================
CREATE TABLE invitations (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email           varchar(255) NOT NULL,
    role            varchar(20) NOT NULL DEFAULT 'member',
    invited_by      uuid NOT NULL REFERENCES users(id),
    token           uuid DEFAULT uuid_generate_v4(),
    expires_at      timestamptz NOT NULL DEFAULT now() + interval '7 days',
    accepted_at     timestamptz,
    created_at      timestamptz DEFAULT now(),
    UNIQUE (token)
);

CREATE INDEX idx_invitations_email ON invitations(organization_id, email);
CREATE INDEX idx_invitations_expires ON invitations(expires_at);

-- ============================================================
-- 5. venues (Spielorte)
-- ============================================================
CREATE TABLE venues (
    id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id     uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name                varchar(255) NOT NULL,
    slug                varchar(100),
    description         text,
    address             varchar(255),
    address_extra       varchar(255),
    city                varchar(100),
    zip                 varchar(20),
    country             varchar(2) DEFAULT 'DE',
    latitude            decimal(10,8),
    longitude           decimal(11,8),
    capacity            integer CHECK (capacity >= 0),
    venue_type          varchar(50),
    website             varchar(255),
    contact_name        varchar(255),
    contact_email       varchar(255),
    contact_phone       varchar(50),
    tech_specs          jsonb DEFAULT '{}',
    accessibility_info  text,
    parking_info        text,
    photo_url           text,
    contract_template   text,
    default_fee         decimal(10,2),
    notes               text,
    is_active           boolean DEFAULT true,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now(),
    deleted_at          timestamptz
);

CREATE INDEX idx_venues_org ON venues(organization_id);
CREATE INDEX idx_venues_name ON venues(organization_id, name);
CREATE INDEX idx_venues_city ON venues(organization_id, city);
CREATE INDEX idx_venues_active ON venues(organization_id, is_active);
CREATE INDEX idx_venues_geo ON venues(latitude, longitude) WHERE latitude IS NOT NULL;
CREATE INDEX idx_venues_type ON venues(organization_id, venue_type);

-- ============================================================
-- 6. venue_rooms
-- ============================================================
CREATE TABLE venue_rooms (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id        uuid NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    name            varchar(255) NOT NULL,
    description     text,
    capacity        integer CHECK (capacity >= 0),
    has_piano       boolean DEFAULT false,
    has_pa          boolean DEFAULT false,
    has_lighting    boolean DEFAULT false,
    has_projector   boolean DEFAULT false,
    dimensions      varchar(50),
    floor_type      varchar(50),
    photo_url       text,
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_venue_rooms_venue ON venue_rooms(venue_id);

-- ============================================================
-- 7. venue_bookings
-- ============================================================
CREATE TABLE venue_bookings (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id        uuid NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    room_id         uuid REFERENCES venue_rooms(id) ON DELETE SET NULL,
    event_id        uuid REFERENCES events(id) ON DELETE SET NULL,
    booking_date    date NOT NULL,
    start_time      time,
    end_time        time,
    status          varchar(20) DEFAULT 'reserved',
    purpose         varchar(255),
    notes           text,
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

-- Forward declaration fuer FK auf events (erstellen nach events table)
-- idx siehe unten

-- ============================================================
-- 8. artists
-- ============================================================
CREATE TABLE artists (
    id                      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id         uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    first_name              varchar(100),
    last_name               varchar(100),
    stage_name              varchar(255) NOT NULL,
    email                   varchar(255),
    phone                   varchar(50),
    address                 varchar(255),
    city                    varchar(100),
    zip                     varchar(20),
    country                 varchar(2) DEFAULT 'DE',
    bio                     text,
    website                 varchar(255),
    social_media            jsonb DEFAULT '{}',
    genre                   varchar(100)[],
    instruments             varchar(100)[],
    photo_url               text,
    rider                   text,
    gema_number             varchar(50),
    vat_id                  varchar(50),
    bank_iban               varchar(34),
    bank_bic                varchar(11),
    bank_account_holder     varchar(255),
    default_fee             decimal(10,2),
    rating                  integer CHECK (rating >= 1 AND rating <= 5),
    previous_performances   integer DEFAULT 0,
    is_bookable             boolean DEFAULT true,
    is_favorite             boolean DEFAULT false,
    notes                   text,
    created_at              timestamptz DEFAULT now(),
    updated_at              timestamptz DEFAULT now(),
    deleted_at              timestamptz
);

CREATE INDEX idx_artists_org ON artists(organization_id);
CREATE INDEX idx_artists_stage_name ON artists(organization_id, stage_name);
CREATE INDEX idx_artists_genre ON artists USING gin(organization_id, genre);
CREATE INDEX idx_artists_favorite ON artists(organization_id, is_favorite) WHERE is_favorite = true;
CREATE INDEX idx_artists_bookable ON artists(organization_id, is_bookable);
CREATE INDEX idx_artists_rating ON artists(organization_id, rating);
CREATE INDEX idx_artists_name_trgm ON artists USING gin(stage_name gin_trgm_ops);

-- ============================================================
-- 9. events
-- ============================================================
CREATE TABLE events (
    id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id     uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    venue_id            uuid REFERENCES venues(id) ON DELETE SET NULL,
    room_id             uuid REFERENCES venue_rooms(id) ON DELETE SET NULL,
    title               varchar(255) NOT NULL,
    subtitle            varchar(255),
    description         text,
    event_type          varchar(50) NOT NULL DEFAULT 'concert',
    status              varchar(20) NOT NULL DEFAULT 'draft',
    date                date NOT NULL,
    start_time          time,
    end_time            time,
    doors_open          time,
    ticket_price        decimal(10,2),
    ticket_presale_price decimal(10,2),
    capacity_planned    integer,
    attendees_actual    integer,
    revenue_target      decimal(12,2),
    revenue_actual      decimal(12,2),
    is_public           boolean DEFAULT false,
    slug                varchar(255),
    poster_url          text,
    fb_event_url        text,
    ticketing_url       text,
    notes_public        text,
    notes_internal      text,
    gema_status         varchar(20) DEFAULT 'not_required',
    gema_submitted_at   timestamptz,
    gema_report_reference varchar(50),
    created_by          uuid NOT NULL REFERENCES users(id),
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now(),
    deleted_at          timestamptz
);

CREATE INDEX idx_events_org ON events(organization_id);
CREATE INDEX idx_events_venue ON events(venue_id);
CREATE INDEX idx_events_date ON events(organization_id, date);
CREATE INDEX idx_events_date_range ON events(organization_id, date) WHERE date >= CURRENT_DATE;
CREATE INDEX idx_events_status ON events(organization_id, status);
CREATE INDEX idx_events_gema ON events(organization_id, gema_status);
CREATE INDEX idx_events_slug ON events(organization_id, slug);
CREATE INDEX idx_events_created_by ON events(created_by);

-- ============================================================
-- 10. event_artists
-- ============================================================
CREATE TABLE event_artists (
    id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id            uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    artist_id           uuid NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    order_index         integer NOT NULL DEFAULT 0,
    fee                 decimal(10,2),
    fee_currency        varchar(3) DEFAULT 'EUR',
    set_duration        integer,
    arrival_time        time,
    soundcheck_time     time,
    performance_start   time,
    accommodation       text,
    catering            text,
    transport           text,
    contract_status     varchar(20) DEFAULT 'pending',
    contract_sent_at    timestamptz,
    contract_signed_at  timestamptz,
    notes               text,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now(),
    UNIQUE (event_id, artist_id)
);

CREATE INDEX idx_event_artists_event ON event_artists(event_id);
CREATE INDEX idx_event_artists_artist ON event_artists(artist_id);
CREATE INDEX idx_event_artists_order ON event_artists(event_id, order_index);

-- ============================================================
-- 11. event_notes
-- ============================================================
CREATE TABLE event_notes (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id    uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id     uuid NOT NULL REFERENCES users(id),
    note_type   varchar(20) DEFAULT 'general',
    content     text NOT NULL,
    is_pinned   boolean DEFAULT false,
    created_at  timestamptz DEFAULT now(),
    updated_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_event_notes_event ON event_notes(event_id);
CREATE INDEX idx_event_notes_type ON event_notes(event_id, note_type);

-- ============================================================
-- 12. event_checklist
-- ============================================================
CREATE TABLE event_checklist (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id        uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    item            varchar(255) NOT NULL,
    description     text,
    category        varchar(50) DEFAULT 'general',
    is_completed    boolean DEFAULT false,
    completed_at    timestamptz,
    completed_by    uuid REFERENCES users(id),
    due_date        date,
    assigned_to     uuid REFERENCES users(id),
    order_index     integer DEFAULT 0,
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_event_checklist_event ON event_checklist(event_id);
CREATE INDEX idx_event_checklist_completed ON event_checklist(event_id, is_completed);
CREATE INDEX idx_event_checklist_assigned ON event_checklist(assigned_to, is_completed);
CREATE INDEX idx_event_checklist_due ON event_checklist(event_id, due_date);

-- ============================================================
-- 13. contracts
-- ============================================================
CREATE TABLE contracts (
    id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id            uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    artist_id           uuid NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    contract_type       varchar(20) DEFAULT 'performance',
    status              varchar(20) DEFAULT 'draft',
    fee                 decimal(10,2),
    fee_currency        varchar(3) DEFAULT 'EUR',
    deposit_amount      decimal(10,2),
    deposit_paid        boolean DEFAULT false,
    deposit_paid_at     timestamptz,
    cancellation_terms  text,
    technical_rider     text,
    hospitality_rider   text,
    contract_text       text,
    file_url            text,
    signed_file_url     text,
    sent_at             timestamptz,
    signed_at           timestamptz,
    valid_from          date,
    valid_until         date,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

CREATE INDEX idx_contracts_event ON contracts(event_id);
CREATE INDEX idx_contracts_artist ON contracts(artist_id);
CREATE INDEX idx_contracts_status ON contracts(event_id, status);

-- ============================================================
-- 14. newsletter_subscribers
-- ============================================================
CREATE TABLE newsletter_subscribers (
    id                      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id         uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email                   varchar(255) NOT NULL,
    first_name              varchar(100),
    last_name               varchar(100),
    city                    varchar(100),
    salutation              varchar(20),
    subscribed              boolean DEFAULT true,
    subscription_date       timestamptz DEFAULT now(),
    subscription_source     varchar(50),
    double_opt_in           boolean DEFAULT false,
    double_opt_in_at        timestamptz,
    interests               varchar(50)[],
    language                varchar(5) DEFAULT 'de',
    unsubscribed_at         timestamptz,
    unsubscribe_reason      text,
    bounce_count            integer DEFAULT 0,
    is_bounced              boolean DEFAULT false,
    last_sent_at            timestamptz,
    last_open_at            timestamptz,
    last_click_at           timestamptz,
    engagement_score        decimal(3,2) DEFAULT 0.00,
    metadata                jsonb DEFAULT '{}',
    created_at              timestamptz DEFAULT now(),
    updated_at              timestamptz DEFAULT now(),
    UNIQUE (organization_id, email)
);

CREATE INDEX idx_subscribers_org ON newsletter_subscribers(organization_id);
CREATE INDEX idx_subscribers_subscribed ON newsletter_subscribers(organization_id, subscribed);
CREATE INDEX idx_subscribers_engagement ON newsletter_subscribers(organization_id, engagement_score);
CREATE INDEX idx_subscribers_source ON newsletter_subscribers(organization_id, subscription_source);
CREATE INDEX idx_subscribers_bounced ON newsletter_subscribers(organization_id, is_bounced);

-- ============================================================
-- 15. subscriber_tags
-- ============================================================
CREATE TABLE subscriber_tags (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscriber_id   uuid NOT NULL REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
    tag             varchar(50) NOT NULL,
    created_at      timestamptz DEFAULT now(),
    UNIQUE (subscriber_id, tag)
);

CREATE INDEX idx_subscriber_tags_sub ON subscriber_tags(subscriber_id);

-- ============================================================
-- 16. email_templates
-- ============================================================
CREATE TABLE email_templates (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name            varchar(255) NOT NULL,
    description     text,
    subject         varchar(500) NOT NULL,
    body_html       text,
    body_text       text,
    variables       jsonb DEFAULT '{}',
    category        varchar(50) DEFAULT 'general',
    is_default      boolean DEFAULT false,
    preview_data    jsonb DEFAULT '{}',
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_templates_org ON email_templates(organization_id);
CREATE INDEX idx_templates_category ON email_templates(organization_id, category);

-- ============================================================
-- 17. email_campaigns
-- ============================================================
CREATE TABLE email_campaigns (
    id                      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id         uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name                    varchar(255) NOT NULL,
    subject                 varchar(500) NOT NULL,
    preview_text            varchar(255),
    template_id             uuid REFERENCES email_templates(id),
    body_html               text,
    body_text               text,
    sender_name             varchar(255),
    sender_email            varchar(255),
    reply_to                varchar(255),
    status                  varchar(20) DEFAULT 'draft',
    scheduled_at            timestamptz,
    sent_at                 timestamptz,
    completed_at            timestamptz,
    total_recipients        integer DEFAULT 0,
    total_sent              integer DEFAULT 0,
    total_delivered         integer DEFAULT 0,
    total_bounced           integer DEFAULT 0,
    total_opens             integer DEFAULT 0,
    unique_opens            integer DEFAULT 0,
    total_clicks            integer DEFAULT 0,
    unique_clicks           integer DEFAULT 0,
    total_unsubscribes      integer DEFAULT 0,
    total_complaints        integer DEFAULT 0,
    filter_tags             varchar(50)[],
    filter_segment          varchar(50),
    filter_sql              text,
    ab_test_enabled         boolean DEFAULT false,
    ab_test_subject_b       varchar(500),
    ab_test_winner_after    integer,
    created_by              uuid NOT NULL REFERENCES users(id),
    created_at              timestamptz DEFAULT now(),
    updated_at              timestamptz DEFAULT now()
);

CREATE INDEX idx_campaigns_org ON email_campaigns(organization_id);
CREATE INDEX idx_campaigns_status ON email_campaigns(organization_id, status);
CREATE INDEX idx_campaigns_scheduled ON email_campaigns(scheduled_at) WHERE status = 'scheduled';

-- ============================================================
-- 18. campaign_segments
-- ============================================================
CREATE TABLE campaign_segments (
    id                      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id             uuid NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
    subscriber_id           uuid NOT NULL REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
    status                  varchar(20) DEFAULT 'queued',
    sent_at                 timestamptz,
    delivered_at            timestamptz,
    opened_at               timestamptz,
    open_count              integer DEFAULT 0,
    clicked_at              timestamptz,
    click_count             integer DEFAULT 0,
    bounce_type             varchar(20),
    bounce_reason           text,
    unsubscribe_triggered   boolean DEFAULT false,
    ip_address              varchar(45),
    user_agent              text,
    created_at              timestamptz DEFAULT now(),
    updated_at              timestamptz DEFAULT now(),
    UNIQUE (campaign_id, subscriber_id)
);

CREATE INDEX idx_segments_campaign ON campaign_segments(campaign_id);
CREATE INDEX idx_segments_subscriber ON campaign_segments(subscriber_id);
CREATE INDEX idx_segments_status ON campaign_segments(campaign_id, status);

-- ============================================================
-- 19. email_tracking
-- ============================================================
CREATE TABLE email_tracking (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id     uuid REFERENCES email_campaigns(id) ON DELETE CASCADE,
    segment_id      uuid REFERENCES campaign_segments(id) ON DELETE CASCADE,
    subscriber_id   uuid REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
    event_type      varchar(20) NOT NULL,
    event_at        timestamptz NOT NULL DEFAULT now(),
    link_url        text,
    ip_address      varchar(45),
    user_agent      text,
    geolocation     jsonb,
    created_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_email_tracking_campaign ON email_tracking(campaign_id);
CREATE INDEX idx_email_tracking_subscriber ON email_tracking(subscriber_id);
CREATE INDEX idx_email_tracking_type ON email_tracking(campaign_id, event_type);
CREATE INDEX idx_email_tracking_event_at ON email_tracking(event_at);

-- ============================================================
-- 20. social_media_accounts
-- ============================================================
CREATE TABLE social_media_accounts (
    id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id     uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    platform            varchar(20) NOT NULL,
    account_name        varchar(255),
    account_handle      varchar(100),
    account_url         text,
    profile_image_url   text,
    access_token        text,
    refresh_token       text,
    token_expires_at    timestamptz,
    scope               text,
    follower_count      integer,
    is_active           boolean DEFAULT true,
    auto_post           boolean DEFAULT false,
    post_defaults       jsonb DEFAULT '{}',
    last_synced_at      timestamptz,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

CREATE INDEX idx_social_accounts_org ON social_media_accounts(organization_id);
CREATE INDEX idx_social_accounts_platform ON social_media_accounts(organization_id, platform);
CREATE INDEX idx_social_accounts_active ON social_media_accounts(organization_id, is_active);

-- ============================================================
-- 21. social_posts
-- ============================================================
CREATE TABLE social_posts (
    id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id     uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    account_id          uuid NOT NULL REFERENCES social_media_accounts(id) ON DELETE CASCADE,
    event_id            uuid REFERENCES events(id) ON DELETE SET NULL,
    content             text NOT NULL,
    media_urls          text[],
    post_type           varchar(20) DEFAULT 'text',
    status              varchar(20) DEFAULT 'draft',
    scheduled_at        timestamptz,
    published_at        timestamptz,
    platform_post_id    varchar(255),
    platform_post_url   text,
    likes_count         integer DEFAULT 0,
    comments_count      integer DEFAULT 0,
    shares_count        integer DEFAULT 0,
    reach_count         integer DEFAULT 0,
    impressions_count   integer DEFAULT 0,
    engagement_rate     decimal(5,4),
    error_message       text,
    parent_post_id      uuid REFERENCES social_posts(id),
    created_by          uuid NOT NULL REFERENCES users(id),
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

CREATE INDEX idx_social_posts_org ON social_posts(organization_id);
CREATE INDEX idx_social_posts_account ON social_posts(account_id);
CREATE INDEX idx_social_posts_event ON social_posts(event_id);
CREATE INDEX idx_social_posts_status ON social_posts(organization_id, status);
CREATE INDEX idx_social_posts_scheduled ON social_posts(organization_id, scheduled_at) WHERE status = 'scheduled';

-- ============================================================
-- 22. social_post_media
-- ============================================================
-- FK auf media - erstellen nach media table
CREATE TABLE social_post_media (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id     uuid NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
    media_id    uuid NOT NULL,
    order_index integer DEFAULT 0,
    created_at  timestamptz DEFAULT now(),
    UNIQUE (post_id, media_id)
);

CREATE INDEX idx_spm_post ON social_post_media(post_id);

-- ============================================================
-- 23. social_analytics
-- ============================================================
CREATE TABLE social_analytics (
    id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id             uuid NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
    impressions         integer DEFAULT 0,
    reach               integer DEFAULT 0,
    engagement          integer DEFAULT 0,
    clicks              integer DEFAULT 0,
    likes               integer DEFAULT 0,
    comments            integer DEFAULT 0,
    shares              integer DEFAULT 0,
    saves               integer DEFAULT 0,
    profile_visits      integer DEFAULT 0,
    follows_gained      integer DEFAULT 0,
    video_views         integer DEFAULT 0,
    watch_time_seconds  integer,
    demographics        jsonb DEFAULT '{}',
    recorded_at         timestamptz NOT NULL DEFAULT now(),
    created_at          timestamptz DEFAULT now()
);

CREATE INDEX idx_social_analytics_post ON social_analytics(post_id);
CREATE INDEX idx_social_analytics_recorded ON social_analytics(post_id, recorded_at);

-- ============================================================
-- 24. press_contacts
-- ============================================================
CREATE TABLE press_contacts (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    outlet_name     varchar(255) NOT NULL,
    outlet_type     varchar(50),
    contact_name    varchar(255),
    salutation      varchar(20),
    email           varchar(255),
    phone           varchar(50),
    address         varchar(255),
    city            varchar(100),
    zip             varchar(20),
    website         varchar(255),
    media_type      varchar(50)[],
    beats           varchar(100)[],
    priority        varchar(10) DEFAULT 'medium',
    is_blacklisted  boolean DEFAULT false,
    last_contacted_at timestamptz,
    response_rate   decimal(3,2),
    notes           text,
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_press_contacts_org ON press_contacts(organization_id);
CREATE INDEX idx_press_contacts_priority ON press_contacts(organization_id, priority);
CREATE INDEX idx_press_contacts_outlet ON press_contacts(organization_id, outlet_name);
CREATE INDEX idx_press_contacts_type ON press_contacts(organization_id, outlet_type);

-- ============================================================
-- 25. press_releases
-- ============================================================
CREATE TABLE press_releases (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    event_id        uuid REFERENCES events(id) ON DELETE SET NULL,
    title           varchar(500) NOT NULL,
    subtitle        varchar(500),
    content_html    text,
    content_text    text,
    excerpt         text,
    status          varchar(20) DEFAULT 'draft',
    scheduled_at    timestamptz,
    published_at    timestamptz,
    sent_at         timestamptz,
    created_by      uuid NOT NULL REFERENCES users(id),
    approved_by     uuid REFERENCES users(id),
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_press_releases_org ON press_releases(organization_id);
CREATE INDEX idx_press_releases_event ON press_releases(event_id);
CREATE INDEX idx_press_releases_status ON press_releases(organization_id, status);

-- ============================================================
-- 26. press_distributions
-- ============================================================
CREATE TABLE press_distributions (
    id                      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    release_id              uuid NOT NULL REFERENCES press_releases(id) ON DELETE CASCADE,
    contact_id              uuid NOT NULL REFERENCES press_contacts(id) ON DELETE CASCADE,
    sent_at                 timestamptz,
    opened_at               timestamptz,
    responded_at            timestamptz,
    response_type           varchar(20),
    response_notes          text,
    article_url             text,
    article_published_at    date,
    notes                   text,
    created_at              timestamptz DEFAULT now(),
    updated_at              timestamptz DEFAULT now(),
    UNIQUE (release_id, contact_id)
);

CREATE INDEX idx_press_dist_release ON press_distributions(release_id);
CREATE INDEX idx_press_dist_contact ON press_distributions(contact_id);

-- ============================================================
-- 27. media (Fotodatenbank & Medien)
-- ============================================================
CREATE TABLE media (
    id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id     uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    filename            varchar(255) NOT NULL,
    original_name       varchar(255),
    file_url            text NOT NULL,
    thumbnail_url       text,
    preview_url         text,
    file_type           varchar(20) NOT NULL,
    mime_type           varchar(100),
    file_size           bigint,
    width               integer,
    height              integer,
    duration            integer,
    format              varchar(10),
    description         text,
    alt_text            varchar(500),
    photographer        varchar(255),
    taken_at            timestamptz,
    location            varchar(255),
    event_id            uuid REFERENCES events(id) ON DELETE SET NULL,
    artist_id           uuid REFERENCES artists(id) ON DELETE SET NULL,
    venue_id            uuid REFERENCES venues(id) ON DELETE SET NULL,
    is_public           boolean DEFAULT false,
    is_featured         boolean DEFAULT false,
    copyright_notice    varchar(255),
    license_type        varchar(50),
    usage_rights        jsonb DEFAULT '{}',
    metadata            jsonb DEFAULT '{}',
    search_vector       tsvector,
    created_by          uuid NOT NULL REFERENCES users(id),
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now(),
    deleted_at          timestamptz
);

CREATE INDEX idx_media_org ON media(organization_id);
CREATE INDEX idx_media_type ON media(organization_id, file_type);
CREATE INDEX idx_media_event ON media(event_id);
CREATE INDEX idx_media_artist ON media(artist_id);
CREATE INDEX idx_media_venue ON media(venue_id);
CREATE INDEX idx_media_public ON media(organization_id, is_public);
CREATE INDEX idx_media_featured ON media(organization_id, is_featured);
CREATE INDEX idx_media_taken ON media(taken_at);
CREATE INDEX idx_media_search ON media USING gin(search_vector);
CREATE INDEX idx_media_name_trgm ON media USING gin(original_name gin_trgm_ops);

-- ============================================================
-- 28. media_collections
-- ============================================================
CREATE TABLE media_collections (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name            varchar(255) NOT NULL,
    description     text,
    cover_media_id  uuid REFERENCES media(id) ON DELETE SET NULL,
    is_public       boolean DEFAULT false,
    event_id        uuid REFERENCES events(id) ON DELETE SET NULL,
    artist_id       uuid REFERENCES artists(id) ON DELETE SET NULL,
    venue_id        uuid REFERENCES venues(id) ON DELETE SET NULL,
    item_count      integer DEFAULT 0,
    created_by      uuid NOT NULL REFERENCES users(id),
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_collections_org ON media_collections(organization_id);
CREATE INDEX idx_collections_event ON media_collections(event_id);
CREATE INDEX idx_collections_artist ON media_collections(artist_id);
CREATE INDEX idx_collections_venue ON media_collections(venue_id);

-- ============================================================
-- 29. collection_items
-- ============================================================
CREATE TABLE collection_items (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id   uuid NOT NULL REFERENCES media_collections(id) ON DELETE CASCADE,
    media_id        uuid NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    order_index     integer NOT NULL DEFAULT 0,
    created_at      timestamptz DEFAULT now(),
    UNIQUE (collection_id, media_id)
);

CREATE INDEX idx_collection_items_collection ON collection_items(collection_id);

-- ============================================================
-- 30. media_tags
-- ============================================================
CREATE TABLE media_tags (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_id    uuid NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    tag         varchar(50) NOT NULL,
    created_at  timestamptz DEFAULT now(),
    UNIQUE (media_id, tag)
);

CREATE INDEX idx_media_tags_media ON media_tags(media_id);

-- ============================================================
-- 31. budgets
-- ============================================================
CREATE TABLE budgets (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    event_id        uuid REFERENCES events(id) ON DELETE SET NULL,
    name            varchar(255) NOT NULL,
    description     text,
    total_budget    decimal(12,2) DEFAULT 0.00,
    total_spent     decimal(12,2) DEFAULT 0.00,
    total_income    decimal(12,2) DEFAULT 0.00,
    balance         decimal(12,2) GENERATED ALWAYS AS (total_income - total_spent) STORED,
    currency        varchar(3) DEFAULT 'EUR',
    fiscal_year     integer,
    fiscal_quarter  integer,
    budget_type     varchar(20) DEFAULT 'event',
    status          varchar(20) DEFAULT 'active',
    created_by      uuid NOT NULL REFERENCES users(id),
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_budgets_org ON budgets(organization_id);
CREATE INDEX idx_budgets_event ON budgets(event_id);
CREATE INDEX idx_budgets_year ON budgets(organization_id, fiscal_year);
CREATE INDEX idx_budgets_type ON budgets(organization_id, budget_type);

-- ============================================================
-- 32. budget_items
-- ============================================================
CREATE TABLE budget_items (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_id       uuid NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    category        varchar(50) NOT NULL,
    item_type       varchar(10) NOT NULL DEFAULT 'expense',
    item_name       varchar(255) NOT NULL,
    description     text,
    planned_amount  decimal(12,2) DEFAULT 0.00,
    actual_amount   decimal(12,2) DEFAULT 0.00,
    variance        decimal(12,2) GENERATED ALWAYS AS (actual_amount - planned_amount) STORED,
    vendor          varchar(255),
    due_date        date,
    is_paid         boolean DEFAULT false,
    paid_at         timestamptz,
    payment_method  varchar(20),
    tax_rate        decimal(5,2) DEFAULT 19.00,
    tax_amount      decimal(12,2) GENERATED ALWAYS AS (actual_amount * tax_rate / 100.0) STORED,
    notes           text,
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_budget_items_budget ON budget_items(budget_id);
CREATE INDEX idx_budget_items_category ON budget_items(budget_id, category);
CREATE INDEX idx_budget_items_type ON budget_items(budget_id, item_type);
CREATE INDEX idx_budget_items_paid ON budget_items(budget_id, is_paid);

-- ============================================================
-- 33. transactions
-- ============================================================
CREATE TABLE transactions (
    id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id     uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    event_id            uuid REFERENCES events(id) ON DELETE SET NULL,
    budget_id           uuid REFERENCES budgets(id) ON DELETE SET NULL,
    budget_item_id      uuid REFERENCES budget_items(id) ON DELETE SET NULL,
    transaction_type    varchar(20) NOT NULL,
    category            varchar(50) NOT NULL,
    description         varchar(500),
    amount              decimal(12,2) NOT NULL,
    currency            varchar(3) DEFAULT 'EUR',
    transaction_date    date NOT NULL,
    payment_method      varchar(20),
    reference_number    varchar(255),
    counterparty_name   varchar(255),
    counterparty_iban   varchar(34),
    is_tax_relevant     boolean DEFAULT true,
    tax_rate            decimal(5,2) DEFAULT 19.00,
    tax_amount          decimal(12,2) GENERATED ALWAYS AS (amount * tax_rate / 100.0) STORED,
    receipt_url         text,
    invoice_number      varchar(50),
    is_recurring        boolean DEFAULT false,
    recurring_rule      varchar(50),
    notes               text,
    created_by          uuid NOT NULL REFERENCES users(id),
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

CREATE INDEX idx_transactions_org ON transactions(organization_id);
CREATE INDEX idx_transactions_event ON transactions(event_id);
CREATE INDEX idx_transactions_budget ON transactions(budget_id);
CREATE INDEX idx_transactions_date ON transactions(organization_id, transaction_date);
CREATE INDEX idx_transactions_type ON transactions(organization_id, transaction_type);
CREATE INDEX idx_transactions_category ON transactions(organization_id, category);
CREATE INDEX idx_transactions_counterparty ON transactions(organization_id, counterparty_name);

-- ============================================================
-- 34. gema_registrations
-- ============================================================
CREATE TABLE gema_registrations (
    id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id            uuid NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
    organization_id     uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    submitted_by        uuid NOT NULL REFERENCES users(id),
    status              varchar(20) DEFAULT 'draft',
    submitted_at        timestamptz,
    confirmed_at        timestamptz,
    report_reference    varchar(50),
    event_type_gema     varchar(20),
    venue_capacity      integer,
    attendees_actual    integer,
    ticket_price        decimal(10,2),
    total_revenue       decimal(12,2),
    total_duration      integer,
    estimated_fee       decimal(10,2),
    actual_fee          decimal(10,2),
    fee_paid            boolean DEFAULT false,
    fee_paid_at         timestamptz,
    declaration_method  varchar(20),
    notes               text,
    correction_notes    text,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

CREATE INDEX idx_gema_org ON gema_registrations(organization_id);
CREATE INDEX idx_gema_status ON gema_registrations(organization_id, status);
CREATE INDEX idx_gema_submitted ON gema_registrations(organization_id, submitted_at);

-- ============================================================
-- 35. gema_works
-- ============================================================
CREATE TABLE gema_works (
    id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id     uuid NOT NULL REFERENCES gema_registrations(id) ON DELETE CASCADE,
    title               varchar(255) NOT NULL,
    composer            varchar(255),
    lyricist            varchar(255),
    publisher           varchar(255),
    artist_performed    varchar(255),
    duration            integer,
    is_own_work         boolean DEFAULT false,
    is_authorized       boolean DEFAULT true,
    gema_work_number    varchar(50),
    share_percentage    decimal(5,2) DEFAULT 100.00,
    notes               text,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

CREATE INDEX idx_gema_works_registration ON gema_works(registration_id);
CREATE INDEX idx_gema_works_title ON gema_works(registration_id, title);

-- ============================================================
-- 36. calendar_entries
-- ============================================================
CREATE TABLE calendar_entries (
    id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id     uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id             uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id            uuid REFERENCES events(id) ON DELETE SET NULL,
    title               varchar(255) NOT NULL,
    description         text,
    entry_type          varchar(20) DEFAULT 'event',
    start_date          timestamptz NOT NULL,
    end_date            timestamptz,
    all_day             boolean DEFAULT false,
    location            varchar(255),
    recurrence_rule     varchar(255),
    recurrence_end      date,
    reminder_minutes    integer[],
    color               varchar(7) DEFAULT '#3B82F6',
    is_private          boolean DEFAULT false,
    attendees           jsonb DEFAULT '[]',
    external_url        text,
    status              varchar(20) DEFAULT 'confirmed',
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now(),
    deleted_at          timestamptz
);

CREATE INDEX idx_calendar_org ON calendar_entries(organization_id);
CREATE INDEX idx_calendar_user ON calendar_entries(user_id);
CREATE INDEX idx_calendar_event ON calendar_entries(event_id);
CREATE INDEX idx_calendar_date_range ON calendar_entries(organization_id, start_date, end_date);
CREATE INDEX idx_calendar_type ON calendar_entries(organization_id, entry_type);
CREATE INDEX idx_calendar_date ON calendar_entries(start_date);

-- ============================================================
-- 37. activity_log
-- ============================================================
CREATE TABLE activity_log (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id         uuid REFERENCES users(id) ON DELETE SET NULL,
    entity_type     varchar(50) NOT NULL,
    entity_id       uuid,
    action          varchar(50) NOT NULL,
    description     text,
    details         jsonb DEFAULT '{}',
    ip_address      varchar(45),
    user_agent      text,
    created_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_activity_org ON activity_log(organization_id);
CREATE INDEX idx_activity_user ON activity_log(user_id);
CREATE INDEX idx_activity_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_created ON activity_log(created_at);
CREATE INDEX idx_activity_type_action ON activity_log(organization_id, entity_type, action);

-- ============================================================
-- 38. settings
-- ============================================================
CREATE TABLE settings (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    key             varchar(100) NOT NULL,
    value           jsonb NOT NULL,
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now(),
    UNIQUE (organization_id, key)
);

-- ============================================================
-- 39. notification_preferences
-- ============================================================
CREATE TABLE notification_preferences (
    id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id     uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    notification_type   varchar(50) NOT NULL,
    channel_email       boolean DEFAULT true,
    channel_push        boolean DEFAULT true,
    channel_in_app      boolean DEFAULT true,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now(),
    UNIQUE (user_id, organization_id, notification_type)
);

-- ============================================================
-- 40. Nachtraegliche FK auf venue_bookings
-- ============================================================
CREATE INDEX idx_venue_bookings_venue ON venue_bookings(venue_id);
CREATE INDEX idx_venue_bookings_date ON venue_bookings(venue_id, booking_date);
CREATE INDEX idx_venue_bookings_event ON venue_bookings(event_id);

-- ============================================================
-- 41. Nachtraegliche FK auf social_post_media -> media
-- ============================================================
ALTER TABLE social_post_media ADD CONSTRAINT fk_spm_media
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE;


-- ============================================================
-- AUTO-UPDATE TRIGGER FUER updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger fuer alle Tabellen mit updated_at
DO $$ DECLARE
    t record;
BEGIN
    FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        IF EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = t.tablename AND column_name = 'updated_at') THEN
            EXECUTE format('CREATE TRIGGER trg_%I_updated_at
                BEFORE UPDATE ON %I
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
                t.tablename, t.tablename);
        END IF;
    END LOOP;
END $$;
```

---

## 5. Row Level Security (RLS) Policies

```sql
-- ============================================================
-- RLS-Aktivierung fuer alle Tenant-Tabellen
-- ============================================================

-- Organisation-Member Check Helper
CREATE OR REPLACE FUNCTION is_org_member(org_id uuid, user_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_id = org_id AND user_id = user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- RLS auf alle Tabellen aktivieren
-- ============================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriber_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gema_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gema_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Standard-Policies (Organization-Scoped)
-- ============================================================

-- Organizations: Members koennen ihre Organisation sehen
CREATE POLICY org_select ON organizations
    FOR SELECT USING (is_org_member(id, auth.uid()));

-- Users: Jeder kann seinen eigenen Eintrag sehen
CREATE POLICY users_select_own ON users
    FOR SELECT USING (id = auth.uid());

-- Organization Members: Members der Org koennen sehen
CREATE POLICY org_members_select ON organization_members
    FOR SELECT USING (is_org_member(organization_id, auth.uid()));

-- Venues
CREATE POLICY venues_select ON venues
    FOR SELECT USING (is_org_member(organization_id, auth.uid()));
CREATE POLICY venues_insert ON venues
    FOR INSERT WITH CHECK (is_org_member(organization_id, auth.uid()));
CREATE POLICY venues_update ON venues
    FOR UPDATE USING (is_org_member(organization_id, auth.uid()));

-- Artists
CREATE POLICY artists_select ON artists
    FOR SELECT USING (is_org_member(organization_id, auth.uid()));
CREATE POLICY artists_insert ON artists
    FOR INSERT WITH CHECK (is_org_member(organization_id, auth.uid()));
CREATE POLICY artists_update ON artists
    FOR UPDATE USING (is_org_member(organization_id, auth.uid()));

-- Events
CREATE POLICY events_select ON events
    FOR SELECT USING (is_org_member(organization_id, auth.uid()));
CREATE POLICY events_insert ON events
    FOR INSERT WITH CHECK (is_org_member(organization_id, auth.uid()));
CREATE POLICY events_update ON events
    FOR UPDATE USING (is_org_member(organization_id, auth.uid()));

-- Media
CREATE POLICY media_select ON media
    FOR SELECT USING (is_org_member(organization_id, auth.uid()));
CREATE POLICY media_insert ON media
    FOR INSERT WITH CHECK (is_org_member(organization_id, auth.uid()));
CREATE POLICY media_update ON media
    FOR UPDATE USING (is_org_member(organization_id, auth.uid()));

-- Finances
CREATE POLICY budgets_select ON budgets
    FOR SELECT USING (is_org_member(organization_id, auth.uid()));
CREATE POLICY transactions_select ON transactions
    FOR SELECT USING (is_org_member(organization_id, auth.uid()));

-- Newsletter
CREATE POLICY subscribers_select ON newsletter_subscribers
    FOR SELECT USING (is_org_member(organization_id, auth.uid()));
CREATE POLICY campaigns_select ON email_campaigns
    FOR SELECT USING (is_org_member(organization_id, auth.uid()));

-- Social Media
CREATE POLICY social_accounts_select ON social_media_accounts
    FOR SELECT USING (is_org_member(organization_id, auth.uid()));
CREATE POLICY social_posts_select ON social_posts
    FOR SELECT USING (is_org_member(organization_id, auth.uid()));

-- Presse
CREATE POLICY press_contacts_select ON press_contacts
    FOR SELECT USING (is_org_member(organization_id, auth.uid()));
CREATE POLICY press_releases_select ON press_releases
    FOR SELECT USING (is_org_member(organization_id, auth.uid()));

-- GEMA
CREATE POLICY gema_select ON gema_registrations
    FOR SELECT USING (is_org_member(organization_id, auth.uid()));
CREATE POLICY gema_insert ON gema_registrations
    FOR INSERT WITH CHECK (is_org_member(organization_id, auth.uid()));

-- Calendar
CREATE POLICY calendar_select ON calendar_entries
    FOR SELECT USING (
        is_org_member(organization_id, auth.uid()) AND
        (NOT is_private OR user_id = auth.uid())
    );

-- Settings
CREATE POLICY settings_select ON settings
    FOR SELECT USING (is_org_member(organization_id, auth.uid()));
```

---

## 6. Zusaetzliche Datenbankobjekte

### 6.1 Volltextsuche-Trigger fuer media

```sql
CREATE OR REPLACE FUNCTION media_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('german', COALESCE(NEW.original_name, '')), 'A') ||
        setweight(to_tsvector('german', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('german', COALESCE(NEW.photographer, '')), 'C') ||
        setweight(to_tsvector('german', COALESCE(NEW.alt_text, '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_media_search_vector
    BEFORE INSERT OR UPDATE ON media
    FOR EACH ROW EXECUTE FUNCTION media_search_vector_update();
```

### 6.2 Views fuer haeufige Abfragen

```sql
-- View: Event-Uebersicht mit allen relevanten Daten
CREATE OR REPLACE VIEW v_event_overview AS
SELECT
    e.id,
    e.title,
    e.subtitle,
    e.date,
    e.start_time,
    e.status,
    e.event_type,
    v.name AS venue_name,
    v.city AS venue_city,
    COUNT(DISTINCT ea.artist_id) AS artist_count,
    SUM(ea.fee) AS total_fees,
    e.ticket_price,
    e.capacity_planned,
    e.attendees_actual,
    e.gema_status,
    e.created_at
FROM events e
LEFT JOIN venues v ON e.venue_id = v.id
LEFT JOIN event_artists ea ON e.id = ea.event_id
WHERE e.deleted_at IS NULL
GROUP BY e.id, v.name, v.city;

-- View: Newsletter-Engagement pro Abonnent
CREATE OR REPLACE VIEW v_subscriber_engagement AS
SELECT
    ns.id,
    ns.email,
    ns.first_name,
    ns.last_name,
    ns.organization_id,
    COUNT(DISTINCT cs.campaign_id) AS campaigns_received,
    COUNT(DISTINCT CASE WHEN cs.opened_at IS NOT NULL THEN cs.campaign_id END) AS campaigns_opened,
    COUNT(DISTINCT CASE WHEN cs.clicked_at IS NOT NULL THEN cs.campaign_id END) AS campaigns_clicked,
    COALESCE(
        COUNT(DISTINCT CASE WHEN cs.opened_at IS NOT NULL THEN cs.campaign_id END)::decimal /
        NULLIF(COUNT(DISTINCT cs.campaign_id), 0),
        0
    ) AS open_rate,
    ns.engagement_score,
    ns.subscribed,
    ns.subscription_date
FROM newsletter_subscribers ns
LEFT JOIN campaign_segments cs ON ns.id = cs.subscriber_id
WHERE ns.deleted_at IS NULL
GROUP BY ns.id;

-- View: Finanzuebersicht pro Event
CREATE OR REPLACE VIEW v_event_finances AS
SELECT
    e.id AS event_id,
    e.title AS event_title,
    e.date AS event_date,
    b.id AS budget_id,
    b.total_budget,
    b.total_income,
    b.total_spent,
    b.balance,
    COUNT(DISTINCT bi.id) AS budget_item_count,
    COUNT(DISTINCT t.id) AS transaction_count
FROM events e
LEFT JOIN budgets b ON e.id = b.event_id
LEFT JOIN budget_items bi ON b.id = bi.budget_id
LEFT JOIN transactions t ON b.id = t.budget_id
WHERE e.deleted_at IS NULL
GROUP BY e.id, b.id;

-- View: Dashboard-Zahlen
CREATE OR REPLACE VIEW v_dashboard_stats AS
SELECT
    organization_id,
    COUNT(DISTINCT CASE WHEN status IN ('confirmed', 'published') AND date >= CURRENT_DATE THEN id END) AS upcoming_events,
    COUNT(DISTINCT CASE WHEN date >= DATE_TRUNC('year', CURRENT_DATE) THEN id END) AS events_this_year,
    COUNT(DISTINCT id) FILTER (WHERE deleted_at IS NULL) AS total_events,
    COUNT(DISTINCT venue_id) FILTER (WHERE deleted_at IS NULL) AS active_venues,
    COUNT(DISTINCT id) FILTER (WHERE deleted_at IS NULL) AS total_artists
FROM events
GROUP BY organization_id;
```

### 6.3 Stored Procedures

```sql
-- Funktion: GEMA-Gebuehr schaetzen
CREATE OR REPLACE FUNCTION estimate_gema_fee(
    p_ticket_price decimal(10,2),
    p_attendees integer,
    p_duration_minutes integer
)
RETURNS decimal(10,2) AS $$
DECLARE
    v_base_rate decimal(10,2) := 0.10; -- ca. 10% des Nettoerlöses
    v_duration_factor decimal(5,2);
    v_estimated decimal(10,2);
BEGIN
    -- Dauermultiplikator (hoehere Gebuehr bei laengeren Events)
    v_duration_factor := LEAST(1 + (p_duration_minutes / 180.0), 3.0);
    
    -- Schaetzung: 8-12% des Nettoerlöses
    v_estimated := (p_ticket_price * p_attendees * 0.10 * v_duration_factor);
    
    RETURN ROUND(v_estimated, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Funktion: Budget-Balance aktualisieren
CREATE OR REPLACE FUNCTION recalculate_budget(p_budget_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE budgets
    SET total_spent = (
        SELECT COALESCE(SUM(actual_amount), 0) 
        FROM budget_items 
        WHERE budget_id = p_budget_id AND item_type = 'expense'
    ),
    total_income = (
        SELECT COALESCE(SUM(actual_amount), 0)
        FROM budget_items
        WHERE budget_id = p_budget_id AND item_type = 'income'
    )
    WHERE id = p_budget_id;
END;
$$ LANGUAGE plpgsql;

-- Funktion: Engagement-Score neu berechnen
CREATE OR REPLACE FUNCTION recalculate_engagement_score(p_subscriber_id uuid)
RETURNS void AS $$
DECLARE
    v_total_campaigns integer;
    v_open_rate decimal(5,4);
    v_click_rate decimal(5,4);
    v_recency_factor decimal(3,2);
    v_score decimal(3,2);
BEGIN
    SELECT 
        COUNT(*),
        COALESCE(AVG(CASE WHEN opened_at IS NOT NULL THEN 1 ELSE 0 END), 0),
        COALESCE(AVG(CASE WHEN clicked_at IS NOT NULL THEN 1 ELSE 0 END), 0)
    INTO v_total_campaigns, v_open_rate, v_click_rate
    FROM campaign_segments
    WHERE subscriber_id = p_subscriber_id
    AND status = 'delivered';
    
    -- Recency-Faktor (letzte 90 Tage)
    SELECT COALESCE(
        GREATEST(0, 1.0 - EXTRACT(EPOCH FROM (now() - MAX(opened_at))) / (90 * 86400)),
        0
    )
    INTO v_recency_factor
    FROM campaign_segments
    WHERE subscriber_id = p_subscriber_id;
    
    v_score := LEAST(1.00, (v_open_rate * 0.4 + v_click_rate * 0.4 + v_recency_factor * 0.2));
    
    UPDATE newsletter_subscribers
    SET engagement_score = v_score
    WHERE id = p_subscriber_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 7. Enum-Typen (PostgreSQL)

```sql
-- Alternative: PostgreSQL ENUM-Typen fuer Typsicherheit
-- (Empfohlen fuer Felder mit festem Wertebereich)

CREATE TYPE venue_type_enum AS ENUM ('theater', 'club', 'cafe', 'hall', 'outdoor', 'church', 'other');
CREATE TYPE event_status_enum AS ENUM ('draft', 'planned', 'confirmed', 'published', 'sold_out', 'completed', 'cancelled');
CREATE TYPE event_type_enum AS ENUM ('concert', 'festival', 'tour', 'rehearsal', 'workshop', 'other');
CREATE TYPE contract_status_enum AS ENUM ('pending', 'sent', 'signed', 'cancelled');
CREATE TYPE campaign_status_enum AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled');
CREATE TYPE social_platform_enum AS ENUM ('facebook', 'instagram', 'twitter', 'tiktok', 'youtube', 'spotify', 'linkedin', 'threads', 'bluesky', 'mastodon');
CREATE TYPE social_post_status_enum AS ENUM ('draft', 'scheduled', 'publishing', 'published', 'failed', 'cancelled');
CREATE TYPE press_outlet_type_enum AS ENUM ('newspaper', 'magazine', 'radio', 'tv', 'online', 'blog', 'podcast', 'other');
CREATE TYPE press_priority_enum AS ENUM ('high', 'medium', 'low');
CREATE TYPE press_response_enum AS ENUM ('interest', 'declined', 'coverage', 'interview_request', 'other');
CREATE TYPE gema_status_enum AS ENUM ('draft', 'ready', 'submitted', 'confirmed', 'needs_correction', 'exempt');
CREATE TYPE budget_type_enum AS ENUM ('event', 'annual', 'project', 'tour');
CREATE TYPE member_role_enum AS ENUM ('admin', 'manager', 'booker', 'venue_operator', 'accountant', 'viewer');
```

---

## 8. Speicherabschaetzung

| Tabelle | Erwartete Datensätze | Größe pro DS | Geschaetzte Groesse |
|---------|----------------------|--------------|----------------------|
| organizations | 1-10 | ~2 KB | < 100 KB |
| users | 5-50 | ~1 KB | < 100 KB |
| organization_members | 5-500 | ~0.5 KB | < 500 KB |
| venues | 10-100 | ~5 KB | < 1 MB |
| venue_rooms | 20-200 | ~1 KB | < 500 KB |
| artists | 50-10.000 | ~5 KB | < 100 MB |
| events | 100-5.000/Jahr | ~3 KB | < 50 MB/Jahr |
| event_artists | 200-20.000/Jahr | ~1 KB | < 40 MB/Jahr |
| newsletter_subscribers | 100-100.000 | ~1 KB | < 200 MB |
| email_campaigns | 10-500/Jahr | ~10 KB | < 10 MB/Jahr |
| campaign_segments | 1.000-50.000.000 | ~0.5 KB | < 50 GB |
| email_tracking | 10.000-500.000.000 | ~0.5 KB | < 500 GB |
| social_posts | 100-10.000/Jahr | ~3 KB | < 50 MB/Jahr |
| media | 1.000-100.000 | ~1 KB (Metadaten) | < 500 MB |
| transactions | 500-50.000/Jahr | ~1 KB | < 100 MB/Jahr |
| gema_registrations | 100-5.000/Jahr | ~1 KB | < 10 MB/Jahr |
| calendar_entries | 500-50.000/Jahr | ~1 KB | < 100 MB/Jahr |
| **Gesamt (Metadaten)** | | | **~1-5 GB Metadaten** |
| **Medien-Storage** | | | **~10-500 GB** |

---

## 9. Zusammenfassung

### Tabellenanzahl: 39 Tabellen

### Kern-Tabellen (Pflicht):
1. `organizations` - Tenant-Root
2. `users` - Benutzer (Auth)
3. `organization_members` - Mitgliedschaften & Rollen
4. `invitations` - Einladungen
5. `venues` - Spielorte
6. `venue_rooms` - Raeume
7. `venue_bookings` - Raum-Buchungen
8. `artists` - Kuenstler
9. `events` - Veranstaltungen
10. `event_artists` - Kuenstler-Event Zuordnung
11. `event_notes` - Event-Notizen
12. `event_checklist` - Event-Checkliste
13. `contracts` - Vertraege

### Kommunikation:
14. `newsletter_subscribers` - Newsletter-Empfaenger
15. `subscriber_tags` - Abonnenten-Tags
16. `email_templates` - E-Mail-Templates
17. `email_campaigns` - Kampagnen
18. `campaign_segments` - Versand-Segmente
19. `email_tracking` - Tracking-Events

### Social Media:
20. `social_media_accounts` - Verbundene Accounts
21. `social_posts` - Posts
22. `social_post_media` - Post-Medien
23. `social_analytics` - Post-Statistiken

### Presse:
24. `press_contacts` - Journalisten
25. `press_releases` - Pressemitteilungen
26. `press_distributions` - Presse-Verteilung

### Medien:
27. `media` - Fotodatenbank
28. `media_collections` - Alben/Sammlungen
29. `collection_items` - Sammlungs-Items
30. `media_tags` - Medien-Tags

### Finanzen:
31. `budgets` - Budgets
32. `budget_items` - Budgetpositionen
33. `transactions` - Transaktionen

### GEMA:
34. `gema_registrations` - GEMA-Meldungen
35. `gema_works` - Gemeldete Werke

### Kalender & Utilities:
36. `calendar_entries` - Kalendereintraege
37. `activity_log` - Aktivitaetsprotokoll
38. `settings` - Anwendungseinstellungen
39. `notification_preferences` - Benachrichtigungseinstellungen

### Beziehungen:
- **1:N** Beziehungen: ~60
- **N:M** Mapping-Tabellen: 4 (event_artists, campaign_segments, collection_items, press_distributions)
- **Self-Referencing**: 1 (social_posts.parent_post_id)

### Security:
- **RLS Policies**: Aktiviert fuer alle 39 Tabellen
- **Multi-Tenant**: organization_id als Tenant-Key
- **Rollen**: 6 Rollen (admin, manager, booker, venue_operator, accountant, viewer)
- **Soft Deletes**: 5 Tabellen (venues, artists, events, media, calendar_entries)

### Performance:
- **Indizes**: ~70+ Indizes erstellt
- **GIN-Indizes**: Fuer Arrays, JSONB, Volltextsuche
- **trgm-Indizes**: Fuer Fuzzy-Search (Kuenslter, Medien)
- **Partial Indizes**: Fuer haeufige Filter (active, subscribed, featured)
- **Views**: 4 Views fuer haeufige Abfragemuster
- **Functions**: 3 Stored Procedures

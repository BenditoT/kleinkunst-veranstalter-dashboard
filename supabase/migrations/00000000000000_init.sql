-- Prepend mock auth schema to mimic Supabase Auth locally
CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  encrypted_password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Organisationen
CREATE TABLE IF NOT EXISTS organizations (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name VARCHAR(255) NOT NULL,
 slug VARCHAR(100) UNIQUE NOT NULL,
 description TEXT,
 logo_url TEXT,
 website VARCHAR(255),
 address VARCHAR(255),
 city VARCHAR(100),
 zip VARCHAR(20),
 country VARCHAR(2) DEFAULT 'DE',
 fiscal_year_start DATE DEFAULT '2026-01-01',
 vat_id VARCHAR(50),
 tax_number VARCHAR(50),
 bank_account_iban VARCHAR(34),
 bank_account_bic VARCHAR(11),
 bank_name VARCHAR(100),
 is_active BOOLEAN DEFAULT true,
 plan_tier VARCHAR(20) DEFAULT 'free' CHECK (plan_tier IN ('free', 'basic', 'pro', 'enterprise')),
 plan_expires_at TIMESTAMPTZ,
 settings JSONB DEFAULT '{}',
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- Users (Erweiterung von auth.users)
CREATE TABLE IF NOT EXISTS users (
 id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 email VARCHAR(255) NOT NULL UNIQUE,
 first_name VARCHAR(100),
 last_name VARCHAR(100),
 avatar_url TEXT,
 phone VARCHAR(50),
 timezone VARCHAR(50) DEFAULT 'Europe/Berlin',
 locale VARCHAR(10) DEFAULT 'de-DE',
 email_notifications BOOLEAN DEFAULT true,
 push_notifications BOOLEAN DEFAULT true,
 theme_preference VARCHAR(10) DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system')),
 onboarding_completed BOOLEAN DEFAULT false,
 last_login_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- Organisation Members (Rollen)
CREATE TABLE IF NOT EXISTS organization_members (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 role VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'manager', 'booker', 'venue_operator', 'accountant', 'member', 'viewer')),
 permissions JSONB DEFAULT '{}',
 is_primary BOOLEAN DEFAULT false,
 invited_by UUID REFERENCES users(id),
 joined_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now(),
 UNIQUE(organization_id, user_id)
);

-- Invitations
CREATE TABLE IF NOT EXISTS invitations (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 email VARCHAR(255) NOT NULL,
 role VARCHAR(20) NOT NULL DEFAULT 'member',
 invited_by UUID NOT NULL REFERENCES users(id),
 token UUID DEFAULT gen_random_uuid(),
 expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '7 days',
 accepted_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ DEFAULT now()
);

-- Spielorte (Venues)
CREATE TABLE IF NOT EXISTS venues (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 name VARCHAR(255) NOT NULL,
 slug VARCHAR(100),
 description TEXT,
 address VARCHAR(255),
 address_extra VARCHAR(255),
 city VARCHAR(100),
 zip VARCHAR(20),
 country VARCHAR(2) DEFAULT 'DE',
 latitude DECIMAL(10,8),
 longitude DECIMAL(11,8),
 capacity INTEGER CHECK (capacity >= 0),
 venue_type VARCHAR(50) CHECK (venue_type IN ('theater', 'club', 'cafe', 'hall', 'outdoor', 'church', 'other')),
 website VARCHAR(255),
 contact_name VARCHAR(255),
 contact_email VARCHAR(255),
 contact_phone VARCHAR(50),
 tech_specs JSONB DEFAULT '{}',
 accessibility_info TEXT,
 parking_info TEXT,
 photo_url TEXT,
 color VARCHAR(7) DEFAULT '#3B82F6',
 notes TEXT,
 is_active BOOLEAN DEFAULT true,
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now(),
 deleted_at TIMESTAMPTZ,
 UNIQUE(organization_id, slug)
);

-- Raeume
CREATE TABLE IF NOT EXISTS venue_rooms (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
 name VARCHAR(255) NOT NULL,
 description TEXT,
 capacity INTEGER CHECK (capacity >= 0),
 has_piano BOOLEAN DEFAULT false,
 has_pa BOOLEAN DEFAULT false,
 has_lighting BOOLEAN DEFAULT false,
 has_projector BOOLEAN DEFAULT false,
 dimensions VARCHAR(50),
 floor_type VARCHAR(50),
 photo_url TEXT,
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- Kuenstler (Artists)
CREATE TABLE IF NOT EXISTS artists (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 first_name VARCHAR(100),
 last_name VARCHAR(100),
 stage_name VARCHAR(255) NOT NULL,
 email VARCHAR(255),
 phone VARCHAR(50),
 address VARCHAR(255),
 city VARCHAR(100),
 zip VARCHAR(20),
 country VARCHAR(2) DEFAULT 'DE',
 bio TEXT,
 website VARCHAR(255),
 social_media JSONB DEFAULT '{}',
 genre VARCHAR(100)[],
 instruments VARCHAR(100)[],
 photo_url TEXT,
 rider TEXT,
 gema_number VARCHAR(50),
 vat_id VARCHAR(50),
 bank_iban VARCHAR(34),
 bank_bic VARCHAR(11),
 bank_account_holder VARCHAR(255),
 default_fee DECIMAL(10,2),
 rating INTEGER CHECK (rating >= 1 AND rating <= 5),
 previous_performances INTEGER DEFAULT 0,
 is_bookable BOOLEAN DEFAULT true,
 is_favorite BOOLEAN DEFAULT false,
 notes TEXT,
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now(),
 deleted_at TIMESTAMPTZ
);

-- Veranstaltungen (Events)
CREATE TABLE IF NOT EXISTS events (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 venue_id UUID REFERENCES venues(id),
 room_id UUID REFERENCES venue_rooms(id),
 title VARCHAR(255) NOT NULL,
 subtitle VARCHAR(255),
 description TEXT,
 event_type VARCHAR(50) DEFAULT 'concert' CHECK (event_type IN ('concert', 'festival', 'tour', 'rehearsal', 'workshop', 'other')),
 status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'planned', 'confirmed', 'published', 'sold_out', 'completed', 'cancelled')),
 date DATE NOT NULL,
 start_time TIME,
 end_time TIME,
 doors_open TIME,
 ticket_price DECIMAL(10,2),
 ticket_presale_price DECIMAL(10,2),
 capacity_planned INTEGER,
 attendees_actual INTEGER,
 revenue_target DECIMAL(12,2),
 revenue_actual DECIMAL(12,2),
 is_public BOOLEAN DEFAULT false,
 slug VARCHAR(255),
 poster_url TEXT,
 fb_event_url TEXT,
 ticketing_url TEXT,
 notes_public TEXT,
 notes_internal TEXT,
 gema_status VARCHAR(20) DEFAULT 'not_required' CHECK (gema_status IN ('not_required', 'pending', 'submitted', 'confirmed', 'problem')),
 gema_submitted_at TIMESTAMPTZ,
 gema_report_reference VARCHAR(50),
 created_by UUID NOT NULL REFERENCES users(id),
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now(),
 deleted_at TIMESTAMPTZ
);

-- Event-Artist Zuordnung (N:M)
CREATE TABLE IF NOT EXISTS event_artists (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
 artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
 order_index INTEGER DEFAULT 0,
 fee DECIMAL(10,2),
 fee_currency VARCHAR(3) DEFAULT 'EUR',
 set_duration INTEGER,
 arrival_time TIME,
 soundcheck_time TIME,
 performance_start TIME,
 accommodation TEXT,
 catering TEXT,
 transport TEXT,
 contract_status VARCHAR(20) DEFAULT 'pending' CHECK (contract_status IN ('pending', 'sent', 'signed', 'cancelled')),
 contract_sent_at TIMESTAMPTZ,
 contract_signed_at TIMESTAMPTZ,
 notes TEXT,
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now(),
 UNIQUE(event_id, artist_id)
);

-- Event Checkliste
CREATE TABLE IF NOT EXISTS event_checklist (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
 item VARCHAR(255) NOT NULL,
 description TEXT,
 category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('general', 'booking', 'marketing', 'tech', 'finance', 'gema', 'catering')),
 is_completed BOOLEAN DEFAULT false,
 completed_at TIMESTAMPTZ,
 completed_by UUID REFERENCES users(id),
 due_date DATE,
 assigned_to UUID REFERENCES users(id),
 order_index INTEGER DEFAULT 0,
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- Vertraege
CREATE TABLE IF NOT EXISTS contracts (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
 artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
 contract_type VARCHAR(20) DEFAULT 'performance' CHECK (contract_type IN ('performance', 'rental', 'sponsorship', 'other')),
 status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'cancelled')),
 fee DECIMAL(10,2),
 fee_currency VARCHAR(3) DEFAULT 'EUR',
 deposit_amount DECIMAL(10,2),
 deposit_paid BOOLEAN DEFAULT false,
 deposit_paid_at TIMESTAMPTZ,
 cancellation_terms TEXT,
 technical_rider TEXT,
 hospitality_rider TEXT,
 contract_text TEXT,
 file_url TEXT,
 signed_file_url TEXT,
 sent_at TIMESTAMPTZ,
 signed_at TIMESTAMPTZ,
 valid_from DATE,
 valid_until DATE,
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- Newsletter Abonnenten
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 email VARCHAR(255) NOT NULL,
 first_name VARCHAR(100),
 last_name VARCHAR(100),
 city VARCHAR(100),
 salutation VARCHAR(20) CHECK (salutation IN ('Herr', 'Frau', 'Divers')),
 subscribed BOOLEAN DEFAULT true,
 subscription_date TIMESTAMPTZ DEFAULT now(),
 subscription_source VARCHAR(50) CHECK (subscription_source IN ('website', 'event', 'import', 'manual', 'widget')),
 double_opt_in BOOLEAN DEFAULT false,
 double_opt_in_at TIMESTAMPTZ,
 interests VARCHAR(50)[],
 language VARCHAR(5) DEFAULT 'de',
 unsubscribed_at TIMESTAMPTZ,
 unsubscribe_reason TEXT,
 bounce_count INTEGER DEFAULT 0,
 is_bounced BOOLEAN DEFAULT false,
 engagement_score DECIMAL(3,2) DEFAULT 0.00,
 metadata JSONB DEFAULT '{}',
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now(),
 UNIQUE(organization_id, email)
);

-- E-Mail Templates
CREATE TABLE IF NOT EXISTS email_templates (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 name VARCHAR(255) NOT NULL,
 description TEXT,
 subject VARCHAR(500) NOT NULL,
 body_html TEXT,
 body_text TEXT,
 variables JSONB DEFAULT '{}',
 category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('general', 'event', 'contract', 'invoice', 'welcome', 'reminder')),
 is_default BOOLEAN DEFAULT false,
 preview_data JSONB DEFAULT '{}',
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- E-Mail Kampagnen
CREATE TABLE IF NOT EXISTS email_campaigns (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 name VARCHAR(255) NOT NULL,
 subject VARCHAR(500) NOT NULL,
 preview_text VARCHAR(255),
 template_id UUID REFERENCES email_templates(id),
 body_html TEXT,
 body_text TEXT,
 sender_name VARCHAR(255),
 sender_email VARCHAR(255),
 reply_to VARCHAR(255),
 status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
 scheduled_at TIMESTAMPTZ,
 sent_at TIMESTAMPTZ,
 completed_at TIMESTAMPTZ,
 total_recipients INTEGER DEFAULT 0,
 total_sent INTEGER DEFAULT 0,
 total_delivered INTEGER DEFAULT 0,
 total_bounced INTEGER DEFAULT 0,
 total_opens INTEGER DEFAULT 0,
 unique_opens INTEGER DEFAULT 0,
 total_clicks INTEGER DEFAULT 0,
 unique_clicks INTEGER DEFAULT 0,
 total_unsubscribes INTEGER DEFAULT 0,
 total_complaints INTEGER DEFAULT 0,
 filter_tags VARCHAR(50)[],
 filter_segment VARCHAR(50),
 ab_test_enabled BOOLEAN DEFAULT false,
 ab_test_subject_b VARCHAR(500),
 created_by UUID NOT NULL REFERENCES users(id),
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- GEMA Registrierungen
CREATE TABLE IF NOT EXISTS gema_registrations (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 submitted_by UUID REFERENCES users(id),
 status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'confirmed', 'problem')),
 submitted_at TIMESTAMPTZ,
 confirmed_at TIMESTAMPTZ,
 report_reference VARCHAR(50),
 total_duration INTEGER,
 estimated_fee DECIMAL(10,2),
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- GEMA Werke (Setlist)
CREATE TABLE IF NOT EXISTS gema_works (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 registration_id UUID NOT NULL REFERENCES gema_registrations(id) ON DELETE CASCADE,
 title VARCHAR(255) NOT NULL,
 composer VARCHAR(255),
 lyricist VARCHAR(255),
 publisher VARCHAR(255),
 duration INTEGER,
 is_authorized BOOLEAN DEFAULT false,
 created_at TIMESTAMPTZ DEFAULT now()
);

-- Budgets
CREATE TABLE IF NOT EXISTS budgets (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 event_id UUID REFERENCES events(id),
 name VARCHAR(255) NOT NULL,
 total_budget DECIMAL(12,2),
 currency VARCHAR(3) DEFAULT 'EUR',
 fiscal_year INTEGER,
 status VARCHAR(20) DEFAULT 'active',
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- Budget-Positionen
CREATE TABLE IF NOT EXISTS budget_items (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
 category VARCHAR(100) NOT NULL,
 item_name VARCHAR(255) NOT NULL,
 planned_amount DECIMAL(10,2),
 actual_amount DECIMAL(10,2),
 notes TEXT,
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- Finanztransaktionen
CREATE TABLE IF NOT EXISTS transactions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 event_id UUID REFERENCES events(id),
 budget_item_id UUID REFERENCES budget_items(id),
 transaction_type VARCHAR(50) NOT NULL,
 category VARCHAR(100) NOT NULL,
 description TEXT,
 amount DECIMAL(10,2) NOT NULL,
 currency VARCHAR(3) DEFAULT 'EUR',
 transaction_date DATE NOT NULL,
 payment_method VARCHAR(50),
 is_tax_relevant BOOLEAN DEFAULT true,
 receipt_url TEXT,
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- Social Media Accounts
CREATE TABLE IF NOT EXISTS social_media_accounts (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 platform VARCHAR(20) NOT NULL CHECK (platform IN ('facebook', 'instagram', 'twitter', 'tiktok', 'youtube', 'spotify', 'linkedin', 'threads', 'bluesky', 'mastodon')),
 account_name VARCHAR(255),
 account_handle VARCHAR(100),
 account_url TEXT,
 profile_image_url TEXT,
 access_token TEXT,
 refresh_token TEXT,
 token_expires_at TIMESTAMPTZ,
 scope TEXT,
 follower_count INTEGER,
 is_active BOOLEAN DEFAULT true,
 auto_post BOOLEAN DEFAULT false,
 post_defaults JSONB DEFAULT '{}',
 last_synced_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- Social Posts
CREATE TABLE IF NOT EXISTS social_posts (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 account_id UUID NOT NULL REFERENCES social_media_accounts(id) ON DELETE CASCADE,
 event_id UUID REFERENCES events(id),
 content TEXT NOT NULL,
 media_urls TEXT[],
 post_type VARCHAR(20) DEFAULT 'text' CHECK (post_type IN ('text', 'image', 'video', 'carousel', 'reel', 'story')),
 status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'publishing', 'published', 'failed', 'cancelled')),
 scheduled_at TIMESTAMPTZ,
 published_at TIMESTAMPTZ,
 platform_post_id VARCHAR(255),
 platform_post_url TEXT,
 likes_count INTEGER DEFAULT 0,
 comments_count INTEGER DEFAULT 0,
 shares_count INTEGER DEFAULT 0,
 reach_count INTEGER DEFAULT 0,
 impressions_count INTEGER DEFAULT 0,
 engagement_rate DECIMAL(5,4),
 error_message TEXT,
 created_by UUID NOT NULL REFERENCES users(id),
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pressekontakte
CREATE TABLE IF NOT EXISTS press_contacts (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 outlet_name VARCHAR(255),
 contact_name VARCHAR(255),
 email VARCHAR(255),
 phone VARCHAR(50),
 media_type VARCHAR(50) CHECK (media_type IN ('newspaper', 'magazine', 'radio', 'tv', 'online', 'blog', 'podcast', 'agency')),
 beats TEXT[],
 priority VARCHAR(20) DEFAULT 'medium',
 notes TEXT,
 is_active BOOLEAN DEFAULT true,
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pressemitteilungen
CREATE TABLE IF NOT EXISTS press_releases (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 event_id UUID REFERENCES events(id),
 title VARCHAR(255) NOT NULL,
 subtitle VARCHAR(255),
 lead TEXT,
 body_html TEXT,
 body_text TEXT,
 boilerplate TEXT,
 contact_info TEXT,
 language VARCHAR(5) DEFAULT 'de',
 status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'embargo', 'cancelled')),
 embargo_until TIMESTAMPTZ,
 scheduled_at TIMESTAMPTZ,
 sent_at TIMESTAMPTZ,
 slug VARCHAR(200),
 is_public BOOLEAN DEFAULT false,
 public_url TEXT,
 created_by UUID NOT NULL REFERENCES users(id),
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- Media (Dateien)
CREATE TABLE IF NOT EXISTS media (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 filename VARCHAR(255) NOT NULL,
 original_name VARCHAR(255) NOT NULL,
 file_url TEXT NOT NULL,
 thumbnail_url TEXT,
 file_type VARCHAR(50) NOT NULL,
 mime_type VARCHAR(100) NOT NULL,
 file_size BIGINT NOT NULL,
 width INTEGER,
 height INTEGER,
 duration INTEGER,
 description TEXT,
 photographer VARCHAR(255),
 taken_at TIMESTAMPTZ,
 event_id UUID REFERENCES events(id),
 artist_id UUID REFERENCES artists(id),
 venue_id UUID REFERENCES venues(id),
 is_public BOOLEAN DEFAULT false,
 tags TEXT[],
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ticket-Typen
CREATE TABLE IF NOT EXISTS ticket_types (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
 name VARCHAR(100) NOT NULL,
 description TEXT,
 category VARCHAR(20) NOT NULL CHECK (category IN ('vvk', 'ak', 'discount', 'pwyw', 'free', 'staff', 'vip')),
 price_cents INTEGER NOT NULL DEFAULT 0,
 pwyw_min_cents INTEGER,
 pwyw_suggested_cents INTEGER,
 quantity_total INTEGER NOT NULL DEFAULT 0,
 quantity_sold INTEGER NOT NULL DEFAULT 0,
 quantity_reserved INTEGER NOT NULL DEFAULT 0,
 sale_start TIMESTAMPTZ,
 sale_end TIMESTAMPTZ,
 is_active BOOLEAN DEFAULT true,
 sort_order INTEGER DEFAULT 0,
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tickets
CREATE TABLE IF NOT EXISTS tickets (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 ticket_type_id UUID NOT NULL REFERENCES ticket_types(id),
 event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
 ticket_number VARCHAR(50) NOT NULL UNIQUE,
 qr_code_hash VARCHAR(255) NOT NULL UNIQUE,
 status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'used', 'refunded', 'expired', 'cancelled')),
 holder_name VARCHAR(200),
 holder_email VARCHAR(255),
 holder_phone VARCHAR(50),
 price_paid_cents INTEGER NOT NULL,
 sale_channel VARCHAR(20) DEFAULT 'online' CHECK (sale_channel IN ('online', 'box_office', 'phone', 'api', 'comp')),
 checked_in_at TIMESTAMPTZ,
 checked_in_by UUID REFERENCES users(id),
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reservierungen
CREATE TABLE IF NOT EXISTS reservations (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
 ticket_type_id UUID REFERENCES ticket_types(id),
 contact_name VARCHAR(200) NOT NULL,
 contact_email VARCHAR(255),
 contact_phone VARCHAR(50),
 quantity INTEGER NOT NULL CHECK (quantity > 0),
 status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'expired', 'picked_up')),
 expires_at TIMESTAMPTZ NOT NULL,
 auto_cancel_hours INTEGER DEFAULT 2,
 notes TEXT,
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- Check-ins
CREATE TABLE IF NOT EXISTS check_ins (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 ticket_id UUID NOT NULL REFERENCES tickets(id),
 event_id UUID NOT NULL REFERENCES events(id),
 scan_type VARCHAR(20) DEFAULT 'qr_scan' CHECK (scan_type IN ('qr_scan', 'manual', 'nfc', 'list_check')),
 scan_result VARCHAR(20) NOT NULL CHECK (scan_result IN ('success', 'already_used', 'invalid', 'error')),
 scanned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 scanned_by UUID REFERENCES users(id),
 device_id VARCHAR(100),
 device_name VARCHAR(100),
 offline_synced BOOLEAN DEFAULT false,
 notes TEXT,
 created_at TIMESTAMPTZ DEFAULT now()
);

-- Kalender-Eintraege
CREATE TABLE IF NOT EXISTS calendar_entries (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 user_id UUID REFERENCES users(id),
 event_id UUID REFERENCES events(id),
 title VARCHAR(255) NOT NULL,
 description TEXT,
 entry_type VARCHAR(50) DEFAULT 'event' CHECK (entry_type IN ('event', 'reminder', 'block', 'note')),
 start_date TIMESTAMPTZ NOT NULL,
 end_date TIMESTAMPTZ,
 all_day BOOLEAN DEFAULT false,
 recurrence_rule TEXT,
 reminder_minutes INTEGER,
 color VARCHAR(7) DEFAULT '#3B82F6',
 is_private BOOLEAN DEFAULT false,
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- Einstellungen
CREATE TABLE IF NOT EXISTS settings (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 key VARCHAR(100) NOT NULL,
 value JSONB DEFAULT '{}',
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now(),
 UNIQUE(organization_id, key)
);

-- Aktivitaetslog
CREATE TABLE IF NOT EXISTS activity_log (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 user_id UUID REFERENCES users(id),
 entity_type VARCHAR(50) NOT NULL,
 entity_id UUID,
 action VARCHAR(50) NOT NULL,
 details JSONB DEFAULT '{}',
 created_at TIMESTAMPTZ DEFAULT now()
);

-- AI Provider
CREATE TABLE IF NOT EXISTS ai_providers (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 name VARCHAR(50) NOT NULL,
 provider_type VARCHAR(20) NOT NULL CHECK (provider_type IN ('openai', 'ollama', 'lmstudio', 'custom')),
 api_base_url VARCHAR(255),
 api_key_encrypted TEXT,
 model_name VARCHAR(100),
 is_active BOOLEAN DEFAULT true,
 is_local BOOLEAN DEFAULT false,
 cost_per_1k_input_tokens DECIMAL(10,6),
 cost_per_1k_output_tokens DECIMAL(10,6),
 cost_per_image DECIMAL(10,6),
 max_tokens INTEGER,
 supports_images BOOLEAN DEFAULT false,
 supports_streaming BOOLEAN DEFAULT false,
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);

-- AI Generierungen
CREATE TABLE IF NOT EXISTS ai_generations (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 generation_type VARCHAR(20) NOT NULL CHECK (generation_type IN ('text', 'image', 'translation')),
 use_case VARCHAR(50) NOT NULL,
 platform VARCHAR(50),
 provider_id UUID REFERENCES ai_providers(id),
 template_id UUID,
 input_data JSONB DEFAULT '{}',
 input_tokens INTEGER,
 output_text TEXT,
 output_image_url VARCHAR(500),
 output_metadata JSONB DEFAULT '{}',
 output_tokens INTEGER,
 temperature_used DECIMAL(3,2),
 language_source VARCHAR(10),
 language_target VARCHAR(10),
 cost_eur DECIMAL(10,6),
 generation_time_ms INTEGER,
 status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'streaming', 'completed', 'failed', 'cancelled')),
 error_message TEXT,
 event_id UUID REFERENCES events(id),
 user_id UUID REFERENCES users(id),
 organization_id UUID NOT NULL REFERENCES organizations(id),
 created_at TIMESTAMPTZ DEFAULT now()
);

-- Consents (DSGVO)
CREATE TABLE IF NOT EXISTS consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES newsletter_subscribers(id),
  consent_type VARCHAR(50) NOT NULL CHECK (consent_type IN ('newsletter', 'tracking', 'ai_processing', 'marketing', 'data_sharing')),
  granted BOOLEAN NOT NULL,
  granted_at TIMESTAMPTZ,
  granted_via VARCHAR(50),
  ip_address_hash VARCHAR(64),
  user_agent_hash VARCHAR(64),
  consent_version VARCHAR(20),
  consent_text_digest VARCHAR(64),
  withdrawn_at TIMESTAMPTZ,
  withdrawn_via VARCHAR(50),
  legal_basis VARCHAR(50) DEFAULT 'consent',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Loeschanfragen (DSGVO)
CREATE TABLE IF NOT EXISTS deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  requested_at TIMESTAMPTZ DEFAULT now(),
  requested_via VARCHAR(50),
  scheduled_deletion_at TIMESTAMPTZ DEFAULT now() + interval '30 days',
  completed_at TIMESTAMPTZ,
  cancellation_token UUID DEFAULT gen_random_uuid(),
  deleted_records_count JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Dashboard Layouts
CREATE TABLE IF NOT EXISTS user_dashboard_layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  layout_name VARCHAR(100) DEFAULT 'Standard',
  is_default BOOLEAN DEFAULT true,
  widgets JSONB DEFAULT '[]',
  theme_preference VARCHAR(10) DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Benachrichtigungen
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('event', 'finance', 'system', 'ai_recommendation', 'reminder')),
  title VARCHAR(255) NOT NULL,
  message TEXT,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  is_read BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  action_url VARCHAR(500),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  read_at TIMESTAMPTZ
);

-- RLS ACTIVATION & HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION get_current_org_id()
RETURNS UUID AS $$
BEGIN
  RETURN NULLIF(current_setting('app.current_org_id', TRUE), '')::UUID;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE gema_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gema_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Isolation Policies
CREATE POLICY "events_org_isolation" ON events FOR ALL USING (organization_id = get_current_org_id());
CREATE POLICY "venues_org_isolation" ON venues FOR ALL USING (organization_id = get_current_org_id());
CREATE POLICY "artists_org_isolation" ON artists FOR ALL USING (organization_id = get_current_org_id());
CREATE POLICY "subscribers_org_isolation" ON newsletter_subscribers FOR ALL USING (organization_id = get_current_org_id());
CREATE POLICY "campaigns_org_isolation" ON email_campaigns FOR ALL USING (organization_id = get_current_org_id());
CREATE POLICY "gema_org_isolation" ON gema_registrations FOR ALL USING (organization_id = get_current_org_id());
CREATE POLICY "social_accounts_org" ON social_media_accounts FOR ALL USING (organization_id = get_current_org_id());
CREATE POLICY "social_posts_org" ON social_posts FOR ALL USING (organization_id = get_current_org_id());
CREATE POLICY "press_contacts_org" ON press_contacts FOR ALL USING (organization_id = get_current_org_id());
CREATE POLICY "press_releases_org" ON press_releases FOR ALL USING (organization_id = get_current_org_id());

CREATE POLICY "tickets_event_isolation" ON tickets FOR ALL USING (
  event_id IN (SELECT id FROM events WHERE organization_id = get_current_org_id())
);

CREATE POLICY "check_ins_event_isolation" ON check_ins FOR ALL USING (
  event_id IN (SELECT id FROM events WHERE organization_id = get_current_org_id())
);

CREATE POLICY "ai_providers_org" ON ai_providers FOR ALL USING (organization_id = get_current_org_id());
CREATE POLICY "ai_generations_org" ON ai_generations FOR ALL USING (organization_id = get_current_org_id());
CREATE POLICY "notifications_user" ON notifications FOR ALL USING (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_org_date ON events(organization_id, date);
CREATE INDEX IF NOT EXISTS idx_events_venue ON events(venue_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_events_gema ON events(organization_id, gema_status);
CREATE INDEX IF NOT EXISTS idx_events_search ON events USING gin(to_tsvector('german', title || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_artists_org ON artists(organization_id);
CREATE INDEX IF NOT EXISTS idx_artists_stage ON artists(organization_id, stage_name);
CREATE INDEX IF NOT EXISTS idx_artists_genre ON artists USING GIN(genre);
CREATE INDEX IF NOT EXISTS idx_campaigns_org ON email_campaigns(organization_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON email_campaigns(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_tickets_event ON tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_qr ON tickets(qr_code_hash);
CREATE INDEX IF NOT EXISTS idx_checkins_ticket ON check_ins(ticket_id);
CREATE INDEX IF NOT EXISTS idx_activity_org ON activity_log(organization_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_subscribers_org ON newsletter_subscribers(organization_id, email);

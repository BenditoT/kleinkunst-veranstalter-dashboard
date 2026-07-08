-- Provider-neutral PostgreSQL schema for Google Cloud SQL.
-- Supabase can consume the same model later, but this migration avoids
-- provider-specific auth helper functions
-- and instead relies on a transaction-scoped organization context:
--   SET LOCAL app.current_org_id = '<organization-uuid>';

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  website TEXT,
  city TEXT,
  country CHAR(2) NOT NULL DEFAULT 'DE',
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_auth_id TEXT UNIQUE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  timezone TEXT NOT NULL DEFAULT 'Europe/Berlin',
  locale TEXT NOT NULL DEFAULT 'de-DE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member'
    CHECK (role IN ('owner', 'admin', 'manager', 'booker', 'venue_operator', 'accountant', 'member', 'viewer')),
  permissions JSONB NOT NULL DEFAULT '{}',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  capacity INTEGER CHECK (capacity >= 0),
  venue_type TEXT NOT NULL DEFAULT 'theater'
    CHECK (venue_type IN ('theater', 'club', 'cafe', 'hall', 'outdoor', 'church', 'other')),
  color CHAR(7) NOT NULL DEFAULT '#14b8a6',
  tech_specs JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE (organization_id, slug)
);

CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  genre TEXT[] NOT NULL DEFAULT '{}',
  instruments TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  rider TEXT,
  gema_number TEXT,
  default_fee NUMERIC(10, 2),
  is_bookable BOOLEAN NOT NULL DEFAULT true,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'concert'
    CHECK (event_type IN ('concert', 'festival', 'tour', 'rehearsal', 'workshop', 'other')),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'planned', 'confirmed', 'published', 'sold_out', 'completed', 'cancelled')),
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  doors_open TIME,
  ticket_price NUMERIC(10, 2),
  capacity_planned INTEGER,
  sold_tickets INTEGER NOT NULL DEFAULT 0 CHECK (sold_tickets >= 0),
  revenue_target NUMERIC(12, 2),
  revenue_actual NUMERIC(12, 2),
  is_public BOOLEAN NOT NULL DEFAULT false,
  slug TEXT NOT NULL,
  poster_url TEXT,
  ticketing_url TEXT,
  notes_public TEXT,
  notes_internal TEXT,
  gema_status TEXT NOT NULL DEFAULT 'not_required'
    CHECK (gema_status IN ('not_required', 'pending', 'submitted', 'confirmed', 'problem')),
  gema_due_date DATE,
  created_by UUID REFERENCES app_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE (organization_id, slug)
);

CREATE TABLE IF NOT EXISTS event_artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  fee NUMERIC(10, 2),
  contract_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (contract_status IN ('pending', 'sent', 'signed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, artist_id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general'
    CHECK (category IN ('general', 'booking', 'marketing', 'tech', 'finance', 'gema', 'catering')),
  due_date DATE,
  assigned_to UUID REFERENCES app_users(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_org_date ON events (organization_id, date);
CREATE INDEX IF NOT EXISTS idx_events_org_status ON events (organization_id, status);
CREATE INDEX IF NOT EXISTS idx_venues_org_active ON venues (organization_id, is_active);
CREATE INDEX IF NOT EXISTS idx_artists_org_bookable ON artists (organization_id, is_bookable);
CREATE INDEX IF NOT EXISTS idx_tasks_org_due_date ON tasks (organization_id, due_date);

ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY venues_org_scope ON venues
  USING (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY artists_org_scope ON artists
  USING (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY events_org_scope ON events
  USING (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY event_artists_org_scope ON event_artists
  USING (
    EXISTS (
      SELECT 1
      FROM events
      WHERE events.id = event_artists.event_id
        AND events.organization_id = current_setting('app.current_org_id', true)::uuid
    )
  );

CREATE POLICY tasks_org_scope ON tasks
  USING (organization_id = current_setting('app.current_org_id', true)::uuid);

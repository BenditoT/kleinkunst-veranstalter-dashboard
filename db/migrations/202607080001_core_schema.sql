-- =====================================================================
-- KANONISCHES SCHEMA (Entscheidung O1, 31.07.2026)
-- =====================================================================
-- Diese Datei ist die EINZIGE Wahrheit für das Datenmodell.
-- `supabase/archive/00000000000000_init.sql` ist ein archivierter
-- Feature-Entwurf und wird NICHT ausgeführt (siehe
-- docs/architecture/backend-provider.md).
--
-- Provider-neutrales PostgreSQL-Schema (Cloud SQL, Supabase, Neon,
-- self-hosted Postgres). Bewusst OHNE provider-spezifische Auth-Helfer
-- aus einem Supabase-eigenen Schema (Funktionen und Tabellen des dortigen
-- Auth-Namensraums); der Mandantenkontext kommt
-- transaktionsgebunden aus der Session:
--   SET LOCAL app.current_org_id = '<organization-uuid>';
-- Gesetzt wird der Wert ausschließlich serverseitig aus der
-- Auth-Session (siehe docs/architecture/auth-port.md), NIE aus
-- Formdaten oder Query-Parametern.
--
-- Änderungsregel: Solange kein produktiver Import stattgefunden hat
-- (Stand 31.07.2026: kein Backend angebunden), wird diese Datei
-- korrigiert statt Korrekturen nachzuziehen. Ab dem ersten produktiven
-- `gcloud sql import sql` gilt append-only: neue Datei
-- `db/migrations/<timestamp>_<name>.sql`.
--
-- Die Datei ist vollständig re-run-fest (idempotent).
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------
-- Tabellen
-- ---------------------------------------------------------------------

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

-- Rollenmodell = die 5 Rollen aus docs/sprints/README.md (Sprint 2).
-- Frühere Rollen `booker`, `venue_operator`, `accountant` sind entfallen
-- (O1); die Abbildung auf das neue Modell steht weiter unten.
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member'
    CONSTRAINT organization_members_role_check
    CHECK (role IN ('owner', 'admin', 'manager', 'member', 'viewer')),
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

-- ---------------------------------------------------------------------
-- Rollenmodell auf 5 Rollen konsolidieren (O1) — re-run-fest
-- ---------------------------------------------------------------------
-- Abbildung der entfallenen Rollen (fachliche Begründung im ADR):
--   booker         -> manager  (darf Events/Verträge bearbeiten)
--   accountant     -> manager  (darf Finanzdaten bearbeiten)
--   venue_operator -> member   (arbeitet mit, verwaltet aber nicht)
-- Reihenfolge ist wichtig: erst Daten migrieren, dann Constraint setzen.
ALTER TABLE organization_members
  DROP CONSTRAINT IF EXISTS organization_members_role_check;

UPDATE organization_members SET role = 'manager' WHERE role IN ('booker', 'accountant');
UPDATE organization_members SET role = 'member' WHERE role = 'venue_operator';

ALTER TABLE organization_members
  ADD CONSTRAINT organization_members_role_check
  CHECK (role IN ('owner', 'admin', 'manager', 'member', 'viewer'));

-- ---------------------------------------------------------------------
-- Indizes
-- ---------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_events_org_date ON events (organization_id, date);
CREATE INDEX IF NOT EXISTS idx_events_org_status ON events (organization_id, status);
CREATE INDEX IF NOT EXISTS idx_venues_org_active ON venues (organization_id, is_active);
CREATE INDEX IF NOT EXISTS idx_artists_org_bookable ON artists (organization_id, is_bookable);
CREATE INDEX IF NOT EXISTS idx_tasks_org_due_date ON tasks (organization_id, due_date);
CREATE INDEX IF NOT EXISTS idx_members_org_user ON organization_members (organization_id, user_id);

-- =====================================================================
-- ROW LEVEL SECURITY (Härtung O2, 31.07.2026)
-- =====================================================================
-- Drei Lücken des Ursprungsstands sind hier geschlossen:
--
--   1. Policies hatten nur USING(...) ohne WITH CHECK(...). Bei FOR ALL
--      prüft USING nur die SICHTBARKEIT bestehender Zeilen — INSERT und
--      UPDATE konnten Zeilen mit FREMDER organization_id schreiben.
--   2. FORCE ROW LEVEL SECURITY fehlte. Das Provisionierungsskript legt
--      Schema und App-User in einem Zug an, die App verbindet sich also
--      als Tabellen-Owner — und für den Owner ist RLS ohne FORCE
--      wirkungslos. Die Mandantengrenze war damit real nicht vorhanden.
--   3. CREATE POLICY ist nicht idempotent; ein zweiter Lauf der sonst
--      re-run-festen Migration brach ab (42710 duplicate_object).
--
-- NEGATIV-BEWEIS (vorher/nachher, App-Rolle mit gesetztem Org-Kontext):
--
--   SET LOCAL app.current_org_id = '11111111-1111-1111-1111-111111111111';
--
--   -- (a) Zeile in FREMDE Organisation schreiben
--   INSERT INTO events (organization_id, title, date, slug)
--   VALUES ('22222222-2222-2222-2222-222222222222',
--           'Fremd-Event', DATE '2026-08-01', '2026-08-01-fremd-event');
--   -- vorher: INSERT 0 1      (Zeile landet in Organisation 2222…)
--   -- jetzt:  ERROR: new row violates row-level security policy for table "events"
--
--   -- (b) Eigene Zeile in eine fremde Organisation verschieben
--   UPDATE events
--      SET organization_id = '22222222-2222-2222-2222-222222222222'
--    WHERE organization_id = '11111111-1111-1111-1111-111111111111';
--   -- vorher: UPDATE n        (Datenabfluss per UPDATE)
--   -- jetzt:  ERROR: new row violates row-level security policy for table "events"
--
--   -- (c) Als Tabellen-Owner (= der App-User aus provision-and-deploy.sh)
--   SELECT count(*) FROM events;
--   -- vorher: alle Zeilen ALLER Organisationen (RLS für Owner inaktiv)
--   -- jetzt:  nur Zeilen der gesetzten app.current_org_id
--
--   -- (d) Ohne gesetzten Kontext
--   RESET app.current_org_id; SELECT count(*) FROM events;
--   -- vorher wie jetzt: 0 Zeilen (current_setting(..., true) -> NULL,
--   --                   NULL-Vergleich ist nie wahr = fail-closed)
--
-- BOOTSTRAP-HINWEIS: FORCE RLS gilt auch für den Tabellen-Owner. Anlegen
-- von Organisationen und app_users (Registrierung, Seeds, Migrationen)
-- läuft deshalb NICHT über die App-Rolle, sondern über eine getrennte
-- Rolle mit BYPASSRLS (z. B. `kleinkunst_migrator`) oder über
-- SECURITY-DEFINER-Funktionen. Siehe docs/deployment/google-cloud-sql.md.
-- ---------------------------------------------------------------------

ALTER TABLE organizations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations        FORCE  ROW LEVEL SECURITY;
ALTER TABLE app_users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_users            FORCE  ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members FORCE  ROW LEVEL SECURITY;
ALTER TABLE venues               ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues               FORCE  ROW LEVEL SECURITY;
ALTER TABLE artists              ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists              FORCE  ROW LEVEL SECURITY;
ALTER TABLE events               ENABLE ROW LEVEL SECURITY;
ALTER TABLE events               FORCE  ROW LEVEL SECURITY;
ALTER TABLE event_artists        ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_artists        FORCE  ROW LEVEL SECURITY;
ALTER TABLE tasks                ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks                FORCE  ROW LEVEL SECURITY;

-- Nur die eigene Organisation ist sichtbar. Anlegen/Löschen von
-- Organisationen ist der Bootstrap-Rolle vorbehalten (keine
-- INSERT/DELETE-Policy für die App-Rolle = fail-closed).
DROP POLICY IF EXISTS organizations_self_scope ON organizations;
CREATE POLICY organizations_self_scope ON organizations
  FOR SELECT
  USING (id = current_setting('app.current_org_id', true)::uuid);

-- Personendaten: sichtbar nur, wenn die Person Mitglied der aktuellen
-- Organisation ist. Anlegen/Ändern von app_users läuft über die
-- Bootstrap-Rolle bzw. den Auth-Provider-Sync (Sprint 2).
DROP POLICY IF EXISTS app_users_org_scope ON app_users;
CREATE POLICY app_users_org_scope ON app_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM organization_members
      WHERE organization_members.user_id = app_users.id
        AND organization_members.organization_id
            = current_setting('app.current_org_id', true)::uuid
    )
  );

DROP POLICY IF EXISTS organization_members_org_scope ON organization_members;
CREATE POLICY organization_members_org_scope ON organization_members
  FOR ALL
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

DROP POLICY IF EXISTS venues_org_scope ON venues;
CREATE POLICY venues_org_scope ON venues
  FOR ALL
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

DROP POLICY IF EXISTS artists_org_scope ON artists;
CREATE POLICY artists_org_scope ON artists
  FOR ALL
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

DROP POLICY IF EXISTS events_org_scope ON events;
CREATE POLICY events_org_scope ON events
  FOR ALL
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

-- event_artists trägt selbst keine organization_id; die Mandantengrenze
-- kommt über das Event. WITH CHECK verhindert, dass eine Verknüpfung auf
-- ein fremdes Event geschrieben wird.
DROP POLICY IF EXISTS event_artists_org_scope ON event_artists;
CREATE POLICY event_artists_org_scope ON event_artists
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM events
      WHERE events.id = event_artists.event_id
        AND events.organization_id = current_setting('app.current_org_id', true)::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM events
      WHERE events.id = event_artists.event_id
        AND events.organization_id = current_setting('app.current_org_id', true)::uuid
    )
    AND EXISTS (
      SELECT 1
      FROM artists
      WHERE artists.id = event_artists.artist_id
        AND artists.organization_id = current_setting('app.current_org_id', true)::uuid
    )
  );

DROP POLICY IF EXISTS tasks_org_scope ON tasks;
CREATE POLICY tasks_org_scope ON tasks
  FOR ALL
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

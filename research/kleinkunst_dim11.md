# Dimension 11: Technische Architektur, APIs & Deployment

## Kleinkunst-Veranstalter Dashboard-App — v1.0 Spezifikation

**Version:** 1.0
**Datum:** Juli 2026
**Autor:** Software-Architektur & DevOps
**Status:** Entwurf

---

## Inhaltsverzeichnis

1. [Executive Summary](#1-executive-summary)
2. [Tech-Stack mit Begründung](#2-tech-stack-mit-begruendung)
3. [Frontend-Architektur](#3-frontend-architektur)
4. [Backend-Architektur](#4-backend-architektur)
5. [Datenbank-Architektur](#5-datenbank-architektur)
6. [Authentifizierung & Autorisierung](#6-authentifizierung--autorisierung)
7. [File Storage](#7-file-storage)
8. [Task Queue & Background Jobs](#8-task-queue--background-jobs)
9. [Caching-Strategie](#9-caching-strategie)
10. [State Management](#10-state-management)
11. [API-Design](#11-api-design)
12. [Authentication Middleware](#12-authentication-middleware)
13. [Rate Limiting](#13-rate-limiting)
14. [Error Handling](#14-error-handling)
15. [API-Dokumentation](#15-api-dokumentation)
16. [Deployment-Strategie](#16-deployment-strategie)
17. [CI/CD Pipeline](#17-cicd-pipeline)
18. [Backup-Strategie](#18-backup-strategie)
19. [Security](#19-security)
20. [Monitoring & Logging](#20-monitoring--logging)
21. [User Stories](#21-user-stories)
22. [Datenmodell](#22-datenmodell)
23. [UI-Komponenten](#23-ui-komponenten)
24. [Integrationen](#24-integrationen)
25. [Technische Details](#25-technische-details)
26. [Akzeptanzkriterien](#26-akzeptanzkriterien)

---

## 1. Executive Summary

Die technische Architektur der Kleinkunst-Dashboard-App basiert auf einem modernen, cloud-nativen Stack mit maximaler Entwickler-Produktivität und DSGVO-Konformität. Die Kernentscheidung ist ein **Monolith mit modularem Aufbau** — ein Next.js 14+ Full-Stack-Application, das Frontend, Backend API und Server-Rendering in einer Codebase vereint. Dies minimiert die Komplexität fuer ein kleines Entwicklerteam, ermoeglicht aber spätere Extraktion von Microservices.

**Kernarchitekturentscheidungen:**
- **Next.js 14+ (App Router)** — Full-Stack-Framework mit SSR, API Routes, Server Actions
- **Supabase (PostgreSQL)** — DSGVO-konforme DE-Server, Auth, Realtime, Storage in einem Service
- **tRPC + REST** — tRPC fuer interne API-Kommunikation, REST fuer externe Integrationspartner
- **Self-Hosted auf Hetzner** — Vollstaendige Datenhoheit, DSGVO-Konformitaet, kostenguenstig
- **TypeScript durchgaengig** — End-to-end Type-Safety von Datenbank bis UI

---

## 2. Tech-Stack mit Begruendung

### 2.1 Gesamtuebersicht

| Schicht | Technologie | Alternative | Entscheidung |
|---------|-------------|-------------|--------------|
| **Framework** | Next.js 14+ (App Router) | Nuxt, SvelteKit | Next.js — groesstes Oekosystem, Vercel-Hintergrund, RSC |
| **Sprache** | TypeScript 5.3+ | JavaScript | Pflicht fuer Type-Safety und DX |
| **Styling** | Tailwind CSS 3.4+ | CSS Modules, Styled Components | Utility-First, schnelle Prototypisierung, konsistent |
| **UI-Komponenten** | shadcn/ui + Radix UI | Material UI, Chakra UI | Kopierbar, anpassbar, keine Lock-in, Tailwind-native |
| **Datenbank** | PostgreSQL 15+ (Supabase) | MySQL, MongoDB | PostgreSQL = Goldstandard; Supabase = DSGVO + Auth + Realtime |
| **Auth** | Supabase Auth | Clerk, Auth0 | Integriert, kostenlos, DSGVO-konform, deutsche Server |
| **API (intern)** | tRPC 11+ | GraphQL, REST | End-to-end Type-Safety, automatische Typinferenz |
| **API (extern)** | REST (OpenAPI) | GraphQL | REST = einfacher fuer externe Integrationen |
| **State Management** | Zustand + TanStack Query | Redux, Apollo | Minimal, fuer Client-State; Server-State via Query |
| **Task Queue** | BullMQ + Redis | Bee Queue, Agenda | BullMQ = Redis-basiert, robust, mit Dashboard |
| **File Storage** | Supabase Storage | Cloudflare R2, S3 | Integriert in Supabase, DSGVO-konform |
| **Hosting** | Hetzner Cloud + Coolify | Vercel, AWS | Self-Hosting = DSGVO + Kostenkontrolle |
| **Container** | Docker + Docker Compose | Kubernetes | Docker Compose fuer Monolith ausreichend |
| **CI/CD** | GitHub Actions | GitLab CI, Jenkins | Nahtlose GitHub-Integration, kostenlos fuer OSS |
| **Monitoring** | Sentry + Uptime Kuma | Datadog, New Relic | Sentry = Fehler-Tracking; Uptime Kuma = Self-Hosted |
| **Logging** | Grafana Loki + Promtail | ELK Stack, Datadog | CloudNative, effizient, Self-Hosted |
| **Reverse Proxy** | Traefik 3+ | Nginx, Caddy | Automatische Let's Encrypt, Docker-Integration |

### 2.2 Begruendung jeder Entscheidung

#### Next.js 14+ mit App Router

**Warum Next.js:**
- **Server Components (RSC):** Datenbankabfragen direkt im Komponenten-Render, keine API-Layer fuer interne Calls
- **Streaming:** Progressive Rendering, schnelle Time-to-First-Byte
- **API Routes + Server Actions:** Backend-Logik in derselben Codebase
- **File-based Routing:** Intuitive Route-Definition im App Router
- **Oekosystem:** Groesste React-Community, tausende Libraries, staendige Weiterentwicklung

**App Router vs. Pages Router:**
- App Router = Zukunft von Next.js, Server Components, verschachtelte Layouts, Route Groups
- Pages Router = Legacy, nur Client Components
- **Entscheidung:** App Router fuer alle neuen Features

#### TypeScript 5.3+

**Warum TypeScript:**
- **End-to-end Type-Safety:** Von Datenbankschema (via tRPC/Supabase) bis zur UI
- **Refactoring-Sicherheit:** Umbenennungen und Strukturaenderungen ohne Fear
- **IDE-Autovervollstaendigung:** IntelliSense fuer alle Datenbankfelder und API-Endpunkte
- **Dokumentation im Code:** Typen dienen als lebendige Dokumentation
- **Strict Mode:** `strict: true` in tsconfig.json — keine Kompromisse

#### Tailwind CSS + shadcn/ui

**Warum Tailwind:**
- **Utility-First:** Kein Kontextwechsel zwischen HTML und CSS-Dateien
- **Design-Konsistenz:** Vordefiniertes Design-System via `tailwind.config.ts`
- **Bundle-Groesse:** Purged CSS, nur verwendete Klassen im Bundle
- **Dark Mode:** Native `darkMode: 'class'` Unterstuetzung

**Warum shadcn/ui:**
- **Kopierbar:** Komponenten werden in `components/ui/` kopiert, nicht als Dependency installiert
- **Anpassbar:** Volle Kontrolle ueber Styling und Verhalten
- **Radix UI Basis:** Accessibility (ARIA, Keyboard Navigation) out-of-the-box
- **Tailwind-native:** Kein CSS-in-JS, keine Styling-Konflikte

#### Supabase (PostgreSQL)

**Warum Supabase statt selbst gemanagter PostgreSQL:**
- **Row Level Security (RLS):** Datenbanksicherheit auf Zeilenebene
- **Realtime:** WebSocket-Subscriptions fuer Live-Updates
- **Auth:** Integrierte Authentifizierung mit OAuth, Magic Links, SSO
- **Storage:** Integrierter File-Storage mit DSGVO-konformen DE-Servern
- **PostgREST:** Automatische REST-API aus dem Datenbankschema
- **Kosten:** Generous Free Tier, $25/Monat fuer Pro

**Warum PostgreSQL:**
- **JSONB:** Flexible Schemata fuer Erweiterbarkeit
- **Full-Text Search:** `tsvector`/`tsquery` fuer globale Suche
- **PostGIS:** Geodaten fuer Spielort-Karten (spaeter)
- **ACID:** Transaktionale Konsistenz fuer Finanzdaten
- **Mature:** 30+ Jahre Entwicklung, battle-tested

#### tRPC (intern) + REST (extern)

**Warum tRPC fuer interne Kommunikation:**
- **Type-Safety:** API-Antworten werden automatisch typisiert
- **Kein Code-Gen:** Keine OpenAPI-Generierung oder GraphQL-Codegen noetig
- **Server Actions Integration:** tRPC Procedures koennen als Server Actions exponiert werden
- **Batching:** Automatisches Request-Batching fuer weniger HTTP-Requests
- **Fehlerhandling:** Typisierte Fehler mit Zod-Validierung

**Warum REST fuer externe APIs:**
- **De-facto Standard:** Jeder Entwickler versteht REST
- **Tooling:** Postman, Insomnia, curl — universell zugaenglich
- **Integrationen:** Externe Partner (Ticketing, Newsletter, Presse) erwarten REST
- **API-Keys:** Einfache Authentifizierung fuer Drittsysteme

#### BullMQ + Redis

**Warum BullMQ:**
- **Redis-basiert:** Kein separater Message-Broker noetig
- **Dashboard:** bull-board oder bullmq-admin fuer Monitoring
- **Features:** Delayed jobs, repeatable jobs, job priorities, rate limiting
- **Robustheit:** Automatic retries, dead-letter queues, job stalled detection
- **TypeScript:** Native TypeScript-Unterstuetzung

#### Hetzner + Coolify (Self-Hosting)

**Warum Self-Hosting statt Vercel:**
- **DSGVO-Konformitaet:** Daten bleiben in Deutschland (Hetzner Nuernberg/Falkenstein)
- **Kostenkontrolle:** ~20-40 EUR/Monat vs. $20-100+/Monat bei Vercel
- **Datenhoheit:** Kein Vendor Lock-in, keine Abhaengigkeit von US-Anbietern
- **Performance:** Server in Deutschland = niedrige Latenz fuer DE-User

**Warum Coolify:**
- **PaaS auf eigener Infrastruktur:** Vercel-like Experience auf eigenem Server
- **Docker-native:** Automatisches Container-Deployment
- **Git-Integration:** Auto-Deploy bei Push
- **Datenbanken:** Ein-Klick PostgreSQL, Redis, MinIO
- **SSL:** Automatische Let's Encrypt Zertifikate

---

## 3. Frontend-Architektur

### 3.1 App Router Struktur

```
app/
├── (auth)/                          # Route Group: Auth (kein Layout)
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   └── callback/
│       └── route.ts                 # OAuth Callback
│
├── (dashboard)/                     # Route Group: Dashboard Layout
│   ├── layout.tsx                   # Sidebar + Header + Content
│   ├── page.tsx                     # Dashboard Home
│   │
│   ├── veranstaltungen/             # Modul 2: Veranstaltungen
│   │   ├── page.tsx                 # Liste
│   │   ├── neu/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx             # Detail
│   │       └── bearbeiten/
│   │           └── page.tsx
│   │
│   ├── spielorte/                   # Modul 1: Multi-Venue
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── kuenstler/                   # Modul 3: Kuenstler
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── kontakte/                    # Modul 3: Kontakte
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── kalender/                    # Modul 1: Kalender
│   │   └── page.tsx
│   │
│   ├── newsletter/                  # Modul: Newsletter
│   │   ├── page.tsx
│   │   ├── campaigns/
│   │   ├── templates/
│   │   └── subscribers/
│   │
│   ├── presse/                      # Modul: Presse-Portal
│   │   └── page.tsx
│   │
│   ├── gema/                        # Modul 4: GEMA
│   │   ├── page.tsx
│   │   └── meldung/
│   │       └── page.tsx
│   │
│   ├── programmheft/                # Modul 5: Programmheft
│   │   ├── page.tsx
│   │   └── generator/
│   │       └── page.tsx
│   │
│   ├── ticketing/                   # Modul 6: Ticketing-Import
│   │   ├── page.tsx
│   │   └── import/
│   │       └── page.tsx
│   │
│   ├── finanzen/                    # Modul: Finanzen
│   │   ├── page.tsx
│   │   └── reports/
│   │       └── page.tsx
│   │
│   ├── team/                        # Modul 7: Nutzerverwaltung
│   │   ├── page.tsx
│   │   └── einladen/
│   │       └── page.tsx
│   │
│   ├── einstellungen/               # Einstellungen
│   │   ├── page.tsx
│   │   ├── profil/
│   │   ├── organisation/
│   │   ├── integrations/
│   │   └── benachrichtigungen/
│   │
│   └── api-keys/                    # Modul 8: API-Verwaltung
│       └── page.tsx
│
├── api/                             # API Routes (Next.js)
│   ├── trpc/
│   │   └── [trpc]/
│   │       └── route.ts             # tRPC HTTP Handler
│   ├── webhooks/
│   │   ├── newsletter/
│   │   │   └── route.ts
│   │   ├── ticketing/
│   │   │   └── route.ts
│   │   └── presse/
│   │       └── route.ts
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts
│   └── rest/
│       └── v1/
│           └── [...path]/
│               └── route.ts         # REST API Proxy
│
├── _components/                     # Private Components (nicht route-exposed)
├── _lib/                            # Private Utilities
├── _hooks/                          # Private Hooks
├── _types/                          # TypeScript Types
├── _utils/                          # Utility-Funktionen
│
└── layout.tsx                       # Root Layout (HTML, Provider)
```

### 3.2 Server Components vs. Client Components

**Prinzip:** "Server Components by default, Client Components only when needed"

#### Server Components (RSC) — ~80% der Komponenten

```tsx
// app/(dashboard)/veranstaltungen/page.tsx
import { createClient } from '@/lib/supabase/server';
import { VeranstaltungenTable } from './_components/veranstaltungen-table';

// Server Component — kein 'use client'
export default async function VeranstaltungenPage() {
  const supabase = await createClient();

  // Direkte Datenbankabfrage — kein API-Call noetig
  const { data: events } = await supabase
    .from('events')
    .select('*, venue:venues(name), artist:artists(name)')
    .order('date', { ascending: true })
    .gte('date', new Date().toISOString());

  return (
    <div>
      <h1>Veranstaltungen</h1>
      {/* Client Component fuer Interaktivitaet */}
      <VeranstaltungenTable initialData={events} />
    </div>
  );
}
```

**Wann Server Components:**
- Datenbankabfragen
- File-System-Zugriff
- API-Calls zu externen Services (am Server)
- Zugriff auf Environment Variables
- SEO-relevante Meta-Daten
- Initial-Data-Fetching

#### Client Components — ~20% der Komponenten

```tsx
// app/(dashboard)/veranstaltungen/_components/veranstaltungen-table.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc/client';

export function VeranstaltungenTable({ initialData }) {
  const [search, setSearch] = useState('');

  // Client-seitiges Refetching bei Filteraenderungen
  const { data, isLoading } = trpc.event.list.useQuery(
    { search, page: 1, limit: 20 },
    { initialData } // Hydration von Server-Daten
  );

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Suchen..."
      />
      <DataTable data={data} loading={isLoading} />
    </div>
  );
}
```

**Wann Client Components:**
- Interaktivitaet (useState, useEffect)
- Event-Handler (onClick, onSubmit)
- Browser-APIs (localStorage, geolocation)
- Custom Hooks (useQuery, useForm)
- Animations-Libraries (Framer Motion)
- DnD-Interaktionen (@dnd-kit)

### 3.3 Komponenten-Muster

#### Pattern 1: Server Component + Client Island

```tsx
// Server Component (Daten + Struktur)
async function Page() {
  const data = await fetchData();      // Server
  return (
    <Layout>
      <ClientWidget initialData={data} /> {/* Client Insel */}
    </Layout>
  );
}

// Client Component (Interaktivitaet)
'use client';
function ClientWidget({ initialData }) {
  const [filter, setFilter] = useState();
  // ...
}
```

#### Pattern 2: Composition mit Server/Client Boundary

```tsx
// Server Component
async function EventList() {
  const events = await getEvents();
  return (
    <ul>
      {events.map(event => (
        <EventCard key={event.id} event={event}>
          {/* Slot fuer Client-Interaktivitaet */}
          <EventActions eventId={event.id} />
        </EventCard>
      ))}
    </ul>
  );
}

// Client Component (nur der interaktive Teil)
'use client';
function EventActions({ eventId }) {
  const deleteMutation = trpc.event.delete.useMutation();
  return (
    <button onClick={() => deleteMutation.mutate(eventId)}>
      Loeschen
    </button>
  );
}
```

### 3.4 Layout-Hierarchie

```
Root Layout (app/layout.tsx)
├── Providers (Theme, TRPC, QueryClient, Auth)
│   ├── Auth Guard (Redirect wenn nicht eingeloggt)
│   │   └── Dashboard Layout (app/(dashboard)/layout.tsx)
│   │       ├── Sidebar (persistent)
│   │       ├── Topbar (Header + Breadcrumbs)
│   │       ├── Main Content (page.tsx)
│   │       └── Toaster (Notifications)
```

---

## 4. Backend-Architektur

### 4.1 Drei-Schichten-Architektur

```
┌─────────────────────────────────────────────┐
│           Presentation Layer                │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐ │
│  │  Pages   │ │ API Routes│ │  tRPC Router │ │
│  │  (RSC)   │ │ (Webhooks)│ │  (Procedures)│ │
│  └──────────┘ └──────────┘ └─────────────┘ │
├─────────────────────────────────────────────┤
│           Application Layer                 │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐ │
│  │  Services │ │  Valid.  │ │   Auth      │ │
│  │  (Business│ │  (Zod)   │ │  (RLS/MW)   │ │
│  │   Logic)  │ │          │ │             │ │
│  └──────────┘ └──────────┘ └─────────────┘ │
├─────────────────────────────────────────────┤
│           Data Access Layer                 │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐ │
│  │Supabase  │ │   tRPC   │ │   BullMQ    │ │
│  │Client    │ │  Server  │ │   (Redis)   │ │
│  │(PostgREST)│ │Context   │ │             │ │
│  └──────────┘ └──────────┘ └─────────────┘ │
└─────────────────────────────────────────────┘
```

### 4.2 tRPC Router Struktur

```typescript
// server/routers/_app.ts
import { router } from '../trpc';
import { eventRouter } from './event';
import { venueRouter } from './venue';
import { artistRouter } from './artist';
import { contactRouter } from './contact';
import { newsletterRouter } from './newsletter';
import { gemaRouter } from './gema';
import { programmheftRouter } from './programmheft';
import { userRouter } from './user';
import { dashboardRouter } from './dashboard';
import { integrationRouter } from './integration';
import { fileRouter } from './file';

export const appRouter = router({
  event: eventRouter,
  venue: venueRouter,
  artist: artistRouter,
  contact: contactRouter,
  newsletter: newsletterRouter,
  gema: gemaRouter,
  programmheft: programmheftRouter,
  user: userRouter,
  dashboard: dashboardRouter,
  integration: integrationRouter,
  file: fileRouter,
});

export type AppRouter = typeof appRouter;
```

#### Beispiel: Event Router

```typescript
// server/routers/event.ts
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { eventService } from '../services/event';

export const eventRouter = router({
  // Liste mit Pagination, Filter, Sortierung
  list: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
      search: z.string().optional(),
      venueId: z.string().uuid().optional(),
      status: z.enum(['draft', 'published', 'cancelled', 'completed']).optional(),
      dateFrom: z.string().datetime().optional(),
      dateTo: z.string().datetime().optional(),
      sortBy: z.enum(['date', 'created_at', 'title']).default('date'),
      sortOrder: z.enum(['asc', 'desc']).default('asc'),
    }))
    .query(async ({ ctx, input }) => {
      return eventService.list(ctx.user.organizationId, input);
    }),

  // Einzelnes Event
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return eventService.getById(ctx.user.organizationId, input.id);
    }),

  // Erstellen
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      description: z.string().optional(),
      date: z.string().datetime(),
      venueId: z.string().uuid(),
      artistId: z.string().uuid().optional(),
      ticketPrice: z.number().min(0).optional(),
      capacity: z.number().int().positive().optional(),
      status: z.enum(['draft', 'published']).default('draft'),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return eventService.create(ctx.user.organizationId, ctx.user.id, input);
    }),

  // Aktualisieren
  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      title: z.string().min(1).max(200).optional(),
      description: z.string().optional(),
      date: z.string().datetime().optional(),
      venueId: z.string().uuid().optional(),
      artistId: z.string().uuid().optional(),
      ticketPrice: z.number().min(0).optional(),
      capacity: z.number().int().positive().optional(),
      status: z.enum(['draft', 'published', 'cancelled', 'completed']).optional(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return eventService.update(ctx.user.organizationId, input.id, input);
    }),

  // Loeschen
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return eventService.delete(ctx.user.organizationId, input.id);
    }),
});
```

### 4.3 Server Actions (Next.js)

Server Actions werden fuer Form-Submissions und einfache Mutationen verwendet:

```typescript
// app/(dashboard)/veranstaltungen/neu/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const createEventSchema = z.object({
  title: z.string().min(1, 'Titel ist erforderlich').max(200),
  date: z.string().datetime(),
  venueId: z.string().uuid('Spielort erforderlich'),
  // ...
});

export async function createEvent(formData: FormData) {
  const supabase = await createClient();

  // Auth-Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht authentifiziert');

  // Validierung
  const validated = createEventSchema.safeParse({
    title: formData.get('title'),
    date: formData.get('date'),
    venueId: formData.get('venueId'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  // Insert mit RLS (organizationId aus User-Metadata)
  const { data, error } = await supabase
    .from('events')
    .insert({
      ...validated.data,
      organization_id: user.user_metadata.organization_id,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;

  // Cache invalidieren
  revalidatePath('/veranstaltungen');
  redirect('/veranstaltungen');
}
```

### 4.4 REST API fuer externe Integrationen

```typescript
// app/api/rest/v1/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// API-Key Authentifizierung
async function authenticate(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey) return null;

  const supabase = await createClient();
  const { data: key } = await supabase
    .from('api_keys')
    .select('*, organization:organizations(*)')
    .eq('key', apiKey)
    .eq('is_active', true)
    .single();

  return key;
}

// Generic REST Handler
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const key = await authenticate(request);
  if (!key) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [resource, id] = params.path;

  // Route zu tRPC Procedure
  const result = await trpcCaller(key.organization_id, key.user_id).query(
    `${resource}.${id ? 'getById' : 'list'}`,
    { id, ...Object.fromEntries(request.nextUrl.searchParams) }
  );

  return NextResponse.json(result);
}
```

### 4.5 Middleware-Pipeline

```
Request
  → API Key / Session Auth
    → Rate Limiter (Redis)
      → Input Validation (Zod)
        → Row Level Security (Supabase)
          → Service Layer (Business Logic)
            → Database (PostgreSQL)
          ← Response
        ← Audit Log
      ← Error Handling
    ← Response Formatting
  ← HTTP Response
```

---

## 5. Datenbank-Architektur

### 5.1 Schema-Design-Prinzipien

1. **Multi-Tenancy via organization_id:** Jede Tabelle hat eine `organization_id` Spalte
2. **RLS-Policies:** Jede Tabelle hat Row Level Security aktiviert
3. **Soft Deletes:** `deleted_at` statt harter Loeschung
4. **Audit Trail:** `created_at`, `updated_at`, `created_by`, `updated_by` auf jeder Tabelle
5. **JSONB fuer Flexibilitaet:** Erweiterbare Felder ohne Migration
6. **UUID Primary Keys:** Keine sequentiellen IDs (Security)
7. **Foreign Keys mit ON DELETE:** Kaskadierende Loeschung fuer Abhaengigkeiten

### 5.2 Multi-Tenancy Pattern

```sql
-- Jedes Query wird automatisch gefiltert durch RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_isolation" ON events
  FOR ALL
  USING (organization_id = current_setting('app.current_org_id')::uuid);

-- App-Layer setzt die Organization-ID pro Request
SET LOCAL app.current_org_id = 'org-uuid-hier';
```

### 5.3 Kern-Tabellen

#### organizations (Mandanten)

```sql
CREATE TABLE organizations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  logo_url        TEXT,
  settings        JSONB DEFAULT '{}',
  billing_email   TEXT,
  plan            TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  plan_expires_at TIMESTAMPTZ,
  max_venues      INT DEFAULT 3,
  max_users       INT DEFAULT 5,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### users (Erweiterung von Supabase Auth)

```sql
-- Supabase auth.users wird erweitert durch public.users
CREATE TABLE users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  email           TEXT NOT NULL,
  first_name      TEXT,
  last_name       TEXT,
  avatar_url      TEXT,
  role            TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'manager', 'member', 'viewer')),
  permissions     JSONB DEFAULT '{}', -- Feingranulare Berechtigungen
  last_login_at   TIMESTAMPTZ,
  preferences     JSONB DEFAULT '{}', -- UI-Einstellungen
  timezone        TEXT DEFAULT 'Europe/Berlin',
  locale          TEXT DEFAULT 'de-DE',
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### venues (Spielorte)

```sql
CREATE TABLE venues (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL,
  description     TEXT,
  address         JSONB NOT NULL, -- { street, city, zip, country }
  coordinates     POINT, -- PostGIS
  capacity        INT,
  contact_email   TEXT,
  contact_phone   TEXT,
  website         TEXT,
  logo_url        TEXT,
  color           TEXT DEFAULT '#6366f1', -- Individuelle Farbe pro Spielort
  settings        JSONB DEFAULT '{}',
  is_active       BOOLEAN DEFAULT TRUE,
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,

  UNIQUE(organization_id, slug)
);
```

#### events (Veranstaltungen)

```sql
CREATE TABLE events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  venue_id        UUID NOT NULL REFERENCES venues(id),
  artist_id       UUID REFERENCES artists(id),
  title           TEXT NOT NULL,
  description     TEXT,
  date            TIMESTAMPTZ NOT NULL,
  doors_open      TIMESTAMPTZ,
  duration_minutes INT DEFAULT 120,
  status          TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'postponed', 'completed')),
  ticket_price    DECIMAL(10,2),
  presale_price   DECIMAL(10,2),
  capacity        INT,
  sold_tickets    INT DEFAULT 0,
  genre           TEXT,
  tags            TEXT[] DEFAULT '{}',
  gema_reported   BOOLEAN DEFAULT FALSE,
  gema_reported_at TIMESTAMPTZ,
  programmheft_generated BOOLEAN DEFAULT FALSE,
  notes           TEXT,
  metadata        JSONB DEFAULT '{}',
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_events_org_date ON events(organization_id, date);
CREATE INDEX idx_events_venue ON events(venue_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_search ON events USING gin(to_tsvector('german', title || ' ' || COALESCE(description, '')));
```

### 5.4 RLS-Policies (Sicherheitskern)

```sql
-- Automatische Organisation-Isolation
CREATE OR REPLACE FUNCTION get_current_org_id()
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.current_org_id', TRUE)::UUID;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Events: Nutzer sieht nur Events ihrer Organisation
CREATE POLICY "events_org_isolation" ON events
  FOR SELECT USING (organization_id = get_current_org_id());

CREATE POLICY "events_org_insert" ON events
  FOR INSERT WITH CHECK (organization_id = get_current_org_id());

CREATE POLICY "events_org_update" ON events
  FOR UPDATE USING (organization_id = get_current_org_id());

CREATE POLICY "events_org_delete" ON events
  FOR DELETE USING (organization_id = get_current_org_id());

-- Zusaetzliche Role-Checks fuer sensible Operationen
CREATE POLICY "events_admin_only_delete" ON events
  FOR DELETE USING (
    organization_id = get_current_org_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.organization_id = get_current_org_id()
      AND users.role IN ('owner', 'admin', 'manager')
    )
  );
```

### 5.5 Realtime-Subscriptions

```typescript
// Echtzeit-Updates fuer Collaborative Features
const channel = supabase
  .channel('events-realtime')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'events',
      filter: `organization_id=eq.${orgId}`,
    },
    (payload) => {
      // Automatisches Refetching
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  )
  .subscribe();
```

**Echtzeit-Use-Cases:**
- Dashboard-Widgets (Live-Ticketverkaeufe)
- Kalender (gleichzeitige Bearbeitung)
- Aufgaben-Status (Team-Kollaboration)
- Notifications (sofortige Benachrichtigungen)

### 5.6 Datenbank-Connection-Pooling

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Next.js    │────▶│  Supabase    │────▶│  PostgreSQL  │
│   (Server)   │     │  Connection  │     │   (Primary)  │
│              │     │   Pooler     │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
                     (PGBouncer,        (Read Replica
                      100 Connections)    optional)
```

---

## 6. Authentifizierung & Autorisierung

### 6.1 Auth-Architektur

```
┌─────────────────────────────────────────────┐
│              Supabase Auth                   │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Password │  │  OAuth2  │  │  Magic   │  │
│  │  (Email) │  │ (Google, │  │  Link    │  │
│  │          │  │ GitHub)  │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  PKCE    │  │  JWT     │  │ Refresh  │  │
│  │  Flow    │  │  Token   │  │  Token   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│           Application Roles                  │
│                                             │
│  Owner ──▶ Admin ──▶ Manager ──▶ Member   │
│   │           │           │           │      │
│   │           │           │           │      │
│  Billing   User-Mgmt   Events     Read-Only │
│  Settings  Venues      Finanzen   Viewer    │
│  Delete    API-Keys    GEMA                 │
│                                             │
└─────────────────────────────────────────────┘
```

### 6.2 Authentifizierungsmethoden

#### 1. Email + Passwort (Standard)

```typescript
// lib/supabase/client.ts
export async function signUp(email: string, password: string, orgName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        organization_name: orgName,
      },
    },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}
```

#### 2. OAuth (Google, GitHub)

```typescript
export async function signInWithOAuth(provider: 'google' | 'github') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      scopes: 'email profile',
    },
  });
  return { data, error };
}
```

#### 3. Magic Link (Passwordless)

```typescript
export async function sendMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });
  return { error };
}
```

#### 4. Einladungsbasierte Registrierung (Team)

```typescript
// Team-Einladung per Email
export async function inviteTeamMember(email: string, role: UserRole) {
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/register?invite=true`,
    options: {
      data: {
        organization_id: currentOrgId,
        role,
        invited_by: currentUserId,
      },
    },
  });
  return { data, error };
}
```

### 6.3 Rollen & Berechtigungen

```typescript
// types/auth.ts
export type UserRole = 'owner' | 'admin' | 'manager' | 'member' | 'viewer';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: ['*'], // Alle Berechtigungen
  admin: [
    'events.*',
    'venues.*',
    'artists.*',
    'contacts.*',
    'newsletter.*',
    'gema.*',
    'programmheft.*',
    'users.read', 'users.invite', 'users.manage',
    'settings.*',
    'billing.read',
    'api_keys.*',
    'integrations.*',
    'reports.*',
  ],
  manager: [
    'events.*',
    'venues.read', 'venues.update',
    'artists.*',
    'contacts.*',
    'newsletter.*',
    'gema.read', 'gema.create',
    'programmheft.*',
    'users.read',
    'settings.read',
    'reports.read',
  ],
  member: [
    'events.read', 'events.create', 'events.update',
    'venues.read',
    'artists.read', 'artists.create',
    'contacts.read', 'contacts.create',
    'newsletter.read', 'newsletter.create',
    'gema.read',
    'programmheft.read',
  ],
  viewer: [
    'events.read',
    'venues.read',
    'artists.read',
    'contacts.read',
    'reports.read',
  ],
};
```

### 6.4 Permission-Check (Middleware)

```typescript
// lib/auth/permissions.ts
export function hasPermission(
  userRole: UserRole,
  requiredPermission: string
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  if (permissions.includes('*')) return true;
  if (permissions.includes(requiredPermission)) return true;

  // Wildcard-Match: 'events.*' matched 'events.create'
  const [resource] = requiredPermission.split('.');
  if (permissions.includes(`${resource}.*`)) return true;

  return false;
}

// React Hook
export function usePermission(permission: string) {
  const { user } = useAuth();
  return hasPermission(user?.role ?? 'viewer', permission);
}

// Server-seitig (tRPC Context)
export function requirePermission(
  ctx: Context,
  permission: string
) {
  if (!hasPermission(ctx.user.role, permission)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `Berechtigung '${permission}' erforderlich`,
    });
  }
}
```

### 6.5 Auth-Flow (Sequenzdiagramm)

```
User ──▶ Login-Form ──▶ Supabase Auth
                          │
                          ▼
                   ┌──────────────┐
                   │  Validiere   │
                   │  Credentials │
                   └──────────────┘
                          │
                    ┌─────┴─────┐
                    ▼           ▼
                 Success    Failure
                    │           │
                    ▼           ▼
              JWT Token     Error Message
                    │
                    ▼
            ┌──────────────┐
            │  Set Cookie  │
            │  (HttpOnly)  │
            └──────────────┘
                    │
                    ▼
            ┌──────────────┐
            │   Redirect   │
            │  /dashboard  │
            └──────────────┘
                    │
                    ▼
            ┌──────────────┐
            │ Middleware   │
            │ Check Auth   │
            └──────────────┘
                    │
                    ▼
            ┌──────────────┐
            │ Supabase     │
            │ Session      │
            │ Refresh      │
            └──────────────┘
                    │
                    ▼
            ┌──────────────┐
            │ RLS Context  │
            │ Set org_id   │
            └──────────────┘
                    │
                    ▼
              Dashboard
```

---

## 7. File Storage

### 7.1 Supabase Storage Struktur

```
buckets/
├── venue-logos/              # Spielort-Logos
│   ├── {org-id}/
│   │   ├── {venue-id}-logo.png
│   │   └── {venue-id}-banner.png
│   └── ...
├── artist-photos/            # Kuenstler-Fotos
│   ├── {org-id}/
│   │   ├── {artist-id}-portrait.jpg
│   │   ├── {artist-id}-gallery-1.jpg
│   │   └── ...
├── event-posters/            # Veranstaltungs-Poster
│   ├── {org-id}/
│   │   ├── {event-id}-poster.jpg
│   │   └── {event-id}-flyer.pdf
├── programmhefte/            # Generierte Programmhefte
│   ├── {org-id}/
│   │   ├── {heft-id}.pdf
│   │   └── {heft-id}-preview.jpg
├── documents/                # Dokumente (Vertraege, Rechnungen)
│   ├── {org-id}/
│   │   ├── contracts/
│   │   ├── invoices/
│   │   └── reports/
├── avatars/                  # Benutzer-Avatare
│   └── {user-id}-avatar.jpg
└── exports/                  # CSV/PDF-Exports
    └── {org-id}/
        ├── {export-id}.csv
        └── {export-id}.pdf
```

### 7.2 Upload-API

```typescript
// server/routers/file.ts
export const fileRouter = router({
  getUploadUrl: protectedProcedure
    .input(z.object({
      bucket: z.enum(['venue-logos', 'artist-photos', 'event-posters', 'documents']),
      fileName: z.string(),
      contentType: z.string(),
      fileSize: z.number().max(50 * 1024 * 1024), // 50MB Max
    }))
    .mutation(async ({ ctx, input }) => {
      const path = `${ctx.user.organizationId}/${input.fileName}`;

      const { data, error } = await ctx.supabase.storage
        .from(input.bucket)
        .createSignedUploadUrl(path, {
          upsert: true,
        });

      if (error) throw error;
      return { signedUrl: data.signedUrl, path };
    }),

  getPublicUrl: protectedProcedure
    .input(z.object({
      bucket: z.string(),
      path: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const { data } = ctx.supabase.storage
        .from(input.bucket)
        .getPublicUrl(input.path);
      return data.publicUrl;
    }),

  delete: protectedProcedure
    .input(z.object({
      bucket: z.string(),
      path: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.storage
        .from(input.bucket)
        .remove([input.path]);
      if (error) throw error;
      return { success: true };
    }),
});
```

### 7.3 Bildoptimierung

```typescript
// Vor Upload: Client-seitige Optimierung
import imageCompression from 'browser-image-compression';

async function optimizeImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 2048,
    useWebWorker: true,
    fileType: 'image/webp',
  };
  return imageCompression(file, options);
}

// Nach Upload: Supabase Image Transformation
// URL: /storage/v1/render/image/public/bucket/path?width=800&height=600&resize=cover&format=webp
```

### 7.4 Storage-Policies (DSGVO)

```sql
-- RLS fuer Storage: Nutzer sieht nur Dateien ihrer Organisation
CREATE POLICY "storage_org_isolation" ON storage.objects
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM users
      WHERE organization_id = (
        SPLIT_PART(name, '/', 1)::UUID -- Erster Pfad-Segment = org-id
      )
    )
  );
```

---

## 8. Task Queue & Background Jobs

### 8.1 BullMQ Architektur

```
┌──────────────────────────────────────────────────────┐
│                    Next.js App                        │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐   │
│  │  API Request │  │  Scheduler   │  │ Manual   │   │
│  │  (Queue Job) │  │  (Cron)      │  │ Trigger  │   │
│  └──────┬───────┘  └──────┬───────┘  └────┬─────┘   │
└─────────┼─────────────────┼────────────────┼─────────┘
          │                 │                │
          ▼                 ▼                ▼
┌──────────────────────────────────────────────────────┐
│                  Redis (Job Queue)                    │
│                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │ newsletter│ │  social  │ │  report  │ │  gema  │  │
│  │  queue   │ │  queue   │ │  queue   │ │ queue  │  │
│  │ (HIGH)   │ │ (MEDIUM) │ │ (LOW)    │ │ (MED)  │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘  │
└──────────────────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────────────────┐
│              BullMQ Workers (Prozesse)                │
│                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │ Newsletter│ │  Social  │ │  Report  │ │  GEMA  │  │
│  │  Worker  │ │  Worker  │ │  Worker  │ │ Worker │  │
│  │ (SMTP)   │ │ (APIs)   │ │ (PDF/CSV)│ │ (Form) │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘  │
└──────────────────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────────────────┐
│              Ergebnisse & Monitoring                  │
│                                                      │
│  ┌──────────┐ ┌──────────┐ ┌────────────────────┐   │
│  │ Database │ │  Email   │ │  Bull Dashboard    │   │
│  │ (Status) │ │ (Admin)  │ │  (Monitoring)      │   │
│  └──────────┘ └──────────┘ └────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

### 8.2 Job-Definitionen

```typescript
// server/queues/newsletter.ts
import { Queue, Worker } from 'bullmq';
import { redis } from '@/lib/redis';

// Queue-Definition
export const newsletterQueue = new Queue('newsletter', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: 100, // Letzte 100 Jobs behalten
    removeOnFail: 50,
  },
});

// Worker-Definition
export const newsletterWorker = new Worker(
  'newsletter',
  async (job) => {
    const { campaignId, batchSize = 100, batchIndex = 0 } = job.data;

    switch (job.name) {
      case 'send-batch':
        return await sendBatch(campaignId, batchSize, batchIndex);
      case 'track-open':
        return await trackOpen(job.data);
      case 'track-click':
        return await trackClick(job.data);
      default:
        throw new Error(`Unbekannter Job: ${job.name}`);
    }
  },
  {
    connection: redis,
    concurrency: 5, // 5 parallele Jobs
  }
);

// Job-Typen
type NewsletterJob =
  | { name: 'send-batch'; data: { campaignId: string; batchSize: number; batchIndex: number } }
  | { name: 'track-open'; data: { trackingId: string; email: string; timestamp: string } }
  | { name: 'track-click'; data: { trackingId: string; email: string; url: string; timestamp: string } };
```

### 8.3 Job-Queues nach Modul

| Queue | Jobs | Prioritaet | Worker |
|-------|------|------------|--------|
| `newsletter` | send-batch, track-open, track-click, process-bounce | HIGH | 3 concurrent |
| `social-media` | publish-post, schedule-post, sync-analytics | MEDIUM | 2 concurrent |
| `reports` | generate-pdf, generate-csv, generate-gema-report | LOW | 1 concurrent |
| `programmheft` | generate-layout, generate-pdf, send-to-printer | MEDIUM | 1 concurrent |
| `imports` | process-csv, sync-ticketing-data, validate-data | MEDIUM | 2 concurrent |
| `exports` | export-contacts, export-events, backup-data | LOW | 1 concurrent |
| `notifications` | send-email, send-push, send-inapp | HIGH | 3 concurrent |
| `webhooks` | process-webhook, retry-failed, cleanup | MEDIUM | 2 concurrent |
| `maintenance` | cleanup-old-data, refresh-materialized-views, sync-external | LOW | 1 concurrent |

### 8.4 Cron-Jobs (Wiederkehrende Aufgaben)

```typescript
// server/queues/scheduler.ts
import { QueueScheduler } from 'bullmq';

// Täglich um 6:00: Ticketing-Daten synchronisieren
await ticketingQueue.add('sync-all', {}, {
  repeat: { cron: '0 6 * * *', tz: 'Europe/Berlin' },
});

// Stündlich: Social Media Analytics aktualisieren
await socialQueue.add('sync-analytics', {}, {
  repeat: { cron: '0 * * * *', tz: 'Europe/Berlin' },
});

// Täglich um 2:00: Datenbereinigung
await maintenanceQueue.add('cleanup', {}, {
  repeat: { cron: '0 2 * * *', tz: 'Europe/Berlin' },
});

// Woechentlich (Sonntag 4:00): Backup
await maintenanceQueue.add('full-backup', {}, {
  repeat: { cron: '0 4 * * 0', tz: 'Europe/Berlin' },
});
```

### 8.5 BullMQ Dashboard

```typescript
// app/(dashboard)/admin/queues/page.tsx
import { createBullBoard } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [
    new BullMQAdapter(newsletterQueue),
    new BullMQAdapter(socialQueue),
    new BullMQAdapter(reportQueue),
    new BullMQAdapter(maintenanceQueue),
  ],
  serverAdapter,
});
// Zugaenglich nur fuer Owner/Admin
```

---

## 9. Caching-Strategie

### 9.1 Mehrstufiges Caching

```
┌─────────────────────────────────────────────────────┐
│                  Caching Layers                      │
│                                                      │
│  L1: React Query Cache (Client-Side)                 │
│  ├── In-Memory, 5 Minuten staleTime                  │
│  ├── Automatisches Background Refetching             │
│  ├── Optimistic Updates                              │
│  └── Query Deduplication                             │
│                                                      │
│  L2: Next.js Data Cache (Server-Side)                │
│  ├── fetch() Cache = unbegrenzt (Opt-in)             │
│  ├── revalidatePath() fuer Cache Invalidation        │
│  └── ISR (Incremental Static Regeneration)           │
│                                                      │
│  L3: Redis Cache (Application-Level)                 │
│  ├── API-Response Caching (60s)                      │
│  ├── Session Store                                   │
│  └── Rate Limiting Counter                           │
│                                                      │
│  L4: PostgreSQL Materialized Views                   │
│  ├── Dashboard-Zahlen (taeglich refresh)             │
│  ├── Berichtsdaten (stuendlich refresh)              │
│  └── Full-Text Search Index                          │
└─────────────────────────────────────────────────────┘
```

### 9.2 React Query Konfiguration

```typescript
// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5 Minuten als frisch betrachten
      gcTime: 1000 * 60 * 30,          // 30 Minuten im Garbage Collector
      retry: 2,                         // 2 Retries bei Fehler
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      refetchOnWindowFocus: true,       // Beim Tab-Fokus refetchen
      refetchOnReconnect: true,         // Bei Reconnect refetchen
      refetchInterval: false,           // Kein Polling (Realtime stattdessen)
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        toast.error(error.message);
      },
    },
  },
});

// Modul-spezifische Konfiguration
const eventQueries = {
  list: {
    queryKey: ['events', 'list'],
    staleTime: 1000 * 60, // 1 Minute (Events aendern sich haeufig)
  },
  detail: {
    queryKey: (id: string) => ['events', 'detail', id],
    staleTime: 1000 * 30, // 30 Sekunden
  },
  dashboard: {
    queryKey: ['events', 'dashboard'],
    staleTime: 1000 * 60 * 5, // 5 Minuten
  },
};
```

### 9.3 Redis Caching fuer API-Responses

```typescript
// lib/cache/redis-cache.ts
import { redis } from '@/lib/redis';

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 60
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const data = await fetcher();
  await redis.setex(key, ttlSeconds, JSON.stringify(data));
  return data;
}

export async function invalidateCache(pattern: string) {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

// Verwendung
const stats = await getCached(
  `dashboard:stats:${orgId}`,
  () => calculateDashboardStats(orgId),
  300 // 5 Minuten Cache
);
```

### 9.4 Materialized Views

```sql
-- Dashboard-Zusammenfassung (taeglich aktualisiert)
CREATE MATERIALIZED VIEW mv_dashboard_stats AS
SELECT
  organization_id,
  COUNT(*) FILTER (WHERE date >= CURRENT_DATE) as upcoming_events,
  COUNT(*) FILTER (WHERE date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days') as events_next_30d,
  SUM(sold_tickets) as total_sold_tickets,
  SUM(sold_tickets * ticket_price) as total_revenue,
  COUNT(*) FILTER (WHERE status = 'draft') as draft_events
FROM events
WHERE deleted_at IS NULL
GROUP BY organization_id;

CREATE UNIQUE INDEX idx_mv_dashboard_org ON mv_dashboard_stats(organization_id);

-- Refresh (taeglich um 3:00)
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_dashboard_stats;
```

---

## 10. State Management

### 10.1 Zustand-Store (Client-State)

```typescript
// stores/dashboard-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DashboardState {
  // Widget-Konfiguration
  widgets: WidgetConfig[];
  layout: LayoutItem[];

  // UI-State
  sidebarCollapsed: boolean;
  activeVenueId: string | null;

  // Actions
  setWidgets: (widgets: WidgetConfig[]) => void;
  updateLayout: (layout: LayoutItem[]) => void;
  toggleSidebar: () => void;
  setActiveVenue: (id: string | null) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgets: defaultWidgets,
      layout: defaultLayout,
      sidebarCollapsed: false,
      activeVenueId: null,

      setWidgets: (widgets) => set({ widgets }),
      updateLayout: (layout) => set({ layout }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setActiveVenue: (id) => set({ activeVenueId: id }),
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        activeVenueId: state.activeVenueId,
        // Widgets werden server-seitig gespeichert
      }),
    }
  )
);
```

### 10.2 Server-State (TanStack Query)

```typescript
// Alle serverseitigen Daten werden via TanStack Query verwaltet
// Kein Redux/Context fuer Server-State!

// hooks/use-events.ts
export function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: ['events', 'list', filters],
    queryFn: () => trpc.event.list.query(filters),
    staleTime: 60_000,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', 'detail', id],
    queryFn: () => trpc.event.getById.query({ id }),
    staleTime: 30_000,
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: trpc.event.create.mutate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Veranstaltung erstellt');
    },
  });
}
```

### 10.3 State-Management-Architektur

```
┌────────────────────────────────────────────────────────┐
│                   State Types                           │
├────────────────────────────────────────────────────────┤
│                                                         │
│  Server-State ──▶ TanStack Query                        │
│  ├── Events, Kontakte, Spielorte                        │
│  ├── Dashboard-Daten                                    │
│  ├── Berichte                                           │
│  └── Automatisches Caching, Refetching, Deduplication   │
│                                                         │
│  Client-State ──▶ Zustand                               │
│  ├── UI-Konfig (Sidebar, Dark Mode)                     │
│  ├── Form-State (Zwischenspeicherung)                   │
│  ├── Widget-Layouts                                     │
│  └── Filter/Selektionen                                 │
│                                                         │
│  URL-State ──▶ Next.js Router                           │
│  ├── Aktuelle Seite                                     │
│  ├── Filter-Parameter (?venue=xxx&status=yyy)           │
│  ├── Pagination (?page=2)                               │
│  └── Tab-Auswahl (?tab=details)                         │
│                                                         │
│  Local-State ──▶ React useState/useReducer              │
│  ├── Form-Eingaben                                      │
│  ├── Modal-Open/Close                                   │
│  └── Komponenten-interne UI                             │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

## 11. API-Design

### 11.1 tRPC Procedures (Interne API)

Alle internen APIs werden als tRPC-Router definiert. Die automatisch generierte Client-Bibliothek stellt Type-Safety sicher.

```typescript
// Alle Router folgen dem CRUD-Muster:
// list     → GET    (mit Pagination, Filter, Sortierung)
// getById  → GET    (einzelnes Element)
// create   → POST   (neues Element)
// update   → PATCH  (Teil-Update)
// delete   → DELETE (Soft-Delete)
// count    → GET    (Anzahl fuer Pagination)

// Beispiel: Venue Router
trpc.venue.list.useQuery({ page, limit, search });
trpc.venue.getById.useQuery({ id });
trpc.venue.create.useMutation();
trpc.venue.update.useMutation();
trpc.venue.delete.useMutation();
```

### 11.2 REST Endpunkte (Externe API)

REST-APIs werden fuer externe Integrationen (Ticketing, Newsletter-Provider, Presse-Portale) bereitgestellt.

#### Base URL

```
https://api.kleinkunst-dashboard.de/v1
```

#### Authentication

```
Header: X-API-Key: kk_live_xxxxxxxxxxxxxxxx
```

#### Standard-Response-Format

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  },
  "links": {
    "self": "/v1/events?page=1",
    "next": "/v1/events?page=2",
    "prev": null
  }
}
```

#### Error-Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validierungsfehler",
    "details": [
      { "field": "title", "message": "Titel ist erforderlich" }
    ]
  }
}
```

### 11.3 REST Endpunkte nach Modul

#### Veranstaltungen (`/v1/events`)

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `GET` | `/v1/events` | Liste (paginiert, filterbar) | API-Key |
| `GET` | `/v1/events/{id}` | Einzelnes Event | API-Key |
| `POST` | `/v1/events` | Event erstellen | API-Key |
| `PUT` | `/v1/events/{id}` | Event aktualisieren | API-Key |
| `DELETE` | `/v1/events/{id}` | Event loeschen | API-Key |
| `GET` | `/v1/events/{id}/stats` | Event-Statistiken | API-Key |
| `GET` | `/v1/events/upcoming` | Kommende Events | API-Key |
| `GET` | `/v1/events/calendar` | Kalender-Ansicht (iCal) | API-Key |

#### Spielorte (`/v1/venues`)

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `GET` | `/v1/venues` | Alle Spielorte | API-Key |
| `GET` | `/v1/venues/{id}` | Einzelner Spielort | API-Key |
| `POST` | `/v1/venues` | Spielort erstellen | API-Key |
| `PUT` | `/v1/venues/{id}` | Spielort aktualisieren | API-Key |
| `DELETE` | `/v1/venues/{id}` | Spielort loeschen | API-Key |
| `GET` | `/v1/venues/{id}/events` | Events des Spielorts | API-Key |

#### Kuenstler (`/v1/artists`)

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `GET` | `/v1/artists` | Alle Kuenstler | API-Key |
| `GET` | `/v1/artists/{id}` | Einzelner Kuenstler | API-Key |
| `POST` | `/v1/artists` | Kuenstler erstellen | API-Key |
| `PUT` | `/v1/artists/{id}` | Kuenstler aktualisieren | API-Key |
| `DELETE` | `/v1/artists/{id}` | Kuenstler loeschen | API-Key |

#### Kontakte (`/v1/contacts`)

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `GET` | `/v1/contacts` | Alle Kontakte | API-Key |
| `GET` | `/v1/contacts/{id}` | Einzelner Kontakt | API-Key |
| `POST` | `/v1/contacts` | Kontakt erstellen | API-Key |
| `PUT` | `/v1/contacts/{id}` | Kontakt aktualisieren | API-Key |
| `DELETE` | `/v1/contacts/{id}` | Kontakt loeschen | API-Key |
| `POST` | `/v1/contacts/import` | CSV-Import | API-Key |
| `GET` | `/v1/contacts/export` | CSV-Export | API-Key |

#### Newsletter (`/v1/newsletter/*`)

Siehe Dimension 3 (Newsletter-Modul) fuer vollstaendige API-Spezifikation.

#### GEMA (`/v1/gema`)

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `GET` | `/v1/gema/reports` | Alle GEMA-Meldungen | API-Key |
| `POST` | `/v1/gema/reports` | GEMA-Meldung erstellen | API-Key |
| `GET` | `/v1/gema/reports/{id}` | Einzelne Meldung | API-Key |
| `POST` | `/v1/gema/reports/{id}/submit` | An GEMA senden | API-Key |
| `GET` | `/v1/gema/reports/{id}/download` | PDF-Download | API-Key |

#### Programmheft (`/v1/programmheft`)

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `GET` | `/v1/programmheft/templates` | Templates | API-Key |
| `POST` | `/v1/programmheft/generate` | PDF generieren | API-Key |
| `GET` | `/v1/programmheft/{id}/download` | PDF Download | API-Key |

#### Dashboard (`/v1/dashboard`)

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `GET` | `/v1/dashboard/stats` | Uebersichts-KPIs | API-Key |
| `GET` | `/v1/dashboard/activities` | Aktivitaets-Feed | API-Key |
| `GET` | `/v1/dashboard/alerts` | Alerts & Reminders | API-Key |

#### Webhooks (`/v1/webhooks`)

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|-------------|------|
| `POST` | `/v1/webhooks/newsletter/{provider}` | Newsletter-Events | HMAC |
| `POST` | `/v1/webhooks/ticketing/{provider}` | Ticketing-Events | HMAC |
| `POST` | `/v1/webhooks/presse/{portal}` | Presse-Events | HMAC |

### 11.4 API-Versionsstrategie

```
/v1/        → Aktuelle stabile Version
/v1beta/    → Beta-Features (opt-in)
/v2/        → Naechste Major Version (spaeter)
```

**Versionierung:** URL-based (`/v1/...`) statt Header-based — einfacher fuer externe Entwickler.

---

## 12. Authentication Middleware

### 12.1 tRPC Middleware-Stack

```typescript
// server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { createClient } from '@supabase/supabase-js';

const t = initTRPC.context<Context>().create();

// Basis-Middleware: Authentifizierung
const isAuthed = t.middleware(async ({ ctx, next }) => {
  const { data: { user }, error } = await ctx.supabase.auth.getUser();

  if (error || !user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  // Organization aus User-Metadata
  const orgId = user.user_metadata.organization_id;
  if (!orgId) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Keine Organisation zugewiesen',
    });
  }

  // RLS Context setzen
  await ctx.supabase.rpc('set_org_context', { org_id: orgId });

  return next({
    ctx: {
      ...ctx,
      user: {
        id: user.id,
        email: user.email!,
        organizationId: orgId,
        role: user.user_metadata.role,
      },
    },
  });
});

// Role-Check Middleware
const requireRole = (...roles: UserRole[]) => {
  return t.middleware(async ({ ctx, next }) => {
    if (!roles.includes(ctx.user.role)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Rollen ${roles.join(', ')} erforderlich`,
      });
    }
    return next({ ctx });
  });
};

// Export
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAuthed).use(requireRole('owner', 'admin'));
export const managerProcedure = t.procedure.use(isAuthed).use(requireRole('owner', 'admin', 'manager'));
```

### 12.2 API-Key Middleware (REST)

```typescript
// middleware/api-key-auth.ts
export async function authenticateApiKey(
  request: NextRequest
): Promise<ApiKeyContext | null> {
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey) return null;

  // Cache-Lookup (Redis)
  const cached = await redis.get(`apikey:${apiKey}`);
  if (cached) return JSON.parse(cached);

  // Datenbank-Lookup
  const supabase = await createClient();
  const { data: keyData } = await supabase
    .from('api_keys')
    .select('*, organization:organizations(*)')
    .eq('key_hash', hashApiKey(apiKey))
    .eq('is_active', true)
    .single();

  if (!keyData) return null;

  // Pruefe Ablaufdatum
  if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
    return null;
  }

  // Rate-Limit-Pruefung
  const rateOk = await checkApiKeyRateLimit(keyData.id, keyData.rate_limit);
  if (!rateOk) return null;

  // Cache fuer 5 Minuten
  await redis.setex(`apikey:${apiKey}`, 300, JSON.stringify(keyData));

  return {
    keyId: keyData.id,
    organizationId: keyData.organization_id,
    permissions: keyData.permissions,
  };
}
```

---

## 13. Rate Limiting

### 13.1 Rate-Limit-Strategie

| Ebene | Limit | Scope | Implementierung |
|-------|-------|-------|-----------------|
| **API-Key** | 100/min, 10.000/Tag | Pro API-Key | Redis Counter |
| **Authentifizierte User** | 60/min | Pro User | Redis Counter |
| **Anonym** | 10/min | Pro IP | Redis Counter |
| **Auth-Endpunkte** | 5/min | Pro IP | Redis Counter |
| **File Upload** | 10/min | Pro User | Redis Counter |
| **Newsletter-Versand** | Provider-Limit | Pro Campaign | BullMQ |

### 13.2 Implementierung

```typescript
// lib/rate-limiter.ts
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redis } from '@/lib/redis';

const rateLimiters = {
  // API-Key basiert
  apiKey: new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'ratelimit_apikey',
    points: 100,        // 100 Requests
    duration: 60,       // pro Minute
  }),

  // User-basiert
  authenticated: new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'ratelimit_auth',
    points: 60,
    duration: 60,
  }),

  // IP-basiert
  anonymous: new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'ratelimit_ip',
    points: 10,
    duration: 60,
  }),

  // Auth-Endpunkte (Login, Register)
  auth: new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'ratelimit_auth_endpoint',
    points: 5,
    duration: 60,
  }),
};

export async function checkRateLimit(
  type: keyof typeof rateLimiters,
  key: string
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  try {
    const limiter = rateLimiters[type];
    const result = await limiter.consume(key);
    return {
      allowed: true,
      remaining: result.remainingPoints,
      resetAt: new Date(Date.now() + result.msBeforeNext),
    };
  } catch (rejRes) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(Date.now() + rejRes.msBeforeNext),
    };
  }
}
```

### 13.3 Rate-Limit Headers

Jede API-Response enthaelt Rate-Limit-Headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1699999999
X-RateLimit-Retry-After: 45
```

---

## 14. Error Handling

### 14.1 Error-Hierarchie

```typescript
// lib/errors/types.ts
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super('NOT_FOUND', `${resource} mit ID ${id} nicht gefunden`, 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(permission: string) {
    super('FORBIDDEN', `Berechtigung '${permission}' erforderlich`, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super('CONFLICT', message, 409);
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter: number) {
    super('RATE_LIMIT_EXCEEDED', 'Rate Limit ueberschritten', 429, { retryAfter });
  }
}

// Error Code Enum
export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'UNAUTHORIZED'
  | 'CONFLICT'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'BAD_GATEWAY';
```

### 14.2 tRPC Error Handler

```typescript
// server/error-handler.ts
import { TRPCError } from '@trpc/server';

export function mapToTRPCError(error: unknown): TRPCError {
  if (error instanceof AppError) {
    const codeMap: Record<string, TRPCError['code']> = {
      VALIDATION_ERROR: 'BAD_REQUEST',
      NOT_FOUND: 'NOT_FOUND',
      FORBIDDEN: 'FORBIDDEN',
      UNAUTHORIZED: 'UNAUTHORIZED',
      CONFLICT: 'CONFLICT',
      RATE_LIMIT_EXCEEDED: 'TOO_MANY_REQUESTS',
    };

    return new TRPCError({
      code: codeMap[error.code] || 'INTERNAL_SERVER_ERROR',
      message: error.message,
      cause: error,
    });
  }

  // Unbekannter Fehler
  console.error('Unbehandelter Fehler:', error);
  return new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Ein interner Fehler ist aufgetreten',
  });
}
```

### 14.3 Global Error Boundary

```tsx
// app/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Fehler an Sentry senden
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h2 className="text-2xl font-bold mb-4">
        Etwas ist schiefgelaufen
      </h2>
      <p className="text-muted-foreground mb-6">
        {error.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
      </p>
      <div className="flex gap-4">
        <Button onClick={reset}>Erneut versuchen</Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Zur Startseite
        </Button>
      </div>
    </div>
  );
}
```

### 14.4 API Error Responses

| HTTP Status | Error Code | Nutzer-Nachricht (DE) |
|-------------|-----------|----------------------|
| 400 | VALIDATION_ERROR | "Bitte ueberpruefen Sie Ihre Eingaben" |
| 401 | UNAUTHORIZED | "Bitte melden Sie sich an" |
| 403 | FORBIDDEN | "Keine Berechtigung fuer diese Aktion" |
| 404 | NOT_FOUND | "Die angeforderte Ressource wurde nicht gefunden" |
| 409 | CONFLICT | "Es besteht ein Konflikt mit bestehenden Daten" |
| 422 | UNPROCESSABLE | "Die Anfrage konnte nicht verarbeitet werden" |
| 429 | RATE_LIMIT | "Zu viele Anfragen. Bitte warten Sie einen Moment." |
| 500 | INTERNAL | "Ein interner Fehler ist aufgetreten. Wir arbeiten daran." |
| 502 | BAD_GATEWAY | "Externer Dienst nicht erreichbar" |
| 503 | UNAVAILABLE | "Dienst voruebergehend nicht verfuegbar" |

---

## 15. API-Dokumentation

### 15.1 OpenAPI 3.1 Spezifikation

```yaml
# openapi.yaml
openapi: 3.1.0
info:
  title: Kleinkunst Dashboard API
  version: 1.0.0
  description: |
    REST API fuer die Kleinkunst-Dashboard-App.
    Alle Endpunkte erfordern einen API-Key im Header.
  contact:
    name: API Support
    email: api@kleinkunst-dashboard.de

servers:
  - url: https://api.kleinkunst-dashboard.de/v1
    description: Produktion
  - url: https://staging-api.kleinkunst-dashboard.de/v1
    description: Staging

security:
  - ApiKeyAuth: []

paths:
  /events:
    get:
      summary: Veranstaltungen auflisten
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 20, maximum: 100 }
        - name: search
          in: query
          schema: { type: string }
        - name: venue_id
          in: query
          schema: { type: string, format: uuid }
        - name: status
          in: query
          schema:
            type: string
            enum: [draft, published, cancelled, completed]
      responses:
        '200':
          description: Erfolgreich
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedEvents'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '429':
          $ref: '#/components/responses/RateLimited'

    post:
      summary: Veranstaltung erstellen
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/EventCreate'
      responses:
        '201':
          description: Erstellt
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Event'

  /events/{id}:
    get:
      summary: Einzelne Veranstaltung
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string, format: uuid }
      responses:
        '200':
          description: Erfolgreich
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Event'
        '404':
          $ref: '#/components/responses/NotFound'

components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key

  schemas:
    Event:
      type: object
      properties:
        id: { type: string, format: uuid }
        title: { type: string }
        description: { type: string }
        date: { type: string, format: date-time }
        venue: { $ref: '#/components/schemas/Venue' }
        status: { type: string, enum: [draft, published, cancelled, completed] }
        ticket_price: { type: number }
        created_at: { type: string, format: date-time }
        updated_at: { type: string, format: date-time }

    PaginatedEvents:
      type: object
      properties:
        success: { type: boolean }
        data:
          type: array
          items: { $ref: '#/components/schemas/Event' }
        meta:
          type: object
          properties:
            page: { type: integer }
            limit: { type: integer }
            total: { type: integer }
            total_pages: { type: integer }

  responses:
    Unauthorized:
      description: Nicht authentifiziert
      content:
        application/json:
          schema:
            type: object
            properties:
              success: { type: boolean, example: false }
              error:
                type: object
                properties:
                  code: { type: string, example: UNAUTHORIZED }
                  message: { type: string, example: Authentifizierung erforderlich }

    RateLimited:
      description: Rate Limit ueberschritten
      headers:
        X-RateLimit-Limit: { schema: { type: integer } }
        X-RateLimit-Remaining: { schema: { type: integer } }
        X-RateLimit-Reset: { schema: { type: integer } }
```

### 15.2 API-Dokumentation-UI

- **Swagger UI:** Integriert unter `/api/docs`
- **Redoc:** Alternative Darstellung unter `/api/docs/redoc`
- **Postman Collection:** Exportierbar aus OpenAPI-Spec
- **Changelog:** `/api/docs/changelog` mit Versionshistorie

---

## 16. Deployment-Strategie

### 16.1 Infrastruktur-Architektur (Produktion)

```
┌─────────────────────────────────────────────────────────────┐
│                       Hetzner Cloud                          │
│                    (Nuernberg / Falkenstein)                 │
│                                                              │
│  ┌──────────────┐                                           │
│  │   Traefik    │  ← Reverse Proxy, SSL, Load Balancing     │
│  │    (v3)      │                                           │
│  └──────┬───────┘                                           │
│         │                                                     │
│  ┌──────┴───────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Next.js     │  │   Redis      │  │  PostgreSQL  │      │
│  │  (Docker)    │  │  (Docker)    │  │   (Docker)   │      │
│  │              │  │              │  │              │      │
│  │  App Server  │  │  BullMQ +    │  │  Supabase    │      │
│  │  tRPC API    │  │  Sessions +  │  │  (PostgreSQL)│      │
│  │  SSR/SSG     │  │  Rate Limit  │  │              │      │
│  │              │  │              │  │              │      │
│  │  Port: 3000  │  │  Port: 6379  │  │  Port: 5432  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   Coolify    │  │   MinIO      │  ← S3-kompatibel       │
│  │   (PaaS)     │  │  (Storage)   │     File Storage       │
│  │              │  │              │                        │
│  │  Auto-Deploy │  │  Port: 9000  │                        │
│  │  SSL Mgmt    │  └──────────────┘                        │
│  │  Monitoring  │                                           │
│  └──────────────┘                                           │
│                                                              │
│  Server-Spezifikation:                                       │
│  - CX42: 4 vCPU, 16 GB RAM, 160 GB NVMe                     │
│  - ~35,60 EUR/Monat                                         │
│  - Backup-Server (taeglich): CPX21: 2 vCPU, 4 GB            │
│    ~12,90 EUR/Monat                                         │
└─────────────────────────────────────────────────────────────┘
```

### 16.2 Docker-Compose (Produktion)

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    image: ghcr.io/kleinkunst/dashboard:latest
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_KEY}
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - redis
      - db
    networks:
      - app-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`app.kleinkunst-dashboard.de`)"
      - "traefik.http.routers.app.tls.certresolver=letsencrypt"
      - "traefik.http.services.app.loadbalancer.server.port=3000"

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis-data:/data
    networks:
      - app-network

  db:
    image: supabase/postgres:15.1.1.61
    restart: unless-stopped
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=kleinkunst
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

  storage:
    image: minio/minio:latest
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      - MINIO_ROOT_USER=${MINIO_USER}
      - MINIO_ROOT_PASSWORD=${MINIO_PASSWORD}
    volumes:
      - minio-data:/data
    networks:
      - app-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.storage.rule=Host(`storage.kleinkunst-dashboard.de`)"

  traefik:
    image: traefik:v3.0
    restart: unless-stopped
    command:
      - "--api.dashboard=false"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@kleinkunst-dashboard.de"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - letsencrypt:/letsencrypt
    networks:
      - app-network

volumes:
  postgres-data:
  redis-data:
  minio-data:
  letsencrypt:

networks:
  app-network:
    driver: bridge
```

### 16.3 Umgebungen

| Umgebung | URL | Zweck | Daten |
|----------|-----|-------|-------|
| **Lokal** | `http://localhost:3000` | Entwicklung | Docker-Container (Dev-Daten) |
| **Staging** | `https://staging.kleinkunst-dashboard.de` | QA & Testing | Anonymisierte Kopie |
| **Produktion** | `https://app.kleinkunst-dashboard.de` | Live-System | Echte Kundendaten |

### 16.4 Lokale Entwicklung (Docker)

```bash
# Repository klonen
git clone git@github.com:kleinkunst/dashboard.git
cd dashboard

# .env Datei kopieren
cp .env.example .env

# Docker-Container starten
docker-compose -f docker-compose.dev.yml up -d

# Abhaengigkeiten installieren
pnpm install

# Datenbank-Migrationen ausfuehren
pnpm db:migrate

# Seed-Daten
cd scripts && node seed-data.js

# Dev-Server starten
pnpm dev

# App erreichbar unter http://localhost:3000
```

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: kleinkunst_dev
    volumes:
      - postgres-dev:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  mailpit:
    image: axllent/mailpit:latest
    ports:
      - "1025:1025"   # SMTP
      - "8025:8025"   # Web UI

volumes:
  postgres-dev:
```

---

## 17. CI/CD Pipeline

### 17.1 GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # ─── Phase 1: Lint & Type Check ───────────────────────────
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm lint              # ESLint
      - run: pnpm type-check        # TypeScript
      - run: pnpm format:check      # Prettier

  # ─── Phase 2: Unit Tests ─────────────────────────────────
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm test:unit --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  # ─── Phase 3: Integration Tests ──────────────────────────
  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: lint
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_PASSWORD: testpassword
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm db:migrate:test
      - run: pnpm test:integration

  # ─── Phase 4: Build ──────────────────────────────────────
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: ./.next

  # ─── Phase 5: Deploy to Staging ─────────────────────────
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Staging
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/kleinkunst/staging
            docker-compose pull
            docker-compose up -d
            docker system prune -f

  # ─── Phase 6: Deploy to Production ──────────────────────
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://app.kleinkunst-dashboard.de
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Production
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/kleinkunst/production
            docker-compose pull
            docker-compose up -d
            docker system prune -f

      - name: Notify Sentry
        run: |
          curl ${{ secrets.SENTRY_RELEASE_WEBHOOK }} \
            -X POST \
            -H 'Content-Type: application/json' \
            -d '{"version": "${{ github.sha }}"}'
```

### 17.2 Deployment-Branches

| Branch | Ziel | Trigger |
|--------|------|---------|
| `main` | Produktion | PR Merge + manuelles Approval |
| `develop` | Staging | Automatisch bei Push |
| `feature/*` | — | CI Pipeline (Tests) |
| `hotfix/*` | Produktion | Schnell-Deploy mit Bypass |

---

## 18. Backup-Strategie

### 18.1 Backup-Uebersicht

| Ressource | Frequenz | Methode | Aufbewahrung | Ziel |
|-----------|----------|---------|-------------|------|
| **PostgreSQL** | 4x taeglich (alle 6h) | pg_dump + wal-g | 30 Tage lokal, 90 Tage Remote | Hetzner Storage Box |
| **Redis** | Stuendlich | RDB Snapshot + AOF | 7 Tage | Lokal |
| **File Storage** | Taeglich | rclone sync | 30 Tage | Hetzner Storage Box |
| **Full System** | Woechentlich | rsnapshot | 4 Wochen | Hetzner Storage Box |
| **Offsite** | Taeglich | rclone encrypt → Wasabi S3 | 1 Jahr | Wasabi (EU-Region) |

### 18.2 PostgreSQL Backup (pg_dump + wal-g)

```bash
#!/bin/bash
# scripts/backup-db.sh

BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Full Backup via pg_dump
docker exec kleinkunst-db pg_dump \
  -U postgres \
  -Fc \
  -f /tmp/backup_${DATE}.dump \
  kleinkunst

# Kopieren
docker cp kleinkunst-db:/tmp/backup_${DATE}.dump ${BACKUP_DIR}/

# Alte Backups loeschen
find ${BACKUP_DIR} -name "backup_*.dump" -mtime +${RETENTION_DAYS} -delete

# Upload zu Storage Box
rsync -avz --delete ${BACKUP_DIR}/ uXXXXX@uXXXXX.your-storagebox.de:/backups/
```

### 18.3 Disaster Recovery

| Szenario | Recovery Time | Methode |
|----------|--------------|---------|
| Einzelne Tabelle geloescht | < 15 Min | Point-in-Time Recovery aus wal-g |
| Komplette DB korrupt | < 1 Stunde | Letztes Full Backup + WAL replay |
| Server totale Zerstoerung | < 4 Stunden | Neuer Hetzner Server + Restore |
| Daten bis zu einem Tag | < 30 Min | Stuendliche Snapshots |

### 18.4 Backup-Ueberwachung

- **Health-Check:** Taeglicher automatischer Restore-Test auf Staging
- **Monitoring:** Alert wenn Backup aelter als 8 Stunden
- **Dashboard:** Backup-Status in Admin-Panel sichtbar

---

## 19. Security

### 19.1 Security-Architektur

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Layer 1: Netzwerk                                       │
│  ├── HTTPS (TLS 1.3)                                    │
│  ├── HSTS Header                                        │
│  ├── Firewall (Hetzner)                                 │
│  ├── DDoS Protection (Hetzner)                          │
│  └── VPN fuer Admin-Zugriff                             │
│                                                         │
│  Layer 2: Application                                    │
│  ├── OAuth 2.0 + PKCE                                   │
│  ├── JWT mit Refresh Token Rotation                     │
│  ├── Row Level Security (RLS)                           │
│  ├── Role-Based Access Control (RBAC)                   │
│  ├── Input Validation (Zod)                             │
│  └── Output Encoding                                    │
│                                                         │
│  Layer 3: API Security                                   │
│  ├── Rate Limiting                                      │
│  ├── API-Key Management                                 │
│  ├── CORS Whitelist                                     │
│  ├── CSRF Protection                                    │
│  └── Request Signing (Webhooks)                         │
│                                                         │
│  Layer 4: Data Security                                  │
│  ├── AES-256 Verschluesselung (at rest)                 │
│  ├── API Keys verschluesselt in DB                      │
│  ├── PII gem. DSGVO minimiert                           │
│  └── Field-Level Encryption fuer sensible Daten         │
│                                                         │
│  Layer 5: Infrastructure                                 │
│  ├── Docker-Container-Isolation                         │
│  ├── Non-root Container                                 │
│  ├── Read-only Filesystem wo moeglich                   │
│  ├── Secrets Management (Docker Secrets)                │
│  └── OS-Level Security (unattended-upgrades)            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 19.2 HTTPS & Transport Security

```yaml
# traefik.yml (Security Headers)
http:
  middlewares:
    security-headers:
      headers:
        frameDeny: true
        sslRedirect: true
        stsSeconds: 31536000
        stsIncludeSubdomains: true
        stsPreload: true
        contentTypeNosniff: true
        browserXssFilter: true
        contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.supabase.co;"
        referrerPolicy: "strict-origin-when-cross-origin"
        permissionsPolicy: "camera=(), microphone=(), geolocation=()"
```

### 19.3 CORS-Konfiguration

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.ALLOWED_ORIGINS || 'https://app.kleinkunst-dashboard.de',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-API-Key, X-CSRF-Token, Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};
```

### 19.4 CSRF Protection

```typescript
// CSRF ist bei API-Key-basierter REST API nicht noetig
// Bei Cookie-basiertem Auth (Supabase) wird SameSite=Strict verwendet

// next.config.ts
// Supabase Auth Cookies:
// - SameSite=Strict
// - HttpOnly
// - Secure (nur HTTPS)
// - Path=/
```

### 19.5 SQL Injection Prevention

```
Primaere Verteidigung: Supabase Client (Prepared Statements)
┌─────────────────────────────────────────────────────┐
│  NICHT:                                             │
│  db.query(`SELECT * FROM events WHERE id = ${id}`) │
│                                                     │
│  SONDERN:                                           │
│  db.from('events').select('*').eq('id', id)        │
│                                                     │
│  → Prepared Statements, automatisch escaped         │
└─────────────────────────────────────────────────────┘
```

**Zusaetzlich:**
- RLS-Policies verhindern Zugriff auf fremde Daten
- Input-Validierung mit Zod vor jeder Datenbankoperation
- Keine Raw-SQL-Queries in der Anwendung
- Migrations nur ueber kontrollierte Migration-Scripts

### 19.6 XSS Prevention

```
┌─────────────────────────────────────────────────────┐
│  React: Automatische Escaping                       │
│  {userInput} → automatisch HTML-escaped             │
│                                                     │
│  NICHT: dangerouslySetInnerHTML verwenden           │
│  WENN DOCH: DOMPurify fuer Sanitization             │
│                                                     │
│  Markdown-Rendering:                                │
│  → remark + rehype-sanitize                         │
│                                                     │
│  Rich Text Editor:                                  │
│  → Tiptap mit konfigurierter erlaubter Liste        │
│                                                     │
│  Content Security Policy:                           │
│  → Keine inline scripts (ausser nonce)              │
└─────────────────────────────────────────────────────┘
```

### 19.7 API Key Management

```typescript
// lib/api-keys.ts
import { randomBytes, createHash } from 'crypto';

export function generateApiKey(): { key: string; hash: string } {
  const key = 'kk_live_' + randomBytes(32).toString('hex');
  const hash = createHash('sha256').update(key).digest('hex');
  return { key, hash }; // Key wird einmalig angezeigt
}

// In der Datenbank wird nur der Hash gespeichert
// AES-256 Verschluesselung fuer sensibele API-Keys von Drittanbietern
export function encryptApiKey(key: string, masterKey: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(masterKey, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(key, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted.toString('hex');
}
```

### 19.8 DSGVO-Compliance Checkliste

| Anforderung | Implementierung |
|------------|-----------------|
| **Auftragsverarbeitung (AVV)** | Mit Hetzner, Supabase |
| **Datenminimierung** | Nur noetige Felder, keine unnötige PII |
| **Recht auf Loeschung** | Soft-Delete + DSGVO-Delete-Endpunkt |
| **Recht auf Auskunft** | Export aller User-Daten als JSON/PDF |
| **Recht auf Datenuebertragbarkeit** | JSON-Export, API-Zugriff |
| **Einwilligungsmanagement** | Opt-in fuer Newsletter, auditiert |
| **Cookie-Banner** | Nur essentielle Cookies beim Login |
| **Breach Notification** | Automatischer Alert bei ungewoehnlichem Zugriff |
| **Datenschutz-Folgenabschaetzung** | Dokumentiert, bei Aenderungen aktualisiert |
| **Server-Standort** | Deutschland (Hetzner Nuernberg) |

---

## 20. Monitoring & Logging

### 20.1 Monitoring-Stack

```
┌─────────────────────────────────────────────────────────┐
│                  Monitoring Stack                        │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │   Uptime     │    │   Grafana    │                  │
│  │   Kuma       │───▶│   + Loki     │                  │
│  │   (Alerts)   │    │   + Prometheus│                  │
│  └──────────────┘    └──────┬───────┘                  │
│                             │                           │
│  ┌──────────────┐    ┌──────┴───────┐                  │
│  │    Sentry    │    │   Grafana    │                  │
│  │  (Errors)    │    │  Dashboards  │                  │
│  └──────────────┘    └──────────────┘                  │
│                                                         │
│  Alerting-Kanaele:                                      │
│  - Email (admin@...)                                    │
│  - Discord/Slack Webhook                                │
│  - PagerDuty (kritisch)                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 20.2 Fehler-Monitoring (Sentry)

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_APP_VERSION,
  tracesSampleRate: 0.1,           // 10% Performance Tracing
  replaysSessionSampleRate: 0.01,  // 1% Session Replay
  replaysOnErrorSampleRate: 1.0,   // 100% bei Fehlern

  beforeSend(event) {
    // PII entfernen
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }
    return event;
  },
});
```

### 20.3 Logging-Architektur (Grafana Loki)

```typescript
// lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined, // Production: JSON fuer Loki

  base: {
    service: 'kleinkunst-dashboard',
    version: process.env.NEXT_PUBLIC_APP_VERSION,
  },

  // Redact sensitive fields
  redact: {
    paths: ['*.password', '*.token', '*.apiKey', '*.secret', 'req.headers.authorization'],
    remove: true,
  },
});

// Verwendung
logger.info({ userId, orgId }, 'User logged in');
logger.warn({ eventId }, 'Event date is in the past');
logger.error({ err }, 'Failed to send newsletter batch');
```

### 20.4 Metriken (Prometheus)

```typescript
// lib/metrics.ts
import { Counter, Histogram, register } from 'prom-client';

// Request Counter
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// Request Duration
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

// Business Metrics
export const eventsCreatedTotal = new Counter({
  name: 'events_created_total',
  help: 'Total events created',
  labelNames: ['organization_id'],
});

export const newsletterEmailsSent = new Counter({
  name: 'newsletter_emails_sent_total',
  help: 'Total newsletter emails sent',
  labelNames: ['campaign_id', 'provider'],
});

// Metrics Endpoint
export async function GET() {
  return new Response(await register.metrics(), {
    headers: { 'Content-Type': register.contentType },
  });
}
```

### 20.5 Alerting-Regeln

| Alert | Bedingung | Kanal | Prioritaet |
|-------|-----------|-------|------------|
| **Server Down** | HTTP 5xx > 1% in 5 Min | Email + Slack | Kritisch |
| **High Latency** | p95 > 2s fuer 5 Min | Slack | Warnung |
| **DB Connection** > 90% | Slack | Warnung |
| **Disk Full** | > 85% genutzt | Email + Slack | Kritisch |
| **Backup Failed** | Letztes Backup > 12h | Email + Slack | Kritisch |
| **Error Spike** | > 10 Fehler/Min | Slack | Warnung |
| **Queue Stuck** | Jobs > 1h alt | Slack | Warnung |
| **SSL Expiry** | < 14 Tage | Email | Info |

### 20.6 Health Checks

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const checks = {
    database: false,
    redis: false,
    storage: false,
    timestamp: new Date().toISOString(),
  };

  try {
    // DB Check
    const supabase = await createClient();
    await supabase.from('organizations').select('id').limit(1);
    checks.database = true;
  } catch {
    checks.database = false;
  }

  try {
    // Redis Check
    await redis.ping();
    checks.redis = true;
  } catch {
    checks.redis = false;
  }

  const allHealthy = checks.database && checks.redis;

  return NextResponse.json(checks, {
    status: allHealthy ? 200 : 503,
  });
}
```

---

## 21. User Stories

### US-11.1: Lokale Entwicklungsumgebung
> Als **Entwickler** moechte ich mit einem einzigen Befehl (`docker-compose up`) eine vollstaendige lokale Entwicklungsumgebung starten, damit ich sofort mit der Entwicklung beginnen kann ohne manuelle Setup-Schritte.

**Akzeptanzkriterien:**
- `docker-compose up` startet App, DB, Redis, Mailpit
- Seed-Daten werden automatisch eingespielt
- Hot-Reload funktioniert fuer Frontend und Backend
- Mailpit zeigt alle ausgehenden Emails
- Lokale Supabase-Instanz (oder Emulation) ist verfuegbar

### US-11.2: Automatisches Deployment
> Als **DevOps-Engineer** moechte ich, dass jeder Push auf `main` automatisch in die Produktion deployt wird (nach bestandenen Tests), damit Deployments schnell und fehlerfrei sind.

**Akzeptanzkriterien:**
- GitHub Actions Pipeline laeuft bei jedem Push
- Tests muessen bestehen vor Deployment
- Staging-Deploy automatisch bei `develop`
- Produktions-Deploy manuelles Approval erforderlich
- Rollback auf vorherige Version moeglich (< 5 Min)
- Deployment-Status ist in GitHub sichtbar

### US-11.3: API-Zugriff fuer Integrationen
> Als **Veranstalter** moechte ich API-Keys erstellen koennen, damit ich die Dashboard-Daten mit meinen eigenen Systemen (Website, Ticketing) verbinden kann.

**Akzeptanzkriterien:**
- API-Keys koennen im UI erstellt werden (Einstellungen > API)
- Jeder Key hat einen Namen und Ablaufdatum
- Berechtigungen sind pro Key konfigurierbar (read/write)
- Keys werden nur einmalig angezeigt (Hash-Speicherung)
- API-Nutzung ist einsehbar (Requests, Limits)
- Keys koennen jederzeit deaktiviert werden

### US-11.4: Echtzeit-Kollaboration
> Als **Team-Mitglied** moechte ich sehen, wenn ein Kollege gerade eine Veranstaltung bearbeitet, damit wir nicht gleichzeitig die gleichen Daten ueberschreiben.

**Akzeptanzkriterien:**
- "Wird bearbeitet von..."-Indikator in Echtzeit
- Aenderungen anderer User werden automatisch sichtbar
- Konflikterkennung bei gleichzeitigem Speichern
- Optimistic Locking mit Version-Checks
- Supabase Realtime fuer alle Listen-Ansichten

### US-11.5: Sichere Datenhaltung
> Als **Veranstalter** moechte ich sicherstellen, dass meine Kundendaten und Veranstaltungsdaten DSGVO-konform in Deutschland gespeichert werden, damit ich keine rechtlichen Risiken habe.

**Akzeptanzkriterien:**
- Alle Daten liegen auf Servern in Deutschland
- SSL/TLS fuer alle Verbindungen
- Verschluesselte Speicherung von API-Keys
- Audit-Log fuer alle Datenzugriffe
- DSGVO-Loeschung moeglich (Recht auf Vergessenwerden)
- Auftragsverarbeitungsvertraege mit allen Anbietern

### US-11.6: Monitoring & Alerts
> Als **Systemadministrator** moechte ich ueber Dashboards und Alerts ueber den Zustand der Anwendung informiert werden, damit ich Probleme proaktiv erkennen kann.

**Akzeptanzkriterien:**
- Grafana-Dashboard mit Key-Metriken (Requests, Latenz, Errors)
- Uptime-Monitoring mit 99.9% SLA-Ziel
- Alerts bei Server-Ausfall oder Error-Spikes
- Log-Suche nach Fehlern und Requests
- Performance-Monitoring pro Route

### US-11.7: Skalierbarkeit bei Wachstum
> Als **Produktmanager** moechte ich, dass die Architektur fuer Wachstum ausgelegt ist (mehr Veranstalter, mehr Daten), ohne dass ein komplettes Redesign noetig ist.

**Akzeptanzkriterien:**
- Multi-Tenancy erlaubt unbegrenzte Organisationen
- PostgreSQL kann mit Read Replicas skaliert werden
- Redis Cluster fuer Caching bei Bedarf
- Dateispeicherung horizontal skalierbar (MinIO Cluster)
- Background Jobs skalieren mit Worker-Prozessen
- CDN-faehig fuer statische Assets

### US-11.8: Backups & Recovery
> Als **Veranstalter** moechte ich, dass meine Daten regelmaessig gesichert werden und im Notfall wiederherstellbar sind, damit ich keinen Datenverlust fuerchte.

**Akzeptanzkriterien:**
- Taegliche automatische Backups (4x/Tag)
- 30-Tage Aufbewahrung
- Restore-Test wird regelmaessig durchgefuehrt
- Point-in-Time Recovery moeglich
- Backup-Status ist im Admin-Dashboard sichtbar

---

## 22. Datenmodell

### 22.1 Architektur-Tabellen

#### `api_keys` (API-Schluessel fuer externe Integrationen)

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Primaerschluessel |
| `organization_id` | UUID | FK → organizations, NOT NULL | Organisation |
| `created_by` | UUID | FK → users, NOT NULL | Ersteller |
| `name` | TEXT | NOT NULL | Bezeichnung (z.B. "Website-Integration") |
| `key_hash` | TEXT | UNIQUE, NOT NULL | SHA-256 Hash des Keys |
| `permissions` | JSONB | DEFAULT '[]' | Erlaubte Ressourcen |
| `rate_limit` | INT | DEFAULT 100 | Requests/Minute |
| `last_used_at` | TIMESTAMPTZ | | Letzte Verwendung |
| `expires_at` | TIMESTAMPTZ | | Ablaufdatum |
| `is_active` | BOOLEAN | DEFAULT TRUE | Aktiv |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Erstellt |
| `deleted_at` | TIMESTAMPTZ | | Soft-Delete |

#### `audit_log` (Audit-Trail fuer alle Datenoperationen)

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Primaerschluessel |
| `organization_id` | UUID | NOT NULL | Organisation |
| `user_id` | UUID | FK → users | Ausfuehrender User |
| `action` | TEXT | NOT NULL | CREATE, READ, UPDATE, DELETE |
| `resource` | TEXT | NOT NULL | Tabellenname |
| `resource_id` | UUID | | Betroffene ID |
| `old_values` | JSONB | | Vorherige Werte |
| `new_values` | JSONB | | Neue Werte |
| `ip_address` | INET | | IP-Adresse |
| `user_agent` | TEXT | | Browser/User-Agent |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Zeitpunkt |

#### `system_settings` (Anwendungskonfiguration)

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK | Primaerschluessel |
| `key` | TEXT | UNIQUE, NOT NULL | Einstellungs-Schluessel |
| `value` | JSONB | NOT NULL | Einstellungs-Wert |
| `description` | TEXT | | Beschreibung |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Letzte Aenderung |

#### `webhook_endpoints` (Eingehende Webhook-Konfiguration)

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK | Primaerschluessel |
| `organization_id` | UUID | FK → organizations | Organisation |
| `name` | TEXT | NOT NULL | Bezeichnung |
| `provider` | TEXT | NOT NULL | Newsletter, Ticketing, etc. |
| `url_path` | TEXT | NOT NULL | Pfad-Segment |
| `secret` | TEXT | NOT NULL | HMAC Secret |
| `is_active` | BOOLEAN | DEFAULT TRUE | Aktiv |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Erstellt |

#### `job_queue_status` (Hintergrund-Job-Status)

| Feld | Typ | Constraints | Beschreibung |
|------|-----|-------------|--------------|
| `id` | UUID | PK | Primaerschluessel |
| `queue_name` | TEXT | NOT NULL | Queue-Name |
| `job_id` | TEXT | NOT NULL | BullMQ Job ID |
| `job_type` | TEXT | NOT NULL | Job-Typ |
| `status` | TEXT | NOT NULL | pending, active, completed, failed |
| `organization_id` | UUID | FK → organizations | Organisation |
| `payload` | JSONB | | Job-Daten |
| `result` | JSONB | | Ergebnis |
| `error` | TEXT | | Fehlermeldung |
| `started_at` | TIMESTAMPTZ | | Startzeit |
| `completed_at` | TIMESTAMPTZ | | Endzeit |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Erstellt |

### 22.2 Beziehungsdiagramm (Architektur-Tabellen)

```
organizations
    │
    ├───> api_keys (organization_id)
    │
    ├───> audit_log (organization_id)
    │
    ├───> webhook_endpoints (organization_id)
    │
    └───> job_queue_status (organization_id)

users
    │
    ├───> api_keys (created_by)
    │
    └───> audit_log (user_id)
```

---

## 23. UI-Komponenten

### 23.1 Architektur-spezifische Komponenten

| Komponente | Zweck | Library |
|------------|-------|---------|
| **ApiKeyManager** | Erstellen, Verwalten, Loeschen von API-Keys | shadcn/ui Table + Dialog |
| **ApiKeyUsageChart** | Requests/Minute, Limits | Recharts |
| **AuditLogViewer** | Audit-Trail mit Filter | shadcn/ui Table + DateRangePicker |
| **SystemHealthCard** | DB, Redis, Storage Status | Custom Cards |
| **QueueMonitor** | BullMQ Queue-Status | Custom Table + Status Badges |
| **BackupStatusCard** | Letztes Backup, Status | Custom Card |
| **WebhookDebugger** | Webhook-Test, Logs | Custom UI |
| **ApiDocsViewer** | OpenAPI/Swagger UI | swagger-ui-react |
| **ErrorBoundary** | Fallback-UI bei Fehlern | React Error Boundary |
| **LoadingSkeleton** | Platzhalter beim Laden | shadcn/ui Skeleton |
| **ConnectionStatus** | Online/Offline-Indikator | Custom (Realtime) |
| **SessionTimeoutWarning** | Warnung vor Session-Ablauf | Custom Dialog |

### 23.2 Admin-Dashboard

```tsx
// app/(dashboard)/admin/page.tsx
export default function AdminPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SystemHealthCard />
      <QueueMonitor />
      <BackupStatusCard />
      <AuditLogViewer limit={50} />
      <ApiKeyManager />
      <ApiDocsLink />
    </div>
  );
}
```

---

## 24. Integrationen

### 24.1 Externe APIs/Services

| Service | Zweck | Auth | Endpoint |
|---------|-------|------|----------|
| **Supabase** | Datenbank, Auth, Realtime, Storage | Service Role Key | `https://{project}.supabase.co` |
| **Redis** | Caching, Sessions, Rate Limit, Queues | Password | `redis://localhost:6379` |
| **Brevo** | Newsletter-Versand | API-Key | `api.brevo.com/v3` |
| **Reservix** | Ticketing-Import | OAuth2 | `api.reservix.de/v1` |
| **Eventbrite** | Ticketing-Import | OAuth2 | `www.eventbriteapi.com/v3` |
| **Hetzner DNS** | DNS-Verwaltung | API-Token | `dns.hetzner.com/api/v1` |
| **Sentry** | Fehler-Tracking | DSN | `oXXXX.ingest.sentry.io` |
| **Wasabi** | Offsite-Backup | API-Key | `s3.eu-central-1.wasabisys.com` |

### 24.2 Interne Services

| Service | Technologie | Port | Zweck |
|---------|-------------|------|-------|
| **App** | Next.js (Docker) | 3000 | Hauptanwendung |
| **PostgreSQL** | Supabase/Postgres | 5432 | Datenbank |
| **Redis** | Redis 7 | 6379 | Cache, Queue, Sessions |
| **MinIO** | MinIO (S3) | 9000 | File Storage |
| **Traefik** | Traefik v3 | 80/443 | Reverse Proxy |
| **Loki** | Grafana Loki | 3100 | Log-Aggregation |
| **Prometheus** | Prometheus | 9090 | Metriken |
| **Grafana** | Grafana | 3001 | Monitoring Dashboard |

---

## 25. Technische Details

### 25.1 Schluessel-Libraries

| Library | Version | Zweck |
|---------|---------|-------|
| `next` | ^14.2.0 | Framework |
| `react` | ^18.3.0 | UI Library |
| `typescript` | ^5.4.0 | Type-Safety |
| `tailwindcss` | ^3.4.0 | Styling |
| `@trpc/server` | ^11.0.0 | API (Server) |
| `@trpc/client` | ^11.0.0 | API (Client) |
| `@trpc/react-query` | ^11.0.0 | tRPC + React Query |
| `@tanstack/react-query` | ^5.28.0 | Server-State |
| `zustand` | ^4.5.0 | Client-State |
| `zod` | ^3.22.0 | Validierung |
| `@supabase/supabase-js` | ^2.39.0 | Datenbank, Auth |
| `bullmq` | ^5.1.0 | Task Queue |
| `ioredis` | ^5.3.0 | Redis Client |
| `pino` | ^8.18.0 | Logging |
| `@sentry/nextjs` | ^7.100.0 | Error Tracking |
| `react-hook-form` | ^7.51.0 | Formulare |
| `@hookform/resolvers` | ^3.3.0 | Zod Integration |
| `date-fns` | ^3.3.0 | Datumsfunktionen |
| `react-big-calendar` | ^1.11.0 | Kalender-Komponente |
| `recharts` | ^2.12.0 | Charts |
| `@dnd-kit/*` | ^6.1.0 | Drag and Drop |
| `jotai` | ^2.6.0 | Atomar-State (optional) |

### 25.2 TypeScript-Konfiguration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/server/*": ["./src/server/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 25.3 Next.js Konfiguration

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Output als Standalone fuer Docker
  output: 'standalone',

  // Bildoptimierung
  images: {
    domains: ['localhost', 'storage.kleinkunst-dashboard.de'],
    formats: ['image/webp', 'image/avif'],
  },

  // i18n
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
  },

  // Headers (Security)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },

  // Rewrites
  async rewrites() {
    return [
      {
        source: '/api/docs',
        destination: '/api/docs/index.html',
      },
    ];
  },

  // Experimental Features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Sentry
  sentry: {
    hideSourceMaps: true,
    autoInstrumentServerFunctions: true,
  },
};

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
];

export default nextConfig;
```

### 25.4 Ordnerstruktur

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth Route Group
│   ├── (dashboard)/              # Dashboard Route Group
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── .../
│   ├── api/                      # API Routes
│   │   ├── trpc/
│   │   ├── webhooks/
│   │   └── rest/
│   ├── layout.tsx                # Root Layout
│   └── globals.css
│
├── components/                   # React Komponenten
│   ├── ui/                       # shadcn/ui (kopiert)
│   ├── layout/                   # Layout-Komponenten
│   ├── dashboard/                # Dashboard-Widgets
│   ├── forms/                    # Formular-Komponenten
│   ├── data-table/               # Tabellen (Pagination, Filter)
│   └── charts/                   # Chart-Komponenten
│
├── hooks/                        # Custom React Hooks
│   ├── use-auth.ts
│   ├── use-permission.ts
│   ├── use-events.ts
│   ├── use-query-params.ts
│   └── use-realtime.ts
│
├── lib/                          # Utilities & Konfiguration
│   ├── supabase/                 # Supabase Clients
│   │   ├── client.ts             # Browser Client
│   │   ├── server.ts             # Server Client
│   │   └── admin.ts              # Admin Client (Service Role)
│   ├── trpc/                     # tRPC Konfiguration
│   │   ├── client.ts
│   │   └── server.ts
│   ├── redis.ts                  # Redis Client
│   ├── cache.ts                  # Caching Utilities
│   ├── logger.ts                 # Pino Logger
│   ├── utils.ts                  # Allgemeine Utils
│   └── constants.ts              # Konstanten
│
├── server/                       # Server-seitiger Code
│   ├── routers/                  # tRPC Router (pro Modul)
│   │   ├── _app.ts               # Root Router
│   │   ├── event.ts
│   │   ├── venue.ts
│   │   └── ...
│   ├── services/                 # Business Logic
│   │   ├── event-service.ts
│   │   └── ...
│   ├── queues/                   # BullMQ Queues
│   │   ├── newsletter.ts
│   │   └── ...
│   ├── middleware/               # Custom Middleware
│   │   ├── auth.ts
│   │   ├── rate-limit.ts
│   │   └── audit.ts
│   └── trpc.ts                   # tRPC Initialisierung
│
├── stores/                       # Zustand Stores
│   ├── dashboard-store.ts
│   └── auth-store.ts
│
├── types/                        # TypeScript Typen
│   ├── auth.ts
│   ├── event.ts
│   └── ...
│
└── styles/                       # Zusaetzliche Styles
    └── ...
```

---

## 26. Akzeptanzkriterien

### 26.1 Definition of Done — Architektur

| # | Kriterium | Status |
|---|-----------|--------|
| 1 | Lokale Entwicklung mit `docker-compose up` funktioniert | Offen |
| 2 | CI/CD Pipeline laeuft durch (Lint, Test, Build, Deploy) | Offen |
| 3 | Alle API-Endpunkte sind dokumentiert (OpenAPI 3.1) | Offen |
| 4 | Authentication funktioniert (OAuth, Magic Link, Passwort) | Offen |
| 5 | RBAC Berechtigungssystem ist implementiert | Offen |
| 6 | RLS-Policies sind auf allen Tabellen aktiv | Offen |
| 7 | Rate Limiting funktioniert (getestet) | Offen |
| 8 | Backups werden automatisch erstellt und getestet | Offen |
| 9 | Monitoring ist aktiv (Sentry, Grafana, Alerts) | Offen |
| 10 | Security-Scan (OWASP Top 10) bestanden | Offen |
| 11 | DSGVO-Checkliste abgearbeitet | Offen |
| 12 | Load-Test mit 100+ gleichzeitigen Usern bestanden | Offen |
| 13 | Penetration-Test durchgefuehrt | Offen |
| 14 | API-Response-Zeit < 200ms fuer 95% der Requests | Offen |
| 15 | SSL-A-Rating (ssllabs.com) erreicht | Offen |
| 16 | Realtime-Updates funktionieren (Supabase Subscriptions) | Offen |
| 17 | Task Queue verarbeitet Jobs zuverlaessig (BullMQ) | Offen |
| 18 | Self-Hosted Deployment auf Hetzner dokumentiert | Offen |
| 19 | Disaster Recovery Plan dokumentiert und getestet | Offen |
| 20 | API-Keys koennen erstellt und verwendet werden | Offen |

### 26.2 Performance-Ziele

| Metrik | Ziel | Messung |
|--------|------|---------|
| **Time to First Byte (TTFB)** | < 200ms | Lighthouse |
| **First Contentful Paint (FCP)** | < 1.2s | Lighthouse |
| **Largest Contentful Paint (LCP)** | < 2.5s | Lighthouse |
| **API-Response (p95)** | < 200ms | Prometheus |
| **API-Response (p99)** | < 500ms | Prometheus |
| **Database Query (p95)** | < 50ms | PostgreSQL Logs |
| **Redis Latenz (p95)** | < 5ms | Redis INFO |
| **Queue Processing** | < 5s/job | BullMQ Metrics |
| **Build-Zeit** | < 3 Min | CI/CD Pipeline |
| **Deploy-Zeit** | < 2 Min | CI/CD Pipeline |

### 26.3 Sicherheits-Ziele

| Anforderung | Ziel | Status |
|-------------|------|--------|
| SSL Labs Rating | A+ | Offen |
| Security Headers | Alle gesetzt (CSP, HSTS, etc.) | Offen |
| Dependency Scan | Keine kritischen CVEs | Offen |
| SQL Injection | Nicht moeglich (Prepared Statements) | Offen |
| XSS | Nicht moeglich (React Escaping + CSP) | Offen |
| CSRF | Geschuetzt (SameSite + Token) | Offen |
| Rate Limiting | Alle Ebenen aktiv | Offen |
| API-Key Security | Hash-Speicherung, nie Plaintext | Offen |
| Session Security | HttpOnly, Secure, SameSite=Strict | Offen |
| Audit Logging | Alle Datenoperationen geloggt | Offen |

---

## A. Glossar

| Begriff | Bedeutung |
|---------|-----------|
| **tRPC** | TypeScript RPC — typsichere API ohne Code-Generierung |
| **RLS** | Row Level Security — Datenbank-Sicherheit auf Zeilenebene |
| **BullMQ** | Redis-basierte Task Queue fuer Node.js |
| **ISR** | Incremental Static Regeneration — Next.js Feature |
| **RSC** | React Server Components — Server-seitige React-Komponenten |
| **PKCE** | Proof Key for Code Exchange — sicherer OAuth-Flow |
| **TTFB** | Time to First Byte — Zeit bis erste Antwort vom Server |
| **DSGVO** | Datenschutz-Grundverordnung — EU-Datenschutzrecht |
| **CSP** | Content Security Policy — XSS-Schutz via Header |
| **HSTS** | HTTP Strict Transport Security — HTTPS-Enforcement |

## B. Referenzen

- [Next.js 14 Dokumentation](https://nextjs.org/docs)
- [tRPC Dokumentation](https://trpc.io/docs)
- [Supabase Dokumentation](https://supabase.com/docs)
- [BullMQ Dokumentation](https://docs.bullmq.io/)
- [OWASP Top 10 (2021)](https://owasp.org/Top10/)
- [Hetzner Cloud Dokumentation](https://docs.hetzner.com/cloud/)
- [Coolify Dokumentation](https://coolify.io/docs/)
- [Grafana Loki Dokumentation](https://grafana.com/docs/loki/)

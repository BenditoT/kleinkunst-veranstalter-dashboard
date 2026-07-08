# Plan: Kleinkunst-Veranstalter App — Recherche, Planung & Coding-Prompt

## Ziel
Eine universelle Dashboard-App für Kleinkunst-Veranstalter, die Konzertplanung über ~10 Orte, Musiker-Datenbank, Newsletter-Management (Mailchimp-Style), Social-Media-Automatisierung, Finanzierung/GEMA, KI-Integration und mehr abdeckt.

## Aktuelle Architekturentscheidung — 08.07.2026
**Backend-Default:** Google Cloud wird vorbereitet.

**Supabase:** Migration frühestens am **24.07.2026** einplanen. Bis dahin bleibt Supabase nur als vorbereiteter Adapter und SQL-Schemaquelle im Projekt.

**Warum:** Die App soll nicht hart an einen Backend-as-a-Service gekoppelt werden. Postgres bleibt das Datenmodell-Zentrum, damit Cloud SQL, Supabase, Neon oder Self-Hosted Postgres später austauschbar bleiben.

**Vorbereitung jetzt:**
- Provider-Konfiguration in `lib/config/backend.ts`
- Environment-Beispiel in `.env.example`
- Architekturentscheidung in `docs/architecture/backend-provider.md`
- UI- und Feature-Code darf keine direkten Supabase-/Firebase-/Google-SDK-Imports enthalten

## Stufe 1 — Recherche (deep-research-swarm)
**Ziel:** Bestehende Lösungen, Konkurrenz, relevante APIs, technische Möglichkeiten recherchieren.
**Skills:** deep-research-swarm
- Agent 1a: Konkurrenzanalyse — Bestehende Tools für Veranstalter (Event Management, Newsletter, Social Media Automation, Finanzen/GEMA)
- Agent 1b: Technische Recherche — APIs für Social Media, E-Mail-Tracking, KI-Integration, Kalender-Sync, Newsletter-Systeme
- Agent 1c: Feature-Ideen — Was bieten führende Apps noch an? (CRM, Ticketing, Presse-Verteiler, Automatisierungs-Workflows)
- Agent 1d: Architektur-Recherche — Moderne Tech-Stacks für Dashboard-Apps, Realtime-Datenbanken, KI-Integration (lokal vs. API)

## Stufe 2 — Feature-Planung & Architektur
**Ziel:** Aus Recherche-Ergebnissen einen vollständigen Feature-Katalog und Architekturentwurf erstellen.
**Skills:** report-writing (übergreifend, nicht akademisch)
- Feature-Matrix mit Priorisierung
- Datenbankschema (Orte, Musiker, Newsletter-Empfänger, Events, Finanzen)
- Systemarchitektur (Frontend, Backend, Datenbank, APIs, KI)
- UI/UX-Konzept für das Dashboard

## Stufe 3 — Technische Dokumentation
**Ziel:** Ausführliche technische Spezifikation für die Umsetzung vorbereiten.
- API-Spezifikationen
- Datenbank-Schema detailliert
- Komponenten-Struktur
- Automatisierungs-Workflows
- KI-Integrationspunkte

## Stufe 4 — Coding-Prompt Erstellung
**Ziel:** Einen sehr ausführlichen, strukturierten Prompt schreiben, der auf ein Sprint-Protokoll verweist und die komplette App-Beschreibung enthält.

## Output
- Recherche-Dokument (.md)
- Planungs-Dokument (.md)  
- Technische Spezifikation (.md)
- Ausführlicher Coding-Prompt (.md)
- Final: Alles als .docx

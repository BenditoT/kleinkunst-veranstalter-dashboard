# Kleinkunst-Veranstalter App: Recherche & Planungsreport

**Version:** 1.0
**Datum:** Januar 2025
**Autor:** Produktplanung & Strategie
**Quellen:** 22 Recherche-Dokumente (10 Wide Exploration, 12 Deep Dive Dimensionen), 200+ Primärquellen

---

## Executive Summary

Der deutsche Kleinkunstmarkt befindet sich in einer tiefgreifenden Digitalisierungskrise. Obwohl Deutschland über 70 Millionen Konzertbesucher pro Jahr verzeichnet und kleine Spielstatten die Rückgrat der Kulturlandschaft bilden, existiert **keine Software, die speziell für Kleinkunstveranstalter mit mehreren Spielorten** konzipiert ist. Die einzige identifizierte deutsche Kulturspezialisierung (eventbrain) ist als Ein-Mann-Produkt limitiert; Enterprise-Tools wie Cvent ($19.500/Jahr) oder Bizzabo ($18.000/Jahr) sind völlig unerschwinglich; reine Ticketing-Plattformen wie Reservix decken nur Teilbereiche ab. Die Insolvenz von Koka36 im Februar 2026 – einer der bekanntesten Konzertkassen – hat die Brüchigkeit der Infrastruktur schmerzhaft offenbart (hochfünfstellige Verluste für betroffene Clubs).

Diese Recherche belegt eine **klare Marktlücke** für eine universelle Dashboard-App, die alle Kernprozesse eines Kleinkunstveranstalters in einer Plattform vereint: Veranstaltungsmanagement, Newsletter-Marketing, Social Media Automation, GEMA-Abwicklung, KI-gestützte Texterstellung, Pressearbeit, Ticketing/CRM, Multi-Orte-Kalender und Compliance. Die Zielgruppe sind Veranstalter mit 3-10 Spielorten, 50-200 Events/Jahr und einem Software-Budget von 200-500 EUR/Monat.

**Kernempfehlung:** Entwicklung einer Next.js-basierten Full-Stack-App mit PostgreSQL (Supabase), selbst-gehostet auf Hetzner-Servern in Deutschland für maximale DSGVO-Konformität. Phasenweise Implementierung über 4 Quartale, ab Q2 produktiver MVP.

---

## 1. Marktanalyse & Konkurrenz

### 1.1 Marktlücke: Die digitale Kluft im Kulturbetrieb

Die Recherche identifiziert eine signifikante Marktlücke für Kleinkunstveranstalter mit mehreren Spielorten. Eine Masterarbeit zur digitalen Transformation in Kulturbetrieben (RPTU Kaiserslautern) stellt fest: *"Problematisch ist aufgrund der geringen Nachfrage, dass es gerade für den Kulturbetrieb wenige geeignete Softwarelösungen gibt und bei den derzeit erhältlichen Lösungen viele Adaptionen durchzuführen sind."* Die KMK-Studie (2023) bestätigt: *"Für große Anbieter ist der Kulturbereich ökonomisch oft nicht attraktiv genug, um spezifische Lösungen anzubieten."*

Die zentrale Lücke: **Multi-Location-Management für deutsche Kleinkunst**. Prism.fm bietet dies in den USA, Momentus adressiert Kulturzentren auf Enterprise-Ebene – aber kein Wettbewerber bedient den deutschen Kleinkunstveranstalter mit 3-10 Spielorten.

### 1.2 Wettbewerbsmatrix

| # | Anbieter | Kategorie | Preis (ab) | Zielgruppe | Schwächen |
|---|----------|-----------|------------|------------|-----------|
| 1 | **eventbrain** | Kultur-Spezialist | EUR 99/Mo | Kultur-Veranstalter, Agenturen | Ein-Mann-Produkt; kein Multi-Venue-Fokus; keine GEMA-Integration |
| 2 | **Prism.fm** | Live-Music-Plattform | ca. $200/Mo | Live-Music-Venues (USA) | US-only; keine deutsche Lokalisierung |
| 3 | **Cvent** | Enterprise | $19.500/Jahr | Große Konferenzen | Zu teuer und komplex für Kleinkunst |
| 4 | **Bizzabo** | Enterprise | $18.000/Jahr | Mid-to-Large B2B Events | Kein Kultur-Bezug; zu teuer |
| 5 | **Reservix** | Ticketing | Transaktionsbasiert | Kultur (DE) | Reines Ticketing; kein Management |
| 6 | **Tickyt** | Ticketing | Custom | Museen, Theater | Kein Veranstaltungsmanagement |
| 7 | **Gigwell** | Booking | EUR 104/Mo | Künstler, Agenten | Kein Venue-Management; keine GEMA |
| 8 | **Artistu** | Booking | EUR 49/Mo | Booking Agencies | Kein Multi-Venue; keine deutsche GEMA |
| 9 | **Hi.Events** | Open-Source | Kostenlos | Selbst-Getriebene | Hoher Selbst-Hosting-Aufwand |
| 10 | **Pretix** | Open-Source | 2,5%/Ticket | Ticketing-Fokus | Keine Ganzheitslösung |

### 1.3 Wettbewerbsanalyse

**Niemand bedient die Zielgruppe:**
- **Enterprise-Tools** (Cvent, Bizzabo) sind 20-50x zu teuer und zu komplex für kleine Teams
- **Ticketing-Plattformen** (Reservix, Tickyt) decken nur den Verkaufsprozess ab
- **Booking-Tools** (Gigwell, Artistu) fokussieren auf Künstler, nicht auf Veranstalter
- **Die einzige deutsche Lösung** (eventbrain) ist als Solo-Produkt limitiert
- **Open-Source** (pretix, Hi.Events) erfordert technisches Know-how, das Kulturbetriebe selten haben

### 1.4 Die Koka36-Katastrophe als Weckruf

Die Insolvenz der Kreuzberger Konzertkasse Koka36 (Februar 2026) ist symptomatisch: SO36 (EUR 40.000+ Verlust), Lido, Astra, Festsaal Kreuzberg und andere betroffen. Mindestens hochfünfstelliger Gesamtschaden. Der Insolvenzverwalter stellte fest, dass Geld *"nicht so treuhänderisch verwahrt wurde, wie man sich das vorstellt"*. Dies schafft eine einmalige Marktchance: Veranstalter suchen nach digitaler Unabhängigkeit und resilienteren Prozessen.

### 1.5 Preispositionierung

Der Sweet Spot für Kleinkunstveranstalter liegt bei **99-299 EUR/Monat**. Die Preisspanne 39-150 EUR/Monat (vergleichbar mit eventbrain, Artistu, SystemOne) ist für Solo-Veranstalter akzeptabel. Teams ab 3-5 Personen zahlen bis zu 300 EUR/Monat – immer noch 5-8x günstiger als Enterprise-Lösungen.

---

## 2. Zielgruppe & Personas

### 2.1 Primäre Zielgruppe

Unabhängige Kleinkunstveranstalter in Deutschland mit folgenden Merkmalen:
- **3-10 Spielorte** (Kneipentheater, Kulturzentren, Schaubühnen, Clubs)
- **50-200 Veranstaltungen/Jahr**
- **Teamgröße:** 1-10 feste Mitarbeiter + Freelancer
- **Budget:** 200-500 EUR/Monat für Software
- **Technologie-Niveau:** Mittel bis niedrig; Excel, Google Calendar, E-Mail

### 2.2 Persona 1: "Kultur-Clara" – Die alleinige Veranstalterin

| Attribut | Details |
|----------|---------|
| **Name** | Clara Schmidt |
| **Alter** | 38 Jahre |
| **Rolle** | Geschäftsführerin, Kleinkunstbüro "ZwischenRaum" |
| **Standort** | Leipzig, Sachsen |
| **Team** | 2 feste Mitarbeiter + Freelancer |
| **Spielorte** | 4 feste Spielorte |
| **Veranstaltungen/Jahr** | ~120 Events |
| **Größte Schmerzen** | Überblick über 4 Spielorte verlieren; GEMA-Abrechnungen zeitraubend; Programmheft manuell in InDesign; keine zentrale Finanzübersicht |
| **Budget** | EUR 200-300/Monat |

*Zitat: "Ich verbringe jeden Montag 4 Stunden damit, die GEMA-Meldungen für die vergangene Woche zusammenzutragen. Das muss automatisch gehen."*

### 2.3 Persona 2: "Theater-Torsten" – Der Kulturzentrum-Leiter

| Attribut | Details |
|----------|---------|
| **Name** | Torsten Müller |
| **Alter** | 52 Jahre |
| **Rolle** | Leiter Kulturzentrum "Alte Molkerei" |
| **Standort** | Augsburg, Bayern |
| **Team** | 8 feste Mitarbeiter |
| **Spielorte** | 1 Hauptgebäude mit 3 Sälen + 2 externe Kooperationsorte |
| **Veranstaltungen/Jahr** | ~200 Events |
| **Technologie-Niveau** | Niedrig-Mittel; braucht Einführungsschulung |
| **Größte Schmerzen** | Mitarbeiter nutzen verschiedene Tools; Programmheft-Druck ist jedes Mal ein Drama; Förderberichte manuell; Settlement per E-Mail/Excel |
| **Budget** | EUR 300-500/Monat |

---

## 3. Feature-Übersicht (alle Module)

Die App besteht aus 9 Kernmodulen, die den gesamten Veranstaltungs-Lebenszyklus abdecken:

| # | Modul | Beschreibung | Komplexität | Priorität |
|---|-------|-------------|-------------|-----------|
| 1 | **Dashboard & UX** | Widget-basiertes Dashboard, Drag-and-Drop, Dark/Light Mode, globale Suche, Notifications, RBAC | Mittel | P0 |
| 2 | **Kalender & Multi-Orte** | Multi-Venue-Kalender, Konflikterkennung, Google/Outlook-Sync, iCal-Feeds, Spielort-Verwaltung | Hoch | P0 |
| 3 | **GEMA & Finanzen** | Tarifrechner, Vor-/Nachmeldung, Setlisten, Budgetplanung, Break-Even, Fördertracking, DATEV-Export | Hoch | P0 |
| 4 | **Newsletter-System** | Drag-and-Drop Editor, Double-Opt-In, Preference Center, Smart Sending, Segmentierung, Automation Workflows | Hoch | P1 |
| 5 | **Social Media Automation** | Cross-Posting, Scheduling, Media Library, Event-Sync, Analytics | Hoch | P1 |
| 6 | **KI-Integration** | Textgenerierung (Event-Beschreibungen, Social Posts, Pressemitteilungen), Bildgenerierung, Übersetzung, 3 Betriebsmodi | Mittel | P1 |
| 7 | **Presse & PR** | Journalisten-Datenbank, Pressemitteilungen, Verteiler, Digitale Pressemappe, Medienbeobachtung | Mittel | P2 |
| 8 | **Ticketing & CRM** | Ticket-Typen, Gästelisten, QR-Code Check-in, Reservierungen, Warteliste, Newsletter-Sync | Hoch | P2 |
| 9 | **DSGVO & Compliance** | Einwilligungs-Management, Audit-Log, Recht auf Vergessenwerden, Datenexport, EU AI Act | Mittel | P0 |

---

## 4. Technische Architektur

### 4.1 Kernarchitektur

**Monolith mit modularem Aufbau** — ein Next.js 14+ Full-Stack-Application. Dies minimiert Komplexität für ein kleines Entwicklerteam, ermöglicht aber spätere Extraktion.

| Schicht | Technologie | Begründung |
|---------|-------------|------------|
| **Framework** | Next.js 14+ (App Router) | Größtes React-Ökosystem, SSR, API Routes, Server Actions |
| **Sprache** | TypeScript 5.3+ | End-to-end Type-Safety, Refactoring-Sicherheit |
| **Styling** | Tailwind CSS 3.4+ | Utility-First, Dark Mode nativ, Design-System |
| **UI-Komponenten** | shadcn/ui + Radix UI | Kopierbar, anpassbar, keine Lock-in, Accessibility out-of-the-box |
| **Datenbank** | PostgreSQL 15+ (Supabase) | ACID, JSONB, Full-Text Search, RLS, DSGVO-konforme DE-Server |
| **Auth** | Supabase Auth | Integriert, kostenlos, DSGVO-konform |
| **API (intern)** | tRPC 11+ | End-to-end Type-Safety, automatische Typinferenz |
| **API (extern)** | REST (OpenAPI) | Standard für externe Integrationen |
| **State Management** | Zustand + TanStack Query | Minimal, Server-State via Query |
| **Task Queue** | BullMQ + Redis | Robust, Delayed Jobs, Dashboard |
| **File Storage** | Supabase Storage | Integriert, DSGVO-konform |
| **Hosting** | Hetzner Cloud + Coolify | Selbst-Hosting = Datensouveränität, ~20-40 EUR/Monat |
| **CI/CD** | GitHub Actions | Nahtlose Integration, kostenlos |
| **Monitoring** | Sentry + Uptime Kuma | Fehler-Tracking + Self-Hosted Uptime |

### 4.2 Self-Hosting vs. Cloud

Für Kulturveranstalter in Deutschland ist **Self-Hosting auf Hetzner** die klare Empfehlung:
- **DSGVO-Konformität:** Daten bleiben in Deutschland
- **Kostenkontrolle:** ~20-40 EUR/Monat vs. $20-100+/Monat bei Vercel
- **Datenhoheit:** Kein Vendor Lock-in, keine Abhängigkeit von US-Anbietern
- **Performance:** Niedrige Latenz für deutsche Nutzer

### 4.3 MVP-Kosten

| Phase | Technologie | Kosten |
|-------|-------------|--------|
| **MVP-Phase** | Hetzner CX22 + Coolify + PostgreSQL + Redis | ~15-25 EUR/Monat |
| **Produktiv-Phase** | Hetzner CX32 + Supabase Pro + Sentry | ~50-100 EUR/Monat |
| **Scale** | Hetzner CPX51 + Read Replicas + CDN | ~150-300 EUR/Monat |

---

## 5. Datenbankschema (Zusammenfassung)

### 5.1 Kern-Entitäten

Das Schema basiert auf PostgreSQL mit UUID-Primärschlüsseln, Multi-Tenant-Trennung via `organization_id`, Soft Deletes, und Row Level Security (RLS) auf allen Tabellen.

**Haupttabellen (Core):**
- `organizations` – Mandanten-Trennung
- `users` + `organization_members` – Benutzer & Rollen
- `venues` – Spielort-Profile mit Kapazität, Technik, Kontakten
- `venue_rooms` – Räume/Säle pro Spielort
- `artists` – Künstlerprofile mit Bio, Genre, Social Media
- `events` – Veranstaltungen mit Datum, Spielort, Status, GEMA-Status
- `event_artists` – Zuordnung Künstler ↔ Event mit Gage, Spielzeit

**Kommunikations-Tabellen:**
- `newsletter_subscribers` + `subscriber_tags` – Empfängerverwaltung
- `email_campaigns` + `email_templates` – Newsletter
- `social_accounts` + `social_posts` – Social Media
- `press_contacts` + `press_releases` – Pressearbeit

**Finanz-Tabellen:**
- `gema_meldungen` + `gema_setlists` – GEMA-Abwicklung
- `event_budgets` + `budget_positions` – Budgetplanung
- `artist_fees` – Gagenverwaltung
- `cash_register` – Kassenbuch
- `tax_summaries` – Steuerübersicht

**KI-Tabellen:**
- `ai_providers` – Konfiguration (OpenAI, Ollama, etc.)
- `prompt_templates` – Wiederverwendbare Prompts
- `ai_generations` – Generierungshistorie mit Kosten-Tracking

**Compliance-Tabellen:**
- `consents` – Einwilligungs-Tracking
- `audit_log` – Tamper-proof Audit-Trail
- `deletion_requests` – Recht auf Vergessenwerden

---

## 6. Modul-Details

### 6.1 Newsletter-System

Das Newsletter-Modul ist ein vollständig integriertes E-Mail-Marketing-System mit DSGVO-Konformität. **Kerninsight:** Open Rates als KPI sind durch Apple Mail Privacy Protection (MPP) obsolet geworden — 49-64% aller E-Mail-Öffnungen werden durch Apples Proxy-Server künstlich aufgebläht. Die App setzt daher auf **Click-Through-Rate (CTR ~2,05%) als Primärmetrik**.

**Technische Basis:** Eigenes System mit SMTP-Integration (Brevo, rapidmail, SendGrid). Double-Opt-In mit Consent-Timestamp und Quelle, One-Click-Unsubscribe (RFC 8058), Preference Center mit Themen-/Frequenzwahl, Smart-Sending (KI-gesteuerte Sendezeit-Optimierung), Segmentierung nach Spielort/Engagement/Verhalten, Automation Workflows (Willkommen, Reminder, Follow-up), A/B-Testing für Subject Lines, Drag-and-Drop Editor mit kulturspezifischen Inhaltsblöcken.

**Kritische Erkenntnis:** Deutsche/EU-basierte Anbieter wie CleverReach (15 EUR/Monat) und rapidmail bieten DSGVO-Konformität mit deutschem Serverstandort. Für die Integration empfiehlt sich ein hybrider Ansatz: Eigener Versand via SMTP mit Fallback zu etablierten deutschen Providern.

### 6.2 Social Media Automation

Das Social Media Hub ermöglicht die zentrale Steuerung aller Kanäle. **Kerninsight:** Einfaches identisches Cross-Posting ist nicht empfohlen — jede Plattform hat unterschiedliche Formate und Zielgruppen. Die App adaptiert Content automatisch pro Plattform.

**Unterstützte Plattformen:** Facebook (Graph API, 25 Posts/Seite/Tag), Instagram (Graph API, 200 Calls/Stunde, nur visuelle Posts), Twitter/X (API v2, Free: 500 Posts/Monat, Basic: $200/Monat), TikTok (Content Posting API, ~15 Posts/Tag, keine nativen Sounds), LinkedIn (REST API, 3.000 Zeichen), Google Business Profile (Events/Posts), Mastodon (Fediverse).

**Kritische API-Einschränkungen:** Instagram reduzierte 2025 die Rate Limits von 5.000 auf 200 Calls/Stunde (96%-Rückgang). Twitter/X hat Free-Tier auf 500 Posts/Monat limitiert und Basic auf $200/Monat erhöht. TikTok kann keine nativen Sounds auswählen — für Musik-Events eine massive Einschränkung. Meta erfordert einen aufwändigen App Review (Screencast, 5+ Werktage).

**Empfohlene Strategie:** Meta Business Suite (kostenlos für FB/IG) + eigene App für Cross-Posting auf alle anderen Plattformen. Beste Posting-Zeiten für Kultur: Di/Mi 12-20 Uhr (Facebook), Di 13-19 Uhr (Instagram), Di/Do 14-18 Uhr (TikTok).

### 6.3 GEMA & Finanzen

Das GEMA & Finanzmodul ist ein Alleinstellungsmerkmal — **kein Wettbewerber hat integrierte GEMA-Features**. Seit Juli 2025 müssen alle Konzerte ausschließlich über das GEMA-Online-Portal angemeldet werden.

**GEMA-Tarife:**
- **Tarif U-K (Unterhaltungskonzerte):** 5,75% der Bruttoeinnahmen bis 2.000 Besucher, 7,60% bis 15.000, 8,00% darüber
- **Mindestsatz:** 23,55 EUR pro Veranstaltung (bis 150 Personen)
- **Jahrespauschalvertrag:** Ab 11 Veranstaltungen 10% Nachlass; ab 31 Veranstaltungen 14,5% Nachlass
- **Einführungsphase/Nachwuchs:** 4,50% bei max. 300 Besucher, höchstes Eintritt 20 EUR

**Finanzmodul:** Automatischer GEMA-Tarifrechner aus Event-Daten, Voranmeldung mit PDF-Export, Nachmeldung mit Ist-Vergleich, Setlisten-Verwaltung, Budgetplanung (Einnahmen/Ausgaben), Break-Even-Analyse mit interaktivem Chart, Gagenverwaltung mit Richtwerten (350-2.000 EUR/Abend), Live 500 Fördertracking (500-1.000 EUR/Event), Kassenbuch, Steuer-Übersicht (7% vs. 19%), DATEV-konformer Export.

**Kritisch:** Das GEMA-Portal bietet keine öffentliche API. Die Automatisierung erfolgt über PDF-Export/Import und Excel-Formate.

### 6.4 KI-Integration

Das KI-Modul unterstützt **drei Betriebsmodi**: Cloud-KI (OpenAI API), Lokale KI (Ollama/LM Studio) und Hybrid-Modus. **Kerninsight:** GPT-4o-mini kostet nur $0,15 pro Million Input-Tokens — ein vollständiges Text-Paket (Event-Beschreibung + 5 Social Posts + Pressemitteilung + Newsletter) kostet weniger als 1 Cent.

**Anwendungsfälle:** Event-Beschreibungen aus Stichworten, plattformspezifische Social-Media-Posts (Zeichenlimits, Hashtags, Emojis), Pressemitteilungen nach DIN-5008, Newsletter-Texte mit Personalisierung, Bildgenerierung für Flyer (DALL-E 3, ~$0,04/Bild), mehrsprachige Übersetzung (DeepL API, 500.000 Zeichen/Monat kostenlos).

**DSGVO-Konformität:** OpenAI API-Daten werden NICHT für Modelltraining verwendet (opt-out by default). Ein Data Processing Addendum (DPA) ist verfügbar. Für maximale Konformität: Lokale Modelle (Llama 3.2 3B läuft auf Standard-Laptops) oder EU-Anbieter (Mistral, Paris).

**Kostenrealistisch:** Bei 100 Events/Monat, jeweils 5 Texte → ~$0,13/Monat mit GPT-4o-mini.

### 6.5 Presse & PR

Das Presse-Modul digitalisiert den gesamten PR-Workflow. **Kerninsight:** PR für Kleinkunst ist anders als klassische PR — nicht um Produkte, Trends, Profite, sondern um künstlerische Haltung, kulturelle Bedeutung und gesellschaftliche Relevanz.

**Funktionen:** Journalisten-Datenbank (Import aus CSV, Tags nach Themen, Kontakt-Historie), KI-gestützte Pressemitteilungen (DIN-5008, Embargo-Funktion, Versionshistorie), selektiver Versand (Themen-Filter, SMTP-Integration, Presseportal-Webhook), digitale Pressemappe (öffentliche URL, Download-Tracker, QR-Code), Medienbeobachtung (Google Alerts RSS, manuelle Clippings, Sentiment), PR-Kalender (Embargos, Follow-ups, iCal-Export), automatische Meldung an öffentliche Event-Kalender.

**Vergleich:** Cision kostet 10.000-30.000 EUR/Jahr, Mynewsdesk 200 EUR/Monat. Die integrierte Lösung ist deutlich kostengünstiger und spezifisch auf Kultur zugeschnitten.

### 6.6 Ticketing & CRM

Das Ticketing-Modul bildet den vollständigen Ticket-Lifecycle ab. **Kerninsight:** Die Koka36-Insolvenz hat gezeigt, dass Veranstalter Treuhand-Verwahrung und Datenportabilität als kritisch betrachten.

**Funktionen:** Flexible Ticket-Typen (VVK, AK, ermäßigt, Pay-What-You-Want, Freikarten, Staff), QR-Code-basierte Check-in mit Offline-Modus, Gästelisten-Management, Reservierungen mit automatisierter Stornierung, Warteliste für ausverkaufte Events, Newsletter-Integration (Double-Opt-In bei Ticketkauf), Export für Einlasskontrolle.

**Strategische Entscheidung:** Kein eigener Ticketverkauf in Phase 1 — stattdessen Integration mit bestehenden Systemen (Reservix, Eventbrite) via APIs und Widgets. Der Fokus liegt auf Gästelisten-Management, Check-in und CRM, nicht auf dem Konkurrenz-Ticketing.

### 6.7 Kalender & Multi-Orte

Das zentrale Ressourcenmanagement-System. **Kerninsight:** Multi-Venue-Events erfordern typischerweise 40-60% mehr Koordinationsaufwand.

**Funktionen:** Spielort-Profile (Adresse, Kapazität, Technik, Kontakte, Verträge), farbcodierter Multi-Orte-Kalender (Woche/Monat/Agenda), Event-Spielort-Zuordnung mit automatischer Konflikterkennung, bidirektionale Synchronisation mit Google Calendar & Outlook, iCal-Feed Export (öffentlich/token-geschützt), automatische Befüllung von Kulturservern und Stadtportalen, Spielort-Notizen und Vertragsverwaltung, Auswertungen pro Spielort.

**Technisch:** Google Calendar API (kostenlos, 1 Mio. Queries/Tag), Microsoft Graph API (getSchedule für 20 Mailboxen), CalDAV für bidirektionale Synchronisation, iCal-Feeds für öffentliche Kalender.

### 6.8 Dashboard & UX

Das Dashboard ist die zentrale Benutzeroberfläche. **Kerninsight:** Dashboards für nicht-technische Nutzer scheitern häufig, weil sie von Data-People für Data-People gebaut werden.

**Design-Prinzipien:** 10-Sekunden-Regel (<7 visuelle Elemente pro Widget), Progressive Disclosure, Text-Labels statt Icons, explizite Speichern-Buttons (kein Auto-Save für Nicht-Techniker), Dropdowns statt Tabs, maximale 5 KPIs auf dem Hauptbildschirm.

**Funktionen:** Widget-basiertes Dashboard mit Drag-and-Drop (react-grid-layout), Dark/Light Mode (#0f172a Soft Dark), globale Suche (Cmd/Ctrl+K, PostgreSQL Full-Text-Search), Notification-Inbox (WebSocket, Echtzeit), responsive Design (4/8/12-Spalten-Grid), rollenbasierte Views (Admin, Manager, Staff, Künstler), KI-Widgets (Predictive Analytics, NLP Querying).

**Accessibility:** WCAG 2.2 AA als Minimum, 4.5:1 Text-Kontrast, Keyboard-Navigation, ARIA-Labels, Screen-Reader-Support, 400% Zoom-Support.

### 6.9 DSGVO & Compliance

Das Compliance-Modul ist die Vertrauensinfrastruktur. **Kerninsight:** Kulturveranstalter verarbeiten besonders sensible Daten (Künstlerverträge, Gästelisten, Newsletter-Einwilligungen) und brauchen maximalen Datenschutz.

**Funktionen:** Einwilligungs-Management (DSGVO-konform, Zeitstempel, IP-Hash, Versionskontrolle), Double-Opt-In mit 48h-Verifizierungslink, Recht auf Vergessenwerden (Selbstbedienungsportal, 30-Tage-Wartefrist, Audit-Trail), Datenexport (JSON/CSV, Art. 20 DSGVO), tamper-proof Audit-Log (2 Jahre Aufbewahrung), EU AI Act Vorbereitung (KI-Verzeichnis, Human-in-the-Loop), Compliance-Dashboard mit Ampel-System.

**Alleinstellungsmerkmal:** Selbst-Hosting auf Hetzner in Deutschland. Keine US-Cloud, keine Datenweitergabe an Dritte, maximale Kontrolle.

---

## 7. Preismodell & Go-to-Market

### 7.1 Preismodell

| Tier | Preis | Zielgruppe | Inkludiert |
|------|-------|------------|------------|
| **Starter** | EUR 49/Monat | Solo-Veranstalter, 1-2 Spielorte | Kalender, GEMA-Rechner, Basis-Newsletter, 1 Social Account |
| **Professional** | EUR 149/Monat | Kleinkunstveranstalter, 3-8 Spielorte | Alle Module, 5 Social Accounts, KI-Integration, bis 5 Nutzer |
| **Pro+** | EUR 299/Monat | Kulturzentren, 8-15 Spielorte | Alle Features, unbegrenzte Social Accounts, bis 15 Nutzer, API-Zugang |
| **Enterprise** | Auf Anfrage | Mehrere Veranstalter, Netzwerke | Custom Integration, Dedicated Support, White-Label |

### 7.2 Go-to-Market-Strategie

**Phase 1 (Q1-Q2): Validierung**
- Closed Beta mit 5-10 Kleinkunstveranstaltern in Leipzig, Berlin, Hamburg
- Kostenlos im Austausch für Feedback und Case Studies
- Fokus auf Kalender, GEMA und Newsletter

**Phase 2 (Q3-Q4): Lancierung**
- Öffentlicher Launch mit Starter- und Professional-Tier
- Partnerschaften mit Kulturbüros, Theaterverbänden, Landesmusikräten
- Content-Marketing: Blog mit GEMA-Tipps, Kalkulationsvorlagen, Best Practices

**Phase 3 (Jahr 2): Skalierung**
- Pro+-Tier für Kulturzentren
- API-Ökosystem für Integrationen
- Internationalisierung (Österreich, Schweiz)

**Wachstumshebel:**
- Word-of-Mouth in der engen Kulturszene
- Kulturförderung als Akquisitionskanal (Initiative Musik, Kulturstiftungen)
- KI-generierte GEMA-Tipps als viraler Content
- Integration mit etablierten Kulturplattformen (Kulturserver)

---

## 8. Roadmap & Phasenplan

### Phase 0: Foundation (Monat 1-2)
- Tech-Stack Setup (Next.js, Supabase, Tailwind, shadcn/ui)
- Datenbankschema implementieren
- Auth-System (Supabase Auth mit RBAC)
- Basic Dashboard-Layout mit Dark Mode
- **Ergebnis:** Laufende Entwicklungsumgebung, Login, Basis-Dashboard

### Phase 1: Core (Monat 3-4)
- Spielort-Verwaltung + Multi-Orte-Kalender
- Event-Management (CRUD, Spielort-Zuordnung, Konflikterkennung)
- GEMA-Modul (Tarifrechner, Vor-/Nachmeldung, Setlisten)
- Finanzmodul (Budgetplanung, Break-Even, Gagen)
- **Ergebnis:** Kernfunktionalität für Veranstaltungsplanung und GEMA

### Phase 2: Kommunikation (Monat 5-6)
- Newsletter-System (Editor, Double-Opt-In, Tracking)
- Social Media Hub (Account-Verbindung, Cross-Posting, Scheduling)
- KI-Integration (Textgenerierung, Bildgenerierung)
- Presse-Modul (Journalisten-DB, Pressemitteilungen, Verteiler)
- **Ergebnis:** Vollständige Kommunikationsplattform

### Phase 3: Operations (Monat 7-8)
- Ticketing & CRM (Gästelisten, QR-Check-in, Reservierungen)
- Kalender-Sync (Google, Outlook, iCal)
- Automatisierung (Workflows, Event-Sync)
- Mobile-Optimierung
- **Ergebnis:** Produktionsreife App für den täglichen Betrieb

### Phase 4: Polish & Scale (Monat 9-10)
- DSGVO-Compliance-Modul
- KI-Predictive-Analytics
- API für Drittanbieter
- Performance-Optimierung
- Onboarding-Flow
- **Ergebnis:** Marktreife SaaS-Plattform

**Gesamtdauer MVP bis Launch:** 8-10 Monate

---

## 9. Risiken & Mitigation

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| **GEMA-Portal hat keine API** | Hoch | Mittel | PDF-Export/Import, Excel-Formate, manuelles Hochladen als Fallback |
| **Social Media APIs ändern sich** | Hoch | Mittel | Abstraktionsschicht, graceful Degradation, manuelles Posting als Fallback |
| **Apple MPP macht Open Tracking ungenau** | Bestätigt | Mittel | CTR als Primärmetrik, First-Party-Daten, explizite Consent-Einholung |
| **Kleine Zielgruppe (Nische)** | Mittel | Hoch | Fokus auf Deutschland zuerst, Erweiterung auf AT/CH, Kultursponsor-Module |
| **Technische Komplexität Social Media APIs** | Hoch | Hoch | Phasenweise Implementierung (FB/IG zuerst, Twitter/X als Add-on) |
| **DSGVO-Compliance bei KI-Nutzung** | Mittel | Hoch | DPA mit OpenAI, lokale KI-Option, Einwilligungs-Dialog, Human-in-the-Loop |
| **Eventbrain als direkter Konkurrent** | Mittel | Mittel | Multi-Venue als USP, GEMA-Integration, KI-Features, niedrigerer Preis |
| **Veranstalter sind technisch zurückhaltend** | Hoch | Hoch | Einfache UI, Onboarding-Schulungen, deutsche Dokumentation, persönlicher Support |
| **KI-Halluzinationen bei Event-Daten** | Mittel | Hoch | Menschliche Prüfungspflicht, Validierung aller generierten Daten |
| **Budget-Constraints der Zielgruppe** | Hoch | Mittel | Freemium-Modell, Fördermittel-Compliance als Verkaufsargument |

---

## 10. Insights & Empfehlungen

### Übergeordnete Insights

1. **Die Marktlücke ist real und dringend.** Nicht nur aus Wettbewerbsanalyse, sondern bestätigt durch wissenschaftliche Studien (RPTU, KMK), Branchenberichte und die Koka36-Insolvenz. Es gibt keine adäquate digitale Infrastruktur für deutsche Kleinkunst.

2. **GEMA-Integration ist der Killer-Feature.** Kein Wettbewerber bietet integrierte GEMA-Funktionen. Dies allein kann Veranstalter von Excel-Tabellen abholen und in eine digitale Lösung bringen. Der Tarif U-K ist komplex genug, um Automatisierung zu rechtfertigen, aber standardisiert genug, um programmierbar zu sein.

3. **Multi-Venue ist der zweite Killer-Feature.** Veranstalter mit mehreren Spielorten verlieren ständig den Überblick. Ein zentraler Kalender mit Konflikterkennung löst ein tägliches, zeitraubendes Problem.

4. **KI ist kein Nice-to-have, sondern ein Equalizer.** Kleine Veranstalter ohne Marketingabteilung können mit KI-gestützter Texterstellung professionelle Werbetexte erstellen — zu Kosten von wenigen Cent pro Event. GPT-4o-mini macht dies finanziell trivial.

5. **DSGVO ist Wettbewerbsvorteil, nicht Bürde.** Durch Self-Hosting in Deutschland bietet die App eine Datensouveränität, die US-SaaS-Lösungen nie erreichen können. Für Kulturveranstalter, die sensible Künstler- und Gästedaten verarbeiten, ist dies entscheidend.

6. **Die Zielgruppe ist technisch zurückhaltend, aber nicht ablehnend.** Die KMK-Studie zeigt: Kulturbetriebe befinden sich in der "Unfreeze"-Phase der Digitalisierung. Sie brauchen keine komplexen Enterprise-Tools, sondern einfache, intuitive Lösungen mit persönlichem Support.

7. **Die Kulturszene ist eng vernetzt.** Word-of-Mouth ist der stärkste Vertriebskanal. Ein zufriedener Veranstalter in Leipzig empfiehlt die App an 5 Kollegen weiter. Case Studies und persönliche Referenzen sind wichtiger als Google Ads.

### Strategische Empfehlungen

1. **MVP-Fokus auf GEMA + Kalender + Newsletter.** Diese drei Module lösen die größten Schmerzpunkte und haben den höchsten Wahrnehmungswert bei der Zielgruppe.

2. **Phasenweise Implementierung der Social Media APIs.** Beginnen mit Facebook/Instagram (Meta Business Suite als Fallback), dann LinkedIn, dann TikTok. Twitter/X nur bei Nachfrage (teuer, restriktiv).

3. **KI als "Assistent", nicht als "Ersatz" positionieren.** Alle KI-generierten Inhalte müssen menschlich geprüft werden. Die UI sollte diesen Prüf-Schritt erzwingen und erleichtern.

4. **Self-Hosting von Tag 1 planen.** Die DSGVO-Konformität ist ein zentraler Verkaufsargument. Cloud-Option für schnelle Tests, Self-Hosting für Produktion.

5. **Offene APIs für Integrationen.** Die App wird nie alle Ticketing-Systeme ersetzen. Stattdessen: Offene APIs für Reservix, Eventbrite, etc. Die App ist das "System of Record", die anderen Systeme sind "Systems of Engagement".

6. **Community-driven Entwicklung.** Früh Beta-Tester einbinden, regelmäßige Feedback-Runden, Feature-Voting. Die Kulturszene schätzt partizipative Prozesse.

7. **Content-Marketing als Akquisitionsstrategie.** Kostenlose GEMA-Kalkulationsvorlagen, Steuer-Tipps für Künstler, Digitalisierungsleitfäden — Content, der Veranstalter hilft und gleichzeitig die App bewirbt.

---

*Dieser Report wurde auf Basis umfassender Recherche erstellt: 10 Wide-Exploration-Dokumente (Markt, Newsletter, Social Media, GEMA/Finanzen, KI, Presse/PR, Ticketing/CRM, Kalender/Multi-Orte, Dashboard/UX, Technische Architektur) und 12 Deep-Dive-Dimensionen (Marktanalyse, Datenbankschema, Newsletter, Social Media, GEMA/Finanzen, KI, Presse/PR, Ticketing/CRM, Kalender, Dashboard, Technische Architektur, DSGVO/Compliance).*

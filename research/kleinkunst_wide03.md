# Facet: Social Media Management & Cross-Posting Automation

## Zusammenfassung

Diese Recherche deckt Tools, APIs und Strategien fuer Social Media Management und Cross-Posting Automation ab. Der Fokus liegt auf der technischen Integration (APIs), verfuegbaren Tools (SaaS und Open-Source), Rate Limits, Kosten sowie spezifischen Anforderungen fuer Kultur- und Event-Veranstalter.

---

## 1. Social Media Management Tools – Marktuebersicht

### Key Findings

- **Hootsuite** ist der aelteste und umfassendste Enterprise-Player mit Scheduling, Analytics, Social Listening und Inbox Management. Preis: Professional ab $99/Monat (1 User, 10 Profile), Team $249/Monat (3 User, 20 Profile) [^134^][^178^].
- **Buffer** gilt als einfachstes Tool mit sauberer UI. Kostenloser Plan: 3 Kanäle, 10 geplante Posts pro Kanal. Essentials $5/Monat pro Kanal, Team $10/Monat pro Kanal [^136^][^134^].
- **Later** fokussiert auf visuelle Planung (Drag-and-Drop-Kalender) und ist ideal für Instagram/TikTok. Starter $18.75/Monat, Growth $37.50/Monat, Scale $82.50/Monat [^136^].
- **Sprout Social** bietet Enterprise-Analytics und tiefgehende Reports. Preis: ab $199/Monat pro User (sehr teuer) [^137^][^203^].
- **Metricool** bietet den groesszuegigsten kostenlosen Plan: 1 Brand, bis zu 11 Kanaele, 50 Posts/Monat, inkl. Analytics, Wettbewerbsanalyse und Best-Posting-Zeiten. Premium ab $20/Monat [^190^][^197^].
- **Publer** ist stark im Bulk-Scheduling mit CSV-Import. Kostenlos: 3 Accounts (ohne X/Twitter), Professional $12/Monat, Business $21/Monat [^136^].
- **Vista Social** unterstuetzt 12+ Netzwerke inkl. Reddit, Snapchat und Review-Sites. Professional $79/Monat [^136^].
- **Ayrshare** ist eine reine API-Loesung fuer Entwickler (nicht als SaaS-Dashboard gedacht) – 13+ soziale Netzwerke ueber eine einzige API [^185^].
- **Zoho Social** bietet einen "Forever-free" Plan: 1 Brand, unbegrenztes Posting auf den enthaltenen Kanaelen [^195^].

### Tool-Vergleich (Cross-Posting & Preise)

| Tool | Kostenloser Plan | Startpreis | Plattformen | Beste fuer |
|------|-----------------|------------|-------------|------------|
| Buffer | 3 Kanäle, 10 Posts | $5/Kanal/Monat | 11 (inkl. Bluesky, Mastodon) | Einsteiger |
| Metricool | 1 Brand, 11 Kanäle, 50 Posts | $20/Monat | 11+ (inkl. Ads) | Analytics-Fokus |
| Later | Limitiert | $18.75/Monat | 8 (IG, FB, TikTok, LI, X, Pin, YT, Threads) | Visuelle Marken |
| Publer | 3 Accounts (kein X) | $12/Monat | 11+ | Bulk-Scheduling |
| Hootsuite | 30-Tage-Test | $99/Monat | 10+ | Enterprise |
| Meta Business Suite | Kostenlos (nur FB & IG) | Kostenlos | FB, IG | FB/IG-Nutzer |
| Mixpost (Open Source) | Kostenlos (Self-hosted) | Einmalzahlung | 10+ (Lite: FB, X, Mastodon; Pro: +IG, LI, TikTok, YT) | Datenschutz/Self-Hosting |

---

## 2. Plattform-APIs fuer automatisiertes Posting

### 2.1 Meta Facebook Graph API

**Key Findings:**
- Facebook Pages koennen ueber die Meta Graph API (v22.0+) automatisch posted werden. Persoenliche Profile sind **nicht** per API erreichbar (beabsichtigte Meta-Politik) [^206^].
- **Erforderliche Permissions:** `pages_manage_posts`, `pages_read_engagement` [^206^].
- **Rate Limits:** 25 Posts pro Seite pro 24 Stunden (Rolling Window). Allgemeine API-Limits: `4800 * Anzahl engagierter Nutzer` Aufrufe pro 24h [^160^][^206^].
- **Media Specs:** JPEG bis 8MB, Videos MP4 (24-60 FPS, empfohlen 1080x1920) [^206^].
- **Text-Limit:** Max. 63.206 Zeichen (technisches Maximum) [^206^].
- **Token:** OAuth 2.0, Page Access Tokens koennen als "non-expiring" konfiguriert werden [^206^].
- **App Review:** Meta App Review erforderlich – ca. 5 Werktage, Screencast-Demo noetig [^206^].

### 2.2 Instagram Graph API

**Key Findings:**
- Nur **Business und Creator Accounts** koennen per API publizieren – persoenliche Accounts haben keinen API-Zugriff [^206^][^212^].
- **Zwei-Schritt-Prozess:** 1) Media Container erstellen, 2) Container publizieren (`media_publish`). Videos erfordern Polling auf Status `FINISHED` [^212^][^193^].
- **Rate Limits (2025/2026):** 
  - **200 API-Calls pro Stunde** pro Instagram-Account (reduziert von 5.000 in 2025 – ein 96%-Rueckgang) [^206^][^212^]
  - **25-100 API-publizierte Posts pro 24 Stunden** (je nach Quelle: Zernio meldet 25, Postproxy 100) [^212^][^206^]
  - Hashtag-Search: 30 einzigartige Hashtags pro 7 Tage [^212^]
- **Media Specs:** 
  - Bilder: JPEG nur (kein PNG!), sRGB, max 8MB, 1:1 (1080x1080), 4:5 (1080x1350) [^206^][^193^]
  - Videos (Feed): MP4/MOV, H.264/HEVC, max 300MB, 3s-15min [^206^]
  - Reels/Stories: MP4, max 100MB, 9:16 (1080x1920), 3-60s [^193^]
- **Text-Limit:** 2.200 Zeichen Caption, max. 30 Hashtags [^206^].
- **Wichtige Einschraenkung:** Text-only Posts werden **nicht** unterstuetzt – jedes Post benoetigt mindestens ein Bild oder Video [^212^].
- **Wichtig:** Die Instagram Basic Display API wurde am 4. Dezember 2024 abgeschaltet [^213^].

### 2.3 X (Twitter) API v2

**Key Findings:**
- X hat seine API-Pricing-Tiers stark ueberarbeitet und teuer gemacht [^173^].
- **Pricing Tiers (2025/2026):**
  - **Free:** 500 Posts/Monat (User-Level), 100 Reads/Monat (App-Level), 1 App ID [^173^]
  - **Basic:** $200/Monat – 50.000 Posts/Monat, 15.000 Reads/Monat, 2 App IDs [^173^]
  - **Pro:** $5.000/Monat – 300.000 Posts/Monat, 1.000.000 Reads/Monat, 3 App IDs [^173^]
  - **Pay-Per-Use:** Neue Option – ca. $0.010 pro Post, $0.005 pro Read [^171^]
- **Rate Limits:**
  - Post Creates: 10.000/24h (App-Level), 100/15min (User-Level) [^172^]
  - Media Upload: 50.000/24h (App-Level), 500/15min (User-Level) [^172^]
- **Alternativen:** TwitterAPI.io bietet Pay-as-you-go: $0.15 pro 1.000 Tweets (bis zu 97% guenstiger) [^173^].
- **24-Hour Deduplication Rule:** Wiederholte Requests fuer denselben Tweet innerhalb 24h werden nur einmal berechnet [^171^].

### 2.4 TikTok Content Posting API

**Key Findings:**
- Offizielle API fuer das Publizieren von Videos auf TikTok [^140^].
- **OAuth 2.0** Authentifizierung erforderlich, App-Registrierung im TikTok Developer Portal noetig [^135^].
- **Wichtige Limitation:** Die API kann **keine nativen TikTok-Sounds** auswaehlen. Trending Audio ist nur ueber manuelles In-App-Posting moeglich [^132^].
- **Scope/Permissions:** `video.publish` fuer Auto-Publishing (schwer zu bekommen, nur fuer Business Accounts) [^138^].
- **Upload-Prozess:** Zwei-Schritt: 1) Upload-URL generieren, 2) Video per PUT hochladen, 3) Status abfragen [^140^].
- **Rate Limit:** Ca. 15 Posts/Tag (shared Limit) [^206^].
- **Media Specs:** 9:16 (1080x1920), MP4, max. 10 Minuten (organisch) [^196^].
- **Erreichbarkeit:** API-postete Videos koennen performance-maessig schlechter abschneiden, da sie native Signale (Sounds, Location Tags, Creator-Edits) vermissen lassen [^132^].

### 2.5 LinkedIn API

**Key Findings:**
- LinkedIn bietet eine REST API fuer das Teilen von Posts, aber der Zugang ist eingeschraenkt.
- **OAuth 2.0** Authentifizierung erforderlich, App-Review und LinkedIn Partner Program erforderlich [^163^][^206^].
- **ugcPosts API:** Ermoeglicht das Erstellen von User Generated Content Posts [^206^].
- **Rate Limits:** Nicht oeffentlich dokumentiert, aber existieren [^206^].
- **Text-Limit:** Max. 3.000 Zeichen [^206^].
- **Token:** 60 Tage Access Token / 365 Tage Refresh Token [^206^].

### 2.6 Threads API

**Key Findings:**
- Threads nutzt die Meta Developer Platform (gleich wie Instagram/Facebook) [^206^].
- Erfordert Instagram Professional Account (Business oder Creator), der mit Threads verbunden ist [^206^].
- **Rate Limit:** 250 API-publizierte Posts pro 24 Stunden [^206^].
- **Text-Limit:** 500 Zeichen pro Post (+ 10.000 Zeichen Text-Attachment) [^206^].
- **Besonderheit:** Nur **1 Hashtag pro Post** erlaubt – einzigartig unter allen Plattformen [^206^].

### 2.7 Google Business Profile API

**Key Findings:**
- Google Business Profile hat eine offizielle API fuer Posts, Events und Offers [^188^].
- **Voraussetzung:** Verified Business Profile Location [^188^].
- **Post-Typen:** STANDARD, EVENT, OFFER – jeweils mit spezifischen Feldern [^188^].
- **CTA Buttons:** BOOK, ORDER, SHOP, LEARN_MORE, SIGN_UP, CALL [^188^].
- **Scheduling:** Posts koennen bis zu 30 Tage im Voraus geplant werden [^188^].
- **Third-Party APIs:** Outstand ($19/Monat, 3.000 Posts inkl.) und bundle.social bieten vereinfachte Wrapper [^188^][^200^].

### 2.8 Pinterest API

**Key Findings:**
- OAuth 2.0, App Review fuer Standard-Zugang erforderlich [^206^].
- **Text-Limit:** 500 Zeichen (Beschreibung) [^206^].
- **Token:** 30 Tage Access / 365 Tage Refresh [^206^].

### 2.9 Mastodon API (Fediverse)

**Key Findings:**
- Mastodon ist ein **free, open-source** dezentralisiertes soziales Netzwerk basierend auf ActivityPub [^179^].
- Bietet eine einfache **REST API und Streaming API** mit OAuth2 [^179^].
- Keine zentralen Rate-Limits – jeder Server setzt eigene Grenzen.
- Wachsende Integration in Cross-Posting-Tools (Buffer, BrandGhost, MicroPoster unterstuetzen Mastodon) [^136^].

---

## 3. Cross-Posting-Faehigkeiten und Limitationen

### Key Findings

- **Einfaches identisches Cross-Posting ist nicht empfohlen.** Jede Plattform hat unterschiedliche Formate, Zielgruppen und Engagement-Muster [^137^].
- **Gute Tools** adaptieren Content automatisch pro Plattform: BrandGhost splittet Threads, passt Zeichenlimits an und formatiert um [^137^].
- **MicroPoster** bietet "True Cross-Platform Automation" mit Source-to-Destination Mirroring (z.B. X → Bluesky → Mastodon) [^133^].
- **Plattform-spezifische Limits die Cross-Posting beeinflussen:**
  - X: 280 Zeichen (Standard), 25.000 (Premium)
  - Threads: 500 Zeichen + 1 Hashtag max.
  - Instagram: 2.200 Zeichen, aber nur visuelle Posts
  - LinkedIn: 3.000 Zeichen
  - Pinterest: 500 Zeichen Beschreibung
  - TikTok: Keine nativen Sounds via API
- **Herausforderung:** Videos muessen pro Plattform optimiert werden (9:16 fuer TikTok/Reels/Shorts, 16:9 fuer YouTube/LinkedIn/X, 1:1 fuer Feed-Posts) [^192^][^196^].

---

## 4. Event-spezifische Social Media Features

### 4.1 Facebook Events API

**Key Findings:**
- Die Graph API unterstuetzt **Event-Erstellung** via `/{page-id}/events` mit POST-Request [^177^].
- **Erforderliche Permission:** `pages_manage_events` [^177^].
- **Felder:** name, start_time (ISO 8601), end_time, description, location, ticket_uri, is_online [^177^].
- **Limitationen:** Event-Erstellung wurde in der Vergangenheit eingeschraenkt. Die `create_event` Methode wurde 2014 entfernt [^175^]. Aktuelle Unterstuetzung ist nur ueber Page-Level Events moeglich [^177^].
- **Alternativen:** Facebook Marketing API fuer Event Response Ads [^175^].
- **Bilder:** Cover-Bild kann separat ueber `/{event-id}/picture` hochgeladen werden [^177^].
- **Webhooks:** Echtzeit-Updates bei RSVP/Aenderungen moeglich [^177^].

### 4.2 Google Events / Google Calendar API

**Key Findings:**
- Google Calendar API ermoeglicht programmatisches Erstellen von Events via OAuth 2.0 [^158^].
- **Scopes:** `calendar.events` fuer CRUD-Operationen [^161^].
- **Anwendung:** Event-Erstellung in Unternehmenskalender, automatisierte Termineintraege [^157^].
- Google Business Profile API unterstuetzt ebenfalls **EVENT-Posts** fuer lokale Unternehmen [^188^].

---

## 5. Bild- und Video-Optimierung fuer verschiedene Plattformen

### Key Findings

**Bildgroessen (Stand 2026):** [^191^][^196^][^198^]

| Plattform | Post-Typ | Empfohlene Groesse | Aspect Ratio |
|-----------|----------|-------------------|--------------|
| **Instagram** | Feed Portrait | 1080 x 1350 px | 4:5 |
| **Instagram** | Feed Square | 1080 x 1080 px | 1:1 |
| **Instagram** | Stories/Reels | 1080 x 1920 px | 9:16 |
| **Facebook** | Feed Portrait | 1080 x 1350 px | 4:5 |
| **Facebook** | Event Cover | 1920 x 1005 px | 2:1 |
| **X/Twitter** | Landscape | 1600 x 900 px | 16:9 |
| **X/Twitter** | Square | 1080 x 1080 px | 1:1 |
| **LinkedIn** | Feed Post | 1200 x 627 px | 1.91:1 |
| **TikTok** | Video | 1080 x 1920 px | 9:16 |
| **YouTube** | Thumbnail | 1280 x 720 px | 16:9 |
| **YouTube** | Shorts | 1080 x 1920 px | 9:16 |
| **Pinterest** | Standard Pin | 1000 x 1500 px | 2:3 |

**Video-Specs:** [^192^]
- **TikTok/Reels/Shorts:** Vertikal 9:16 (1080x1920), MP4, H.264
- **YouTube:** Landscape 16:9 (1920x1080) oder 9:16 fuer Shorts
- **Facebook/Instagram Video:** MP4, 24-60 FPS, AAC Audio 48kHz
- **Instagram Reels via API:** Max 100MB, 3-90 Sekunden, Cover-Bild via `cover_url` [^193^]

---

## 6. Scheduling und beste Posting-Zeiten fuer Kultur/Events

### Key Findings (Stand 2026)

**Allgemeine beste Posting-Zeiten nach Plattform:** [^180^][^181^]

| Plattform | Beste Tage | Beste Zeiten (Ortszeit) | Schlechteste Tage |
|-----------|-----------|------------------------|-------------------|
| **Facebook** | Mo, Di, Mi, Do | Di/Mi 12-20 Uhr; Do 12-14 & 20 Uhr | Wochenende |
| **Instagram** | Mo, Di, Mi, Do | Di 13-19 Uhr; Mi 12-21 & 23 Uhr | Wochenende |
| **TikTok** | Mo-Fr | Di/Do 14-18 Uhr; Mi 13-20 Uhr; Fr 15-17 Uhr | Wochenende |
| **X/Twitter** | Mo-Do | Di-Do 12-18 Uhr | Wochenende |
| **LinkedIn** | Mo-Fr | Di/Mi 11-17 Uhr; Do 11 & 13-17 Uhr | Wochenende |

**Wichtige Erkenntnisse fuer Kultur/Events:**
- **Abende sind fuer Facebook besonders gut:** Die Engagement-Wellen ziehen sich vom Mittag bis in den Abend (bis 20-21 Uhr) [^180^]. Das passt ideal fuer Event-Ankuendigungen.
- **Instagram Reels performen besonders gut zwischen 19-21 Uhr** [^181^].
- **TikTok ist am spaeten Nachmittag/Abend (13-20 Uhr) am staerksten** – gut fuer Event-Teaser-Videos [^180^].
- **Sonntag ist der schlechteste Tag** fuer alle Plattformen [^180^].
- **Konsistenz ist wichtiger als perfektes Timing:** 80% Energie in Content, 20% in Timing investieren [^181^].

---

## 7. Social Media Analytics APIs

### Key Findings

- **bundle.social** bietet eine Analytics-API fuer 11+ Plattformen: Post-Analytics, Account-Analytics, Audience Demographics (Alter, Geschlecht, Stadt, Land), Watch-Time [^167^].
- **Zernio** bietet Analytics API fuer 14 Plattformen – Likes, Impressions, Reach, Clicks, Views. Inkludiert im Usage-Based Plan [^169^].
- **Socialinsider** ist spezialisiert auf Cross-Platform Analytics mit Competitive Benchmarking. Preis: ab $83/Monat [^166^].
- **Metricool** bietet die staerksten kostenlosen Analytics: Wettbewerbsanalyse, Hashtag-Analyse, Ads-Analytics, Website-Analytics [^190^].
- **Einheitliche Metriken sind schwierig:** LinkedIn nutzt "Interactions / Reach", Instagram "Interactions / Impressions" – fuer Cross-Platform Reports muessen Formeln normalisiert werden [^165^].

---

## 8. Kostenlose Tiers und Open-Source-Alternativen

### 8.1 Kostenlose Tiers im Detail

| Tool | Kostenloser Plan | Einschraenkungen |
|------|-----------------|-------------------|
| **Buffer** | 3 Kanäle, 10 Posts/Kanal | Keine Analytics, limitiert |
| **Metricool** | 1 Brand, 11 Kanäle, 50 Posts/Monat | Sehr funktional, Report ab 70 Accounts |
| **Publer** | 3 Accounts, 10 Posts/Account | Kein X/Twitter Support |
| **Meta Business Suite** | Kostenlos | Nur Facebook & Instagram |
| **Zoho Social** | 1 Brand, unbegrenzte Posts | Auf Zoho-Oekosystem fokussiert |
| **Later** | Limitiert, 14-Tage-Trial | Post-Limits auf niedrigen Tiers |
| **Adobe Express** | ~1.000 Posts/Monat | Mit Design-Tools integriert |

### 8.2 Open-Source-Alternativen

**Mixpost** [^207^][^209^][^214^]
- **Open-Source, Self-Hosted** Social Media Management Tool
- **MIT License**, basiert auf Laravel/Vue.js
- **Lite (kostenlos):** Facebook, X/Twitter, Mastodon
- **Pro/Enterprise:** Instagram, LinkedIn, TikTok, YouTube, Google Business, Pinterest, Threads, Bluesky
- **Features:** Calendar, Scheduling, Analytics, Media Library, Team Collaboration, Workspaces, Queue-Management
- **Deployment:** Docker Compose, VPS, Laravel Package
- **Vorteile:** Keine monatlichen Gebuehren, keine Limits, volle Datenkontrolle, Datenschutz-DSGVO-konform
- **Nachteile:** Self-Hosting-Aufwand, technisches Wissen erforderlich
- **Preis:** Lite kostenlos, Pro/Enterprise als Einmalzahlung (kein Abo)

---

## 9. Rate Limits und API-Beschraenkungen – Zusammenfassung

### Vergleichstabelle (Stand 2026)

| Plattform | Kostenlose API? | Posts/Tag | Zeichenlimit | Auth | Token-Lebensdauer | App Review? |
|-----------|----------------|-----------|--------------|------|-------------------|-------------|
| **Instagram** | Ja | 25-100 | 2.200 | OAuth 2.0 | 60 Tage | Ja (Meta) |
| **Facebook** | Ja | 25/Seite | 63.206 | OAuth 2.0 | Non-expiring (Page) | Ja (Meta) |
| **TikTok** | Ja | ~15 | ~2.200 | OAuth 2.0 | 24h/365d Refresh | Ja (Audit) |
| **X/Twitter** | Free/$200/$5K | 500/Monat (Free) | 280 (25K Premium) | OAuth 2.0 | Kein Ablauf | Minimal |
| **LinkedIn** | Ja (mit Approval) | Undisclosed | 3.000 | OAuth 2.0 | 60d/365d Refresh | Ja (Partner) |
| **Threads** | Ja | 250 | 500 (+10K Attach.) | OAuth 2.0 | 60 Tage | Ja (Meta) |
| **YouTube** | Ja | ~6 (Quota) | 5.000 (Beschreibung) | OAuth 2.0 | 1h/ind. Refresh | Audit (hoehere Quota) |
| **Pinterest** | Ja | Undisclosed | 500 | OAuth 2.0 | 30d/365d Refresh | Ja |
| **Mastodon** | Ja | Server-abhaengig | 500 (default) | OAuth 2.0 | Server-abhaengig | Nein |

### Wichtige API-Beschraenkungen

- **Instagram:** Text-only Posts nicht moeglich, nur JPEG (kein PNG), Rate Limit 2025 von 5.000 auf 200 Calls/Stunde gesenkt [^206^][^212^]
- **X/Twitter:** Sehr restriktives Free Tier (500 Posts/Monat), Pay-Per-Use kann teuer werden ($0.01/Post) [^173^][^171^]
- **TikTok:** Keine nativen Sounds via API, API-Posts koennen schlechter performen [^132^]
- **Meta (FB/IG):** App Review Prozess ist aufwaendig (Screencast, 5+ Werktage), Business Verification noetig [^213^]

---

## 10. Deutsche Tools fuer Social Media Management

### Key Findings

- **Swat.io** [^178^][^187^]: Oesterreichisch/deutsches Tool, spezialisiert auf Teamwork im Social Media Management. Content-Planung mit Redaktionskalender, Inbox, Community Management, Analytics, Monitoring, AI Assistant. Preis: ab EUR 35/Monat (Inbox/Publisher Basic).
- **facelift** [^178^]: Deutsches Social Media Management Tool mit Publisher, Moderation, Monitoring & Listening, Advertising, Dashboards, Benchmarking, Trendwatch. Enterprise-Fokus. Preis auf Anfrage.
- **Blog2Social** [^176^]: Automatisiert Social Media fuer WordPress – Autoposting, Cross-Posting, Scheduling. Unterstuetzt 20+ soziale Netzwerke. Fokus auf Enterprise.
- **Lomavis** [^186^]: Deutsche All-in-One-Plattform fuer Social Media Management. Verschiedene Tiers fuer Einsteiger bis Enterprise.
- **Fanpage Karma** [^178^]: Deutsches Tool im OMR Reviews Ranking, Fokus auf Analyse und Monitoring.
- **SocialHub** [^178^]: Komplettloesung mit zentraler Inbox, Content Planner, Monitoring, Analytics.

---

## 11. Technische Integration & Entwickler-APIs

### Unified Social Media APIs (fuer Entwickler)

- **Ayrshare** [^185^]: Eine API fuer 13+ Netzwerke (FB, X, IG, LI, TikTok, YT, Pinterest, Reddit, Telegram, Threads, Bluesky, Google Business, Snapchat). MCP Server fuer AI Agents. API-first (kein Dashboard).
- **bundle.social** [^167^]: API fuer 11+ Plattformen mit Scheduling + Analytics. API-Key Auth, Flat Pricing.
- **Postproxy / Outstand** [^212^][^188^]: Unified API, die Rate Limits und Token-Refresh abstrahiert. X-App-Usage Header Handling.
- **Upload-Post** [^141^]: Social Media API fuer TikTok, FB, LI, Threads, IG, YT, X. N8N Integration.
- **Data365** [^168^]: Fokus auf Daten-Retrieval und Analytics, nicht auf Publishing. Python/JavaScript SDKs.

---

## 12. Trends & Signals

- **AI-Native Features:** Fast alle Tools integrieren jetzt AI fuer Caption-Generierung, Content-Adaption und Reply-Management [^133^][^137^].
- **MCP Server:** APIs wie Ayrshare bieten jetzt native MCP (Model Context Protocol) Server fuer AI Agents – Social Media wird zu einem AI-steuerbaren Tool [^185^].
- **Fediverse-Wachstum:** Mastodon, Bluesky und Threads gewinnen an Bedeutung. Cross-Posting inkludiert zunehmend diese Plattformen [^179^][^136^].
- **Usage-Based Pricing:** X/Twitter fuehrte Pay-Per-Use ein, andere Plattformen koennten folgen [^171^].
- **Rate Limit Verschaerfung:** Instagram reduzierte 2025 die Limits drastisch (5.000 → 200 Calls/Stunde) [^206^].
- **Visuelles Scheduling:** Tools wie Later setzen auf visuelle Feed-Planung als Differentiator [^136^].
- **Self-Hosting Trend:** Datenschutzbedenken (DSGVO) treiben Interesse an Open-Source-Loesungen wie Mixpost [^207^][^209^].

---

## 13. Controversies & Conflicting Claims

- **TikTok API vs. Native Posting:** TikToks offizielle API kann keine nativen Sounds waehlen, was fuer Kultur-Events (Musik, Performances) eine massive Einschraenkung ist. Dienste wie TokPortal bieten "Human-in-the-Loop" Native App Posting als Workaround – aber das ist teurer und langsamer [^132^].
- **X/Twitter API Pricing:** Die extreme Preiserhoehung ($100/Monat → $5.000/Monat) wurde von der Entwickler-Community stark kritisiert. Viele kleine Tools mussten X-Support einstellen [^173^].
- **Instagram Rate Limit Aenderung 2025:** Die unangekuendigte Reduktion von 5.000 auf 200 Calls/Stunde hat viele Produktions-Apps zerstoert [^206^].
- **Meta App Review:** Viele Entwickler berichten von langen Wartezeiten (4-8 Wochen) und haefigen Ablehnungen beim App Review fuer Instagram/Facebook API-Zugang [^213^].
- **Cross-Posting Qualitaet vs. Quantitaet:** Experten warnen davor, identischen Content auf allen Plattformen zu posten. Plattform-spezifische Anpassung ist wichtig fuer Engagement [^137^].

---

## 14. Empfohlene Deep-Dive Bereiche

### Fuer Kleinkunstbuenen / Kultur-Events empfohlen:

1. **Meta Business Suite + Metricool (kostenlose Kombination):**
   - Meta Business Suite fuer native FB/IG Scheduling (kostenlos)
   - Metricool fuer Cross-Platform Analytics und Planung (50 Posts/Monat kostenlos)
   - Diese Kombination deckt die wichtigsten Plattformen fuer Kultur-Events ab

2. **Mixpost (Self-Hosted) fuer datenschutzsensible Organisationen:**
   - Einmalige Einrichtung, keine laufenden Kosten
   - DSGVO-konform (Daten bleiben auf eigenem Server)
   - Unterstuetzt alle wichtigen Plattformen in der Pro-Version

3. **TikTok-Besonderheiten fuer Events:**
   - TikTok-API kann keine Sounds – fuer Musik-/Performance-Events ist manuelles Posting oder TokPortal noetig
   - Event-Teaser-Videos sollten im vertikalen 9:16-Format erstellt werden

4. **Beste Posting-Strategie fuer Event-Ankuendigungen:**
   - Di/Mi 12-20 Uhr auf Facebook & Instagram (Hauptankuendigung)
   - Di/Do 14-18 Uhr auf TikTok (Event-Teaser)
   - Mi 12-18 Uhr auf X/Twitter (schnelle Updates)
   - Vermeide Sonntags-Postings komplett

5. **Event-Erstellung via API:**
   - Facebook Events sind programmatisch ueber Graph API erstellbar (Page-Level)
   - Google Business Profile EVENT-Posts fuer lokale Veranstaltungen
   - Google Calendar API fuer strukturierte Event-Daten

---

## Quellenverzeichnis

| Citation | Quelle | URL |
|----------|--------|-----|
| [^133^] | MicroPoster – Best Social Media Scheduling Tools 2025 | microposter.so |
| [^134^] | Conbersa – Buffer vs Hootsuite vs Later | conbersa.ai |
| [^135^] | JoinVento – TikTok Developer Content Posting API | joinvento.com |
| [^136^] | PostEverywhere – 11 Best Cross-Posting Tools | posteverywhere.ai |
| [^137^] | BrandGhost – Best Social Media Management Tools 2026 | brandghost.ai |
| [^138^] | StackOverflow – Publishing videos on TikTok API | stackoverflow.com |
| [^140^] | TikTok Content Posting API Guide | developers.tiktok.com |
| [^141^] | Upload-Post Social Media API | upload-post.com |
| [^156^] | MarketingSEO – Facebook API Rate Limits | marketingseo.in |
| [^157^] | StackOverflow – Google Calendar API Event Creation | stackoverflow.com |
| [^158^] | YouTube – Google Calendar API OAuth Tutorial | youtube.com |
| [^160^] | Zernio – Schedule Facebook Posts via API | zernio.com |
| [^163^] | Wikipedia – LinkedIn | wikipedia.org |
| [^165^] | KeyAPI – Social Media Analytics API | keyapi.ai |
| [^166^] | SocialInsider – Cross-Platform Analytics | socialinsider.io |
| [^167^] | bundle.social – Social Media Analytics API | bundle.social |
| [^168^] | Outstand – Best Unified Social Media APIs | outstand.so |
| [^169^] | Zernio – Social Media Analytics API | zernio.com |
| [^171^] | Zernio – X API Pricing | zernio.com |
| [^172^] | X API Docs – Rate Limits | docs.x.com |
| [^173^] | TwitterAPI.io – API Pricing Comparison | twitterapi.io |
| [^175^] | LateNode – Creating Events with Facebook API | community.latenode.com |
| [^176^] | Cuspera – Blog2Social vs Swat.io | cuspera.com |
| [^177^] | Reintech – Managing Facebook Events with Graph API | reintech.io |
| [^178^] | OMR – Best Social Media Tools Comparison | omr.com |
| [^179^] | GitHub – Mastodon | github.com/mastodon/mastodon |
| [^180^] | SproutSocial – Best Times to Post 2026 | sproutsocial.com |
| [^181^] | Tiberius – When to Post on Social Media 2026 | tiberius.co.nz |
| [^183^] | JoinMastodon | joinmastodon.org |
| [^185^] | Ayrshare – Social Media API | ayrshare.com |
| [^186^] | Lomavis – Beste Social Media Plattformen 2026 | lomavis.com |
| [^187^] | Swat.io – Tool-Findung | swat.io |
| [^188^] | Outstand – Google Business Profile API | outstand.so |
| [^190^] | Metricool – Metricool vs Buffer | metricool.com |
| [^191^] | SproutSocial – Social Media Image Sizes | sproutsocial.com |
| [^192^] | SproutSocial – Social Media Video Specs | sproutsocial.com |
| [^193^] | PostProxy – Instagram Reels API Guide | postproxy.dev |
| [^195^] | MicroPoster – Best Free SMM Tools 2025 | microposter.so |
| [^196^] | DashSocial – Social Media Image Sizes | dashsocial.com |
| [^197^] | Metricool – Homepage | metricool.com |
| [^198^] | Metricool – Image & Video Size Guide 2026 | metricool.com |
| [^200^] | bundle.social – Google Business Profile API | bundle.social |
| [^201^] | Mixpost – Tools Comparison | mixpost.app |
| [^203^] | Buffer – Best SMM Tools 2026 | buffer.com |
| [^206^] | PostProxy – Social Media API Rules & Limits | postproxy.dev |
| [^207^] | Mixpost – Open Source SMM | mixpost.app |
| [^208^] | Reddit – Mixpost Selfhosted | reddit.com/r/selfhosted |
| [^209^] | PortalZine – Mixpost Lite | portalzine.de |
| [^211^] | MadeWithLaravel – Mixpost | madewithlaravel.com |
| [^212^] | Zernio – Instagram Graph API 2026 | zernio.com |
| [^213^] | Blotato – Instagram API Pricing | blotato.com |
| [^214^] | GitHub – inovector/mixpost | github.com/inovector/mixpost |
| [^215^] | CreatorFlow – Instagram API Rate Limits | creatorflow.so |
| [^216^] | Elfsight – Instagram Graph API Guide | elfsight.com |

---

*Recherche durchgefuehrt: Juli 2025*
*Schwerpunkte: APIs, Cross-Posting, Event-Features, Rate Limits, Kostenlose Tiers, Deutsche Tools, Open-Source*

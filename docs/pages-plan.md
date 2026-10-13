# Multi-page Site Plan — Come to Ethiopia Tours

Last updated: 2026-10-01
Status: **planning — no code written yet**

**Goal:** stop leaking visitors to `cometoethiopiatours.com`. Every action — browse
tours, see itineraries, check a destination, enquire — happens on-site, with the
owner's existing WhatsApp/email workflow as the conversion path (no backend).

**Locked-in decisions:**
- Core + content pages (full route map below)
- Booking = WhatsApp/email hand-off (no backend, no payments)
- Home stays a long-scroll page (detail content graduates to new pages)
- Prerendering for SEO (tour-company pages live or die by search)

---

## 1. Current state (baseline)

- Single-page anchor site. `react-router-dom` v6 is in `package.json` but
  **completely unused** — no `<BrowserRouter>`, no routes, no `src/pages/`.
- Every "do something" action leaves the site:
  - 11 × `tour.liveUrl` (PopularTours card CTA, Map card related-tour links)
  - 1 × "All tours" → `cometoethiopiatours.com/tours-holidays-in-ethiopia/`
  - 2 × `destination.liveUrl` ("See tours here" in the Map detail card)
  - Enquiry hand-off → `wa.me` / `mailto:` (kept, but moved to a proper page)
- No per-page SEO: no OG tags, no sitemap, no robots, no JSON-LD, no 404,
  `siteContent.meta` exists but is never imported.
- Data to build real pages already exists:
  - `src/data/tours.ts` — 11 tours with full day-by-day itineraries,
    includes/excludes, difficulty, season
  - `src/data/destinations.ts` — 12 destinations with facts + coordinates
  - `src/data/routes.ts`, `festivals.ts`, `regions.ts`, `content.ts`

---

## 2. Route map

| Route | Page | Source material | Replaces |
|---|---|---|---|
| `/` | Home (long scroll, slimmed) | existing sections | — |
| `/tours` | All tours catalogue — filter by duration/interest | `tours.ts` (11 tours) | external "All tours" link |
| `/tours/:slug` | Tour detail — highlights, day-by-day, includes/excludes, difficulty, season, related destinations, CTA → `/plan?tour=id` | `tours.ts` | 11 × `tour.liveUrl` |
| `/destinations` | Destinations index — category filters + card grid | `destinations.ts` (12 records) | nav → `#scroll-story` |
| `/destinations/:slug` | Destination detail — facts, description, related tours, mini-map pin, CTA | `destinations.ts` | 2 × external links in Map card |
| `/plan` | Enquiry page — form builds WhatsApp/email message; supports `?tour=` / `?destination=` prefill | `PlanTrip.tsx` form extracted | — (home `#plan-trip` stays too) |
| `/about` | Who we are — guide story, WhyUs expanded, credentials, socials | `WhyUs`, `Voices`, footer copy | — |
| `/contact` | Channels — WhatsApp, email, phone, socials + short form | `content.ts` planTrip/footer | — |
| `/when-to-go` | Calendar scrubber, festivals, season bands | `WhenToGo.tsx` + `festivals.ts` (**moved off home**) | — |
| `/traveler-info` | Visa/health/money accordion + e-visa link | `TravelerInfo.tsx` (**moved off home**) | — |
| `/culture` | Ge'ez/Amharic phrases, coffee ceremony, festival cross-links | `Voices.tsx` (**moved off home**) | — |
| `/gallery` | Photo grid with credits | `public/media/*` (new `gallery.ts`) | — |
| `/faq` | Q&A (derived from traveler-info + new copy) | **new content** | — |
| `/404` | Not found | new | — |

**Home keeps:** Hero, AudienceChooser, PopularTours, ScrollStory, Map,
RouteBuilder, WhyUs, PlanTrip (compact CTA → `/plan`), Footer.

### Navigation after the change

- **Nav:** Tours → `/tours` · Destinations → `/destinations` ·
  When to Go → `/when-to-go` · Plan Trip → `/plan`
  (also fixes today's double source-of-truth: `navLinks` array in `Nav.tsx`
  vs `siteContent.nav` — consolidate to one)
- **Footer becomes a real sitemap:**
  - Explore: Tours, Destinations, When to Go, Culture
  - Plan: Plan Trip, Traveler Info, FAQ, Gallery
  - Company: About, Contact, Credits
  - Social: unchanged (Instagram, WhatsApp, TikTok, YouTube, Email)
- **Hash-alias map** redirects old links (`/#when-to-go` → `/when-to-go`) so
  returning visitors and shared links never break.

---

## 3. Architecture decisions

### Routing
- `react-router-dom` v6 (already installed) + `BrowserRouter`.
- A `Layout` component (Nav + `<Outlet />` + Footer) wraps all routes.
- New `src/pages/` directory; sections stay in `src/sections/` where they
  remain home-only, move to pages where promoted.

### Prerendering (browser-based, not SSR)
- A Playwright script runs after `vite build`, visits each route on the
  preview server with `?prerender=1` (skips preloader/animations), waits for
  content, snapshots the DOM into `dist/<route>/index.html`.
- Real browser ⇒ Leaflet / GSAP / `window` code needs **zero rewriting**.
- Same script also generates `sitemap.xml`, `robots.txt`, `404.html`.
- Route list built from `tours.ts` + `destinations.ts` via `tsx`, so new CMS
  entries prerender automatically.

### Per-page SEO
- `useSeo({ title, description, jsonLd })` hook: title, meta description,
  canonical, OG/Twitter tags, JSON-LD injection.
- Structured data: schema.org `Tour` (with offers) on tour pages, `FAQPage`
  on `/faq`, `BreadcrumbList` on detail pages, `Organization` on home.
- `siteContent.meta` (currently dead code) becomes the home defaults.

### Scroll / animation lifecycle — the main technical risk
Home runs Lenis + GSAP ScrollTrigger pinned sections; route changes must not
strand them.
- Each pinned section's setup goes into a `gsap.context()` that reverts on
  unmount (also fixes StrictMode double-mounting today).
- A `ScrollToTop` route component runs `lenis.scrollTo(0, { immediate: true })`
  on every navigation.
- Preloader runs **first visit only** (`sessionStorage` flag); later
  navigations get a short route-fade (`DURATION.ui`) via `AnimatePresence`
  keyed on `location.pathname`.

### Data changes
- Add `slug` to `Tour` — reuse the external URL slugs (good SEO parity).
  `Destination.id` already works as its slug.
- Add `GalleryItem[]` in `src/data/gallery.ts` (gated by the existing
  `check-assets` build script).
- New FAQ content + About copy — drafted from existing site copy, owner
  reviews.
- `liveUrl` stays in data as a legacy/canonical-reference field but **stops
  being rendered**.

### Shared components to extract first (duplicated today)
- `SectionHeader` — private to `Map.tsx:482`, hand-rolled inline in 10 other
  sections.
- `EnquiryForm` — extracted from `PlanTrip.tsx`, used by home + `/plan`.

---

## 4. Phases

| Phase | Deliverable | Why this order |
|---|---|---|
| **0. Foundations** | Router, Layout, ScrollToTop, route transitions, Lenis/GSAP lifecycle fixes, `useSeo`, slug fields, extract `SectionHeader` + `EnquiryForm`, 404 | everything else depends on it |
| **1. Kill the leaks** | `/tours`, `/tours/:slug`, `/destinations`, `/destinations/:slug` + rewire PopularTours rail, Map card, RouteBuilder CTAs | biggest leak first (13 external links) |
| **2. Conversion** | `/plan` (+prefill), `/about`, `/contact`; rewire hero/footer/nav CTAs | the money path |
| **3. Content pages** | `/when-to-go`, `/traveler-info`, `/culture`, `/gallery`, `/faq`; remove those sections from home; nav/footer sitemap | depends on routing being solid |
| **4. SEO & prerender** | Playwright prerender, sitemap/robots/404.html, JSON-LD, OG images | last, once URLs are stable |
| **5. QA** | hash-alias redirects, internal cross-links, mobile/a11y pass, build-script coverage for gallery data | |

---

## 5. Open questions (blocking)

1. **Prices** — `tours.ts` has no price field. Does the owner publish prices,
   or does the detail page say "Enquire for price" (CTA → `/plan`)?
   *(blocking for tour pages)*
2. **Hosting/domain** — where does this deploy (Netlify/Vercel/VPS/
   `cometoethiopiatours.com` itself)? Prerender file layout and old-URL
   redirects depend on it. Should old WordPress tour URLs 301-redirect to the
   new `/tours/:slug`?
3. **Canonical** — claim SEO ownership (canonical → new pages) or keep
   pointing at the old site while both run?
4. **Amharic** — build pages EN-first with Amharic strings added to
   `i18n/am.ts` as we go (already marked `TODO-REVIEW`), or full parity from
   day one?
5. **About & FAQ copy** — drafted from existing text, owner signs off before
   Phase 2/3.

---

## 6. Reference: where things live today

| Thing | Location |
|---|---|
| External tour links | `PopularTours.tsx:520`, `PopularTours.tsx:186`, `Map.tsx:1129`, `Map.tsx:1155` |
| Tour data | `src/data/tours.ts` — `Tour`, `TourDay`, `featuredTourIds` |
| Destination data | `src/data/destinations.ts` — `Destination`, `ETHIOPIA_BOUNDS` |
| Site copy | `src/data/content.ts` — `siteContent` (keys: meta, nav, preloader, hero, audienceChooser, popularTours, scrollStory, map, whenToGo, routeBuilder, whyUs, travelerInfo, voices, planTrip, footer) |
| i18n | `src/data/i18n/en.ts`, `src/data/i18n/am.ts` |
| Section order / IDs | `src/App.tsx:140-175` (`hero`, `who-is-this-for`, `popular-tours`, `scroll-story`, `map`, `when-to-go`, `route-builder`, `why-us`, `traveler-info`, `voices`, `plan-trip`) |
| Nav links | `src/components/Nav.tsx:29-34` (`navLinks`) |
| Design tokens | `src/styles/globals.css` `:root` — `--ochre`, `--indigo`, `--sulphur`, `--highland`, `--paper`, `--ink`, `--font-display`, `--font-body`, `--font-geez` |
| Motion tokens | `src/lib/motion.ts` — `DURATION`, `STAGGER`, `DELAY`, `EASE`, `EASE_FM`, `SCROLL`, `LENIS_CONFIG` |
| Build guards | `scripts/check-assets.ts`, `scripts/check-destinations.ts` run by `dev`/`build` |

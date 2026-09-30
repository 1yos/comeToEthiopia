---
inclusion: always
---

# Design Language: Come to Ethiopia Tours

## Product definition

This is the website of **Come to Ethiopia Tours**, a private tour company based in Addis
Ababa, owned and operated by an experienced, professionally trained Ethiopian guide.

**Primary goal of every section**: help a visitor pick, trust, or book a tour.

**Two audiences — both matter equally**:

- **Audience A (Visitor)**: International travelers and diaspora coming from abroad.
  They need multi-region itineraries, USD pricing, visa and practical travel info,
  airport pickup notes, international flight connections.
- **Audience B (Local)**: People living in Ethiopia — individuals, families, friends,
  students, company teams — who want to travel domestically. They need weekend and
  day trips from Addis (Wenchi, Adadi Mariam, Tiya, Debre Libanos etc.), family and
  group tours, school and company-outing formats, ETB pricing, holiday tours timed to
  Timkat, Meskel, Fasika, Enkutatash and Genna, and Amharic-first copy.

**What does NOT belong on this site**:

- Nation-branding copy ("one of the world's oldest civilizations")
- History lessons not tied to a specific tour or booking reason
- "About Ethiopia" paragraphs that could appear on a government tourism site
- Proverbs, cultural commentary, or anthropological explanations
- Any invented tours, prices, or claims not on cometoethiopiatours.com

**What belongs**:

- Real tours with real itineraries from cometoethiopiatours.com
- Destinations explained only as hooks for why to book a tour there
  (e.g. "Lalibela at dawn — why the early start is worth it")
- Festivals as booking windows: "Timkat Jan 19, Gondar and Lalibela fill up — book now"
- Practical info that helps someone decide and enquire
- Trustworthy signals: real guide, real company, real contact info

---

## Concept

The site should feel like a handmade catalogue from a guide who knows the country
deeply — specific, direct, with the authority of someone who has been there. Not a
national tourism board, not a travel aggregator. A person offering you their expertise.

---

## Palette (CSS variables only — never hard-code hex values in components)

```
--ochre:    #B8742A
--indigo:   #1F2A44
--sulphur:  #E3B505
--highland: #3F5B3A
--paper:    #F1EAD9
--ink:      #121110
```

Ethiopian flag colors appear ONLY as tiny accents — a thread, an underline, a single
border. Never as a theme or dominant color block.

---

## Typography

- **Display**: Fraunces (variable font, opsz and wght axes) — headlines, pull quotes
- **Text**: Bricolage Grotesque — body, UI, labels
- **Ge'ez**: Noto Serif Ethiopic — script decorations, numerals, cultural text
- **Banned typefaces**: Inter, Roboto, Poppins, Arial, system-ui as primary face

### Scale rules

- Mix scale dramatically: 12px captions next to 18–22vw headlines.
- Ge'ez script used as a design element: giant, cropped by viewport edges,
  layered behind photography. Used as section numerals: ፩ ፪ ፫ ፬ ፭
- Optical sizing: `font-variation-settings: "opsz" 144` on display text.
- Amharic strings are longer than English equivalents — layouts must not break.
  Use `word-break: break-word` where necessary. Line-height 1.6+ for Amharic.

---

## Layout

- Asymmetric grids. Overlapping images. Offset text columns. Broken-grid moments.
- Section rhythm MUST vary: dense, nearly empty, horizontal-scroll, type-only.
  No two consecutive sections can share the same layout pattern.
- Paper grain overlay (SVG feTurbulence noise) site-wide via a fixed pseudo-element.
- Default: sharp corners. Rounded corners are RARE and purposeful.
- Hand-drawn SVG elements: route lines, photo annotations, arrows, underlines.

---

## Motion principles

- **Smooth scroll**: Lenis — lerp 0.06, wheelMultiplier 0.7, smoothWheel true
- **Pinned scenes**: GSAP ScrollTrigger — each scene minimum 350vh of pin distance
- **Scrub**: 1.5 to 2, never `true`
- **Micro-interactions**: Framer Motion for hover states
- **Each interaction type has its own character**: nav hover ≠ image hover ≠ CTA
- **Custom cursor**: ochre dot (8px), grows to 48px on interactive elements
- **Magnetic buttons**: `data-magnetic` elements pull cursor 20px off center
- **Reduced-motion**: all animations collapse to instant opacity. Never remove the
  state change, only the duration.

---

## Voice and copy register

Write like a guide who knows this country. Specific, direct, occasionally dry.
Real altitudes, real distances, real times of day. No generalities.

**Register example**:

> "Lalibela at 5:40am. Cold stone underfoot. This tour is the reason you came."

**Short sentences. Then long ones. Then short again.**

### Banned words and phrases

unlock, discover the magic, hidden gem, tapestry, journey of a lifetime,
immerse yourself, embark on, vibrant culture, rich culture, nestled, breathtaking,
curated, seamless, elevate, "Welcome to Ethiopia", "Welcome to", get started,
transform your, unforgettable, "oldest civilization" (without specifics),
lorem ipsum, any generic country-branding language

### Cultural accuracy

All Ge'ez text, Amharic phrases, festival descriptions must be flagged
`{/* TODO-REVIEW: native-speaker verification */}`. No exceptions.

---

## i18n (Amharic / English)

- A simple EN / አማርኛ toggle in the nav. No heavy i18n library — typed dictionaries
  in `/src/data/i18n/en.ts` and `/src/data/i18n/am.ts`.
- Persist choice in localStorage. Detect browser language on first visit.
- Flag all Amharic copy `TODO-REVIEW`.

---

## Audience mode (Visitor / Local)

Set by the "Who is this for" section and switchable from the nav.

- **Visitor**: USD, international flight notes, multi-region routes, English first.
- **Local**: ETB, Amharic first, day/weekend trips from Addis, group and family formats,
  holiday tours, Telegram contact, Ethiopian date first.
  Context persists in localStorage and changes copy, tour order, currency, CTA wording
  and calendar display across the whole site.

---

## Hard bans — the anti-AI-look rules

1. No purple/blue gradients, glassmorphism, glowing orbs, neon, mesh gradients.
2. No three-equal-cards grids for features or destinations.
3. No icon-in-circle feature bullets.
4. No layout order: centered hero → features → testimonials → pricing → CTA.
5. No emoji anywhere in the UI.
6. No decorative Lucide/Feather/Hero icons unless functional.
7. No stock-style illustration or flat icon packs.
8. No uniform `rounded-2xl` + `shadow-lg` on every card.
9. No generic gradient CTA buttons.
10. No fake testimonials, fake review stars, fake stats, fake prices.
11. No lorem ipsum. Missing copy = specific placeholder + TODO-REVIEW comment.
12. No content that reads like a national tourism board.

---

## Required human touches

- Handwritten-style SVG annotation on at least one photo
- "Made in Addis" note in the footer — specific
- Ge'ez numeral section counter (፩–፭) on scroll story scenes
- Live Ethiopian date in footer, computed in code (not hard-coded)
- `buna` easter egg — coffee-pour animation
- At least one type-only section

---

## References

- Locomotive Scroll showcase: layered depth and editorial pacing
- Jacquemus.com: asymmetric image placement, unexpected scale
- Africa No Filter: text-forward, specific, anti-safari-cliché

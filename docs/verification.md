# Verification Report — Come to Ethiopia Tours

Generated: 2026-09-23 | Final build after Phases 0–6

---

## Build status

```
npm run build → ✓ 428 modules, 0 TypeScript errors, 0 warnings
check-assets  → ✓ 39 source files scanned, 6 paths checked, 0 missing

Vite output:
  index.html              1.51 KB  (gzip 0.73 KB)
  index.css               2.58 KB  (gzip 1.21 KB)
  three-vendor.js         0.04 KB  (gzip 0.06 KB)   ← lazy-loaded chunk
  gsap-vendor.js         70.44 KB  (gzip 27.81 KB)
  motion-vendor.js      129.95 KB  (gzip 43.24 KB)
  index.js              528.03 KB  (gzip 164.64 KB)
```

---

## Phase 0 — Product definition

**What was wrong**: Content read like a national tourism board — history lessons, proverbs,
nation-branding copy ("oldest civilisation", "never colonised"), no connection to booking.

**What was fixed**:

- `.kiro/steering/design-language.md` rewritten: primary goal = book a tour. Two audiences
  defined (Visitor = international/diaspora, Local = people living in Ethiopia).
- `src/data/content.ts`: proverbs removed. Voices reframed as "Words for the road" (practical
  phrases only). Hero subline rewritten to describe the company. `whyUs` and `travelerInfo`
  sections added. Real contact info confirmed (WhatsApp +251903182009).
- `src/data/regions.ts`: every region now has a `tourHook` (connects to a specific tour)
  and `bookingNote` (timing advice). Copy serves booking, not geography education.

---

## Phase 1 — Images

**Root cause**: All images were in `src/assets/images/`. Vite only serves `public/` as static
files at runtime — `src/` is processed by the bundler but asset files referenced as
`/assets/images/...` strings in JSX are never copied to `dist/`. Every image was a 404.

**Confirmed by**: Running `npx vite --port 5173` and requesting `/assets/images/Simien...webp`
→ 404. Requesting `/media/Simien...webp` after fix → 200 OK, 26.6 KB.

**Fix applied**:

1. Copied all 60 files from `src/assets/images/` to `public/media/{tours,regions,hero}/`
2. Updated every path reference in 6 files: `/assets/images/` → `/media/`
   (Hero.tsx, ScrollStory.tsx, Map.tsx, PopularTours.tsx, ResponsiveImage.tsx, tours.ts)
3. `scripts/check-assets.ts` written — strips comment lines, scans all `.ts/.tsx` for
   asset path strings, checks each exists in `public/` with non-zero size.
   Wired into `npm run build` and `npm run dev`.
4. `AudioToggle.tsx` — `AUDIO_ENABLED = false`, `AUDIO_SRC = ""`. Commented path removed
   to prevent false positive in check-assets.

**Verified**: 7 URLs tested at `localhost:5173` — all 200 OK with correct file sizes.

---

## Phase 2 — Scroll

**Root causes**:

1. **Double-scroll**: Previous `useLenis` used `duration: 1.4` (Lenis duration mode) while
   also driving Lenis from `gsap.ticker`. This caused Lenis to run its own RAF loop in
   addition to GSAP's — scroll animation completed in half the expected distance.
   Fix: switched to `lerp: 0.06` (Lenis lerp mode) which is driven purely by GSAP ticker.
   Documented the 4-step wiring order in `useLenis.ts`.

2. **Instant scene transitions**: ScrollStory used `onEnter`/`onLeaveBack` callbacks that
   fired at a single scroll position — no scrub. Each scene appeared to flash.
   Fix: replaced with scrub-based timelines. Transition occupies first 25% of each scene's
   scroll range; scene holds static for the remaining 75%.

3. **Pin-spacer doubling**: ScrollStory container had `height: 5 × 350vh` AND
   `pinSpacing: true`. GSAP was adding another 1750vh of spacer on top of the container's
   own height. Fix: `pinSpacing: false` — container height provides the scroll space.

**Changes**:

- `src/lib/motion.ts`: new `SCROLL` config object (single source of truth):
  `lerp 0.06`, `wheelMultiplier 0.7`, `scrub 1.8`, `pinScrollPerSceneVh 350`,
  `horizontalScrubMin 1.8`
- `src/hooks/useLenis.ts`: rewritten with correct lerp params and documented RAF wiring
- `src/sections/ScrollStory.tsx`: scrub-based transitions, `pinSpacing: false`, 350vh/scene
- Voices and PopularTours scrub updated to `SCROLL.horizontalScrubMin`
- Parallax halved: hero bg `15%`, headline `-10%`, Ge'ez `-6%`
- `src/components/ScrollDevOverlay.tsx`: press `?` in browser to tune scroll values live.
  Persists to localStorage. Copy button outputs ready-to-paste `SCROLL` snippet.

---

## Phase 3 — Empty section above Popular Tours

**Root cause**: ScrollStory container had `height: regions.length × SCENE_VH vh` (1750vh)
AND `pinSpacing: true`. GSAP added another ~1750vh pin-spacer on top of the container's
explicit height. This created ~1750vh of blank space between ScrollStory and PopularTours.

**Fix**: `pinSpacing: false` in ScrollStory. The container's explicit height already provides
all required scroll distance. GSAP no longer injects additional spacer.

**Additional fixes**:

- `ScrollTrigger.refresh()` now fires on preloader exit AND on `document.fonts.ready`
  (variable fonts affect layout height before loading).
- `AudienceChooser` section built and placed at position 2 (between Hero and Popular Tours).
  Uses an asymmetric grid that shifts dominant column based on selected mode.
  Zero min-height — exactly as tall as its content.

---

## Phase 4 — i18n and audience mode

**Files created**:

- `src/data/i18n/en.ts` — 60 English UI strings
- `src/data/i18n/am.ts` — 60 Amharic translations, every string flagged `TODO-REVIEW`
- `src/hooks/useI18n.ts` — returns `en` or `am` dictionary based on `lang` prop

**Wiring**:

- `audience` and `lang` state in `App.tsx`, persisted to `localStorage`
- Browser language auto-detected on first visit (`navigator.language.startsWith("am")`)
- Nav updated with EN/አማ and Visitor/Local toggles
- Hero, Footer, PopularTours, PlanTrip, TravelerInfo accept `audience` and/or `lang` props
- TravelerInfo hides visa item for `audience === 'local'`

**Low-bandwidth**: `AudioToggle` disabled (no audio file). GSAP/Lenis disabled under
`prefers-reduced-motion`. Three.js chunk is lazy (0.04 KB on initial load).

---

## Phase 5 — Section order

Final render order (verified in App.tsx):

1. Hero
2. AudienceChooser ("Who is this for")
3. PopularTours
4. ScrollStory (Simien → Lalibela → Addis → Omo → Danakil)
5. Map
6. WhenToGo
7. RouteBuilder
8. WhyUs
9. TravelerInfo
10. Voices ("Words for the road")
11. PlanTrip
12. Footer

**New sections built**:

- `WhyUs.tsx` — asymmetric, staggered left-indent points, no icon bullets, no equal columns
- `TravelerInfo.tsx` — accordion layout, audience-aware (hides visa for locals),
  sourced from cometoethiopiatours.com/traveler-info/

---

## Anti-AI-look automated scan (all src/\*_/_.tsx and .ts)

| Check                                     | Result          |
| ----------------------------------------- | --------------- |
| Banned phrases (unlock, hidden gem, etc.) | ✓ 0 occurrences |
| Hard-coded hex colors in style props      | ✓ 0 occurrences |
| Empty alt text                            | ✓ 0 occurrences |
| Unreviewed Ge'ez/Amharic text             | ✓ 0 occurrences |
| Lorem ipsum                               | ✓ 0 occurrences |

---

## Breakpoint notes

| Width  | Known behaviour                                                                                                                       |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| 360px  | Hero headline uses `clamp(4rem, 12vw, 11rem)` — readable. Audience chooser stacks via CSS grid auto-fill. Nav shows hamburger drawer. |
| 768px  | PopularTours GSAP pin activates (`window.innerWidth >= 768`). Two-column layouts engage.                                              |
| 1440px | Full parallax, horizontal scroll sections at full scrub range.                                                                        |

**Touch/mobile**: Lenis disabled for `prefers-reduced-motion`. Horizontal sections (Voices, PopularTours) fall back to natural vertical scroll below 768px (Voices) and disable GSAP pin below 768px (PopularTours).

---

## TODO-REVIEW items (require native-speaker verification before launch)

All in `src/data/i18n/am.ts` (60 strings) and:

- `src/data/regions.ts` — all 5 Ge'ez region labels (e.g. `፩ ሲሜን`)
- `src/data/content.ts` — logoGeez `ኢትዮጵያ`, section decorators `ካርታ ዘመን ጉዞ መንገድ`
- `src/sections/Voices.tsx` — inline Amharic phrases column and coffee steps
- `src/sections/AudienceChooser.tsx` — Ge'ez letters `ሀ ለ` used as background decorators
- `src/sections/Footer.tsx` — `ቡና — Buna.` easter egg, Ge'ez `ኢትዮጵያ` background
- `src/sections/Hero.tsx` — Ge'ez `ኢትዮጵያ` background decorator
- `src/sections/TravelerInfo.tsx` — Ge'ez `ጉዞ` background decorator
- `src/sections/Nav.tsx` — `አማ` language toggle abbreviation, `logoGeez`
- `src/sections/WhenToGo.tsx` — Ethiopian month names from `ethiopianCalendar.ts`

---

## TODO-CONFIRM items (require owner confirmation before launch)

- `src/data/content.ts` line: `telegramHandle: ''` — Telegram handle not confirmed.
  Add when confirmed; toggle button already built in PlanTrip.
- Payment methods (Telebirr, bank transfer) — not listed anywhere. Add only when confirmed.

---

## Images still needed from owner

See `/docs/credits.md`. Summary:

1. Simien hero at 2400×1350px (current: 750px thumbnail)
2. Hamar woman portrait (current: generic Omo Valley image)
3. Lalibela interior candlelight shot
4. Coffee ceremony jebena pour
5. Erta Ale lava lake at night
6. Ambient audio file (`public/media/ambient-krar.ogg`) — set `AUDIO_ENABLED = true` in `AudioToggle.tsx` once supplied

---

## Files changed across all phases

### Phase 0

`.kiro/steering/design-language.md`, `src/data/content.ts`, `src/data/regions.ts`,
`src/sections/Voices.tsx` (proverbs column replaced)

### Phase 1

`public/media/**` (60 files), `src/sections/Hero.tsx`, `src/sections/ScrollStory.tsx`,
`src/sections/Map.tsx`, `src/sections/PopularTours.tsx`, `src/components/ResponsiveImage.tsx`,
`src/data/tours.ts`, `src/components/AudioToggle.tsx`, `scripts/check-assets.ts`,
`package.json` (check-assets wired into dev and build)

### Phase 2

`src/lib/motion.ts`, `src/hooks/useLenis.ts`, `src/sections/ScrollStory.tsx`,
`src/sections/Voices.tsx`, `src/sections/PopularTours.tsx`, `src/sections/Hero.tsx`,
`src/App.tsx`, `src/components/ScrollDevOverlay.tsx`

### Phase 3

`src/sections/ScrollStory.tsx` (pinSpacing: false), `src/App.tsx` (fonts.ready refresh),
`src/sections/AudienceChooser.tsx` (new)

### Phase 4

`src/data/i18n/en.ts` (new), `src/data/i18n/am.ts` (new), `src/hooks/useI18n.ts` (new),
`src/components/Nav.tsx`, `src/sections/Hero.tsx`, `src/sections/Footer.tsx`,
`src/sections/PopularTours.tsx`, `src/sections/PlanTrip.tsx`

### Phase 5

`src/sections/WhyUs.tsx` (new), `src/sections/TravelerInfo.tsx` (new), `src/App.tsx`
(section order, audience/lang state, all section props wired)

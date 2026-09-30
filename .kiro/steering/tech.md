---
inclusion: always
---
# Tech Stack and Architecture: Come to Ethiopia

## Core stack
```
Vite 5 + React 18 + TypeScript (strict mode)
Tailwind CSS 3  (theme extended with CSS variables, not hard-coded colors)
```

## Required libraries
| Purpose | Library | Notes |
|---|---|---|
| Smooth scroll | lenis | ~1.2 lerp, RAF-driven |
| Pinned scroll animations | gsap + ScrollTrigger | Import only what's used |
| Micro-interactions / page transitions | framer-motion | Named export `motion` |
| 3D shader effect | @react-three/fiber + three | ONE subtle effect only, lazy-loaded |
| Router | react-router-dom v6 | For page transitions between routes |

## What NOT to install
- No `react-spring` (redundant with framer-motion)
- No `anime.js` (use GSAP or framer-motion)
- No tile-map library (Leaflet, Mapbox, Google Maps) — map is hand-drawn SVG
- No UI component library (shadcn, MUI, Chakra) — everything is custom
- No icon pack as decoration (Lucide is allowed for functional UI icons only)

## Project structure
```
src/
  assets/          # Images, fonts, audio. WebP/AVIF, named by region/subject
  components/      # Reusable: Cursor, Nav, Preloader, AudioToggle, GrainOverlay
  sections/        # One file per page section: Hero, ScrollStory, Map, WhenToGo,
                   #   RouteBuilder, Voices, PlanTrip, Footer
  hooks/           # useEthiopianDate, useLenis, useReducedMotion, useKonami
  lib/             # ethiopianCalendar.ts, routeScorer.ts, gsapSetup.ts
  data/            # content.ts, regions.ts, festivals.ts, routes.ts
  styles/          # globals.css (CSS variables, fonts, grain, resets)
  App.tsx          # Root: wraps Lenis, cursor, preloader, sections in order
  main.tsx         # Mount point
```

## Content data contracts
All copy lives in `/src/data/`. Components must not contain hard-coded strings.

```ts
// regions.ts
export interface Region {
  id: string
  name: string
  geez: string          // Ge'ez numeral and/or script label
  tagline: string       // ≤12 words, sensory and specific
  story: string         // 2-sentence story, travel-writer register
  altitude?: string     // e.g. "2,400 – 4,543 m"
  bestSeason: string
  howToGetThere: string
  daysNeeded: string
  accentColor: string   // CSS variable name, e.g. "--indigo"
  imageSlot: string     // filename in /assets, or placeholder label
}

// festivals.ts
export interface Festival {
  name: string
  amharicName: string
  ethiopianMonth: number  // 1–13
  gregorianApprox: string
  description: string     // 1–2 sentences, specific
}

// routes.ts
export interface Route {
  id: string
  interests: string[]
  duration: 7 | 10 | 14
  stops: string[]         // region IDs in order
  highlights: string[]
}
```

## Ethiopian calendar
Implement a pure function `gregorianToEthiopian(date: Date): EthiopianDate`
in `/src/lib/ethiopianCalendar.ts`. Rules:
- Ethiopian year = Gregorian year − 7 (before Sep 11) or − 8 (after Sep 11).
  Exception: Sep 11 itself is Ethiopian New Year (Enkutatash).
- 13 months: 12 of 30 days each + Pagumē (5 or 6 days in leap year).
- Month names: Meskerem, Tikimt, Hidar, Tahsas, Tir, Yekatit, Megabit,
  Miazia, Ginbot, Senie, Hamle, Nehase, Pagumē.
- Never hard-code the current Ethiopian year. Always derive it from `new Date()`.

## Images
- Format: WebP primary, AVIF fallback where supported.
- All `<img>` elements must have descriptive `alt` text.
- Images below the fold: `loading="lazy"` + `decoding="async"`.
- Hero and preloader images: preloaded via `<link rel="preload">`.
- Use `srcset` and `sizes` for responsive images.
- Until real photos are supplied: use labeled `<div>` placeholder slots with
  exact dimensions noted (e.g. `{/* PHOTO: Simien Mountains, golden hour, 
  wide landscape, 1600×900 */}`) rather than generic placeholders.

## Three.js shader
- A single `<GrainShader />` or `<HeatHaze />` component, lazy-loaded.
- Disable entirely if `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
  or if a `navigator.deviceMemory < 2` or `navigator.hardwareConcurrency < 4`.
- Keep the canvas fixed, full-bleed, z-index beneath content.

## Performance targets
- Lighthouse Performance ≥ 90 (mobile)
- LCP < 2.5s
- CLS < 0.1
- Total JS (gzipped) < 250 KB on initial load (Three.js is lazy-loaded separately)
- Use React.lazy + Suspense for all sections below the fold

## Accessibility
- WCAG 2.1 AA contrast on all text/background combinations.
- Keyboard navigation: Tab order follows visual reading order.
- Focus states: visible, styled with --ochre outline (not default browser blue).
- ARIA labels on all icon-only controls (cursor, audio toggle, scroll indicator).
- `role="region"` + `aria-label` on each major section.
- Reduced-motion: all GSAP/Lenis animations wrapped with `matchMedia` guard.

## Audio
- Sound toggle is OFF by default. No autoplay under any circumstances.
- One ambient track (e.g. light Krar string instrument, looped, short).
- Audio file: OGG primary, MP3 fallback. Must be royalty-free or commissioned.
- Button has clear on/off state, accessible label, and is visible on the nav.

## Build and dev
```bash
npm run dev       # Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run typecheck # tsc --noEmit
```

## Environment variables
- Any API keys (future Gemini integration) go in `.env.local`, never committed.
- Prefix: `VITE_` for client-safe vars.
- `.env.local` is in `.gitignore`.

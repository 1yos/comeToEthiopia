/**
 * motion.ts — single source of truth for all animation and scroll timing.
 *
 * Rules:
 * - Every duration, delay, stagger, scrub, and lerp value in GSAP / Framer Motion /
 *   Lenis / CSS must reference a constant from this file.
 * - Never hard-code animation numbers in components.
 */

// ── Duration tokens (seconds) ─────────────────────────────────────────────
export const DURATION = {
  /** Cursor, button state, icon swap */
  micro: 0.35,
  /** Nav hover, small reveals, card hover */
  ui: 0.55,
  /** Individual element entering viewport */
  reveal: 1.1,
  /** Full section transition, scene swap */
  scene: 1.6,
  /** Hero headline word reveal */
  hero: 2.0,
  /** Preloader total (informational — computed from PRELOADER below) */
  preloader: 3.0,
} as const;

// ── Stagger tokens (seconds between items) ────────────────────────────────
export const STAGGER = {
  tight: 0.06,
  normal: 0.1,
  wide: 0.22,
} as const;

// ── Delay tokens (seconds before animation starts) ────────────────────────
export const DELAY = {
  mount: 0.2,
  postLoad: 0.3,
  secondary: 0.9,
  tertiary: 1.3,
} as const;

// ── Ease definitions ──────────────────────────────────────────────────────
export const EASE = {
  outExpo: "power4.out",
  outCubic: "power3.out",
  inOutCubic: "power2.inOut",
  outBack: "back.out(1.4)",
  inExpo: "power4.in",
  linear: "none",
} as const;

export const EASE_FM = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  outCubic: [0.33, 1, 0.68, 1] as const,
  inOutCubic: [0.65, 0, 0.35, 1] as const,
  outBack: [0.34, 1.56, 0.64, 1] as const,
  inExpo: [0.7, 0, 0.84, 0] as const,
} as const;

// ── CSS transition strings ────────────────────────────────────────────────
export const TRANSITION = {
  micro: `${DURATION.micro}s cubic-bezier(${EASE_FM.outCubic.join(",")})`,
  ui: `${DURATION.ui}s cubic-bezier(${EASE_FM.outCubic.join(",")})`,
  reveal: `${DURATION.reveal}s cubic-bezier(${EASE_FM.outExpo.join(",")})`,
  scene: `${DURATION.scene}s cubic-bezier(${EASE_FM.inOutCubic.join(",")})`,
} as const;

// ── Parallax speed factors ────────────────────────────────────────────────
// Small values (0.05–0.15) feel cinematic without being nauseating.
export const PARALLAX = {
  heroBg: "15%", // hero photo — subtle background drift
  heroHead: "-10%", // hero headline — slight counter-scroll
  geezDecor: "-6%", // large Ge'ez decorators — slowest layer
} as const;

// ── SCROLL config — drives Lenis, ScrollTrigger scrub and snap ────────────
/**
 * Change these values to tune the scroll feel across the whole site.
 * Use the dev overlay (press "?" in the browser) to adjust live.
 */
export const SCROLL = {
  // Lenis
  lerp: 0.06, // lower = heavier/smoother scroll (0.04–0.12)
  wheelMultiplier: 0.7, // scale wheel delta (0.5 = slower, 1 = native)
  touchMultiplier: 1.1, // touch scrolling multiplier
  smoothWheel: true,

  // ScrollTrigger scrub — how many seconds the tween lags behind scroll
  // Never use `true` (which is just 1 frame). Range: 1.5–2.
  scrub: 1.8,

  // Snap between scene boundaries (set to false to disable)
  snap: {
    enabled: false, // enable once content feels right
    duration: { min: 0.8, max: 1.2 },
    ease: "power2.inOut",
  },

  // How many vh of scroll each pinned scene occupies
  // 100 = user scrolls 1× the screen height per scene transition
  pinScrollPerSceneVh: 100,

  // Horizontal scroll sections (Voices, PopularTours)
  // Each section's rail should take at least this many px of pin distance
  horizontalScrubMin: 1.8, // scrub value for horizontal sections
} as const;

// ── Backwards-compat alias (used in existing imports) ─────────────────────
/** @deprecated Use SCROLL.pinScrollPerSceneVh */
export const SCENE_SCROLL_VH = SCROLL.pinScrollPerSceneVh;

// ── Lenis config (derived from SCROLL) ────────────────────────────────────
export const LENIS_CONFIG = {
  lerp: SCROLL.lerp,
  wheelMultiplier: SCROLL.wheelMultiplier,
  touchMultiplier: SCROLL.touchMultiplier,
  smoothWheel: SCROLL.smoothWheel,
  // Easing function for Lenis duration mode (used as fallback if lerp is 0)
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
} as const;

// ── Preloader config ──────────────────────────────────────────────────────
export const PRELOADER = {
  ticks: 10,
  tickInterval: 250,
  pauseBeforeWipe: 500,
  wipeDuration: DURATION.scene,
} as const;

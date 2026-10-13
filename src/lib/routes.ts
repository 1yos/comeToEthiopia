/**
 * Route paths and legacy-anchor map — single source of truth for internal URLs.
 * The full route map lives in docs/pages-plan.md; constants exist from Phase 0
 * so links are written once and pages can land phase by phase.
 */

export const ROUTES = {
  home: "/",
  tours: "/tours",
  destinations: "/destinations",
  plan: "/plan",
  about: "/about",
  contact: "/contact",
  whenToGo: "/when-to-go",
  travelerInfo: "/traveler-info",
  culture: "/culture",
  gallery: "/gallery",
  faq: "/faq",
  /** Rendered by the `*` catch-all; also emitted as 404.html in Phase 4. */
  notFound: "/404",
} as const;

/** Build a tour detail path from its slug (see Tour.slug in data/tours.ts). */
export function tourPath(slug: string): string {
  return `${ROUTES.tours}/${slug}`;
}

/** Build a destination detail path (Destination.id doubles as its slug). */
export function destinationPath(slug: string): string {
  return `${ROUTES.destinations}/${slug}`;
}

/**
 * Legacy home-page anchors → the page that now owns that section.
 * Keys are full hashes including `#` (matching `location.hash`).
 *
 * Empty during Phase 0 — every section still lives on the home page.
 * Entries are added as sections graduate to their own pages (Phase 3), so
 * returning visitors and shared links like `/#when-to-go` never break.
 * ScrollReset performs the redirect.
 */
export const HASH_ALIASES: Record<string, string> = {};

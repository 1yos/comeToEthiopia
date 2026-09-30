/**
 * Route scoring engine.
 * Takes user interests + trip length and returns the best-fit route from /data/routes.ts.
 * Designed so an LLM API can replace this function later without touching the UI.
 */

import type { Route } from '@/data/routes'

export type Interest = 'history' | 'trekking' | 'culture' | 'coffee' | 'wildlife'

export interface RouteQuery {
  interests: Interest[]
  duration: 7 | 10 | 14
}

export interface ScoredRoute extends Route {
  score: number
  matchedInterests: string[]
}

/**
 * Score a route against the user's query.
 * +3 per exactly matched interest, +1 for partial overlaps, +2 for duration match.
 */
function scoreRoute(route: Route, query: RouteQuery): ScoredRoute {
  let score = 0
  const matchedInterests: string[] = []

  for (const interest of query.interests) {
    if (route.interests.includes(interest)) {
      score += 3
      matchedInterests.push(interest)
    } else if (route.interests.some(i => i.startsWith(interest[0]))) {
      score += 1
    }
  }

  if (route.duration === query.duration) score += 2
  else if (Math.abs(route.duration - query.duration) <= 3) score += 1

  return { ...route, score, matchedInterests }
}

/**
 * Find the best matching route(s) for the given query.
 * Returns top 3 sorted by score descending.
 * Interface matches what an LLM API response would return.
 */
export function findRoutes(routes: Route[], query: RouteQuery): ScoredRoute[] {
  return routes
    .map(r => scoreRoute(r, query))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

/**
 * Stub for future LLM integration.
 * Replace the body with a fetch() call to your API endpoint.
 * The return type must stay ScoredRoute[] so the UI doesn't change.
 */
export async function findRoutesViaLLM(
  _routes: Route[],
  _query: RouteQuery
): Promise<ScoredRoute[]> {
  // TODO: Call VITE_GEMINI_API_URL with query, parse JSON response
  throw new Error('LLM route generation not yet configured.')
}

/**
 * check-destinations.ts
 * Validates the CMS contract in src/data/destinations.ts.
 *
 * The map and the route builder both render straight off this array, so a bad
 * record shows up as a missing pin, a dead link or an empty SVG at runtime.
 * This script fails the build instead.
 *
 * Checks
 *   1. unique ids, required fields present
 *   2. coordinates are real and inside the Ethiopia bounds
 *   3. every tourId resolves in tours.ts
 *   4. every route stop in routes.ts resolves to a destination
 *   5. every region in regions.ts has a destination (ScrollStory ↔ map parity)
 *   6. liveUrl points at the company domain
 *
 * Run: npx tsx scripts/check-destinations.ts
 * Wired into: npm run build and npm run dev (via package.json scripts)
 */

import {
  destinations,
  DESTINATION_CATEGORIES,
  ETHIOPIA_BOUNDS,
} from "../src/data/destinations";
import { tours } from "../src/data/tours";
import { routes } from "../src/data/routes";
import { regions } from "../src/data/regions";

interface Problem {
  where: string;
  detail: string;
}

const problems: Problem[] = [];

function fail(where: string, detail: string): void {
  problems.push({ where, detail });
}

const tourIds = new Set(tours.map((tour) => tour.id));
const destinationIds = new Set(destinations.map((d) => d.id));
const seen = new Set<string>();

// ── 1 + 2: record shape and coordinates ─────────────────────────────────────
for (const destination of destinations) {
  const where = `destinations.ts → ${destination.id}`;

  if (seen.has(destination.id)) {
    fail(where, `duplicate id "${destination.id}"`);
  }
  seen.add(destination.id);

  for (const field of ["id", "name", "tagline", "description"] as const) {
    if (!destination[field] || destination[field].trim() === "") {
      fail(where, `missing required field "${field}"`);
    }
  }

  if (!DESTINATION_CATEGORIES.includes(destination.category)) {
    fail(where, `unknown category "${destination.category}"`);
  }

  const { lat, lng } = destination;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    fail(where, "lat/lng must be finite numbers");
    continue;
  }

  if (
    lat < ETHIOPIA_BOUNDS.south ||
    lat > ETHIOPIA_BOUNDS.north ||
    lng < ETHIOPIA_BOUNDS.west ||
    lng > ETHIOPIA_BOUNDS.east
  ) {
    fail(
      where,
      `lat/lng ${lat},${lng} falls outside the Ethiopia bounds ` +
        `(${ETHIOPIA_BOUNDS.south}–${ETHIOPIA_BOUNDS.north} N, ` +
        `${ETHIOPIA_BOUNDS.west}–${ETHIOPIA_BOUNDS.east} E)`,
    );
  }

  // ── 3: tour references ────────────────────────────────────────────────────
  for (const id of destination.tourIds ?? []) {
    if (!tourIds.has(id)) {
      fail(where, `tourIds → "${id}" is not in tours.ts`);
    }
  }

  // ── 6: links ──────────────────────────────────────────────────────────────
  if (
    destination.liveUrl &&
    !destination.liveUrl.startsWith("https://cometoethiopiatours.com/")
  ) {
    fail(where, `liveUrl must be on cometoethiopiatours.com — got ${destination.liveUrl}`);
  }
}

if (destinations.length === 0) {
  fail("destinations.ts", "no destinations defined — the map would be empty");
}

const featuredCount = destinations.filter((d) => d.featured).length;
if (featuredCount === 0) {
  fail("destinations.ts", "no destination is flagged `featured`");
}

// ── 4: route stops ──────────────────────────────────────────────────────────
for (const route of routes) {
  const where = `routes.ts → ${route.id}`;

  if (route.stops.length < 2) {
    fail(where, "needs at least two stops for the route line to render");
  }

  for (const stop of route.stops) {
    if (!destinationIds.has(stop.regionId)) {
      fail(
        where,
        `stop "${stop.regionId}" has no matching destination id, ` +
          "so the route line cannot place it",
      );
    }
  }

  for (const id of route.tourIds ?? []) {
    if (!tourIds.has(id)) {
      fail(where, `tourIds → "${id}" is not in tours.ts`);
    }
  }
}

// ── 5: regions ↔ destinations parity ────────────────────────────────────────
for (const region of regions) {
  if (!destinationIds.has(region.id)) {
    fail(
      `regions.ts → ${region.id}`,
      "no destination with this id — ScrollStory would show a pin-less place",
    );
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
console.log("🔍 check-destinations: validating CMS contract...\n");
console.log(`  Destinations: ${destinations.length} (${featuredCount} featured)`);
console.log(`  Routes:       ${routes.length}`);
console.log(`  Regions:      ${regions.length}`);
console.log(`  Tours:        ${tours.length}\n`);

if (problems.length === 0) {
  console.log("✓ Destination data is consistent. No issues.\n");
  process.exit(0);
}

console.error(`✗ ${problems.length} problem(s) in the destination data:\n`);
for (const problem of problems) {
  console.error(`  ${problem.where}`);
  console.error(`    ${problem.detail}\n`);
}
process.exit(1);

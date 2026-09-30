/**
 * build-map.ts
 * Converts real Ethiopia GeoJSON boundaries → /src/data/ethiopiaMap.ts
 *
 * Uses d3-geo geoMercator projection fitted to a portrait 500×700 viewBox.
 * Ethiopia is roughly 2:3 width:height — a square viewBox wastes 98% of canvas.
 * Portrait 500×700 fills the geography properly.
 *
 * Run with: npx tsx scripts/build-map.ts
 */

import fs from "fs";
import path from "path";
import { geoMercator, geoPath } from "d3-geo";
import type {
  GeoPermissibleObjects,
  ExtendedFeatureCollection,
  ExtendedFeature,
} from "d3-geo";

const VB_W = 500; // viewBox width  — portrait, matches Ethiopia's aspect ratio
const VB_H = 700; // viewBox height
const PADDING = 24; // breathing room

// ── Load GeoJSON ──────────────────────────────────────────────────────────────
const dataDir = path.join(process.cwd(), "scripts", "data");

const adm0Raw = JSON.parse(
  fs.readFileSync(path.join(dataDir, "ethiopia_adm0.geojson"), "utf8"),
) as ExtendedFeatureCollection;

const adm1Raw = JSON.parse(
  fs.readFileSync(path.join(dataDir, "ethiopia_adm1.geojson"), "utf8"),
) as ExtendedFeatureCollection;

console.log(`ADM0: ${adm0Raw.features.length} feature(s)`);
console.log(`ADM1: ${adm1Raw.features.length} region(s)`);

// ── Build projection fitted to portrait viewbox ──────────────────────────────
// fitSize([width, height], geometry) — fills the portrait box exactly.
// Ethiopia is ~3:2 height:width so portrait 500×700 fills the canvas properly.
const projection = geoMercator().fitSize(
  [VB_W - PADDING * 2, VB_H - PADDING * 2],
  adm0Raw as GeoPermissibleObjects,
);

// Offset by padding so geometry has breathing room
const [tx, ty] = projection.translate();
projection.translate([tx + PADDING, ty + PADDING]);

const pathGen = geoPath(projection);

// ── Generate country outline path ────────────────────────────────────────────
const countryPath = pathGen(adm0Raw as GeoPermissibleObjects) ?? "";
console.log(`Country path length: ${countryPath.length} chars`);

// ── Generate ADM1 region paths ───────────────────────────────────────────────
interface RegionPath {
  name: string;
  path: string;
  centroid: [number, number];
}

const adm1Paths: RegionPath[] = adm1Raw.features
  .map((f: ExtendedFeature) => {
    const d = pathGen(f as GeoPermissibleObjects) ?? "";
    const centroid = pathGen.centroid(f as GeoPermissibleObjects) as [
      number,
      number,
    ];
    const name: string =
      (f.properties?.shapeName as string) ||
      (f.properties?.NAME_1 as string) ||
      (f.properties?.admin1Name as string) ||
      "Unknown";
    return { name, path: d, centroid };
  })
  .filter((r) => r.path.length > 0);

console.log(`Generated ${adm1Paths.length} ADM1 paths`);

// ── Projection parameters for browser reconstruction ─────────────────────────
const [scale] = [projection.scale()];
const [translateX, translateY] = projection.translate();
const [centerLon, centerLat] = projection.center();

// ── Well-known place coordinates ─────────────────────────────────────────────
// Verified against OpenStreetMap and Wikipedia
const PLACES = [
  { id: "addis", name: "Addis Ababa", lon: 38.74, lat: 9.03 },
  { id: "lalibela", name: "Lalibela", lon: 39.04, lat: 12.03 },
  { id: "gondar", name: "Gondar", lon: 37.47, lat: 12.6 },
  { id: "simien", name: "Simien (Debark)", lon: 38.0, lat: 13.15 },
  { id: "bahirdar", name: "Bahir Dar", lon: 37.38, lat: 11.6 },
  { id: "axum", name: "Axum", lon: 38.72, lat: 14.12 },
  { id: "gheralta", name: "Gheralta", lon: 39.55, lat: 13.63 },
  { id: "danakil", name: "Danakil / Dallol", lon: 40.3, lat: 14.24 },
  { id: "ertaale", name: "Erta Ale", lon: 40.67, lat: 13.6 },
  { id: "bale", name: "Bale (Dinsho)", lon: 39.76, lat: 7.1 },
  { id: "sofomar", name: "Sof Omar", lon: 40.85, lat: 6.9 },
  { id: "omo", name: "Omo Valley (Jinka)", lon: 36.56, lat: 5.78 },
  { id: "wenchi", name: "Wenchi Crater", lon: 37.9, lat: 8.8 },
  { id: "harar", name: "Harar", lon: 42.12, lat: 9.31 },
] as const;

// Project all places and validate positions
const projectedPlaces = PLACES.map(({ id, name, lon, lat }) => {
  const [x, y] = projection([lon, lat]) ?? [0, 0];
  return {
    id,
    name,
    lon,
    lat,
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100,
  };
});

// ── Validation ───────────────────────────────────────────────────────────────
console.log("\n── Projected place coordinates ──");
projectedPlaces.forEach(({ name, x, y }) => {
  const inBounds = x > 0 && x < VB_W && y > 0 && y < VB_H;
  console.log(
    `  ${name.padEnd(22)} x=${String(Math.round(x)).padStart(4)}  y=${String(Math.round(y)).padStart(4)}  ${inBounds ? "✓" : "✗ OUT OF BOUNDS"}`,
  );
});

// Specific checks
const addis = projectedPlaces.find((p) => p.id === "addis")!;
const danakil = projectedPlaces.find((p) => p.id === "danakil")!;
const omo = projectedPlaces.find((p) => p.id === "omo")!;
const simien = projectedPlaces.find((p) => p.id === "simien")!;
const harar = projectedPlaces.find((p) => p.id === "harar")!;

// Addis must be inside the viewbox with some margin
const addisOk =
  addis.x > PADDING &&
  addis.x < VB_W - PADDING &&
  addis.y > PADDING &&
  addis.y < VB_H - PADDING;
// Danakil should be north-east of Addis (lower y = further north; higher x = further east)
const danakilOk = danakil.x > addis.x && danakil.y < addis.y;
// Omo should be south-west of Addis (lower x = further west; higher y = further south)
const omoOk = omo.x < addis.x && omo.y > addis.y;
// Simien should be north of Addis
const simienOk = simien.y < addis.y;
// Harar should be east of Addis
const hararOk = harar.x > addis.x;

console.log(`\n── Sanity checks ──`);
console.log(
  `  Addis inside viewbox:        ${addisOk ? "✓" : "✗ FAIL"} (x=${Math.round(addis.x)}, y=${Math.round(addis.y)})`,
);
console.log(
  `  Danakil north-east of Addis: ${danakilOk ? "✓" : "✗ FAIL"} (x=${Math.round(danakil.x)}, y=${Math.round(danakil.y)})`,
);
console.log(
  `  Omo south-west of Addis:     ${omoOk ? "✓" : "✗ FAIL"} (x=${Math.round(omo.x)}, y=${Math.round(omo.y)})`,
);
console.log(
  `  Simien north of Addis:       ${simienOk ? "✓" : "✗ FAIL"} (y=${Math.round(simien.y)} vs Addis y=${Math.round(addis.y)})`,
);
console.log(
  `  Harar east of Addis:         ${hararOk ? "✓" : "✗ FAIL"} (x=${Math.round(harar.x)} vs Addis x=${Math.round(addis.x)})`,
);

if (!addisOk || !danakilOk || !omoOk || !simienOk || !hararOk) {
  console.error("\n✗ Sanity checks failed — review projection parameters");
  process.exit(1);
}
console.log("\n✓ All sanity checks passed");

// ── Write output ─────────────────────────────────────────────────────────────
const output = `/**
 * ethiopiaMap.ts — AUTO-GENERATED by scripts/build-map.ts
 * Source: geoBoundaries ETH ADM0/ADM1 (geoBoundariesCGAZ, CC-BY 4.0)
 * Projection: geoMercator fitted to ${VB_W}×${VB_H} viewBox (portrait), ${PADDING}px padding
 *
 * DO NOT EDIT MANUALLY. Re-run: npx tsx scripts/build-map.ts
 */

export const MAP_VIEWBOX_W = ${VB_W}
export const MAP_VIEWBOX_H = ${VB_H}
/** @deprecated use MAP_VIEWBOX_W / MAP_VIEWBOX_H */
export const MAP_VIEWBOX = ${VB_W}

/** SVG path string for the Ethiopia country outline */
export const countryPath = \`${countryPath}\`

/** ADM1 region outlines */
export interface RegionPath {
  name: string
  path: string
  centroid: [number, number]
}

export const adm1Paths: RegionPath[] = ${JSON.stringify(adm1Paths, null, 2)}

/**
 * Projection parameters — reconstruct the same geoMercator in the browser
 * using d3-geo or compute pixel positions from lon/lat.
 */
export const projectionParams = {
  scale: ${scale},
  translateX: ${translateX},
  translateY: ${translateY},
  centerLon: ${centerLon},
  centerLat: ${centerLat},
  viewBoxW: ${VB_W},
  viewBoxH: ${VB_H},
  padding: ${PADDING},
}

/**
 * Pre-projected place coordinates in the ${VB_W}×${VB_H} space.
 * Use these in SVG <circle> and <text> elements — no runtime projection needed.
 */
export const places = ${JSON.stringify(projectedPlaces, null, 2)} as const

export type PlaceId = typeof places[number]['id']
`;

const outPath = path.join(process.cwd(), "src", "data", "ethiopiaMap.ts");
fs.writeFileSync(outPath, output, "utf8");
console.log(`\n✓ Written: ${outPath}`);
console.log(`  Size: ${(output.length / 1024).toFixed(1)} KB`);

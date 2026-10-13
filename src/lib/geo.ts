/**
 * geo.ts — tiny projection helpers.
 *
 * The map itself uses Leaflet's own Web Mercator projection. These helpers
 * exist only for the *decorative* SVG route line in RouteBuilder, which draws
 * a stylised path between stops without instantiating a second map.
 *
 * Equirectangular is accurate enough at Ethiopia's scale (and keeps the
 * dependency list short — no d3, no projection library).
 */

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Convert a lon/lat point into local x/y pixels inside a viewBox that spans
 * the given bounds. Returns x growing east and y growing south — the same
 * convention as SVG.
 */
export function projectToBox(
  point: LatLng,
  bounds: { north: number; south: number; west: number; east: number },
  width: number,
  height: number,
): { x: number; y: number } {
  const spanX = bounds.east - bounds.west;
  const spanY = bounds.north - bounds.south;

  const x = ((point.lng - bounds.west) / spanX) * width;
  // Mercator would compress latitude here; at Ethiopia's latitudes
  // equirectangular error is under 2%, which reads as correct on screen.
  const y = ((bounds.north - point.lat) / spanY) * height;

  return { x, y };
}

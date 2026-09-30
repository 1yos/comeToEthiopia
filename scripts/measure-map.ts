import { geoMercator, geoPath } from 'd3-geo'
import fs from 'fs'
import type { GeoPermissibleObjects } from 'd3-geo'

const adm0 = JSON.parse(fs.readFileSync('scripts/data/ethiopia_adm0.geojson', 'utf8'))

const proj = geoMercator().fitExtent([[0, 0], [500, 700]], adm0 as GeoPermissibleObjects)
const gen  = geoPath(proj)

const bounds = gen.bounds(adm0 as GeoPermissibleObjects)
console.log('Bounding box:', JSON.stringify(bounds))
console.log('Width:', Math.round(bounds[1][0] - bounds[0][0]), 'px')
console.log('Height:', Math.round(bounds[1][1] - bounds[0][1]), 'px')
console.log('Aspect ratio:', ((bounds[1][0] - bounds[0][0]) / (bounds[1][1] - bounds[0][1])).toFixed(2))

const places = [
  { id: 'addis',   lon: 38.74, lat: 9.03  },
  { id: 'danakil', lon: 40.30, lat: 14.24 },
  { id: 'omo',     lon: 36.56, lat: 5.78  },
  { id: 'simien',  lon: 38.00, lat: 13.15 },
  { id: 'harar',   lon: 42.12, lat: 9.31  },
]
places.forEach(p => {
  const [x, y] = proj([p.lon, p.lat]) ?? [0, 0]
  console.log(`  ${p.id.padEnd(10)} x=${Math.round(x)}  y=${Math.round(y)}`)
})

# Image and Data Credits — Come to Ethiopia Tours

Last updated: 2026-09-23

---

## Company-owned images

All images below are the property of Come to Ethiopia Tours.
Source: cometoethiopiatours.com/wp-content/uploads/
Used with the owner's permission. Original files are 750px wide (company thumbnail size).

| File in public/media                                                                     | Subject                     | Used in                                      |
| ---------------------------------------------------------------------------------------- | --------------------------- | -------------------------------------------- |
| regions/Simien-Mountains-Ethiopia-Tours-and-Travel-Packages-480.webp                     | Simien Mountains            | Hero background, ScrollStory Simien scene    |
| tours/Lalibela-Ethiopia-Tours-480.webp                                                   | Lalibela churches           | Hero overlay, ScrollStory Lalibela, Map card |
| tours/Half-Day-Addis-Ababa-Tour-to-National-Museum-Trinity-Cathedral-Merkato-480.webp    | Addis Ababa / Merkato       | ScrollStory Addis scene, Map card            |
| regions/Omo-Valley-Tribe-Ethiopia-Tour-Travel-Package-480.webp                           | Omo Valley tribal community | ScrollStory Omo scene, Map card              |
| regions/Dalol-Danakil-Depression-Ethiopia-Tours-and-Holiday-Packages-480.webp            | Dallol hydrothermal field   | ScrollStory Danakil scene, Map card          |
| tours/3-Day-Expedition-to-Dallol-Salt-Flats-Danakil-Depression-Erta-Ale-Volcano-480.webp | Danakil expedition          | PopularTours rail                            |
| tours/3-Day-Omo-Valley-Quick-Tour-to-Mursi-Hamer-Karo-Tribes-480.webp                    | Omo Valley tribes           | PopularTours rail                            |
| tours/3-Day-Tour-of-Lalibel-Yemrehanna-Kristos-Hiking-to-Asheton-Maryam-480.webp         | Lalibela churches           | PopularTours rail                            |
| tours/4-Day-Bale-Mountains-Sof-Omar-Caves-Tours-480.webp                                 | Bale Mountains              | PopularTours rail                            |
| tours/4-Day-Simien-Mountains-Hiking-Tour-480.webp                                        | Simien Mountains trekking   | PopularTours rail                            |
| tours/5-Day-Bale-Mountains-Trek-Ethiopian-Wolves-Alpine-Lakes-480.webp                   | Bale Mountains trek         | PopularTours rail                            |
| tours/7-Day-Historic-Tour-to-Lake-Tana-Gonder-Lalibela-Simien-Mountains-480.webp         | Lake Tana monasteries       | PopularTours rail                            |
| tours/Day-Trip-to-Wenchi-Crater-Lake-480.webp                                            | Wenchi Crater Lake          | PopularTours rail                            |
| tours/Gheralta-Mountains-Ethiopia-Tours-and-Travel-Packages-480.webp                     | Gheralta cliffs, Tigray     | PopularTours rail                            |
| hero/Home-Page-Collage-480.webp                                                          | Ethiopia collage            | Hero fallback                                |
| regions/Omo-Valley-Ethiopia-Tours-and-Travel-Packages-480.webp                           | Omo Valley landscape        | Supplemental                                 |
| regions/Axum-Aksum-Historical-Attractions-of-Ethiopia-Tours-and-Travel-Holidays-480.webp | Axum stelae                 | Supplemental                                 |
| regions/Gonder-Fasiledes-Mountains-Ethiopia-Tour-Travel-Package-480.webp                 | Gondar Fasil Ghebbi         | Supplemental                                 |
| regions/Bale-Mountains-Ethiopia-Tour-Travel-Package-480.webp                             | Bale Mountains              | Supplemental                                 |
| regions/Erta-Ale-Volcano-Ethiopia-Tours-and-Holiday-Packages-480.webp                    | Erta Ale volcano            | Supplemental                                 |

---

## Map tiles and boundary data

| Source                                   | License                        | Used in                       |
| ---------------------------------------- | ------------------------------ | ----------------------------- |
| OpenStreetMap contributors                | ODbL 1.0                       | Base map data (all tiles)     |
| OpenTopoMap (`tile.opentopomap.org`)      | CC-BY-SA 3.0                   | Base map ("Terrain")          |
| SRTM elevation data                       | Public domain (NASA/USGS)      | Rendered inside OpenTopoMap   |

The previous "Paper" base map (CARTO Positron, `basemaps.cartocdn.com`) was
removed along with the base-map switcher — the site now ships terrain tiles
only.

Attribution is rendered by Leaflet's own attribution control in the bottom-right
corner of the map (`attributionControl: true` in `src/sections/Map.tsx`). It must
never be disabled — the ODbL and CC-BY licences above require it.

The previous hand-drawn SVG map used geoBoundaries ETH ADM0/ADM1 (CC-BY 4.0,
Runfola et al. 2020). It has been removed; `scripts/build-map.ts` and
`src/data/ethiopiaMap.ts` are deleted along with the `d3-geo` dependency.

---

## Images the owner still needs to supply

These appear in the asset-manifest as "needs my photo". Current company thumbnails are used
as stand-ins. Replace when originals are available:

1. **Hero background** — Simien escarpment, golden hour, 2400×1350px minimum for retina.
   Currently: 750px thumbnail from company site.

2. **Omo Valley portrait** — Hamar woman at Dimeka/Key Afer market, ochre-butter braids.
   Currently: generic Omo Valley Tribe image.

3. **Lalibela interior** — candlelight inside a rock-hewn church.
   Currently: exterior Lalibela photo.

4. **Coffee ceremony** — hands pouring from a jebena, close-up.
   Currently: no dedicated coffee ceremony photo.

5. **Erta Ale at night** — lava lake glow, crater rim silhouette.
   Currently: daytime Erta Ale photo.

6. **Ambient audio** — Krar strings loop, OGG + MP3.
   Currently: AudioToggle is disabled (AUDIO_ENABLED = false).
   When ready: place file at public/media/ambient-krar.ogg, set AUDIO_ENABLED = true
   in src/components/AudioToggle.tsx.

---

## Footer attribution (shown on the live site)

> "Map data © OpenStreetMap contributors, SRTM · tiles © OpenTopoMap · Photos: Come to Ethiopia Tours"

The string lives in `src/data/content.ts` under `map.credits` and is read by
`src/sections/Footer.tsx`. Do not hard-code it in a component.

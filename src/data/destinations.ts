/**
 * destinations.ts — THE single source of truth for every mappable place.
 *
 * CMS-READY CONTRACT
 * ──────────────────
 * A CMS stores one record per `Destination`. Required fields:
 *   id, name, lat, lng   → id + coordinates place the pin on the map
 *   category             → one of DESTINATION_CATEGORIES
 * Everything else is optional; the UI degrades gracefully when it is missing.
 *
 * To connect a CMS later, replace the `destinations` array with a fetch:
 *
 *   const { data } = await fetch("/api/destinations").then((r) => r.json());
 *   return data satisfies Destination[];
 *
 * `src/sections/Map.tsx` renders entirely off the array it is handed, so new
 * destinations never require touching map code or CSS.
 *
 * Coordinates are WGS84 decimal degrees (lat: north positive, lng: east positive).
 */

export const DESTINATION_CATEGORIES = [
  "nature",
  "history",
  "culture",
  "expedition",
] as const;

export type DestinationCategory = (typeof DESTINATION_CATEGORIES)[number];

/** Labels for the category filter chips and marker tooltips. */
export const CATEGORY_LABELS: Record<DestinationCategory, string> = {
  nature: "Mountains & nature",
  history: "Historic north",
  culture: "People & culture",
  expedition: "Expedition",
};

export interface Destination {
  /** Stable slug — also used for anchor links, route stops and CMS lookups. */
  id: string;
  name: string;
  /** Ge'ez numeral used as the map pin label (፩ ፪ ፫ …). Optional. */
  numeral?: string;
  /** Place name in Ethiopic script. Optional. */
  geezName?: string;
  /** WGS84 latitude. */
  lat: number;
  /** WGS84 longitude. */
  lng: number;
  category: DestinationCategory;
  /** Flagship destination — larger pin, sorted first. */
  featured?: boolean;
  /** ≤12 words, sensory and specific. */
  tagline: string;
  /** 1–2 short paragraphs for the detail card. Blank line between them. */
  description: string;
  bestSeason?: string;
  howToGetThere?: string;
  daysNeeded?: string;
  altitude?: string;
  /** Image basename inside /public/media/<imageFolder>/, without the -480 suffix. */
  image?: string;
  imageFolder?: "regions" | "tours";
  /** Alt text for the image. Required when `image` is set. */
  imageAlt?: string;
  /** Ids from tours.ts that visit this destination. */
  tourIds?: string[];
  /** Canonical URL on cometoethiopiatours.com. */
  liveUrl?: string;
}

export const destinations: Destination[] = [
  /** ── Mountains & nature ─────────────────────────────────────────────── */
  {
    id: "simien",
    name: "Simien Mountains",
    numeral: "፩",
    geezName: "ስሜን",
    lat: 13.15,
    lng: 38.0,
    category: "nature",
    featured: true,
    tagline: "4,543 metres. Gelada baboons. The Ethiopian wolf at dawn.",
    description:
      "The escarpment at Chenek drops 1,500 metres to the Tekezé valley. Nothing else in your field of view moves except the wind in the giant lobelia and, if you are early enough, an Ethiopian wolf crossing the moorland.\n\nThe 4-day trek from Sankaber to Chenek is the core of this trip — two days up, two days out, camping at altitude each night. We carry everything. You walk.",
    bestSeason: "Oct – Mar (dry season; clearest skies, passable roads)",
    howToGetThere:
      "Fly Addis → Gondar (45 min), drive to Debark (3 hr), trek from Sankaber",
    daysNeeded: "4 days (classic Sankaber–Chenek trek)",
    altitude: "2,200 – 4,543 m",
    image: "Simien-Mountains-Ethiopia-Tours-and-Travel-Packages",
    imageFolder: "regions",
    imageAlt:
      "Simien escarpment at golden hour, dramatic vertical drop to the valley below",
    tourIds: ["simien-4day"],
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/4-day-simien-mountains-hiking-tour/",
  },
  {
    id: "bale",
    name: "Bale Mountains",
    numeral: "፱",
    geezName: "ባሌ",
    lat: 7.0994,
    lng: 39.7586,
    category: "nature",
    tagline: "Alpine moorland at 4,000m, and the wolves that live there.",
    description:
      "Bale is the largest alpine habitat in Africa — the Sanetti Plateau runs for 20km above 4,000m, studded with giant lobelia. Two-thirds of the world's Ethiopian wolves live here.\n\nThe Harenna forest on the southern slope drops 2,000 metres through bamboo and cloud forest in a single afternoon.",
    bestSeason: "Nov – Mar (Nov–Feb driest on the plateau)",
    howToGetThere: "Drive Addis → Dinsho (7 hr) or fly to Robe, then 4WD",
    daysNeeded: "4–5 days for the plateau and Harenna",
    altitude: "1,600 – 4,377 m",
    image: "Bale-Mountains-Ethiopia-Tour-Travel-Package",
    imageFolder: "regions",
    imageAlt: "Bale Mountains moorland with giant lobelia under an open sky",
    tourIds: ["bale-sofomar-4day", "bale-trek-5day"],
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/eastern-ethiopia-tours/4-day-bale-mountains-sof-omar-caves-tours/",
  },
  {
    id: "bahirdar",
    name: "Bahir Dar & Lake Tana",
    numeral: "፬",
    geezName: "ባህር ዳር",
    lat: 11.5936,
    lng: 37.3908,
    category: "nature",
    tagline: "Papyrus boats to island monasteries, and the Blue Nile falling.",
    description:
      "Lake Tana is the source of the Blue Nile. Tankwa reed boats still cross it to 14th-century island monasteries, where the murals have never been restored and the manuscripts are kept wrapped in cloth.\n\nThirty kilometres downstream, the Blue Nile falls 45 metres over a basalt lip. Half a day each — both are done from Bahir Dar.",
    bestSeason: "Oct – Mar (dry season, full road access)",
    howToGetThere: "Fly Addis → Bahir Dar (1 hr), boat from the lakeshore",
    daysNeeded: "1–2 days",
    altitude: "1,800 m",
    image: "Gonder-Fasiledes-Mountains-Ethiopia-Tour-Travel-Package",
    imageFolder: "regions",
    imageAlt: "Lake Tana shoreline with traditional reed boats near Bahir Dar",
    tourIds: ["north-historic-7day"],
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/7-day-northern-ethiopia-historic-tour/",
  },
  {
    id: "sofomar",
    name: "Sof Omar Caves",
    numeral: "፲",
    geezName: "ሶፎማር",
    lat: 6.9,
    lng: 40.85,
    category: "nature",
    tagline: "The Web River disappears into 15km of limestone cave.",
    description:
      "Sof Omar is the largest cave system in Ethiopia: 15.1km of passages cut by the Web River through limestone. The chamber named 'the Cathedral' is a hundred metres across.\n\nGuides carry pressure lamps, and you walk the passage the river is not using. Bale and Sof Omar are usually done as one trip.",
    bestSeason: "Nov – Mar (low water)",
    howToGetThere: "Drive from Robe (2 hr) or Bale (3 hr) by 4WD",
    daysNeeded: "Half day",
    image: "4-Day-Bale-Mountains-Sof-Omar-Caves-Tours",
    imageFolder: "tours",
    imageAlt: "Limestone cave passage at Sof Omar lit by a collapse in the roof",
    tourIds: ["bale-sofomar-4day"],
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/eastern-ethiopia-tours/4-day-bale-mountains-sof-omar-caves-tours/",
  },
  /** ── Historic north ─────────────────────────────────────────────────── */
  {
    id: "lalibela",
    name: "Lalibela",
    numeral: "፪",
    geezName: "ላሊበላ",
    lat: 12.0317,
    lng: 39.0473,
    category: "history",
    featured: true,
    tagline: "11 churches carved into rock. One is below your feet.",
    description:
      "Lalibela at 5:40am. Cold stone underfoot, a priest's white shawl catching the last of the kerosene lamp, and somewhere below you — carved from a single block of volcanic rock — Beta Giyorgis.\n\nWe run 3-day tours that cover all 11 churches across both clusters, plus the hike to Asheton Maryam monastery at 3,150m. If your trip falls in January, Timkat (Jan 19) fills every guesthouse in town — book that months ahead.",
    bestSeason: "Sep – Apr. Timkat (Jan 19) — book 3+ months ahead.",
    howToGetThere: "Fly Addis → Lalibela direct (1 hr 15 min)",
    daysNeeded: "3 days minimum to cover all 11 churches properly",
    altitude: "2,630 m",
    image: "Lalibela-Ethiopia-Tours",
    imageFolder: "tours",
    imageAlt:
      "Lalibela rock-hewn church complex seen from above in red volcanic rock",
    tourIds: ["lalibela-3day", "lalibela-danakil-6day"],
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/3-day-tour-of-lalibela-yemrehanna-kristos-hiking-to-asheton-maryam/",
  },
  {
    id: "gondar",
    name: "Gondar",
    numeral: "፫",
    geezName: "ጎንደር",
    lat: 12.6,
    lng: 37.4667,
    category: "history",
    tagline: "Imperial castles, and the church with 80 faces looking up.",
    description:
      "Fasil Ghebbi is a walled city of castles built by Emperor Fasilides in 1636, when Gondar was the capital of the Ethiopian empire. Twenty minutes away, Debre Birhan Selassie holds the most photographed ceiling in Ethiopia: 80 winged angel faces, each one different.\n\nGondar is the northern gateway — most Simien treks start with a night here and end with a folkloric dinner in town.",
    bestSeason: "Oct – Mar. Timkat (Jan 19) here is the largest in the country.",
    howToGetThere: "Fly Addis → Gondar (1 hr 15 min direct)",
    daysNeeded: "1–2 days",
    altitude: "2,133 m",
    image: "Gonder-Fasiledes-Mountains-Ethiopia-Tour-Travel-Package",
    imageFolder: "regions",
    imageAlt: "Gondar castle complex with stone towers and arched windows",
    tourIds: ["north-historic-7day"],
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/7-day-northern-ethiopia-historic-tour/",
  },

  {
    id: "axum",
    name: "Axum",
    numeral: "፭",
    geezName: "አክሱም",
    lat: 14.1211,
    lng: 38.7231,
    category: "history",
    tagline: "Stelae, tombs and the Ark — the empire that became Ethiopia.",
    description:
      "Axum was the capital of a trading empire that minted its own coins and ruled the Red Sea routes 1,700 years ago. The stelae field holds granite obelisks up to 24 metres tall, carved to look like multi-storey towers.\n\nBelow them, the tombs of Kings Kaleb and Gebre Meskel. St Mary of Zion is where the Ethiopian Orthodox Church says the Ark of the Covenant is kept.",
    bestSeason: "Oct – Mar",
    howToGetThere: "Fly Addis → Axum (1 hr 30 min direct)",
    daysNeeded: "1 day",
    altitude: "2,130 m",
    image:
      "Axum-Aksum-Historical-Attractions-of-Ethiopia-Tours-and-Travel-Holidays",
    imageFolder: "regions",
    imageAlt: "Axum stelae field with tall carved granite obelisks",
    tourIds: ["tigray-5day"],
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/5-days-tigray-rock-hewn-churches-tour/",
  },
  {
    id: "gheralta",
    name: "Gheralta & Tigray",
    numeral: "፮",
    geezName: "ገራልታ",
    lat: 13.6333,
    lng: 39.55,
    category: "history",
    tagline: "Churches on cliff ledges. You climb to reach them.",
    description:
      "The Gheralta mountains hide rock-hewn churches cut into sandstone pinnacles — Abuna Yemata Guh sits 2,580m up a cliff face you climb in bare feet.\n\nInside, 5th-century frescoes in ochre, indigo and sulphur still hold their colour. It is the most demanding half-day in northern Ethiopia, and the most worth it.",
    bestSeason: "Oct – Mar",
    howToGetThere: "Fly Addis → Mekelle, drive 2 hr to Hawzien",
    daysNeeded: "2 days (3–4 churches)",
    altitude: "2,100 – 2,580 m",
    image: "Gheralta-Mountains-Ethiopia-Tours-and-Travel-Packages",
    imageFolder: "tours",
    imageAlt:
      "Gheralta sandstone mountains at dusk with a rock church on a ledge",
    tourIds: ["tigray-5day"],
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/5-days-tigray-rock-hewn-churches-tour/",
  },

  /** ── Expedition ─────────────────────────────────────────────────────── */
  {
    id: "danakil",
    name: "Danakil & Dallol",
    numeral: "፯",
    geezName: "ዳናኪል",
    lat: 14.2417,
    lng: 40.3,
    category: "expedition",
    featured: true,
    tagline: "−125 metres. Lava lake overnight. Salt miners at 5am.",
    description:
      "The Danakil is the hottest place we run tours. The Dallol hydrothermal field is acid-yellow and acid-green — that is not a filter. The Erta Ale lava lake has been active since at least 1906, and you sleep at the crater rim.\n\nArmed Afar guides escort every convoy; this is a border region. November to March only. Summer temperature exceeds 50°C and the trip does not run.",
    bestSeason: "Nov – Mar only.",
    howToGetThere: "Fly Addis → Semera (50 min), 4WD convoy into the depression",
    daysNeeded: "3 days (Dallol + Erta Ale overnight)",
    altitude: "−125 – 0 m",
    image: "Dalol-Danakil-Depression-Ethiopia-Tours-and-Holiday-Packages",
    imageFolder: "regions",
    imageAlt:
      "Dallol hydrothermal field with acid-yellow and green salt formations",
    tourIds: ["danakil-3day", "lalibela-danakil-6day"],
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/3-day-expedition-to-dallol-salt-flats-danakil-depression-erta-ale-volcano/",
  },
  /** ── People & culture ───────────────────────────────────────────────── */
  {
    id: "omo",
    name: "Omo Valley",
    numeral: "፰",
    geezName: "ኦሞ",
    lat: 5.78,
    lng: 36.56,
    category: "culture",
    featured: true,
    tagline: "Thursday market at Key Afer. Come with a guide who knows the families.",
    description:
      "The lower Omo Valley is 580km south of Addis. The Karo people number fewer than 3,000. The Thursday market at Key Afer draws Banna, Hamer and Tsemay traders to the same lane.\n\nWe use community-approved visit fees and local guides from the valley — not Jinka-based operators who drive in. The road down requires a 4WD and a driver who has done it in rain.",
    bestSeason: "Nov – Mar (dry roads). Avoid Jun–Sep.",
    howToGetThere:
      "Fly Addis → Jinka (1 hr 15 min direct), then 4WD into the valley",
    daysNeeded: "3 days minimum. 7 days for the full valley circuit.",
    altitude: "400 – 700 m",
    image: "Omo-Valley-Tribe-Ethiopia-Tour-Travel-Package",
    imageFolder: "regions",
    imageAlt: "Omo Valley community in ochre body paint at a weekly market",
    tourIds: ["omo-valley-3day"],
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/southern-cultural-ethiopia-tours/3-day-omo-valley-quick-tour-to-mursi-hamer-karo-tribes/",
  },
  {
    id: "harar",
    name: "Harar",
    numeral: "፲፩",
    geezName: "ሐረር",
    lat: 9.3117,
    lng: 42.1181,
    category: "culture",
    tagline: "82 mosques inside a wall, and hyenas at the gate.",
    description:
      "Harar Jugol is a walled city of 82 mosques and 102 shrines in one square kilometre, UNESCO listed, and the fourth holiest city in Islam. The lanes are too narrow for cars and the houses lean over them in five colours.\n\nAfter dark, the hyena men feed wild spotted hyenas by hand just outside the wall — the same animals have come to the same spot for generations.",
    bestSeason: "Oct – Mar",
    howToGetThere: "Fly Addis → Dire Dawa (1 hr), drive 50 min uphill",
    daysNeeded: "2 days",
    altitude: "1,885 m",
    image: "7-Day-Historic-Tour-to-Lake-Tana-Gonder-Lalibela-Simien-Mountains",
    imageFolder: "tours",
    imageAlt: "Harar walled city lane with brightly painted houses and arches",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/eastern-ethiopia-tours/",
  },
  {
    id: "addis",
    name: "Addis Ababa",
    numeral: "፲፪",
    geezName: "አዲስ አበባ",
    lat: 9.03,
    lng: 38.74,
    category: "culture",
    featured: true,
    tagline: "Lucy, Merkato, and the best coffee you will drink.",
    description:
      "Every trip starts and ends here. The National Museum holds 'Lucy' — Australopithecus afarensis, 3.2 million years old. Merkato is the largest open-air market in Africa. Entoto sits at 3,200m over the whole city.\n\nHalf a day covers the museum, Holy Trinity Cathedral and the spice lanes of Merkato. Add a day for Wenchi crater lake or the Tiya stelae.",
    bestSeason: "Year-round",
    howToGetThere:
      "International flights to Bole Airport. Direct from Nairobi, Dubai, Istanbul, London, Frankfurt.",
    daysNeeded: "½ day city tour. Full day for Wenchi or Tiya.",
    altitude: "2,355 m",
    image:
      "Half-Day-Addis-Ababa-Tour-to-National-Museum-Trinity-Cathedral-Merkato",
    imageFolder: "tours",
    imageAlt: "Addis Ababa Merkato at 7am with morning light through stalls",
    tourIds: ["addis-half-day", "wenchi-day-trip"],
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/addis-ababa-surroundings-tours/half-day-addis-ababa-tour-to-national-museum-trinity-cathedral-merkato/",
  },
];

/** Destinations flagged `featured`, in list order. */
export const featuredDestinations = destinations.filter((d) => d.featured);

/** Lookup by id — used by the route builder and by CMS deep links. */
export function getDestination(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id);
}

/** Geographic bounds of the well-known Ethiopian tour area (WGS84). */
export const ETHIOPIA_BOUNDS = {
  south: 3.3,
  west: 32.9,
  north: 15.0,
  east: 48.1,
} as const;


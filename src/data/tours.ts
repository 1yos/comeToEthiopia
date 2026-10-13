/**
 * Real tour packages from Come to Ethiopia Tours.
 * Data sourced from cometoethiopiatours.com — itineraries rewritten
 * in the editorial voice of the steering file. Facts preserved.
 * Links reference the live tour pages.
 * TODO-REVIEW: All Amharic place names and cultural descriptions.
 */

export interface TourDay {
  day: number;
  title: string;
  description: string;
}

export interface Tour {
  id: string;
  /** URL slug — defaults to id if omitted */
  slug?: string;
  name: string;
  duration: number; // days
  tagline: string; // ≤12 words, sensory and specific — steering voice
  highlights: string[]; // 3–5 specific highlights, no brochure phrasing
  days: TourDay[];
  includes: string[];
  excludes: string[];
  interests: string[]; // for route-builder scoring
  regionIds: string[]; // maps to regions.ts ids
  bestSeason?: string;
  difficulty: "easy" | "moderate" | "demanding";
  liveUrl: string; // canonical URL on cometoethiopiatours.com
  imageSlot: string; // filename in /public/media/tours/
  imageAlt: string;
}

export const tours: Tour[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // ADDIS ABABA & SURROUNDINGS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "addis-half-day",
    slug: "half-day-addis-ababa-tour-to-national-museum-trinity-cathedral-merkato",
    name: "Half-Day Addis Ababa — National Museum, Trinity Cathedral, Merkato",
    duration: 1,
    tagline: "Lucy, incense, and 13,000 market stalls before lunch",
    highlights: [
      '"Lucy" — Australopithecus afarensis, 3.2 million years old, in a glass case at the National Museum',
      "Holy Trinity Cathedral: the burial site of Emperor Haile Selassie, completed 1944",
      "Merkato: largest open-air market in Africa — spices, textiles, livestock, noise",
      "Mount Entoto at 3,200m: the city below looks like it is still deciding what to become",
    ],
    days: [
      {
        day: 1,
        title: "National Museum → Trinity Cathedral → Merkato → Entoto",
        description:
          "Start at the National Museum — allow an hour for Lucy and the prehistory galleries alone. Walk to Holy Trinity Cathedral, where the Empress Menen and Haile Selassie are buried under the chancel. Then Merkato: enter from the southwest corner, follow the spice section east, exit when you find the coffee roasters. Drive to Mount Entoto for city views and Entoto Maryam Church.",
      },
    ],
    includes: [
      "Ground transport",
      "Entrance fees",
      "Professional English-speaking guide",
    ],
    excludes: ["Meals", "Beverages", "Personal items"],
    interests: ["history", "culture", "coffee"],
    regionIds: ["addis"],
    bestSeason: "Year-round",
    difficulty: "easy",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/addis-ababa-surroundings-tours/half-day-addis-ababa-tour-to-national-museum-trinity-cathedral-merkato/",
    imageSlot:
      "Half-Day-Addis-Ababa-Tour-to-National-Museum-Trinity-Cathedral-Merkato.webp",
    imageAlt:
      "Merkato market Addis Ababa, colourful fabric stalls, street level morning light",
  },
  {
    id: "addis-food-culture",
    slug: "half-day-addis-ababa-food-culture-tour",
    name: "Half-Day Addis Ababa Food & Culture Tour",
    duration: 1,
    tagline: "Injera from scratch. Coffee over charcoal. Live music at dinner.",
    highlights: [
      "Local market visit to source the raw materials — teff, spices, berbere — before cooking",
      "Hands-on injera and coffee ceremony session in a local home",
      "Evening at Yod Abyssinia or 2000 Habesha: traditional food, tej honey wine, dances from across Ethiopia",
    ],
    days: [
      {
        day: 1,
        title: "Market → cooking session → cultural dinner",
        description:
          "Afternoon: drive to the local market to see teff, berbere, and spice traders. Then to a local home for an injera-making and coffee ceremony session — the fermentation, the clay pot, the three rounds. Evening at one of Addis's major cultural restaurants: injera spreads, honey wine, and live music representing different regions.",
      },
    ],
    includes: [
      "Ground transport",
      "Entrance and activity fees",
      "Professional English-speaking guide",
    ],
    excludes: [
      "Dinner (own cost at restaurant)",
      "Beverages",
      "Personal items",
    ],
    interests: ["culture", "coffee"],
    regionIds: ["addis"],
    bestSeason: "Year-round",
    difficulty: "easy",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/addis-ababa-surroundings-tours/half-day-addis-ababa-food-culture-tour/",
    imageSlot:
      "Half-Day-Addis-Ababa-Tour-to-National-Museum-Trinity-Cathedral-Merkato.webp",
    imageAlt:
      "Traditional Ethiopian coffee ceremony, clay pot on charcoal, Addis Ababa",
  },
  {
    id: "wenchi-day-trip",
    slug: "day-trip-to-wenchi-crater-lake",
    name: "Day Trip to Wenchi Crater Lake",
    duration: 1,
    tagline:
      "A volcanic crater, a 13th-century monastery on an island, one boat",
    highlights: [
      "Wenchi Crater Lake at 2,600m — the water changes from blue at dawn to green by noon",
      "Boat trip to Galila Island and the monastery of St. Kristos, built in the 13th century",
      "Sulfur springs and boiling water fountains around the crater rim",
      "Descent to the lake by foot or on horseback through Oromo farmland — 3 to 4 hours round trip",
    ],
    days: [
      {
        day: 1,
        title: "155km drive west, crater descent, island monastery, return",
        description:
          "Depart Addis at 6am. Two and a half hours driving. Trek or ride down to the lake — the path passes through terraced Oromo farmland before the volcanic rim comes into view. Boat to Galila Island, visit St. Kristos monastery, walk the crater edge. Return to Addis by evening.",
      },
    ],
    includes: [
      "Ground transport (155km each way)",
      "Entrance fees",
      "Professional guide",
    ],
    excludes: [
      "Horse rental and boat fees (paid locally)",
      "Meals",
      "Insurance",
    ],
    interests: ["trekking", "culture", "wildlife"],
    regionIds: ["addis"],
    bestSeason: "Oct – May",
    difficulty: "moderate",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/addis-ababa-surroundings-tours/day-trip-to-wenchi-crater-lake/",
    imageSlot: "Day-Trip-to-Wenchi-Crater-Lake.webp",
    imageAlt:
      "Wenchi Crater Lake, volcanic crater at 2,600m, blue-green water, Ethiopia",
  },
  {
    id: "menagesha-day-trip",
    slug: "day-trip-from-addis-ababa-to-menagesha-suba-forest",
    name: "Day Trip to Menagesha Suba Forest",
    duration: 1,
    tagline:
      "Ancient junipers. Five endemic birds. Royal protection since 1400.",
    highlights: [
      "Menagesha Suba Forest: 2,500 hectares of indigenous juniper and Erica Arborea, protected since the reign of Emperor Zera Yacob (1434–1468)",
      "150 recorded bird species including five Ethiopian endemics — Abyssinian Catbird, Yellow-fronted Parrot",
      "Menelik's Bushbuck: endemic to Ethiopia, seen regularly in the forest understorey",
    ],
    days: [
      {
        day: 1,
        title: "Drive to Menagesha (45km). Forest walk. Return.",
        description:
          "Early pickup from hotel. 45 minutes to the forest edge. Full morning guided walk through the indigenous forest — the trees are old enough that they pre-date the founding of Addis Ababa. Packed lunch at the forest edge. Return drive by mid-afternoon.",
      },
    ],
    includes: [
      "Ground transport",
      "Park entrance fees",
      "Fuel and driver",
      "Professional English-speaking guide",
    ],
    excludes: [
      "International flights",
      "Meals and beverages",
      "Insurance",
      "Photography fees",
      "Personal items",
    ],
    interests: ["wildlife", "trekking"],
    regionIds: ["addis"],
    bestSeason: "Oct – Jun",
    difficulty: "easy",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/addis-ababa-surroundings-tours/day-trip-from-addis-ababa-to-menagesha-suba-forest/",
    imageSlot:
      "Half-Day-Addis-Ababa-Tour-to-National-Museum-Trinity-Cathedral-Merkato.webp",
    imageAlt:
      "Menagesha Suba Forest, indigenous juniper trees, forest understory, Ethiopia",
  },
  {
    id: "debre-libanos-day-trip",
    slug: "day-trip-to-debre-libanos-monasteries-portuguese-bridge",
    name: "Day Trip to Debre Libanos & Portuguese Bridge",
    duration: 1,
    tagline:
      "13th-century monastery. 1,000-metre gorge. Gelada baboons on the rim.",
    highlights: [
      "Debre Libanos monastery — founded by Saint Tekle Haymanot; the cave where he prayed is a short steep walk from the church",
      "Jemma River Gorge: 1,000 metres deep, visible from the lunch terrace at the monastery",
      "Portuguese Bridge (Ras Darge's Bridge): stone arch construction from the 17th century, still standing",
      "Gelada baboons and birds of prey along the cliff edges on the return",
    ],
    days: [
      {
        day: 1,
        title:
          "Pickup 07:30. Entoto Hills → Debre Libanos → gorge → return 18:00",
        description:
          "Depart Addis at 07:30 heading north. Pass through the Entoto Hills. Two-hour drive to Debre Libanos. Visit the church, museum, and Saint Tekle Haymanot's cave. Late lunch with the gorge below. Short walk to the Portuguese Bridge. Back to Addis by 18:00.",
      },
    ],
    includes: ["Ground transport", "Entrance fees", "Professional guide"],
    excludes: ["Meals", "Beverages", "Insurance", "Personal items"],
    interests: ["history", "wildlife", "culture"],
    regionIds: ["addis"],
    bestSeason: "Oct – Jun",
    difficulty: "easy",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/addis-ababa-surroundings-tours/day-trip-to-debre-libanos-monasteries-portuguese-bridge/",
    imageSlot: "Day-Trip-to-Wenchi-Crater-Lake.webp",
    imageAlt:
      "Debre Libanos monastery cliff face and Jemma River Gorge, Ethiopia",
  },
  {
    id: "adadi-mariam-day-trip",
    slug: "day-trip-to-adadi-mariam-monolithic-church-melka-kuntre-tiya-stelae",
    name: "Day Trip to Adadi Mariam, Melka Kunture & Tiya Stelae",
    duration: 1,
    tagline: "13th-century rock-hewn church. Prehistoric tools. UNESCO stelae.",
    highlights: [
      "Adadi Mariam: 13th-century monolithic rock-hewn church, still in active liturgical use, southwest of Addis",
      "Melka Kunture: prehistoric site with fossil and tool exhibits spanning the early history of the species",
      "Tiya stelae field: 46 UNESCO-listed carved standing stones from the 14th century, meaning still debated",
    ],
    days: [
      {
        day: 1,
        title: "Drive southwest. Adadi Mariam → Melka Kunture → Tiya → Addis.",
        description:
          "Full day circuit southwest of the capital. Adadi Mariam church first — the rock-carving style is closely related to Lalibela but it sees a fraction of the visitors. Melka Kunture archaeological site, then Tiya stelae. Return to Addis in the late afternoon.",
      },
    ],
    includes: [
      "Ground transport",
      "Entrance fees",
      "Fuel and driver",
      "Professional guide",
    ],
    excludes: ["Meals", "Beverages", "Insurance", "Personal items"],
    interests: ["history", "culture"],
    regionIds: ["addis"],
    bestSeason: "Year-round",
    difficulty: "easy",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/addis-ababa-surroundings-tours/day-trip-to-adadi-mariam-monolithic-church-melka-kunture-tiya-stelae/",
    imageSlot:
      "Half-Day-Addis-Ababa-Tour-to-National-Museum-Trinity-Cathedral-Merkato.webp",
    imageAlt: "Tiya UNESCO stelae field, carved standing stones, Ethiopia",
  },
  {
    id: "debre-berhan-ankober-day-trip",
    slug: "day-trip-to-debre-berhan-ankober",
    name: "Day Trip to Debre Berhan & Ankober",
    duration: 1,
    tagline:
      "Two former capitals. Menelik's palace ruins. The Rift Valley edge.",
    highlights: [
      "Debre Berhan: 15th-century imperial capital founded by Emperor Zera Yacob (1434–1468) after he saw a 'heavenly light'",
      "Ankober: mountaintop capital of the Shoan Kingdom until the founding of Addis Ababa in 1886",
      "Ruins of Emperor Menelik II's palace and an ancient Christian monastery",
      "Spectacular views over the Great Ethiopian Rift Valley from the Ankober ridge",
    ],
    days: [
      {
        day: 1,
        title: "North on Dessie Road → Debre Berhan → Ankober → return",
        description:
          "Drive north from Addis Ababa (130km). Visit Debre Berhan and its history. Continue to Ankober on the ridge. Visit the Menelik Palace ruins and the monastery. Views of the Rift Valley. Coffee stop in Debre Berhan on the return. Back to Addis in late afternoon.",
      },
    ],
    includes: ["Ground transport", "Entrance fees", "Professional guide"],
    excludes: ["Meals", "Beverages", "Insurance", "Personal items"],
    interests: ["history", "culture"],
    regionIds: ["addis"],
    bestSeason: "Year-round",
    difficulty: "easy",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/addis-ababa-surroundings-tours/day-trip-to-debre-berhan-ankober/",
    imageSlot:
      "Half-Day-Addis-Ababa-Tour-to-National-Museum-Trinity-Cathedral-Merkato.webp",
    imageAlt: "Ankober mountain capital ruins and Rift Valley view, Ethiopia",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // RIFT VALLEY
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "rift-valley-3day",
    slug: "3-day-rift-valley-tour-lake-ziway-abiyata-shalla-hawassa",
    name: "3-Day Rift Valley Tour — Lake Ziway, Abiyata-Shalla & Hawassa",
    duration: 3,
    tagline:
      "Bird Island at dusk. Hot springs. Hippos before the fish market opens.",
    highlights: [
      "Tulu Simbero (Bird Island) on Lake Ziway: nesting pelicans and cormorants, a hidden island monastery, hermit caves",
      "Abiyata-Shalla National Park: alkaline lakes and hot springs at the edge of the park boundary",
      "Lake Hawassa fish market at 6am: pelicans negotiate with the fishermen; marabou storks wait nearby",
      "Tiya UNESCO stelae and Melka Kunture prehistoric site on the return",
    ],
    days: [
      {
        day: 1,
        title: "Addis → Lake Ziway. Afternoon: Tulu Simbero boat trip.",
        description:
          "3-hour drive south through the green Rift Valley. Lunch in Ziway. Afternoon boat cruise to Bird Island — nesting pelicans, the island monastery, cave systems used by hermits. Community forest walk at Wamecha for lake views. Overnight Ziway.",
      },
      {
        day: 2,
        title: "Ziway → Abiyata-Shalla → Hawassa lakeside.",
        description:
          "Morning in Abiyata-Shalla National Park: the alkaline lakes, the flamingo colonies, the hot springs near the shore. Drive south to Hawassa in the afternoon. Lakeside walk for sunset. Resort overnight.",
      },
      {
        day: 3,
        title: "Hawassa fish market → hippo boat → Tiya → Addis.",
        description:
          "Early morning at the fish market. Boat trip for hippos. Drive north. Stop at the Tiya stelae field and Melka Kunture. Return to Addis.",
      },
    ],
    includes: ["Ground transport", "All entrance fees", "Professional guide"],
    excludes: [
      "Domestic flights",
      "Meals and beverages",
      "Insurance",
      "Personal items",
    ],
    interests: ["wildlife", "culture", "history"],
    regionIds: ["rift-valley"],
    bestSeason: "Oct – May",
    difficulty: "easy",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/3-day-rift-valley-tour-lake-ziway-abiyata-shalla-hawassa/",
    imageSlot: "Day-Trip-to-Wenchi-Crater-Lake.webp",
    imageAlt: "Lake Hawassa pelicans at the morning fish market, Ethiopia",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NORTHERN HISTORICAL CIRCUIT
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "north-historic-7day",
    name: "7-Day Historic Tour — Lake Tana, Gondar, Lalibela & Simien Mountains",
    duration: 7,
    tagline:
      "Monasteries on an island. A 17th-century castle. Eleven churches. Gelada baboons.",
    highlights: [
      "Boat trip on Lake Tana to 14th-century island monasteries — still in active liturgical use",
      "Gondar Royal Enclosure: Emperor Fasilides' 17th-century castle complex, Ethiopia's Camelot",
      "All 11 rock-hewn churches of Lalibela in one concentrated day",
      "Day trek in the Simien Mountains: gelada baboons and the escarpment view",
    ],
    days: [
      {
        day: 1,
        title: "Addis Ababa: National Museum, Trinity Cathedral, Merkato",
        description:
          "City orientation. The National Museum for Lucy. Holy Trinity Cathedral. Merkato.",
      },
      {
        day: 2,
        title: "Fly to Bahir Dar. Lake Tana monasteries by boat.",
        description:
          "Morning flight to Bahir Dar (45 min). Afternoon boat tour of Lake Tana island monasteries on the Zege Peninsula. Sunset from Bezawit Hills above the Blue Nile.",
      },
      {
        day: 3,
        title:
          "Drive to Gondar. Royal Enclosure. Debre Birhan Selassie Church.",
        description:
          "Drive north (3 hrs). Fasil Ghebbi Royal Enclosure — the castle of Fasilides. Debre Birhan Selassie: the ceiling painted with 104 angels' faces, all looking down.",
      },
      {
        day: 4,
        title: "Day trip: Simien Mountains National Park.",
        description:
          "Drive to the park (2 hrs). Day hike along the escarpment. Gelada baboon troops. Viewpoint over the Tekezé valley. Return to Gondar.",
      },
      {
        day: 5,
        title: "Fly to Lalibela. Rock-hewn churches — all 11.",
        description:
          "Flight 50 min. Full day across both church clusters: northern, eastern, and Beta Giyorgis. Evening coffee ceremony in town.",
      },
      {
        day: 6,
        title: "Yemrehanna Kristos or Asheton Maryam. Your choice.",
        description:
          "Drive to the cave church of Yemrehanna Kristos (1 hr), or mule hike to Asheton Maryam monastery at 3,150m.",
      },
      {
        day: 7,
        title: "Return to Addis Ababa.",
        description:
          "Flight from Lalibela. Final shopping in Addis. Airport transfer.",
      },
    ],
    includes: [
      "Bed and breakfast",
      "All domestic flights",
      "Ground transport",
      "All entrance fees and guides",
    ],
    excludes: [
      "International flights",
      "Lunches and dinners",
      "Insurance",
      "Personal items",
    ],
    interests: ["history", "trekking", "culture"],
    regionIds: ["addis", "bahirdar", "gondar", "simien", "lalibela"],
    bestSeason: "Oct – Apr",
    difficulty: "easy",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/7-day-northern-ethiopia-historic-tour/",
    imageSlot:
      "7-Day-Historic-Tour-to-Lake-Tana-Gonder-Lalibela-Simien-Mountains.webp",
    imageAlt: "Lake Tana island monastery boat trip, Ethiopia",
  },
  {
    id: "north-central-10day",
    slug: "10-day-historic-tour-to-northern-central-ethiopia",
    name: "10-Day Historic Tour — Northern & Central Ethiopia",
    duration: 10,
    tagline: "Lalibela. Gondar. Simien. Debre Libanos. Tiya. Ten days.",
    highlights: [
      "All 11 rock-hewn churches of Lalibela — medieval architectural feat with no construction machinery",
      "Gondar Royal Enclosure: the 17th-century castles known as the Camelot of Africa",
      "Lake Tana boat tour to the ancient island monasteries of the Zege Peninsula",
      "Simien Mountains escarpment walk: endemic gelada baboons and Walia ibex",
      "Debre Libanos 13th-century monastery and views of the 1,000-metre Jemma River Gorge",
    ],
    days: [
      {
        day: 1,
        title:
          "Addis: National Museum, Trinity Cathedral, Sheromeda market, Entoto",
        description:
          "City circuit. National Museum (Lucy). Holy Trinity Cathedral. Sheromeda market for traditional textiles. Drive to Entoto Hills for the panoramic view of the capital.",
      },
      {
        day: 2,
        title: "Fly to Bahir Dar. Lake Tana monasteries. Bezawit Hill.",
        description:
          "Flight to Bahir Dar. Boat tour on Lake Tana — island monasteries including Ura Kidane Mehret on the Zege Peninsula. Sunset over the Blue Nile from Bezawit Hill.",
      },
      {
        day: 3,
        title: "Drive to Gondar. Royal Enclosure. Debre Birhan Selassie.",
        description:
          "Drive north (3 hrs). Royal Enclosure UNESCO site — Fasilides' castle, Iyasu's hall. Debre Birhan Selassie church: ceiling of 104 painted angels.",
      },
      {
        day: 4,
        title: "Day trip: Simien Mountains National Park.",
        description:
          "Drive to the park. Day hike along the escarpment for gelada baboons and Walia ibex. Return to Gondar.",
      },
      {
        day: 5,
        title: "Fly to Lalibela. All 11 rock-hewn churches.",
        description:
          "Flight from Gondar. Full afternoon covering both church clusters. Traditional coffee ceremony in town.",
      },
      {
        day: 6,
        title: "Asheton Maryam or Yemrehanna Kristos.",
        description:
          "Mule hike to Asheton Maryam at 3,150m, or drive to the cave church of Yemrehanna Kristos 60km north.",
      },
      {
        day: 7,
        title: "Return to Addis. Cultural farewell dinner.",
        description:
          "Flight from Lalibela. Souvenir time in Addis. Traditional music and dance farewell dinner.",
      },
      {
        day: 8,
        title: "Day trip: Debre Libanos & Portuguese Bridge.",
        description:
          "Drive north to Debre Libanos monastery, the museum, Saint Tekle Haymanot's cave, and the Portuguese Bridge over the Jemma River Gorge.",
      },
      {
        day: 9,
        title: "Day trip: Adadi Mariam & Tiya stelae.",
        description:
          "Drive southwest. Rock-hewn church of Adadi Mariam. UNESCO Tiya stelae field. Oromo village visit. Folkloric dinner on return.",
      },
      {
        day: 10,
        title: "Final departure.",
        description:
          "Free time in Addis for last shopping. Transfer to the airport.",
      },
    ],
    includes: [
      "Bed and breakfast",
      "Domestic flights",
      "All ground transport",
      "All entrance fees and guides",
    ],
    excludes: [
      "International flights",
      "Lunches and dinners (except farewell dinner)",
      "Beverages",
      "Insurance",
      "Photography fees",
    ],
    interests: ["history", "culture", "trekking"],
    regionIds: ["addis", "bahirdar", "gondar", "simien", "lalibela"],
    bestSeason: "Oct – Apr",
    difficulty: "easy",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/10-day-historic-tour-to-northern-central-ethiopia/",
    imageSlot:
      "7-Day-Historic-Tour-to-Lake-Tana-Gonder-Lalibela-Simien-Mountains.webp",
    imageAlt:
      "Gondar Royal Enclosure 17th-century castle complex, northern Ethiopia",
  },
  {
    id: "north-danakil-15day",
    slug: "15-day-northern-ethiopia-danakil-depression-tour",
    name: "15-Day Northern Ethiopia & Danakil Depression",
    duration: 15,
    tagline: "Castle, church, volcano, lava lake, salt flat. The full north.",
    highlights: [
      "Lalibela rock-hewn churches — all 11, plus Yemrehanna Kristos cave church and Asheton Maryam",
      "Erta Ale permanent lava lake: active since at least 1906, visible from the crater rim at night",
      "Dallol hydrothermal field: acid-yellow and green formations at −125m, the lowest point in Africa",
      "Gheralta mountains: vertical cliff climb to Abuna Yemata Guh and its 5th–6th century frescoes",
      "Gondar Royal Enclosure and the 3,000-year-old Temple of Yeha",
    ],
    days: [
      {
        day: 1,
        title: "Addis Ababa: National Museum, Trinity Cathedral, Entoto",
        description:
          "City circuit. National Museum. Holy Trinity Cathedral. Sheromeda market. Entoto Hills.",
      },
      {
        day: 2,
        title: "Fly to Bahir Dar. Lake Tana monasteries.",
        description:
          "Flight to Bahir Dar. Boat to Zege Peninsula monasteries. Sunset at Bezawit Hills.",
      },
      {
        day: 3,
        title: "Drive to Gondar. Royal Enclosure. Debre Birhan Selassie.",
        description:
          "Gondar UNESCO castles. Debre Birhan Selassie's angelic ceiling art.",
      },
      {
        day: 4,
        title: "Simien Mountains: Gelada baboons and Walia ibex.",
        description:
          "Day trip to the park. Escarpment walk. Endemic wildlife. Return to Gondar.",
      },
      {
        day: 5,
        title: "Fly to Lalibela. Northern church cluster.",
        description:
          "Flight to Lalibela (50 min). Afternoon: Bete Medhane Alem, Bete Maryam, Bete Maskal, Bete Denagel.",
      },
      {
        day: 6,
        title: "Eastern cluster + Beta Giyorgis. Monastery choice.",
        description:
          "Bete Amanuel, Bete Abba Libanos, Bete Merkorios. Then Beta Giyorgis. Afternoon: Yemrehanna Kristos or Asheton Maryam.",
      },
      {
        day: 7,
        title: "Fly Lalibela → Addis → Semera.",
        description:
          "Connecting flight via Addis to Semera — the gateway to the Danakil.",
      },
      {
        day: 8,
        title: "Drive into the Danakil Depression. Lake Afdera. Camp.",
        description:
          "Drive to Hamedila via Lake Afdera. Open-air camp under stars at one of the lowest points on earth.",
      },
      {
        day: 9,
        title: "Dallol. Trek to Erta Ale crater.",
        description:
          "Dallol hydrothermal formations early. Drive to Erta Ale. Afternoon trek to the crater rim. Lava lake at night.",
      },
      {
        day: 10,
        title: "Sunrise at Erta Ale. Hot springs. Fly to Addis.",
        description:
          "Dawn walk on the volcano. Drive to Semera. Swim at Lake Afdera hot springs. Evening flight to Addis.",
      },
      {
        day: 11,
        title: "Fly to Axum. City tour.",
        description:
          "Axum: Stelae Field, Queen of Sheba's Palace, Church of St. Mary of Zion.",
      },
      {
        day: 12,
        title: "Temple of Yeha. Debre Tsion. Gheralta.",
        description:
          "3,000-year-old Temple of Yeha. Rock-carved monastery of Debre Tsion. Narrow sandstone cleft at Yohannes Makudi.",
      },
      {
        day: 13,
        title: "Trekking the Korkor Mountains.",
        description:
          "Trek through Gheralta to the 3rd-century monastery of Mariam Korkor and Abba Daniel's Prayer Room.",
      },
      {
        day: 14,
        title: "Abuna Yemata Guh. Drive to Mekele. Flight to Addis.",
        description:
          "Vertical cliff climb to Abuna Yemata Guh frescoes. Drive to Mekele. Evening flight to Addis.",
      },
      {
        day: 15,
        title: "Final departure.",
        description: "Free time for shopping or rest. Airport transfer.",
      },
    ],
    includes: [
      "Bed and breakfast",
      "Afar region full board and camping",
      "All domestic flights",
      "Ground transport",
      "All entrance fees and guides",
    ],
    excludes: [
      "International flights",
      "Meals outside Afar",
      "Beverages",
      "Insurance",
      "Photography fees",
      "Tips",
    ],
    interests: ["history", "trekking", "culture"],
    regionIds: ["addis", "gondar", "lalibela", "danakil", "tigray"],
    bestSeason: "Nov – Mar (Danakil window required)",
    difficulty: "demanding",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/15-day-northern-ethiopia-danakil-depression-tour/",
    imageSlot:
      "3-Day-Expedition-to-Dallol-Salt-Flats-Danakil-Depression-Erta-Ale-Volcano.webp",
    imageAlt:
      "Dallol hydrothermal field at dawn, acid formations, Danakil Depression Ethiopia",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DANAKIL
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "danakil-3day",
    slug: "3-day-expedition-to-dallol-salt-flats-danakil-depression-erta-ale-volcano",
    name: "3-Day Expedition: Dallol Salt Flats, Danakil Depression & Erta Ale Volcano",
    duration: 3,
    tagline:
      "Lava lake overnight. Sulfur fields at dawn. Salt miners before breakfast.",
    highlights: [
      "Spend the night at the rim of Erta Ale — a permanent boiling lava lake active since at least 1906",
      "Dallol hydrothermal field: acid-yellow and green mineral formations at −125m",
      "Afar camel salt caravans leaving Hamed Ela before dawn — 400 animals, no engine sound",
      "Lake Afdera natural hot springs — swim in hypersaline water at 35°C",
    ],
    days: [
      {
        day: 1,
        title: "Semera → Lake Afdera → Dodom → Erta Ale overnight",
        description:
          "Fly Addis to Semera (50 min). Drive into the Afar Depression to Lake Afdera for lunch and a swim in the salt lake. Continue to Dodom. Camels carry equipment up the last hour to the volcano rim. Sleep at the crater edge watching the lava lake.",
      },
      {
        day: 2,
        title: "Erta Ale → Hamed Ela → Ragad salt miners → Dallol",
        description:
          "Early breakfast at the crater. Drive to Hamed Ela. Stop at Ragad to watch Afar miners cut salt from the ground and load camel trains. Drive to Dallol: the salt canyons, sulfur chimneys, and brine pools. Camp.",
      },
      {
        day: 3,
        title: "Salt flat sunrise → Semera → Addis Ababa",
        description:
          "Sunrise over the salt flats. Drive to Semera. Fly back to Addis.",
      },
    ],
    includes: [
      "Camping accommodation in Afar",
      "All entrance, guide, and scout fees",
      "Domestic flights (Addis–Semera–Addis)",
      "Full board in Afar region",
      "4WD Land Cruisers",
      "Professional guide, cook, and camping equipment",
    ],
    excludes: [
      "Photography and video fees",
      "Alcoholic beverages",
      "Travel insurance",
      "Tips",
    ],
    interests: ["trekking", "wildlife"],
    regionIds: ["danakil"],
    bestSeason: "Nov – Mar only",
    difficulty: "demanding",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/3-day-expedition-to-dallol-salt-flats-danakil-depression-erta-ale-volcano/",
    imageSlot:
      "3-Day-Expedition-to-Dallol-Salt-Flats-Danakil-Depression-Erta-Ale-Volcano.webp",
    imageAlt:
      "Dallol hydrothermal field, acid-yellow salt formations, Danakil Depression",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LALIBELA
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "lalibela-3day",
    slug: "3-day-tour-of-lalibela-yemrehanna-kristos-hiking-to-asheton-maryam",
    name: "3-Day Tour of Lalibela, Yemrehanna Kristos & Asheton Maryam",
    duration: 3,
    tagline:
      "Eleven churches carved into rock. One of them is below your feet.",
    highlights: [
      "All eleven UNESCO-listed rock-hewn churches of Lalibela, including Beta Giyorgis at dawn",
      "Yemrehanna Kristos — an Axumite church inside a cave, 12th century, mummified pilgrims in the walls",
      "Mule hike to Asheton Maryam monastery at 3,150m: the view back to the church cluster",
      "Saturday market in Lalibela town — tej shops, injera bakeries, local traders",
    ],
    days: [
      {
        day: 1,
        title: "Fly to Lalibela. Afternoon: Northern church cluster",
        description:
          "Morning flight from Addis (1hr 15min). 45-minute drive to town. Northern cluster: Bete Medhane Alem, Bete Maryam, Bete Maskal, Bete Denagel.",
      },
      {
        day: 2,
        title: "Eastern cluster + Beta Giyorgis. Afternoon: monastery choice.",
        description:
          "Eastern cluster — Bete Amanuel, Bete Abba Libanos, Bete Merkorios — then Beta Giyorgis, the cross-shaped church carved into a single block of stone. Afternoon: Yemrehanna Kristos or mule hike to Asheton Maryam.",
      },
      {
        day: 3,
        title: "Return flight to Addis.",
        description:
          "Breakfast. Transfer to airport. Late morning or early afternoon arrival in Addis.",
      },
    ],
    includes: [
      "Domestic flights",
      "Ground transport",
      "All entrance fees",
      "Professional local guide",
    ],
    excludes: ["International flights", "Meals", "Insurance", "Personal items"],
    interests: ["history", "culture"],
    regionIds: ["lalibela"],
    bestSeason: "Sep – Apr; Jan for Timkat (book 3 months ahead)",
    difficulty: "easy",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/3-day-tour-of-lalibela-yemrehanna-kristos-hiking-to-asheton-maryam/",
    imageSlot:
      "3-Day-Tour-of-Lalibel-Yemrehanna-Kristos-Hiking-to-Asheton-Maryam.webp",
    imageAlt:
      "Beta Giyorgis church Lalibela, cross-shaped roof cut into red volcanic rock",
  },
  {
    id: "lalibela-danakil-6day",
    name: "6-Day Lalibela, Dallol & Erta Ale Adventure",
    duration: 6,
    tagline: "Churches in rock. Then a volcano. Nothing else like it.",
    highlights: [
      "All 11 rock-hewn churches of Lalibela across two dedicated days",
      "Erta Ale lava lake at midnight — the glow on your face is real heat",
      "Dallol: acid-green mineral pools and salt canyons at −125m, the lowest point in Africa",
      "Addis city highlights as bookends — National Museum and Entoto on day 1",
    ],
    days: [
      {
        day: 1,
        title: "Addis Ababa: National Museum, Trinity Cathedral, Entoto",
        description: "City circuit ending at Entoto for views.",
      },
      {
        day: 2,
        title: "Fly to Lalibela. Afternoon: rock-hewn churches.",
        description:
          "Flight 1hr 15min. Afternoon exploration of the main church clusters.",
      },
      {
        day: 3,
        title: "Final Lalibela churches. Coffee ceremony. Fly to Addis.",
        description:
          "Complete Beta Giyorgis and remaining churches. Evening flight to Addis.",
      },
      {
        day: 4,
        title: "Fly to Semera. Drive to Hamed Ela. Camp.",
        description: "Into the Danakil. Lake Afdera swim. Camp under stars.",
      },
      {
        day: 5,
        title: "Dallol. Afternoon trek to Erta Ale crater.",
        description:
          "Dallol formations at 7am before the heat builds. Trek to Erta Ale rim by sunset. Lava lake at night.",
      },
      {
        day: 6,
        title: "Sunrise on the volcano. Drive to Semera. Fly home.",
        description:
          "Last view of the lava lake at dawn. Return convoy to Semera. Flight to Addis.",
      },
    ],
    includes: [
      "Domestic flights",
      "Ground transport",
      "All entrance fees",
      "Professional guide",
      "Camping equipment in Afar",
    ],
    excludes: [
      "International flights",
      "Meals (except Afar)",
      "Beverages",
      "Insurance",
    ],
    interests: ["history", "trekking", "culture"],
    regionIds: ["lalibela", "danakil"],
    bestSeason: "Nov – Mar (Danakil window)",
    difficulty: "demanding",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/6-day-lalibela-dallol-erta-ale-adventure-tour/",
    imageSlot: "Lalibela-Ethiopia-Tours.webp",
    imageAlt:
      "Lalibela rock-hewn church complex viewed from above, red volcanic tuff",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SIMIEN MOUNTAINS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "simien-4day",
    slug: "4-day-simien-mountains-hiking-tour",
    name: "4-Day Simien Mountains Hiking Tour",
    duration: 4,
    tagline: "Sankaber to Chenek. 4,000m. The wolves hunt at 7am.",
    highlights: [
      "Trek from Sankaber (2,840m) to Chenek (3,620m) via Geech — the Enatye escarpment drops 1,500m",
      "Jinbar waterfall: the water disappears into the gorge before reaching the bottom",
      "Gelada baboon herds on the moorland — sometimes 300 animals, always close",
      "Ethiopian wolf territory on the Chenek plateau: about 500 remaining in the world",
    ],
    days: [
      {
        day: 1,
        title: "Fly Addis → Gondar. Drive to Sankaber. Camp.",
        description:
          "Morning flight to Gondar (45 min). 3-hour drive to Sankaber, the park entrance at 2,840m. Briefing, camping setup.",
      },
      {
        day: 2,
        title: "Sankaber → Geech. 5–7 hours, 3,600m.",
        description:
          "Crosses the Jinbar River valley — the falls visible from 2km out. Ascent through heather moorland to Geech camp. Gelada baboons in the afternoon.",
      },
      {
        day: 3,
        title: "Geech → Chenek along the Enatye escarpment.",
        description:
          "Path follows the cliff edge. At 4,000m the valley floor is 1,500 metres below. Chenek is Walia ibex territory. Overnight camp.",
      },
      {
        day: 4,
        title: "Drive to Gondar. Folkloric dinner. Airport transfer.",
        description:
          "Depart Chenek. Drive back to Gondar (4 hrs). Evening folkloric dinner. Transfer to airport.",
      },
    ],
    includes: [
      "Bed and breakfast",
      "Domestic flights (Addis–Gondar–Addis)",
      "All ground transport",
      "All entrance and park fees",
      "Professional English-speaking guide",
    ],
    excludes: [
      "International flights",
      "Lunches and dinners (except folkloric dinner)",
      "Beverages",
      "Insurance",
      "Photography fees",
    ],
    interests: ["trekking", "wildlife"],
    regionIds: ["simien"],
    bestSeason: "Oct – Mar",
    difficulty: "moderate",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/4-day-simien-mountains-hiking-tour/",
    imageSlot: "4-Day-Simien-Mountains-Hiking-Tour.webp",
    imageAlt:
      "Simien Mountains Enatye escarpment, gelada baboons in foreground, Ethiopia",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TIGRAY
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "tigray-5day",
    slug: "5-days-tigray-rock-hewn-churches-tour",
    name: "5-Day Tigray Rock-Hewn Churches",
    duration: 5,
    tagline: "Churches in cliffs. 6th century. You climb to reach them.",
    highlights: [
      "Abuna Yemata Guh: reached by a short cliff climb — 5th–6th century frescoes inside",
      "Debre Mariam Korkor: 6th century, a 30-minute walk from Abuna Yemata, usually empty",
      "Abraha Atsbeha Church: finest decorated interior of the Gheralta cluster",
      "Wukro Chirkos: semi rock-hewn, still in active liturgical use — Friday morning service",
    ],
    days: [
      {
        day: 1,
        title: "Addis Ababa highlights",
        description:
          "National Museum (Lucy), Holy Trinity Cathedral, Merkato, Entoto. Evening in Addis.",
      },
      {
        day: 2,
        title: "Fly Addis → Mekele → Hawzen. Wukro Chirkos + Abraha Atsbeha.",
        description:
          "Morning flight to Mekele. Drive to Hawzen via Wukro Chirkos and Abraha Atsbeha. Overnight Hawzen.",
      },
      {
        day: 3,
        title: "Debre Tsion and Yohannes Makudi churches, Gheralta.",
        description:
          "Approach to Yohannes Makudi through a narrow sandstone cleft. Debre Tsion carved from the rock face. Return to Hawzen.",
      },
      {
        day: 4,
        title: "Abuna Yemata Guh. Debre Mariam Korkor.",
        description:
          "Short vertical climb to Abuna Yemata Guh — bare feet on the rock face. Frescoes inside are 5th–6th century. Nearby Debre Mariam Korkor less visited and equally remarkable.",
      },
      {
        day: 5,
        title: "Drive to Mekele. Folkloric dinner. Flight to Addis.",
        description:
          "Return to Mekele. Farewell dinner with traditional Tigray cuisine and coffee ceremony. Night flight to Addis.",
      },
    ],
    includes: [
      "Domestic flights",
      "Ground transport",
      "All entrance fees",
      "Professional guide",
      "Folkloric dinner",
    ],
    excludes: [
      "International flights",
      "Meals (except noted)",
      "Beverages",
      "Insurance",
    ],
    interests: ["history", "culture", "trekking"],
    regionIds: ["tigray"],
    bestSeason: "Oct – Apr",
    difficulty: "moderate",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/5-days-tigray-rock-hewn-churches-tour/",
    imageSlot: "Gheralta-Mountains-Ethiopia-Tours-and-Travel-Packages.jpg",
    imageAlt:
      "Gheralta cliffs Tigray, sandstone escarpment, rock-hewn church entrance visible",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BALE MOUNTAINS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "bale-sofomar-4day",
    slug: "4-day-bale-mountains-sof-omar-caves-tours",
    name: "4-Day Sof Omar Cave & Bale Mountains",
    duration: 4,
    tagline:
      "The largest cave in Africa, the highest plateau, and the rarest wolf.",
    highlights: [
      "Sanetti Plateau at 4,000m+ — best place in the world to see Ethiopian wolves",
      "Sof Omar Cave system: 15km of limestone chambers, the Weyib River flowing through them",
      "Harenna Forest: dense highland forest with wild coffee growing under the canopy",
      "Mountain nyala — endemic to Ethiopia, found almost nowhere else",
    ],
    days: [
      {
        day: 1,
        title: "Fly to Goba. Afternoon in Harenna Forest.",
        description:
          "Morning flight Addis to Goba. Drive into the Harenna Forest — dense enough to block midday light. Overnight in Goba.",
      },
      {
        day: 2,
        title: "Sanetti Plateau. Ethiopian wolf territory.",
        description:
          "Drive up to the Sanetti Plateau before 8am. Wolves hunt mole-rats at dawn. Return through Harenna Forest. Overnight in Goba.",
      },
      {
        day: 3,
        title: "Sof Omar Cave system.",
        description:
          "Drive to Sof Omar. The Weyib River has carved 15km of limestone vaults underground. Half-day inside. Lunch. Return.",
      },
      {
        day: 4,
        title: "Return flight to Addis Ababa.",
        description: "Transfer to Goba airport. Flight back to Addis.",
      },
    ],
    includes: [
      "Domestic flights",
      "Ground transport",
      "All entrance fees",
      "Professional guide",
    ],
    excludes: ["International flights", "Meals", "Beverages", "Insurance"],
    interests: ["trekking", "wildlife"],
    regionIds: ["bale"],
    bestSeason: "Nov – Mar",
    difficulty: "moderate",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/eastern-ethiopia-tours/4-day-bale-mountains-sof-omar-caves-tours/",
    imageSlot: "4-Day-Bale-Mountains-Sof-Omar-Caves-Tours.webp",
    imageAlt:
      "Bale Mountains Sanetti Plateau, Afro-alpine landscape, Ethiopian wolf",
  },
  {
    id: "bale-trek-5day",
    name: "5-Day Bale Mountains Trek — Ethiopian Wolves & Alpine Lakes",
    duration: 5,
    tagline:
      "The rarest canid on earth. 4,200m. A lake they call the Black Lake.",
    highlights: [
      "Ethiopian wolf on the Sanetti Plateau — the rarest canid in the world, best seen at dawn",
      "Summit Mt. Wasama (4,200m) and descend to Lake Gebre Gurracha — the Black Lake",
      "Mountain nyala and Menelik's bushbuck in Gaysay Grasslands — endemic to Ethiopia",
      "Lammergeier and Verreaux's eagle in the Mararo Valley",
    ],
    days: [
      {
        day: 1,
        title: "Addis → Dinsho. Gaysay Grasslands walk.",
        description:
          "Morning departure from Addis by road (8 hrs). Arrive Dinsho. Evening walk through Gaysay Grasslands — mountain nyala graze here at dusk.",
      },
      {
        day: 2,
        title: "Trek to Finchi Habera (~5 hrs). Habera Waterfall.",
        description:
          "Into the park. Forest thins to moorland. Habera Waterfall for lunch.",
      },
      {
        day: 3,
        title: "Wasama Valley (~8 hrs). Prime wolf territory.",
        description:
          "Long day through the Mararo Valley. Lammergeier above the cliffs. Densest wolf territory in the park. Altitude 3,800–4,000m.",
      },
      {
        day: 4,
        title: "Summit Mt. Wasama (4,200m). Lake Gebre Gurracha.",
        description:
          "Climb before the clouds arrive. Descend to the glacial valley. Camp on the shore of Lake Gebre Gurracha.",
      },
      {
        day: 5,
        title: "2-hr trek to Sanetti Plateau. Drive to Addis.",
        description:
          "Short morning trek to the plateau — last chance for wolves. Long drive back to Addis. Cultural dinner and music.",
      },
    ],
    includes: [
      "Camping equipment",
      "All entrance and park fees",
      "Professional guide",
      "Cultural dinner",
    ],
    excludes: ["International flights", "Most meals", "Beverages", "Insurance"],
    interests: ["trekking", "wildlife"],
    regionIds: ["bale"],
    bestSeason: "Nov – Feb",
    difficulty: "demanding",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/southern-cultural-ethiopia-tours/5-day-bale-mountains-trek-ethiopian-wolves-alpine-lakes/",
    imageSlot: "5-Day-Bale-Mountains-Trek-Ethiopian-Wolves-Alpine-Lakes.webp",
    imageAlt:
      "Bale Mountains trek, Sanetti Plateau, Ethiopian wolf in alpine meadow",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EASTERN ETHIOPIA
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "east-awash-harar-4day",
    slug: "4-day-east-ethiopia-adventure-to-awash-national-park-harar-walled-city",
    name: "4-Day East Ethiopia — Awash National Park & Harar Walled City",
    duration: 4,
    tagline: "Oryx at dawn. 1560s city walls. Hyenas fed by hand at the gate.",
    highlights: [
      "Awash National Park: Beisa oryx, Soemmerring's gazelle, and over 460 recorded bird species",
      "Harar old town: 16th-century walled city with 82 mosques, the 4th holiest city in Islam",
      "Abdela Sherif Museum in the former palace of Ras Mekonnen: Harari manuscripts and coins from around 1900",
      "The 'Hyena Man' outside the Fallana Gate: wild hyenas fed by hand each night",
    ],
    days: [
      {
        day: 1,
        title: "Drive Addis → Awash National Park. Afternoon game drive.",
        description:
          "Depart Addis. Drive east to Awash National Park. Afternoon game drive for Beisa oryx, gazelle, and birds.",
      },
      {
        day: 2,
        title: "Morning game drive → Chercher Mountains → Harar.",
        description:
          "Early morning drive for mammals. Continue east through the Chercher Mountains to Harar. Guided walk through the old walled city.",
      },
      {
        day: 3,
        title: "Full day in Harar: museums, markets, hyena feeding.",
        description:
          "Abdela Sherif Museum. Arthur Rimbaud Museum. The colorful Islamic market. Evening: wild hyena feeding outside the Fallana Gate.",
      },
      {
        day: 4,
        title: "Harar → Addis Ababa.",
        description:
          "Full-day return drive through the eastern highlands. Return to Addis.",
      },
    ],
    includes: [
      "Bed and breakfast",
      "All ground transport",
      "Entrance fees",
      "Professional English-speaking guide",
    ],
    excludes: [
      "Domestic and international flights",
      "Lunches and dinners",
      "Beverages",
      "Insurance",
      "Photography fees",
      "Tips",
    ],
    interests: ["wildlife", "culture", "history"],
    regionIds: ["east"],
    bestSeason: "Oct – Apr",
    difficulty: "easy",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/eastern-ethiopia-tours/4-day-east-ethiopia-adventure-to-awash-national-park-harar-walled-city/",
    imageSlot: "4-Day-Bale-Mountains-Sof-Omar-Caves-Tours.webp",
    imageAlt: "Harar old walled city gate, evening light, eastern Ethiopia",
  },
  {
    id: "harar-3day",
    slug: "3-day-harar-cultural-discovery",
    name: "3-Day Harar Cultural Discovery",
    duration: 3,
    tagline:
      "A walled city unchanged since the 16th century. Hyenas at the gate.",
    highlights: [
      "Harar old town: 16th-century walls, 82 mosques, and a maze of alleys that have not changed shape",
      "The hyena feeding ritual outside the walls — wild hyenas take meat directly from the feeder's mouth",
      "Arthur Rimbaud Museum: the French poet lived here in the 1880s; photographs and manuscripts",
      "National Museum Lucy in Addis on the final day",
    ],
    days: [
      {
        day: 1,
        title:
          "Fly Addis → Dire Dawa → Drive to Harar. Afternoon old town walk.",
        description:
          "Flight to Dire Dawa. Drive to Harar. Afternoon in the 16th-century walled city — the Rimbaud Museum and the maze of Islamic alleys.",
      },
      {
        day: 2,
        title:
          "Markets, museums, Ras Mekonnen's house. Evening: hyena feeding.",
        description:
          "Islamic market and the Harari national museum. House of Ras Mekonnen — childhood home of Haile Selassie. Evening: the hyena man outside the Fallana Gate.",
      },
      {
        day: 3,
        title:
          "Morning market → Dire Dawa → Fly to Addis → National Museum → dinner.",
        description:
          "Morning market visit. Drive to Dire Dawa. Flight to Addis. Visit to the National Museum (Lucy). Farewell cultural dinner with traditional music.",
      },
    ],
    includes: [
      "Bed and breakfast",
      "Domestic flights",
      "All ground transport",
      "All entrance fees",
      "Professional guide",
    ],
    excludes: [
      "International flights",
      "Meals (except noted)",
      "Beverages",
      "Insurance",
      "Photography fees",
      "Personal items",
    ],
    interests: ["culture", "history"],
    regionIds: ["east"],
    bestSeason: "Year-round",
    difficulty: "easy",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/eastern-ethiopia-tours/3-day-harar-cultural-discovery/",
    imageSlot: "4-Day-Bale-Mountains-Sof-Omar-Caves-Tours.webp",
    imageAlt: "Harar old city walls and gate at dusk, eastern Ethiopia",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // OMO VALLEY
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "omo-valley-3day",
    name: "3-Day Omo Valley — Mursi, Hamer & Karo Tribes",
    duration: 3,
    tagline:
      "Sixteen nations share this river. Three days gets you close to three.",
    highlights: [
      "Key Afer Thursday market: Banna, Hamer, and Tsemay traders in one place",
      "Karo people on the Omo River east bank — fewer than 3,000 left; fishing and body art",
      "Mursi village in Mago National Park — lip-plate tradition, observed with a local community guide",
    ],
    days: [
      {
        day: 1,
        title: "Jinka → Key Afer market → Hamer villages → Turmi",
        description:
          "Fly from Addis to Jinka (1hr 15min). Drive south to the Key Afer Thursday market. Continue to Hamer and Benna villages before Turmi.",
      },
      {
        day: 2,
        title: "Karo tribe (Omo River east bank). Nyangatom village.",
        description:
          "Morning drive to the Karo on the river bank. Community-managed visit. Nyangatom in the afternoon. Return to Jinka.",
      },
      {
        day: 3,
        title: "Mago National Park → Mursi village → Jinka departure.",
        description:
          "Drive through Mago National Park to a Mursi village. Return to Jinka. Flight back to Addis.",
      },
    ],
    includes: [
      "Domestic flights",
      "Ground transport",
      "All entrance and community fees",
      "Professional local guide",
    ],
    excludes: ["International flights", "Meals", "Beverages", "Insurance"],
    interests: ["culture", "wildlife"],
    regionIds: ["omo"],
    bestSeason: "Nov – Mar",
    difficulty: "moderate",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/southern-cultural-ethiopia-tours/3-day-omo-valley-quick-tour-to-mursi-hamer-karo-tribes/",
    imageSlot: "3-Day-Omo-Valley-Quick-Tour-to-Mursi-Hamer-Karo-Tribes.webp",
    imageAlt:
      "Omo Valley, Hamer woman at Key Afer market, ochre-butter braids, dry acacia",
  },
  {
    id: "omo-valley-7day",
    slug: "7-day-omo-valley-tribal-and-cultural-tour",
    name: "7-Day Omo Valley Tribal & Cultural Tour",
    duration: 7,
    tagline:
      "Dorze bamboo houses. Hamer bull-jumping. Mursi lip-plates. Seven days.",
    highlights: [
      "Dorze people at Arba Minch: bamboo architecture and weaving, the false banana plant as food source",
      "Konso stone terraces and funerary statues — UNESCO World Heritage site",
      "Hamer bull-jumping ceremony: witnessed if dates align with your visit",
      "Mursi village in Mago National Park: the largest ethnic group in the region by territory",
    ],
    days: [
      {
        day: 1,
        title: "Fly to Arba Minch. Dorze village.",
        description:
          "Fly to Arba Minch and drive to the Dorze highland community. Their bamboo houses and false banana plant use.",
      },
      {
        day: 2,
        title: "Lake Chamo boat trip. Konso terraces.",
        description:
          "Boat on Lake Chamo — hippos and crocodiles. Continue to Konso UNESCO site: stone-walled villages and ancient terraces.",
      },
      {
        day: 3,
        title: "Tsemai village or tribal market → Turmi → Hamer village.",
        description:
          "Tsemai village or local market en route. Hamer village in the afternoon. Potential bull-jumping ceremony.",
      },
      {
        day: 4,
        title: "Dassanech tribe excursion on the Omo River.",
        description:
          "Travel to Omorate. Visit the Dassanech tribe on the river — clan system, pastoralist traditions. Return to Turmi.",
      },
      {
        day: 5,
        title: "Drive north to Jinka. Ari people.",
        description:
          "Jinka and the Ari people — the largest ethnic group in the region. Fertile farmlands and traditional crafts.",
      },
      {
        day: 6,
        title: "Mursi village in Mago National Park. Jinka Museum.",
        description:
          "Drive into Mago National Park to a Mursi village. Jinka Museum in the afternoon — overview of the valley's ethnicities.",
      },
      {
        day: 7,
        title: "Return flight to Addis. Cultural dinner.",
        description:
          "Fly back to Addis. City tour. Traditional music and dance farewell dinner.",
      },
    ],
    includes: [
      "Bed and breakfast",
      "Domestic flights",
      "All ground transport",
      "All entrance and village fees",
      "Professional guide",
    ],
    excludes: [
      "International flights",
      "Meals (except noted)",
      "Beverages",
      "Insurance",
      "Photography fees",
    ],
    interests: ["culture", "wildlife"],
    regionIds: ["omo"],
    bestSeason: "Nov – Mar",
    difficulty: "moderate",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/southern-cultural-ethiopia-tours/7-day-omo-valley-tribal-and-cultural-tour/",
    imageSlot: "3-Day-Omo-Valley-Quick-Tour-to-Mursi-Hamer-Karo-Tribes.webp",
    imageAlt: "Omo Valley Hamer tribe, traditional dress, southern Ethiopia",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // COMBO — NORTH + SOUTH
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "omo-danakil-7day",
    slug: "7-day-ethiopia-tour-to-omo-valley-tribes-danakil-depression",
    name: "7-Day Omo Valley, Erta Ale & Danakil Depression",
    duration: 7,
    tagline: "The tribes of the south. Then the volcano. Same trip.",
    highlights: [
      "Hamer, Nyangatom, Dassanech, Karo, and Mursi — five distinct peoples in four days",
      "Erta Ale permanent lava lake — trek to the rim and watch the boiling lake at night",
      "Dallol: sulfur formations and salt canyons at −125m",
    ],
    days: [
      {
        day: 1,
        title: "Fly Addis → Jinka → Drive to Turmi. Hamer villages.",
        description:
          "Flight to Jinka. Drive directly to Turmi. Hamer village exploration.",
      },
      {
        day: 2,
        title: "Nyangatom and Dassanech tribes on the Omo River.",
        description:
          "Full day visiting the two riverine peoples. Local ceremonies if dates align.",
      },
      {
        day: 3,
        title: "Karo tribe. Jinka Museum.",
        description:
          "Karo people in the morning. Back to Jinka. South Omo Research Center and Museum.",
      },
      {
        day: 4,
        title: "Mursi village → Fly to Addis → Cultural dinner.",
        description:
          "Mago National Park to Mursi village. Flight to Addis. Cultural dinner and music.",
      },
      {
        day: 5,
        title: "Fly to Semera. Drive to Hamedila. Camp.",
        description:
          "Flight to Semera. Drive to Hamedila. Lake Asale sunset. Open-air camp.",
      },
      {
        day: 6,
        title: "Dallol. Erta Ale trek. Lava lake at night.",
        description:
          "Dallol volcanic landscapes. Drive to Erta Ale base. Trek to summit. Lava lake.",
      },
      {
        day: 7,
        title: "Sunrise at Erta Ale. Drive to Semera. Fly to Addis.",
        description:
          "Lava lake at dawn. Return convoy to Semera via Afdera. Flight to Addis.",
      },
    ],
    includes: [
      "Bed and breakfast",
      "Domestic flights",
      "All ground transport",
      "All entrance fees and fuel",
      "Professional local English-speaking guides",
    ],
    excludes: [
      "International flights",
      "Meals and beverages",
      "Insurance",
      "Personal items",
    ],
    interests: ["culture", "trekking", "wildlife"],
    regionIds: ["omo", "danakil"],
    bestSeason: "Nov – Mar",
    difficulty: "demanding",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/all-in-one-tours-of-ethiopia/7-day-ethiopia-tour-to-omo-valley-tribes-danakil-depression/",
    imageSlot:
      "3-Day-Expedition-to-Dallol-Salt-Flats-Danakil-Depression-Erta-Ale-Volcano.webp",
    imageAlt: "Erta Ale volcano lava lake at night, Afar region, Ethiopia",
  },
  {
    id: "arba-minch-omo-lalibela-8day",
    slug: "8-day-combined-tour-of-arba-minch-omo-tribes-lalibela-churches",
    name: "8-Day Combined Tour — Arba Minch, Omo Tribes & Lalibela",
    duration: 8,
    tagline: "South tribes and north churches. Eight days covers both.",
    highlights: [
      "Bete Giyorgis and all rock-hewn churches of Lalibela — medieval carving with no machinery",
      "Dorze, Hamer, and Mursi peoples of the South Omo Valley",
      "Lake Chamo boat trip: the crocodile market and hippos",
      "Yimrehanna Kristos cave church north of Lalibela",
    ],
    days: [
      {
        day: 1,
        title: "Fly to Arba Minch. Dorze village.",
        description:
          "Fly to Arba Minch. Dorze highland community — bamboo architecture, false banana.",
      },
      {
        day: 2,
        title: "Lake Chamo boat. Drive to Turmi via Konso.",
        description:
          "Lake Chamo boat trip. Konso stone villages and Bana people on the way.",
      },
      {
        day: 3,
        title: "Hamer tribes and Jinka.",
        description:
          "Time with the Hamer people. Bull-jumping ceremony if dates align. Drive to Jinka.",
      },
      {
        day: 4,
        title: "Karo tribe. Omo Valley Museum.",
        description:
          "Karo people on the Omo River banks. South Omo Research Center and Museum.",
      },
      {
        day: 5,
        title: "Mursi village. Fly to Addis.",
        description:
          "Mago National Park. Mursi village. Fly to Addis in the afternoon.",
      },
      {
        day: 6,
        title: "Fly to Lalibela. All rock-hewn churches.",
        description:
          "Flight to Lalibela. Bete Giyorgis and Biete Medhani Alem and the full cluster.",
      },
      {
        day: 7,
        title: "Yimrehanna Kristos cave church. Fly to Addis.",
        description:
          "Drive north of Lalibela to the cave church. Fly back to Addis.",
      },
      {
        day: 8,
        title: "Addis: Mercato, Entoto, National Museum.",
        description:
          "Full city tour. Mercato. Mount Entoto. National Museum (Lucy).",
      },
    ],
    includes: [
      "Bed and breakfast",
      "Domestic flights",
      "Ground transport",
      "All entrance fees and guides",
    ],
    excludes: [
      "International flights",
      "Meals and beverages",
      "Insurance",
      "Personal items",
    ],
    interests: ["culture", "history", "wildlife"],
    regionIds: ["omo", "lalibela"],
    bestSeason: "Nov – Mar",
    difficulty: "moderate",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/all-in-one-tours-of-ethiopia/8-day-combined-tour-of-arba-minch-omo-tribes-lalibela-churches/",
    imageSlot: "3-Day-Omo-Valley-Quick-Tour-to-Mursi-Hamer-Karo-Tribes.webp",
    imageAlt:
      "Lalibela rock-hewn churches combined with Omo Valley tribes tour",
  },
  {
    id: "west-south-10day",
    slug: "10-day-western-and-southern-ethiopia-tour",
    name: "10-Day Western & Southern Ethiopia",
    duration: 10,
    tagline: "Wild coffee forest. Kaffa kingdom. The Mursi at the end.",
    highlights: [
      "Wenchi Crater Lake: volcanic crater at 2,600m, island monastery reachable by boat",
      "Kaffa Biosphere: the forest where Arabica coffee originates, still growing wild under the canopy",
      "Barta Waterfall at 70 metres: cold mist in a tropical rainforest at 3,000m altitude",
      "Karo and Mursi peoples of the Omo Valley — intricate body painting and lip-plate tradition",
    ],
    days: [
      {
        day: 1,
        title: "Arrival in Addis. National Museum. Mercato.",
        description: "Arrival. National Museum (Lucy). Mercato.",
      },
      {
        day: 2,
        title: "Menagesha Suba Forest. Drive to Wolliso.",
        description:
          "Hike through Menagesha Suba — Colobus monkeys, Menelik's bushbuck. Continue to Wolliso.",
      },
      {
        day: 3,
        title: "Wenchi Crater Lake. Descent, boat, island monastery.",
        description:
          "Descend into the crater. Hot springs. Boat to island monastery. Return to Wolliso.",
      },
      {
        day: 4,
        title: "Drive to Jimma. Palace of Aba Jifar II.",
        description:
          "Drive to Jimma through coffee country. Palace of King Ras Abba Jifar II. Continue to Bonga.",
      },
      {
        day: 5,
        title: "Alem Gonna wetlands. Barta Waterfall. Forest beekeeper.",
        description:
          "Sunrise walk through Alem Gonna. Hike to Barta Waterfall (70m). Local beekeeper visit.",
      },
      {
        day: 6,
        title: "Return to Addis. Traditional dinner.",
        description:
          "Drive to Jimma. Flight to Addis. Traditional dinner with regional music.",
      },
      {
        day: 7,
        title: "Drive to Turmi. Hamer villages.",
        description:
          "Southern leg begins. Drive to Turmi. Hamer village introduction.",
      },
      {
        day: 8,
        title: "Dassanech and Nyangatom on the Omo River.",
        description:
          "River tribes. Pastoralist traditions. Two communities in one day.",
      },
      {
        day: 9,
        title: "Karo tribe. Jinka Museum.",
        description:
          "Karo body painting on the Omo River east bank. Jinka Museum in the afternoon.",
      },
      {
        day: 10,
        title: "Mursi village. Flight home.",
        description:
          "Mago National Park. Mursi village. Flight from Jinka to Addis.",
      },
    ],
    includes: [
      "Bed and breakfast",
      "Domestic flights",
      "All ground transport",
      "All entrance and village fees",
      "Professional guide",
    ],
    excludes: [
      "International flights",
      "Meals (except noted)",
      "Beverages",
      "Insurance",
      "Photography fees",
      "Tips",
    ],
    interests: ["culture", "wildlife", "coffee", "trekking"],
    regionIds: ["addis", "omo", "kaffa"],
    bestSeason: "Nov – Apr",
    difficulty: "moderate",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/all-in-one-tours-of-ethiopia/10-day-western-and-southern-ethiopia-tour/",
    imageSlot: "3-Day-Omo-Valley-Quick-Tour-to-Mursi-Hamer-Karo-Tribes.webp",
    imageAlt: "Kaffa coffee biosphere, wild coffee forest, western Ethiopia",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // COFFEE & WEST
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "kaffa-coffee-7day",
    slug: "7-day-western-ethiopia-kaffa-coffee-biosphere-tours",
    name: "7-Day Western Ethiopia & Kaffa Coffee Biosphere",
    duration: 7,
    tagline:
      "Where Arabica comes from. 70-metre waterfall. A forest with lions.",
    highlights: [
      "Kaffa Biosphere Reserve: the forest where wild Arabica coffee originates, at up to 3,000m altitude",
      "Wenchi Crater Lake: volcanic crater descent, hot springs, island monastery by boat",
      "Barta Waterfall — 70 metres through tropical rainforest canopy",
      "Palace of King Aba Jifar II in Jimma — 19th-century relic of the Kaffa kingdom",
    ],
    days: [
      {
        day: 1,
        title:
          "Addis: National Museum, Ethnographic Museum, Unity Park, Merkato.",
        description:
          "National Museum (Lucy). Ethnographic Museum at Haile Selassie's old palace. Unity Park inside the National Palace compound.",
      },
      {
        day: 2,
        title: "Drive west to Wenchi Crater Lake.",
        description:
          "Drive to Wenchi. Walk or horse ride into the crater. Boat to island monastery. Return to Weliso.",
      },
      {
        day: 3,
        title: "Weliso → Jimma → Bonga. Palace of Aba Jifar II.",
        description:
          "Continue west to Jimma. Visit the 19th-century palace. Drive through coffee forests to Bonga.",
      },
      {
        day: 4,
        title: "Alem Gonna wetlands. Barta Waterfall (70m). Forest beekeeper.",
        description:
          "Sunrise walk through misty wetlands. Hike to Barta Waterfall. Local beekeeper with organic forest honey.",
      },
      {
        day: 5,
        title: "Higher Kaffa altitudes. Bamboo village at Boka.",
        description:
          "Explore the Kaffa region at up to 3,000m. Visit Boka bamboo village. Meet a spiritual leader. Stories about lions in the bamboo forest.",
      },
      {
        day: 6,
        title: "Bonga → Jimma. Markets.",
        description:
          "Drive back to Jimma. Local markets and the city's atmosphere. Overnight Jimma.",
      },
      {
        day: 7,
        title: "Jimma wood-carving markets → fly to Addis → farewell dinner.",
        description:
          "Jimma markets. Fly to Addis. Traditional dinner and dance show.",
      },
    ],
    includes: [
      "Bed and breakfast",
      "Domestic flights where applicable",
      "All ground transport",
      "All entrance fees",
      "Professional guide",
    ],
    excludes: [
      "International flights",
      "Meals (except noted)",
      "Beverages",
      "Insurance",
      "Photography fees",
    ],
    interests: ["coffee", "trekking", "wildlife", "culture"],
    regionIds: ["kaffa"],
    bestSeason: "Nov – Apr",
    difficulty: "moderate",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/western-ethiopia-tours/7-day-western-ethiopia-kaffa-coffee-biosphere-tours/",
    imageSlot: "Day-Trip-to-Wenchi-Crater-Lake.webp",
    imageAlt: "Kaffa coffee biosphere, ancient coffee forest, western Ethiopia",
  },
  {
    id: "south-coffee-4day",
    slug: "4-day-south-ethiopia-coffee-tour-to-yirgalem-hawassa-yirgacheffe",
    name: "4-Day South Ethiopia Coffee Tour — Yirgalem, Hawassa & Yirgacheffe",
    duration: 4,
    tagline:
      "The farms where the world's best coffee grows. Then a lake at sunset.",
    highlights: [
      "Yirgacheffe coffee plantation: the origin of the most distinctive natural-process coffee in Ethiopia",
      "Wottona Boltuma plantation at Aleta Wondo: visit the farm and the stelae park",
      "Lake Hawassa morning fish market — pelicans negotiate with the fishermen at 6am",
      "Folkloric farewell dinner in Addis: tej, dances from across the country, traditional coffee ceremony",
    ],
    days: [
      {
        day: 1,
        title:
          "Drive Addis → Awash River stop → Lake Ziway birds → Hawassa → Yirgalem.",
        description:
          "Depart Addis heading south (350km to Yirgalem). Stop at the Awash River and Lake Ziway for aquatic birds. Lunch in Hawassa. Continue to Yirgalem lodge.",
      },
      {
        day: 2,
        title: "Aleta Wondo coffee plantation. Stelae park.",
        description:
          "Drive to Aleta Wondo. Visit the Wottona Boltuma Coffee plantation. Stelae park nearby. Lunch in Aleta Wondo. Return to Yirgalem.",
      },
      {
        day: 3,
        title: "Yirgacheffe coffee plantation → village visit → Hawassa.",
        description:
          "Drive to Yirga Cheffe. Village visit en route. The coffee plantation and its processing station. Lunch in Dilla. Afternoon drive to Hawassa lakeside resort.",
      },
      {
        day: 4,
        title:
          "Hawassa fish market → hippo boat → drive to Addis → folkloric dinner.",
        description:
          "Early morning fish market. Boat for hippos. Drive back to Addis. Evening folkloric dinner with regional dishes, traditional music, and coffee ceremony.",
      },
    ],
    includes: [
      "Bed and breakfast",
      "Domestic flights where applicable",
      "All ground transport",
      "All entrance fees",
      "Professional guide",
      "Folkloric farewell dinner",
    ],
    excludes: [
      "International flights",
      "Lunches and dinners (except noted)",
      "Beverages",
      "Insurance",
      "Photography fees",
      "Personal items",
    ],
    interests: ["coffee", "wildlife", "culture"],
    regionIds: ["rift-valley"],
    bestSeason: "Oct – Apr (coffee harvest: Nov – Jan)",
    difficulty: "easy",
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/southern-cultural-ethiopia-tours/4-day-south-ethiopia-coffee-tour-to-yirgalem-hawassa-yirgacheffe/",
    imageSlot: "Day-Trip-to-Wenchi-Crater-Lake.webp",
    imageAlt:
      "Yirgacheffe coffee plantation, southern Ethiopia, coffee cherries on branch",
  },
];

/** Tours featured in the PopularTours horizontal rail — ordered by visual impact */
export const featuredTourIds = [
  "danakil-3day",
  "simien-4day",
  "lalibela-3day",
  "omo-valley-3day",
  "tigray-5day",
  "bale-trek-5day",
  "north-historic-7day",
];

/**
 * Region data for the scroll story and interactive map.
 * Each region is a hook to book a tour — not a geography lesson.
 * Details paragraph: why come here, what the tour feels like, practical note.
 * TODO-REVIEW: All Ge'ez script needs native-speaker verification.
 */

export interface Region {
  id: string;
  name: string;
  geez: string; // Ge'ez numeral + region name in Ethiopic script
  geezNumeral: string; // Section numeral only: ፩ ፪ ፫ ፬ ፭
  tagline: string; // ≤12 words, sensory and specific
  story: string; // 2 sentences — the reason to book, not a history lesson
  details: string; // Why come here on a tour. Practical hooks.
  tourHook: string; // One sentence connecting this region to a specific tour
  altitude?: string;
  bestSeason: string;
  bookingNote: string; // Timing/logistics note relevant to booking
  howToGetThere: string;
  daysNeeded: string;
  accentColor: string;
  imageSlot: string;
  imageDescription: string;
}

export const regions: Region[] = [
  {
    id: "simien",
    name: "Simien Mountains",
    geez: "፩ ሲሜን" /* TODO-REVIEW */,
    geezNumeral: "፩",
    tagline: "4,543 metres. Gelada baboons. The Ethiopian wolf at dawn.",
    story:
      "The escarpment at Chenek drops 1,500 metres to the Tekezé valley. Nothing else in your field of view moves except the wind in the giant lobelia and, if you are early enough, an Ethiopian wolf crossing the moorland.",
    details:
      "The 4-day trek from Sankaber to Chenek is the core of this trip — two days up, two days out, camping at altitude each night. The landscape is not comfortable and that is the point. We carry everything. You walk. The wolf sightings at Chenek are near-guaranteed if you are up before 7am.",
    tourHook:
      "Our 4-Day Simien Mountains Hiking Tour covers Sankaber → Geech → Chenek with camping and a folkloric dinner in Gondar on the final night.",
    altitude: "2,200 – 4,543 m",
    bestSeason: "Oct – Mar (dry season; clearest skies, passable roads)",
    bookingNote:
      "Minimum group size 1. Park fees included. Book at least 2 weeks ahead for camping permits.",
    howToGetThere:
      "Fly Addis → Gondar (45 min), drive to Debark (3 hr), trek from Sankaber",
    daysNeeded: "4 days (classic Sankaber–Chenek trek)",
    accentColor: "--indigo",
    imageSlot: "simien-escarpment.webp",
    imageDescription:
      "PHOTO: Simien escarpment at golden hour, dramatic vertical drop to valley, gelada baboons in foreground. Wide landscape, 1600×900.",
  },
  {
    id: "lalibela",
    name: "Lalibela",
    geez: "፪ ላሊበላ" /* TODO-REVIEW */,
    geezNumeral: "፪",
    tagline: "11 churches carved into rock. One is below your feet.",
    story:
      "Lalibela at 5:40am. Cold stone underfoot, a priest's white shawl catching the last of the kerosene lamp, and somewhere below you — carved from a single block of volcanic rock — Beta Giyorgis.",
    details:
      "We run 3-day tours that cover all 11 churches across both clusters, plus the option to hike to Asheton Maryam monastery at 3,150m or drive to Yemrehanna Kristos cave church. If your trip falls in January — Timkat (Jan 19) fills every guesthouse in town. Book that separately and months ahead.",
    tourHook:
      "The 3-Day Lalibela Tour covers all 11 churches, includes a local guide who grew up here, and builds in time for the Saturday market.",
    altitude: "2,630 m",
    bestSeason: "Sep – Apr. Timkat (Jan 19) — book 3+ months ahead.",
    bookingNote:
      "Timkat period: hotels fill by November. Off-season (May–Aug) is cheaper but rainy.",
    howToGetThere: "Fly Addis → Lalibela direct (1 hr 15 min)",
    daysNeeded: "3 days minimum to cover all 11 churches properly",
    accentColor: "--ochre",
    imageSlot: "lalibela-beta-giyorgis.webp",
    imageDescription:
      "PHOTO: Beta Giyorgis church from above at dawn, cross-shaped roof in red volcanic rock. Overhead angle, 1200×1200.",
  },
  {
    id: "addis",
    name: "Addis Ababa",
    geez: "፫ አዲስ አበባ" /* TODO-REVIEW */,
    geezNumeral: "፫",
    tagline: "Your base. And worth a half-day on its own.",
    story:
      "Most trips start and end in Addis. The National Museum has Lucy. The Merkato has 13,000 stalls. Mount Entoto has the view. Half a day, one guide, no stress.",
    details:
      "We run a half-day Addis city tour that covers the National Museum (Lucy, 3.2 million years old), Holy Trinity Cathedral (the imperial burial site), Merkato, and Mount Entoto. It works as an arrival day activity or a departure morning. We also run day trips from Addis to Wenchi Crater Lake (155km west), Adadi Mariam, Tiya Stelae and Melka Kuntre (prehistoric site, 45km south).",
    tourHook:
      "Half-Day Addis tour or full-day Wenchi Crater Lake trip — both depart from your Addis hotel.",
    altitude: "2,355 m",
    bestSeason: "Year-round",
    bookingNote: "Day trips from Addis depart 6–7am. Book the evening before.",
    howToGetThere:
      "International flights to Bole Airport. Direct connections from Nairobi, Dubai, Istanbul, London, Frankfurt.",
    daysNeeded: "½ day city tour. Full day for Wenchi or Tiya.",
    accentColor: "--highland",
    imageSlot: "addis-merkato-morning.webp",
    imageDescription:
      "PHOTO: Addis Ababa Merkato at 7am, morning light through fabric stalls. Street level, 1600×900.",
  },
  {
    id: "omo",
    name: "Omo Valley",
    geez: "፬ ኦሞ" /* TODO-REVIEW */,
    geezNumeral: "፬",
    tagline:
      "Thursday market at Key Afer. Come with a guide who knows the families.",
    story:
      "The lower Omo Valley is 580km south of Addis. The Karo people number fewer than 3,000. The Thursday market at Key Afer draws Banna, Hamer and Tsemay traders to the same lane. Neither is accessible without a guide who is trusted here.",
    details:
      "Our 3-day Omo Valley tour covers the Key Afer Thursday market, the Karo tribe on the Omo River east bank, a Mursi village in Mago National Park, and the Nyangatom. We use community-approved visit fees and local guides from the valley — not Jinka-based operators who drive in. The road from Jinka to the lower valley requires a 4WD and a driver who has done it in rain.",
    tourHook:
      "The 3-Day Omo Valley Quick Tour covers Mursi, Hamer and Karo in three days. The 7-Day extends into the Dassanech delta.",
    altitude: "400 – 700 m",
    bestSeason: "Nov – Mar (dry roads). Avoid Jun–Sep.",
    bookingNote:
      "Key Afer Thursday market is the anchor — tour departs Sunday to arrive by Wednesday.",
    howToGetThere:
      "Fly Addis → Jinka (1 hr 15 min direct), then 4WD into the valley",
    daysNeeded: "3 days minimum. 7 days for the full valley circuit.",
    accentColor: "--sulphur",
    imageSlot: "omo-valley-hamar.webp",
    imageDescription:
      "PHOTO: Omo Valley, Hamar woman at Dimeka market, ochre-butter braids, dry acacia. Environmental portrait, 900×1200.",
  },
  {
    id: "danakil",
    name: "Danakil Depression",
    geez: "፭ ዳናኪል" /* TODO-REVIEW */,
    geezNumeral: "፭",
    tagline: "−125 metres. Lava lake overnight. Salt miners at 5am.",
    story:
      "The Danakil is the hottest place we run tours. The Dallol hydrothermal field is acid-yellow and acid-green — that is not a filter. The Erta Ale lava lake has been active since at least 1906. You sleep at the crater rim.",
    details:
      "Three days: fly Addis–Semera, drive to Lake Afdera (swim), truck to Erta Ale base, camel carry to the rim, sleep. Day two: Dallol at first light, salt miners at Ragad, drive back to Hamedila camp. Day three: sunrise on the flats, drive to Semera, fly home. Armed Afar guides escort every convoy — this is a border region. Nov–Mar only. Summer temperature exceeds 50°C and the trip does not run.",
    tourHook:
      "The 3-Day Danakil Expedition includes domestic flights, camping at Erta Ale, and full board in the Afar region.",
    altitude: "−125 – 0 m",
    bestSeason: "Nov – Mar only.",
    bookingNote:
      "This trip does not run Jun–Sep. Domestic flights (Addis–Semera) book out — reserve 3–4 weeks ahead in the high season.",
    howToGetThere:
      "Fly Addis → Semera (50 min), 4WD convoy into the depression",
    daysNeeded: "3 days (Dallol + Erta Ale overnight)",
    accentColor: "--sulphur",
    imageSlot: "danakil-dallol-acid.webp",
    imageDescription:
      "PHOTO: Dallol hydrothermal field, acid-yellow and green salt formations, flat horizon. Ultra-wide, 2000×900.",
  },
];

export type RegionId = (typeof regions)[number]["id"];

/**
 * Route packages — now references real tours from tours.ts.
 * The scoring engine in /lib/routeScorer.ts uses these.
 * Each route is either a single tour or a combination of real tours.
 */

export interface RouteStop {
  regionId: string;
  nights: number;
  notes: string;
}

export interface Route {
  id: string;
  name: string;
  interests: string[];
  duration: 7 | 10 | 14;
  stops: RouteStop[];
  highlights: string[];
  tagline: string;
  difficulty: "easy" | "moderate" | "demanding";
  /** ID(s) of real tours from tours.ts that make up this route */
  tourIds: string[];
  liveUrl?: string;
}

export const routes: Route[] = [
  {
    id: "north-historic-7",
    name: "The Historic North",
    interests: ["history", "culture"],
    duration: 7,
    tagline:
      "Lake Tana, Gondar, Lalibela, Simien — the four cities that made Ethiopia",
    difficulty: "easy",
    tourIds: ["north-historic-7day"],
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/7-day-northern-ethiopia-historic-tour/",
    stops: [
      {
        regionId: "addis",
        nights: 1,
        notes: "National Museum, Trinity Cathedral, Merkato",
      },
      {
        regionId: "bahirdar",
        nights: 1,
        notes: "Lake Tana boat trip to island monasteries",
      },
      {
        regionId: "gondar",
        nights: 2,
        notes: "Fasil Ghebbi Royal Enclosure, Debre Birhan Selassie church",
      },
      {
        regionId: "simien",
        nights: 1,
        notes: "Day trek: Sankaber escarpment, gelada baboons",
      },
      {
        regionId: "lalibela",
        nights: 2,
        notes: "All 11 churches + Yemrehanna Kristos or Asheton Maryam",
      },
    ],
    highlights: [
      "Debre Birhan Selassie Church ceiling: 104 painted angels, all looking down at you",
      "Gelada baboon troop on the Simien escarpment at 3,600m",
      "Beta Giyorgis at dawn before the tour groups arrive — cold stone, warm candle smoke",
    ],
  },
  {
    id: "danakil-lalibela-6",
    name: "Lalibela + Danakil",
    interests: ["history", "trekking"],
    duration: 7,
    tagline: "Churches carved from rock, then a volcano. Nothing else like it.",
    difficulty: "demanding",
    tourIds: ["lalibela-danakil-6day"],
    liveUrl:
      "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/6-day-lalibela-dallol-erta-ale-adventure-tour/",
    stops: [
      { regionId: "addis", nights: 1, notes: "City highlights, Entoto views" },
      { regionId: "lalibela", nights: 2, notes: "All 11 rock-hewn churches" },
      {
        regionId: "danakil",
        nights: 2,
        notes: "Dallol salt flats, Erta Ale volcano overnight",
      },
      { regionId: "addis", nights: 1, notes: "Return and departure" },
    ],
    highlights: [
      "Erta Ale lava lake at midnight — permanent, active since 1906",
      "Dallol at 7am: acid-yellow chimneys at −125m, no other landscape on earth resembles it",
      "Beta Giyorgis from above: a cross carved into a single block of red volcanic rock",
    ],
  },
  {
    id: "simien-lalibela-10",
    name: "Mountains and Stone",
    interests: ["trekking", "history", "culture"],
    duration: 10,
    tagline:
      "Trek the Simien, then descend to the rock-hewn churches of Lalibela",
    difficulty: "moderate",
    tourIds: ["simien-4day", "lalibela-3day"],
    stops: [
      {
        regionId: "addis",
        nights: 1,
        notes: "Overnight transit; National Museum",
      },
      {
        regionId: "simien",
        nights: 4,
        notes: "Sankaber → Geech → Chenek; Ethiopian wolf at 4,000m",
      },
      {
        regionId: "lalibela",
        nights: 3,
        notes:
          "All church clusters; Yemrehanna Kristos cave church; Asheton Maryam option",
      },
      { regionId: "addis", nights: 1, notes: "Departure" },
    ],
    highlights: [
      "Chenek viewpoint at 3,620m — the drop to the Tekezé valley is not metaphorical",
      "Ethiopian wolf hunting mole-rats at 7am on the Chenek moorland",
      "Yemrehanna Kristos: Axumite architecture, 12th century, mummified pilgrims in the walls",
    ],
  },
  {
    id: "omo-danakil-7",
    name: "South and North",
    interests: ["culture", "trekking", "wildlife"],
    duration: 7,
    tagline:
      "Omo Valley tribes, then Danakil lava. Two extremes of one country.",
    difficulty: "demanding",
    tourIds: ["omo-valley-3day", "danakil-3day"],
    stops: [
      { regionId: "addis", nights: 1, notes: "Arrival, orientation" },
      {
        regionId: "omo",
        nights: 3,
        notes: "Key Afer market, Karo tribe, Mursi village",
      },
      {
        regionId: "danakil",
        nights: 2,
        notes: "Dallol salt flats, Erta Ale volcano overnight",
      },
      { regionId: "addis", nights: 1, notes: "Return" },
    ],
    highlights: [
      "Key Afer Thursday market: Banna, Hamer, and Tsemay traders in one lane",
      "Karo people on the Omo River east bank — fewer than 3,000 remaining",
      "Standing at Erta Ale crater rim at midnight: the glow on your face is real heat",
    ],
  },
  {
    id: "wildlife-14",
    name: "Wildlife Ethiopia",
    interests: ["wildlife", "trekking"],
    duration: 14,
    tagline:
      "Ethiopian wolf twice. Gelada baboons. Mountain nyala. All endemic, all rare.",
    difficulty: "demanding",
    tourIds: ["simien-4day", "bale-trek-5day"],
    stops: [
      { regionId: "addis", nights: 1, notes: "Arrival" },
      {
        regionId: "simien",
        nights: 4,
        notes: "Sankaber to Chenek; gelada baboons; Ethiopian wolf",
      },
      { regionId: "addis", nights: 1, notes: "Transit night" },
      {
        regionId: "bale",
        nights: 5,
        notes: "Gaysay grasslands, Sanetti Plateau, Mt. Wasama, Black Lake",
      },
      { regionId: "addis", nights: 2, notes: "Recovery, departure" },
    ],
    highlights: [
      "Two separate Ethiopian wolf sightings — Simien and Sanetti — the world's rarest canid",
      "Mt. Wasama (4,200m) summit and Lake Gebre Gurracha in the same day",
      "Mountain nyala at dusk in Gaysay Grasslands, within 50 metres",
    ],
  },
  {
    id: "full-north-south-14",
    name: "North to South",
    interests: ["history", "trekking", "culture", "wildlife"],
    duration: 14,
    tagline:
      "The full length of the country: Lalibela to the Omo Valley in two weeks",
    difficulty: "moderate",
    tourIds: ["north-historic-7day", "omo-valley-3day"],
    stops: [
      { regionId: "addis", nights: 1, notes: "Arrival, orientation" },
      {
        regionId: "simien",
        nights: 3,
        notes: "Sankaber to Chenek, gelada and wolf sightings",
      },
      {
        regionId: "lalibela",
        nights: 3,
        notes: "All 11 churches; option: Timkat in January",
      },
      { regionId: "addis", nights: 1, notes: "Regroup before south" },
      {
        regionId: "omo",
        nights: 5,
        notes: "Key Afer → Karo → Mursi; Turmi market on Thursday",
      },
    ],
    highlights: [
      "Two completely different Ethiopias: the stone-carved north, the river-delta south",
      "Key Afer Thursday market — the most concentrated multi-tribal gathering in the Omo",
      "Sunset on the Omo River at 400m altitude, flat horizon, very far south",
    ],
  },
];

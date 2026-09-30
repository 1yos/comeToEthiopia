/**
 * Real tour packages from Come to Ethiopia Tours.
 * Data sourced from cometoethiopiatours.com — itineraries rewritten
 * in the editorial voice of the steering file. Facts preserved.
 * Links reference the live tour pages.
 * TODO-REVIEW: All Amharic place names and cultural descriptions.
 */

export interface TourDay {
  day: number
  title: string
  description: string
}

export interface Tour {
  id: string
  name: string
  duration: number        // days
  tagline: string         // ≤12 words, sensory and specific — steering voice
  highlights: string[]    // 3–5 specific highlights, no brochure phrasing
  days: TourDay[]
  includes: string[]
  excludes: string[]
  interests: string[]     // for route-builder scoring
  regionIds: string[]     // maps to regions.ts ids
  bestSeason?: string
  difficulty: 'easy' | 'moderate' | 'demanding'
  liveUrl: string         // canonical URL on cometoethiopiatours.com
  imageSlot: string       // filename in /src/media/tours/
  imageAlt: string
}

export const tours: Tour[] = [
  {
    id: 'addis-half-day',
    name: 'Half-Day Addis Ababa — National Museum, Trinity Cathedral, Merkato',
    duration: 1,
    tagline: 'Lucy, incense, and 13,000 market stalls before lunch',
    highlights: [
      '"Lucy" — Australopithecus afarensis, 3.2 million years old, in a glass case at the National Museum',
      'Holy Trinity Cathedral: the burial site of Emperor Haile Selassie, completed 1944',
      'Merkato: largest open-air market in Africa — spices, textiles, livestock, noise',
      'Mount Entoto at 3,200m: the city below looks like it is still deciding what to become',
    ],
    days: [
      {
        day: 1,
        title: 'National Museum → Trinity Cathedral → Merkato → Entoto',
        description:
          'Start at the National Museum — allow an hour for Lucy and the prehistory galleries alone. Walk to Holy Trinity Cathedral, where the Empress Menen and Haile Selassie are buried under the chancel. Then Merkato: enter from the southwest corner, follow the spice section east, exit when you find the coffee roasters. Drive to Mount Entoto for city views and Entoto Maryam Church.',
      },
    ],
    includes: ['Ground transport', 'Entrance fees', 'Professional English-speaking guide'],
    excludes: ['Meals', 'Beverages', 'Personal items'],
    interests: ['history', 'culture', 'coffee'],
    regionIds: ['addis'],
    bestSeason: 'Year-round',
    difficulty: 'easy',
    liveUrl: 'https://cometoethiopiatours.com/tours-holidays-in-ethiopia/addis-ababa-surroundings-tours/half-day-addis-ababa-tour-to-national-museum-trinity-cathedral-merkato/',
    imageSlot: 'Half-Day-Addis-Ababa-Tour-to-National-Museum-Trinity-Cathedral-Merkato.webp',
    imageAlt: 'Merkato market in Addis Ababa at morning, colourful stall fabrics, street level',
  },
  {
    id: 'wenchi-day-trip',
    name: 'Day Trip to Wenchi Crater Lake',
    duration: 1,
    tagline: 'A volcanic crater, a 13th-century monastery on an island, one boat',
    highlights: [
      'Wenchi Crater Lake sits at 2,600m — the water changes from blue at dawn to green by noon',
      'Boat trip to Galila Island and the monastery of St. Kristos, built in the 13th century',
      'Sulfur springs and boiling water fountains around the crater rim',
      'The 3–4 hour descent to the lake by foot or on horseback through Oromo farmland',
    ],
    days: [
      {
        day: 1,
        title: '155km drive west, crater descent, island monastery, return',
        description:
          'Depart Addis at 6am. The drive takes about two and a half hours — the last 30km on a road that improves with rain and worsens with it. Trek or ride down to the lake (3–4 hours round trip). Boat to Galila Island, visit St. Kristos monastery, walk the crater edge. Return to Addis by evening.',
      },
    ],
    includes: ['Ground transport (155km each way)', 'Entrance fees', 'Professional guide'],
    excludes: ['Horse rental and boat fees (paid locally)', 'Meals', 'Insurance'],
    interests: ['trekking', 'culture', 'wildlife'],
    regionIds: ['addis'],
    bestSeason: 'Oct – May (dry and short-rains)',
    difficulty: 'moderate',
    liveUrl: 'https://cometoethiopiatours.com/tours-holidays-in-ethiopia/addis-ababa-surroundings-tours/day-trip-to-wenchi-crater-lake/',
    imageSlot: 'Day-Trip-to-Wenchi-Crater-Lake.webp',
    imageAlt: 'Wenchi Crater Lake at 2,600m altitude, volcanic crater, blue-green water',
  },
  {
    id: 'danakil-3day',
    name: '3-Day Expedition: Dallol Salt Flats, Danakil Depression & Erta Ale Volcano',
    duration: 3,
    tagline: 'Lava lake overnight. Sulfur fields at dawn. Salt miners before breakfast.',
    highlights: [
      'Spend the night at the rim of Erta Ale — a permanent boiling lava lake active since at least 1906',
      'Dallol hydrothermal field: acid-yellow and green mineral formations at −125m',
      'Afar camel salt caravans leaving Hamed Ela before dawn — 400 animals, no engine sound',
      'Lake Afdera natural hot springs — swim in hypersaline water at 35°C',
    ],
    days: [
      {
        day: 1,
        title: 'Semera → Lake Afdera → Dodom → Erta Ale overnight',
        description:
          'Fly Addis to Semera (50 min). Drive into the Afar Depression to Lake Afdera for lunch and a swim in the salt lake. Continue to Dodom. Camels carry equipment up the last hour to the volcano rim. Sleep at the crater edge watching the lava lake.',
      },
      {
        day: 2,
        title: 'Erta Ale → Hamed Ela → Ragad salt miners → Dallol',
        description:
          'Early breakfast at the crater. Drive to Hamed Ela. Stop at Ragad to watch Afar miners cut salt from the ground and load camel trains. Drive to Dallol: the salt canyons, sulfur chimneys, and brine pools. Return to Hamed Ela camp.',
      },
      {
        day: 3,
        title: 'Salt flat sunrise → Semera → Addis Ababa',
        description:
          'Sunrise over the salt flats — the light turns the white flat amber for about 20 minutes. Drive to Semera. Fly back to Addis.',
      },
    ],
    includes: [
      'Afar region camping accommodation',
      'All entrance, guide, and scout fees',
      'Domestic flights (Addis–Semera–Addis)',
      'Full board in Afar region',
      '4WD Land Cruisers with AC',
      'Professional guide, cook, camping equipment',
    ],
    excludes: ['Photography/video fees', 'Alcoholic beverages', 'Travel insurance', 'Tips'],
    interests: ['trekking', 'wildlife', 'history'],
    regionIds: ['danakil'],
    bestSeason: 'Nov – Mar only (summer is medically dangerous for visitors)',
    difficulty: 'demanding',
    liveUrl: 'https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/3-day-expedition-to-dallol-salt-flats-danakil-depression-erta-ale-volcano/',
    imageSlot: '3-Day-Expedition-to-Dallol-Salt-Flats-Danakil-Depression-Erta-Ale-Volcano.webp',
    imageAlt: 'Dallol hydrothermal field, acid-yellow salt formations, Danakil Depression',
  },
  {
    id: 'lalibela-3day',
    name: '3-Day Tour of Lalibela, Yemrehanna Kristos & Asheton Maryam',
    duration: 3,
    tagline: 'Eleven churches carved into rock. One of them is below your feet.',
    highlights: [
      'All eleven UNESCO-listed rock-hewn churches of Lalibela, including Beta Giyorgis at dawn',
      'Yemrehanna Kristos — an Axumite church inside a cave, 12th century, mummified pilgrims in the walls',
      'Mule hike to Asheton Maryam monastery at 3,150m: the view back to the church cluster is specific',
      'Saturday market in Lalibela town — local traders, tej (honey wine) shops, injera bakeries',
    ],
    days: [
      {
        day: 1,
        title: 'Fly to Lalibela. Afternoon: Northern church cluster',
        description:
          'Morning flight from Addis (1hr 15min). 45-minute drive to town. After lunch, the northern cluster: Bete Medhane Alem, Bete Maryam, Bete Maskal, Bete Denagel. Your guide has known these walls since childhood — he will show you what the tourist groups miss.',
      },
      {
        day: 2,
        title: 'Eastern cluster + Bete Giyorgis. Afternoon: monastery choice',
        description:
          'The eastern cluster — Bete Amanuel, Bete Abba Libanos, Bete Merkorios — then Beta Giyorgis, the cross-shaped church carved into a single block of stone. In the afternoon: either Yemrehanna Kristos (60km north, cave church, completely different architecture) or mule hike to Asheton Maryam. Saturday visitors can add the weekly market.',
      },
      {
        day: 3,
        title: 'Return flight to Addis',
        description: 'Breakfast. Transfer to airport. Late morning or early afternoon arrival in Addis.',
      },
    ],
    includes: ['Domestic flights', 'Ground transport', 'All entrance fees', 'Professional local guide'],
    excludes: ['International flights', 'Meals (except where noted)', 'Insurance', 'Personal items'],
    interests: ['history', 'culture'],
    regionIds: ['lalibela'],
    bestSeason: 'Sep – Apr; Jan for Timkat (book 3 months ahead)',
    difficulty: 'easy',
    liveUrl: 'https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/3-day-tour-of-lalibela-yemrehanna-kristos-hiking-to-asheton-maryam/',
    imageSlot: '3-Day-Tour-of-Lalibel-Yemrehanna-Kristos-Hiking-to-Asheton-Maryam.webp',
    imageAlt: 'Beta Giyorgis church Lalibela, cross-shaped roof cut into red volcanic rock',
  },
  {
    id: 'simien-4day',
    name: '4-Day Simien Mountains Hiking Tour',
    duration: 4,
    tagline: 'Sankaber to Chenek. 4,000m. The wolves hunt at 7am.',
    highlights: [
      'Trek from Sankaber (2,840m) to Chenek (3,620m) via Geech — the Enatye escarpment drops 1,500m to the Tekezé valley',
      'Jinbar waterfall: the water disappears into the gorge before it reaches the bottom',
      'Gelada baboon herds on the moorland — sometimes 300 animals, always close',
      'Ethiopian wolf territory on the Chenek plateau: the rarest canid alive, about 500 remaining',
      'Folkloric dinner in Gondar on the final night',
    ],
    days: [
      {
        day: 1,
        title: 'Fly Addis → Gondar. Drive to Sankaber. Camp.',
        description:
          'Morning flight to Gondar (45 min). Meet your guide and 4WD at the airport. 3-hour drive to Sankaber, the park entrance at 2,840m. Briefing, camping setup, cold night.',
      },
      {
        day: 2,
        title: 'Sankaber → Geech. 5–7 hours, 3,600m.',
        description:
          'The walk crosses the Jinbar River valley — the falls are visible from 2km before you reach them. Ascent through heather moorland to Geech camp. Gelada baboons graze the meadow around the tents in the afternoon.',
      },
      {
        day: 3,
        title: 'Geech → Chenek along the Enatye escarpment.',
        description:
          'The path follows the cliff edge for much of the day. At 4,000m the air is thin and the view is not metaphorical — the valley floor is 1,500 metres below you. Chenek is Walia ibex territory. Overnight camp.',
      },
      {
        day: 4,
        title: 'Drive to Gondar. Folkloric dinner. Airport transfer.',
        description:
          'Depart Chenek after breakfast. Drive back to Gondar (4 hrs). Evening folkloric dinner — injera, tibs, tej, traditional music and dance from the Gondar region. Transfer to airport for flight to Addis.',
      },
    ],
    includes: [
      'Bed and breakfast meal plan',
      'Domestic flights (Addis–Gondar–Addis)',
      'All ground transport',
      'All entrance fees and park fees',
      'Professional English-speaking guide',
    ],
    excludes: ['International flights', 'Lunches and dinners (except folkloric dinner)', 'Beverages', 'Insurance', 'Photography fees'],
    interests: ['trekking', 'wildlife'],
    regionIds: ['simien'],
    bestSeason: 'Oct – Mar (dry; roads passable; clearest escarpment views)',
    difficulty: 'moderate',
    liveUrl: 'https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/4-day-simien-mountains-hiking-tour/',
    imageSlot: '4-Day-Simien-Mountains-Hiking-Tour.webp',
    imageAlt: 'Simien Mountains escarpment, Enatye cliff, gelada baboons in foreground',
  },
  {
    id: 'bale-sofomar-4day',
    name: '4-Day Sof Omar Cave & Bale Mountains',
    duration: 4,
    tagline: 'The largest cave in Africa, the highest plateau, and the rarest wolf.',
    highlights: [
      'Sanetti Plateau at 4,000m+ — the best place in the world to see Ethiopian wolves',
      'Sof Omar Cave system: 15km of limestone chambers, the Weyib River flowing through them',
      'Harenna Forest: dense highland forest with wild coffee growing under the canopy',
      'Mountain nyala — endemic to Ethiopia, found almost nowhere else',
    ],
    days: [
      {
        day: 1,
        title: 'Fly to Goba. Afternoon in Harenna Forest.',
        description:
          'Morning flight Addis to Goba. Drive into the Harenna Forest — one of the largest remaining highland forests in Ethiopia, dense enough to block the midday light. Overnight in Goba.',
      },
      {
        day: 2,
        title: 'Sanetti Plateau. Ethiopian wolf territory.',
        description:
          'Drive up to the Sanetti Plateau before 8am. The wolves hunt mole-rats in the alpine meadows at dawn — your guide knows where they\'ve been seen this week. Return through Harenna Forest. Overnight in Goba.',
      },
      {
        day: 3,
        title: 'Sof Omar Cave system.',
        description:
          'Drive to Sof Omar. The Weyib River has carved 15km of limestone vaults underground — the largest cave in Ethiopia, possibly Africa. The light inside comes through collapse holes and water reflections. Half-day inside, lunch, return to Goba.',
      },
      {
        day: 4,
        title: 'Return flight to Addis Ababa.',
        description: 'Transfer to Goba airport. Flight back to Addis.',
      },
    ],
    includes: ['Domestic flights', 'Ground transport', 'All entrance fees', 'Professional guide'],
    excludes: ['International flights', 'Meals (except noted)', 'Beverages', 'Insurance'],
    interests: ['trekking', 'wildlife'],
    regionIds: ['bale'],
    bestSeason: 'Nov – Mar (dry season; Ethiopian wolf sightings most reliable)',
    difficulty: 'moderate',
    liveUrl: 'https://cometoethiopiatours.com/tours-holidays-in-ethiopia/eastern-ethiopia-tours/4-day-bale-mountains-sof-omar-caves-tours/',
    imageSlot: '4-Day-Bale-Mountains-Sof-Omar-Caves-Tours.webp',
    imageAlt: 'Bale Mountains Sanetti Plateau, Afro-alpine landscape, Ethiopian wolf visible',
  },
  {
    id: 'tigray-5day',
    name: '5-Day Tigray Rock-Hewn Churches',
    duration: 5,
    tagline: 'Churches in cliffs. 6th century. You climb to reach them.',
    highlights: [
      'Abuna Yemata Guh: reached by a short cliff climb — the interior has 5th–6th century frescoes',
      'Debre Mariam Korkor: 6th century, a 30-minute walk from Abuna Yemata, usually empty',
      'Abraha Atsbeha Church: finest decorated interior of the Gheralta cluster',
      'Wukro Chirkos: semi rock-hewn, still in active liturgical use — Friday morning service',
      'Farewell folkloric dinner in Mekele: injera, kitfo, tej, dances of the Tigray region',
    ],
    days: [
      {
        day: 1,
        title: 'Addis Ababa highlights',
        description:
          'National Museum (Lucy, 3.2 million years old), Holy Trinity Cathedral, Merkato, Entoto. Evening in Addis.',
      },
      {
        day: 2,
        title: 'Fly Addis → Mekele → Hawzen. Wukro Chirkos + Abraha Atsbeha.',
        description:
          'Morning flight to Mekele. Drive to Hawzen via Wukro Chirkos church and the remarkable interior of Abraha Atsbeha. Overnight Hawzen.',
      },
      {
        day: 3,
        title: 'Debre Tsion and Yohannes Makudi churches, Gheralta.',
        description:
          'The approach to Yohannes Makudi is through a narrow cleft between sandstone cliffs — arrive before the heat. Debre Tsion is carved directly from the rock face. Return to Hawzen.',
      },
      {
        day: 4,
        title: 'Abuna Yemata Guh. Debre Mariam Korkor.',
        description:
          'The climb to Abuna Yemata Guh is short but vertical — bare feet on the rock face. The frescoes inside are the reason you came. Nearby Debre Mariam Korkor is less visited and arguably more beautiful. Return to Hawzen.',
      },
      {
        day: 5,
        title: 'Drive to Mekele. Folkloric dinner. Flight to Addis.',
        description:
          'Return to Mekele. Farewell dinner with traditional Tigray cuisine, music, coffee ceremony. Night flight to Addis.',
      },
    ],
    includes: ['Domestic flights', 'Ground transport', 'All entrance fees', 'Professional guide', 'Folkloric dinner'],
    excludes: ['International flights', 'Meals (except noted)', 'Beverages', 'Insurance'],
    interests: ['history', 'culture', 'trekking'],
    regionIds: ['tigray'],
    bestSeason: 'Oct – Apr',
    difficulty: 'moderate',
    liveUrl: 'https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/5-days-tigray-rock-hewn-churches-tour/',
    imageSlot: 'Gheralta-Mountains-Ethiopia-Tours-and-Travel-Packages.jpg',
    imageAlt: 'Gheralta cliffs Tigray, sandstone escarpment, rock-hewn church entrance visible',
  },
  {
    id: 'bale-trek-5day',
    name: '5-Day Bale Mountains Trek — Ethiopian Wolves & Alpine Lakes',
    duration: 5,
    tagline: 'The rarest canid on earth. 4,200m. A lake they call the Black Lake.',
    highlights: [
      'Ethiopian wolf on the Sanetti Plateau — the rarest canid in the world, best seen at dawn',
      'Summit Mt. Wasama (4,200m) and descend to Lake Gebre Gurracha (the "Black Lake")',
      'Mountain nyala and Menelik\'s bushbuck in the Gaysay Grasslands — endemic to Ethiopia',
      'Lammergeier (bearded vulture) and Verreaux\'s eagle in the Mararo Valley',
      'Habera Waterfall: cold meltwater into a high-altitude pool',
    ],
    days: [
      {
        day: 1,
        title: 'Addis → Dinsho. Gaysay Grasslands walk.',
        description:
          'Morning departure from Addis by road (8 hrs). Arrive Dinsho (Bale Mountains HQ) before dark. Evening walk through Gaysay Grasslands — mountain nyala graze here at dusk, sometimes within 50 metres.',
      },
      {
        day: 2,
        title: 'Trek to Finchi Habera (~5 hrs). Habera Waterfall.',
        description:
          'Into the park proper. The forest thins and the moorland opens. Around Dinsho the mountain nyala are still present; deeper in, watch for Ethiopian wolf. Stop at Habera Waterfall for lunch and cold water.',
      },
      {
        day: 3,
        title: 'Wasama Valley (~8 hrs). Prime wolf territory.',
        description:
          'Long day through the Mararo Valley. Lammergeier circles above the cliffs. This is the densest wolf territory in the park — the mole-rat colonies are everywhere and the wolves follow. Altitude 3,800–4,000m.',
      },
      {
        day: 4,
        title: 'Summit Mt. Wasama (4,200m). Lake Gebre Gurracha.',
        description:
          'Climb to the summit before the clouds come in. Descend to the glacial valley. Lake Gebre Gurracha is black in flat light and mirror-blue in sun. Camp on its shore.',
      },
      {
        day: 5,
        title: '2-hr trek to Sanetti Plateau. Drive to Addis.',
        description:
          'Short morning trek to the plateau — the last chance for wolves. Meet the vehicles. Long drive back to Addis Ababa. Cultural dinner and music on arrival.',
      },
    ],
    includes: ['Camping equipment', 'All entrance and park fees', 'Professional guide', 'Cultural dinner'],
    excludes: ['International flights', 'Most meals', 'Beverages', 'Insurance'],
    interests: ['trekking', 'wildlife'],
    regionIds: ['bale'],
    bestSeason: 'Nov – Feb (driest; wolf sightings most reliable)',
    difficulty: 'demanding',
    liveUrl: 'https://cometoethiopiatours.com/tours-holidays-in-ethiopia/southern-cultural-ethiopia-tours/5-day-bale-mountains-trek-ethiopian-wolves-alpine-lakes/',
    imageSlot: '5-Day-Bale-Mountains-Trek-Ethiopian-Wolves-Alpine-Lakes.webp',
    imageAlt: '5-day Bale Mountains trek, Sanetti Plateau, Ethiopian wolf in alpine meadow',
  },
  {
    id: 'lalibela-danakil-6day',
    name: '6-Day Lalibela, Dallol & Erta Ale Adventure',
    duration: 6,
    tagline: 'Churches in rock. Then a volcano. Nothing else like it.',
    highlights: [
      'All 11 rock-hewn churches of Lalibela across two dedicated days',
      'Erta Ale lava lake at midnight — the glow on your face is real heat, not ambient light',
      'Dallol: acid-green mineral pools and salt canyons at −125m, the lowest point in Africa',
      'Addis city highlights as bookends — National Museum and Entoto on day 1',
    ],
    days: [
      {
        day: 1,
        title: 'Addis Ababa: National Museum, Trinity Cathedral, Entoto',
        description: 'Arrive or start in Addis. City circuit ending at Entoto for views.',
      },
      {
        day: 2,
        title: 'Fly to Lalibela. Afternoon: rock-hewn churches.',
        description: 'Flight 1hr 15min. Afternoon exploration of the main church clusters.',
      },
      {
        day: 3,
        title: 'Final Lalibela churches. Fly back to Addis.',
        description: 'Complete Bete Giyorgis and any remaining churches. Evening flight to Addis.',
      },
      {
        day: 4,
        title: 'Fly to Semera. Drive to Hamed Ela. Camp.',
        description: 'Into the Danakil. Lake Afdera swim. Camp under stars.',
      },
      {
        day: 5,
        title: 'Dallol. Afternoon trek to Erta Ale crater.',
        description: 'Dallol at 7am before the heat builds. Trek to Erta Ale rim by sunset.',
      },
      {
        day: 6,
        title: 'Sunrise on the volcano. Drive to Semera. Fly home.',
        description: 'Last view of the lava lake at dawn. Return convoy to Semera. Flight to Addis.',
      },
    ],
    includes: ['Domestic flights', 'Ground transport', 'All entrance fees', 'Professional guide', 'Camping equipment in Afar'],
    excludes: ['International flights', 'Meals (except Afar)', 'Beverages', 'Insurance'],
    interests: ['history', 'trekking', 'culture'],
    regionIds: ['lalibela', 'danakil'],
    bestSeason: 'Nov – Mar (Danakil window)',
    difficulty: 'demanding',
    liveUrl: 'https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/6-day-lalibela-dallol-erta-ale-adventure-tour/',
    imageSlot: 'Lalibela-Ethiopia-Tours.webp',
    imageAlt: 'Lalibela rock-hewn church complex, aerial view, red volcanic tuff',
  },
  {
    id: 'north-historic-7day',
    name: '7-Day Historic Tour — Lake Tana, Gondar, Lalibela & Simien Mountains',
    duration: 7,
    tagline: 'Monasteries on an island. A 17th-century castle. Eleven churches. Gelada baboons.',
    highlights: [
      'Boat trip on Lake Tana to 14th-century island monasteries — still in active liturgical use',
      'Gondar Royal Enclosure: Emperor Fasilides\' 17th-century castle complex, Ethiopia\'s Camelot',
      'All 11 rock-hewn churches of Lalibela in one concentrated day',
      'Day trek in the Simien Mountains: gelada baboons and the escarpment view',
    ],
    days: [
      {
        day: 1,
        title: 'Addis Ababa: National Museum, Trinity Cathedral, Merkato',
        description: 'City orientation. The National Museum for Lucy. Holy Trinity Cathedral. Merkato.',
      },
      {
        day: 2,
        title: 'Fly to Bahir Dar. Lake Tana monasteries by boat.',
        description: 'Morning flight to Bahir Dar (45 min). Afternoon boat tour of Lake Tana island monasteries. Sunset from Bezawit Hills above the Blue Nile.',
      },
      {
        day: 3,
        title: 'Drive to Gondar. Royal Enclosure. Debre Birhan Selassie Church.',
        description: 'Drive north (3 hrs). Fasil Ghebbi Royal Enclosure — the castle of Fasilides, the church of Iyasu. Debre Birhan Selassie: the ceiling painted with 104 angels\' faces, all looking down.',
      },
      {
        day: 4,
        title: 'Day trip: Simien Mountains National Park.',
        description: 'Drive to the park (2 hrs). Day hike along the escarpment. Gelada baboon troops. Viewpoint over the Tekezé valley. Return to Gondar.',
      },
      {
        day: 5,
        title: 'Fly to Lalibela. Rock-hewn churches — all 11.',
        description: 'Flight 50 min. Full day across both church clusters: northern, eastern, and Beta Giyorgis. Evening coffee ceremony in town.',
      },
      {
        day: 6,
        title: 'Yemrehanna Kristos or Asheton Maryam. Your choice.',
        description: 'Drive to the cave church of Yemrehanna Kristos (1 hr), or mule hike to Asheton Maryam monastery at 3,150m. Both are worth it — pick based on your legs.',
      },
      {
        day: 7,
        title: 'Return to Addis Ababa.',
        description: 'Flight from Lalibela. Final shopping in Addis. Airport transfer.',
      },
    ],
    includes: ['Bed and breakfast', 'All domestic flights', 'Ground transport', 'All entrance fees and guides'],
    excludes: ['International flights', 'Lunches and dinners', 'Insurance', 'Personal items'],
    interests: ['history', 'trekking', 'culture'],
    regionIds: ['addis', 'bahirdar', 'gondar', 'simien', 'lalibela'],
    bestSeason: 'Oct – Apr',
    difficulty: 'easy',
    liveUrl: 'https://cometoethiopiatours.com/tours-holidays-in-ethiopia/northern-ethiopia-historical-tours/7-day-northern-ethiopia-historic-tour/',
    imageSlot: '7-Day-Historic-Tour-to-Lake-Tana-Gonder-Lalibela-Simien-Mountains.webp',
    imageAlt: 'Lake Tana boat trip, island monastery, Ethiopia',
  },
  {
    id: 'omo-valley-3day',
    name: '3-Day Omo Valley — Mursi, Hamer & Karo Tribes',
    duration: 3,
    tagline: 'Sixteen nations share this river. Three days gets you close to three of them.',
    highlights: [
      'Key Afer Thursday market: Banna, Hamer, and Tsemay traders in one place',
      'Karo people on the Omo River east bank — fewer than 3,000 left; fishing and body art',
      'Mursi village in Mago National Park — lip-plate tradition, observed with a local community guide',
      'Nyangatom: elaborate bead necklaces, cattle culture, Turkana border country',
    ],
    days: [
      {
        day: 1,
        title: 'Jinka → Key Afer market → Hamer and Benna villages → Turmi',
        description:
          'Start in Jinka (fly from Addis, 1hr 15min). Drive south to the Key Afer Thursday market — one of the most concentrated gatherings of different Omo groups. Continue to Hamer and Benna villages before Turmi.',
      },
      {
        day: 2,
        title: 'Karo tribe (Omo River east bank). Nyangatom village. Return Jinka.',
        description:
          'Morning drive to the Karo on the river bank. Their population is tiny — this is a community-managed visit, not a performance. Nyangatom in the afternoon. Return to Jinka.',
      },
      {
        day: 3,
        title: 'Mago National Park → Mursi village → Jinka departure.',
        description:
          'Drive through Mago National Park to a Mursi village. Return to Jinka. Flight back to Addis.',
      },
    ],
    includes: ['Domestic flights', 'Ground transport', 'All entrance and community fees', 'Professional local guide'],
    excludes: ['International flights', 'Meals', 'Beverages', 'Insurance'],
    interests: ['culture', 'wildlife'],
    regionIds: ['omo'],
    bestSeason: 'Nov – Mar (dry roads; avoid Jun–Sep)',
    difficulty: 'moderate',
    liveUrl: 'https://cometoethiopiatours.com/tours-holidays-in-ethiopia/southern-cultural-ethiopia-tours/3-day-omo-valley-quick-tour-to-mursi-hamer-karo-tribes/',
    imageSlot: '3-Day-Omo-Valley-Quick-Tour-to-Mursi-Hamer-Karo-Tribes.webp',
    imageAlt: 'Omo Valley, Hamer woman at Key Afer market, ochre-butter braids, dry acacia',
  },
]

/** Tours featured in the PopularTours horizontal rail — ordered by visual impact */
export const featuredTourIds = [
  'danakil-3day',
  'simien-4day',
  'lalibela-3day',
  'omo-valley-3day',
  'tigray-5day',
  'bale-trek-5day',
  'north-historic-7day',
]

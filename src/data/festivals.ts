/**
 * Ethiopian festivals and calendar events.
 * TODO-REVIEW: All festival descriptions need native-speaker verification.
 * Gregorian dates are approximate — they shift year to year.
 */

export interface Festival {
  id: string
  name: string
  amharicName: string        // TODO-REVIEW: native-speaker verification
  ethiopianMonth: number     // 1–13
  ethiopianDay?: number      // If fixed; otherwise undefined (floating)
  gregorianApprox: string    // Human-readable approximate Gregorian date
  description: string        // 1–2 sentences, specific
  type: 'religious' | 'cultural' | 'new-year'
  significance: 'major' | 'regional' | 'local'
}

export const festivals: Festival[] = [
  {
    id: 'enkutatash',
    name: 'Enkutatash',
    amharicName: 'ዕንቁጣጣሽ', /* TODO-REVIEW */
    ethiopianMonth: 1,
    ethiopianDay: 1,
    gregorianApprox: 'September 11 (Sep 12 in Gregorian leap years)',
    description:
      'Ethiopian New Year. Children sing house to house at dawn, carrying bundles of yellow Meskel daisies. Addis smells of flower stems and charcoal-roasted coffee for three days.',
    type: 'new-year',
    significance: 'major',
  },
  {
    id: 'meskel',
    name: 'Meskel',
    amharicName: 'መስቀል', /* TODO-REVIEW */
    ethiopianMonth: 1,
    ethiopianDay: 17,
    gregorianApprox: 'September 27',
    description:
      'The Finding of the True Cross. The Meskel bonfire (demera) is lit in Meskel Square, Addis Ababa, on the evening of September 26 — a stack of bundled branches 10 metres high, the direction it falls said to predict the year ahead.',
    type: 'religious',
    significance: 'major',
  },
  {
    id: 'timkat',
    name: 'Timkat',
    amharicName: 'ጥምቀት', /* TODO-REVIEW */
    ethiopianMonth: 5,
    ethiopianDay: 11,
    gregorianApprox: 'January 19 (January 20 in Gregorian leap years)',
    description:
      'Ethiopian Epiphany, commemorating the baptism of Christ. In Lalibela, priests carry the Tabot (Ark replicas) in procession from each church. Tens of thousands of white-robed pilgrims camp on the church rooftops and in the trenches. Do not arrive without a booked guesthouse.',
    type: 'religious',
    significance: 'major',
  },
  {
    id: 'genna',
    name: 'Genna',
    amharicName: 'ገና', /* TODO-REVIEW */
    ethiopianMonth: 4,
    ethiopianDay: 29,
    gregorianApprox: 'January 7',
    description:
      'Ethiopian Christmas. A quieter celebration than Timkat — families attend pre-dawn church services, then eat injera with doro wat (chicken stew) together. In rural areas, men play genna, a stick game said to be the origin of field hockey.',
    type: 'religious',
    significance: 'major',
  },
  {
    id: 'fasika',
    name: 'Fasika',
    amharicName: 'ፋሲካ', /* TODO-REVIEW */
    ethiopianMonth: 8,
    gregorianApprox: 'April (date varies — Ethiopian Orthodox Easter)',
    description:
      'Ethiopian Orthodox Easter. Follows 55 days of strict fasting (the longest Christian fast in the world). The night of Fasika, the fast breaks at midnight after church: a whole roasted sheep, injera, and honey wine. The silence before the church bells is something.',
    type: 'religious',
    significance: 'major',
  },
  {
    id: 'irecha',
    name: 'Irreecha',
    amharicName: 'ኢሬቻ', /* TODO-REVIEW */
    ethiopianMonth: 1,
    gregorianApprox: 'Late September or early October',
    description:
      'Oromo thanksgiving ceremony held at Lake Hora, near Bishoftu (45 km from Addis). Millions gather to give thanks at the water\'s edge, dressed in Oromo traditional clothing, carrying grass and flowers. One of the largest annual gatherings in Africa.',
    type: 'cultural',
    significance: 'major',
  },
  {
    id: 'coffee-harvest',
    name: 'Coffee Harvest',
    amharicName: 'ቡና መኸር', /* TODO-REVIEW */
    ethiopianMonth: 3,
    gregorianApprox: 'November – January (Kaffa, Yirgacheffe, Harrar)',
    description:
      'Not a festival — a season. In the Kaffa forest (the wild origin of Arabica coffee), the harvest runs November to January. The smell of ripe coffee cherries is specific: sweet, slightly fermented, nothing like roasted coffee. Small cooperatives in Yirgacheffe welcome visitors during harvest.',
    type: 'cultural',
    significance: 'regional',
  },
]

/** Weather / activity windows by Ethiopian month (approximate) */
export interface SeasonBand {
  ethiopianMonths: number[]   // Which Ethiopian months this applies to
  label: string
  type: 'dry' | 'rains' | 'short-rains' | 'peak-trek' | 'wildlife'
  description: string
}

export const seasonBands: SeasonBand[] = [
  {
    ethiopianMonths: [1, 2, 3, 4, 5],  // Sep–Jan
    label: 'Dry season',
    type: 'dry',
    description: 'Main dry season. Best roads, clearest skies, most festivals. High demand — book ahead.',
  },
  {
    ethiopianMonths: [1, 2, 3],  // Sep–Nov
    label: 'Festival season',
    type: 'dry',
    description: 'Enkutatash, Meskel, Irreecha fall in rapid succession. The country is in a festive mood.',
  },
  {
    ethiopianMonths: [3, 4, 5, 6],  // Nov–Feb
    label: 'Trekking window',
    type: 'peak-trek',
    description: 'Best conditions for Simien Mountains and Bale Mountains trekking. Cold nights, clear days.',
  },
  {
    ethiopianMonths: [7, 8, 9, 10], // Mar–Jun
    label: 'Short rains (Belg)',
    type: 'short-rains',
    description: 'Light rains in central highlands. Some lodges offer lower rates. Not ideal for southern roads.',
  },
  {
    ethiopianMonths: [10, 11, 12], // Jun–Aug
    label: 'Main rains (Kiremt)',
    type: 'rains',
    description: 'Heavy rains across the highlands. Roads to Simien and Omo can become impassable. Avoid Danakil — dangerous heat compounds the rains.',
  },
  {
    ethiopianMonths: [3, 4, 5],  // Nov–Jan
    label: 'Wildlife season',
    type: 'wildlife',
    description: 'Bale Mountains: best sightings of Ethiopian wolf and mountain nyala. Omo Valley: dry river crossings open access.',
  },
]

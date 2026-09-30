/**
 * English UI strings.
 * All component copy comes from here or from content.ts.
 * Never hard-code UI strings in components.
 */
export const en = {
  // Nav
  tours:        'Tours',
  destinations: 'Destinations',
  whenToGo:     'When to Go',
  planTrip:     'Plan Trip',
  visiting:     'Visiting',
  local:        'Local',

  // Hero
  heroEyebrow:  'Come to Ethiopia Tours',
  heroCta:      'Plan your trip',
  scrollCue:    'Scroll',

  // Audience chooser
  whoIsThisFor:       'Who is this for?',
  visitingLabel:      'Visiting Ethiopia',
  visitingSub:        'International travelers and diaspora',
  visitingCta:        'Show me tours',
  localLabel:         'Living in Ethiopia',
  localSub:           'Day trips, weekends, family and group tours from Addis',
  localCta:           'Show local trips',
  audienceFootnote:   'Switch any time in the top navigation.',

  // Popular tours
  popularToursLabel:  'Popular Tours',
  popularHeadline:    'Trips that fit the country,\nnot a brochure.',
  popularSub:         'Every tour is run by an experienced Ethiopian guide from Addis Ababa.',
  allTours:           'All tours →',
  askForQuote:        'Ask for a quote',
  enquire:            'Enquire about this tour',
  fullItinerary:      'Full itinerary',
  days:               'days',
  day:                'day',

  // Destinations
  destinationsLabel:  'Destinations',
  seeTours:           'See tours →',

  // Map
  mapLabel:           'Tour regions',
  mapHeadline:        'Where do you want to go?',
  mapSub:             'Tap a region to see what we run there.',
  touchRegion:        'Touch a region',
  bestSeason:         'Best season',
  gettingThere:       'Getting there',
  daysNeeded:         'Days needed',

  // When to go
  whenLabel:          'When to Go',
  whenHeadline:       'Timing is everything.',
  whenSub:            'The Ethiopian calendar has 13 months. Meskel, Timkat, Fasika and Enkutatash fill hotels and flights weeks in advance.',
  thisMonth:          'This month',
  bookingNote:        'Book at least 6 weeks ahead for festival dates.',
  conditions:         'Conditions',
  festivals:          'Festivals',
  quietMonth:         'A quiet month. Good for moving slowly.',

  // Route builder
  routeLabel:         'Build Your Route',
  routeHeadline:      'Seven days or fourteen?',
  routeSub:           'Pick your interests and how long you have. We will match you to tours that actually fit.',
  showRoutes:         'Show matching tours',
  option:             'Option',
  nights:             'nights',
  night:              'night',
  highlights:         'Highlights',
  enquireRoute:       'Enquire about this route',
  difficulty:         { easy: 'Easy', moderate: 'Moderate', demanding: 'Demanding' },

  // Why us
  whyLabel:           'Why travel with us',
  whyHeadline:        'A guide, not a company.',
  whySub:             'Come to Ethiopia Tours is owned and operated by a single professional guide — not an agency that resells other operators.',

  // Traveler info
  infoLabel:          'Practical info',
  infoHeadline:       'Before you arrive.',
  infoSub:            'The things worth knowing before you get on the plane.',

  // Words for the road
  voicesLabel:        'Words for the road',
  voicesHeadline:     'Twelve words that will open doors.',
  voicesSub:          'You do not need to speak Amharic. But these will matter.',
  onTheRoad:          'On the road',
  beforeYouArrive:    'Before you arrive',
  coffeeCeremony:     'The coffee ceremony',
  coffeeNote:         'Three rounds. Two hours minimum. Do not check your phone.',
  keepScrolling:      'Keep scrolling',

  // Plan trip
  planLabel:          'Plan Your Trip',
  planHeadline:       "Let's talk about your trip.",
  planSub:            'Not a booking form. A conversation. Tell us the dates, the group size, and what you want — we will reply within 48 hours with a real itinerary.',
  orReachUs:          'Or reach us directly',
  namePlaceholder:    'Your name',
  emailPlaceholder:   'Email address',
  datesPlaceholder:   'Approximate travel dates',
  groupPlaceholder:   'Group size (solo, couple, family, team)',
  interestsPlaceholder: 'What draws you — trekking, history, coffee, culture, wildlife?',
  tourPlaceholder:    'Interested in a specific tour? (optional)',
  send:               'Send enquiry',
  sending:            'Sending…',
  successMsg:         "We'll reply within 48 hours. Check your email — and spam, just in case.",
  errorMsg:           'Something went wrong. Use WhatsApp or email directly.',
  whatsapp:           'WhatsApp',
  telegram:           'Telegram',
  call:               'Call',
  email:              'Email',

  // Footer
  todayInAddis:       'Today in Addis',
  madeIn:             'Owned and operated by an Ethiopian guide. Based in Addis Ababa.',
  credits:            'Map data: geoBoundaries CC-BY 4.0 · Photos: Come to Ethiopia Tours',

  // Generic
  close:              'Close',
  skip:               'Skip',
  loading:            'Loading',
  scroll:             'Scroll',
  soundOn:            'Sound on',
  soundOff:           'Sound off',
  home:               'Come to Ethiopia Tours — return to top',
  skipToContent:      'Skip to main content',
} as const

export type I18nKey = keyof typeof en

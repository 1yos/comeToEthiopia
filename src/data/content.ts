/**
 * All site copy — headlines, body text, UI labels, Amharic phrases.
 * Components import from here. Nothing hard-coded in JSX.
 * TODO-REVIEW: All Amharic/Ge'ez text needs native-speaker verification.
 *
 * PRODUCT: Come to Ethiopia Tours — a private tour company in Addis Ababa.
 * Every string here must help a visitor pick, trust, or book a tour.
 */

export const siteContent = {
  // ── Meta ────────────────────────────────────────────────────────────────
  meta: {
    title: "Come to Ethiopia Tours",
    description:
      "Trekking, history, culture and adventure tours across Ethiopia. Based in Addis Ababa, run by an experienced Ethiopian guide.",
  },

  // ── Nav ─────────────────────────────────────────────────────────────────
  nav: {
    logo: "Come to Ethiopia Tours",
    logoGeez: "ኢትዮጵያ" /* TODO-REVIEW */,
    links: [
      { label: "Tours", href: "#popular-tours" },
      { label: "Destinations", href: "#scroll-story" },
      { label: "When to Go", href: "#when-to-go" },
      { label: "Plan Trip", href: "#plan-trip" },
    ],
    audienceToggle: {
      visitor: "Visiting Ethiopia",
      local: "Living in Ethiopia" /* TODO-REVIEW: Amharic version */,
    },
    langToggle: {
      en: "EN",
      am: "አማርኛ" /* TODO-REVIEW */,
    },
    soundToggle: {
      ariaOn: "Mute ambient sound",
      ariaOff: "Play ambient sound (Krar strings)",
    },
  },

  // ── Preloader ────────────────────────────────────────────────────────────
  preloader: {
    counterLabel: "Loading",
    skipLabel: "Skip",
  },

  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    // Visitor-mode headline (uses live Ethiopian year)
    eyebrow: "Come to Ethiopia Tours",
    headlinePrefix: "It is",
    headlineYear: "2019", // interpolated at render time — never hard-code
    headlineSuffix: "here.",
    headlineSubline:
      "Trekking, history, coffee origin and cultural tours — led by a professional Ethiopian guide from Addis Ababa.",
    // Local-mode headline
    localHeadline: "ኢትዮጵያን እናሳይዎ" /* TODO-REVIEW */,
    localSubline:
      "ከአዲስ አበባ ወደ ሲሜን፣ ላሊበላ፣ ዳናኪልና ሌሎች ቦታዎች — ሙያዊ ጉዞ ድርጅት።" /* TODO-REVIEW */,
    cta: "Plan your trip",
    ctaLocal: "ጉዞ ያቅዱ" /* TODO-REVIEW */,
    ctaHref: "#plan-trip",
    scrollCue: "Scroll",
    annotation: {
      text: "4,543 m — Ras Dashen",
      position: "bottom-right" as const,
    },
  },

  // ── Who is this for (audience chooser) ───────────────────────────────────
  audienceChooser: {
    sectionLabel: "Who is this for?",
    optionA: {
      label: "Visiting Ethiopia",
      sub: "International travelers and diaspora",
      cta: "Show me multi-region tours",
    },
    optionB: {
      label: "Living in Ethiopia",
      subAmharic: "ለኢትዮጵያ ነዋሪዎች" /* TODO-REVIEW */,
      sub: "Day trips, weekends, family and group tours from Addis",
      cta: "Show local trips",
    },
    footnote: "You can switch any time in the top navigation.",
  },

  // ── Popular tours ─────────────────────────────────────────────────────────
  popularTours: {
    sectionLabel: "Popular Tours",
    headline: "Trips that fit the country,\nnot a brochure.",
    subline:
      "Every tour is run by an experienced Ethiopian guide from Addis Ababa. No package-tour middlemen.",
    allToursLabel: "All tours →",
    allToursUrl: "https://cometoethiopiatours.com/tours-holidays-in-ethiopia/",
    quoteLabel: "Ask for a quote",
    enquireLabel: "Enquire about this tour",
  },

  // ── Scroll story / destination section ─────────────────────────────────
  scrollStory: {
    sectionLabel: "Destinations",
    geezDecorator: "ኢትዮጵያ" /* TODO-REVIEW */,
    tourLinkLabel: "See tours →",
  },

  // ── Map section ─────────────────────────────────────────────────────────
  map: {
    sectionLabel: "Tour regions",
    headline: "Where do you want to go?",
    subline: "Tap a region to see what we run there.",
    geezDecorator: "ካርታ" /* TODO-REVIEW */,
    defaultPrompt: "Touch a region",
  },

  // ── When to go ───────────────────────────────────────────────────────────
  whenToGo: {
    sectionLabel: "When to Go",
    headline: "Timing is everything.",
    subline:
      "The Ethiopian calendar has 13 months. Meskel, Timkat, Fasika and Enkutatash fill hotels and flights weeks in advance. Use this to plan — or ask us to plan around a festival.",
    currentMonthLabel: "This month",
    festivalBookingNote: "Book at least 6 weeks ahead for festival dates.",
    geezDecorator: "ዘመን" /* TODO-REVIEW */,
  },

  // ── Route builder ────────────────────────────────────────────────────────
  routeBuilder: {
    sectionLabel: "Build Your Route",
    headline: "Seven days or fourteen?",
    subline:
      "Pick your interests and how long you have. We will match you to tours that actually fit.",
    interests: [
      { id: "history", label: "Ancient history" },
      { id: "trekking", label: "Trekking" },
      { id: "culture", label: "Living culture" },
      { id: "coffee", label: "Coffee origin" },
      { id: "wildlife", label: "Wildlife" },
    ],
    durations: [
      { value: 7, label: "7 days" },
      { value: 10, label: "10 days" },
      { value: 14, label: "14 days" },
    ],
    buildLabel: "Show matching tours",
    geezDecorator: "መንገድ" /* TODO-REVIEW */,
  },

  // ── Why travel with us ───────────────────────────────────────────────────
  whyUs: {
    sectionLabel: "Why travel with us",
    headline: "A guide, not a company.",
    subline:
      "Come to Ethiopia Tours is owned and operated by a single professional guide based in Addis Ababa — not an agency that resells other operators.",
    points: [
      {
        label: "You deal directly with the guide",
        body: "No call centres, no intermediaries. The person who answers your message will be on the road with you.",
      },
      {
        label: "Itineraries built around you",
        body: "Tell us the dates, the group, and what you want to feel at the end of the trip. We build from there.",
      },
      {
        label: "Destinations we actually know",
        body: "We only run tours to places we have been many times — Simien, Lalibela, Danakil, Omo, Tigray, Bale. No guesswork.",
      },
      {
        label: "Local rates and local knowledge",
        body: "We know which lodge has the best view of Chenek, which coffee shop opens at 6am in Lalibela, and when to leave Erta Ale to catch the sunrise.",
      },
    ],
  },

  // ── Traveler info ────────────────────────────────────────────────────────
  travelerInfo: {
    sectionLabel: "Practical info",
    headline: "Before you arrive.",
    subline: "The things worth knowing before you get on the plane.",
    items: [
      {
        id: "visa",
        label: "Visa",
        body: "Most nationalities can get an e-visa online at evisa.gov.et. Processing takes 3–5 business days. Bring a printed copy and the confirmation email.",
        link: "https://www.evisa.gov.et/",
        linkLabel: "Apply for e-visa",
      },
      {
        id: "health",
        label: "Health",
        body: "Yellow fever certificate required if arriving from a risk country. Malaria prophylaxis recommended for Omo Valley and Danakil. Addis Ababa and the highland north are low-risk.",
      },
      {
        id: "money",
        label: "Money",
        body: "Ethiopian Birr (ETB). ATMs available in Addis Ababa and most towns. USD cash accepted at some lodges. Credit cards work at major Addis hotels only. Bring birr for everything else.",
      },
      {
        id: "currency",
        label: "Exchange rate",
        body: "Exchange at banks or licensed bureaux. Airport rate is slightly worse. Keep small notes for local purchases.",
      },
      {
        id: "time",
        label: "Time",
        body: 'GMT+3. Ethiopia also uses its own 12-hour clock starting at 6am (your "7am" is their "1 o\'clock"). Our driver will always use the Gregorian 24-hour time with you.',
      },
      {
        id: "power",
        label: "Power",
        body: "220V, 50Hz. Round two-pin plugs (European style). Bring a universal adapter.",
      },
      {
        id: "connectivity",
        label: "Connectivity",
        body: "Ethio Telecom SIM cards available at the airport and in town. 4G coverage in Addis and most towns, patchy in the highlands and Danakil. Download offline maps before you leave Addis.",
      },
      {
        id: "packing",
        label: "Packing",
        body: "Light layers for Simien nights (down to 5°C in Jan). Sun protection everywhere. Sturdy shoes for Lalibela stone trenches. Dress modestly at religious sites — shoulders and knees covered.",
      },
      {
        id: "day",
        label: "A typical day",
        body: "Early start — 6 or 7am — to reach sites before heat and tour groups. Long lunch during the midday heat. Sites and drives in the late afternoon. Dinner by 8pm. Every day is different.",
      },
    ],
  },

  // ── Words for the road (formerly Voices) ─────────────────────────────────
  // Reframed as practical travel phrases — not proverbs or cultural commentary.
  voices: {
    sectionLabel: "Words for the road",
    headline: "Twelve words that will open doors.",
    subline: "You do not need to speak Amharic. But these will matter.",
    phrases: [
      /* TODO-REVIEW: All Amharic translations need native-speaker verification */
      {
        amharic: "ሰላም",
        transliteration: "selam",
        meaning: "Hello",
        context: "Say this to everyone. First, last, always.",
      },
      {
        amharic: "አመሰግናለሁ",
        transliteration: "ameseginalew",
        meaning: "Thank you",
        context:
          "Formal — use this with guides, hotel staff, anyone helping you.",
      },
      {
        amharic: "ቡና ይስጡኝ",
        transliteration: "buna yistugn",
        meaning: "Please give me coffee",
        context: "Order coffee. The ceremony will follow.",
      },
      {
        amharic: "ስንት ነው?",
        transliteration: "sint new?",
        meaning: "How much?",
        context: "Merkato, markets, everywhere.",
      },
      {
        amharic: "ይቅርታ",
        transliteration: "yikerta",
        meaning: "Excuse me / Sorry",
        context: "Works for both.",
      },
      {
        amharic: "ጎበዝ",
        transliteration: "gobez",
        meaning: "Excellent / Well done",
        context: "Say this about the food, the view, anything. People love it.",
      },
      {
        amharic: "አይ ዋለ",
        transliteration: "aiwale",
        meaning: "No problem",
        context: "The answer you will hear most.",
      },
    ],
    // coffee ceremony steps — kept, useful for visitors on a coffee tour
    coffeeSteps: [
      /* TODO-REVIEW */
      {
        step: 1,
        amharic: "ቡና ቆሉ",
        label: "Roast the beans",
        notes: "Over charcoal. The smoke is the signal.",
      },
      {
        step: 2,
        amharic: "ደቀቀ",
        label: "Grind in the mortar",
        notes: "Passed around, everyone takes a turn.",
      },
      {
        step: 3,
        amharic: "ጠዩ",
        label: "Brew in the jebena",
        notes: "Slow boil. Clay pot. Do not rush this.",
      },
      {
        step: 4,
        amharic: "ጠጣ",
        label: "First round — Abol",
        notes: "Strongest. Three rounds total. Refusing the third is rude.",
      },
    ],
  },

  // ── Plan your trip ───────────────────────────────────────────────────────
  planTrip: {
    sectionLabel: "Plan Your Trip",
    headline: "Let's talk about your trip.",
    subline:
      "Not a booking form. A conversation. Tell us the dates, the group size, and what you want — we will reply within 48 hours with a real itinerary.",
    form: {
      namePlaceholder: "Your name",
      emailPlaceholder: "Email address",
      datesPlaceholder: "Approximate travel dates",
      groupPlaceholder: "Group size (solo, couple, family, team)",
      interestsPlaceholder:
        "What draws you — trekking, history, coffee, culture, wildlife, or something else?",
      tourPlaceholder: "Interested in a specific tour? (optional)",
      submitLabel: "Send enquiry",
      whatsappLabel: "WhatsApp",
      whatsappNumber: "+251903182009",
      telegramLabel: "Telegram", // TODO-CONFIRM: Telegram handle
      telegramHandle: "", // TODO-CONFIRM: add handle once confirmed
      callLabel: "Call",
      callNumber: "+251903182009",
      emailLabel: "Email",
      emailAddress: "cometoethiopiatours@gmail.com",
      altEmail: "info@cometoethiopiatours.com",
      successMessage:
        "We'll reply within 48 hours. Check your email — and spam, just in case.",
      errorMessage: "Something went wrong. Use WhatsApp or email directly.",
    },
    geezDecorator: "ጉዞ" /* TODO-REVIEW */,
  },

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    madeIn: "Owned and operated by an Ethiopian guide. Based in Addis Ababa.",
    copyright: "© Come to Ethiopia Tours",
    tagline: "Ethiopia's oldest profession is hospitality.",
    ethiopianDateLabel: "Today in Addis",
    links: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/cometoethiopiatours/",
      },
      { label: "WhatsApp", href: "https://wa.me/251903182009" },
      {
        label: "TikTok",
        href: "https://www.tiktok.com/@cometo.ethiopia.tours",
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/@CometoEthiopiatours",
      },
      { label: "Email", href: "mailto:cometoethiopiatours@gmail.com" },
    ],
    creditsNote:
      "Map data: geoBoundaries CC-BY 4.0 · Photos: Wikimedia Commons (CC BY-SA)",
    easterEggHint: "",
  },
};

export type SiteContent = typeof siteContent;

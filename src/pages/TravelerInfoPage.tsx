import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useSeo } from "@/hooks/useSeo";
import {
  PageHero,
  HeroLabel,
  HeroHeadline,
  HeroSub,
} from "@/components/PageHero";
import { siteContent } from "@/data/content";
import { DURATION, EASE_FM } from "@/lib/motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { AudienceMode } from "@/sections/AudienceChooser";

/**
 * TravelerInfoPage — a proper pre-trip guide.
 *
 * Organised into five sections, each expandable:
 *   1. Before you fly  — visa, vaccinations, insurance
 *   2. Getting there   — airlines, airport, first night
 *   3. In Ethiopia     — money, connectivity, transport
 *   4. Day to day      — altitude, food, what to wear
 *   5. Emergency info  — numbers, contacts, hospitals
 *
 * Visitor: shows all sections including visa and international flights.
 * Local: hides visa section, surfaces domestic transport first.
 */

interface Section {
  id: string;
  heading: string;
  intro: string;
  items: { title: string; body: string; link?: string; linkLabel?: string }[];
  visitorOnly?: boolean;
}

const SECTIONS: Section[] = [
  {
    id: "before",
    heading: "Before you fly.",
    intro: "Four things to sort before you book the flights.",
    items: [
      {
        title: "Visa",
        body: "Most nationalities get an e-visa online at evisa.gov.et. Processing takes 3–5 business days. Print the approval letter — immigration wants to see a physical copy. The fee is USD 52 for most nationalities. Children under 16 are free.",
        link: "https://www.evisa.gov.et/",
        linkLabel: "Apply for e-visa",
      },
      {
        title: "Yellow fever certificate",
        body: "Required if you are arriving from a yellow fever risk country — which includes most of sub-Saharan Africa. Cholera vaccination is also mandatory for travellers coming from or transiting through a cholera-infected area within six days of arrival. Keep both certificates — you may be asked at the airport.",
      },
      {
        title: "Malaria prevention",
        body: "Addis Ababa, Lalibela, Gondar and the Simien Mountains are low or no risk. The Omo Valley, Danakil and any lowland area below 2,000m is higher risk. Discuss prophylaxis with your doctor 4–6 weeks before departure.",
      },
      {
        title: "Travel insurance",
        body: "Not optional. Make sure your policy covers trekking (Simien and Bale) and volcanic activity (Danakil). Check the medical evacuation limit — Addis has adequate private hospitals, but remote areas do not.",
      },
      {
        title: "Customs — duty-free allowances",
        body: "200 cigarettes, 50 cigars, or half a pound of tobacco. 2 litres of alcoholic beverages. Half a litre or two bottles of perfume. Certain souvenirs — animal skins, antiques — may require an export permit on departure.",
      },
    ],
    visitorOnly: true,
  },
  {
    id: "getting-there",
    heading: "Getting there.",
    intro:
      "Ethiopian Airlines is the main carrier. It flies from more African cities than any other airline on the continent.",
    items: [
      {
        title: "Ethiopian Airlines",
        body: "Ethiopian Airlines flies direct to Addis Ababa from Nairobi, Dubai, Istanbul, London Heathrow, Frankfurt, Paris, Washington D.C., Toronto and many others. The Addis hub connects onward to regional cities — Lalibela, Gondar, Bahir Dar, Jimma, Dire Dawa — often the same day.",
        link: "https://www.ethiopianairlines.com/",
        linkLabel: "ethiopianairlines.com",
      },
      {
        title: "Bole International Airport",
        body: "Addis Ababa Bole (ADD) is modern and rarely chaotic. The arrivals process takes 20–45 minutes. Immigration queues are longest when three long-haul flights land at once. Currency exchange desks are in arrivals — rates are fair.",
      },
      {
        title: "Airport transfer",
        body: "Your guide picks you up from arrivals with a name sign. We confirm the flight number the night before. If you arrive independently: licensed taxis from the rank outside arrivals cost around 300–500 ETB to central Addis. Ride-hailing apps (Ride and ZayRide) work from the airport.",
      },
      {
        title: "First night in Addis",
        body: "Arrive a day before any domestic connection. Addis has good hotels at every level — luxury chains (Sheraton, Radisson Blu, Marriott, Hilton) and well-run mid-range options in Bole and Piazza (Ghion, Ethiopia Hotel, Wabi Shebelle). Your guide can recommend the right one for your budget.",
      },
    ],
    visitorOnly: true,
  },
  {
    id: "in-ethiopia",
    heading: "In Ethiopia.",
    intro: "Money, connectivity and getting around once you are here.",
    items: [
      {
        title: "Currency",
        body: "Ethiopian Birr (ETB). USD cash is the most useful foreign currency. Euros and GBP work at banks. Exchange at Commercial Bank of Ethiopia or Dashen Bank for the best rates. Banking hours: Monday–Friday 8am–5pm, Saturday 8am–11am. Most banks operate during lunchtime, but foreign exchange closes 12pm–1pm.",
      },
      {
        title: "Cash vs cards",
        body: "Cash is essential outside Addis. Most guesthouses, restaurants and sites in Lalibela, Gondar and the Omo Valley are cash only. ATMs exist in major towns but run out on weekends and around festivals. Bring enough birr from Addis. MasterCard and Diners Club are accepted on a very limited basis — only at five-star hotels in Addis. Check with your provider before relying on cards.",
      },
      {
        title: "Money transfer",
        body: "Western Union and MoneyGram transfers are available at many national and private banks. Courier services (DHL, FedEx, UPS, TNT, EMS) are located in Addis Ababa if needed.",
      },
      {
        title: "Power and connectivity",
        body: "Ethiopia uses 220 volts, 50Hz AC electricity — bring a universal adapter. Country dialling code: +251. Internet domain: .et. Ethio Telecom is the main provider. Buy a SIM at the airport (passport required for registration). 4G works in Addis and along main roads. Simien Mountains: patchy. Danakil: nothing.",
      },
      {
        title: "Domestic transport",
        body: "Ethiopian Airlines operates most domestic routes. Book early — Lalibela and Gondar routes sell out. Long-distance buses are good value but slow (12+ hours to Lalibela by road vs 1hr 15min by air). Our tours include domestic flights where the road journey would be unreasonable.",
      },
      {
        title: "In-city transport",
        body: "Addis: ride-hailing apps (Ride, ZayRide) are cheap and reliable. Blue minibuses cover all routes. Bajaj (auto-rickshaws) for short hops in smaller towns. In Lalibela and Gondar, everything is within walking distance or a short bajaj ride.",
      },
    ],
  },
  {
    id: "day-to-day",
    heading: "Day to day.",
    intro: "What a day actually looks like, and what to bring.",
    items: [
      {
        title: "Altitude",
        body: "Addis Ababa is at 2,355m — the third-highest capital city in the world. Lalibela is at 2,630m. The Simien Mountains reach 4,543m. Drink water, go slow on day one, avoid alcohol on arrival night. Danakil is at or below sea level — extreme heat is the risk, not altitude.",
      },
      {
        title: "Food and water",
        body: "Tap water is not safe to drink outside Addis. Bottled water is cheap everywhere. Injera (fermented teff flatbread) and wot (stew) are the staples. Vegetarian options are widely available because of Orthodox fasting culture (no meat, no dairy on fasting days). Meat is halal in most restaurants. Stick to cooked food.",
      },
      {
        title: "Clothing",
        body: "Light to moderate clothing for most of the country. In higher altitudes — Simien, Bale, Lalibela at dawn — woollen garments or a coat are necessary, especially at night. A raincoat is advisable if visiting February to October. Laundry services are available at or near hotels, often 24-hour service.",
      },
      {
        title: "Health kit",
        body: "Bring: ibuprofen (altitude headaches), oral rehydration salts, antihistamine, water purification tablets as backup, antiseptic, any prescription medication you take (Ethiopia may not stock your brand). A basic first aid kit for trekking. Imodium is useful for Danakil days.",
      },
      {
        title: "Time zone and clock",
        body: "Ethiopia is GMT+3 year-round. Ethiopia also uses a 12-hour clock that starts at 6am (their '1 o'clock morning' is 7am in international time). Your guide uses 24-hour Gregorian time with you — but if a local says '3 o'clock' they may mean 9am. The Ethiopian calendar (Julian) runs 7–8 years behind the Gregorian calendar.",
      },
    ],
  },
  {
    id: "emergency",
    heading: "If something goes wrong.",
    intro: "Numbers and contacts to have on your phone before you leave Addis.",
    items: [
      {
        title: "Your guide",
        body: "For anything on the road — illness, lost item, missed connection — call your guide first. This is the fastest path to a solution. WhatsApp: +251 903 18 2009.",
      },
      {
        title: "Tourist police",
        body: "Addis Ababa tourist police: +251 11 551 7788. They speak English and cover most tourist areas. For serious incidents, your embassy is the next call.",
      },
      {
        title: "Medical care in Addis",
        body: "Government hospitals: St. Paul's Hospital and Tikur Anbessa (Black Lion). Private hospitals with English-speaking staff used by expats and embassies: Hayat Hospital, MCM Hospital, Kadisco General Hospital. Your travel insurance should cover any of these.",
      },
      {
        title: "Outside Addis",
        body: "Medical facilities outside Addis range from adequate (Gondar, Bahir Dar, Lalibela towns) to minimal (Danakil, Omo Valley). For anything serious in a remote area, the goal is evacuation to Addis. This is why travel insurance with air evacuation cover is not optional.",
      },
    ],
  },
];

interface TravelerInfoPageProps {
  audience: AudienceMode;
}

export function TravelerInfoPage({ audience }: TravelerInfoPageProps) {
  const { meta } = siteContent;
  const isMobile = useIsMobile();
  const [openSection, setOpenSection] = useState<string>("before");

  const visibleSections =
    audience === "local" ? SECTIONS.filter((s) => !s.visitorOnly) : SECTIONS;

  useSeo({
    title: `Before You Fly — ${meta.title}`,
    description:
      "Visa, vaccinations, airports, money, altitude and emergency contacts. Everything worth knowing before your trip to Ethiopia.",
    canonical: "/traveler-info",
  });

  return (
    <>
      {/* ── Masthead ── */}
      <PageHero
        imgSrc="/media/regions/Bale-Mountains-Ethiopia-Tour-Travel-Package-480.webp"
        imgAlt="Bale Mountains National Park, Ethiopian highlands plateau"
        gradientDir="down"
        darkness={0.78}
        imgPosition="center 40%"
      >
        <HeroLabel>Before You Fly</HeroLabel>
        <HeroHeadline>
          {visibleSections.length} things worth knowing.
        </HeroHeadline>
        <HeroSub>
          {audience === "local"
            ? "ጉዞ ከመጀመርዎ በፊት የሚያስፈልጉ ዝርዝሮች — ገንዘብ፣ ትራንስፖርት፣ አደጋ ጊዜ ቁጥሮች።" /* TODO-REVIEW */
            : "Practical information organised into sections. Everything from visa to altitude to what to do if something goes wrong."}
        </HeroSub>
      </PageHero>

      {/* ── Two-column layout: nav + content ── */}
      <section
        style={{
          backgroundColor: "var(--paper)",
          padding: "0 clamp(24px, 6vw, 80px) clamp(80px, 10vh, 120px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "clamp(180px, 20vw, 240px) 1fr",
            gap: "clamp(32px, 5vw, 72px)",
            alignItems: "start",
          }}
        >
          {/* Sticky nav */}
          <nav
            aria-label="Section navigation"
            style={{
              position: "sticky",
              top: 88,
              paddingTop: "clamp(32px, 4vh, 48px)",
            }}
          >
            <ul
              role="list"
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {visibleSections.map((section) => {
                const isOpen = openSection === section.id;
                return (
                  <li key={section.id}>
                    <button
                      onClick={() => setOpenSection(section.id)}
                      aria-pressed={isOpen}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        fontFamily: isOpen
                          ? "var(--font-display)"
                          : "var(--font-body)",
                        fontVariationSettings: isOpen
                          ? '"opsz" 18, "wght" 500'
                          : '"opsz" 14',
                        fontStyle: isOpen ? "italic" : "normal",
                        fontSize: "clamp(0.9rem, 1.3vw, 1.1rem)",
                        color: isOpen ? "var(--ink)" : "var(--ink)",
                        opacity: isOpen ? 1 : 0.4,
                        background: "none",
                        border: "none",
                        borderLeft: `2px solid ${isOpen ? "var(--ochre)" : "transparent"}`,
                        paddingLeft: 14,
                        paddingTop: 8,
                        paddingBottom: 8,
                        cursor: "none",
                        lineHeight: 1.3,
                        transition: `opacity ${DURATION.micro}s ease, border-color ${DURATION.micro}s ease`,
                      }}
                    >
                      {section.heading}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Bottom CTA */}
            <div
              style={{
                marginTop: 36,
                paddingTop: 24,
                borderTop: "1px solid rgba(18,17,16,0.1)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--ink)",
                  opacity: 0.5,
                  lineHeight: 1.65,
                  marginBottom: 14,
                }}
              >
                Questions we have not answered?
              </p>
              <Link
                to="/plan"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--ochre)",
                  textDecoration: "none",
                  cursor: "none",
                }}
              >
                Ask us directly →
              </Link>
            </div>
          </nav>

          {/* Content */}
          <div style={{ paddingTop: "clamp(32px, 4vh, 48px)" }}>
            {visibleSections.map((section) => {
              const isOpen = openSection === section.id;
              return (
                <div key={section.id} style={{ marginBottom: 2 }}>
                  {/* Section header — clickable */}
                  <button
                    onClick={() => setOpenSection(isOpen ? "" : section.id)}
                    aria-expanded={isOpen}
                    aria-controls={`section-${section.id}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      padding: "clamp(20px, 3vh, 28px) 0",
                      background: "none",
                      border: "none",
                      borderTop: "1px solid rgba(18,17,16,0.08)",
                      cursor: "none",
                      textAlign: "left",
                      gap: 16,
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          fontFamily: "var(--font-display)",
                          fontVariationSettings: '"opsz" 32, "wght" 600',
                          fontSize: "clamp(1.3rem, 2.2vw, 2rem)",
                          color: "var(--ink)",
                          lineHeight: 1.1,
                          letterSpacing: "-0.015em",
                          margin: 0,
                          marginBottom: 4,
                        }}
                      >
                        {section.heading}
                      </h2>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          color: "var(--ink)",
                          opacity: 0.45,
                          margin: 0,
                        }}
                      >
                        {section.items.length} items
                      </p>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: DURATION.micro }}
                      style={{
                        color: "var(--ochre)",
                        fontSize: 24,
                        flexShrink: 0,
                        lineHeight: 1,
                      }}
                      aria-hidden="true"
                    >
                      +
                    </motion.span>
                  </button>

                  {/* Accordion content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`section-${section.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: DURATION.ui,
                          ease: [...EASE_FM.outCubic],
                        }}
                        style={{ overflow: "hidden" }}
                      >
                        {/* Section intro */}
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "clamp(13px, 1.2vw, 16px)",
                            color: "var(--ink)",
                            opacity: 0.65,
                            lineHeight: 1.75,
                            marginBottom: 24,
                            paddingTop: 4,
                            borderLeft: "2px solid var(--ochre)",
                            paddingLeft: 16,
                          }}
                        >
                          {section.intro}
                        </p>

                        {/* Items */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0,
                            marginBottom: "clamp(24px, 3vh, 36px)",
                          }}
                        >
                          {section.items.map((item, i) => (
                            <motion.div
                              key={item.title}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: DURATION.ui,
                                delay: i * 0.05,
                                ease: [...EASE_FM.outExpo],
                              }}
                              style={{
                                paddingTop: "clamp(16px, 2vh, 22px)",
                                paddingBottom: "clamp(16px, 2vh, 22px)",
                                borderBottom: "1px solid rgba(18,17,16,0.06)",
                                display: "grid",
                                gridTemplateColumns:
                                  "clamp(120px, 18vw, 180px) 1fr",
                                gap: "clamp(12px, 2vw, 24px)",
                                alignItems: "start",
                              }}
                            >
                              <h3
                                style={{
                                  fontFamily: "var(--font-body)",
                                  fontSize: 12,
                                  letterSpacing: "0.06em",
                                  fontWeight: 600,
                                  color: "var(--ink)",
                                  opacity: 0.7,
                                  paddingTop: 3,
                                  margin: 0,
                                }}
                              >
                                {item.title}
                              </h3>
                              <div>
                                <p
                                  style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "clamp(13px, 1.1vw, 15px)",
                                    color: "var(--ink)",
                                    opacity: 0.75,
                                    lineHeight: 1.75,
                                    margin: 0,
                                    marginBottom: item.link ? 10 : 0,
                                  }}
                                >
                                  {item.body}
                                </p>
                                {item.link && (
                                  <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: "inline-block",
                                      fontFamily: "var(--font-body)",
                                      fontSize: 11,
                                      letterSpacing: "0.1em",
                                      textTransform: "uppercase",
                                      color: "var(--ochre)",
                                      textDecoration: "none",
                                      borderBottom: "1px solid var(--ochre)",
                                      paddingBottom: 1,
                                      cursor: "none",
                                      transition: `opacity ${DURATION.micro}s ease`,
                                    }}
                                    onMouseEnter={(e) =>
                                      ((
                                        e.currentTarget as HTMLElement
                                      ).style.opacity = "0.7")
                                    }
                                    onMouseLeave={(e) =>
                                      ((
                                        e.currentTarget as HTMLElement
                                      ).style.opacity = "1")
                                    }
                                  >
                                    {item.linkLabel ?? item.link} →
                                  </a>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

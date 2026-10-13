import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { festivals } from "@/data/festivals";
import { ETHIOPIAN_MONTHS } from "@/lib/ethiopianCalendar";
import { tours } from "@/data/tours";
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
import { Link } from "react-router-dom";

/**
 * WhenToGoPage — a real planning guide, not just a calendar scrubber.
 *
 * Structure:
 * 1. Intro — why timing matters in Ethiopia specifically
 * 2. Quick-reference bar — 13 months, colour-coded by season
 * 3. Selected month detail — weather, festivals, tours running, booking note
 * 4. Festival calendar — all major events with Gregorian dates
 * 5. Bottom CTA — plan your trip
 */

// Month data: Gregorian equivalent, weather, what's good
const MONTH_GUIDE: Record<
  number,
  {
    gregorian: string;
    weather: string;
    good: string[];
    avoid?: string;
    season: "dry" | "short-rains" | "rains" | "post-rains";
    bookingAdvice?: string;
  }
> = {
  1: {
    gregorian: "Sep 11 – Oct 10",
    season: "dry",
    weather: "Warm days, cool nights. Green landscape just after the rains.",
    good: [
      "Festivals (Enkutatash, Meskel, Irreecha)",
      "Photography — green hills, clear air",
      "Addis Ababa city tours",
    ],
    bookingAdvice: "Meskel Square on Sep 26: book hotel 4+ weeks ahead.",
  },
  2: {
    gregorian: "Oct 11 – Nov 9",
    season: "dry",
    weather: "Dry, warm, clear. One of the best months across the country.",
    good: [
      "Simien Mountains trekking",
      "Lalibela churches (quiet season)",
      "Omo Valley — roads passable",
    ],
    bookingAdvice: "Ideal shoulder season — good availability.",
  },
  3: {
    gregorian: "Nov 10 – Dec 9",
    season: "dry",
    weather: "Cool and dry in the highlands. Hot in the lowlands.",
    good: [
      "Coffee harvest in Kaffa and Yirgacheffe",
      "Bale Mountains — wolves most active",
      "Northern circuit",
    ],
    bookingAdvice: "Coffee harvest visits: contact farms directly in advance.",
  },
  4: {
    gregorian: "Dec 10 – Jan 8",
    season: "dry",
    weather: "Cool at altitude. Cold nights in Simien and Bale.",
    good: [
      "Genna (Ethiopian Christmas, Jan 7)",
      "Simien — clear skies, best views",
      "All highland treks",
    ],
    bookingAdvice:
      "Genna is quiet. Timkat (Jan 19) follows — book hotels early for Lalibela.",
  },
  5: {
    gregorian: "Jan 9 – Feb 7",
    season: "dry",
    weather: "Cold nights at altitude. Warm days. Very clear.",
    good: [
      "Timkat (Jan 19) — Lalibela fills up",
      "Gondar Timkat processions",
      "Best month for Danakil (Nov–Mar window)",
    ],
    bookingAdvice:
      "Timkat in Lalibela: book hotel by November. Gondar is easier to access.",
  },
  6: {
    gregorian: "Feb 8 – Mar 9",
    season: "dry",
    weather: "Warming up. Still dry. Excellent light for photography.",
    good: [
      "Simien and Bale trekking",
      "Northern historical circuit",
      "Danakil (last reliable month)",
    ],
    bookingAdvice:
      "Last good month for Danakil — heat builds sharply from March.",
  },
  7: {
    gregorian: "Mar 10 – Apr 8",
    season: "short-rains",
    weather: "Short rains begin (Belg). Intermittent, often afternoons.",
    good: [
      "Southern Ethiopia — Omo is still accessible",
      "Lower prices",
      "Addis city tours",
    ],
    avoid: "Danakil becomes dangerous from this month.",
    bookingAdvice: "Rates drop 10–20% outside peak.",
  },
  8: {
    gregorian: "Apr 9 – May 8",
    season: "short-rains",
    weather: "Belg rains continue. Some highland roads muddy.",
    good: [
      "Fasika (Ethiopian Easter, April) — a quiet, meaningful celebration",
      "Coffee origin visits in south",
    ],
    avoid: "Simien and Bale road access can be affected.",
  },
  9: {
    gregorian: "May 9 – Jun 7",
    season: "short-rains",
    weather: "Rains increasing. Hot in lowlands.",
    good: ["Addis city tours", "Cultural and coffee day trips"],
    avoid: "Omo Valley road access deteriorating.",
  },
  10: {
    gregorian: "Jun 8 – Jul 7",
    season: "rains",
    weather: "Main rains (Kiremt). Heaviest in the highlands.",
    good: ["Green landscape photography from Addis", "Short Addis day trips"],
    avoid:
      "Simien roads close. Omo Valley unreachable by 4WD. Danakil does not run.",
  },
  11: {
    gregorian: "Jul 8 – Aug 6",
    season: "rains",
    weather: "Still raining. Waterfalls full. Dramatic cloud formations.",
    good: [
      "Addis itself (functional year-round)",
      "Blue Nile Falls — highest flow",
    ],
    avoid: "Most trekking destinations inaccessible.",
  },
  12: {
    gregorian: "Aug 7 – Sep 5",
    season: "post-rains",
    weather: "Rains easing in the south. Still heavy in north.",
    good: [
      "Preparation month — plan your Sep–Mar trip",
      "Addis and surroundings",
    ],
    bookingAdvice: "Start planning now for peak season September–March.",
  },
  13: {
    gregorian: "Sep 6 – Sep 10/11",
    season: "post-rains",
    weather: "Pagumē — the 13th month, 5 or 6 days long. Country drying out.",
    good: ["Final days before the new year", "Addis"],
    bookingAdvice:
      "Enkutatash (New Year) begins right after — book hotels now.",
  },
};

const SEASON_COLORS: Record<string, string> = {
  dry: "var(--ochre)",
  "short-rains": "var(--highland)",
  rains: "var(--indigo)",
  "post-rains": "var(--sulphur)",
};

export function WhenToGoPage() {
  const { meta } = siteContent;
  const isMobile = useIsMobile();
  const [selectedMonth, setSelectedMonth] = useState(1);
  const guide = MONTH_GUIDE[selectedMonth];
  const monthFestivals = festivals.filter(
    (f) => f.ethiopianMonth === selectedMonth,
  );

  // Tours that run in the selected month's season
  const relevantTours = tours
    .filter((t) => {
      if (!t.bestSeason) return false;
      const s = t.bestSeason.toLowerCase();
      if (guide.season === "rains") return false; // nothing runs in main rains
      if (guide.season === "dry")
        return (
          !s.includes("avoid") &&
          (s.includes("oct") ||
            s.includes("nov") ||
            s.includes("dec") ||
            s.includes("jan") ||
            s.includes("feb") ||
            s.includes("mar") ||
            s.includes("year-round"))
        );
      return s.includes("year-round");
    })
    .slice(0, 3);

  useSeo({
    title: `When to Go — ${meta.title}`,
    description:
      "Month-by-month guide to visiting Ethiopia. Festivals, weather, which tours run when, and honest booking advice for every season.",
    canonical: "/when-to-go",
  });

  return (
    <>
      {/* ── Page intro ── */}
      <PageHero
        imgSrc="/media/regions/Erta-Ale-Volcano-Ethiopia-Tours-and-Holiday-Packages-480.webp"
        imgAlt="Erta Ale lava lake at night, Afar region, Danakil Depression"
        gradientDir="down"
        darkness={0.82}
        imgPosition="center 50%"
      >
        <HeroLabel>When to Go</HeroLabel>
        <HeroHeadline>
          Thirteen months. The right one changes everything.
        </HeroHeadline>
        <HeroSub>
          Ethiopia runs on a different calendar. Thirteen months, Enkutatash in
          September, Timkat in January. Lalibela has 11 months of quiet and one
          month — mid-January — where every guesthouse is full and the rooftops
          are sleeping pilgrims.
        </HeroSub>
      </PageHero>

      {/* ── 13-month selector bar ── */}
      <section
        style={{
          backgroundColor: "var(--ink)",
          padding: "clamp(28px, 4vh, 40px) clamp(24px, 6vw, 80px)",
        }}
      >
        <div
          style={{
            marginBottom: 12,
            fontFamily: "var(--font-body)",
            fontSize: 9,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--paper)",
            opacity: 0.4,
          }}
        >
          Select a month — Ethiopian calendar
        </div>
        <div
          role="group"
          aria-label="Ethiopian months"
          style={{ display: "flex", flexWrap: "wrap", gap: 2 }}
        >
          {ETHIOPIAN_MONTHS.map((name, i) => {
            const monthNum = i + 1;
            const g = MONTH_GUIDE[monthNum];
            const isSelected = selectedMonth === monthNum;
            const hasFestival = festivals.some(
              (f) => f.ethiopianMonth === monthNum,
            );

            return (
              <button
                key={name}
                onClick={() => setSelectedMonth(monthNum)}
                aria-pressed={isSelected}
                aria-label={`${name} — ${g?.gregorian ?? ""}`}
                style={{
                  position: "relative",
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  padding: "8px clamp(10px, 1.2vw, 16px)",
                  background: isSelected
                    ? SEASON_COLORS[g?.season ?? "dry"]
                    : "transparent",
                  color: isSelected ? "var(--ink)" : "var(--paper)",
                  border: "none",
                  cursor: "none",
                  opacity: isSelected ? 1 : 0.55,
                  transition: `background-color ${DURATION.micro}s ease, opacity ${DURATION.micro}s ease`,
                  flexShrink: 0,
                }}
              >
                {name}
                {hasFestival && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      backgroundColor: "var(--ochre)",
                      opacity: isSelected ? 0 : 0.8,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Season legend */}
        <div
          style={{
            marginTop: 14,
            display: "flex",
            flexWrap: "wrap",
            gap: "6px 20px",
          }}
        >
          {Object.entries({
            "Dry season": "dry",
            "Short rains": "short-rains",
            "Main rains": "rains",
            Transition: "post-rains",
          }).map(([label, key]) => (
            <div
              key={key}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: SEASON_COLORS[key],
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--paper)",
                  opacity: 0.4,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Selected month detail ── */}
      <AnimatePresence mode="wait">
        {guide && (
          <motion.section
            key={selectedMonth}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.ui, ease: [...EASE_FM.outExpo] }}
            style={{
              backgroundColor: "var(--paper)",
              padding: "clamp(48px, 6vh, 72px) clamp(24px, 6vw, 80px)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "1fr clamp(260px, 32vw, 400px)",
                gap: "clamp(40px, 6vw, 80px)",
                alignItems: "start",
              }}
            >
              {/* Left: weather + what's good */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 16,
                    marginBottom: 20,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontVariationSettings: '"opsz" 72, "wght" 700',
                      fontSize: "clamp(2rem, 5vw, 5rem)",
                      color: "var(--ink)",
                      lineHeight: 1.0,
                      letterSpacing: "-0.025em",
                      margin: 0,
                    }}
                  >
                    {ETHIOPIAN_MONTHS[selectedMonth - 1]}
                  </h2>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(12px, 1vw, 14px)",
                      color: "var(--ink)",
                      opacity: 0.4,
                    }}
                  >
                    {guide.gregorian}
                  </span>
                </div>

                {/* Season badge */}
                <div
                  style={{
                    display: "inline-block",
                    backgroundColor: SEASON_COLORS[guide.season],
                    color: "var(--ink)",
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    padding: "4px 12px",
                    marginBottom: 20,
                  }}
                >
                  {guide.season.replace("-", " ")}
                </div>

                {/* Weather */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(14px, 1.3vw, 16px)",
                    color: "var(--ink)",
                    opacity: 0.75,
                    lineHeight: 1.7,
                    marginBottom: 24,
                    borderLeft: "2px solid var(--ochre)",
                    paddingLeft: 16,
                  }}
                >
                  {guide.weather}
                </p>

                {/* What's good */}
                <div style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 9,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "var(--ochre)",
                      marginBottom: 12,
                    }}
                  >
                    Good for
                  </div>
                  <ul
                    role="list"
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {guide.good.map((item) => (
                      <li
                        key={item}
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "flex-start",
                        }}
                      >
                        <span
                          style={{
                            width: 14,
                            height: 1,
                            backgroundColor: "var(--ochre)",
                            flexShrink: 0,
                            marginTop: 9,
                          }}
                          aria-hidden="true"
                        />
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 14,
                            color: "var(--ink)",
                            opacity: 0.75,
                            lineHeight: 1.55,
                          }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Avoid */}
                {guide.avoid && (
                  <div
                    style={{
                      marginBottom: 24,
                      padding: "12px 16px",
                      borderLeft: "2px solid var(--sulphur)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 9,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--sulphur)",
                        marginBottom: 6,
                      }}
                    >
                      Worth knowing
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--ink)",
                        opacity: 0.7,
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {guide.avoid}
                    </p>
                  </div>
                )}

                {/* Booking advice */}
                {guide.bookingAdvice && (
                  <div
                    style={{
                      backgroundColor: "var(--indigo)",
                      padding: "16px 20px",
                      display: "flex",
                      gap: 12,
                    }}
                  >
                    <span
                      style={{
                        color: "var(--ochre)",
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      →
                    </span>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--paper)",
                        opacity: 0.85,
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {guide.bookingAdvice}
                    </p>
                  </div>
                )}
              </div>

              {/* Right: festivals this month + tours running */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 32 }}
              >
                {/* Festivals */}
                {monthFestivals.length > 0 && (
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 9,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "var(--ochre)",
                        marginBottom: 14,
                      }}
                    >
                      Festivals this month
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                      }}
                    >
                      {monthFestivals.map((f) => (
                        <div
                          key={f.id}
                          style={{
                            borderLeft: "2px solid var(--ochre)",
                            paddingLeft: 14,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: 8,
                              marginBottom: 4,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "var(--font-display)",
                                fontVariationSettings: '"opsz" 18, "wght" 600',
                                fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
                                color: "var(--ink)",
                              }}
                            >
                              {f.name}
                            </span>
                            <span
                              className="geez"
                              style={{
                                fontFamily: "var(--font-geez)",
                                fontSize: "0.85rem",
                                color: "var(--ochre)",
                                opacity: 0.7,
                              }}
                            >
                              {f.amharicName}
                              {/* TODO-REVIEW */}
                            </span>
                          </div>
                          <div
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 11,
                              color: "var(--sulphur)",
                              marginBottom: 6,
                            }}
                          >
                            {f.gregorianApprox}
                          </div>
                          <p
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 12,
                              color: "var(--ink)",
                              opacity: 0.65,
                              lineHeight: 1.6,
                              margin: 0,
                            }}
                          >
                            {f.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {monthFestivals.length === 0 && (
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 9,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "var(--ochre)",
                        marginBottom: 10,
                      }}
                    >
                      Festivals
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--ink)",
                        opacity: 0.4,
                        fontStyle: "italic",
                      }}
                    >
                      No major festivals this month. Good for moving quietly.
                    </p>
                  </div>
                )}

                {/* Tours running */}
                {relevantTours.length > 0 && (
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 9,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "var(--ochre)",
                        marginBottom: 14,
                      }}
                    >
                      Tours running this season
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      {relevantTours.map((t) => (
                        <Link
                          key={t.id}
                          to={`/tours/${t.slug ?? t.id}`}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 0",
                            borderBottom: "1px solid rgba(18,17,16,0.08)",
                            textDecoration: "none",
                            cursor: "none",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 13,
                              color: "var(--ink)",
                              opacity: 0.75,
                            }}
                          >
                            {t.name}
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 11,
                              color: "var(--ochre)",
                              flexShrink: 0,
                              marginLeft: 8,
                            }}
                          >
                            {t.duration}d →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {guide.season === "rains" && (
                  <div
                    style={{
                      backgroundColor: "var(--indigo)",
                      padding: "16px 20px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--paper)",
                        opacity: 0.75,
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      Main rain season. Most highland treks are off. Good time
                      to plan — we are available to build an itinerary for the
                      dry season ahead.
                    </p>
                    <Link
                      to="/plan"
                      style={{
                        display: "inline-block",
                        marginTop: 12,
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--ochre)",
                        textDecoration: "none",
                        cursor: "none",
                      }}
                    >
                      Start planning →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Full festival calendar ── */}
      <section
        style={{
          backgroundColor: "var(--indigo)",
          padding: "clamp(56px, 7vh, 80px) clamp(24px, 6vw, 80px)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontVariationSettings: '"opsz" 48, "wght" 600',
            fontSize: "clamp(1.8rem, 3.5vw, 3.5rem)",
            color: "var(--paper)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: "clamp(32px, 4vh, 48px)",
          }}
        >
          Major festivals — all years.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(clamp(260px, 30vw, 340px), 1fr))",
            gap: "clamp(2px, 0.3vw, 4px)",
          }}
        >
          {festivals
            .filter((f) => f.significance === "major")
            .map((f) => (
              <div
                key={f.id}
                style={{
                  backgroundColor: "rgba(241,234,217,0.05)",
                  padding: "clamp(20px, 2.5vw, 28px)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontVariationSettings: '"opsz" 18, "wght" 600',
                      fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
                      color: "var(--paper)",
                    }}
                  >
                    {f.name}
                  </span>
                  <span
                    className="geez"
                    style={{
                      fontFamily: "var(--font-geez)",
                      fontSize: "0.85rem",
                      color: "var(--ochre)",
                      opacity: 0.7,
                    }}
                  >
                    {f.amharicName}
                    {/* TODO-REVIEW */}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--sulphur)",
                    marginBottom: 8,
                  }}
                >
                  {f.gregorianApprox}
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--paper)",
                    opacity: 0.65,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {f.description}
                </p>
              </div>
            ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        style={{
          backgroundColor: "var(--paper)",
          padding: "clamp(56px, 7vh, 80px) clamp(24px, 6vw, 80px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 48, "wght" 600',
              fontSize: "clamp(1.6rem, 3vw, 3rem)",
              color: "var(--ink)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: 10,
            }}
          >
            Know your month. Tell us the dates.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1.1vw, 15px)",
              color: "var(--ink)",
              opacity: 0.6,
              maxWidth: 480,
              lineHeight: 1.7,
            }}
          >
            We will build a route around the season, the festivals and what you
            want to see.
          </p>
        </div>
        <Link
          to="/plan"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--paper)",
            backgroundColor: "var(--ink)",
            padding: "14px 28px",
            textDecoration: "none",
            cursor: "none",
            display: "inline-block",
            transition: `background-color ${DURATION.micro}s ease`,
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor =
              "var(--ochre)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor =
              "var(--ink)")
          }
        >
          Plan your trip →
        </Link>
      </section>
    </>
  );
}

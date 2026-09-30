import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { festivals, seasonBands } from "@/data/festivals";
import {
  ETHIOPIAN_MONTHS,
  currentEthiopianMonth,
} from "@/lib/ethiopianCalendar";
import { siteContent } from "@/data/content";
import { DURATION, EASE_FM } from "@/lib/motion";

/**
 * When to Go — Ethiopian calendar month scrubber.
 *
 * Layout: asymmetric — month strip on left (vertical on desktop), content on right.
 * The current Ethiopian month is highlighted on load.
 * Festivals and season bands are shown for the selected month.
 */
export function WhenToGo() {
  const currentMonth = currentEthiopianMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const { whenToGo } = siteContent;

  const monthFestivals = festivals.filter(
    (f) => f.ethiopianMonth === selectedMonth,
  );
  const monthBands = seasonBands.filter((b) =>
    b.ethiopianMonths.includes(selectedMonth),
  );

  const monthName = ETHIOPIAN_MONTHS[selectedMonth - 1];

  return (
    <section
      id="when-to-go"
      role="region"
      aria-label="When to visit Ethiopia — Ethiopian calendar"
      style={{
        backgroundColor: "var(--indigo)",
        padding: "clamp(80px, 10vh, 140px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Ge'ez decorator */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          right: "-4%",
          fontFamily: "var(--font-geez)",
          fontSize: "clamp(200px, 35vw, 500px)",
          lineHeight: 1,
          color: "var(--paper)",
          opacity: 0.03,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {whenToGo.geezDecorator} {/* TODO-REVIEW */}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "clamp(24px, 5vw, 60px) 1fr",
          gap: 0,
          padding: "0 clamp(24px, 6vw, 80px)",
          marginBottom: "clamp(40px, 5vh, 72px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            writingMode: "vertical-rl",
            fontFamily: "var(--font-body)",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--ochre)",
            alignSelf: "start",
            paddingTop: 4,
          }}
        >
          {whenToGo.sectionLabel}
        </div>
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 72, "wght" 600',
              fontSize: "clamp(2.5rem, 6vw, 7rem)",
              color: "var(--paper)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              marginBottom: 16,
            }}
          >
            {whenToGo.headline}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1.2vw, 15px)",
              color: "var(--paper)",
              opacity: 0.6,
              maxWidth: 540,
              lineHeight: 1.7,
            }}
          >
            {whenToGo.subline}
          </p>
        </div>
      </div>

      {/* Main layout: month scrubber + content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "clamp(160px, 22vw, 260px) 1fr",
          gap: 0,
          padding: "0 clamp(24px, 6vw, 80px)",
          position: "relative",
          zIndex: 1,
          alignItems: "start",
        }}
      >
        {/* Month list (scrubber) */}
        <nav aria-label="Select Ethiopian month">
          <ol
            role="list"
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              borderLeft: "1px solid rgba(241,234,217,0.1)",
            }}
          >
            {ETHIOPIAN_MONTHS.map((name, i) => {
              const monthNum = i + 1;
              const isSelected = monthNum === selectedMonth;
              const isCurrent = monthNum === currentMonth;
              const hasFestival = festivals.some(
                (f) => f.ethiopianMonth === monthNum,
              );

              return (
                <li key={name}>
                  <button
                    role="tab"
                    aria-selected={isSelected}
                    aria-label={`${name}${isCurrent ? " (current month)" : ""}${hasFestival ? " — has festival" : ""}`}
                    onClick={() => setSelectedMonth(monthNum)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      width: "100%",
                      padding: "10px 0 10px 20px",
                      background: "none",
                      border: "none",
                      cursor: "none",
                      textAlign: "left",
                      position: "relative",
                      borderLeft: isSelected
                        ? "2px solid var(--ochre)"
                        : "2px solid transparent",
                      marginLeft: -1,
                    }}
                  >
                    {/* Month number */}
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 9,
                        color: "var(--paper)",
                        opacity: 0.3,
                        minWidth: 16,
                      }}
                    >
                      {String(monthNum).padStart(2, "0")}
                    </span>
                    {/* Month name */}
                    <span
                      style={{
                        fontFamily: isSelected
                          ? "var(--font-display)"
                          : "var(--font-body)",
                        fontVariationSettings: isSelected
                          ? '"opsz" 18, "wght" 500'
                          : '"opsz" 14',
                        fontSize: isSelected
                          ? "clamp(14px, 1.3vw, 16px)"
                          : "clamp(12px, 1.1vw, 14px)",
                        color: isSelected ? "var(--paper)" : "var(--paper)",
                        opacity: isSelected ? 1 : 0.45,
                        transition: "all 0.25s ease",
                      }}
                    >
                      {name}
                    </span>
                    {/* Festival dot */}
                    {hasFestival && (
                      <span
                        aria-hidden="true"
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          backgroundColor: "var(--ochre)",
                          marginLeft: "auto",
                          marginRight: 8,
                          opacity: isSelected ? 1 : 0.5,
                        }}
                      />
                    )}
                    {/* "Now" marker */}
                    {isCurrent && (
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 8,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "var(--sulphur)",
                          marginLeft: hasFestival ? 0 : "auto",
                          marginRight: 8,
                          opacity: 0.9,
                        }}
                      >
                        Now
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Content panel */}
        <div
          style={{
            padding: "0 0 0 clamp(28px, 4vw, 64px)",
            borderLeft: "1px solid rgba(241,234,217,0.08)",
            minHeight: 400,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMonth}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                duration: DURATION.micro,
                ease: [...EASE_FM.outExpo],
              }}
            >
              {/* Month name + Gregorian equivalent */}
              <div style={{ marginBottom: 32 }}>
                <div
                  style={{
                    fontFamily: "var(--font-geez)",
                    fontSize: "clamp(3rem, 8vw, 10rem)",
                    color: "var(--paper)",
                    lineHeight: 1,
                    opacity: 0.12,
                    marginBottom: -16,
                    userSelect: "none",
                  }}
                  aria-hidden="true"
                >
                  {/* TODO-REVIEW */}
                  {ETHIOPIAN_MONTHS[selectedMonth - 1]}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontVariationSettings: '"opsz" 48, "wght" 600',
                    fontSize: "clamp(2rem, 4vw, 5rem)",
                    color: "var(--paper)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {monthName}
                  {selectedMonth === currentMonth && (
                    <span
                      style={{
                        marginLeft: 16,
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--sulphur)",
                        verticalAlign: "middle",
                        opacity: 0.9,
                      }}
                    >
                      ← {whenToGo.currentMonthLabel}
                    </span>
                  )}
                </h3>
              </div>

              {/* Season bands */}
              {monthBands.length > 0 && (
                <div style={{ marginBottom: 32 }}>
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
                    Conditions
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {monthBands.map((band) => (
                      <div
                        key={band.label}
                        style={{
                          display: "flex",
                          gap: 14,
                          alignItems: "flex-start",
                        }}
                      >
                        <SeasonIcon type={band.type} />
                        <div>
                          <div
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 13,
                              color: "var(--paper)",
                              marginBottom: 3,
                              fontWeight: 500,
                            }}
                          >
                            {band.label}
                          </div>
                          <div
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 12,
                              color: "var(--paper)",
                              opacity: 0.6,
                              lineHeight: 1.55,
                            }}
                          >
                            {band.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Festivals this month */}
              {monthFestivals.length > 0 && (
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 9,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "var(--ochre)",
                      marginBottom: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 1,
                        backgroundColor: "var(--ochre)",
                      }}
                    />
                    Festivals
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 20,
                    }}
                  >
                    {monthFestivals.map((festival) => (
                      <div
                        key={festival.id}
                        style={{
                          borderLeft: "2px solid var(--ochre)",
                          paddingLeft: 16,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: 10,
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-display)",
                              fontVariationSettings: '"opsz" 18, "wght" 600',
                              fontSize: "clamp(1rem, 1.8vw, 1.4rem)",
                              color: "var(--paper)",
                            }}
                          >
                            {festival.name}
                          </span>
                          <span
                            className="geez"
                            style={{
                              fontFamily: "var(--font-geez)",
                              fontSize: "0.9rem",
                              color: "var(--ochre)",
                              opacity: 0.8,
                            }}
                          >
                            {festival.amharicName} {/* TODO-REVIEW */}
                          </span>
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 11,
                            color: "var(--sulphur)",
                            letterSpacing: "0.06em",
                            marginBottom: 8,
                            opacity: 0.85,
                          }}
                        >
                          {festival.gregorianApprox}
                        </div>
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 13,
                            color: "var(--paper)",
                            opacity: 0.7,
                            lineHeight: 1.65,
                          }}
                        >
                          {festival.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {monthFestivals.length === 0 && monthBands.length === 0 && (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--paper)",
                    opacity: 0.4,
                    fontStyle: "italic",
                  }}
                >
                  A quiet month. Good for moving slowly.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function SeasonIcon({ type }: { type: string }) {
  const colors: Record<string, string> = {
    dry: "var(--sulphur)",
    rains: "var(--highland)",
    "short-rains": "var(--highland)",
    "peak-trek": "var(--ochre)",
    wildlife: "var(--ochre)",
  };
  const symbols: Record<string, string> = {
    dry: "○",
    rains: "●",
    "short-rains": "◑",
    "peak-trek": "△",
    wildlife: "◇",
  };
  return (
    <span
      style={{
        display: "block",
        width: 20,
        height: 20,
        flexShrink: 0,
        color: colors[type] ?? "var(--ochre)",
        fontSize: 16,
        lineHeight: "20px",
        textAlign: "center",
        marginTop: 1,
      }}
      aria-hidden="true"
    >
      {symbols[type] ?? "○"}
    </span>
  );
}

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { tours, featuredTourIds, type Tour } from "@/data/tours";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DURATION, EASE_FM, SCROLL } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Popular Tours — asymmetric horizontal rail.
 *
 * Layout: NOT a card grid. Each tour gets a tall "poster" strip of varying width.
 * The first poster is wider (feature slot). Odd ones are taller.
 * Duration shown large in Ge'ez numerals as the dominant typographic element.
 * Hover reveals: highlights list, difficulty, and a direct link to the live tour page.
 *
 * The rail scrolls horizontally on desktop, stacks vertically on mobile.
 * On desktop, GSAP pins the section and scrubs the rail on scroll.
 */

// Ge'ez numeral map for tour durations
const GEEZ_NUMERALS: Record<number, string> = {
  1: "፩",
  2: "፪",
  3: "፫",
  4: "፬",
  5: "፭",
  6: "፮",
  7: "፯",
  8: "፰",
  9: "፱",
  10: "፲",
  14: "፲፬",
  15: "፲፭",
}; /* TODO-REVIEW: Ge'ez numerals */

// Accent colors cycle per poster — alternating ochre / highland / indigo
const ACCENT_CYCLE = [
  "var(--ochre)",
  "var(--highland)",
  "var(--indigo)",
  "var(--sulphur)",
  "var(--ochre)",
  "var(--highland)",
  "var(--indigo)",
];

const featuredTours = featuredTourIds
  .map((id) => tours.find((t) => t.id === id))
  .filter((t): t is Tour => t !== null && t !== undefined);

export function PopularTours({
  audience: _audience,
}: {
  audience: import("@/sections/AudienceChooser").AudienceMode;
}) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || !railRef.current || !containerRef.current) return;
    // Only pin on desktop (≥768px)
    if (window.innerWidth < 768) return;

    const ctx = gsap.context(() => {
      const rail = railRef.current!;
      const scrollW = rail.scrollWidth - window.innerWidth;

      gsap.to(rail, {
        x: -scrollW,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${scrollW}`,
          scrub: SCROLL.horizontalScrubMin,
          pin: true,
          anticipatePin: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={containerRef}
      id="popular-tours"
      role="region"
      aria-label="Popular tours — Come to Ethiopia Tours"
      style={{ backgroundColor: "var(--ink)" }}
    >
      {/* Section header — visible before the rail begins */}
      <div
        style={{
          padding:
            "clamp(64px, 8vh, 100px) clamp(24px, 6vw, 80px) clamp(32px, 4vh, 48px)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--ochre)",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{ width: 32, height: 1, backgroundColor: "var(--ochre)" }}
            />
            Popular Tours
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 72, "wght" 600',
              fontSize: "clamp(2rem, 5vw, 6rem)",
              color: "var(--paper)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              margin: 0,
            }}
          >
            Trips that fit the country,
            <br />
            not a brochure.
          </h2>
        </div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(12px, 1.1vw, 14px)",
            color: "var(--paper)",
            opacity: 0.5,
            maxWidth: 320,
            lineHeight: 1.7,
          }}
        >
          Every tour is run by an experienced Ethiopian guide based in Addis
          Ababa. No package-tour middlemen.
        </p>
      </div>

      {/* Horizontal rail */}
      <div
        ref={railRef}
        role="list"
        aria-label="Tour posters — scroll to see more"
        style={{
          display: "flex",
          alignItems: "stretch",
          width: "max-content",
          height: "clamp(420px, 65vh, 640px)",
          paddingLeft: "clamp(24px, 6vw, 80px)",
          paddingBottom: "clamp(40px, 5vh, 64px)",
          gap: 3,
        }}
      >
        {featuredTours.map((tour, i) => (
          <TourPoster
            key={tour.id}
            tour={tour}
            index={i}
            accent={ACCENT_CYCLE[i % ACCENT_CYCLE.length]}
            featured={i === 0}
          />
        ))}

        {/* End cap: "All tours" link */}
        <a
          href="https://cometoethiopiatours.com/tours-holidays-in-ethiopia/"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-label="All tours"
          aria-label="View all tours on cometoethiopiatours.com"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            width: "clamp(120px, 14vw, 180px)",
            flexShrink: 0,
            padding: "0 clamp(16px, 2vw, 28px) clamp(20px, 3vh, 32px)",
            textDecoration: "none",
            borderLeft: "1px solid rgba(241,234,217,0.08)",
            cursor: "none",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 18, "wght" 400',
              fontStyle: "italic",
              fontSize: "clamp(0.9rem, 1.5vw, 1.2rem)",
              color: "var(--paper)",
              opacity: 0.5,
              lineHeight: 1.3,
              marginBottom: 12,
            }}
          >
            All tours →
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 9,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--ochre)",
              opacity: 0.7,
            }}
          >
            cometoethiopiatours.com
          </div>
        </a>
      </div>

      {/* Scroll cue for desktop */}
      <div
        aria-hidden="true"
        style={{
          padding: "0 clamp(24px, 6vw, 80px) clamp(28px, 4vh, 40px)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: 0.3,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--paper)",
          }}
        >
          Scroll to explore
        </span>
        <span
          style={{
            display: "block",
            width: 40,
            height: 1,
            backgroundColor: "var(--ochre)",
          }}
        />
      </div>
    </div>
  );
}

// ── Tour poster ──────────────────────────────────────────────────────────────

function TourPoster({
  tour,
  index,
  accent,
  featured,
}: {
  tour: Tour;
  index: number;
  accent: string;
  featured: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  // Alternate poster widths — feature slot is wider, odd ones slightly narrower
  const width = featured
    ? "clamp(260px, 32vw, 420px)"
    : index % 3 === 0
      ? "clamp(180px, 22vw, 280px)"
      : "clamp(200px, 25vw, 320px)";

  const geezNumeral = GEEZ_NUMERALS[tour.duration] ?? String(tour.duration);
  const dayLabel = tour.duration === 1 ? "day" : "days";

  return (
    <article
      role="listitem"
      aria-label={`${tour.name}, ${tour.duration} ${dayLabel}`}
      style={{
        position: "relative",
        width,
        flexShrink: 0,
        overflow: "hidden",
        cursor: "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background photo — real image from company site */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: hovered ? "scale(1.04)" : "scale(1)",
          overflow: "hidden",
        }}
      >
        <img
          src={`/media/tours/${tour.imageSlot.replace(/\.[^.]+$/, "")}-480.webp`}
          alt={tour.imageAlt}
          width={750}
          height={500}
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />
      </div>

      {/* Base gradient — bottom-up always visible */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(18,17,16,0.9) 0%, rgba(18,17,16,0.2) 55%, transparent 100%)",
          zIndex: 1,
        }}
      />

      {/* Hover overlay — clips in from bottom */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: hovered ? "0%" : "100%" }}
        transition={{ duration: DURATION.ui, ease: [...EASE_FM.outExpo] }}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: accent,
          opacity: 0.92,
          zIndex: 2,
        }}
        aria-hidden="true"
      />

      {/* Content — always above gradient */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "clamp(16px, 2vw, 24px)",
        }}
      >
        {/* Default state: duration numeral + name */}
        <AnimatePresence mode="wait">
          {!hovered ? (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.micro }}
            >
              {/* Ge'ez duration — dominant typographic element */}
              <div
                className="geez"
                aria-label={`${tour.duration} ${dayLabel}`}
                style={{
                  fontFamily: "var(--font-geez)",
                  fontSize: "clamp(3.5rem, 8vw, 7rem)",
                  lineHeight: 1,
                  color: accent,
                  marginBottom: 8,
                  fontWeight: 700,
                }}
              >
                {geezNumeral} {/* TODO-REVIEW */}
              </div>

              {/* Duration in numerals (screenreader already has it above) */}
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 9,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--paper)",
                  opacity: 0.5,
                  marginBottom: 10,
                }}
                aria-hidden="true"
              >
                {tour.duration} {dayLabel}
              </div>

              {/* Tour name */}
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontVariationSettings: '"opsz" 24, "wght" 500',
                  fontSize: "clamp(0.95rem, 1.6vw, 1.3rem)",
                  color: "var(--paper)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                  margin: 0,
                }}
              >
                {tour.name}
              </h3>
            </motion.div>
          ) : (
            <motion.div
              key="hover"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: DURATION.micro,
                delay: 0.1,
                ease: [...EASE_FM.outExpo],
              }}
            >
              {/* Difficulty badge */}
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                  opacity: 0.6,
                  marginBottom: 12,
                }}
              >
                {tour.duration} {dayLabel} · {tour.difficulty}
              </div>

              {/* Tour name on hover */}
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontVariationSettings: '"opsz" 24, "wght" 600',
                  fontSize: "clamp(1rem, 1.8vw, 1.4rem)",
                  color: "var(--ink)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  marginBottom: 14,
                }}
              >
                {tour.name}
              </h3>

              {/* Highlights — first 3 */}
              <ul
                role="list"
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {tour.highlights.slice(0, 3).map((h, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        width: 14,
                        height: 1,
                        backgroundColor: "var(--ink)",
                        flexShrink: 0,
                        marginTop: 8,
                        opacity: 0.5,
                      }}
                      aria-hidden="true"
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--ink)",
                        opacity: 0.85,
                        lineHeight: 1.5,
                      }}
                    >
                      {h}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA link to real tour page */}
              <a
                href={tour.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View full itinerary for ${tour.name} on cometoethiopiatours.com`}
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                  backgroundColor: "transparent",
                  border: "1px solid var(--ink)",
                  padding: "9px 16px",
                  textDecoration: "none",
                  cursor: "none",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor =
                    "rgba(18,17,16,0.12)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor =
                    "transparent")
                }
              >
                Full itinerary
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 4H10M7 1L10 4L7 7"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

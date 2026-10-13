import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { tours, type Tour } from "@/data/tours";
import { useSeo } from "@/hooks/useSeo";
import { siteContent } from "@/data/content";
import { DURATION, EASE_FM } from "@/lib/motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { AudienceMode } from "@/sections/AudienceChooser";
import type { Lang } from "@/App";

const INTERESTS = [
  { id: "all", label: "All" },
  { id: "history", label: "History" },
  { id: "trekking", label: "Trekking" },
  { id: "culture", label: "Culture" },
  { id: "coffee", label: "Coffee" },
  { id: "wildlife", label: "Wildlife" },
] as const;

const DURATIONS = [
  { id: "all", label: "Any length" },
  { id: "1", label: "Day trips" },
  { id: "3", label: "3–4 days" },
  { id: "5", label: "5–7 days" },
  { id: "10", label: "10+ days" },
] as const;

function matchesDuration(t: Tour, d: string): boolean {
  if (d === "all") return true;
  if (d === "1") return t.duration === 1;
  if (d === "3") return t.duration >= 3 && t.duration <= 4;
  if (d === "5") return t.duration >= 5 && t.duration <= 7;
  if (d === "10") return t.duration >= 10;
  return true;
}

interface ToursPageProps {
  audience: AudienceMode;
  lang: Lang;
}

export function ToursPage({ audience, lang: _lang }: ToursPageProps) {
  const { meta } = siteContent;
  const [interest, setInterest] = useState("all");
  const [duration, setDuration] = useState("all");

  useSeo({
    title: `Tours — ${meta.title}`,
    description:
      "Every tour Come to Ethiopia Tours runs — day trips, multi-day treks, historical circuits and expeditions. Filter by interest and length.",
    canonical: "/tours",
  });

  const filtered = tours.filter(
    (t) =>
      (interest === "all" || t.interests.includes(interest)) &&
      matchesDuration(t, duration),
  );

  const sorted =
    audience === "local"
      ? [...filtered].sort((a, b) => a.duration - b.duration)
      : filtered;

  return (
    <>
      {/* ── Page header — full-bleed photo ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "clamp(320px, 42vh, 520px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding:
            "clamp(120px, 18vh, 180px) clamp(24px, 6vw, 80px) clamp(40px, 5vh, 60px)",
        }}
      >
        {/* Background photo — Omo Valley tribal portrait, southern Ethiopia */}
        <img
          src="/media/regions/Omo-Valley-Tribe-Ethiopia-Tour-Travel-Package-480.webp"
          alt="Omo Valley tribal portrait, southern Ethiopia"
          aria-hidden="true"
          width={750}
          height={500}
          loading="eager"
          decoding="sync"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 40%",
          }}
        />

        {/* Dark gradient — bottom-up so text is readable, top stays open */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(18,17,16,0.88) 0%, rgba(18,17,16,0.55) 45%, rgba(18,17,16,0.25) 100%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Label */}
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
              style={{ width: 28, height: 1, backgroundColor: "var(--ochre)" }}
            />
            {audience === "local" ? "ጉዞዎቻችን" /* TODO-REVIEW */ : "All tours"}
          </div>

          {/* Headline + filter on same row on wide screens */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 24,
              marginBottom: "clamp(28px, 4vh, 44px)",
            }}
          >
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: '"opsz" 144, "wght" 700',
                fontSize: "clamp(2.8rem, 7vw, 7rem)",
                color: "var(--paper)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                maxWidth: "16ch",
                margin: 0,
              }}
            >
              {audience === "local"
                ? "ከአዲስ አበባ ወደ ሌሎች ቦታዎች" /* TODO-REVIEW */
                : "Every tour we run."}
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(12px, 1vw, 14px)",
                color: "var(--paper)",
                opacity: 0.5,
                maxWidth: 320,
                lineHeight: 1.65,
              }}
            >
              {audience === "local"
                ? "ቀን ጉዞዎች፣ ብዙ ቀን ጉዞዎች — ሙሉ ዝርዝር ከዚህ ይመርጡ።" /* TODO-REVIEW */
                : "From a half-day in Addis to a 15-day northern circuit. All itineraries visible — no clicks to reveal."}
            </p>
          </div>

          {/* ── Filters ── */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "clamp(12px, 2vw, 28px)",
            }}
          >
            {/* Interest chips */}
            <div
              role="group"
              aria-label="Filter by interest"
              style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
            >
              {INTERESTS.map((item) => {
                const active = interest === item.id;
                return (
                  <button
                    key={item.id}
                    aria-pressed={active}
                    onClick={() => setInterest(item.id)}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      letterSpacing: "0.06em",
                      padding: "7px 16px",
                      background: active ? "var(--ochre)" : "transparent",
                      color: active ? "var(--ink)" : "var(--paper)",
                      border: `1px solid ${active ? "var(--ochre)" : "rgba(241,234,217,0.2)"}`,
                      cursor: "none",
                      opacity: active ? 1 : 0.6,
                      transition: `background-color ${DURATION.micro}s ease, color ${DURATION.micro}s ease, opacity ${DURATION.micro}s ease`,
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.opacity = "0.6";
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <span
              style={{
                width: 1,
                height: 20,
                backgroundColor: "rgba(241,234,217,0.15)",
                flexShrink: 0,
              }}
              aria-hidden="true"
            />

            {/* Duration chips */}
            <div
              role="group"
              aria-label="Filter by duration"
              style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
            >
              {DURATIONS.map((item) => {
                const active = duration === item.id;
                return (
                  <button
                    key={item.id}
                    aria-pressed={active}
                    onClick={() => setDuration(item.id)}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      letterSpacing: "0.06em",
                      padding: "7px 16px",
                      background: active
                        ? "rgba(241,234,217,0.15)"
                        : "transparent",
                      color: "var(--paper)",
                      border: `1px solid ${active ? "rgba(241,234,217,0.4)" : "rgba(241,234,217,0.12)"}`,
                      cursor: "none",
                      opacity: active ? 1 : 0.55,
                      transition: `background-color ${DURATION.micro}s ease, opacity ${DURATION.micro}s ease`,
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.opacity = "0.55";
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Result count */}
            <span
              style={{
                marginLeft: "auto",
                fontFamily: "var(--font-body)",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--paper)",
                opacity: 0.3,
              }}
            >
              {sorted.length} tour{sorted.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </section>

      {/* ── Tour cards — editorial bento layout ── */}
      <section
        style={{
          backgroundColor: "var(--ink)",
          padding: "clamp(3px, 0.4vw, 6px)",
          paddingTop: 0,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${interest}-${duration}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.ui, ease: [...EASE_FM.outExpo] }}
          >
            {sorted.length === 0 ? (
              <div
                style={{
                  padding: "clamp(48px, 8vh, 80px) clamp(24px, 6vw, 80px)",
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontVariationSettings: '"opsz" 18, "wght" 300',
                  fontSize: "clamp(1.2rem, 2vw, 2rem)",
                  color: "var(--paper)",
                  opacity: 0.35,
                  backgroundColor: "var(--ink)",
                }}
              >
                No tours match that combination.
              </div>
            ) : (
              <TourBento tours={sorted} />
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </>
  );
}

// ── Layout engine ─────────────────────────────────────────────────────────────
/**
 * Pattern (repeats every 4 tours):
 *   Slot 0: WIDE-LEFT  — photo 65% + portrait 35%      (tall, ~55vh)
 *   Slot 1: WIDE-RIGHT — portrait 35% + photo 65%      (tall, ~55vh)
 *   Slot 2: FEATURE    — full-width horizontal spread   (short, ~38vh)
 *   Slot 3: PAIR       — two equal landscape photos     (medium, ~44vh)
 *
 * Every card has its photo. Visual variety = proportion + position, not removing images.
 */
function TourBento({ tours: list }: { tours: Tour[] }) {
  const isMobile = useIsMobile();
  const GAP = 4;

  // On mobile: single column, natural order, equal heights
  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
        {list.map((tour, i) => (
          <div key={tour.id} style={{ height: "clamp(280px, 60vw, 420px)" }}>
            <TourCard tour={tour} variant="wide" index={i + 1} />
          </div>
        ))}
      </div>
    );
  }

  const rows: Array<
    | { type: "asymmetric"; tours: [Tour, Tour]; flip: boolean }
    | { type: "feature"; tour: Tour }
    | { type: "pair"; tours: [Tour, Tour] }
    | { type: "solo"; tour: Tour }
  > = [];

  let i = 0;
  let rowIndex = 0;
  while (i < list.length) {
    const slot = rowIndex % 4;
    if (slot === 0 && i + 1 < list.length) {
      rows.push({
        type: "asymmetric",
        tours: [list[i], list[i + 1]],
        flip: false,
      });
      i += 2;
    } else if (slot === 1 && i + 1 < list.length) {
      rows.push({
        type: "asymmetric",
        tours: [list[i], list[i + 1]],
        flip: true,
      });
      i += 2;
    } else if (slot === 2) {
      rows.push({ type: "feature", tour: list[i] });
      i += 1;
    } else if (slot === 3 && i + 1 < list.length) {
      rows.push({ type: "pair", tours: [list[i], list[i + 1]] });
      i += 2;
    } else {
      rows.push({ type: "solo", tour: list[i] });
      i += 1;
    }
    rowIndex++;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
      {rows.map((row, ri) => {
        if (row.type === "asymmetric") {
          const [main, side] = row.tours;
          return (
            <div
              key={ri}
              style={{
                display: "flex",
                gap: GAP,
                height: "clamp(420px, 56vh, 640px)",
              }}
            >
              <div style={{ flex: row.flip ? "0 0 36%" : "0 0 64%" }}>
                <TourCard
                  tour={main}
                  variant={row.flip ? "portrait" : "wide"}
                  index={list.indexOf(main) + 1}
                />
              </div>
              <div style={{ flex: 1 }}>
                <TourCard
                  tour={side}
                  variant={row.flip ? "wide" : "portrait"}
                  index={list.indexOf(side) + 1}
                />
              </div>
            </div>
          );
        }

        if (row.type === "feature") {
          return (
            <div key={ri} style={{ height: "clamp(320px, 40vh, 480px)" }}>
              <TourCard
                tour={row.tour}
                variant="feature"
                index={list.indexOf(row.tour) + 1}
              />
            </div>
          );
        }

        if (row.type === "pair") {
          return (
            <div
              key={ri}
              style={{
                display: "flex",
                gap: GAP,
                height: "clamp(320px, 40vh, 480px)",
              }}
            >
              {row.tours.map((t) => (
                <div key={t.id} style={{ flex: 1 }}>
                  <TourCard
                    tour={t}
                    variant="landscape"
                    index={list.indexOf(t) + 1}
                  />
                </div>
              ))}
            </div>
          );
        }

        // solo — last card if odd remainder
        return (
          <div key={ri} style={{ height: "clamp(320px, 40vh, 480px)" }}>
            <TourCard
              tour={row.tour}
              variant="feature"
              index={list.indexOf(row.tour) + 1}
            />
          </div>
        );
      })}
    </div>
  );
}

// ── Tour card ─────────────────────────────────────────────────────────────────
/**
 * variant:
 *   wide      — tall photo card, title bottom-left, used as the dominant slot
 *   portrait  — tall photo card, narrower, same height as wide partner
 *   feature   — full-width horizontal: photo 55% left, text panel 45% right
 *   landscape — shorter photo card, used in pairs
 */
type CardVariant = "wide" | "portrait" | "feature" | "landscape";

function TourCard({
  tour,
  variant,
  index,
}: {
  tour: Tour;
  variant: CardVariant;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const imgSrc = `/media/tours/${tour.imageSlot.replace(/\.[^.]+$/, "")}-480.webp`;
  const slug = tour.slug ?? tour.id;

  const difficultyColor: Record<string, string> = {
    easy: "var(--highland)",
    moderate: "var(--ochre)",
    demanding: "var(--sulphur)",
  };

  // ── FEATURE variant: horizontal magazine spread ──────────────────────────
  if (variant === "feature") {
    return (
      <div
        style={{
          display: "flex",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          cursor: "none",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={tour.name}
      >
        {/* Photo — left 58% */}
        <div
          style={{
            flex: "0 0 58%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <img
            src={imgSrc}
            alt={tour.imageAlt}
            width={750}
            height={500}
            loading="lazy"
            decoding="async"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 35%",
              transition: `transform ${DURATION.scene}s cubic-bezier(${EASE_FM.outCubic.join(",")})`,
              transform: hovered ? "scale(1.04)" : "scale(1)",
            }}
          />
          {/* Subtle right-edge fade into the text panel */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, transparent 55%, rgba(18,17,16,0.9) 100%)",
            }}
          />
          {/* Index */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 18,
              left: 20,
              fontFamily: "var(--font-body)",
              fontSize: 9,
              letterSpacing: "0.18em",
              color: "var(--paper)",
              opacity: 0.4,
            }}
          >
            {String(index).padStart(2, "0")}
          </div>
        </div>

        {/* Text panel — right 42% */}
        <div
          style={{
            flex: 1,
            backgroundColor: "var(--indigo)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "clamp(24px, 3vw, 44px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Giant ghost numeral */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: -20,
              right: -10,
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 144, "wght" 800',
              fontSize: "clamp(100px, 14vw, 180px)",
              lineHeight: 1,
              color: "var(--paper)",
              opacity: 0.04,
              letterSpacing: "-0.06em",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {String(index).padStart(2, "0")}
          </span>

          <div>
            {/* Duration + difficulty row */}
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 9,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--ochre)",
                }}
              >
                {tour.duration} {tour.duration === 1 ? "day" : "days"}
              </span>
              <span
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  backgroundColor: "var(--ochre)",
                  opacity: 0.4,
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 9,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: difficultyColor[tour.difficulty] ?? "var(--ochre)",
                }}
              >
                {tour.difficulty}
              </span>
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: '"opsz" 48, "wght" 700',
                fontSize: "clamp(1.3rem, 2.2vw, 2.2rem)",
                color: "var(--paper)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: 14,
              }}
            >
              {tour.name}
            </h2>

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontVariationSettings: '"opsz" 14, "wght" 300',
                fontSize: "clamp(0.85rem, 1.1vw, 1rem)",
                color: "var(--paper)",
                opacity: 0.55,
                lineHeight: 1.55,
                marginBottom: 20,
              }}
            >
              {tour.tagline}
            </p>

            {/* First highlight */}
            {tour.highlights[0] && (
              <div
                style={{
                  borderLeft: "2px solid var(--ochre)",
                  paddingLeft: 12,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--paper)",
                    opacity: 0.5,
                    lineHeight: 1.6,
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  {tour.highlights[0]}
                </p>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div
            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 24 }}
          >
            <Link
              to={`/tours/${slug}`}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--ink)",
                backgroundColor: "var(--paper)",
                padding: "10px 22px",
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
                  "var(--paper)")
              }
            >
              Full itinerary →
            </Link>
            <Link
              to={`/plan?tour=${slug}`}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--paper)",
                border: "1px solid rgba(241,234,217,0.3)",
                padding: "10px 22px",
                textDecoration: "none",
                cursor: "none",
                display: "inline-block",
                whiteSpace: "nowrap",
                transition: `border-color ${DURATION.micro}s ease`,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "var(--ochre)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(241,234,217,0.3)")
              }
            >
              Enquire
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── PHOTO variants: wide / portrait / landscape ──────────────────────────
  return (
    <article
      style={{
        position: "relative",
        overflow: "hidden",
        height: "100%",
        backgroundColor: "var(--indigo)",
        cursor: "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={tour.name}
    >
      {/* Photo */}
      <img
        src={imgSrc}
        alt={tour.imageAlt}
        width={750}
        height={500}
        loading="lazy"
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 38%",
          transition: `transform ${DURATION.scene}s cubic-bezier(${EASE_FM.outCubic.join(",")})`,
          transform: hovered ? "scale(1.05)" : "scale(1)",
        }}
      />

      {/* Permanent gradient — bottom heavy */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(18,17,16,0.95) 0%, rgba(18,17,16,0.5) 38%, rgba(18,17,16,0.05) 100%)",
        }}
      />

      {/* Hover: ochre warmth */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: hovered ? 0.1 : 0 }}
        transition={{ duration: DURATION.micro }}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "var(--ochre)",
          pointerEvents: "none",
        }}
      />

      {/* Top row: index + badges */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "16px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          zIndex: 2,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 9,
            letterSpacing: "0.18em",
            color: "var(--paper)",
            opacity: 0.3,
          }}
        >
          {String(index).padStart(2, "0")}
        </span>

        <div style={{ display: "flex", gap: 5 }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 8,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "var(--paper)",
              backgroundColor: "rgba(18,17,16,0.65)",
              padding: "4px 8px",
            }}
          >
            {tour.duration}
            {tour.duration === 1 ? "d" : "d"}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 8,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: difficultyColor[tour.difficulty] ?? "var(--paper)",
              backgroundColor: "rgba(18,17,16,0.65)",
              padding: "4px 8px",
            }}
          >
            {tour.difficulty}
          </span>
        </div>
      </div>

      {/* Bottom: title + tagline always visible, CTAs on hover */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding:
            variant === "wide"
              ? "clamp(20px, 2.8vw, 36px)"
              : "clamp(16px, 2vw, 26px)",
          zIndex: 2,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontVariationSettings:
              variant === "wide"
                ? '"opsz" 48, "wght" 700'
                : '"opsz" 32, "wght" 600',
            fontSize:
              variant === "wide"
                ? "clamp(1.3rem, 2.4vw, 2.2rem)"
                : "clamp(1rem, 1.6vw, 1.5rem)",
            color: "var(--paper)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: 6,
          }}
        >
          {tour.name}
        </h2>

        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontVariationSettings: '"opsz" 14, "wght" 300',
            fontSize: "clamp(0.78rem, 1.05vw, 0.92rem)",
            color: "var(--paper)",
            opacity: 0.55,
            lineHeight: 1.45,
            marginBottom: 0,
            maxWidth: variant === "wide" ? "38ch" : "26ch",
          }}
        >
          {tour.tagline}
        </p>

        {/* CTAs — slide up from below on hover */}
        <motion.div
          animate={{ y: hovered ? 0 : 12, opacity: hovered ? 1 : 0 }}
          transition={{ duration: DURATION.ui, ease: [...EASE_FM.outExpo] }}
          style={{
            display: "flex",
            gap: 7,
            marginTop: 14,
            flexWrap: "wrap",
          }}
        >
          <Link
            to={`/tours/${slug}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 9,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "var(--ink)",
              backgroundColor: "var(--paper)",
              padding: "8px 18px",
              textDecoration: "none",
              cursor: "none",
              display: "inline-block",
              whiteSpace: "nowrap",
              transition: `background-color ${DURATION.micro}s ease`,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--ochre)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--paper)")
            }
          >
            Full itinerary →
          </Link>
          <Link
            to={`/plan?tour=${slug}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 9,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "var(--paper)",
              border: "1px solid rgba(241,234,217,0.3)",
              padding: "8px 18px",
              textDecoration: "none",
              cursor: "none",
              display: "inline-block",
              whiteSpace: "nowrap",
              transition: `border-color ${DURATION.micro}s ease`,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor =
                "var(--ochre)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor =
                "rgba(241,234,217,0.3)")
            }
          >
            Enquire
          </Link>
        </motion.div>
      </div>
    </article>
  );
}

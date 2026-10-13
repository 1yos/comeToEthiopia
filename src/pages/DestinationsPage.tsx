import { useRef } from "react";
import { motion } from "framer-motion";
import {
  destinations,
  CATEGORY_LABELS,
  type Destination,
} from "@/data/destinations";
import { useSeo } from "@/hooks/useSeo";
import {
  PageHero,
  HeroLabel,
  HeroHeadline,
  HeroSub,
} from "@/components/PageHero";
import { siteContent } from "@/data/content";
import { DURATION } from "@/lib/motion";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * Destinations — magazine editorial format.
 * One full-bleed spread per destination, scroll vertically through all 12.
 * Each spread alternates: photo-left/text-right, then photo-right/text-left.
 * Featured destinations get a taller spread with a pull-quote.
 * Not a grid. Not a card list. A printed guide that came alive.
 */
export function DestinationsPage() {
  const { meta } = siteContent;
  const isMobile = useIsMobile();

  useSeo({
    title: `Destinations — ${meta.title}`,
    description:
      "Twelve destinations across Ethiopia — from the Simien escarpment at 4,543m to the Danakil Depression at −125m. Every place we actually run tours to.",
    canonical: "/destinations",
  });

  return (
    <>
      {/* ── Magazine masthead ── */}
      <PageHero
        imgSrc="/media/regions/Dalol-Danakil-Depression-Ethiopia-Tours-and-Holiday-Packages-480.webp"
        imgAlt="Dalol hydrothermal field, Danakil Depression — acid pools and sulphur formations"
        gradientDir="down"
        darkness={0.78}
        imgPosition="center 55%"
      >
        <HeroLabel>Destinations</HeroLabel>
        <HeroHeadline>Twelve places. All of them real.</HeroHeadline>
        <HeroSub>
          Every destination on this page is somewhere we run tours to. Not a
          list compiled from a map. Coordinates verified. Seasons tested.
        </HeroSub>
      </PageHero>

      {/* ── One spread per destination ── */}
      {destinations.map((dest, i) => (
        <DestinationSpread
          key={dest.id}
          dest={dest}
          index={i}
          flip={i % 2 === 1}
          isMobile={isMobile}
        />
      ))}
    </>
  );
}

// ── Single destination spread ────────────────────────────────────────────────

function DestinationSpread({
  dest,
  index,
  flip,
  isMobile,
}: {
  dest: Destination;
  index: number;
  flip: boolean;
  isMobile: boolean;
}) {
  const imgSrc = dest.image
    ? `/media/${dest.imageFolder ?? "regions"}/${dest.image}-480.webp`
    : null;

  const accentColors = [
    "var(--indigo)",
    "var(--ochre)",
    "var(--highland)",
    "var(--indigo)",
    "var(--sulphur)",
    "var(--ochre)",
    "var(--highland)",
    "var(--indigo)",
    "var(--sulphur)",
    "var(--ochre)",
    "var(--highland)",
    "var(--indigo)",
  ];
  const accent = accentColors[index % accentColors.length];

  const textRef = useRef<HTMLDivElement>(null);

  return (
    <motion.article
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-6%" }}
      transition={{ duration: DURATION.reveal }}
      style={{
        display: "grid",
        gridTemplateColumns: isMobile
          ? "1fr"
          : flip
            ? "1fr clamp(280px, 42vw, 600px)"
            : "clamp(280px, 42vw, 600px) 1fr",
        minHeight: isMobile
          ? "auto"
          : dest.featured
            ? "clamp(520px, 70vh, 800px)"
            : "clamp(380px, 52vh, 600px)",
        backgroundColor: "var(--paper)",
        borderBottom: "1px solid rgba(18,17,16,0.06)",
      }}
      aria-label={dest.name}
    >
      {/* Photo column — order flips on alternate rows */}
      <div
        style={{
          order: isMobile ? 1 : flip ? 2 : 1,
          position: "relative",
          overflow: "hidden",
          backgroundColor: "var(--indigo)",
          height: isMobile ? "clamp(220px, 55vw, 340px)" : undefined,
        }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={dest.imageAlt ?? dest.name}
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
              objectPosition: "center",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "var(--indigo)",
            }}
          />
        )}

        {/* Category badge */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: flip ? "auto" : 20,
            right: flip ? 20 : "auto",
            backgroundColor: accent,
            color: "var(--paper)",
            fontFamily: "var(--font-body)",
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "5px 12px",
          }}
        >
          {CATEGORY_LABELS[dest.category]}
        </div>

        {/* Index number — large, ghosted */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: -10,
            right: flip ? "auto" : -8,
            left: flip ? -8 : "auto",
            fontFamily: "var(--font-display)",
            fontVariationSettings: '"opsz" 144, "wght" 800',
            fontSize: "clamp(80px, 16vw, 200px)",
            lineHeight: 1,
            color: "var(--paper)",
            opacity: 0.07,
            userSelect: "none",
            pointerEvents: "none",
            letterSpacing: "-0.05em",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Text column */}
      <div
        ref={textRef}
        style={{
          order: flip ? 1 : 2,
          padding: "clamp(36px, 5vw, 72px) clamp(28px, 4.5vw, 64px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor:
            dest.featured && index % 4 === 0 ? "var(--indigo)" : "var(--paper)",
        }}
      >
        {/* Ge'ez numeral + name */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            marginBottom: 16,
          }}
        >
          {dest.numeral && (
            <span
              className="geez"
              aria-hidden="true"
              style={{
                fontFamily: "var(--font-geez)",
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                color: accent,
                lineHeight: 1,
              }}
            >
              {dest.numeral} {/* TODO-REVIEW */}
            </span>
          )}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 48, "wght" 600',
              fontSize: "clamp(1.4rem, 2.5vw, 2.5rem)",
              color:
                dest.featured && index % 4 === 0
                  ? "var(--paper)"
                  : "var(--ink)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            {dest.name}
          </h2>
        </div>

        {/* Tagline — display-sized */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontVariationSettings: '"opsz" 18, "wght" 300',
            fontSize: "clamp(1rem, 1.8vw, 1.5rem)",
            color:
              dest.featured && index % 4 === 0 ? "var(--paper)" : "var(--ink)",
            opacity: 0.85,
            lineHeight: 1.45,
            marginBottom: 20,
          }}
        >
          {dest.tagline}
        </p>

        {/* Description — body text */}
        {dest.description.split("\n\n").map((para, pi) => (
          <p
            key={pi}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1.1vw, 15px)",
              color:
                dest.featured && index % 4 === 0
                  ? "var(--paper)"
                  : "var(--ink)",
              opacity: 0.7,
              lineHeight: 1.75,
              marginBottom:
                pi < dest.description.split("\n\n").length - 1 ? 14 : 24,
            }}
          >
            {para}
          </p>
        ))}

        {/* Meta — season / getting there / altitude */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 28,
            paddingTop: 4,
            borderTop: "1px solid rgba(18,17,16,0.1)",
          }}
        >
          {[
            dest.bestSeason && { label: "Best season", value: dest.bestSeason },
            dest.altitude && { label: "Altitude", value: dest.altitude },
            dest.howToGetThere && {
              label: "Getting there",
              value: dest.howToGetThere,
            },
            dest.daysNeeded && { label: "Days needed", value: dest.daysNeeded },
          ]
            .filter(Boolean)
            .map((item) => {
              const { label, value } = item as { label: string; value: string };
              return (
                <div
                  key={label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "clamp(90px, 12vw, 120px) 1fr",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 9,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: accent,
                      paddingTop: 2,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(12px, 1vw, 14px)",
                      color:
                        dest.featured && index % 4 === 0
                          ? "var(--paper)"
                          : "var(--ink)",
                      opacity: 0.7,
                      lineHeight: 1.5,
                    }}
                  >
                    {value}
                  </span>
                </div>
              );
            })}
        </div>

        {/* Tour link */}
        {dest.tourIds && dest.tourIds.length > 0 && (
          <a
            href="/tours"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "var(--font-body)",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color:
                dest.featured && index % 4 === 0
                  ? "var(--ink)"
                  : "var(--paper)",
              backgroundColor: accent,
              padding: "11px 22px",
              textDecoration: "none",
              cursor: "none",
              alignSelf: "flex-start",
              transition: `opacity ${DURATION.micro}s ease`,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "0.85")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "1")
            }
          >
            See{" "}
            {dest.tourIds.length === 1
              ? "the tour"
              : `${dest.tourIds.length} tours`}{" "}
            →
          </a>
        )}
      </div>
    </motion.article>
  );
}

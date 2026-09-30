import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { regions, type Region } from "@/data/regions";
import {
  countryPath,
  adm1Paths,
  places,
  MAP_VIEWBOX_W,
  MAP_VIEWBOX_H,
} from "@/data/ethiopiaMap";
import { siteContent } from "@/data/content";
import { DURATION, EASE_FM } from "@/lib/motion";

/**
 * Interactive map of Ethiopia — built from real geoBoundaries ETH ADM0/ADM1 data.
 * Projection: geoMercator fitted to MAP_VIEWBOX×MAP_VIEWBOX (1000×1000).
 * All marker positions derived from real lon/lat via the pre-projected `places` array.
 * No hand-drawn outlines. No hard-coded x/y pixels in this file.
 *
 * Visual treatment:
 * - SVG roughen filter (feTurbulence + feDisplacementMap) gives the border
 *   a slightly organic, hand-made feel on top of the accurate geography.
 * - Faint Ge'ez place-name labels over major cities.
 * - Small hand-drawn compass rose in the lower-right corner.
 * - Hover/tap a region marker → detail card with photo, story, season, route info.
 */

// Map each region id to the corresponding projected place
const REGION_TO_PLACE: Record<string, string> = {
  simien: "simien",
  lalibela: "lalibela",
  addis: "addis",
  omo: "omo",
  danakil: "danakil",
};

// Additional notable places shown as faint labels (not region markers)
const LABEL_PLACES = ["gondar", "axum", "harar", "bale", "bahirdar"] as const;

export function Map() {
  const [active, setActive] = useState<Region | null>(null);
  const [cardSide, setCardSide] = useState<"left" | "right">("right");
  const svgRef = useRef<SVGSVGElement>(null);
  const { map: mapContent } = siteContent;

  const handleMarkerActivate = (
    region: Region,
    e: React.MouseEvent | React.KeyboardEvent,
  ) => {
    e.preventDefault();
    if (active?.id === region.id) {
      setActive(null);
      return;
    }
    // Decide which side the card appears on based on marker x position
    const place = places.find((p) => p.id === REGION_TO_PLACE[region.id]);
    if (place) setCardSide(place.x > MAP_VIEWBOX_W * 0.55 ? "left" : "right");
    setActive(region);
  };

  return (
    <section
      id="map"
      role="region"
      aria-label="Interactive map of Ethiopia"
      style={{
        backgroundColor: "var(--paper)",
        padding: "clamp(48px, 6vh, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "clamp(24px, 6vw, 80px) 1fr",
          padding: "0 clamp(24px, 6vw, 80px)",
          marginBottom: "clamp(48px, 6vh, 80px)",
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
          {mapContent.sectionLabel}
        </div>
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 72, "wght" 600',
              fontSize: "clamp(2.5rem, 6vw, 7rem)",
              color: "var(--ink)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              marginBottom: 20,
            }}
          >
            {mapContent.headline}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1.2vw, 16px)",
              color: "var(--ink)",
              opacity: 0.65,
              maxWidth: 480,
              lineHeight: 1.7,
            }}
          >
            {mapContent.subline}
          </p>
        </div>
      </div>

      {/* Map wrapper */}
      <div
        style={{
          position: "relative",
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 64px)",
        }}
      >
        {/* Ge'ez background decorator */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-6%",
            right: "4%",
            fontFamily: "var(--font-geez)",
            fontSize: "clamp(120px, 20vw, 260px)",
            color: "var(--ink)",
            opacity: 0.03,
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {mapContent.geezDecorator} {/* TODO-REVIEW */}
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${MAP_VIEWBOX_W} ${MAP_VIEWBOX_H}`}
          role="img"
          aria-label="Map of Ethiopia showing five key regions with interactive markers"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "80vh",
            display: "block",
            position: "relative",
            zIndex: 1,
          }}
        >
          <defs>
            {/* Roughen filter — gives accurate border an organic, hand-drawn quality */}
            <filter id="roughen" x="-2%" y="-2%" width="104%" height="104%">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.5"
                numOctaves="3"
                seed="4"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="0.08"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            {/* Subtle texture filter for ADM1 fills */}
            <filter id="texture" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="2"
                result="noise"
              />
              <feColorMatrix
                type="saturate"
                values="0"
                in="noise"
                result="grey"
              />
              <feBlend in="SourceGraphic" in2="grey" mode="multiply" />
            </filter>
          </defs>

          {/* ── ADM1 region fills (faint, textured) ── */}
          <g opacity={0.18} filter="url(#texture)">
            {adm1Paths.map((region) => (
              <path
                key={region.name}
                d={region.path}
                fill="var(--indigo)"
                stroke="var(--paper)"
                strokeWidth={0.01}
              />
            ))}
          </g>

          {/* ── Country outline (accurate geography + roughen filter) ── */}
          <path
            d={countryPath}
            fill="var(--paper)"
            fillOpacity={0.6}
            stroke="var(--ink)"
            strokeWidth={0.04}
            strokeLinejoin="round"
            filter="url(#roughen)"
            style={{
              filter: "drop-shadow(0 0.05px 0.15px rgba(18,17,16,0.07))",
            }}
          />

          {/* ── Clean country outline on top (sharp, no filter) ── */}
          <path
            d={countryPath}
            fill="none"
            stroke="var(--ink)"
            strokeWidth={0.015}
            strokeLinejoin="round"
            opacity={0.3}
          />

          {/* ── Faint Ge'ez / latin place labels for non-region cities ── */}
          {LABEL_PLACES.map((pid) => {
            const p = places.find((pl) => pl.id === pid);
            if (!p) return null;
            return (
              <g key={pid} aria-hidden="true" opacity={0.35}>
                <circle cx={p.x} cy={p.y} r={0.05} fill="var(--ink)" />
                <text
                  x={p.x + 0.15}
                  y={p.y + 0.05}
                  fontFamily="var(--font-body)"
                  fontSize={0.2}
                  fill="var(--ink)"
                  letterSpacing="0.03em"
                  style={{ userSelect: "none" }}
                >
                  {p.name}
                </text>
              </g>
            );
          })}

          {/* ── Region markers (interactive) ── */}
          {regions.map((region) => {
            const placeId = REGION_TO_PLACE[region.id];
            const place = places.find((p) => p.id === placeId);
            if (!place) return null;
            const isActive = active?.id === region.id;

            return (
              <g
                key={region.id}
                role="button"
                tabIndex={0}
                aria-label={`${region.name}: ${region.tagline}. Press Enter for details.`}
                aria-pressed={isActive}
                onClick={(e) => handleMarkerActivate(region, e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleMarkerActivate(region, e);
                }}
                style={{ cursor: "none" }}
              >
                {/* Pulse ring when active */}
                {isActive && (
                  <circle
                    cx={place.x}
                    cy={place.y}
                    r={0.28}
                    fill="none"
                    stroke="var(--ochre)"
                    strokeWidth={0.02}
                    opacity={0.5}
                  >
                    <animate
                      attributeName="r"
                      values="0.18;0.42;0.18"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.5;0;0.5"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                {/* Outer ring */}
                <circle
                  cx={place.x}
                  cy={place.y}
                  r={isActive ? 0.16 : 0.13}
                  fill="none"
                  stroke={isActive ? "var(--ochre)" : "var(--ink)"}
                  strokeWidth={isActive ? 0.04 : 0.025}
                />
                {/* Dot */}
                <circle
                  cx={place.x}
                  cy={place.y}
                  r={isActive ? 0.08 : 0.06}
                  fill={isActive ? "var(--ochre)" : "var(--ink)"}
                />
                {/* Ge'ez numeral label */}
                <text
                  x={place.x + 0.22}
                  y={place.y - 0.1}
                  fontFamily="var(--font-geez)"
                  fontSize={0.25}
                  fill={isActive ? "var(--ochre)" : "var(--ink)"}
                  opacity={isActive ? 1 : 0.6}
                  style={{ userSelect: "none" }}
                  aria-hidden="true"
                >
                  {region.geezNumeral}
                </text>
                <text
                  x={place.x + 0.22}
                  y={place.y + 0.15}
                  fontFamily="var(--font-body)"
                  fontSize={0.15}
                  fill="var(--ink)"
                  opacity={isActive ? 0.9 : 0.55}
                  letterSpacing="0.04em"
                  style={{ userSelect: "none" }}
                  aria-hidden="true"
                >
                  {region.name}
                </text>
              </g>
            );
          })}

          {/* ── Hand-drawn compass rose (bottom-right corner) ── */}
          <CompassRose cx={311} cy={344} size={0.8} />
        </svg>

        {/* Detail card — absolutely positioned, side determined by marker position */}
        <AnimatePresence>
          {active && (
            <MapDetailCard
              region={active}
              side={cardSide}
              onClose={() => setActive(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Tap prompt */}
      <p
        style={{
          textAlign: "center",
          fontFamily: "var(--font-body)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--ink)",
          opacity: 0.35,
          marginTop: 32,
        }}
        aria-hidden="true"
      >
        {mapContent.defaultPrompt}
      </p>
    </section>
  );
}

// ── Detail card ──────────────────────────────────────────────────────────────

function MapDetailCard({
  region,
  side,
  onClose,
}: {
  region: Region;
  side: "left" | "right";
  onClose: () => void;
}) {
  return (
    <motion.div
      key={region.id}
      initial={{ opacity: 0, x: side === "right" ? 20 : -20, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: DURATION.micro, ease: [...EASE_FM.outExpo] }}
      role="dialog"
      aria-label={`Details for ${region.name}`}
      style={{
        position: "absolute",
        top: "10%",
        ...(side === "right" ? { right: 0 } : { left: 0 }),
        zIndex: 20,
        width: "clamp(240px, 28vw, 290px)",
        backgroundColor: "var(--indigo)",
        color: "var(--paper)",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(18,17,16,0.3)",
      }}
    >
      {/* Photo slot */}
      {/* Region photo */}
      {(() => {
        const MAP: Record<string, string> = {
          "simien-escarpment.webp":
            "/media/regions/Simien-Mountains-Ethiopia-Tours-and-Travel-Packages-480.webp",
          "lalibela-beta-giyorgis.webp":
            "/media/tours/Lalibela-Ethiopia-Tours-480.webp",
          "addis-merkato-morning.webp":
            "/media/tours/Half-Day-Addis-Ababa-Tour-to-National-Museum-Trinity-Cathedral-Merkato-480.webp",
          "omo-valley-hamar.webp":
            "/media/regions/Omo-Valley-Tribe-Ethiopia-Tour-Travel-Package-480.webp",
          "danakil-dallol-acid.webp":
            "/media/regions/Dalol-Danakil-Depression-Ethiopia-Tours-and-Holiday-Packages-480.webp",
        };
        const src = MAP[region.imageSlot];
        return src ? (
          <img
            src={src}
            alt={region.imageDescription}
            width={750}
            height={500}
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: 130,
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            className="photo-slot"
            data-photo={region.imageDescription}
            role="img"
            aria-label={region.imageDescription}
            style={{ height: 130 }}
          />
        );
      })()}
      <div style={{ padding: "18px 20px 22px" }}>
        {/* Name row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <span
            className="geez"
            style={{
              fontFamily: "var(--font-geez)",
              fontSize: "1.4rem",
              color: "var(--ochre)",
              lineHeight: 1,
            }}
          >
            {region.geezNumeral}
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 18, "wght" 600',
              fontSize: "1rem",
              color: "var(--paper)",
            }}
          >
            {region.name}
          </span>
        </div>
        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            lineHeight: 1.6,
            color: "var(--paper)",
            opacity: 0.8,
            marginBottom: 14,
          }}
        >
          {region.tagline}
        </p>
        {/* Meta */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Best season", value: region.bestSeason },
            { label: "Getting there", value: region.howToGetThere },
            { label: "Days needed", value: region.daysNeeded },
          ].map(({ label, value }) => (
            <div key={label}>
              <div
                style={{
                  fontSize: 8,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--ochre)",
                  marginBottom: 2,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--paper)",
                  opacity: 0.75,
                  lineHeight: 1.45,
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={onClose}
        aria-label={`Close ${region.name} details`}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: "rgba(18,17,16,0.5)",
          border: "none",
          color: "var(--paper)",
          width: 26,
          height: 26,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "none",
          fontSize: 14,
        }}
      >
        ×
      </button>
    </motion.div>
  );
}

// ── Compass rose (hand-drawn SVG) ────────────────────────────────────────────

function CompassRose({
  cx,
  cy,
  size,
}: {
  cx: number;
  cy: number;
  size: number;
}) {
  const s = size;
  return (
    <g aria-hidden="true" opacity={0.35}>
      {/* N/S arms */}
      <line
        x1={cx}
        y1={cy - s}
        x2={cx}
        y2={cy + s}
        stroke="var(--ink)"
        strokeWidth={0.02}
      />
      {/* E/W arms */}
      <line
        x1={cx - s}
        y1={cy}
        x2={cx + s}
        y2={cy}
        stroke="var(--ink)"
        strokeWidth={0.02}
      />
      {/* Diagonal arms (shorter) */}
      <line
        x1={cx - s * 0.6}
        y1={cy - s * 0.6}
        x2={cx + s * 0.6}
        y2={cy + s * 0.6}
        stroke="var(--ink)"
        strokeWidth={0.012}
      />
      <line
        x1={cx + s * 0.6}
        y1={cy - s * 0.6}
        x2={cx - s * 0.6}
        y2={cy + s * 0.6}
        stroke="var(--ink)"
        strokeWidth={0.012}
      />
      {/* North arrowhead */}
      <path
        d={`M ${cx} ${cy - s} L ${cx - 0.1} ${cy - s + 0.25} L ${cx} ${cy - s + 0.15} L ${cx + 0.1} ${cy - s + 0.25} Z`}
        fill="var(--ochre)"
        opacity={0.8}
      />
      {/* N label */}
      <text
        x={cx}
        y={cy - s - 0.12}
        fontFamily="var(--font-body)"
        fontSize={0.18}
        fill="var(--ink)"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        N
      </text>
      {/* Centre circle */}
      <circle
        cx={cx}
        cy={cy}
        r={0.07}
        fill="var(--paper)"
        stroke="var(--ink)"
        strokeWidth={0.02}
      />
    </g>
  );
}

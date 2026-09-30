import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { routes } from "@/data/routes";
import { findRoutes, type Interest } from "@/lib/routeScorer";
import { siteContent } from "@/data/content";
import { regions } from "@/data/regions";
import { places, MAP_VIEWBOX_W, MAP_VIEWBOX_H } from "@/data/ethiopiaMap";
import { DURATION, EASE_FM, DELAY } from "@/lib/motion";

// Map region IDs to the place IDs used in ethiopiaMap.ts
const REGION_TO_PLACE: Record<string, string> = {
  simien: "simien",
  lalibela: "lalibela",
  addis: "addis",
  omo: "omo",
  danakil: "danakil",
};

/**
 * Build Your Route section.
 *
 * Layout: two-column on desktop.
 * Left: interest toggles + duration selector
 * Right: results — animated in with a hand-drawn route line across a mini-map
 *
 * The scorer uses /lib/routeScorer.ts. Interface designed for future LLM swap.
 */
export function RouteBuilder() {
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [duration, setDuration] = useState<7 | 10 | 14>(10);
  const [results, setResults] = useState<ReturnType<typeof findRoutes> | null>(
    null,
  );
  const [activeRoute, setActiveRoute] = useState(0);

  const { routeBuilder } = siteContent;

  const toggleInterest = (id: Interest) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
    setResults(null); // clear results when query changes
  };

  const handleBuild = () => {
    if (selectedInterests.length === 0) return;
    const scored = findRoutes(routes, {
      interests: selectedInterests,
      duration,
    });
    setResults(scored);
    setActiveRoute(0);
  };

  return (
    <section
      id="route-builder"
      role="region"
      aria-label="Build your Ethiopia itinerary"
      style={{
        backgroundColor: "var(--paper)",
        padding: "clamp(80px, 10vh, 140px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Ge'ez */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-5%",
          left: "-3%",
          fontFamily: "var(--font-geez)",
          fontSize: "clamp(180px, 28vw, 400px)",
          color: "var(--ink)",
          opacity: 0.03,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {routeBuilder.geezDecorator} {/* TODO-REVIEW */}
      </div>

      <div
        style={{
          padding: "0 clamp(24px, 6vw, 80px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "clamp(48px, 6vh, 80px)" }}>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ochre)",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{ width: 32, height: 1, backgroundColor: "var(--ochre)" }}
            />
            {routeBuilder.sectionLabel}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 72, "wght" 600',
              fontSize: "clamp(2.5rem, 6vw, 7rem)",
              color: "var(--ink)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              marginBottom: 16,
            }}
          >
            {routeBuilder.headline}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1.2vw, 16px)",
              color: "var(--ink)",
              opacity: 0.65,
              maxWidth: 520,
              lineHeight: 1.7,
            }}
          >
            {routeBuilder.subline}
          </p>
        </div>

        {/* Two columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: results ? "1fr 1fr" : "1fr",
            gap: "clamp(32px, 5vw, 80px)",
            alignItems: "start",
            maxWidth: results ? "100%" : 640,
          }}
        >
          {/* Left: inputs */}
          <div>
            {/* Interest toggles */}
            <fieldset
              style={{
                border: "none",
                padding: 0,
                margin: 0,
                marginBottom: 36,
              }}
            >
              <legend
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                  opacity: 0.5,
                  marginBottom: 16,
                  float: "left",
                  width: "100%",
                }}
              >
                What draws you
              </legend>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  clear: "both",
                }}
              >
                {routeBuilder.interests.map((interest) => {
                  const selected = selectedInterests.includes(
                    interest.id as Interest,
                  );
                  return (
                    <button
                      key={interest.id}
                      role="checkbox"
                      aria-checked={selected}
                      onClick={() => toggleInterest(interest.id as Interest)}
                      data-magnetic
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        letterSpacing: "0.08em",
                        color: selected ? "var(--paper)" : "var(--ink)",
                        backgroundColor: selected
                          ? "var(--ink)"
                          : "transparent",
                        border: "1px solid var(--ink)",
                        padding: "10px 18px",
                        cursor: "none",
                        transition: "background-color 0.2s, color 0.2s",
                        // Sharp corners
                      }}
                    >
                      {interest.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Duration selector */}
            <fieldset
              style={{
                border: "none",
                padding: 0,
                margin: 0,
                marginBottom: 36,
              }}
            >
              <legend
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                  opacity: 0.5,
                  marginBottom: 16,
                  float: "left",
                  width: "100%",
                }}
              >
                Trip length
              </legend>
              <div style={{ display: "flex", gap: 0, clear: "both" }}>
                {routeBuilder.durations.map(({ value, label }, i) => (
                  <button
                    key={value}
                    role="radio"
                    aria-checked={duration === value}
                    onClick={() => {
                      setDuration(value as 7 | 10 | 14);
                      setResults(null);
                    }}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontVariationSettings:
                        duration === value
                          ? '"opsz" 18, "wght" 600'
                          : '"opsz" 14, "wght" 300',
                      fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
                      letterSpacing: "-0.02em",
                      color: duration === value ? "var(--paper)" : "var(--ink)",
                      backgroundColor:
                        duration === value ? "var(--ink)" : "transparent",
                      border: "1px solid var(--ink)",
                      borderLeft: i === 0 ? "1px solid var(--ink)" : "none",
                      padding: "14px clamp(16px, 2.5vw, 32px)",
                      cursor: "none",
                      transition: "background-color 0.2s, color 0.2s",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Build button */}
            <button
              onClick={handleBuild}
              disabled={selectedInterests.length === 0}
              data-magnetic
              data-cursor-label="Build"
              aria-label={`Build route for ${duration} days with interests: ${selectedInterests.join(", ")}`}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color:
                  selectedInterests.length > 0 ? "var(--paper)" : "var(--ink)",
                backgroundColor:
                  selectedInterests.length > 0 ? "var(--ochre)" : "transparent",
                border: "1px solid var(--ink)",
                borderColor:
                  selectedInterests.length > 0
                    ? "var(--ochre)"
                    : "rgba(18,17,16,0.3)",
                padding: "16px 36px",
                cursor: selectedInterests.length > 0 ? "none" : "default",
                transition: "all 0.3s ease",
                opacity: selectedInterests.length > 0 ? 1 : 0.4,
              }}
            >
              {routeBuilder.buildLabel}
            </button>
          </div>

          {/* Right: results */}
          <AnimatePresence>
            {results && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{
                  duration: DURATION.ui,
                  ease: [...EASE_FM.outExpo],
                }}
              >
                {/* Route tabs */}
                <div style={{ display: "flex", gap: 0, marginBottom: 28 }}>
                  {results.map((route, i) => (
                    <button
                      key={route.id}
                      onClick={() => setActiveRoute(i)}
                      aria-selected={i === activeRoute}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 10,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color:
                          i === activeRoute ? "var(--paper)" : "var(--ink)",
                        backgroundColor:
                          i === activeRoute ? "var(--indigo)" : "transparent",
                        border: "1px solid",
                        borderColor:
                          i === activeRoute
                            ? "var(--indigo)"
                            : "rgba(18,17,16,0.2)",
                        borderLeft: i === 0 ? undefined : "none",
                        padding: "8px 16px",
                        cursor: "none",
                      }}
                    >
                      Option {i + 1}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {results[activeRoute] && (
                    <RouteCard
                      key={results[activeRoute].id}
                      route={results[activeRoute]}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function RouteCard({ route }: { route: ReturnType<typeof findRoutes>[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: DURATION.micro, ease: [...EASE_FM.outExpo] }}
    >
      {/* Route header */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 9,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--ochre)",
            marginBottom: 8,
          }}
        >
          {route.duration} days · {route.difficulty}
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontVariationSettings: '"opsz" 32, "wght" 600',
            fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
            color: "var(--ink)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: 10,
          }}
        >
          {route.name}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--ink)",
            opacity: 0.65,
            lineHeight: 1.6,
            fontStyle: "italic",
          }}
        >
          {route.tagline}
        </p>
      </div>

      {/* Route line visualization — hand-drawn SVG connecting stops */}
      <RouteLineSVG stops={route.stops.map((s) => s.regionId)} />

      {/* Stops list */}
      <div style={{ marginTop: 24 }}>
        {route.stops.map((stop, i) => {
          const region = regions.find((r) => r.id === stop.regionId);
          return (
            <motion.div
              key={stop.regionId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                paddingBottom: 16,
                borderBottom:
                  i < route.stops.length - 1
                    ? "1px solid rgba(18,17,16,0.1)"
                    : "none",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  color: "var(--ochre)",
                  letterSpacing: "0.08em",
                  minWidth: 48,
                  paddingTop: 2,
                }}
              >
                Night{stop.nights > 1 ? "s" : ""} {stop.nights}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--ink)",
                    marginBottom: 4,
                  }}
                >
                  {region?.name ?? stop.regionId}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink)",
                    opacity: 0.6,
                    lineHeight: 1.5,
                  }}
                >
                  {stop.notes}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Highlights */}
      <div style={{ marginTop: 8 }}>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 9,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--ink)",
            opacity: 0.45,
            marginBottom: 12,
          }}
        >
          Highlights
        </div>
        {route.highlights.map((h, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                width: 16,
                height: 1,
                backgroundColor: "var(--ochre)",
                flexShrink: 0,
                marginTop: 10,
              }}
              aria-hidden="true"
            />
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink)",
                opacity: 0.75,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {h}
            </p>
          </div>
        ))}
      </div>

      {/* Enquire CTA */}
      <div style={{ marginTop: 28 }}>
        <a
          href="#plan-trip"
          data-cursor-label="Enquire"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "var(--font-body)",
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--paper)",
            backgroundColor: "var(--indigo)",
            padding: "13px 24px",
            textDecoration: "none",
            cursor: "none",
            transition: "background-color 0.25s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor =
              "var(--ochre)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor =
              "var(--indigo)")
          }
        >
          Enquire about this route
        </a>
      </div>
    </motion.div>
  );
}

/**
 * Route line SVG — uses real projected lon/lat coordinates from ethiopiaMap.ts.
 * Points are looked up from the `places` array (pre-projected to MAP_VIEWBOX×MAP_VIEWBOX).
 * Scaled down to a 300×300 display viewBox that preserves true geographic relationships.
 */
function RouteLineSVG({ stops }: { stops: string[] }) {
  // Resolve each stop region → place → projected coordinate
  const points = stops
    .map((regionId) => {
      const region = regions.find((r) => r.id === regionId);
      if (!region) return null;
      const placeId = REGION_TO_PLACE[regionId];
      const place = places.find((p) => p.id === placeId);
      if (!place) return null;
      return {
        // Scale from portrait viewBox (MAP_VIEWBOX_W×MAP_VIEWBOX_H) to display size (300×420)
        x: (place.x / MAP_VIEWBOX_W) * 300,
        y: (place.y / MAP_VIEWBOX_H) * 420,
        name: region.name,
        numeral: region.geezNumeral,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  if (points.length < 2) return null;

  // Compute bounding box to crop the viewBox tightly around the route
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const pad = 20;
  const minX = Math.max(0, Math.min(...xs) - pad);
  const minY = Math.max(0, Math.min(...ys) - pad);
  const maxX = Math.min(300, Math.max(...xs) + pad);
  const maxY = Math.min(300, Math.max(...ys) + pad);
  const vbW = maxX - minX;
  const vbH = maxY - minY;

  // Build smooth quadratic bezier through all points
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` Q ${cpx} ${prev.y}, ${curr.x} ${curr.y}`;
  }

  return (
    <div style={{ marginBottom: 4 }}>
      <svg
        viewBox={`${minX} ${minY} ${vbW} ${vbH}`}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: 140,
          display: "block",
        }}
        aria-hidden="true"
        role="presentation"
      >
        {/* Animated dashed route line */}
        <motion.path
          d={d}
          fill="none"
          stroke="var(--ochre)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray="4 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: DURATION.scene,
            ease: "easeInOut",
            delay: DELAY.mount,
          }}
        />
        {/* Stop markers */}
        {points.map((pt, i) => (
          <g key={i}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r={4}
              fill="var(--paper)"
              stroke="var(--ochre)"
              strokeWidth={1.2}
            />
            <circle cx={pt.x} cy={pt.y} r={1.5} fill="var(--ochre)" />
            <text
              x={pt.x + 6}
              y={pt.y + 1}
              fontFamily="var(--font-body)"
              fontSize={6}
              fill="var(--ink)"
              opacity={0.65}
              letterSpacing="0.02em"
            >
              {pt.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

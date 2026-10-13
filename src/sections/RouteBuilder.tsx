import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { routes } from "@/data/routes";
import { findRoutes, type Interest } from "@/lib/routeScorer";
import { siteContent } from "@/data/content";
import { regions } from "@/data/regions";
import { getDestination, ETHIOPIA_BOUNDS } from "@/data/destinations";
import { projectToBox } from "@/lib/geo";
import { DURATION, EASE_FM, DELAY } from "@/lib/motion";

const ROUTE_BOX_W = 480;
const ROUTE_BOX_H = 560;

/**
 * Build Your Route — redesigned.
 *
 * Dark indigo background so it sits as a distinct section.
 * Compact header. Filter chips and duration selector side by side.
 * Results expand below the controls full-width:
 *   - Left: route card (name, stops, highlights, CTA)
 *   - Right: large route map with Ethiopia silhouette, numbered stops,
 *            animated draw-on line.
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
    setResults(null);
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

  const hasResults = results && results.length > 0;

  return (
    <section
      id="route-builder"
      role="region"
      aria-label="Build your Ethiopia itinerary"
      style={{
        backgroundColor: "var(--indigo)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ge'ez background decorator */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-8%",
          right: "-3%",
          fontFamily: "var(--font-geez)",
          fontSize: "clamp(200px, 32vw, 480px)",
          color: "var(--paper)",
          opacity: 0.03,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {routeBuilder.geezDecorator} {/* TODO-REVIEW */}
      </div>

      {/* ── Top controls bar ── */}
      <div
        style={{
          padding:
            "clamp(48px, 6vh, 72px) clamp(24px, 6vw, 80px) clamp(32px, 4vh, 48px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Label + Headline inline */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
            marginBottom: "clamp(28px, 4vh, 40px)",
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
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 1,
                  backgroundColor: "var(--ochre)",
                }}
              />
              {routeBuilder.sectionLabel}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: '"opsz" 72, "wght" 700',
                fontSize: "clamp(2rem, 4.5vw, 5rem)",
                color: "var(--paper)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              {routeBuilder.headline}
            </h2>
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(12px, 1vw, 14px)",
              color: "var(--paper)",
              opacity: 0.5,
              maxWidth: 340,
              lineHeight: 1.65,
            }}
          >
            {routeBuilder.subline}
          </p>
        </div>

        {/* Controls row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(16px, 3vw, 40px)",
            alignItems: "flex-end",
          }}
        >
          {/* Interest chips */}
          <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
            <legend
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--paper)",
                opacity: 0.4,
                marginBottom: 12,
                display: "block",
              }}
            >
              What draws you
            </legend>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
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
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      letterSpacing: "0.06em",
                      color: selected ? "var(--ink)" : "var(--paper)",
                      backgroundColor: selected
                        ? "var(--ochre)"
                        : "transparent",
                      border: `1px solid ${selected ? "var(--ochre)" : "rgba(241,234,217,0.25)"}`,
                      padding: "8px 16px",
                      cursor: "none",
                      transition: `background-color ${DURATION.micro}s ease, color ${DURATION.micro}s ease, border-color ${DURATION.micro}s ease`,
                    }}
                    onMouseEnter={(e) => {
                      if (!selected)
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "var(--ochre)";
                    }}
                    onMouseLeave={(e) => {
                      if (!selected)
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "rgba(241,234,217,0.25)";
                    }}
                  >
                    {interest.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Duration */}
          <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
            <legend
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--paper)",
                opacity: 0.4,
                marginBottom: 12,
                display: "block",
              }}
            >
              Length
            </legend>
            <div style={{ display: "flex", gap: 0 }}>
              {routeBuilder.durations.map(({ value, label }, i) => {
                const active = duration === value;
                return (
                  <button
                    key={value}
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      setDuration(value as 7 | 10 | 14);
                      setResults(null);
                    }}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontVariationSettings: active
                        ? '"opsz" 18, "wght" 600'
                        : '"opsz" 14, "wght" 300',
                      fontSize: "clamp(1.1rem, 2vw, 1.6rem)",
                      letterSpacing: "-0.01em",
                      color: active ? "var(--ink)" : "var(--paper)",
                      backgroundColor: active ? "var(--paper)" : "transparent",
                      border: "1px solid rgba(241,234,217,0.25)",
                      borderLeft:
                        i === 0 ? "1px solid rgba(241,234,217,0.25)" : "none",
                      padding: "10px clamp(14px, 2vw, 24px)",
                      cursor: "none",
                      transition: `background-color ${DURATION.micro}s ease, color ${DURATION.micro}s ease`,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Build button */}
          <button
            onClick={handleBuild}
            disabled={selectedInterests.length === 0}
            aria-label={`Find routes for ${duration} days`}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color:
                selectedInterests.length > 0 ? "var(--ink)" : "var(--paper)",
              backgroundColor:
                selectedInterests.length > 0 ? "var(--ochre)" : "transparent",
              border: `1px solid ${selectedInterests.length > 0 ? "var(--ochre)" : "rgba(241,234,217,0.2)"}`,
              padding: "12px 28px",
              cursor: selectedInterests.length > 0 ? "none" : "default",
              opacity: selectedInterests.length > 0 ? 1 : 0.35,
              transition: `all ${DURATION.micro}s ease`,
              alignSelf: "flex-end",
            }}
          >
            {routeBuilder.buildLabel}
          </button>
        </div>
      </div>

      {/* ── Results — full-width below controls ── */}
      <AnimatePresence>
        {hasResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.ui, ease: [...EASE_FM.outExpo] }}
          >
            {/* Route option tabs */}
            <div
              style={{
                padding: "0 clamp(24px, 6vw, 80px)",
                display: "flex",
                gap: 0,
                borderTop: "1px solid rgba(241,234,217,0.08)",
              }}
            >
              {results!.map((route, i) => (
                <button
                  key={route.id}
                  onClick={() => setActiveRoute(i)}
                  aria-selected={i === activeRoute}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: i === activeRoute ? "var(--ochre)" : "var(--paper)",
                    backgroundColor: "transparent",
                    border: "none",
                    borderBottom: `2px solid ${i === activeRoute ? "var(--ochre)" : "transparent"}`,
                    padding: "16px clamp(16px, 2vw, 28px)",
                    cursor: "none",
                    transition: `color ${DURATION.micro}s ease, border-color ${DURATION.micro}s ease`,
                    opacity: i === activeRoute ? 1 : 0.45,
                  }}
                >
                  {i + 1 === 1 ? "Best match" : `Option ${i + 1}`}
                </button>
              ))}
            </div>

            {/* Active route detail */}
            <AnimatePresence mode="wait">
              {results![activeRoute] && (
                <RouteDetail
                  key={results![activeRoute].id}
                  route={results![activeRoute]}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ── Route detail — two column: info left, big map right ──────────────────────

function RouteDetail({ route }: { route: ReturnType<typeof findRoutes>[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION.ui }}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr clamp(320px, 42vw, 560px)",
        minHeight: "clamp(420px, 55vh, 640px)",
        borderTop: "1px solid rgba(241,234,217,0.08)",
      }}
    >
      {/* Left — info panel */}
      <div
        style={{
          padding: "clamp(32px, 4vh, 52px) clamp(24px, 6vw, 80px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid rgba(241,234,217,0.08)",
        }}
      >
        {/* Route name + tagline */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ochre)",
              marginBottom: 10,
            }}
          >
            {route.duration} days · {route.difficulty}
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 48, "wght" 700',
              fontSize: "clamp(1.6rem, 3vw, 3rem)",
              color: "var(--paper)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: 10,
            }}
          >
            {route.name}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontVariationSettings: '"opsz" 18, "wght" 300',
              fontSize: "clamp(0.95rem, 1.4vw, 1.2rem)",
              color: "var(--paper)",
              opacity: 0.6,
              lineHeight: 1.5,
              marginBottom: "clamp(24px, 3vh, 36px)",
            }}
          >
            {route.tagline}
          </p>

          {/* Stops */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {route.stops.map((stop, i) => {
              const region = regions.find((r) => r.id === stop.regionId);
              return (
                <motion.div
                  key={stop.regionId}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: DURATION.ui }}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                    padding: "10px 0",
                    borderBottom:
                      i < route.stops.length - 1
                        ? "1px solid rgba(241,234,217,0.08)"
                        : "none",
                  }}
                >
                  {/* Numbered stop dot */}
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      border: "1px solid var(--ochre)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 9,
                        color: "var(--ochre)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--paper)",
                        marginBottom: 2,
                      }}
                    >
                      {region?.name ?? stop.regionId}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--paper)",
                        opacity: 0.5,
                        lineHeight: 1.5,
                      }}
                    >
                      {stop.nights} night{stop.nights !== 1 ? "s" : ""} ·{" "}
                      {stop.notes}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom: highlights + CTA */}
        <div style={{ marginTop: "clamp(20px, 3vh, 32px)" }}>
          {/* One highlight as a pull-quote */}
          {route.highlights[0] && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--paper)",
                opacity: 0.5,
                lineHeight: 1.65,
                marginBottom: 20,
                borderLeft: "2px solid var(--ochre)",
                paddingLeft: 14,
                fontStyle: "italic",
              }}
            >
              "{route.highlights[0]}"
            </p>
          )}

          <a
            href="/plan"
            data-cursor-label="Plan trip"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              fontFamily: "var(--font-body)",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink)",
              backgroundColor: "var(--ochre)",
              padding: "13px 24px",
              textDecoration: "none",
              cursor: "none",
              transition: `opacity ${DURATION.micro}s ease`,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "0.85")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "1")
            }
          >
            Enquire about this route
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M0 5H12M8 1L12 5L8 9"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Right — large route map */}
      <div
        style={{
          position: "relative",
          backgroundColor: "rgba(18,17,16,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(24px, 3vw, 40px)",
        }}
      >
        <RouteMapLarge
          stops={route.stops.map((s) => s.regionId)}
          routeName={route.name}
        />
      </div>
    </motion.div>
  );
}

// ── Large route map ──────────────────────────────────────────────────────────

function RouteMapLarge({
  stops,
  routeName,
}: {
  stops: string[];
  routeName: string;
}) {
  const points = stops
    .map((regionId) => {
      const region = regions.find((r) => r.id === regionId);
      const destination = getDestination(regionId);
      if (!region || !destination) return null;
      const { x, y } = projectToBox(
        { lat: destination.lat, lng: destination.lng },
        ETHIOPIA_BOUNDS,
        ROUTE_BOX_W,
        ROUTE_BOX_H,
      );
      return { x, y, name: destination.name, numeral: region.geezNumeral };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  if (points.length < 2) return null;

  // Tight viewBox around the route with generous padding
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const pad = 60;
  const minX = Math.max(0, Math.min(...xs) - pad);
  const minY = Math.max(0, Math.min(...ys) - pad);
  const maxX = Math.min(ROUTE_BOX_W, Math.max(...xs) + pad);
  const maxY = Math.min(ROUTE_BOX_H, Math.max(...ys) + pad);
  const vbW = Math.max(maxX - minX, 1);
  const vbH = Math.max(maxY - minY, 1);

  // Smooth bezier through stops
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` Q ${cpx} ${prev.y}, ${curr.x} ${curr.y}`;
  }

  return (
    <div style={{ width: "100%", maxWidth: 440 }}>
      {/* Route name above map */}
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 9,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--paper)",
          opacity: 0.35,
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        {routeName}
      </div>

      <svg
        viewBox={`${minX} ${minY} ${vbW} ${vbH}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label={`Route map: ${stops.join(" → ")}`}
        role="img"
      >
        {/* Faint grid lines for geography context */}
        {Array.from({ length: 5 }).map((_, i) => {
          const gx = minX + (vbW / 4) * i;
          return (
            <line
              key={`v${i}`}
              x1={gx}
              y1={minY}
              x2={gx}
              y2={minY + vbH}
              stroke="rgba(241,234,217,0.04)"
              strokeWidth={0.5}
            />
          );
        })}
        {Array.from({ length: 5 }).map((_, i) => {
          const gy = minY + (vbH / 4) * i;
          return (
            <line
              key={`h${i}`}
              x1={minX}
              y1={gy}
              x2={minX + vbW}
              y2={gy}
              stroke="rgba(241,234,217,0.04)"
              strokeWidth={0.5}
            />
          );
        })}

        {/* Shadow / glow under the line */}
        <motion.path
          d={d}
          fill="none"
          stroke="var(--ochre)"
          strokeWidth={8}
          strokeLinecap="round"
          opacity={0.08}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: DURATION.scene * 1.2,
            ease: "easeInOut",
            delay: DELAY.mount,
          }}
        />

        {/* Main dashed route line */}
        <motion.path
          d={d}
          fill="none"
          stroke="var(--ochre)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray="5 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: DURATION.scene,
            ease: "easeInOut",
            delay: DELAY.mount,
          }}
        />

        {/* Stop markers — numbered circles */}
        {points.map((pt, i) => (
          <g key={i}>
            {/* Outer glow ring on hover — always rendered, pulse on first/last */}
            {(i === 0 || i === points.length - 1) && (
              <circle
                cx={pt.x}
                cy={pt.y}
                r={14}
                fill="none"
                stroke="var(--ochre)"
                strokeWidth={0.5}
                opacity={0.25}
              >
                <animate
                  attributeName="r"
                  values="12;18;12"
                  dur="3s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.25;0;0.25"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
            )}

            {/* Circle background */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={10}
              fill="var(--indigo)"
              stroke="var(--ochre)"
              strokeWidth={1.5}
            />

            {/* Number */}
            <text
              x={pt.x}
              y={pt.y + 0.5}
              fontFamily="var(--font-body)"
              fontSize={8}
              fill="var(--ochre)"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {i + 1}
            </text>

            {/* Label — offset intelligently to avoid overlap */}
            <text
              x={pt.x + (i % 2 === 0 ? 16 : -16)}
              y={pt.y - 14}
              fontFamily="var(--font-body)"
              fontSize={8}
              fill="var(--paper)"
              opacity={0.75}
              letterSpacing="0.03em"
              textAnchor={i % 2 === 0 ? "start" : "end"}
            >
              {pt.name}
            </text>

            {/* Ge'ez numeral — large, ghosted, behind the marker */}
            <text
              x={pt.x}
              y={pt.y + 2}
              fontFamily="var(--font-geez)"
              fontSize={32}
              fill="var(--ochre)"
              opacity={0.04}
              textAnchor="middle"
              dominantBaseline="middle"
              aria-hidden="true"
            >
              {pt.numeral} {/* TODO-REVIEW */}
            </text>
          </g>
        ))}
      </svg>

      {/* Stop legend below map */}
      <div
        style={{
          marginTop: 16,
          display: "flex",
          flexWrap: "wrap",
          gap: "6px 16px",
          justifyContent: "center",
        }}
      >
        {points.map((pt, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                border: "1px solid var(--ochre)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 8,
                  color: "var(--ochre)",
                }}
              >
                {i + 1}
              </span>
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 10,
                color: "var(--paper)",
                opacity: 0.55,
                letterSpacing: "0.04em",
              }}
            >
              {pt.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

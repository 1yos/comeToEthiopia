import { motion } from "framer-motion";
import { siteContent } from "@/data/content";
import { DURATION, EASE_FM } from "@/lib/motion";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * Why travel with us — asymmetric, no icon cards.
 *
 * Layout: large headline left column, four points in a staggered right column.
 * Each point is a different width/indent — not a uniform list.
 * No icons. No three-equal-columns. Sharp edges.
 */
export function WhyUs() {
  const { whyUs } = siteContent;
  const isMobile = useIsMobile();
  return (
    <section
      id="why-us"
      role="region"
      aria-label="Why travel with Come to Ethiopia Tours"
      style={{
        backgroundColor: "var(--paper)",
        padding: "clamp(80px, 10vh, 140px) 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Large ochre numeral background */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-8%",
          left: "-2%",
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontVariationSettings: '"opsz" 144, "wght" 800',
          fontSize: "clamp(200px, 30vw, 440px)",
          lineHeight: 1,
          color: "var(--ink)",
          opacity: 0.03,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.05em",
        }}
      >
        ¿
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "clamp(32px, 6vw, 100px)",
          padding: "0 clamp(24px, 6vw, 80px)",
          alignItems: "start",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left: label + headline */}
        <div style={{ position: "sticky", top: 120 }}>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ochre)",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{ width: 32, height: 1, backgroundColor: "var(--ochre)" }}
            />
            {whyUs.sectionLabel}
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 72, "wght" 600',
              fontSize: "clamp(2.5rem, 5.5vw, 7rem)",
              color: "var(--ink)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              marginBottom: 24,
            }}
          >
            {whyUs.headline}
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1.2vw, 16px)",
              color: "var(--ink)",
              opacity: 0.65,
              lineHeight: 1.75,
              maxWidth: 400,
            }}
          >
            {whyUs.subline}
          </p>
        </div>

        {/* Right: four points — staggered, not uniform */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {whyUs.points.map((point, i) => {
            // Each point has a different left indent to break the grid feel
            const indents = ["0%", "8%", "0%", "12%"];
            const indent = indents[i % indents.length];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: DURATION.reveal,
                  delay: i * 0.12,
                  ease: [...EASE_FM.outExpo],
                }}
                style={{
                  paddingLeft: indent,
                  paddingTop: "clamp(28px, 4vh, 48px)",
                  paddingBottom: "clamp(28px, 4vh, 48px)",
                  borderBottom:
                    i < whyUs.points.length - 1
                      ? "1px solid rgba(18,17,16,0.08)"
                      : "none",
                }}
              >
                {/* Number — small, ochre */}
                <div
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    letterSpacing: "0.16em",
                    color: "var(--ochre)",
                    marginBottom: 12,
                  }}
                >
                  {"0" + (i + 1)}
                </div>

                {/* Point label — display size */}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontVariationSettings: '"opsz" 32, "wght" 600',
                    fontSize: "clamp(1.3rem, 2.2vw, 2rem)",
                    color: "var(--ink)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.015em",
                    marginBottom: 12,
                  }}
                >
                  {point.label}
                </h3>

                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(13px, 1.1vw, 15px)",
                    color: "var(--ink)",
                    opacity: 0.65,
                    lineHeight: 1.75,
                    maxWidth: 400,
                    margin: 0,
                  }}
                >
                  {point.body}
                </p>
              </motion.div>
            );
          })}

          {/* CTA — sharp, not rounded, not gradient */}
          <div
            style={{ paddingTop: "clamp(32px, 5vh, 56px)", paddingLeft: "8%" }}
          >
            <a
              href="/plan"
              data-magnetic
              data-cursor-label="Plan trip"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                fontFamily: "var(--font-body)",
                fontSize: 12,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--paper)",
                backgroundColor: "var(--ink)",
                padding: "14px 28px",
                textDecoration: "none",
                cursor: "none",
                border: "1px solid var(--ink)",
                transition: `background-color ${DURATION.ui}s ease, color ${DURATION.ui}s ease`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = "var(--ochre)";
                el.style.borderColor = "var(--ochre)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = "var(--ink)";
                el.style.borderColor = "var(--ink)";
              }}
            >
              Plan your trip
              <svg
                width="14"
                height="8"
                viewBox="0 0 14 8"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M0 4H12M9 1L12 4L9 7"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

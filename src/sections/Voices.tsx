import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { siteContent } from "@/data/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DURATION, EASE_FM, STAGGER, SCROLL } from "@/lib/motion";
import { useIsMobile } from "@/hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

/**
 * Voices — horizontal scroll typographic section.
 * Type-only (no images). Broadsheet feel.
 * Scrub value comes from motion.ts for consistent pacing.
 * All TODO-REVIEW flags on Amharic/Ge'ez text are preserved.
 */
export function Voices() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { voices } = siteContent;

  useEffect(() => {
    if (reduced || !trackRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const totalWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${totalWidth}`,
          scrub: SCROLL.horizontalScrubMin, // from SCROLL config in motion.ts
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
      id="voices"
      role="region"
      aria-label="Ethiopian language and culture"
      style={{ backgroundColor: "var(--ink)" }}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "stretch",
          width: isMobile ? "100%" : "max-content",
          minHeight: "100vh",
        }}
      >
        {/* ── Column 0: Section intro ── */}
        <div
          style={{
            width: "40vw",
            minWidth: 320,
            flexShrink: 0,
            padding: "clamp(80px, 10vh, 120px) clamp(32px, 5vw, 64px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            borderRight: "1px solid rgba(241,234,217,0.08)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--ochre)",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{ width: 32, height: 1, backgroundColor: "var(--ochre)" }}
            />
            {voices.sectionLabel}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 72, "wght" 600',
              fontSize: "clamp(2.5rem, 5vw, 6rem)",
              color: "var(--paper)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              marginBottom: 20,
            }}
          >
            {voices.headline}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1.2vw, 15px)",
              color: "var(--paper)",
              opacity: 0.55,
              maxWidth: 360,
              lineHeight: 1.7,
            }}
          >
            {voices.subline}
          </p>
          <div
            style={{
              marginTop: 48,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
            aria-hidden="true"
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--paper)",
                opacity: 0.3,
              }}
            >
              Keep scrolling
            </span>
            <span
              style={{
                display: "block",
                width: 40,
                height: 1,
                backgroundColor: "var(--ochre)",
                opacity: 0.5,
              }}
            />
          </div>
        </div>

        {/* ── Column 1: Phrases ── */}
        <div
          style={{
            width: "42vw",
            minWidth: 360,
            flexShrink: 0,
            padding: "clamp(80px, 10vh, 120px) clamp(32px, 4vw, 60px)",
            borderRight: "1px solid rgba(241,234,217,0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "clamp(28px, 3vh, 44px)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ochre)",
              marginBottom: 8,
            }}
          >
            Before you arrive {/* TODO-REVIEW */}
          </div>
          {voices.phrases.map((phrase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{
                duration: DURATION.reveal,
                delay: i * STAGGER.normal,
                ease: [...EASE_FM.outExpo],
              }}
              style={{
                borderBottom: "1px solid rgba(241,234,217,0.08)",
                paddingBottom: "clamp(20px, 2.5vh, 36px)",
              }}
            >
              <div
                className="geez"
                style={{
                  fontFamily: "var(--font-geez)",
                  fontSize: "clamp(2rem, 4vw, 4.5rem)",
                  color: "var(--paper)",
                  lineHeight: 1.1,
                  marginBottom: 6,
                }}
              >
                {phrase.amharic} {/* TODO-REVIEW */}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontVariationSettings: '"opsz" 14, "wght" 300',
                  fontSize: "clamp(1rem, 1.8vw, 1.6rem)",
                  color: "var(--ochre)",
                  marginBottom: 4,
                  letterSpacing: "0.02em",
                }}
              >
                {phrase.transliteration} {/* TODO-REVIEW */}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--paper)",
                  opacity: 0.6,
                  marginBottom: 4,
                }}
              >
                {phrase.meaning}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontStyle: "italic",
                  fontSize: 11,
                  color: "var(--paper)",
                  opacity: 0.35,
                }}
              >
                {phrase.context}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Column 2: Ordering coffee / practical notes ── */}
        <div
          style={{
            width: "52vw",
            minWidth: 400,
            flexShrink: 0,
            padding: "clamp(80px, 10vh, 120px) clamp(32px, 5vw, 72px)",
            borderRight: "1px solid rgba(241,234,217,0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 48,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ochre)",
            }}
          >
            On the road
          </div>

          {/* Three practical travel moments — typographically dominant */}
          {[
            {
              amharic: "ስንት ነው?" /* TODO-REVIEW */,
              roman: "Sint new?",
              meaning: "How much?",
              body: "Merkato, souvenir stalls, minibus fares. This question opens every negotiation and earns immediate respect.",
            },
            {
              amharic: "ጎበዝ" /* TODO-REVIEW */,
              roman: "Gobez",
              meaning: "Excellent.",
              body: "Say this about the injera. Say it about the view from Chenek. Say it whenever something impresses you. It will be said back to you.",
            },
            {
              amharic: "አይ ዋለ" /* TODO-REVIEW */,
              roman: "Aiwale",
              meaning: "No problem.",
              body: "The answer to almost everything that goes slightly wrong. The bus is late — aiwale. The coffee is strong — aiwale.",
            },
          ].map((item, i) => (
            <div key={i}>
              {/* Large Amharic */}
              <div
                className="geez"
                style={{
                  fontFamily: "var(--font-geez)",
                  fontSize: "clamp(2rem, 4vw, 5rem)",
                  color: "var(--paper)",
                  lineHeight: 1.1,
                  marginBottom: 8,
                  opacity: 0.9,
                }}
              >
                {item.amharic} {/* TODO-REVIEW */}
              </div>
              {/* Roman + meaning — large italic Fraunces */}
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontVariationSettings: '"opsz" 48, "wght" 400',
                  fontSize: "clamp(1.4rem, 2.5vw, 3rem)",
                  color: "var(--ochre)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  marginBottom: 10,
                }}
              >
                {item.roman} — {item.meaning}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--paper)",
                  opacity: 0.55,
                  lineHeight: 1.65,
                  maxWidth: 400,
                  margin: 0,
                }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>

        {/* ── Column 3: Coffee ceremony ── */}
        <div
          style={{
            width: "38vw",
            minWidth: 320,
            flexShrink: 0,
            padding: "clamp(80px, 10vh, 120px) clamp(32px, 4vw, 60px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ochre)",
              marginBottom: 28,
            }}
          >
            The coffee ceremony {/* TODO-REVIEW */}
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--paper)",
              opacity: 0.45,
              lineHeight: 1.65,
              marginBottom: 32,
            }}
          >
            Three rounds. Two hours minimum. Do not check your phone.
          </p>
          {voices.coffeeSteps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: DURATION.ui,
                delay: i * STAGGER.tight,
                ease: [...EASE_FM.outCubic],
              }}
              style={{
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
                paddingBottom: 20,
                marginBottom: 20,
                borderBottom:
                  i < voices.coffeeSteps.length - 1
                    ? "1px solid rgba(241,234,217,0.08)"
                    : "none",
              }}
            >
              <div
                className="geez"
                style={{
                  fontFamily: "var(--font-geez)",
                  fontSize: "1.8rem",
                  color: "var(--ochre)",
                  lineHeight: 1,
                  minWidth: 36,
                  opacity: 0.7,
                }}
                aria-hidden="true"
              >
                {["፩", "፪", "፫", "፬", "፭"][i] ?? String(step.step)}{" "}
                {/* TODO-REVIEW */}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--paper)",
                    marginBottom: 4,
                    fontWeight: 500,
                  }}
                >
                  {step.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontStyle: "italic",
                    fontSize: 11,
                    color: "var(--paper)",
                    opacity: 0.45,
                  }}
                >
                  {step.notes}
                </div>
                <div
                  className="geez"
                  style={{
                    fontFamily: "var(--font-geez)",
                    fontSize: "0.85rem",
                    color: "var(--ochre)",
                    opacity: 0.5,
                    marginTop: 4,
                  }}
                >
                  {step.amharic} {/* TODO-REVIEW */}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

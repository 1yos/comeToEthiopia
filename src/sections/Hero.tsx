import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEthiopianYear } from "@/hooks/useEthiopianDate";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { siteContent } from "@/data/content";
import { useI18n } from "@/hooks/useI18n";
import {
  DURATION,
  EASE,
  EASE_FM,
  STAGGER,
  DELAY,
  PARALLAX,
} from "@/lib/motion";
void (EASE_FM as unknown);

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero section.
 *
 * Layout (desktop):
 *   ┌─────────────────────────────────────────┐
 *   │  [PHOTO: Simien full-bleed]             │
 *   │                                         │
 *   │  ፩                 [cross detail photo] │
 *   │                                         │
 *   │  It is                                  │
 *   │  2019                                   │  ← giant, cropped by viewport
 *   │  here.                                  │
 *   │                                         │
 *   │  13 months · 4,500m · never colonised   │
 *   │                                         │
 *   │              [Plan your trip ↗]         │
 *   │                                         │
 *   │  ↓ Scroll                               │
 *   └─────────────────────────────────────────┘
 *
 * - Background photo parallaxes downward at 40% scroll speed
 * - Headline parallaxes upward at 25% scroll speed
 * - Ge'ez numeral parallaxes upward at 15% scroll speed (slower — creates depth)
 * - Overlay photo (cross detail) clips in from bottom on load
 */
export function Hero({
  audience: _audience,
  lang,
}: {
  audience: import("@/sections/AudienceChooser").AudienceMode;
  lang: import("@/App").Lang;
}) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const geezRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const ethiopianYear = useEthiopianYear();
  const { hero } = siteContent;
  const t = useI18n(lang);

  // Framer Motion scroll-linked parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", PARALLAX.heroBg]);
  const headY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", PARALLAX.heroHead],
  );
  const geezY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", PARALLAX.geezDecor],
  );

  // GSAP: staggered text reveal on mount (headline words split)
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-word",
        { y: "110%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: DURATION.hero,
          stagger: STAGGER.normal,
          ease: EASE.outExpo,
          delay: DELAY.postLoad,
        },
      );
      gsap.fromTo(
        ".hero-subline",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DURATION.reveal,
          ease: EASE.outCubic,
          delay: DELAY.secondary,
        },
      );
      gsap.fromTo(
        ".hero-cta",
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DURATION.ui,
          ease: EASE.outCubic,
          delay: DELAY.tertiary,
        },
      );
      gsap.fromTo(
        ".hero-photo-overlay",
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: DURATION.scene,
          ease: EASE.outExpo,
          delay: DELAY.postLoad,
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      role="region"
      aria-label="Hero: Come to Ethiopia"
      style={{
        position: "relative",
        height: "100svh",
        minHeight: 600,
        overflow: "hidden",
        backgroundColor: "var(--indigo)",
      }}
    >
      {/* ── Background photo (parallax layer) ── */}
      <motion.div
        ref={bgRef}
        style={{ y: reduced ? 0 : bgY, position: "absolute", inset: "-20% 0" }}
        aria-hidden="true"
        className="hero-bg-layer"
      >
        {/* Hero background — Simien Mountains */}
        <img
          src="/media/regions/Simien-Mountains-Ethiopia-Tours-and-Travel-Packages-480.webp"
          alt="The Simien escarpment at golden hour, looking north toward Ras Dashen"
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
            objectPosition: "center 30%",
          }}
        />
        {/* Dark gradient overlay — bottom-up, so headline is always readable */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(18,17,16,0.85) 0%, rgba(18,17,16,0.3) 50%, rgba(18,17,16,0.15) 100%)",
          }}
        />
      </motion.div>

      {/* ── Ge'ez giant decorator (parallax, behind headline) ── */}
      <motion.div
        ref={geezRef}
        style={{ y: reduced ? 0 : geezY }}
        aria-hidden="true"
        className="geez"
      >
        <span
          style={{
            position: "absolute",
            top: "8%",
            right: "-2vw",
            fontSize: "clamp(160px, 28vw, 380px)",
            lineHeight: 1,
            color: "var(--paper)",
            opacity: 0.06,
            fontFamily: "var(--font-geez)",
            fontWeight: 900,
            userSelect: "none",
            pointerEvents: "none",
            letterSpacing: "-0.05em",
          }}
        >
          ኢትዮጵያ {/* TODO-REVIEW */}
        </span>
      </motion.div>

      {/* ── Overlay photo: Lalibela cross detail — hidden on mobile ── */}
      <div
        ref={overlayRef}
        className="hero-photo-overlay"
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "12%",
          right: "clamp(24px, 6vw, 80px)",
          width: "clamp(120px, 16vw, 240px)",
          aspectRatio: "4/5",
          clipPath: "inset(100% 0 0 0)",
          zIndex: 3,
          display: "var(--hero-overlay-display, block)",
        }}
      >
        {/* Overlay photo: Lalibela church */}
        <img
          src="/media/tours/Lalibela-Ethiopia-Tours-480.webp"
          alt="A Lalibela rock-hewn church, 12th century"
          width={750}
          height={500}
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        {/* Handwritten annotation */}
        <HandwrittenAnnotation text="12th century" position="bottom-left" />
      </div>

      {/* ── Main content ── */}
      <motion.div
        ref={headRef}
        style={{ y: reduced ? 0 : headY }}
        className="hero-content"
      >
        <div
          style={{
            position: "absolute",
            bottom: "clamp(60px, 10vh, 120px)",
            left: "clamp(24px, 7vw, 100px)",
            right: "clamp(24px, 7vw, 80px)",
            zIndex: 4,
          }}
        >
          {/* Section marker */}
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ochre)",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 32,
                height: 1,
                backgroundColor: "var(--ochre)",
              }}
            />
            Africa's oldest nation
          </div>

          {/* Headline — split into overflow-hidden spans for word reveal */}
          <h1
            aria-label={`It is ${ethiopianYear} here. ${hero.headlineSubline}`}
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 144, "wght" 700',
              fontSize: "clamp(4rem, 12vw, 11rem)",
              lineHeight: 0.95,
              color: "var(--paper)",
              marginBottom: "clamp(20px, 3vh, 40px)",
              letterSpacing: "-0.03em",
            }}
          >
            {/* Each word wrapped in overflow:hidden so gsap y-translation clips */}
            {["It is", ethiopianYear, "here."].map((word, i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  overflow: "hidden",
                  lineHeight: 1.05,
                }}
              >
                <span
                  className="hero-word"
                  style={{
                    display: "block",
                    // Year is ochre, rest is paper
                    color: i === 1 ? "var(--ochre)" : "var(--paper)",
                    // The year is italic to give it editorial weight
                    fontStyle: i === 1 ? "italic" : "normal",
                  }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          {/* Subline */}
          <p
            className="hero-subline"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1.4vw, 17px)",
              color: "var(--paper)",
              opacity: 0.75,
              maxWidth: 480,
              lineHeight: 1.65,
              marginBottom: "clamp(28px, 4vh, 48px)",
              letterSpacing: "0.01em",
            }}
          >
            {hero.headlineSubline}
          </p>

          {/* CTA button */}
          <div className="hero-cta">
            <a
              href={hero.ctaHref}
              data-magnetic
              data-cursor-label="Let's go"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                fontFamily: "var(--font-body)",
                fontSize: 13,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--ink)",
                backgroundColor: "var(--paper)",
                padding: "14px 28px",
                textDecoration: "none",
                cursor: "none",
                border: "1px solid transparent",
                transition:
                  "background-color 0.3s, color 0.3s, border-color 0.3s",
                // Sharp corner — not rounded
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = "transparent";
                el.style.color = "var(--paper)";
                el.style.borderColor = "var(--paper)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = "var(--paper)";
                el.style.color = "var(--ink)";
                el.style.borderColor = "transparent";
              }}
            >
              {t.heroCta}
              <ArrowRight />
            </a>
          </div>
        </div>
      </motion.div>

      {/* ── Scroll cue ── */}
      <ScrollCue />

      {/* ── Altitude annotation (far bottom-right, handwritten style) ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "clamp(60px, 10vh, 120px)",
          right: "clamp(24px, 6vw, 80px)",
          paddingRight: "calc(clamp(120px, 16vw, 240px) + 20px)",
          zIndex: 5,
        }}
      >
        <HandwrittenAnnotation
          text={hero.annotation.text}
          position="bottom-right"
        />
      </div>
    </section>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg
      width="16"
      height="10"
      viewBox="0 0 16 10"
      fill="none"
      aria-hidden="true"
      style={{ transition: "transform 0.3s ease" }}
    >
      <path
        d="M0 5H14M10 1L14 5L10 9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ScrollCue() {
  return (
    <div
      aria-label="Scroll to continue"
      style={{
        position: "absolute",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--paper)",
          opacity: 0.45,
        }}
      >
        Scroll
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: DURATION.scene,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
        style={{
          width: 1,
          height: 40,
          backgroundColor: "var(--ochre)",
          opacity: 0.6,
        }}
      />
    </div>
  );
}

/**
 * Handwritten-style SVG annotation for photos.
 * Renders as an absolute-positioned label with a hand-drawn underline.
 */
function HandwrittenAnnotation({
  text,
  position,
}: {
  text: string;
  position: "bottom-left" | "bottom-right" | "top-left" | "top-right";
}) {
  const posStyle: React.CSSProperties =
    position === "bottom-left"
      ? { bottom: 8, left: 8 }
      : position === "bottom-right"
        ? { bottom: 8, right: 8 }
        : position === "top-left"
          ? { top: 8, left: 8 }
          : { top: 8, right: 8 };

  return (
    <div
      style={{
        position: "absolute",
        ...posStyle,
        display: "flex",
        flexDirection: "column",
        alignItems: position.includes("right") ? "flex-end" : "flex-start",
        gap: 3,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <span
        style={{
          fontFamily: '"Fraunces", Georgia, serif',
          fontStyle: "italic",
          fontVariationSettings: '"opsz" 9, "wght" 300',
          fontSize: 11,
          color: "var(--paper)",
          opacity: 0.85,
          letterSpacing: "0.02em",
        }}
      >
        {text}
      </span>
      {/* Hand-drawn underline SVG */}
      <svg
        width="80"
        height="6"
        viewBox="0 0 80 6"
        fill="none"
        style={{ opacity: 0.7 }}
      >
        <path
          d="M2 4 C15 2, 30 5, 45 3 C60 1, 70 4, 78 3"
          stroke="var(--ochre)"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

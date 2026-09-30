import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEthiopianDate } from "@/hooks/useEthiopianDate";
import { useKonami } from "@/hooks/useKonami";
import { siteContent } from "@/data/content";
import { DURATION, EASE_FM, STAGGER } from "@/lib/motion";
import { useI18n } from "@/hooks/useI18n";

/**
 * Footer.
 * - "Made in Addis" note — specific, not decorative
 * - Live Ethiopian date, computed in code
 * - Social/contact links
 * - Hidden easter egg: typing "buna" triggers a coffee-pour animation
 * - Copyright + tagline
 */
export function Footer({ lang }: { lang: import("@/App").Lang }) {
  const t = useI18n(lang);
  const ethDate = useEthiopianDate();
  const [eggTriggered, setEggTriggered] = useState(false);
  const { footer } = siteContent;

  const triggerEgg = useCallback(() => {
    setEggTriggered(true);
    setTimeout(() => setEggTriggered(false), 4000);
  }, []);

  useKonami("buna", triggerEgg);

  return (
    <footer
      role="contentinfo"
      style={{
        backgroundColor: "var(--ink)",
        color: "var(--paper)",
        padding:
          "clamp(64px, 8vh, 100px) clamp(24px, 6vw, 80px) clamp(32px, 5vh, 56px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Ge'ez decorator */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-3%",
          fontFamily: "var(--font-geez)",
          fontSize: "clamp(160px, 28vw, 400px)",
          color: "var(--paper)",
          opacity: 0.025,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        ኢትዮጵያ {/* TODO-REVIEW */}
      </div>

      {/* Coffee pour easter egg */}
      <AnimatePresence>
        {eggTriggered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: DURATION.ui, ease: [...EASE_FM.outExpo] }}
            role="status"
            aria-live="polite"
            aria-label="You found the coffee easter egg"
            style={{
              position: "fixed",
              bottom: "clamp(24px, 4vh, 48px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9990,
              backgroundColor: "var(--ochre)",
              color: "var(--paper)",
              padding: "16px 28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 20px 60px rgba(18,17,16,0.5)",
            }}
          >
            <CoffeePourAnimation />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontVariationSettings: '"opsz" 14, "wght" 400',
                fontSize: "1.1rem",
                color: "var(--paper)",
              }}
            >
              ቡና — Buna. {/* TODO-REVIEW */}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                opacity: 0.75,
                letterSpacing: "0.08em",
              }}
            >
              Three rounds. Always three.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 40,
          alignItems: "flex-end",
          marginBottom: "clamp(48px, 6vh, 80px)",
          borderBottom: "1px solid rgba(241,234,217,0.08)",
          paddingBottom: "clamp(48px, 6vh, 80px)",
        }}
      >
        {/* Tagline */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 72, "wght" 500',
              fontStyle: "italic",
              fontSize: "clamp(1.8rem, 4vw, 5rem)",
              color: "var(--paper)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 12,
            }}
          >
            {footer.tagline}
          </p>
          <a
            href="#plan-trip"
            data-cursor-label="Plan trip"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--paper)",
              textDecoration: "none",
              borderBottom: "1px solid rgba(241,234,217,0.3)",
              paddingBottom: 3,
              cursor: "none",
              transition: "border-color 0.2s",
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
            Plan your trip
          </a>
        </div>

        {/* Links */}
        <nav aria-label="Footer links">
          <ul
            role="list"
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              alignItems: "flex-end",
            }}
          >
            {footer.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--paper)",
                    textDecoration: "none",
                    opacity: 0.55,
                    cursor: "none",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.opacity = "1")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.opacity = "0.55")
                  }
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        {/* Left: Made in Addis + copyright */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "var(--paper)",
              opacity: 0.45,
              letterSpacing: "0.06em",
            }}
          >
            {footer.madeIn}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "var(--paper)",
              opacity: 0.3,
              letterSpacing: "0.06em",
            }}
          >
            {footer.copyright} {new Date().getFullYear()}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 10,
              color: "var(--paper)",
              opacity: 0.2,
              letterSpacing: "0.04em",
            }}
          >
            Map data: geoBoundaries CC-BY 4.0 · Photos: Come to Ethiopia Tours
          </span>
        </div>

        {/* Center: Ethiopian date */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
          aria-label={`Today in Addis: ${ethDate.formatted}`}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ochre)",
              opacity: 0.7,
            }}
          >
            {t.todayInAddis}
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontVariationSettings: '"opsz" 14, "wght" 300',
              fontSize: "clamp(0.9rem, 1.5vw, 1.3rem)",
              color: "var(--paper)",
              opacity: 0.7,
            }}
          >
            {ethDate.formatted}
          </span>
          <span
            className="geez"
            style={{
              fontFamily: "var(--font-geez)",
              fontSize: "0.8rem",
              color: "var(--paper)",
              opacity: 0.3,
            }}
            aria-hidden="true"
          >
            {/* Ge'ez script day name */}
            {ethDate.dayOfWeek} {/* TODO-REVIEW */}
          </span>
        </div>

        {/* Right: easter egg hint (invisible — discoverable only) */}
        <div
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 9,
            letterSpacing: "0.12em",
            color: "var(--paper)",
            opacity: 0.08,
            userSelect: "none",
          }}
          title="Try typing something"
        >
          ᴮᵁᴺᴬ
        </div>
      </div>
    </footer>
  );
}

/** Coffee pour SVG animation for the easter egg */
function CoffeePourAnimation() {
  return (
    <svg
      width="48"
      height="60"
      viewBox="0 0 48 60"
      fill="none"
      aria-hidden="true"
      role="presentation"
    >
      {/* Jebena pot (clay coffee pot) */}
      <ellipse
        cx="24"
        cy="48"
        rx="14"
        ry="8"
        fill="var(--paper)"
        opacity={0.15}
      />
      <path
        d="M 14 48 C 12 38, 10 30, 14 24 C 18 18, 30 18, 34 24 C 38 30, 36 38, 34 48"
        stroke="var(--paper)"
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
      />
      {/* Spout */}
      <path
        d="M 34 30 C 40 28, 44 24, 44 20"
        stroke="var(--paper)"
        strokeWidth={1.2}
        fill="none"
        strokeLinecap="round"
      />
      {/* Pour stream */}
      <motion.path
        d="M 44 20 C 44 14, 42 10, 40 6"
        stroke="var(--paper)"
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.8 }}
        transition={{ duration: DURATION.ui, ease: "easeOut" }}
      />
      {/* Steam */}
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M ${20 + i * 4} 18 C ${19 + i * 4} 12, ${22 + i * 4} 8, ${20 + i * 4} 4`}
          stroke="var(--paper)"
          strokeWidth={0.8}
          fill="none"
          strokeLinecap="round"
          opacity={0.3}
          initial={{ pathLength: 0, y: 4 }}
          animate={{ pathLength: 1, y: 0 }}
          transition={{
            duration: DURATION.reveal,
            delay: 0.3 + i * STAGGER.tight,
            ease: "easeOut",
          }}
        />
      ))}
    </svg>
  );
}

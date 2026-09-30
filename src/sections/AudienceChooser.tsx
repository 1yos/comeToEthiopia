import { useCallback } from "react";
import { motion } from "framer-motion";
import { siteContent } from "@/data/content";
import { DURATION, EASE_FM } from "@/lib/motion";

export type AudienceMode = "visitor" | "local";

interface AudienceChooserProps {
  onChoose: (mode: AudienceMode) => void;
  current: AudienceMode;
}

/**
 * AudienceChooser — "Who is this for?" section.
 *
 * Bug fix: CSS `transition` on `grid-template-columns` is not supported in
 * most browsers and causes the grid to silently collapse.
 * Replaced with a simple flex layout — dominant panel grows, subordinate shrinks.
 * Framer Motion handles the width animation (it can animate flex values via JS).
 *
 * Layout: two side-by-side panels. Dominant panel is wider.
 * Which is dominant switches on click. No min-height wrapper.
 */
export function AudienceChooser({ onChoose, current }: AudienceChooserProps) {
  const { audienceChooser } = siteContent;

  const handleKey = useCallback(
    (mode: AudienceMode) => (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") onChoose(mode);
    },
    [onChoose],
  );

  const panels: {
    mode: AudienceMode;
    label: string;
    sub: string;
    cta: string;
    subAmharic?: string;
    bg: string;
    textColor: string;
  }[] = [
    {
      mode: "visitor",
      label: audienceChooser.optionA.label,
      sub: audienceChooser.optionA.sub,
      cta: audienceChooser.optionA.cta,
      bg: "var(--indigo)",
      textColor: "var(--paper)",
    },
    {
      mode: "local",
      label: audienceChooser.optionB.label,
      sub: audienceChooser.optionB.sub,
      cta: audienceChooser.optionB.cta,
      subAmharic: audienceChooser.optionB.subAmharic,
      bg: "var(--highland)",
      textColor: "var(--paper)",
    },
  ];

  return (
    <section
      id="who-is-this-for"
      role="region"
      aria-label="Choose how you want to explore the tours"
      style={{
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        minHeight: "clamp(260px, 38vh, 440px)",
      }}
    >
      {panels.map((panel) => {
        const isActive = current === panel.mode;

        return (
          <motion.div
            key={panel.mode}
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
            aria-label={`${panel.label}: ${panel.sub}`}
            onClick={() => onChoose(panel.mode)}
            onKeyDown={handleKey(panel.mode)}
            animate={{ flex: isActive ? 3 : 1 }}
            transition={{
              duration: DURATION.scene,
              ease: [...EASE_FM.inOutCubic],
            }}
            style={{
              position: "relative",
              padding: "clamp(40px, 6vw, 80px) clamp(28px, 4vw, 64px)",
              backgroundColor: isActive ? panel.bg : "var(--paper)",
              cursor: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              overflow: "hidden",
              borderRight:
                panel.mode === "visitor"
                  ? "1px solid rgba(18,17,16,0.08)"
                  : "none",
              flexShrink: 0,
              minWidth: 0,
              transition: `background-color ${DURATION.ui}s ease`,
            }}
            data-cursor-label="Choose"
          >
            {/* Large Ge'ez letter background decoration */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-10%",
                right: "-5%",
                fontFamily: "var(--font-geez)",
                fontSize: "clamp(120px, 22vw, 280px)",
                lineHeight: 1,
                color: isActive ? "var(--paper)" : "var(--ink)",
                opacity: 0.06,
                userSelect: "none",
                pointerEvents: "none",
                fontWeight: 900,
              }}
            >
              {panel.mode === "visitor" ? "ሀ" : "ለ"} {/* TODO-REVIEW */}
            </span>

            {/* Content */}
            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Label above heading */}
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: isActive ? "var(--ochre)" : "var(--ink)",
                  opacity: 0.6,
                  marginBottom: 12,
                }}
              >
                {audienceChooser.sectionLabel}
              </div>

              {/* Amharic sub-label for local mode */}
              {panel.subAmharic && (
                <div
                  className="geez"
                  style={{
                    fontFamily: "var(--font-geez)",
                    fontSize: "clamp(0.9rem, 1.5vw, 1.2rem)",
                    color: isActive ? "var(--paper)" : "var(--ink)",
                    opacity: 0.55,
                    marginBottom: 6,
                    letterSpacing: "0.02em",
                  }}
                >
                  {panel.subAmharic} {/* TODO-REVIEW */}
                </div>
              )}

              {/* Main heading */}
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontVariationSettings: '"opsz" 72, "wght" 700',
                  fontSize: isActive
                    ? "clamp(2rem, 4.5vw, 5.5rem)"
                    : "clamp(1.1rem, 2vw, 2.4rem)",
                  color: isActive ? panel.textColor : "var(--ink)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.025em",
                  marginBottom: 14,
                  transition: `font-size ${DURATION.scene}s ease, color ${DURATION.ui}s ease`,
                }}
              >
                {panel.label}
              </h2>

              {/* Sub text — only visible when active */}
              <motion.p
                animate={{
                  opacity: isActive ? 1 : 0,
                  height: isActive ? "auto" : 0,
                }}
                transition={{
                  duration: DURATION.ui,
                  ease: [...EASE_FM.outCubic],
                }}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(12px, 1.1vw, 15px)",
                  color: panel.textColor,
                  opacity: 0,
                  lineHeight: 1.65,
                  maxWidth: 380,
                  marginBottom: 24,
                  overflow: "hidden",
                }}
              >
                {panel.sub}
              </motion.p>

              {/* CTA — only when active */}
              {isActive && (
                <motion.a
                  href="#popular-tours"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: DURATION.ui,
                    delay: 0.15,
                    ease: [...EASE_FM.outExpo],
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--ink)",
                    backgroundColor: "var(--paper)",
                    padding: "11px 22px",
                    textDecoration: "none",
                    cursor: "none",
                  }}
                >
                  {panel.cta}
                </motion.a>
              )}
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}

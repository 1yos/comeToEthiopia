import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { regions } from "@/data/regions";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { siteContent } from "@/data/content";
import { DURATION } from "@/lib/motion";

/**
 * Destination story section — time-driven slideshow.
 *
 * Advances automatically every AUTO_INTERVAL ms.
 * Users can navigate forward/backward with arrow buttons or the dot indicators.
 * Pauses auto-advance while hovered (desktop) or when reduced-motion is set.
 *
 * Each scene keeps its own layout and transition — Simien, Lalibela, Addis,
 * Omo, Danakil all look different. Framer Motion handles the enter/exit
 * animations using the same character as the previous scroll approach.
 */

const AUTO_INTERVAL = 6000; // ms per slide

/** Map region imageSlot filename → processed 480w WebP path */
const REGION_IMAGE_PATHS: Record<string, string> = {
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

function RegionPhoto({
  region,
  style,
}: {
  region: (typeof regions)[0];
  style?: React.CSSProperties;
}) {
  const src = REGION_IMAGE_PATHS[region.imageSlot];
  if (!src) {
    return (
      <div
        className="photo-slot"
        data-photo={region.imageDescription}
        role="img"
        aria-label={region.imageDescription}
        style={{ width: "100%", height: "100%", ...style }}
      />
    );
  }
  return (
    <img
      src={src}
      alt={region.imageDescription}
      width={750}
      height={500}
      loading="lazy"
      decoding="async"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
        display: "block",
        ...style,
      }}
    />
  );
}

// Per-scene Framer Motion variants — each scene has its own character
const SCENE_VARIANTS = {
  0: {
    // Simien — slides in from right
    enter: { opacity: 0, x: "6%" },
    center: { opacity: 1, x: "0%" },
    exit: { opacity: 0, x: "-5%" },
  },
  1: {
    // Lalibela — clips up from bottom
    enter: { opacity: 0, clipPath: "inset(100% 0 0 0)" },
    center: { opacity: 1, clipPath: "inset(0% 0 0 0)" },
    exit: { opacity: 0, clipPath: "inset(0% 0 100% 0)" },
  },
  2: {
    // Addis — gentle scale
    enter: { opacity: 0, scale: 0.97 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
  },
  3: {
    // Omo — slides in from left
    enter: { opacity: 0, x: "-6%" },
    center: { opacity: 1, x: "0%" },
    exit: { opacity: 0, x: "5%" },
  },
  4: {
    // Danakil — slow zoom out
    enter: { opacity: 0, scale: 1.04 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.97 },
  },
};

export function ScrollStory() {
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = regions.length;

  const goTo = useCallback(
    (idx: number) => {
      setCurrent(((idx % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  // Auto-advance
  useEffect(() => {
    if (reduced || paused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(next, AUTO_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [reduced, paused, next]);

  // Progress bar width for current slide
  const progressKey = `${current}-${paused ? "paused" : "running"}`;

  const transition = {
    duration: reduced ? 0 : DURATION.scene,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  return (
    <section
      id="scroll-story"
      role="region"
      aria-label="Journey through Ethiopia north to south"
      style={{
        position: "relative",
        height: "100svh",
        minHeight: 480,
        overflow: "hidden",
        backgroundColor: "var(--indigo)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slides ── */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={current}
          variants={
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (SCENE_VARIANTS as any)[current] ?? SCENE_VARIANTS[0]
          }
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          style={{ position: "absolute", inset: 0 }}
          aria-label={`Slide ${current + 1} of ${total}: ${regions[current].name}`}
        >
          <SceneLayout region={regions[current]} index={current} />
        </motion.div>
      </AnimatePresence>

      {/* ── Section label ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 80,
          left: "clamp(24px, 5vw, 64px)",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          style={{ width: 24, height: 1, backgroundColor: "var(--ochre)" }}
        />
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ochre)",
          }}
        >
          {siteContent.scrollStory.sectionLabel}
        </span>
      </div>

      {/* ── Navigation controls ── */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(28px, 5vh, 48px)",
          left: "clamp(24px, 5vw, 64px)",
          right: "clamp(24px, 5vw, 64px)",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: "clamp(12px, 2vw, 24px)",
        }}
      >
        {/* Prev button */}
        <NavButton
          direction="prev"
          onClick={prev}
          label="Previous destination"
        />

        {/* Dot indicators + progress */}
        <div
          role="tablist"
          aria-label="Destination slides"
          style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}
        >
          {regions.map((r, i) => (
            <button
              key={r.id}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to ${r.name}`}
              onClick={() => goTo(i)}
              style={{
                position: "relative",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "none",
                height: 20,
                display: "flex",
                alignItems: "center",
                flex: i === current ? "1 1 auto" : "0 0 auto",
                transition: `flex ${DURATION.scene}s cubic-bezier(0.16,1,0.3,1)`,
                minWidth: i === current ? 60 : 20,
              }}
            >
              {/* Track */}
              <div
                style={{
                  width: "100%",
                  height: i === current ? 2 : 1,
                  backgroundColor:
                    i === current ? "transparent" : "rgba(241,234,217,0.25)",
                  borderRadius: 1,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {i === current && (
                  <motion.div
                    key={progressKey}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: reduced || paused ? 0 : AUTO_INTERVAL / 1000,
                      ease: "linear",
                    }}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      backgroundColor: "var(--ochre)",
                    }}
                  />
                )}
              </div>

              {/* Dot (inactive slides) */}
              {i !== current && (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%,-50%)",
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    backgroundColor: "rgba(241,234,217,0.35)",
                    transition: `background-color ${DURATION.micro}s ease`,
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Next button */}
        <NavButton direction="next" onClick={next} label="Next destination" />

        {/* Slide counter */}
        <div
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--paper)",
            opacity: 0.4,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </div>
      </div>
    </section>
  );
}

// ── Navigation arrow button ──────────────────────────────────────────────────

function NavButton({
  direction,
  onClick,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      data-cursor-label={direction === "next" ? "Next" : "Prev"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 44,
        flexShrink: 0,
        background: "none",
        border: "1px solid rgba(241,234,217,0.25)",
        cursor: "none",
        color: "var(--paper)",
        transition: `border-color ${DURATION.micro}s ease, background-color ${DURATION.micro}s ease`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--ochre)";
        el.style.backgroundColor = "rgba(184,116,42,0.12)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(241,234,217,0.25)";
        el.style.backgroundColor = "transparent";
      }}
    >
      <svg
        width="16"
        height="12"
        viewBox="0 0 16 12"
        fill="none"
        aria-hidden="true"
        style={{ transform: direction === "prev" ? "scaleX(-1)" : "none" }}
      >
        <path
          d="M0 6H14M9 1L14 6L9 11"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

// ── Scene layouts (unchanged from original) ──────────────────────────────────

function SceneLayout({
  region,
  index,
}: {
  region: (typeof regions)[0];
  index: number;
}) {
  switch (index) {
    case 0:
      return <SceneSimien region={region} />;
    case 1:
      return <SceneLalibela region={region} />;
    case 2:
      return <SceneAddis region={region} />;
    case 3:
      return <SceneOmo region={region} />;
    case 4:
      return <SceneDanakil region={region} />;
    default:
      return null;
  }
}

function SceneSimien({ region }: { region: (typeof regions)[0] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "55% 1fr",
        height: "100%",
        backgroundColor: "var(--indigo)",
      }}
    >
      <RegionPhoto region={region} style={{ height: "100%" }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(40px, 5vw, 80px) clamp(32px, 4vw, 64px)",
        }}
      >
        <SceneText
          region={region}
          accentColor="var(--indigo)"
          textColor="var(--paper)"
        />
      </div>
      <GeezBackground
        numeral={region.geezNumeral}
        right="5%"
        top="auto"
        bottom="-5%"
      />
    </div>
  );
}

function SceneLalibela({ region }: { region: (typeof regions)[0] }) {
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        backgroundColor: "var(--ink)",
      }}
    >
      <RegionPhoto region={region} style={{ position: "absolute", inset: 0 }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(18,17,16,0.85) 0%, transparent 60%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "clamp(48px, 8vh, 100px)",
          left: "clamp(24px, 6vw, 80px)",
          maxWidth: "clamp(300px, 42vw, 560px)",
          backgroundColor: "var(--ochre)",
          padding: "clamp(28px, 3vw, 48px)",
        }}
      >
        <SceneText
          region={region}
          accentColor="var(--paper)"
          textColor="var(--ink)"
          subTextColor="var(--ink)"
        />
      </div>
      <GeezBackground numeral={region.geezNumeral} right="8%" top="15%" />
    </div>
  );
}

function SceneAddis({ region }: { region: (typeof regions)[0] }) {
  return (
    <div
      style={{
        height: "100%",
        backgroundColor: "var(--paper)",
        display: "grid",
        gridTemplateColumns:
          "clamp(48px, 8vw, 96px) 1fr clamp(48px, 8vw, 96px)",
        alignItems: "center",
        padding: "clamp(80px, 10vh, 120px) clamp(24px, 6vw, 80px)",
        gap: "clamp(24px, 3vw, 48px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", paddingTop: 8 }}>
        <span
          className="geez"
          style={{
            fontFamily: "var(--font-geez)",
            fontSize: "clamp(3rem, 8vw, 9rem)",
            color: "var(--ochre)",
            lineHeight: 1,
            fontWeight: 700,
          }}
          aria-hidden="true"
        >
          {region.geezNumeral}
        </span>
      </div>
      <div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--highland)",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{ width: 24, height: 1, backgroundColor: "var(--highland)" }}
          />
          {region.name}
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontVariationSettings: '"opsz" 72, "wght" 600',
            fontSize: "clamp(2rem, 4.5vw, 5.5rem)",
            color: "var(--ink)",
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            marginBottom: 28,
          }}
        >
          {region.tagline}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(14px, 1.3vw, 17px)",
            color: "var(--ink)",
            lineHeight: 1.75,
            opacity: 0.85,
            marginBottom: 20,
          }}
        >
          {region.story}
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(13px, 1.1vw, 15px)",
            color: "var(--ink)",
            lineHeight: 1.7,
            opacity: 0.65,
            borderLeft: "2px solid var(--highland)",
            paddingLeft: 16,
          }}
        >
          {region.details}
        </p>
      </div>
      <div
        style={{ borderLeft: "1px solid rgba(18,17,16,0.12)", paddingLeft: 24 }}
      >
        <SceneMeta region={region} textColor="var(--ink)" />
      </div>
    </div>
  );
}

function SceneOmo({ region }: { region: (typeof regions)[0] }) {
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        backgroundColor: "var(--ink)",
      }}
    >
      <RegionPhoto
        region={region}
        style={{
          position: "absolute",
          top: 0,
          right: "-4%",
          width: "65%",
          height: "100%",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(18,17,16,0.92) 0%, rgba(18,17,16,0.6) 45%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "clamp(60px, 12vh, 130px)",
          left: "clamp(24px, 6vw, 80px)",
          maxWidth: "clamp(280px, 38vw, 480px)",
        }}
      >
        <SceneText
          region={region}
          accentColor="var(--sulphur)"
          textColor="var(--paper)"
        />
      </div>
      <GeezBackground
        numeral={region.geezNumeral}
        left="-2%"
        bottom="-8%"
        color="var(--sulphur)"
      />
    </div>
  );
}

function SceneDanakil({ region }: { region: (typeof regions)[0] }) {
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        backgroundColor: "var(--ink)",
      }}
    >
      <RegionPhoto region={region} style={{ position: "absolute", inset: 0 }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(18,17,16,0.92) 0%, rgba(18,17,16,0.3) 50%, rgba(18,17,16,0.7) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "clamp(80px, 12vh, 150px)",
          left: "clamp(24px, 8vw, 120px)",
          maxWidth: "clamp(300px, 50vw, 640px)",
        }}
      >
        <SceneText
          region={region}
          accentColor="var(--sulphur)"
          textColor="var(--paper)"
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: "clamp(24px, 5vw, 64px)",
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontVariationSettings: '"opsz" 12, "wght" 300',
          fontSize: "clamp(2rem, 6vw, 7rem)",
          color: "var(--sulphur)",
          opacity: 0.15,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        {region.altitude}
      </div>
      <GeezBackground
        numeral={region.geezNumeral}
        right="-2%"
        bottom="-5%"
        color="var(--sulphur)"
      />
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────

function SceneText({
  region,
  accentColor,
  textColor,
  subTextColor,
}: {
  region: (typeof regions)[0];
  accentColor: string;
  textColor: string;
  subTextColor?: string;
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <span
          className="geez"
          style={{
            fontFamily: "var(--font-geez)",
            fontSize: "clamp(1.5rem, 3vw, 3rem)",
            color: accentColor,
            lineHeight: 1,
          }}
          aria-label={`Scene ${region.geezNumeral}`}
        >
          {region.geezNumeral}
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: accentColor,
            opacity: 0.8,
          }}
        >
          {region.name}
        </span>
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontVariationSettings: '"opsz" 48, "wght" 600',
          fontSize: "clamp(1.6rem, 3.5vw, 4rem)",
          color: textColor,
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
          marginBottom: 20,
        }}
      >
        {region.tagline}
      </h2>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(13px, 1.2vw, 16px)",
          color: subTextColor ?? textColor,
          opacity: 0.8,
          lineHeight: 1.7,
          marginBottom: 24,
        }}
      >
        {region.story}
      </p>
      <SceneMeta
        region={region}
        textColor={textColor}
        accentColor={accentColor}
        compact
      />
    </>
  );
}

function SceneMeta({
  region,
  textColor,
  accentColor,
  compact = false,
}: {
  region: (typeof regions)[0];
  textColor: string;
  accentColor?: string;
  compact?: boolean;
}) {
  const items = [
    { label: "Best season", value: region.bestSeason },
    { label: "Getting there", value: region.howToGetThere },
    { label: "Days needed", value: region.daysNeeded },
    ...(region.altitude ? [{ label: "Altitude", value: region.altitude }] : []),
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: compact ? 10 : 18,
      }}
    >
      {items.map(({ label, value }) => (
        <div key={label}>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 9,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: accentColor ?? textColor,
              opacity: 0.6,
              marginBottom: 3,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: compact ? 12 : 13,
              color: textColor,
              opacity: 0.85,
              lineHeight: 1.5,
            }}
          >
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}

function GeezBackground({
  numeral,
  right,
  left,
  top,
  bottom,
  color = "var(--paper)",
}: {
  numeral: string;
  right?: string;
  left?: string;
  top?: string;
  bottom?: string;
  color?: string;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        right,
        left,
        top: top ?? "auto",
        bottom: bottom ?? "auto",
        zIndex: 0,
        pointerEvents: "none",
        userSelect: "none",
        fontFamily: "var(--font-geez)",
        fontSize: "clamp(180px, 35vw, 480px)",
        lineHeight: 1,
        color,
        opacity: 0.05,
        fontWeight: 900,
      }}
    >
      {numeral}
    </div>
  );
}

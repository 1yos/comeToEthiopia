import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { regions } from "@/data/regions";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { siteContent } from "@/data/content";
import { EASE, SCROLL } from "@/lib/motion";

// vh of scroll distance allocated per scene (used only for pin sizing)
const SCENE_VH = SCROLL.pinScrollPerSceneVh;

gsap.registerPlugin(ScrollTrigger);

/** Map region imageSlot filename â†’ processed 480w WebP path */
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

/** Shared region photo <img> â€” replaces all photo-slot divs */
function RegionPhoto({
  region,
  style,
}: {
  region: (typeof regions)[0];
  style?: React.CSSProperties;
}) {
  const src = REGION_IMAGE_PATHS[region.imageSlot];
  if (!src) {
    // Fallback placeholder until real photo is supplied
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

/**
 * Pinned scroll-story section: 5 scenes moving north â†’ south.
 * Simien â†’ Lalibela â†’ Addis â†’ Omo â†’ Danakil
 *
 * Each scene has a DIFFERENT layout and transition â€” not a template:
 *   á© Simien:  Full-bleed photo left, text right, enters with a horizontal wipe
 *   áª Lalibela: Full-bleed photo top, text bottom-left overlapping, enters with clip-path from bottom
 *   á« Addis:   Type-only, broadsheet column layout, enters with staggered lines
 *   á¬ Omo:     Split: photo bleeds right edge, text offset lower-left, enters with scale+opacity
 *   á­ Danakil: Full-width, text above photo, Ge'ez giant background, enters with fade + slow zoom
 *
 * The pinned container is 100vh Ã— (scenes Ã— 100vh) tall so each scene gets
 * its own scroll beat.
 */
export function ScrollStory() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const scenesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      const scenes = scenesRef.current;
      const totalVh = (regions.length - 1) * SCENE_VH;

      // Pin the sticky wrapper for the full scroll distance
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${totalVh}vh`,
        pin: stickyRef.current,
        pinSpacing: true,
      });

      // First scene: visible immediately, no animation needed
      if (scenes[0]) {
        gsap.set(scenes[0], { opacity: 1, x: 0, y: 0, clipPath: "none" });
      }

      // Each scene transition is scrubbed to scroll position.
      // ENTER_FRACTION controls how much of the scene's scroll range is used
      // for the transition. 1.5 = 150% of the scene height.
      const ENTER_FRACTION = 1.5;

      scenes.forEach((scene, i) => {
        if (!scene || i === 0) return;

        const enterVars = getEnterVars(i);
        const exitVars = getExitVars(i - 1);
        const prevScene = scenes[i - 1];

        const sceneStartVh = i * SCENE_VH;
        const enterEndVh = sceneStartVh + SCENE_VH * ENTER_FRACTION;

        // Set initial state before this scene enters
        gsap.set(scene, enterVars.from);

        // Scrubbed ENTER
        gsap
          .timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: `top+=${sceneStartVh}vh top`,
              end: `top+=${enterEndVh}vh top`,
              scrub: 6,
            },
          })
          .to(scene, { ...enterVars.to, ease: EASE.outCubic });

        // Scrubbed EXIT of previous scene
        if (prevScene) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: containerRef.current,
                start: `top+=${sceneStartVh}vh top`,
                end: `top+=${enterEndVh}vh top`,
                scrub: 6,
              },
            })
            .to(prevScene, { ...exitVars, ease: EASE.inOutCubic });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reduced]);


  return (
    <div
      ref={containerRef}
      id="scroll-story"
      role="region"
      aria-label="Journey through Ethiopia north to south"
    >
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "var(--indigo)",
        }}
      >
        {/* Section label â€” visible across all scenes */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 80,
            left: "clamp(24px, 5vw, 64px)",
            zIndex: 10,
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

        {/* Scenes stack on top of each other â€” GSAP handles visibility */}
        {regions.map((region, i) => (
          <div
            key={region.id}
            ref={(el) => {
              if (el) scenesRef.current[i] = el;
            }}
            style={{
              position: "absolute",
              inset: 0,
              opacity: i === 0 ? 1 : 0,
            }}
            aria-hidden={i !== 0}
            role="article"
            aria-label={`Scene ${i + 1}: ${region.name}`}
          >
            <SceneLayout region={region} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}

// â”€â”€ Scene layout variants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SceneLayout({
  region,
  index,
}: {
  region: (typeof regions)[0];
  index: number;
}) {
  // Each scene gets a fundamentally different layout
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

/** á© Simien â€” Photo left, text right, indigo background */
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
      {/* Photo: full-height left column */}
      <RegionPhoto region={region} style={{ height: "100%" }} />
      {/* Text: right column */}
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
      {/* Ge'ez numeral behind text */}
      <GeezBackground
        numeral={region.geezNumeral}
        right="5%"
        top="auto"
        bottom="-5%"
      />
    </div>
  );
}

/** áª Lalibela â€” Full-bleed photo, text overlapping bottom-left */
function SceneLalibela({ region }: { region: (typeof regions)[0] }) {
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        backgroundColor: "var(--ink)",
      }}
    >
      {/* Full-bleed photo â€” Lalibela */}
      <RegionPhoto region={region} style={{ position: "absolute", inset: 0 }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(18,17,16,0.85) 0%, transparent 60%)",
        }}
      />
      {/* Text: bottom-left, overlapping photo */}
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

/** á« Addis â€” Type-only, broadsheet layout, paper background */
function SceneAddis({ region }: { region: (typeof regions)[0] }) {
  return (
    <div
      style={{
        height: "100%",
        backgroundColor: "var(--paper)",
        display: "grid",
        gridTemplateColumns: "1fr 2fr 1fr",
        alignItems: "center",
        padding: "clamp(80px, 10vh, 120px) clamp(24px, 6vw, 80px)",
        gap: "clamp(24px, 3vw, 48px)",
      }}
    >
      {/* Left: Ge'ez numeral column */}
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
      {/* Center: editorial text column */}
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
      {/* Right: metadata column */}
      <div
        style={{ borderLeft: "1px solid rgba(18,17,16,0.12)", paddingLeft: 24 }}
      >
        <SceneMeta region={region} textColor="var(--ink)" />
      </div>
    </div>
  );
}

/** á¬ Omo â€” Photo bleeds off right edge, text offset lower-left */
function SceneOmo({ region }: { region: (typeof regions)[0] }) {
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        backgroundColor: "var(--ink)",
      }}
    >
      {/* Photo: large, positioned right, bleeds off edge â€” Omo */}
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
      {/* Gradient: left to right */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(18,17,16,0.92) 0%, rgba(18,17,16,0.6) 45%, transparent 70%)",
        }}
      />
      {/* Text: lower-left, offset from vertical center */}
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

/** á­ Danakil â€” Full width, text above full-bleed photo, slow zoom */
function SceneDanakil({ region }: { region: (typeof regions)[0] }) {
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        backgroundColor: "var(--ink)",
      }}
    >
      {/* Photo: full-bleed â€” Danakil */}
      <RegionPhoto region={region} style={{ position: "absolute", inset: 0 }} />
      {/* Heavy top gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(18,17,16,0.92) 0%, rgba(18,17,16,0.3) 50%, rgba(18,17,16,0.7) 100%)",
        }}
      />
      {/* Text: centered horizontally, upper third */}
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
      {/* Bottom detail: altitude */}
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

// â”€â”€ Shared sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
      {/* Region name + numeral */}
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
        <div>
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
      </div>

      {/* Tagline / headline */}
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

      {/* Story */}
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

      {/* Meta strip */}
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

// â”€â”€ Enter / exit animation variants per scene â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function getEnterVars(i: number): { from: gsap.TweenVars; to: gsap.TweenVars } {
  switch (i % 5) {
    case 0: // Simien â€” wipe from right
      return {
        from: { opacity: 0, x: "8%" },
        to: { opacity: 1, x: "0%" },
      };
    case 1: // Lalibela â€” clip-path from bottom
      return {
        from: { opacity: 0, clipPath: "inset(100% 0 0 0)" },
        to: { opacity: 1, clipPath: "inset(0% 0 0 0)" },
      };
    case 2: // Addis â€” fade + slight scale up
      return {
        from: { opacity: 0, scale: 0.97 },
        to: { opacity: 1, scale: 1 },
      };
    case 3: // Omo â€” slide from left
      return {
        from: { opacity: 0, x: "-6%" },
        to: { opacity: 1, x: "0%" },
      };
    case 4: // Danakil â€” fade + slow zoom out
      return {
        from: { opacity: 0, scale: 1.04 },
        to: { opacity: 1, scale: 1 },
      };
    default:
      return { from: { opacity: 0 }, to: { opacity: 1 } };
  }
}

function getExitVars(i: number): gsap.TweenVars {
  switch (i % 5) {
    case 0:
      return { opacity: 0, x: "-5%" };
    case 1:
      return { opacity: 0, clipPath: "inset(0% 0 100% 0)" };
    case 2:
      return { opacity: 0, scale: 1.02 };
    case 3:
      return { opacity: 0, x: "5%" };
    case 4:
      return { opacity: 0, scale: 0.97 };
    default:
      return { opacity: 0 };
  }
}

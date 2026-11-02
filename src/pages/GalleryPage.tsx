import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSeo } from "@/hooks/useSeo";
import {
  PageHero,
  HeroLabel,
  HeroHeadline,
  HeroSub,
} from "@/components/PageHero";
import { siteContent } from "@/data/content";
import { DURATION, EASE_FM } from "@/lib/motion";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * GalleryPage — editorial contact-sheet layout.
 *
 * Desktop: handcrafted rows, each with a different proportion mix.
 * Photos fill edge-to-edge with a 3px gap. No card borders. No white space.
 * Hover: subtle caption slides in from bottom.
 * Click: full-screen lightbox with keyboard navigation (← → Esc).
 *
 * Mobile: single column, full-width, stacked naturally.
 *
 * Filter chips: All · Landscapes · People & Culture
 */

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  region: string;
  category: "landscape" | "culture";
}

const ALL_IMAGES: GalleryImage[] = [
  // ── Landscapes ──────────────────────────────────────────────────────────
  {
    src: "/media/regions/Simien-Mountains-Ethiopia-Tours-and-Travel-Packages-480.webp",
    alt: "Simien Mountains escarpment at golden hour, northern Ethiopia",
    caption: "Simien Mountains",
    region: "4,543m · Northern Highlands",
    category: "landscape",
  },
  {
    src: "/media/tours/3-Day-Expedition-to-Dallol-Salt-Flats-Danakil-Depression-Erta-Ale-Volcano-480.webp",
    alt: "Dallol hydrothermal field, acid pools and sulphur formations, Danakil Depression",
    caption: "Dallol",
    region: "−125m · Danakil Depression",
    category: "landscape",
  },
  {
    src: "/media/regions/Erta-Ale-Volcano-Ethiopia-Tours-and-Holiday-Packages-480.webp",
    alt: "Erta Ale lava lake at night, Afar region, Ethiopia",
    caption: "Erta Ale lava lake",
    region: "Afar · Active since 1906",
    category: "landscape",
  },
  {
    src: "/media/regions/Gonder-Fasiledes-Mountains-Ethiopia-Tour-Travel-Package-480.webp",
    alt: "Fasiledes castle walls at golden hour, Gondar, northern Ethiopia",
    caption: "Gondar — Fasiledes Castle",
    region: "17th century · Northern Ethiopia",
    category: "landscape",
  },
  {
    src: "/media/tours/Ethiopian-Wolf-Canis-Simensis-Bale-480.jpg",
    alt: "Ethiopian wolf portrait, Bale Mountains National Park, rare canid",
    caption: "Ethiopian wolf",
    region: "Bale Mountains · ~500 in the wild",
    category: "landscape",
  },
  {
    src: "/media/tours/Lalibela-Ethiopia-Tours-480.webp",
    alt: "Lalibela rock-hewn churches, Amhara region, northern Ethiopia",
    caption: "Lalibela",
    region: "12th century · 2,630m",
    category: "landscape",
  },
  {
    src: "/media/tours/3-Day-Tour-of-Lalibel-Yemrehanna-Kristos-Hiking-to-Asheton-Maryam-480.webp",
    alt: "Yemrehanna Kristos cave church, northern Ethiopia",
    caption: "Yemrehanna Kristos",
    region: "Cave church · 12th century",
    category: "landscape",
  },
  {
    src: "/media/regions/Bale-Mountains-Ethiopia-Tour-Travel-Package-480.webp",
    alt: "Bale Mountains National Park, Ethiopian highlands plateau",
    caption: "Bale Mountains",
    region: "Sanetti Plateau · 4,000m",
    category: "landscape",
  },
  {
    src: "/media/tours/Ethiopian-Wolf-Bale-Mountains-Sanetti-Plateau-480.jpg",
    alt: "Ethiopian wolf on Sanetti Plateau, Bale Mountains National Park",
    caption: "Ethiopian wolf",
    region: "Sanetti Plateau · ~500 remaining",
    category: "landscape",
  },
  {
    src: "/media/tours/Sof-Omar-Cave-Underground-River-Ethiopia-Tours-480.jpg",
    alt: "Sof Omar cave underground river, Weyib River, Bale region, Ethiopia",
    caption: "Sof Omar cave",
    region: "Weyib River · 15km of chambers",
    category: "landscape",
  },
  {
    src: "/media/tours/Harar-City-Wall-Historic-Ethiopia-Tours-480.jpg",
    alt: "Harar Jugol city wall at dusk, UNESCO walled city, eastern Ethiopia",
    caption: "Harar — Jugol wall",
    region: "16th century · 3.5km of wall",
    category: "landscape",
  },
  {
    src: "/media/tours/Sof-Omar-Cave-Ethiopia-Tours-480.jpg",
    alt: "Sof Omar cave chambers, Weyib River carved limestone, Bale region",
    caption: "Sof Omar cave",
    region: "Largest cave in Africa · Bale",
    category: "landscape",
  },

  {
    src: "/media/tours/Debre-Libanos-Monastery-Ethiopia-Tours-480.jpg",
    alt: "Debre Libanos monastery, 13th century, north of Addis Ababa",
    caption: "Debre Libanos",
    region: "13th century monastery",
    category: "landscape",
  },
  {
    src: "/media/tours/Blue-Nile-Gorge-Portuguese-Bridge-Ethiopia-Tours-480.jpg",
    alt: "Blue Nile Gorge below Portuguese Bridge, near Debre Libanos, Ethiopia",
    caption: "Blue Nile Gorge",
    region: "Near Debre Libanos",
    category: "landscape",
  },
  {
    src: "/media/tours/Tiya-Stelae-UNESCO-Ethiopia-Tours-480.jpg",
    alt: "Tiya UNESCO stelae field, 14th-century carved standing stones, south Ethiopia",
    caption: "Tiya stelae",
    region: "UNESCO · 14th century",
    category: "landscape",
  },
  {
    src: "/media/tours/Awash-National-Park-Oryx-Ethiopia-Tours-480.jpg",
    alt: "Beisa oryx at Awash National Park, Ethiopia",
    caption: "Awash National Park",
    region: "Beisa oryx · 460 bird species",
    category: "landscape",
  },
  {
    src: "/media/regions/Axum-Aksum-Historical-Attractions-of-Ethiopia-Tours-and-Travel-Holidays-480.webp",
    alt: "Axum obelisks and ancient stelae, Tigray region, northern Ethiopia",
    caption: "Axum stelae",
    region: "Ancient capital · 3,000 years",
    category: "landscape",
  },

  {
    src: "/media/tours/Lake-Ziway-Birds-Ethiopia-Rift-Valley-Tours-480.jpg",
    alt: "Egyptian goose at Lake Ziway, Ethiopian Rift Valley",
    caption: "Lake Ziway",
    region: "Rift Valley · Bird Island",
    category: "landscape",
  },
  {
    src: "/media/tours/Rift-Valley-Lake-Hawassa-Ethiopia-Tours-480.jpg",
    alt: "Lake Hawassa, Ethiopian Rift Valley",
    caption: "Lake Hawassa",
    region: "Rift Valley · Southern Ethiopia",
    category: "landscape",
  },
  // ── People & Culture ────────────────────────────────────────────────────
  {
    src: "/media/regions/Omo-Valley-Tribe-Ethiopia-Tour-Travel-Package-480.webp",
    alt: "Omo Valley tribeswomen in traditional dress, southern Ethiopia",
    caption: "Omo Valley",
    region: "Southern Ethiopia",
    category: "culture",
  },

  {
    src: "/media/tours/Konso-Stone-Terraces-Ethiopia-Tours-480.jpg",
    alt: "Konso stone terraces and fortified village, UNESCO World Heritage, southern Ethiopia",
    caption: "Konso terraces",
    region: "UNESCO · 400+ year tradition",
    category: "culture",
  },
  {
    src: "/media/tours/Dorze-Bamboo-Village-Arba-Minch-Ethiopia-Tours-480.jpg",
    alt: "Dorze beehive bamboo house, above Arba Minch, southern Ethiopia",
    caption: "Dorze village",
    region: "Above Arba Minch",
    category: "culture",
  },
  {
    src: "/media/tours/Addis-Ababa-Coffee-Ceremony-Ethiopia-Tours-480.jpg",
    alt: "Ethiopian coffee ceremony, clay pot and cups, Addis Ababa",
    caption: "Coffee ceremony",
    region: "Three rounds · Abol, Tona, Baraka",
    category: "culture",
  },
  {
    src: "/media/tours/Harar-Walled-City-Ethiopia-Tours-480.jpg",
    alt: "Harar Gate, UNESCO walled city, eastern Ethiopia",
    caption: "Harar Gate",
    region: "16th century walls · 82 mosques",
    category: "culture",
  },
  {
    src: "/media/tours/Harar-City-Wall-Historic-Ethiopia-Tours-480.jpg",
    alt: "Harar walled city with Jugol wall, UNESCO, eastern Ethiopia",
    caption: "Harar — Jugol Wall",
    region: "4th holiest city in Islam",
    category: "culture",
  },
  {
    src: "/media/tours/Lake-Hawassa-Fish-Market-Ethiopia-Tours-480.jpg",
    alt: "Hawassa fish market at dawn, pelicans and fishermen, Ethiopia",
    caption: "Hawassa fish market",
    region: "6am · Pelicans included",
    category: "culture",
  },
  {
    src: "/media/tours/Half-Day-Addis-Ababa-Tour-to-National-Museum-Trinity-Cathedral-Merkato-480.webp",
    alt: "Addis Ababa city tour, Trinity Cathedral and Merkato",
    caption: "Addis Ababa",
    region: "2,355m · Capital city",
    category: "culture",
  },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "landscape", label: "Landscapes" },
  { id: "culture", label: "People & Culture" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

/**
 * Row layouts — each row is a different proportion mix.
 * Numbers represent flex weights (like CSS flex-grow).
 * Repeats every 7 rows to create rhythm without feeling mechanical.
 */
const ROW_LAYOUTS = [
  [3, 2], // wide-left + portrait
  [1, 1, 1, 1], // four equal — but different heights break uniformity
  [2, 3], // portrait + wide-right
  [2, 1, 2], // two mediums with a narrow centre
  [3, 2], // wide-left again (offset by height variation)
  [1, 2, 1], // narrow + wide + narrow
  [2, 2, 1], // two mediums + narrow
];

const ROW_HEIGHTS = [
  "clamp(300px, 38vh, 480px)",
  "clamp(220px, 28vh, 340px)",
  "clamp(340px, 44vh, 520px)",
  "clamp(260px, 32vh, 400px)",
  "clamp(300px, 38vh, 480px)",
  "clamp(360px, 46vh, 540px)",
  "clamp(240px, 30vh, 380px)",
];

export function GalleryPage() {
  const { meta } = siteContent;
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState<FilterId>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useSeo({
    title: `Gallery — ${meta.title}`,
    description:
      "Photos from across Ethiopia — Simien Mountains, Danakil Depression, Lalibela, Omo Valley, Gondar and more.",
    canonical: "/gallery",
  });

  const visible =
    filter === "all"
      ? ALL_IMAGES
      : ALL_IMAGES.filter((img) => img.category === filter);

  const openLightbox = useCallback(
    (index: number) => setLightboxIndex(index),
    [],
  );
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(
    () =>
      setLightboxIndex((i) =>
        i !== null ? (i - 1 + visible.length) % visible.length : null,
      ),
    [visible.length],
  );
  const nextImage = useCallback(
    () =>
      setLightboxIndex((i) => (i !== null ? (i + 1) % visible.length : null)),
    [visible.length],
  );

  // Build rows from the filtered image list
  const buildRows = (images: GalleryImage[]) => {
    const rows: GalleryImage[][] = [];
    let idx = 0;
    let rowIdx = 0;
    while (idx < images.length) {
      const layout = ROW_LAYOUTS[rowIdx % ROW_LAYOUTS.length];
      const count = layout.length;
      rows.push(images.slice(idx, idx + count));
      idx += count;
      rowIdx++;
    }
    return rows;
  };

  const rows = buildRows(visible);

  return (
    <>
      <PageHero
        imgSrc="/media/regions/Simien-Mountains-Ethiopia-Tours-and-Travel-Packages-480.webp"
        imgAlt="Simien Mountains escarpment at golden hour, northern Ethiopia"
        gradientDir="down"
        darkness={0.7}
        imgPosition="center 38%"
      >
        <HeroLabel>Gallery</HeroLabel>
        <HeroHeadline>Ethiopia in photographs.</HeroHeadline>
        <HeroSub>
          Every photo taken on a tour we run. Simien to Danakil. Lalibela to the
          Omo.
        </HeroSub>
      </PageHero>

      {/* Filter + count bar */}
      <div
        style={{
          backgroundColor: "var(--ink)",
          padding: "clamp(18px, 2.5vh, 28px) clamp(24px, 5vw, 60px)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(20px, 3vw, 40px)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 4 }}>
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "8px 18px",
                  backgroundColor: active
                    ? "var(--ochre)"
                    : "rgba(241,234,217,0.08)",
                  color: active ? "var(--ink)" : "var(--paper)",
                  border: "none",
                  cursor: "none",
                  transition: `background-color ${DURATION.micro}s ease, color ${DURATION.micro}s ease`,
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "rgba(241,234,217,0.14)";
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "rgba(241,234,217,0.08)";
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-body)",
            fontSize: 9,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--paper)",
            opacity: 0.3,
          }}
        >
          {visible.length} photos
        </span>
      </div>

      {/* Gallery wall */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.ui }}
          style={{
            backgroundColor: "var(--ink)",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {isMobile
            ? /* Mobile: single column */
              visible.map((img, i) => (
                <GalleryCell
                  key={img.src}
                  img={img}
                  globalIndex={ALL_IMAGES.indexOf(img)}
                  height="clamp(240px, 56vw, 360px)"
                  onClick={() => openLightbox(i)}
                />
              ))
            : /* Desktop: editorial rows */
              rows.map((row, ri) => {
                const layout = ROW_LAYOUTS[ri % ROW_LAYOUTS.length];
                const height = ROW_HEIGHTS[ri % ROW_HEIGHTS.length];

                // Calculate offset — how many images came before this row
                let offset = 0;
                for (let j = 0; j < ri; j++) {
                  offset += ROW_LAYOUTS[j % ROW_LAYOUTS.length].length;
                }

                return (
                  <div
                    key={ri}
                    style={{
                      display: "flex",
                      gap: 3,
                      height,
                    }}
                  >
                    {row.map((img, ci) => (
                      <div key={img.src} style={{ flex: layout[ci] ?? 1 }}>
                        <GalleryCell
                          img={img}
                          globalIndex={ALL_IMAGES.indexOf(img)}
                          height="100%"
                          onClick={() => openLightbox(offset + ci)}
                          stagger={ci}
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
        </motion.div>
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            img={visible[lightboxIndex]}
            total={visible.length}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Gallery cell ──────────────────────────────────────────────────────────────

function GalleryCell({
  img,
  height,
  onClick,
  stagger = 0,
}: {
  img: GalleryImage;
  globalIndex: number;
  height: string;
  onClick: () => void;
  stagger?: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-4%" }}
      transition={{
        duration: DURATION.reveal,
        delay: stagger * 0.05,
        ease: [...EASE_FM.outExpo],
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`View: ${img.caption}`}
      style={{
        position: "relative",
        overflow: "hidden",
        height,
        width: "100%",
        backgroundColor: "var(--indigo)",
        cursor: "none",
        padding: 0,
        border: "none",
        display: "block",
      }}
    >
      <img
        src={img.src}
        alt={img.alt}
        width={750}
        height={500}
        loading="lazy"
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 40%",
          transition: `transform ${DURATION.scene}s cubic-bezier(${EASE_FM.outCubic.join(",")})`,
          transform: hovered ? "scale(1.06)" : "scale(1)",
        }}
      />

      {/* Subtle darkening on hover */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: DURATION.micro }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(18,17,16,0.75) 0%, rgba(18,17,16,0.1) 55%)",
          pointerEvents: "none",
        }}
      />

      {/* Caption — slides up on hover */}
      <motion.div
        animate={{ y: hovered ? 0 : 16, opacity: hovered ? 1 : 0 }}
        transition={{ duration: DURATION.ui, ease: [...EASE_FM.outExpo] }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "clamp(12px, 1.8vw, 20px)",
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontVariationSettings: '"opsz" 18, "wght" 600',
            fontSize: "clamp(0.82rem, 1.1vw, 1rem)",
            color: "var(--paper)",
            margin: 0,
            marginBottom: 2,
            lineHeight: 1.2,
          }}
        >
          {img.caption}
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(8px, 0.8vw, 10px)",
            letterSpacing: "0.1em",
            color: "var(--ochre)",
            margin: 0,
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          {img.region}
        </p>
      </motion.div>

      {/* Expand icon — top right on hover */}
      <motion.div
        animate={{ opacity: hovered ? 0.6 : 0, scale: hovered ? 1 : 0.8 }}
        transition={{ duration: DURATION.micro }}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 28,
          height: 28,
          backgroundColor: "rgba(18,17,16,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M1 5V1h4M7 1h4v4M11 7v4H7M5 11H1V7" />
        </svg>
      </motion.div>
    </motion.button>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────

function Lightbox({
  img,
  total,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  img: GalleryImage;
  total: number;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9990,
        backgroundColor: "rgba(18,17,16,0.97)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "none",
      }}
    >
      {/* Image container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={img.src}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.22 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            maxWidth: "min(92vw, 1200px)",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <img
            src={img.src
              .replace("-480.webp", ".webp")
              .replace("-480.jpg", ".jpg")}
            alt={img.alt}
            style={{
              display: "block",
              maxWidth: "100%",
              maxHeight: "82vh",
              objectFit: "contain",
            }}
          />

          {/* Caption bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              paddingTop: 12,
              gap: 20,
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontVariationSettings: '"opsz" 18, "wght" 600',
                  fontSize: "clamp(0.9rem, 1.3vw, 1.1rem)",
                  color: "var(--paper)",
                  margin: 0,
                  marginBottom: 3,
                }}
              >
                {img.caption}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--ochre)",
                  margin: 0,
                  opacity: 0.8,
                }}
              >
                {img.region}
              </p>
            </div>

            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 9,
                letterSpacing: "0.14em",
                color: "var(--paper)",
                opacity: 0.3,
                flexShrink: 0,
              }}
            >
              {index + 1} / {total}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev arrow */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous photo"
        style={{
          position: "fixed",
          left: "clamp(12px, 3vw, 40px)",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(241,234,217,0.08)",
          border: "none",
          color: "var(--paper)",
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "none",
          fontSize: 20,
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor =
            "rgba(241,234,217,0.18)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor =
            "rgba(241,234,217,0.08)")
        }
      >
        ←
      </button>

      {/* Next arrow */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next photo"
        style={{
          position: "fixed",
          right: "clamp(12px, 3vw, 40px)",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(241,234,217,0.08)",
          border: "none",
          color: "var(--paper)",
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "none",
          fontSize: 20,
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor =
            "rgba(241,234,217,0.18)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor =
            "rgba(241,234,217,0.08)")
        }
      >
        →
      </button>

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "fixed",
          top: "clamp(12px, 2.5vh, 24px)",
          right: "clamp(12px, 3vw, 32px)",
          background: "none",
          border: "none",
          color: "var(--paper)",
          opacity: 0.4,
          fontSize: 20,
          cursor: "none",
          transition: "opacity 0.2s",
          padding: "8px",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.opacity = "1")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.opacity = "0.4")
        }
      >
        ✕
      </button>
    </motion.div>
  );
}

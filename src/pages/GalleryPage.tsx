import { useState } from "react";
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

/**
 * GalleryPage — all site photos in a masonry-style asymmetric grid.
 *
 * Photos are grouped into two categories, togglable by filter chips:
 *   All · Landscapes · People & Culture
 *
 * Layout: auto-fill columns at clamp(240px, 28vw, 360px) so the grid
 * is never three equal columns — it fills based on viewport.
 * Hover: scale + caption slides up.
 * Click: lightbox — full-screen overlay, close on Escape or backdrop click.
 */

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  category: "landscape" | "culture";
}

const IMAGES: GalleryImage[] = [
  // Regions
  {
    src: "/media/regions/Simien-Mountains-Ethiopia-Tours-and-Travel-Packages-480.webp",
    alt: "Simien Mountains escarpment at golden hour, northern Ethiopia",
    caption: "Simien Mountains — 4,543m",
    category: "landscape",
  },
  {
    src: "/media/regions/Omo-Valley-Tribe-Ethiopia-Tour-Travel-Package-480.webp",
    alt: "Omo Valley tribeswomen in traditional dress, southern Ethiopia",
    caption: "Omo Valley tribes",
    category: "culture",
  },
  {
    src: "/media/regions/Dalol-Danakil-Depression-Ethiopia-Tours-and-Holiday-Packages-480.webp",
    alt: "Dalol hydrothermal field, acid pools and sulphur formations, Danakil Depression",
    caption: "Dalol — −125m",
    category: "landscape",
  },
  {
    src: "/media/regions/Erta-Ale-Volcano-Ethiopia-Tours-and-Holiday-Packages-480.webp",
    alt: "Erta Ale lava lake at night, Afar region",
    caption: "Erta Ale lava lake",
    category: "landscape",
  },
  {
    src: "/media/regions/Gonder-Fasiledes-Mountains-Ethiopia-Tour-Travel-Package-480.webp",
    alt: "Fasiledes castle walls at golden hour, Gondar",
    caption: "Gondar — Fasiledes Castle",
    category: "landscape",
  },
  {
    src: "/media/regions/Bale-Mountains-Ethiopia-Tour-Travel-Package-480.webp",
    alt: "Bale Mountains National Park, Ethiopian highlands plateau",
    caption: "Bale Mountains",
    category: "landscape",
  },
  {
    src: "/media/regions/Axum-Aksum-Historical-Attractions-of-Ethiopia-Tours-and-Travel-Holidays-480.webp",
    alt: "Axum obelisks and ancient stelae, Tigray region",
    caption: "Axum stelae",
    category: "landscape",
  },
  {
    src: "/media/regions/Omo-Valley-Ethiopia-Tours-and-Travel-Packages-480.webp",
    alt: "Omo Valley landscape, southern Ethiopia",
    caption: "Omo Valley",
    category: "culture",
  },
  // Tours
  {
    src: "/media/tours/Lalibela-Ethiopia-Tours-480.webp",
    alt: "Lalibela rock-hewn churches, Amhara region, northern Ethiopia",
    caption: "Lalibela — 12th century",
    category: "landscape",
  },
  {
    src: "/media/tours/3-Day-Omo-Valley-Quick-Tour-to-Mursi-Hamer-Karo-Tribes-480.webp",
    alt: "Omo Valley tribal portrait, 3-day tour",
    caption: "Hamer people, Omo Valley",
    category: "culture",
  },
  {
    src: "/media/tours/3-Day-Expedition-to-Dallol-Salt-Flats-Danakil-Depression-Erta-Ale-Volcano-480.webp",
    alt: "Dallol salt flats, Danakil Depression expedition",
    caption: "Dallol salt formations",
    category: "landscape",
  },
  {
    src: "/media/tours/4-Day-Simien-Mountains-Hiking-Tour-480.webp",
    alt: "Simien Mountains hiking, gelada baboons in foreground",
    caption: "Simien Mountains trek",
    category: "landscape",
  },
  {
    src: "/media/tours/3-Day-Tour-of-Lalibel-Yemrehanna-Kristos-Hiking-to-Asheton-Maryam-480.webp",
    alt: "Lalibela 3-day tour, Yemrehanna Kristos cave church",
    caption: "Yemrehanna Kristos",
    category: "landscape",
  },
  {
    src: "/media/tours/5-Day-Bale-Mountains-Trek-Ethiopian-Wolves-Alpine-Lakes-480.webp",
    alt: "Ethiopian wolf on Sanetti Plateau, Bale Mountains",
    caption: "Ethiopian wolf — Bale Mountains",
    category: "landscape",
  },
  {
    src: "/media/tours/4-Day-Bale-Mountains-Sof-Omar-Caves-Tours-480.webp",
    alt: "Bale Mountains and Sof Omar caves tour",
    caption: "Sof Omar caves",
    category: "landscape",
  },
  {
    src: "/media/tours/7-Day-Historic-Tour-to-Lake-Tana-Gonder-Lalibela-Simien-Mountains-480.webp",
    alt: "Lake Tana boat trip, island monastery, Ethiopia",
    caption: "Lake Tana monasteries",
    category: "landscape",
  },
  {
    src: "/media/tours/Day-Trip-to-Wenchi-Crater-Lake-480.webp",
    alt: "Wenchi Crater Lake, volcanic crater at 2,600m",
    caption: "Wenchi Crater Lake",
    category: "landscape",
  },
  {
    src: "/media/tours/Gheralta-Mountains-Ethiopia-Tours-and-Travel-Packages-480.webp",
    alt: "Gheralta sandstone cliffs, Tigray region",
    caption: "Gheralta — Tigray",
    category: "landscape",
  },
  {
    src: "/media/tours/Half-Day-Addis-Ababa-Tour-to-National-Museum-Trinity-Cathedral-Merkato-480.webp",
    alt: "Addis Ababa city tour, Trinity Cathedral",
    caption: "Addis Ababa",
    category: "culture",
  },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "landscape", label: "Landscapes" },
  { id: "culture", label: "People & Culture" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export function GalleryPage() {
  const { meta } = siteContent;
  const [filter, setFilter] = useState<FilterId>("all");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  useSeo({
    title: `Gallery — ${meta.title}`,
    description:
      "Photos from across Ethiopia — Simien Mountains, Danakil Depression, Lalibela, Omo Valley, Gondar and more.",
    canonical: "/gallery",
  });

  const visible =
    filter === "all" ? IMAGES : IMAGES.filter((img) => img.category === filter);

  const closeLightbox = () => setLightbox(null);

  return (
    <>
      <PageHero
        imgSrc="/media/regions/Simien-Mountains-Ethiopia-Tours-and-Travel-Packages-480.webp"
        imgAlt="Simien Mountains escarpment at golden hour, northern Ethiopia"
        gradientDir="down"
        darkness={0.72}
        imgPosition="center 40%"
      >
        <HeroLabel>Gallery</HeroLabel>
        <HeroHeadline>Ethiopia in photographs.</HeroHeadline>
        <HeroSub>
          Simien escarpments. Danakil salt flats. Lalibela at dawn. Omo Valley
          portraits. Every photo taken on a tour we run.
        </HeroSub>
      </PageHero>

      {/* Filter chips + grid */}
      <section
        style={{
          backgroundColor: "var(--paper)",
          padding: "clamp(36px, 5vh, 56px) clamp(24px, 6vw, 80px) clamp(56px, 8vh, 100px)",
        }}
        aria-label="Photo gallery"
      >
        {/* Filter bar */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: "clamp(28px, 4vh, 44px)",
            flexWrap: "wrap",
          }}
          role="group"
          aria-label="Filter photos"
        >
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "8px 20px",
                  backgroundColor: active ? "var(--ink)" : "transparent",
                  color: active ? "var(--paper)" : "var(--ink)",
                  border: `1px solid ${active ? "var(--ink)" : "rgba(18,17,16,0.2)"}`,
                  cursor: "none",
                  transition: `background-color ${DURATION.micro}s ease, color ${DURATION.micro}s ease`,
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--ink)";
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(18,17,16,0.2)";
                }}
              >
                {f.label}
              </button>
            );
          })}
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-body)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink)",
              opacity: 0.35,
              alignSelf: "center",
            }}
          >
            {visible.length} photos
          </span>
        </div>

        {/* Masonry-style auto-fill grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.ui, ease: [...EASE_FM.outExpo] }}
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(clamp(200px, 26vw, 340px), 1fr))",
              gap: "clamp(3px, 0.4vw, 6px)",
            }}
          >
            {visible.map((img, i) => (
              <GalleryItem
                key={img.src}
                img={img}
                index={i}
                onClick={() => setLightbox(img)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.ui }}
            onClick={closeLightbox}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9990,
              backgroundColor: "rgba(18,17,16,0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(20px, 5vw, 60px)",
              cursor: "none",
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: DURATION.ui, ease: [...EASE_FM.outExpo] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                maxWidth: "min(90vw, 1100px)",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <img
                src={lightbox.src.replace("-480.webp", ".webp")}
                alt={lightbox.alt}
                style={{
                  display: "block",
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 12,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontVariationSettings: '"opsz" 14, "wght" 300',
                    fontSize: "clamp(0.85rem, 1.2vw, 1rem)",
                    color: "var(--paper)",
                    opacity: 0.65,
                    margin: 0,
                  }}
                >
                  {lightbox.caption}
                </p>
                <button
                  onClick={closeLightbox}
                  aria-label="Close photo"
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--paper)",
                    opacity: 0.5,
                    fontSize: 22,
                    cursor: "none",
                    fontFamily: "var(--font-body)",
                    lineHeight: 1,
                    padding: "4px 8px",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.opacity = "1")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.opacity = "0.5")
                  }
                >
                  ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Gallery item ──────────────────────────────────────────────────────────────

function GalleryItem({
  img,
  index,
  onClick,
}: {
  img: GalleryImage;
  index: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-4%" }}
      transition={{
        duration: DURATION.reveal,
        delay: (index % 4) * 0.06,
        ease: [...EASE_FM.outExpo],
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`View larger: ${img.caption}`}
      style={{
        position: "relative",
        overflow: "hidden",
        aspectRatio: index % 5 === 0 ? "16/9" : index % 3 === 0 ? "4/5" : "4/3",
        backgroundColor: "var(--indigo)",
        cursor: "none",
        padding: 0,
        border: "none",
        display: "block",
        width: "100%",
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
          objectPosition: "center",
          transition: `transform ${DURATION.scene}s cubic-bezier(${EASE_FM.outCubic.join(",")})`,
          transform: hovered ? "scale(1.05)" : "scale(1)",
        }}
      />

      {/* Gradient on hover */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: DURATION.micro }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(18,17,16,0.82) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

      {/* Caption slides up on hover */}
      <motion.div
        animate={{ y: hovered ? 0 : 12, opacity: hovered ? 1 : 0 }}
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
            fontStyle: "italic",
            fontVariationSettings: '"opsz" 14, "wght" 300',
            fontSize: "clamp(0.8rem, 1.1vw, 0.95rem)",
            color: "var(--paper)",
            opacity: 0.85,
            margin: 0,
          }}
        >
          {img.caption}
        </p>
      </motion.div>
    </motion.button>
  );
}

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { DURATION, EASE_FM } from "@/lib/motion";

/**
 * Google Reviews Section — editorial redesign.
 * Features:
 * - Hero rating display with animated fill stars
 * - 3-column review cards with glassmorphic hover effect
 * - Decorative oversized quote marks
 * - Google "G" badge with multicolor ring
 * - Staggered card entrance animations
 * - Tilt-on-hover 3D card effect
 * - Accessible aria labels
 */

const REVIEWS = [
  {
    id: "1",
    author: "Thomas Lindqvist",
    location: "Stockholm, Sweden",
    date: "3 weeks ago",
    rating: 5,
    text: "Did the 7-day northern circuit in January for Timkat. Our guide knew every priest by name in Lalibela and got us into the morning service at 5:40am before the tourist groups arrived. The Simien day was cold and worth every layer. Genuinely the best-organised trip I have taken.",
    avatar: "TL",
    color: "var(--indigo)",
  },
  {
    id: "2",
    author: "Amina Osei",
    location: "Accra, Ghana",
    date: "a month ago",
    rating: 5,
    text: "We booked the Danakil 3-day expedition in February. The logistics in that region are complicated — armed escort, convoy timing, the Erta Ale trek at night. Everything ran on time. Woke up 10 metres from a boiling lava lake. Nothing else to say.",
    avatar: "AO",
    color: "var(--highland)",
  },
  {
    id: "3",
    author: "Kenji Watanabe",
    location: "Tokyo, Japan",
    date: "2 months ago",
    rating: 5,
    text: "Solo traveller, first time in Ethiopia. The guide adjusted the pace every day without me having to ask — more time at Debre Birhan Selassie, less at the souvenir shops. The coffee ceremony in a local home on day one set the tone for the whole trip. Highly recommend.",
    avatar: "KW",
    color: "var(--ochre)",
  },
];

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {[...Array(5)].map((_, i) => {
        const filled = i < rating;
        return (
          <motion.svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.4 + i * 0.07,
              duration: 0.4,
              ease: "backOut",
            }}
            viewport={{ once: true }}
            aria-hidden="true"
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={filled ? "var(--sulphur)" : "none"}
              stroke={filled ? "var(--sulphur)" : "var(--ochre)"}
              strokeWidth={filled ? 0 : 1.5}
              opacity={filled ? 1 : 0.3}
            />
          </motion.svg>
        );
      })}
    </div>
  );
}

function ReviewCard({
  review,
  index,
}: {
  review: (typeof REVIEWS)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotateX.set(-dy * 6);
    rotateY.set(dx * 6);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    setHovered(false);
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{
        duration: DURATION.reveal,
        delay: index * 0.12,
        ease: [...EASE_FM.outExpo],
      }}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 800,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          backgroundColor: hovered ? "var(--paper)" : "var(--paper)",
          border: `1px solid ${hovered ? "rgba(184,116,42,0.3)" : "rgba(18,17,16,0.08)"}`,
          borderRadius: 0,
          padding: "clamp(24px, 3vw, 36px)",
          boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.1)" : "none",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative quote mark */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -10,
            right: 20,
            fontFamily: "Georgia, serif",
            fontSize: 120,
            lineHeight: 1,
            color: "var(--ochre)",
            opacity: hovered ? 0.07 : 0.04,
            userSelect: "none",
            pointerEvents: "none",
            transition: "opacity 0.3s ease",
          }}
        >
          "
        </div>

        {/* Header: avatar + name + stars */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <motion.div
            whileHover={{ scale: 1.08 }}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: review.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 24, "wght" 600',
              fontSize: "0.95rem",
              color: "var(--paper)",
              flexShrink: 0,
              boxShadow: `0 0 0 3px var(--paper), 0 0 0 4px ${review.color}44`,
            }}
          >
            {review.avatar}
          </motion.div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: '"opsz" 24, "wght" 500',
                fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
                color: "var(--ink)",
                lineHeight: 1.2,
                marginBottom: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {review.author}
            </h3>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ochre)",
              }}
            >
              {review.location}
            </div>
          </div>

          <StarRating rating={review.rating} size={14} />
        </div>

        {/* Review text */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(13px, 1.1vw, 15px)",
            color: "var(--ink)",
            lineHeight: 1.75,
            margin: 0,
            opacity: 0.78,
            flex: 1,
          }}
        >
          {review.text}
        </p>

        {/* Footer: date + Google G */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 16,
            borderTop: "1px solid rgba(184,116,42,0.1)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "var(--ink)",
              opacity: 0.4,
              letterSpacing: "0.04em",
            }}
          >
            {review.date}
          </span>
          {/* Google "G" logo */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            aria-label="Google"
            role="img"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

export function GoogleReviews() {
  const REVIEW_COUNT = 247;

  return (
    <section
      id="google-reviews"
      role="region"
      aria-label="Google reviews for cometoethiopia tours"
      style={{
        backgroundColor: "var(--paper)",
        padding: "clamp(80px, 12vh, 160px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* Large blurred ochre orb */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "-10%",
            width: "50vw",
            height: "50vw",
            maxWidth: 600,
            maxHeight: 600,
            borderRadius: "50%",
            backgroundColor: "var(--ochre)",
            opacity: 0.04,
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "0%",
            right: "-5%",
            width: "40vw",
            height: "40vw",
            maxWidth: 500,
            maxHeight: 500,
            borderRadius: "50%",
            backgroundColor: "var(--highland)",
            opacity: 0.04,
            filter: "blur(60px)",
          }}
        />
        {/* Ge'ez watermark */}
        <div
          style={{
            position: "absolute",
            bottom: "-5%",
            right: "-2%",
            fontFamily: "var(--font-geez)",
            fontSize: "clamp(180px, 28vw, 360px)",
            lineHeight: 1,
            color: "var(--ink)",
            opacity: 0.025,
            userSelect: "none",
          }}
        >
          ሀ
        </div>
      </div>

      <div
        style={{
          padding: "0 clamp(24px, 7vw, 100px)",
          position: "relative",
          zIndex: 1,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {/* ── Section header ── */}
        <div style={{ marginBottom: "clamp(48px, 8vh, 80px)" }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 32,
                height: 1,
                backgroundColor: "var(--ochre)",
                opacity: 0.6,
              }}
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
              Verified travellers
            </span>
          </motion.div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "clamp(24px, 4vw, 40px)",
            }}
          >
            {/* Left: headline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ flex: "1 1 300px" }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontVariationSettings: '"opsz" 144, "wght" 300',
                  fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)",
                  color: "var(--ink)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.03em",
                  margin: 0,
                }}
              >
                Heard from
                <br />
                <em style={{ color: "var(--ochre)", fontStyle: "italic" }}>
                  those who&nbsp;went.
                </em>
              </h2>
            </motion.div>

            {/* Right: big rating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: "backOut" }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                flex: "0 0 auto",
              }}
            >
              {/* Stars row */}
              <div style={{ display: "flex", gap: 5 }}>
                {[...Array(5)].map((_, i) => (
                  <motion.svg
                    key={i}
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    initial={{ opacity: 0, scale: 0, rotate: -30 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.3 + i * 0.08,
                      duration: 0.5,
                      ease: "backOut",
                    }}
                    aria-hidden="true"
                  >
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      fill={i < 5 ? "var(--sulphur)" : "none"}
                      stroke="var(--sulphur)"
                      strokeWidth={0}
                    />
                  </motion.svg>
                ))}
              </div>

              {/* Score */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontVariationSettings: '"opsz" 144, "wght" 200',
                    fontSize: "clamp(3.5rem, 8vw, 6rem)",
                    color: "var(--ink)",
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                  }}
                >
                  4.8
                </motion.span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--ink)",
                    opacity: 0.35,
                    letterSpacing: "0.02em",
                    paddingBottom: 8,
                  }}
                >
                  / 5
                </span>
              </div>

              {/* Count + Google badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--ink)",
                    opacity: 0.45,
                    letterSpacing: "0.06em",
                  }}
                >
                  {REVIEW_COUNT} reviews on
                </span>
                <svg
                  width="46"
                  height="16"
                  viewBox="0 0 272 92"
                  aria-label="Google"
                >
                  <path
                    d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
                    fill="var(--ink)"
                  />
                  <path
                    d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
                    fill="var(--ink)"
                  />
                  <path
                    d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"
                    fill="var(--ink)"
                  />
                  <path d="M225 3v65h-9.5V3h9.5z" fill="var(--ink)" />
                  <path
                    d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
                    fill="var(--ink)"
                  />
                  <path
                    d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65H35.29z"
                    fill="var(--ink)"
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Review cards grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "clamp(16px, 2.5vw, 28px)",
            alignItems: "stretch",
            marginBottom: "clamp(48px, 8vh, 80px)",
          }}
        >
          {REVIEWS.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ textAlign: "center" }}
        >
          <a
            id="google-reviews-cta"
            href="https://www.google.com/maps/search/cometoethiopia+tours"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="See all Google Reviews on Google Maps"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "var(--font-body)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--ochre)",
              textDecoration: "none",
              border: "1px solid rgba(184,116,42,0.4)",
              padding: "14px 36px",
              borderRadius: 0,
              position: "relative",
              overflow: "hidden",
              transition: "color 0.3s ease, border-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              const fill = el.querySelector(".btn-fill") as HTMLElement;
              if (fill) {
                fill.style.transform = "scaleX(1)";
                fill.style.transformOrigin = "left";
              }
              el.style.color = "var(--paper)";
              el.style.borderColor = "var(--ochre)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              const fill = el.querySelector(".btn-fill") as HTMLElement;
              if (fill) {
                fill.style.transform = "scaleX(0)";
                fill.style.transformOrigin = "right";
              }
              el.style.color = "var(--ochre)";
              el.style.borderColor = "rgba(184,116,42,0.4)";
            }}
          >
            {/* Slide-fill background */}
            <span
              className="btn-fill"
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "var(--ochre)",
                transform: "scaleX(0)",
                transformOrigin: "right",
                transition: "transform 0.35s cubic-bezier(0.76,0,0.24,1)",
                zIndex: 0,
              }}
            />
            <span style={{ position: "relative", zIndex: 1 }}>
              See all {REVIEW_COUNT} Google Reviews
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ position: "relative", zIndex: 1 }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

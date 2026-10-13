import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { tours } from "@/data/tours";
import { useSeo } from "@/hooks/useSeo";
import { siteContent } from "@/data/content";
import { DURATION, EASE_FM } from "@/lib/motion";
import { useIsMobile } from "@/hooks/useIsMobile";

export function TourDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { meta } = siteContent;

  const isMobile = useIsMobile();
  const tour = tours.find((t) => (t.slug ?? t.id) === slug);

  // Unknown slug → 404
  if (!tour) return <Navigate to="/tours" replace />;

  const imgSrc = `/media/tours/${tour.imageSlot.replace(/\.[^.]+$/, "")}-480.webp`;

  const difficultyLabel = {
    easy: "Easy — suitable for all fitness levels",
    moderate: "Moderate — some hiking, manageable for most",
    demanding: "Demanding — good fitness required",
  }[tour.difficulty];

  useSeo({
    title: `${tour.name} — ${meta.title}`,
    description: tour.tagline,
    canonical: `/tours/${slug}`,
  });

  return (
    <>
      {/* ── Hero — large photo, tour name over it ── */}
      <section
        style={{
          position: "relative",
          height: "clamp(480px, 65vh, 780px)",
          overflow: "hidden",
          backgroundColor: "var(--indigo)",
        }}
      >
        <img
          src={imgSrc}
          alt={tour.imageAlt}
          width={750}
          height={500}
          loading="eager"
          decoding="sync"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        {/* Gradient */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(18,17,16,0.92) 0%, rgba(18,17,16,0.35) 55%, rgba(18,17,16,0.1) 100%)" }} />

        {/* Breadcrumb */}
        <div style={{ position: "absolute", top: "clamp(80px, 11vh, 110px)", left: "clamp(24px, 6vw, 80px)", zIndex: 2, display: "flex", alignItems: "center", gap: 8 }}>
          <Link to="/tours" style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--paper)", opacity: 0.5, textDecoration: "none", cursor: "none" }}>
            Tours
          </Link>
          <span style={{ color: "var(--paper)", opacity: 0.3 }}>→</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--paper)", opacity: 0.7 }}>
            {tour.duration} {tour.duration === 1 ? "day" : "days"}
          </span>
        </div>

        {/* Tour name */}
        <div style={{ position: "absolute", bottom: "clamp(40px, 7vh, 80px)", left: "clamp(24px, 6vw, 80px)", right: "clamp(24px, 6vw, 80px)", zIndex: 2 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontVariationSettings: '"opsz" 72, "wght" 700', fontSize: "clamp(2rem, 5vw, 5.5rem)", color: "var(--paper)", lineHeight: 1.0, letterSpacing: "-0.025em", marginBottom: 12, maxWidth: "22ch" }}>
            {tour.name}
          </h1>
          <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontVariationSettings: '"opsz" 18, "wght" 300', fontSize: "clamp(1rem, 1.8vw, 1.5rem)", color: "var(--paper)", opacity: 0.75, maxWidth: "44ch" }}>
            {tour.tagline}
          </p>
        </div>
      </section>

      {/* ── Quick facts strip ── */}
      <section style={{ backgroundColor: "var(--ink)", padding: "clamp(20px, 3vh, 28px) clamp(24px, 6vw, 80px)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 40px", alignItems: "center" }}>
          {[
            { label: "Duration",   value: `${tour.duration} ${tour.duration === 1 ? "day" : "days"}` },
            { label: "Difficulty", value: difficultyLabel },
            ...(tour.bestSeason ? [{ label: "Best season", value: tour.bestSeason }] : []),
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ochre)" }}>{label}</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--paper)", opacity: 0.8 }}>{value}</span>
            </div>
          ))}

          {/* Enquire CTA right-aligned */}
          <Link
            to={`/plan?tour=${slug}`}
            style={{ marginLeft: "auto", fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink)", backgroundColor: "var(--ochre)", padding: "10px 22px", textDecoration: "none", cursor: "none", display: "inline-block", transition: `background-color ${DURATION.micro}s ease` }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--paper)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--ochre)")}
          >
            Enquire about this tour
          </Link>
        </div>
      </section>

      {/* ── Main content — two column ── */}
      <section style={{ backgroundColor: "var(--paper)", padding: "clamp(48px, 7vh, 80px) clamp(24px, 6vw, 80px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr clamp(240px, 30vw, 340px)", gap: "clamp(40px, 6vw, 80px)", alignItems: "start" }}>

          {/* Left: day-by-day itinerary */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontVariationSettings: '"opsz" 48, "wght" 600', fontSize: "clamp(1.8rem, 3vw, 3rem)", color: "var(--ink)", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "clamp(28px, 4vh, 44px)" }}>
              The itinerary.
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {tour.days.map((day, i) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: DURATION.reveal, delay: i * 0.07, ease: [...EASE_FM.outExpo] }}
                  style={{ display: "grid", gridTemplateColumns: "clamp(48px, 5vw, 72px) 1fr", gap: "clamp(16px, 2vw, 28px)", paddingBottom: "clamp(28px, 3.5vh, 44px)", marginBottom: "clamp(28px, 3.5vh, 44px)", borderBottom: i < tour.days.length - 1 ? "1px solid rgba(18,17,16,0.08)" : "none" }}
                >
                  {/* Day number */}
                  <div>
                    <div style={{ fontFamily: "var(--font-geez)", fontSize: "1.8rem", color: "var(--ochre)", lineHeight: 1 }} aria-label={`Day ${day.day}`}>
                      {["፩","፪","፫","፬","፭","፮","፯","፰","፱","፲","፲፩","፲፪","፲፫","፲፬","፲፭"][day.day - 1] ?? String(day.day)} {/* TODO-REVIEW */}
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink)", opacity: 0.35, marginTop: 3 }}>Day {day.day}</div>
                  </div>

                  {/* Day content */}
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontVariationSettings: '"opsz" 24, "wght" 600', fontSize: "clamp(1rem, 1.6vw, 1.3rem)", color: "var(--ink)", lineHeight: 1.2, marginBottom: 10, letterSpacing: "-0.01em" }}>
                      {day.title}
                    </h3>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(13px, 1.1vw, 15px)", color: "var(--ink)", opacity: 0.7, lineHeight: 1.75 }}>
                      {day.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: sticky sidebar */}
          <div style={{ position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 28 }}>

            {/* Highlights */}
            <div style={{ backgroundColor: "var(--indigo)", padding: "clamp(20px, 2.5vw, 32px)" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ochre)", marginBottom: 14 }}>Highlights</div>
              <ul role="list" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {tour.highlights.map((h) => (
                  <li key={h} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ width: 14, height: 1, backgroundColor: "var(--ochre)", flexShrink: 0, marginTop: 8 }} aria-hidden="true" />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--paper)", opacity: 0.8, lineHeight: 1.55 }}>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Includes / Excludes */}
            <div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink)", opacity: 0.45, marginBottom: 10 }}>Included</div>
              <ul role="list" style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 6 }}>
                {tour.includes.map((item) => (
                  <li key={item} style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink)", opacity: 0.7, display: "flex", gap: 8 }}>
                    <span style={{ color: "var(--highland)", flexShrink: 0 }}>✓</span>{item}
                  </li>
                ))}
              </ul>

              <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink)", opacity: 0.45, marginBottom: 10 }}>Not included</div>
              <ul role="list" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {tour.excludes.map((item) => (
                  <li key={item} style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink)", opacity: 0.5, display: "flex", gap: 8 }}>
                    <span style={{ flexShrink: 0 }}>—</span>{item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Enquire block */}
            <div style={{ borderTop: "1px solid rgba(18,17,16,0.1)", paddingTop: 24 }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink)", opacity: 0.6, lineHeight: 1.65, marginBottom: 16 }}>
                Prices on request. We reply within 48 hours with a tailored quote.
              </p>
              <Link
                to={`/plan?tour=${slug}`}
                style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--paper)", backgroundColor: "var(--ink)", padding: "14px 0", textAlign: "center", textDecoration: "none", cursor: "none", transition: `background-color ${DURATION.micro}s ease` }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--ochre)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--ink)")}
              >
                Enquire about this tour
              </Link>

              <a
                href={`https://wa.me/251903182009?text=${encodeURIComponent(`Hi, I'm interested in the ${tour.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", marginTop: 10, fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink)", border: "1px solid rgba(18,17,16,0.2)", padding: "13px 0", textAlign: "center", textDecoration: "none", cursor: "none", transition: `border-color ${DURATION.micro}s ease` }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--highland)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(18,17,16,0.2)")}
              >
                WhatsApp us
              </a>

              {tour.liveUrl && (
                <a href={tour.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 10, fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink)", opacity: 0.35, textDecoration: "none", textAlign: "center", cursor: "none" }}>
                  View on cometoethiopiatours.com →
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Related tours ── */}
      <section style={{ backgroundColor: "var(--paper)", padding: "0 clamp(24px, 6vw, 80px) clamp(64px, 8vh, 100px)", borderTop: "1px solid rgba(18,17,16,0.06)" }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ochre)", marginBottom: 24, paddingTop: 40 }}>
          Other tours
        </div>
        <div style={{ display: "flex", gap: "clamp(12px, 2vw, 20px)", flexWrap: "wrap" }}>
          {tours
            .filter((t) => t.id !== tour.id && t.interests.some((i) => tour.interests.includes(i)))
            .slice(0, 3)
            .map((related) => (
              <Link
                key={related.id}
                to={`/tours/${related.slug ?? related.id}`}
                style={{ flex: "1 1 clamp(220px, 28vw, 320px)", textDecoration: "none", cursor: "none", display: "block" }}
              >
                <img
                  src={`/media/tours/${related.imageSlot.replace(/\.[^.]+$/, "")}-480.webp`}
                  alt={related.imageAlt}
                  width={750} height={500}
                  loading="lazy" decoding="async"
                  style={{ width: "100%", aspectRatio: "3/2", objectFit: "cover", display: "block", transition: `opacity ${DURATION.micro}s ease` }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.85")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "1")}
                />
                <div style={{ paddingTop: 12 }}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ochre)", marginBottom: 5 }}>
                    {related.duration} {related.duration === 1 ? "day" : "days"}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontVariationSettings: '"opsz" 18, "wght" 500', fontSize: "clamp(0.95rem, 1.5vw, 1.2rem)", color: "var(--ink)", lineHeight: 1.2 }}>
                    {related.name}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </>
  );
}

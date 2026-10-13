import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { tours } from "@/data/tours";
import { useSeo } from "@/hooks/useSeo";
import { siteContent } from "@/data/content";
import { DURATION, EASE_FM } from "@/lib/motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  gregorianToEthiopian,
  ETHIOPIAN_MONTHS,
} from "@/lib/ethiopianCalendar";
import type { AudienceMode } from "@/sections/AudienceChooser";

/**
 * PlanPage — clean two-panel form.
 *
 * LEFT  (36%) — company info, response time, direct contacts, progress dots.
 *               Sticky, always visible.
 * RIGHT (64%) — all form fields visible at once. No steps.
 *               Tour chips (multi-select) → dates → group → notes → name/email → submit.
 *
 * On submit: right panel fades to a clean confirmation summary.
 * Hero: full-bleed Gondar photo above the fold.
 */

type FormState = "idle" | "submitting" | "success";

const GROUP_OPTIONS = [
  { id: "solo", label: "Solo" },
  { id: "2", label: "2" },
  { id: "3-5", label: "3–5" },
  { id: "6-10", label: "6–10" },
  { id: "10+", label: "10+" },
];

interface PlanPageProps {
  audience: AudienceMode;
}

export function PlanPage({ audience }: PlanPageProps) {
  const { meta, planTrip } = siteContent;
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();

  const preselectedSlug = searchParams.get("tour");
  const preselectedTour = tours.find(
    (t) => (t.slug ?? t.id) === preselectedSlug,
  );

  const [selectedTourIds, setSelectedTourIds] = useState<string[]>(
    preselectedTour ? [preselectedTour.id] : [],
  );
  const [tourFreeText, setTourFreeText] = useState("");
  const [dates, setDates] = useState("");
  const [groupSize, setGroupSize] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");

  useSeo({
    title: `Plan Your Trip — ${meta.title}`,
    description:
      "Tell us the dates, the group size, and which tours draw you. We reply within 48 hours with a real itinerary.",
    canonical: "/plan",
  });

  const selectedTours = tours.filter((t) => selectedTourIds.includes(t.id));
  const canSubmit = name.trim().length > 1 && email.includes("@");

  const toggleTour = (id: string) =>
    setSelectedTourIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setFormState("submitting");
    await new Promise((r) => setTimeout(r, 900));
    setFormState("success");
  };

  const ethDate = gregorianToEthiopian(new Date());
  const ethDateStr = `${ethDate.day} ${ETHIOPIAN_MONTHS[ethDate.month - 1]}, ${ethDate.year}`; /* TODO-REVIEW */

  return (
    <>
      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
        aria-label="Plan your trip"
      >
        <img
          src="/media/regions/Gonder-Fasiledes-Mountains-Ethiopia-Tour-Travel-Package-480.webp"
          alt="Fasiledes castle walls at golden hour, Gondar, northern Ethiopia"
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
            objectPosition: "center 55%",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(18,17,16,0.94) 0%, rgba(18,17,16,0.45) 40%, rgba(18,17,16,0.1) 70%, rgba(18,17,16,0.25) 100%)",
          }}
        />

        {/* Top-right pull quote — removed */}

        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0 clamp(28px, 6vw, 80px) clamp(56px, 8vh, 88px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <span
              style={{
                width: 28,
                height: 1,
                backgroundColor: "var(--ochre)",
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--ochre)",
              }}
            >
              {audience === "local"
                ? "ጉዞ ያቅዱ" /* TODO-REVIEW */
                : "Plan your trip"}
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 144, "wght" 800',
              fontSize: "clamp(3.2rem, 8.5vw, 8.5rem)",
              color: "var(--paper)",
              lineHeight: 0.93,
              letterSpacing: "-0.035em",
              marginBottom: 24,
              maxWidth: "16ch",
            }}
          >
            {audience === "local" ? (
              "ለጉዞዎ ዝርዝር ይሙሉ" /* TODO-REVIEW */
            ) : (
              <>
                Tell us the shape
                <br />
                of the trip.
              </>
            )}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1.2vw, 15px)",
              color: "var(--paper)",
              opacity: 0.5,
              lineHeight: 1.75,
              maxWidth: 420,
              margin: 0,
            }}
          >
            {audience === "local"
              ? "ቀኑን፣ የቡድን ቁጥሩን እና የሚፈልጉትን ይንገሩን — በ48 ሰዓታት ውስጥ ምላሽ እንሰጣለን።" /* TODO-REVIEW */
              : "Dates, group size, which tours interest you. We read every brief ourselves and come back within 48 hours with a real itinerary."}
          </p>
        </div>
      </section>

      {/* ── Form section ── */}
      <div
        style={{
          display: isMobile ? "block" : "flex",
          minHeight: "100vh",
          backgroundColor: "var(--paper)",
        }}
      >
        {/* LEFT — company info */}
        <div
          style={{
            flex: "0 0 34%",
            backgroundColor: "var(--indigo)",
            position: isMobile ? "relative" : "sticky",
            top: 0,
            height: isMobile ? "auto" : "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "clamp(40px, 5.5vh, 64px) clamp(32px, 4vw, 52px)",
            overflow: "hidden",
          }}
        >
          {/* Ghost Ge'ez */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: -32,
              right: -16,
              fontFamily: "var(--font-geez)",
              fontSize: "clamp(160px, 22vw, 260px)",
              lineHeight: 1,
              color: "var(--paper)",
              opacity: 0.04,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            ጉዞ {/* TODO-REVIEW */}
          </span>

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 1,
                  backgroundColor: "var(--ochre)",
                }}
                aria-hidden="true"
              />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 8,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--ochre)",
                  opacity: 0.8,
                }}
              >
                {audience === "local"
                  ? "ጉዞ ያቅዱ" /* TODO-REVIEW */
                  : "Your brief"}
              </span>
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: '"opsz" 48, "wght" 700',
                fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                color: "var(--paper)",
                lineHeight: 1.0,
                letterSpacing: "-0.025em",
                marginBottom: 16,
              }}
            >
              {audience === "local"
                ? "ለጉዞዎ ዝርዝር" /* TODO-REVIEW */
                : "We read every\nbrief ourselves."}
            </h2>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(12px, 1.1vw, 14px)",
                color: "var(--paper)",
                opacity: 0.45,
                lineHeight: 1.75,
                maxWidth: 320,
                marginBottom: 32,
              }}
            >
              {audience === "local"
                ? "ቀኑን፣ የቡድን ቁጥሩን እና የሚፈልጉትን ይንገሩን።" /* TODO-REVIEW */
                : "Fill in what you know. A real guide replies within 48 hours — not a template, not a sales call."}
            </p>

            {/* Response time */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 0",
                borderTop: "1px solid rgba(241,234,217,0.08)",
                borderBottom: "1px solid rgba(241,234,217,0.08)",
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "var(--highland)",
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--paper)",
                  opacity: 0.5,
                }}
              >
                Reply within 48 hours
              </span>
            </div>

            {/* Contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 7,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--ochre)",
                    marginBottom: 4,
                  }}
                >
                  WhatsApp
                </div>
                <a
                  href={`https://wa.me/${planTrip.form.whatsappNumber.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--paper)",
                    opacity: 0.65,
                    textDecoration: "none",
                    cursor: "none",
                  }}
                >
                  {planTrip.form.whatsappNumber}
                </a>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 7,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--ochre)",
                    marginBottom: 4,
                  }}
                >
                  Email
                </div>
                <a
                  href={`mailto:${planTrip.form.emailAddress}`}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--paper)",
                    opacity: 0.65,
                    textDecoration: "none",
                    cursor: "none",
                  }}
                >
                  {planTrip.form.emailAddress}
                </a>
              </div>
            </div>
          </div>

          {/* Bottom: Ethiopian date */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              fontFamily: "var(--font-body)",
              fontSize: 9,
              letterSpacing: "0.1em",
              color: "var(--paper)",
              opacity: 0.2,
            }}
          >
            {ethDateStr}
          </div>
        </div>

        {/* RIGHT — form or confirmation */}
        <div
          style={{
            flex: 1,
            padding: "clamp(40px, 5.5vh, 64px) clamp(36px, 5vw, 72px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AnimatePresence mode="wait">
            {formState === "success" ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: DURATION.ui,
                  ease: [...EASE_FM.outExpo],
                }}
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                {/* Confirmation header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 28,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "var(--highland)",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 8,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--highland)",
                    }}
                  >
                    Brief sent to Come to Ethiopia Tours
                  </span>
                </div>

                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontVariationSettings: '"opsz" 72, "wght" 700',
                    fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                    color: "var(--ink)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.03em",
                    marginBottom: 32,
                  }}
                >
                  {name ? `Got it, ${name.split(" ")[0]}.` : "Got it."}
                </h2>

                {/* Summary table */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderTop: "1px solid rgba(18,17,16,0.08)",
                    marginBottom: 36,
                    maxWidth: 560,
                  }}
                >
                  {selectedTours.length > 0 && (
                    <SummaryRow label="Tours">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 3,
                        }}
                      >
                        {selectedTours.map((t) => (
                          <span
                            key={t.id}
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "clamp(12px, 1.1vw, 14px)",
                              color: "var(--ink)",
                              opacity: 0.75,
                              lineHeight: 1.5,
                            }}
                          >
                            {t.name.split("—")[0].trim()}
                          </span>
                        ))}
                        {tourFreeText && (
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontStyle: "italic",
                              fontSize: "clamp(11px, 1vw, 13px)",
                              color: "var(--ink)",
                              opacity: 0.45,
                            }}
                          >
                            + {tourFreeText}
                          </span>
                        )}
                      </div>
                    </SummaryRow>
                  )}
                  {tourFreeText && selectedTours.length === 0 && (
                    <SummaryRow label="Looking for">
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontStyle: "italic",
                          fontSize: "clamp(12px, 1.1vw, 14px)",
                          color: "var(--ink)",
                          opacity: 0.7,
                        }}
                      >
                        {tourFreeText}
                      </span>
                    </SummaryRow>
                  )}
                  {dates && (
                    <SummaryRow label="When">
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "clamp(12px, 1.1vw, 14px)",
                          color: "var(--ink)",
                          opacity: 0.75,
                        }}
                      >
                        {dates}
                      </span>
                    </SummaryRow>
                  )}
                  {groupSize && (
                    <SummaryRow label="Group">
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "clamp(12px, 1.1vw, 14px)",
                          color: "var(--ink)",
                          opacity: 0.75,
                        }}
                      >
                        {GROUP_OPTIONS.find((g) => g.id === groupSize)?.label ??
                          groupSize}
                      </span>
                    </SummaryRow>
                  )}
                  {notes && (
                    <SummaryRow label="Notes">
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontStyle: "italic",
                          fontSize: "clamp(11px, 1vw, 13px)",
                          color: "var(--ink)",
                          opacity: 0.65,
                          lineHeight: 1.65,
                        }}
                      >
                        {notes}
                      </span>
                    </SummaryRow>
                  )}
                  <SummaryRow label="From">
                    <div
                      style={{
                        display: "flex",
                        gap: "clamp(12px, 2vw, 24px)",
                        alignItems: "baseline",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontStyle: "italic",
                          fontVariationSettings: '"opsz" 14, "wght" 400',
                          fontSize: "clamp(12px, 1.1vw, 14px)",
                          color: "var(--ink)",
                          opacity: 0.8,
                        }}
                      >
                        {name}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "clamp(11px, 0.95vw, 13px)",
                          color: "var(--ink)",
                          opacity: 0.4,
                        }}
                      >
                        {email}
                      </span>
                    </div>
                  </SummaryRow>
                </div>

                {/* CTAs */}
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <a
                    href={`https://wa.me/${planTrip.form.whatsappNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--ink)",
                      backgroundColor: "var(--highland)",
                      padding: "11px 22px",
                      textDecoration: "none",
                      cursor: "none",
                    }}
                  >
                    WhatsApp to follow up →
                  </a>
                  <Link
                    to="/tours"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--ink)",
                      opacity: 0.4,
                      textDecoration: "none",
                      borderBottom: "1px solid rgba(18,17,16,0.2)",
                      paddingBottom: 2,
                      cursor: "none",
                    }}
                  >
                    Browse all tours →
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.ui }}
                onSubmit={handleSubmit}
                noValidate
                aria-label="Trip enquiry form"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "clamp(36px, 5vh, 52px)",
                }}
              >
                {/* ── Which tours? ── */}
                <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                  <legend style={fieldLabelStyle}>
                    {audience === "local"
                      ? "01 — የትኛዎቹን ጉዞዎች?" /* TODO-REVIEW */
                      : "01 — Which tours?"}
                  </legend>
                  <p style={fieldHintStyle}>
                    Select one or more. Skip if unsure.
                  </p>
                  {/* Tour chips */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: 14,
                    }}
                    role="group"
                    aria-label="Tour selection"
                  >
                    {tours.map((tour) => {
                      const active = selectedTourIds.includes(tour.id);
                      return (
                        <button
                          key={tour.id}
                          type="button"
                          onClick={() => toggleTour(tour.id)}
                          aria-pressed={active}
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "clamp(12px, 1.1vw, 14px)",
                            letterSpacing: "0.02em",
                            padding: "9px 18px",
                            backgroundColor: active
                              ? "var(--ink)"
                              : "transparent",
                            color: active ? "var(--paper)" : "var(--ink)",
                            border: `1px solid ${active ? "var(--ink)" : "rgba(18,17,16,0.2)"}`,
                            cursor: "none",
                            transition: `background-color ${DURATION.micro}s ease, color ${DURATION.micro}s ease`,
                          }}
                          onMouseEnter={(e) => {
                            if (!active)
                              (
                                e.currentTarget as HTMLElement
                              ).style.borderColor = "var(--ink)";
                          }}
                          onMouseLeave={(e) => {
                            if (!active)
                              (
                                e.currentTarget as HTMLElement
                              ).style.borderColor = "rgba(18,17,16,0.2)";
                          }}
                        >
                          {tour.name.split("—")[0].trim()}
                        </button>
                      );
                    })}
                  </div>
                  {/* Free-text */}
                  <input
                    type="text"
                    value={tourFreeText}
                    onChange={(e) => setTourFreeText(e.target.value)}
                    placeholder="Or describe what you're looking for…"
                    style={textInputStyle}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderBottomColor = "var(--ink)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderBottomColor =
                        "rgba(18,17,16,0.15)")
                    }
                  />
                </fieldset>

                {/* ── When ── */}
                <div>
                  <label htmlFor="plan-dates" style={fieldLabelStyle}>
                    02 — When are you thinking?
                  </label>
                  <p style={fieldHintStyle}>
                    e.g. "Jan 19 for Timkat" · "Any time in March"
                  </p>
                  <input
                    id="plan-dates"
                    type="text"
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    placeholder='e.g. "Jan 19 for Timkat" or "Any time in March"'
                    style={textInputStyle}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderBottomColor = "var(--ink)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderBottomColor =
                        "rgba(18,17,16,0.15)")
                    }
                  />
                </div>

                {/* ── Group ── */}
                <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                  <legend style={fieldLabelStyle}>03 — How many people?</legend>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      marginTop: 4,
                    }}
                    role="group"
                    aria-label="Group size"
                  >
                    {GROUP_OPTIONS.map((opt) => {
                      const active = groupSize === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setGroupSize(active ? null : opt.id)}
                          aria-pressed={active}
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "clamp(13px, 1.2vw, 15px)",
                            padding: "10px 24px",
                            backgroundColor: active
                              ? "var(--ink)"
                              : "transparent",
                            color: active ? "var(--paper)" : "var(--ink)",
                            border: `1px solid ${active ? "var(--ink)" : "rgba(18,17,16,0.2)"}`,
                            cursor: "none",
                            transition: `background-color ${DURATION.micro}s ease, color ${DURATION.micro}s ease`,
                          }}
                          onMouseEnter={(e) => {
                            if (!active)
                              (
                                e.currentTarget as HTMLElement
                              ).style.borderColor = "var(--ink)";
                          }}
                          onMouseLeave={(e) => {
                            if (!active)
                              (
                                e.currentTarget as HTMLElement
                              ).style.borderColor = "rgba(18,17,16,0.2)";
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* ── Notes ── */}
                <div>
                  <label htmlFor="plan-notes" style={fieldLabelStyle}>
                    {audience === "local"
                      ? "04 — ምን ማወቅ ይፈልጋሉ?" /* TODO-REVIEW */
                      : "04 — Anything specific?"}
                  </label>
                  <textarea
                    id="plan-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      audience === "local"
                        ? "ለምሳሌ: ቤተሰብ ጉዞ፣ ጸጥ ያለ ጊዜ..." /* TODO-REVIEW */
                        : "What kind of trip. What matters. What you'd rather avoid."
                    }
                    rows={3}
                    style={
                      {
                        ...textInputStyle,
                        border: "1px solid rgba(18,17,16,0.15)",
                        padding: "14px 16px",
                        resize: "vertical",
                        lineHeight: 1.65,
                        borderBottom: undefined,
                      } as React.CSSProperties
                    }
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "var(--ink)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(18,17,16,0.15)")
                    }
                  />
                </div>

                {/* ── Name + Email ── */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: "clamp(20px, 3vw, 40px)",
                  }}
                >
                  <div>
                    <label htmlFor="plan-name" style={fieldLabelStyle}>
                      05 — Your name{" "}
                      <span aria-hidden="true" style={{ opacity: 0.5 }}>
                        *
                      </span>
                    </label>
                    <input
                      id="plan-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      style={textInputStyle}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderBottomColor = "var(--ink)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderBottomColor =
                          "rgba(18,17,16,0.15)")
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="plan-email" style={fieldLabelStyle}>
                      Email{" "}
                      <span aria-hidden="true" style={{ opacity: 0.5 }}>
                        *
                      </span>
                    </label>
                    <input
                      id="plan-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      style={textInputStyle}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderBottomColor = "var(--ink)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderBottomColor =
                          "rgba(18,17,16,0.15)")
                      }
                    />
                  </div>
                </div>

                {/* ── Submit ── */}
                <div style={{ paddingTop: 8 }}>
                  <button
                    type="submit"
                    disabled={!canSubmit || formState === "submitting"}
                    style={{
                      display: "block",
                      width: "100%",
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: canSubmit ? "var(--paper)" : "rgba(18,17,16,0.3)",
                      backgroundColor: canSubmit
                        ? "var(--ink)"
                        : "rgba(18,17,16,0.07)",
                      border: "none",
                      padding:
                        "clamp(16px, 2.2vh, 22px) clamp(28px, 3.5vw, 44px)",
                      cursor: canSubmit ? "none" : "default",
                      textAlign: "left",
                      transition: `background-color ${DURATION.micro}s ease`,
                    }}
                    onMouseEnter={(e) => {
                      if (canSubmit)
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "var(--ochre)";
                    }}
                    onMouseLeave={(e) => {
                      if (canSubmit)
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "var(--ink)";
                    }}
                  >
                    {formState === "submitting"
                      ? "Sending…"
                      : "Send this brief →"}
                  </button>
                  {!canSubmit && (
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--ink)",
                        opacity: 0.35,
                        marginTop: 10,
                      }}
                    >
                      Name and email needed to send.
                    </p>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

// ── Summary row ───────────────────────────────────────────────────────────────

function SummaryRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "clamp(64px, 7vw, 88px) 1fr",
        gap: "clamp(12px, 2vw, 24px)",
        padding: "clamp(10px, 1.4vh, 14px) 0",
        borderBottom: "1px solid rgba(18,17,16,0.06)",
        alignItems: "start",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 8,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--ink)",
          opacity: 0.35,
          paddingTop: 2,
          lineHeight: 1.4,
        }}
      >
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}

// ── Shared style objects ──────────────────────────────────────────────────────

const fieldLabelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--ink)",
  opacity: 0.55,
  marginBottom: 12,
};

const fieldHintStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontStyle: "italic",
  fontSize: 12,
  color: "var(--ink)",
  opacity: 0.38,
  marginBottom: 12,
  lineHeight: 1.5,
};

const textInputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  fontFamily: "var(--font-body)",
  fontSize: "clamp(15px, 1.4vw, 17px)",
  color: "var(--ink)",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(18,17,16,0.15)",
  padding: "12px 0",
  outline: "none",
  borderRadius: 0,
};

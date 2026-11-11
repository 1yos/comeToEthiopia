import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { tours } from "@/data/tours";
import { useSeo } from "@/hooks/useSeo";
import { siteContent } from "@/data/content";
import { DURATION, EASE_FM } from "@/lib/motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { AudienceMode } from "@/sections/AudienceChooser";

type FormState = "idle" | "submitting" | "success";

const GROUP_OPTIONS = [
  { id: "solo", label: "Solo" },
  { id: "2", label: "2" },
  { id: "3-5", label: "3–5" },
  { id: "6-10", label: "6–10" },
  { id: "10+", label: "10+" },
];

const TRIP_LENGTH_OPTIONS = [
  { id: "1-3", label: "1–3 days" },
  { id: "4-7", label: "4–7 days" },
  { id: "8-14", label: "8–14 days" },
  { id: "14+", label: "2+ weeks" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface PlanPageProps {
  audience: AudienceMode;
}

// ── Shared style helpers ────────────────────────────────────────────────────

const sectionLabel: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 9,
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  color: "var(--ochre)",
  marginBottom: 12,
  display: "block",
};

const fieldLabel: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 11,
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  color: "var(--ink)",
  opacity: 0.5,
  display: "block",
  marginBottom: 8,
};

const inputBase: React.CSSProperties = {
  display: "block",
  width: "100%",
  fontFamily: "var(--font-body)",
  fontSize: 16,
  color: "var(--ink)",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(18,17,16,0.18)",
  padding: "11px 0",
  outline: "none",
  borderRadius: 0,
};

// ── Chip button ─────────────────────────────────────────────────────────────
function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: 13,
        padding: "8px 18px",
        backgroundColor: active ? "var(--ink)" : "transparent",
        color: active ? "var(--paper)" : "var(--ink)",
        border: `1px solid ${active ? "var(--ink)" : "rgba(18,17,16,0.22)"}`,
        cursor: "pointer",
        transition: `background-color ${DURATION.micro}s, color ${DURATION.micro}s, border-color ${DURATION.micro}s`,
        whiteSpace: "nowrap" as const,
      }}
    >
      {label}
    </button>
  );
}

// ── Section divider ─────────────────────────────────────────────────────────
function Divider() {
  return (
    <div
      style={{
        height: 1,
        backgroundColor: "rgba(18,17,16,0.08)",
        margin: "8px 0",
      }}
    />
  );
}

// ── Main page ───────────────────────────────────────────────────────────────
export function PlanPage({ audience: _audience }: PlanPageProps) {
  const { meta, planTrip } = siteContent;
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();

  useSeo({
    title: `Plan Your Trip — ${meta.title}`,
    description:
      "Tell us the dates, the group size, and which tours draw you. We reply within 48 hours with a real itinerary.",
    canonical: "/plan",
  });

  // ── Form state ────────────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [phone, setPhone] = useState("");

  const [tourSearch, setTourSearch] = useState("");
  const [selectedTourIds, setSelectedTourIds] = useState<string[]>(() => {
    const slug = searchParams.get("tour");
    const preselected = tours.find((t) => (t.slug ?? t.id) === slug);
    return preselected ? [preselected.id] : [];
  });
  const [tourFreeText, setTourFreeText] = useState("");
  const [notSureYet, setNotSureYet] = useState(false);

  const [dates, setDates] = useState("");
  const [tripLength, setTripLength] = useState<string | null>(null);
  const [groupSize, setGroupSize] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const [formState, setFormState] = useState<FormState>("idle");

  // ── Derived ───────────────────────────────────────────────────────────────
  const emailError =
    emailTouched && email.length > 0 && !EMAIL_RE.test(email)
      ? "Check your email address."
      : null;

  const selectedTours = tours.filter((t) => selectedTourIds.includes(t.id));

  const filteredTours = useMemo(() => {
    const q = tourSearch.trim().toLowerCase();
    if (!q) return tours;
    return tours.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.regionIds.some((r) => r.includes(q)) ||
        t.interests.some((i) => i.includes(q)),
    );
  }, [tourSearch]);

  const canSubmit =
    name.trim().length > 1 &&
    EMAIL_RE.test(email) &&
    formState !== "submitting";

  // ── Handlers ──────────────────────────────────────────────────────────────
  const toggleTour = (id: string) => {
    setSelectedTourIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setNotSureYet(false);
  };

  const handleNotSureYet = () => {
    setNotSureYet((p) => !p);
    if (!notSureYet) setSelectedTourIds([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setFormState("submitting");
    await new Promise((r) => setTimeout(r, 800));

    try {
      const STORAGE_KEY = "cte-enquiries";
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      const enquiry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        selectedTourIds,
        selectedTourNames: selectedTours.map((t) => t.name),
        tourFreeText: tourFreeText.trim(),
        dates: dates.trim(),
        tripLength: tripLength ?? undefined,
        groupSize,
        notes: notes.trim(),
        status: "new" as const,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([enquiry, ...existing]));
      const analytics = JSON.parse(
        localStorage.getItem("cte-analytics") ?? "{}",
      );
      analytics.enquiries = (analytics.enquiries ?? 0) + 1;
      localStorage.setItem("cte-analytics", JSON.stringify(analytics));
    } catch {
      /* ignore */
    }

    setFormState("success");
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (formState === "success") {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--paper)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding:
            "clamp(80px, 12vh, 120px) clamp(24px, 6vw, 80px) clamp(60px, 8vh, 80px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.ui, ease: [...EASE_FM.outExpo] }}
          style={{ maxWidth: 540, width: "100%" }}
        >
          {/* Green dot + label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "var(--highland)",
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--highland)",
              }}
            >
              Brief received
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 72, "wght" 700',
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              color: "var(--ink)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              marginBottom: 32,
            }}
          >
            {name ? `Got it, ${name.split(" ")[0]}.` : "Got it."}
          </h1>

          {/* Summary */}
          <div
            style={{
              borderTop: "1px solid rgba(18,17,16,0.08)",
              marginBottom: 36,
            }}
          >
            {selectedTours.length > 0 && (
              <SuccessRow label="Tours">
                {selectedTours
                  .map((t) => t.name.split("—")[0].trim())
                  .join(", ")}
              </SuccessRow>
            )}
            {tourFreeText && (
              <SuccessRow label="Looking for">{tourFreeText}</SuccessRow>
            )}
            {dates && <SuccessRow label="When">{dates}</SuccessRow>}
            {tripLength && (
              <SuccessRow label="Length">
                {TRIP_LENGTH_OPTIONS.find((o) => o.id === tripLength)?.label ??
                  tripLength}
              </SuccessRow>
            )}
            {groupSize && (
              <SuccessRow label="Group">
                {GROUP_OPTIONS.find((g) => g.id === groupSize)?.label ??
                  groupSize}
              </SuccessRow>
            )}
            {notes && <SuccessRow label="Notes">{notes}</SuccessRow>}
            <SuccessRow label="Contact">
              {name} · {email}
              {phone ? ` · ${phone}` : ""}
            </SuccessRow>
          </div>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--ink)",
              opacity: 0.5,
              lineHeight: 1.75,
              marginBottom: 32,
            }}
          >
            We'll reply within 48 hours with a real itinerary — not a template.
            Check your inbox and spam folder.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a
              href={`https://wa.me/${planTrip.form.whatsappNumber.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--paper)",
                backgroundColor: "var(--highland)",
                padding: "13px 24px",
                textDecoration: "none",
              }}
            >
              WhatsApp us now →
            </a>
            <Link
              to="/tours"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--ink)",
                opacity: 0.4,
                textDecoration: "none",
                borderBottom: "1px solid rgba(18,17,16,0.2)",
                paddingBottom: 2,
                alignSelf: "center",
              }}
            >
              Browse all tours →
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--paper)",
        paddingTop: "clamp(96px, 14vh, 128px)",
        paddingBottom: "clamp(80px, 10vh, 120px)",
      }}
    >
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "0 clamp(24px, 6vw, 40px)",
        }}
      >
        {/* Page header */}
        <div style={{ marginBottom: "clamp(48px, 7vh, 64px)" }}>
          <span style={{ ...sectionLabel, marginBottom: 16 }}>
            Plan your trip
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 96, "wght" 750',
              fontSize: "clamp(2.6rem, 6vw, 4.8rem)",
              color: "var(--ink)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              marginBottom: 16,
            }}
          >
            Tell us about
            <br />
            your trip.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              color: "var(--ink)",
              opacity: 0.5,
              lineHeight: 1.7,
              maxWidth: "46ch",
            }}
          >
            One message. A real itinerary back within 48 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(40px, 6vh, 56px)",
            }}
          >
            {/* ── Block 1: You ── */}
            <section aria-labelledby="section-you">
              <span id="section-you" style={sectionLabel}>
                You
              </span>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "clamp(20px, 3vw, 32px)",
                  marginBottom: "clamp(20px, 3vw, 32px)",
                }}
              >
                <div>
                  <label htmlFor="plan-name" style={fieldLabel}>
                    Full name <span style={{ color: "var(--ochre)" }}>*</span>
                  </label>
                  <input
                    id="plan-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    autoComplete="name"
                    style={inputBase}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderBottomColor = "var(--ink)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderBottomColor =
                        "rgba(18,17,16,0.18)")
                    }
                  />
                </div>
                <div>
                  <label htmlFor="plan-email" style={fieldLabel}>
                    Email <span style={{ color: "var(--ochre)" }}>*</span>
                  </label>
                  <input
                    id="plan-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    style={{
                      ...inputBase,
                      borderBottomColor: emailError
                        ? "var(--highland)"
                        : "rgba(18,17,16,0.18)",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderBottomColor = "var(--ink)")
                    }
                  />
                  {emailError && (
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--highland)",
                        marginTop: 4,
                        display: "block",
                      }}
                    >
                      {emailError}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="plan-phone" style={fieldLabel}>
                  WhatsApp / phone{" "}
                  <span
                    style={{
                      opacity: 0.4,
                      fontWeight: 400,
                      letterSpacing: "0.04em",
                      textTransform: "none",
                    }}
                  >
                    optional — faster replies
                  </span>
                </label>
                <input
                  id="plan-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555 000 0000"
                  autoComplete="tel"
                  style={{ ...inputBase, maxWidth: isMobile ? "100%" : "50%" }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderBottomColor = "var(--ink)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderBottomColor =
                      "rgba(18,17,16,0.18)")
                  }
                />
              </div>
            </section>

            <Divider />

            {/* ── Block 2: Tours ── */}
            <section aria-labelledby="section-tours">
              <span id="section-tours" style={sectionLabel}>
                Tours
              </span>

              {/* Not sure yet */}
              <div style={{ marginBottom: 16 }}>
                <Chip
                  label="Not sure yet — help me plan"
                  active={notSureYet}
                  onClick={handleNotSureYet}
                />
              </div>

              {!notSureYet && (
                <>
                  {/* Selected tour chips */}
                  {selectedTours.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        marginBottom: 14,
                      }}
                    >
                      {selectedTours.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => toggleTour(t.id)}
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 12,
                            padding: "5px 12px",
                            backgroundColor: "var(--ink)",
                            color: "var(--paper)",
                            border: "1px solid var(--ink)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                          aria-label={`Remove ${t.name.split("—")[0].trim()}`}
                        >
                          {t.name.split("—")[0].trim()}
                          <span
                            style={{
                              opacity: 0.6,
                              fontSize: 14,
                              lineHeight: 1,
                            }}
                          >
                            ×
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Search input */}
                  <div style={{ position: "relative", marginBottom: 12 }}>
                    <input
                      type="text"
                      value={tourSearch}
                      onChange={(e) => setTourSearch(e.target.value)}
                      placeholder="Search tours by name, region, or interest…"
                      style={{
                        ...inputBase,
                        paddingLeft: 28,
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderBottomColor = "var(--ink)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderBottomColor =
                          "rgba(18,17,16,0.18)")
                      }
                      aria-label="Search tours"
                    />
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--ink)",
                        opacity: 0.3,
                      }}
                      aria-hidden="true"
                    >
                      <circle cx="7" cy="7" r="5" />
                      <path d="M11 11l3 3" />
                    </svg>
                  </div>

                  {/* Tour results */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      maxHeight: tourSearch ? "none" : 120,
                      overflow: tourSearch ? "visible" : "hidden",
                    }}
                  >
                    {filteredTours.map((tour) => (
                      <Chip
                        key={tour.id}
                        label={tour.name.split("—")[0].trim()}
                        active={selectedTourIds.includes(tour.id)}
                        onClick={() => toggleTour(tour.id)}
                      />
                    ))}
                  </div>
                  {!tourSearch && tours.length > filteredTours.length && (
                    <button
                      type="button"
                      onClick={() => setTourSearch(" ")}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--ink)",
                        opacity: 0.35,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        marginTop: 8,
                        padding: 0,
                        letterSpacing: "0.06em",
                      }}
                    >
                      Show all {tours.length} tours ↓
                    </button>
                  )}

                  {/* Free text */}
                  <div style={{ marginTop: 20 }}>
                    <label
                      htmlFor="tour-freetext"
                      style={{ ...fieldLabel, marginBottom: 6 }}
                    >
                      Or describe what you're looking for
                    </label>
                    <input
                      id="tour-freetext"
                      type="text"
                      value={tourFreeText}
                      onChange={(e) => setTourFreeText(e.target.value)}
                      placeholder='e.g. "something remote" or "caves and volcanoes"'
                      style={inputBase}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderBottomColor = "var(--ink)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderBottomColor =
                          "rgba(18,17,16,0.18)")
                      }
                    />
                  </div>
                </>
              )}
            </section>

            <Divider />

            {/* ── Block 3: When ── */}
            <section aria-labelledby="section-when">
              <span id="section-when" style={sectionLabel}>
                When
              </span>
              <div style={{ marginBottom: 24 }}>
                <label htmlFor="plan-dates" style={fieldLabel}>
                  Approximate dates
                </label>
                <input
                  id="plan-dates"
                  type="text"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  placeholder='e.g. "January 2026" or "around Timkat" or "flexible"'
                  style={inputBase}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderBottomColor = "var(--ink)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderBottomColor =
                      "rgba(18,17,16,0.18)")
                  }
                />
              </div>
              <div>
                <label style={fieldLabel}>Trip length</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {TRIP_LENGTH_OPTIONS.map((opt) => (
                    <Chip
                      key={opt.id}
                      label={opt.label}
                      active={tripLength === opt.id}
                      onClick={() =>
                        setTripLength(tripLength === opt.id ? null : opt.id)
                      }
                    />
                  ))}
                </div>
              </div>
            </section>

            <Divider />

            {/* ── Block 4: Group ── */}
            <section aria-labelledby="section-group">
              <span id="section-group" style={sectionLabel}>
                Group size
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {GROUP_OPTIONS.map((opt) => (
                  <Chip
                    key={opt.id}
                    label={opt.label}
                    active={groupSize === opt.id}
                    onClick={() =>
                      setGroupSize(groupSize === opt.id ? null : opt.id)
                    }
                  />
                ))}
              </div>
            </section>

            <Divider />

            {/* ── Block 5: Notes ── */}
            <section aria-labelledby="section-notes">
              <span id="section-notes" style={sectionLabel}>
                Anything else
              </span>
              <label htmlFor="plan-notes" style={fieldLabel}>
                Context that helps us plan
              </label>
              <textarea
                id="plan-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Budget, pace, accessibility needs, things you've already seen, what matters most."
                rows={4}
                style={{
                  ...inputBase,
                  border: "1px solid rgba(18,17,16,0.15)",
                  padding: "14px 16px",
                  resize: "vertical",
                  lineHeight: 1.65,
                  minHeight: 100,
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--ink)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(18,17,16,0.15)")
                }
              />
            </section>

            {/* ── Submit ── */}
            <div>
              <AnimatePresence>
                {!canSubmit && name.length === 0 && email.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      color: "var(--ink)",
                      opacity: 0.35,
                      marginBottom: 12,
                      letterSpacing: "0.04em",
                    }}
                  >
                    Add your name and email above to send.
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={!canSubmit}
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
                  padding: "clamp(16px, 2.2vh, 20px) clamp(28px, 3.5vw, 44px)",
                  cursor: canSubmit ? "pointer" : "default",
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
                {formState === "submitting" ? "Sending…" : "Send this brief →"}
              </button>

              {/* Direct contact strip */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "clamp(12px, 2vw, 24px)",
                  marginTop: 24,
                  paddingTop: 20,
                  borderTop: "1px solid rgba(18,17,16,0.08)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--ink)",
                    opacity: 0.35,
                    letterSpacing: "0.06em",
                  }}
                >
                  Or reach us directly:
                </span>
                <a
                  href={`https://wa.me/${planTrip.form.whatsappNumber.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink)",
                    opacity: 0.65,
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(18,17,16,0.2)",
                    paddingBottom: 1,
                  }}
                >
                  WhatsApp {planTrip.form.whatsappNumber}
                </a>
                <a
                  href={`mailto:${planTrip.form.emailAddress}`}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink)",
                    opacity: 0.65,
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(18,17,16,0.2)",
                    paddingBottom: 1,
                  }}
                >
                  {planTrip.form.emailAddress}
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Success row helper ────────────────────────────────────────────────────────
function SuccessRow({
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
        gridTemplateColumns: "80px 1fr",
        gap: 16,
        padding: "10px 0",
        borderBottom: "1px solid rgba(18,17,16,0.06)",
        alignItems: "start",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 9,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--ink)",
          opacity: 0.3,
          paddingTop: 2,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 14,
          color: "var(--ink)",
          opacity: 0.75,
          lineHeight: 1.55,
        }}
      >
        {children}
      </span>
    </div>
  );
}

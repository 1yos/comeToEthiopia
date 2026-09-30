import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "@/data/content";
import { DURATION } from "@/lib/motion";

type FormState = "idle" | "submitting" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  dates: string;
  group: string;
  interests: string;
}

/**
 * Plan Your Trip — inquiry form.
 *
 * Layout: asymmetric — big typography left, form right.
 * Options: form submit (placeholder), WhatsApp, or email link.
 * NOT a booking form — a conversation starter.
 * Validation: required fields, email format, accessible error states.
 */
export function PlanTrip({
  audience: _audience,
}: {
  audience: import("@/sections/AudienceChooser").AudienceMode;
}) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [data, setData] = useState<FormData>({
    name: "",
    email: "",
    dates: "",
    group: "",
    interests: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const { planTrip } = siteContent;
  const { form } = planTrip;

  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    if (!data.name.trim()) e.name = "Your name is needed";
    if (!data.email.trim()) e.email = "Email address is needed";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      e.email = "Check that email address";
    if (!data.interests.trim())
      e.interests = "Tell us a little about what draws you";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setFormState("submitting");

    // TODO: Replace with real form submission endpoint
    await new Promise((res) => setTimeout(res, 1200));
    // Simulate success (replace with real fetch)
    setFormState("success");
  };

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in visiting Ethiopia.\n\nName: ${data.name || "[not filled yet]"}\nDates: ${data.dates || "TBD"}\nGroup: ${data.group || "solo"}\n\n${data.interests}`,
  );

  return (
    <section
      id="plan-trip"
      role="region"
      aria-label="Plan your trip to Ethiopia"
      style={{
        backgroundColor: "var(--paper)",
        padding: "clamp(80px, 10vh, 140px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Ge'ez */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-8%",
          left: "-2%",
          fontFamily: "var(--font-geez)",
          fontSize: "clamp(200px, 30vw, 440px)",
          color: "var(--ink)",
          opacity: 0.03,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {planTrip.geezDecorator} {/* TODO-REVIEW */}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px, 6vw, 100px)",
          padding: "0 clamp(24px, 6vw, 80px)",
          position: "relative",
          zIndex: 1,
          alignItems: "start",
        }}
      >
        {/* Left: editorial copy */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ochre)",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{ width: 32, height: 1, backgroundColor: "var(--ochre)" }}
            />
            {planTrip.sectionLabel}
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 72, "wght" 600',
              fontSize: "clamp(2.5rem, 5.5vw, 7rem)",
              color: "var(--ink)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              marginBottom: 24,
            }}
          >
            {planTrip.headline}
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1.2vw, 16px)",
              color: "var(--ink)",
              opacity: 0.65,
              lineHeight: 1.75,
              maxWidth: 440,
              marginBottom: 40,
            }}
          >
            {planTrip.subline}
          </p>

          {/* Alternative contact methods */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 9,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--ink)",
                opacity: 0.4,
                marginBottom: 4,
              }}
            >
              Or reach us directly
            </div>
            <a
              href={`https://wa.me/${form.whatsappNumber.replace("+", "")}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label="WhatsApp"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                fontFamily: "var(--font-body)",
                fontSize: 13,
                letterSpacing: "0.1em",
                color: "var(--ink)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(18,17,16,0.2)",
                paddingBottom: 8,
                cursor: "none",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "var(--highland)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(18,17,16,0.2)")
              }
            >
              {form.whatsappLabel}
              <span style={{ fontSize: 11, opacity: 0.5 }}>
                {form.whatsappNumber}
              </span>
            </a>
            <a
              href={`mailto:${form.emailAddress}`}
              data-cursor-label="Email"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                fontFamily: "var(--font-body)",
                fontSize: 13,
                letterSpacing: "0.1em",
                color: "var(--ink)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(18,17,16,0.2)",
                paddingBottom: 8,
                cursor: "none",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "var(--ochre)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(18,17,16,0.2)")
              }
            >
              {form.emailLabel}
              <span style={{ fontSize: 11, opacity: 0.5 }}>
                {form.emailAddress}
              </span>
            </a>
          </div>
        </div>

        {/* Right: form */}
        <div>
          <AnimatePresence mode="wait">
            {formState === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.ui }}
                style={{
                  padding: "clamp(28px, 4vw, 48px)",
                  backgroundColor: "var(--highland)",
                  color: "var(--paper)",
                }}
                role="status"
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontVariationSettings: '"opsz" 32, "wght" 600',
                    fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
                    lineHeight: 1.1,
                    marginBottom: 14,
                  }}
                >
                  Got it.
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    opacity: 0.85,
                    lineHeight: 1.65,
                  }}
                >
                  {form.successMessage}
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                aria-label="Trip enquiry form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {/* Name */}
                <Field
                  id="enquiry-name"
                  label="Name"
                  type="text"
                  value={data.name}
                  placeholder={form.namePlaceholder}
                  error={errors.name}
                  required
                  onChange={(v) => setData((d) => ({ ...d, name: v }))}
                />
                {/* Email */}
                <Field
                  id="enquiry-email"
                  label="Email"
                  type="email"
                  value={data.email}
                  placeholder={form.emailPlaceholder}
                  error={errors.email}
                  required
                  onChange={(v) => setData((d) => ({ ...d, email: v }))}
                />
                {/* Dates */}
                <Field
                  id="enquiry-dates"
                  label="Approximate dates"
                  type="text"
                  value={data.dates}
                  placeholder={form.datesPlaceholder}
                  onChange={(v) => setData((d) => ({ ...d, dates: v }))}
                />
                {/* Group */}
                <Field
                  id="enquiry-group"
                  label="Group size"
                  type="text"
                  value={data.group}
                  placeholder={form.groupPlaceholder}
                  onChange={(v) => setData((d) => ({ ...d, group: v }))}
                />
                {/* Interests (textarea) */}
                <TextareaField
                  id="enquiry-interests"
                  label="What draws you to Ethiopia"
                  value={data.interests}
                  placeholder={form.interestsPlaceholder}
                  error={errors.interests}
                  required
                  onChange={(v) => setData((d) => ({ ...d, interests: v }))}
                />

                {/* Error summary */}
                {formState === "error" && (
                  <div
                    role="alert"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: "var(--ochre)",
                      borderLeft: "2px solid var(--ochre)",
                      paddingLeft: 12,
                    }}
                  >
                    {form.errorMessage}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  data-magnetic
                  style={{
                    alignSelf: "flex-start",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--paper)",
                    backgroundColor: "var(--ink)",
                    border: "1px solid var(--ink)",
                    padding: "15px 32px",
                    cursor: formState === "submitting" ? "default" : "none",
                    transition: "background-color 0.25s, color 0.25s",
                    opacity: formState === "submitting" ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (formState !== "submitting") {
                      const el = e.currentTarget as HTMLElement;
                      el.style.backgroundColor = "var(--ochre)";
                      el.style.borderColor = "var(--ochre)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.backgroundColor = "var(--ink)";
                    el.style.borderColor = "var(--ink)";
                  }}
                >
                  {formState === "submitting" ? "Sending…" : form.submitLabel}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ── Form field components ────────────────────────────────────────────────────

function Field({
  id,
  label,
  type,
  value,
  placeholder,
  error,
  required,
  onChange,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  error?: string;
  required?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontFamily: "var(--font-body)",
          fontSize: 9,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--ink)",
          opacity: 0.55,
          marginBottom: 6,
        }}
      >
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          color: "var(--ink)",
          backgroundColor: "transparent",
          border: "none",
          borderBottom: `1px solid ${error ? "var(--ochre)" : "rgba(18,17,16,0.3)"}`,
          padding: "10px 0",
          outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) =>
          ((e.currentTarget as HTMLElement).style.borderBottomColor =
            "var(--ink)")
        }
        onBlur={(e) =>
          ((e.currentTarget as HTMLElement).style.borderBottomColor = error
            ? "var(--ochre)"
            : "rgba(18,17,16,0.3)")
        }
      />
      {error && (
        <div
          id={`${id}-error`}
          role="alert"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "var(--ochre)",
            marginTop: 5,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

function TextareaField({
  id,
  label,
  value,
  placeholder,
  error,
  required,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  required?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontFamily: "var(--font-body)",
          fontSize: 9,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--ink)",
          opacity: 0.55,
          marginBottom: 6,
        }}
      >
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <textarea
        id={id}
        value={value}
        placeholder={placeholder}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          color: "var(--ink)",
          backgroundColor: "transparent",
          border: `1px solid ${error ? "var(--ochre)" : "rgba(18,17,16,0.2)"}`,
          padding: "12px",
          outline: "none",
          resize: "vertical",
          lineHeight: 1.6,
          transition: "border-color 0.2s",
        }}
        onFocus={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor = "var(--ink)")
        }
        onBlur={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor = error
            ? "var(--ochre)"
            : "rgba(18,17,16,0.2)")
        }
      />
      {error && (
        <div
          id={`${id}-error`}
          role="alert"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "var(--ochre)",
            marginTop: 5,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

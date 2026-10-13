import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "@/data/content";
import { DURATION } from "@/lib/motion";

/**
 * Plan-trip enquiry form — state, validation, and the form itself.
 *
 * Extracted from PlanTrip.tsx because the state must be shared: the
 * left-column WhatsApp link composes a message from the live form data
 * (`whatsappMessage`), so PlanTrip owns the hook and passes the controller
 * down. There is no backend — submit simulates success, and the real
 * conversions are the WhatsApp/email hand-offs.
 */

type FormState = "idle" | "submitting" | "success" | "error";

export interface EnquiryFormData {
  name: string;
  email: string;
  dates: string;
  group: string;
  interests: string;
}

export interface EnquiryFormController {
  data: EnquiryFormData;
  setData: React.Dispatch<React.SetStateAction<EnquiryFormData>>;
  errors: Partial<EnquiryFormData>;
  formState: FormState;
  whatsappMessage: string;
  handleSubmit: (e: React.FormEvent) => void;
}

/**
 * Owns enquiry state and validation. `prefill` seeds the fields (Phase 1
 * will pass `?tour=` from a tour page) — validation still runs on submit.
 */
export function useEnquiryForm(
  prefill?: Partial<EnquiryFormData>,
): EnquiryFormController {
  const [formState, setFormState] = useState<FormState>("idle");
  const [data, setData] = useState<EnquiryFormData>({
    name: "",
    email: "",
    dates: "",
    group: "",
    interests: "",
    ...prefill,
  });
  const [errors, setErrors] = useState<Partial<EnquiryFormData>>({});

  const validate = (): boolean => {
    const e: Partial<EnquiryFormData> = {};
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

  // Pre-encoded for the wa.me deep link; built from live field values so
  // the left-column WhatsApp anchor is always in sync with what's typed.
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in visiting Ethiopia.\n\nName: ${data.name || "[not filled yet]"}\nDates: ${data.dates || "TBD"}\nGroup: ${data.group || "solo"}\n\n${data.interests}`,
  );

  return { data, setData, errors, formState, whatsappMessage, handleSubmit };
}

/**
 * The form itself — success state swaps in via AnimatePresence.
 * Renders nothing but the form block; the section shell stays in PlanTrip.
 */
export function EnquiryForm({ enquiry }: { enquiry: EnquiryFormController }) {
  const { data, setData, errors, formState, handleSubmit } = enquiry;
  const { form } = siteContent.planTrip;

  return (
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

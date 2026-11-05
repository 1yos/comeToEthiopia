import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { tours as hardcodedTours } from "@/data/tours";
import type { Tour, TourDay } from "@/data/tours";

const EMPTY_TOUR: Omit<Tour, "id"> = {
  name: "",
  duration: 1,
  tagline: "",
  highlights: [""],
  days: [{ day: 1, title: "", description: "" }],
  includes: [""],
  excludes: [""],
  interests: [],
  regionIds: [],
  bestSeason: "",
  difficulty: "easy",
  liveUrl: "",
  imageSlot: "",
  imageAlt: "",
};

const INTEREST_OPTIONS = [
  "history",
  "culture",
  "trekking",
  "wildlife",
  "coffee",
];

function Toast({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) {
  return (
    <div className={`admin-toast admin-toast--${type}`} role="status">
      <span>{type === "success" ? "✓" : "✗"}</span>
      {message}
    </div>
  );
}

export function TourEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [form, setForm] = useState<Omit<Tour, "id">>(EMPTY_TOUR);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      const found = hardcodedTours.find((t) => t.id === id);
      if (found) {
        const { id: _id, ...rest } = found;
        setForm(rest);
      }
    }
  }, [id, isNew]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const set = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ── Array field helpers ──────────────────────────────────────────────────

  const setArrayItem = (
    key: "highlights" | "includes" | "excludes",
    i: number,
    value: string,
  ) => {
    setForm((prev) => {
      const arr = [...(prev[key] as string[])];
      arr[i] = value;
      return { ...prev, [key]: arr };
    });
  };

  const addArrayItem = (key: "highlights" | "includes" | "excludes") => {
    setForm((prev) => ({ ...prev, [key]: [...(prev[key] as string[]), ""] }));
  };

  const removeArrayItem = (
    key: "highlights" | "includes" | "excludes",
    i: number,
  ) => {
    setForm((prev) => {
      const arr = (prev[key] as string[]).filter((_, idx) => idx !== i);
      return { ...prev, [key]: arr };
    });
  };

  // ── Day helpers ──────────────────────────────────────────────────────────

  const setDay = (i: number, field: keyof TourDay, value: string | number) => {
    setForm((prev) => {
      const days = prev.days.map((d, idx) =>
        idx === i ? { ...d, [field]: value } : d,
      );
      return { ...prev, days };
    });
  };

  const addDay = () => {
    setForm((prev) => ({
      ...prev,
      days: [
        ...prev.days,
        { day: prev.days.length + 1, title: "", description: "" },
      ],
    }));
  };

  const removeDay = (i: number) => {
    setForm((prev) => {
      const days = prev.days
        .filter((_, idx) => idx !== i)
        .map((d, idx) => ({ ...d, day: idx + 1 }));
      return { ...prev, days };
    });
  };

  // ── Interest toggle ──────────────────────────────────────────────────────

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  // ── Save ────────────────────────────────────────────────────────────────

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast("Tour name is required.", "error");
      return;
    }
    if (!form.imageSlot.trim()) {
      showToast("Image filename is required.", "error");
      return;
    }
    setSaving(true);

    // In Phase 2 this will write to /public/cms/tours.json
    // For now: show success and navigate back
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    showToast(
      isNew
        ? "Tour created (save to JSON to persist)."
        : "Tour updated (save to JSON to persist).",
      "success",
    );
    setTimeout(() => navigate("/admin/tours"), 1200);
  };

  return (
    <div>
      <div className="admin-section-header">
        <div className="admin-section-header__left">
          <div className="admin-section-header__title">
            {isNew ? "Add tour" : "Edit tour"}
          </div>
          {!isNew && (
            <div className="admin-section-header__sub">{form.name}</div>
          )}
        </div>
        <div className="admin-section-header__actions">
          <Link to="/admin/tours" className="admin-btn admin-btn--secondary">
            ← Back to tours
          </Link>
        </div>
      </div>

      <form onSubmit={handleSave} noValidate>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr clamp(280px, 32%, 360px)",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* ── Left column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Basic info */}
            <div className="admin-card">
              <div className="admin-card__title">Basic information</div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="tour-name">
                  Tour name *
                </label>
                <input
                  id="tour-name"
                  className="admin-input"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. 7-Day Historic Tour — Lake Tana, Gondar, Lalibela"
                  required
                />
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="tour-tagline">
                  Tagline
                </label>
                <input
                  id="tour-tagline"
                  className="admin-input"
                  value={form.tagline}
                  onChange={(e) => set("tagline", e.target.value)}
                  placeholder="12 words max. Sensory and specific."
                />
                <span className="admin-input-hint">
                  {form.tagline.split(/\s+/).filter(Boolean).length} / 12 words
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div className="admin-field" style={{ marginBottom: 0 }}>
                  <label className="admin-label" htmlFor="tour-duration">
                    Duration (days) *
                  </label>
                  <input
                    id="tour-duration"
                    type="number"
                    min={1}
                    max={30}
                    className="admin-input"
                    value={form.duration}
                    onChange={(e) =>
                      set("duration", parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <div className="admin-field" style={{ marginBottom: 0 }}>
                  <label className="admin-label" htmlFor="tour-difficulty">
                    Difficulty *
                  </label>
                  <select
                    id="tour-difficulty"
                    className="admin-select"
                    value={form.difficulty}
                    onChange={(e) =>
                      set("difficulty", e.target.value as Tour["difficulty"])
                    }
                  >
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="demanding">Demanding</option>
                  </select>
                </div>
              </div>

              <div className="admin-field" style={{ marginTop: 12 }}>
                <label className="admin-label">Best season</label>
                <input
                  className="admin-input"
                  value={form.bestSeason ?? ""}
                  onChange={(e) => set("bestSeason", e.target.value)}
                  placeholder="e.g. Oct – Apr"
                />
              </div>

              <div className="admin-field">
                <label className="admin-label">Interests</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {INTEREST_OPTIONS.map((opt) => {
                    const active = form.interests.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleInterest(opt)}
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          letterSpacing: "0.06em",
                          padding: "5px 12px",
                          backgroundColor: active
                            ? "var(--a-text)"
                            : "transparent",
                          color: active ? "var(--a-surface)" : "var(--a-text)",
                          border: `1px solid ${active ? "var(--a-text)" : "var(--a-border-md)"}`,
                          cursor: "pointer",
                          textTransform: "capitalize",
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="admin-card">
              <div className="admin-card__title">
                Highlights (3–5 specific points)
              </div>
              {form.highlights.map((h, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 8, marginBottom: 8 }}
                >
                  <input
                    className="admin-input"
                    value={h}
                    onChange={(e) =>
                      setArrayItem("highlights", i, e.target.value)
                    }
                    placeholder={`Highlight ${i + 1}`}
                    style={{ flex: 1 }}
                  />
                  {form.highlights.length > 1 && (
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger admin-btn--sm"
                      onClick={() => removeArrayItem("highlights", i)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="admin-btn admin-btn--secondary admin-btn--sm"
                onClick={() => addArrayItem("highlights")}
              >
                + Add highlight
              </button>
            </div>

            {/* Day-by-day itinerary */}
            <div className="admin-card">
              <div className="admin-card__title">
                Day-by-day itinerary ({form.days.length} day
                {form.days.length !== 1 ? "s" : ""})
              </div>
              {form.days.map((day, i) => (
                <div
                  key={i}
                  style={{
                    borderLeft: "2px solid var(--a-accent)",
                    paddingLeft: 14,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--a-accent)",
                      marginBottom: 8,
                    }}
                  >
                    Day {day.day}
                  </div>
                  <div className="admin-field" style={{ marginBottom: 8 }}>
                    <input
                      className="admin-input"
                      value={day.title}
                      onChange={(e) => setDay(i, "title", e.target.value)}
                      placeholder="Day title — e.g. Fly to Lalibela. Rock-hewn churches."
                    />
                  </div>
                  <div className="admin-field" style={{ marginBottom: 0 }}>
                    <textarea
                      className="admin-textarea"
                      value={day.description}
                      onChange={(e) => setDay(i, "description", e.target.value)}
                      placeholder="What actually happens this day. Specific times, places, names."
                      rows={3}
                    />
                  </div>
                  {form.days.length > 1 && (
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger admin-btn--sm"
                      onClick={() => removeDay(i)}
                      style={{ marginTop: 8 }}
                    >
                      Remove day {day.day}
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="admin-btn admin-btn--secondary admin-btn--sm"
                onClick={addDay}
              >
                + Add day {form.days.length + 1}
              </button>
            </div>

            {/* Includes / Excludes */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {(["includes", "excludes"] as const).map((key) => (
                <div key={key} className="admin-card">
                  <div className="admin-card__title">
                    {key === "includes" ? "Includes" : "Excludes"}
                  </div>
                  {(form[key] as string[]).map((item, i) => (
                    <div
                      key={i}
                      style={{ display: "flex", gap: 6, marginBottom: 6 }}
                    >
                      <input
                        className="admin-input"
                        value={item}
                        onChange={(e) => setArrayItem(key, i, e.target.value)}
                        placeholder={
                          key === "includes"
                            ? "e.g. Domestic flights"
                            : "e.g. International flights"
                        }
                        style={{ flex: 1, fontSize: 12 }}
                      />
                      {(form[key] as string[]).length > 1 && (
                        <button
                          type="button"
                          className="admin-btn admin-btn--danger admin-btn--sm"
                          onClick={() => removeArrayItem(key, i)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="admin-btn admin-btn--secondary admin-btn--sm"
                    onClick={() => addArrayItem(key)}
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Image */}
            <div className="admin-card">
              <div className="admin-card__title">Photo</div>
              {form.imageSlot && (
                <img
                  src={`/media/tours/${form.imageSlot}`}
                  alt={form.imageAlt || "Tour preview"}
                  style={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                    objectPosition: "center 35%",
                    display: "block",
                    marginBottom: 12,
                    backgroundColor: "var(--a-sidebar)",
                  }}
                />
              )}
              <div className="admin-field">
                <label className="admin-label" htmlFor="tour-image-slot">
                  Image filename *
                </label>
                <input
                  id="tour-image-slot"
                  className="admin-input"
                  value={form.imageSlot}
                  onChange={(e) => set("imageSlot", e.target.value)}
                  placeholder="e.g. Lalibela-Ethiopia-Tours-480.webp"
                />
                <span className="admin-input-hint">
                  File must exist in /public/media/tours/
                </span>
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="tour-image-alt">
                  Image alt text *
                </label>
                <input
                  id="tour-image-alt"
                  className="admin-input"
                  value={form.imageAlt}
                  onChange={(e) => set("imageAlt", e.target.value)}
                  placeholder="Descriptive alt text for accessibility"
                />
              </div>
            </div>

            {/* Regions */}
            <div className="admin-card">
              <div className="admin-card__title">Region IDs</div>
              <div className="admin-field">
                <input
                  className="admin-input"
                  value={form.regionIds.join(", ")}
                  onChange={(e) =>
                    set(
                      "regionIds",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
                  placeholder="e.g. lalibela, gondar, simien"
                />
                <span className="admin-input-hint">
                  Comma-separated. Matches destinations.ts IDs.
                </span>
              </div>
            </div>

            {/* Live URL */}
            <div className="admin-card">
              <div className="admin-card__title">Live URL (optional)</div>
              <div className="admin-field">
                <input
                  className="admin-input"
                  type="url"
                  value={form.liveUrl}
                  onChange={(e) => set("liveUrl", e.target.value)}
                  placeholder="https://cometoethiopiatours.com/tours/…"
                />
              </div>
            </div>

            {/* Save button */}
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={saving}
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "14px",
              }}
            >
              {saving ? "Saving…" : isNew ? "Create tour" : "Save changes"}
            </button>

            {!isNew && (
              <a
                href={`/tours/${form.liveUrl?.split("/").pop() ?? ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn--secondary"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Preview on site →
              </a>
            )}
          </div>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

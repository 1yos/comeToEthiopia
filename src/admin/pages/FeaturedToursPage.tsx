import { useState } from "react";
import { tours, featuredTourIds as defaultFeatured } from "@/data/tours";

const FEATURED_KEY = "cte-featured-tours";

function loadFeatured(): string[] {
  try {
    const saved = localStorage.getItem(FEATURED_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }
  return defaultFeatured;
}

function saveFeatured(ids: string[]): void {
  try {
    localStorage.setItem(FEATURED_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

function Toast({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) {
  return (
    <div className={`admin-toast admin-toast--${type}`} role="status">
      {message}
    </div>
  );
}

export function FeaturedToursPage() {
  const [featured, setFeatured] = useState<string[]>(loadFeatured);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const featuredTours = featured
    .map((id) => tours.find((t) => t.id === id))
    .filter(Boolean) as typeof tours;

  const availableTours = tours.filter((t) => !featured.includes(t.id));

  const addToFeatured = (id: string) => {
    if (featured.length >= 10) {
      showToast("Maximum 10 featured tours.", "error");
      return;
    }
    const updated = [...featured, id];
    setFeatured(updated);
    saveFeatured(updated);
    showToast("Added to featured tours.", "success");
  };

  const removeFromFeatured = (id: string) => {
    const updated = featured.filter((f) => f !== id);
    setFeatured(updated);
    saveFeatured(updated);
    showToast("Removed from featured tours.", "success");
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...featured];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    setFeatured(updated);
    saveFeatured(updated);
  };

  const moveDown = (idx: number) => {
    if (idx === featured.length - 1) return;
    const updated = [...featured];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    setFeatured(updated);
    saveFeatured(updated);
  };

  // Drag and drop reorder
  const onDragStart = (idx: number) => setDragIdx(idx);
  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const updated = [...featured];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(idx, 0, moved);
    setFeatured(updated);
    setDragIdx(idx);
  };
  const onDragEnd = () => {
    saveFeatured(featured);
    setDragIdx(null);
    showToast("Order saved.", "success");
  };

  return (
    <div>
      <div className="admin-section-header">
        <div className="admin-section-header__left">
          <div className="admin-section-header__title">Featured Tours</div>
          <div className="admin-section-header__sub">
            These tours appear in the Popular Tours rail on the home page. Drag
            to reorder. Maximum 10.
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr clamp(260px, 36%, 380px)",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* Featured list — draggable */}
        <div className="admin-card" style={{ padding: 0 }}>
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid var(--a-border)",
              fontFamily: "var(--font-body)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--a-text)",
              opacity: 0.45,
            }}
          >
            Featured ({featured.length}/10) — drag to reorder
          </div>
          {featuredTours.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty__text">
                No featured tours. Add some from the list on the right.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {featuredTours.map((tour, idx) => (
                <div
                  key={tour.id}
                  draggable
                  onDragStart={() => onDragStart(idx)}
                  onDragOver={(e) => onDragOver(e, idx)}
                  onDragEnd={onDragEnd}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--a-border)",
                    backgroundColor:
                      dragIdx === idx ? "var(--a-border)" : "transparent",
                    cursor: "grab",
                    transition: "background-color 0.15s",
                  }}
                >
                  {/* Drag handle */}
                  <div className="admin-drag-handle" aria-hidden="true">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="currentColor"
                    >
                      <rect x="3" y="2" width="8" height="1.5" />
                      <rect x="3" y="6" width="8" height="1.5" />
                      <rect x="3" y="10" width="8" height="1.5" />
                    </svg>
                  </div>

                  {/* Position number */}
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 10,
                      color: "var(--a-accent)",
                      minWidth: 20,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </span>

                  {/* Thumbnail */}
                  <img
                    src={`/media/tours/${tour.imageSlot}`}
                    alt={tour.imageAlt}
                    className="admin-thumb"
                  />

                  {/* Tour name */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--a-text)",
                        lineHeight: 1.3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tour.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 10,
                        color: "var(--a-text)",
                        opacity: 0.4,
                        marginTop: 2,
                      }}
                    >
                      {tour.duration} {tour.duration === 1 ? "day" : "days"} ·{" "}
                      {tour.difficulty}
                    </div>
                  </div>

                  {/* Move up/down + remove */}
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="admin-btn admin-btn--secondary admin-btn--sm"
                      style={{
                        padding: "4px 8px",
                        opacity: idx === 0 ? 0.3 : 1,
                      }}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === featuredTours.length - 1}
                      className="admin-btn admin-btn--secondary admin-btn--sm"
                      style={{
                        padding: "4px 8px",
                        opacity: idx === featuredTours.length - 1 ? 0.3 : 1,
                      }}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeFromFeatured(tour.id)}
                      className="admin-btn admin-btn--danger admin-btn--sm"
                      style={{ padding: "4px 8px" }}
                      aria-label={`Remove ${tour.name}`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available tours to add */}
        <div
          className="admin-card"
          style={{ padding: 0, position: "sticky", top: 72 }}
        >
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid var(--a-border)",
              fontFamily: "var(--font-body)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--a-text)",
              opacity: 0.45,
            }}
          >
            Add to featured
          </div>
          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {availableTours.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty__text">
                  All tours are already featured.
                </div>
              </div>
            ) : (
              availableTours.map((tour) => (
                <div
                  key={tour.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 16px",
                    borderBottom: "1px solid var(--a-border)",
                  }}
                >
                  <img
                    src={`/media/tours/${tour.imageSlot}`}
                    alt={tour.imageAlt}
                    className="admin-thumb"
                    style={{ width: 44, height: 32 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "var(--a-text)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        lineHeight: 1.3,
                      }}
                    >
                      {tour.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 9,
                        color: "var(--a-text)",
                        opacity: 0.4,
                        marginTop: 1,
                      }}
                    >
                      {tour.duration}d · {tour.difficulty}
                    </div>
                  </div>
                  <button
                    onClick={() => addToFeatured(tour.id)}
                    className="admin-btn admin-btn--secondary admin-btn--sm"
                    disabled={featured.length >= 10}
                    aria-label={`Add ${tour.name} to featured`}
                  >
                    + Add
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

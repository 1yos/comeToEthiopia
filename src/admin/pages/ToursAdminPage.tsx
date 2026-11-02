import { useState } from "react";
import { Link } from "react-router-dom";
import { tours as hardcodedTours } from "@/data/tours";
import type { Tour } from "@/data/tours";

// For now reads from hardcoded data; Phase 2 will swap to CMS JSON
function useTours() {
  const [data, setData] = useState<Tour[]>(hardcodedTours);

  const deleteTour = (id: string) => {
    if (!confirm(`Delete this tour? This cannot be undone.`)) return;
    setData((prev) => prev.filter((t) => t.id !== id));
  };

  return { data, setData, deleteTour };
}

const DIFFICULTY_LABELS = {
  easy: "Easy",
  moderate: "Moderate",
  demanding: "Demanding",
};

export function ToursAdminPage() {
  const { data: tours, deleteTour } = useTours();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "easy" | "moderate" | "demanding"
  >("all");

  const filtered = tours.filter((t) => {
    const matchSearch =
      search === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.regionIds.some((r) => r.includes(search.toLowerCase()));
    const matchFilter = filter === "all" || t.difficulty === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tours</h1>
          <p className="admin-page-sub">
            {tours.length} tours in the catalogue.
          </p>
        </div>
        <Link to="/admin/tours/new" className="admin-btn admin-btn--primary">
          + Add tour
        </Link>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search by name or region…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input"
          style={{ maxWidth: 280 }}
        />
        <div style={{ display: "flex", gap: 4 }}>
          {(["all", "easy", "moderate", "demanding"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className="admin-btn admin-btn--secondary admin-btn--sm"
              style={{
                backgroundColor: filter === d ? "var(--ink)" : "transparent",
                color: filter === d ? "var(--paper)" : "var(--ink)",
                border: `1px solid ${filter === d ? "var(--ink)" : "rgba(18,17,16,0.2)"}`,
              }}
            >
              {d === "all" ? "All" : DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "var(--ink)",
            opacity: 0.4,
          }}
        >
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ padding: 0 }}>
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__text">No tours match your search.</div>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tour</th>
                <th>Duration</th>
                <th>Difficulty</th>
                <th>Interests</th>
                <th style={{ width: 120 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tour) => (
                <tr key={tour.id}>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <img
                        src={`/media/tours/${tour.imageSlot}`}
                        alt={tour.imageAlt}
                        className="admin-thumb"
                      />
                      <div>
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 13,
                            color: "var(--ink)",
                            fontWeight: 500,
                            lineHeight: 1.3,
                          }}
                        >
                          {tour.name}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-display)",
                            fontStyle: "italic",
                            fontSize: 11,
                            color: "var(--ink)",
                            opacity: 0.45,
                            marginTop: 2,
                          }}
                        >
                          {tour.tagline}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: "var(--ink)",
                      opacity: 0.6,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tour.duration} {tour.duration === 1 ? "day" : "days"}
                  </td>
                  <td>
                    <span
                      className={`admin-badge admin-badge--${tour.difficulty}`}
                    >
                      {tour.difficulty}
                    </span>
                  </td>
                  <td
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      color: "var(--ink)",
                      opacity: 0.5,
                    }}
                  >
                    {tour.interests.join(", ")}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Link
                        to={`/admin/tours/${tour.id}`}
                        className="admin-btn admin-btn--secondary admin-btn--sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteTour(tour.id)}
                        className="admin-btn admin-btn--danger admin-btn--sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

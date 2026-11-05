import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { tours as hardcodedTours } from "@/data/tours";
import type { Tour } from "@/data/tours";
import { ConfirmDialog } from "../components/ConfirmDialog";

type SortKey = "name" | "duration" | "difficulty";
type SortDir = "asc" | "desc";

// For now reads from hardcoded data; Phase 2 will swap to CMS JSON
function useTours() {
  const [data, setData] = useState<Tour[]>(hardcodedTours);

  const deleteTour = (id: string) => {
    setData((prev) => prev.filter((t) => t.id !== id));
  };

  const duplicateTour = (id: string) => {
    const tour = data.find((t) => t.id === id);
    if (!tour) return;
    const copy: Tour = {
      ...tour,
      id: `${tour.id}-copy-${Date.now()}`,
      name: `${tour.name} (copy)`,
    };
    setData((prev) => [...prev, copy]);
  };

  return { data, setData, deleteTour, duplicateTour };
}

const DIFFICULTY_LABELS = {
  easy: "Easy",
  moderate: "Moderate",
  demanding: "Demanding",
};

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className="admin-table__sort-icon" style={{ display: "inline-flex" }}>
      {active ? (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          {dir === "asc" ? <path d="M5 2l3 4H2z" /> : <path d="M5 8L2 4h6z" />}
        </svg>
      ) : (
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="currentColor"
          opacity={0.4}
        >
          <path d="M5 2l2 2H3zM5 8l2-2H3z" />
        </svg>
      )}
    </span>
  );
}

export function ToursAdminPage() {
  const { data: tours, deleteTour, duplicateTour } = useTours();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "easy" | "moderate" | "demanding"
  >("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [confirmDelete, setConfirmDelete] = useState<Tour | null>(null);

  const filtered = useMemo(() => {
    let result = tours.filter((t) => {
      const matchSearch =
        search === "" ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.regionIds.some((r) => r.includes(search.toLowerCase()));
      const matchFilter = filter === "all" || t.difficulty === filter;
      return matchSearch && matchFilter;
    });

    // Sort
    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "duration") cmp = a.duration - b.duration;
      else if (sortKey === "difficulty") {
        const order = { easy: 0, moderate: 1, demanding: 2 };
        cmp = order[a.difficulty] - order[b.difficulty];
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [tours, search, filter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((p) => (p === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div>
      <div className="admin-section-header">
        <div className="admin-section-header__left">
          <div className="admin-section-header__title">Tours</div>
          <div className="admin-section-header__sub">
            {tours.length} tours in the catalogue.
          </div>
        </div>
        <div className="admin-section-header__actions">
          <Link to="/admin/tours/new" className="admin-btn admin-btn--primary">
            + Add tour
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filter-bar">
        <input
          type="text"
          placeholder="Search by name or region…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input admin-filter-bar__input"
        />
        <div className="admin-filter-bar__chips">
          {(["all", "easy", "moderate", "demanding"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`admin-filter-chip${filter === d ? " admin-filter-chip--active" : ""}`}
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
            color: "var(--a-muted)",
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
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th
                    data-sortable
                    data-sort-dir={sortKey === "name" ? sortDir : undefined}
                    onClick={() => toggleSort("name")}
                  >
                    Tour <SortIcon active={sortKey === "name"} dir={sortDir} />
                  </th>
                  <th
                    data-sortable
                    data-sort-dir={sortKey === "duration" ? sortDir : undefined}
                    onClick={() => toggleSort("duration")}
                  >
                    Duration{" "}
                    <SortIcon active={sortKey === "duration"} dir={sortDir} />
                  </th>
                  <th
                    data-sortable
                    data-sort-dir={
                      sortKey === "difficulty" ? sortDir : undefined
                    }
                    onClick={() => toggleSort("difficulty")}
                  >
                    Difficulty{" "}
                    <SortIcon active={sortKey === "difficulty"} dir={sortDir} />
                  </th>
                  <th>Interests</th>
                  <th style={{ width: 150 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tour) => (
                  <tr key={tour.id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
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
                              color: "var(--a-text)",
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
                              color: "var(--a-text)",
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
                        color: "var(--a-text)",
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
                        color: "var(--a-text)",
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
                          onClick={() => duplicateTour(tour.id)}
                          className="admin-btn admin-btn--ghost admin-btn--sm"
                          title="Duplicate tour"
                        >
                          ⧉
                        </button>
                        <button
                          onClick={() => setConfirmDelete(tour)}
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
          </div>
        )}
      </div>

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete tour?"
        message="This will permanently remove the tour from your catalogue. This action cannot be undone."
        itemName={confirmDelete?.name}
        confirmLabel="Delete tour"
        onConfirm={() => {
          if (confirmDelete) deleteTour(confirmDelete.id);
          setConfirmDelete(null);
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

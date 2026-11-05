import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { tours as hardcodedTours } from "@/data/tours";
import type { Tour } from "@/data/tours";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useDebounce } from "../hooks/useDebounce";
import { logActivity } from "../lib/activityLog";

type SortKey = "name" | "duration" | "difficulty";
type SortDir = "asc" | "desc";

// For now reads from hardcoded data; Phase 2 will swap to CMS JSON
function useTours() {
  const [data, setData] = useState<Tour[]>(hardcodedTours);

  const deleteTour = (id: string) => {
    setData((prev) => prev.filter((t) => t.id !== id));
  };

  const deleteTours = (ids: string[]) => {
    const idSet = new Set(ids);
    setData((prev) => prev.filter((t) => !idSet.has(t.id)));
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

  return { data, setData, deleteTour, deleteTours, duplicateTour };
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

function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: "var(--a-text-xs)",
          color: "var(--a-muted)",
        }}
      >
        <span>
          Showing {start}–{end} of {total}
        </span>
        <span style={{ opacity: 0.4 }}>·</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="admin-select"
          style={{
            width: "auto",
            padding: "3px 8px",
            fontSize: "var(--a-text-xs)",
          }}
        >
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <button
            className="admin-btn admin-btn--secondary admin-btn--sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            style={{ opacity: page <= 1 ? 0.4 : 1 }}
          >
            ← Prev
          </button>
          <span
            style={{
              fontSize: "var(--a-text-xs)",
              color: "var(--a-muted)",
              fontVariantNumeric: "tabular-nums",
              padding: "0 8px",
            }}
          >
            {page} / {totalPages}
          </span>
          <button
            className="admin-btn admin-btn--secondary admin-btn--sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            style={{ opacity: page >= totalPages ? 0.4 : 1 }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export function ToursAdminPage() {
  const { data: tours, deleteTour, deleteTours, duplicateTour } = useTours();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);
  const [filter, setFilter] = useState<
    "all" | "easy" | "moderate" | "demanding"
  >("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [confirmDelete, setConfirmDelete] = useState<Tour | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  // Row selection
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    let result = tours.filter((t) => {
      const matchSearch =
        debouncedSearch === "" ||
        t.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        t.regionIds.some((r) => r.includes(debouncedSearch.toLowerCase()));
      const matchFilter = filter === "all" || t.difficulty === filter;
      return matchSearch && matchFilter;
    });

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
  }, [tours, debouncedSearch, filter, sortKey, sortDir]);

  // Reset page when filter/search changes
  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(pageStart, pageStart + pageSize);

  // Selection helpers
  const pageIds = pageItems.map((t) => t.id);
  const allOnPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const someOnPageSelected = pageIds.some((id) => selected.has(id));

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePage = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  // Reset page and selection on filter/search change
  const filterKey = `${debouncedSearch}-${filter}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setPage(1);
    clearSelection();
  }

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
            fontSize: "var(--a-text-xs)",
            color: "var(--a-muted)",
          }}
        >
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="admin-bulk-bar">
          <span className="admin-bulk-bar__count">
            <strong>{selected.size}</strong> selected
          </span>
          <div style={{ display: "flex", gap: "var(--a-space-2)" }}>
            <button
              className="admin-btn admin-btn--ghost admin-btn--sm"
              onClick={clearSelection}
            >
              Clear
            </button>
            <button
              className="admin-btn admin-btn--danger admin-btn--sm"
              onClick={() => setConfirmBulkDelete(true)}
            >
              Delete selected
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="admin-card" style={{ padding: 0 }}>
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__text">No tours match your search.</div>
          </div>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: 36, padding: "8px" }}>
                      <input
                        type="checkbox"
                        className="admin-table__check"
                        checked={allOnPageSelected}
                        ref={(el) => {
                          if (el)
                            el.indeterminate =
                              someOnPageSelected && !allOnPageSelected;
                        }}
                        onChange={togglePage}
                        aria-label="Select all on page"
                      />
                    </th>
                    <th
                      data-sortable
                      data-sort-dir={sortKey === "name" ? sortDir : undefined}
                      onClick={() => toggleSort("name")}
                    >
                      Tour{" "}
                      <SortIcon active={sortKey === "name"} dir={sortDir} />
                    </th>
                    <th
                      data-sortable
                      data-sort-dir={
                        sortKey === "duration" ? sortDir : undefined
                      }
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
                      <SortIcon
                        active={sortKey === "difficulty"}
                        dir={sortDir}
                      />
                    </th>
                    <th>Interests</th>
                    <th style={{ width: 150 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((tour) => (
                    <tr key={tour.id}>
                      <td style={{ padding: "8px" }}>
                        <input
                          type="checkbox"
                          className="admin-table__check"
                          checked={selected.has(tour.id)}
                          onChange={() => toggleRow(tour.id)}
                          aria-label={`Select ${tour.name}`}
                        />
                      </td>
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
                                fontSize: "var(--a-text-sm)",
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
                                fontSize: "var(--a-text-xs)",
                                color: "var(--a-muted)",
                                marginTop: 2,
                              }}
                            >
                              {tour.tagline}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        data-numeric
                        style={{
                          fontSize: "var(--a-text-sm)",
                          color: "var(--a-muted)",
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
                          fontSize: "var(--a-text-xs)",
                          color: "var(--a-muted)",
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

            {/* Pagination */}
            <div
              style={{
                borderTop: "1px solid var(--a-border)",
                backgroundColor: "var(--a-bg-subtle)",
                borderRadius: "0 0 var(--a-radius-md) var(--a-radius-md)",
              }}
            >
              <Pagination
                page={currentPage}
                pageSize={pageSize}
                total={totalFiltered}
                onPageChange={setPage}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setPage(1);
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Confirm single delete */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete tour?"
        message="This will permanently remove the tour from your catalogue. This action cannot be undone."
        itemName={confirmDelete?.name}
        confirmLabel="Delete tour"
        onConfirm={() => {
          if (confirmDelete) {
            deleteTour(confirmDelete.id);
            logActivity("Tour deleted", confirmDelete.name, "/admin/tours");
          }
          setConfirmDelete(null);
        }}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* Confirm bulk delete */}
      <ConfirmDialog
        open={confirmBulkDelete}
        title="Delete selected tours?"
        message={`${selected.size} tour${selected.size === 1 ? "" : "s"} will be permanently removed from your catalogue. This action cannot be undone.`}
        confirmLabel={`Delete ${selected.size} tour${selected.size === 1 ? "" : "s"}`}
        onConfirm={() => {
          deleteTours([...selected]);
          logActivity(
            "Bulk delete tours",
            `${selected.size} tours deleted`,
            "/admin/tours",
          );
          clearSelection();
          setConfirmBulkDelete(false);
        }}
        onCancel={() => setConfirmBulkDelete(false)}
      />
    </div>
  );
}

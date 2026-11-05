import { useState, useEffect, useCallback } from "react";
import {
  getEnquiries,
  updateEnquiryStatus,
  updateEnquiryNotes,
  deleteEnquiry,
  exportEnquiriesCSV,
  markAllRead,
  type Enquiry,
} from "../lib/enquiries";
import { ConfirmDialog } from "../components/ConfirmDialog";

const STATUS_LABELS: Record<Enquiry["status"], string> = {
  new: "New",
  "in-progress": "In progress",
  replied: "Replied",
  closed: "Closed",
  archived: "Archived",
};

const STATUS_ORDER: Enquiry["status"][] = [
  "new",
  "in-progress",
  "replied",
  "closed",
  "archived",
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
      {message}
    </div>
  );
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  const hours = Math.floor(ms / 3600000);
  const days = Math.floor(ms / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [filter, setFilter] = useState<"all" | Enquiry["status"]>("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Enquiry | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  const load = useCallback(() => setEnquiries(getEnquiries()), []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  // Sync notes draft when selection changes
  useEffect(() => {
    setNotesDraft(selected?.internalNotes ?? "");
  }, [selected]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatus = (id: string, status: Enquiry["status"]) => {
    updateEnquiryStatus(id, status);
    load();
    if (selected?.id === id)
      setSelected((prev) => (prev ? { ...prev, status } : null));
    showToast(`Marked as ${STATUS_LABELS[status]}.`, "success");
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    deleteEnquiry(confirmDelete.id);
    load();
    if (selected?.id === confirmDelete.id) setSelected(null);
    setConfirmDelete(null);
    showToast("Enquiry deleted.", "success");
  };

  const handleMarkAllRead = () => {
    markAllRead();
    load();
    showToast("All enquiries marked as read.", "success");
  };

  const handleSaveNotes = () => {
    if (!selected) return;
    updateEnquiryNotes(selected.id, notesDraft);
    load();
    showToast("Notes saved.", "success");
  };

  const buildWhatsAppLink = (e: Enquiry, whatsapp: string) => {
    const tourText =
      e.selectedTourNames.length > 0
        ? e.selectedTourNames.join(", ")
        : e.tourFreeText || "a tour";
    const text = `Hi ${e.name}, thank you for your enquiry about ${tourText}. I would be happy to help plan your trip to Ethiopia. When works for a quick call or shall I send you an itinerary directly?`;
    return `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
  };

  const buildEmailLink = (e: Enquiry) => {
    const tourText =
      e.selectedTourNames.length > 0
        ? e.selectedTourNames.join(", ")
        : e.tourFreeText || "your upcoming trip";
    const subject = `Re: Your Ethiopia trip enquiry — ${tourText}`;
    const body = `Hi ${e.name},\n\nThank you for getting in touch about ${tourText}.\n\nI've reviewed your brief and I'd love to help plan your trip.\n\nBest regards,\nCome to Ethiopia Tours`;
    return `mailto:${e.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const WHATSAPP = "+251903182009";

  const filtered = enquiries.filter((e) => {
    const matchFilter = filter === "all" || e.status === filter;
    const matchSearch =
      search === "" ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.selectedTourNames.some((t) =>
        t.toLowerCase().includes(search.toLowerCase()),
      ) ||
      (e.tourFreeText?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchFilter && matchSearch;
  });

  const newCount = enquiries.filter((e) => e.status === "new").length;

  return (
    <div>
      <div className="admin-section-header">
        <div className="admin-section-header__left">
          <div className="admin-section-header__title">
            Enquiries
            {newCount > 0 && (
              <span
                style={{
                  display: "inline-block",
                  marginLeft: 10,
                  backgroundColor: "var(--a-accent)",
                  color: "white",
                  fontSize: "var(--a-text-xs)",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "var(--a-radius-full)",
                  verticalAlign: "middle",
                }}
              >
                {newCount} new
              </span>
            )}
          </div>
          <div className="admin-section-header__sub">
            {enquiries.length} total · {newCount} unread
          </div>
        </div>
        <div className="admin-section-header__actions">
          {newCount > 0 && (
            <button
              className="admin-btn admin-btn--ghost"
              onClick={handleMarkAllRead}
            >
              Mark all read
            </button>
          )}
          <button
            className="admin-btn admin-btn--secondary"
            onClick={() => {
              exportEnquiriesCSV(filtered);
              showToast("CSV downloaded.", "success");
            }}
            disabled={enquiries.length === 0}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="admin-filter-bar">
        <input
          type="text"
          placeholder="Search by name, email, or tour…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input admin-filter-bar__input"
        />
        <div className="admin-filter-bar__chips">
          {(["all", ...STATUS_ORDER] as const).map((f) => {
            const count =
              f === "all"
                ? enquiries.length
                : enquiries.filter((e) => e.status === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`admin-filter-chip${filter === f ? " admin-filter-chip--active" : ""}`}
                style={{ textTransform: "capitalize" }}
              >
                {f === "all" ? "All" : STATUS_LABELS[f]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: selected
            ? "1fr clamp(320px, 38%, 460px)"
            : "1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* List */}
        <div className="admin-content-card">
          {filtered.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty__icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="1" y="3" width="14" height="10" />
                  <path d="M1 3l7 5.5L15 3" />
                </svg>
              </div>
              <div className="admin-empty__text">
                {filter === "all" && !search
                  ? "No enquiries yet. Submissions from the Plan Trip form will appear here."
                  : `No enquiries match your ${search ? "search" : "filter"}.`}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {filtered.map((enq) => (
                <button
                  key={enq.id}
                  onClick={() => setSelected(enq)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: "16px 20px",
                    background:
                      selected?.id === enq.id ? "var(--a-bg-subtle)" : "none",
                    border: "none",
                    borderLeft:
                      enq.status === "new"
                        ? "3px solid var(--a-accent)"
                        : "3px solid transparent",
                    borderBottom: "1px solid var(--a-border)",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    transition: "background-color 0.15s",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      backgroundColor:
                        enq.status === "new"
                          ? "var(--a-accent)"
                          : "var(--a-sidebar)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "var(--a-text-sm)",
                      fontWeight: 600,
                      flexShrink: 0,
                      borderRadius: "50%",
                    }}
                  >
                    {enq.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 8,
                        marginBottom: 3,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "var(--a-text-sm)",
                          color: "var(--a-text)",
                          fontWeight: enq.status === "new" ? 600 : 400,
                        }}
                      >
                        {enq.name}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          color: "var(--a-faint)",
                          flexShrink: 0,
                        }}
                      >
                        {timeAgo(enq.timestamp)}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "var(--a-text-xs)",
                        color: "var(--a-muted)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {enq.selectedTourNames.length > 0
                        ? enq.selectedTourNames.slice(0, 2).join(", ") +
                          (enq.selectedTourNames.length > 2
                            ? ` +${enq.selectedTourNames.length - 2}`
                            : "")
                        : enq.tourFreeText || "No specific tour"}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 5,
                        alignItems: "center",
                      }}
                    >
                      <span
                        className={`admin-badge admin-badge--${enq.status}`}
                      >
                        {STATUS_LABELS[enq.status]}
                      </span>
                      {enq.dates && (
                        <span style={{ fontSize: 10, color: "var(--a-muted)" }}>
                          {enq.dates}
                        </span>
                      )}
                      {enq.groupSize && (
                        <span style={{ fontSize: 10, color: "var(--a-muted)" }}>
                          {enq.groupSize}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div
            className="admin-card"
            style={{
              position: "sticky",
              top: "calc(var(--a-topbar-h) + 16px)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "var(--a-text-md)",
                    fontWeight: 700,
                    color: "var(--a-text)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {selected.name}
                </div>
                <div
                  style={{
                    fontSize: "var(--a-text-sm)",
                    color: "var(--a-muted)",
                    marginTop: 2,
                  }}
                >
                  {formatDate(selected.timestamp)}
                </div>
              </div>
              <button
                className="admin-modal__close"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Status workflow */}
            <div
              style={{
                display: "flex",
                gap: 5,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              {STATUS_ORDER.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatus(selected.id, s)}
                  className={`admin-filter-chip${selected.status === s ? " admin-filter-chip--active" : ""}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>

            {/* Details */}
            <div
              style={{
                borderTop: "1px solid var(--a-border)",
                marginBottom: 20,
              }}
            >
              {[
                { label: "Email", value: selected.email },
                {
                  label: "Tours",
                  value:
                    selected.selectedTourNames.length > 0
                      ? selected.selectedTourNames.join(", ")
                      : selected.tourFreeText || "—",
                },
                { label: "When", value: selected.dates || "—" },
                { label: "Group", value: selected.groupSize || "—" },
                { label: "Notes", value: selected.notes || "—" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr",
                    gap: 12,
                    padding: "10px 0",
                    borderBottom: "1px solid var(--a-border)",
                    alignItems: "start",
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--a-faint)",
                      paddingTop: 2,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: "var(--a-text-sm)",
                      color: "var(--a-text)",
                      lineHeight: 1.5,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Internal notes */}
            <div className="admin-field" style={{ marginBottom: 20 }}>
              <label className="admin-label">Internal notes</label>
              <textarea
                className="admin-textarea"
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                rows={2}
                placeholder="Private notes for your team…"
                style={{ minHeight: 60 }}
              />
              <button
                className="admin-btn admin-btn--secondary admin-btn--sm"
                onClick={handleSaveNotes}
                style={{ marginTop: 6 }}
              >
                Save notes
              </button>
            </div>

            {/* Reply CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <a
                href={buildWhatsAppLink(selected, WHATSAPP)}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn--primary"
                style={{
                  justifyContent: "center",
                  backgroundColor: "var(--a-success)",
                }}
                onClick={() => handleStatus(selected.id, "replied")}
              >
                Reply via WhatsApp
              </a>
              <a
                href={buildEmailLink(selected)}
                className="admin-btn admin-btn--secondary"
                style={{ justifyContent: "center" }}
                onClick={() => handleStatus(selected.id, "replied")}
              >
                Reply via Email
              </a>
              <button
                className="admin-btn admin-btn--danger"
                style={{ justifyContent: "center" }}
                onClick={() => setConfirmDelete(selected)}
              >
                Delete enquiry
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation dialog */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete enquiry?"
        message="This will permanently remove the enquiry from your inbox. This action cannot be undone."
        itemName={
          confirmDelete
            ? `${confirmDelete.name} — ${formatDate(confirmDelete.timestamp)}`
            : undefined
        }
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import {
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  exportEnquiriesCSV,
  type Enquiry,
} from "../lib/enquiries";

const STATUS_LABELS: Record<Enquiry["status"], string> = {
  new: "New",
  replied: "Replied",
  archived: "Archived",
};

const STATUS_COLORS: Record<Enquiry["status"], string> = {
  new: "var(--ochre)",
  replied: "var(--highland)",
  archived: "rgba(18,17,16,0.3)",
};

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
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const load = useCallback(() => setEnquiries(getEnquiries()), []);

  useEffect(() => {
    load();
    // Refresh every 30s in case another tab submits
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatus = (id: string, status: Enquiry["status"]) => {
    updateEnquiryStatus(id, status);
    load();
    if (selected?.id === id)
      setSelected((prev) => (prev ? { ...prev, status } : null));
    showToast(`Marked as ${status}.`, "success");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this enquiry permanently?")) return;
    deleteEnquiry(id);
    load();
    if (selected?.id === id) setSelected(null);
    showToast("Enquiry deleted.", "success");
  };

  const buildWhatsAppLink = (e: Enquiry, whatsapp: string) => {
    const tours =
      e.selectedTourNames.length > 0
        ? e.selectedTourNames.join(", ")
        : e.tourFreeText || "a tour";
    const text = `Hi ${e.name}, thank you for your enquiry about ${tours}. I would be happy to help plan your trip to Ethiopia. When works for a quick call or shall I send you an itinerary directly?`;
    return `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
  };

  const buildEmailLink = (e: Enquiry) => {
    const tours =
      e.selectedTourNames.length > 0
        ? e.selectedTourNames.join(", ")
        : e.tourFreeText || "your upcoming trip";
    const subject = `Re: Your Ethiopia trip enquiry — ${tours}`;
    const body = `Hi ${e.name},\n\nThank you for getting in touch about ${tours}.\n\nI've reviewed your brief and I'd love to help plan your trip.\n\nBest regards,\nCome to Ethiopia Tours`;
    return `mailto:${e.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const WHATSAPP = "+251903182009";

  const filtered = enquiries.filter(
    (e) => filter === "all" || e.status === filter,
  );

  const newCount = enquiries.filter((e) => e.status === "new").length;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            Enquiries
            {newCount > 0 && (
              <span
                style={{
                  display: "inline-block",
                  marginLeft: 10,
                  backgroundColor: "var(--ochre)",
                  color: "var(--ink)",
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 8px",
                  verticalAlign: "middle",
                }}
              >
                {newCount} new
              </span>
            )}
          </h1>
          <p className="admin-page-sub">
            {enquiries.length} total · {newCount} unread
          </p>
        </div>
        <button
          className="admin-btn admin-btn--secondary"
          onClick={() => {
            exportEnquiriesCSV();
            showToast("CSV downloaded.", "success");
          }}
          disabled={enquiries.length === 0}
        >
          Export CSV
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {(["all", "new", "replied", "archived"] as const).map((f) => {
          const count =
            f === "all"
              ? enquiries.length
              : enquiries.filter((e) => e.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="admin-btn admin-btn--secondary admin-btn--sm"
              style={{
                backgroundColor: filter === f ? "var(--ink)" : "transparent",
                color: filter === f ? "var(--paper)" : "var(--ink)",
                border: `1px solid ${filter === f ? "var(--ink)" : "rgba(18,17,16,0.2)"}`,
                textTransform: "capitalize",
              }}
            >
              {f === "all" ? "All" : STATUS_LABELS[f]} ({count})
            </button>
          );
        })}
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
        <div className="admin-card" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty__icon">[ ]</div>
              <div className="admin-empty__text">
                {filter === "all"
                  ? "No enquiries yet. Submissions from the Plan Trip form will appear here."
                  : `No ${filter} enquiries.`}
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
                      selected?.id === enq.id ? "rgba(18,17,16,0.03)" : "none",
                    border: "none",
                    borderLeft:
                      enq.status === "new"
                        ? "3px solid var(--ochre)"
                        : "3px solid transparent",
                    borderBottom: "1px solid rgba(18,17,16,0.06)",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    transition: "background-color 0.15s",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      backgroundColor:
                        enq.status === "new" ? "var(--ochre)" : "var(--indigo)",
                      color: "var(--paper)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      fontWeight: 600,
                      flexShrink: 0,
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
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          color: "var(--ink)",
                          fontWeight: enq.status === "new" ? 600 : 400,
                        }}
                      >
                        {enq.name}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 10,
                          color: "var(--ink)",
                          opacity: 0.4,
                          flexShrink: 0,
                        }}
                      >
                        {timeAgo(enq.timestamp)}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--ink)",
                        opacity: 0.5,
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
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 9,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: STATUS_COLORS[enq.status],
                        }}
                      >
                        {STATUS_LABELS[enq.status]}
                      </span>
                      {enq.dates && (
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 10,
                            color: "var(--ink)",
                            opacity: 0.4,
                          }}
                        >
                          {enq.dates}
                        </span>
                      )}
                      {enq.groupSize && (
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 10,
                            color: "var(--ink)",
                            opacity: 0.4,
                          }}
                        >
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
          <div className="admin-card" style={{ position: "sticky", top: 72 }}>
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
                    fontFamily: "var(--font-display)",
                    fontVariationSettings: '"opsz" 24, "wght" 600',
                    fontSize: "1.2rem",
                    color: "var(--ink)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {selected.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink)",
                    opacity: 0.5,
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

            {/* Status */}
            <div style={{ display: "flex", gap: 5, marginBottom: 20 }}>
              {(["new", "replied", "archived"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatus(selected.id, s)}
                  className="admin-btn admin-btn--secondary admin-btn--sm"
                  style={{
                    backgroundColor:
                      selected.status === s ? "var(--ink)" : "transparent",
                    color:
                      selected.status === s ? "var(--paper)" : "var(--ink)",
                    border: `1px solid ${selected.status === s ? "var(--ink)" : "rgba(18,17,16,0.2)"}`,
                    textTransform: "capitalize",
                  }}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>

            {/* Details */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
                borderTop: "1px solid rgba(18,17,16,0.08)",
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
                      opacity: 0.35,
                      paddingTop: 2,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--ink)",
                      lineHeight: 1.5,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
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
                  backgroundColor: "var(--highland)",
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
                onClick={() => handleDelete(selected.id)}
              >
                Delete enquiry
              </button>
            </div>
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

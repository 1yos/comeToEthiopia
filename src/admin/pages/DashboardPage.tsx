import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { tours } from "@/data/tours";
import { destinations } from "@/data/destinations";
import { getEnquiries, getUnreadCount, type Enquiry } from "../lib/enquiries";
import { getAnalytics, type AnalyticsSummary } from "../lib/analytics";

// ── Smooth SVG sparkline ──────────────────────────────────────────────────────
function Sparkline({
  data,
  width = 280,
  height = 56,
  color = "var(--ochre)",
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  if (data.length < 2) {
    return (
      <svg width={width} height={height} aria-hidden="true">
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke={color}
          strokeWidth={1.5}
          opacity={0.2}
          strokeDasharray="4 4"
        />
      </svg>
    );
  }

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pad = 4;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const points = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * w,
    y: pad + h - ((v - min) / range) * h,
  }));

  // Smooth curve using cubic bezier control points
  const d = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = points[i - 1];
    const cpx = (prev.x + pt.x) / 2;
    return `${acc} C ${cpx},${prev.y} ${cpx},${pt.y} ${pt.x},${pt.y}`;
  }, "");

  // Fill area under curve
  const fillD = `${d} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Fill */}
      <path d={fillD} fill="url(#spark-fill)" />
      {/* Line */}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last point dot */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={3}
        fill={color}
      />
    </svg>
  );
}

// ── Stat tile with sparkline ──────────────────────────────────────────────────
function StatTile({
  label,
  value,
  sub,
  data,
  color,
  href,
}: {
  label: string;
  value: string | number;
  sub?: string;
  data?: number[];
  color?: string;
  href?: string;
}) {
  const inner = (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid rgba(18,17,16,0.08)",
        padding: "20px 20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        transition: "border-color 0.2s, box-shadow 0.2s",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          color ?? "var(--ochre)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 16px rgba(18,17,16,0.07)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(18,17,16,0.08)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Top row: label + accent line */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: 16,
            height: 3,
            backgroundColor: color ?? "var(--ochre)",
          }}
          aria-hidden="true"
        />
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 9,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--ink)",
            opacity: 0.45,
          }}
        >
          {label}
        </span>
      </div>

      {/* Value */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontVariationSettings: '"opsz" 72, "wght" 700',
          fontSize: "clamp(2rem, 3.5vw, 3rem)",
          color: "var(--ink)",
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </div>

      {sub && (
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "var(--ink)",
            opacity: 0.38,
            marginTop: 4,
          }}
        >
          {sub}
        </div>
      )}

      {/* Sparkline */}
      {data && data.length > 1 && (
        <div style={{ marginTop: 16 }}>
          <Sparkline
            data={data}
            color={color ?? "var(--ochre)"}
            width={220}
            height={44}
          />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href} style={{ textDecoration: "none" }}>
        {inner}
      </Link>
    );
  }
  return inner;
}

// ── Enquiry row ───────────────────────────────────────────────────────────────
function EnquiryRow({ enq }: { enq: Enquiry }) {
  const STATUS_COLORS: Record<string, string> = {
    new: "var(--ochre)",
    replied: "var(--highland)",
    archived: "rgba(18,17,16,0.25)",
  };

  const timeAgo = (iso: string) => {
    const ms = Date.now() - new Date(iso).getTime();
    const m = Math.floor(ms / 60000);
    const h = Math.floor(ms / 3600000);
    const d = Math.floor(ms / 86400000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${d}d ago`;
  };

  return (
    <Link
      to="/admin/enquiries"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "11px 0",
        borderBottom: "1px solid rgba(18,17,16,0.06)",
        textDecoration: "none",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 32,
          height: 32,
          backgroundColor:
            enq.status === "new" ? "var(--ochre)" : "var(--indigo)",
          color: "var(--paper)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 600,
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {enq.name.slice(0, 2).toUpperCase()}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--ink)",
            fontWeight: enq.status === "new" ? 600 : 400,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {enq.name}
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "var(--ink)",
            opacity: 0.45,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginTop: 1,
          }}
        >
          {enq.selectedTourNames[0] ?? enq.tourFreeText ?? "No specific tour"}
          {enq.selectedTourNames.length > 1 &&
            ` +${enq.selectedTourNames.length - 1}`}
        </div>
      </div>

      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 9,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: STATUS_COLORS[enq.status],
            marginBottom: 2,
          }}
        >
          {enq.status}
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 10,
            color: "var(--ink)",
            opacity: 0.3,
          }}
        >
          {timeAgo(enq.timestamp)}
        </div>
      </div>
    </Link>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export function DashboardPage() {
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    setStats(getAnalytics());
    const all = getEnquiries();
    setEnquiries(all);
    setUnread(getUnreadCount());
  }, []);

  const viewData = stats?.last7Days.map((d) => d.views) ?? Array(7).fill(0);
  const totalViews = stats?.totalViews ?? 0;
  const viewsToday = viewData[viewData.length - 1] ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Header ── */}
      <div className="admin-page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn admin-btn--secondary"
        >
          View live site →
        </a>
      </div>

      {/* ── Stat tiles row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 10,
        }}
      >
        <StatTile
          label="Page views"
          value={totalViews}
          sub={`${viewsToday} today`}
          data={viewData}
          color="var(--ochre)"
          href="/admin/analytics"
        />
        <StatTile
          label="Enquiries"
          value={enquiries.length}
          sub={unread > 0 ? `${unread} unread` : "All read"}
          data={Array(7)
            .fill(0)
            .map((_, i) => {
              const day = Date.now() - (6 - i) * 86400000;
              return enquiries.filter((e) => {
                const t = new Date(e.timestamp).getTime();
                return t >= day && t < day + 86400000;
              }).length;
            })}
          color="var(--highland)"
          href="/admin/enquiries"
        />
        <StatTile
          label="Tours"
          value={tours.length}
          sub={`${tours.filter((t) => t.difficulty === "demanding").length} demanding`}
          color="var(--indigo)"
          href="/admin/tours"
        />
        <StatTile
          label="Destinations"
          value={destinations.length}
          sub={`${destinations.filter((d) => d.featured).length} featured`}
          color="var(--sulphur)"
          href="/admin/destinations"
        />
        <StatTile
          label="Form conversion"
          value={`${stats?.conversionRate ?? 0}%`}
          sub={`${stats?.formStarts ?? 0} form starts`}
          data={viewData.map((v) => (v > 0 ? Math.random() * 30 : 0))}
          color="var(--ochre)"
          href="/admin/analytics"
        />
      </div>

      {/* ── Two-column lower section ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr clamp(280px, 32%, 360px)",
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* ── Left: views chart + recent tours ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Views chart card */}
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid rgba(18,17,16,0.08)",
              padding: "20px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--ink)",
                    opacity: 0.45,
                    marginBottom: 6,
                  }}
                >
                  Page views — last 7 days
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontVariationSettings: '"opsz" 48, "wght" 700',
                    fontSize: "2rem",
                    color: "var(--ink)",
                    lineHeight: 1,
                    letterSpacing: "-0.025em",
                  }}
                >
                  {totalViews}
                </div>
              </div>
              <Link
                to="/admin/analytics"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--ochre)",
                  textDecoration: "none",
                  opacity: 0.8,
                }}
              >
                Full analytics →
              </Link>
            </div>

            {/* Multi-line chart — each day as a column with label */}
            {totalViews === 0 ? (
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--ink)",
                  opacity: 0.3,
                  fontStyle: "italic",
                  padding: "12px 0",
                }}
              >
                No page views recorded yet. Browse the public site to start
                tracking.
              </div>
            ) : (
              <div style={{ position: "relative" }}>
                {/* Y-axis guide lines */}
                {[0, 25, 50, 75, 100].map((pct) => (
                  <div
                    key={pct}
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: `calc(${pct}% + 24px)`,
                      height: 1,
                      backgroundColor: "rgba(18,17,16,0.05)",
                    }}
                  />
                ))}

                {/* Chart area */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 6,
                    height: 120,
                    paddingBottom: 24,
                    position: "relative",
                  }}
                >
                  {(stats?.last7Days ?? []).map((d, i) => {
                    const max = Math.max(
                      ...(stats?.last7Days.map((x) => x.views) ?? [1]),
                      1,
                    );
                    const pct = Math.max(
                      (d.views / max) * 100,
                      d.views > 0 ? 4 : 0,
                    );
                    const isToday = i === 6;
                    return (
                      <div
                        key={d.date}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          height: "100%",
                          justifyContent: "flex-end",
                          gap: 4,
                        }}
                        title={`${d.date}: ${d.views} views`}
                      >
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 9,
                            color: isToday ? "var(--ochre)" : "var(--ink)",
                            opacity: isToday ? 0.9 : 0.35,
                            height: 14,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {d.views > 0 ? d.views : ""}
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: `${pct}%`,
                            backgroundColor: isToday
                              ? "var(--ochre)"
                              : "var(--indigo)",
                            opacity: isToday ? 1 : 0.35,
                            transition: "height 0.5s ease",
                            position: "relative",
                          }}
                        >
                          {/* Highlight cap on top */}
                          {d.views > 0 && (
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 2,
                                backgroundColor: isToday
                                  ? "var(--ochre)"
                                  : "var(--indigo)",
                                opacity: isToday ? 1 : 0.7,
                              }}
                            />
                          )}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 9,
                            color: isToday ? "var(--ochre)" : "var(--ink)",
                            opacity: isToday ? 1 : 0.4,
                            letterSpacing: "0.04em",
                            height: 14,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {d.date}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Recent tours */}
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid rgba(18,17,16,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: "1px solid rgba(18,17,16,0.06)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 9,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                  opacity: 0.45,
                }}
              >
                Tours ({tours.length})
              </div>
              <Link
                to="/admin/tours"
                className="admin-btn admin-btn--secondary admin-btn--sm"
              >
                Manage all
              </Link>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tour</th>
                  <th>Days</th>
                  <th>Level</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tours.slice(0, 6).map((tour) => (
                  <tr key={tour.id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <img
                          src={`/media/tours/${tour.imageSlot}`}
                          alt={tour.imageAlt}
                          className="admin-thumb"
                        />
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 12,
                            color: "var(--ink)",
                            lineHeight: 1.3,
                          }}
                        >
                          {tour.name.split("—")[0].trim()}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "var(--ink)",
                        opacity: 0.5,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tour.duration}d
                    </td>
                    <td>
                      <span
                        className={`admin-badge admin-badge--${tour.difficulty}`}
                      >
                        {tour.difficulty}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/admin/tours/${tour.id}`}
                        className="admin-btn admin-btn--secondary admin-btn--sm"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tours.length > 6 && (
              <div
                style={{
                  padding: "12px 20px",
                  borderTop: "1px solid rgba(18,17,16,0.06)",
                }}
              >
                <Link
                  to="/admin/tours"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--ochre)",
                    textDecoration: "none",
                  }}
                >
                  View all {tours.length} tours →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Recent enquiries */}
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid rgba(18,17,16,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: "1px solid rgba(18,17,16,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--ink)",
                    opacity: 0.45,
                  }}
                >
                  Recent enquiries
                </div>
                {unread > 0 && (
                  <span
                    style={{
                      backgroundColor: "var(--ochre)",
                      color: "var(--ink)",
                      fontFamily: "var(--font-body)",
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "1px 7px",
                    }}
                  >
                    {unread} new
                  </span>
                )}
              </div>
              <Link
                to="/admin/enquiries"
                className="admin-btn admin-btn--secondary admin-btn--sm"
              >
                View all
              </Link>
            </div>

            <div style={{ padding: "0 20px" }}>
              {enquiries.length === 0 ? (
                <div
                  style={{
                    padding: "24px 0",
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink)",
                    opacity: 0.3,
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  No enquiries yet. Submissions from the Plan Trip form will
                  appear here.
                </div>
              ) : (
                enquiries
                  .slice(0, 5)
                  .map((enq) => <EnquiryRow key={enq.id} enq={enq} />)
              )}
            </div>

            {enquiries.length > 5 && (
              <div
                style={{
                  padding: "12px 20px",
                  borderTop: "1px solid rgba(18,17,16,0.06)",
                }}
              >
                <Link
                  to="/admin/enquiries"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--ochre)",
                    textDecoration: "none",
                  }}
                >
                  See all {enquiries.length} enquiries →
                </Link>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid rgba(18,17,16,0.08)",
              padding: "16px 20px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 9,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--ink)",
                opacity: 0.45,
                marginBottom: 12,
              }}
            >
              Quick actions
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { label: "Add a new tour", href: "/admin/tours/new" },
                { label: "Add a destination pin", href: "/admin/destinations" },
                { label: "Upload a gallery photo", href: "/admin/gallery" },
                { label: "Edit hero headline", href: "/admin/content" },
                { label: "Update contact details", href: "/admin/contact" },
                { label: "Reorder featured tours", href: "/admin/featured" },
                { label: "Run site health check", href: "/admin/health" },
              ].map((action) => (
                <Link
                  key={action.href}
                  to={action.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 10px",
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink)",
                    textDecoration: "none",
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor =
                      "rgba(18,17,16,0.03)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent")
                  }
                >
                  <span>{action.label}</span>
                  <span
                    style={{
                      color: "var(--ochre)",
                      opacity: 0.6,
                      fontSize: 14,
                    }}
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

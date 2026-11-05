import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { tours } from "@/data/tours";
import { destinations } from "@/data/destinations";
import { getEnquiries, getUnreadCount, type Enquiry } from "../lib/enquiries";
import { getAnalytics, type AnalyticsSummary } from "../lib/analytics";

// ── SVG Area Chart ────────────────────────────────────────────────────────────
function AreaChart({
  data,
  labels,
  height = 160,
  lineColor = "var(--ochre)",
}: {
  data: number[];
  labels: string[];
  height?: number;
  lineColor?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w > 0) setWidth(w);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const n = data.length;
  const max = Math.max(...data, 1);
  const pT = 16,
    pB = 24,
    pL = 4,
    pR = 4;
  const cW = width - pL - pR;
  const cH = height - pT - pB;

  const x = (i: number) => pL + (i / (n - 1)) * cW;
  const y = (v: number) => pT + cH - (v / max) * cH;

  const line = data.reduce((acc, v, i) => {
    if (i === 0) return `M ${x(i)},${y(v)}`;
    const px0 = x(i - 1),
      py0 = y(data[i - 1]);
    const px1 = x(i),
      py1 = y(v);
    const cp = (px0 + px1) / 2;
    return `${acc} C ${cp},${py0} ${cp},${py1} ${px1},${py1}`;
  }, "");

  const area = `${line} L ${x(n - 1)},${pT + cH} L ${x(0)},${pT + cH} Z`;

  return (
    <div ref={containerRef} style={{ width: "100%", position: "relative" }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="cte-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.15" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.33, 0.66, 1].map((f) => (
          <line
            key={f}
            x1={pL}
            x2={width - pR}
            y1={pT + cH * (1 - f)}
            y2={pT + cH * (1 - f)}
            stroke="rgba(17,17,16,0.06)"
            strokeWidth={1}
          />
        ))}

        {/* Area */}
        <path d={area} fill="url(#cte-grad)" />

        {/* Line */}
        <path
          d={line}
          fill="none"
          stroke={lineColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points + hover */}
        {data.map((v, i) => (
          <g key={i}>
            <rect
              x={x(i) - 24}
              y={pT}
              width={48}
              height={cH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
            {/* Dot */}
            {(hover === i || v > 0) && (
              <circle
                cx={x(i)}
                cy={y(v)}
                r={hover === i ? 5 : 3}
                fill={hover === i ? lineColor : "white"}
                stroke={lineColor}
                strokeWidth={2}
                style={{ transition: "r 0.12s" }}
              />
            )}
            {/* Hover tooltip */}
            {hover === i && (
              <>
                <line
                  x1={x(i)}
                  x2={x(i)}
                  y1={pT}
                  y2={pT + cH}
                  stroke={lineColor}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  opacity={0.35}
                />
                <rect
                  x={Math.min(Math.max(x(i) - 20, pL), width - pR - 40)}
                  y={y(v) - 30}
                  width={40}
                  height={22}
                  fill="var(--a-text)"
                  rx={4}
                />
                <text
                  x={Math.min(Math.max(x(i), pL + 20), width - pR - 20)}
                  y={y(v) - 14}
                  textAnchor="middle"
                  fill="white"
                  fontSize={11}
                  fontFamily="var(--font-body)"
                  fontWeight="600"
                >
                  {v}
                </text>
              </>
            )}
            {/* Day label */}
            <text
              x={x(i)}
              y={height - 4}
              textAnchor="middle"
              fill="var(--a-muted)"
              fontSize={10}
              fontFamily="var(--font-body)"
            >
              {labels[i]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  sub,
  accentColor,
  href,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accentColor: string;
  href: string;
}) {
  return (
    <Link to={href} style={{ textDecoration: "none", display: "block" }}>
      <div
        className="admin-stat"
        style={{
          borderTop: `3px solid ${accentColor}`,
          minHeight: 130,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="admin-stat__label">{label}</div>
        <div className="admin-stat__number" style={{ marginTop: "auto" }}>
          {value}
        </div>
        {sub && <div className="admin-stat__sub">{sub}</div>}
      </div>
    </Link>
  );
}

// ── Enquiry row ───────────────────────────────────────────────────────────────
function EnquiryRow({ enq }: { enq: Enquiry }) {
  const ago = (iso: string) => {
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`;
    return `${Math.floor(s / 86400)}d`;
  };

  const avatarBg = enq.status === "new" ? "var(--ochre)" : "var(--a-sidebar)";

  return (
    <Link
      to="/admin/enquiries"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid var(--a-border)",
        textDecoration: "none",
        transition: "background-color 0.12s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--a-bg)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
      }
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: avatarBg,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 700,
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
            fontWeight: enq.status === "new" ? 600 : 400,
            color: "var(--a-text)",
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
            color: "var(--a-muted)",
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
        <span
          style={{
            display: "inline-block",
            fontFamily: "var(--font-body)",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color:
              enq.status === "new"
                ? "var(--ochre)"
                : enq.status === "replied"
                  ? "var(--a-success)"
                  : "var(--a-muted)",
            backgroundColor:
              enq.status === "new"
                ? "var(--a-accent-bg)"
                : enq.status === "replied"
                  ? "var(--a-success-bg)"
                  : "transparent",
            padding: "2px 6px",
            borderRadius: "20px",
            marginBottom: 3,
          }}
        >
          {enq.status}
        </span>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 10,
            color: "var(--a-faint)",
          }}
        >
          {ago(enq.timestamp)}
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
    const refresh = () => {
      setStats(getAnalytics());
      setEnquiries(getEnquiries());
      setUnread(getUnreadCount());
    };
    refresh();
    const iv = setInterval(refresh, 20000);
    return () => clearInterval(iv);
  }, []);

  const viewData = stats?.last7Days.map((d) => d.views) ?? Array(7).fill(0);
  const viewLabels = stats?.last7Days.map((d) => d.date) ?? [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ];
  const totalViews = stats?.totalViews ?? 0;
  const todayViews = viewData[viewData.length - 1] ?? 0;
  const convRate = stats?.conversionRate ?? 0;

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── Page header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">{today}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {unread > 0 && (
            <Link to="/admin/enquiries" className="admin-btn admin-btn--accent">
              {unread} new {unread === 1 ? "enquiry" : "enquiries"}
            </Link>
          )}
        </div>
      </div>

      {/* ── KPI row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 12,
        }}
      >
        <KpiCard
          label="Page views"
          value={totalViews}
          sub={todayViews > 0 ? `+${todayViews} today` : "No views today"}
          accentColor="var(--ochre)"
          href="/admin/analytics"
        />
        <KpiCard
          label="Enquiries"
          value={enquiries.length}
          sub={unread > 0 ? `${unread} unread` : "All read"}
          accentColor="var(--highland)"
          href="/admin/enquiries"
        />
        <KpiCard
          label="Tours"
          value={tours.length}
          sub={`${tours.filter((t) => t.difficulty === "easy").length} easy · ${tours.filter((t) => t.difficulty === "moderate").length} mod`}
          accentColor="var(--indigo)"
          href="/admin/tours"
        />
        <KpiCard
          label="Destinations"
          value={destinations.length}
          sub={`${destinations.filter((d) => d.featured).length} on map`}
          accentColor="var(--sulphur)"
          href="/admin/destinations"
        />
        <KpiCard
          label="Conversion"
          value={`${convRate}%`}
          sub={`${stats?.formStarts ?? 0} form starts`}
          accentColor="var(--ochre)"
          href="/admin/analytics"
        />
      </div>

      {/* ── Two-column grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr clamp(290px, 30%, 340px)",
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* ── Left ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Chart card */}
          <div
            style={{
              backgroundColor: "var(--a-surface)",
              border: "1px solid var(--a-border)",
              borderRadius: "var(--a-radius)",
              padding: "22px 24px 18px",
              boxShadow: "var(--a-shadow-sm)",
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
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--a-muted)",
                    marginBottom: 6,
                  }}
                >
                  Page views — last 7 days
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 28,
                      fontWeight: 800,
                      color: "var(--a-text)",
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}
                  >
                    {totalViews}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: "var(--a-muted)",
                    }}
                  >
                    total
                  </span>
                  {todayViews > 0 && (
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--a-success)",
                        backgroundColor: "var(--a-success-bg)",
                        padding: "2px 8px",
                        borderRadius: "20px",
                      }}
                    >
                      +{todayViews} today
                    </span>
                  )}
                </div>
              </div>
              <Link
                to="/admin/analytics"
                className="admin-btn admin-btn--secondary admin-btn--sm"
              >
                Full analytics
              </Link>
            </div>

            {totalViews === 0 ? (
              <div
                style={{
                  height: 160,
                  border: "2px dashed var(--a-border)",
                  borderRadius: "var(--a-radius)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="var(--a-muted)"
                  strokeWidth="1.5"
                  opacity={0.4}
                >
                  <path
                    d="M4 24l7-10 5 4 5-8 7 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--a-muted)",
                    textAlign: "center",
                  }}
                >
                  No page views yet.
                  <br />
                  Visit the site to start tracking.
                </div>
              </div>
            ) : (
              <AreaChart
                data={viewData}
                labels={viewLabels}
                height={160}
                lineColor="var(--ochre)"
              />
            )}

            {/* Top pages */}
            {(stats?.topPages.length ?? 0) > 0 && (
              <div
                style={{
                  marginTop: 18,
                  paddingTop: 16,
                  borderTop: "1px solid var(--a-border)",
                  display: "flex",
                  gap: 0,
                  flexWrap: "wrap",
                }}
              >
                {stats!.topPages.slice(0, 5).map((p, i) => (
                  <div
                    key={p.path}
                    style={{
                      flex: "1 0 80px",
                      padding: "8px 12px",
                      borderRight: i < 4 ? "1px solid var(--a-border)" : "none",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "var(--a-text)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1,
                        marginBottom: 3,
                      }}
                    >
                      {p.views}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 10,
                        color: "var(--a-muted)",
                      }}
                    >
                      {p.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tours table */}
          <div
            style={{
              backgroundColor: "var(--a-surface)",
              border: "1px solid var(--a-border)",
              borderRadius: "var(--a-radius)",
              boxShadow: "var(--a-shadow-sm)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 18px",
                borderBottom: "1px solid var(--a-border)",
                backgroundColor: "var(--a-bg)",
              }}
            >
              <span className="admin-card__title" style={{ margin: 0 }}>
                Tours ({tours.length})
              </span>
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
                {tours.slice(0, 5).map((tour) => (
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
                            fontSize: 13,
                            color: "var(--a-text)",
                            fontWeight: 500,
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
                        color: "var(--a-muted)",
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
            {tours.length > 5 && (
              <div
                style={{
                  padding: "10px 18px",
                  borderTop: "1px solid var(--a-border)",
                  backgroundColor: "var(--a-bg)",
                }}
              >
                <Link
                  to="/admin/tours"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    fontWeight: 600,
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            position: "sticky",
            top: "calc(var(--a-topbar-h) + 16px)",
          }}
        >
          {/* Enquiries */}
          <div
            style={{
              backgroundColor: "var(--a-surface)",
              border: "1px solid var(--a-border)",
              borderRadius: "var(--a-radius)",
              boxShadow: "var(--a-shadow-sm)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 18px",
                borderBottom: "1px solid var(--a-border)",
                backgroundColor: "var(--a-bg)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="admin-card__title" style={{ margin: 0 }}>
                  Enquiries
                </span>
                {unread > 0 && (
                  <span
                    style={{
                      backgroundColor: "var(--ochre)",
                      color: "white",
                      fontFamily: "var(--font-body)",
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "1px 7px",
                      borderRadius: "20px",
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

            <div style={{ padding: "0 18px" }}>
              {enquiries.length === 0 ? (
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
                    No enquiries yet. Plan Trip form submissions appear here.
                  </div>
                </div>
              ) : (
                enquiries
                  .slice(0, 6)
                  .map((enq) => <EnquiryRow key={enq.id} enq={enq} />)
              )}
            </div>

            {enquiries.length > 6 && (
              <div
                style={{
                  padding: "10px 18px",
                  borderTop: "1px solid var(--a-border)",
                  backgroundColor: "var(--a-bg)",
                }}
              >
                <Link
                  to="/admin/enquiries"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--ochre)",
                    textDecoration: "none",
                  }}
                >
                  See all {enquiries.length} →
                </Link>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div
            style={{
              backgroundColor: "var(--a-surface)",
              border: "1px solid var(--a-border)",
              borderRadius: "var(--a-radius)",
              boxShadow: "var(--a-shadow-sm)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                borderBottom: "1px solid var(--a-border)",
                backgroundColor: "var(--a-bg)",
              }}
            >
              <span className="admin-card__title" style={{ margin: 0 }}>
                Quick actions
              </span>
            </div>
            <div style={{ padding: "6px 0" }}>
              {[
                { label: "Add a new tour", href: "/admin/tours/new" },
                { label: "Add a destination pin", href: "/admin/destinations" },
                { label: "Upload a gallery photo", href: "/admin/gallery" },
                { label: "Edit page copy", href: "/admin/content" },
                { label: "Reorder featured tours", href: "/admin/featured" },
                { label: "Run site health check", href: "/admin/health" },
              ].map((a) => (
                <Link
                  key={a.href}
                  to={a.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 18px",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--a-text)",
                    textDecoration: "none",
                    transition: "background-color 0.12s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor =
                      "var(--a-bg)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent")
                  }
                >
                  <span>{a.label}</span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--a-muted)",
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

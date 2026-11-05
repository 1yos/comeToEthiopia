import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { tours } from "@/data/tours";
import { destinations } from "@/data/destinations";
import { getEnquiries, getUnreadCount, type Enquiry } from "../lib/enquiries";
import { getAnalytics, type AnalyticsSummary } from "../lib/analytics";

// ── Smooth area chart ─────────────────────────────────────────────────────────
function AreaChart({
  data,
  labels,
  height = 180,
  color = "var(--ochre)",
}: {
  data: number[];
  labels: string[];
  height?: number;
  color?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgWidth, setSvgWidth] = useState(800);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setSvgWidth(w);
    });
    if (svgRef.current?.parentElement)
      obs.observe(svgRef.current.parentElement);
    return () => obs.disconnect();
  }, []);

  const max = Math.max(...data, 1);
  const padT = 16;
  const padB = 28;
  const padL = 8;
  const padR = 8;
  const chartW = svgWidth - padL - padR;
  const chartH = height - padT - padB;
  const n = data.length;

  const px = (i: number) => padL + (i / (n - 1)) * chartW;
  const py = (v: number) => padT + chartH - (v / max) * chartH;

  // Smooth bezier path
  const linePath = data.reduce((acc, v, i) => {
    if (i === 0) return `M ${px(i)},${py(v)}`;
    const x0 = px(i - 1),
      y0 = py(data[i - 1]);
    const x1 = px(i),
      y1 = py(v);
    const cpx = (x0 + x1) / 2;
    return `${acc} C ${cpx},${y0} ${cpx},${y1} ${x1},${y1}`;
  }, "");

  const areaPath = `${linePath} L ${px(n - 1)},${padT + chartH} L ${px(0)},${padT + chartH} Z`;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        viewBox={`0 0 ${svgWidth} ${height}`}
        preserveAspectRatio="none"
        aria-label="Page views chart"
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={padL}
            x2={svgWidth - padR}
            y1={padT + chartH * (1 - f)}
            y2={padT + chartH * (1 - f)}
            stroke="rgba(18,17,16,0.06)"
            strokeWidth={1}
          />
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#area-fill)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points + hover targets */}
        {data.map((v, i) => (
          <g key={i}>
            {/* Invisible wide hit area */}
            <rect
              x={padL + (i / (n - 1)) * chartW - 20}
              y={padT}
              width={40}
              height={chartH}
              fill="transparent"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              style={{ cursor: "default" }}
            />
            {/* Dot */}
            <circle
              cx={px(i)}
              cy={py(v)}
              r={hoverIndex === i ? 5 : v > 0 ? 3 : 0}
              fill={color}
              style={{ transition: "r 0.15s ease" }}
            />
            {/* Vertical hover line */}
            {hoverIndex === i && (
              <line
                x1={px(i)}
                x2={px(i)}
                y1={padT}
                y2={padT + chartH}
                stroke={color}
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.4}
              />
            )}
            {/* Hover tooltip */}
            {hoverIndex === i && (
              <g>
                <rect
                  x={Math.min(Math.max(px(i) - 22, padL), svgWidth - padR - 44)}
                  y={py(v) - 28}
                  width={44}
                  height={20}
                  fill="var(--ink)"
                  rx={2}
                />
                <text
                  x={Math.min(Math.max(px(i), padL + 22), svgWidth - padR - 22)}
                  y={py(v) - 14}
                  textAnchor="middle"
                  fill="white"
                  fontSize={11}
                  fontFamily="var(--font-body)"
                >
                  {v}
                </text>
              </g>
            )}
            {/* Day label */}
            <text
              x={px(i)}
              y={height - 4}
              textAnchor="middle"
              fill="var(--ink)"
              opacity={0.35}
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
function StatCard({
  label,
  value,
  sub,
  accent,
  href,
  large = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
  href: string;
  large?: boolean;
}) {
  return (
    <Link
      to={href}
      style={{
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        border: "1px solid rgba(18,17,16,0.07)",
        padding: large ? "28px 28px 24px" : "22px 22px 18px",
        gap: 8,
        transition:
          "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = "0 8px 32px rgba(18,17,16,0.10)";
        el.style.borderColor = accent;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
        el.style.borderColor = "rgba(18,17,16,0.07)";
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          width: 32,
          height: 3,
          backgroundColor: accent,
          marginBottom: 4,
        }}
        aria-hidden="true"
      />

      {/* Label */}
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--ink)",
          opacity: 0.45,
        }}
      >
        {label}
      </div>

      {/* Value */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontVariationSettings: '"opsz" 72, "wght" 800',
          fontSize: large
            ? "clamp(2.8rem, 4vw, 4rem)"
            : "clamp(2rem, 3vw, 3rem)",
          color: "var(--ink)",
          lineHeight: 1,
          letterSpacing: "-0.04em",
        }}
      >
        {value}
      </div>

      {/* Sub */}
      {sub && (
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "var(--ink)",
            opacity: 0.38,
            marginTop: 2,
          }}
        >
          {sub}
        </div>
      )}
    </Link>
  );
}

// ── Enquiry row ───────────────────────────────────────────────────────────────
function EnquiryRow({ enq }: { enq: Enquiry }) {
  const ago = (iso: string) => {
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  return (
    <Link
      to="/admin/enquiries"
      style={{
        display: "grid",
        gridTemplateColumns: "36px 1fr auto",
        alignItems: "center",
        gap: 12,
        padding: "12px 0",
        borderBottom: "1px solid rgba(18,17,16,0.05)",
        textDecoration: "none",
        transition: "background-color 0.15s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.backgroundColor =
          "rgba(18,17,16,0.02)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
      }
    >
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
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {enq.name.slice(0, 2).toUpperCase()}
      </div>
      <div style={{ minWidth: 0 }}>
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
            opacity: 0.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginTop: 2,
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
            color:
              enq.status === "new"
                ? "var(--ochre)"
                : enq.status === "replied"
                  ? "var(--highland)"
                  : "rgba(18,17,16,0.3)",
            marginBottom: 3,
          }}
        >
          {enq.status}
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 10,
            color: "var(--ink)",
            opacity: 0.28,
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
    setStats(getAnalytics());
    const all = getEnquiries();
    setEnquiries(all);
    setUnread(getUnreadCount());
    const iv = setInterval(() => {
      setStats(getAnalytics());
      setEnquiries(getEnquiries());
      setUnread(getUnreadCount());
    }, 20000);
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

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* ── Dark hero header ── */}
      <div
        style={{
          backgroundColor: "var(--indigo)",
          margin: "-32px -32px 32px",
          padding: "36px 32px 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ghost Ge'ez watermark */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: -24,
            top: -20,
            fontFamily: "var(--font-geez)",
            fontSize: 160,
            lineHeight: 1,
            color: "var(--paper)",
            opacity: 0.04,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          ፊደል {/* TODO-REVIEW */}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 1,
                  backgroundColor: "var(--ochre)",
                  display: "block",
                }}
                aria-hidden="true"
              />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--ochre)",
                  opacity: 0.8,
                }}
              >
                Come to Ethiopia Tours
              </span>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: '"opsz" 72, "wght" 700',
                fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                color: "var(--paper)",
                lineHeight: 1.0,
                letterSpacing: "-0.025em",
                marginBottom: 8,
              }}
            >
              Dashboard
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--paper)",
                opacity: 0.4,
              }}
            >
              {today}
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {unread > 0 && (
              <Link
                to="/admin/enquiries"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                  backgroundColor: "var(--ochre)",
                  padding: "8px 16px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    backgroundColor: "var(--ink)",
                    display: "inline-block",
                  }}
                  aria-hidden="true"
                />
                {unread} new {unread === 1 ? "enquiry" : "enquiries"}
              </Link>
            )}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--paper)",
                border: "1px solid rgba(241,234,217,0.25)",
                padding: "8px 16px",
                textDecoration: "none",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "var(--ochre)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(241,234,217,0.25)")
              }
            >
              View site →
            </a>
          </div>
        </div>

        {/* Hero stat row — sits inside the dark header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 2,
            marginTop: 32,
            position: "relative",
            zIndex: 1,
          }}
        >
          {[
            {
              label: "Page views",
              value: totalViews,
              sub: `${todayViews} today`,
              accent: "var(--ochre)",
            },
            {
              label: "Enquiries",
              value: enquiries.length,
              sub: unread > 0 ? `${unread} unread` : "All read",
              accent: "var(--highland)",
            },
            {
              label: "Tours",
              value: tours.length,
              sub: `${tours.filter((t) => t.difficulty === "easy").length} easy · ${tours.filter((t) => t.difficulty === "moderate").length} mod`,
              accent: "rgba(241,234,217,0.5)",
            },
            {
              label: "Destinations",
              value: destinations.length,
              sub: `${destinations.filter((d) => d.featured).length} featured`,
              accent: "var(--sulphur)",
            },
            {
              label: "Conversion",
              value: `${stats?.conversionRate ?? 0}%`,
              sub: `${stats?.formStarts ?? 0} starts`,
              accent: "var(--ochre)",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                backgroundColor: "rgba(241,234,217,0.06)",
                padding: "16px 18px",
                borderLeft: `3px solid ${s.accent}`,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 8,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--paper)",
                  opacity: 0.45,
                  marginBottom: 8,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontVariationSettings: '"opsz" 72, "wght" 800',
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  color: "var(--paper)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                {s.value}
              </div>
              {s.sub && (
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 10,
                    color: "var(--paper)",
                    opacity: 0.35,
                    marginTop: 5,
                  }}
                >
                  {s.sub}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Main grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr clamp(300px, 32%, 380px)",
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* ── Left column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Analytics chart card */}
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid rgba(18,17,16,0.07)",
              padding: "24px 28px 20px",
            }}
          >
            {/* Chart header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 24,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--ink)",
                    opacity: 0.4,
                    marginBottom: 6,
                  }}
                >
                  Page views — last 7 days
                </div>
                <div
                  style={{ display: "flex", alignItems: "baseline", gap: 12 }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontVariationSettings: '"opsz" 72, "wght" 800',
                      fontSize: "2.4rem",
                      color: "var(--ink)",
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {totalViews}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: "var(--ink)",
                      opacity: 0.4,
                    }}
                  >
                    total views
                  </span>
                  {todayViews > 0 && (
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--highland)",
                        backgroundColor: "rgba(63,91,58,0.1)",
                        padding: "2px 8px",
                      }}
                    >
                      +{todayViews} today
                    </span>
                  )}
                </div>
              </div>
              <Link
                to="/admin/analytics"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--ochre)",
                  textDecoration: "none",
                  opacity: 0.8,
                  marginTop: 4,
                }}
              >
                Full analytics →
              </Link>
            </div>

            {totalViews === 0 ? (
              <div
                style={{
                  height: 180,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px dashed rgba(18,17,16,0.1)",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--ink)",
                    opacity: 0.35,
                  }}
                >
                  No page views recorded yet.
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--ink)",
                    opacity: 0.25,
                  }}
                >
                  Visit the public site to start tracking.
                </div>
              </div>
            ) : (
              <AreaChart
                data={viewData}
                labels={viewLabels}
                height={180}
                color="var(--ochre)"
              />
            )}

            {/* Top pages strip */}
            {(stats?.topPages.length ?? 0) > 0 && (
              <div
                style={{
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: "1px solid rgba(18,17,16,0.06)",
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                {stats!.topPages.slice(0, 5).map((p) => (
                  <div
                    key={p.path}
                    style={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "var(--ink)",
                        opacity: 0.7,
                      }}
                    >
                      {p.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontVariationSettings: '"opsz" 14, "wght" 700',
                        fontSize: "1.1rem",
                        color: "var(--ink)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {p.views}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stat cards row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "clamp(120px, 2fr, 1fr) clamp(100px, 1.5fr, 1fr) clamp(90px, 1fr, 1fr)",
              gap: 10,
            }}
          >
            <StatCard
              label="Tours"
              value={tours.length}
              sub={`${tours.filter((t) => t.difficulty === "demanding").length} demanding`}
              accent="var(--indigo)"
              href="/admin/tours"
            />
            <StatCard
              label="Destinations"
              value={destinations.length}
              sub={`${destinations.filter((d) => d.featured).length} featured`}
              accent="var(--sulphur)"
              href="/admin/destinations"
            />
            <StatCard
              label="Conversion"
              value={`${stats?.conversionRate ?? 0}%`}
              sub={`${stats?.formStarts ?? 0} form starts`}
              accent="var(--highland)"
              href="/admin/analytics"
            />
          </div>

          {/* Recent tours */}
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid rgba(18,17,16,0.07)",
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
                  letterSpacing: "0.18em",
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
                            fontSize: 12,
                            color: "var(--ink)",
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
          </div>
        </div>

        {/* ── Right column ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            position: "sticky",
            top: 72,
          }}
        >
          {/* Enquiries panel */}
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid rgba(18,17,16,0.07)",
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
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    letterSpacing: "0.18em",
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
                    padding: "28px 0",
                    textAlign: "center",
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink)",
                    opacity: 0.3,
                    fontStyle: "italic",
                    lineHeight: 1.6,
                  }}
                >
                  No enquiries yet.
                  <br />
                  Plan Trip submissions appear here.
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
              backgroundColor: "var(--indigo)",
              padding: "20px 20px 16px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--paper)",
                opacity: 0.4,
                marginBottom: 14,
              }}
            >
              Quick actions
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                { label: "Add a new tour", href: "/admin/tours/new" },
                { label: "Add a destination pin", href: "/admin/destinations" },
                { label: "Upload a gallery photo", href: "/admin/gallery" },
                { label: "Edit hero headline", href: "/admin/content" },
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
                    padding: "10px 12px",
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--paper)",
                    textDecoration: "none",
                    opacity: 0.75,
                    transition: "opacity 0.15s, background-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "rgba(241,234,217,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "0.75";
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent";
                  }}
                >
                  <span>{a.label}</span>
                  <span style={{ color: "var(--ochre)", fontSize: 14 }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

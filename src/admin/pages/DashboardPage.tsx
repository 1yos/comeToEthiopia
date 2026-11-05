import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { tours } from "@/data/tours";
import { destinations } from "@/data/destinations";
import { getEnquiries, getUnreadCount, type Enquiry } from "../lib/enquiries";
import {
  getAnalytics,
  getDailyViews,
  getViewsForPeriod,
  type AnalyticsSummary,
} from "../lib/analytics";
import { Sparkline } from "../components/Sparkline";

// ── SVG Area Chart ────────────────────────────────────────────────────────────
function AreaChart({
  data,
  labels,
  height = 160,
  lineColor = "var(--a-accent)",
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

  const x = (i: number) => pL + (i / Math.max(n - 1, 1)) * cW;
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
            <stop offset="0%" stopColor={lineColor} stopOpacity={0.15} />
            <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
          </linearGradient>
        </defs>
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
        <path d={area} fill="url(#cte-grad)" />
        <path
          d={line}
          fill="none"
          stroke={lineColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((v, i) => (
          <g key={i}>
            <rect
              x={x(i) - Math.max(cW / n / 2, 12)}
              y={pT}
              width={Math.max(cW / n, 24)}
              height={cH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
            {(hover === i || (v > 0 && n <= 14)) && (
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
            {n <= 14 && (
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
            )}
          </g>
        ))}
        {n > 14 && (
          <>
            {labels.map((label, i) => {
              if (i % Math.ceil(n / 8) !== 0 && i !== n - 1) return null;
              return (
                <text
                  key={i}
                  x={x(i)}
                  y={height - 4}
                  textAnchor="middle"
                  fill="var(--a-muted)"
                  fontSize={10}
                  fontFamily="var(--font-body)"
                >
                  {label}
                </text>
              );
            })}
          </>
        )}
      </svg>
    </div>
  );
}

// ── Trend delta ───────────────────────────────────────────────────────────────
function TrendDelta({
  current,
  previous,
}: {
  current: number;
  previous: number;
}) {
  if (previous === 0 && current === 0) {
    return (
      <span className="admin-stat__trend admin-stat__trend--flat">
        — No data
      </span>
    );
  }
  if (previous === 0) {
    return (
      <span className="admin-stat__trend admin-stat__trend--up">↑ New</span>
    );
  }
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0)
    return (
      <span className="admin-stat__trend admin-stat__trend--flat">→ 0%</span>
    );
  if (pct > 0)
    return (
      <span className="admin-stat__trend admin-stat__trend--up">↑ {pct}%</span>
    );
  return (
    <span className="admin-stat__trend admin-stat__trend--down">
      ↓ {Math.abs(pct)}%
    </span>
  );
}

// ── KPI card with sparkline ───────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  sub,
  accentColor,
  href,
  sparkData,
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accentColor: string;
  href: string;
  sparkData?: number[];
  trend?: { current: number; previous: number };
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
        {sparkData && sparkData.length > 1 && (
          <Sparkline data={sparkData} color={accentColor} />
        )}
        {trend && (
          <TrendDelta current={trend.current} previous={trend.previous} />
        )}
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
  const avatarBg =
    enq.status === "new" ? "var(--a-accent)" : "var(--a-sidebar)";

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
        ((e.currentTarget as HTMLElement).style.backgroundColor =
          "var(--a-bg-subtle)")
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
          fontSize: "var(--a-text-xs)",
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
            fontSize: "var(--a-text-sm)",
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
            fontSize: "var(--a-text-xs)",
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
          className={`admin-badge admin-badge--${enq.status}`}
          style={{ marginBottom: 3 }}
        >
          {enq.status}
        </span>
        <div style={{ fontSize: 10, color: "var(--a-faint)" }}>
          {ago(enq.timestamp)}
        </div>
      </div>
    </Link>
  );
}

// ── Needs attention item ──────────────────────────────────────────────────────
function AttentionItem({
  icon,
  variant,
  text,
  meta,
  href,
}: {
  icon: string;
  variant: "warning" | "danger" | "info";
  text: string;
  meta: string;
  href: string;
}) {
  return (
    <Link to={href} className="admin-attention-item">
      <div
        className={`admin-attention-item__icon admin-attention-item__icon--${variant}`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d={icon} />
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="admin-attention-item__text">{text}</div>
        <div className="admin-attention-item__meta">{meta}</div>
      </div>
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        stroke="var(--a-muted)"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M6 4l4 4-4 4" />
      </svg>
    </Link>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export function DashboardPage() {
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [unread, setUnread] = useState(0);
  const [dateRange, setDateRange] = useState<7 | 30 | 90>(7);
  const [chartData, setChartData] = useState<{ date: string; views: number }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refresh = () => {
      setStats(getAnalytics());
      setEnquiries(getEnquiries());
      setUnread(getUnreadCount());
      setLoading(false);
    };
    refresh();
    const iv = setInterval(refresh, 20000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    setChartData(getDailyViews(dateRange));
  }, [dateRange]);

  // Trend calculations
  const trends = useMemo(() => {
    const current7 = getViewsForPeriod(7);
    const previous7 = getViewsForPeriod(14) - current7;
    const currentEnq = enquiries.filter(
      (e) => Date.now() - new Date(e.timestamp).getTime() < 7 * 86400000,
    ).length;
    const previousEnq = enquiries.filter((e) => {
      const age = Date.now() - new Date(e.timestamp).getTime();
      return age >= 7 * 86400000 && age < 14 * 86400000;
    }).length;
    return {
      views: { current: current7, previous: previous7 },
      enquiries: { current: currentEnq, previous: previousEnq },
    };
  }, [enquiries]);

  // Sparkline data (last 7 days)
  const sparkData = useMemo(() => getDailyViews(7).map((d) => d.views), []);

  // Needs attention
  const attentionItems = useMemo(() => {
    const items: {
      icon: string;
      variant: "warning" | "danger" | "info";
      text: string;
      meta: string;
      href: string;
    }[] = [];

    // Unreplied > 48h
    const oldUnreplied = enquiries.filter(
      (e) =>
        (e.status === "new" || e.status === "in-progress") &&
        Date.now() - new Date(e.timestamp).getTime() > 48 * 3600000,
    );
    if (oldUnreplied.length > 0) {
      items.push({
        icon: "M8 1.5a4 4 0 00-4 4v3l-1.5 2.5h11L12 8.5v-3a4 4 0 00-4-4z M6 13a2 2 0 004 0",
        variant: "danger",
        text: `${oldUnreplied.length} unreplied ${oldUnreplied.length === 1 ? "enquiry" : "enquiries"} older than 48h`,
        meta: oldUnreplied
          .slice(0, 2)
          .map((e) => e.name)
          .join(", "),
        href: "/admin/enquiries",
      });
    }

    // Tours missing taglines
    const noTagline = tours.filter((t) => !t.tagline.trim());
    if (noTagline.length > 0) {
      items.push({
        icon: "M2 8h12M8 2v12",
        variant: "warning",
        text: `${noTagline.length} ${noTagline.length === 1 ? "tour" : "tours"} missing taglines`,
        meta: noTagline
          .map((t) => t.name.split("—")[0].trim())
          .slice(0, 2)
          .join(", "),
        href: "/admin/tours",
      });
    }

    // Tours missing best season
    const noSeason = tours.filter((t) => !t.bestSeason);
    if (noSeason.length > 0) {
      items.push({
        icon: "M8 1a7 7 0 100 14A7 7 0 008 1zm0 3v4l2.5 2.5",
        variant: "info",
        text: `${noSeason.length} ${noSeason.length === 1 ? "tour" : "tours"} missing best season info`,
        meta: noSeason
          .map((t) => t.name.split("—")[0].trim())
          .slice(0, 2)
          .join(", "),
        href: "/admin/tours",
      });
    }

    return items;
  }, [enquiries]);

  const viewData = chartData.map((d) => d.views);
  const viewLabels = chartData.map((d) => d.date);
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
      <div className="admin-section-header">
        <div className="admin-section-header__left">
          <div className="admin-section-header__title">Dashboard</div>
          <div className="admin-section-header__sub">{today}</div>
        </div>
        <div className="admin-section-header__actions">
          {unread > 0 && (
            <Link to="/admin/enquiries" className="admin-btn admin-btn--accent">
              {unread} new {unread === 1 ? "enquiry" : "enquiries"}
            </Link>
          )}
        </div>
      </div>

      {/* ── KPI row ── */}
      {loading ? (
        <div className="admin-stats">
          <div className="admin-skeleton admin-skeleton--card" />
          <div className="admin-skeleton admin-skeleton--card" />
          <div className="admin-skeleton admin-skeleton--card" />
          <div className="admin-skeleton admin-skeleton--card" />
          <div className="admin-skeleton admin-skeleton--card" />
        </div>
      ) : (
        <div className="admin-stats">
          <KpiCard
            label="Page views"
            value={totalViews}
            sub={todayViews > 0 ? `+${todayViews} today` : "No views today"}
            accentColor="var(--a-accent)"
            href="/admin/analytics"
            sparkData={sparkData}
            trend={trends.views}
          />
          <KpiCard
            label="Enquiries"
            value={enquiries.length}
            sub={unread > 0 ? `${unread} unread` : "All read"}
            accentColor="var(--a-success)"
            href="/admin/enquiries"
            trend={trends.enquiries}
          />
          <KpiCard
            label="Tours"
            value={tours.length}
            sub={`${tours.filter((t) => t.difficulty === "easy").length} easy · ${tours.filter((t) => t.difficulty === "moderate").length} mod`}
            accentColor="var(--a-info)"
            href="/admin/tours"
          />
          <KpiCard
            label="Destinations"
            value={destinations.length}
            sub={`${destinations.filter((d) => d.featured).length} on map`}
            accentColor="var(--a-warning)"
            href="/admin/destinations"
          />
          <KpiCard
            label="Conversion"
            value={`${convRate}%`}
            sub={`${stats?.formStarts ?? 0} form starts`}
            accentColor="var(--a-accent)"
            href="/admin/analytics"
          />
        </div>
      )}

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
          <div className="admin-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div className="admin-card__title" style={{ marginBottom: 6 }}>
                  Page views
                </div>
                <div
                  style={{ display: "flex", alignItems: "baseline", gap: 10 }}
                >
                  <span
                    style={{
                      fontSize: "var(--a-text-2xl)",
                      fontWeight: 800,
                      color: "var(--a-text)",
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {dateRange === 7
                      ? totalViews
                      : getViewsForPeriod(dateRange)}
                  </span>
                  <span
                    style={{
                      fontSize: "var(--a-text-sm)",
                      color: "var(--a-muted)",
                    }}
                  >
                    last {dateRange} days
                  </span>
                  {todayViews > 0 && dateRange === 7 && (
                    <span
                      className="admin-badge admin-badge--easy"
                      style={{ fontWeight: 600 }}
                    >
                      +{todayViews} today
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {/* Date range selector */}
                <div className="admin-date-range">
                  {([7, 30, 90] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDateRange(d)}
                      className={`admin-date-range__btn${dateRange === d ? " admin-date-range__btn--active" : ""}`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
                <Link
                  to="/admin/analytics"
                  className="admin-btn admin-btn--secondary admin-btn--sm"
                >
                  Full analytics
                </Link>
              </div>
            </div>

            {totalViews === 0 && dateRange === 7 ? (
              <div
                style={{
                  height: 160,
                  border: "2px dashed var(--a-border)",
                  borderRadius: "var(--a-radius-md)",
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
                    fontSize: "var(--a-text-sm)",
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
                lineColor="var(--a-accent)"
              />
            )}
          </div>

          {/* Needs attention panel */}
          {attentionItems.length > 0 && (
            <div
              className="admin-card"
              style={{ padding: 0, overflow: "hidden" }}
            >
              <div className="admin-content-card__header">
                <span className="admin-content-card__header-title">
                  Needs attention
                </span>
                <span className="admin-badge admin-badge--new">
                  {attentionItems.length}
                </span>
              </div>
              <div style={{ padding: "0 20px" }}>
                {attentionItems.map((item, i) => (
                  <AttentionItem key={i} {...item} />
                ))}
              </div>
            </div>
          )}

          {/* Tours table */}
          <div className="admin-content-card">
            <div className="admin-content-card__header">
              <span className="admin-content-card__header-title">
                Tours ({tours.length})
              </span>
              <Link
                to="/admin/tours"
                className="admin-btn admin-btn--secondary admin-btn--sm"
              >
                Manage all
              </Link>
            </div>
            <div className="admin-table-wrapper">
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
                              fontSize: "var(--a-text-sm)",
                              color: "var(--a-text)",
                              fontWeight: 500,
                            }}
                          >
                            {tour.name.split("—")[0].trim()}
                          </span>
                        </div>
                      </td>
                      <td
                        data-numeric
                        style={{
                          fontSize: "var(--a-text-sm)",
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
            </div>
            {tours.length > 5 && (
              <div className="admin-content-card__footer">
                <Link
                  to="/admin/tours"
                  style={{
                    fontSize: "var(--a-text-xs)",
                    fontWeight: 600,
                    color: "var(--a-accent-text)",
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
          <div className="admin-content-card">
            <div className="admin-content-card__header">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="admin-content-card__header-title">
                  Enquiries
                </span>
                {unread > 0 && (
                  <span
                    style={{
                      backgroundColor: "var(--a-accent)",
                      color: "white",
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "1px 7px",
                      borderRadius: "var(--a-radius-full)",
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
              <div className="admin-content-card__footer">
                <Link
                  to="/admin/enquiries"
                  style={{
                    fontSize: "var(--a-text-xs)",
                    fontWeight: 600,
                    color: "var(--a-accent-text)",
                    textDecoration: "none",
                  }}
                >
                  See all {enquiries.length} →
                </Link>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="admin-content-card">
            <div className="admin-content-card__header">
              <span className="admin-content-card__header-title">
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
                    fontSize: "var(--a-text-sm)",
                    color: "var(--a-text)",
                    textDecoration: "none",
                    transition: "background-color 0.12s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor =
                      "var(--a-bg-subtle)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent")
                  }
                >
                  <span>{a.label}</span>
                  <span
                    style={{
                      fontSize: "var(--a-text-xs)",
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

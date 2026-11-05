import { useState, useEffect } from "react";
import { getAnalytics, type AnalyticsSummary } from "../lib/analytics";
import { tours } from "@/data/tours";

function BarChart({ data }: { data: { date: string; views: number }[] }) {
  const max = Math.max(...data.map((d) => d.views), 1);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 6,
        height: 80,
        padding: "0 4px",
      }}
      role="img"
      aria-label="Page views last 7 days"
    >
      {data.map((d) => {
        const pct = Math.round((d.views / max) * 100);
        return (
          <div
            key={d.date}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              height: "100%",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 9,
                color: "var(--a-text)",
                opacity: 0.5,
              }}
            >
              {d.views > 0 ? d.views : ""}
            </div>
            <div
              style={{
                width: "100%",
                height: `${Math.max(pct, d.views > 0 ? 8 : 2)}%`,
                backgroundColor: pct === 100 ? "var(--a-accent)" : "var(--a-sidebar)",
                opacity: pct === 100 ? 1 : 0.4 + (pct / 100) * 0.5,
                transition: "height 0.4s ease",
              }}
              aria-label={`${d.date}: ${d.views} views`}
            />
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 9,
                color: "var(--a-text)",
                opacity: 0.4,
                letterSpacing: "0.06em",
              }}
            >
              {d.date}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="admin-stat">
      <div
        className="admin-stat__accent"
        style={{ backgroundColor: accent ?? "var(--a-accent)" }}
      />
      <div className="admin-stat__number">{value}</div>
      <div className="admin-stat__label">{label}</div>
      {sub && <div className="admin-stat__sub">{sub}</div>}
    </div>
  );
}

export function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    setStats(getAnalytics());
    const interval = setInterval(() => setStats(getAnalytics()), 15000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <div>
        <div className="admin-section-header">
          <div className="admin-section-header__left">
            <div className="admin-section-header__title">Analytics</div>
          </div>
        </div>
        <div className="admin-empty">
          <div className="admin-empty__text">Loading analytics…</div>
        </div>
      </div>
    );
  }

  const tourMap = Object.fromEntries(tours.map((t) => [t.id, t.name]));

  return (
    <div>
      <div className="admin-section-header">
        <div className="admin-section-header__left">
          <div className="admin-section-header__title">Analytics</div>
          <div className="admin-section-header__sub">
            Tracked in this browser. Resets if localStorage is cleared.
          </div>
        </div>
        <div className="admin-section-header__actions">
          <button
            className="admin-btn admin-btn--secondary"
            onClick={() => setStats(getAnalytics())}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="admin-stats" style={{ marginBottom: 24 }}>
        <StatCard
          label="Total page views"
          value={stats.totalViews}
          sub="Last 30 days"
          accent="var(--a-accent)"
        />
        <StatCard
          label="Enquiries"
          value={stats.enquiries}
          sub="Plan Trip submissions"
          accent="var(--a-success)"
        />
        <StatCard
          label="Form starts"
          value={stats.formStarts}
          sub="Opened Plan Trip"
          accent="var(--a-sidebar)"
        />
        <StatCard
          label="Conversion"
          value={`${stats.conversionRate}%`}
          sub="Starts → submissions"
          accent="var(--a-warning)"
        />
      </div>

      {/* Chart + top pages side by side */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* Views chart */}
        <div className="admin-card">
          <div className="admin-card__title">Page views — last 7 days</div>
          {stats.totalViews === 0 ? (
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--a-text)",
                opacity: 0.35,
                fontStyle: "italic",
                padding: "16px 0",
              }}
            >
              No page views recorded yet. Browse the site to start tracking.
            </div>
          ) : (
            <BarChart data={stats.last7Days} />
          )}
        </div>

        {/* Top pages */}
        <div className="admin-card">
          <div className="admin-card__title">Top pages — last 7 days</div>
          {stats.topPages.length === 0 ? (
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--a-text)",
                opacity: 0.35,
                fontStyle: "italic",
                padding: "16px 0",
              }}
            >
              No data yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {stats.topPages.map((page, i) => {
                const maxViews = stats.topPages[0]?.views ?? 1;
                const pct = Math.round((page.views / maxViews) * 100);
                return (
                  <div
                    key={page.path}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "clamp(80px, 10vw, 110px) 1fr clamp(28px, 4vw, 40px)",
                      gap: "0 10px",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom:
                        i < stats.topPages.length - 1
                          ? "1px solid var(--a-border)"
                          : "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "var(--a-text)",
                        opacity: 0.7,
                      }}
                    >
                      {page.label}
                    </span>
                    <div
                      style={{
                        height: 6,
                        backgroundColor: "var(--a-border)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: `${pct}%`,
                          backgroundColor:
                            i === 0 ? "var(--a-accent)" : "var(--a-sidebar)",
                          opacity: i === 0 ? 1 : 0.5,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--a-text)",
                        opacity: 0.5,
                        textAlign: "right",
                      }}
                    >
                      {page.views}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top tours */}
      <div className="admin-card">
        <div className="admin-card__title">Most clicked tours</div>
        {stats.topTours.length === 0 ? (
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--a-text)",
              opacity: 0.35,
              fontStyle: "italic",
              padding: "8px 0",
            }}
          >
            No tour clicks recorded yet. Click a tour card on the site to start
            tracking.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tour</th>
                <th style={{ width: 80, textAlign: "right" }}>Clicks</th>
              </tr>
            </thead>
            <tbody>
              {stats.topTours.map((t, i) => (
                <tr key={t.tourId}>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 10,
                          color: "var(--a-text)",
                          opacity: 0.3,
                          minWidth: 16,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          color: "var(--a-text)",
                        }}
                      >
                        {tourMap[t.tourId] ?? t.tourId}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--a-text)",
                      opacity: 0.6,
                    }}
                  >
                    {t.clicks}
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

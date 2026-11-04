/**
 * Analytics store — lightweight page/tour tracking in localStorage.
 * No external service. Data structure:
 *
 * "cte-page-views" → Record<string, number[]>
 *   key = page path, value = array of unix timestamps (last 30 days kept)
 *
 * "cte-tour-clicks" → Record<string, number>
 *   key = tour id, value = click count
 *
 * "cte-analytics" → { enquiries: number, formStarts: number }
 *   general counters
 */

const PAGE_KEY = "cte-page-views";
const TOUR_KEY = "cte-tour-clicks";
const META_KEY = "cte-analytics";
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

// ── Track a page view ────────────────────────────────────────────────────────
export function trackPageView(path: string): void {
  try {
    const now = Date.now();
    const cutoff = now - THIRTY_DAYS;
    const data: Record<string, number[]> = JSON.parse(
      localStorage.getItem(PAGE_KEY) ?? "{}",
    );
    const prev = (data[path] ?? []).filter((t) => t > cutoff);
    data[path] = [...prev, now];
    localStorage.setItem(PAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

// ── Track a tour card click ──────────────────────────────────────────────────
export function trackTourClick(tourId: string): void {
  try {
    const data: Record<string, number> = JSON.parse(
      localStorage.getItem(TOUR_KEY) ?? "{}",
    );
    data[tourId] = (data[tourId] ?? 0) + 1;
    localStorage.setItem(TOUR_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

// ── Track form start ─────────────────────────────────────────────────────────
export function trackFormStart(): void {
  try {
    const meta = JSON.parse(localStorage.getItem(META_KEY) ?? "{}");
    meta.formStarts = (meta.formStarts ?? 0) + 1;
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch {
    /* ignore */
  }
}

// ── Read analytics for dashboard ─────────────────────────────────────────────

export interface DailyViews {
  date: string; // "Mon", "Tue" etc.
  views: number;
}

export interface PageStat {
  path: string;
  label: string;
  views: number;
}

export interface TourStat {
  tourId: string;
  clicks: number;
}

export interface AnalyticsSummary {
  totalViews: number;
  last7Days: DailyViews[];
  topPages: PageStat[];
  topTours: TourStat[];
  enquiries: number;
  formStarts: number;
  conversionRate: number; // enquiries / formStarts * 100
}

const PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/tours": "Tours",
  "/destinations": "Destinations",
  "/when-to-go": "When to Go",
  "/plan": "Plan Trip",
  "/about": "About",
  "/culture": "Culture",
  "/gallery": "Gallery",
};

export function getAnalytics(): AnalyticsSummary {
  try {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const cutoff = now - THIRTY_DAYS;

    const pageData: Record<string, number[]> = JSON.parse(
      localStorage.getItem(PAGE_KEY) ?? "{}",
    );
    const tourData: Record<string, number> = JSON.parse(
      localStorage.getItem(TOUR_KEY) ?? "{}",
    );
    const meta = JSON.parse(localStorage.getItem(META_KEY) ?? "{}");

    // Total views (last 30 days)
    const totalViews = Object.values(pageData)
      .flat()
      .filter((t) => t > cutoff).length;

    // Last 7 days by day
    const last7Days: DailyViews[] = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(now - (6 - i) * 24 * 60 * 60 * 1000);
      const dayStart = new Date(day).setHours(0, 0, 0, 0);
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      const views = Object.values(pageData)
        .flat()
        .filter((t) => t >= dayStart && t < dayEnd).length;
      return {
        date: day.toLocaleDateString("en-US", { weekday: "short" }),
        views,
      };
    });

    // Top pages
    const topPages: PageStat[] = Object.entries(pageData)
      .map(([path, times]) => ({
        path,
        label: PAGE_LABELS[path] ?? path,
        views: times.filter((t) => t > sevenDaysAgo).length,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);

    // Top tours
    const topTours: TourStat[] = Object.entries(tourData)
      .map(([tourId, clicks]) => ({ tourId, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);

    const enquiries = meta.enquiries ?? 0;
    const formStarts = meta.formStarts ?? 0;
    const conversionRate =
      formStarts > 0 ? Math.round((enquiries / formStarts) * 100) : 0;

    return {
      totalViews,
      last7Days,
      topPages,
      topTours,
      enquiries,
      formStarts,
      conversionRate,
    };
  } catch {
    return {
      totalViews: 0,
      last7Days: Array.from({ length: 7 }, (_, i) => ({
        date: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
        views: 0,
      })),
      topPages: [],
      topTours: [],
      enquiries: 0,
      formStarts: 0,
      conversionRate: 0,
    };
  }
}

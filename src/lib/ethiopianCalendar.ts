/**
 * Ethiopian Calendar Conversion
 * Pure functions — no side effects, no hard-coded years.
 *
 * The Ethiopian calendar (Ge'ez: የኢትዮጵያ ዘመን አቆጣጠር) runs 7–8 years behind
 * the Gregorian calendar and has 13 months: 12 × 30 days + Pagumē (5–6 days).
 * Ethiopian New Year (Enkutatash / ዕንቁጣጣሽ) falls on September 11 in
 * non-leap years and September 12 in Gregorian leap years.
 */

export interface EthiopianDate {
  year: number;
  month: number; // 1–13
  monthName: string;
  day: number;
  dayOfWeek: string;
  formatted: string; // e.g. "14 Meskerem 2017"
}

export const ETHIOPIAN_MONTHS = [
  "Meskerem", // 1  (Sep 11 – Oct 10)
  "Tikimt", // 2  (Oct 11 – Nov 9)
  "Hidar", // 3  (Nov 10 – Dec 9)
  "Tahsas", // 4  (Dec 10 – Jan 8)
  "Tir", // 5  (Jan 9 – Feb 7)
  "Yekatit", // 6  (Feb 8 – Mar 9)
  "Megabit", // 7  (Mar 10 – Apr 8)
  "Miazia", // 8  (Apr 9 – May 8)
  "Ginbot", // 9  (May 9 – Jun 7)
  "Senie", // 10 (Jun 8 – Jul 7)
  "Hamle", // 11 (Jul 8 – Aug 6)
  "Nehase", // 12 (Aug 7 – Sep 5)
  "Pagumē", // 13 (Sep 6 – Sep 10/11)
] as const;

const ETHIOPIAN_DAYS = [
  "Ihud", // Sunday
  "Senyo", // Monday
  "Maksegno", // Tuesday
  "Rob", // Wednesday
  "Hamus", // Thursday
  "Arb", // Friday
  "Kidame", // Saturday
] as const;

/** True if a Gregorian year is a leap year — used internally for date math */
function _isGregorianLeap(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
// Suppress unused warning — kept for reference and future leap-year edge cases
void _isGregorianLeap;

/** True if an Ethiopian year is a leap year (every 4th year, year before Ethiopian New Year) */
function isEthiopianLeap(ethYear: number): boolean {
  return ethYear % 4 === 3;
}

/**
 * Convert a Gregorian date to an Ethiopian date.
 *
 * Year calculation uses the simple offset rule, which is accurate and
 * matches all published Ethiopian calendar references:
 *   - On or after Sep 11 (Enkutatash): Ethiopian year = Gregorian year − 7
 *   - Before Sep 11:                   Ethiopian year = Gregorian year − 8
 *   (Sep 12 in Gregorian leap years for Enkutatash — handled below)
 *
 * Day/month calculation uses Julian Day Numbers for accuracy across all dates.
 */
export function gregorianToEthiopian(date: Date): EthiopianDate {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1; // 1-based
  const gDay = date.getDate();

  // Is this a Gregorian leap year? Enkutatash falls Sep 12 in those years.
  const gregLeap = (gYear % 4 === 0 && gYear % 100 !== 0) || gYear % 400 === 0;
  const enkutatashMonth = 9;
  const enkutatashDay = gregLeap ? 12 : 11;

  // ── Ethiopian year ────────────────────────────────────────────────────────
  // After Enkutatash (incl.) in this Gregorian year → offset is -7
  // Before Enkutatash → offset is -8
  const afterNewYear =
    gMonth > enkutatashMonth ||
    (gMonth === enkutatashMonth && gDay >= enkutatashDay);
  const ethYear = afterNewYear ? gYear - 7 : gYear - 8;

  // ── Ethiopian month and day via Julian Day Numbers ────────────────────────
  const a = Math.floor((14 - gMonth) / 12);
  const y = gYear + 4800 - a;
  const m = gMonth + 12 * a - 3;
  const jdn =
    gDay +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  // Ethiopian epoch JDN (Meskerem 1, 1 EC) — used only for month/day, not year
  const ETHIOPIAN_EPOCH = 1724221;
  const r = (jdn - ETHIOPIAN_EPOCH) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);

  const ethMonth = Math.floor(n / 30) + 1;
  const ethDay = (n % 30) + 1;

  const monthIndex = Math.min(ethMonth - 1, 12);
  const monthName = ETHIOPIAN_MONTHS[monthIndex];

  const dayOfWeekIndex = date.getDay();
  const dayOfWeek = ETHIOPIAN_DAYS[dayOfWeekIndex];

  return {
    year: ethYear,
    month: ethMonth,
    monthName,
    day: ethDay,
    dayOfWeek,
    formatted: `${ethDay} ${monthName} ${ethYear}`,
  };
}

/** Returns the current Ethiopian date */
export function todayEthiopian(): EthiopianDate {
  return gregorianToEthiopian(new Date());
}

/**
 * Returns which Ethiopian month the Gregorian date falls in.
 * Used for the month scrubber — highlighting the current month on load.
 */
export function currentEthiopianMonth(): number {
  return todayEthiopian().month;
}

/**
 * Is this Ethiopian year a leap year?
 * Pagumē has 6 days instead of 5 in Ethiopian leap years.
 */
export function pagumeDays(ethYear: number): 5 | 6 {
  return isEthiopianLeap(ethYear) ? 6 : 5;
}

export { isEthiopianLeap };

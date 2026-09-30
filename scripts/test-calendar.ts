import { gregorianToEthiopian } from "../src/lib/ethiopianCalendar.ts";

const cases = [
  { label: "Sep 23 2026 (today)     → expect year 2019", d: "2026-09-23" },
  { label: "Sep 11 2026 (Enkutatash)→ expect year 2019", d: "2026-09-11" },
  { label: "Sep 10 2026 (day before) → expect year 2018", d: "2026-09-10" },
  { label: "Jan 19 2027 (Timkat)    → expect year 2019", d: "2027-01-19" },
  { label: "Sep 10 2025             → expect year 2017", d: "2025-09-10" },
  { label: "Sep 11 2025 (Enkutatash)→ expect year 2018", d: "2025-09-11" },
];

for (const { label, d } of cases) {
  const r = gregorianToEthiopian(new Date(d));
  const pass = label.includes(`year ${r.year}`) ? "✓" : "✗";
  console.log(`${pass} ${label}`);
  console.log(`  → ${r.formatted} (${r.dayOfWeek})`);
}

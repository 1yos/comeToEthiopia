/**
 * Enquiries store — reads/writes to localStorage.
 * Key: "cte-enquiries"
 * Status workflow: "new" → "in-progress" → "replied" → "closed" | "archived"
 */

export interface Enquiry {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone?: string;
  selectedTourIds: string[];
  selectedTourNames: string[];
  tourFreeText: string;
  dates: string;
  tripLength?: string;
  groupSize: string | null;
  notes: string;
  status: "new" | "in-progress" | "replied" | "closed" | "archived";
  internalNotes?: string;
}

const KEY = "cte-enquiries";

export function getEnquiries(): Enquiry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function updateEnquiryStatus(
  id: string,
  status: Enquiry["status"],
): void {
  try {
    const all = getEnquiries().map((e) => (e.id === id ? { ...e, status } : e));
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

export function deleteEnquiry(id: string): void {
  try {
    const all = getEnquiries().filter((e) => e.id !== id);
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

export function getUnreadCount(): number {
  return getEnquiries().filter(
    (e) => e.status === "new" || e.status === "in-progress",
  ).length;
}

export function markAllRead(): void {
  try {
    const all = getEnquiries().map((e) =>
      e.status === "new" ? { ...e, status: "in-progress" as const } : e,
    );
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

export function updateEnquiryNotes(id: string, notes: string): void {
  try {
    const all = getEnquiries().map((e) =>
      e.id === id ? { ...e, internalNotes: notes } : e,
    );
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

export function exportEnquiriesCSV(filtered?: Enquiry[]): void {
  const all = filtered ?? getEnquiries();
  if (all.length === 0) return;

  const headers = [
    "Date",
    "Name",
    "Email",
    "Phone",
    "Tours",
    "Dates",
    "Trip Length",
    "Group",
    "Notes",
    "Status",
  ];

  const rows = all.map((e) => [
    new Date(e.timestamp).toLocaleDateString("en-GB"),
    e.name,
    e.email,
    e.phone || "—",
    e.selectedTourNames.join(" | ") || e.tourFreeText || "—",
    e.dates || "—",
    e.tripLength || "—",
    e.groupSize || "—",
    e.notes.replace(/,/g, ";") || "—",
    e.status,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

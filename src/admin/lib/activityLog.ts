/**
 * Simple activity log stored in localStorage.
 * Key: "cte-activity-log"
 * Keeps the last 100 entries.
 */

export interface ActivityEntry {
  id: string;
  timestamp: string;
  action: string;
  detail: string;
  page?: string;
}

const KEY = "cte-activity-log";
const MAX_ENTRIES = 100;

export function logActivity(action: string, detail: string, page?: string): void {
  try {
    const entries = getActivityLog();
    const entry: ActivityEntry = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      timestamp: new Date().toISOString(),
      action,
      detail,
      page,
    };
    const updated = [entry, ...entries].slice(0, MAX_ENTRIES);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {
    /* ignore */
  }
}

export function getActivityLog(): ActivityEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function clearActivityLog(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

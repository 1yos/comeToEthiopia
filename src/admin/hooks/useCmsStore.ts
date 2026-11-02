/**
 * CMS Store — reads and writes content JSON files.
 *
 * In development: writes directly to public/cms/*.json via fetch to a
 * Vite dev plugin endpoint /__cms/write.
 *
 * In production (static): writes are downloaded as JSON files for the
 * admin to commit (or can POST to a serverless function if deployed on
 * Netlify/Vercel).
 *
 * All data falls back to the hardcoded TypeScript data if the JSON
 * file doesn't exist yet (first run).
 */

import { useState, useEffect, useCallback } from "react";

export type CmsSection =
  | "tours"
  | "destinations"
  | "gallery"
  | "content"
  | "reviews"
  | "contact";

// Generic hook for reading/writing a single CMS JSON file
export function useCmsData<T>(section: CmsSection, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);

  // Load from public/cms/<section>.json
  useEffect(() => {
    fetch(`/cms/${section}.json?t=${Date.now()}`)
      .then((r) => {
        if (!r.ok) throw new Error(`No CMS file for ${section}`);
        return r.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        // File doesn't exist yet — use fallback (hardcoded data)
        setData(fallback);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  // Save to public/cms/<section>.json
  const save = useCallback(
    async (newData: T): Promise<{ ok: boolean; message: string }> => {
      setData(newData);
      setDirty(true);

      const json = JSON.stringify(newData, null, 2);

      // Try the Vite dev plugin write endpoint first
      try {
        const res = await fetch("/__cms/write", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section, data: newData }),
        });
        if (res.ok) {
          setDirty(false);
          return { ok: true, message: "Saved successfully." };
        }
      } catch {
        // Dev plugin not available — we're in production static mode
      }

      // Production fallback: offer the JSON as a download
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${section}.json`;
      a.click();
      URL.revokeObjectURL(url);

      return {
        ok: true,
        message: `Downloaded ${section}.json — place it in public/cms/ and redeploy.`,
      };
    },
    [section],
  );

  return { data, setData, loading, dirty, save };
}

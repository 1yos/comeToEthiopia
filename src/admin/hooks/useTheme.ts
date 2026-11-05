import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "cte-admin-theme";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* ignore */
  }
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.querySelector(".cte-admin") as HTMLElement | null;
    if (root) {
      root.setAttribute("data-theme", theme);
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  // Re-apply when the admin root mounts after route change
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const root = document.querySelector(".cte-admin") as HTMLElement | null;
      if (root && root.getAttribute("data-theme") !== theme) {
        root.setAttribute("data-theme", theme);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((p) => (p === "light" ? "dark" : "light"));
  }, []);

  return { theme, toggle };
}

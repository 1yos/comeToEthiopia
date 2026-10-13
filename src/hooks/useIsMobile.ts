import { useState, useEffect } from "react";

/**
 * Returns true when the viewport is ≤ the given breakpoint (default 767px).
 * Updates on resize. Initialises synchronously from window.innerWidth
 * so there is no layout flash.
 */
export function useIsMobile(breakpoint = 767): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}

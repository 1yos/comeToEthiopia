/**
 * Tracks page views for the admin analytics panel.
 * Fires on every route change and stores timestamps in localStorage.
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/admin/lib/analytics";

export function usePageTracking() {
  const location = useLocation();
  useEffect(() => {
    // Skip admin routes — we only track public pages
    if (location.pathname.startsWith("/admin")) return;
    trackPageView(location.pathname);
  }, [location.pathname]);
}

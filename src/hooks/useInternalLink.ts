import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { scrollToElement, scrollTop } from "./useLenis";

/**
 * Click handler for internal links that must work from any route.
 *
 * Nav/footer anchors keep their plain `<a>` elements (and their `/#hash`
 * hrefs, so middle-click and "open in new tab" still work natively), but a
 * primary click is routed through react-router instead of the browser:
 * without this, `/tours → /#popular-tours` would be a full page load.
 *
 * Returns a curried handler — `onClick={onLink("/#plan-trip")}`.
 *
 * Behaviour:
 * - Modified clicks (ctrl/cmd/shift/middle) and non-left buttons pass
 *   through untouched so the browser opens the raw href in a new tab.
 * - Links that are already the current document (same path + hash) do a
 *   manual Lenis-aware scroll instead of `navigate()` — react-router
 *   dedupes identical navigations, which would leave a re-clicked logo or
 *   nav item doing nothing.
 * - Compares against `window.location`, not the router's location:
 *   react-router listens only to `popstate`, so after a native fragment
 *   click (the home page's own `#section` anchors) the router's hash can
 *   be stale while the address bar is correct.
 * - `to` values that aren't root-relative (mailto:, tel:, https://…) are
 *   ignored — those are plain external links.
 */
export function useInternalLink() {
  const navigate = useNavigate();

  return useCallback(
    (to: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Only root-relative paths are ours; external links stay native.
      if (!to.startsWith("/")) return;

      // Modified clicks / middle button → let the browser open a new tab.
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      e.preventDefault();

      const hashIndex = to.indexOf("#");
      const targetPath =
        hashIndex === -1 ? to : to.slice(0, hashIndex) || "/";
      const targetHash = hashIndex === -1 ? "" : to.slice(hashIndex + 1);
      const targetUrl = targetPath + (targetHash ? `#${targetHash}` : "");

      const currentUrl = window.location.pathname + window.location.hash;

      if (targetUrl === currentUrl) {
        // Already here (logo re-click, nav item for the active section):
        // scroll directly — a router navigate to the same URL is a no-op.
        if (targetHash) {
          const el = document.getElementById(targetHash);
          if (el) {
            scrollToElement(el);
            return;
          }
          // Hash target doesn't exist on this page — fall through to
          // navigate(), which routes home and lets ScrollReset scroll.
        } else {
          scrollTop();
          return;
        }
      }

      navigate(targetUrl);
    },
    [navigate],
  );
}

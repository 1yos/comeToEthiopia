import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HASH_ALIASES } from "@/lib/routes";
import { scrollToElement, scrollTop } from "@/hooks/useLenis";

/**
 * ScrollReset — resets scroll position on every route change.
 *
 * useLayoutEffect (priority: before paint):
 *   1. Hash-alias redirect (Phase 3+): /#when-to-go → /when-to-go
 *   2. Immediate scroll: hash target via scrollToElement, else scrollTop()
 *   3. Guard against stale/unknown hash targets
 *
 * useEffect (delayed, ~300ms after mount):
 *   ScrollTrigger.refresh() — re‑measure pins that GSAP created in passive
 *   effects after the initial layout scroll.
 *   One optional hash re‑scroll if the user hasn't scrolled since the
 *   initial layout scroll (guard: window.scrollY === lastScrollY captured
 *   right after the layout scroll).
 *
 * Tree position: rendered AFTER <Outlet/> inside keyed motion.main, so its
 * passive-effect ordering comes after sections' GSAP mounts (pin spacers are
 * already in the DOM when the timer fires).  On hash‑only changes (same
 * pathname) the keyed main does NOT remount, but the deps [pathname, hash]
 * still cause the effects to re‑run.
 */
export function ScrollReset() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  // ---------- 1. useLayoutEffect: immediate scroll BEFORE paint ----------
  useLayoutEffect(() => {
    // Legacy anchor → graduated page (Phase 3+); keys include the leading #.
    const alias = HASH_ALIASES[hash];
    if (alias) {
      navigate(alias, { replace: true });
      return;
    }

    // Immediate scroll to hash target or top of document.
    if (hash) {
      const id = hash.replace(/^#/, "");
      const el = document.getElementById(id);
      if (el) scrollToElement(el);
      else scrollTop();
    } else {
      scrollTop();
    }
  }, [pathname, hash, navigate]);

  // ---------- 2. useEffect: delayed refresh + optional hash re‑scroll ----
  useEffect(() => {
    const settledY = window.scrollY;
    const t = window.setTimeout(() => {
      ScrollTrigger.refresh();
      // Re‑apply hash scroll only if the user hasn't scrolled since the
      // initial layout scroll and a hash target exists.
      if (window.scrollY === settledY && hash) {
        const el = document.getElementById(hash.replace(/^#/, ""));
        if (el) scrollToElement(el);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [pathname, hash]);

  return null;
}
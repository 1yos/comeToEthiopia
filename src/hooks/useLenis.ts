import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "./useReducedMotion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { LENIS_CONFIG } from "@/lib/motion";

/**
 * Module-level handle to the one Lenis instance (created by useLenis).
 * Scroll helpers below MUST go through this — creating a second Lenis
 * alongside the first causes double-scrolling and broken ScrollTrigger sync.
 */
let activeLenis: Lenis | null = null;

/** The live Lenis instance, or null under prefers-reduced-motion / before init. */
export function getLenis(): Lenis | null {
  return activeLenis;
}

/**
 * Lenis-aware jump to the top of the document (used on every route change).
 * Never creates a second Lenis instance — falls back to native when the
 * singleton is absent (reduced motion, or called before useLenis's effect).
 */
export function scrollTop(): void {
  if (activeLenis) {
    activeLenis.scrollTo(0, { immediate: true, force: true });
  } else {
    window.scrollTo(0, 0);
  }
}

/**
 * Lenis-aware jump straight to an element (deep-link hash targets).
 * Returns false when the element doesn't exist yet — callers may want to
 * fall back to scrollTop() in that case.
 */
export function scrollToElement(el: HTMLElement): boolean {
  if (!el) return false;
  if (activeLenis) {
    activeLenis.scrollTo(el, { immediate: true, force: true });
  } else {
    el.scrollIntoView();
  }
  return true;
}

/**
 * Initializes Lenis smooth scroll and syncs it with GSAP ScrollTrigger.
 *
 * Wiring order that matters:
 * 1. Create Lenis
 * 2. lenis.on('scroll', ScrollTrigger.update)  — keeps ST in sync with Lenis position
 * 3. gsap.ticker.add(lenis.raf)                — drives Lenis from GSAP RAF, not its own
 * 4. gsap.ticker.lagSmoothing(0)               — prevent GSAP from skipping frames
 *
 * If Lenis and ScrollTrigger use separate RAF loops you get a double-scroll effect
 * where animations complete in half the expected scroll distance.
 *
 * All config values come from LENIS_CONFIG in /lib/motion.ts.
 * Disabled automatically under prefers-reduced-motion.
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      lerp: LENIS_CONFIG.lerp,
      wheelMultiplier: LENIS_CONFIG.wheelMultiplier,
      touchMultiplier: LENIS_CONFIG.touchMultiplier,
      smoothWheel: LENIS_CONFIG.smoothWheel,
      orientation: "vertical",
    });

    lenisRef.current = lenis;
    activeLenis = lenis;

    // Step 2: keep ScrollTrigger scroll position in sync with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    // Step 3: drive Lenis RAF from GSAP ticker — single RAF loop
    const rafCb = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafCb);

    // Step 4: prevent GSAP from compensating for slow frames (causes jumpiness)
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafCb);
      if (activeLenis === lenis) activeLenis = null;
      lenisRef.current = null;
    };
  }, [reduced]);

  return lenisRef;
}

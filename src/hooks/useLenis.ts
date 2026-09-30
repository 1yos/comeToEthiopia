import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "./useReducedMotion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { LENIS_CONFIG } from "@/lib/motion";

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
    };
  }, [reduced]);

  return lenisRef;
}

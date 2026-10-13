import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DURATION, EASE_FM, PRELOADER } from "@/lib/motion";

interface PreloaderProps {
  onComplete: () => void;
}

// Ge'ez numerals for the loading counter ፩ ፪ ፫ ፬ ፭ ፮ ፯ ፰ ፱ ፲
const GEEZ_DIGITS = [
  "፩",
  "፪",
  "፫",
  "፬",
  "፭",
  "፮",
  "፯",
  "፰",
  "፱",
  "፲",
]; /* TODO-REVIEW */

/**
 * Preloader: Lalibela cross draws via stroke-dashoffset, Ge'ez counter ticks up,
 * then a horizontal wipe slides the panel off to the left, revealing the hero.
 * Skipped instantly under reduced-motion.
 */
export function Preloader({ onComplete }: PreloaderProps) {
  const reduced = useReducedMotion();
  const [counter, setCounter] = useState(0);
  const [phase, setPhase] = useState<"loading" | "wiping" | "done">("loading");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduced) {
      onComplete();
      return;
    }

    let count = 0;
    timerRef.current = setInterval(() => {
      count++;
      setCounter(Math.min(count, PRELOADER.ticks - 1));
      if (count >= PRELOADER.ticks) {
        clearInterval(timerRef.current!);
        setTimeout(() => setPhase("wiping"), PRELOADER.pauseBeforeWipe);
      }
    }, PRELOADER.tickInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [reduced, onComplete]);

  if (phase === "done") return null;

  return (
    <motion.div
      key="preloader-panel"
      initial={{ x: 0 }}
      animate={{ x: phase === "wiping" ? "-100%" : 0 }}
      transition={
        phase === "wiping"
          ? { duration: PRELOADER.wipeDuration, ease: [...EASE_FM.inOutCubic] }
          : { duration: 0 }
      }
      onAnimationComplete={() => {
        if (phase === "wiping") {
          setPhase("done");
          onComplete();
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9997,
        backgroundColor: "var(--indigo)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="Loading Come to Ethiopia"
      role="status"
    >
      <LalibelaCross />

      <div
        style={{
          marginTop: 48,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span
          style={{
            fontSize: "2.5rem",
            lineHeight: 1,
            minWidth: "2ch",
            textAlign: "center",
            fontFamily: "var(--font-geez)",
            color: "var(--paper)",
            opacity: 0.6,
          }}
          aria-live="polite"
          aria-label={`Loading: ${counter + 1} of ${PRELOADER.ticks}`}
        >
          {GEEZ_DIGITS[counter]}
        </span>
        <span
          style={{
            fontSize: 11,
            fontFamily: "var(--font-body)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--paper)",
            opacity: 0.3,
          }}
        >
          Loading
        </span>
      </div>

      <button
        onClick={() => setPhase("wiping")}
        style={{
          position: "absolute",
          bottom: 32,
          right: 32,
          background: "none",
          border: "none",
          color: "var(--paper)",
          opacity: 0.3,
          fontFamily: "var(--font-body)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          cursor: "none",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.opacity = "0.7")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.opacity = "0.3")
        }
        aria-label="Skip loading animation"
      >
        Skip
      </button>
    </motion.div>
  );
}

/**
 * Lalibela cross — strokes draw via Web Animations API.
 * Outer arm draw: PRELOADER duration. Inner arms follow after a short offset.
 * TODO-REVIEW: Shape accuracy against a genuine Lalibela cross.
 */
function LalibelaCross() {
  const pathRef = useRef<SVGPathElement>(null);
  const outerRef = useRef<SVGPathElement>(null);

  // Cross draw total = PRELOADER.preloaderTotal → outer starts at ~15% in,
  // inner arms at ~40% in. Both finish well before the counter ends.
  const totalMs = PRELOADER.ticks * PRELOADER.tickInterval; // e.g. 2500ms
  const outerDur = Math.round(totalMs * 0.5); // 50%
  const outerDelay = Math.round(totalMs * 0.1); // 10%
  const innerDur = Math.round(totalMs * 0.55); // 55%
  const innerDelay = Math.round(totalMs * 0.25); // 25%

  useEffect(() => {
    const animateStroke = (
      el: SVGPathElement | null,
      delay: number,
      dur: number,
    ) => {
      if (!el) return;
      const len = el.getTotalLength();
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len);
      el.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
        duration: dur,
        delay,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards",
      });
    };
    animateStroke(outerRef.current, outerDelay, outerDur);
    animateStroke(pathRef.current, innerDelay, innerDur);
  }, [outerDelay, outerDur, innerDelay, innerDur]);

  return (
    <svg
      viewBox="0 0 120 120"
      width={120}
      height={120}
      fill="none"
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <path
        ref={outerRef}
        d={`M60 4 L72 22 L86 14 L78 28 L96 28 L84 38 L96 48 L78 44 L80 60
            L96 60 L84 70 L96 80 L78 76 L86 90 L72 82 L60 100
            L48 82 L34 90 L42 76 L24 80 L36 70 L24 60
            L40 60 L42 44 L24 48 L36 38 L24 28 L42 28 L34 14 L48 22 Z`}
        stroke="var(--ochre)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        ref={pathRef}
        d={`M60 24 L60 96 M24 60 L96 60 M42 42 L78 78 M78 42 L42 78`}
        stroke="var(--paper)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity={0.6}
      />
      <circle
        cx="60"
        cy="60"
        r="6"
        stroke="var(--ochre)"
        strokeWidth="1.5"
        style={{
          animation: `fadeIn ${DURATION.micro}s ${innerDelay + innerDur}ms ease forwards`,
          opacity: 0,
        }}
      />
    </svg>
  );
}

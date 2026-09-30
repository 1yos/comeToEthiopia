import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Custom cursor: a small ochre dot that grows when hovering interactive elements.
 * Shows a label when hovering elements with data-cursor-label attribute.
 * Hidden on touch devices (hover: none).
 */
export function Cursor() {
  const reduced = useReducedMotion();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring-driven position for the large circle (slightly lags behind)
  // Lower stiffness + higher damping = heavier, more deliberate feel
  const springX = useSpring(rawX, { stiffness: 240, damping: 36, mass: 0.7 });
  const springY = useSpring(rawY, { stiffness: 240, damping: 36, mass: 0.7 });

  useEffect(() => {
    // Don't mount on touch-only devices
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches)
      return;

    const moveCursor = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);
    };

    const checkTarget = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        'a, button, [role="button"], [data-magnetic], [data-cursor]',
      );
      if (interactive) {
        setExpanded(true);
        const cursorLabel =
          (interactive as HTMLElement).dataset.cursorLabel ?? null;
        setLabel(cursorLabel);
      } else {
        setExpanded(false);
        setLabel(null);
      }
    };

    const hideCursor = () => setVisible(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousemove", checkTarget);
    window.addEventListener("mouseleave", hideCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousemove", checkTarget);
      window.removeEventListener("mouseleave", hideCursor);
    };
  }, [rawX, rawY]);

  // Magnetic effect for data-magnetic elements
  useEffect(() => {
    const magnetics = document.querySelectorAll<HTMLElement>("[data-magnetic]");

    const handlers: Array<{
      el: HTMLElement;
      move: (e: MouseEvent) => void;
      leave: () => void;
    }> = [];

    magnetics.forEach((el) => {
      const move = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.25;
        const dy = (e.clientY - cy) * 0.25;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      };
      const leave = () => {
        el.style.transform = "";
      };

      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      handlers.push({ el, move, leave });
    });

    return () => {
      handlers.forEach(({ el, move, leave }) => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
    };
  });

  if (reduced) return null;

  return (
    <>
      {/* Small dot — follows mouse exactly */}
      <motion.div
        ref={cursorRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          left: rawX,
          top: rawY,
          zIndex: 10000,
          pointerEvents: "none",
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
      >
        <motion.div
          animate={{
            width: expanded ? 48 : 8,
            height: expanded ? 48 : 8,
            backgroundColor: expanded ? "transparent" : "var(--ochre)",
            border: expanded
              ? "1.5px solid var(--ochre)"
              : "1.5px solid transparent",
          }}
          transition={{ type: "spring", stiffness: 340, damping: 32 }}
          style={{
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                fontSize: 9,
                fontFamily: "var(--font-body)",
                color: "var(--ochre)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Larger lagging ring */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: springX,
          top: springY,
          zIndex: 9999,
          pointerEvents: "none",
          translateX: "-50%",
          translateY: "-50%",
          width: 4,
          height: 4,
          borderRadius: "50%",
          backgroundColor: "var(--ochre)",
          opacity: visible ? 0.4 : 0,
        }}
      />
    </>
  );
}

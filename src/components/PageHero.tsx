import type { ReactNode } from "react";

/**
 * PageHero — reusable full-bleed photo header used by every page.
 *
 * Photo sits behind a gradient overlay so text is always readable.
 * The gradient direction varies: "up" (dark bottom, open top — landscape photos)
 * or "down" (dark top, open bottom — when the subject is at the top).
 *
 * Usage:
 *   <PageHero
 *     imgSrc="/media/tours/Lalibela-Ethiopia-Tours-480.webp"
 *     imgAlt="Lalibela rock-hewn churches at dawn"
 *     gradientDir="up"
 *   >
 *     <h1>...</h1>
 *   </PageHero>
 */

interface PageHeroProps {
  imgSrc: string;
  imgAlt: string;
  /** Which end is darkest. "up" = darkest at bottom (default). "down" = darkest at top. */
  gradientDir?: "up" | "down";
  /** Extra darkening. 0–1, default 0.82 */
  darkness?: number;
  /** objectPosition for the background image */
  imgPosition?: string;
  children: ReactNode;
}

export function PageHero({
  imgSrc,
  imgAlt,
  gradientDir = "up",
  darkness = 0.82,
  imgPosition = "center 40%",
  children,
}: PageHeroProps) {
  const gradient =
    gradientDir === "up"
      ? `linear-gradient(to top, rgba(18,17,16,${darkness}) 0%, rgba(18,17,16,0.5) 45%, rgba(18,17,16,0.18) 100%)`
      : `linear-gradient(to bottom, rgba(18,17,16,${darkness}) 0%, rgba(18,17,16,0.5) 50%, rgba(18,17,16,0.18) 100%)`;

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "clamp(320px, 45vh, 560px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding:
          "clamp(120px, 18vh, 180px) clamp(24px, 6vw, 80px) clamp(40px, 5vh, 60px)",
      }}
    >
      {/* Photo */}
      <img
        src={imgSrc}
        alt={imgAlt}
        width={750}
        height={500}
        loading="eager"
        decoding="sync"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: imgPosition,
        }}
      />

      {/* Gradient overlay */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, background: gradient }}
      />

      {/* Content sits above overlay */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </section>
  );
}

/** Shared label style used in every page hero */
export function HeroLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-body)",
        fontSize: 10,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "var(--ochre)",
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span
        style={{ width: 28, height: 1, backgroundColor: "var(--ochre)" }}
      />
      {children}
    </div>
  );
}

/** Shared h1 style used in every page hero */
export function HeroHeadline({ children }: { children: ReactNode }) {
  return (
    <h1
      style={{
        fontFamily: "var(--font-display)",
        fontVariationSettings: '"opsz" 144, "wght" 700',
        fontSize: "clamp(2.8rem, 7vw, 7rem)",
        color: "var(--paper)",
        lineHeight: 0.95,
        letterSpacing: "-0.03em",
        maxWidth: "18ch",
        margin: 0,
        marginBottom: 16,
      }}
    >
      {children}
    </h1>
  );
}

/** Shared subline style used in every page hero */
export function HeroSub({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "clamp(13px, 1.2vw, 16px)",
        color: "var(--paper)",
        opacity: 0.65,
        maxWidth: 520,
        lineHeight: 1.75,
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

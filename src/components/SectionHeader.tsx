/**
 * Shared section header — vertical label rail, display headline, subline.
 *
 * Extracted verbatim from Map.tsx (the only section migrated so far); the
 * other ten sections keep their bespoke headers until Phase 3 graduates
 * them one by one. Layout is a two-column grid: a narrow vertical-rl label
 * on the left, headline + subline on the right.
 */
export function SectionHeader({
  label,
  headline,
  subline,
}: {
  label: string;
  headline: string;
  subline: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "clamp(24px, 5vw, 60px) 1fr",
        gap: 0,
        padding: "0 clamp(24px, 6vw, 80px)",
        marginBottom: "clamp(40px, 5vh, 72px)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          writingMode: "vertical-rl",
          fontFamily: "var(--font-body)",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--ochre)",
          alignSelf: "start",
          paddingTop: 4,
        }}
      >
        {label}
      </div>
      <div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontVariationSettings: '"opsz" 72, "wght" 600',
            fontSize: "clamp(2.5rem, 6vw, 7rem)",
            color: "var(--ink)",
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            marginBottom: 16,
          }}
        >
          {headline}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(13px, 1.2vw, 15px)",
            color: "var(--ink)",
            opacity: 0.6,
            maxWidth: 540,
            lineHeight: 1.7,
          }}
        >
          {subline}
        </p>
      </div>
    </div>
  );
}

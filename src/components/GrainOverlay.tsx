/**
 * Fixed paper-grain overlay — applied once, sits above everything, pointer-events none.
 * The SVG noise is also applied via CSS (globals.css body::after) as a fallback.
 * This component is for if you want a React-controlled version with adjustable opacity.
 */
export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.035,
        mixBlendMode: 'multiply',
      }}
    />
  )
}

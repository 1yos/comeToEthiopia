import { useState, useEffect, useCallback } from 'react'
import { SCROLL } from '@/lib/motion'

/**
 * Dev-only scroll tuning overlay.
 * Press "?" anywhere to toggle. Persists values in localStorage.
 * Copy the output into /src/lib/motion.ts SCROLL object to make permanent.
 *
 * Never renders in production (import.meta.env.PROD guard).
 */

const STORAGE_KEY = 'cte-scroll-dev'

interface DevValues {
  lerp:            number
  wheelMultiplier: number
  scrub:           number
  pinScrollPerSceneVh: number
  horizontalScrubMin:  number
}

function loadValues(): DevValues {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return { ...SCROLL, ...JSON.parse(saved) } as DevValues
  } catch { /* ignore */ }
  return { ...SCROLL } as DevValues
}

export function ScrollDevOverlay() {
  // Only render in development
  if (import.meta.env.PROD) return null

  return <ScrollDevOverlayInner />
}

function ScrollDevOverlayInner() {
  const [open, setOpen]     = useState(false)
  const [vals, setVals]     = useState<DevValues>(loadValues)
  const [copied, setCopied] = useState(false)

  // Toggle on "?" key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) setOpen(v => !v)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vals))
  }, [vals])

  const set = useCallback((key: keyof DevValues, value: number) => {
    setVals(prev => ({ ...prev, [key]: value }))
  }, [])

  const snippet = `export const SCROLL = {
  lerp:                ${vals.lerp},
  wheelMultiplier:     ${vals.wheelMultiplier},
  touchMultiplier:     1.1,
  smoothWheel:         true,
  scrub:               ${vals.scrub},
  snap: { enabled: false, duration: { min: 0.8, max: 1.2 }, ease: 'power2.inOut' },
  pinScrollPerSceneVh: ${vals.pinScrollPerSceneVh},
  horizontalScrubMin:  ${vals.horizontalScrubMin},
} as const`

  const copySnippet = () => {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!open) {
    return (
      <div
        aria-label="Open scroll dev overlay (press ? to toggle)"
        style={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          zIndex: 99995,
          fontFamily: 'var(--font-body)',
          fontSize: 9,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--sulphur)',
          opacity: 0.5,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        ? — scroll tuner
      </div>
    )
  }

  return (
    <div
      role="dialog"
      aria-label="Scroll tuning overlay"
      style={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        zIndex: 99995,
        backgroundColor: 'var(--ink)',
        border: '1px solid rgba(241,234,217,0.15)',
        padding: '20px 24px',
        width: 300,
        fontFamily: 'var(--font-body)',
        color: 'var(--paper)',
        boxShadow: '0 20px 60px rgba(18,17,16,0.6)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--sulphur)' }}>
          Scroll Tuner (dev only)
        </span>
        <button
          onClick={() => setOpen(false)}
          style={{ background: 'none', border: 'none', color: 'var(--paper)', opacity: 0.5, cursor: 'pointer', fontSize: 16 }}
          aria-label="Close overlay"
        >
          ×
        </button>
      </div>

      {([
        { key: 'lerp' as const,            label: 'Lerp',              min: 0.01, max: 0.2,  step: 0.01 },
        { key: 'wheelMultiplier' as const, label: 'Wheel multiplier',  min: 0.2,  max: 2.0,  step: 0.05 },
        { key: 'scrub' as const,           label: 'Story scrub',       min: 0.5,  max: 4.0,  step: 0.1  },
        { key: 'pinScrollPerSceneVh' as const, label: 'Pin vh/scene',  min: 100,  max: 600,  step: 25   },
        { key: 'horizontalScrubMin' as const,  label: 'Horiz scrub',   min: 0.5,  max: 4.0,  step: 0.1  },
      ] as const).map(({ key, label, min, max, step }) => (
        <div key={key} style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <label htmlFor={`dev-${key}`} style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.1em' }}>
              {label}
            </label>
            <span style={{ fontSize: 11, color: 'var(--ochre)', fontVariantNumeric: 'tabular-nums' }}>
              {vals[key]}
            </span>
          </div>
          <input
            id={`dev-${key}`}
            type="range"
            min={min}
            max={max}
            step={step}
            value={vals[key]}
            onChange={e => set(key, parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--ochre)' }}
          />
        </div>
      ))}

      <div style={{ marginTop: 8, borderTop: '1px solid rgba(241,234,217,0.1)', paddingTop: 12 }}>
        <p style={{ fontSize: 10, opacity: 0.45, marginBottom: 10, lineHeight: 1.5 }}>
          These values live in localStorage. Copy the snippet below into motion.ts to make them permanent.
        </p>
        <button
          onClick={copySnippet}
          style={{
            width: '100%',
            background: 'var(--ochre)',
            border: 'none',
            color: 'var(--ink)',
            padding: '8px 0',
            fontFamily: 'var(--font-body)',
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          {copied ? 'Copied!' : 'Copy SCROLL snippet'}
        </button>
      </div>

      <p style={{ fontSize: 9, opacity: 0.3, marginTop: 10, textAlign: 'center', letterSpacing: '0.1em' }}>
        Press ? to close · Reload to apply
      </p>
    </div>
  )
}

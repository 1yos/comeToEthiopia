import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { siteContent } from '@/data/content'
import { DURATION, EASE_FM } from '@/lib/motion'
import type { AudienceMode } from '@/sections/AudienceChooser'

/**
 * Traveler Info — practical pre-trip information.
 * Sourced from cometoethiopiatours.com/traveler-info/
 *
 * Layout: two-column on desktop.
 * Left: oversized section label (vertical) + headline.
 * Right: accordion-style items — tap to expand.
 * No icon bullets. No equal cards. Sharp edges throughout.
 *
 * Visitor mode: shows all items including visa, health, international flights.
 * Local mode: collapses international items, surfaces domestic-relevant items.
 */
export function TravelerInfo({ audience }: { audience: AudienceMode }) {
  const { travelerInfo } = siteContent
  const [openId, setOpenId] = useState<string | null>('visa')

  // Local travelers don't need visa or international flight info
  const localHideIds = new Set(['visa'])
  const items = audience === 'local'
    ? travelerInfo.items.filter(item => !localHideIds.has(item.id))
    : travelerInfo.items

  return (
    <section
      id="traveler-info"
      role="region"
      aria-label="Practical traveler information"
      style={{
        backgroundColor: 'var(--indigo)',
        padding: 'clamp(80px, 10vh, 140px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background text */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-8%',
          right: '-2%',
          fontFamily: 'var(--font-geez)',
          fontSize: 'clamp(180px, 28vw, 400px)',
          color: 'var(--paper)',
          opacity: 0.03,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        ጉዞ {/* TODO-REVIEW */}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'clamp(24px, 5vw, 60px) 1fr',
          padding: '0 clamp(24px, 6vw, 80px)',
          gap: 0,
          marginBottom: 'clamp(40px, 5vh, 64px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Vertical section label */}
        <div
          style={{
            writingMode: 'vertical-rl',
            fontFamily: 'var(--font-body)',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--ochre)',
            alignSelf: 'start',
            paddingTop: 4,
          }}
        >
          {travelerInfo.sectionLabel}
        </div>

        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontVariationSettings: '"opsz" 72, "wght" 600',
              fontSize: 'clamp(2.5rem, 6vw, 7rem)',
              color: 'var(--paper)',
              lineHeight: 1.0,
              letterSpacing: '-0.025em',
              marginBottom: 16,
            }}
          >
            {travelerInfo.headline}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(13px, 1.2vw, 15px)',
              color: 'var(--paper)',
              opacity: 0.55,
              maxWidth: 520,
              lineHeight: 1.7,
            }}
          >
            {travelerInfo.subline}
          </p>
        </div>
      </div>

      {/* Accordion items */}
      <div
        style={{
          padding: '0 clamp(24px, 6vw, 80px) 0 calc(clamp(24px, 6vw, 80px) + clamp(24px, 5vw, 60px))',
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(280px, 45vw, 520px), 1fr))',
          gap: 0,
          alignItems: 'start',
        }}
        role="list"
      >
        {items.map((item) => {
          const isOpen = openId === item.id

          return (
            <div
              key={item.id}
              role="listitem"
              style={{
                borderBottom: '1px solid rgba(241,234,217,0.1)',
              }}
            >
              <button
                aria-expanded={isOpen}
                aria-controls={`info-${item.id}`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'clamp(16px, 2vh, 22px) 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'none',
                  textAlign: 'left',
                  gap: 16,
                }}
                data-cursor-label={isOpen ? 'Close' : 'Open'}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontVariationSettings: '"opsz" 18, "wght" 500',
                    fontSize: 'clamp(1rem, 1.6vw, 1.3rem)',
                    color: isOpen ? 'var(--ochre)' : 'var(--paper)',
                    lineHeight: 1.2,
                    transition: `color ${DURATION.micro}s ease`,
                  }}
                >
                  {item.label}
                </span>

                {/* Expand indicator — rotates, no icon library */}
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: DURATION.micro, ease: [...EASE_FM.outCubic] }}
                  aria-hidden="true"
                  style={{
                    display: 'block',
                    width: 18,
                    height: 18,
                    flexShrink: 0,
                    position: 'relative',
                  }}
                >
                  <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: isOpen ? 'var(--ochre)' : 'var(--paper)', opacity: 0.6 }} />
                  <span style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: isOpen ? 'var(--ochre)' : 'var(--paper)', opacity: 0.6 }} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`info-${item.id}`}
                    role="region"
                    aria-label={item.label}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: DURATION.ui, ease: [...EASE_FM.outCubic] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        paddingBottom: 'clamp(16px, 2.5vh, 28px)',
                        paddingRight: 32,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'clamp(13px, 1.1vw, 15px)',
                          color: 'var(--paper)',
                          opacity: 0.75,
                          lineHeight: 1.75,
                          margin: 0,
                        }}
                      >
                        {item.body}
                      </p>

                      {/* Optional external link */}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-block',
                            marginTop: 12,
                            fontFamily: 'var(--font-body)',
                            fontSize: 11,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'var(--ochre)',
                            textDecoration: 'none',
                            borderBottom: '1px solid var(--ochre)',
                            paddingBottom: 2,
                            cursor: 'none',
                          }}
                        >
                          {item.linkLabel} →
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}

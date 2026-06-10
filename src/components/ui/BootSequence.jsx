import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const LINES = [
  '> INITIALISING ANALYTICS ENGINE...',
  '> LOADING: dbt, BigQuery, Fivetran... \u2713',
  '> PIPELINES: 50+ models active \u2713',
  '> REVENUE RECOVERED: \u00a3600K \u2713',
  '> STATUS: READY',
]

const EASE_F1 = [0.16, 1, 0.3, 1]

/**
 * Race-start boot sequence. Plays once per session:
 *   1. Cockpit lines type out
 *   2. Five red start lights illuminate one by one
 *   3. Lights hold... then OUT — and the page launches
 * Skipped under prefers-reduced-motion. Click anywhere to skip.
 */
export default function BootSequence() {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return !reduced && !sessionStorage.getItem('booted')
  })
  const [visibleLines, setVisibleLines] = useState(0)
  const [lights, setLights] = useState(0) // 0..5 lit, -1 = lights out

  // Phase 1: type the lines
  useEffect(() => {
    if (!show || visibleLines >= LINES.length) return
    const t = setTimeout(() => setVisibleLines((n) => n + 1), 330)
    return () => clearTimeout(t)
  }, [show, visibleLines])

  // Phase 2: start lights
  useEffect(() => {
    if (!show || visibleLines < LINES.length) return
    if (lights < 5) {
      const t = setTimeout(() => setLights((l) => l + 1), 420)
      return () => clearTimeout(t)
    }
    // all five lit — random F1-style hold, then lights out
    const hold = setTimeout(() => setLights(-1), 600 + Math.random() * 700)
    return () => clearTimeout(hold)
  }, [show, visibleLines, lights])

  // Phase 3: lights out → dismiss
  useEffect(() => {
    if (lights !== -1) return
    const t = setTimeout(() => dismiss(), 450)
    return () => clearTimeout(t)
  }, [lights])

  const dismiss = () => {
    sessionStorage.setItem('booted', '1')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          aria-label="Skip intro"
          onClick={dismiss}
          className="fixed inset-0 z-[100] bg-dark flex flex-col items-center justify-center cursor-pointer"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE_F1 }}
        >
          {/* Start lights gantry */}
          <div className="flex gap-3 sm:gap-4 mb-12" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                className="w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-gridline"
                animate={{
                  backgroundColor: lights === -1 ? '#111118' : lights > i ? '#E10600' : '#111118',
                  boxShadow:
                    lights !== -1 && lights > i
                      ? '0 0 24px rgba(225,6,0,0.8), 0 0 60px rgba(225,6,0,0.35)'
                      : '0 0 0 rgba(0,0,0,0)',
                }}
                transition={{ duration: 0.12 }}
              />
            ))}
          </div>

          <div className="font-mono text-sm sm:text-base text-accent-glow space-y-2 px-6 text-left min-h-[160px]">
            {LINES.slice(0, visibleLines).map((line, i) => (
              <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ease: EASE_F1 }}>
                {line}
              </motion.p>
            ))}
            {lights === -1 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-display italic uppercase text-f1red text-lg pt-2"
              >
                Lights out and away we go.
              </motion.p>
            )}
          </div>
          <p className="font-mono text-midgrey text-xs mt-8">click to skip</p>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

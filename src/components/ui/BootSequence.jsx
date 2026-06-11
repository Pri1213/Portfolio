import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { beep } from '../../experience/sound.js'

const LINES = [
  '> INITIALISING ANALYTICS ENGINE...',
  '> LOADING: dbt, BigQuery, Fivetran... \u2713',
  '> PIPELINES: 50+ models active \u2713',
  '> REVENUE RECOVERED: \u00a3600K \u2713',
  '> STATUS: READY',
]

const EASE_F1 = [0.16, 1, 0.3, 1]
const HARD_LIMIT_MS = 6500 // no matter what happens, the page WILL appear

function safeSession(action, key, value) {
  try {
    if (action === 'get') return sessionStorage.getItem(key)
    sessionStorage.setItem(key, value)
  } catch {
    return null // private browsing — just play the boot every time
  }
}

/**
 * Race-start boot. One linear timeline, every step scheduled up front,
 * a hard fail-safe dismiss, and zero interdependent effects — this
 * sequence cannot strand the visitor.
 */
export default function BootSequence() {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return !reduced && !safeSession('get', 'booted')
  })
  const [visibleLines, setVisibleLines] = useState(0)
  const [lights, setLights] = useState(0) // 0..5 lit, -1 = out
  const timers = useRef([])

  const dismiss = () => {
    safeSession('set', 'booted', '1')
    timers.current.forEach(clearTimeout)
    setShow(false)
  }

  useEffect(() => {
    if (!show) return
    const T = timers.current
    const at = (ms, fn) => T.push(setTimeout(fn, ms))

    // Phase 1: lines, 330ms apart
    LINES.forEach((_, i) => at(330 * (i + 1), () => setVisibleLines(i + 1)))

    // Phase 2: lights, one per 420ms after the lines
    const lightsStart = 330 * LINES.length + 250
    for (let i = 1; i <= 5; i++) {
      at(lightsStart + 420 * i, () => {
        setLights(i)
        beep(420 + i * 60, 0.09, 0.05) // rising start-light tones (if sound on)
      })
    }

    // Phase 3: random F1 hold, lights out, go
    const hold = 600 + Math.random() * 700
    const outAt = lightsStart + 420 * 5 + hold
    at(outAt, () => {
      setLights(-1)
      beep(1180, 0.18, 0.06) // lights-out tone
    })
    at(outAt + 500, dismiss)

    // FAIL-SAFE: whatever happens above, the page appears
    at(HARD_LIMIT_MS, dismiss)

    return () => T.forEach(clearTimeout)
  }, [show])

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
          <div className="flex gap-3 sm:gap-4 mb-12" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => {
              const lit = lights !== -1 && lights >= i
              return (
                <span
                  key={i}
                  className="w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-gridline transition-colors duration-100"
                  style={{
                    backgroundColor: lit ? '#E10600' : '#111118',
                    boxShadow: lit ? '0 0 24px rgba(225,6,0,0.8), 0 0 60px rgba(225,6,0,0.35)' : 'none',
                  }}
                />
              )
            })}
          </div>

          <div className="font-mono text-sm sm:text-base text-accent-glow space-y-2 px-6 text-left min-h-[160px]">
            {LINES.slice(0, visibleLines).map((line, i) => (
              <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ease: EASE_F1 }}>
                {line}
              </motion.p>
            ))}
            {lights === -1 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display italic uppercase text-f1red text-lg pt-2">
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

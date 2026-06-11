import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { engineRev } from './sound.js'

/**
 * Hold-to-activate DRS. While held: a speed readout climbs toward
 * 347 km/h, speed lines streak the viewport, the engine revs (if sound
 * is on). Release and it decays. Pure microinteraction — Red Bull
 * doesn't explain energy, it makes you feel it.
 */
export default function DRSButton() {
  const [active, setActive] = useState(false)
  const [speed, setSpeed] = useState(0)
  const raf = useRef()

  useEffect(() => {
    const tick = () => {
      setSpeed((s) => {
        const target = active ? 347 : 0
        const next = s + (target - s) * (active ? 0.045 : 0.12)
        return Math.abs(next - target) < 0.5 ? target : next
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [active])

  const start = () => {
    setActive(true)
    engineRev()
  }
  const stop = () => setActive(false)

  return (
    <>
      <div className="mt-8 flex flex-col items-center gap-2 select-none">
        <button
          onPointerDown={start}
          onPointerUp={stop}
          onPointerLeave={stop}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') start() }}
          onKeyUp={stop}
          className={`font-mono text-xs tracking-[0.25em] px-5 py-2.5 rounded border transition-all ${
            active
              ? 'border-f1red text-f1red shadow-glow-red bg-f1red/10'
              : 'border-gridline text-midgrey hover:border-accent hover:text-accent-glow'
          }`}
          aria-pressed={active}
        >
          {active ? 'DRS ACTIVATED' : 'HOLD FOR DRS'}
        </button>
        <p className={`font-mono text-2xl font-bold tabular-nums transition-colors ${active ? 'text-f1red' : 'text-midgrey/40'}`}>
          {Math.round(speed)} <span className="text-xs font-normal">km/h</span>
        </p>
      </div>

      {/* speed lines overlay */}
      <AnimatePresence>
        {speed > 60 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: Math.min(0.5, speed / 500) }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                'repeating-linear-gradient(90deg, transparent 0 120px, rgba(74,127,212,0.12) 120px 122px, transparent 122px 260px)',
              maskImage: 'linear-gradient(90deg, black, transparent 35%, transparent 65%, black)',
              WebkitMaskImage: 'linear-gradient(90deg, black, transparent 35%, transparent 65%, black)',
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

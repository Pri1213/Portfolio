import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PawPrint } from 'lucide-react'
import { useLang } from '../../i18n.jsx'

/**
 * Bobby the dachshund. Click the paw button and he trots across the
 * bottom of the screen, ears flapping, doing zero useful work.
 * Skipped entirely under prefers-reduced-motion.
 */
function Dachshund() {
  return (
    <svg width="120" height="60" viewBox="0 0 120 60" aria-hidden="true">
      {/* body — proudly elongated */}
      <ellipse cx="60" cy="34" rx="34" ry="11" fill="#8B5A2B" />
      {/* chest + rear */}
      <circle cx="29" cy="33" r="11" fill="#8B5A2B" />
      <circle cx="92" cy="34" r="9" fill="#8B5A2B" />
      {/* head */}
      <circle cx="17" cy="24" r="9" fill="#8B5A2B" />
      {/* snout */}
      <ellipse cx="7" cy="26" rx="7" ry="4.5" fill="#A0703C" />
      <circle cx="2.5" cy="25.5" r="2" fill="#2b1d12" />
      {/* eye */}
      <circle cx="14.5" cy="22" r="1.6" fill="#1a1108" />
      {/* floppy ear */}
      <motion.ellipse
        cx="20" cy="28" rx="4" ry="8" fill="#5C3A1A"
        animate={{ rotate: [8, -10, 8] }}
        transition={{ duration: 0.35, repeat: Infinity }}
        style={{ originX: '20px', originY: '22px' }}
      />
      {/* legs — tiny, determined */}
      {[24, 38, 78, 94].map((x, i) => (
        <motion.rect
          key={x}
          x={x} y="41" width="5" height="14" rx="2.5" fill="#5C3A1A"
          animate={{ rotate: i % 2 === 0 ? [14, -14, 14] : [-14, 14, -14] }}
          transition={{ duration: 0.28, repeat: Infinity }}
          style={{ originX: `${x + 2.5}px`, originY: '42px' }}
        />
      ))}
      {/* tail — maximum wag */}
      <motion.rect
        x="100" y="22" width="16" height="4.5" rx="2.25" fill="#5C3A1A"
        animate={{ rotate: [-25, 15, -25] }}
        transition={{ duration: 0.22, repeat: Infinity }}
        style={{ originX: '100px', originY: '26px' }}
      />
      {/* collar */}
      <rect x="22" y="29" width="4" height="9" rx="2" fill="#2E5FA3" />
    </svg>
  )
}

export default function BobbyEasterEgg() {
  const { t } = useLang()
  const [running, setRunning] = useState(false)
  const [woof, setWoof] = useState(false)

  const release = () => {
    if (running) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setWoof(true)
      setTimeout(() => setWoof(false), 2500)
      return
    }
    setRunning(true)
    setWoof(true)
    setTimeout(() => setWoof(false), 3000)
    setTimeout(() => setRunning(false), 6500)
  }

  return (
    <>
      <button
        onClick={release}
        title={t.bobby.tooltip}
        aria-label="Release Bobby the dachshund"
        className="fixed bottom-5 left-5 z-50 w-11 h-11 rounded-full panel flex items-center justify-center text-midgrey hover:text-accent-glow hover:border-accent hover:shadow-glow-blue transition-all bg-dark-card/90 backdrop-blur"
      >
        <PawPrint size={18} />
      </button>

      <AnimatePresence>
        {woof && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-[72px] left-5 z-50 panel px-3 py-2 font-mono text-xs text-offwhite bg-dark-card/95"
          >
            {t.bobby.woof}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {running && (
          <motion.div
            initial={{ x: '-140px' }}
            animate={{ x: 'calc(100vw + 140px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 6, ease: 'linear' }}
            className="fixed bottom-1 left-0 z-40 pointer-events-none"
          >
            <Dachshund />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

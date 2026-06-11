import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { engineRev } from './sound.js'

/**
 * An F1 car randomly (but not really — every 25–55s, plus once shortly
 * after load) tears across the bottom of the viewport with speed lines
 * and a tyre-smoke trail. Reduced-motion off; paused in hidden tabs.
 */
function CarSVG() {
  return (
    <svg width="150" height="44" viewBox="0 0 150 44" aria-hidden="true">
      <g stroke="#4A7FD4" strokeWidth="2" opacity="0.5">
        <line x1="-38" y1="14" x2="2" y2="14" />
        <line x1="-58" y1="22" x2="-6" y2="22" />
        <line x1="-30" y1="30" x2="6" y2="30" />
      </g>
      <path d="M16 30 L52 26 L96 24 L128 26 L142 30 L142 33 L16 33 Z" fill="#2E5FA3" />
      <path d="M128 26 L148 29 L148 31 L128 31 Z" fill="#4A7FD4" />
      <path d="M66 24 L84 24 L80 17 L70 17 Z" fill="#111118" />
      <path d="M69 17 Q75 11 81 17" stroke="#8888A0" strokeWidth="2" fill="none" />
      <rect x="12" y="14" width="4" height="16" fill="#111118" />
      <rect x="6" y="12" width="16" height="4" rx="1" fill="#E10600" />
      <rect x="132" y="31" width="16" height="3" rx="1" fill="#E10600" />
      <circle cx="38" cy="33" r="9" fill="#111118" stroke="#1E1E2E" strokeWidth="2" />
      <circle cx="38" cy="33" r="3.5" fill="#4A7FD4" />
      <circle cx="112" cy="33" r="9" fill="#111118" stroke="#1E1E2E" strokeWidth="2" />
      <circle cx="112" cy="33" r="3.5" fill="#4A7FD4" />
      <text x="92" y="31" fontFamily="inherit" fontSize="8" fontWeight="700" fill="#F0F0F5">1</text>
    </svg>
  )
}

export default function F1DriveBy() {
  const [run, setRun] = useState(0)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    let timeout
    const schedule = (delay) => {
      timeout = setTimeout(() => {
        if (!document.hidden) {
          setRun((r) => r + 1)
          setActive(true)
          engineRev()
          setTimeout(() => setActive(false), 2600)
        }
        schedule(25000 + Math.random() * 30000)
      }, delay)
    }
    schedule(7000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={run}
          className="fixed bottom-6 left-0 z-30 pointer-events-none"
          initial={{ x: '-180px' }}
          animate={{ x: 'calc(100vw + 180px)' }}
          transition={{ duration: 2.2, ease: [0.3, 0, 0.7, 1] }}
          aria-hidden="true"
        >
          <CarSVG />
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="smoke-puff"
              style={{ left: -20 - i * 26, top: 6, animationDelay: `${i * 0.18}s`, '--sx': '-50px', animationDuration: '2.2s' }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

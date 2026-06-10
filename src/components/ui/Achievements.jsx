import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Trophy } from 'lucide-react'

const ACHIEVEMENTS = {
  about: { title: 'Platform Builder', desc: 'Built data infrastructure from scratch at 3 months experience' },
  experience: { title: 'Revenue Detective', desc: 'Identified \u00a3600K in missed revenue through forensic analysis' },
  skills: { title: 'Speed Merchant', desc: 'Reduced reporting from 1 month to 2\u20133 days' },
  contact: { title: 'Multilingual', desc: 'Fluent in SQL, Python, French, and sarcasm' },
}

/**
 * Console-style achievement toasts. Each fires once when its section
 * scrolls into view (sections are matched by id).
 */
export default function Achievements() {
  const [queue, setQueue] = useState([])
  const fired = useRef(new Set())

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id
          if (entry.isIntersecting && ACHIEVEMENTS[id] && !fired.current.has(id)) {
            fired.current.add(id)
            const item = { id, ...ACHIEVEMENTS[id] }
            setQueue((q) => [...q, item])
            setTimeout(() => setQueue((q) => q.filter((a) => a.id !== id)), 4500)
          }
        })
      },
      { threshold: 0.35 },
    )

    Object.keys(ACHIEVEMENTS).forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none" aria-live="polite">
      <AnimatePresence>
        {queue.map((a) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="panel px-4 py-3 flex items-start gap-3 max-w-xs shadow-glow-blue bg-dark-card/95 backdrop-blur"
          >
            <Trophy size={18} className="text-accent-glow mt-0.5 shrink-0" />
            <div>
              <p className="font-mono text-[10px] tracking-widest text-midgrey">ACHIEVEMENT UNLOCKED</p>
              <p className="font-display font-semibold text-sm text-offwhite">{a.title}</p>
              <p className="text-xs text-midgrey mt-0.5">{a.desc}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

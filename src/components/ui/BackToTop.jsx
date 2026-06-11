import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

/**
 * "Box box" — return to the pits. Appears after a screen of scroll,
 * with a lap-progress ring drawn around the button.
 */
export default function BackToTop() {
  const { scrollYProgress } = useScroll()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={toTop}
          aria-label="Back to top"
          className="fixed bottom-5 right-5 z-50 w-11 h-11 rounded-full bg-dark-card/90 backdrop-blur border border-gridline text-midgrey hover:text-accent-glow hover:border-accent hover:shadow-glow-blue transition-colors flex items-center justify-center cursor-pointer"
        >
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
            <motion.circle
              cx="22"
              cy="22"
              r="20"
              fill="none"
              stroke="var(--accent-glow)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/**
 * Animated counter that runs once when scrolled into view.
 * Respects prefers-reduced-motion (jumps straight to the end value).
 */
export default function useCountUp(end, { duration = 1600, decimals = 0 } = {}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setValue(end)
      return
    }
    let frame
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setValue(end * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, end, duration])

  return [ref, value.toFixed(decimals)]
}

import { useEffect, useRef } from 'react'

/**
 * Canvas EQ visualizer pulsing to a synthetic beat pattern.
 * Purely visual — no audio. Pauses when off-screen and respects
 * prefers-reduced-motion (renders a static frame).
 */
export default function Visualizer() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const BARS = 48
    let frame
    let running = true

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (t) => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      const beat = Math.pow(Math.abs(Math.sin(t / 480)), 6) // 4-to-the-floor-ish pulse
      const gap = 3
      const bw = (w - gap * (BARS - 1)) / BARS

      for (let i = 0; i < BARS; i++) {
        const centre = Math.exp(-Math.pow((i - BARS / 2) / (BARS / 3.2), 2))
        const wobble = 0.35 + 0.65 * Math.abs(Math.sin(t / 300 + i * 0.7))
        const bh = Math.max(4, h * (0.12 + 0.78 * centre * wobble * (0.55 + 0.45 * beat)))
        const x = i * (bw + gap)
        const grad = ctx.createLinearGradient(0, h, 0, h - bh)
        grad.addColorStop(0, '#2E5FA3')
        grad.addColorStop(1, '#4A7FD4')
        ctx.fillStyle = grad
        ctx.shadowColor = 'rgba(74,127,212,0.5)'
        ctx.shadowBlur = beat * 14
        ctx.fillRect(x, h - bh, bw, bh)
      }
      if (running && !reduced) frame = requestAnimationFrame(draw)
    }

    const observer = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting
      if (running && !reduced) frame = requestAnimationFrame(draw)
    })
    observer.observe(canvas)

    draw(0)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-48 sm:h-64 rounded-lg"
      role="img"
      aria-label="Animated audio equaliser visualisation"
    />
  )
}

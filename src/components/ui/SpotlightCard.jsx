import { useRef, useState } from 'react'

/**
 * Panel with a cursor-tracked spotlight glow and a subtle 3D tilt —
 * the card leans like a car loading its outside tyres. Mouse only:
 * touch devices and reduced-motion users get the plain panel.
 */
export default function SpotlightCard({
  as: Tag = 'div',
  tilt = true,
  maxTilt = 3.5,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null)
  const [style, setStyle] = useState({})

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const doTilt = tilt && !reduced
    const rx = doTilt ? (y / rect.height - 0.5) * -maxTilt : 0
    const ry = doTilt ? (x / rect.width - 0.5) * maxTilt : 0
    setStyle({
      '--spot-x': `${x}px`,
      '--spot-y': `${y}px`,
      '--spot-opacity': 1,
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`,
      transition: 'transform 0.12s ease-out',
    })
  }

  const onPointerLeave = () => {
    setStyle({
      '--spot-opacity': 0,
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    })
  }

  return (
    <Tag
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={style}
      className={`panel ${className}`}
      {...rest}
    >
      {children}
      <span className="spot-overlay" aria-hidden="true" />
    </Tag>
  )
}

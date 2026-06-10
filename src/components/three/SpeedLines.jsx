import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * Streaks that fire toward the camera on mount, then settle —
 * the "jump to lightspeed" moment, fires once on page load.
 */
export default function SpeedLines({ count = 60 }) {
  const group = useRef()
  const start = useRef(null)

  const lines = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 3 + Math.random() * 10
      arr.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius * 0.6,
        z: -40 - Math.random() * 30,
        speed: 28 + Math.random() * 30,
        len: 1.5 + Math.random() * 3,
      })
    }
    return arr
  }, [count])

  useFrame(({ clock }) => {
    if (start.current === null) start.current = clock.elapsedTime
    const t = clock.elapsedTime - start.current
    if (!group.current || t > 2.4) {
      if (group.current) group.current.visible = false
      return
    }
    const decel = Math.max(0, 1 - t / 2.2)
    group.current.children.forEach((line, i) => {
      const d = lines[i]
      line.position.z += d.speed * decel * 0.016
      if (line.position.z > 6) line.position.z = d.z
      line.material.opacity = decel * 0.6
    })
  })

  return (
    <group ref={group}>
      {lines.map((d, i) => (
        <mesh key={i} position={[d.x, d.y, d.z]}>
          <boxGeometry args={[0.02, 0.02, d.len]} />
          <meshBasicMaterial color="#4A7FD4" transparent opacity={0.6} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

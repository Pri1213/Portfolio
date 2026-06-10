import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * ~240 particles arranged in loose clusters (data-node constellations),
 * a subset connected by thin lines for a pipeline/graph aesthetic.
 */
export default function DataParticles({ count = 240 }) {
  const points = useRef()

  const { positions, linePositions } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const clusterCenters = []
    for (let c = 0; c < 8; c++) {
      clusterCenters.push([
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.3) * 10,
        (Math.random() - 0.5) * 14 - 4,
      ])
    }
    const nodes = []
    for (let i = 0; i < count; i++) {
      const [cx, cy, cz] = clusterCenters[i % clusterCenters.length]
      const x = cx + (Math.random() - 0.5) * 5
      const y = cy + (Math.random() - 0.5) * 4
      const z = cz + (Math.random() - 0.5) * 5
      pos.set([x, y, z], i * 3)
      nodes.push([x, y, z])
    }
    // Connect nearby nodes within clusters
    const lines = []
    for (let i = 0; i < count; i += 6) {
      const a = nodes[i]
      const b = nodes[(i + 3) % count]
      const dist = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
      if (dist < 6) lines.push(...a, ...b)
    }
    return { positions: pos, linePositions: new Float32Array(lines) }
  }, [count])

  useFrame(({ clock }) => {
    if (points.current) {
      points.current.rotation.y = clock.elapsedTime * 0.02
    }
  })

  return (
    <group ref={points}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.07} color="#4A7FD4" transparent opacity={0.85} sizeAttenuation depthWrite={false} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#2E5FA3" transparent opacity={0.18} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

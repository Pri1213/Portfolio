import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import DataParticles from './DataParticles.jsx'
import SpeedLines from './SpeedLines.jsx'

function GridPlane() {
  return (
    <gridHelper
      args={[80, 48, '#2E5FA3', '#1E1E2E']}
      position={[0, -4.5, -10]}
      rotation={[0, 0, 0]}
    />
  )
}

function MouseParallax() {
  const { camera } = useThree()
  const target = useRef({ x: 0, y: 0 })

  useFrame(({ pointer }) => {
    target.current.x += (pointer.x * 0.6 - target.current.x) * 0.04
    target.current.y += (pointer.y * 0.35 - target.current.y) * 0.04
    camera.position.x = target.current.x
    camera.position.y = 0.5 + target.current.y
    camera.lookAt(0, 0, -8)
  })
  return null
}

/**
 * Hero 3D background. Only mounted on desktop with motion allowed;
 * Hero.jsx renders a CSS gradient fallback otherwise.
 */
export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 8], fov: 60 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      className="!absolute inset-0"
    >
      <color attach="background" args={['#0A0A0F']} />
      <fog attach="fog" args={['#0A0A0F', 14, 42]} />
      <Suspense fallback={null}>
        <DataParticles />
        <SpeedLines />
        <GridPlane />
        <MouseParallax />
      </Suspense>
    </Canvas>
  )
}

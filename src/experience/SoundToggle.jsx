import { useEffect, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { attachSound, isSoundOn, setSound } from './sound.js'

export default function SoundToggle() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const detach = attachSound()
    setOn(isSoundOn())
    return detach
  }, [])
  const toggle = () => {
    const next = !on
    setSound(next)
    setOn(next)
  }
  return (
    <button
      onClick={toggle}
      aria-label={on ? 'Mute interface sounds' : 'Enable interface sounds'}
      aria-pressed={on}
      title="UI sound"
      className={`p-2 transition-colors ${on ? 'text-accent-glow' : 'text-midgrey hover:text-offwhite'}`}
    >
      {on ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </button>
  )
}

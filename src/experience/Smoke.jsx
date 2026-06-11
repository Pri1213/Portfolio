/** Ambient tyre-smoke puffs rising from a section corner. Pure CSS. */
export default function Smoke({ side = 'left', count = 3 }) {
  return (
    <div
      className={`absolute bottom-0 ${side === 'left' ? 'left-4' : 'right-4'} w-40 h-40 overflow-visible pointer-events-none`}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="smoke-puff"
          style={{ left: i * 24, bottom: 0, animationDelay: `${i * 2.1}s`, '--sx': side === 'left' ? '70px' : '-70px' }}
        />
      ))}
    </div>
  )
}

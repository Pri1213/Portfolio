/** F1 broadcast ticker strip. Pauses on hover; killed under reduced motion. */
export default function Marquee({ items, red = false }) {
  const row = items.join('  /  ') + '  /  '
  return (
    <div
      className={`overflow-hidden border-y ${red ? 'border-f1red/30 bg-f1red/5' : 'border-gridline bg-dark-card/40'} py-3 select-none`}
      aria-hidden="true"
    >
      <div className="marquee-track font-display italic uppercase font-bold text-xl sm:text-2xl tracking-wide whitespace-nowrap">
        <span className={red ? 'text-f1red' : 'text-midgrey'}>{row.repeat(3)}</span>
        <span className={red ? 'text-f1red' : 'text-midgrey'}>{row.repeat(3)}</span>
      </div>
    </div>
  )
}

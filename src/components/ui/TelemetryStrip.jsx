import { motion } from 'framer-motion'

/**
 * Timing-tower sector strip: three mini-sectors, each with its
 * broadcast colour (purple = session best, green = personal best,
 * yellow = on pace). Used as the hero's bottom telemetry readout.
 */
const SECTOR_STYLES = [
  { bar: 'bg-sector-purple', text: 'text-sector-purple' },
  { bar: 'bg-sector-green', text: 'text-sector-green' },
  { bar: 'bg-sector-yellow', text: 'text-sector-yellow' },
]

export default function TelemetryStrip({ sectors, delay = 1.35 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mt-12 flex flex-wrap items-stretch justify-center gap-3"
      role="list"
      aria-label="Career telemetry"
    >
      {sectors.map((s, i) => {
        const c = SECTOR_STYLES[i % SECTOR_STYLES.length]
        return (
          <div
            key={s.value}
            role="listitem"
            className="panel bg-dark-card/70 backdrop-blur px-4 py-2.5 min-w-[148px] text-left"
          >
            <span className={`block h-[3px] w-8 ${c.bar} mb-2`} aria-hidden="true" />
            <p className="font-mono text-[10px] tracking-[0.25em] text-midgrey">S{i + 1} · {s.label}</p>
            <p className={`font-display italic font-bold text-lg leading-tight ${c.text}`}>{s.value}</p>
          </div>
        )
      })}
    </motion.div>
  )
}

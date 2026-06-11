import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * Apple-style scroll story: a qualifying lap through her data platform.
 * The section is 300vh tall; the viewport pins; scrolling drives a
 * sector-by-sector reveal with a live lap-progress track. Sector
 * colours follow F1 timing: purple = fastest.
 */
const SECTORS = [
  {
    n: 'SECTOR 1',
    title: 'INGESTION',
    colour: '#E10600',
    body: '7 sources, one pipeline. Multi-tenant Xero, Zoho Desk, GitHub, Absorb LMS through Fivetran — plus a custom Python connector streaming live FX rates. Everything lands in BigQuery.',
    stat: '7 SOURCES',
  },
  {
    n: 'SECTOR 2',
    title: 'TRANSFORMATION',
    colour: '#4A7FD4',
    body: '50+ dbt models across 4 layers — staging to KPI. Every push runs automated tests, SQLFluff linting, and CI/CD into dev and prod. Nothing merges on vibes.',
    stat: '50+ MODELS',
  },
  {
    n: 'SECTOR 3',
    title: 'DECISION',
    colour: '#A855F7',
    body: 'Finance sees receivables in real time for the first time. Reporting that took a month now takes two days. And one forensic reconciliation found £600K nobody knew was missing.',
    stat: '1 MONTH → 2 DAYS',
  },
]

export default function TheLap() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const trackProgress = useTransform(scrollYProgress, [0.05, 0.95], [0, 1])

  return (
    <section ref={ref} className="relative" style={{ height: '300vh' }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden grid-overlay">
        <div className="max-w-5xl mx-auto px-5 w-full">
          <p className="eyebrow mb-2">// the lap</p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mb-10">
            One lap through the platform
          </h2>

          {/* Lap progress track */}
          <div className="relative h-2 rounded-full bg-gridline mb-12 overflow-hidden" aria-hidden="true">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                scaleX: trackProgress,
                transformOrigin: 'left',
                width: '100%',
                background: 'linear-gradient(90deg, #E10600 0%, #E10600 33%, #4A7FD4 33%, #4A7FD4 66%, #A855F7 66%)',
              }}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {SECTORS.map((s, i) => {
              // each sector activates across its third of the scroll
              const start = 0.08 + i * 0.28
              return <Sector key={s.n} sector={s} progress={scrollYProgress} start={start} />
            })}
          </div>

          <FinishLine progress={scrollYProgress} />
        </div>
      </div>
    </section>
  )
}

function Sector({ sector, progress, start }) {
  const opacity = useTransform(progress, [start, start + 0.1], [0.18, 1])
  const y = useTransform(progress, [start, start + 0.1], [26, 0])
  return (
    <motion.div style={{ opacity, y }} className="panel p-6 border-t-2" >
      <div className="h-1 -mt-6 -mx-6 mb-5 rounded-t" style={{ background: sector.colour }} />
      <p className="font-mono text-[10px] tracking-[0.3em]" style={{ color: sector.colour }}>{sector.n}</p>
      <h3 className="font-display font-bold text-xl mt-1 mb-3">{sector.title}</h3>
      <p className="text-sm text-midgrey leading-relaxed">{sector.body}</p>
      <p className="font-mono text-sm font-bold mt-4" style={{ color: sector.colour }}>{sector.stat}</p>
    </motion.div>
  )
}

function FinishLine({ progress }) {
  const opacity = useTransform(progress, [0.88, 0.97], [0, 1])
  return (
    <motion.p style={{ opacity }} className="font-mono text-xs text-midgrey mt-10 text-center">
      LAP COMPLETE · TIME: 9 MONTHS, SOLO · POSITION: P1
      <span className="text-midgrey/60"> (only entrant — still counts)</span> 🏁
    </motion.p>
  )
}

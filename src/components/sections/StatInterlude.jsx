import { motion } from 'framer-motion'
import useCountUp from '../../hooks/useCountUp.js'
import Smoke from '../../experience/Smoke.jsx'

/** Full-bleed rhythm breaker: one enormous number, smoke, nothing else. */
export default function StatInterlude() {
  const [ref, value] = useCountUp(600, { duration: 2200 })
  return (
    <section className="relative py-28 overflow-hidden border-y border-gridline grid-overlay">
      <Smoke side="left" />
      <Smoke side="right" />
      <div className="max-w-5xl mx-auto px-5 text-center relative">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-xs tracking-[0.4em] text-midgrey mb-4"
        >
          THREE MONTHS INTO HER FIRST ROLE, SHE FOUND
        </motion.p>
        <p ref={ref} className="font-display font-bold text-7xl sm:text-9xl text-accent-glow leading-none">
          £{value}K
        </p>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-5 text-midgrey max-w-xl mx-auto"
        >
          in missed revenue nobody knew was missing — found through forensic reconciliation, recovered through
          cross-team coordination, prevented through governance. The full story is in the radio traffic below.
        </motion.p>
      </div>
    </section>
  )
}

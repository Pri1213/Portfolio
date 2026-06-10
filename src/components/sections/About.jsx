import { motion } from 'framer-motion'
import useCountUp from '../../hooks/useCountUp.js'
import { useLang } from '../../i18n.jsx'

function Stat({ end, prefix = '', suffix = '', label }) {
  const [ref, value] = useCountUp(end)
  return (
    <div ref={ref} className="panel panel-hover p-6">
      <p className="font-mono text-4xl sm:text-5xl font-bold text-accent-glow">
        {prefix}
        {Number(value).toLocaleString('en-GB')}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-midgrey">{label}</p>
    </div>
  )
}

export default function About() {
  const { t } = useLang()
  return (
    <section id="about" className="relative py-24 scanlines">
      <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="racing-bar" aria-hidden="true"><i /><i /></span>
          <p className="eyebrow mb-2">{t.about.eyebrow}</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-7">{t.about.title}</h2>
          <div className="space-y-5 text-midgrey leading-relaxed">
            <p>{t.about.p1}</p>
            <p>
              {t.about.p2a}
              <span className="text-offwhite font-medium">{t.about.p2b}</span>
              {t.about.p2c}
            </p>
            <p>{t.about.p3}</p>
            <p className="font-mono text-sm">{t.about.p4}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <Stat end={600} prefix="£" suffix="K" label={t.about.stat1} />
          <Stat end={50} suffix="+" label={t.about.stat2} />
          <Stat end={44} label={t.about.stat3} />
          <Stat end={1} label={t.about.stat4} />
        </div>
      </div>
    </section>
  )
}

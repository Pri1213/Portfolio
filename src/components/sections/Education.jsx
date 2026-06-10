import { motion } from 'framer-motion'
import { GraduationCap, Trophy } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'
import { useLang } from '../../i18n.jsx'

const EDUCATION = [
  {
    degree: 'MSc Data Science — Distinction',
    school: 'Loughborough University',
    period: '2023 – 2024',
  },
  {
    degree: 'BSc Business IT & Systems — GPA 3.75',
    school: 'Curtin University',
    period: '2020 – 2023',
    award: 'Challenger Trophy — 1st in cohort',
  },
  {
    degree: 'A-Levels',
    school: 'Loreto College, Mauritius',
    period: '2012 – 2019',
  },
]

export default function Education() {
  const { t } = useLang()
  return (
    <section id="education" className="relative py-24 scanlines">
      <div className="max-w-4xl mx-auto px-5">
        <SectionHeading eyebrow={t.sections.education.eyebrow} title={t.sections.education.title} />
        <div className="space-y-4">
          {EDUCATION.map((e, i) => (
            <motion.div
              key={e.degree}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="panel panel-hover p-6 flex items-start gap-4"
            >
              <GraduationCap size={20} className="text-accent-glow mt-1 shrink-0" />
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display font-semibold text-offwhite">{e.degree}</h3>
                  <p className="font-mono text-xs text-midgrey">{e.period}</p>
                </div>
                <p className="text-sm text-midgrey mt-1">{e.school}</p>
                {e.award && (
                  <p className="text-sm text-accent-glow mt-2 flex items-center gap-1.5">
                    <Trophy size={14} /> {e.award}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

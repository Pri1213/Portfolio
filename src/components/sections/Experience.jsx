import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading.jsx'
import { useLang } from '../../i18n.jsx'

const ROLES = [
  {
    company: 'Simple Pharma (Tithonia Group)',
    title: 'Analytics Engineer',
    period: 'Jun 2025 – Present',
    location: 'London, UK',
    summary: 'Sole Analytics Engineer — built the data platform from scratch',
    bullets: [
      '£600K in missed revenue identified and recovered through forensic reconciliation',
      'Tamrisa reporting cycle: 1 month → 2–3 days',
      '4-layer dbt project (0_staging → 1_central → 2_model → 3_kpi)',
      '50+ dbt models, 7 sources, 500K+ records',
      '10+ data quality dashboards used by Finance & Ops',
      'Financial reporting across 44 countries — P&L, AR/AP ageing, cash flow, budget vs actuals',
      'Azure Function distributor pipeline, Control Centre contributions, Terraform-managed IAM',
    ],
    highlight: true,
  },
  {
    company: 'Switch Up (Non-Profit)',
    title: 'Data Volunteer',
    period: 'Mar 2025 – Jun 2025',
    location: 'Nottingham, UK',
    bullets: ['Supported data work for a youth mentoring non-profit'],
  },
  {
    company: 'Rogers Capital',
    title: 'Data Analyst Intern',
    period: 'Jan 2023 – Mar 2023',
    location: 'Mauritius',
    bullets: ['Analysis and reporting across financial services business lines'],
  },
  {
    company: 'Rogers Capital',
    title: 'Business Analyst Intern',
    period: 'Jan 2022 – Mar 2022',
    location: 'Mauritius',
    bullets: ['Requirements gathering and process analysis for fintech products'],
  },
]

export default function Experience() {
  const { t } = useLang()
  return (
    <section id="experience" className="relative py-24 scanlines">
      <div className="max-w-4xl mx-auto px-5">
        <SectionHeading eyebrow={t.sections.experience.eyebrow} title={t.sections.experience.title} />
        <div className="relative border-l border-gridline ml-2 sm:ml-4 space-y-10">
          {ROLES.map((role, i) => (
            <motion.article
              key={`${role.company}-${role.period}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative pl-8 sm:pl-10"
            >
              <span
                className={`absolute -left-[7px] top-2 w-3.5 h-3.5 rounded-full border-2 ${
                  role.highlight ? 'bg-accent-glow border-accent-glow shadow-glow-blue' : 'bg-dark border-accent'
                }`}
                aria-hidden="true"
              />
              <div className={`panel panel-hover p-6 ${role.highlight ? 'border-accent/50' : ''}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display font-semibold text-lg text-offwhite">{role.company}</h3>
                  <p className="font-mono text-xs text-midgrey">{role.period} · {role.location}</p>
                </div>
                <p className="text-accent-glow text-sm mt-1">{role.title}</p>
                {role.summary && <p className="text-midgrey text-sm italic mt-1">{role.summary}</p>}
                <ul className="mt-4 space-y-2">
                  {role.bullets.map((b, bi) => (
                    <motion.li
                      key={bi}
                      initial={{ opacity: 0, x: -14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: bi * 0.05 }}
                      className="text-sm text-midgrey flex gap-2.5"
                    >
                      <span className="text-accent mt-0.5 shrink-0">▸</span>
                      <span>{b}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { Hexagon, Sparkles } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'
import { useLang } from '../../i18n.jsx'

// weight = visual proficiency bar (production usage, not fake percentages)
const GROUPS = [
  {
    name: 'CORE STACK',
    skills: [
      { name: 'dbt', weight: 100, note: '4-layer architecture, 50+ models in production' },
      { name: 'SQL (Advanced)', weight: 100, note: 'The language the whole platform speaks' },
      { name: 'Python', weight: 90, note: 'Custom connectors, automation, forensic analysis' },
      { name: 'Fivetran', weight: 85, note: 'Multi-tenant Xero, Zoho Desk, GitHub ingestion' },
      { name: 'PostgreSQL', weight: 80, note: 'Source system work, including the £600K bug fix' },
    ],
  },
  {
    name: 'CLOUD & INFRA',
    skills: [
      { name: 'BigQuery (GCP)', weight: 100, note: 'The warehouse everything lands in' },
      { name: 'GitHub Actions', weight: 85, note: 'CI/CD for every dbt deployment' },
      { name: 'Terraform', weight: 70, note: 'Service accounts and IAM as code' },
      { name: 'Azure Functions', weight: 70, note: 'Distributor report pipeline' },
      { name: 'Docker', weight: 65, note: 'Containerised tooling and local dev' },
    ],
  },
  {
    name: 'BI & DASHBOARDS',
    skills: [
      { name: 'Rill', weight: 90, note: '10+ data quality and finance dashboards' },
      { name: 'Hex', weight: 80, note: 'Analytical notebooks for Finance & Ops' },
      { name: 'Windmill', weight: 70, note: 'Workflow automation and internal tools' },
      { name: 'Power BI', weight: 65, note: 'Stakeholder-facing reporting' },
      { name: 'Tableau', weight: 55, note: 'Academic and analysis projects' },
    ],
  },
  {
    name: 'ML & ANALYTICS',
    skills: [
      { name: 'scikit-learn', weight: 75, note: 'Random Forest & Gradient Boosting on 600K+ records' },
      { name: 'Forecasting', weight: 70, note: 'Financial forecasting models in production' },
      { name: 'Reconciliation', weight: 90, note: 'Forensic methods that found £600K' },
      { name: 'Observability', weight: 85, note: 'Data quality monitoring across 7 sources' },
      { name: 'Monte Carlo', weight: 60, note: 'Stock portfolio simulation' },
    ],
  },
  {
    name: 'WORKFLOW',
    skills: [
      { name: 'Claude Code', weight: 90, note: 'AI-assisted engineering, daily driver', highlight: true },
      { name: 'Git', weight: 95, note: 'Trunk-based, PR-reviewed, CI-gated' },
      { name: 'SQLFluff', weight: 80, note: 'Linted SQL or it does not merge' },
      { name: 'XState', weight: 60, note: 'State machines in Control Centre' },
      { name: 'dbt packages', weight: 75, note: 'dbt_utils, codegen, elementary' },
    ],
  },
]

/* F1 timing-screen tiers: purple = session best, green = personal best,
   blue = on pace. Same rules the broadcast uses for sector times. */
function tierClasses(weight) {
  if (weight >= 90) return 'bg-sector-purple shadow-glow-purple'
  if (weight >= 75) return 'bg-sector-green shadow-glow-green'
  return 'bg-accent'
}

function SkillRow({ skill, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="group relative"
    >
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className={skill.highlight ? 'text-accent-glow font-medium flex items-center gap-1.5' : 'text-offwhite'}>
          {skill.highlight && <Sparkles size={13} />}
          {skill.name}
        </span>
      </div>
      <div className="h-1.5 rounded bg-gridline overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.weight}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: delay + 0.15, ease: 'easeOut' }}
          className={`h-full rounded ${tierClasses(skill.weight)}`}
        />
      </div>
      {/* Always visible on touch screens; revealed on hover where a pointer exists */}
      <p className="mt-1.5 text-xs text-midgrey sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
        {skill.note}
      </p>
    </motion.div>
  )
}

function TierLegend() {
  const tiers = [
    { colour: 'bg-sector-purple', label: 'SESSION BEST' },
    { colour: 'bg-sector-green', label: 'PERSONAL BEST' },
    { colour: 'bg-accent', label: 'ON PACE' },
  ]
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 -mt-7 mb-8">
      {tiers.map((t) => (
        <span key={t.label} className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-midgrey">
          <i className={`block w-3 h-1.5 rounded-sm ${t.colour}`} aria-hidden="true" /> {t.label}
        </span>
      ))}
    </div>
  )
}

export default function Skills() {
  const { t } = useLang()
  return (
    <section id="skills" className="relative py-24 bg-navy/30 grid-overlay">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHeading eyebrow={t.sections.skills.eyebrow} title={t.sections.skills.title} />
        <TierLegend />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GROUPS.map((group, gi) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: gi * 0.08 }}
              className="panel panel-hover p-6"
            >
              <h3 className="font-mono text-xs tracking-[0.25em] text-accent-glow mb-5 flex items-center gap-2">
                <Hexagon size={13} /> {group.name}
              </h3>
              <div className="space-y-4">
                {group.skills.map((s, si) => (
                  <SkillRow key={s.name} skill={s} delay={si * 0.06} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

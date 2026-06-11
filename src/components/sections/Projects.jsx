import { motion } from 'framer-motion'
import { ArrowUpRight, Github } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'
import SpotlightCard from '../ui/SpotlightCard.jsx'
import { useLang } from '../../i18n.jsx'

const PROJECTS = [
  {
    title: "Master's Thesis",
    desc: 'Machine learning on 600K+ PISA education records — what actually predicts student outcomes.',
    tags: ['Random Forest', 'Gradient Boosting', 'Python'],
  },
  {
    title: 'Intelligent Student Grouping',
    desc: 'K-Means clustering behind a REST API with full database architecture. Graded 1st in cohort.',
    tags: ['K-Means', 'REST API', 'DB Architecture'],
  },
  {
    title: 'Stock Portfolio Simulator',
    desc: 'Monte Carlo simulation of portfolio risk and return across thousands of market scenarios.',
    tags: ['Monte Carlo', 'Excel', 'Python'],
  },
  {
    title: 'Image Classification',
    desc: 'Convolutional neural network with data augmentation for image recognition.',
    tags: ['CNN', 'Data Augmentation', 'Python'],
  },
]

export default function Projects() {
  const { t } = useLang()
  return (
    <section id="projects" className="relative py-24 bg-navy/30 grid-overlay">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHeading eyebrow={t.sections.projects.eyebrow} title={t.sections.projects.title} />
        <div className="grid sm:grid-cols-2 gap-5">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="h-full"
            >
              <SpotlightCard
                as="a"
                href="https://github.com/Pri1213"
                target="_blank"
                rel="noreferrer"
                className="panel-hover p-6 flex flex-col h-full group cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-display font-semibold text-lg text-offwhite group-hover:text-accent-glow transition-colors">
                    {p.title}
                  </h3>
                  <Github size={16} className="text-midgrey group-hover:text-accent-glow transition-colors shrink-0 mt-1" />
                </div>
                <p className="mt-2 text-sm text-midgrey leading-relaxed">{p.desc}</p>
                <div className="mt-4 mb-5 flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[11px] px-2.5 py-1 rounded-full border border-gridline text-accent-glow bg-dark">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-auto pt-4 border-t border-gridline font-mono text-[11px] tracking-[0.2em] text-midgrey group-hover:text-accent-glow transition-colors inline-flex items-center gap-1.5">
                  VIEW CODE
                  <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { Radio } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'
import Smoke from '../../experience/Smoke.jsx'

/**
 * Soft skills as pit-wall radio. Each exchange SHOWS the skill instead
 * of claiming it, then cites the receipts. Recruiters read dialogue;
 * nobody reads "excellent communication skills".
 */
const TRANSMISSIONS = [
  {
    skill: 'STAKEHOLDER TRANSLATION',
    exchange: [
      { from: 'FINANCE', text: 'The numbers look wrong and the board meeting is Thursday.' },
      { from: 'PRIYASNEE', text: 'Copy. Translating finance-speak to SQL. Dashboard in your inbox by lunch — and I\u2019ll walk you through it so it never looks wrong again.' },
    ],
    receipts: 'Trained Finance, budget holders and leadership on the data products she built; authored the technical guide and the plain-English user guide.',
  },
  {
    skill: 'CROSS-FUNCTIONAL COORDINATION',
    exchange: [
      { from: 'PRIYASNEE', text: 'I\u2019m seeing \u00a3600K of orders that never became invoices. This isn\u2019t a dashboard bug — we need Finance, Ops and Engineering on one call.' },
      { from: 'PIT WALL', text: 'Copy. You have the room.' },
    ],
    receipts: 'Identified the discrepancy, fixed the PostgreSQL bug, then coordinated Finance and Operations to recover the money from clients — and set up monthly governance so it stays recovered.',
  },
  {
    skill: 'OWNERSHIP UNDER PRESSURE',
    exchange: [
      { from: 'PIT WALL', text: 'The data platform is yours. There is no handover. There is no roadmap. There is no other engineer.' },
      { from: 'PRIYASNEE', text: 'Understood. Building it from scratch. Will report back with 50 models in production.' },
    ],
    receipts: 'Sole analytics engineer three months into her career — built ingestion, transformation, reporting, observability and CI/CD for a 44-country operation.',
  },
  {
    skill: 'TEACHING & ENABLEMENT',
    exchange: [
      { from: 'OPERATIONS', text: 'Can you just send us the numbers every week?' },
      { from: 'PRIYASNEE', text: 'Better: I\u2019ll teach you to pull them yourself, build alerts so you don\u2019t have to, and run a session so the whole company understands the architecture.' },
    ],
    receipts: 'Delivered company-wide architecture training, Finance reconciliation workshops, and self-serve dashboards used daily without her in the loop.',
  },
  {
    skill: 'BILINGUAL COMMS',
    exchange: [
      { from: 'CLIENT (PARIS)', text: 'Pouvez-vous expliquer l\u2019\u00e9cart dans le rapport des ventes ?' },
      { from: 'PRIYASNEE', text: 'Bien s\u00fbr — donnez-moi deux minutes. (Same answer, two languages, zero translation layer.)' },
    ],
    receipts: 'Fluent English and French — working across a 44-country distribution network where the data speaks several languages and so does she.',
  },
]

export default function TeamRadio() {
  return (
    <section id="teamradio" className="relative py-24 scanlines overflow-hidden">
      <Smoke side="right" />
      <div className="max-w-4xl mx-auto px-5">
        <SectionHeading eyebrow="// team radio" title="Soft skills, on the radio" />
        <p className="-mt-8 mb-10 text-midgrey text-sm max-w-xl">
          Anyone can write &ldquo;excellent communication skills&rdquo; on a CV. Here&apos;s the actual radio traffic.
        </p>
        <div className="space-y-5">
          {TRANSMISSIONS.map((t, i) => (
            <motion.div
              key={t.skill}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="panel panel-hover p-5"
            >
              <p className="font-mono text-[10px] tracking-[0.25em] text-accent-glow mb-4 flex items-center gap-2">
                <Radio size={12} /> {t.skill}
              </p>
              <div className="space-y-2.5">
                {t.exchange.map((m, mi) => (
                  <div key={mi} className={`radio-msg px-4 py-2.5 ${m.from === 'PRIYASNEE' ? 'driver' : ''}`}>
                    <p className="font-mono text-[10px] tracking-widest text-midgrey">{m.from}</p>
                    <p className="text-sm text-offwhite mt-0.5 leading-relaxed">&ldquo;{m.text}&rdquo;</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-midgrey leading-relaxed">
                <span className="font-mono text-[10px] tracking-widest text-accent-glow">RECEIPTS:</span> {t.receipts}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

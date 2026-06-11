import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Linkedin, Mail, Timer, X, Zap } from 'lucide-react'

/**
 * The Fast Lane: a floating tab that says the quiet part out loud —
 * recruiters are busy, here's the 10-second version. Self-aware,
 * efficient, and nobody else's portfolio has one.
 */
const STATS = [
  ['£600K', 'revenue found & recovered'],
  ['50+', 'dbt models in production'],
  ['44', 'countries on the platform'],
  ['1 month → 2 days', 'reporting cycle, after her'],
]

export default function RecruiterMode() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-f1red text-offwhite font-display italic uppercase font-bold text-xs tracking-wider px-2.5 py-4 rounded-l-md shadow-glow-red hover:px-4 transition-all flex flex-col items-center gap-1.5"
        style={{ writingMode: 'vertical-rl' }}
        aria-label="Open the recruiter fast lane"
      >
        <Zap size={13} style={{ transform: 'rotate(90deg)' }} />
        Recruiter? Fast lane
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] bg-dark/85 backdrop-blur flex items-center justify-center px-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 36, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 36, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="panel max-w-lg w-full p-7 relative"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="Recruiter fast lane"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute top-3 right-3 text-midgrey hover:text-offwhite p-1.5"
              >
                <X size={18} />
              </button>

              <p className="font-mono text-[10px] tracking-[0.3em] text-f1red flex items-center gap-2 mb-3">
                <Timer size={12} /> THE 10-SECOND VERSION
              </p>
              <h2 className="font-display text-2xl font-bold mb-2">
                Analytics engineer who built an entire data platform solo — and found £600K doing it.
              </h2>
              <p className="text-sm text-midgrey mb-5">
                London · dbt / BigQuery / Python · MSc Data Science (Distinction) · fluent EN/FR ·
                heading toward data science. Yes, the F1 simulators on this site are her own models.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {STATS.map(([v, label]) => (
                  <div key={label} className="border border-gridline rounded p-3">
                    <p className="font-mono font-bold text-accent-glow">{v}</p>
                    <p className="text-[11px] text-midgrey mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="/cv/Priyasnee_Boolaky_CV.pdf"
                  download
                  className="btn-f1 px-5 py-2.5 bg-accent text-offwhite text-sm hover:bg-accent-glow hover:shadow-glow-blue flex items-center gap-2"
                >
                  <Download size={14} /> CV
                </a>
                <a
                  href="mailto:priyasneeboolaky@gmail.com?subject=Saw%20the%20fast%20lane%20%E2%80%94%20let%27s%20talk"
                  className="btn-f1 px-5 py-2.5 border border-accent text-accent-glow text-sm hover:bg-accent/15 flex items-center gap-2"
                >
                  <Mail size={14} /> Email
                </a>
                <a
                  href="https://linkedin.com/in/priyasnee-boolaky-11aa95220"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-f1 px-5 py-2.5 border border-gridline text-midgrey text-sm hover:text-offwhite hover:border-accent flex items-center gap-2"
                >
                  <Linkedin size={14} /> LinkedIn
                </a>
              </div>

              <p className="mt-5 font-mono text-[10px] text-midgrey">
                Average time-to-decision in here: 10 seconds. Average time she&apos;d save your data team: considerably more.
                Quality-checked by Bobby 🐾
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

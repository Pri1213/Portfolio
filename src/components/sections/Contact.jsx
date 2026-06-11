import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, Download, Github, Linkedin, Mail } from 'lucide-react'
import { useLang } from '../../i18n.jsx'

const EMAIL = 'priyasneeboolaky@gmail.com'

function CopyEmailButton() {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable (http / permissions) — mailto link still works
    }
  }

  return (
    <button
      onClick={copy}
      className={`font-mono text-xs px-3 py-2 rounded border transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
        copied
          ? 'border-sector-green/60 text-sector-green bg-sector-green/10'
          : 'border-gridline text-midgrey hover:text-accent-glow hover:border-accent'
      }`}
      aria-live="polite"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? t.contact.copied : t.contact.copy}
    </button>
  )
}

export default function Contact() {
  const { t } = useLang()
  return (
    <section id="contact" className="relative py-28 bg-navy/30 grid-overlay">
      <div className="max-w-2xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="panel p-10 text-center shadow-glow-blue/50"
        >
          <span className="racing-bar" aria-hidden="true"><i /><i /></span>
          <p className="eyebrow mb-2">{t.contact.eyebrow}</p>
          <h2 className="font-display text-4xl font-bold mb-6">{t.contact.title}</h2>

          <div className="flex flex-wrap items-center justify-center gap-2 text-midgrey">
            <a href={`mailto:${EMAIL}`} className="hover:text-accent-glow transition-colors inline-flex items-center gap-2 py-2">
              <Mail size={16} /> {EMAIL}
            </a>
            <CopyEmailButton />
          </div>

          <div className="mt-4 space-y-3 text-midgrey">
            <p>
              <a href="https://linkedin.com/in/priyasnee-boolaky-11aa95220" target="_blank" rel="noreferrer" className="hover:text-accent-glow transition-colors inline-flex items-center gap-2 py-1">
                <Linkedin size={16} /> linkedin.com/in/priyasnee-boolaky
              </a>
            </p>
            <p>
              <a href="https://github.com/Pri1213" target="_blank" rel="noreferrer" className="hover:text-accent-glow transition-colors inline-flex items-center gap-2 py-1">
                <Github size={16} /> github.com/Pri1213
              </a>
            </p>
          </div>

          <p className="mt-6 font-mono text-sm text-accent-glow inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sector-green animate-pulse" aria-hidden="true" />
            {t.contact.available}
          </p>
          <div>
            <a
              href="/cv/Priyasnee_Boolaky_CV.pdf"
              download
              className="btn-f1 mt-8 inline-flex items-center gap-2 px-8 py-3 bg-accent text-offwhite hover:bg-accent-glow hover:shadow-glow-blue-lg"
            >
              {t.contact.cv} <Download size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

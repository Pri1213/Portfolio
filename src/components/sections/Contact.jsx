import { motion } from 'framer-motion'
import { Download, Github, Linkedin, Mail } from 'lucide-react'
import { useLang } from '../../i18n.jsx'

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
          <div className="space-y-3 text-midgrey">
            <p>
              <a href="mailto:priyasneeboolaky@gmail.com" className="hover:text-accent-glow transition-colors inline-flex items-center gap-2">
                <Mail size={16} /> priyasneeboolaky@gmail.com
              </a>
            </p>
            <p>
              <a href="https://linkedin.com/in/priyasnee-boolaky-11aa95220" target="_blank" rel="noreferrer" className="hover:text-accent-glow transition-colors inline-flex items-center gap-2">
                <Linkedin size={16} /> linkedin.com/in/priyasnee-boolaky
              </a>
            </p>
            <p>
              <a href="https://github.com/Pri1213" target="_blank" rel="noreferrer" className="hover:text-accent-glow transition-colors inline-flex items-center gap-2">
                <Github size={16} /> github.com/Pri1213
              </a>
            </p>
          </div>
          <p className="mt-6 font-mono text-sm text-accent-glow">{t.contact.available}</p>
          <a
            href="/cv/Priyasnee_Boolaky_CV.pdf"
            download
            className="btn-f1 mt-8 inline-flex items-center gap-2 px-8 py-3 bg-accent text-offwhite hover:bg-accent-glow hover:shadow-glow-blue-lg"
          >
            {t.contact.cv} <Download size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

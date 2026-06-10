import { Github, Linkedin, Mail } from 'lucide-react'
import { useLang } from '../../i18n.jsx'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="border-t border-gridline">
      <div className="checkered" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs text-midgrey">
          © {new Date().getFullYear()} Priyasnee Boolaky · {t.footer}
        </p>
        <div className="flex items-center gap-5">
          <a href="https://github.com/Pri1213" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-midgrey hover:text-accent-glow transition-colors">
            <Github size={18} />
          </a>
          <a href="https://linkedin.com/in/priyasnee-boolaky-11aa95220" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-midgrey hover:text-accent-glow transition-colors">
            <Linkedin size={18} />
          </a>
          <a href="mailto:priyasneeboolaky@gmail.com" aria-label="Email" className="text-midgrey hover:text-accent-glow transition-colors">
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}

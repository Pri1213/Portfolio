import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail } from 'lucide-react'
import { useLang } from '../../i18n.jsx'

export default function Footer() {
  const { t } = useLang()
  const links = [
    { to: '/', label: t.nav.home },
    { to: '/f1', label: t.nav.f1 },
    { to: '/dj', label: t.nav.dj },
  ]
  return (
    <footer className="border-t border-gridline">
      <div className="checkered" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8">
          <div className="text-center sm:text-left">
            <p className="font-mono text-sm text-offwhite">
              <span className="text-accent-glow">~/</span>priyasnee<span className="cursor-blink text-accent-glow">_</span>
            </p>
            <p className="mt-2 font-mono text-xs text-midgrey max-w-xs">
              Analytics Engineer · London
            </p>
          </div>

          <nav aria-label="Footer" className="flex items-center gap-6">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm text-midgrey hover:text-accent-glow transition-colors py-2">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <a href="https://github.com/Pri1213" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-midgrey hover:text-accent-glow transition-colors p-1">
              <Github size={18} />
            </a>
            <a href="https://linkedin.com/in/priyasnee-boolaky-11aa95220" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-midgrey hover:text-accent-glow transition-colors p-1">
              <Linkedin size={18} />
            </a>
            <a href="mailto:priyasneeboolaky@gmail.com" aria-label="Email" className="text-midgrey hover:text-accent-glow transition-colors p-1">
              <Mail size={18} />
            </a>
          </div>
        </div>

        <p className="mt-10 pt-6 border-t border-gridline font-mono text-xs text-midgrey text-center">
          © {new Date().getFullYear()} Priyasnee Boolaky · {t.footer}
        </p>
      </div>
    </footer>
  )
}

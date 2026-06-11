import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useLang } from '../../i18n.jsx'
import SoundToggle from '../../experience/SoundToggle.jsx'

function LangToggle({ className = '' }) {
  const { lang, setLang } = useLang()
  return (
    <div className={`font-mono text-xs flex items-center gap-1 ${className}`} role="group" aria-label="Language">
      {['en', 'fr'].map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-2 py-1 rounded uppercase transition-colors ${
            lang === l ? 'text-accent-glow bg-accent/15 border border-accent/40' : 'text-midgrey hover:text-offwhite border border-transparent'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export default function Navbar() {
  const { t } = useLang()
  const links = [
    { to: '/', label: t.nav.home },
    { to: '/f1', label: t.nav.f1, accent: true },
    { to: '/dj', label: t.nav.dj },
  ]
  const { scrollYProgress } = useScroll()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'bg-dark/90 backdrop-blur border-b border-gridline' : 'bg-transparent'
      }`}
    >
      {/* Lap progress indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent via-accent-glow to-f1red origin-left"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
      <nav className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="font-mono text-sm text-offwhite tracking-tight">
          <span className="text-accent-glow">~/</span>priyasnee
          <span className="cursor-blink text-accent-glow">_</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors ${
                pathname === l.to
                  ? l.accent
                    ? 'text-f1red'
                    : 'text-accent-glow'
                  : 'text-midgrey hover:text-offwhite'
              }`}
            >
              {l.accent && <span className="mr-1.5 inline-block w-1.5 h-1.5 rounded-full bg-f1red align-middle drs-pulse" />}
              {l.label}
            </Link>
          ))}
          <SoundToggle />
          <LangToggle />
          <a
            href="/cv/Priyasnee_Boolaky_CV.pdf"
            download
            className="btn-f1 text-sm px-4 py-1.5 border border-accent text-accent-glow hover:bg-accent hover:text-offwhite hover:shadow-glow-blue"
          >
            {t.nav.cv}
          </a>
        </div>

        <button
          className="md:hidden text-offwhite p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-gridline px-5 py-4 flex flex-col gap-4 bg-dark/95">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-base ${pathname === l.to ? 'text-accent-glow' : 'text-midgrey'}`}
            >
              {l.label}
            </Link>
          ))}
          <a href="/cv/Priyasnee_Boolaky_CV.pdf" download className="text-base text-accent-glow">
            {t.nav.cv}
          </a>
          <LangToggle />
        </div>
      )}
    </header>
  )
}

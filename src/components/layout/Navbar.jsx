import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll } from 'framer-motion'
import { Menu, X, Download } from 'lucide-react'
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
          className={`px-2.5 py-1.5 rounded uppercase transition-colors cursor-pointer ${
            lang === l ? 'text-accent-glow bg-accent/15 border border-accent/40' : 'text-midgrey hover:text-offwhite border border-transparent'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

const menuVariants = {
  closed: { height: 0, opacity: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
  open: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.05, delayChildren: 0.08 },
  },
}

const itemVariants = {
  closed: { opacity: 0, x: -14 },
  open: { opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
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

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

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
              data-active={pathname === l.to}
              className={`nav-link text-sm font-medium transition-colors ${
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
          className="md:hidden text-offwhite p-2.5 -mr-2.5 cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden border-t border-gridline bg-dark/95 overflow-hidden"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {links.map((l) => (
                <motion.div key={l.to} variants={itemVariants}>
                  <Link
                    to={l.to}
                    className={`flex items-center gap-2 py-3 text-base border-l-2 pl-3 transition-colors ${
                      pathname === l.to
                        ? 'text-accent-glow border-accent-glow'
                        : 'text-midgrey border-transparent hover:text-offwhite'
                    }`}
                  >
                    {l.accent && <span className="inline-block w-1.5 h-1.5 rounded-full bg-f1red drs-pulse" />}
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={itemVariants}>
                <a
                  href="/cv/Priyasnee_Boolaky_CV.pdf"
                  download
                  className="flex items-center gap-2 py-3 pl-3 text-base text-accent-glow border-l-2 border-transparent"
                >
                  <Download size={16} /> {t.nav.cv}
                </a>
              </motion.div>
              <motion.div variants={itemVariants} className="flex items-center gap-4 pt-3 pl-3">
                <SoundToggle />
                <LangToggle />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

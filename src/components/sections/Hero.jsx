import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDown, Download, Github, Linkedin, Mail, Flag } from 'lucide-react'
import useIsMobile from '../../hooks/useIsMobile.js'
import DRSButton from '../../experience/DRSButton.jsx'
import { useLang } from '../../i18n.jsx'

const HeroScene = lazy(() => import('../three/HeroScene.jsx'))

export default function Hero() {
  const { t } = useLang()
  const isMobile = useIsMobile()
  const [allowMotion, setAllowMotion] = useState(true)

  useEffect(() => {
    setAllowMotion(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const show3D = !isMobile && allowMotion

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
      {show3D && (
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      )}

      <div className="relative z-10 text-center px-5 max-w-4xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-mono text-xs sm:text-sm tracking-[0.35em] text-accent-glow mb-6"
        >
          {t.hero.status}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl text-offwhite leading-[0.95]"
        >
          PRIYASNEE
          <br />
          <span className="text-accent-glow">KEERTI BOOLAKY</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="mt-5 font-mono text-base sm:text-lg text-midgrey"
        >
          {t.hero.role}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="mt-3 text-lg sm:text-xl text-offwhite/90"
        >
          {t.hero.quote}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#experience"
            className="btn-f1 px-7 py-3 bg-accent text-offwhite hover:bg-accent-glow hover:shadow-glow-blue flex items-center gap-2"
          >
            {t.hero.viewWork} <ArrowDown size={16} />
          </a>
          <a
            href="/cv/Priyasnee_Boolaky_CV.pdf"
            download
            className="btn-f1 px-7 py-3 border border-accent text-accent-glow hover:bg-accent/15 hover:shadow-glow-blue flex items-center gap-2"
          >
            {t.hero.cv} <Download size={16} />
          </a>
          <Link
            to="/f1"
            className="btn-f1 px-7 py-3 border border-f1red/60 text-f1red hover:bg-f1red/10 hover:shadow-glow-red flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-f1red drs-pulse" />
            {t.hero.f1} <Flag size={16} />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-10 flex items-center justify-center gap-6"
        >
          <a href="https://linkedin.com/in/priyasnee-boolaky-11aa95220" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-midgrey hover:text-accent-glow transition-colors"><Linkedin size={20} /></a>
          <a href="https://github.com/Pri1213" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-midgrey hover:text-accent-glow transition-colors"><Github size={20} /></a>
          <a href="mailto:priyasneeboolaky@gmail.com" aria-label="Email" className="text-midgrey hover:text-accent-glow transition-colors"><Mail size={20} /></a>
        </motion.div>

        <DRSButton />
      </div>
    </section>
  )
}

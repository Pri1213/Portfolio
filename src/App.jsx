import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { LangProvider } from './i18n.jsx'
import BobbyEasterEgg from './components/ui/BobbyEasterEgg.jsx'
import F1DriveBy from './experience/F1DriveBy.jsx'
import RecruiterMode from './components/ui/RecruiterMode.jsx'
import BackToTop from './components/ui/BackToTop.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Home from './pages/Home.jsx'

// Secondary pages split out of the main bundle — fetched on demand
const F1 = lazy(() => import('./pages/F1.jsx'))
const DJ = lazy(() => import('./pages/DJ.jsx'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function RouteLoader() {
  return (
    <main className="min-h-screen flex items-center justify-center" aria-busy="true">
      <p className="font-mono text-sm tracking-[0.3em] text-midgrey animate-pulse">LOADING TELEMETRY…</p>
    </main>
  )
}

export default function App() {
  return (
    <LangProvider>
    <div className="min-h-screen bg-dark text-offwhite">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/f1" element={<F1 />} />
          <Route path="/dj" element={<DJ />} />
        </Routes>
      </Suspense>
      <Footer />
      <BobbyEasterEgg />
      <F1DriveBy />
      <RecruiterMode />
      <BackToTop />
    </div>
    </LangProvider>
  )
}

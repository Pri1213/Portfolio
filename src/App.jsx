import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { LangProvider } from './i18n.jsx'
import BobbyEasterEgg from './components/ui/BobbyEasterEgg.jsx'
import F1DriveBy from './experience/F1DriveBy.jsx'
import RecruiterMode from './components/ui/RecruiterMode.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Home from './pages/Home.jsx'
import F1 from './pages/F1.jsx'
import DJ from './pages/DJ.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <LangProvider>
    <div className="min-h-screen bg-dark text-offwhite">
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/f1" element={<F1 />} />
        <Route path="/dj" element={<DJ />} />
      </Routes>
      <Footer />
      <BobbyEasterEgg />
      <F1DriveBy />
      <RecruiterMode />
    </div>
    </LangProvider>
  )
}

import BootSequence from '../components/ui/BootSequence.jsx'
import Achievements from '../components/ui/Achievements.jsx'
import Hero from '../components/sections/Hero.jsx'
import About from '../components/sections/About.jsx'
import Skills from '../components/sections/Skills.jsx'
import Experience from '../components/sections/Experience.jsx'
import Projects from '../components/sections/Projects.jsx'
import Education from '../components/sections/Education.jsx'
import Quiz from '../components/sections/Quiz.jsx'
import Contact from '../components/sections/Contact.jsx'

export default function Home() {
  return (
    <main>
      <BootSequence />
      <Achievements />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Quiz />
      <Contact />
    </main>
  )
}

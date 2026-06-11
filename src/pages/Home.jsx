import BootSequence from '../components/ui/BootSequence.jsx'
import Achievements from '../components/ui/Achievements.jsx'
import Hero from '../components/sections/Hero.jsx'
import About from '../components/sections/About.jsx'
import StatInterlude from '../components/sections/StatInterlude.jsx'
import TeamRadio from '../components/sections/TeamRadio.jsx'
import Marquee from '../experience/Marquee.jsx'
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
      <Marquee items={['Priyasnee Boolaky', 'Analytics Engineer', 'London', 'dbt', 'BigQuery', '\u00a3600K recovered', '44 countries']} />
      <About />
      <StatInterlude />
      <Skills />
      <Experience />
      <TeamRadio />
      <Projects />
      <Education />
      <Quiz />
      <Marquee red items={['Available for opportunities', 'Box box', 'Let\u2019s talk', 'priyasneeboolaky@gmail.com']} />
      <Contact />
    </main>
  )
}

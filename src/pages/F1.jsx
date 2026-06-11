import { motion } from 'framer-motion'
import DriverStandings from '../components/f1/DriverStandings.jsx'
import ConstructorStandings from '../components/f1/ConstructorStandings.jsx'
import RaceCalendar from '../components/f1/RaceCalendar.jsx'
import LastRaceResults from '../components/f1/LastRaceResults.jsx'
import ChampionshipChart from '../components/f1/ChampionshipChart.jsx'
import PriyasneePicks from '../components/f1/PriyasneePicks.jsx'
import MaxSimulator from '../components/f1/MaxSimulator.jsx'
import StrategyOptimizer from '../components/f1/StrategyOptimizer.jsx'
import RaceForecast from '../components/f1/RaceForecast.jsx'
import ModelReportCard from '../components/f1/ModelReportCard.jsx'

export default function F1() {
  const year = new Date().getFullYear()
  return (
    <main className="pt-28 pb-24 min-h-screen grid-overlay">
      <div className="max-w-6xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-end justify-between gap-3 mb-10"
        >
          <div>
            <p className="font-mono text-xs tracking-[0.3em] text-f1red mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-f1red drs-pulse" /> LIVE DATA
            </p>
            <h1 className="font-display text-5xl sm:text-6xl font-bold">F1 Command Centre</h1>
          </div>
          <p className="font-mono text-sm text-midgrey">{year} SEASON</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-5">
          <DriverStandings />
          <ConstructorStandings />
          <RaceCalendar />
          <LastRaceResults />
          <PriyasneePicks />
          <ChampionshipChart />
          <MaxSimulator />
          <StrategyOptimizer />
          <RaceForecast />
          <ModelReportCard />
        </div>

        <p className="mt-8 font-mono text-xs text-midgrey">
          Data: Jolpica F1 API → Netlify serverless functions → cached → rendered. A small pipeline, but my own.
        </p>
      </div>
    </main>
  )
}

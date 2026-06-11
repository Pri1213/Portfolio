import { useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import { Panel } from './Panel.jsx'

/* ----------------------------------------------------------------------
 * RACE STRATEGY OPTIMIZER — real optimisation, interactive.
 *
 * Lap-time model:  lap = base + deg_rate × tyre_age   (linear degradation)
 * A pit stop resets tyre age and costs pit_loss seconds.
 * Safety cars cut pit loss (~60% cheaper to stop under SC); we model SC
 * probability per race and compare E[total time] of 1-stop vs 2-stop
 * via 2,000 Monte Carlo race simulations per strategy.
 * -------------------------------------------------------------------- */

const BASE_LAP = 90 // seconds
const SIMS = 2000

function simulate({ laps, degRate, pitLoss, scProb }) {
  const oneStopPit = Math.round(laps / 2)
  const twoStopPits = [Math.round(laps / 3), Math.round((2 * laps) / 3)]

  const run = (pitLaps) => {
    let totals = 0
    for (let s = 0; s < SIMS; s++) {
      // does a safety car appear this race, and on which lap?
      const sc = Math.random() < scProb ? 1 + Math.floor(Math.random() * laps) : -1
      let time = 0
      let age = 0
      for (let lap = 1; lap <= laps; lap++) {
        time += BASE_LAP + degRate * age
        age++
        if (pitLaps.includes(lap)) {
          // pitting within ±2 laps of a safety car is ~60% cheaper
          const cheap = sc > 0 && Math.abs(lap - sc) <= 2
          time += cheap ? pitLoss * 0.4 : pitLoss
          age = 0
        }
      }
      totals += time
    }
    return totals / SIMS
  }

  const one = run([oneStopPit])
  const two = run(twoStopPits)

  // deterministic per-lap trace for the chart (no SC, expected case)
  const trace = []
  let a1 = 0, a2 = 0
  for (let lap = 1; lap <= laps; lap++) {
    const l1 = BASE_LAP + degRate * a1
    const l2 = BASE_LAP + degRate * a2
    a1++; a2++
    if (lap === oneStopPit) a1 = 0
    if (twoStopPits.includes(lap)) a2 = 0
    trace.push({
      lap,
      'One stop': +(l1 + (lap === oneStopPit ? pitLoss : 0)).toFixed(1),
      'Two stops': +(l2 + (twoStopPits.includes(lap) ? pitLoss : 0)).toFixed(1),
    })
  }

  return { one, two, trace, oneStopPit, twoStopPits }
}

function Slider({ label, value, setValue, min, max, step, unit }) {
  return (
    <label className="block">
      <span className="flex justify-between font-mono text-[10px] tracking-widest text-midgrey mb-1.5">
        <span>{label}</span>
        <span className="text-accent-glow">{value}{unit}</span>
      </span>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-[#4A7FD4]"
      />
    </label>
  )
}

export default function StrategyOptimizer() {
  const [laps, setLaps] = useState(57)
  const [degRate, setDegRate] = useState(0.08)
  const [pitLoss, setPitLoss] = useState(22)
  const [scProb, setScProb] = useState(0.55)

  const r = useMemo(() => simulate({ laps, degRate, pitLoss, scProb }), [laps, degRate, pitLoss, scProb])
  const delta = (r.one - r.two).toFixed(1)
  const winner = r.one < r.two ? 'ONE STOP' : 'TWO STOPS'

  return (
    <Panel title="RACE STRATEGY OPTIMIZER" right={<span className="font-mono text-[10px] text-accent-glow">INTERACTIVE MODEL</span>} className="lg:col-span-2">
      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <div className="space-y-5">
          <Slider label="RACE DISTANCE" value={laps} setValue={setLaps} min={40} max={78} step={1} unit=" laps" />
          <Slider label="TYRE DEGRADATION" value={degRate} setValue={setDegRate} min={0.02} max={0.25} step={0.01} unit=" s/lap" />
          <Slider label="PIT STOP LOSS" value={pitLoss} setValue={setPitLoss} min={16} max={30} step={0.5} unit=" s" />
          <Slider label="SAFETY CAR PROBABILITY" value={scProb} setValue={setScProb} min={0} max={1} step={0.05} unit="" />

          <div className="panel p-4 text-center">
            <p className="font-mono text-[10px] tracking-widest text-midgrey">OPTIMAL STRATEGY</p>
            <p className="font-display font-bold text-2xl text-accent-glow mt-1">{winner}</p>
            <p className="font-mono text-xs text-midgrey mt-1">
              by {Math.abs(delta)}s expected · {SIMS.toLocaleString()} sims each
            </p>
          </div>
        </div>

        <div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={r.trace} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid stroke="#1E1E2E" strokeDasharray="3 3" />
                <XAxis dataKey="lap" stroke="#8888A0" tick={{ fontSize: 10, fontFamily: 'Roboto Mono' }} />
                <YAxis stroke="#8888A0" tick={{ fontSize: 10, fontFamily: 'Roboto Mono' }} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip contentStyle={{ background: '#111118', border: '1px solid #1E1E2E', borderRadius: 6, fontFamily: 'Roboto Mono', fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Titillium Web' }} />
                <Line type="monotone" dataKey="One stop" stroke="#4A7FD4" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Two stops" stroke="#E10600" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="font-mono text-[10px] text-midgrey mt-2">
            Lap-time trace (expected case): spikes are pit stops; the slopes are tyre degradation. The recommendation
            above also accounts for safety-car luck across {SIMS.toLocaleString()} simulated races — pitting under an
            SC is ~60% cheaper.
          </p>
        </div>
      </div>
    </Panel>
  )
}

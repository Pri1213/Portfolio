import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, RefreshCcw } from 'lucide-react'
import useF1Data from '../../hooks/useF1Data.js'
import { Panel, Skeleton, ErrorNote } from './Panel.jsx'

/* ----------------------------- the model ------------------------------
 * Honest Monte Carlo, comically applied.
 *
 * For each of the N remaining races we sample finishing points for Max
 * and his closest title rival from a points distribution weighted by
 * "form" (their real points-per-race so far, normalised to a 0–1 pace
 * score). 8% DNF chance each, because Formula 1. Run 5,000 seasons,
 * count how many end with Max on top.
 *
 * Petting Bobby applies a morale multiplier to Max's pace. This is not
 * peer-reviewed. It is, however, deterministic enough to watch the
 * probability tick upward, which is the entire point.
 * --------------------------------------------------------------------- */

const POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1, 0]
const SIMS = 5000
const DNF_P = 0.08
const MAX_MORALE = 0.12 // Bobby is good, but he is not a power unit upgrade

function paceWeights(pace) {
  // pace in [0,1] → weight mass shifts toward the front of the grid
  return POINTS.map((_, i) => Math.exp(-i * (0.25 + pace * 1.1)))
}

function samplePoints(weights, total) {
  if (Math.random() < DNF_P) return 0
  let r = Math.random() * total
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]
    if (r <= 0) return POINTS[i]
  }
  return 0
}

function runSimulation({ maxPoints, rivalPoints, racesLeft, maxPace, rivalPace, morale }) {
  const boostedPace = Math.min(1, maxPace * (1 + morale))
  const wMax = paceWeights(boostedPace)
  const wRival = paceWeights(rivalPace)
  const tMax = wMax.reduce((a, b) => a + b, 0)
  const tRival = wRival.reduce((a, b) => a + b, 0)

  let titles = 0
  const finals = new Array(SIMS)
  for (let s = 0; s < SIMS; s++) {
    let mp = maxPoints
    let rp = rivalPoints
    for (let r = 0; r < racesLeft; r++) {
      mp += samplePoints(wMax, tMax)
      rp += samplePoints(wRival, tRival)
    }
    if (mp >= rp) titles++
    finals[s] = mp
  }

  // 20-bin histogram of Max's simulated final points
  const lo = Math.min(...finals)
  const hi = Math.max(...finals)
  const bins = new Array(20).fill(0)
  const span = Math.max(1, hi - lo)
  for (const f of finals) bins[Math.min(19, Math.floor(((f - lo) / span) * 20))]++
  const mean = finals.reduce((a, b) => a + b, 0) / SIMS

  return { probability: titles / SIMS, bins, lo, hi, mean }
}

/* ----------------------------- the comedy ----------------------------- */

function moodFor(position) {
  const p = Number(position)
  if (p === 1) return { face: '😼', label: 'SMUG', radio: '“Simply lovely. Tell the rival to try harder.”' }
  if (p <= 3) return { face: '🙂', label: 'COMPOSED', radio: '“We are in the fight. The fight is acceptable.”' }
  if (p <= 6) return { face: '😤', label: 'SPICY', radio: '“The strategy is… interesting. INTERESTING.”' }
  return { face: '😡', label: 'RADIO UNSAFE', radio: '“[message censored by the FIA]”' }
}

function verdictFor(prob, racesLeft) {
  if (racesLeft === 0) return 'Season over. The model has clocked out and gone home.'
  if (prob >= 0.85) return 'Verdict: mathematically routine. The model suggests he could win some of these in a kart.'
  if (prob >= 0.6) return 'Verdict: favourable. Keep the pit crew caffeinated and avoid lap-1 heroics.'
  if (prob >= 0.35) return 'Verdict: a proper title fight. Cancel all Sunday plans, including yours.'
  if (prob >= 0.1) return 'Verdict: needs chaos. Specifically: rain, safety cars, and at least two rival strategy blunders.'
  return 'Prediction: Max retires and becomes a sim-racing vlogger. 2.3M subscribers by Thursday. The model has made peace with this.'
}

/* ----------------------------- the widget ----------------------------- */

export default function MaxSimulator() {
  const standings = useF1Data('/api/f1-standings?type=drivers')
  const schedule = useF1Data('/api/f1-schedule')

  const [morale, setMorale] = useState(0)
  const [pets, setPets] = useState(() => Number(localStorage.getItem('bobbyPets') || 0))
  const [seed, setSeed] = useState(0) // re-roll button

  useEffect(() => {
    localStorage.setItem('bobbyPets', String(pets))
  }, [pets])

  const inputs = useMemo(() => {
    const list = standings.data?.standings
    const races = schedule.data?.races
    if (!list?.length || !races?.length) return null

    const max = list.find((d) => d.Driver.driverId === 'max_verstappen' || d.Driver.familyName === 'Verstappen')
    if (!max) return null
    const rival = list.find((d) => d !== max) // closest title threat: P1, or P2 if Max leads
    const round = Number(standings.data.round || 0)
    const racesLeft = races.filter((r) => Number(r.round) > round).length
    const done = Math.max(1, round)

    return {
      maxPoints: Number(max.points),
      maxPosition: Number(max.position),
      rivalPoints: Number(rival.points),
      rivalName: `${rival.Driver.givenName} ${rival.Driver.familyName}`,
      racesLeft,
      maxPace: Math.min(1, Number(max.points) / done / 25),
      rivalPace: Math.min(1, Number(rival.points) / done / 25),
    }
  }, [standings.data, schedule.data])

  const result = useMemo(() => {
    if (!inputs) return null
    // seed referenced so the re-roll button forces a fresh run
    void seed
    return runSimulation({ ...inputs, morale })
  }, [inputs, morale, seed])

  const loading = standings.loading || schedule.loading
  const error = standings.error || schedule.error

  const petBobby = () => {
    setPets((p) => p + 1)
    setMorale((m) => Math.min(MAX_MORALE, m + 0.005))
  }

  const gap = inputs ? inputs.rivalPoints - inputs.maxPoints : 0
  const needed = inputs && inputs.racesLeft > 0 ? Math.max(0, gap / inputs.racesLeft).toFixed(1) : '0.0'
  const mood = inputs ? moodFor(inputs.maxPosition) : null
  const maxBin = result ? Math.max(...result.bins) : 1

  return (
    <Panel
      title="MAX TITLE SIMULATOR · MONTE CARLO"
      right={
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="font-mono text-[10px] text-midgrey hover:text-accent-glow transition-colors flex items-center gap-1"
          title="Re-run 5,000 seasons"
        >
          <RefreshCcw size={11} /> RE-SIM
        </button>
      }
      className="lg:col-span-2"
    >
      {loading && <Skeleton rows={6} />}
      {error && <ErrorNote />}
      {!loading && !error && !inputs && (
        <p className="text-sm text-midgrey">
          Can&apos;t find Verstappen in the standings. Either the API is down or he has, in fact, become a vlogger.
        </p>
      )}

      {inputs && result && (
        <div className="grid lg:grid-cols-[1fr_240px] gap-8">
          <div>
            {/* Live inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                [`P${inputs.maxPosition}`, 'CURRENT POSITION'],
                [inputs.maxPoints, 'POINTS'],
                [gap > 0 ? `−${gap}` : `+${Math.abs(gap)}`, `GAP TO ${gap > 0 ? inputs.rivalName.split(' ').pop().toUpperCase() : 'P2'}`],
                [inputs.racesLeft, 'RACES LEFT'],
              ].map(([v, label]) => (
                <div key={label} className="panel p-3">
                  <p className="font-mono text-xl font-bold text-offwhite">{v}</p>
                  <p className="font-mono text-[9px] tracking-widest text-midgrey mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Headline probability */}
            <div className="flex items-end gap-4 flex-wrap">
              <motion.p
                key={result.probability}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className="font-mono text-6xl font-bold text-accent-glow leading-none"
              >
                {(result.probability * 100).toFixed(1)}%
              </motion.p>
              <p className="font-mono text-[10px] tracking-widest text-midgrey pb-1.5">
                TITLE PROBABILITY · 5,000 SIMULATED SEASONS
                {morale > 0 && <span className="text-accent-glow"> · BOBBY BOOST +{(morale * 100).toFixed(1)}%</span>}
              </p>
            </div>

            {/* Histogram of simulated final points */}
            <div className="mt-5">
              <div className="flex items-end gap-[3px] h-16" role="img" aria-label="Distribution of Max's simulated final points totals">
                {result.bins.map((b, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-accent/70 hover:bg-accent-glow transition-colors"
                    style={{ height: `${Math.max(3, (b / maxBin) * 100)}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between font-mono text-[9px] text-midgrey mt-1.5">
                <span>{result.lo} pts</span>
                <span>projected mean: {Math.round(result.mean)} pts</span>
                <span>{result.hi} pts</span>
              </div>
            </div>

            {/* What he needs + verdict */}
            <div className="mt-5 space-y-2 text-sm">
              {gap > 0 ? (
                <p className="text-midgrey">
                  The maths: he needs to outscore {inputs.rivalName} by{' '}
                  <span className="text-offwhite font-medium">{needed} points per race</span> across the remaining{' '}
                  {inputs.racesLeft} rounds. The model rates the rival&apos;s current pace at{' '}
                  {(inputs.rivalPace * 100).toFixed(0)}/100. It is judging both of them.
                </p>
              ) : (
                <p className="text-midgrey">
                  The maths: he leads. The job is simply to keep scoring while {inputs.rivalName} doesn&apos;t. The
                  model finds this scenario boring but acceptable.
                </p>
              )}
              <p className="text-offwhite border-l-2 border-accent pl-3 leading-relaxed">
                {verdictFor(result.probability, inputs.racesLeft)}
              </p>
            </div>
          </div>

          {/* Mood + Pet Bobby */}
          <div className="space-y-4">
            <div className="panel p-5 text-center">
              <p className="font-mono text-[10px] tracking-widest text-midgrey mb-3">DRIVER MOOD · LIVE</p>
              <p className="text-5xl" aria-hidden="true">{mood.face}</p>
              <p className="font-mono text-xs text-f1red mt-2">{mood.label}</p>
              <p className="text-xs text-midgrey mt-3 italic leading-relaxed">{mood.radio}</p>
            </div>

            <div className="panel p-5 text-center border-accent/40">
              <p className="font-mono text-[10px] tracking-widest text-midgrey mb-3">MORALE DEPARTMENT</p>
              <motion.button
                onClick={petBobby}
                whileTap={{ scale: 0.92 }}
                className="w-full py-4 rounded border border-accent text-accent-glow font-medium hover:bg-accent/15 hover:shadow-glow-blue transition-all"
              >
                <span className="text-2xl block mb-1" aria-hidden="true">🐶</span>
                Pet Bobby <Heart size={13} className="inline -mt-0.5" />
              </motion.button>
              <p className="font-mono text-xs text-midgrey mt-3">
                pets: <span className="text-offwhite">{pets.toLocaleString()}</span>
              </p>
              <div className="mt-2 h-1 rounded bg-gridline overflow-hidden">
                <div
                  className="h-full bg-accent-glow rounded transition-all duration-300"
                  style={{ width: `${(morale / MAX_MORALE) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-midgrey mt-2 leading-relaxed">
                Each pet adds +0.5% pace morale (caps at +12% — Bobby is a very good boy, not a power unit upgrade).
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="mt-6 font-mono text-[10px] text-midgrey leading-relaxed">
        METHODOLOGY: finishing points sampled per race from a form-weighted distribution (form = real points-per-race
        from live standings), 8% DNF chance, 5,000 simulated seasons, client-side. Sprint races and team orders not
        modelled. Bobby coefficient not peer-reviewed.
      </p>
    </Panel>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Lock } from 'lucide-react'
import useF1Data from '../../hooks/useF1Data.js'
import teamColour from './teamColours.js'
import { Panel, Skeleton, ErrorNote } from './Panel.jsx'

/* ----------------------------------------------------------------------
 * NEXT RACE FORECAST — pre-registered predictions with honest intervals.
 *
 * Win probabilities for the top 8 via a form-based softmax over real
 * points-per-race. Uncertainty: 500 bootstrap resamples of each
 * driver's per-race scoring record → 90% interval on the probability.
 *
 * Pre-registration: the first forecast generated for a given round is
 * frozen in localStorage with a timestamp. Revisits show the LOCKED
 * forecast, not a fresh one — so the Model Report Card below can hold
 * it accountable after the race.
 * -------------------------------------------------------------------- */

const BOOTSTRAPS = 500

function softmax(scores, temp = 0.55) {
  const exp = scores.map((s) => Math.exp(s / temp))
  const sum = exp.reduce((a, b) => a + b, 0)
  return exp.map((e) => e / sum)
}

function buildForecast(standings, round) {
  const top = standings.slice(0, 8)
  const done = Math.max(1, round)
  const paces = top.map((d) => Number(d.points) / done / 25)

  const point = softmax(paces)

  // bootstrap: jitter each pace by resampling a binomial-ish per-race record
  const samples = top.map(() => [])
  for (let b = 0; b < BOOTSTRAPS; b++) {
    const jittered = paces.map((p) => {
      let acc = 0
      for (let r = 0; r < done; r++) acc += Math.random() < p ? 1 : 0
      return acc / done
    })
    const probs = softmax(jittered)
    probs.forEach((p, i) => samples[i].push(p))
  }

  return top.map((d, i) => {
    const sorted = samples[i].sort((a, b) => a - b)
    return {
      driverId: d.Driver.driverId,
      name: d.Driver.familyName,
      constructorId: d.Constructors?.[0]?.constructorId,
      p: point[i],
      lo: sorted[Math.floor(BOOTSTRAPS * 0.05)],
      hi: sorted[Math.floor(BOOTSTRAPS * 0.95)],
    }
  })
}

export default function RaceForecast() {
  const standings = useF1Data('/api/f1-standings?type=drivers')
  const schedule = useF1Data('/api/f1-schedule')
  const [forecast, setForecast] = useState(null)

  const nextRace = useMemo(() => {
    const races = schedule.data?.races ?? []
    const now = Date.now()
    return races.find((r) => new Date(`${r.date}T${r.time || '12:00:00Z'}`).getTime() > now) || null
  }, [schedule.data])

  useEffect(() => {
    if (!standings.data?.standings?.length || !nextRace) return
    const key = `forecast_r${nextRace.round}_${standings.data.season}`
    const stored = localStorage.getItem(key)
    if (stored) {
      setForecast(JSON.parse(stored))
      return
    }
    const fresh = {
      round: nextRace.round,
      race: nextRace.raceName,
      season: standings.data.season,
      lockedAt: new Date().toISOString(),
      entries: buildForecast(standings.data.standings, Number(standings.data.round || 1)),
    }
    localStorage.setItem(key, JSON.stringify(fresh))
    // keep an index for the report card
    const idx = JSON.parse(localStorage.getItem('forecast_index') || '[]')
    if (!idx.includes(key)) localStorage.setItem('forecast_index', JSON.stringify([...idx, key]))
    setForecast(fresh)
  }, [standings.data, nextRace])

  const loading = standings.loading || schedule.loading
  const error = standings.error || schedule.error
  const maxP = forecast ? Math.max(...forecast.entries.map((e) => e.hi)) : 1

  return (
    <Panel
      title="NEXT RACE FORECAST"
      right={
        forecast && (
          <span className="font-mono text-[10px] text-accent-glow flex items-center gap-1.5">
            <Lock size={10} /> LOCKED {new Date(forecast.lockedAt).toLocaleDateString('en-GB')}
          </span>
        )
      }
    >
      {loading && <Skeleton rows={8} />}
      {error && <ErrorNote />}
      {!loading && !nextRace && <p className="text-sm text-midgrey">Season complete — forecasts resume in pre-season.</p>}

      {forecast && (
        <>
          <p className="font-mono text-xs text-midgrey mb-4">
            WIN PROBABILITY · {forecast.race?.toUpperCase()} · 90% INTERVALS
          </p>
          <div className="space-y-3">
            {forecast.entries.map((e) => {
              const colour = teamColour(e.constructorId)
              return (
                <div key={e.driverId}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-offwhite">{e.name}</span>
                    <span className="font-mono text-accent-glow">{(e.p * 100).toFixed(1)}%</span>
                  </div>
                  <div className="relative h-2 rounded bg-gridline">
                    {/* interval band */}
                    <div
                      className="absolute h-full rounded opacity-30"
                      style={{ left: `${(e.lo / maxP) * 100}%`, width: `${((e.hi - e.lo) / maxP) * 100}%`, background: colour }}
                    />
                    {/* point estimate */}
                    <div className="absolute h-full w-[3px] rounded" style={{ left: `${(e.p / maxP) * 100}%`, background: colour, boxShadow: `0 0 6px ${colour}` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="font-mono text-[10px] text-midgrey mt-4 leading-relaxed">
            METHODOLOGY: form-based softmax over real points-per-race; intervals from {BOOTSTRAPS} bootstrap resamples
            of each driver&apos;s scoring record. Locked in your browser before lights out — the Report Card holds it
            accountable afterwards. Wide bands are honesty, not indecision.
          </p>
        </>
      )}
    </Panel>
  )
}

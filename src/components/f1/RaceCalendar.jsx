import { useEffect, useMemo, useState } from 'react'
import useF1Data from '../../hooks/useF1Data.js'
import { Panel, Skeleton, ErrorNote } from './Panel.jsx'

const FLAGS = {
  Australia: '🇦🇺', Austria: '🇦🇹', Azerbaijan: '🇦🇿', Bahrain: '🇧🇭', Belgium: '🇧🇪',
  Brazil: '🇧🇷', Canada: '🇨🇦', China: '🇨🇳', France: '🇫🇷', Germany: '🇩🇪',
  Hungary: '🇭🇺', Italy: '🇮🇹', Japan: '🇯🇵', Mexico: '🇲🇽', Monaco: '🇲🇨',
  Netherlands: '🇳🇱', Qatar: '🇶🇦', 'Saudi Arabia': '🇸🇦', Singapore: '🇸🇬',
  Spain: '🇪🇸', UAE: '🇦🇪', UK: '🇬🇧', USA: '🇺🇸', 'United States': '🇺🇸',
}

function raceDate(race) {
  return new Date(`${race.date}T${race.time || '12:00:00Z'}`)
}

function Countdown({ target }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, target - now)
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {[
        [d, 'DAYS'], [h, 'HRS'], [m, 'MIN'], [s, 'SEC'],
      ].map(([v, label]) => (
        <div key={label} className="panel py-3 border-f1red/30">
          <p className="font-mono text-2xl font-bold text-f1red">{String(v).padStart(2, '0')}</p>
          <p className="font-mono text-[9px] tracking-widest text-midgrey mt-1">{label}</p>
        </div>
      ))}
    </div>
  )
}

export default function RaceCalendar() {
  const { data, loading, error } = useF1Data('/api/f1-schedule')

  const { races, nextRace } = useMemo(() => {
    const races = data?.races ?? []
    const now = Date.now()
    const nextRace = races.find((r) => raceDate(r).getTime() > now) || null
    return { races, nextRace }
  }, [data])

  return (
    <Panel
      title="RACE CALENDAR"
      right={nextRace && <span className="font-mono text-xs text-f1red animate-pulse">NEXT: {nextRace.raceName.toUpperCase()}</span>}
      className="lg:col-span-2"
    >
      {loading && <Skeleton rows={8} />}
      {error && <ErrorNote />}
      {races.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="max-h-80 overflow-y-auto pr-2 space-y-1.5">
            {races.map((r) => {
              const past = raceDate(r).getTime() < Date.now()
              const isNext = nextRace && r.round === nextRace.round
              return (
                <div
                  key={r.round}
                  className={`flex items-center justify-between rounded px-3 py-2 text-sm border ${
                    isNext
                      ? 'border-f1red/60 bg-f1red/10 shadow-glow-red'
                      : past
                        ? 'border-transparent text-midgrey/50'
                        : 'border-gridline text-offwhite'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-xs text-midgrey w-6 shrink-0">R{r.round}</span>
                    <span aria-hidden="true">{FLAGS[r.Circuit?.Location?.country] || '🏁'}</span>
                    <span className="truncate">{r.raceName}</span>
                  </span>
                  <span className="font-mono text-xs shrink-0 ml-2">
                    {new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              )
            })}
          </div>
          <div>
            <p className="font-mono text-xs tracking-widest text-midgrey mb-3">NEXT RACE COUNTDOWN</p>
            {nextRace ? (
              <>
                <p className="font-display font-semibold text-offwhite mb-1">{nextRace.raceName}</p>
                <p className="text-sm text-midgrey mb-4">
                  {nextRace.Circuit?.circuitName} · {nextRace.Circuit?.Location?.country}
                </p>
                <Countdown target={raceDate(nextRace).getTime()} />
              </>
            ) : (
              <p className="text-sm text-midgrey">Season complete. See you in pre-season testing. 🏁</p>
            )}
          </div>
        </div>
      )}
    </Panel>
  )
}

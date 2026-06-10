import useF1Data from '../../hooks/useF1Data.js'
import teamColour from './teamColours.js'
import { Panel, Skeleton, ErrorNote } from './Panel.jsx'

export default function LastRaceResults() {
  const { data, loading, error } = useF1Data('/api/f1-results')
  const race = data?.race
  const results = race?.Results ?? []
  const dnfs = results.filter((r) => r.positionText === 'R' || /retired|accident|collision|dnf/i.test(r.status || ''))

  return (
    <Panel
      title="LAST RACE RESULTS"
      right={race && <span className="font-mono text-xs text-midgrey">{race.raceName}</span>}
    >
      {loading && <Skeleton rows={10} />}
      {error && <ErrorNote />}
      {results.length > 0 && (
        <>
          <div className="space-y-1.5">
            {results.slice(0, 10).map((r) => {
              const colour = teamColour(r.Constructor?.constructorId)
              const fastest = r.FastestLap?.rank === '1'
              return (
                <div key={r.Driver.driverId} className="flex items-center justify-between text-sm py-1.5 border-b border-gridline/50">
                  <span className="flex items-center gap-2.5">
                    <span className="font-mono text-midgrey w-5">{r.position}</span>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: colour }} />
                    <span className="text-offwhite">{r.Driver.familyName}</span>
                    {fastest && <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">FL</span>}
                  </span>
                  <span className="font-mono text-xs text-midgrey">
                    {r.Time?.time || r.status} · {r.points} pts
                  </span>
                </div>
              )
            })}
          </div>
          {dnfs.length > 0 && (
            <p className="mt-4 font-mono text-xs text-f1red/80">
              DNF: {dnfs.map((d) => d.Driver.familyName).join(', ')}
            </p>
          )}
        </>
      )}
    </Panel>
  )
}

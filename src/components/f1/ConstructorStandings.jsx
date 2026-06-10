import useF1Data from '../../hooks/useF1Data.js'
import teamColour from './teamColours.js'
import { Panel, Skeleton, ErrorNote } from './Panel.jsx'

export default function ConstructorStandings() {
  const { data, loading, error } = useF1Data('/api/f1-standings?type=constructors')
  const max = data?.standings?.[0] ? Number(data.standings[0].points) || 1 : 1

  return (
    <Panel title="CONSTRUCTOR STANDINGS">
      {loading && <Skeleton rows={10} />}
      {error && <ErrorNote />}
      {data?.standings && (
        <div className="space-y-3">
          {data.standings.map((s) => {
            const colour = teamColour(s.Constructor.constructorId)
            const pct = Math.max(4, (Number(s.points) / max) * 100)
            return (
              <div key={s.Constructor.constructorId}>
                <div className="flex items-baseline justify-between text-sm mb-1">
                  <span className="text-offwhite">
                    <span className="font-mono text-midgrey mr-2">{s.position}</span>
                    {s.Constructor.name}
                  </span>
                  <span className="font-mono text-offwhite">{s.points}</span>
                </div>
                <div className="h-1.5 rounded bg-gridline overflow-hidden">
                  <div className="h-full rounded" style={{ width: `${pct}%`, background: colour }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Panel>
  )
}

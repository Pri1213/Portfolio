import useF1Data from '../../hooks/useF1Data.js'
import teamColour from './teamColours.js'
import { Panel, Skeleton, ErrorNote } from './Panel.jsx'

export default function DriverStandings() {
  const { data, loading, error } = useF1Data('/api/f1-standings?type=drivers')

  return (
    <Panel title="DRIVER STANDINGS" right={data?.season && <span className="font-mono text-xs text-f1red">{data.season}</span>}>
      {loading && <Skeleton rows={10} />}
      {error && <ErrorNote />}
      {data?.standings && (
        <table className="w-full text-sm">
          <thead>
            <tr className="font-mono text-[10px] tracking-widest text-midgrey text-left">
              <th className="pb-2 pr-2">P</th>
              <th className="pb-2">DRIVER</th>
              <th className="pb-2 text-right">PTS</th>
              <th className="pb-2 text-right pl-3">W</th>
            </tr>
          </thead>
          <tbody>
            {data.standings.slice(0, 10).map((s) => {
              const colour = teamColour(s.Constructors?.[0]?.constructorId)
              return (
                <tr key={s.Driver.driverId} className="border-t border-gridline/60">
                  <td className="py-2 pr-2"><span className="pos-box">{s.position}</span></td>
                  <td className="py-2">
                    <span
                      className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-offwhite"
                      style={{ border: `1px solid ${colour}55`, background: `${colour}14` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: colour }} />
                      {s.Driver.givenName} {s.Driver.familyName}
                    </span>
                  </td>
                  <td className="py-2 text-right font-mono text-offwhite">{s.points}</td>
                  <td className="py-2 text-right pl-3 font-mono text-midgrey">{s.wins}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </Panel>
  )
}

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import useF1Data from '../../hooks/useF1Data.js'
import { Panel, Skeleton, ErrorNote } from './Panel.jsx'

const LINE_COLOURS = ['#4A7FD4', '#E8003D', '#FF8000', '#27F4D2', '#52E252']

export default function ChampionshipChart() {
  const { data, loading, error } = useF1Data('/api/f1-progression')

  return (
    <Panel title="CHAMPIONSHIP BATTLE" className="lg:col-span-2">
      {loading && <Skeleton rows={7} />}
      {error && <ErrorNote />}
      {data?.chart?.length > 0 && (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.chart} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="#1E1E2E" strokeDasharray="3 3" />
              <XAxis
                dataKey="round"
                stroke="#8888A0"
                tick={{ fontSize: 11, fontFamily: 'Roboto Mono' }}
                tickFormatter={(r) => `R${r}`}
              />
              <YAxis stroke="#8888A0" tick={{ fontSize: 11, fontFamily: 'Roboto Mono' }} />
              <Tooltip
                contentStyle={{
                  background: '#111118',
                  border: '1px solid #1E1E2E',
                  borderRadius: 8,
                  fontFamily: 'Roboto Mono',
                  fontSize: 12,
                }}
                labelFormatter={(r, payload) => payload?.[0]?.payload?.race || `Round ${r}`}
              />
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Titillium Web' }} />
              {data.drivers.map((d, i) => (
                <Line
                  key={d}
                  type="monotone"
                  dataKey={d}
                  stroke={LINE_COLOURS[i % LINE_COLOURS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {data?.chart?.length === 0 && (
        <p className="text-sm text-midgrey">No race results yet this season — lights out soon.</p>
      )}
    </Panel>
  )
}

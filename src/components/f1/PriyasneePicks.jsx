import { Panel } from './Panel.jsx'

// Opinions, not data. Updated by the strategist herself.
const PICKS = [
  { label: "This season I'm backing", value: 'Max Verstappen & Kimi Antonelli 🏎️' },
  { label: 'The veteran pick', value: 'Max — because betting against him is a data quality issue' },
  { label: 'The rookie-era pick', value: 'Kimi — the growth trendline speaks for itself' },
  { label: 'Most exciting battle', value: 'Experience vs youth. The model says watch both.' },
]

export default function PriyasneePicks() {
  return (
    <Panel title="PRIYASNEE'S PICKS" right={<span className="font-mono text-[10px] text-midgrey">100% BIASED</span>}>
      <div className="space-y-4">
        {PICKS.map((p) => (
          <div key={p.label}>
            <p className="font-mono text-[10px] tracking-widest text-midgrey">{p.label.toUpperCase()}</p>
            <p className="text-offwhite mt-1">{p.value}</p>
          </div>
        ))}
        <p className="text-xs text-midgrey pt-2 border-t border-gridline">
          The standings above are live — fetched through my own serverless API with caching. The picks are
          hardcoded, like all the best convictions.
        </p>
      </div>
    </Panel>
  )
}

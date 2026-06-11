import { useMemo } from 'react'
import { CheckCircle2, XCircle, FlaskConical } from 'lucide-react'
import useF1Data from '../../hooks/useF1Data.js'
import { Panel, Skeleton } from './Panel.jsx'

/* ----------------------------------------------------------------------
 * MODEL REPORT CARD — public accountability for the forecasts.
 *
 * Reads every forecast locked by the panel above, fetches what actually
 * happened, and scores the model: hit/miss on the modal pick plus a
 * running Brier score (mean squared error of the win probabilities —
 * 0 is clairvoyant, 0.25 is coin-flip territory for binary outcomes).
 *
 * Honest caveat shown in the UI: forecasts are locked per-browser
 * (localStorage), so this grades the forecasts YOU witnessed being made.
 * -------------------------------------------------------------------- */

export default function ModelReportCard() {
  const results = useF1Data('/api/f1-results')
  const progression = useF1Data('/api/f1-progression')

  const report = useMemo(() => {
    const idx = JSON.parse(localStorage.getItem('forecast_index') || '[]')
    const forecasts = idx
      .map((k) => {
        try { return JSON.parse(localStorage.getItem(k)) } catch { return null }
      })
      .filter(Boolean)

    const lastRace = results.data?.race
    if (!forecasts.length) return { rows: [], pending: 0 }

    const rows = []
    let pending = 0
    for (const f of forecasts) {
      // we can only grade rounds that have completed — match by round number
      if (lastRace && Number(f.round) <= Number(lastRace.round)) {
        // winner of THAT round: only reliably known for the most recent race
        // via this endpoint, so grade rounds equal to lastRace.round, and
        // mark older ones gradeable only if they match.
        if (Number(f.round) === Number(lastRace.round)) {
          const winner = lastRace.Results?.[0]?.Driver
          const pick = [...f.entries].sort((a, b) => b.p - a.p)[0]
          const hit = winner && pick.driverId === winner.driverId
          // Brier across the forecast's drivers (winner=1, rest=0)
          const brier =
            f.entries.reduce((acc, e) => {
              const outcome = winner && e.driverId === winner.driverId ? 1 : 0
              return acc + (e.p - outcome) ** 2
            }, 0) / f.entries.length
          rows.push({ race: f.race, pick: pick.name, pickP: pick.p, winner: winner?.familyName ?? '—', hit, brier })
        }
      } else {
        pending++
      }
    }
    return { rows, pending }
  }, [results.data, progression.data])

  const avgBrier = report.rows.length
    ? (report.rows.reduce((a, r) => a + r.brier, 0) / report.rows.length).toFixed(3)
    : null

  return (
    <Panel title="MODEL REPORT CARD" right={<span className="font-mono text-[10px] text-midgrey">MODEL vs REALITY</span>}>
      {results.loading && <Skeleton rows={4} />}

      {!results.loading && report.rows.length === 0 && (
        <div className="text-sm text-midgrey space-y-3">
          <p className="flex items-start gap-2">
            <FlaskConical size={16} className="text-accent-glow shrink-0 mt-0.5" />
            <span>
              No graded predictions yet{report.pending > 0 ? ` — ${report.pending} forecast${report.pending > 1 ? 's' : ''} locked and awaiting race day` : ''}.
              Visit before a race to lock a forecast; come back after and this panel grades it. The model accepts
              full responsibility in advance.
            </span>
          </p>
          <p className="font-mono text-[10px] leading-relaxed">
            SCORING: hit/miss on the modal pick + Brier score (mean squared error of win probabilities). 0.000 =
            clairvoyant. Forecasts are locked per-browser, so you&apos;re grading predictions you witnessed being made.
          </p>
        </div>
      )}

      {report.rows.length > 0 && (
        <>
          <div className="space-y-3">
            {report.rows.map((r) => (
              <div key={r.race} className="flex items-center justify-between text-sm border-b border-gridline/60 pb-2">
                <div>
                  <p className="text-offwhite">{r.race}</p>
                  <p className="font-mono text-xs text-midgrey">
                    picked {r.pick} ({(r.pickP * 100).toFixed(0)}%) · winner: {r.winner}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-midgrey">brier {r.brier.toFixed(3)}</span>
                  {r.hit
                    ? <CheckCircle2 size={18} className="text-green-400" />
                    : <XCircle size={18} className="text-f1red" />}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <p className="font-mono text-3xl font-bold text-accent-glow">{avgBrier}</p>
            <p className="font-mono text-[10px] tracking-widest text-midgrey">RUNNING BRIER SCORE (LOWER = BETTER · 0.25 ≈ COIN FLIP)</p>
          </div>
        </>
      )}
    </Panel>
  )
}

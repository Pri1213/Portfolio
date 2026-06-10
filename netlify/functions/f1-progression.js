// GET /api/f1-progression — cumulative championship points per round
// for the top 5 drivers. One upstream call: all season results, then
// the accumulation is computed here (cheaper and faster than a
// round-by-round fan-out).
import { F1_BASE, cachedFetch, ok, fail } from './_shared.js'

export const handler = async () => {
  try {
    const data = await cachedFetch(`${F1_BASE}/current/results.json?limit=1000`, 60 * 60 * 1000)
    const races = data?.MRData?.RaceTable?.Races ?? []

    const totals = new Map() // driverId -> { name, points }
    const series = new Map() // driverId -> [{ round, raceName, points }]

    for (const race of races) {
      const round = Number(race.round)
      for (const result of race.Results ?? []) {
        const id = result.Driver.driverId
        const name = result.Driver.familyName
        const pts = Number(result.points || 0)
        const prev = totals.get(id)?.points ?? 0
        totals.set(id, { name, points: prev + pts })
        if (!series.has(id)) series.set(id, [])
        series.get(id).push({ round, race: race.raceName, points: prev + pts })
      }
    }

    const top5 = [...totals.entries()]
      .sort((a, b) => b[1].points - a[1].points)
      .slice(0, 5)

    const rounds = races.map((r) => ({ round: Number(r.round), race: r.raceName }))
    const chart = rounds.map(({ round, race }) => {
      const point = { round, race }
      for (const [id, { name }] of top5) {
        const entry = series.get(id)?.filter((p) => p.round <= round).pop()
        point[name] = entry ? entry.points : 0
      }
      return point
    })

    return ok({
      drivers: top5.map(([, { name }]) => name),
      chart,
    })
  } catch (err) {
    return fail(err)
  }
}

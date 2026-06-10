// GET /api/f1-results — most recent race results
import { F1_BASE, cachedFetch, ok, fail } from './_shared.js'

export const handler = async () => {
  try {
    const data = await cachedFetch(`${F1_BASE}/current/last/results.json`, 30 * 60 * 1000)
    const race = data?.MRData?.RaceTable?.Races?.[0] ?? null
    return ok({ race }, 1800)
  } catch (err) {
    return fail(err)
  }
}
